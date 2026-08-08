import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface FinanceKpiCardsProps {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export const FinanceKpiCards = ({
  totalIncome,
  totalExpense,
  netBalance,
}: FinanceKpiCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const profitMargin = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Ingresos Totales */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800/80 flex flex-col justify-between hover:border-zinc-700/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Ingresos Totales
          </span>
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatCurrency(totalIncome)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              +14.2%
            </span>
            <span className="text-zinc-500">vs mes anterior</span>
          </div>
        </div>
      </div>

      {/* Card 2: Gastos Operativos */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800/80 flex flex-col justify-between hover:border-zinc-700/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Gastos Operativos
          </span>
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatCurrency(totalExpense)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              -5.1%
            </span>
            <span className="text-zinc-500">reducción de egresos</span>
          </div>
        </div>
      </div>

      {/* Card 3: Balance Neto */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-purple-500/30 flex flex-col justify-between hover:border-purple-500/50 transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-medium text-purple-300 uppercase tracking-wider">
            Balance Neto
          </span>
          <div className="w-9 h-9 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 relative z-10">
          <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-2">
            <span>{formatCurrency(netBalance)}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-purple-300">
            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 font-semibold">
              Margen: {profitMargin}%
            </span>
            <span className="text-zinc-400">utilidad neta</span>
          </div>
        </div>
      </div>
    </div>
  );
};
