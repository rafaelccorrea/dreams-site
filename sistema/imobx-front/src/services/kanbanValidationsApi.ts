import { api } from './api';
import type {
  ColumnValidation,
  ColumnAction,
  CreateValidationDto,
  UpdateValidationDto,
  CreateActionDto,
  UpdateActionDto,
  MoveTaskWithValidationDto,
  MoveTaskResponse,
  ValidationHistoryResponse,
  ActionHistoryResponse,
  ValidationResult,
} from '../types/kanbanValidations';

class KanbanValidationsApiService {
  private baseUrl = '/kanban';

  // ==================== COLUNAS COM VALIDAÇÕES E AÇÕES ====================

  /**
   * Listar colunas simples (apenas id, title, position)
   * GET /kanban/columns/:teamId/simple?projectId=:projectId
   * Use este endpoint ao criar validações para saber quais colunas existem
   */
  async getSimpleColumns(
    teamId: string,
    projectId?: string
  ): Promise<
    Array<{
      id: string;
      title: string;
      position: number;
    }>
  > {
    try {
      const params = projectId ? { projectId } : {};
      const response = await api.get(
        `${this.baseUrl}/columns/${teamId}/simple`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar colunas simples:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Listar colunas com validações e ações
   * GET /kanban/columns/:teamId?projectId=:projectId
   */
  async getColumnsWithValidationsAndActions(
    teamId: string,
    projectId?: string
  ): Promise<
    Array<{
      id: string;
      title: string;
      description?: string;
      position: number;
      color?: string;
      teamId: string;
      projectId?: string;
      validations: ColumnValidation[];
      actions: ColumnAction[];
    }>
  > {
    try {
      const params = projectId ? { projectId } : {};
      const response = await api.get(`${this.baseUrl}/columns/${teamId}`, {
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar colunas com validações e ações:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter relações entre colunas
   * GET /kanban/columns/:teamId/relations?projectId=:projectId
   */
  async getColumnRelations(
    teamId: string,
    projectId?: string
  ): Promise<{
    relations: Array<{
      fromColumn: { id: string; title: string };
      toColumn: { id: string; title: string };
      validations: number;
      actions: number;
    }>;
  }> {
    try {
      const params = projectId ? { projectId } : {};
      const response = await api.get(
        `${this.baseUrl}/columns/${teamId}/relations`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar relações entre colunas:', error);
      throw this.handleError(error);
    }
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Listar validações de uma coluna
   */
  async getValidations(columnId: string): Promise<ColumnValidation[]> {
    try {
      const response = await api.get<ColumnValidation[]>(
        `${this.baseUrl}/columns/${columnId}/validations`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar validações:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Criar validação
   */
  async createValidation(
    columnId: string,
    data: CreateValidationDto
  ): Promise<ColumnValidation> {
    try {
      const response = await api.post<ColumnValidation>(
        `${this.baseUrl}/columns/${columnId}/validations`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar validação:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar validação
   */
  async updateValidation(
    validationId: string,
    data: UpdateValidationDto
  ): Promise<ColumnValidation> {
    try {
      const response = await api.put<ColumnValidation>(
        `${this.baseUrl}/columns/validations/${validationId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar validação:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Deletar validação
   */
  async deleteValidation(validationId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/columns/validations/${validationId}`);
    } catch (error: any) {
      console.error('❌ Erro ao deletar validação:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Reordenar validações
   */
  async reorderValidations(
    columnId: string,
    validationIds: string[]
  ): Promise<void> {
    try {
      await api.post(
        `${this.baseUrl}/columns/${columnId}/validations/reorder`,
        {
          validationIds,
        }
      );
    } catch (error: any) {
      console.error('❌ Erro ao reordenar validações:', error);
      throw this.handleError(error);
    }
  }

  // ==================== AÇÕES ====================

  /**
   * Listar ações de uma coluna
   */
  async getActions(
    columnId: string,
    trigger?: string
  ): Promise<ColumnAction[]> {
    try {
      const params = trigger ? { trigger } : {};
      const response = await api.get<ColumnAction[]>(
        `${this.baseUrl}/columns/${columnId}/actions`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar ações:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Criar ação
   */
  async createAction(
    columnId: string,
    data: CreateActionDto
  ): Promise<ColumnAction> {
    try {
      const response = await api.post<ColumnAction>(
        `${this.baseUrl}/columns/${columnId}/actions`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar ação:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar ação
   */
  async updateAction(
    actionId: string,
    data: UpdateActionDto
  ): Promise<ColumnAction> {
    try {
      const response = await api.put<ColumnAction>(
        `${this.baseUrl}/columns/actions/${actionId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar ação:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Deletar ação
   */
  async deleteAction(actionId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/columns/actions/${actionId}`);
    } catch (error: any) {
      console.error('❌ Erro ao deletar ação:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Reordenar ações
   */
  async reorderActions(columnId: string, actionIds: string[]): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/columns/${columnId}/actions/reorder`, {
        actionIds,
      });
    } catch (error: any) {
      console.error('❌ Erro ao reordenar ações:', error);
      throw this.handleError(error);
    }
  }

  // ==================== MOVER TAREFA ====================

  /**
   * Mover tarefa com validações e ações
   */
  async moveTaskWithValidation(
    data: MoveTaskWithValidationDto
  ): Promise<MoveTaskResponse> {
    try {
      // Log para debug
      if (data.actionData) {
        console.log('📝 Enviando dados de ação:', data.actionData);
      }

      const response = await api.post<MoveTaskResponse>(
        `${this.baseUrl}/tasks/move`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao mover tarefa:', error);

      // Se for erro de validação (400), retornar dados do erro
      if (error.response?.status === 400 && error.response?.data) {
        throw {
          ...error.response.data,
          isValidationError: true,
        };
      }

      throw this.handleError(error);
    }
  }

  /**
   * Testar validações de uma tarefa
   */
  async testValidations(
    taskId: string,
    columnId: string
  ): Promise<{
    validationResults: ValidationResult[];
    allPassed: boolean;
    blocked: boolean;
    warnings: string[];
  }> {
    try {
      const response = await api.post(
        `${this.baseUrl}/tasks/${taskId}/test-validations`,
        { columnId }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao testar validações:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Executar ação manualmente (apenas para testes/admin)
   */
  async executeAction(
    taskId: string,
    actionId: string,
    dryRun?: boolean
  ): Promise<any> {
    try {
      const response = await api.post(
        `${this.baseUrl}/tasks/${taskId}/execute-action`,
        { actionId, dryRun }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao executar ação:', error);
      throw this.handleError(error);
    }
  }

  // ==================== HISTÓRICO ====================

  /**
   * Buscar histórico de validações de uma tarefa
   */
  async getValidationHistory(
    taskId: string,
    params?: {
      columnId?: string;
      validationId?: string;
      passed?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<ValidationHistoryResponse> {
    try {
      const response = await api.get<ValidationHistoryResponse>(
        `${this.baseUrl}/tasks/${taskId}/validation-history`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar histórico de validações:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar histórico de ações de uma tarefa
   */
  async getActionHistory(
    taskId: string,
    params?: {
      columnId?: string;
      actionId?: string;
      success?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<ActionHistoryResponse> {
    try {
      const response = await api.get<ActionHistoryResponse>(
        `${this.baseUrl}/tasks/${taskId}/action-history`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar histórico de ações:', error);
      throw this.handleError(error);
    }
  }

  // ==================== HELPERS ====================

  private handleError(error: any): Error {
    if (error.response) {
      // Erro da API
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        'Erro ao processar requisição';
      const errorObj = new Error(message);
      (errorObj as any).status = error.response.status;
      (errorObj as any).data = error.response.data;
      return errorObj;
    } else if (error.request) {
      // Erro de rede
      return new Error('Erro de conexão. Verifique sua internet.');
    } else {
      // Outro erro
      return new Error(error.message || 'Erro desconhecido');
    }
  }
}

export const kanbanValidationsApi = new KanbanValidationsApiService();
