import { useMemo, useCallback } from 'react';
import { useDashboard } from './useDashboard';

/**
 * Hook otimizado para o dashboard que implementa:
 * - Memoização de dados computados
 * - Debounce para filtros
 * - Cache inteligente
 */
export const useOptimizedDashboard = () => {
  const dashboardHook = useDashboard();

  console.log('🔍 useOptimizedDashboard chamado:', {
    loading: dashboardHook.loading,
    hasData: !!dashboardHook.data,
    error: dashboardHook.error,
  });

  // Memoizar dados computados para evitar recálculos desnecessários
  const memoizedData = useMemo(() => {
    if (!dashboardHook.data) return null;

    return {
      statistics: dashboardHook.data.statistics,
      charts: dashboardHook.data.charts,
      goals: dashboardHook.data.goals,
      performance: dashboardHook.data.performance,
      activities: dashboardHook.data.activities,
      topPerformers: dashboardHook.data.topPerformers,
      tasks: dashboardHook.data.tasks,
      leads: dashboardHook.data.leads,
      leadSources: dashboardHook.data.leadSources,
    };
  }, [dashboardHook.data]);

  // Memoizar função de atualização de filtros com debounce
  const debouncedUpdateFilters = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (filters: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          dashboardHook.updateFilters(filters);
        }, 300); // Debounce de 300ms
      };
    })(),
    [dashboardHook.updateFilters]
  );

  // Retornar todos os métodos e estados do hook original, mas com dados memoizados
  return {
    data: memoizedData,
    loading: dashboardHook.loading,
    error: dashboardHook.error,
    filters: dashboardHook.filters,
    updateFilters: debouncedUpdateFilters,
    refresh: dashboardHook.refresh,
    clearCache: dashboardHook.clearCache,
    fetchDashboard: dashboardHook.fetchDashboard, // Adicionar o método fetchDashboard
  };
};
