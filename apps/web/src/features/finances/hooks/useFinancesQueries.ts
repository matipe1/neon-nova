import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTransactions, createTransaction, deleteTransaction } from '../services/transactions.service';
import { getCategories } from '../services/categories.service';
import type { CreateFinancialTransaction } from '../types';

export const FINANCES_QUERY_KEYS = {
  transactions: ['transactions'] as const,
  categories: ['categories'] as const,
};

export const useTransactionsQuery = () => {
  return useQuery({
    queryKey: FINANCES_QUERY_KEYS.transactions,
    queryFn: getTransactions,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: FINANCES_QUERY_KEYS.categories,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,
  });
};

interface CreateTransactionOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCreateTransactionMutation = (options?: CreateTransactionOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTx: CreateFinancialTransaction) => createTransaction(newTx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCES_QUERY_KEYS.transactions });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useDeleteTransactionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (txId: string) => deleteTransaction(txId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCES_QUERY_KEYS.transactions });
    },
  });
};
