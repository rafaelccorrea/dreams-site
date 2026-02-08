import { api } from './api';
import type {
  Asset,
  CreateAssetDto,
  UpdateAssetDto,
  TransferAssetDto,
  CreateAssetMovementDto,
  AssetQueryParams,
  AssetListResponse,
  AssetStats,
  AssetMovement,
} from '../types/asset';

class AssetApiService {
  private readonly baseUrl = '/assets';

  /**
   * Criar um novo patrimônio
   */
  async createAsset(data: CreateAssetDto): Promise<Asset> {
    try {
      const response = await api.post(`${this.baseUrl}`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar patrimônio:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Listar patrimônios com filtros e paginação
   */
  async getAssets(params: AssetQueryParams = {}): Promise<AssetListResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params.status) queryParams.append('status', params.status);
      if (params.category) queryParams.append('category', params.category);
      if (params.assignedToUserId)
        queryParams.append('assignedToUserId', params.assignedToUserId);
      if (params.propertyId)
        queryParams.append('propertyId', params.propertyId);
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.onlyMyData) queryParams.append('onlyMyData', 'true');

      const url = queryParams.toString()
        ? `${this.baseUrl}?${queryParams.toString()}`
        : this.baseUrl;

      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar patrimônios:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar patrimônio por ID
   */
  async getAssetById(id: string): Promise<Asset> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar patrimônio:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar patrimônio
   */
  async updateAsset(id: string, data: UpdateAssetDto): Promise<Asset> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar patrimônio:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remover patrimônio (baixa)
   */
  async deleteAsset(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      console.error('❌ Erro ao remover patrimônio:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Transferir patrimônio
   */
  async transferAsset(id: string, data: TransferAssetDto): Promise<Asset> {
    try {
      const response = await api.post(`${this.baseUrl}/${id}/transfer`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao transferir patrimônio:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar estatísticas de patrimônio
   */
  async getAssetStats(): Promise<AssetStats> {
    try {
      const response = await api.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar histórico de movimentações de um patrimônio
   */
  async getAssetMovements(assetId: string): Promise<AssetMovement[]> {
    try {
      const response = await api.get(`${this.baseUrl}/${assetId}/movements`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar movimentações:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Criar movimentação manual
   */
  async createAssetMovement(
    data: CreateAssetMovementDto
  ): Promise<AssetMovement> {
    try {
      const response = await api.post(`${this.baseUrl}/movements`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar movimentação:', error);
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
          if (Array.isArray(message)) {
            const validationMessages = message.join(', ');
            return new Error(`Dados inválidos: ${validationMessages}`);
          }
          if (details?.validationErrors) {
            const validationMessages = details.validationErrors
              .map((err: any) => `${err.field}: ${err.message}`)
              .join('; ');
            return new Error(`Dados inválidos: ${validationMessages}`);
          }
          return new Error(`Dados inválidos: ${message}`);
        case 401:
          return new Error('Não autorizado. Faça login novamente.');
        case 403:
          return new Error(
            'Acesso negado. Você não tem permissão para esta ação.'
          );
        case 404:
          return new Error('Patrimônio não encontrado.');
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
export const assetApi = new AssetApiService();
export default assetApi;
