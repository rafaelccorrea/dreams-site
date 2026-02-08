import { api } from './api';
import type {
  Property,
  CreatePropertyData,
  UpdatePropertyData,
  PropertyFilters,
  PropertyResponse,
  PaginationOptions,
  IntelligentSearchFilters,
  IntelligentSearchResponse,
} from '../types/property';
import { validateMultipleFilesStorage } from '../utils/storageValidation';

class PropertyApiService {
  private readonly baseUrl = '/properties';

  /**
   * Criar uma nova propriedade
   */
  async createProperty(data: CreatePropertyData): Promise<Property> {
    try {
      // console.log('🏠 Criando propriedade:', data);
      const response = await api.post(`${this.baseUrl}`, data);
      // console.log('✅ Propriedade criada com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar propriedade:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Criar uma nova propriedade com imagens
   */
  async createPropertyWithImages(
    data: CreatePropertyData,
    files: File[]
  ): Promise<Property> {
    try {
      // Validar armazenamento antes de fazer upload
      if (files.length > 0) {
        const storageValidation = await validateMultipleFilesStorage(
          files,
          false
        );
        if (!storageValidation.canUpload) {
          throw new Error(
            storageValidation.reason ||
              `Limite de armazenamento excedido. Uso atual: ${storageValidation.totalStorageUsedGB.toFixed(2)} GB de ${storageValidation.totalStorageLimitGB} GB`
          );
        }
      }

      // console.log('🏠 Criando propriedade com imagens:', { data, filesCount: files.length });
      const formData = new FormData();

      // Adicionar dados da propriedade
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Adicionar arquivos de imagem
      files.forEach((file, index) => {
        formData.append('images', file);
      });

      const response = await api.post(`${this.baseUrl}/with-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // console.log('✅ Propriedade com imagens criada com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar propriedade com imagens:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar propriedade por ID
   */
  async getPropertyById(id: string): Promise<Property> {
    try {
      // console.log('🔍 Buscando propriedade:', id);
      const response = await api.get(`${this.baseUrl}/${id}`);
      // console.log('✅ Propriedade encontrada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar propriedade:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Listar propriedades com filtros e paginação
   */
  async getProperties(
    filters: PropertyFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 50 },
    onlyMyData: boolean = false
  ): Promise<PropertyResponse> {
    try {
      // console.log('📋 Listando propriedades:', { filters, pagination });
      const params = new URLSearchParams();

      // Adicionar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item));
          } else {
            params.append(key, String(value));
          }
        }
      });

      // Adicionar flag onlyMyData
      if (onlyMyData) {
        params.append('onlyMyData', 'true');
      }

      // Adicionar paginação com validação
      const page =
        Number.isNaN(pagination.page) || pagination.page < 1
          ? 1
          : pagination.page;
      const limit =
        Number.isNaN(pagination.limit) || pagination.limit < 1
          ? 50
          : pagination.limit;

      params.append('page', String(page));
      params.append('limit', String(limit));

      const url = `${this.baseUrl}?${params.toString()}`;
      // console.log('🌐 Fazendo requisição para:', url);
      const response = await api.get(url);

      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar propriedades:', error);
      console.error('❌ Detalhes do erro:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw this.handleError(error);
    }
  }

  /**
   * Listar propriedades enxutas para filtros (ex.: funil de vendas).
   * Retorna apenas id, title e address — evita trazer dados pesados da API completa.
   */
  async getPropertiesForFilters(
    limit: number = 100
  ): Promise<{ data: Array<{ id: string; title: string; address: string }> }> {
    try {
      const params = new URLSearchParams();
      params.append('limit', String(Math.min(Math.max(1, limit), 500)));
      const response = await api.get(
        `${this.baseUrl}/for-filters?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar propriedades para filtros:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar propriedade
   */
  async updateProperty(
    id: string,
    data: UpdatePropertyData
  ): Promise<Property> {
    try {
      // console.log('✏️ Atualizando propriedade:', id, data);
      const response = await api.patch(`${this.baseUrl}/${id}`, data);
      // console.log('✅ Propriedade atualizada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar propriedade:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Excluir propriedade
   */
  async deleteProperty(id: string): Promise<void> {
    try {
      // console.log('🗑️ Excluindo propriedade:', id);
      await api.delete(`${this.baseUrl}/${id}`);
      // console.log('✅ Propriedade excluída com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao excluir propriedade:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Ativar propriedade
   */
  async activateProperty(id: string): Promise<Property> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}/activate`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao ativar propriedade:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Desativar propriedade
   */
  async deactivateProperty(id: string): Promise<Property> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}/deactivate`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao desativar propriedade:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar propriedades por empresa
   */
  async getPropertiesByCompany(
    companyId: string,
    pagination: PaginationOptions = { page: 1, limit: 50 }
  ): Promise<PropertyResponse> {
    try {
      // console.log('🏢 Buscando propriedades da empresa:', companyId);
      const page =
        Number.isNaN(pagination.page) || pagination.page < 1
          ? 1
          : pagination.page;
      const limit =
        Number.isNaN(pagination.limit) || pagination.limit < 1
          ? 50
          : pagination.limit;

      const response = await api.get(
        `${this.baseUrl}/company/${companyId}?page=${page}&limit=${limit}`
      );
      // console.log('✅ Propriedades da empresa encontradas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar propriedades da empresa:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar propriedades por usuário responsável
   */
  async getPropertiesByResponsibleUser(
    userId: string,
    pagination: PaginationOptions = { page: 1, limit: 50 }
  ): Promise<PropertyResponse> {
    try {
      // console.log('👤 Buscando propriedades do usuário:', userId);
      const page =
        Number.isNaN(pagination.page) || pagination.page < 1
          ? 1
          : pagination.page;
      const limit =
        Number.isNaN(pagination.limit) || pagination.limit < 1
          ? 50
          : pagination.limit;

      const response = await api.get(
        `${this.baseUrl}/user/${userId}?page=${page}&limit=${limit}`
      );
      // console.log('✅ Propriedades do usuário encontradas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar propriedades do usuário:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar propriedades destacadas
   */
  async getFeaturedProperties(
    pagination: PaginationOptions = { page: 1, limit: 50 }
  ): Promise<PropertyResponse> {
    try {
      // console.log('⭐ Buscando propriedades destacadas');
      const page =
        Number.isNaN(pagination.page) || pagination.page < 1
          ? 1
          : pagination.page;
      const limit =
        Number.isNaN(pagination.limit) || pagination.limit < 1
          ? 50
          : pagination.limit;

      const response = await api.get(
        `${this.baseUrl}/featured?page=${page}&limit=${limit}`
      );
      // console.log('✅ Propriedades destacadas encontradas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar propriedades destacadas:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar propriedades por localização
   */
  async getPropertiesByLocation(
    city: string,
    state: string,
    pagination: PaginationOptions = { page: 1, limit: 50 }
  ): Promise<PropertyResponse> {
    try {
      // console.log('📍 Buscando propriedades por localização:', { city, state });
      const page =
        Number.isNaN(pagination.page) || pagination.page < 1
          ? 1
          : pagination.page;
      const limit =
        Number.isNaN(pagination.limit) || pagination.limit < 1
          ? 50
          : pagination.limit;

      const response = await api.get(
        `${this.baseUrl}/location/${state}/${city}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar propriedades por localização:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar estatísticas de propriedades
   */
  async getPropertyStats(): Promise<{
    total: number;
    available: number;
    rented: number;
    sold: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    try {
      // console.log('📊 Buscando estatísticas de propriedades');
      const response = await api.get(`${this.baseUrl}/stats`);
      // console.log('✅ Estatísticas encontradas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Busca inteligente de propriedades com algoritmo de matching
   */
  async intelligentSearch(
    filters: IntelligentSearchFilters = {}
  ): Promise<IntelligentSearchResponse> {
    try {
      console.log('🔍 Buscando propriedades de forma inteligente:', filters);
      const params = new URLSearchParams();

      // Adicionar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item));
          } else {
            params.append(key, String(value));
          }
        }
      });

      // Valores padrão para paginação
      if (!params.has('page')) {
        params.append('page', '1');
      }
      if (!params.has('limit')) {
        params.append('limit', '50');
      }

      const url = `${this.baseUrl}/search/intelligent?${params.toString()}`;
      console.log('🌐 Fazendo requisição de busca inteligente para:', url);
      const response = await api.get(url);

      console.log('✅ Busca inteligente realizada com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro na busca inteligente:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Marcar propriedade como vendida
   */
  async markAsSold(id: string, notes?: string): Promise<Property> {
    try {
      console.log('💰 Marcando propriedade como vendida:', id);
      const response = await api.patch(`${this.baseUrl}/${id}/mark-as-sold`, {
        notes,
      });
      console.log('✅ Propriedade marcada como vendida:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao marcar propriedade como vendida:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Marcar propriedade como alugada
   */
  async markAsRented(id: string, notes?: string): Promise<Property> {
    try {
      console.log('🏠 Marcando propriedade como alugada:', id);
      const response = await api.patch(`${this.baseUrl}/${id}/mark-as-rented`, {
        notes,
      });
      console.log('✅ Propriedade marcada como alugada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao marcar propriedade como alugada:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Exportar propriedades
   */
  async exportProperties(
    format: 'csv' | 'xlsx' = 'xlsx',
    filters?: {
      type?: string;
      status?: string;
    }
  ): Promise<Blob> {
    try {
      console.log('📤 Exportando propriedades:', { format, filters });
      const params = new URLSearchParams({ format });

      if (filters?.type) {
        params.append('type', filters.type);
      }
      if (filters?.status) {
        params.append('status', filters.status);
      }

      const response = await api.post(
        `${this.baseUrl}/export?${params.toString()}`,
        {},
        {
          responseType: 'blob',
        }
      );

      console.log('✅ Propriedades exportadas com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao exportar propriedades:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Importar propriedades
   */
  async importProperties(
    file: File,
    format?: string
  ): Promise<{
    total: number;
    success: number;
    failed: number;
    properties: Property[];
    errors: Array<{
      row: number;
      property: string;
      errors: string[];
    }>;
    hasErrorFile?: boolean;
    errorSpreadsheetBase64?: string;
  }> {
    try {
      console.log('📥 Importando propriedades:', {
        fileName: file.name,
        format,
      });
      const formData = new FormData();
      formData.append('file', file);

      if (format) {
        formData.append('format', format);
      }

      const response = await api.post(`${this.baseUrl}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Propriedades importadas com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao importar propriedades:', error);
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
          return new Error('Propriedade não encontrada.');
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
export const propertyApi = new PropertyApiService();
export default propertyApi;
