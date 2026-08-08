import { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, Tag, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { FinancialTransaction } from '../../../types/domain';

interface TransactionTableProps {
  transactions: FinancialTransaction[];
  onDeleteTransaction: (id: string) => void;
}

export const TransactionTable = ({
  transactions,
  onDeleteTransaction,
}: TransactionTableProps) => {
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter((t) => {
    if (filterType !== 'ALL' && t.type !== filterType) return false;
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      return (
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        (t.order_id && t.order_id.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (isoDate: string) => {
    return format(parseISO(isoDate), 'dd/MM/yyyy');
  };

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800/80 overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800/80 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filterType === 'ALL'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Todos ({transactions.length})
          </button>
          <button
            onClick={() => setFilterType('INCOME')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filterType === 'INCOME'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Ingresos
          </button>
          <button
            onClick={() => setFilterType('EXPENSE')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filterType === 'EXPENSE'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Gastos
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por concepto o id..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950/60 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider font-medium">
            <tr>
              <th className="py-3 px-4">Fecha</th>
              <th className="py-3 px-4">Concepto / Descripción</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4">Origen</th>
              <th className="py-3 px-4 text-right">Monto</th>
              <th className="py-3 px-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-500">
                  No se encontraron transacciones en este período.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-zinc-800/40 transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono text-zinc-400">
                    {formatDate(t.date)}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                    {t.description}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700/50 text-zinc-300 text-[11px]">
                      <Tag className="w-3 h-3 text-zinc-400" />
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {t.order_id ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-mono">
                        #{t.order_id}
                      </span>
                    ) : (
                      <span className="text-zinc-500 text-[11px]">Manual</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold font-mono text-sm">
                    {t.type === 'INCOME' ? (
                      <span className="text-emerald-400 inline-flex items-center justify-end gap-1">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        +{formatCurrency(t.amount)}
                      </span>
                    ) : (
                      <span className="text-rose-400 inline-flex items-center justify-end gap-1">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        -{formatCurrency(t.amount)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onDeleteTransaction(t.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Eliminar transacción"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
