import type { Supply } from '../../../types/domain';

interface SupplyTableProps {
  supplies: Supply[];
  onEdit: (supply: Supply) => void;
  onDelete: (id: string) => void;
  onAdjustStock: (id: string, deltaQty: number) => void;
}

export const SupplyTable = ({
  supplies,
  onEdit,
  onDelete,
  onAdjustStock,
}: SupplyTableProps) => {
  if (supplies.length === 0) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#18181b',
          borderRadius: '12px',
          border: '1px solid #27272a',
          color: '#a1a1aa',
        }}
      >
        No hay insumos registrados en el inventario.
      </div>
    );
  }

  return (
    <div
      style={{
        overflowX: 'auto',
        backgroundColor: '#18181b',
        borderRadius: '12px',
        border: '1px solid #27272a',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '14px',
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: '1px solid #27272a',
              backgroundColor: '#09090b',
              color: '#a1a1aa',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <th style={thStyle}>Insumo / Descripción</th>
            <th style={thStyle}>Unidad de Medida</th>
            <th style={thStyle}>Costo Unitario</th>
            <th style={thStyle}>Stock Actual</th>
            <th style={thStyle}>Estado</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {supplies.map((item) => {
            const isLowStock = item.stock_quantity <= item.min_stock_alert;

            return (
              <tr
                key={item.id}
                style={{
                  borderBottom: '1px solid #27272a',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <td style={tdStyle}>
                  <strong style={{ color: '#ffffff' }}>{item.name}</strong>
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#27272a',
                      color: '#a1a1aa',
                      fontSize: '12px',
                    }}
                  >
                    {item.unit_of_measure === 'unit'
                      ? 'Unidad'
                      : item.unit_of_measure === 'ml'
                      ? 'ml (Mililitros)'
                      : 'Gramos'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{ color: '#4ade80', fontWeight: 600 }}>
                    ${item.unit_cost.toLocaleString('es-AR')}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: isLowStock ? '#f87171' : '#ffffff' }}>
                      {item.stock_quantity} {item.unit_of_measure === 'unit' ? 'u.' : item.unit_of_measure}
                    </span>
                    {/* Botones de Ajuste Rápido */}
                    <div style={{ display: 'flex', gap: '2px' }}>
                      <button
                        type="button"
                        onClick={() => onAdjustStock(item.id, -1)}
                        title="Restar 1"
                        style={btnAdjustStyle}
                      >
                        -1
                      </button>
                      <button
                        type="button"
                        onClick={() => onAdjustStock(item.id, 5)}
                        title="Sumar 5"
                        style={btnAdjustStyle}
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </td>
                <td style={tdStyle}>
                  {isLowStock ? (
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        color: '#f87171',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      ⚠️ Stock Bajo
                    </span>
                  ) : (
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        color: '#4ade80',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      OK
                    </span>
                  )}
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      style={btnEditStyle}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      style={btnDeleteStyle}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: '14px 16px',
  color: '#e4e4e7',
};

const btnAdjustStyle: React.CSSProperties = {
  backgroundColor: '#27272a',
  color: '#a1a1aa',
  border: '1px solid #3f3f46',
  borderRadius: '4px',
  padding: '2px 6px',
  fontSize: '11px',
  cursor: 'pointer',
};

const btnEditStyle: React.CSSProperties = {
  backgroundColor: '#27272a',
  color: '#f4f4f5',
  border: '1px solid #3f3f46',
  borderRadius: '6px',
  padding: '4px 12px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
};

const btnDeleteStyle: React.CSSProperties = {
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  color: '#f87171',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  borderRadius: '6px',
  padding: '4px 12px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
};

export default SupplyTable;
