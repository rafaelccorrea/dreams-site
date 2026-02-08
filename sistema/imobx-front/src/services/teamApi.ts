import { api } from './api';
import type { TeamFilters } from '../types/filters';

export interface Team {
  id: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  createdById?: string;
  memberCount?: number;
  members?: TeamMember[];
}

export interface TeamMember {
  id: string;
  userId?: string;
  teamId?: string;
  role: 'admin' | 'member';
  isActive?: boolean;
  joinedAt?: string;
  createdAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
  };
}

export interface CreateTeamDto {
  name: string;
  description?: string;
  color: string;
  userIds: string[];
}

export interface UpdateTeamDto {
  name?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
  userIds?: string[];
}

export interface AddTeamMemberDto {
  userId: string;
  role: 'admin' | 'member';
}

export interface TeamFilters {
  teamName?: string;
  memberName?: string;
  tag?: string;
  status?: string;
  color?: string;
  dateRange?: string;
  search?: string;
  page?: string;
  limit?: string;
  onlyMyData?: boolean;
}

export interface PaginatedTeamsResponse {
  data: Team[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class TeamApiService {
  private baseUrl = '/teams';

  async getTeams(): Promise<Team[]> {
    try {
      // console.log('👥 Buscando equipes...');
      // console.log('🔗 URL da requisição:', `${api.defaults.baseURL}${this.baseUrl}`);
      const response = await api.get(this.baseUrl);
      // console.log('✅ Equipes obtidas:', response.data);
      // console.log('📊 Status da resposta:', response.status);
      // console.log('📋 Headers da resposta:', response.headers);
      // console.log('📊 Tipo da resposta:', typeof response.data, Array.isArray(response.data));
      // Garantir que retornamos um array
      const teamsData = Array.isArray(response.data) ? response.data : [];
      // console.log('📊 Dados processados:', teamsData);
      return teamsData;
    } catch (error: any) {
      console.error('❌ Erro ao buscar equipes:', error);
      console.error('❌ Status do erro:', error.response?.status);
      console.error('❌ Dados do erro:', error.response?.data);
      console.error('❌ Headers do erro:', error.response?.headers);
      throw this.handleError(error);
    }
  }

  async getTeamsWithFilters(
    filters: TeamFilters
  ): Promise<PaginatedTeamsResponse> {
    try {
      // console.log('🔍 Buscando equipes com filtros:', filters);
      const params = new URLSearchParams();

      // Adicionar apenas parâmetros que têm valor
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(
        `${this.baseUrl}/filtered?${params.toString()}`
      );
      // console.log('✅ Equipes filtradas obtidas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar equipes com filtros:', error);
      throw this.handleError(error);
    }
  }

  async getTeam(teamId: string): Promise<Team> {
    try {
      // console.log('👥 Buscando equipe:', teamId);
      const response = await api.get(`${this.baseUrl}/${teamId}`);
      // console.log('✅ Equipe obtida:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar equipe:', error);
      throw this.handleError(error);
    }
  }

  async createTeam(data: CreateTeamDto): Promise<Team> {
    try {
      // console.log('➕ Criando equipe:', data);
      const response = await api.post(this.baseUrl, data);
      // console.log('✅ Equipe criada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar equipe:', error);
      throw this.handleError(error);
    }
  }

  async updateTeam(teamId: string, data: UpdateTeamDto): Promise<Team> {
    try {
      // console.log('✏️ Atualizando equipe:', teamId, data);
      const response = await api.put(`${this.baseUrl}/${teamId}`, data);
      // console.log('✅ Equipe atualizada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar equipe:', error);
      throw this.handleError(error);
    }
  }

  async deleteTeam(teamId: string): Promise<void> {
    try {
      // console.log('🗑️ Excluindo equipe:', teamId);
      await api.delete(`${this.baseUrl}/${teamId}`);
      // console.log('✅ Equipe excluída');
    } catch (error: any) {
      console.error('❌ Erro ao excluir equipe:', error);
      throw this.handleError(error);
    }
  }

  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      // console.log('👥 Buscando membros da equipe:', teamId);
      const response = await api.get(`${this.baseUrl}/${teamId}/members`);
      // console.log('✅ Membros obtidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar membros:', error);
      throw this.handleError(error);
    }
  }

  async addTeamMember(
    teamId: string,
    data: AddTeamMemberDto
  ): Promise<TeamMember> {
    try {
      // console.log('➕ Adicionando membro à equipe:', teamId, data);
      const response = await api.post(
        `${this.baseUrl}/${teamId}/members`,
        data
      );
      // console.log('✅ Membro adicionado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao adicionar membro:', error);
      throw this.handleError(error);
    }
  }

  async removeTeamMember(teamId: string, userId: string): Promise<void> {
    try {
      // console.log('🗑️ Removendo membro da equipe:', teamId, userId);
      await api.delete(`${this.baseUrl}/${teamId}/members/${userId}`);
      // console.log('✅ Membro removido');
    } catch (error: any) {
      console.error('❌ Erro ao remover membro:', error);
      throw this.handleError(error);
    }
  }

  async updateTeamMemberRole(
    teamId: string,
    userId: string,
    role: 'admin' | 'member'
  ): Promise<TeamMember> {
    try {
      // console.log('✏️ Atualizando role do membro:', teamId, userId, role);
      const response = await api.put(
        `${this.baseUrl}/${teamId}/members/${userId}`,
        { role }
      );
      // console.log('✅ Role atualizada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar role:', error);
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

export const teamApi = new TeamApiService();
