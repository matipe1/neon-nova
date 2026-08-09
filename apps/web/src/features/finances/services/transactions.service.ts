import { supabase } from '../../../lib/supabase';
import type { CreateFinancialTransaction, FinancialTransaction } from '../types';

export const getTransactions = async (): Promise<FinancialTransaction[]> => {
  const { data, error } = await supabase
    .from('financial_transactions')
    .select('*, categories(id, name)')
    .order('date', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item) => {
    const catName = Array.isArray(item.categories)
      ? item.categories[0]?.name
      : item.categories?.name;

    return {
      id: item.id,
      type: item.type,
      amount: Number(item.amount),
      category_id: item.category_id,
      category: catName ?? 'Sin categoría',
      description: item.description,
      date: item.date,
      order_id: item.order_id,
      created_at: item.created_at,
    };
  });
};

export const createTransaction = async (
  tx: CreateFinancialTransaction
): Promise<FinancialTransaction> => {
  const { data, error } = await supabase
    .from('financial_transactions')
    .insert(tx)
    .select('*, categories(id, name)')
    .single();

  if (error) throw error;

  const catName = Array.isArray(data.categories)
    ? data.categories[0]?.name
    : data.categories?.name;

  return {
    id: data.id,
    type: data.type,
    amount: Number(data.amount),
    category_id: data.category_id,
    category: catName ?? 'Sin categoría',
    description: data.description,
    date: data.date,
    order_id: data.order_id,
    created_at: data.created_at,
  };
};

export const deleteTransaction = async (txId: string): Promise<void> => {
  const { error } = await supabase
    .from('financial_transactions')
    .delete()
    .eq('id', txId);
  if (error) throw error;
};

