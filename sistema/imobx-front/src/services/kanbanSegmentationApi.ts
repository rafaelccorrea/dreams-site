import { api } from './api';

export type SegmentationRuleType =
  | 'score_based'
  | 'field_based'
  | 'time_based'
  | 'custom_condition';
export const SegmentationRuleType = {
  SCORE_BASED: 'score_based' as SegmentationRuleType,
  FIELD_BASED: 'field_based' as SegmentationRuleType,
  TIME_BASED: 'time_based' as SegmentationRuleType,
  CUSTOM_CONDITION: 'custom_condition' as SegmentationRuleType,
};

export type SegmentationAction =
  | 'move_to_column'
  | 'assign_user'
  | 'add_tag'
  | 'update_priority'
  | 'trigger_action';
export const SegmentationAction = {
  MOVE_TO_COLUMN: 'move_to_column' as SegmentationAction,
  ASSIGN_USER: 'assign_user' as SegmentationAction,
  ADD_TAG: 'add_tag' as SegmentationAction,
  UPDATE_PRIORITY: 'update_priority' as SegmentationAction,
  TRIGGER_ACTION: 'trigger_action' as SegmentationAction,
};

export interface SegmentationRule {
  id: string;
  teamId: string;
  name: string;
  description?: string;
  type: SegmentationRuleType;
  conditions: Record<string, any>;
  action: SegmentationAction;
  actionConfig: Record<string, any>;
  isActive: boolean;
  order: number;
  executionCount: number;
  lastExecutionAt?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSegmentationRuleDto {
  name: string;
  description?: string;
  type: SegmentationRuleType;
  conditions: Record<string, any>;
  action: SegmentationAction;
  actionConfig: Record<string, any>;
  isActive?: boolean;
  order?: number;
}

export interface UpdateSegmentationRuleDto {
  name?: string;
  description?: string;
  type?: SegmentationRuleType;
  conditions?: Record<string, any>;
  action?: SegmentationAction;
  actionConfig?: Record<string, any>;
  isActive?: boolean;
  order?: number;
}

class KanbanSegmentationApiService {
  private baseUrl = '/kanban/segmentation';

  /**
   * Listar regras de segmentação de uma equipe
   */
  async listRules(teamId: string): Promise<SegmentationRule[]> {
    try {
      const response = await api.get<SegmentationRule[]>(
        `${this.baseUrl}/teams/${teamId}/rules`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar regras de segmentação:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter regra por ID
   */
  async getRule(ruleId: string): Promise<SegmentationRule> {
    try {
      const response = await api.get<SegmentationRule>(
        `${this.baseUrl}/rules/${ruleId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar regra:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Criar regra de segmentação
   */
  async createRule(
    teamId: string,
    data: CreateSegmentationRuleDto
  ): Promise<SegmentationRule> {
    try {
      const response = await api.post<SegmentationRule>(
        `${this.baseUrl}/teams/${teamId}/rules`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar regra:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar regra de segmentação
   */
  async updateRule(
    ruleId: string,
    data: UpdateSegmentationRuleDto
  ): Promise<SegmentationRule> {
    try {
      const response = await api.put<SegmentationRule>(
        `${this.baseUrl}/rules/${ruleId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar regra:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remover regra de segmentação
   */
  async deleteRule(ruleId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/rules/${ruleId}`);
    } catch (error: any) {
      console.error('❌ Erro ao remover regra:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Processar regras de segmentação para uma tarefa específica
   */
  async processRules(taskId: string): Promise<{
    processedRules: string[];
    results: Array<{
      ruleId: string;
      executed: boolean;
      action?: string;
    }>;
  }> {
    try {
      const response = await api.post(
        `${this.baseUrl}/tasks/${taskId}/process`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao processar regras:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    return new Error(error.message || 'Erro desconhecido');
  }
}

export const kanbanSegmentationApi = new KanbanSegmentationApiService();
