import { api } from './api';
import type {
  TeamsComparisonResponse,
  UsersComparisonResponse,
  CompareTeamsRequest,
  CompareUsersRequest,
} from '../types/performance';

/**
 * API Service para Performance e Comparações
 */
export const performanceApi = {
  /**
   * Comparar times
   */
  async compareTeams(
    data: CompareTeamsRequest
  ): Promise<TeamsComparisonResponse> {
    const response = await api.post<TeamsComparisonResponse>(
      '/matches/performance/compare/teams',
      data
    );
    return response.data;
  },

  /**
   * Comparar usuários
   */
  async compareUsers(
    data: CompareUsersRequest
  ): Promise<UsersComparisonResponse> {
    const response = await api.post<UsersComparisonResponse>(
      '/matches/performance/compare/users',
      data
    );
    return response.data;
  },

  /**
   * Performance de um time específico
   */
  async getTeamPerformance(
    teamId: string,
    startDate?: string,
    endDate?: string
  ) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = queryString
      ? `/matches/performance/teams/${teamId}?${queryString}`
      : `/matches/performance/teams/${teamId}`;

    const response = await api.get(url);
    return response.data;
  },

  /**
   * Performance de um usuário específico
   */
  async getUserPerformance(
    userId: string,
    startDate?: string,
    endDate?: string
  ) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = queryString
      ? `/matches/performance/users/${userId}?${queryString}`
      : `/matches/performance/users/${userId}`;

    const response = await api.get(url);
    return response.data;
  },
};
