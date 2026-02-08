import { useState, useEffect } from 'react';
import { projectsApi } from '../services/projectsApi';
import type { KanbanProjectLimit } from '../types/subscriptionTypes';

/**
 * Hook para obter informações de limite de projetos Kanban
 *
 * Usa o endpoint específico `/kanban/projects/limits` que retorna informações
 * completas sobre limites, incluindo quantidade atual, restante e status.
 *
 * @example
 * ```tsx
 * const { limitInfo, loading, error, refresh } = useKanbanProjectLimit();
 *
 * if (loading) return <div>Carregando...</div>;
 *
 * return (
 *   <div>
 *     <p>Projetos: {limitInfo?.current} / {limitInfo?.limit}</p>
 *     {limitInfo?.canCreate === false && (
 *       <p>Limite atingido!</p>
 *     )}
 *     {limitInfo?.message && (
 *       <p>{limitInfo.message}</p>
 *     )}
 *   </div>
 * );
 * ```
 */
export function useKanbanProjectLimit() {
  const [limitInfo, setLimitInfo] = useState<KanbanProjectLimit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLimitInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      // Usar o novo endpoint específico para limites de projetos kanban
      const limitsData = await projectsApi.getProjectLimits();

      setLimitInfo({
        limit: limitsData.limit,
        current: limitsData.current,
        remaining: limitsData.remaining,
        percentUsed: limitsData.percentUsed,
        isNearLimit: limitsData.isNearLimit,
        canCreate: limitsData.canCreate,
        message: limitsData.message,
      });
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        'Erro ao carregar informações de limite';
      setError(errorMessage);
      console.error('Error fetching kanban project limit:', err);

      // Em caso de erro, definir valores padrão
      setLimitInfo({
        limit: 3,
        current: 0,
        remaining: 3,
        percentUsed: 0,
        isNearLimit: false,
        canCreate: true,
        message: 'Não foi possível carregar informações de limite',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimitInfo();
  }, []);

  return { limitInfo, loading, error, refresh: fetchLimitInfo };
}
