import { api } from './api';
import type { Spouse, CreateSpouseDto, UpdateSpouseDto } from '../types/spouse';

class SpouseApiService {
  /**
   * Criar cônjuge para um cliente
   */
  async createSpouse(
    clientId: string,
    spouseData: CreateSpouseDto
  ): Promise<Spouse> {
    const response = await api.post(`/spouses/${clientId}`, spouseData);
    return response.data;
  }

  /**
   * Buscar cônjuge por ID do cliente
   */
  async getSpouseByClientId(clientId: string): Promise<Spouse | null> {
    try {
      const response = await api.get(`/spouses/client/${clientId}`);
      return response.data;
    } catch (error: any) {
      // Se não encontrar, retorna null
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Buscar cônjuge por ID
   */
  async getSpouseById(spouseId: string): Promise<Spouse> {
    const response = await api.get(`/spouses/${spouseId}`);
    return response.data;
  }

  /**
   * Atualizar cônjuge
   */
  async updateSpouse(
    spouseId: string,
    spouseData: UpdateSpouseDto
  ): Promise<Spouse> {
    const response = await api.patch(`/spouses/${spouseId}`, spouseData);
    return response.data;
  }

  /**
   * Deletar cônjuge
   */
  async deleteSpouse(spouseId: string): Promise<void> {
    await api.delete(`/spouses/${spouseId}`);
  }
}

export const spouseApi = new SpouseApiService();
