import type { Product } from '../../../types/domain';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAdjustStock: (id: string, delta: number) => void;
}

export const ProductTable = ({
  products,
  onEdit,
  onDelete,
  onAdjustStock,
}: ProductTableProps) => {
  if (products.length === 0) {
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
        No hay productos registrados en el catálogo.
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
            <th style={thStyle}>Producto</th>
            <th style={thStyle}>Categoría</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Costo Producción</th>
            <th style={thStyle}>Precio Venta</th>
            <th style={thStyle}>Estado</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
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
                  <span style={{ color: '#ffffff', fontSize: '15px', display: 'block' }}>
                    {item.name}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#27272a',
                      color: '#cbd5e1',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {item.category_id || 'General'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: '14px',
                        color: isLowStock ? '#f87171' : '#ffffff',
                      }}
                    >
                      {item.stock_quantity} u.
                    </span>
                    {/* Botones de Ajuste Rápido de Stock (+1 / -1) */}
                    <div style={{ display: 'flex', gap: '3px' }}>
                      <button
                        type="button"
                        onClick={() => onAdjustStock(item.id, -1)}
                        title="Restar 1 unidad"
                        style={btnAdjustStyle}
                      >
                        -1
                      </button>
                      <button
                        type="button"
                        onClick={() => onAdjustStock(item.id, 1)}
                        title="Sumar 1 unidad"
                        style={btnAdjustStyle}
                      >
                        +1
                      </button>
                    </div>
                  </div>
                </td>
                <td style={tdStyle}>
                  <span style={{ color: '#a1a1aa', fontWeight: 600 }}>
                    ${item.unit_cost.toLocaleString('es-AR')}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{ color: '#4ade80', fontWeight: 800, fontSize: '15px' }}>
                    ${item.sale_price.toLocaleString('es-AR')}
                  </span>
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
                      Ver / Editar
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
  color: '#ffffff',
  border: '1px solid #3f3f46',
  borderRadius: '4px',
  padding: '2px 8px',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
};

const btnEditStyle: React.CSSProperties = {
  backgroundColor: '#27272a',
  color: '#f4f4f5',
  border: '1px solid #3f3f46',
  borderRadius: '6px',
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
};

const btnDeleteStyle: React.CSSProperties = {
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  color: '#f87171',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  borderRadius: '6px',
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
};

export default ProductTable;
