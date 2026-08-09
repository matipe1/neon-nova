import { useState, useEffect } from 'react';
import type { Supply } from '../../../../types/domain';

interface SupplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supply: Supply) => void;
  editingSupply?: Supply | null;
}

export const SupplyModal = ({
  isOpen,
  onClose,
  onSave,
  editingSupply,
}: SupplyModalProps) => {
  const [name, setName] = useState('');
  const [unitCost, setUnitCost] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(1);
  const [minStockAlert, setMinStockAlert] = useState<number>(5);
  const [unitOfMeasure, setUnitOfMeasure] = useState<'unit' | 'ml' | 'grams'>('unit');

  useEffect(() => {
    if (editingSupply) {
      setName(editingSupply.name);
      setUnitCost(editingSupply.unit_cost);
      setStockQuantity(editingSupply.stock_quantity);
      setMinStockAlert(editingSupply.min_stock_alert ?? 5);
      setUnitOfMeasure(editingSupply.unit_of_measure);
    } else {
      setName('');
      setUnitCost(0);
      setStockQuantity(1);
      setMinStockAlert(5);
      setUnitOfMeasure('unit');
    }
  }, [editingSupply, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const supplyToSave: Supply = {
      id: editingSupply ? editingSupply.id : crypto.randomUUID(),
      name: name.trim(),
      unit_cost: Number(unitCost) || 0,
      stock_quantity: Number(stockQuantity) || 0,
      min_stock_alert: Number(minStockAlert) || 5,
      unit_of_measure: unitOfMeasure,
      created_at: editingSupply ? editingSupply.created_at : new Date().toISOString(),
    };

    onSave(supplyToSave);
    onClose();
  };

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
            {editingSupply ? 'Editar Insumo' : 'Nuevo Insumo'}
          </h3>
          <button type="button" onClick={onClose} style={closeBtnStyle}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Nombre del Insumo *</label>
            <input
              type="text"
              placeholder="ej: Fuente 12V 5A, Imán Neodimio 5x2, Cianoacrilato"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Unidad de Medida *</label>
              <select
                value={unitOfMeasure}
                onChange={(e) => setUnitOfMeasure(e.target.value as 'unit' | 'ml' | 'grams')}
                style={inputStyle}
              >
                <option value="unit">Unidad (u.)</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="grams">Gramos (g)</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Costo Unitario ($) *</label>
              <input
                type="number"
                min="0"
                required
                value={unitCost}
                onChange={(e) => setUnitCost(parseFloat(e.target.value))}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Stock Disponible *</label>
              <input
                type="number"
                min="0"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseFloat(e.target.value))}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Alerta Stock Mínimo *</label>
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
              Guardar Insumo
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

export default SupplyModal;
