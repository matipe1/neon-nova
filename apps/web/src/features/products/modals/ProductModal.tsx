import { useState, useEffect } from 'react';
import type { Product, Filament, Supply, PrintComponent, SupplyComponent } from '../../../../types/domain';
import { ImageUploader } from '../../../ui/ImageUploader';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  editingProduct?: Product | null;
  availableFilaments?: Filament[];
  availableSupplies?: Supply[];
}

export interface ExtendedPrintComponent {
  name: string;
  filament_id: string; // '' representa 'Sin vincular (Costo Genérico)'
  cost_per_kg: number;
  hours: number;
  minutes: number;
  grams_required: number;
}

export const ProductModal = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  availableFilaments = [],
  availableSupplies = [],
}: ProductModalProps) => {
  // --- Estados Principales del Formulario ---
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('Sin categoría');
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [minStockAlert, setMinStockAlert] = useState<number>(0);
  const [unitCost, setUnitCost] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState('');

  // --- Lista de Componentes / Piezas 3D (con Vinculación de Filamento Opcional) ---
  const [selectedComponents, setSelectedComponents] = useState<ExtendedPrintComponent[]>([
    {
      name: 'Pieza 1',
      filament_id: '',
      cost_per_kg: 18000,
      hours: 2,
      minutes: 30,
      grams_required: 120,
    },
  ]);

  // --- Lista de Insumos Vinculados del Inventario ---
  const [selectedSupplies, setSelectedSupplies] = useState<SupplyComponent[]>([]);

  // --- Estado del Drawer Lateral de la Calculadora ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Campos de Configuración de la Impresora en la Calculadora
  const [calcPrinterModel, setCalcPrinterModel] = useState('Bambu Lab A1 (95 W)');
  const [calcKwhCost, setCalcKwhCost] = useState<number>(120);
  const calcWatts = 95;
  const [calcErrorMargin, setCalcErrorMargin] = useState<number>(5);
  const [calcProfitMultiplier, setCalcProfitMultiplier] = useState<number>(3); // x3 por defecto

  // --- Estado del Toast de Notificación ---
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description || '');
      setCategoryId(editingProduct.category_id || 'Sin categoría');
      setStockQuantity(editingProduct.stock_quantity);
      setMinStockAlert(editingProduct.min_stock_alert ?? 0);
      setUnitCost(editingProduct.unit_cost);
      setSalePrice(editingProduct.sale_price);
      setImages(editingProduct.images || []);
      setTagsInput(editingProduct.tags ? editingProduct.tags.join(', ') : '');
      setSelectedSupplies(editingProduct.supplies || []);

      if (editingProduct.components && editingProduct.components.length > 0) {
        const mapped = editingProduct.components.map((c) => {
          const matchedFil = availableFilaments.find((f) => f.id === c.filament_id);
          const costPerKg = matchedFil ? matchedFil.cost_per_gram * 1000 : 18000;
          const totalHours = c.print_time_hours || 0;
          const hrs = Math.floor(totalHours);
          const mins = Math.round((totalHours - hrs) * 60);

          return {
            name: c.name || 'Pieza',
            filament_id: c.filament_id || '',
            cost_per_kg: costPerKg,
            hours: hrs,
            minutes: mins,
            grams_required: c.grams_required || 0,
          };
        });
        setSelectedComponents(mapped);
      } else {
        setSelectedComponents([
          {
            name: 'Pieza 1',
            filament_id: '',
            cost_per_kg: 18000,
            hours: 2,
            minutes: 30,
            grams_required: 120,
          },
        ]);
      }
    } else {
      setName('');
      setDescription('');
      setCategoryId('Sin categoría');
      setStockQuantity(0);
      setMinStockAlert(0);
      setUnitCost(0);
      setSalePrice(0);
      setImages([]);
      setTagsInput('');
      setSelectedSupplies([]);
      setSelectedComponents([
        {
          name: 'Pieza 1',
          filament_id: '',
          cost_per_kg: 18000,
          hours: 2,
          minutes: 30,
          grams_required: 120,
        },
      ]);
    }
  }, [editingProduct, isOpen]);

  // Handlers para Componentes Impresos / Piezas 3D
  const handleAddComponent = () => {
    setSelectedComponents((prev) => [
      ...prev,
      {
        name: `Pieza ${prev.length + 1}`,
        filament_id: '',
        cost_per_kg: 18000,
        hours: 1,
        minutes: 0,
        grams_required: 50,
      },
    ]);
  };

  const handleRemoveComponent = (index: number) => {
    if (selectedComponents.length <= 1) return;
    setSelectedComponents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateComponent = (
    index: number,
    field: keyof ExtendedPrintComponent,
    value: any
  ) => {
    setSelectedComponents((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        const updated = { ...item, [field]: value };

        // Autocompletado inteligente de $/kg al cambiar de filamento
        if (field === 'filament_id') {
          if (value !== '') {
            const matchedFil = availableFilaments.find((f) => f.id === value);
            if (matchedFil) {
              updated.cost_per_kg = matchedFil.cost_per_gram * 1000;
            }
          }
        }

        return updated;
      })
    );
  };

  // Handlers para Insumos vinculados
  const handleAddSupply = () => {
    const defaultSupplyId = availableSupplies[0]?.id || '';
    setSelectedSupplies((prev) => [
      ...prev,
      { supply_id: defaultSupplyId, quantity_required: 1 },
    ]);
  };

  const handleRemoveSupply = (index: number) => {
    setSelectedSupplies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSupply = (
    index: number,
    field: 'supply_id' | 'quantity_required',
    value: any
  ) => {
    setSelectedSupplies((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  if (!isOpen) return null;

  // --- Lógica del Cálculo Dinámico en el Drawer Lateral ---
  const handleCalculateAndApply = () => {
    // 1. Costo Total de Filamento sumando todos los componentes / colores
    const totalFilamentCost = selectedComponents.reduce((acc, comp) => {
      const compCost = (comp.grams_required / 1000) * (comp.cost_per_kg || 0);
      return acc + compCost;
    }, 0);

    // 2. Horas Totales de Impresión acumuladas
    const totalPrintHours = selectedComponents.reduce((acc, comp) => {
      return acc + (comp.hours || 0) + (comp.minutes || 0) / 60;
    }, 0);

    // 3. Costo Total de Energía = ((Watts / 1000) * Horas Totales) * $/kWh
    const energyCost = (calcWatts / 1000) * totalPrintHours * calcKwhCost;

    // 4. Costo Total de Insumos Reales del Inventario
    const suppliesTotalCost = selectedSupplies.reduce((acc, item) => {
      const sup = availableSupplies.find((s) => s.id === item.supply_id);
      const unitCost = sup ? sup.unit_cost : 0;
      return acc + unitCost * (item.quantity_required || 0);
    }, 0);

    // 5. Costo Total de Producción con Margen de Error
    const rawCost = totalFilamentCost + energyCost + suppliesTotalCost;
    const totalCost = Math.round(rawCost * (1 + calcErrorMargin / 100));

    // 6. Precio de Venta Sugerido = Costo * Multiplicador de Ganancia
    const suggestedPrice = Math.round(totalCost * calcProfitMultiplier);

    // Actualizar campos del formulario principal
    setUnitCost(totalCost);
    setSalePrice(suggestedPrice);

    // Cerrar Drawer y Mostrar Toast de Confirmación
    setIsDrawerOpen(false);
    setShowToast(true);

    // Auto ocultar toast tras 4 segundos
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tagsArr = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Mapear componentes para persistencia
    const componentsToSave: PrintComponent[] = selectedComponents.map((c) => ({
      name: c.name,
      filament_id: c.filament_id,
      grams_required: Number(c.grams_required) || 0,
      print_time_hours: (Number(c.hours) || 0) + (Number(c.minutes) || 0) / 60,
    }));

    const productToSave: Product = {
      id: editingProduct ? editingProduct.id : crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      category_id: categoryId.trim(),
      stock_quantity: Number(stockQuantity) || 0,
      min_stock_alert: Number(minStockAlert) || 0,
      unit_cost: Number(unitCost) || 0,
      sale_price: Number(salePrice) || 0,
      tags: tagsArr,
      images,
      components: componentsToSave,
      supplies: selectedSupplies,
      created_at: editingProduct ? editingProduct.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave(productToSave);
    onClose();
  };

  return (
    <div style={backdropStyle}>
      <div style={modalContainerStyle}>
        {/* Header Principal */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 4px 0', color: '#ffffff' }}>
            {editingProduct ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <p style={{ color: '#a1a1aa', margin: 0, fontSize: '14px' }}>
            Cargá los datos de la pieza para tu catálogo.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Datos del producto */}
          <div style={cardSectionStyle}>
            <h3 style={cardTitleStyle}>Datos del producto</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>NOMBRE DEL PRODUCTO *</label>
                <input
                  type="text"
                  placeholder="Ej: Soporte GoPro"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>CATEGORÍA</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={inputStyle}
                >
                  <option value="Sin categoría">Sin categoría</option>
                  <option value="Carteles Neón">Carteles Neón</option>
                  <option value="Lámparas 3D">Lámparas 3D</option>
                  <option value="Mates & Accesorios">Mates & Accesorios</option>
                  <option value="General">General</option>
                </select>
              </div>

              {/* Subida e inspección de imágenes cuadradas */}
              <div>
                <ImageUploader images={images} onChange={setImages} maxImages={3} />
              </div>

              <div>
                <label style={labelStyle}>DESCRIPCIÓN (OPCIONAL)</label>
                <textarea
                  placeholder="Color, material, acabado..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Costo y precio (con botón Calcular Costo) */}
          <div style={cardSectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={cardTitleStyle}>Costo y precio</h3>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                style={btnCalculateCostStyle}
              >
                📊 Calcular costo
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>TE CUESTA (ARS)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={unitCost || ''}
                  onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>PRECIO SUGERIDO (ARS)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={salePrice || ''}
                  onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Stock terminado */}
          <div style={cardSectionStyle}>
            <h3 style={cardTitleStyle}>Stock terminado</h3>
            <p style={{ color: '#a1a1aa', fontSize: '13px', margin: '-8px 0 16px 0', lineHeight: 1.4 }}>
              Si ya tenés unidades hechas, cargá cuántas. Al vender este producto se descuenta de acá en vez de descontar filamento.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>UNIDADES DISPONIBLES</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={stockQuantity || ''}
                  onChange={(e) => setStockQuantity(parseFloat(e.target.value) || 0)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>AVISAR CUANDO QUEDEN</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Sin aviso"
                  value={minStockAlert || ''}
                  onChange={(e) => setMinStockAlert(parseFloat(e.target.value) || 0)}
                  style={inputStyle}
                />
              </div>
            </div>

            <span style={{ fontSize: '12px', color: '#71717a', display: 'block', lineHeight: 1.4 }}>
              Si dejás el aviso vacío o en 0, solo te avisamos cuando se agote. Cargá un número para que te avise antes (ej: 10 para llaveros, 1 para piezas grandes).
            </span>
          </div>

          {/* Footer de Botones */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} style={btnCancelStyle}>
              Cancelar
            </button>
            <button type="submit" style={btnCreateProductStyle}>
              {editingProduct ? 'Guardar producto' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>

      {/* --- SIDE DRAWER LATERAL DE CALCULADORA DE COSTO --- */}
      {isDrawerOpen && (
        <div style={drawerBackdropStyle}>
          <div style={drawerContainerStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Calcular costo
              </h3>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                style={{ background: 'none', border: 'none', color: '#a1a1aa', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>NOMBRE DE LA PIEZA *</label>
                <input
                  type="text"
                  placeholder="Soporte GoPro, llavero personalizado..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <span style={{ fontSize: '11px', fontWeight: 700, color: '#a855f7', letterSpacing: '0.05em' }}>
                CONFIGURACIÓN DE LA IMPRESORA
              </span>

              <div>
                <label style={labelStyle}>MODELO DE IMPRESORA</label>
                <select
                  value={calcPrinterModel}
                  onChange={(e) => setCalcPrinterModel(e.target.value)}
                  style={inputStyle}
                >
                  <option value="Bambu Lab A1 (95 W)">Bambu Lab A1 (95 W)</option>
                  <option value="Creality Ender 3 V2 (150 W)">Creality Ender 3 V2 (150 W)</option>
                  <option value="Artillery Genius (110 W)">Artillery Genius (110 W)</option>
                  <option value="Personalizado">Otro / Personalizado</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>KWH $</label>
                  <input
                    type="number"
                    value={calcKwhCost}
                    onChange={(e) => setCalcKwhCost(parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>MARGEN ERROR %</label>
                  <input
                    type="number"
                    value={calcErrorMargin}
                    onChange={(e) => setCalcErrorMargin(parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Seccion: Componentes Impresos / Colores */}
              <div
                style={{
                  backgroundColor: '#141416',
                  borderRadius: '10px',
                  padding: '12px',
                  border: '1px solid #27272a',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#a855f7', letterSpacing: '0.05em' }}>
                    🧵 COMPONENTES IMPRESOS / COLORES
                  </span>
                  <button
                    type="button"
                    onClick={handleAddComponent}
                    style={{
                      backgroundColor: '#27272a',
                      color: '#cbd5e1',
                      border: '1px solid #3f3f46',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    + Agregar Componente
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedComponents.map((comp, idx) => {
                    const compCost = Math.round(((comp.grams_required || 0) / 1000) * (comp.cost_per_kg || 0));

                    return (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#09090b',
                          borderRadius: '8px',
                          padding: '10px',
                          border: '1px solid #27272a',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="Nombre del componente/color"
                            value={comp.name}
                            onChange={(e) => handleUpdateComponent(idx, 'name', e.target.value)}
                            style={{ ...inputStyle, padding: '6px 8px', fontSize: '12px', fontWeight: 700 }}
                          />
                          {selectedComponents.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveComponent(idx)}
                              style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {/* Selector de Filamento del Inventario o Sin Vincular */}
                        <div>
                          <label style={{ ...labelStyle, fontSize: '10px' }}>FILAMENTO</label>
                          <select
                            value={comp.filament_id}
                            onChange={(e) => handleUpdateComponent(idx, 'filament_id', e.target.value)}
                            style={{ ...inputStyle, padding: '6px 8px', fontSize: '12px' }}
                          >
                            <option value="">📌 Sin vincular (Costo Genérico)</option>
                            {availableFilaments.map((f) => (
                              <option key={f.id} value={f.id}>
                                🧵 {f.brand} {f.type} {f.color} (${(f.cost_per_gram * 1000).toLocaleString('es-AR')}/kg)
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Campos de Costo $/kg, Tiempos y Gramos */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px' }}>
                          <div>
                            <label style={{ ...labelStyle, fontSize: '9px' }}>$/KG</label>
                            <input
                              type="number"
                              value={comp.cost_per_kg || ''}
                              onChange={(e) =>
                                handleUpdateComponent(idx, 'cost_per_kg', parseFloat(e.target.value) || 0)
                              }
                              style={{ ...inputStyle, padding: '6px', fontSize: '11px' }}
                            />
                          </div>

                          <div>
                            <label style={{ ...labelStyle, fontSize: '9px' }}>HORAS</label>
                            <input
                              type="number"
                              value={comp.hours || ''}
                              onChange={(e) =>
                                handleUpdateComponent(idx, 'hours', parseFloat(e.target.value) || 0)
                              }
                              style={{ ...inputStyle, padding: '6px', fontSize: '11px' }}
                            />
                          </div>

                          <div>
                            <label style={{ ...labelStyle, fontSize: '9px' }}>MINS</label>
                            <input
                              type="number"
                              value={comp.minutes || ''}
                              onChange={(e) =>
                                handleUpdateComponent(idx, 'minutes', parseFloat(e.target.value) || 0)
                              }
                              style={{ ...inputStyle, padding: '6px', fontSize: '11px' }}
                            />
                          </div>

                          <div>
                            <label style={{ ...labelStyle, fontSize: '9px' }}>GRAMOS</label>
                            <input
                              type="number"
                              value={comp.grams_required || ''}
                              onChange={(e) =>
                                handleUpdateComponent(idx, 'grams_required', parseFloat(e.target.value) || 0)
                              }
                              style={{ ...inputStyle, padding: '6px', fontSize: '11px' }}
                            />
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 700 }}>
                            Subtotal Filamento: ${compCost.toLocaleString('es-AR')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Seccion: Insumos Vinculados del Inventario */}
              <div
                style={{
                  backgroundColor: '#141416',
                  borderRadius: '10px',
                  padding: '12px',
                  border: '1px solid #27272a',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#a855f7', letterSpacing: '0.05em' }}>
                    🔩 INSUMOS DE INVENTARIO
                  </span>
                  <button
                    type="button"
                    onClick={handleAddSupply}
                    style={{
                      backgroundColor: '#27272a',
                      color: '#cbd5e1',
                      border: '1px solid #3f3f46',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    + Agregar Insumo
                  </button>
                </div>

                {selectedSupplies.length === 0 ? (
                  <span style={{ fontSize: '12px', color: '#71717a', fontStyle: 'italic', display: 'block' }}>
                    Sin insumos vinculados. Haz click en "+ Agregar Insumo".
                  </span>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedSupplies.map((item, idx) => {
                      const matchedSup = availableSupplies.find((s) => s.id === item.supply_id);
                      const subtotal = (matchedSup ? matchedSup.unit_cost : 0) * (item.quantity_required || 0);

                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr auto auto',
                            gap: '6px',
                            alignItems: 'center',
                          }}
                        >
                          <select
                            value={item.supply_id}
                            onChange={(e) => handleUpdateSupply(idx, 'supply_id', e.target.value)}
                            style={{ ...inputStyle, padding: '8px', fontSize: '12px' }}
                          >
                            {availableSupplies.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name} (${s.unit_cost.toLocaleString('es-AR')})
                              </option>
                            ))}
                          </select>

                          <input
                            type="number"
                            min="1"
                            placeholder="Cant"
                            value={item.quantity_required || ''}
                            onChange={(e) =>
                              handleUpdateSupply(idx, 'quantity_required', parseFloat(e.target.value) || 1)
                            }
                            style={{ ...inputStyle, padding: '8px', fontSize: '12px' }}
                          />

                          <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 700 }}>
                            ${subtotal.toLocaleString('es-AR')}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveSupply(idx)}
                            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <span style={{ fontSize: '11px', fontWeight: 700, color: '#a855f7', letterSpacing: '0.05em' }}>
                GANANCIA
              </span>

              <div>
                <label style={labelStyle}>MULTIPLICADOR DE GANANCIA (EJ: 3 = 300%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={calcProfitMultiplier}
                  onChange={(e) => setCalcProfitMultiplier(parseFloat(e.target.value) || 1)}
                  style={inputStyle}
                />
              </div>

              <button
                type="button"
                onClick={handleCalculateAndApply}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '12px',
                }}
              >
                ✓ Aplicar Cálculo al Producto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TOAST DE NOTIFICACIÓN INFERIOR DERECHO --- */}
      {showToast && (
        <div style={toastStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#22c55e', fontSize: '16px', fontWeight: 900 }}>✓</span>
            <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 600 }}>
              Costo y precio actualizados con la calculadora.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#71717a',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '0 4px',
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

// --- Estilos CSS ---
const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)',
};

const modalContainerStyle: React.CSSProperties = {
  backgroundColor: '#09090b',
  border: '1px solid #27272a',
  borderRadius: '16px',
  padding: '32px',
  width: '100%',
  maxWidth: '720px',
  maxHeight: '92vh',
  overflowY: 'auto',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
  boxSizing: 'border-box',
};

const cardSectionStyle: React.CSSProperties = {
  backgroundColor: '#141416',
  borderRadius: '12px',
  padding: '20px',
  border: '1px solid #27272a',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 800,
  margin: '0 0 16px 0',
  color: '#ffffff',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  color: '#a1a1aa',
  marginBottom: '6px',
  letterSpacing: '0.05em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  backgroundColor: '#18181b',
  border: '1px solid #27272a',
  color: '#ffffff',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
};

const btnCalculateCostStyle: React.CSSProperties = {
  backgroundColor: '#18181b',
  color: '#ffffff',
  border: '1px solid #3f3f46',
  borderRadius: '8px',
  padding: '8px 14px',
  fontSize: '13px',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const btnCancelStyle: React.CSSProperties = {
  backgroundColor: '#18181b',
  color: '#ffffff',
  border: '1px solid #27272a',
  borderRadius: '8px',
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
};

const btnCreateProductStyle: React.CSSProperties = {
  backgroundColor: '#ef4444',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 24px',
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
};

const drawerBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  zIndex: 1100,
  display: 'flex',
  justifyContent: 'flex-end',
};

const drawerContainerStyle: React.CSSProperties = {
  backgroundColor: '#09090b',
  width: '100%',
  maxWidth: '460px',
  height: '100%',
  padding: '24px',
  boxSizing: 'border-box',
  overflowY: 'auto',
  borderLeft: '1px solid #27272a',
  boxShadow: '-10px 0 25px rgba(0,0,0,0.5)',
};

const toastStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  backgroundColor: '#141416',
  border: '1px solid #22c55e',
  borderRadius: '10px',
  padding: '12px 18px',
  zIndex: 1200,
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
};

export default ProductModal;
