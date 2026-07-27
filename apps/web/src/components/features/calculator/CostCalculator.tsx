import { useState } from 'react';
import type { CalculatorFormData, PrintPieceInput, SupplyItemInput } from '../../../types/calculator';
import { calculateCost } from '../../../utils/calculator-logic';
import { ResultsPanel } from './ResultsPanel';

interface CostCalculatorProps {
  initialValues?: Partial<CalculatorFormData>;
}

export const CostCalculator = ({ initialValues }: CostCalculatorProps = {}) => {
  const [formData, setFormData] = useState<CalculatorFormData>(() => ({
    pieces: initialValues?.pieces && initialValues.pieces.length > 0
      ? initialValues.pieces
      : [
          {
            id: crypto.randomUUID(),
            name: 'Pieza 1',
            costKgFilament: 18000,
            grams: 0,
            printHours: 0,
            printMinutes: 0,
          },
        ],
    supplies: initialValues?.supplies ?? [],
    kwhPrice: initialValues?.kwhPrice ?? 150,
    machineAveragePrice: initialValues?.machineAveragePrice ?? 1300000,
    machineLifeSpan: initialValues?.machineLifeSpan ?? 5000,
    isLedFrame: initialValues?.isLedFrame ?? false,
    ledMtsAmount: initialValues?.ledMtsAmount ?? 0,
    ledMtsPrice: initialValues?.ledMtsPrice ?? 0,
    powerSupplyUnitPrice: initialValues?.powerSupplyUnitPrice ?? 0,
    profitMargin: initialValues?.profitMargin ?? 3,
  }));

  // --- Handlers de Piezas 3D ---
  const handleAddPiece = () => {
    const nextNumber = formData.pieces.length + 1;
    const newPiece: PrintPieceInput = {
      id: crypto.randomUUID(),
      name: `Pieza ${nextNumber}`,
      costKgFilament: formData.pieces[0]?.costKgFilament || 18000,
      grams: 0,
      printHours: 0,
      printMinutes: 0,
    };
    setFormData((prev) => ({ ...prev, pieces: [...prev.pieces, newPiece] }));
  };

  const handleRemovePiece = (id: string) => {
    if (formData.pieces.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      pieces: prev.pieces.filter((p) => p.id !== id),
    }));
  };

  const handleUpdatePiece = (
    id: string,
    field: keyof PrintPieceInput,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      pieces: prev.pieces.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          [field]: typeof value === 'number' ? (isNaN(value) ? 0 : value) : value,
        };
      }),
    }));
  };

  // --- Handlers de Insumos ---
  const handleAddSupply = () => {
    const newSupply: SupplyItemInput = {
      id: crypto.randomUUID(),
      name: '',
      unitCost: 0,
      quantity: 1,
    };
    setFormData((prev) => ({ ...prev, supplies: [...prev.supplies, newSupply] }));
  };

  const handleRemoveSupply = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      supplies: prev.supplies.filter((s) => s.id !== id),
    }));
  };

  const handleUpdateSupply = (
    id: string,
    field: keyof SupplyItemInput,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      supplies: prev.supplies.map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          [field]: typeof value === 'number' ? (isNaN(value) ? 0 : value) : value,
        };
      }),
    }));
  };

  // --- Handlers de Campos Generales ---
  const handleChangeField = <K extends keyof CalculatorFormData>(
    field: K,
    value: CalculatorFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Cálculo en tiempo real
  const results = calculateCost(formData);

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#f4f4f5',
      }}
    >
      <header style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 900,
            margin: '0 0 8px 0',
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}
        >
          ⚡ Nueva Cotización
        </h1>
        <p style={{ color: '#a1a1aa', margin: 0, fontSize: '15px' }}>
          Calculadora integrada de costos para Impresión 3D y Carteles Neón LED.
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '32px',
        }}
        className="calculator-grid"
      >
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 1. SECCIÓN: PIEZAS IMPRESAS 3D */}
          <div
            style={{
              backgroundColor: '#18181b',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #27272a',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Piezas 3D / Componentes
              </h2>
              <span style={{ fontSize: '13px', color: '#a1a1aa' }}>
                Agrega las piezas que componen este proyecto.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {formData.pieces.map((piece, index) => (
                <div
                  key={piece.id}
                  style={{
                    backgroundColor: '#09090b',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #3f3f46',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#e4e4e7' }}>
                      Pieza {index + 1}
                    </h3>
                    {formData.pieces.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePiece(piece.id)}
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Quitar [-]
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={labelStyle}>Nombre de la pieza (opcional)</label>
                      <input
                        type="text"
                        placeholder="ej: Base trasera, Tapa difusora"
                        value={piece.name}
                        onChange={(e) => handleUpdatePiece(piece.id, 'name', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Costo del KG de filamento ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={piece.costKgFilament || ''}
                        onChange={(e) =>
                          handleUpdatePiece(piece.id, 'costKgFilament', parseFloat(e.target.value))
                        }
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Gramos de filamento (g)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={piece.grams || ''}
                        onChange={(e) =>
                          handleUpdatePiece(piece.id, 'grams', parseFloat(e.target.value))
                        }
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Tiempo de impresión</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="number"
                          min="0"
                          placeholder="Horas"
                          value={piece.printHours || ''}
                          onChange={(e) =>
                            handleUpdatePiece(piece.id, 'printHours', parseFloat(e.target.value))
                          }
                          style={inputStyle}
                        />
                        <input
                          type="number"
                          min="0"
                          max="59"
                          placeholder="Minutos"
                          value={piece.printMinutes || ''}
                          onChange={(e) =>
                            handleUpdatePiece(piece.id, 'printMinutes', parseFloat(e.target.value))
                          }
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddPiece}
                style={{
                  backgroundColor: '#27272a',
                  color: '#ffffff',
                  border: '1px border #3f3f46',
                  borderRadius: '8px',
                  padding: '10px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                + Agregar otra pieza
              </button>
            </div>
          </div>

          {/* 2. SECCIÓN: INSUMOS VARIOS */}
          <div
            style={{
              backgroundColor: '#18181b',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #27272a',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Insumos Varios
              </h2>
              <span style={{ fontSize: '13px', color: '#a1a1aa' }}>
                Tornillos, adhesivos, conectores u otros insumos físicos.
              </span>
            </div>

            {formData.supplies.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#71717a', fontStyle: 'italic' }}>
                Sin insumos adicionales agregados.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {formData.supplies.map((supply) => (
                  <div
                    key={supply.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr auto',
                      gap: '8px',
                      alignItems: 'center',
                      backgroundColor: '#09090b',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #27272a',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Nombre insumo"
                      value={supply.name}
                      onChange={(e) => handleUpdateSupply(supply.id, 'name', e.target.value)}
                      style={inputStyle}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Costo u."
                      value={supply.unitCost || ''}
                      onChange={(e) =>
                        handleUpdateSupply(supply.id, 'unitCost', parseFloat(e.target.value))
                      }
                      style={inputStyle}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Cant."
                      value={supply.quantity || ''}
                      onChange={(e) =>
                        handleUpdateSupply(supply.id, 'quantity', parseFloat(e.target.value))
                      }
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSupply(supply.id)}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#ef4444',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '0 8px',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleAddSupply}
              style={{
                backgroundColor: '#27272a',
                color: '#ffffff',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              + Agregar insumo
            </button>
          </div>

          {/* 3. SECCIÓN: ENERGÍA Y DESGASTE */}
          <div
            style={{
              backgroundColor: '#18181b',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #27272a',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 16px 0', color: '#ffffff' }}>
              Energía y Desgaste Máquina
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Precio kWh ($)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.kwhPrice || ''}
                  onChange={(e) =>
                    handleChangeField('kwhPrice', parseFloat(e.target.value) || 0)
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Precio Impresora ($)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.machineAveragePrice || ''}
                  onChange={(e) =>
                    handleChangeField('machineAveragePrice', parseFloat(e.target.value) || 0)
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Vida Útil (Horas)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.machineLifeSpan || ''}
                  onChange={(e) =>
                    handleChangeField('machineLifeSpan', parseFloat(e.target.value) || 1)
                  }
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* 4. SECCIÓN: ¿ES CARTEL LED? */}
          <div
            style={{
              backgroundColor: '#18181b',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #27272a',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <input
                type="checkbox"
                id="isLedFrame"
                checked={formData.isLedFrame}
                onChange={(e) => handleChangeField('isLedFrame', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#a855f7' }}
              />
              <label
                htmlFor="isLedFrame"
                style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', cursor: 'pointer' }}
              >
                ¿Es CARTEL LED Neón?
              </label>
            </div>

            {formData.isLedFrame && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '12px',
                  marginTop: '16px',
                  backgroundColor: '#09090b',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #3f3f46',
                }}
              >
                <div>
                  <label style={labelStyle}>Metros de LED</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={formData.ledMtsAmount || ''}
                    onChange={(e) =>
                      handleChangeField('ledMtsAmount', parseFloat(e.target.value) || 0)
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Precio Metro LED ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.ledMtsPrice || ''}
                    onChange={(e) =>
                      handleChangeField('ledMtsPrice', parseFloat(e.target.value) || 0)
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Precio Fuente ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.powerSupplyUnitPrice || ''}
                    onChange={(e) =>
                      handleChangeField('powerSupplyUnitPrice', parseFloat(e.target.value) || 0)
                    }
                    style={inputStyle}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5. SECCIÓN: MARGEN COMERCIAL */}
          <div
            style={{
              backgroundColor: '#18181b',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #27272a',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 16px 0', color: '#ffffff' }}>
              Margen Comercial
            </h2>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={labelStyle}>Multiplicador de Ganancia</label>
                <span style={{ fontWeight: 800, color: '#a855f7' }}>
                  x{formData.profitMargin}
                </span>
              </div>
              <input
                type="number"
                min="1"
                step="0.1"
                value={formData.profitMargin || ''}
                onChange={(e) =>
                  handleChangeField('profitMargin', parseFloat(e.target.value) || 1)
                }
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: RESUMEN DE RESULTADOS */}
        <div>
          <ResultsPanel results={results} profitMargin={formData.profitMargin} />
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .calculator-grid {
            grid-template-columns: 2fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
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
  backgroundColor: '#18181b',
  border: '1px solid #3f3f46',
  color: '#ffffff',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
};

export default CostCalculator;
