import { useState, useEffect, useCallback } from 'react';
import { commissionsApi } from '../services/commissionApi';
import type {
  Commission,
  CreateCommissionDTO,
  UpdateCommissionDTO,
  RejectCommissionDTO,
  PayCommissionDTO,
  CommissionFilters,
  CommissionsListResponse,
  CommissionReport,
} from '../types/commission';

export interface CommissionCalculation {
  baseValue: number;
  percentage: number;
  taxPercentage: number;
  commissionValue: number;
  taxValue: number;
  netValue: number;
  breakdown?: {
    grossCommission: number;
    companyBonus: number;
    referralBonus: number;
    incomeTax: number;
    socialSecurity: number;
    otherTaxes: number;
    advertisingCost: number;
    transportCost: number;
    officeExpenses: number;
  };
}

export interface CommissionStatistics {
  total: number;
  pending: number;
  approved: number;
  paid: number;
  rejected: number;
  totalValue: number;
  pendingValue: number;
  approvedValue: number;
  paidValue: number;
  // Campos adicionais para compatibilidade com a página
  totalPending: number;
  totalPaid: number;
  thisMonthValue: number;
}

export const useCommissions = (filters?: CommissionFilters) => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<CommissionStatistics>({
    total: 0,
    pending: 0,
    approved: 0,
    paid: 0,
    rejected: 0,
    totalValue: 0,
    pendingValue: 0,
    approvedValue: 0,
    paidValue: 0,
    totalPending: 0,
    totalPaid: 0,
    thisMonthValue: 0,
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCommissions = useCallback(
    async (newFilters?: CommissionFilters) => {
      try {
        setLoading(true);
        setError(null);
        const filtersToUse = newFilters || filters;
        const response = await commissionsApi.getCommissions(filtersToUse);
        setCommissions(response.data);
        setTotal(response.total);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar comissões');
        setCommissions([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const getCommission = useCallback(async (id: string): Promise<Commission> => {
    try {
      return await commissionsApi.getCommissionById(id);
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao buscar comissão');
    }
  }, []);

  const createCommission = useCallback(
    async (data: CreateCommissionDTO): Promise<Commission> => {
      try {
        setIsCreating(true);
        const response = await commissionsApi.createCommission(data);
        await fetchCommissions(); // Recarregar lista
        return response;
      } catch (err: any) {
        throw new Error(err.message || 'Erro ao criar comissão');
      } finally {
        setIsCreating(false);
      }
    },
    [fetchCommissions]
  );

  const deleteCommission = useCallback(
    async (id: string): Promise<void> => {
      try {
        setIsDeleting(true);
        await commissionsApi.deleteCommission(id);
        await fetchCommissions(); // Recarregar lista
      } catch (err: any) {
        throw new Error(err.message || 'Erro ao deletar comissão');
      } finally {
        setIsDeleting(false);
      }
    },
    [fetchCommissions]
  );

  const calculateCommission = useCallback(
    async (data: {
      baseValue: number;
      percentage: number;
      taxPercentage: number;
    }): Promise<CommissionCalculation> => {
      try {
        setIsCalculating(true);

        // Calcular valores
        const commissionValue = (data.baseValue * data.percentage) / 100;
        const taxValue = (commissionValue * data.taxPercentage) / 100;
        const netValue = commissionValue - taxValue;

        return {
          baseValue: data.baseValue,
          percentage: data.percentage,
          taxPercentage: data.taxPercentage,
          commissionValue,
          taxValue,
          netValue,
        };
      } catch (err: any) {
        throw new Error(err.message || 'Erro ao calcular comissão');
      } finally {
        setIsCalculating(false);
      }
    },
    []
  );

  const loadStatistics = useCallback(async () => {
    try {
      // Calculate statistics from current commissions
      const pendingCommissions = commissions.filter(
        c => c.status === 'pending'
      );
      const paidCommissions = commissions.filter(c => c.status === 'paid');

      // Calcular valor deste mês (comissões criadas no mês atual)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonthCommissions = commissions.filter(c => {
        const commissionDate = new Date(c.createdAt);
        return (
          commissionDate.getMonth() === currentMonth &&
          commissionDate.getFullYear() === currentYear
        );
      });

      const stats: CommissionStatistics = {
        total: commissions.length,
        pending: pendingCommissions.length,
        approved: commissions.filter(c => c.status === 'approved').length,
        paid: paidCommissions.length,
        rejected: commissions.filter(c => c.status === 'rejected').length,
        totalValue: commissions.reduce((sum, c) => sum + (c.netValue || 0), 0),
        pendingValue: pendingCommissions.reduce(
          (sum, c) => sum + (c.netValue || 0),
          0
        ),
        approvedValue: commissions
          .filter(c => c.status === 'approved')
          .reduce((sum, c) => sum + (c.netValue || 0), 0),
        paidValue: paidCommissions.reduce(
          (sum, c) => sum + (c.netValue || 0),
          0
        ),
        // Campos adicionais para compatibilidade
        totalPending: pendingCommissions.reduce(
          (sum, c) => sum + (c.netValue || 0),
          0
        ),
        totalPaid: paidCommissions.reduce(
          (sum, c) => sum + (c.netValue || 0),
          0
        ),
        thisMonthValue: thisMonthCommissions.reduce(
          (sum, c) => sum + (c.netValue || 0),
          0
        ),
      };

      console.log('📊 Estatísticas calculadas:', stats);
      setStatistics(stats);
    } catch (err: any) {
      console.error('❌ Erro ao calcular estatísticas:', err);
    }
  }, [commissions]);

  const updateCommission = useCallback(
    async (id: string, data: UpdateCommissionDTO): Promise<Commission> => {
      try {
        const response = await commissionsApi.updateCommission(id, data);
        await fetchCommissions(); // Recarregar lista
        return response;
      } catch (err: any) {
        throw new Error(err.message || 'Erro ao atualizar comissão');
      }
    },
    [fetchCommissions]
  );

  const approveCommission = useCallback(
    async (id: string): Promise<Commission> => {
      try {
        const response = await commissionsApi.approveCommission(id);
        await fetchCommissions(); // Recarregar lista
        return response;
      } catch (err: any) {
        throw new Error(err.message || 'Erro ao aprovar comissão');
      }
    },
    [fetchCommissions]
  );

  const rejectCommission = useCallback(
    async (id: string, data: RejectCommissionDTO): Promise<Commission> => {
      try {
        const response = await commissionsApi.rejectCommission(id, data);
        await fetchCommissions(); // Recarregar lista
        return response;
      } catch (err: any) {
        throw new Error(err.message || 'Erro ao rejeitar comissão');
      }
    },
    [fetchCommissions]
  );

  const payCommission = useCallback(
    async (id: string, data: PayCommissionDTO): Promise<Commission> => {
      try {
        const response = await commissionsApi.payCommission(id, data);
        await fetchCommissions(); // Recarregar lista
        return response;
      } catch (err: any) {
        throw new Error(err.message || 'Erro ao processar pagamento');
      }
    },
    [fetchCommissions]
  );

  const getReport = useCallback(
    async (reportFilters: {
      startDate: string;
      endDate: string;
      status?: string;
      userId?: string;
      type?: string;
    }): Promise<CommissionReport> => {
      try {
        return await commissionsApi.generateReport(reportFilters);
      } catch (err: any) {
        throw new Error(err.message || 'Erro ao buscar relatório de comissões');
      }
    },
    []
  );

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  return {
    commissions,
    total,
    loading,
    error,
    statistics,
    isCalculating,
    isCreating,
    isDeleting,
    isLoading: loading,
    loadCommissions: fetchCommissions,
    loadStatistics,
    fetchCommissions,
    getCommission,
    createCommission,
    updateCommission,
    approveCommission,
    rejectCommission,
    payCommission,
    getReport,
    calculateCommission,
    deleteCommission,
  };
};
