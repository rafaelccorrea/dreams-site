/**
 * API Service para Workspace Pessoal
 */

import { api } from './api';
import type {
  PersonalProject,
  KanbanTask,
  KanbanColumn,
} from '../types/workspace';

export const workspaceApi = {
  /**
   * Buscar projeto pessoal do usuário logado
   * 🏠 Todo usuário tem um projeto pessoal automático
   */
  async getPersonalProject(): Promise<PersonalProject> {
    const response = await api.get<PersonalProject>(
      '/kanban/projects/personal/me'
    );
    return response.data;
  },

  /**
   * Listar tasks do projeto pessoal
   */
  async getPersonalTasks(projectId: string): Promise<KanbanTask[]> {
    const response = await api.get<{ data: KanbanTask[] }>('/kanban/tasks', {
      params: { projectId },
    });
    return response.data.data;
  },

  /**
   * Listar colunas do projeto
   */
  async getProjectColumns(projectId: string): Promise<KanbanColumn[]> {
    const response = await api.get<{ data: KanbanColumn[] }>(
      `/kanban/projects/${projectId}/columns`
    );
    return response.data.data;
  },

  /**
   * Criar uma task manualmente
   */
  async createTask(data: {
    title: string;
    description?: string;
    columnId: string;
    projectId: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: string;
  }): Promise<KanbanTask> {
    const response = await api.post<KanbanTask>('/kanban/tasks', data);
    return response.data;
  },

  /**
   * Atualizar uma task
   */
  async updateTask(
    taskId: string,
    data: Partial<KanbanTask>
  ): Promise<KanbanTask> {
    const response = await api.patch<KanbanTask>(
      `/kanban/tasks/${taskId}`,
      data
    );
    return response.data;
  },

  /**
   * Deletar uma task
   */
  async deleteTask(taskId: string): Promise<void> {
    await api.delete(`/kanban/tasks/${taskId}`);
  },

  /**
   * Mover task entre colunas
   */
  async moveTask(
    taskId: string,
    columnId: string,
    position: number
  ): Promise<KanbanTask> {
    const response = await api.patch<KanbanTask>(
      `/kanban/tasks/${taskId}/move`,
      {
        columnId,
        position,
      }
    );
    return response.data;
  },

  /**
   * Marcar task como concluída/não concluída
   */
  async toggleTaskComplete(taskId: string): Promise<KanbanTask> {
    const response = await api.patch<KanbanTask>(
      `/kanban/tasks/${taskId}/toggle-complete`
    );
    return response.data;
  },
};
