'use client';
import { api } from './api';
import type {
  KanbanSubTask,
  CreateSubTaskDto,
  UpdateSubTaskDto,
  ReorderSubTasksDto,
  TaskHistoryEntry,
  KanbanTaskComment,
} from '../types/kanban';

class KanbanSubtasksApiService {
  private baseUrl = '/kanban';

  async createSubTask(
    taskId: string,
    data: CreateSubTaskDto
  ): Promise<KanbanSubTask> {
    try {
      const response = await api.post(
        `${this.baseUrl}/tasks/${taskId}/subtasks`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar sub-tarefa:', error);
      throw this.handleError(error);
    }
  }

  async getSubTasks(taskId: string): Promise<KanbanSubTask[]> {
    try {
      const response = await api.get(
        `${this.baseUrl}/tasks/${taskId}/subtasks`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar sub-tarefas:', error);
      throw this.handleError(error);
    }
  }

  async getSubTask(subTaskId: string): Promise<KanbanSubTask> {
    try {
      const response = await api.get(`${this.baseUrl}/subtasks/${subTaskId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar sub-tarefa:', error);
      throw this.handleError(error);
    }
  }

  async updateSubTask(
    subTaskId: string,
    data: UpdateSubTaskDto
  ): Promise<KanbanSubTask> {
    try {
      const response = await api.put(
        `${this.baseUrl}/subtasks/${subTaskId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar sub-tarefa:', error);
      throw this.handleError(error);
    }
  }

  async toggleSubTask(subTaskId: string): Promise<KanbanSubTask> {
    try {
      const response = await api.patch(
        `${this.baseUrl}/subtasks/${subTaskId}/toggle`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao alternar sub-tarefa:', error);
      throw this.handleError(error);
    }
  }

  async reorderSubTasks(
    taskId: string,
    data: ReorderSubTasksDto
  ): Promise<void> {
    try {
      await api.put(`${this.baseUrl}/tasks/${taskId}/subtasks/reorder`, data);
    } catch (error: any) {
      console.error('❌ Erro ao reordenar sub-tarefas:', error);
      throw this.handleError(error);
    }
  }

  async deleteSubTask(subTaskId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/subtasks/${subTaskId}`);
    } catch (error: any) {
      console.error('❌ Erro ao deletar sub-tarefa:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar histórico de uma subtarefa
   * GET /kanban/subtasks/:subTaskId/history
   */
  async getSubTaskHistory(subTaskId: string): Promise<TaskHistoryEntry[]> {
    try {
      const response = await api.get<TaskHistoryEntry[]>(
        `${this.baseUrl}/subtasks/${subTaskId}/history`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar histórico da subtarefa:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Atribuir responsável à subtarefa
   * PATCH /kanban/subtasks/:subTaskId/assign
   */
  async assignSubTask(
    subTaskId: string,
    userId: string
  ): Promise<KanbanSubTask> {
    try {
      const response = await api.patch<KanbanSubTask>(
        `${this.baseUrl}/subtasks/${subTaskId}/assign`,
        { userId }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atribuir responsável à subtarefa:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remover responsável da subtarefa
   * PATCH /kanban/subtasks/:subTaskId/unassign
   */
  async unassignSubTask(subTaskId: string): Promise<KanbanSubTask> {
    try {
      const response = await api.patch<KanbanSubTask>(
        `${this.baseUrl}/subtasks/${subTaskId}/unassign`,
        {}
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao remover responsável da subtarefa:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Listar comentários de uma subtarefa
   * GET /kanban/subtasks/:subTaskId/comments
   */
  async getSubTaskComments(subTaskId: string): Promise<KanbanTaskComment[]> {
    try {
      const response = await api.get<KanbanTaskComment[]>(
        `${this.baseUrl}/subtasks/${subTaskId}/comments`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar comentários da subtarefa:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Adicionar comentário à subtarefa
   * POST /kanban/subtasks/:subTaskId/comments
   */
  async createSubTaskComment(
    subTaskId: string,
    formData: FormData
  ): Promise<KanbanTaskComment> {
    try {
      const response = await api.post<KanbanTaskComment>(
        `${this.baseUrl}/subtasks/${subTaskId}/comments`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar comentário na subtarefa:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Deletar comentário de uma subtarefa
   * DELETE /kanban/subtasks/:subTaskId/comments/:commentId
   */
  async deleteSubTaskComment(
    subTaskId: string,
    commentId: string
  ): Promise<void> {
    try {
      await api.delete(
        `${this.baseUrl}/subtasks/${subTaskId}/comments/${commentId}`
      );
    } catch (error: any) {
      console.error('❌ Erro ao deletar comentário da subtarefa:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    if (error.message) {
      return new Error(error.message);
    }

    return new Error('Erro interno do servidor');
  }
}

export const kanbanSubtasksApi = new KanbanSubtasksApiService();
