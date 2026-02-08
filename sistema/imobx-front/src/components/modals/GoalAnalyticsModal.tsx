import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MdClose, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import type { GoalAnalytics } from '../../types/goal';
import { useGoals } from '../../hooks/useGoals';

interface GoalAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: string;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(0, 0, 0, 0.85)'
      : 'rgba(0, 0, 0, 0.75)'};
  backdrop-filter: blur(16px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 40px 24px;
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes fadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(16px);
    }
  }
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 28px;
  width: 100%;
  max-width: 1000px;
  max-height: 85vh;
  overflow: hidden;
  box-shadow:
    0 50px 100px -20px rgba(0, 0, 0, 0.6),
    0 0 0 1px ${props => props.theme.colors.border}40,
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  animation: modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.primary}80,
      ${props => props.theme.colors.primary}
    );
    border-radius: 28px 28px 0 0;
  }

  @keyframes modalSlideIn {
    from {
      transform: translateY(60px) scale(0.9);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  padding: 40px 40px 32px 40px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.cardBackground},
    ${props => props.theme.colors.backgroundSecondary}
  );
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 40px;
    right: 40px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.border},
      transparent
    );
  }
`;

const HeaderContent = styled.div``;

const ModalTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '📊';
    font-size: 32px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
`;

const ProgressText = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: 500;
  opacity: 0.8;
`;

const CloseButton = styled.button`
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
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 20px;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: rotate(90deg);
  }
`;

const ModalBody = styled.div`
  padding: 40px;
  overflow-y: auto;
  max-height: calc(85vh - 200px);

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

const InsightsCard = styled.div`
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
`;

const InsightsTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 12px 0;
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
  font-size: 14px;
  padding: 8px 0;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
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
  border-radius: 12px;
  padding: 20px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatValue = styled.div<{ $variant?: 'success' | 'danger' }>`
  font-size: 24px;
  font-weight: 700;
  color: ${props => {
    if (props.$variant === 'success') return '#10B981';
    if (props.$variant === 'danger') return '#EF4444';
    return props.theme.colors.text;
  }};
`;

const StatSubtext = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
`;

const HistorySection = styled.div`
  margin-top: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
`;

const HistoryList = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  max-height: 300px;
  overflow-y: auto;
`;

const HistoryItem = styled.div`
  padding: 16px 20px;
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
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const HistoryValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const HistoryProgress = styled.span`
  font-size: 13px;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
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

export const GoalAnalyticsModal: React.FC<GoalAnalyticsModalProps> = ({
  isOpen,
  onClose,
  goalId,
}) => {
  const [analytics, setAnalytics] = useState<GoalAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const { getGoalAnalytics } = useGoals();

  const loadAnalytics = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGoalAnalytics(goalId);
      setAnalytics(data);
    } catch (error) {
      console.error('Erro ao carregar análise:', error);
    } finally {
      setLoading(false);
    }
  }, [getGoalAnalytics, goalId]);

  useEffect(() => {
    if (isOpen && goalId) {
      loadAnalytics();
    }
  }, [isOpen, goalId, loadAnalytics]);

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

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <ModalTitle>Análise Detalhada</ModalTitle>
            {analytics && (
              <ProgressText>
                Progresso: {analytics.currentProgress.toFixed(1)}%
              </ProgressText>
            )}
          </HeaderContent>
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <LoadingContainer>
              <Spinner />
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
              {analytics.history && analytics.history.length > 0 && (
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
              )}
            </>
          ) : (
            <LoadingContainer>
              <p>Nenhum dado disponível</p>
            </LoadingContainer>
          )}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};
