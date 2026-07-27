import type { Order, OrderStatus } from '../../../types/domain';
import BadgeStatus from '../../ui/BadgeStatus';

interface OrderTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, newStatus: OrderStatus) => void;
}

export const OrderTable = ({
  orders,
  onEdit,
  onDelete,
  onChangeStatus,
}: OrderTableProps) => {
  if (orders.length === 0) {
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
        No hay ventas o presupuestos registrados.
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
            <th style={thStyle}>Cliente</th>
            <th style={thStyle}>Teléfono</th>
            <th style={thStyle}>Ítems del Pedido</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Fecha</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item) => {
            const itemsSummary = item.items
              ? item.items.map((i) => `${i.quantity}x ${i.item_name}`).join(', ')
              : 'Sin ítems';

            return (
              <tr
                key={item.id}
                style={{
                  borderBottom: '1px solid #27272a',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <td style={tdStyle}>
                  <div>
                    <strong style={{ color: '#ffffff', fontSize: '15px', display: 'block' }}>
                      {item.customer_name}
                    </strong>
                    {item.customer_notes && (
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#71717a',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: '1.3',
                          marginTop: '2px',
                        }}
                        title={item.customer_notes}
                      >
                        {item.customer_notes}
                      </span>
                    )}
                  </div>
                </td>
                <td style={tdStyle}>
                  <span style={{ color: '#cbd5e1', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {item.customer_phone || 'Sin teléfono'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      fontSize: '13px',
                      color: '#a1a1aa',
                      maxWidth: '220px',
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={itemsSummary}
                  >
                    {itemsSummary}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{ color: '#4ade80', fontWeight: 800, fontSize: '15px' }}>
                    ${item.total_price.toLocaleString('es-AR')}
                  </span>
                </td>
                <td style={tdStyle}>
                  <BadgeStatus
                    status={item.status}
                    size="sm"
                    onChange={(newStatus) => onChangeStatus(item.id, newStatus)}
                  />
                </td>
                <td style={tdStyle}>
                  <span style={{ fontSize: '12px', color: '#71717a' }}>
                    {new Date(item.created_at).toLocaleDateString('es-AR')}
                  </span>
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

export default OrderTable;
