import { useState, useCallback } from 'react';
import { financialApprovalApi } from '../services/financialApprovalApi';
import { useAutoReloadOnCompanyChange } from './useCompanyMonitor';
import type {
  FinancialApprovalRequest,
  CreateApprovalRequestData,
  ApproveRequestData,
  RejectRequestData,
} from '../types/financial';

interface UseFinancialApprovalsReturn {
  // Estados
  approvals: FinancialApprovalRequest[];
  currentApproval: FinancialApprovalRequest | null;
  isLoading: boolean;
  error: string | null;

  // Ações
  createApproval: (
    data: CreateApprovalRequestData
  ) => Promise<FinancialApprovalRequest>;
  getPendingApprovals: () => Promise<void>;
  getApprovalById: (id: string) => Promise<FinancialApprovalRequest>;
  approveRequest: (
    id: string,
    data?: ApproveRequestData
  ) => Promise<FinancialApprovalRequest>;
  rejectRequest: (
    id: string,
    data: RejectRequestData
  ) => Promise<FinancialApprovalRequest>;

  // Utilitários
  clearError: () => void;
  setCurrentApproval: (approval: FinancialApprovalRequest | null) => void;
  refreshApprovals: () => Promise<void>;
}

export const useFinancialApprovals = (): UseFinancialApprovalsReturn => {
  // Estados principais
  const [approvals, setApprovals] = useState<FinancialApprovalRequest[]>([]);
  const [currentApproval, setCurrentApproval] =
    useState<FinancialApprovalRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Criar solicitação de aprovação
  const createApproval = useCallback(
    async (
      data: CreateApprovalRequestData
    ): Promise<FinancialApprovalRequest> => {
      setIsLoading(true);
      setError(null);

      try {
        const newApproval = await financialApprovalApi.create(data);

        // Adicionar à lista local
        setApprovals(prev => [newApproval, ...prev]);

        return newApproval;
      } catch (err: any) {
        const errorMessage =
          err.message || 'Erro ao criar solicitação de aprovação';
        console.error('❌ Erro ao criar solicitação via hook:', errorMessage);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Listar solicitações pendentes
  const getPendingApprovals = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await financialApprovalApi.listPending();
      setApprovals(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao listar solicitações';
      console.error('❌ Erro ao listar solicitações via hook:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar solicitação por ID
  const getApprovalById = useCallback(
    async (id: string): Promise<FinancialApprovalRequest> => {
      setIsLoading(true);
      setError(null);

      try {
        const approval = await financialApprovalApi.findById(id);
        setCurrentApproval(approval);
        return approval;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao buscar solicitação';
        console.error('❌ Erro ao buscar solicitação via hook:', errorMessage);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Aprovar solicitação
  const approveRequest = useCallback(
    async (
      id: string,
      data: ApproveRequestData = {}
    ): Promise<FinancialApprovalRequest> => {
      setIsLoading(true);
      setError(null);

      try {
        const approved = await financialApprovalApi.approve(id, data);

        // Atualizar na lista local
        setApprovals(prev =>
          prev.map(approval => (approval.id === id ? approved : approval))
        );

        // Atualizar aprovação atual se for a mesma
        if (currentApproval?.id === id) {
          setCurrentApproval(approved);
        }

        return approved;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao aprovar solicitação';
        console.error('❌ Erro ao aprovar solicitação via hook:', errorMessage);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentApproval?.id]
  );

  // Recusar solicitação
  const rejectRequest = useCallback(
    async (
      id: string,
      data: RejectRequestData
    ): Promise<FinancialApprovalRequest> => {
      setIsLoading(true);
      setError(null);

      try {
        const rejected = await financialApprovalApi.reject(id, data);

        // Atualizar na lista local
        setApprovals(prev =>
          prev.map(approval => (approval.id === id ? rejected : approval))
        );

        // Atualizar aprovação atual se for a mesma
        if (currentApproval?.id === id) {
          setCurrentApproval(rejected);
        }

        return rejected;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao recusar solicitação';
        console.error('❌ Erro ao recusar solicitação via hook:', errorMessage);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentApproval?.id]
  );

  // Atualizar aprovação atual
  const setCurrentApprovalCallback = useCallback(
    (approval: FinancialApprovalRequest | null) => {
      setCurrentApproval(approval);
    },
    []
  );

  // Atualizar lista de aprovações
  const refreshApprovals = useCallback(async (): Promise<void> => {
    await getPendingApprovals();
  }, [getPendingApprovals]);

  // Função estável para recarregar dados (sem dependências para evitar loop)
  const reloadApprovals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await financialApprovalApi.listPending();
      setApprovals(data);
    } catch (error: any) {
      console.error(
        '❌ Erro ao recarregar aprovações após mudança de empresa:',
        error
      );
      setError(
        error.response?.data?.message || 'Erro ao recarregar aprovações'
      );
    } finally {
      setIsLoading(false);
    }
  }, []); // Sem dependências para evitar loop

  // Monitorar mudanças de empresa e recarregar dados automaticamente
  useAutoReloadOnCompanyChange(reloadApprovals);

  return {
    // Estados
    approvals,
    currentApproval,
    isLoading,
    error,

    // Ações
    createApproval,
    getPendingApprovals,
    getApprovalById,
    approveRequest,
    rejectRequest,

    // Utilitários
    clearError,
    setCurrentApproval: setCurrentApprovalCallback,
    refreshApprovals,
  };
};
