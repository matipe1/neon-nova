import { useState } from 'react';
import type { TransactionType, CreateFinancialTransaction } from '@/features/finances/types';
import { createFileRoute } from '@tanstack/react-router';
import { format, parseISO } from 'date-fns';
import {
  FinanceHeader,
  FinanceKpiCards,
  CategoryBreakdown,
  TransactionTable,
  NewTransactionModal,
  calculateFinanceKpis,
  useTransactionsQuery,
  useCategoriesQuery,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
} from '../features/finances';

export const Route = createFileRoute('/finances')({
  component: FinancesComponent,
});

function FinancesComponent() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType] = useState<TransactionType>('INCOME');
  const [mutationError, setMutationError] = useState<string | null>(null);

  const { data: transactions = [], isLoading, error: txError } = useTransactionsQuery();
  const { data: categories = [] } = useCategoriesQuery();

  const createMutation = useCreateTransactionMutation({
    onSuccess: () => {
      setMutationError(null);
      setIsModalOpen(false);
    },
    onError: (err) => {
      setMutationError(err.message || 'Error al guardar la transacción');
    },
  });

  const deleteMutation = useDeleteTransactionMutation();

  const handleOpenModal = () => {
    setMutationError(null);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (newTx: CreateFinancialTransaction) => {
    setMutationError(null);
    createMutation.mutate(newTx);
  };

  // Calculate stats & month-over-month variations
  const kpiStats = calculateFinanceKpis(transactions, selectedMonth);

  const monthlyTransactions = transactions.filter((t) => {
    try {
      return format(parseISO(t.date), 'yyyy-MM') === selectedMonth;
    } catch {
      return false;
    }
  });

  if (isLoading) return <div className="p-8 text-zinc-400">Cargando finanzas...</div>;
  if (txError) return <div className="p-8 text-rose-400">Error al cargar finanzas: {txError.message}</div>;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-zinc-100 animate-in fade-in duration-200">
      <FinanceHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onOpenModal={handleOpenModal}
      />

      <FinanceKpiCards {...kpiStats} />

      <CategoryBreakdown transactions={monthlyTransactions} />

      <TransactionTable
        transactions={monthlyTransactions}
        onDeleteTransaction={(txId: string) => deleteMutation.mutate(txId)}
      />

      <NewTransactionModal
        isOpen={isModalOpen}
        initialType={modalType}
        categories={categories}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        isSubmitting={createMutation.isPending}
        errorMessage={mutationError}
      />
    </div>
  );
}
