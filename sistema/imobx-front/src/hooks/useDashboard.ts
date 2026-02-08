import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { authStorage } from '../services/authStorage';
import dayjs from 'dayjs';
import { useRetry } from './useRetry';

export interface DashboardFilters {
  dateRange: 'today' | '7d' | '30d' | '90d' | '1y' | 'custom';
  compareWith?: 'previous_period' | 'previous_year' | 'none';
  teamMember?: string;
  metric?: 'all' | 'sales' | 'revenue' | 'leads' | 'conversions';
  startDate?: string;
  endDate?: string;
  companyIds?: string[]; // Multi-empresa
}

export interface DashboardOverview {
  statistics: {
    totalProperties: number;
    propertiesGrowth: number;
    totalUsers: number;
    usersGrowth: number;
    totalSales: number;
    salesGrowth: number;
    averageRating: null;
    ratingGrowth: null;
    totalRevenue: number;
    revenueGrowth: number;
    activeClients: number;
    clientsGrowth: number;
    conversionRate: number;
    conversionGrowth: number;
    totalLeads: number;
    leadsGrowth: number;
    appointments: number;
    appointmentsGrowth: number;
    pendingDocuments: number;
    documentsGrowth: number;
    comparison?: {
      enabled: boolean;
      period: string;
      data: any;
    };
  };
  charts: {
    sales: {
      labels: string[];
      values: number[];
      comparison?: {
        labels: string[];
        values: number[];
      };
    };
    propertyTypes: {
      forSale: number;
      forRent: number;
      total: number;
      distribution: {
        apartment: number;
        house: number;
        commercial: number;
        land: number;
        rural: number;
      };
    };
    locations: {
      labels: string[];
      values: number[];
      percentages: number[];
    };
  };
  goals: {
    monthly: {
      target: number;
      current: number;
      progress: number;
      remaining: number;
      daysLeft: number;
      dailyTarget: number;
      onTrack: boolean;
      breakdown: {
        sales: number;
        rentals: number;
      };
    };
    salesTarget: {
      monthlyTarget: number;
      currentSales: number;
      monthlyProgress: number;
      remaining: number;
      breakdown: {
        sales: {
          count: number;
          value: number;
          target: number;
          progress: number;
        };
        rentals: {
          count: number;
          value: number;
          target: number;
          progress: number;
        };
      };
      projectedTotal: number;
      onTrack: boolean;
      daysInMonth: number;
      daysElapsed: number;
      daysRemaining: number;
    };
  };
  performance: {
    team: {
      completedTasks: number;
      pendingTasks: number;
      teamPerformance: number;
      averageResponseTime: string;
      taskCompletionRate: number;
      members: Array<{
        userId: string;
        name: string;
        completedTasks: number;
        pendingTasks: number;
        performance: number;
      }>;
    };
    business: {
      averageDealSize: number;
      dealSizeGrowth: number;
      occupancyRate: number;
      occupancyGrowth: number;
      averageSaleTime: null;
      saleTimeChange: null;
      averageRentTime: null;
      rentTimeChange: null;
    };
  };
  topPerformers: {
    performers: Array<{
      userId: string;
      name: string;
      avatar?: string;
      sales: number;
      revenue: number;
      growth: number;
      rank: number;
      conversions: number;
      leads: number;
    }>;
    period: string;
    totalSales: number;
    totalRevenue: number;
  };
  tasks: {
    tasks: Array<{
      id: string;
      title: string;
      dueDate: string;
      priority: 'low' | 'medium' | 'high' | 'urgent';
      assignee: {
        id: string;
        name: string;
      };
      status: string;
      relatedEntity?: {
        type: string;
        id: string;
        name: string;
      };
    }>;
    total: number;
    overdue: number;
    dueToday: number;
    dueTomorrow: number;
  };
  leads: {
    leads: Array<{
      id: string;
      name: string;
      phone: string;
      email?: string;
      location: string;
      interest: string;
      source: string;
      score: number;
      createdAt: string;
      assignedTo?: {
        id: string;
        name: string;
      };
      status: string;
      interestType: string;
    }>;
    total: number;
    newToday: number;
    avgScore: number;
    conversionRate: number;
  };
  activities: {
    activities: Array<{
      id: string;
      type: 'property' | 'sale' | 'rental' | 'user' | 'client';
      title: string;
      description: string;
      createdAt: string;
      user: {
        id: string;
        name: string;
      };
      metadata?: any;
    }>;
    total: number;
    hasMore: boolean;
  };
  documents: {
    total: number;
    documents: Array<{
      id: string;
      title: string;
      type: string;
      uploadedAt: string;
      uploadedBy: {
        id: string;
        name: string;
      };
      relatedTo?: {
        type: 'client' | 'property';
        id: string;
        name: string;
      };
    }>;
    byType: {
      personal_document: number;
      property_document: number;
      contract: number;
      other: number;
    };
  };
  appointments: {
    total: number;
    growth: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    upcoming: Array<{
      id: string;
      title: string;
      dateTime: string;
      client?: {
        id: string;
        name: string;
      };
      property?: {
        id: string;
        title: string;
      };
      assignedTo: {
        id: string;
        name: string;
      };
      type: string;
      status: string;
    }>;
    byType: {
      visit: number;
      meeting: number;
    };
  };
  leadSources: {
    sources: Array<{
      source: string;
      label: string;
      count: number;
      percentage: number;
    }>;
    total: number;
    withoutSource: number;
  };
  filters: {
    applied: DashboardFilters;
    availableUsers: Array<{
      id: string;
      name: string;
    }>;
  };
  generatedAt: string;
  cacheValidUntil?: string;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Função para gerar chave de cache única por empresa
const getCacheKey = (companyId?: string) => {
  const baseKey = 'dashboard-overview';
  return companyId ? `${baseKey}-${companyId}` : baseKey;
};

// Função para limpar todos os caches de dashboard
const clearAllDashboardCaches = () => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('dashboard-overview')) {
      localStorage.removeItem(key);
    }
  });
};

