import { useState, useEffect, useCallback } from 'react';
import { projectsApi } from '../services/projectsApi';
import { useAutoReloadOnCompanyChange } from './useCompanyMonitor';
import type {
  KanbanProject,
  CreateKanbanProjectDto,
  UpdateKanbanProjectDto,
  KanbanProjectResponseDto,
  // ProjectFiltersDto,
} from '../types/kanban';

interface UseProjectsReturn {
  projects: KanbanProject[];
  loading: boolean;
  error: string | null;
  createProject: (
    data: CreateKanbanProjectDto
  ) => Promise<KanbanProjectResponseDto>;
  updateProject: (
    id: string,
    data: UpdateKanbanProjectDto
  ) => Promise<KanbanProjectResponseDto>;
  deleteProject: (id: string) => Promise<void>;
  finalizeProject: (id: string) => Promise<KanbanProjectResponseDto>;
  getProjectsByTeam: (teamId: string) => Promise<KanbanProjectResponseDto[]>;
  getProjectById: (id: string) => Promise<KanbanProjectResponseDto>;
  getProjectHistory: (id: string) => Promise<any[]>;
  refreshProjects: () => Promise<void>;
}

export const useProjects = (teamId?: string): UseProjectsReturn => {
  const [projects, setProjects] = useState<KanbanProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = useCallback(
    async (data: CreateKanbanProjectDto): Promise<KanbanProjectResponseDto> => {
      try {
        setLoading(true);
        setError(null);
        const newProject = await projectsApi.createProject(data);

        // Atualizar lista local
        setProjects(prev => [...prev, newProject]);

        return newProject;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao criar projeto';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateProject = useCallback(
    async (
      id: string,
      data: UpdateKanbanProjectDto
    ): Promise<KanbanProjectResponseDto> => {
      try {
        setLoading(true);
        setError(null);
        const updatedProject = await projectsApi.updateProject(id, data);

        // Atualizar lista local
        setProjects(prev =>
          prev.map(project => (project.id === id ? updatedProject : project))
        );

        return updatedProject;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao atualizar projeto';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await projectsApi.deleteProject(id);

      // Remover da lista local
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao excluir projeto';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const finalizeProject = useCallback(
    async (id: string): Promise<KanbanProjectResponseDto> => {
      try {
        setLoading(true);
        setError(null);
        const finalizedProject = await projectsApi.finalizeProject(id);

        // Atualizar lista local
        setProjects(prev =>
          prev.map(project => (project.id === id ? finalizedProject : project))
        );

        return finalizedProject;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao finalizar projeto';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getProjectsByTeam = useCallback(
    async (requestedTeamId: string): Promise<KanbanProjectResponseDto[]> => {
      try {
        // Validar teamId antes de fazer a requisição
        if (
          !requestedTeamId ||
          requestedTeamId === 'undefined' ||
          requestedTeamId === 'null'
        ) {
          throw new Error('ID da equipe é obrigatório');
        }

        setLoading(true);
        setError(null);
        const teamProjects =
          await projectsApi.getProjectsByTeam(requestedTeamId);

        // Atualizar lista local se for a equipe atual do hook
        if (requestedTeamId === teamId) {
          setProjects(teamProjects);
        }

        return teamProjects;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao carregar projetos';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [teamId]
  );

  const getProjectById = useCallback(
    async (id: string): Promise<KanbanProjectResponseDto> => {
      try {
        setLoading(true);
        setError(null);
        return await projectsApi.getProjectById(id);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao carregar projeto';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getProjectHistory = useCallback(async (id: string): Promise<any[]> => {
    try {
      setLoading(true);
      setError(null);
      return await projectsApi.getProjectHistory(id);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao carregar histórico';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProjects = useCallback(async (): Promise<void> => {
    if (teamId && teamId !== 'undefined' && teamId !== 'null') {
      try {
        await getProjectsByTeam(teamId);
      } catch (err: any) {
        // Se for erro de teamId obrigatório, apenas limpar projetos e não propagar erro
        if (err.message?.includes('ID da equipe é obrigatório')) {
          setProjects([]);
          setError(null);
          return;
        }
        throw err;
      }
    } else {
      // Se não tem teamId válido, limpar projetos
      setProjects([]);
      setError(null);
    }
  }, [teamId, getProjectsByTeam]);

  // Carregar projetos quando teamId mudar
  useEffect(() => {
    if (teamId && teamId !== 'undefined' && teamId !== 'null') {
      refreshProjects().catch(err => {
        // Erro já foi tratado no refreshProjects
        console.error('Erro ao carregar projetos:', err);
      });
    } else {
      // Limpar projetos se não tem teamId válido
      setProjects([]);
      setError(null);
    }
  }, [teamId, refreshProjects]);

  // Função estável para limpar projetos (sem dependências para evitar loop)
  const clearProjects = useCallback(() => {
    setProjects([]);
    setError(null);
    // console.log('🧹 Projetos limpos após mudança de empresa');
  }, []); // Sem dependências para evitar loop

  // Monitorar mudanças de empresa e limpar projetos automaticamente
  useAutoReloadOnCompanyChange(clearProjects);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    finalizeProject,
    getProjectsByTeam,
    getProjectById,
    getProjectHistory,
    refreshProjects,
  };
};
