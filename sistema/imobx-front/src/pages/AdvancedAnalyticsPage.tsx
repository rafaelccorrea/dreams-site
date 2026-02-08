import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useAdvancedAnalytics } from '../hooks/useAdvancedAnalytics';
import { formatCurrency } from '../utils/formatNumbers';
import { InfoTooltip } from '../components/common/InfoTooltip';
import { LottieLoading } from '../components/common/LottieLoading';
import { getTypeText } from '../utils/propertyUtils';
import GoalSelector from '../components/dashboard/GoalSelector';
import { goalsApi } from '../services/goalsApi';
import type { Goal } from '../types/goal';
import { AdvancedAnalyticsFiltersDrawer } from '../components/analytics/AdvancedAnalyticsFiltersDrawer';
import { CacheInfoBanner } from '../components/analytics/CacheInfoBanner';
import {
  dashboardApi,
  type CapturesStatistics,
} from '../services/dashboardApi';
import { CACHE_KEYS } from '../utils/analyticsCache';
import {
  CategoryDistributionChart,
  FunnelChart,
  BarChart,
  LineChart,
  MultiLineChart,
  type CategoryData,
  type BarChartDataPoint,
  type LineChartDataPoint,
  type MultiLineDataset,
} from '../components/charts';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  HeaderActions,
  FilterButton,
  FilterBadge,
  Section,
  SectionTitle,
  StatsGrid,
  StatCard,
  StatHeader,
  StatIcon,
  StatValue,
  StatLabel,
  TableCard,
  TableTitle,
  TableContainer,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  BrokersList,
  BrokerCard,
  BrokerHeader,
  BrokerInfo,
  BrokerName,
  BrokerBadges,
  BrokerStats,
  BrokerStatItem,
  BrokerStatLabel,
  BrokerStatValue,
  ChurnRiskCard,
  ChurnRiskHeader,
  ChurnRiskInfo,
  ChurnRiskName,
  ChurnRiskScore,
  ChurnRiskLabel,
  ChurnRiskValue,
  ChurnRiskDays,
  ChurnRiskSectionTitle,
  ChurnRiskFactors,
  ChurnRiskFactorList,
  ChurnRiskFactorItem,
  ChurnActionsList,
  ChurnActionItem,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  LoadingContainer,
  ErrorContainer,
  ErrorTitle,
  ErrorMessage,
  RetryButton,
  CompanyGoalCard,
  GoalHeader,
  GoalIcon,
  GoalTitle,
  GoalSubtitle,
  GoalContent,
  ProgressSection,
  ProgressValue,
  ProgressBar,
  ProgressFill,
  StatsRow,
  GoalStatItem,
  GoalStatLabel,
  GoalStatValue,
  StatusRow,
  StatusBadge,
  DaysLeft,
  FunnelSummary,
  FunnelAnalysisCard,
  FunnelAnalysisTitle,
  FunnelAnalysisText,
  FunnelList,
  FunnelListItem,
  FunnelInsightCard,
  FunnelInsightTitle,
  FunnelInsightDescription,
  FunnelInsightRecommendations,
  FunnelInsightRecommendation,
  FunnelScore,
  LoadMoreButton,
  LoadMoreButtonContent,
} from '../styles/pages/AdvancedAnalyticsPageStyles';
import {
  MdBarChart,
  MdTrendingUp,
  MdPeople,
  MdHome,
  MdTimer,
  MdWarning,
  MdCheckCircle,
  MdFilterList,
  MdRefresh,
  MdExpandMore,
} from 'react-icons/md';

