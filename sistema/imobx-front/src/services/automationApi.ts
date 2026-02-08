import { api } from './api';
import type {
  Automation,
  AutomationTemplate,
  AutomationExecution,
  AutomationLog,
  AutomationStatistics,
  CreateAutomationData,
  UpdateAutomationConfigData,
  PaginatedAutomationResponse,
  PaginatedExecutionResponse,
  PaginatedLogResponse,
  Category,
  AutomationType,
  ExecutionStatus,
  LogLevel,
} from '../types/automation';

class AutomationApiService {
  private readonly baseUrl = '/automations';

  /**
   * Listar templates disponíveis
   */
  async getTemplates(): Promise<{ templates: AutomationTemplate[] }> {
    try {
      const url = `${this.baseUrl}/templates`;
      console.log('🔄 [AutomationApi] Buscando templates:', url);
      const response = await api.get(url);
      console.log('✅ [AutomationApi] Templates recebidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [AutomationApi] Erro ao buscar templates:', error);
      console.error('❌ [AutomationApi] Detalhes:', {
        url: `${this.baseUrl}/templates`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw this.handleError(error);
    }
  }

  /**
   * Listar automações da empresa
   */
  async getAutomations(params?: {
    companyId?: string;
    isActive?: boolean;
    type?: AutomationType;
    category?: Category;
  }): Promise<PaginatedAutomationResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.companyId) {
        queryParams.append('companyId', params.companyId);
      }
      if (params?.isActive !== undefined) {
        queryParams.append('isActive', String(params.isActive));
      }
      if (params?.type) {
        queryParams.append('type', params.type);
      }
      if (params?.category) {
        queryParams.append('category', params.category);
      }

      const url = queryParams.toString()
        ? `${this.baseUrl}?${queryParams.toString()}`
        : this.baseUrl;

      console.log('🔄 [AutomationApi] Buscando automações:', url, params);
      const response = await api.get(url);
      console.log('✅ [AutomationApi] Automações recebidas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar automações:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Criar automação a partir de template
   */
  async createAutomationFromTemplate(
    templateId: string,
    data: CreateAutomationData
  ): Promise<Automation> {
    try {
      const response = await api.post(
        `${this.baseUrl}/templates/${templateId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar automação:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter detalhes de uma automação
   */
  async getAutomationById(id: string): Promise<Automation> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar automação:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar configuração de automação
   */
  async updateAutomationConfig(
    id: string,
    data: UpdateAutomationConfigData
  ): Promise<Automation> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}/config`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar configuração:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Ativar/Desativar automação
   */
  async toggleAutomation(id: string, isActive: boolean): Promise<Automation> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}/toggle`, {
        isActive,
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao alternar automação:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter estatísticas de automação
   */
  async getAutomationStatistics(id: string): Promise<AutomationStatistics> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}/statistics`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Listar histórico de execuções
   */
  async getExecutions(
    id: string,
    params?: {
      page?: number;
      limit?: number;
      status?: ExecutionStatus;
      from?: string;
      to?: string;
    }
  ): Promise<PaginatedExecutionResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) {
        queryParams.append('page', String(params.page));
      }
      if (params?.limit) {
        queryParams.append('limit', String(params.limit));
      }
      if (params?.status) {
        queryParams.append('status', params.status);
      }
      if (params?.from) {
        queryParams.append('from', params.from);
      }
      if (params?.to) {
        queryParams.append('to', params.to);
      }

      const url = queryParams.toString()
        ? `${this.baseUrl}/${id}/executions?${queryParams.toString()}`
        : `${this.baseUrl}/${id}/executions`;

      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar execuções:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter detalhes de uma execução
   */
  async getExecutionById(
    automationId: string,
    executionId: string
  ): Promise<AutomationExecution> {
    try {
      const response = await api.get(
        `${this.baseUrl}/${automationId}/executions/${executionId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar execução:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Listar logs de automação
   */
  async getLogs(
    id: string,
    params?: {
      page?: number;
      limit?: number;
      level?: LogLevel;
      type?: string;
      executionId?: string;
      from?: string;
      to?: string;
    }
  ): Promise<PaginatedLogResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) {
        queryParams.append('page', String(params.page));
      }
      if (params?.limit) {
        queryParams.append('limit', String(params.limit));
      }
      if (params?.level) {
        queryParams.append('level', params.level);
      }
      if (params?.type) {
        queryParams.append('type', params.type);
      }
      if (params?.executionId) {
        queryParams.append('executionId', params.executionId);
      }
      if (params?.from) {
        queryParams.append('from', params.from);
      }
      if (params?.to) {
        queryParams.append('to', params.to);
      }

      const url = queryParams.toString()
        ? `${this.baseUrl}/${id}/logs?${queryParams.toString()}`
        : `${this.baseUrl}/${id}/logs`;

      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar logs:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Deletar automação
   */
  async deleteAutomation(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      console.error('❌ Erro ao deletar automação:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Tratar erros da API
   */
  private handleError(error: any): Error {
    if (error.response) {
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
            'Acesso negado. Seu plano não inclui acesso ao módulo automations.'
          );
        case 404:
          return new Error('Automação não encontrada.');
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
      return new Error(
        'Erro de conexão. Verifique sua internet e tente novamente.'
      );
    } else {
      return new Error('Erro inesperado. Tente novamente.');
    }
  }
}

// Exportar instância única
export const automationApi = new AutomationApiService();
export default automationApi;
