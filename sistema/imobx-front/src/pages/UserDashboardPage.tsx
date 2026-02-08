import React, { useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { useUserDashboard } from '../hooks/useUserDashboard';
import { InfoTooltip } from '../components/common/InfoTooltip';
import UserDashboardFilters from '../components/dashboard/UserDashboardFilters';
import { LottieLoading } from '../components/common/LottieLoading';
import {
  MdHome,
  MdPeople,
  MdAttachMoney,
  MdCalendarToday,
  MdTrendingUp,
  MdTrendingDown,
  MdAssignment,
  MdCheckCircle,
  MdPending,
  MdEmojiEvents,
  MdShowChart,
  MdTimer,
  MdWorkspacePremium,
  MdLocalFireDepartment,
  MdFilterList,
} from 'react-icons/md';
import {
  Container,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  ErrorContainer,
  ErrorIcon,
  ErrorTitle,
  ErrorMessage,
  RetryButton,
  EmptyContainer,
  EmptyIcon,
  EmptyTitle,
  EmptyMessage,
  WelcomeSection,
  WelcomeContent,
  WelcomeTitle,
  WelcomeSubtitle,
  WelcomeDate,
  PerformanceCard,
  PerformanceHeader,
  PerformanceTitle,
  RankingBadge,
  PerformanceContent,
  PerformanceMain,
  PerformanceValue,
  PerformanceComparison,
  PerformanceChart,
  ChartItem,
  ChartLabel,
  ChartBarContainer,
  ChartBar,
  ChartValue,
  AchievementsSection,
  AchievementsGrid,
  AchievementCard,
  AchievementIcon,
  AchievementInfo,
  AchievementTitle,
  AchievementDescription,
  AchievementDate,
  Section,
  SectionHeader,
  SectionTitle,
  MainGrid,
  StatsGrid,
  StatCard,
  StatHeader,
  StatHeaderRight,
  StatIcon,
  StatBadge,
  StatContent,
  StatValue,
  StatLabel,
  StatFooter,
  GoalsGrid,
  GoalCard,
  GoalHeader,
  GoalHeaderRight,
  GoalIcon,
  GoalLabel,
  GoalContent,
  GoalValue,
  GoalTarget,
  GoalProgress,
  ProgressBar,
  ProgressText,
  MetricsGrid,
  MetricCard,
  MetricIcon,
  MetricContent,
  MetricValue,
  MetricLabel,
  ActivitiesList,
  ActivityItem,
  ActivityIcon,
  ActivityInfo,
  ActivityTitle,
  ActivityDescription,
  ActivityTime,
  ActivitiesSection,
  AppointmentsSection,
} from '../styles/pages/UserDashboardPageStyles';
import { PageLightBg } from '../styles/components/PageStyles';

export const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const permissionsContext = usePermissionsContextOptional();
  const currentUser = getCurrentUser();

  const [showFilters, setShowFilters] = useState(false);
  const {
    data: dashboardData,
    loading,
    error,
    filters,
    updateFilters,
    refresh,
  } = useUserDashboard();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'property':
        return <MdHome />;
      case 'client':
        return <MdPeople />;
      case 'inspection':
        return <MdAssignment />;
      case 'appointment':
        return <MdCalendarToday />;
      default:
        return <MdCheckCircle />;
    }
  };

  const formatActivityDescription = (description: string): string => {
    if (description.includes('R$')) {
      return description.replace(/R\$\s*(\d+)/g, (_, number) => {
        return `R$ ${parseInt(number).toLocaleString('pt-BR')}`;
      });
    }
    return description;
  };

  const canAccess = (permission: string): boolean => {
    return permissionsContext?.hasPermission(permission) ?? false;
  };

  // Loading state
  if (loading) {
    return (
      <PageLightBg>
        <LottieLoading asOverlay={false} />
      </PageLightBg>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLightBg>
        <Container>
          <ErrorContainer>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorTitle>Erro ao carregar dashboard</ErrorTitle>
            <ErrorMessage>{error}</ErrorMessage>
            <RetryButton onClick={refresh}>Tentar Novamente</RetryButton>
          </ErrorContainer>
        </Container>
      </PageLightBg>
    );
  }

  // No data state
  if (!dashboardData?.data) {
    return (
      <PageLightBg>
        <Container>
          <EmptyContainer>
            <EmptyIcon>📊</EmptyIcon>
            <EmptyTitle>Nenhum dado disponível</EmptyTitle>
            <EmptyMessage>
              Não foi possível carregar os dados do dashboard.
            </EmptyMessage>
            <RetryButton onClick={refresh}>Recarregar</RetryButton>
          </EmptyContainer>
        </Container>
      </PageLightBg>
    );
  }

  const dashboardInfo = dashboardData.data;
  const userInfo = dashboardInfo.user || currentUser;

  // Usar dados reais da API com valores padrão para evitar erros de null/undefined
  const stats = dashboardInfo.stats || {
    myProperties: 0,
    myClients: 0,
    myInspections: 0,
    myAppointments: 0,
    myCommissions: 0,
    myTasks: 0,
    myKeys: 0,
    myNotes: 0,
    myMatches: 0,
  };

  const performance = dashboardInfo.performance || {
    thisMonth: 0,
    lastMonth: 0,
    growthPercentage: 0,
    ranking: 0,
    totalUsers: 0,
    points: 0,
  };

  // Garantir que gamification tenha valores padrão caso seja null/undefined
  const gamification = dashboardInfo.gamification
    ? {
        currentPoints: dashboardInfo.gamification.currentPoints || 0,
        level: dashboardInfo.gamification.level || 1,
        achievements: dashboardInfo.gamification.achievements || [],
        pointsBreakdown: dashboardInfo.gamification.pointsBreakdown || {
          sales: 0,
          rentals: 0,
          clients: 0,
          appointments: 0,
          tasks: 0,
          other: 0,
        },
      }
    : {
        currentPoints: 0,
        level: 1,
        achievements: [],
        pointsBreakdown: {
          sales: 0,
          rentals: 0,
          clients: 0,
          appointments: 0,
          tasks: 0,
          other: 0,
        },
      };

  const activityStats = dashboardInfo.activityStats || {
    totalVisits: 0,
    appointmentsThisMonth: 0,
    completionRate: 0,
  };

  const recentActivities = dashboardInfo.recentActivities || [];
  const upcomingAppointments = dashboardInfo.upcomingAppointments || [];
  const monthlyGoals = dashboardInfo.monthlyGoals || {};

  const conversionMetrics = dashboardInfo.conversionMetrics || {
    visitsToSales: 0,
    clientsToClosed: 0,
    matchesAccepted: 0,
  };

  // Verificar se há filtros ativos (considerando que padrão é 'custom' com datas do mês atual)
  const defaultStartDate = dayjs().startOf('month').format('YYYY-MM-DD');
  const defaultEndDate = dayjs().format('YYYY-MM-DD');

  const hasActiveFilters =
    filters.dateRange !== 'custom' ||
    filters.startDate !== defaultStartDate ||
    filters.endDate !== defaultEndDate ||
    filters.compareWith !== 'none' ||
    filters.metric !== 'all' ||
    filters.activitiesLimit !== 10 ||
    filters.appointmentsLimit !== 5;

  const activeFiltersCount = [
    filters.dateRange !== 'custom' ||
      filters.startDate !== defaultStartDate ||
      filters.endDate !== defaultEndDate,
    filters.compareWith !== 'none',
    filters.metric !== 'all',
    filters.activitiesLimit !== 10,
    filters.appointmentsLimit !== 5,
  ].filter(Boolean).length;

  return (
    <PageLightBg>
      <Container>
        {/* Cabeçalho com Saudação */}
        <WelcomeSection>
          <WelcomeContent>
            <WelcomeTitle>
              {getGreeting()}, {userInfo?.name?.split(' ')[0] || 'Usuário'}! 👋
            </WelcomeTitle>
            <WelcomeSubtitle>
              Aqui está um resumo das suas atividades
            </WelcomeSubtitle>
          </WelcomeContent>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '12px',
            }}
          >
            <FilterToggleButton
              onClick={() => setShowFilters(true)}
              $hasActive={hasActiveFilters}
            >
              <MdFilterList size={20} />
              Filtros
              {hasActiveFilters && (
                <FilterBadge>{activeFiltersCount}</FilterBadge>
              )}
            </FilterToggleButton>
            <WelcomeDate>
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </WelcomeDate>
          </div>
        </WelcomeSection>

        {/* Performance Card - Destaque */}
        {canAccess('commission:view') && (
          <PerformanceCard>
            <PerformanceHeader>
              <PerformanceTitle>
                <MdShowChart size={24} />
                Performance Este Mês
              </PerformanceTitle>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <RankingBadge>
                  <MdWorkspacePremium size={18} />
                  Nível {gamification.level}
                </RankingBadge>
                <RankingBadge>⭐ {performance.points} pontos</RankingBadge>
                <RankingBadge>
                  #{performance.ranking}º de {performance.totalUsers}
                </RankingBadge>
              </div>
            </PerformanceHeader>

            <PerformanceContent>
              <PerformanceMain>
                <PerformanceValue>
                  R${' '}
                  {performance.thisMonth.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </PerformanceValue>
                <PerformanceComparison
                  $isPositive={performance.growthPercentage > 0}
                >
                  {performance.growthPercentage > 0 ? (
                    <MdTrendingUp size={20} />
                  ) : (
                    <MdTrendingDown size={20} />
                  )}
                  {Math.abs(performance.growthPercentage).toFixed(2)}% vs mês
                  anterior
                </PerformanceComparison>
              </PerformanceMain>

              <PerformanceChart>
                {Object.entries(gamification.pointsBreakdown).map(
                  ([key, value]) => {
                    if (value === 0) return null;
                    const colors: any = {
                      sales: '#10b981',
                      clients: '#3b82f6',
                      appointments: '#f59e0b',
                      tasks: '#8b5cf6',
                      rentals: '#ec4899',
                      other: '#6b7280',
                    };
                    const labels: any = {
                      sales: 'Vendas',
                      clients: 'Clientes',
                      appointments: 'Agendamentos',
                      tasks: 'Negociações',
                      rentals: 'Aluguéis',
                      other: 'Outros',
                    };

                    // Calcular total de pontos do breakdown
                    const totalBreakdown = Object.values(
                      gamification.pointsBreakdown
                    ).reduce((a, b) => a + b, 0);
                    const percentage =
                      totalBreakdown > 0
                        ? Math.round((value / totalBreakdown) * 100)
                        : 100;

                    return (
                      <ChartItem key={key}>
                        <ChartLabel>{labels[key]}</ChartLabel>
                        <ChartBarContainer>
                          <ChartBar
                            $percentage={percentage}
                            $color={colors[key]}
                          />
                          <ChartValue>{value} pts</ChartValue>
                        </ChartBarContainer>
                      </ChartItem>
                    );
                  }
                )}
              </PerformanceChart>
            </PerformanceContent>
          </PerformanceCard>
        )}

        {/* Conquistas */}
        {gamification.achievements.length > 0 && (
          <AchievementsSection>
            <SectionHeader>
              <SectionTitle>
                <MdEmojiEvents size={20} />
                Conquistas Recentes
              </SectionTitle>
            </SectionHeader>

            <AchievementsGrid>
              {gamification.achievements.map(achievement => (
                <AchievementCard key={achievement.id} $color='#fbbf24'>
                  <AchievementIcon>{achievement.icon}</AchievementIcon>
                  <AchievementInfo>
                    <AchievementTitle>{achievement.name}</AchievementTitle>
                    <AchievementDescription>
                      {achievement.description}
                    </AchievementDescription>
                    <AchievementDate>
                      Conquistado em{' '}
                      {new Date(achievement.earnedAt).toLocaleDateString(
                        'pt-BR'
                      )}
                    </AchievementDate>
                  </AchievementInfo>
                </AchievementCard>
              ))}
            </AchievementsGrid>
          </AchievementsSection>
        )}

        {/* Seção de Negociações e Atividades */}
        <Section>
          <SectionHeader>
            <SectionTitle>
              <MdAssignment size={20} />
              Minhas Atividades
            </SectionTitle>
          </SectionHeader>

          <StatsGrid>
            <StatCard onClick={() => navigate('/kanban')}>
              <StatHeader>
                <StatIcon $color='#3b82f6'>
                  <MdAssignment size={24} />
                </StatIcon>
                <StatHeaderRight>
                  <StatBadge $color='#3b82f6'>{stats.myTasks}</StatBadge>
                  <InfoTooltip
                    content='Negociações que foram atribuídas especificamente para você, incluindo follow-ups, pesquisas de mercado e atividades administrativas.'
                    direction='up'
                  />
                </StatHeaderRight>
              </StatHeader>
              <StatContent>
                <StatValue>{stats.myTasks}</StatValue>
                <StatLabel>Minhas Negociações</StatLabel>
              </StatContent>
              <StatFooter>
                <MdCheckCircle size={14} />
                <span>{activityStats.completionRate}% taxa de conclusão</span>
              </StatFooter>
            </StatCard>

            <StatCard onClick={() => navigate('/calendar')}>
              <StatHeader>
                <StatIcon $color='#f59e0b'>
                  <MdCalendarToday size={24} />
                </StatIcon>
                <StatHeaderRight>
                  <StatBadge $color='#f59e0b'>
                    {activityStats.appointmentsThisMonth}
                  </StatBadge>
                  <InfoTooltip
                    content='Agendamentos criados neste mês, incluindo visitas, reuniões e apresentações.'
                    direction='up'
                  />
                </StatHeaderRight>
              </StatHeader>
              <StatContent>
                <StatValue>{activityStats.appointmentsThisMonth}</StatValue>
                <StatLabel>Agendamentos Este Mês</StatLabel>
              </StatContent>
              <StatFooter>
                <MdTimer size={14} />
                <span>{activityStats.totalVisits} visitas realizadas</span>
              </StatFooter>
            </StatCard>

            <StatCard onClick={() => navigate('/properties')}>
              <StatHeader>
                <StatIcon $color='#10b981'>
                  <MdHome size={24} />
                </StatIcon>
                <StatHeaderRight>
                  <StatBadge $color='#10b981'>{stats.myMatches}</StatBadge>
                  <InfoTooltip
                    content='Matches pendentes entre clientes e propriedades que precisam de atenção.'
                    direction='up'
                  />
                </StatHeaderRight>
              </StatHeader>
              <StatContent>
                <StatValue>{stats.myMatches}</StatValue>
                <StatLabel>Matches Pendentes</StatLabel>
              </StatContent>
              <StatFooter>
                <MdTrendingUp size={14} />
                <span>
                  {conversionMetrics.matchesAccepted}% taxa de aceitação
                </span>
              </StatFooter>
            </StatCard>
          </StatsGrid>
        </Section>

        {/* Cards de Estatísticas Principais */}
        <StatsGrid>
          {canAccess('property:view') && (
            <StatCard onClick={() => navigate('/properties')}>
              <StatHeader>
                <StatIcon $color='#3b82f6'>
                  <MdHome size={24} />
                </StatIcon>
                <StatHeaderRight>
                  <StatBadge $color='#3b82f6'>{stats.myProperties}</StatBadge>
                  <InfoTooltip
                    content='Total de propriedades que você está responsável por gerenciar, incluindo apartamentos, casas, terrenos e imóveis comerciais.'
                    direction='up'
                  />
                </StatHeaderRight>
              </StatHeader>
              <StatContent>
                <StatValue>{stats.myProperties}</StatValue>
                <StatLabel>Minhas Propriedades</StatLabel>
              </StatContent>
              <StatFooter>
                <MdTrendingUp size={14} />
                <span>{stats.myKeys} chaves em posse</span>
              </StatFooter>
            </StatCard>
          )}

          {canAccess('client:view') && (
            <StatCard onClick={() => navigate('/clients')}>
              <StatHeader>
                <StatIcon $color='#10b981'>
                  <MdPeople size={24} />
                </StatIcon>
                <StatHeaderRight>
                  <StatBadge $color='#10b981'>{stats.myClients}</StatBadge>
                  <InfoTooltip
                    content='Total de clientes que você está atendendo atualmente, incluindo compradores, vendedores e locatários.'
                    direction='up'
                  />
                </StatHeaderRight>
              </StatHeader>
              <StatContent>
                <StatValue>{stats.myClients}</StatValue>
                <StatLabel>Meus Clientes</StatLabel>
              </StatContent>
              <StatFooter>
                <MdCheckCircle size={14} />
                <span>{conversionMetrics.clientsToClosed}% convertidos</span>
              </StatFooter>
            </StatCard>
          )}

          {canAccess('inspection:view') && (
            <StatCard onClick={() => navigate('/inspection')}>
              <StatHeader>
                <StatIcon $color='#f59e0b'>
                  <MdAssignment size={24} />
                </StatIcon>
                <StatHeaderRight>
                  <StatBadge $color='#f59e0b'>{stats.myInspections}</StatBadge>
                  <InfoTooltip
                    content='Vistorias pendentes que você precisa realizar nos imóveis para verificar condições, documentar estado e preparar relatórios.'
                    direction='up'
                  />
                </StatHeaderRight>
              </StatHeader>
              <StatContent>
                <StatValue>{stats.myInspections}</StatValue>
                <StatLabel>Vistorias Pendentes</StatLabel>
              </StatContent>
              <StatFooter>
                <MdPending size={14} />
                <span>{stats.myNotes} anotações ativas</span>
              </StatFooter>
            </StatCard>
          )}

          {canAccess('commission:view') && (
            <StatCard onClick={() => navigate('/financial')}>
              <StatHeader>
                <StatIcon $color='#ec4899'>
                  <MdAttachMoney size={24} />
                </StatIcon>
                <StatHeaderRight>
                  <StatBadge $color='#ec4899'>
                    R$ {stats.myCommissions.toLocaleString('pt-BR')}
                  </StatBadge>
                  <InfoTooltip
                    content='Total de comissões recebidas. Representa seus ganhos com vendas e locações concluídas.'
                    direction='up'
                  />
                </StatHeaderRight>
              </StatHeader>
              <StatContent>
                <StatValue>
                  R${' '}
                  {stats.myCommissions.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </StatValue>
                <StatLabel>Comissões Recebidas</StatLabel>
              </StatContent>
              <StatFooter>
                <MdTrendingUp size={14} />
                <span>
                  {performance.growthPercentage.toFixed(0)}% vs mês anterior
                </span>
              </StatFooter>
            </StatCard>
          )}
        </StatsGrid>

        {/* Metas Mensais */}
        {(monthlyGoals.sales || monthlyGoals.commissions) && (
          <Section>
            <SectionHeader>
              <SectionTitle>
                <MdShowChart size={20} />
                Metas Mensais
              </SectionTitle>
            </SectionHeader>

            <GoalsGrid>
              {monthlyGoals.sales && (
                <GoalCard>
                  <GoalHeader>
                    <GoalIcon $color='#10b981'>
                      <MdAttachMoney size={24} />
                    </GoalIcon>
                    <GoalHeaderRight>
                      <GoalLabel>Vendas</GoalLabel>
                      <InfoTooltip
                        content='Meta de vendas mensais em valores monetários. Inclui vendas de imóveis e outros produtos/serviços.'
                        direction='up'
                      />
                    </GoalHeaderRight>
                  </GoalHeader>
                  <GoalContent>
                    <GoalValue>
                      R$ {monthlyGoals.sales.current.toLocaleString('pt-BR')}
                    </GoalValue>
                    <GoalTarget>
                      Meta: R${' '}
                      {monthlyGoals.sales.target.toLocaleString('pt-BR')}
                    </GoalTarget>
                    <GoalProgress>
                      <ProgressBar
                        $percentage={monthlyGoals.sales.percentage}
                        $color='#10b981'
                      />
                      <ProgressText>
                        {monthlyGoals.sales.percentage}%
                      </ProgressText>
                    </GoalProgress>
                  </GoalContent>
                </GoalCard>
              )}

              {monthlyGoals.commissions && (
                <GoalCard>
                  <GoalHeader>
                    <GoalIcon $color='#3b82f6'>
                      <MdAttachMoney size={24} />
                    </GoalIcon>
                    <GoalHeaderRight>
                      <GoalLabel>Comissões</GoalLabel>
                      <InfoTooltip
                        content='Meta de comissões mensais. Representa o valor que você precisa gerar em comissões para atingir sua meta.'
                        direction='up'
                      />
                    </GoalHeaderRight>
                  </GoalHeader>
                  <GoalContent>
                    <GoalValue>
                      R${' '}
                      {monthlyGoals.commissions.current.toLocaleString(
                        'pt-BR',
                        { minimumFractionDigits: 2 }
                      )}
                    </GoalValue>
                    <GoalTarget>
                      Meta: R${' '}
                      {monthlyGoals.commissions.target.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </GoalTarget>
                    <GoalProgress>
                      <ProgressBar
                        $percentage={monthlyGoals.commissions.percentage}
                        $color='#3b82f6'
                      />
                      <ProgressText>
                        {monthlyGoals.commissions.percentage}%
                      </ProgressText>
                    </GoalProgress>
                  </GoalContent>
                </GoalCard>
              )}
            </GoalsGrid>
          </Section>
        )}

        {/* Métricas de Conversão */}
        <Section>
          <SectionHeader>
            <SectionTitle>
              <MdTrendingUp size={20} />
              Métricas de Conversão
            </SectionTitle>
          </SectionHeader>

          <MetricsGrid>
            <MetricCard>
              <MetricIcon $color='#10b981'>
                <MdHome size={24} />
              </MetricIcon>
              <MetricContent>
                <MetricValue>{conversionMetrics.visitsToSales}%</MetricValue>
                <MetricLabel>Visitas → Vendas</MetricLabel>
              </MetricContent>
              <InfoTooltip
                content='Percentual de visitas a imóveis que resultaram em vendas efetivas. Mede a eficácia das apresentações e negociações.'
                direction='up'
              />
            </MetricCard>

            <MetricCard>
              <MetricIcon $color='#3b82f6'>
                <MdPeople size={24} />
              </MetricIcon>
              <MetricContent>
                <MetricValue>{conversionMetrics.clientsToClosed}%</MetricValue>
                <MetricLabel>Clientes → Fechados</MetricLabel>
              </MetricContent>
              <InfoTooltip
                content='Percentual de clientes que finalizaram negociações (status CLOSED). Indica a eficácia do processo de conversão.'
                direction='up'
              />
            </MetricCard>

            <MetricCard>
              <MetricIcon $color='#f59e0b'>
                <MdCheckCircle size={24} />
              </MetricIcon>
              <MetricContent>
                <MetricValue>{conversionMetrics.matchesAccepted}%</MetricValue>
                <MetricLabel>Matches → Aceitos</MetricLabel>
              </MetricContent>
              <InfoTooltip
                content='Percentual de matches entre clientes e propriedades que foram aceitos. Mede a qualidade das sugestões.'
                direction='up'
              />
            </MetricCard>
          </MetricsGrid>
        </Section>

        <MainGrid>
          {/* Atividades Recentes */}
          <ActivitiesSection>
            <SectionHeader>
              <SectionTitle>
                <MdLocalFireDepartment size={20} />
                Atividades Recentes
              </SectionTitle>
            </SectionHeader>

            {recentActivities.length > 0 ? (
              <ActivitiesList>
                {recentActivities.map(activity => (
                  <ActivityItem key={activity.id}>
                    <ActivityIcon>
                      {getActivityIcon(activity.type)}
                    </ActivityIcon>
                    <ActivityInfo>
                      <ActivityTitle>{activity.title}</ActivityTitle>
                      <ActivityDescription>
                        {formatActivityDescription(activity.description)}
                      </ActivityDescription>
                    </ActivityInfo>
                    <ActivityTime>{activity.time}</ActivityTime>
                  </ActivityItem>
                ))}
              </ActivitiesList>
            ) : (
              <EmptyMessage>Nenhuma atividade recente</EmptyMessage>
            )}
          </ActivitiesSection>

          {/* Próximos Agendamentos */}
          {upcomingAppointments.length > 0 && (
            <AppointmentsSection>
              <SectionHeader>
                <SectionTitle>
                  <MdCalendarToday size={20} />
                  Próximos Agendamentos
                </SectionTitle>
              </SectionHeader>

              <ActivitiesList>
                {upcomingAppointments.map(appointment => (
                  <ActivityItem
                    key={appointment.id}
                    onClick={() => navigate('/calendar')}
                  >
                    <ActivityIcon>
                      <MdCalendarToday />
                    </ActivityIcon>
                    <ActivityInfo>
                      <ActivityTitle>{appointment.title}</ActivityTitle>
                      <ActivityDescription>
                        {appointment.client}
                      </ActivityDescription>
                    </ActivityInfo>
                    <ActivityTime>
                      {appointment.date} às {appointment.time}
                    </ActivityTime>
                  </ActivityItem>
                ))}
              </ActivitiesList>
            </AppointmentsSection>
          )}
        </MainGrid>

        {/* Drawer de Filtros */}
        <UserDashboardFilters
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFilterChange={newFilters => updateFilters(newFilters)}
          onApply={newFilters => {
            updateFilters(newFilters);
            setShowFilters(false);
          }}
        />
      </Container>
    </PageLightBg>
  );
};

export default UserDashboardPage;

// Styled Components para Filtros
const FilterToggleButton = styled.button<{ $hasActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props =>
    props.$hasActive
      ? props.theme.colors.primary
      : props.theme.colors.background};
  border: 2px solid
    ${props =>
      props.$hasActive
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 10px;
  color: ${props => (props.$hasActive ? 'white' : props.theme.colors.text)};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FilterBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(0, 0, 0, 0.2)'};
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
`;
