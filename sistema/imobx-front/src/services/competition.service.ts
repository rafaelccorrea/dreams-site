import { api } from './api';
import type {
  Competition,
  CompetitionPrize,
  CreateCompetitionRequest,
  CreatePrizeRequest,
  CompetitionStatus,
} from '@/types/competition.types';

export const competitionService = {
  /**
   * Criar competição
   */
  async create(data: CreateCompetitionRequest): Promise<Competition> {
    const response = await api.post('/competitions', data);
    return response.data.data;
  },

  /**
   * Listar competições
   */
  async findAll(status?: CompetitionStatus): Promise<Competition[]> {
    const response = await api.get('/competitions', {
      params: status ? { status } : {},
    });
    return response.data.data;
  },

  /**
   * Obter competição por ID
   */
  async findById(id: string): Promise<Competition> {
    const response = await api.get(`/competitions/${id}`);
    return response.data.data;
  },

  /**
   * Atualizar competição
   */
  async update(
    id: string,
    data: Partial<CreateCompetitionRequest>
  ): Promise<Competition> {
    const response = await api.put(`/competitions/${id}`, data);
    return response.data.data;
  },

  /**
   * Mudar status
   */
  async changeStatus(
    id: string,
    status: CompetitionStatus
  ): Promise<Competition> {
    const response = await api.put(`/competitions/${id}/status`, { status });
    return response.data.data;
  },

  /**
   * Excluir competição
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/competitions/${id}`);
  },

  /**
   * Adicionar prêmio
   */
  async addPrize(
    competitionId: string,
    data: CreatePrizeRequest
  ): Promise<CompetitionPrize> {
    const response = await api.post(
      `/competitions/${competitionId}/prizes`,
      data
    );
    return response.data.data;
  },

  /**
   * Atualizar prêmio
   */
  async updatePrize(
    prizeId: string,
    data: Partial<CreatePrizeRequest>
  ): Promise<CompetitionPrize> {
    const response = await api.put(`/competitions/prizes/${prizeId}`, data);
    return response.data.data;
  },

  /**
   * Remover prêmio
   */
  async removePrize(prizeId: string): Promise<void> {
    await api.delete(`/competitions/prizes/${prizeId}`);
  },

  /**
   * Marcar prêmio como entregue
   */
  async deliverPrize(prizeId: string): Promise<CompetitionPrize> {
    const response = await api.post(`/competitions/prizes/${prizeId}/deliver`);
    return response.data.data;
  },

  /**
   * Finalizar competição
   */
  async finalize(id: string): Promise<Competition> {
    const response = await api.post(`/competitions/${id}/finalize`);
    return response.data.data;
  },

  /**
   * Obter competições ativas
   */
  async getActive(): Promise<Competition[]> {
    const response = await api.get('/competitions/active/current');
    return response.data.data;
  },
};
