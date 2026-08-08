import { Calendar, Plus } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

interface FinanceHeaderProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onOpenModal: () => void;
}

export const FinanceHeader = ({
  selectedMonth,
  onMonthChange,
  onOpenModal,
}: FinanceHeaderProps) => {
  const now = new Date();
  const currentMonthIndex = now.getMonth();

  // Generamos los meses desde el actual hacia atrás usando subMonths() y format()
  const availableMonths = Array.from({ length: currentMonthIndex + 1 }, (_, i) => {
    const monthDate = subMonths(now, i);
    const value = format(monthDate, 'yyyy-MM');
    const rawLabel = format(monthDate, 'MMMM yyyy', { locale: es });
    const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);

    return { value, label };
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Finanzas
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Control de ingresos, gastos operativos y balance del taller
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Month Picker Dropdown */}
        <div className="relative flex items-center">
          <Calendar className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="bg-zinc-900 text-zinc-200 border border-zinc-800 text-sm rounded-lg pl-9 pr-8 py-2 appearance-none focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
          >
            {availableMonths.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <span className="absolute right-3 pointer-events-none text-xs text-zinc-500">▼</span>
        </div>

        {/* Single Unified Action Button */}
        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-purple-600 text-white hover:bg-purple-500 transition-all duration-150 active:scale-95 shadow-lg shadow-purple-900/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Transacción</span>
        </button>
      </div>
    </div>
  );
};
