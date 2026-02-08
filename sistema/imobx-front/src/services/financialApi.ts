import { api } from './api';
import type {
  FinancialTransaction,
  CreateFinancialTransactionData,
  UpdateFinancialTransactionData,
  FinancialTransactionResponse,
  FinancialSummary,
  CategorySummary,
  MonthlySummary,
  PaginationOptions,
  FinancialTransactionFilters,
} from '../types/financial';

class FinancialApiService {
  private readonly baseUrl = '/financial';

  /**
   * Criar uma nova transação financeira
   */
  async createTransaction(
    data: CreateFinancialTransactionData
  ): Promise<FinancialTransaction> {
    try {
      // console.log('💰 Criando transação financeira:', data);
      const response = await api.post(`${this.baseUrl}/transactions`, data);
      // console.log('✅ Transação financeira criada com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar transação financeira:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Listar transações financeiras com filtros e paginação
   */
  async getTransactions(
    filters: FinancialTransactionFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<FinancialTransactionResponse> {
    try {
      console.log('📋 Listando transações financeiras:', {
        filters,
        pagination,
      });
      const params = new URLSearchParams();

      // Adicionar filtros
      Object.entries(filters).forEach(([key, value]) => {
        // Tratar onlyMyData separadamente (boolean)
        if (key === 'onlyMyData') {
          if (value === true) {
            params.append('onlyMyData', 'true');
          }
          return; // Não processar outros casos para onlyMyData
        }

        // Processar outros filtros
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item));
          } else {
            params.append(key, String(value));
          }
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

      const url = `${this.baseUrl}/transactions?${params.toString()}`;
      console.log('🌐 Chamando API financeiro:', url);
      console.log('📊 Parâmetros:', params.toString());
      const response = await api.get(url);
      console.log('✅ Transações financeiras listadas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar transações financeiras:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar transação por ID
   */
  async getTransactionById(id: string): Promise<FinancialTransaction> {
    try {
      // console.log('🔍 Buscando transação financeira:', id);
      const response = await api.get(`${this.baseUrl}/transactions/${id}`);
      // console.log('✅ Transação financeira encontrada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar transação financeira:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar transação financeira
   */
  async updateTransaction(
    id: string,
    data: UpdateFinancialTransactionData
  ): Promise<FinancialTransaction> {
    try {
      // console.log('✏️ Atualizando transação financeira:', id, data);
      const response = await api.put(
        `${this.baseUrl}/transactions/${id}`,
        data
      );
      // console.log('✅ Transação financeira atualizada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar transação financeira:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Excluir transação financeira
   */
  async deleteTransaction(id: string): Promise<void> {
    try {
      // console.log('🗑️ Excluindo transação financeira:', id);
      await api.delete(`${this.baseUrl}/transactions/${id}`);
      // console.log('✅ Transação financeira excluída com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao excluir transação financeira:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter resumo financeiro
   */
  async getFinancialSummary(
    startDate?: string,
    endDate?: string
  ): Promise<FinancialSummary> {
    try {
      // console.log('📊 Buscando resumo financeiro:', { startDate, endDate });
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(
        `${this.baseUrl}/summary?${params.toString()}`
      );
      // console.log('✅ Resumo financeiro encontrado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar resumo financeiro:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter resumo por categorias
   */
  async getCategorySummary(
    startDate?: string,
    endDate?: string
  ): Promise<CategorySummary[]> {
    try {
      // console.log('📊 Buscando resumo por categorias:', { startDate, endDate });
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(
        `${this.baseUrl}/summary/categories?${params.toString()}`
      );
      // console.log('✅ Resumo por categorias encontrado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar resumo por categorias:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter resumo mensal
   */
  async getMonthlySummary(year?: number): Promise<MonthlySummary[]> {
    try {
      // console.log('📊 Buscando resumo mensal:', { year });
      const params = new URLSearchParams();
      if (year) params.append('year', String(year));

      const response = await api.get(
        `${this.baseUrl}/summary/monthly?${params.toString()}`
      );
      // console.log('✅ Resumo mensal encontrado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar resumo mensal:', error);
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
      const details = error.response.data?.details;

      switch (status) {
        case 400:
          if (details?.validationErrors) {
            const validationMessages = details.validationErrors
              .map((err: any) => `${err.field}: ${err.message}`)
              .join('; ');
            return new Error(`Dados inválidos: ${validationMessages}`);
          }
          return new Error(`Dados inválidos: ${message}`);
        case 401:
          console.error('❌ Erro 401 - NÃO deve causar logout automático');
          return new Error('Não autorizado. Faça login novamente.');
        case 403:
          return new Error(
            'Acesso negado. Você não tem permissão para esta ação.'
          );
        case 404:
          return new Error('Transação não encontrada.');
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
export const financialApi = new FinancialApiService();
export default financialApi;
