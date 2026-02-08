import { api } from './api';
import type {
  Reward,
  RewardRedemption,
  RewardStats,
  CreateRewardRequest,
  UpdateRewardRequest,
  RedeemRewardRequest,
  ReviewRedemptionRequest,
  DeliverRedemptionRequest,
} from '@/types/rewards.types';

export const rewardsApi = {
  /**
   * Listar prêmios disponíveis (ativos)
   */
  async getAvailable(): Promise<Reward[]> {
    const response = await api.get('/rewards/available');
    return response.data.data || [];
  },

  /**
   * Listar todos os prêmios (admin)
   */
  async getAll(includeInactive = false): Promise<Reward[]> {
    const response = await api.get('/rewards', {
      params: { includeInactive },
    });
    return response.data.data || [];
  },

  /**
   * Obter prêmio por ID
   */
  async getById(id: string): Promise<Reward> {
    const response = await api.get(`/rewards/${id}`);
    return response.data.data;
  },

  /**
   * Criar prêmio (admin)
   */
  async create(data: CreateRewardRequest): Promise<Reward> {
    const response = await api.post('/rewards', data);
    return response.data.data;
  },

  /**
   * Atualizar prêmio (admin)
   */
  async update(id: string, data: UpdateRewardRequest): Promise<Reward> {
    const response = await api.put(`/rewards/${id}`, data);
    return response.data.data;
  },

  /**
   * Excluir prêmio (admin)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/rewards/${id}`);
  },

  /**
   * Solicitar resgate de prêmio
   */
  async redeem(data: RedeemRewardRequest): Promise<RewardRedemption> {
    const response = await api.post('/rewards/redeem', data);
    return response.data.data;
  },

  /**
   * Minhas solicitações de resgate
   */
  async getMyRedemptions(): Promise<RewardRedemption[]> {
    const response = await api.get('/rewards/redemptions/my');
    return response.data.data || [];
  },

  /**
   * Listar solicitações pendentes (gestor)
   */
  async getPendingRedemptions(params?: {
    status?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: RewardRedemption[]; total: number }> {
    const response = await api.get('/rewards/redemptions/pending', { params });
    return {
      data: response.data.data || [],
      total: response.data.total || 0,
    };
  },

  /**
   * Aprovar ou rejeitar resgate (gestor)
   */
  async reviewRedemption(
    id: string,
    data: ReviewRedemptionRequest
  ): Promise<RewardRedemption> {
    const response = await api.post(`/rewards/redemptions/${id}/review`, data);
    return response.data.data;
  },

  /**
   * Marcar como entregue (admin/gestor)
   */
  async deliverRedemption(
    id: string,
    data: DeliverRedemptionRequest
  ): Promise<RewardRedemption> {
    const response = await api.post(`/rewards/redemptions/${id}/deliver`, data);
    return response.data.data;
  },

  /**
   * Estatísticas de resgates (admin)
   */
  async getStats(): Promise<RewardStats> {
    const response = await api.get('/rewards/stats/redemptions');
    return response.data.data;
  },
};
