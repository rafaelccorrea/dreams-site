import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MdArrowBack, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import type { GoalAnalytics } from '../types/goal';
import { useGoals } from '../hooks/useGoals';
import { Layout } from '../components/layout/Layout';
import ConnectionError from '../components/common/ConnectionError';
import {
  PageContainer,
  PageHeader,
  HeaderTitle,
  HeaderSubtitle,
} from './styles/GoalsPage.styles';

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 20px;
  }
`;

const ProgressText = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 8px 0 0 0;
  font-weight: 500;
  opacity: 0.8;
`;

const ContentCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  padding: 40px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const InsightsCard = styled.div`
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  color: white;
`;

const InsightsTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InsightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InsightItem = styled.li`
  font-size: 15px;
  padding: 10px 0;
  line-height: 1.6;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div<{ $variant?: 'success' | 'danger' | 'default' }>`
  background: ${props => {
    if (props.$variant === 'success') return '#10B98115';
    if (props.$variant === 'danger') return '#EF444415';
    return props.theme.colors.background;
  }};
  border: 1px solid
    ${props => {
      if (props.$variant === 'success') return '#10B98130';
      if (props.$variant === 'danger') return '#EF444430';
      return props.theme.colors.border;
    }};
  border-radius: 16px;
  padding: 24px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
`;

const StatValue = styled.div<{ $variant?: 'success' | 'danger' }>`
  font-size: 28px;
  font-weight: 700;
  color: ${props => {
    if (props.$variant === 'success') return '#10B981';
    if (props.$variant === 'danger') return '#EF4444';
    return props.theme.colors.text;
  }};
`;

const StatSubtext = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 8px;
`;

const HistorySection = styled.div`
  margin-top: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HistoryList = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  max-height: 500px;
  overflow-y: auto;

  /* Scrollbar personalizada */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const HistoryItem = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  &:hover {
    background: ${props => props.theme.colors.surface};
  }
`;

const HistoryDate = styled.span`
  font-size: 15px;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const HistoryValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const HistoryProgress = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  margin-left: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
  flex-direction: column;
  gap: 16px;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 16px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  text-align: center;
`;

const EmptyText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 16px;
  margin: 0;
`;

const GoalAnalyticsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<GoalAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getGoalAnalytics } = useGoals();

  const loadAnalytics = React.useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getGoalAnalytics(id);
      setAnalytics(data);
    } catch (err: any) {
      console.error('Erro ao carregar análise:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Erro ao carregar análise da meta'
      );
    } finally {
      setLoading(false);
    }
  }, [getGoalAnalytics, id]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (error) {
    return (
      <Layout>
        <PageContainer>
          <ConnectionError error={error} onRetry={loadAnalytics} />
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <HeaderContent>
            <BackButton onClick={() => navigate('/goals')}>
              <MdArrowBack />
            </BackButton>
            <div>
              <HeaderTitle>Análise Detalhada</HeaderTitle>
              {analytics && (
                <ProgressText>
                  Progresso: {analytics.currentProgress.toFixed(1)}%
                </ProgressText>
              )}
            </div>
          </HeaderContent>
        </PageHeader>

        <ContentCard>
          {loading ? (
            <LoadingContainer>
              <Spinner />
              <LoadingText>Carregando análise...</LoadingText>
            </LoadingContainer>
          ) : analytics ? (
            <>
              {/* Insights */}
              {analytics.insights && analytics.insights.length > 0 && (
                <InsightsCard>
                  <InsightsTitle>💡 Insights</InsightsTitle>
                  <InsightsList>
                    {analytics.insights.map((insight, index) => (
                      <InsightItem key={index}>{insight}</InsightItem>
                    ))}
                  </InsightsList>
                </InsightsCard>
              )}

              {/* Estatísticas */}
              <StatsGrid>
                <StatCard>
                  <StatLabel>Média Diária</StatLabel>
                  <StatValue>
                    {formatCurrency(analytics.averageDailyProgress)}
                  </StatValue>
                  <StatSubtext>progresso por dia</StatSubtext>
                </StatCard>

                {analytics.projectedCompletion && (
                  <StatCard $variant='success'>
                    <StatLabel>Projeção</StatLabel>
                    <StatValue $variant='success'>
                      {formatDate(analytics.projectedCompletion)}
                    </StatValue>
                    <StatSubtext>conclusão estimada</StatSubtext>
                  </StatCard>
                )}

                {analytics.bestDay && (
                  <StatCard $variant='success'>
                    <StatLabel>
                      <MdTrendingUp /> Melhor Dia
                    </StatLabel>
                    <StatValue $variant='success'>
                      {formatCurrency(analytics.bestDay.value)}
                    </StatValue>
                    <StatSubtext>
                      {formatDate(analytics.bestDay.date)}
                    </StatSubtext>
                  </StatCard>
                )}

                {analytics.worstDay && (
                  <StatCard $variant='danger'>
                    <StatLabel>
                      <MdTrendingDown /> Pior Dia
                    </StatLabel>
                    <StatValue $variant='danger'>
                      {formatCurrency(analytics.worstDay.value)}
                    </StatValue>
                    <StatSubtext>
                      {formatDate(analytics.worstDay.date)}
                    </StatSubtext>
                  </StatCard>
                )}
              </StatsGrid>

              {/* Histórico */}
              {analytics.history && analytics.history.length > 0 ? (
                <HistorySection>
                  <SectionTitle>📈 Evolução</SectionTitle>
                  <HistoryList>
                    {analytics.history.map((item, index) => (
                      <HistoryItem key={index}>
                        <HistoryDate>{formatDate(item.date)}</HistoryDate>
                        <div
                          style={{
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'center',
                          }}
                        >
                          <HistoryValue>
                            {formatCurrency(item.value)}
                          </HistoryValue>
                          <HistoryProgress>
                            {item.progress.toFixed(1)}%
                          </HistoryProgress>
                        </div>
                      </HistoryItem>
                    ))}
                  </HistoryList>
                </HistorySection>
              ) : (
                <EmptyState>
                  <EmptyText>Nenhum histórico de evolução disponível</EmptyText>
                </EmptyState>
              )}
            </>
          ) : (
            <LoadingContainer>
              <EmptyText>Nenhum dado disponível</EmptyText>
            </LoadingContainer>
          )}
        </ContentCard>
      </PageContainer>
    </Layout>
  );
};

export default GoalAnalyticsPage;