// Função para inicializar filtros padrão baseado no role do usuário
const getInitialFilters = (): DashboardFilters => {
  const userData = authStorage.getUserData();
  const isAdminOrMaster =
    userData?.role === 'admin' || userData?.role === 'master';

  // Se for admin/master, usar período custom com primeiro dia do mês até hoje
  if (isAdminOrMaster) {
    const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');
    return {
      dateRange: 'custom',
      startDate: firstDayOfMonth,
      endDate: today,
      compareWith: 'none',
      teamMember: undefined,
      metric: 'all',
    };
  }

  // Para outros usuários, usar padrão de 30 dias
  return {
    dateRange: '30d',
    compareWith: 'none',
    teamMember: undefined,
    metric: 'all',
  };
};

export const useDashboard = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>(getInitialFilters());
  const { executeWithRetry, canRetry } = useRetry({
    maxRetries: 3,
    retryWindowMs: 60000,
  });

  const fetchDashboard = useCallback(
    async (newFilters?: DashboardFilters) => {
      const filtersToUse = newFilters || filters;

      console.log('🚀 fetchDashboard chamado com filtros:', filtersToUse);

      // CORREÇÃO: Aguardar Company ID estar disponível antes de fazer requisição
      // Isso evita bloqueio prematuro quando o Company ID ainda está sendo carregado após login
      let companyId = localStorage.getItem('dream_keys_selected_company_id');
      const userData = authStorage.getUserData();

      // Se não tem Company ID, aguardar um pouco (pode estar sendo carregado após login)
      if (!companyId && userData) {
        console.log(
          '⏳ useDashboard: Company ID não encontrado, aguardando carregamento...'
        );

        // Aguardar até 3 segundos pelo Company ID (tempo suficiente para o useAuth carregar)
        const maxWaitTime = 3000; // 3 segundos
        const checkInterval = 100; // Verificar a cada 100ms
        const startTime = Date.now();

        while (!companyId && Date.now() - startTime < maxWaitTime) {
          await new Promise(resolve => setTimeout(resolve, checkInterval));
          companyId = localStorage.getItem('dream_keys_selected_company_id');

          if (companyId) {
            console.log(
              '✅ useDashboard: Company ID encontrado após aguardar:',
              companyId
            );
            break;
          }
        }

        // Se ainda não tem Company ID, tentar usar do userData como fallback
        if (!companyId) {
          companyId = userData?.companyId;
          if (companyId) {
            console.log(
              '✅ useDashboard: Usando Company ID do userData:',
              companyId
            );
          }
        }

        // Se ainda não tem, não fazer requisição (vai falhar mesmo)
        if (!companyId) {
          console.error(
            '❌ useDashboard: Company ID não encontrado após aguardar, abortando requisição'
          );
          setError(
            'Company ID não encontrado. Aguarde o carregamento da empresa.'
          );
          setLoading(false);
          return;
        }
      }

      const cacheKey = getCacheKey(companyId);

      // Verificar cache
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const {
            data: cachedData,
            timestamp,
            filters: cachedFilters,
          } = JSON.parse(cached);

          // Validar cache: mesmos filtros e dentro do TTL
          if (
            Date.now() - timestamp < CACHE_TTL &&
            JSON.stringify(cachedFilters) === JSON.stringify(filtersToUse)
          ) {
            setData(cachedData);
            setLoading(false);
            return;
          }
        } catch {
          // Cache inválido, continuar com fetch
        }
      }

      // Verificar se pode tentar antes de iniciar
      if (!canRetry()) {
        setError(
          'Limite de tentativas excedido. Aguarde 1 minuto antes de tentar novamente.'
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('dateRange', filtersToUse.dateRange);

      if (filtersToUse.compareWith && filtersToUse.compareWith !== 'none') {
        params.append('compareWith', filtersToUse.compareWith);
      }

      if (filtersToUse.teamMember) {
        params.append('teamMember', filtersToUse.teamMember);
      }

      // Multi-empresa: adicionar companyIds[] apenas se selecionadas
      if (filtersToUse.companyIds && filtersToUse.companyIds.length > 0) {
        filtersToUse.companyIds.forEach(companyId => {
          params.append('companyIds[]', companyId);
        });
      }

      if (filtersToUse.metric && filtersToUse.metric !== 'all') {
        params.append('metric', filtersToUse.metric);
      }

      if (
        filtersToUse.dateRange === 'custom' &&
        filtersToUse.startDate &&
        filtersToUse.endDate
      ) {
        params.append('startDate', filtersToUse.startDate);
        params.append('endDate', filtersToUse.endDate);
      }

      console.log(
        '📡 Fazendo chamada para API:',
        `/dashboard/overview?${params.toString()}`
      );

      const result = await executeWithRetry(
        () => api.get(`/dashboard/overview?${params.toString()}`),
        (err: any, attempt: number) => {
          const errorMessage =
            err?.response?.status === 404
              ? 'API do dashboard não encontrada'
              : err?.response?.status === 403
                ? 'Acesso negado à API do dashboard'
                : err?.response?.data?.message ||
                  err?.message ||
                  'Erro ao carregar dashboard';

          setError(errorMessage);
          console.error('Erro ao carregar dashboard:', err);

          // Se for erro definitivo (404/403), não tentar novamente
          if (err?.response?.status === 404 || err?.response?.status === 403) {
            setError(
              `${errorMessage}. Esta funcionalidade pode não estar disponível.`
            );
          }
        }
      );

      if (result?.data) {
        console.log('✅ Resposta da API recebida:', result.data);
        setData(result.data);

        // Salvar no cache
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: result.data,
            timestamp: Date.now(),
            filters: filtersToUse,
          })
        );
      }

      setLoading(false);
    },
    [filters, canRetry, executeWithRetry]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<DashboardFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      // Call fetchDashboard directly with updated filters to avoid circular dependency
      fetchDashboard(updatedFilters);
    },
    [filters]
  ); // Remove fetchDashboard from dependencies to prevent circular dependency

  const refresh = useCallback(() => {
    // Limpar cache e recarregar
    const userData = authStorage.getUserData();
    const companyId =
      localStorage.getItem('dream_keys_selected_company_id') ||
      userData?.companyId;
    const cacheKey = getCacheKey(companyId);
    localStorage.removeItem(cacheKey);
    fetchDashboard(); // Call directly to avoid circular dependency
  }, []); // Remove fetchDashboard from dependencies to prevent circular dependency

  const clearCache = useCallback(() => {
    // Limpar todos os caches de dashboard
    clearAllDashboardCaches();
  }, []);

  useEffect(() => {
    console.log('🚀 useDashboard useEffect chamado - iniciando fetchDashboard');
    fetchDashboard();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(
      () => {
        fetchDashboard();
      },
      5 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, []); // Remove fetchDashboard dependency to prevent infinite loops

  // Refresh ao voltar para aba
  useEffect(() => {
    const handleFocus = () => {
      const userData = authStorage.getUserData();
      const companyId =
        localStorage.getItem('dream_keys_selected_company_id') ||
        userData?.companyId;
      const cacheKey = getCacheKey(companyId);
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { timestamp } = JSON.parse(cached);
        // Se cache > 2 minutos, atualizar
        if (Date.now() - timestamp > 2 * 60 * 1000) {
          fetchDashboard();
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []); // Remove fetchDashboard dependency to prevent infinite loops

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refresh,
    clearCache,
  };
};
