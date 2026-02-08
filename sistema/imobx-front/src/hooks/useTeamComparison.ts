import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { performanceApi } from '../services/performanceApi';

type ComparisonMode = 'normal' | 'exclude-shared' | 'manual-assign';

interface TeamComparisonResponse {
  teams: any[];
  comparison: any[];
  sharedUsers?: any[];
}

export const useTeamComparison = () => {
  const [data, setData] = useState<TeamComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ComparisonMode>('normal');

  const compare = useCallback(
    async (
      teamIds: string[],
      startDate?: string,
      endDate?: string,
      assignments?: Record<string, string>
    ) => {
      if (teamIds.length < 2) {
        toast.warning('Selecione pelo menos 2 times para comparar');
        return;
      }

      if (teamIds.length > 4) {
        toast.error('Você pode comparar no máximo 4 times');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const body: any = {
          teamIds,
          startDate:
            startDate ||
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0],
          endDate: endDate || new Date().toISOString().split('T')[0],
        };

        if (mode === 'exclude-shared') {
          body.excludeSharedUsers = true;
        } else if (mode === 'manual-assign' && assignments) {
          body.assignSharedUsersTo = assignments;
        }

        const result = await performanceApi.compareTeams(body);
        setData(result);

        // Mostrar aviso se há usuários compartilhados no modo normal
        if (
          mode === 'normal' &&
          result.sharedUsers &&
          result.sharedUsers.length > 0
        ) {
          toast.warning(
            `${result.sharedUsers.length} usuário(s) em múltiplos times detectado(s)`
          );
        }

        toast.success(`${teamIds.length} times comparados com sucesso!`);
        return result;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao comparar times';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mode]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    mode,
    setMode,
    compare,
    reset,
  };
};