const AdvancedAnalyticsPage: React.FC = () => {
  const {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refresh,
    cacheInfo,
    conversionFunnelLoading,
    conversionFunnelError,
  } = useAdvancedAnalytics();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [loadingGoal, setLoadingGoal] = useState(false);
  const [brokersToShow, setBrokersToShow] = useState(3);
  const [churnToShow, setChurnToShow] = useState(3);

  // Estados para análise de captadores
  const [capturesStatistics, setCapturesStatistics] =
    useState<CapturesStatistics | null>(null);
  const [loadingCaptures, setLoadingCaptures] = useState(false);
  const [capturesError, setCapturesError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<
    'month' | 'quarter' | 'year'
  >('month');
  const [capturesRefreshTrigger, setCapturesRefreshTrigger] = useState(0);

  // Buscar meta selecionada quando selectedGoalId mudar
  useEffect(() => {
    if (selectedGoalId) {
      const fetchGoal = async () => {
        try {
          setLoadingGoal(true);
          const goal = await goalsApi.getGoalById(selectedGoalId);
          setSelectedGoal(goal);
        } catch (error) {
          console.error('Erro ao buscar meta:', error);
          setSelectedGoal(null);
        } finally {
          setLoadingGoal(false);
        }
      };
      fetchGoal();
    } else {
      setSelectedGoal(null);
    }
  }, [selectedGoalId]);

  // Carregar estatísticas de captadores - sincronizado com filtros principais e refresh
  useEffect(() => {
    const loadCapturesStatistics = async () => {
      setLoadingCaptures(true);
      setCapturesError(null);
      try {
        // Usar os mesmos filtros que o hook principal se disponíveis
        let startDate: Date | undefined;
        let endDate = new Date();

        // Se os filtros principais têm datas customizadas, usar elas
        if (filters.startDate && filters.endDate) {
          startDate = filters.startDate;
          endDate = filters.endDate;
        } else {
          // Caso contrário, usar o período selecionado
          switch (selectedPeriod) {
            case 'month':
              startDate = new Date();
              startDate.setMonth(startDate.getMonth() - 1);
              break;
            case 'quarter':
              startDate = new Date();
              startDate.setMonth(startDate.getMonth() - 3);
              break;
            case 'year':
              startDate = new Date();
              startDate.setFullYear(startDate.getFullYear() - 1);
              break;
          }
        }

        console.log(
          '🔄 [AdvancedAnalyticsPage] Buscando estatísticas de captadores...',
          {
            startDate: startDate?.toISOString(),
            endDate: endDate.toISOString(),
            selectedPeriod,
          }
        );

        const stats = await dashboardApi.getCapturesStatistics(
          startDate,
          endDate
        );
        setCapturesStatistics(stats);
        console.log(
          '✅ [AdvancedAnalyticsPage] Estatísticas de captadores carregadas:',
          {
            totalProperties: stats.totalProperties,
            totalClients: stats.totalClients,
          }
        );
      } catch (error: any) {
        console.error(
          '❌ [AdvancedAnalyticsPage] Erro ao carregar estatísticas de captadores:',
          error
        );
        setCapturesError(
          error.message || 'Erro ao carregar estatísticas de captadores'
        );
      } finally {
        setLoadingCaptures(false);
      }
    };

    loadCapturesStatistics();
  }, [
    selectedPeriod,
    filters.startDate,
    filters.endDate,
    filters.period,
    capturesRefreshTrigger,
  ]);

  // Criar função de refresh personalizada que também atualiza captures
  const handleRefresh = useCallback(() => {
    console.log('🔄 [AdvancedAnalyticsPage] Atualizando todas as APIs...');
    refresh(); // Atualizar APIs do hook principal
    setCapturesRefreshTrigger(prev => prev + 1); // Forçar atualização de captures
  }, [refresh]);

  // Função helper para obter dados da meta
  const getGoalData = () => {
    if (selectedGoal && !loadingGoal) {
      return {
        target: selectedGoal.targetValue,
        current: selectedGoal.currentValue,
        progress: selectedGoal.progress,
        remaining: selectedGoal.remaining,
        daysLeft: selectedGoal.daysRemaining,
        dailyTarget: selectedGoal.dailyTarget,
        onTrack: selectedGoal.isOnTrack,
      };
    }
    return null;
  };

  const goalData = getGoalData();

  const getRiskLevelColor = (riskLevel: 'high' | 'medium' | 'low') => {
    switch (riskLevel) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getRiskLevelLabel = (riskLevel: 'high' | 'medium' | 'low') => {
    switch (riskLevel) {
      case 'high':
        return 'Alto';
      case 'medium':
        return 'Médio';
      case 'low':
        return 'Baixo';
      default:
        return 'Desconhecido';
    }
  };

  const activeFiltersCount = Object.values(filters).filter(
    v => v !== undefined && v !== 'none'
  ).length;

  // Funções helper para verificar se dados são vazios
  const hasCompanyPerformanceData = () => {
    // Sempre mostrar a seção se houver dados (mesmo que companyPerformance seja null)
    // Os cards sempre aparecerão com valores zerados se necessário
    return !!data;
  };

  const hasPendingMatchesData = () => {
    // Sempre mostrar a seção se houver dados de matches (mesmo que total seja 0)
    // Os cards sempre aparecerão, mesmo sem matches na lista
    return data?.pendingMatches !== undefined && data?.pendingMatches !== null;
  };

  const hasBrokersPerformanceData = () => {
    // Mostrar se houver qualquer corretor no array, mesmo com valores zerados
    return (
      data?.brokersPerformance &&
      Array.isArray(data.brokersPerformance) &&
      data.brokersPerformance.length > 0
    );
  };

  const hasChurnAnalysisData = () => {
    if (!data?.churnAnalysis) return false;
    // Mostrar se houver clientes em risco, mesmo que totalClients seja 0
    // ou se totalClients for > 0
    const atRiskCount = data.churnAnalysis.atRiskClients?.length || 0;
    const totalClients = data.churnAnalysis.totalClients || 0;
    const highRisk = data.churnAnalysis.highRisk || 0;
    const mediumRisk = data.churnAnalysis.mediumRisk || 0;
    const lowRisk = data.churnAnalysis.lowRisk || 0;

    return (
      atRiskCount > 0 ||
      totalClients > 0 ||
      highRisk > 0 ||
      mediumRisk > 0 ||
      lowRisk > 0
    );
  };

  const hasConversionFunnelData = () => {
    // Mostrar se houver dados de funil, mesmo que sejam vazios (para debug)
    const hasData = !!data?.conversionFunnel;
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔍 [AdvancedAnalyticsPage] VERIFICANDO FUNIL DE CONVERSÃO');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Has Conversion Funnel:', hasData);
    console.log('Total Leads:', data?.conversionFunnel?.totalLeads);
    console.log('Stages Count:', data?.conversionFunnel?.stages?.length);
    console.log('Has Analysis:', !!data?.conversionFunnel?.analysis);
    console.log(
      'Full Conversion Funnel:',
      JSON.stringify(data?.conversionFunnel, null, 2)
    );
    console.log('═══════════════════════════════════════════════════════════');
    return hasData;
  };

  const hasCapturesStatisticsData = () => {
    if (!capturesStatistics) return false;
    return (
      (capturesStatistics.totalProperties || 0) > 0 ||
      (capturesStatistics.totalClients || 0) > 0 ||
      (capturesStatistics.byCapturer?.length || 0) > 0
    );
  };

  // Verificar se há algum dado disponível
  const hasAnyData = () => {
    return (
      hasCompanyPerformanceData() ||
      hasPendingMatchesData() ||
      hasBrokersPerformanceData() ||
      hasChurnAnalysisData() ||
      hasConversionFunnelData() ||
      hasCapturesStatisticsData() ||
      (goalData && goalData.target > 0)
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LottieLoading />
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error) {
    console.error('❌ [AdvancedAnalyticsPage] Erro detectado na página:', {
      error,
      hasData: !!data,
      hasCompanyPerformance: !!data?.companyPerformance,
      hasPendingMatches: !!data?.pendingMatches,
      hasBrokersPerformance: !!data?.brokersPerformance,
      hasChurnAnalysis: !!data?.churnAnalysis,
      hasConversionFunnel: !!data?.conversionFunnel,
    });

    // Se temos dados mesmo com erro, mostrar a página com dados parciais
    if (
      data &&
      (data.companyPerformance ||
        data.pendingMatches ||
        data.brokersPerformance ||
        data.churnAnalysis ||
        data.conversionFunnel)
    ) {
      console.warn(
        '⚠️ [AdvancedAnalyticsPage] Temos dados parciais - mostrando página mesmo com erro'
      );
      // Continuar renderizando a página com dados disponíveis
    } else {
      // Só mostrar erro se realmente não tivermos nenhum dado
      return (
        <PageContainer>
          <ErrorContainer>
            <ErrorTitle>Erro ao carregar análise avançada</ErrorTitle>
            <ErrorMessage>{error}</ErrorMessage>
            <RetryButton onClick={handleRefresh}>
              <MdRefresh /> Tentar Novamente
            </RetryButton>
          </ErrorContainer>
        </PageContainer>
      );
    }
  }

  if (!data) {
    console.log('⏳ [AdvancedAnalyticsPage] Aguardando dados...', {
      loading,
      error,
    });

    return (
      <PageContainer>
        <LoadingContainer>
          <LottieLoading />
        </LoadingContainer>
      </PageContainer>
    );
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ [AdvancedAnalyticsPage] RENDERIZANDO PÁGINA COM DADOS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('Has Company Performance:', !!data.companyPerformance);
  console.log('Pending Matches Total:', data.pendingMatches?.total || 0);
  console.log('Brokers Count:', data.brokersPerformance?.length || 0);
  console.log('Churn Total Clients:', data.churnAnalysis?.totalClients || 0);
  console.log('Has Conversion Funnel:', !!data.conversionFunnel);
  console.log('Conversion Funnel Loading:', conversionFunnelLoading);
  console.log('Conversion Funnel Error:', conversionFunnelError);
  if (data.conversionFunnel) {
    console.log('Conversion Funnel Details:', {
      totalLeads: data.conversionFunnel.totalLeads,
      stagesCount: data.conversionFunnel.stages?.length,
      hasAnalysis: !!data.conversionFunnel.analysis,
      overallConversionRate: data.conversionFunnel.overallConversionRate,
      period: data.conversionFunnel.period,
    });
  }
  console.log('Full Data:', JSON.stringify(data, null, 2));
  console.log('═══════════════════════════════════════════════════════════');

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <MdBarChart />
          Análise Avançada
        </PageTitle>
        <HeaderActions>
          <FilterButton onClick={() => setShowFilters(!showFilters)}>
            <MdFilterList />
            Filtros
            {activeFiltersCount > 0 && (
              <FilterBadge>{activeFiltersCount}</FilterBadge>
            )}
          </FilterButton>
          <FilterButton onClick={handleRefresh}>
            <MdRefresh />
            Atualizar
          </FilterButton>
        </HeaderActions>
      </PageHeader>

      {/* Banner de Cache Global - se houver dados em cache */}
      {Object.keys(cacheInfo).some(key => cacheInfo[key]?.isFromCache) && (
        <CacheInfoBanner
          formattedTime={
            Object.values(cacheInfo).find(info => info?.isFromCache)
              ?.formattedTime
          }
          dataSource='dados de análise'
        />
      )}

      {/* Meta Geral da Empresa */}
      {goalData && goalData.target > 0 && (
        <Section>
          <CompanyGoalCard>
            <GoalHeader>
              <GoalIcon>
                <MdTrendingUp />
              </GoalIcon>
              <div style={{ flex: 1 }}>
                <GoalTitle>
                  🎯{' '}
                  {selectedGoal ? selectedGoal.title : 'Meta Geral da Empresa'}
                </GoalTitle>
                <GoalSubtitle>
                  {selectedGoal
                    ? selectedGoal.description || 'Meta mensal de vendas'
                    : 'Meta mensal de vendas'}
                </GoalSubtitle>
              </div>
              <InfoTooltip
                content='Acompanhamento do progresso da meta de vendas da empresa. Mostra o percentual alcançado, valores atuais e restantes, além de quantos dias faltam para o fim do período.'
                direction='down'
              />
            </GoalHeader>

            <GoalContent>
              {/* Seletor de Meta dentro do card */}
              <div style={{ marginBottom: '16px' }}>
                <GoalSelector
                  selectedGoalId={selectedGoalId}
                  onGoalChange={setSelectedGoalId}
                />
              </div>

              <ProgressSection>
                <ProgressValue>
                  {(goalData.progress != null && !isNaN(goalData.progress)
                    ? goalData.progress
                    : 0
                  ).toFixed(1)}
                  %
                </ProgressValue>
                <ProgressBar>
                  <ProgressFill
                    $progress={
                      goalData.progress != null && !isNaN(goalData.progress)
                        ? goalData.progress
                        : 0
                    }
                  />
                </ProgressBar>
              </ProgressSection>

              <StatsRow>
                <GoalStatItem>
                  <GoalStatLabel>
                    Meta
                    <InfoTooltip
                      content='Valor total da meta de vendas definida para o período.'
                      direction='down'
                    />
                  </GoalStatLabel>
                  <GoalStatValue>
                    {formatCurrency(goalData.target || 0)}
                  </GoalStatValue>
                </GoalStatItem>
                <GoalStatItem>
                  <GoalStatLabel>
                    Atual
                    <InfoTooltip
                      content='Valor atual já alcançado em relação à meta.'
                      direction='down'
                    />
                  </GoalStatLabel>
                  <GoalStatValue>
                    {formatCurrency(goalData.current || 0)}
                  </GoalStatValue>
                </GoalStatItem>
                <GoalStatItem>
                  <GoalStatLabel>
                    Restante
                    <InfoTooltip
                      content='Valor que ainda precisa ser alcançado para completar a meta.'
                      direction='down'
                    />
                  </GoalStatLabel>
                  <GoalStatValue>
                    {formatCurrency(goalData.remaining || 0)}
                  </GoalStatValue>
                </GoalStatItem>
              </StatsRow>

              <StatusRow>
                <StatusBadge $status={goalData.onTrack ? 'success' : 'warning'}>
                  {goalData.onTrack ? '🎯 No alvo!' : '⚡ Acelere!'}
                </StatusBadge>
                <DaysLeft>
                  {goalData.daysLeft != null && goalData.daysLeft > 0
                    ? `${goalData.daysLeft} dias restantes`
                    : 'Meta finalizada'}
                </DaysLeft>
              </StatusRow>
            </GoalContent>
          </CompanyGoalCard>
        </Section>
      )}

      {/* Seção 1: Performance da Empresa */}
      {hasCompanyPerformanceData() && (
        <Section>
          <SectionTitle>
            <MdBarChart />
            Performance da Empresa
            <InfoTooltip
              content='Métricas gerais de performance da empresa baseadas em matches, vendas e aluguéis.'
              direction='down'
            />
          </SectionTitle>
          {!data?.companyPerformance && (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#FEF3C7',
                borderRadius: '8px',
                color: '#92400E',
              }}
            >
              <strong>ℹ️</strong> Dados de performance ainda não disponíveis
              para o período selecionado.
            </div>
          )}
          <StatsGrid>
            <StatCard>
              <StatHeader>
                <StatIcon color='#3B82F6'>
                  <MdCheckCircle />
                </StatIcon>
              </StatHeader>
              <StatValue>
                {data?.companyPerformance?.companyStats?.totalMatches || 0}
              </StatValue>
              <StatLabel>
                Total de Matches
                <InfoTooltip
                  content='Número total de matches gerados no período selecionado, incluindo aceitos e pendentes.'
                  direction='down'
                />
              </StatLabel>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatIcon color='#10B981'>
                  <MdCheckCircle />
                </StatIcon>
              </StatHeader>
              <StatValue>
                {data?.companyPerformance?.companyStats?.acceptedMatches || 0}
              </StatValue>
              <StatLabel>
                Matches Aceitos
                <InfoTooltip
                  content='Quantidade de matches que foram aceitos pelos clientes ou corretores no período.'
                  direction='down'
                />
              </StatLabel>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatIcon color='#F59E0B'>
                  <MdBarChart />
                </StatIcon>
              </StatHeader>
              <StatValue>
                {(data?.companyPerformance?.companyStats?.avgAcceptanceRate &&
                !isNaN(data.companyPerformance.companyStats.avgAcceptanceRate)
                  ? data.companyPerformance.companyStats.avgAcceptanceRate
                  : 0
                ).toFixed(1)}
                %
              </StatValue>
              <StatLabel>
                Taxa Média de Aceitação
                <InfoTooltip
                  content='Percentual médio de matches que foram aceitos em relação ao total de matches gerados.'
                  direction='down'
                />
              </StatLabel>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatIcon color='#8B5CF6'>
                  <MdCheckCircle />
                </StatIcon>
              </StatHeader>
              <StatValue>
                {(data?.companyPerformance?.companyStats?.avgMatchScore &&
                !isNaN(data.companyPerformance.companyStats.avgMatchScore)
                  ? data.companyPerformance.companyStats.avgMatchScore
                  : 0
                ).toFixed(1)}
              </StatValue>
              <StatLabel>
                Score Médio de Matches
                <InfoTooltip
                  content='Pontuação média calculada para os matches baseada em critérios de compatibilidade entre propriedades e clientes.'
                  direction='down'
                />
              </StatLabel>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatIcon color='#EC4899'>
                  <MdCheckCircle />
                </StatIcon>
              </StatHeader>
              <StatValue>
                {data?.companyPerformance?.companyStats?.totalTasksCreated || 0}
              </StatValue>
              <StatLabel>
                Tarefas Criadas
                <InfoTooltip
                  content='Total de tarefas criadas no sistema durante o período selecionado.'
                  direction='down'
                />
              </StatLabel>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatIcon color='#10B981'>
                  <MdCheckCircle />
                </StatIcon>
              </StatHeader>
              <StatValue>
                {data?.companyPerformance?.companyStats?.totalTasksCompleted ||
                  0}
              </StatValue>
              <StatLabel>
                Tarefas Concluídas
                <InfoTooltip
                  content='Quantidade de tarefas que foram finalizadas com sucesso no período.'
                  direction='down'
                />
              </StatLabel>
            </StatCard>
          </StatsGrid>

          {/* Gráficos de Performance */}
          {data?.companyPerformance && (
            <StatsGrid style={{ marginTop: '24px' }}>
              <TableCard>
                <TableTitle>
                  <MdBarChart />
                  Visão Geral de Métricas
                </TableTitle>
                <div style={{ padding: '20px' }}>
                  <Suspense fallback={<LottieLoading />}>
                    <BarChart
                      data={[
                        {
                          label: 'Total Matches',
                          value:
                            data.companyPerformance?.companyStats
                              ?.totalMatches || 0,
                        },
                        {
                          label: 'Matches Aceitos',
                          value:
                            data.companyPerformance?.companyStats
                              ?.acceptedMatches || 0,
                        },
                        {
                          label: 'Tarefas Criadas',
                          value:
                            data.companyPerformance?.companyStats
                              ?.totalTasksCreated || 0,
                        },
                        {
                          label: 'Tarefas Concluídas',
                          value:
                            data.companyPerformance?.companyStats
                              ?.totalTasksCompleted || 0,
                        },
                      ]}
                      label='Quantidade'
                      color='#3B82F6'
                      emptyMessage='Nenhum dado de performance disponível'
                    />
                  </Suspense>
                </div>
              </TableCard>

              <TableCard>
                <TableTitle>
                  <MdTrendingUp />
                  Taxas e Scores
                </TableTitle>
                <div style={{ padding: '20px' }}>
                  <Suspense fallback={<LottieLoading />}>
                    <BarChart
                      data={[
                        {
                          label: 'Taxa Aceitação',
                          value:
                            data.companyPerformance?.companyStats
                              ?.avgAcceptanceRate || 0,
                        },
                        {
                          label: 'Score Médio',
                          value:
                            data.companyPerformance?.companyStats
                              ?.avgMatchScore || 0,
                        },
                      ]}
                      label='Valor'
                      color='#10B981'
                      emptyMessage='Nenhum dado de taxas disponível'
                    />
                  </Suspense>
                </div>
              </TableCard>
            </StatsGrid>
          )}
        </Section>
      )}

      {/* Seção 2: Matches Pendentes */}
      {hasPendingMatchesData() && (
        <Section>
          <SectionTitle>
            <MdWarning />
            Matches Pendentes
            <InfoTooltip
              content='Lista de matches que ainda não foram aceitos ou processados. Matches pendentes há mais de 7 dias são considerados em atraso.'
              direction='down'
            />
          </SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatHeader>
                <StatIcon color='#EF4444'>
                  <MdWarning />
                </StatIcon>
              </StatHeader>
              <StatValue>{data.pendingMatches?.total || 0}</StatValue>
              <StatLabel>
                Total de Matches Pendentes
                <InfoTooltip
                  content='Número total de matches que ainda estão aguardando resposta ou processamento.'
                  direction='down'
                />
              </StatLabel>
            </StatCard>
            <StatCard>
              <StatHeader>
                <StatIcon color='#DC2626'>
                  <MdWarning />
                </StatIcon>
              </StatHeader>
              <StatValue>{data?.pendingMatches?.overdue || 0}</StatValue>
              <StatLabel>
                Em Atraso (&gt;7 dias)
                <InfoTooltip
                  content='Matches pendentes há mais de 7 dias que requerem atenção urgente.'
                  direction='down'
                />
              </StatLabel>
            </StatCard>
            <StatCard>
              <StatHeader>
                <StatIcon color='#F59E0B'>
                  <MdWarning />
                </StatIcon>
              </StatHeader>
              <StatValue>{data?.pendingMatches?.warning || 0}</StatValue>
              <StatLabel>
                Atenção (&gt;3 dias)
                <InfoTooltip
                  content='Matches pendentes entre 3 e 7 dias que precisam de acompanhamento.'
                  direction='down'
                />
              </StatLabel>
            </StatCard>
          </StatsGrid>

          {data.pendingMatches?.matches &&
          data.pendingMatches.matches.length > 0 ? (
            <TableCard>
              <TableTitle>Lista de Matches Pendentes</TableTitle>
              <TableContainer>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableHeaderCell>Cliente</TableHeaderCell>
                      <TableHeaderCell>Propriedade</TableHeaderCell>
                      <TableHeaderCell>Score</TableHeaderCell>
                      <TableHeaderCell>Dias Pendente</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {data.pendingMatches?.matches?.map(match => {
                      const createdAt = new Date(match.createdAt);
                      const now = new Date();
                      const daysSinceCreated = Math.floor(
                        (now.getTime() - createdAt.getTime()) /
                          (1000 * 60 * 60 * 24)
                      );
                      const clientName =
                        match.client?.name || 'Cliente não informado';
                      const propertyTitle =
                        match.property?.title || 'Propriedade não informada';
                      const matchScore = match.matchScore || 0;

                      return (
                        <TableRow key={match.id}>
                          <TableCell>{clientName}</TableCell>
                          <TableCell>{propertyTitle}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                matchScore >= 80
                                  ? 'success'
                                  : matchScore >= 60
                                    ? 'warning'
                                    : 'info'
                              }
                            >
                              {matchScore}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                daysSinceCreated > 7
                                  ? 'danger'
                                  : daysSinceCreated > 3
                                    ? 'warning'
                                    : 'info'
                              }
                            >
                              {daysSinceCreated} dias
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                daysSinceCreated > 7
                                  ? 'danger'
                                  : daysSinceCreated > 3
                                    ? 'warning'
                                    : 'info'
                              }
                            >
                              {daysSinceCreated > 7
                                ? 'Atrasado'
                                : daysSinceCreated > 3
                                  ? 'Atenção'
                                  : 'Pendente'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </TableCard>
          ) : null}
        </Section>
      )}

      {/* Seção 3: Performance de Corretores */}
      {hasBrokersPerformanceData() && (
        <Section>
          <SectionTitle>
            <MdPeople />
            Performance de Corretores
            <InfoTooltip
              content='Ranking de corretores baseado em vendas, aluguéis, receita, comissões e taxa de conversão. Ordenado por performance geral.'
              direction='down'
            />
          </SectionTitle>
          {cacheInfo[CACHE_KEYS.BROKERS_PERFORMANCE]?.isFromCache && (
            <CacheInfoBanner
              formattedTime={
                cacheInfo[CACHE_KEYS.BROKERS_PERFORMANCE]?.formattedTime
              }
              dataSource='dados de performance de corretores'
            />
          )}
          {data?.brokersPerformance && data.brokersPerformance.length > 0 ? (
            <>
              <TableCard>
                <TableTitle>Ranking de Performance</TableTitle>
                <TableContainer>
                  <Table>
                    <TableHeader>
                      <tr>
                        <TableHeaderCell style={{ width: '50px' }}>
                          #
                        </TableHeaderCell>
                        <TableHeaderCell>Corretor</TableHeaderCell>
                        <TableHeaderCell style={{ textAlign: 'center' }}>
                          Score
                          <InfoTooltip
                            content='Pontuação geral de performance do corretor (0-100).'
                            direction='down'
                          />
                        </TableHeaderCell>
                        <TableHeaderCell style={{ textAlign: 'center' }}>
                          Vendas
                          <InfoTooltip
                            content='Número total de vendas realizadas pelo corretor no período.'
                            direction='down'
                          />
                        </TableHeaderCell>
                        <TableHeaderCell style={{ textAlign: 'right' }}>
                          Valor Total
                          <InfoTooltip
                            content='Soma do valor de todas as vendas realizadas pelo corretor.'
                            direction='down'
                          />
                        </TableHeaderCell>
                        <TableHeaderCell style={{ textAlign: 'center' }}>
                          Taxa Conversão
                          <InfoTooltip
                            content='Percentual de leads que foram convertidos em vendas pelo corretor.'
                            direction='down'
                          />
                        </TableHeaderCell>
                        <TableHeaderCell style={{ textAlign: 'center' }}>
                          Tempo Médio
                          <InfoTooltip
                            content='Tempo médio em dias desde o primeiro contato até a conclusão da venda.'
                            direction='down'
                          />
                        </TableHeaderCell>
                        <TableHeaderCell style={{ textAlign: 'center' }}>
                          Leads
                          <InfoTooltip
                            content='Quantidade de leads (potenciais clientes) gerados pelo corretor.'
                            direction='down'
                          />
                        </TableHeaderCell>
                        <TableHeaderCell style={{ textAlign: 'center' }}>
                          Visitas
                          <InfoTooltip
                            content='Número total de visitas a propriedades realizadas pelo corretor.'
                            direction='down'
                          />
                        </TableHeaderCell>
                        <TableHeaderCell style={{ textAlign: 'center' }}>
                          Tendência
                        </TableHeaderCell>
                      </tr>
                    </TableHeader>
                    <TableBody>
                      {data.brokersPerformance
                        .slice(0, brokersToShow)
                        .map((broker, index) => {
                          const overallScore =
                            broker.overallScore != null &&
                            !isNaN(broker.overallScore)
                              ? broker.overallScore
                              : 0;
                          const conversionRate =
                            broker.conversionRate != null &&
                            !isNaN(broker.conversionRate)
                              ? broker.conversionRate
                              : 0;
                          const averageSaleTime =
                            broker.averageSaleTime != null &&
                            !isNaN(broker.averageSaleTime)
                              ? broker.averageSaleTime
                              : 0;

                          return (
                            <TableRow key={broker.brokerId}>
                              <TableCell>
                                <Badge
                                  color={
                                    index === 0
                                      ? '#F59E0B'
                                      : index === 1
                                        ? '#6B7280'
                                        : index === 2
                                          ? '#92400E'
                                          : '#E5E7EB'
                                  }
                                >
                                  {index + 1}º
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <strong>{broker.brokerName}</strong>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <Badge
                                  variant={
                                    overallScore >= 80
                                      ? 'success'
                                      : overallScore >= 60
                                        ? 'warning'
                                        : 'info'
                                  }
                                >
                                  {overallScore.toFixed(1)}
                                </Badge>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                {broker.salesCount || 0}
                              </TableCell>
                              <TableCell style={{ textAlign: 'right' }}>
                                {formatCurrency(broker.totalSalesValue || 0)}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                {conversionRate.toFixed(1)}%
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                {averageSaleTime > 0
                                  ? `${averageSaleTime} dias`
                                  : '-'}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                {broker.leadsGenerated || 0}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                {broker.visitsCompleted || 0}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <Badge
                                  variant={
                                    broker.trend === 'improving'
                                      ? 'success'
                                      : broker.trend === 'stable'
                                        ? 'info'
                                        : 'warning'
                                  }
                                >
                                  {broker.trend === 'improving'
                                    ? '📈 Melhorando'
                                    : broker.trend === 'stable'
                                      ? '➡️ Estável'
                                      : '📉 Declinando'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                {data.brokersPerformance.length > brokersToShow && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '24px',
                    }}
                  >
                    <FilterButton
                      onClick={() =>
                        setBrokersToShow(prev =>
                          Math.min(prev + 5, data.brokersPerformance.length)
                        )
                      }
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        fontSize: '0.9375rem',
                      }}
                    >
                      <MdExpandMore size={20} />
                      Ver Mais (
                      {Math.min(
                        5,
                        data.brokersPerformance.length - brokersToShow
                      )}{' '}
                      de {data.brokersPerformance.length - brokersToShow}{' '}
                      restantes)
                    </FilterButton>
                  </div>
                )}
              </TableCard>

              {/* Gráficos de Performance de Corretores */}
              <StatsGrid style={{ marginTop: '24px' }}>
                <TableCard>
                  <TableTitle>
                    <MdBarChart />
                    Top 5 Corretores - Vendas
                  </TableTitle>
                  <div style={{ padding: '20px' }}>
                    <Suspense fallback={<LottieLoading />}>
                      <BarChart
                        data={data.brokersPerformance
                          .slice(0, 5)
                          .map(broker => ({
                            label:
                              broker.brokerName.length > 15
                                ? broker.brokerName.substring(0, 15) + '...'
                                : broker.brokerName,
                            value: broker.salesCount || 0,
                          }))}
                        label='Vendas'
                        color='#3B82F6'
                        horizontal={true}
                        emptyMessage='Nenhum dado de corretores disponível'
                      />
                    </Suspense>
                  </div>
                </TableCard>

                <TableCard>
                  <TableTitle>
                    <MdTrendingUp />
                    Top 5 Corretores - Taxa de Conversão
                  </TableTitle>
                  <div style={{ padding: '20px' }}>
                    <Suspense fallback={<LottieLoading />}>
                      <BarChart
                        data={data.brokersPerformance
                          .slice(0, 5)
                          .map(broker => ({
                            label:
                              broker.brokerName.length > 15
                                ? broker.brokerName.substring(0, 15) + '...'
                                : broker.brokerName,
                            value: broker.conversionRate || 0,
                          }))}
                        label='Taxa de Conversão (%)'
                        color='#10B981'
                        horizontal={true}
                        emptyMessage='Nenhum dado de conversão disponível'
                      />
                    </Suspense>
                  </div>
                </TableCard>

                <TableCard>
                  <TableTitle>
                    <MdPeople />
                    Top 5 Corretores - Score Geral
                  </TableTitle>
                  <div style={{ padding: '20px' }}>
                    <Suspense fallback={<LottieLoading />}>
                      <BarChart
                        data={data.brokersPerformance
                          .slice(0, 5)
                          .map(broker => ({
                            label:
                              broker.brokerName.length > 15
                                ? broker.brokerName.substring(0, 15) + '...'
                                : broker.brokerName,
                            value: broker.overallScore || 0,
                          }))}
                        label='Score'
                        color='#8B5CF6'
                        horizontal={true}
                        emptyMessage='Nenhum dado de score disponível'
                      />
                    </Suspense>
                  </div>
                </TableCard>
              </StatsGrid>
            </>
          ) : (
            <EmptyState>
              <EmptyStateIcon>👥</EmptyStateIcon>
              <EmptyStateTitle>Nenhum corretor encontrado</EmptyStateTitle>
              <EmptyStateDescription>
                Não há dados de performance de corretores disponíveis.
              </EmptyStateDescription>
            </EmptyState>
          )}
        </Section>
      )}

      {/* Seção 4: Funil de Conversão */}
      {(hasConversionFunnelData() || conversionFunnelLoading) && (
        <Section>
          <SectionTitle>
            <MdBarChart />
            Funil de Conversão
            <InfoTooltip
              content='Visualização do processo de conversão de leads em vendas, mostrando cada etapa e taxa de conversão. Inclui análise automática com insights e recomendações.'
              direction='down'
            />
          </SectionTitle>
          {cacheInfo[CACHE_KEYS.CONVERSION_FUNNEL]?.isFromCache && (
            <CacheInfoBanner
              formattedTime={
                cacheInfo[CACHE_KEYS.CONVERSION_FUNNEL]?.formattedTime
              }
              dataSource='dados do funil de conversão'
            />
          )}
          {conversionFunnelLoading && (
            <LoadingContainer>
              <LottieLoading message='Carregando funil de conversão...' />
            </LoadingContainer>
          )}
          {conversionFunnelError && !conversionFunnelLoading && (
            <ErrorContainer>
              <ErrorTitle>Erro ao carregar funil de conversão</ErrorTitle>
              <ErrorMessage>{conversionFunnelError}</ErrorMessage>
              <RetryButton onClick={refresh}>
                <MdRefresh /> Tentar Novamente
              </RetryButton>
            </ErrorContainer>
          )}
          {!conversionFunnelLoading &&
            !conversionFunnelError &&
            hasConversionFunnelData() && (
              <>
                <FunnelSummary>
                  <StatCard>
                    <StatHeader>
                      <StatIcon color='#3B82F6'>
                        <MdPeople />
                      </StatIcon>
                    </StatHeader>
                    <StatValue>
                      {data.conversionFunnel?.totalLeads || 0}
                    </StatValue>
                    <StatLabel>
                      Total de Leads
                      <InfoTooltip
                        content='Número total de leads (potenciais clientes) que entraram no funil de conversão.'
                        direction='down'
                      />
                    </StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatHeader>
                      <StatIcon color='#10B981'>
                        <MdTrendingUp />
                      </StatIcon>
                    </StatHeader>
                    <StatValue>
                      {(data.conversionFunnel?.overallConversionRate != null &&
                      !isNaN(data.conversionFunnel.overallConversionRate)
                        ? data.conversionFunnel.overallConversionRate
                        : 0
                      ).toFixed(2)}
                      %
                    </StatValue>
                    <StatLabel>
                      Taxa de Conversão Geral
                      <InfoTooltip
                        content='Percentual geral de conversão de leads em vendas em todo o funil.'
                        direction='down'
                      />
                    </StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatHeader>
                      <StatIcon color='#8B5CF6'>
                        <MdBarChart />
                      </StatIcon>
                    </StatHeader>
                    <StatValue>
                      <FunnelScore
                        $score={
                          data.conversionFunnel?.analysis?.overallScore || 0
                        }
                      >
                        {data.conversionFunnel?.analysis?.overallScore || 0}/100
                      </FunnelScore>
                    </StatValue>
                    <StatLabel>
                      Score Geral
                      <InfoTooltip
                        content='Pontuação geral do funil de conversão baseada na análise automática (0-100).'
                        direction='down'
                      />
                    </StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatHeader>
                      <StatIcon color='#F59E0B'>
                        <MdTimer />
                      </StatIcon>
                    </StatHeader>
                    <StatValue style={{ fontSize: '0.875rem' }}>
                      {data.conversionFunnel?.period || '-'}
                    </StatValue>
                    <StatLabel>
                      Período
                      <InfoTooltip
                        content='Período de análise dos dados do funil de conversão.'
                        direction='down'
                      />
                    </StatLabel>
                  </StatCard>
                </FunnelSummary>

                {/* Funil Visual Moderno */}
                <TableCard style={{ marginTop: '24px' }}>
                  <TableTitle>
                    <MdBarChart />
                    Visualização do Funil de Conversão
                  </TableTitle>
                  <div style={{ padding: '20px' }}>
                    <Suspense fallback={<LottieLoading />}>
                      <FunnelChart
                        stages={data.conversionFunnel?.stages || []}
                        totalLeads={data.conversionFunnel?.totalLeads || 0}
                        loading={conversionFunnelLoading}
                        emptyMessage='Nenhum dado do funil disponível'
                      />
                    </Suspense>
                  </div>
                </TableCard>

                {/* Análise do Funil */}
                {data.conversionFunnel?.analysis && (
                  <FunnelAnalysisCard style={{ marginTop: '24px' }}>
                    <FunnelAnalysisTitle>
                      📊 Análise do Funil
                    </FunnelAnalysisTitle>
                    <FunnelAnalysisText>
                      {data.conversionFunnel.analysis.summary ||
                        'Nenhuma análise disponível.'}
                    </FunnelAnalysisText>

                    {data.conversionFunnel?.analysis?.strengths &&
                      data.conversionFunnel.analysis.strengths.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                          <FunnelAnalysisTitle
                            style={{ fontSize: '1rem', marginBottom: '12px' }}
                          >
                            ✅ Pontos Fortes
                          </FunnelAnalysisTitle>
                          <FunnelList>
                            {data.conversionFunnel?.analysis?.strengths?.map(
                              (strength, index) => (
                                <FunnelListItem key={index} $type='success'>
                                  {strength}
                                </FunnelListItem>
                              )
                            )}
                          </FunnelList>
                        </div>
                      )}

                    {data.conversionFunnel?.analysis?.bottlenecks &&
                      data.conversionFunnel.analysis.bottlenecks.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                          <FunnelAnalysisTitle
                            style={{ fontSize: '1rem', marginBottom: '12px' }}
                          >
                            ⚠️ Gargalos
                          </FunnelAnalysisTitle>
                          <FunnelList>
                            {data.conversionFunnel?.analysis?.bottlenecks?.map(
                              (bottleneck, index) => (
                                <FunnelListItem key={index} $type='warning'>
                                  {bottleneck}
                                </FunnelListItem>
                              )
                            )}
                          </FunnelList>
                        </div>
                      )}

                    {data.conversionFunnel?.analysis?.opportunities &&
                      data.conversionFunnel.analysis.opportunities.length >
                        0 && (
                        <div style={{ marginTop: '20px' }}>
                          <FunnelAnalysisTitle
                            style={{ fontSize: '1rem', marginBottom: '12px' }}
                          >
                            🎯 Oportunidades
                          </FunnelAnalysisTitle>
                          <FunnelList>
                            {data.conversionFunnel?.analysis?.opportunities?.map(
                              (opportunity, index) => (
                                <FunnelListItem key={index} $type='info'>
                                  {opportunity}
                                </FunnelListItem>
                              )
                            )}
                          </FunnelList>
                        </div>
                      )}
                  </FunnelAnalysisCard>
                )}

                {data.conversionFunnel?.analysis?.insights &&
                  data.conversionFunnel.analysis.insights.length > 0 && (
                    <div style={{ marginTop: '24px' }}>
                      <FunnelAnalysisTitle style={{ marginBottom: '20px' }}>
                        💡 Insights Detalhados
                      </FunnelAnalysisTitle>
                      {data.conversionFunnel?.analysis?.insights?.map(
                        (insight, index) => (
                          <FunnelInsightCard
                            key={index}
                            $type={insight?.type || 'info'}
                          >
                            <FunnelInsightTitle>
                              {insight?.title || 'Insight'}
                            </FunnelInsightTitle>
                            <FunnelInsightDescription>
                              {insight?.description || ''}
                            </FunnelInsightDescription>
                            {insight?.recommendations &&
                              Array.isArray(insight.recommendations) &&
                              insight.recommendations.length > 0 && (
                                <FunnelInsightRecommendations>
                                  {insight.recommendations.map(
                                    (recommendation, recIndex) => (
                                      <FunnelInsightRecommendation
                                        key={recIndex}
                                      >
                                        {recommendation}
                                      </FunnelInsightRecommendation>
                                    )
                                  )}
                                </FunnelInsightRecommendations>
                              )}
                          </FunnelInsightCard>
                        )
                      )}
                    </div>
                  )}
              </>
            )}
          {!conversionFunnelLoading &&
            !conversionFunnelError &&
            !hasConversionFunnelData() && (
              <EmptyState>
                <EmptyStateIcon>📊</EmptyStateIcon>
                <EmptyStateTitle>
                  Nenhum dado do funil disponível
                </EmptyStateTitle>
                <EmptyStateDescription>
                  Não há dados de conversão para o período selecionado. Tente
                  ajustar os filtros ou aguarde até que mais dados sejam
                  coletados.
                </EmptyStateDescription>
              </EmptyState>
            )}
        </Section>
      )}

      {/* Seção 5: Análise de Churn */}
      {hasChurnAnalysisData() && (
        <Section>
          <SectionTitle>
            <MdWarning />
            Análise de Churn
            <InfoTooltip
              content='Análise de risco de perda de clientes usando IA. Identifica clientes em risco de churn e fornece recomendações de ações para recuperação.'
              direction='down'
            />
          </SectionTitle>
          {cacheInfo[CACHE_KEYS.CHURN_ANALYSIS]?.isFromCache && (
            <CacheInfoBanner
              formattedTime={
                cacheInfo[CACHE_KEYS.CHURN_ANALYSIS]?.formattedTime
              }
              dataSource='dados de análise de churn'
            />
          )}
          <StatsGrid>
            <StatCard>
              <StatHeader>
                <StatIcon color='#3B82F6'>
                  <MdPeople />
                </StatIcon>
              </StatHeader>
              <StatValue>{data?.churnAnalysis?.totalClients || 0}</StatValue>
              <StatLabel>
                Total de Clientes Analisados
                <InfoTooltip
                  content='Número total de clientes que foram analisados para risco de churn.'
                  direction='down'
                />
              </StatLabel>
            </StatCard>
            <StatCard>
              <StatHeader>
                <StatIcon color='#EF4444'>
                  <MdWarning />
                </StatIcon>
              </StatHeader>
              <StatValue>{data?.churnAnalysis?.highRisk || 0}</StatValue>
              <StatLabel>
                Risco Alto
                <InfoTooltip
                  content='Clientes com alto risco de churn que requerem atenção imediata.'
                  direction='down'
                />
              </StatLabel>
            </StatCard>
            <StatCard>
              <StatHeader>
                <StatIcon color='#F59E0B'>
                  <MdWarning />
                </StatIcon>
              </StatHeader>
              <StatValue>{data?.churnAnalysis?.mediumRisk || 0}</StatValue>
              <StatLabel>
                Risco Médio
                <InfoTooltip
                  content='Clientes com risco médio de churn que precisam de acompanhamento.'
                  direction='down'
                />
              </StatLabel>
            </StatCard>
            <StatCard>
              <StatHeader>
                <StatIcon color='#10B981'>
                  <MdCheckCircle />
                </StatIcon>
              </StatHeader>
              <StatValue>{data?.churnAnalysis?.lowRisk || 0}</StatValue>
              <StatLabel>
                Risco Baixo
                <InfoTooltip
                  content='Clientes com baixo risco de churn, considerados estáveis.'
                  direction='down'
                />
              </StatLabel>
            </StatCard>
            <StatCard>
              <StatHeader>
                <StatIcon color='#8B5CF6'>
                  <MdBarChart />
                </StatIcon>
              </StatHeader>
              <StatValue>
                {(data?.churnAnalysis?.churnRate &&
                !isNaN(data.churnAnalysis.churnRate)
                  ? data.churnAnalysis.churnRate
                  : 0
                ).toFixed(1)}
                %
              </StatValue>
              <StatLabel>
                Taxa de Churn Estimada
                <InfoTooltip
                  content='Percentual estimado de clientes que podem deixar a empresa baseado na análise de risco.'
                  direction='down'
                />
              </StatLabel>
            </StatCard>
          </StatsGrid>

          {data?.churnAnalysis?.atRiskClients &&
          data.churnAnalysis.atRiskClients.length > 0 ? (
            <div>
              {data?.churnAnalysis?.atRiskClients
                ?.slice(0, churnToShow)
                .map(client => (
                  <ChurnRiskCard
                    key={client.clientId}
                    riskLevel={client.riskLevel}
                  >
                    <ChurnRiskHeader>
                      <ChurnRiskInfo>
                        <ChurnRiskName>{client.clientName}</ChurnRiskName>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            marginTop: '8px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <div>
                            <ChurnRiskLabel>Score de Risco</ChurnRiskLabel>
                            <ChurnRiskScore
                              $riskColor={getRiskLevelColor(client.riskLevel)}
                            >
                              {client.churnRiskScore != null &&
                              !isNaN(client.churnRiskScore)
                                ? client.churnRiskScore
                                : 0}
                            </ChurnRiskScore>
                          </div>
                          <Badge
                            variant={
                              client.riskLevel === 'high'
                                ? 'danger'
                                : client.riskLevel === 'medium'
                                  ? 'warning'
                                  : 'success'
                            }
                          >
                            Risco {getRiskLevelLabel(client.riskLevel)}
                          </Badge>
                          <div>
                            <ChurnRiskLabel>Prob. Recuperação</ChurnRiskLabel>
                            <ChurnRiskValue>
                              {client.recoveryProbability != null &&
                              !isNaN(client.recoveryProbability)
                                ? client.recoveryProbability
                                : 0}
                              %
                            </ChurnRiskValue>
                          </div>
                        </div>
                        <ChurnRiskDays>
                          Sem contato há{' '}
                          {client.daysSinceLastContact != null &&
                          !isNaN(client.daysSinceLastContact)
                            ? client.daysSinceLastContact
                            : 0}{' '}
                          dias
                        </ChurnRiskDays>
                      </ChurnRiskInfo>
                    </ChurnRiskHeader>
                    <ChurnRiskFactors>
                      <ChurnRiskSectionTitle>
                        Fatores de Risco:
                      </ChurnRiskSectionTitle>
                      <ChurnRiskFactorList>
                        {client.riskFactors.map((factor, index) => (
                          <ChurnRiskFactorItem key={index}>
                            {factor}
                          </ChurnRiskFactorItem>
                        ))}
                      </ChurnRiskFactorList>
                      <ChurnRiskSectionTitle style={{ marginTop: '16px' }}>
                        Ações Recomendadas:
                      </ChurnRiskSectionTitle>
                      <ChurnActionsList>
                        {client.recommendedActions.map((action, index) => (
                          <ChurnActionItem key={index}>
                            {action}
                          </ChurnActionItem>
                        ))}
                      </ChurnActionsList>
                    </ChurnRiskFactors>
                  </ChurnRiskCard>
                ))}
              {data?.churnAnalysis?.atRiskClients &&
                data.churnAnalysis.atRiskClients.length > churnToShow && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '24px',
                    }}
                  >
                    <FilterButton
                      onClick={() =>
                        setChurnToShow(prev =>
                          Math.min(
                            prev + 5,
                            data.churnAnalysis?.atRiskClients?.length || 0
                          )
                        )
                      }
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        fontSize: '0.9375rem',
                      }}
                    >
                      <MdExpandMore size={20} />
                      Ver Mais (
                      {Math.min(
                        5,
                        (data.churnAnalysis?.atRiskClients?.length || 0) -
                          churnToShow
                      )}{' '}
                      de{' '}
                      {(data.churnAnalysis?.atRiskClients?.length || 0) -
                        churnToShow}{' '}
                      restantes)
                    </FilterButton>
                  </div>
                )}
            </div>
          ) : (
            <EmptyState>
              <EmptyStateIcon>✅</EmptyStateIcon>
              <EmptyStateTitle>Nenhum cliente em risco</EmptyStateTitle>
              <EmptyStateDescription>
                Todos os clientes estão com baixo risco de churn.
              </EmptyStateDescription>
            </EmptyState>
          )}
        </Section>
      )}

      {/* Seção de Análise de Captadores */}
      {hasCapturesStatisticsData() && (
        <Section>
          <SectionTitle>
            <MdPeople />
            Análise de Captadores
            <InfoTooltip
              content='Estatísticas detalhadas sobre o desempenho dos captadores de propriedades e clientes'
              direction='down'
            />
          </SectionTitle>

          {/* Seletor de Período */}
          <div
            style={{
              marginBottom: '24px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <label style={{ fontWeight: 500 }}>Período:</label>
            <select
              value={selectedPeriod}
              onChange={e =>
                setSelectedPeriod(
                  e.target.value as 'month' | 'quarter' | 'year'
                )
              }
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <option value='month'>Último mês</option>
              <option value='quarter'>Último trimestre</option>
              <option value='year'>Último ano</option>
            </select>
          </div>

          {loadingCaptures ? (
            <LoadingContainer>
              <LottieLoading message='Carregando estatísticas de captadores...' />
            </LoadingContainer>
          ) : capturesError ? (
            <ErrorContainer>
              <ErrorTitle>Erro ao carregar estatísticas</ErrorTitle>
              <ErrorMessage>{capturesError}</ErrorMessage>
              <RetryButton onClick={() => setSelectedPeriod(selectedPeriod)}>
                Tentar novamente
              </RetryButton>
            </ErrorContainer>
          ) : capturesStatistics ? (
            <>
              {/* Resumo Geral */}
              <StatsGrid>
                <StatCard>
                  <StatHeader>
                    <StatIcon color='#3B82F6'>
                      <MdHome />
                    </StatIcon>
                  </StatHeader>
                  <StatValue>{capturesStatistics.totalProperties}</StatValue>
                  <StatLabel>
                    Total de Propriedades
                    <InfoTooltip
                      content='Número total de propriedades captadas pelos captadores no período.'
                      direction='down'
                    />
                  </StatLabel>
                </StatCard>
                <StatCard>
                  <StatHeader>
                    <StatIcon color='#10B981'>
                      <MdPeople />
                    </StatIcon>
                  </StatHeader>
                  <StatValue>{capturesStatistics.totalClients}</StatValue>
                  <StatLabel>
                    Total de Clientes
                    <InfoTooltip
                      content='Número total de clientes captados pelos captadores no período.'
                      direction='down'
                    />
                  </StatLabel>
                </StatCard>
                <StatCard>
                  <StatHeader>
                    <StatIcon color='#8B5CF6'>
                      <MdBarChart />
                    </StatIcon>
                  </StatHeader>
                  <StatValue>
                    {capturesStatistics.conversionRate.propertiesSoldRate.toFixed(
                      2
                    )}
                    %
                  </StatValue>
                  <StatLabel>
                    Taxa de Conversão - Propriedades
                    <InfoTooltip
                      content='Percentual de propriedades captadas que foram vendidas ou alugadas.'
                      direction='down'
                    />
                  </StatLabel>
                </StatCard>
                <StatCard>
                  <StatHeader>
                    <StatIcon color='#F59E0B'>
                      <MdTrendingUp />
                    </StatIcon>
                  </StatHeader>
                  <StatValue>
                    {capturesStatistics.conversionRate.clientsClosedRate.toFixed(
                      2
                    )}
                    %
                  </StatValue>
                  <StatLabel>
                    Taxa de Conversão - Clientes
                    <InfoTooltip
                      content='Percentual de clientes captados que fecharam negócio.'
                      direction='down'
                    />
                  </StatLabel>
                </StatCard>
              </StatsGrid>

              {/* Ranking de Captadores */}
              {capturesStatistics.byCapturer &&
                capturesStatistics.byCapturer.length > 0 && (
                  <TableCard style={{ marginTop: '24px' }}>
                    <TableTitle>
                      <MdPeople />
                      Ranking de Captadores
                    </TableTitle>
                    <TableContainer>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHeaderCell>Posição</TableHeaderCell>
                            <TableHeaderCell>Nome</TableHeaderCell>
                            <TableHeaderCell>Propriedades</TableHeaderCell>
                            <TableHeaderCell>Clientes</TableHeaderCell>
                            <TableHeaderCell>Total</TableHeaderCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {capturesStatistics.byCapturer.map(
                            (capturer, index) => (
                              <TableRow key={capturer.capturerId}>
                                <TableCell>
                                  <Badge
                                    color={
                                      index === 0
                                        ? '#F59E0B'
                                        : index === 1
                                          ? '#6B7280'
                                          : index === 2
                                            ? '#92400E'
                                            : '#E5E7EB'
                                    }
                                  >
                                    {index + 1}º
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <strong>{capturer.capturerName}</strong>
                                  <div
                                    style={{
                                      fontSize: '12px',
                                      color: '#6B7280',
                                      marginTop: '4px',
                                    }}
                                  >
                                    {capturer.capturerEmail}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {capturer.propertiesCount}
                                </TableCell>
                                <TableCell>{capturer.clientsCount}</TableCell>
                                <TableCell>
                                  <strong>{capturer.totalCaptures}</strong>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TableCard>
                )}

              {/* Estatísticas por Tipo */}
              <StatsGrid style={{ marginTop: '24px' }}>
                <TableCard>
                  <TableTitle>
                    <MdHome />
                    Por Tipo de Propriedade
                  </TableTitle>
                  <div style={{ padding: '20px' }}>
                    <Suspense fallback={<LottieLoading />}>
                      <CategoryDistributionChart
                        data={capturesStatistics.byPropertyType
                          .filter(
                            item =>
                              (item.propertyType || item.type) && item.count > 0
                          )
                          .map((item): CategoryData => {
                            const typeValue =
                              item.type || item.propertyType || '';
                            return {
                              label: typeValue
                                ? getTypeText(typeValue)
                                : 'Não especificado',
                              value: item.count || 0,
                            };
                          })}
                        loading={loadingCaptures}
                        emptyMessage='Nenhum dado de propriedade disponível'
                      />
                    </Suspense>
                  </div>
                </TableCard>

                <TableCard>
                  <TableTitle>
                    <MdPeople />
                    Por Tipo de Cliente
                  </TableTitle>
                  <div style={{ padding: '20px' }}>
                    <Suspense fallback={<LottieLoading />}>
                      <CategoryDistributionChart
                        data={capturesStatistics.byClientType
                          .filter(item => item.clientType && item.count > 0)
                          .map(
                            (item): CategoryData => ({
                              label: item.clientType || 'Não especificado',
                              value: item.count || 0,
                            })
                          )}
                        loading={loadingCaptures}
                        emptyMessage='Nenhum dado de cliente disponível'
                      />
                    </Suspense>
                  </div>
                </TableCard>
              </StatsGrid>
            </>
          ) : (
            <EmptyState>
              <EmptyStateIcon>
                <MdBarChart />
              </EmptyStateIcon>
              <EmptyStateTitle>Nenhum dado disponível</EmptyStateTitle>
              <EmptyStateDescription>
                Não há estatísticas de captadores disponíveis para o período
                selecionado.
              </EmptyStateDescription>
            </EmptyState>
          )}
        </Section>
      )}

      {/* Mensagem quando não há dados suficientes */}
      {!hasAnyData() && !loading && (
        <Section>
          <EmptyState>
            <EmptyStateIcon>📊</EmptyStateIcon>
            <EmptyStateTitle>
              Sem dados suficientes para análise
            </EmptyStateTitle>
            <EmptyStateDescription>
              Não há dados disponíveis no momento para exibir as análises. Tente
              ajustar os filtros ou aguarde até que mais dados sejam coletados.
            </EmptyStateDescription>
          </EmptyState>
        </Section>
      )}

      {/* Drawer de Filtros */}
      <AdvancedAnalyticsFiltersDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={newFilters => {
          updateFilters(newFilters);
        }}
        loading={loading}
      />
    </PageContainer>
  );
};

export default AdvancedAnalyticsPage;
