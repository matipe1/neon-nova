import type { OrderStatus } from '../../types/domain';

interface Props {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (newStatus: OrderStatus) => void;
}

interface StatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const statusConfig = {
  BUDGETED: {
    label: 'Presupuestado',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    textColor: '#60a5fa',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  PENDING: {
    label: 'Pendiente',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    textColor: '#fbbf24',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  CONFIRMED: {
    label: 'Confirmado',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    textColor: '#c4b5fd',
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  PAID: {
    label: 'Pagado',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    textColor: '#4ade80',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  CANCELLED: {
    label: 'Cancelado',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    textColor: '#f87171',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
} satisfies Record<OrderStatus, StatusConfig>;

export const BadgeStatus = ({ status, size = 'md', onChange }: Props) => {
  const config = statusConfig[status] || statusConfig.BUDGETED;

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '4px 10px', fontSize: '12px' },
    md: { padding: '6px 14px', fontSize: '13px' },
    lg: { padding: '8px 18px', fontSize: '15px' },
  };

  const commonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: 700,
    borderRadius: '9999px',
    border: `1px solid ${config.borderColor}`,
    backgroundColor: config.bgColor,
    color: config.textColor,
    letterSpacing: '0.02em',
    transition: 'all 0.2s ease',
    outline: 'none',
    ...sizeStyles[size],
  };

  if (onChange) {
    return (
      <select
        value={status}
        onChange={(e) => onChange(e.target.value as OrderStatus)}
        style={{
          ...commonStyle,
          cursor: 'pointer',
          appearance: 'auto',
        }}
      >
        <option value="BUDGETED" style={{ backgroundColor: '#18181b', color: '#60a5fa' }}>
          Presupuestado
        </option>
        <option value="PENDING" style={{ backgroundColor: '#18181b', color: '#fbbf24' }}>
          Pendiente
        </option>
        <option value="CONFIRMED" style={{ backgroundColor: '#18181b', color: '#c4b5fd' }}>
          Confirmado
        </option>
        <option value="PAID" style={{ backgroundColor: '#18181b', color: '#4ade80' }}>
          Pagado
        </option>
        <option value="CANCELLED" style={{ backgroundColor: '#18181b', color: '#f87171' }}>
          Cancelado
        </option>
      </select>
    );
  }

  return (
    <span style={commonStyle}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.textColor,
          marginRight: '6px',
        }}
      />
      {config.label}
    </span>
  );
};

export default BadgeStatus;