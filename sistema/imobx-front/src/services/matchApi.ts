/**
 * API Service para Matches
 */

import { api } from './api';
import type {
  Match,
  MatchListResponse,
  AcceptMatchResponse,
  IgnoreMatchRequest,
  IgnoreMatchResponse,
  MatchStatus,
} from '../types/match';

export const matchApi = {
  /**
   * Listar matches do usuário logado
   */
  async getMyMatches(params?: {
    status?: MatchStatus;
    page?: number;
    limit?: number;
    propertyId?: string;
    clientId?: string;
  }): Promise<MatchListResponse> {
    const response = await api.get<MatchListResponse>('/matches', {
      params: {
        status: params?.status,
        page: params?.page || 1,
        limit: params?.limit || 20,
        propertyId: params?.propertyId,
        clientId: params?.clientId,
      },
    });
    return response.data;
  },

  /**
   * Buscar um match específico
   */
  async getMatchById(matchId: string): Promise<Match> {
    const response = await api.get<Match>(`/matches/${matchId}`);
    return response.data;
  },

  /**
   * Aceitar um match
   * 🎯 AUTOMAÇÃO: Cria task + nota automaticamente
   */
  async acceptMatch(matchId: string): Promise<AcceptMatchResponse> {
    const response = await api.post<AcceptMatchResponse>(
      `/matches/${matchId}/accept`
    );
    return response.data;
  },

  /**
   * Ignorar um match com motivo
   * 📊 Sistema aprende com feedback
   */
  async ignoreMatch(
    matchId: string,
    data: IgnoreMatchRequest
  ): Promise<IgnoreMatchResponse> {
    const response = await api.post<IgnoreMatchResponse>(
      `/matches/${matchId}/ignore`,
      data
    );
    return response.data;
  },

  /**
   * Marcar match como visualizado
   */
  async markAsViewed(matchId: string): Promise<void> {
    await api.post(`/matches/${matchId}/view`);
  },

  /**
   * Atualizar status do match
   */
  async updateMatchStatus(
    matchId: string,
    status: MatchStatus
  ): Promise<Match> {
    const response = await api.patch<Match>(`/matches/${matchId}/status`, {
      status,
    });
    return response.data;
  },
};
