import { api } from './api';
import type {
  // KanbanProject,
  CreateKanbanProjectDto,
  UpdateKanbanProjectDto,
  KanbanProjectResponseDto,
  PaginatedKanbanProjectsResponseDto,
  ProjectFiltersDto,
} from '../types/kanban';

export const projectsApi = {
  // Criar projeto
  async createProject(
    data: CreateKanbanProjectDto
  ): Promise<KanbanProjectResponseDto> {
    const response = await api.post('/kanban/projects', data);
    return response.data;
  },

  // Listar projetos por equipe
  async getProjectsByTeam(teamId: string): Promise<KanbanProjectResponseDto[]> {
    if (!teamId || teamId === 'undefined' || teamId === 'null') {
      throw new Error('ID da equipe é obrigatório');
    }
    const response = await api.get(`/kanban/projects/team/${teamId}`);
    return response.data;
  },

  // Obter workspace pessoal (criado automaticamente na primeira chamada)
  async getPersonalWorkspace(): Promise<KanbanProjectResponseDto[]> {
    const response = await api.get('/kanban/projects/team/personal');
    return response.data;
  },

  // Listar projetos com filtros
  async getFilteredProjects(
    filters: ProjectFiltersDto
  ): Promise<PaginatedKanbanProjectsResponseDto> {
    const response = await api.get('/kanban/projects/filtered', {
      params: filters,
    });
    return response.data;
  },

  // Obter projeto por ID
  async getProjectById(id: string): Promise<KanbanProjectResponseDto> {
    const response = await api.get(`/kanban/projects/${id}`);
    return response.data;
  },

  // Atualizar projeto
  async updateProject(
    id: string,
    data: UpdateKanbanProjectDto
  ): Promise<KanbanProjectResponseDto> {
    const response = await api.put(`/kanban/projects/${id}`, data);
    return response.data;
  },

  // Excluir projeto
  async deleteProject(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/kanban/projects/${id}`);
    return response.data;
  },

  // Finalizar projeto
  async finalizeProject(id: string): Promise<KanbanProjectResponseDto> {
    const response = await api.post(`/kanban/projects/${id}/finalize`);
    return response.data;
  },

  // Obter histórico de projetos da equipe
  async getProjectsHistory(
    teamId: string
  ): Promise<KanbanProjectResponseDto[]> {
    if (!teamId || teamId === 'undefined' || teamId === 'null') {
      throw new Error('ID da equipe é obrigatório');
    }
    const response = await api.get(`/kanban/projects/team/${teamId}/history`);
    return response.data;
  },

  // Obter histórico do projeto
  async getProjectHistory(id: string): Promise<any[]> {
    const response = await api.get(`/kanban/projects/${id}/history`);
    return response.data;
  },

  // Obter limites de projetos kanban
  async getProjectLimits(): Promise<{
    limit: number;
    current: number;
    remaining: number;
    percentUsed: number;
    isNearLimit: boolean;
    canCreate: boolean;
    message: string;
  }> {
    const response = await api.get('/kanban/projects/limits');
    return response.data;
  },
};
