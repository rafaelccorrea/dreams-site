import { useState, useEffect, useCallback } from 'react';
import { goalsApi } from '../services/goalsApi';
import { toast } from 'react-toastify';
import type {
  GoalType,
  GoalPeriod,
  GoalScope,
  GoalStatus,
  Goal,
  CreateGoalDTO,
  UpdateGoalDTO,
  GoalFilters,
  GoalsListResponse,
  GoalAnalytics,
} from '../types/goal';
import {
  GOAL_TYPE_LABELS,
  GOAL_PERIOD_LABELS,
  GOAL_SCOPE_LABELS,
  GOAL_STATUS_LABELS,
  GOAL_COLORS,
  GOAL_ICONS,
} from '../types/goal';

// Hook para gerenciar metas
export const useGoals = (initialFilters?: GoalFilters) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [statistics, setStatistics] = useState<{
    total: number;
    active: number;
    completed: number;
    failed: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GoalFilters>(initialFilters || {});

  // Buscar metas
  const fetchGoals = useCallback(
    async (newFilters?: GoalFilters) => {
      setLoading(true);
      setError(null);

      try {
        const filtersToUse = newFilters !== undefined ? newFilters : filters;
        const data = await goalsApi.listGoals(filtersToUse);

        setGoals(data.goals);
        setStatistics({
          total: data.total,
          active: data.active,
          completed: data.completed,
          failed: data.failed,
        });
      } catch (err: any) {
        console.error('Erro ao buscar metas:', err);
        setError(err.message || 'Erro ao carregar metas');
        toast.error('Erro ao carregar metas');
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Criar meta
  const createGoal = useCallback(
    async (data: CreateGoalDTO): Promise<Goal> => {
      try {
        const newGoal = await goalsApi.createGoal(data);
        await fetchGoals(); // Recarregar lista
        toast.success('Meta criada com sucesso!');
        return newGoal;
      } catch (err: any) {
        console.error('Erro ao criar meta:', err);
        toast.error('Erro ao criar meta');
        throw err;
      }
    },
    [fetchGoals]
  );

  // Atualizar meta
  const updateGoal = useCallback(
    async (id: string, data: UpdateGoalDTO): Promise<Goal> => {
      try {
        const updatedGoal = await goalsApi.updateGoal(id, data);
        await fetchGoals(); // Recarregar lista
        toast.success('Meta atualizada com sucesso!');
        return updatedGoal;
      } catch (err: any) {
        console.error('Erro ao atualizar meta:', err);
        toast.error('Erro ao atualizar meta');
        throw err;
      }
    },
    [fetchGoals]
  );

  // Excluir meta
  const deleteGoal = useCallback(
    async (id: string): Promise<void> => {
      try {
        await goalsApi.deleteGoal(id);
        await fetchGoals(); // Recarregar lista
        toast.success('Meta excluída com sucesso!');
      } catch (err: any) {
        console.error('Erro ao excluir meta:', err);
        toast.error('Erro ao excluir meta');
        throw err;
      }
    },
    [fetchGoals]
  );

  // Duplicar meta
  const duplicateGoal = useCallback(
    async (id: string): Promise<Goal> => {
      try {
        const duplicatedGoal = await goalsApi.duplicateGoal(id);
        await fetchGoals(); // Recarregar lista
        toast.success('Meta duplicada com sucesso!');
        return duplicatedGoal;
      } catch (err: any) {
        console.error('Erro ao duplicar meta:', err);
        toast.error('Erro ao duplicar meta');
        throw err;
      }
    },
    [fetchGoals]
  );

  // Atualizar progresso
  const refreshProgress = useCallback(
    async (id: string): Promise<void> => {
      try {
        await goalsApi.refreshGoalProgress(id);
        await fetchGoals(); // Recarregar lista
        toast.success('Progresso atualizado com sucesso!');
      } catch (err: any) {
        console.error('Erro ao atualizar progresso:', err);
        toast.error('Erro ao atualizar progresso');
        throw err;
      }
    },
    [fetchGoals]
  );

  // Buscar analytics de uma meta
  const getGoalAnalytics = useCallback(
    async (id: string): Promise<GoalAnalytics> => {
      try {
        return await goalsApi.getGoalAnalytics(id);
      } catch (err: any) {
        console.error('Erro ao buscar analytics da meta:', err);
        toast.error('Erro ao buscar analytics');
        throw err;
      }
    },
    []
  );

  // Buscar meta mensal ativa (para dashboard)
  const getActiveMonthlyGoal = useCallback(async (): Promise<Goal | null> => {
    try {
      return await goalsApi.getActiveMonthlyGoal();
    } catch {
      return null;
    }
  }, []);

  // Atualizar filtros
  const updateFilters = useCallback(
    (newFilters: Partial<GoalFilters>) => {
      setFilters(prev => {
        // Se o objeto de filtros está vazio, limpar tudo
        if (Object.keys(newFilters).length === 0) {
          const emptyFilters: GoalFilters = {};
          fetchGoals(emptyFilters);
          return emptyFilters;
        }

        // Mesclar filtros, removendo valores undefined ou vazios
        const updatedFilters = { ...prev };
        Object.keys(newFilters).forEach(key => {
          const value = (newFilters as any)[key];
          if (value === undefined || value === '' || value === null) {
            delete updatedFilters[key as keyof GoalFilters];
          } else {
            (updatedFilters as any)[key] = value;
          }
        });

        // Buscar metas imediatamente com os novos filtros
        fetchGoals(updatedFilters);
        return updatedFilters;
      });
    },
    [fetchGoals]
  );

  // Carregar metas ao montar o componente
  useEffect(() => {
    fetchGoals();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // Estado
    goals,
    statistics,
    loading,
    error,
    filters,

    // Ações
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    duplicateGoal,
    refreshProgress,
    getGoalAnalytics,
    getActiveMonthlyGoal,
    updateFilters,
  };
};

// Exportações explícitas
export type {
  GoalType,
  GoalPeriod,
  GoalScope,
  GoalStatus,
  Goal,
  CreateGoalDTO,
  UpdateGoalDTO,
  GoalFilters,
  GoalsListResponse,
  GoalAnalytics,
};

export {
  GOAL_TYPE_LABELS,
  GOAL_PERIOD_LABELS,
  GOAL_SCOPE_LABELS,
  GOAL_STATUS_LABELS,
  GOAL_COLORS,
  GOAL_ICONS,
};
