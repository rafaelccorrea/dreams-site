import { useState, useCallback } from 'react';
import { propertyExpensesApi } from '../services/propertyExpensesApi';
import type {
  PropertyExpense,
  CreatePropertyExpenseData,
  UpdatePropertyExpenseData,
  PropertyExpenseFilters,
  PropertyExpenseSummary,
  PaginatedPropertyExpenseResponse,
} from '../types/propertyExpense';

export interface UsePropertyExpensesReturn {
  // Estados
  expenses: PropertyExpense[];
  currentExpense: PropertyExpense | null;
  summary: PropertyExpenseSummary | null;
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;

  // Ações
  fetchExpenses: (
    propertyId: string,
    filters?: PropertyExpenseFilters
  ) => Promise<void>;
  fetchExpenseById: (
    propertyId: string,
    expenseId: string
  ) => Promise<PropertyExpense>;
  fetchSummary: (propertyId: string) => Promise<void>;
  createExpense: (
    propertyId: string,
    data: CreatePropertyExpenseData
  ) => Promise<PropertyExpense>;
  updateExpense: (
    propertyId: string,
    expenseId: string,
    data: UpdatePropertyExpenseData
  ) => Promise<PropertyExpense>;
  markAsPaid: (
    propertyId: string,
    expenseId: string,
    paidDate?: string
  ) => Promise<PropertyExpense>;
  deleteExpense: (propertyId: string, expenseId: string) => Promise<void>;

  // Utilitários
  clearError: () => void;
  setCurrentExpense: (expense: PropertyExpense | null) => void;
  refreshExpenses: (
    propertyId: string,
    filters?: PropertyExpenseFilters
  ) => Promise<void>;
}

/**
 * Hook para gerenciar despesas de propriedades
 */
export const usePropertyExpenses = (
  propertyId?: string
): UsePropertyExpensesReturn => {
  const [expenses, setExpenses] = useState<PropertyExpense[]>([]);
  const [currentExpense, setCurrentExpense] = useState<PropertyExpense | null>(
    null
  );
  const [summary, setSummary] = useState<PropertyExpenseSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Filtros atuais (para refresh)
  const [currentFilters, setCurrentFilters] = useState<PropertyExpenseFilters>(
    {}
  );

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Buscar despesas
  const fetchExpenses = useCallback(
    async (id: string, filters: PropertyExpenseFilters = {}) => {
      setLoading(true);
      setError(null);
      try {
        setCurrentFilters(filters);
        const response = await propertyExpensesApi.getExpenses(id, filters);
        console.log('🎣 Hook recebeu resposta:', response);
        const expensesArray = Array.isArray(response.data) ? response.data : [];
        console.log('📋 Array de despesas processado:', expensesArray);
        setExpenses(expensesArray);
        setTotal(response.total || 0);
        setCurrentPage(response.page || 1);
        setTotalPages(response.totalPages || 0);
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao buscar despesas';
        setError(errorMessage);
        console.error('❌ Erro ao buscar despesas:', errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Buscar despesa por ID
  const fetchExpenseById = useCallback(
    async (id: string, expenseId: string): Promise<PropertyExpense> => {
      setLoading(true);
      setError(null);
      try {
        const expense = await propertyExpensesApi.getExpenseById(id, expenseId);
        setCurrentExpense(expense);
        // Atualizar na lista se existir
        setExpenses(prev => prev.map(e => (e.id === expenseId ? expense : e)));
        return expense;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao buscar despesa';
        setError(errorMessage);
        console.error('❌ Erro ao buscar despesa:', errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Buscar resumo
  const fetchSummary = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const summaryData = await propertyExpensesApi.getExpensesSummary(id);
      console.log('🎣 Hook recebeu summary:', summaryData);
      setSummary(summaryData);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar resumo';
      setError(errorMessage);
      console.error('❌ Erro ao buscar resumo:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar despesa
  const createExpense = useCallback(
    async (
      id: string,
      data: CreatePropertyExpenseData
    ): Promise<PropertyExpense> => {
      console.log('🎣 Hook createExpense chamado:', { id, data });
      setLoading(true);
      setError(null);
      try {
        console.log('📡 Chamando propertyExpensesApi.createExpense...');
        const newExpense = await propertyExpensesApi.createExpense(id, data);
        console.log(
          '✅ propertyExpensesApi.createExpense retornou:',
          newExpense
        );
        // Adicionar à lista
        setExpenses(prev => [newExpense, ...prev]);
        // Atualizar total
        setTotal(prev => prev + 1);
        return newExpense;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao criar despesa';
        setError(errorMessage);
        console.error('❌ Erro ao criar despesa no hook:', errorMessage);
        console.error('❌ Erro completo:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Atualizar despesa
  const updateExpense = useCallback(
    async (
      id: string,
      expenseId: string,
      data: UpdatePropertyExpenseData
    ): Promise<PropertyExpense> => {
      setLoading(true);
      setError(null);
      try {
        const updatedExpense = await propertyExpensesApi.updateExpense(
          id,
          expenseId,
          data
        );
        // Atualizar na lista
        setExpenses(prev =>
          prev.map(e => (e.id === expenseId ? updatedExpense : e))
        );
        // Atualizar current se for o mesmo
        if (currentExpense?.id === expenseId) {
          setCurrentExpense(updatedExpense);
        }
        return updatedExpense;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao atualizar despesa';
        setError(errorMessage);
        console.error('❌ Erro ao atualizar despesa:', errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentExpense]
  );

  // Marcar como paga
  const markAsPaid = useCallback(
    async (
      id: string,
      expenseId: string,
      paidDate?: string
    ): Promise<PropertyExpense> => {
      setLoading(true);
      setError(null);
      try {
        const updatedExpense = await propertyExpensesApi.markAsPaid(
          id,
          expenseId,
          paidDate
        );
        // Atualizar na lista
        setExpenses(prev =>
          prev.map(e => (e.id === expenseId ? updatedExpense : e))
        );
        // Atualizar current se for o mesmo
        if (currentExpense?.id === expenseId) {
          setCurrentExpense(updatedExpense);
        }
        return updatedExpense;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao marcar despesa como paga';
        setError(errorMessage);
        console.error('❌ Erro ao marcar despesa como paga:', errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentExpense]
  );

  // Remover despesa
  const deleteExpense = useCallback(
    async (id: string, expenseId: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await propertyExpensesApi.deleteExpense(id, expenseId);
        // Remover da lista
        setExpenses(prev => prev.filter(e => e.id !== expenseId));
        // Atualizar total
        setTotal(prev => Math.max(0, prev - 1));
        // Limpar current se for o mesmo
        if (currentExpense?.id === expenseId) {
          setCurrentExpense(null);
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao remover despesa';
        setError(errorMessage);
        console.error('❌ Erro ao remover despesa:', errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentExpense]
  );

  // Refresh despesas
  const refreshExpenses = useCallback(
    async (id: string, filters?: PropertyExpenseFilters) => {
      await fetchExpenses(id, filters || currentFilters);
    },
    [fetchExpenses, currentFilters]
  );

  return {
    expenses,
    currentExpense,
    summary,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    fetchExpenses,
    fetchExpenseById,
    fetchSummary,
    createExpense,
    updateExpense,
    markAsPaid,
    deleteExpense,
    clearError,
    setCurrentExpense,
    refreshExpenses,
  };
};
