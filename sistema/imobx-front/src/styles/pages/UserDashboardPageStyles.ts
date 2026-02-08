import styled from 'styled-components';

// Container principal
export const Container = styled.div`
  padding: 0;
  padding-top: 0;
  margin: 0;
  width: 100%;

  /* Padding apenas nas laterais e inferior */
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;

  @media (max-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 1rem;
  }
`;

// Loading, Error e Empty States
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 20px;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 20px;
  text-align: center;
`;

export const ErrorIcon = styled.div`
  font-size: 3rem;
`;

export const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

export const ErrorMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const RetryButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 20px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
`;

export const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

export const EmptyMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

// Layout Principal
export const WelcomeSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}15,
    ${props => props.theme.colors.secondary}15
  );
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 12px;
  }
`;

export const WelcomeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const WelcomeSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
  }
`;

export const WelcomeDate = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: right;

  @media (max-width: 768px) {
    text-align: left;
    font-size: 0.9375rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

// Performance Card
export const PerformanceCard = styled.div`
  background: ${props =>
    props.theme.mode === 'light' ? '#fff' : props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
`;

export const PerformanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 0.75rem;
    gap: 0.75rem;
  }
`;

export const PerformanceTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 1.125rem;
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const RankingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    padding: 0.35rem 0.7rem;
    font-size: 0.75rem;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const PerformanceContent = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

export const PerformanceMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

export const PerformanceValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const PerformanceComparison = styled.div<{ $isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => (props.$isPositive ? '#10b981' : '#ef4444')};
  font-size: 1rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export const PerformanceChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

export const ChartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

export const ChartLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  min-width: 80px;

  @media (max-width: 768px) {
    min-width: 70px;
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    min-width: 60px;
    font-size: 0.75rem;
    width: 100%;
  }
`;

export const ChartBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;

  @media (max-width: 480px) {
    width: 100%;
    gap: 0.4rem;
  }
`;

export const ChartBar = styled.div<{ $percentage: number; $color: string }>`
  height: 8px;
  background: ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  flex: 1;

  @media (max-width: 480px) {
    height: 6px;
  }

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => Math.min(props.$percentage, 100)}%;
    background: ${props => props.$color};
    transition: width 0.3s ease;
  }
`;

export const ChartValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  min-width: 40px;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
    min-width: 35px;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    min-width: 30px;
  }
`;

// Conquistas
export const AchievementsSection = styled.div`
  margin-bottom: 2rem;
`;

export const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

export const AchievementCard = styled.div<{ $color: string }>`
  background: ${props =>
    props.theme.mode === 'light' ? '#fff' : props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid ${props => props.$color};
`;

export const AchievementIcon = styled.div`
  font-size: 2rem;
`;

export const AchievementInfo = styled.div`
  flex: 1;
`;

export const AchievementTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

export const AchievementDescription = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

export const AchievementDate = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

// Seções
export const Section = styled.div`
  margin-bottom: 2rem;
`;

export const SectionHeader = styled.div`
  margin-bottom: 1rem;
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Seção de Atividades Recentes - Fullwidth no desktop
export const ActivitiesSection = styled(Section)`
  @media (min-width: 769px) {
    grid-column: 1 / -1;
  }
`;

// Seção de Próximos Agendamentos - Fullwidth no desktop
export const AppointmentsSection = styled(Section)`
  @media (min-width: 769px) {
    grid-column: 1 / -1;
  }
`;

// Stats Grid
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const StatCard = styled.div`
  background: ${props =>
    props.theme.mode === 'light' ? '#fff' : props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

export const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const StatHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => `${props.$color}20`};
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StatBadge = styled.div<{ $color: string }>`
  background: ${props => props.$color};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const StatContent = styled.div`
  margin-bottom: 1rem;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const StatFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

// Goals
export const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

export const GoalCard = styled.div<{ $isMain?: boolean }>`
  background: ${props =>
    props.theme.mode === 'light' ? '#fff' : props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  ${props =>
    props.$isMain &&
    `
    border-left: 4px solid ${props.theme.colors.primary};
  `}
`;

export const GoalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const GoalHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const GoalIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => `${props.$color}20`};
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const GoalLabel = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const GoalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const GoalValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

export const GoalTarget = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const GoalProgress = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ProgressBar = styled.div<{ $percentage: number; $color: string }>`
  height: 8px;
  background: ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => Math.min(props.$percentage, 100)}%;
    background: ${props => props.$color};
    transition: width 0.3s ease;
  }
`;

export const ProgressText = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

// Metrics
export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

export const MetricCard = styled.div`
  background: ${props =>
    props.theme.mode === 'light' ? '#fff' : props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const MetricIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => `${props.$color}20`};
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MetricContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

export const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

// Activities
export const ActivitiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props =>
    props.theme.mode === 'light'
      ? '#f8fafc'
      : props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

export const ActivityIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${props => props.theme.colors.primary}15;
  border-radius: 8px;
  color: ${props => props.theme.colors.primary};
`;

export const ActivityInfo = styled.div`
  flex: 1;
`;

export const ActivityTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2px;
`;

export const ActivityDescription = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;
