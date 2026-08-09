import { format, subMonths, parseISO } from 'date-fns';
import type { FinancialTransaction } from '../types';

export interface FinanceKpiStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  profitMargin: number;
  incomeChangePercentage: number | null;
  expenseChangePercentage: number | null;
}

export function calculateFinanceKpis(
  transactions: FinancialTransaction[],
  selectedMonth: string
): FinanceKpiStats {
  const currentMonthTx = transactions.filter(
    (t) => format(parseISO(t.date), 'yyyy-MM') === selectedMonth
  );

  const prevMonthDate = subMonths(parseISO(`${selectedMonth}-01`), 1);
  const prevMonth = format(prevMonthDate, 'yyyy-MM');

  const prevMonthTx = transactions.filter(
    (t) => t.date && t.date.slice(0, 7) === prevMonth
  );

  const totalIncome = currentMonthTx
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = currentMonthTx
    .filter((t) => t.type === 'OUTCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;

  const prevIncome = prevMonthTx
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const prevExpense = prevMonthTx
    .filter((t) => t.type === 'OUTCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  let incomeChangePercentage: number | null = null;
  if (prevIncome > 0) {
    incomeChangePercentage = ((totalIncome - prevIncome) / prevIncome) * 100;
  } else if (totalIncome > 0 && prevMonthTx.length > 0) {
    incomeChangePercentage = 100;
  }

  let expenseChangePercentage: number | null = null;
  if (prevExpense > 0) {
    expenseChangePercentage = ((totalExpense - prevExpense) / prevExpense) * 100;
  } else if (totalExpense > 0 && prevMonthTx.length > 0) {
    expenseChangePercentage = 100;
  }

  return {
    totalIncome,
    totalExpense,
    netBalance,
    profitMargin,
    incomeChangePercentage,
    expenseChangePercentage,
  };
}
