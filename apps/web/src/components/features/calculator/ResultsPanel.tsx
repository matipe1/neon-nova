import type { CalculationResult } from '../../../types/calculator';

interface ResultsPanelProps {
  results: CalculationResult;
  profitMargin: number;
}

const formatCurrency = (amount: number): string => {
  if (isNaN(amount) || !isFinite(amount)) return '$ 0';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

export const ResultsPanel = ({ results, profitMargin }: ResultsPanelProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        fontFamily: 'system-ui, sans-serif',
        position: 'sticky',
        top: '24px',
      }}
    >
      <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: 'var(--text-h)' }}>
        Resumen
      </h2>

      {/* 1. Tarjeta PRECIO SUGERIDO (Morada / Destacada) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4c1d95 0%, #3b0764 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(76, 29, 149, 0.4)',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#c4b5fd',
          }}
        >
          Precio Sugerido
        </span>
        <div
          style={{
            fontSize: '38px',
            fontWeight: 900,
            margin: '8px 0',
            letterSpacing: '-0.02em',
          }}
        >
          {formatCurrency(results.recommendedPrice)}
        </div>
        <span
          style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            fontSize: '12px',
            fontWeight: 600,
            color: '#ddd6fe',
          }}
        >
          Margen x{profitMargin || 1}
        </span>
      </div>

      {/* 2. Tarjeta MERCADO LIBRE (Dorada / Café) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #451a03 0%, #290e02 100%)',
          borderRadius: '12px',
          padding: '16px 20px',
          color: '#fef3c7',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#fde68a',
              display: 'block',
            }}
          >
            Mercado Libre
          </span>
          <span style={{ fontSize: '11px', color: '#d97706' }}>Comisión ~16%</span>
        </div>
        <span style={{ fontSize: '20px', fontWeight: 800, color: '#fbbf24' }}>
          {formatCurrency(results.mercadoLibrePrice)}
        </span>
      </div>

      {/* 3. Desglose de Costos (Panel Oscuro / Detallado) */}
      <div
        style={{
          backgroundColor: '#18181b',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #27272a',
          color: '#a1a1aa',
          fontSize: '13px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Costo de Materiales</span>
          <span style={{ color: '#f4f4f5', fontWeight: 600 }}>
            {formatCurrency(results.totalMaterialCost)}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Costo de LED</span>
          <span style={{ color: '#f4f4f5', fontWeight: 600 }}>
            {formatCurrency(results.ledCost)}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Costo de Energía</span>
          <span style={{ color: '#f4f4f5', fontWeight: 600 }}>
            {formatCurrency(results.energyCost)}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Costo Operacional</span>
          <span style={{ color: '#f4f4f5', fontWeight: 600 }}>
            {formatCurrency(results.operationalCost)}
          </span>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #3f3f46', margin: '4px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#e4e4e7', fontWeight: 600 }}>Costo Base (Subtotal)</span>
          <span style={{ color: '#ffffff', fontWeight: 700 }}>
            {formatCurrency(results.productionSubtotal)}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '15px',
            fontWeight: 800,
            color: '#4ade80',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          }}
        >
          <span>Ganancia Neta</span>
          <span>{formatCurrency(results.netProfit)}</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
