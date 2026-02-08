import { useState, useCallback } from 'react';
import {
  inspectionApprovalApi,
  type InspectionApproval,
  type InspectionApprovalFilters,
  type CreateInspectionApprovalRequest,
  type ApproveInspectionApprovalRequest,
  type RejectInspectionApprovalRequest,
  type InspectionApprovalListResponse,
} from '../services/inspectionApprovalApi';

export const useInspectionApproval = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Solicitar aprovação financeira
  const requestApproval = useCallback(
    async (
      data: CreateInspectionApprovalRequest
    ): Promise<InspectionApproval> => {
      try {
        setLoading(true);
        setError(null);
        // Garantir que amount seja convertido para número caso seja string
        const requestData: CreateInspectionApprovalRequest = {
          ...data,
          amount:
            typeof data.amount === 'string'
              ? parseFloat(data.amount)
              : data.amount,
        };
        const approval =
          await inspectionApprovalApi.requestApproval(requestData);
        return approval;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          'Erro ao solicitar aprovação financeira';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Listar aprovações
  const listApprovals = useCallback(
    async (
      filters: InspectionApprovalFilters = {}
    ): Promise<InspectionApprovalListResponse> => {
      try {
        setLoading(true);
        setError(null);
        const response = await inspectionApprovalApi.list(filters);
        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao listar aprovações';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Buscar aprovação por ID
  const getApprovalById = useCallback(
    async (id: string): Promise<InspectionApproval> => {
      try {
        setLoading(true);
        setError(null);
        const approval = await inspectionApprovalApi.getById(id);
        return approval;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao buscar aprovação';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Aprovar inspeção
  const approve = useCallback(
    async (
      id: string,
      data?: ApproveInspectionApprovalRequest
    ): Promise<InspectionApproval> => {
      try {
        setLoading(true);
        setError(null);
        const approval = await inspectionApprovalApi.approve(id, {
          status: 'approved',
          ...data,
        });
        return approval;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao aprovar inspeção';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Rejeitar inspeção
  const reject = useCallback(
    async (
      id: string,
      data: RejectInspectionApprovalRequest
    ): Promise<InspectionApproval> => {
      try {
        setLoading(true);
        setError(null);
        const approval = await inspectionApprovalApi.approve(id, data);
        return approval;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao rejeitar inspeção';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    requestApproval,
    listApprovals,
    getApprovalById,
    approve,
    reject,
    setError,
  };
};
