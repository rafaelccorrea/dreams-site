import { api } from './api';
import type {
  GamificationScore,
  TeamScore,
  UserAchievement,
  LeaderboardResponse,
  GamificationDashboard,
  GamificationConfig,
  UpdateGamificationConfigRequest,
  ScorePeriod,
} from '@/types/gamification.types';

export const gamificationService = {
  /**
   * Obter meu score atual
   */
  async getMyScore(
    period: ScorePeriod = ScorePeriod.MONTHLY
  ): Promise<GamificationScore> {
    const response = await api.get(`/gamification/my-score`, {
      params: { period },
    });
    return response.data.data;
  },

  /**
   * Obter minhas conquistas
   */
  async getMyAchievements(): Promise<UserAchievement[]> {
    const response = await api.get('/gamification/my-achievements');
    return response.data.data;
  },

  /**
   * Obter ranking individual
   */
  async getIndividualRankings(
    period: ScorePeriod = ScorePeriod.MONTHLY
  ): Promise<GamificationScore[]> {
    const response = await api.get('/gamification/rankings/individual', {
      params: { period },
    });
    return response.data.data;
  },

  /**
   * Obter ranking de equipes
   */
  async getTeamRankings(
    period: ScorePeriod = ScorePeriod.MONTHLY
  ): Promise<TeamScore[]> {
    const response = await api.get('/gamification/rankings/teams', {
      params: { period },
    });
    return response.data.data;
  },

  /**
   * Obter placar completo (leaderboard)
   */
  async getLeaderboard(
    period: ScorePeriod = ScorePeriod.MONTHLY,
    limit: number = 10
  ): Promise<LeaderboardResponse> {
    const response = await api.get('/gamification/leaderboard', {
      params: { period, limit },
    });
    return response.data.data;
  },

  /**
   * Obter dashboard completo de gamificação
   */
  async getDashboard(
    period: ScorePeriod = ScorePeriod.MONTHLY
  ): Promise<GamificationDashboard> {
    const response = await api.get('/gamification/dashboard', {
      params: { period },
    });
    return response.data.data;
  },

  /**
   * Recalcular score de um usuário (admin)
   */
  async recalculateUserScore(
    userId: string,
    period: ScorePeriod = ScorePeriod.MONTHLY
  ): Promise<GamificationScore> {
    const response = await api.post(
      `/gamification/recalculate/${userId}`,
      null,
      {
        params: { period },
      }
    );
    return response.data.data;
  },

  /**
   * Obter configuração de gamificação da empresa
   */
  async getConfig(): Promise<GamificationConfig> {
    const response = await api.get('/gamification/config');
    return response.data.data;
  },

  /**
   * Atualizar configuração de gamificação
   */
  async updateConfig(
    data: UpdateGamificationConfigRequest
  ): Promise<GamificationConfig> {
    const response = await api.put('/gamification/config', data);
    return response.data.data;
  },
};
