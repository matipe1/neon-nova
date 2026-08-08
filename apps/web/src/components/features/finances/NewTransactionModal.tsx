import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';
import type { TransactionType, TransactionCategory } from '../../../types/domain';

interface NewTransactionModalProps {
  isOpen: boolean;
  initialType: TransactionType;
  onClose: () => void;
  onSave: (data: {
    type: TransactionType;
    amount: number;
    category: TransactionCategory;
    description: string;
    date: string;
  }) => void;
}

export const NewTransactionModal = ({
  isOpen,
  initialType,
  onClose,
  onSave,
}: NewTransactionModalProps) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<TransactionCategory>(
    initialType === 'INCOME' ? 'Venta Presencial' : 'Insumos'
  );
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;
    if (!description.trim()) return;

    onSave({
      type,
      amount: numericAmount,
      category,
      description: description.trim(),
      date,
    });

    // Reset form
    setAmount('');
    setDescription('');
    onClose();
  };

  const categoriesForType: TransactionCategory[] =
    type === 'INCOME'
      ? ['Venta Presencial', 'Venta Catálogo', 'Mercado Libre', 'Venta Redes', 'Otros']
      : ['Insumos', 'Diseño', 'Servicios', 'Otros'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 shadow-2xl space-y-5 select-none text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h2 className="text-lg font-bold text-white">Nueva Transacción Manual</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
              Tipo de Movimiento
            </label>
            <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setType('INCOME');
                  setCategory('Venta Presencial');
                }}
                className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${
                  type === 'INCOME'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Ingreso (+)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('EXPENSE');
                  setCategory('Insumos');
                }}
                className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${
                  type === 'EXPENSE'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Minus className="w-4 h-4" />
                <span>Egreso (-)</span>
              </button>
            </div>
          </div>

          {/* Amount & Date Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Monto ($ ARS)
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Fecha</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {categoriesForType.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Descripción / Concepto
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Compra 2 rollos filamento PLA negro"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all ${
                type === 'INCOME'
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-rose-600 hover:bg-rose-500'
              }`}
            >
              Guardar {type === 'INCOME' ? 'Ingreso' : 'Egreso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
