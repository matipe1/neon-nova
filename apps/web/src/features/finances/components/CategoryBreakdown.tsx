import { PieChart, ShoppingBag } from 'lucide-react';
import type { FinancialTransaction } from '@/features/finances/types';
import { formatCurrency } from '../utils/formatters';

interface CategoryBreakdownProps {
  transactions: FinancialTransaction[];
}

export const CategoryBreakdown = ({ transactions }: CategoryBreakdownProps) => {
  const incomes = transactions.filter((t) => t.type === 'INCOME');
  const expenses = transactions.filter((t) => t.type === 'OUTCOME');

  const totalIncome = incomes.reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);

  // Group incomes by category
  const incomeCategoryMap: Record<string, number> = {};
  incomes.forEach((t) => {
    incomeCategoryMap[t.category] = (incomeCategoryMap[t.category] || 0) + t.amount;
  });

  // Group expenses by category
  const expenseCategoryMap: Record<string, number> = {};
  expenses.forEach((t) => {
    expenseCategoryMap[t.category] = (expenseCategoryMap[t.category] || 0) + t.amount;
  });

  const getPercentage = (amount: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((amount / total) * 100);
  };

  const channelColors: Record<string, string> = {
    'Mercado Libre': 'bg-yellow-500',
    Instagram: 'bg-pink-500',
    Presencial: 'bg-emerald-500',
    'Catálogo': 'bg-blue-500',
    Otros: 'bg-purple-500',
  };

  const expenseColors: Record<string, string> = {
    Insumos: 'bg-purple-500',
    Servicios: 'bg-blue-500',
    Mantenimiento: 'bg-amber-500',
    Otros: 'bg-rose-500',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Panel 1: Ingresos por Canal */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800/80 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Ingresos por Canal</h3>
          </div>
          <span className="text-xs text-zinc-400">Total: {formatCurrency(totalIncome)}</span>
        </div>

        <div className="space-y-3">
          {Object.entries(incomeCategoryMap).length === 0 ? (
            <p className="text-xs text-zinc-500 py-4 text-center">No hay ingresos en el período</p>
          ) : (
            Object.entries(incomeCategoryMap).map(([category, amount]) => {
              const pct = getPercentage(amount, totalIncome);
              const barColor = channelColors[category] || 'bg-emerald-500';
              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400">{formatCurrency(amount)}</span>
                      <span className="font-semibold text-emerald-400 min-w-[32px] text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Panel 2: Gastos por Categoría */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800/80 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-white">Gastos por Rubro</h3>
          </div>
          <span className="text-xs text-zinc-400">Total: {formatCurrency(totalExpense)}</span>
        </div>

        <div className="space-y-3">
          {Object.entries(expenseCategoryMap).length === 0 ? (
            <p className="text-xs text-zinc-500 py-4 text-center">No hay egresos en el período</p>
          ) : (
            Object.entries(expenseCategoryMap).map(([category, amount]) => {
              const pct = getPercentage(amount, totalExpense);
              const barColor = expenseColors[category] || 'bg-rose-500';
              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400">{formatCurrency(amount)}</span>
                      <span className="font-semibold text-rose-400 min-w-[32px] text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
