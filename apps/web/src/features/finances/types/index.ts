export type TransactionType = 'INCOME' | 'OUTCOME';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  is_active: boolean;
  created_at: string;
}

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  category_id: string;
  category: string;
  description: string;
  date: string;
  order_id?: string | null;
  created_at: string;
}

export type CreateFinancialTransaction = Omit<
  FinancialTransaction,
  'id' | 'created_at' | 'category'
>;