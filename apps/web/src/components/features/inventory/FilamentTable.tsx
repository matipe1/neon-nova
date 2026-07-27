import type { Filament } from '../../../types/domain';

interface FilamentTableProps {
  filaments: Filament[];
  onEdit: (filament: Filament) => void;
  onDelete: (id: string) => void;
  onAdjustStock: (id: string, deltaGrams: number) => void;
}

export const FilamentTable = ({
  filaments,
  onEdit,
  onDelete,
  onAdjustStock,
}: FilamentTableProps) => {
  if (filaments.length === 0) {
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
        No hay bobinas de filamento registradas en el inventario.
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
            <th style={thStyle}>Marca</th>
            <th style={thStyle}>Tipo</th>
            <th style={thStyle}>Color</th>
            <th style={thStyle}>Costo / Gramo</th>
            <th style={thStyle}>Stock Gramos</th>
            <th style={thStyle}>Estado</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filaments.map((item) => {
            const isLowStock = item.stock_grams <= item.min_stock_alert;
            const costPerKg = item.cost_per_gram * 1000;

            return (
              <tr
                key={item.id}
                style={{
                  borderBottom: '1px solid #27272a',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <td style={tdStyle}>
                  <strong style={{ color: '#ffffff' }}>{item.brand}</strong>
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#27272a',
                      color: '#e4e4e7',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {item.type}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: getColorHex(item.color),
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    />
                    {item.color}
                  </div>
                </td>
                <td style={tdStyle}>
                  <span style={{ color: '#4ade80', fontWeight: 600 }}>
                    ${item.cost_per_gram.toFixed(2)}/g
                  </span>{' '}
                  <span style={{ fontSize: '11px', color: '#71717a' }}>
                    (${costPerKg.toLocaleString('es-AR')}/kg)
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: isLowStock ? '#f87171' : '#ffffff' }}>
                      {item.stock_grams}g
                    </span>
                    {/* Botones de Ajuste Rápido */}
                    <div style={{ display: 'flex', gap: '2px' }}>
                      <button
                        type="button"
                        onClick={() => onAdjustStock(item.id, -100)}
                        title="Restar 100g"
                        style={btnAdjustStyle}
                      >
                        -100g
                      </button>
                      <button
                        type="button"
                        onClick={() => onAdjustStock(item.id, 250)}
                        title="Sumar 250g"
                        style={btnAdjustStyle}
                      >
                        +250g
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

const getColorHex = (colorName: string): string => {
  const lower = colorName.toLowerCase();
  if (lower.includes('negro')) return '#18181b';
  if (lower.includes('blanco')) return '#ffffff';
  if (lower.includes('rojo')) return '#ef4444';
  if (lower.includes('azul')) return '#3b82f6';
  if (lower.includes('verde')) return '#22c55e';
  if (lower.includes('amarillo')) return '#eab308';
  if (lower.includes('naranja')) return '#f97316';
  if (lower.includes('violeta') || lower.includes('morado')) return '#a855f7';
  if (lower.includes('transparente') || lower.includes('cristal')) return 'rgba(255,255,255,0.4)';
  return '#a1a1aa';
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

export default FilamentTable;
