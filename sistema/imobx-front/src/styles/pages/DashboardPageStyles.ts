import styled from 'styled-components';

// Layout Components
export const PageContainer = styled.div`
  padding: 16px 24px;
  width: 100%;
  min-height: calc(100vh - 100px);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => (props.theme.mode === 'light' ? '#6B7280' : '#FFFFFF')};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const PageSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-size: 1rem;

  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

// Stats Grid
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }
`;

export const StatCard = styled.div`
  background: ${props =>
    props.theme.mode === 'light' ? '#fff' : props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  position: relative;
  z-index: 0;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 20px 16px;
    min-height: 120px;
  }

  @media (max-width: 600px) {
    padding: 18px 14px;
    min-height: 110px;
  }

  @media (max-width: 480px) {
    padding: 16px 12px;
    min-height: 100px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

export const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StatIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    font-size: 1.25rem;
  }

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    font-size: 1.125rem;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
`;

export const StatTrend = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props =>
    props.$positive ? props.theme.colors.success : props.theme.colors.error};
  margin-top: 4px;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }

  @media (max-width: 600px) {
    font-size: 0.65rem;
  }

  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`;

export const StatValue = styled.div`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1.2;
  margin: 8px 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 600px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 600px) {
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

// Charts Grid
export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 32px;
  margin-bottom: 50px;
  position: relative;
  z-index: 1;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 24px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 40px;
  }

  @media (max-width: 480px) {
    gap: 16px;
    margin-bottom: 30px;
  }
`;

export const ChartCard = styled.div`
  background: ${props =>
    props.theme.mode === 'light' ? '#fff' : props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  z-index: 1;
  min-height: 400px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 24px;
    min-height: 350px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 12px;
    min-height: 320px;
  }
`;

export const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 1.125rem;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 16px;
  }
`;

export const ChartContent = styled.div`
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  flex: 1;

  @media (max-width: 768px) {
    height: 250px;
  }

  @media (max-width: 480px) {
    height: 220px;
    font-size: 0.75rem;
  }
`;

// Activity Feed
export const ActivityCard = styled.div`
  background: ${props =>
    props.theme.mode === 'light' ? '#fff' : props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

export const ActivityTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${props =>
    props.theme.mode === 'light'
      ? '#f8fafc'
      : props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.borderLight};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }

  @media (max-width: 768px) {
    padding: 12px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    gap: 10px;
    border-radius: 8px;
  }
`;

export const ActivityIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    border-radius: 6px;
  }
`;

export const ActivityContent = styled.div`
  flex: 1;
`;

export const ActivityItemTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

export const ActivityDescription = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2px;

  @media (max-width: 480px) {
    font-size: 0.625rem;
  }
`;

export const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 480px) {
    font-size: 0.625rem;
  }
`;

// Metric Components
export const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
`;

export const MetricValue = styled.div<{ color?: string }>`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.color || props.theme.colors.text};
`;

// Loading States
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: ${props => props.theme.colors.textSecondary};
`;

// Empty States
export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.6;
`;

export const EmptyStateTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

export const EmptyStateDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

// Responsive adjustments
export const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Quick Actions
export const QuickActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const FilterButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${({ theme }) =>
    theme.mode === 'light' ? '#fff' : theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}10`};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }

  svg {
    flex-shrink: 0;
  }
`;

export const FilterBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
`;

export const QuickActionButton = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: ${props => props.theme.colors.primary};
  color: white;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 0.75rem;
  }
`;

// Performance Metrics Container
export const PerformanceMetricsContainer = styled.div`
  padding: 20px;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const PerformanceMetricItem = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

// Modern Performance Grid
export const ModernPerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// Modern Sales Goal Card (Principal)
export const ModernSalesGoalCard = styled.div`
  background: ${props =>
    props.theme.mode === 'light'
      ? '#fff'
      : `linear-gradient(135deg, ${props.theme.colors.cardBackground} 0%, ${props.theme.colors.backgroundSecondary} 100%)`};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #10b981, #059669);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
  }
