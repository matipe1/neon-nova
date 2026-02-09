import { CalculationResult } from "@/src/lib/calculator-logic";

interface Props {
  results: CalculationResult;
  profitMargin: number | undefined;
}

export function ResultsPanel({ results, profitMargin }: Props) {
  const isValid =
    results &&
    typeof results.subtotal === "number" &&
    results.total > 0 &&
    results.subtotal > 0 &&
    typeof profitMargin === "number";

  if (!isValid) {
    return (
      <div className="bg-slate-900 text-slate-500 p-8 rounded-2xl h-fit flex flex-col items-center justify-center gap-2">
        <p>Ingresa los datos para calcular...</p>
      </div>
    );
  }

  const formattedCost = (value: number) => {
    return Math.ceil(value).toLocaleString("es-AR", {
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl h-fit sticky top-6 shadow-2xl border border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-white">Resumen</h2>
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </div>

      <div className="space-y-4">
        {/* Precio Final */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-1">
            Precio Sugerido
          </p>
          <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
            $ {formattedCost(results.total)}
          </p>
          <p className="text-xs text-violet-400 mt-2 font-medium">
            Margen x{profitMargin}
          </p>
        </div>

        {/* Mercado Libre */}
        <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-900/20 border border-yellow-600/30">
          <div className="flex flex-col">
            <span className="text-yellow-500 text-xs font-bold uppercase">
              Mercado Libre
            </span>
            <span className="text-[10px] text-yellow-600/80">
              Comisión ~16%
            </span>
          </div>
          <p className="text-xl font-bold text-yellow-400">
            ${formattedCost(results.mercadoLibreTotal)}
          </p>
        </div>

        {/* Desglose */}
        <div className="pt-4 mt-4 border-t border-slate-800 space-y-2 text-sm text-slate-400">
          <div className="flex justify-between">
            <span>Costo de Materiales</span>
            <span className="pr-2">
              ${formattedCost(results.breakdown.printingCost)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Costo de LED</span>
            <span className="pr-2">
              ${formattedCost(results.breakdown.ledCost)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Costo de Energía</span>
            <span className="pr-2">
              ${formattedCost(results.breakdown.energyCost)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Costo Operacional</span>
            <span className="pr-2">
              ${formattedCost(results.breakdown.operationalCost)}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-t border-slate-800">
            <span>Costo Base (Subtotal)</span>
            <span className="pr-2">
              ${Math.ceil(results.subtotal).toLocaleString("es-AR")}
            </span>
          </div>
          <div className="flex justify-between items-center bg-green-900/20 p-2 rounded border border-green-900/30 mt-2 text-green-400 font-bold">
            <span>Ganancia Neta</span>
            <span>
              $
              {Math.ceil(results.total - results.subtotal).toLocaleString(
                "es-AR",
                { maximumFractionDigits: 2 },
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
