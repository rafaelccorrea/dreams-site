import { api } from './api';

export interface Prize {
  id: string;
  name: string;
  description: string;
  value: number;
  quantity: number;
  deliveredCount: number;
  status: 'available' | 'delivered' | 'pending';
  competitionId: string;
  competitionName: string;
  imageUrl?: string;
  position: number;
  winnerUserId?: string;
  winnerUserName?: string;
  winnerTeamId?: string;
  winnerTeamName?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface CreatePrizeDto {
  competitionId: string;
  position: number;
  name: string;
  description?: string;
  value?: number;
  imageUrl?: string;
}

export interface UpdatePrizeDto {
  name?: string;
  description?: string;
  value?: number;
  imageUrl?: string;
}

class PrizesApiService {
  /**
   * Listar todos os prêmios
   */
  async getAllPrizes(): Promise<Prize[]> {
    try {
      const response = await api.get('/competitions/prizes/all');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Erro ao buscar prêmios:', error);
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar prêmios'
      );
    }
  }

  /**
   * Criar novo prêmio
   */
  async createPrize(data: CreatePrizeDto): Promise<Prize> {
    try {
      const response = await api.post(
        `/competitions/${data.competitionId}/prizes`,
        {
          position: data.position,
          name: data.name,
          description: data.description,
          value: data.value,
          imageUrl: data.imageUrl,
        }
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar prêmio:', error);
      throw new Error(error.response?.data?.message || 'Erro ao criar prêmio');
    }
  }

  /**
   * Atualizar prêmio
   */
  async updatePrize(prizeId: string, data: UpdatePrizeDto): Promise<Prize> {
    try {
      const response = await api.put(`/competitions/prizes/${prizeId}`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar prêmio:', error);
      throw new Error(
        error.response?.data?.message || 'Erro ao atualizar prêmio'
      );
    }
  }

  /**
   * Excluir prêmio
   */
  async deletePrize(prizeId: string): Promise<void> {
    try {
      await api.delete(`/competitions/prizes/${prizeId}`);
    } catch (error: any) {
      console.error('Erro ao excluir prêmio:', error);
      throw new Error(
        error.response?.data?.message || 'Erro ao excluir prêmio'
      );
    }
  }

  /**
   * Marcar prêmio como entregue
   */
  async deliverPrize(prizeId: string): Promise<Prize> {
    try {
      const response = await api.post(
        `/competitions/prizes/${prizeId}/deliver`
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao marcar prêmio como entregue:', error);
      throw new Error(
        error.response?.data?.message || 'Erro ao marcar prêmio como entregue'
      );
    }
  }
}

export const prizesApi = new PrizesApiService();
