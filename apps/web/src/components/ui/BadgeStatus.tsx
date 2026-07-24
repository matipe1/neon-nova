import type { OrderStatus } from '../../types/domain';

interface Props {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
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
    bgColor: '#eff6ff',
    textColor: '#1d4ed8',
    borderColor: '#bfdbfe',
  },
  PENDING: {
    label: 'Pendiente Revisión',
    bgColor: '#fffbeb',
    textColor: '#b45309',
    borderColor: '#fde68a',
  },
  CONFIRMED: {
    label: 'Confirmado',
    bgColor: '#f0fdf4',
    textColor: '#15803d',
    borderColor: '#bbf7d0',
  },
  PAID: {
    label: 'Pagado',
    bgColor: '#ecfdf5',
    textColor: '#047857',
    borderColor: '#a7f3d0',
  },
  CANCELLED: {
    label: 'Cancelado',
    bgColor: '#fef2f2',
    textColor: '#b91c1c',
    borderColor: '#fecaca',
  },
} satisfies Record<OrderStatus, StatusConfig>;

const BadgeStatus = ({ status, size = 'md' }: Props) => {
  const config = statusConfig[status];

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '2px 8px', fontSize: '11px' },
    md: { padding: '4px 12px', fontSize: '13px' },
    lg: { padding: '6px 16px', fontSize: '15px' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontWeight: 600,
        borderRadius: '9999px',
        border: `1px solid ${config.borderColor}`,
        backgroundColor: config.bgColor,
        color: config.textColor,
        letterSpacing: '0.02em',
        transition: 'all 0.2s ease',
        ...sizeStyles[size],
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.textColor,
        }}
      />
      {config.label}
    </span>
  );
};

export default BadgeStatus;