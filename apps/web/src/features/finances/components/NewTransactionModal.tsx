import { useState, useEffect, useMemo } from 'react';
import { X, Plus, Minus, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { TransactionType, Category, CreateFinancialTransaction } from '@/features/finances/types';

interface NewTransactionModalProps {
  isOpen: boolean;
  initialType: TransactionType;
  categories: Category[];
  onClose: () => void;
  onSave: (data: CreateFinancialTransaction) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

export const NewTransactionModal = ({
  isOpen,
  initialType,
  categories = [],
  onClose,
  onSave,
  isSubmitting = false,
  errorMessage = null,
}: NewTransactionModalProps) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [validationError, setValidationError] = useState<string | null>(null);

  const availableCategories = useMemo(() => {
    return categories.filter((c) => c.type === type && (c.is_active ?? true));
  }, [categories, type]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setAmount('');
      setDescription('');
      setValidationError(null);

      const firstMatch = categories.find(
        (c) => c.type === initialType && (c.is_active ?? true)
      );
      setCategoryId(firstMatch ? firstMatch.id : '');
    }
  }, [isOpen, initialType, categories]);

  // Handle transaction type change
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const firstMatch = categories.find(
      (c) => c.type === newType && (c.is_active ?? true)
    );
    setCategoryId(firstMatch ? firstMatch.id : '');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setValidationError('Por favor ingresa un monto válido mayor a 0.');
      return;
    }
    if (!description.trim()) {
      setValidationError('Por favor ingresa una descripción o concepto.');
      return;
    }
    if (!categoryId) {
      setValidationError('Por favor selecciona una categoría válida.');
      return;
    }

    onSave({
      type,
      amount: numericAmount,
      category_id: categoryId,
      description: description.trim(),
      date,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 shadow-2xl space-y-5 text-zinc-100 select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h2 className="text-lg font-bold text-white">Nueva Transacción Manual</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {(validationError || errorMessage) && (
          <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError || errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
              Tipo de Movimiento
            </label>
            <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleTypeChange('INCOME')}
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
                disabled={isSubmitting}
                onClick={() => handleTypeChange('OUTCOME')}
                className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${
                  type === 'OUTCOME'
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
                step="any"
                disabled={isSubmitting}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Fecha</label>
              <input
                type="date"
                required
                disabled={isSubmitting}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Categoría</label>
            <select
              value={categoryId}
              disabled={isSubmitting || availableCategories.length === 0}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 cursor-pointer disabled:opacity-50"
            >
              {availableCategories.length === 0 ? (
                <option value="">Sin categorías disponibles</option>
              ) : (
                availableCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              )}
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
              disabled={isSubmitting}
              placeholder="Ej: Compra 2 rollos filamento PLA negro"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || availableCategories.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50 ${
                type === 'INCOME'
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-rose-600 hover:bg-rose-500'
              }`}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {isSubmitting
                  ? 'Guardando...'
                  : `Guardar ${type === 'INCOME' ? 'Ingreso' : 'Egreso'}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
