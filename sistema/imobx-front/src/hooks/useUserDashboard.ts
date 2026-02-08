import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import {
  dashboardApi,
  type UserDashboardResponse,
} from '../services/dashboardApi';

export interface UserDashboardFilters {
  dateRange?: 'today' | '7d' | '30d' | '90d' | '1y' | 'custom';
  compareWith?: 'previous_period' | 'previous_year' | 'none';
  metric?:
    | 'all'
    | 'properties'
    | 'clients'
    | 'inspections'
    | 'appointments'
    | 'commissions'
    | 'tasks'
    | 'matches';
  startDate?: string;
  endDate?: string;
  activitiesLimit?: number;
  appointmentsLimit?: number;
}

// Função para inicializar filtros padrão com data custom (dia 1 do mês até hoje)
const getInitialFilters = (): UserDashboardFilters => {
  const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
  const today = dayjs().format('YYYY-MM-DD');

  return {
    dateRange: 'custom',
    startDate: firstDayOfMonth,
    endDate: today,
    compareWith: 'none',
    metric: 'all',
    activitiesLimit: 10,
    appointmentsLimit: 5,
  };
};

export const useUserDashboard = () => {
  const [data, setData] = useState<UserDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] =
    useState<UserDashboardFilters>(getInitialFilters());

  const fetchUserDashboardData = useCallback(
    async (newFilters?: UserDashboardFilters) => {
      // Usar newFilters se fornecido, senão usar filters do estado
      let filtersToUse = newFilters || filters;

      // Se for custom, garantir que tem startDate e endDate
      if (filtersToUse.dateRange === 'custom') {
        if (!filtersToUse.startDate || !filtersToUse.endDate) {
          const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
          const today = dayjs().format('YYYY-MM-DD');
          filtersToUse = {
            ...filtersToUse,
            startDate: filtersToUse.startDate || firstDayOfMonth,
            endDate: filtersToUse.endDate || today,
          };
        }
      }

      try {
        setLoading(true);
        setError(null);
        // console.log('🔄 Buscando dados do dashboard do usuário...', filtersToUse);
        const response = await dashboardApi.getUserDashboardData(filtersToUse);

        // A API agora retorna a estrutura completa com success e data
        setData(response);

        // console.log('✅ Dados do dashboard do usuário carregados:', response);
      } catch (err: any) {
        console.error(
          '❌ Erro ao carregar dados do dashboard do usuário:',
          err
        );
        setError(
          err.message || 'Erro ao carregar dados do dashboard do usuário'
        );
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    // Passar explicitamente os filtros iniciais na primeira chamada
    const initialFilters = getInitialFilters();
    fetchUserDashboardData(initialFilters);
    // Atualizar os filtros no estado também
    setFilters(initialFilters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateFilters = useCallback(
    (newFilters: Partial<UserDashboardFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      fetchUserDashboardData(updatedFilters);
    },
    [filters, fetchUserDashboardData]
  );

  const refresh = useCallback(() => {
    fetchUserDashboardData();
  }, [fetchUserDashboardData]);

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refresh,
  };
};
