import { api } from './api';
import type {
  FinancialTransactionAudit,
  FinancialTransactionAuditFilters,
  FinancialTransactionAuditResponse,
} from '../types/financial-audit';

class FinancialAuditApiService {
  private readonly baseUrl = '/financial';

  /**
   * Buscar histórico de auditoria de uma transação específica
   */
  async getTransactionAuditHistory(
    transactionId: string
  ): Promise<FinancialTransactionAudit[]> {
    try {
      // console.log('📋 Buscando histórico de auditoria da transação:', transactionId);
      const response = await api.get(
        `${this.baseUrl}/transactions/${transactionId}/audit`
      );
      // console.log('✅ Histórico de auditoria obtido:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar histórico de auditoria:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar histórico geral de auditoria com filtros e paginação
   */
  async getAuditHistory(
    filters: FinancialTransactionAuditFilters = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<FinancialTransactionAuditResponse> {
    try {
      // console.log('📋 Listando histórico de auditoria:', { filters, pagination });
      const params = new URLSearchParams();

      // Adicionar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      // Adicionar paginação
      const page =
        Number.isNaN(pagination.page) || pagination.page < 1
          ? 1
          : pagination.page;
      const limit =
        Number.isNaN(pagination.limit) || pagination.limit < 1
          ? 20
          : pagination.limit;

      params.append('page', String(page));
      params.append('limit', String(limit));

      const response = await api.get(
        `${this.baseUrl}/audit?${params.toString()}`
      );
      // console.log('✅ Histórico de auditoria listado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar histórico de auditoria:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Tratar erros da API
   */
  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    }

    if (error.message) {
      return new Error(error.message);
    }

    return new Error('Erro desconhecido na API de auditoria financeira');
  }
}

export const financialAuditApi = new FinancialAuditApiService();
