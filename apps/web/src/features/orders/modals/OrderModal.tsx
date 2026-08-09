import { useState, useEffect } from 'react';
import type { Order, OrderItem, OrderStatus, Product, Filament, Supply } from '../../../../types/domain';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  editingOrder?: Order | null;
  availableProducts?: Product[];
  availableFilaments?: Filament[];
  availableSupplies?: Supply[];
}

export const OrderModal = ({
  isOpen,
  onClose,
  onSave,
  editingOrder,
  availableProducts = [],
}: OrderModalProps) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [status, setStatus] = useState<OrderStatus>('BUDGETED');
  const [items, setItems] = useState<OrderItem[]>([]);

  // --- Estado del Drawer de Calculadora Embebida para Nuevas Piezas ---
  const [isCalcDrawerOpen, setIsCalcDrawerOpen] = useState(false);
  const [calcItemName, setCalcItemName] = useState('');
  const [calcFilamentCostKg, setCalcFilamentCostKg] = useState<number>(18000);
  const [calcKwhCost, setCalcKwhCost] = useState<number>(120);
  const calcWatts = 95;
  const [calcHours, setCalcHours] = useState<number>(2);
  const [calcMinutes, setCalcMinutes] = useState<number>(0);
  const [calcGrams, setCalcGrams] = useState<number>(100);
  const [calcSuppliesCost, setCalcSuppliesCost] = useState<number>(0);
  const [calcErrorMargin, setCalcErrorMargin] = useState<number>(5);
  const [calcProfitMultiplier, setCalcProfitMultiplier] = useState<number>(3);

  useEffect(() => {
    if (editingOrder) {
      setCustomerName(editingOrder.customer_name);
      setCustomerPhone(editingOrder.customer_phone || '');
      setCustomerNotes(editingOrder.customer_notes || '');
      setStatus(editingOrder.status);
      setItems(editingOrder.items || []);
    } else {
      setCustomerName('');
      setCustomerPhone('');
      setCustomerNotes('');
      setStatus('BUDGETED');
      setItems([]);
    }
  }, [editingOrder, isOpen]);

  if (!isOpen) return null;

  // Handlers para la lista de ítems del pedido
  const handleAddCatalogProduct = () => {
    const defaultProduct = availableProducts[0];
    const newItem: OrderItem = {
      id: crypto.randomUUID(),
      order_id: editingOrder ? editingOrder.id : '',
      product_id: defaultProduct?.id || '',
      item_name: defaultProduct ? defaultProduct.name : 'Producto Genérico',
      quantity: 1,
      unit_cost: defaultProduct ? defaultProduct.unit_cost : 0,
      unit_sale_price: defaultProduct ? defaultProduct.sale_price : 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleUpdateItemProduct = (index: number, productId: string) => {
    const prod = availableProducts.find((p) => p.id === productId);
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        return {
          ...item,
          product_id: productId,
          item_name: prod ? prod.name : item.item_name,
          unit_cost: prod ? prod.unit_cost : item.unit_cost,
          unit_sale_price: prod ? prod.sale_price : item.unit_sale_price,
        };
      })
    );
  };

  const handleUpdateItemField = (index: number, field: keyof OrderItem, value: any) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Handler para agregar nueva pieza cotizada con la calculadora embebida
  const handleAddCalculatedPieceToOrder = () => {
    if (!calcItemName.trim()) {
      alert('Por favor ingresa el nombre de la pieza.');
      return;
    }

    const filamentCost = (calcGrams / 1000) * calcFilamentCostKg;
    const printHours = calcHours + calcMinutes / 60;
    const energyCost = (calcWatts / 1000) * printHours * calcKwhCost;
    const rawCost = filamentCost + energyCost + calcSuppliesCost;
    const calculatedUnitCost = Math.round(rawCost * (1 + calcErrorMargin / 100));
    const calculatedSalePrice = Math.round(calculatedUnitCost * calcProfitMultiplier);

    const newItem: OrderItem = {
      id: crypto.randomUUID(),
      order_id: editingOrder ? editingOrder.id : '',
      item_name: calcItemName.trim(),
      quantity: 1,
      unit_cost: calculatedUnitCost,
      unit_sale_price: calculatedSalePrice,
    };

    setItems((prev) => [...prev, newItem]);
    setIsCalcDrawerOpen(false);

    // Reset calculadora
    setCalcItemName('');
    setCalcGrams(100);
    setCalcHours(2);
    setCalcMinutes(0);
  };

  // Totales
  const totalCost = items.reduce((acc, i) => acc + (i.unit_cost || 0) * (i.quantity || 1), 0);
  const totalPrice = items.reduce((acc, i) => acc + (i.unit_sale_price || 0) * (i.quantity || 1), 0);
  const netProfit = totalPrice - totalCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    const orderToSave: Order = {
      id: editingOrder ? editingOrder.id : crypto.randomUUID(),
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_notes: customerNotes.trim(),
      status,
      total_cost: totalCost,
      total_price: totalPrice,
      created_at: editingOrder ? editingOrder.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items,
    };

    onSave(orderToSave);
    onClose();
  };

  return (
    <div style={backdropStyle}>
      <div style={modalContainerStyle}>
        {/* Header Principal */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 4px 0', color: '#ffffff' }}>
            {editingOrder ? 'Editar Presupuesto / Pedido' : 'Nuevo Presupuesto / Pedido'}
          </h2>
          <p style={{ color: '#a1a1aa', margin: 0, fontSize: '14px' }}>
            Registro de venta, cotización a medida y seguimiento de estados.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Datos del Cliente y Estado */}
          <div style={cardSectionStyle}>
            <h3 style={cardTitleStyle}>Datos del cliente y estado</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>NOMBRE DEL CLIENTE *</label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>TELÉFONO / WHATSAPP</label>
                <input
                  type="text"
                  placeholder="Ej: 11 2345 6789"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>ESTADO PEDIDO *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  style={inputStyle}
                >
                  <option value="BUDGETED">Presupuestado</option>
                  <option value="PENDING">Pendiente</option>
                  <option value="CONFIRMED">Confirmado</option>
                  <option value="PAID">Pagado</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>NOTAS ADICIONALES (OPCIONAL)</label>
              <textarea
                placeholder="Detalles de entrega, lugar de envío, seña acordada..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                rows={2}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Card 2: Ítems del Pedido */}
          <div style={cardSectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={cardTitleStyle}>Ítems e impresiones del pedido</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleAddCatalogProduct}
                  style={btnSecondaryActionStyle}
                >
                  + Del Catálogo
                </button>
                <button
                  type="button"
                  onClick={() => setIsCalcDrawerOpen(true)}
                  style={btnPrimaryActionStyle}
                >
                  🧮 Cotizar Nueva Pieza
                </button>
              </div>
            </div>

            {items.length === 0 ? (
              <div
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  border: '2px dashed #27272a',
                  borderRadius: '8px',
                  color: '#71717a',
                  fontSize: '13px',
                }}
              >
                No hay ítems en este pedido. Haz click en "+ Del Catálogo" o "🧮 Cotizar Nueva Pieza".
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2.5fr 1fr 1fr 1fr auto',
                      gap: '8px',
                      alignItems: 'center',
                      backgroundColor: '#09090b',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #27272a',
                    }}
                  >
                    {item.product_id !== undefined ? (
                      <select
                        value={item.product_id}
                        onChange={(e) => handleUpdateItemProduct(idx, e.target.value)}
                        style={{ ...inputStyle, padding: '8px', fontSize: '13px' }}
                      >
                        {availableProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            🛍️ {p.name} (${p.sale_price.toLocaleString('es-AR')})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="Nombre ítem a medida"
                        value={item.item_name}
                        onChange={(e) => handleUpdateItemField(idx, 'item_name', e.target.value)}
                        style={{ ...inputStyle, padding: '8px', fontSize: '13px', fontWeight: 700 }}
                      />
                    )}

                    <div>
                      <label style={{ ...labelStyle, fontSize: '9px' }}>CANT.</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity || 1}
                        onChange={(e) =>
                          handleUpdateItemField(idx, 'quantity', parseFloat(e.target.value) || 1)
                        }
                        style={{ ...inputStyle, padding: '8px', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ ...labelStyle, fontSize: '9px' }}>COSTO U.</label>
                      <input
                        type="number"
                        value={item.unit_cost || 0}
                        onChange={(e) =>
                          handleUpdateItemField(idx, 'unit_cost', parseFloat(e.target.value) || 0)
                        }
                        style={{ ...inputStyle, padding: '8px', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ ...labelStyle, fontSize: '9px' }}>PRECIO U.</label>
                      <input
                        type="number"
                        value={item.unit_sale_price || 0}
                        onChange={(e) =>
                          handleUpdateItemField(idx, 'unit_sale_price', parseFloat(e.target.value) || 0)
                        }
                        style={{ ...inputStyle, padding: '8px', fontSize: '12px', borderColor: '#4ade80', fontWeight: 700 }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 3: Resumen de Totales */}
          <div
            style={{
              backgroundColor: '#141416',
              borderRadius: '12px',
              padding: '16px 20px',
              border: '1px solid #27272a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '12px', color: '#a1a1aa', display: 'block' }}>
                Costo Total Estimado: <strong>${totalCost.toLocaleString('es-AR')}</strong>
              </span>
              <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 700 }}>
                Ganancia Neta Estimada: +${netProfit.toLocaleString('es-AR')}
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#a1a1aa', display: 'block' }}>TOTAL PEDIDO</span>
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>
                ${totalPrice.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          {/* Footer de Botones */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={btnCancelStyle}>
              Cancelar
            </button>
            <button type="submit" style={btnCreateOrderStyle}>
              {editingOrder ? 'Guardar pedido' : 'Crear pedido'}
            </button>
          </div>
        </form>
      </div>

      {/* --- SIDE DRAWER: CALCULADORA EMBEBIDA PARA NUEVA PIEZA --- */}
      {isCalcDrawerOpen && (
        <div style={drawerBackdropStyle}>
          <div style={drawerContainerStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Cotizar Nueva Pieza
              </h3>
              <button
                type="button"
                onClick={() => setIsCalcDrawerOpen(false)}
                style={{ background: 'none', border: 'none', color: '#a1a1aa', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>NOMBRE DE LA PIEZA A MEDIDA *</label>
                <input
                  type="text"
                  placeholder="Ej: Llavero personalizado Juan"
                  value={calcItemName}
                  onChange={(e) => setCalcItemName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>FILAMENTO $/KG</label>
                  <input
                    type="number"
                    value={calcFilamentCostKg}
                    onChange={(e) => setCalcFilamentCostKg(parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>KWH $</label>
                  <input
                    type="number"
                    value={calcKwhCost}
                    onChange={(e) => setCalcKwhCost(parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>HORAS IMPRESIÓN</label>
                  <input
                    type="number"
                    value={calcHours}
                    onChange={(e) => setCalcHours(parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>MINUTOS</label>
                  <input
                    type="number"
                    value={calcMinutes}
                    onChange={(e) => setCalcMinutes(parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>GRAMOS FILAMENTO</label>
                  <input
                    type="number"
                    value={calcGrams}
                    onChange={(e) => setCalcGrams(parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>INSUMOS EXTRAS ($)</label>
                  <input
                    type="number"
                    value={calcSuppliesCost}
                    onChange={(e) => setCalcSuppliesCost(parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>MARGEN ERROR %</label>
                  <input
                    type="number"
                    value={calcErrorMargin}
                    onChange={(e) => setCalcErrorMargin(parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>GANANCIA (MULTIPLICADOR)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcProfitMultiplier}
                    onChange={(e) => setCalcProfitMultiplier(parseFloat(e.target.value) || 1)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddCalculatedPieceToOrder}
                style={{
                  backgroundColor: '#a855f7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                + Agregar a este Pedido
              </button>
            </div>
          </div>
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
  maxWidth: '780px',
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

const btnSecondaryActionStyle: React.CSSProperties = {
  backgroundColor: '#18181b',
  color: '#ffffff',
  border: '1px solid #3f3f46',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
};

const btnPrimaryActionStyle: React.CSSProperties = {
  backgroundColor: '#a855f7',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 14px',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
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

const btnCreateOrderStyle: React.CSSProperties = {
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
  maxWidth: '440px',
  height: '100%',
  padding: '24px',
  boxSizing: 'border-box',
  overflowY: 'auto',
  borderLeft: '1px solid #27272a',
  boxShadow: '-10px 0 25px rgba(0,0,0,0.5)',
};

export default OrderModal;
