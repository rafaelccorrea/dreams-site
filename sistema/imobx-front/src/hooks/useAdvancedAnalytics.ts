import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useDashboardPerformance } from './usePerformance';
import { useMatches } from './useMatches';
import { useBrokerPerformance } from './useBrokerPerformance';
import { useChurnPrediction } from './useChurnPrediction';
import {
  dashboardApi,
  type ConversionFunnelResponse,
} from '../services/dashboardApi';
import type { DashboardPerformanceResponse } from '../types/performance';
import type { Match } from '../types/match';
import type { BrokerPerformanceResponse } from '../services/aiAssistantApi';
import type { ChurnPredictionResponse } from '../services/aiAssistantApi';
import dayjs from 'dayjs';
import {
  saveToCache,
  getFromCache,
  getCacheInfo,
  isDataEqual,
  removeFromCache,
  CACHE_KEYS,
} from '../utils/analyticsCache';

export interface AdvancedAnalyticsData {
  companyPerformance: DashboardPerformanceResponse | null;
  pendingMatches: {
    total: number;
    matches: Match[];
    overdue: number;
    warning: number;
  };
  brokersPerformance: BrokerPerformanceResponse[];
  churnAnalysis: {
    totalClients: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    churnRate: number;
    atRiskClients: ChurnPredictionResponse[];
  };
  conversionFunnel: ConversionFunnelResponse | null;
}

export interface CacheInfo {
  [key: string]: {
    isFromCache: boolean;
    timestamp?: number;
    formattedTime?: string;
  };
}

export interface AdvancedAnalyticsFilters {
  period?: 'week' | 'month' | 'quarter' | 'year';
  startDate?: Date;
  endDate?: Date;
}

const getInitialFilters = (): AdvancedAnalyticsFilters => {
  return {
    period: 'month',
  };
};

/** Estrutura vazia para renderização progressiva (mostrar layout e skeletons por seção) */
export const EMPTY_ADVANCED_ANALYTICS_DATA: AdvancedAnalyticsData = {
  companyPerformance: null,
  pendingMatches: { total: 0, matches: [], overdue: 0, warning: 0 },
  brokersPerformance: [],
  churnAnalysis: {
    totalClients: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
    churnRate: 0,
    atRiskClients: [],
  },
  conversionFunnel: null,
};

