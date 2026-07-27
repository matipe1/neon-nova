import { useState, useEffect } from 'react';
import type { Filament } from '../../../../types/domain';

interface FilamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (filament: Filament) => void;
  editingFilament?: Filament | null;
}

export const FilamentModal = ({
  isOpen,
  onClose,
  onSave,
  editingFilament,
}: FilamentModalProps) => {
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('PLA');
  const [color, setColor] = useState('');
  const [costPerGram, setCostPerGram] = useState<number>(18);
  const [stockGrams, setStockGrams] = useState<number>(1000);
  const [minStockAlert, setMinStockAlert] = useState<number>(200);

  useEffect(() => {
    if (editingFilament) {
      setBrand(editingFilament.brand);
      setType(editingFilament.type);
      setColor(editingFilament.color);
      setCostPerGram(editingFilament.cost_per_gram);
      setStockGrams(editingFilament.stock_grams);
      setMinStockAlert(editingFilament.min_stock_alert ?? 200);
    } else {
      setBrand('');
      setType('PLA');
      setColor('');
      setCostPerGram(18);
      setStockGrams(1000);
      setMinStockAlert(200);
    }
  }, [editingFilament, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !color.trim()) return;

    const filamentToSave: Filament = {
      id: editingFilament ? editingFilament.id : crypto.randomUUID(),
      brand: brand.trim(),
      type: type.trim(),
      color: color.trim(),
      cost_per_gram: Number(costPerGram) || 0,
      stock_grams: Number(stockGrams) || 0,
      min_stock_alert: Number(minStockAlert) || 200,
      created_at: editingFilament ? editingFilament.created_at : new Date().toISOString(),
    };

    onSave(filamentToSave);
    onClose();
  };

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
            {editingFilament ? 'Editar Bobina de Filamento' : 'Nueva Bobina de Filamento'}
          </h3>
          <button type="button" onClick={onClose} style={closeBtnStyle}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Marca *</label>
            <input
              type="text"
              placeholder="ej: Grilon3, PrintaLot, eSUN"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Tipo Material *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={inputStyle}
              >
                <option value="PLA">PLA</option>
                <option value="PETG">PETG</option>
                <option value="ABS">ABS</option>
                <option value="TPU">TPU (Flexible)</option>
                <option value="ASA">ASA</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Color *</label>
              <input
                type="text"
                placeholder="ej: Negro, Blanco, Rojo"
                required
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Costo por Gramo ($/g) *</label>
            <input
              type="number"
              step="0.1"
              min="0"
              required
              value={costPerGram}
              onChange={(e) => setCostPerGram(parseFloat(e.target.value))}
              style={inputStyle}
            />
            <span style={{ fontSize: '11px', color: '#71717a', marginTop: '4px', display: 'block' }}>
              Equivale a ${((costPerGram || 0) * 1000).toLocaleString('es-AR')} el Kg.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Stock Restante (g) *</label>
              <input
                type="number"
                min="0"
                required
                value={stockGrams}
                onChange={(e) => setStockGrams(parseFloat(e.target.value))}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Alerta Stock Mínimo (g) *</label>
              <input
                type="number"
                min="0"
                required
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(parseFloat(e.target.value))}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>
              Cancelar
            </button>
            <button type="submit" style={saveBtnStyle}>
              Guardar Filamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)',
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#18181b',
  border: '1px solid #27272a',
  borderRadius: '16px',
  padding: '24px',
  width: '100%',
  maxWidth: '480px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: '#a1a1aa',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  backgroundColor: '#09090b',
  border: '1px solid #3f3f46',
  color: '#ffffff',
  fontSize: '14px',
  boxSizing: 'border-box',
};

const closeBtnStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  color: '#a1a1aa',
  fontSize: '18px',
  cursor: 'pointer',
};

const cancelBtnStyle: React.CSSProperties = {
  backgroundColor: '#27272a',
  color: '#f4f4f5',
  border: '1px solid #3f3f46',
  borderRadius: '8px',
  padding: '8px 16px',
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
};

const saveBtnStyle: React.CSSProperties = {
  backgroundColor: '#a855f7',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 18px',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
};

export default FilamentModal;
