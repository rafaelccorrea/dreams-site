import { api } from './api';
import type {
  FinancialApprovalRequest,
  CreateApprovalRequestData,
  ApproveRequestData,
  RejectRequestData,
} from '../types/financial';

class FinancialApprovalApiService {
  private readonly baseUrl = '/financial/approvals';

  /**
   * Criar uma nova solicitação de aprovação financeira
   */
  async create(
    data: CreateApprovalRequestData
  ): Promise<FinancialApprovalRequest> {
    try {
      console.log('💼 Criando solicitação de aprovação financeira:', data);
      const response = await api.post(this.baseUrl, data);
      console.log(
        '✅ Solicitação de aprovação criada com sucesso:',
        response.data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar solicitação de aprovação:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Listar solicitações pendentes
   */
  async listPending(): Promise<FinancialApprovalRequest[]> {
    try {
      console.log('📋 Listando solicitações de aprovação pendentes');
      const response = await api.get(`${this.baseUrl}/pending`);
      console.log('✅ Solicitações listadas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar solicitações:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar solicitação por ID
   */
  async findById(id: string): Promise<FinancialApprovalRequest> {
    try {
      console.log('🔍 Buscando solicitação de aprovação:', id);
      const response = await api.get(`${this.baseUrl}/${id}`);
      console.log('✅ Solicitação encontrada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar solicitação:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Aprovar solicitação
   */
  async approve(
    id: string,
    data: ApproveRequestData = {}
  ): Promise<FinancialApprovalRequest> {
    try {
      console.log('✅ Aprovando solicitação:', id, data);
      const response = await api.patch(`${this.baseUrl}/${id}/approve`, data);
      console.log('✅ Solicitação aprovada com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao aprovar solicitação:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Recusar solicitação
   */
  async reject(
    id: string,
    data: RejectRequestData
  ): Promise<FinancialApprovalRequest> {
    try {
      console.log('❌ Recusando solicitação:', id, data);
      const response = await api.patch(`${this.baseUrl}/${id}/reject`, data);
      console.log('✅ Solicitação recusada com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao recusar solicitação:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Tratar erros da API
   */
  private handleError(error: any): Error {
    console.error('🔍 Erro detalhado na API:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response) {
      // Erro de resposta da API
      const message =
        error.response.data?.message || 'Erro interno do servidor';
      const status = error.response.status;

      switch (status) {
        case 400:
          return new Error(`Dados inválidos: ${message}`);
        case 401:
          return new Error('Não autorizado. Faça login novamente.');
        case 403:
          return new Error(
            'Acesso negado. Você não tem permissão para esta ação.'
          );
        case 404:
          return new Error('Solicitação não encontrada.');
        case 409:
          return new Error(`Conflito: ${message}`);
        case 422:
          return new Error(`Dados de validação inválidos: ${message}`);
        case 500:
          return new Error(
            'Erro interno do servidor. Tente novamente mais tarde.'
          );
        default:
          return new Error(`Erro ${status}: ${message}`);
      }
    } else if (error.request) {
      // Erro de rede
      return new Error(
        'Erro de conexão. Verifique sua internet e tente novamente.'
      );
    } else {
      // Outros erros
      return new Error('Erro inesperado. Tente novamente.');
    }
  }
}

// Exportar instância única
export const financialApprovalApi = new FinancialApprovalApiService();
export default financialApprovalApi;