export const useAdvancedAnalytics = () => {
  const [filters, setFilters] =
    useState<AdvancedAnalyticsFilters>(getInitialFilters());
  const [data, setData] = useState<AdvancedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversionFunnelLoading, setConversionFunnelLoading] = useState(false);
  const [conversionFunnelError, setConversionFunnelError] = useState<
    string | null
  >(null);
  const [cacheInfo, setCacheInfo] = useState<CacheInfo>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Calcular datas baseado no período - memoizado para evitar recriação
  const dateRange = useMemo(() => {
    console.log('📅 [useAdvancedAnalytics] Calculando dateRange', {
      filters,
      period: filters.period,
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

    if (filters.startDate && filters.endDate) {
      const range = {
        start: filters.startDate,
        end: filters.endDate,
        startTime: filters.startDate.getTime(),
        endTime: filters.endDate.getTime(),
      };
      console.log(
        '📅 [useAdvancedAnalytics] Usando datas customizadas:',
        range
      );
      return range;
    }

    const end = filters.endDate || new Date();
    let start: Date;

    switch (filters.period) {
      case 'week':
        start = dayjs(end).subtract(7, 'days').toDate();
        break;
      case 'quarter':
        start = dayjs(end).subtract(3, 'months').toDate();
        break;
      case 'year':
        start = dayjs(end).subtract(1, 'year').toDate();
        break;
      case 'month':
      default:
        start = dayjs(end).subtract(30, 'days').toDate();
        break;
    }

    const range = {
      start,
      end,
      startTime: start.getTime(),
      endTime: end.getTime(),
    };

    console.log('📅 [useAdvancedAnalytics] DateRange calculado:', {
      ...range,
      startISO: start.toISOString(),
      endISO: end.toISOString(),
    });

    return range;
  }, [filters.period, filters.startDate, filters.endDate]);

  // Hooks para buscar dados
  const {
    data: performanceData,
    loading: performanceLoading,
    error: performanceError,
  } = useDashboardPerformance(dateRange.start, dateRange.end);
  const {
    matches: matchesData,
    loading: matchesLoading,
    error: matchesError,
  } = useMatches({ status: 'pending', autoFetch: true });

  // Normalizar matches - pode vir como array ou objeto com matches
  const matches = useMemo(() => {
    if (!matchesData) return null;
    if (Array.isArray(matchesData)) return matchesData;
    if (
      matchesData &&
      typeof matchesData === 'object' &&
      'matches' in matchesData
    ) {
      return (matchesData as any).matches || [];
    }
    return [];
  }, [matchesData]);
  const {
    analyze: analyzeBrokers,
    loading: brokersLoading,
    error: brokersError,
  } = useBrokerPerformance();
  const {
    predict: predictChurn,
    loading: churnLoading,
    error: churnError,
  } = useChurnPrediction();

  // Ref para evitar chamadas duplicadas
  const fetchingRef = useRef(false);
  const lastFetchKeyRef = useRef<string>('');

  // Buscar dados de corretores e churn - chamar independentemente
  useEffect(() => {
    // Criar uma chave única baseada nos dados que importam, incluindo refreshTrigger
    const fetchKey = `${filters.period}-${dateRange.startTime}-${dateRange.endTime}-${refreshTrigger}`;

    // Se já está buscando com a mesma chave (e não há refresh trigger), não buscar novamente
    if (
      fetchingRef.current &&
      lastFetchKeyRef.current === fetchKey &&
      refreshTrigger === 0
    ) {
      return;
    }

    const fetchBrokersAndChurn = async () => {
      fetchingRef.current = true;
      lastFetchKeyRef.current = fetchKey;

      // Obter dados anteriores para preservar em caso de erro
      const prevData = data;

      // Inicializar com dados anteriores ou vazios
      let brokersArray: BrokerPerformanceResponse[] = [];
      let churnArray: ChurnPredictionResponse[] = [];
      let brokersErrorOccurred = false;
      let churnErrorOccurred = false;

      // Processar matches pendentes - pode ser null/undefined
      const pendingMatchesList = matches || [];
      const now = new Date();
      const overdue = pendingMatchesList.filter(m => {
        const createdAt = new Date(m.createdAt);
        const daysDiff = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysDiff > 7;
      }).length;
      const warning = pendingMatchesList.filter(m => {
        const createdAt = new Date(m.createdAt);
        const daysDiff = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysDiff > 3 && daysDiff <= 7;
      }).length;

      // Sempre tentar buscar as APIs, mesmo se performanceData ou matches não estiverem disponíveis
      console.log('🔄 [useAdvancedAnalytics] Buscando dados adicionais...', {
        period: filters.period,
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString(),
        hasPerformanceData: !!performanceData,
        hasMatches: matches !== null && matches !== undefined,
      });

      try {
        // Buscar performance de corretores - tratar separadamente com cache
        try {
          // Tentar buscar do cache primeiro
          const cachedBrokers = getFromCache<BrokerPerformanceResponse[]>(
            CACHE_KEYS.BROKERS_PERFORMANCE
          );

          // Buscar da API
          const brokersResult = await analyzeBrokers({
            period: filters.period || 'month',
            startDate: dateRange.start.toISOString(),
            endDate: dateRange.end.toISOString(),
          });
          brokersArray = Array.isArray(brokersResult)
            ? brokersResult
            : brokersResult
              ? [brokersResult]
              : [];

          // Verificar se os dados são iguais aos do cache
          if (
            cachedBrokers &&
            isDataEqual(CACHE_KEYS.BROKERS_PERFORMANCE, brokersArray)
          ) {
            console.log(
              '📦 [useAdvancedAnalytics] Dados de brokers iguais ao cache, usando cache'
            );
            brokersArray = cachedBrokers.data;
            const cacheInfoData = getCacheInfo(CACHE_KEYS.BROKERS_PERFORMANCE);
            if (cacheInfoData) {
              setCacheInfo(prev => ({
                ...prev,
                [CACHE_KEYS.BROKERS_PERFORMANCE]: {
                  isFromCache: true,
                  timestamp: cacheInfoData.timestamp,
                  formattedTime: cacheInfoData.formattedTime,
                },
              }));
            }
          } else {
            // Dados novos, salvar no cache
            saveToCache(CACHE_KEYS.BROKERS_PERFORMANCE, brokersArray);
            setCacheInfo(prev => ({
              ...prev,
              [CACHE_KEYS.BROKERS_PERFORMANCE]: {
                isFromCache: false,
              },
            }));
            console.log(
              '✅ [useAdvancedAnalytics] Brokers processados e salvos no cache:',
              {
                count: brokersArray.length,
              }
            );
          }
        } catch (brokersErr: any) {
          brokersErrorOccurred = true;
          console.error(
            '❌ [useAdvancedAnalytics] Erro ao buscar brokers:',
            brokersErr
          );

          // Tentar usar cache em caso de erro
          const cachedBrokers = getFromCache<BrokerPerformanceResponse[]>(
            CACHE_KEYS.BROKERS_PERFORMANCE
          );
          if (cachedBrokers && cachedBrokers.data.length > 0) {
            brokersArray = cachedBrokers.data;
            const cacheInfoData = getCacheInfo(CACHE_KEYS.BROKERS_PERFORMANCE);
            if (cacheInfoData) {
              setCacheInfo(prev => ({
                ...prev,
                [CACHE_KEYS.BROKERS_PERFORMANCE]: {
                  isFromCache: true,
                  timestamp: cacheInfoData.timestamp,
                  formattedTime: cacheInfoData.formattedTime,
                },
              }));
            }
            console.log(
              '📦 [useAdvancedAnalytics] Usando dados de brokers do cache devido a erro'
            );
          } else if (
            prevData?.brokersPerformance &&
            prevData.brokersPerformance.length > 0
          ) {
            brokersArray = prevData.brokersPerformance;
            console.log(
              '⚠️ [useAdvancedAnalytics] Mantendo dados anteriores de brokers:',
              brokersArray.length
            );
          }
        }

        // Buscar análise de churn - tratar separadamente com cache
        try {
          // Tentar buscar do cache primeiro
          const cachedChurn = getFromCache<ChurnPredictionResponse[]>(
            CACHE_KEYS.CHURN_ANALYSIS
          );

          // Buscar da API
          const churnResult = await predictChurn();
          churnArray = Array.isArray(churnResult)
            ? churnResult
            : churnResult
              ? [churnResult]
              : [];

          // Verificar se os dados são iguais aos do cache
          if (
            cachedChurn &&
            isDataEqual(CACHE_KEYS.CHURN_ANALYSIS, churnArray)
          ) {
            console.log(
              '📦 [useAdvancedAnalytics] Dados de churn iguais ao cache, usando cache'
            );
            churnArray = cachedChurn.data;
            const cacheInfoData = getCacheInfo(CACHE_KEYS.CHURN_ANALYSIS);
            if (cacheInfoData) {
              setCacheInfo(prev => ({
                ...prev,
                [CACHE_KEYS.CHURN_ANALYSIS]: {
                  isFromCache: true,
                  timestamp: cacheInfoData.timestamp,
                  formattedTime: cacheInfoData.formattedTime,
                },
              }));
            }
          } else {
            // Dados novos, salvar no cache
            saveToCache(CACHE_KEYS.CHURN_ANALYSIS, churnArray);
            setCacheInfo(prev => ({
              ...prev,
              [CACHE_KEYS.CHURN_ANALYSIS]: {
                isFromCache: false,
              },
            }));
            console.log(
              '✅ [useAdvancedAnalytics] Churn processado e salvo no cache:',
              {
                count: churnArray.length,
              }
            );
          }
        } catch (churnErr: any) {
          churnErrorOccurred = true;
          console.error(
            '❌ [useAdvancedAnalytics] Erro ao buscar churn:',
            churnErr
          );

          // Tentar usar cache em caso de erro
          const cachedChurn = getFromCache<ChurnPredictionResponse[]>(
            CACHE_KEYS.CHURN_ANALYSIS
          );
          if (cachedChurn && cachedChurn.data.length > 0) {
            churnArray = cachedChurn.data;
            const cacheInfoData = getCacheInfo(CACHE_KEYS.CHURN_ANALYSIS);
            if (cacheInfoData) {
              setCacheInfo(prev => ({
                ...prev,
                [CACHE_KEYS.CHURN_ANALYSIS]: {
                  isFromCache: true,
                  timestamp: cacheInfoData.timestamp,
                  formattedTime: cacheInfoData.formattedTime,
                },
              }));
            }
            console.log(
              '📦 [useAdvancedAnalytics] Usando dados de churn do cache devido a erro'
            );
          } else if (
            prevData?.churnAnalysis?.atRiskClients &&
            prevData.churnAnalysis.atRiskClients.length > 0
          ) {
            churnArray = prevData.churnAnalysis.atRiskClients;
            console.log(
              '⚠️ [useAdvancedAnalytics] Mantendo dados anteriores de churn:',
              churnArray.length
            );
          }
        }

        // Processar dados de churn
        const highRisk = churnArray.filter(c => c.riskLevel === 'high').length;
        const mediumRisk = churnArray.filter(
          c => c.riskLevel === 'medium'
        ).length;
        const lowRisk = churnArray.filter(c => c.riskLevel === 'low').length;
        const churnRate =
          churnArray.length > 0 ? (highRisk / churnArray.length) * 100 : 0;

        // Salvar dados processados no cache se não vieram do cache
        if (
          !cacheInfo[CACHE_KEYS.BROKERS_PERFORMANCE]?.isFromCache &&
          brokersArray.length > 0
        ) {
          saveToCache(CACHE_KEYS.BROKERS_PERFORMANCE, brokersArray);
        }
        if (
          !cacheInfo[CACHE_KEYS.CHURN_ANALYSIS]?.isFromCache &&
          churnArray.length > 0
        ) {
          saveToCache(CACHE_KEYS.CHURN_ANALYSIS, churnArray);
        }

        // Atualizar dados progressivamente, preservando dados existentes
        // IMPORTANTE: Preservar conversionFunnel do estado atual, não apenas do prevData
        // porque o funil pode ter sido carregado em um useEffect separado
        setData(prev => {
          const newData = {
            companyPerformance:
              performanceData || prev?.companyPerformance || null,
            pendingMatches: {
              total: pendingMatchesList.length,
              matches: pendingMatchesList.slice(0, 50), // Limitar a 50
              overdue,
              warning,
            },
            brokersPerformance:
              brokersArray.length > 0
                ? brokersArray
                : prev?.brokersPerformance || [],
            churnAnalysis: {
              totalClients: churnArray.length,
              highRisk,
              mediumRisk,
              lowRisk,
              churnRate,
              atRiskClients: churnArray.slice(0, 10), // Top 10
            },
            // CRÍTICO: Preservar conversionFunnel do estado atual (prev), não do prevData
            // porque o funil é carregado em um useEffect separado e pode ter sido atualizado
            conversionFunnel: prev?.conversionFunnel || null,
          };

          console.log(
            '🔄 [useAdvancedAnalytics] Atualizando dados (brokers/churn), preservando funil:',
            {
              hasConversionFunnel: !!newData.conversionFunnel,
              conversionFunnelFromPrev: !!prev?.conversionFunnel,
              totalLeads: newData.conversionFunnel?.totalLeads,
              stagesCount: newData.conversionFunnel?.stages?.length,
            }
          );

          console.log(
            '✅ [useAdvancedAnalytics] Dados atualizados com sucesso:',
            {
              hasCompanyPerformance: !!newData.companyPerformance,
              pendingMatchesTotal: newData.pendingMatches.total,
              brokersCount: newData.brokersPerformance.length,
              brokersData:
                newData.brokersPerformance.length > 0 ? 'SIM' : 'NÃO',
              churnTotalClients: newData.churnAnalysis.totalClients,
              churnAtRiskCount: newData.churnAnalysis.atRiskClients.length,
              churnData:
                newData.churnAnalysis.atRiskClients.length > 0 ? 'SIM' : 'NÃO',
              hasConversionFunnel: !!newData.conversionFunnel,
            }
          );

          return newData;
        });
      } catch (err: any) {
        // Este catch só deve ser acionado se houver um erro inesperado
        // que não foi tratado nos try/catch individuais acima
        console.error(
          '❌ [useAdvancedAnalytics] Erro inesperado ao buscar dados adicionais:',
          {
            error: err,
            message: err?.message,
            response: err?.response,
            status: err?.response?.status,
            isRateLimit: err?.isRateLimit,
          }
        );

        // Manter dados anteriores se existirem, ou criar estrutura mínima
        // IMPORTANTE: Usar prev do setData para garantir estado mais recente
        setData(prev => {
          const pendingMatchesList = matches || [];
          const now = new Date();
          const overdue = pendingMatchesList.filter(m => {
            const createdAt = new Date(m.createdAt);
            const daysDiff = Math.floor(
              (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
            );
            return daysDiff > 7;
          }).length;
          const warning = pendingMatchesList.filter(m => {
            const createdAt = new Date(m.createdAt);
            const daysDiff = Math.floor(
              (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
            );
            return daysDiff > 3 && daysDiff <= 7;
          }).length;

          return {
            companyPerformance:
              performanceData || prev?.companyPerformance || null,
            pendingMatches: {
              total: pendingMatchesList.length,
              matches: pendingMatchesList.slice(0, 50),
              overdue,
              warning,
            },
            // Manter dados anteriores se existirem, caso contrário array vazio
            brokersPerformance:
              prev?.brokersPerformance && prev.brokersPerformance.length > 0
                ? prev.brokersPerformance
                : [],
            churnAnalysis:
              prev?.churnAnalysis &&
              (prev.churnAnalysis.atRiskClients?.length > 0 ||
                prev.churnAnalysis.totalClients > 0)
                ? prev.churnAnalysis
                : {
                    totalClients: 0,
                    highRisk: 0,
                    mediumRisk: 0,
                    lowRisk: 0,
                    churnRate: 0,
                    atRiskClients: [],
                  },
            // CRÍTICO: Preservar conversionFunnel do estado atual (prev)
            conversionFunnel: prev?.conversionFunnel || null,
          };
        });
      } finally {
        fetchingRef.current = false;
      }
    };

    // Sempre tentar buscar as APIs, mesmo que performanceData ou matches não estejam disponíveis
    // Isso garante que todas as APIs sejam chamadas independentemente
    fetchBrokersAndChurn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.period,
    dateRange.startTime,
    dateRange.endTime,
    refreshTrigger,
    performanceData,
    matches,
  ]);

  // Garantir que dados básicos sejam definidos assim que disponíveis
  useEffect(() => {
    // Se temos performanceData ou matches, definir dados básicos (mesmo que parcialmente)
    if ((performanceData || matches !== null) && !data) {
      const pendingMatchesList = matches || [];
      const now = new Date();
      const overdue = pendingMatchesList.filter(m => {
        const createdAt = new Date(m.createdAt);
        const daysDiff = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysDiff > 7;
      }).length;
      const warning = pendingMatchesList.filter(m => {
        const createdAt = new Date(m.createdAt);
        const daysDiff = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysDiff > 3 && daysDiff <= 7;
      }).length;

      // Tentar carregar dados do cache para brokers e churn na primeira vez
      const cachedBrokers = getFromCache<BrokerPerformanceResponse[]>(
        CACHE_KEYS.BROKERS_PERFORMANCE
      );
      const cachedChurn = getFromCache<ChurnPredictionResponse[]>(
        CACHE_KEYS.CHURN_ANALYSIS
      );
      const cachedFunnel = getFromCache<ConversionFunnelResponse>(
        CACHE_KEYS.CONVERSION_FUNNEL
      );

      let brokersArray: BrokerPerformanceResponse[] = [];
      let churnArray: ChurnPredictionResponse[] = [];

      if (cachedBrokers && cachedBrokers.data.length > 0) {
        brokersArray = cachedBrokers.data;
        const cacheInfoData = getCacheInfo(CACHE_KEYS.BROKERS_PERFORMANCE);
        if (cacheInfoData) {
          setCacheInfo(prev => ({
            ...prev,
            [CACHE_KEYS.BROKERS_PERFORMANCE]: {
              isFromCache: true,
              timestamp: cacheInfoData.timestamp,
              formattedTime: cacheInfoData.formattedTime,
            },
          }));
        }
      }

      if (cachedChurn && cachedChurn.data.length > 0) {
        churnArray = cachedChurn.data;
        const cacheInfoData = getCacheInfo(CACHE_KEYS.CHURN_ANALYSIS);
        if (cacheInfoData) {
          setCacheInfo(prev => ({
            ...prev,
            [CACHE_KEYS.CHURN_ANALYSIS]: {
              isFromCache: true,
              timestamp: cacheInfoData.timestamp,
              formattedTime: cacheInfoData.formattedTime,
            },
          }));
        }
      }

      const highRisk = churnArray.filter(c => c.riskLevel === 'high').length;
      const mediumRisk = churnArray.filter(
        c => c.riskLevel === 'medium'
      ).length;
      const lowRisk = churnArray.filter(c => c.riskLevel === 'low').length;
      const churnRate =
        churnArray.length > 0 ? (highRisk / churnArray.length) * 100 : 0;

      // IMPORTANTE: Usar setData(prev => ...) para preservar dados existentes
      // que podem ter sido carregados por outros useEffects
      setData(prev => ({
        companyPerformance: performanceData || prev?.companyPerformance || null,
        pendingMatches: {
          total: pendingMatchesList.length,
          matches: pendingMatchesList.slice(0, 50),
          overdue,
          warning,
        },
        brokersPerformance:
          brokersArray.length > 0
            ? brokersArray
            : prev?.brokersPerformance || [],
        churnAnalysis: {
          totalClients: churnArray.length,
          highRisk,
          mediumRisk,
          lowRisk,
          churnRate,
          atRiskClients: churnArray.slice(0, 10),
        },
        // CRÍTICO: Preservar conversionFunnel do estado atual se já existir,
        // caso contrário usar do cache
        conversionFunnel: prev?.conversionFunnel || cachedFunnel?.data || null,
      }));

      if (cachedFunnel && cachedFunnel.data) {
        const cacheInfoData = getCacheInfo(CACHE_KEYS.CONVERSION_FUNNEL);
        if (cacheInfoData) {
          setCacheInfo(prev => ({
            ...prev,
            [CACHE_KEYS.CONVERSION_FUNNEL]: {
              isFromCache: true,
              timestamp: cacheInfoData.timestamp,
              formattedTime: cacheInfoData.formattedTime,
            },
          }));
        }
      }
    }
  }, [performanceData, matches, data]);

  // Buscar funil de conversão com cache
  useEffect(() => {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 [useAdvancedAnalytics] useEffect DO FUNIL INICIADO');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Date Range:', {
      start: dateRange.start?.toISOString(),
      end: dateRange.end?.toISOString(),
      startTime: dateRange.startTime,
      endTime: dateRange.endTime,
    });
    console.log('Refresh Trigger:', refreshTrigger);
    console.log('Has Start:', !!dateRange.start);
    console.log('Has End:', !!dateRange.end);
    console.log('Timestamp:', new Date().toISOString());
    console.log('═══════════════════════════════════════════════════════════');

    // Usar timestamps para garantir que o useEffect seja executado quando as datas mudarem
    const startTime = dateRange.startTime;
    const endTime = dateRange.endTime;
    const start = dateRange.start;
    const end = dateRange.end;

    if (!start || !end) {
      console.warn(
        '⚠️ [useAdvancedAnalytics] Datas inválidas para funil de conversão:',
        {
          start,
          end,
          startTime,
          endTime,
          dateRange,
        }
      );
      return;
    }

    console.log(
      '✅ [useAdvancedAnalytics] Datas válidas, iniciando busca do funil',
      {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        startTime,
        endTime,
        refreshTrigger,
      }
    );

    const fetchConversionFunnel = async () => {
      console.log(
        '═══════════════════════════════════════════════════════════'
      );
      console.log(
        '🔄 [useAdvancedAnalytics] FUNÇÃO fetchConversionFunnel CHAMADA'
      );
      console.log(
        '═══════════════════════════════════════════════════════════'
      );
      console.log('Start Date:', start.toISOString());
      console.log('End Date:', end.toISOString());
      console.log('Refresh Trigger:', refreshTrigger);
      console.log('Timestamp:', new Date().toISOString());
      console.log(
        '═══════════════════════════════════════════════════════════'
      );

      setConversionFunnelLoading(true);
      setConversionFunnelError(null);

      try {
        const url = `/dashboard/conversion-funnel?startDate=${start.toISOString().split('T')[0]}&endDate=${end.toISOString().split('T')[0]}`;

        console.log(
          '═══════════════════════════════════════════════════════════'
        );
        console.log(
          '📡 [useAdvancedAnalytics] CHAMANDO API DE FUNIL DE CONVERSÃO!'
        );
        console.log(
          '═══════════════════════════════════════════════════════════'
        );
        console.log('URL:', url);
        console.log('Start Date:', start.toISOString());
        console.log('End Date:', end.toISOString());
        console.log(
          '═══════════════════════════════════════════════════════════'
        );

        const funnelData = await dashboardApi.getConversionFunnel(start, end);

        console.log(
          '═══════════════════════════════════════════════════════════'
        );
        console.log(
          '✅✅✅ [useAdvancedAnalytics] FUNIL RECEBIDO COM SUCESSO!'
        );
        console.log(
          '═══════════════════════════════════════════════════════════'
        );
        console.log('Has Stages:', !!funnelData?.stages);
        console.log('Stages Count:', funnelData?.stages?.length || 0);
        console.log('Total Leads:', funnelData?.totalLeads || 0);
        console.log('Has Analysis:', !!funnelData?.analysis);
        console.log(
          'Overall Conversion Rate:',
          funnelData?.overallConversionRate
        );
        console.log('Period:', funnelData?.period);
        console.log('Full Response:', JSON.stringify(funnelData, null, 2));
        console.log(
          '═══════════════════════════════════════════════════════════'
        );

        // Sempre salvar e usar os dados da API (ignorar cache por enquanto)
        console.log(
          '═══════════════════════════════════════════════════════════'
        );
        console.log(
          '💾 [useAdvancedAnalytics] SALVANDO FUNIL NO CACHE E ESTADO'
        );
        console.log(
          '═══════════════════════════════════════════════════════════'
        );

        saveToCache(CACHE_KEYS.CONVERSION_FUNNEL, funnelData);
        setCacheInfo(prev => ({
          ...prev,
          [CACHE_KEYS.CONVERSION_FUNNEL]: {
            isFromCache: false,
          },
        }));
        setData(prev => {
          const newData = {
            ...prev,
            conversionFunnel: funnelData,
          };
          console.log('💾 Estado atualizado:', {
            hasConversionFunnel: !!newData.conversionFunnel,
            totalLeads: newData.conversionFunnel?.totalLeads,
            stagesCount: newData.conversionFunnel?.stages?.length,
          });
          console.log(
            '═══════════════════════════════════════════════════════════'
          );
          return newData;
        });
      } catch (err: any) {
        console.error(
          '═══════════════════════════════════════════════════════════'
        );
        console.error(
          '❌ [useAdvancedAnalytics] ERRO AO BUSCAR FUNIL DE CONVERSÃO'
        );
        console.error(
          '═══════════════════════════════════════════════════════════'
        );
        console.error('Error:', err);
        console.error('Message:', err?.message);
        console.error('Status:', err?.response?.status);
        console.error('Is Rate Limit:', err?.isRateLimit);
        console.error('URL:', err?.config?.url);
        console.error('Response:', err?.response?.data);
        console.error('Full Error:', JSON.stringify(err, null, 2));
        console.error(
          '═══════════════════════════════════════════════════════════'
        );

        // Tentar usar cache em caso de erro
        const cachedFunnel = getFromCache<ConversionFunnelResponse>(
          CACHE_KEYS.CONVERSION_FUNNEL
        );
        if (cachedFunnel && cachedFunnel.data) {
          console.log(
            '📦 [useAdvancedAnalytics] Usando dados de funil do cache devido a erro'
          );
          const cacheInfoData = getCacheInfo(CACHE_KEYS.CONVERSION_FUNNEL);
          if (cacheInfoData) {
            setCacheInfo(prev => ({
              ...prev,
              [CACHE_KEYS.CONVERSION_FUNNEL]: {
                isFromCache: true,
                timestamp: cacheInfoData.timestamp,
                formattedTime: cacheInfoData.formattedTime,
              },
            }));
          }
          setData(prev => ({
            ...prev,
            conversionFunnel: cachedFunnel.data,
          }));
        } else if (err?.isRateLimit || err?.response?.status === 429) {
          console.warn(
            '⚠️ [useAdvancedAnalytics] Rate limit detectado no funil de conversão - continuando sem dados'
          );
          setData(prev => ({
            ...prev,
            conversionFunnel: null,
          }));
        } else {
          console.error(
            '❌ [useAdvancedAnalytics] Erro ao carregar funil de conversão e sem cache disponível'
          );
          setConversionFunnelError(
            err?.message || 'Erro ao carregar funil de conversão'
          );
          setData(prev => ({
            ...prev,
            conversionFunnel: null,
          }));
        }
      } finally {
        setConversionFunnelLoading(false);
      }
    };

    // Executar imediatamente
    fetchConversionFunnel();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dateRange.startTime,
    dateRange.endTime,
    refreshTrigger,
    dateRange.start,
    dateRange.end,
  ]);

  // Atualizar loading e error
  useEffect(() => {
    const isLoading =
      performanceLoading ||
      matchesLoading ||
      brokersLoading ||
      churnLoading ||
      conversionFunnelLoading;

    // Logs detalhados para debug
    console.log('🔍 [useAdvancedAnalytics] Estado dos dados:', {
      performanceLoading,
      matchesLoading,
      brokersLoading,
      churnLoading,
      conversionFunnelLoading,
      isLoading,
      performanceError: performanceError ? String(performanceError) : null,
      matchesError: matchesError ? String(matchesError) : null,
      brokersError: brokersError ? String(brokersError) : null,
      churnError: churnError ? String(churnError) : null,
      conversionFunnelError: conversionFunnelError
        ? String(conversionFunnelError)
        : null,
      hasPerformanceData: !!performanceData,
      hasMatches: matches !== null && matches !== undefined,
      hasData: !!data,
    });

    // Verificar se algum erro é rate limit (429)
    const hasRateLimit =
      (brokersError &&
        typeof brokersError === 'object' &&
        (brokersError as any)?.isRateLimit) ||
      (churnError &&
        typeof churnError === 'object' &&
        (churnError as any)?.isRateLimit);

    // Se tiver rate limit, não definir erro - a página deve aparecer com dados parciais
    const hasError =
      !hasRateLimit &&
      (performanceError ||
        matchesError ||
        brokersError ||
        churnError ||
        conversionFunnelError);

    console.log('🔍 [useAdvancedAnalytics] Análise de erros:', {
      hasRateLimit,
      hasError,
      performanceError: !!performanceError,
      matchesError: !!matchesError,
      brokersError: !!brokersError,
      churnError: !!churnError,
      conversionFunnelError: !!conversionFunnelError,
    });

    setLoading(isLoading);

    // Só definir erro se realmente houver um erro crítico E não tivermos dados básicos
    // Se temos performanceData ou matches, não devemos mostrar erro - apenas dados parciais
    if (hasError && !performanceData && (!matches || matches.length === 0)) {
      console.error(
        '❌ [useAdvancedAnalytics] Erro crítico - sem dados básicos:',
        {
          performanceError,
          matchesError,
          brokersError,
          churnError,
          conversionFunnelError,
        }
      );
      setError(
        'Erro ao carregar alguns dados. Algumas seções podem estar incompletas.'
      );
    } else {
      if (hasError) {
        console.warn(
          '⚠️ [useAdvancedAnalytics] Erros detectados, mas temos dados básicos - não mostrando erro:',
          {
            hasPerformanceData: !!performanceData,
            hasMatches: matches !== null && matches !== undefined,
            errors: {
              performanceError: !!performanceError,
              matchesError: !!matchesError,
              brokersError: !!brokersError,
              churnError: !!churnError,
              conversionFunnelError: !!conversionFunnelError,
            },
          }
        );
      }
      setError(null);
    }
  }, [
    performanceLoading,
    matchesLoading,
    brokersLoading,
    churnLoading,
    conversionFunnelLoading,
    performanceError,
    matchesError,
    brokersError,
    churnError,
    conversionFunnelError,
    performanceData,
    matches,
    data,
  ]);

  const updateFilters = useCallback(
    (newFilters: Partial<AdvancedAnalyticsFilters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    },
    []
  );

  const refresh = useCallback(() => {
    console.log('🔄 [useAdvancedAnalytics] Forçando atualização...');

    // Limpar cache para forçar nova busca
    removeFromCache(CACHE_KEYS.BROKERS_PERFORMANCE);
    removeFromCache(CACHE_KEYS.CHURN_ANALYSIS);
    removeFromCache(CACHE_KEYS.CONVERSION_FUNNEL);
    removeFromCache(CACHE_KEYS.CAPTURES_STATISTICS);

    // Limpar informações de cache
    setCacheInfo({});

    // Resetar refs para permitir nova busca
    fetchingRef.current = false;
    lastFetchKeyRef.current = '';

    // Forçar recarregamento através de um trigger
    setRefreshTrigger(prev => prev + 1);
    setLoading(true);
    setError(null);

    console.log(
      '✅ [useAdvancedAnalytics] Cache limpo, forçando nova busca...'
    );
  }, []);

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refresh,
    cacheInfo,
    conversionFunnelLoading,
    conversionFunnelError,
    performanceLoading,
    matchesLoading,
    brokersLoading,
    churnLoading,
  };
};
