import type { FinancialTransaction, TransactionType, TransactionCategory } from '../types/domain';
import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { format, parseISO } from 'date-fns';
import { FinanceHeader } from '../components/features/finances/FinanceHeader';
import { FinanceKpiCards } from '../components/features/finances/FinanceKpiCards';
import { CategoryBreakdown } from '../components/features/finances/CategoryBreakdown';
import { TransactionTable } from '../components/features/finances/TransactionTable';
import { NewTransactionModal } from '../components/features/finances/NewTransactionModal';

export const Route = createFileRoute('/finances')({
  component: RouteComponent,
});

const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx-101',
    type: 'INCOME',
    amount: 145000,
    category: 'Venta Catálogo',
    description: 'Pago Pedido #PED-104 - Cartel Neón Bar',
    date: '2026-08-08T10:30:00Z',
    order_id: 'PED-104',
    created_at: '2026-08-08T10:30:00Z',
  },
  {
    id: 'tx-102',
    type: 'EXPENSE',
    amount: 48500,
    category: 'Insumos',
    description: 'Compra 4kg Filamento PLA Negro Grilon3',
    date: '2026-08-07T14:15:00Z',
    created_at: '2026-08-07T14:15:00Z',
  },
  {
    id: 'tx-103',
    type: 'INCOME',
    amount: 92000,
    category: 'Venta Redes',
    description: 'Pago Pedido #PED-103 - Lámpara 3D Personalizada',
    date: '2026-08-06T18:40:00Z',
    order_id: 'PED-103',
    created_at: '2026-08-06T18:40:00Z',
  },
  {
    id: 'tx-104',
    type: 'EXPENSE',
    amount: 32000,
    category: 'Servicios',
    description: 'Factura Electricidad / Granja de Impresoras 3D',
    date: '2026-08-04T09:00:00Z',
    created_at: '2026-08-04T09:00:00Z',
  },
  {
    id: 'tx-105',
    type: 'INCOME',
    amount: 35000,
    category: 'Venta Presencial',
    description: 'Venta Mostrador - Soporte Auriculares 3D (Efectivo)',
    date: '2026-08-02T11:20:00Z',
    created_at: '2026-08-02T11:20:00Z',
  },
];

const getCurrentMonthValue = () => {
  return format(new Date(), 'yyyy-MM');
};

function RouteComponent() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType] = useState<TransactionType>('INCOME');

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleAddTransaction = (newTxData: {
    type: TransactionType;
    amount: number;
    category: TransactionCategory;
    description: string;
    date: string;
  }) => {
    const newTx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      ...newTxData,
      created_at: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Filter transactions matching the selected YYYY-MM period using date-fns
  const monthlyTransactions = transactions.filter(
    (t) => format(parseISO(t.date), 'yyyy-MM') === selectedMonth
  );

  const totalIncome = monthlyTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = monthlyTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-zinc-100 animate-in fade-in duration-200">
      <FinanceHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onOpenModal={handleOpenModal}
      />

      <FinanceKpiCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        netBalance={netBalance}
      />

      <CategoryBreakdown transactions={monthlyTransactions} />

      <TransactionTable
        transactions={monthlyTransactions}
        onDeleteTransaction={handleDeleteTransaction}
      />

      <NewTransactionModal
        isOpen={isModalOpen}
        initialType={modalType}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTransaction}
      />
    </div>
  );
}
