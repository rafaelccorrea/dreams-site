import { api } from './api';
import type {
  Goal,
  CreateGoalDTO,
  UpdateGoalDTO,
  GoalAnalytics,
  GoalFilters,
  GoalsListResponse,
} from '../types/goal';

/**
 * API de Metas - Sistema completo de gerenciamento de metas configuráveis
 */
export const goalsApi = {
  /**
   * Criar nova meta
   */
  createGoal: async (data: CreateGoalDTO): Promise<Goal> => {
    const response = await api.post('/goals', data);
    return response.data;
  },

  /**
   * Listar metas com filtros
   */
  listGoals: async (filters?: GoalFilters): Promise<GoalsListResponse> => {
    const params = new URLSearchParams();

    if (filters?.type) params.append('type', filters.type);
    if (filters?.period) params.append('period', filters.period);
    if (filters?.scope) params.append('scope', filters.scope);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.teamId) params.append('teamId', filters.teamId);
    if (filters?.companyIds && filters.companyIds.length > 0) {
      // Suporte multi-empresa: companyIds=id1,id2,id3
      params.append('companyIds', filters.companyIds.join(','));
    }
    if (filters?.onlyActive !== undefined) {
      params.append('onlyActive', filters.onlyActive.toString());
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const queryString = params.toString();
    const url = queryString ? `/goals?${queryString}` : '/goals';

    const response = await api.get(url);
    return response.data;
  },

  /**
   * Buscar meta por ID
   */
  getGoalById: async (goalId: string): Promise<Goal> => {
    const response = await api.get(`/goals/${goalId}`);
    return response.data;
  },

  /**
   * Buscar meta mensal ativa (usado pelo Dashboard)
   */
  getActiveMonthlyGoal: async (userId?: string): Promise<Goal | null> => {
    const params = userId ? `?userId=${userId}` : '';
    const response = await api.get(`/goals/active/monthly${params}`);
    return response.data;
  },

  /**
   * Buscar todas as metas mensais ativas (usado pelo Dashboard para seleção)
   */
  getActiveMonthlyGoals: async (): Promise<Goal[]> => {
    const response = await api.get('/goals?period=monthly&onlyActive=true');
    return response.data.goals || [];
  },

  /**
   * Atualizar meta
   */
  updateGoal: async (goalId: string, data: UpdateGoalDTO): Promise<Goal> => {
    const response = await api.put(`/goals/${goalId}`, data);
    return response.data;
  },

  /**
   * Excluir meta
   */
  deleteGoal: async (goalId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/goals/${goalId}`);
    return response.data;
  },

  /**
   * Duplicar meta (criar meta do próximo período)
   */
  duplicateGoal: async (goalId: string): Promise<Goal> => {
    const response = await api.post(`/goals/${goalId}/duplicate`);
    return response.data;
  },

  /**
   * Atualizar progresso manualmente (forçar refresh)
   */
  refreshGoalProgress: async (goalId: string): Promise<{ message: string }> => {
    const response = await api.post(`/goals/${goalId}/refresh`);
    return response.data;
  },

  /**
   * Buscar análise detalhada da meta
   */
  getGoalAnalytics: async (goalId: string): Promise<GoalAnalytics> => {
    const response = await api.get(`/goals/${goalId}/analytics`);
    return response.data;
  },

  /**
   * Buscar opções de filtro (equipes e corretores que possuem metas)
   */
  getFilterOptions: async (): Promise<{
    teams: Array<{ id: string; name: string }>;
    users: Array<{ id: string; name: string }>;
  }> => {
    const response = await api.get('/goals/filters/options');
    return response.data;
  },
};
