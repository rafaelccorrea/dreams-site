/**
 * Hook para obter workspace pessoal do usuário
 * Conforme documentação: GET /kanban/projects/team/personal
 */

import { useState, useEffect } from 'react';
import { projectsApi } from '../services/projectsApi';
import type { KanbanProject } from '../types/kanban';

interface UsePersonalWorkspaceReturn {
  workspace: KanbanProject | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const usePersonalWorkspace = (): UsePersonalWorkspaceReturn => {
  const [workspace, setWorkspace] = useState<KanbanProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      setError(null);

      // Usar teamId especial "personal" conforme documentação
      const data = await projectsApi.getPersonalWorkspace();

      // A API retorna array, pegar primeiro item (workspace pessoal)
      setWorkspace(data[0] || null);

      // console.log('✅ Workspace pessoal carregado:', data[0]);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao carregar workspace pessoal';
      setError(errorMessage);
      console.error('❌ Erro ao carregar workspace pessoal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, []);

  return {
    workspace,
    loading,
    error,
    refresh: fetchWorkspace,
  };
};
