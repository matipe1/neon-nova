interface LowStockProductBannerProps {
  lowStockCount: number;
}

export const LowStockProductBanner = ({ lowStockCount }: LowStockProductBannerProps) => {
  if (lowStockCount === 0) return null;

  return (
    <div
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#fca5a5',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '20px' }}>⚠️</span>
        <div>
          <strong style={{ color: '#f87171', fontSize: '15px', display: 'block' }}>
            Atención: Tienes {lowStockCount} producto(s) con stock crítico
          </strong>
        </div>
      </div>
    </div>
  );
};

export default LowStockProductBanner;
