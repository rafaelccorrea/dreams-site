import { useState, useCallback } from 'react';
import { financialAuditApi } from '../services/financialAuditApi';
import { useAutoReloadOnCompanyChange } from './useCompanyMonitor';
import type {
  FinancialTransactionAudit,
  FinancialTransactionAuditFilters,
  FinancialTransactionAuditResponse,
} from '../types/financial-audit';

interface UseFinancialAuditReturn {
  // Estados
  auditHistory: FinancialTransactionAudit[];
  isLoading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;

  // Ações
  getTransactionAuditHistory: (
    transactionId: string
  ) => Promise<FinancialTransactionAudit[]>;
  getAuditHistory: (
    filters?: FinancialTransactionAuditFilters,
    pagination?: { page: number; limit: number }
  ) => Promise<void>;
  clearError: () => void;
  refreshAuditHistory: () => Promise<void>;

  // Filtros e paginação atuais (para refresh)
  currentFilters: FinancialTransactionAuditFilters;
  currentPagination: { page: number; limit: number };
}

export const useFinancialAudit = (): UseFinancialAuditReturn => {
  // Estados principais
  const [auditHistory, setAuditHistory] = useState<FinancialTransactionAudit[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Filtros e paginação atuais (para refresh)
  const [currentFilters, setCurrentFilters] =
    useState<FinancialTransactionAuditFilters>({});
  const [currentPagination, setCurrentPagination] = useState<{
    page: number;
    limit: number;
  }>({
    page: 1,
    limit: 20,
  });

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Buscar histórico de auditoria de uma transação específica
  const getTransactionAuditHistory = useCallback(
    async (transactionId: string): Promise<FinancialTransactionAudit[]> => {
      setIsLoading(true);
      setError(null);

      try {
        // console.log('📋 Buscando histórico de auditoria da transação via hook...');
        const history =
          await financialAuditApi.getTransactionAuditHistory(transactionId);
        // console.log('✅ Histórico de auditoria obtido via hook:', history);
        return history;
      } catch (err: any) {
        const errorMessage =
          err.message || 'Erro ao buscar histórico de auditoria';
        console.error(
          '❌ Erro ao buscar histórico de auditoria via hook:',
          errorMessage
        );
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Buscar histórico geral de auditoria
  const getAuditHistory = useCallback(
    async (
      filters: FinancialTransactionAuditFilters = {},
      pagination: { page: number; limit: number } = { page: 1, limit: 20 }
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // console.log('📋 Listando histórico de auditoria via hook...');
        // Salvar filtros e paginação atuais
        setCurrentFilters(filters);
        setCurrentPagination(pagination);

        const response = await financialAuditApi.getAuditHistory(
          filters,
          pagination
        );

        setAuditHistory(response.data);
        setTotal(response.total);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);

        // console.log('✅ Histórico de auditoria listado via hook:', response);
      } catch (err: any) {
        const errorMessage =
          err.message || 'Erro ao listar histórico de auditoria';
        console.error(
          '❌ Erro ao listar histórico de auditoria via hook:',
          errorMessage
        );
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Refresh do histórico usando filtros e paginação atuais
  const refreshAuditHistory = useCallback(async (): Promise<void> => {
    await getAuditHistory(currentFilters, currentPagination);
  }, [getAuditHistory, currentFilters, currentPagination]);

  // Função estável para recarregar dados de auditoria (sem dependências para evitar loop)
  const reloadAuditData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Recarregar histórico de auditoria
      const response = await financialAuditApi.getAuditHistory(
        {},
        { page: 1, limit: 20 }
      );
      setAuditHistory(response.data || []);
      setTotal(response.total || 0);
      setCurrentPage(response.page || 1);
      setTotalPages(response.totalPages || 1);

      // console.log('✅ Dados de auditoria financeira recarregados após mudança de empresa');
    } catch (error: any) {
      console.error(
        '❌ Erro ao recarregar dados de auditoria após mudança de empresa:',
        error
      );
      setError(
        error.response?.data?.message || 'Erro ao recarregar dados de auditoria'
      );
    } finally {
      setIsLoading(false);
    }
  }, []); // Sem dependências para evitar loop

  // Monitorar mudanças de empresa e recarregar dados de auditoria automaticamente
  useAutoReloadOnCompanyChange(reloadAuditData);

  return {
    // Estados
    auditHistory,
    isLoading,
    error,
    total,
    currentPage,
    totalPages,

    // Ações
    getTransactionAuditHistory,
    getAuditHistory,
    clearError,
    refreshAuditHistory,

    // Filtros e paginação atuais
    currentFilters,
    currentPagination,
  };
};