`;

// Modern Team Card
export const ModernTeamCard = styled.div`
  background: ${props =>
    props.theme.mode === 'light' ? '#fff' : props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
  }
`;

// Modern Business Card
export const ModernBusinessCard = styled.div`
  background: ${props =>
    props.theme.mode === 'light' ? '#fff' : props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
  }
`;

// Modern Card Header
export const ModernCardHeader = styled.div`
  margin-bottom: 24px;
`;

export const ModernCardIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => `${props.$color}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: ${props => props.$color};
  font-size: 24px;
`;

export const ModernCardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
  line-height: 1.3;
`;

export const ModernCardSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.4;
`;

// Modern Card Content
export const ModernCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Progress Section
export const ModernProgressSection = styled.div`
  text-align: center;
`;

export const ModernProgressValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
  background: linear-gradient(135deg, #10b981, #059669);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const ModernProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${props =>
    props.theme.mode === 'light'
      ? '#f1f5f9'
      : props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

export const ModernProgressFill = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 8px;
  transition: width 0.8s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

// Stats Row
export const ModernStatsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const ModernStatItem = styled.div`
  text-align: center;
`;

export const ModernStatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ModernStatValue = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

// Status Badge
export const ModernStatusBadge = styled.div<{ $status: 'success' | 'warning' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props =>
    props.$status === 'success' ? '#10B98120' : '#F59E0B20'};
  color: ${props => (props.$status === 'success' ? '#10B981' : '#F59E0B')};
  border: 1px solid
    ${props => (props.$status === 'success' ? '#10B98140' : '#F59E0B40')};
  align-self: center;
`;

// Team Stats
export const ModernTeamStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ModernTeamStatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ModernTeamStatIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => `${props.$color}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
  font-size: 20px;
  flex-shrink: 0;
`;

export const ModernTeamStatContent = styled.div`
  flex: 1;
`;

export const ModernTeamStatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1.2;
`;

export const ModernTeamStatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.3;
`;

// Business Metrics
export const ModernBusinessMetrics = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ModernBusinessMetric = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: ${props =>
    props.theme.mode === 'light'
      ? '#f8fafc'
      : props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const ModernBusinessMetricLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const ModernBusinessMetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1.2;
`;

export const ModernBusinessMetricTrend = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => (props.$positive ? '#10B981' : '#EF4444')};
`;

// Estilos para o Card da Meta da Empresa
export const CompanyGoalCard = styled.div`
  background: ${props =>
    props.theme.mode === 'light'
      ? '#fff'
      : `linear-gradient(135deg, ${props.theme.colors.cardBackground} 0%, ${props.theme.colors.backgroundSecondary} 100%)`};
  border-radius: 20px;
  padding: 32px;
  box-shadow:
    0 20px 40px -12px rgba(0, 0, 0, 0.15),
    0 0 0 1px ${props => props.theme.colors.border};
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.primary}80,
      ${props => props.theme.colors.primary}
    );
  }
`;

export const GoalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

export const GoalIcon = styled.div`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
`;

export const GoalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

export const GoalSubtitle = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const GoalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ProgressSection = styled.div`
  text-align: center;
`;

export const ProgressValue = styled.div`
  font-size: 48px;
  font-weight: 800;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${props =>
    props.theme.mode === 'light'
      ? '#f1f5f9'
      : props.theme.colors.backgroundSecondary};
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`;

export const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 6px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const GoalStatItem = styled.div`
  text-align: center;
  padding: 16px;
  background: ${props =>
    props.theme.mode === 'light' ? '#f8fafc' : props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const GoalStatLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

export const GoalStatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

export const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
`;

export const StatusBadge = styled.div<{ $status: 'success' | 'warning' }>`
  background: ${props =>
    props.$status === 'success'
      ? 'linear-gradient(135deg, #10B981, #059669)'
      : 'linear-gradient(135deg, #F59E0B, #D97706)'};
  color: white;
  padding: 12px 24px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const DaysLeft = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

// Grid de Widgets responsivo
export const WidgetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 16px;
  }
`;
