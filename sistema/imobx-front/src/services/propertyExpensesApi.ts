import { api } from './api';
import type {
  PropertyExpense,
  CreatePropertyExpenseData,
  UpdatePropertyExpenseData,
  PropertyExpenseFilters,
  PaginatedPropertyExpenseResponse,
  PropertyExpenseSummary,
} from '../types/propertyExpense';

class PropertyExpensesApiService {
  private readonly baseUrl = '/properties';

  /**
   * Criar uma nova despesa de propriedade
   */
  async createExpense(
    propertyId: string,
    data: CreatePropertyExpenseData
  ): Promise<PropertyExpense> {
    try {
      console.log('📤 Criando despesa:', { propertyId, data });
      const response = await api.post(
        `${this.baseUrl}/${propertyId}/expenses`,
        data
      );
      console.log('📥 Resposta da API:', response.data);

      // Tratar resposta com wrapper success/data se existir
      if (response.data?.success && response.data?.data) {
        console.log(
          '✅ Despesa criada com sucesso (wrapper):',
          response.data.data
        );
        return response.data.data;
      }

      // Se response.data é um array, pegar o primeiro item (compatibilidade)
      if (Array.isArray(response.data)) {
        console.log('✅ Despesa criada com sucesso (array):', response.data[0]);
        return response.data[0];
      }

      console.log('✅ Despesa criada com sucesso (direto):', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar despesa:', error);
      console.error('❌ Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw this.handleError(error);
    }
  }

  /**
   * Listar despesas de uma propriedade
   */
  async getExpenses(
    propertyId: string,
    filters: PropertyExpenseFilters = {}
  ): Promise<PaginatedPropertyExpenseResponse> {
    try {
      const params = new URLSearchParams();

      // Adicionar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const queryString = params.toString();
      const url = `${this.baseUrl}/${propertyId}/expenses${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);
      console.log('📦 Resposta completa da API getExpenses:', response.data);

      // Tratar resposta com wrapper success/data se existir
      let expensesData: PropertyExpense[] = [];
      let paginationData: any = {};

      if (response.data?.success && response.data?.data) {
        // Resposta com wrapper success/data
        expensesData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        // Se houver dados de paginação no wrapper, usar eles
        paginationData = {
          total: response.data.total || expensesData.length,
          page: response.data.page || 1,
          limit: response.data.limit || expensesData.length,
          totalPages: response.data.totalPages || 1,
        };
      } else if (Array.isArray(response.data)) {
        // Resposta direta como array
        expensesData = response.data;
        paginationData = {
          total: expensesData.length,
          page: 1,
          limit: expensesData.length,
          totalPages: 1,
        };
      } else if (response.data?.data) {
        // Resposta com estrutura de paginação
        expensesData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        paginationData = {
          total: response.data.total || expensesData.length,
          page: response.data.page || 1,
          limit: response.data.limit || expensesData.length,
          totalPages: response.data.totalPages || 1,
        };
      }

      console.log('✅ Dados processados:', { expensesData, paginationData });

      return {
        data: expensesData,
        ...paginationData,
      };
    } catch (error: any) {
      console.error('❌ Erro ao listar despesas:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar despesa por ID
   */
  async getExpenseById(
    propertyId: string,
    expenseId: string
  ): Promise<PropertyExpense> {
    try {
      const response = await api.get(
        `${this.baseUrl}/${propertyId}/expenses/${expenseId}`
      );
      // Tratar resposta com wrapper success/data se existir
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar despesa:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar despesa
   */
  async updateExpense(
    propertyId: string,
    expenseId: string,
    data: UpdatePropertyExpenseData
  ): Promise<PropertyExpense> {
    try {
      const response = await api.patch(
        `${this.baseUrl}/${propertyId}/expenses/${expenseId}`,
        data
      );
      // Tratar resposta com wrapper success/data se existir
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar despesa:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Marcar despesa como paga
   */
  async markAsPaid(
    propertyId: string,
    expenseId: string,
    paidDate?: string
  ): Promise<PropertyExpense> {
    try {
      const params = paidDate ? `?paidDate=${paidDate}` : '';
      const response = await api.patch(
        `${this.baseUrl}/${propertyId}/expenses/${expenseId}/mark-as-paid${params}`
      );
      // Tratar resposta com wrapper success/data se existir
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao marcar despesa como paga:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remover despesa
   */
  async deleteExpense(propertyId: string, expenseId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${propertyId}/expenses/${expenseId}`);
    } catch (error: any) {
      console.error('❌ Erro ao remover despesa:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter resumo de despesas de uma propriedade
   */
  async getExpensesSummary(
    propertyId: string
  ): Promise<PropertyExpenseSummary> {
    try {
      const response = await api.get(
        `${this.baseUrl}/${propertyId}/expenses/summary`
      );
      console.log(
        '📊 Resposta completa da API getExpensesSummary:',
        response.data
      );

      // Tratar resposta com wrapper success/data se existir
      let rawData: any = null;

      if (response.data?.success && response.data?.data) {
        // Resposta com wrapper success/data
        rawData = response.data.data;
      } else if (response.data && !response.data.success) {
        // Resposta direta sem wrapper
        rawData = response.data;
      }

      if (!rawData) {
        throw new Error('Resposta da API não contém dados de summary');
      }

      // Mapear campos da API para a interface esperada
      // A API retorna: { total, pending, paid, overdue, totalAmount, pendingAmount, paidAmount, overdueAmount }
      const summaryData: PropertyExpenseSummary = {
        totalPending: rawData.pending || rawData.totalPending || 0,
        totalOverdue: rawData.overdue || rawData.totalOverdue || 0,
        totalPaid: rawData.paid || rawData.totalPaid || 0,
        totalCancelled: rawData.cancelled || rawData.totalCancelled || 0,
        totalPendingAmount:
          rawData.pendingAmount || rawData.totalPendingAmount || 0,
        totalOverdueAmount:
          rawData.overdueAmount || rawData.totalOverdueAmount || 0,
        totalPaidAmount: rawData.paidAmount || rawData.totalPaidAmount || 0,
        totalAmount: rawData.totalAmount || rawData.total || 0,
        upcomingExpenses: rawData.upcomingExpenses || [],
      };

      console.log('✅ Summary processado e mapeado:', summaryData);

      return summaryData;
    } catch (error: any) {
      console.error('❌ Erro ao obter resumo de despesas:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Listar todas as despesas (de todas as propriedades)
   */
  async getAllExpenses(
    filters: PropertyExpenseFilters = {}
  ): Promise<PaginatedPropertyExpenseResponse> {
    try {
      const params = new URLSearchParams();

      // Adicionar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const queryString = params.toString();
      const url = `/expenses${queryString ? `?${queryString}` : ''}`;

      console.log('📦 Buscando todas as despesas da empresa:', url);
      const response = await api.get(url);
      console.log('📦 Resposta completa da API getAllExpenses:', response.data);

      // Tratar resposta com wrapper success/data se existir
      // A documentação mostra que retorna: { success: true, data: PropertyExpenseResponseDto[] }
      let expensesData: PropertyExpense[] = [];
      let paginationData: any = {};

      if (response.data?.success && response.data?.data) {
        // Resposta com wrapper success/data
        expensesData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        paginationData = {
          total: response.data.total || expensesData.length,
          page: response.data.page || 1,
          limit: response.data.limit || expensesData.length,
          totalPages: response.data.totalPages || 1,
        };
      } else if (Array.isArray(response.data)) {
        // Resposta direta como array
        expensesData = response.data;
        paginationData = {
          total: expensesData.length,
          page: 1,
          limit: expensesData.length,
          totalPages: 1,
        };
      } else if (response.data?.data) {
        // Resposta com estrutura de paginação
        expensesData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        paginationData = {
          total: response.data.total || expensesData.length,
          page: response.data.page || 1,
          limit: response.data.limit || expensesData.length,
          totalPages: response.data.totalPages || 1,
        };
      }

      console.log('✅ Dados processados getAllExpenses:', {
        expensesData,
        paginationData,
      });

      return {
        data: expensesData,
        ...paginationData,
      };
    } catch (error: any) {
      console.error('❌ Erro ao listar todas as despesas:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Tratamento de erros
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Erro com resposta do servidor
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        'Erro desconhecido';
      const status = error.response.status;

      if (status === 401) {
        return new Error('Não autorizado. Faça login novamente.');
      } else if (status === 403) {
        const moduleMessage =
          message.includes('módulo') || message.includes('module')
            ? message
            : 'Você não tem acesso ao módulo de Gestão de Propriedades.';
        return new Error(moduleMessage);
      } else if (status === 404) {
        return new Error('Despesa não encontrada.');
      } else if (status === 422) {
        return new Error(message || 'Dados inválidos.');
      } else if (status >= 500) {
        return new Error('Erro no servidor. Tente novamente mais tarde.');
      }

      return new Error(message);
    } else if (error.request) {
      // Erro de rede
      return new Error('Erro de conexão. Verifique sua internet.');
    } else {
      // Outro tipo de erro
      return new Error(error.message || 'Erro desconhecido');
    }
  }
}

export const propertyExpensesApi = new PropertyExpensesApiService();
