import { api } from './api';
import type {
  Condominium,
  CreateCondominiumDto,
  UpdateCondominiumDto,
  CondominiumImage,
  SimilarityCheckResult,
  CondominiumListFilters,
  CondominiumListResponse,
} from '../types/condominium';

class CondominiumApiService {
  private readonly baseUrl = '/condominiums';

  /**
   * Listar todos os condomínios
   */
  async listCondominiums(
    filters?: CondominiumListFilters
  ): Promise<Condominium[] | CondominiumListResponse> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
      }

      const url = params.toString()
        ? `${this.baseUrl}?${params.toString()}`
        : this.baseUrl;
      const response = await api.get(url);

      // Se a resposta tem estrutura paginada, retornar como está
      if (response.data.data) {
        return response.data;
      }

      // Caso contrário, retornar array direto (compatibilidade)
      return response.data;
    } catch (error: any) {
      console.error('Erro ao listar condomínios:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Verificar condomínios similares
   */
  async checkSimilarity(name: string): Promise<SimilarityCheckResult> {
    try {
      const response = await api.get(
        `${this.baseUrl}/check-similarity?name=${encodeURIComponent(name)}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Erro ao verificar similaridade:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar condomínio por ID
   */
  async getCondominiumById(id: string): Promise<Condominium> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar condomínio:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Criar novo condomínio
   */
  async createCondominium(data: CreateCondominiumDto): Promise<Condominium> {
    try {
      const response = await api.post(`${this.baseUrl}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar condomínio:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar condomínio
   */
  async updateCondominium(
    id: string,
    data: UpdateCondominiumDto
  ): Promise<Condominium> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar condomínio:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Excluir condomínio
   */
  async deleteCondominium(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      console.error('Erro ao excluir condomínio:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Fazer upload de imagens do condomínio
   */
  async uploadImages(
    condominiumId: string,
    files: File[]
  ): Promise<CondominiumImage[]> {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post(
        `${this.baseUrl}/${condominiumId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Erro ao fazer upload de imagens:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remover imagem do condomínio
   */
  async deleteImage(condominiumId: string, imageId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${condominiumId}/images/${imageId}`);
    } catch (error: any) {
      console.error('Erro ao remover imagem:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Tratamento de erros
   */
  private handleError(error: any): Error {
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        'Erro ao processar requisição';
      return new Error(message);
    }
    return error instanceof Error ? error : new Error('Erro desconhecido');
  }
}

export const condominiumApi = new CondominiumApiService();
