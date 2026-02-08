import { useState, useEffect, useContext } from 'react';
import { api } from '@/services/api';
import { CompanyContext } from '@/contexts/CompanyContextDefinition';
import type {
  DashboardPerformanceResponse,
  UserPerformance,
  TeamPerformance,
  UsersComparisonResponse,
  TeamsComparisonResponse,
  PerformanceQueryParams,
  CompareUsersRequest,
  CompareTeamsRequest,
} from '@/types/performance';

/**
 * Hook para carregar o dashboard completo de performance
 */
export function useDashboardPerformance(startDate?: Date, endDate?: Date) {
  const { selectedCompany } = useContext(CompanyContext) || {
    selectedCompany: null,
  };
  const [data, setData] = useState<DashboardPerformanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const params: PerformanceQueryParams = {};
        if (startDate) params.startDate = startDate.toISOString();
        if (endDate) params.endDate = endDate.toISOString();

        const response = await api.get<DashboardPerformanceResponse>(
          '/matches/performance/dashboard',
          { params }
        );

        setData(response.data);
      } catch (err) {
        const error = err as Error;
        console.error('Erro ao carregar dashboard de performance:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [startDate, endDate, selectedCompany?.id]);

  const refresh = () => {
    setLoading(true);
    setError(null);
  };

  return { data, loading, error, refresh };
}

/**
 * Hook para carregar performance de um usuário específico
 */
export function useUserPerformance(
  userId: string | null,
  startDate?: Date,
  endDate?: Date
) {
  const { selectedCompany } = useContext(CompanyContext) || {
    selectedCompany: null,
  };
  const [data, setData] = useState<UserPerformance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setData(null);
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const params: PerformanceQueryParams = {};
        if (startDate) params.startDate = startDate.toISOString();
        if (endDate) params.endDate = endDate.toISOString();

        const response = await api.get<UserPerformance>(
          `/matches/performance/user/${userId}`,
          { params }
        );

        setData(response.data);
      } catch (err) {
        const error = err as Error;
        console.error('Erro ao carregar performance do usuário:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userId, startDate, endDate, selectedCompany?.id]);

  return { data, loading, error };
}

/**
 * Hook para carregar performance de uma equipe
 */
export function useTeamPerformance(
  teamId: string | null,
  startDate?: Date,
  endDate?: Date
) {
  const { selectedCompany } = useContext(CompanyContext) || {
    selectedCompany: null,
  };
  const [data, setData] = useState<TeamPerformance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!teamId) {
      setData(null);
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const params: PerformanceQueryParams = {};
        if (startDate) params.startDate = startDate.toISOString();
        if (endDate) params.endDate = endDate.toISOString();

        const response = await api.get<TeamPerformance>(
          `/matches/performance/team/${teamId}`,
          { params }
        );

        setData(response.data);
      } catch (err) {
        const error = err as Error;
        console.error('Erro ao carregar performance da equipe:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [teamId, startDate, endDate, selectedCompany?.id]);

  return { data, loading, error };
}

/**
 * Hook para comparar usuários
 */
export function useCompareUsers() {
  const [data, setData] = useState<UsersComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const compare = async (
    userIds: string[],
    filters?: {
      startDate?: string;
      endDate?: string;
      propertyType?: 'sale' | 'rental' | 'all';
      region?: string;
      minPrice?: number;
      maxPrice?: number;
    }
  ) => {
    if (userIds.length < 2) return;
    if (userIds.length > 5) return;

    setLoading(true);
    setError(null);

    try {
      const body: any = {
        userIds,
      };

      if (filters?.startDate) body.startDate = filters.startDate;
      if (filters?.endDate) body.endDate = filters.endDate;
      // Sempre enviar propertyType (incluindo 'all')
      if (filters?.propertyType) body.propertyType = filters.propertyType;
      if (filters?.region) body.region = filters.region;
      if (filters?.minPrice !== undefined) body.minPrice = filters.minPrice;
      if (filters?.maxPrice !== undefined) body.maxPrice = filters.maxPrice;

      const response = await api.post<UsersComparisonResponse>(
        '/matches/performance/compare/users',
        body
      );

      setData(response.data);
    } catch (err) {
      const error = err as Error;
      console.error('Erro ao comparar usuários:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
  };

  return { data, loading, error, compare, reset };
}

/**
 * Hook para comparar equipes
 */
export function useCompareTeams() {
  const [data, setData] = useState<TeamsComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const compare = async (
    teamIds: string[],
    filters?: {
      startDate?: string;
      endDate?: string;
      propertyType?: 'sale' | 'rental' | 'all';
      region?: string;
      minPrice?: number;
      maxPrice?: number;
      excludeSharedUsers?: boolean;
      assignSharedUsersTo?: Record<string, string>;
    }
  ) => {
    if (teamIds.length < 2) return;
    if (teamIds.length > 4) return;

    setLoading(true);
    setError(null);

    try {
      const body: any = {
        teamIds,
      };

      if (filters?.startDate) body.startDate = filters.startDate;
      if (filters?.endDate) body.endDate = filters.endDate;
      // Sempre enviar propertyType (incluindo 'all')
      if (filters?.propertyType) body.propertyType = filters.propertyType;
      if (filters?.region) body.region = filters.region;
      if (filters?.minPrice !== undefined) body.minPrice = filters.minPrice;
      if (filters?.maxPrice !== undefined) body.maxPrice = filters.maxPrice;
      if (filters?.excludeSharedUsers !== undefined)
        body.excludeSharedUsers = filters.excludeSharedUsers;
      if (
        filters?.assignSharedUsersTo &&
        Object.keys(filters.assignSharedUsersTo).length > 0
      ) {
        body.assignSharedUsersTo = filters.assignSharedUsersTo;
      }

      const response = await api.post<TeamsComparisonResponse>(
        '/matches/performance/compare/teams',
        body
      );

      setData(response.data);
    } catch (err) {
      const error = err as Error;
      console.error('Erro ao comparar equipes:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
  };

  return { data, loading, error, compare, reset };
}
