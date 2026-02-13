import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  PageContainer,
  PageHeader,
  StatsGrid,
  StatCard,
  WidgetsGrid,
  ChartsGrid,
  ChartCard,
  ChartContent,
  ActivityCard,
  ActivityList,
  ActivityItem,
  QuickActions,
} from '../../styles/pages/DashboardPageStyles';

// Animação de shimmer
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Barra de informação (espelha InfoConfiguracao no loading)
const ShimmerInfoBar = styled.div`
  height: 160px;
  margin-bottom: 24px;
  border-radius: 12px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const ShimmerHeaderLeft = styled.div`
  flex: 1;
`;

const ShimmerTitle = styled.div`
  height: 40px;
  width: 300px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    width: 250px;
    height: 32px;
  }

  @media (max-width: 480px) {
    width: 200px;
    height: 28px;
  }
`;

const ShimmerSubtitle = styled.div`
  height: 24px;
  width: 400px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;

  @media (max-width: 768px) {
    width: 300px;
    height: 20px;
  }

  @media (max-width: 480px) {
    width: 250px;
    height: 18px;
  }
`;

const ShimmerButton = styled.div`
  height: 40px;
  width: 120px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 10px;

  @media (max-width: 768px) {
    flex: 1;
    min-width: 100px;
  }
`;

// Blocos de shimmer usados dentro de StatCard do dashboard
const ShimmerStatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const ShimmerStatIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 12px;

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
  }

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
  }
`;

const ShimmerStatTrend = styled.div`
  width: 60px;
  height: 20px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const ShimmerStatValue = styled.div`
  height: 40px;
  width: 120px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  margin: 8px 0;

  @media (max-width: 768px) {
    height: 32px;
    width: 100px;
  }

  @media (max-width: 600px) {
    height: 28px;
    width: 80px;
  }

  @media (max-width: 480px) {
    height: 24px;
    width: 70px;
  }
`;

const ShimmerStatLabel = styled.div`
  height: 16px;
  width: 150px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;

  @media (max-width: 480px) {
    height: 14px;
    width: 120px;
  }
`;

// Card da Meta da Empresa
const ShimmerCompanyGoalCard = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.cardBackground} 0%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 24px;
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

  @media (max-width: 768px) {
    padding: 24px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    margin-bottom: 16px;
  }
`;

const ShimmerGoalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const ShimmerGoalIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 12px;
`;

const ShimmerGoalTitle = styled.div`
  height: 24px;
  width: 200px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 8px;
`;

const ShimmerGoalSubtitle = styled.div`
  height: 16px;
  width: 150px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const ShimmerProgressSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const ShimmerProgressValue = styled.div`
  height: 48px;
  width: 100px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  margin: 0 auto 16px;
`;

const ShimmerProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 6px;
  overflow: hidden;
`;

const ShimmerProgressFill = styled.div`
  width: 65%;
  height: 100%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
`;

const ShimmerStatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ShimmerGoalStatItem = styled.div`
  text-align: center;
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ShimmerGoalStatLabel = styled.div`
  height: 12px;
  width: 60px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin: 0 auto 8px;
`;

const ShimmerGoalStatValue = styled.div`
  height: 18px;
  width: 80px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin: 0 auto;
`;

const ShimmerStatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
`;

const ShimmerStatusBadge = styled.div`
  height: 40px;
  width: 120px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 20px;
`;

const ShimmerDaysLeft = styled.div`
  height: 16px;
  width: 100px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

// Widgets (grid igual ao WidgetsGrid do dashboard: 3 colunas → 2 → 1)
const ShimmerWidgetsGrid = styled.div`
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

const ShimmerWidgetCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  min-height: 200px;

  @media (max-width: 768px) {
    padding: 20px;
    min-height: 180px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    min-height: 160px;
  }
`;

const ShimmerWidgetTitle = styled.div`
  height: 24px;
  width: 200px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 20px;
`;

const ShimmerWidgetContent = styled.div`
  height: 120px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

// Performance Grid (2 colunas: Performance da Equipe + Análise de Negócios, igual ao dashboard)
const ShimmerModernPerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ShimmerModernCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid ${props => props.theme.colors.border};
  min-height: 200px;

  @media (max-width: 768px) {
    padding: 20px;
    min-height: 180px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    min-height: 160px;
  }
`;

const ShimmerModernSalesGoalCard = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.cardBackground} 0%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;
  min-height: 200px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #10b981, #059669);
  }

  @media (max-width: 768px) {
    padding: 24px;
    min-height: 180px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    min-height: 160px;
  }
`;

const ShimmerModernCardHeader = styled.div`
  margin-bottom: 24px;
`;

const ShimmerModernCardIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const ShimmerModernCardTitle = styled.div`
  height: 20px;
  width: 180px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 8px;
`;

const ShimmerModernCardSubtitle = styled.div`
  height: 16px;
  width: 140px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const ShimmerModernProgressValue = styled.div`
  height: 40px;
  width: 80px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  margin: 0 auto 12px;
`;

const ShimmerModernProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const ShimmerModernProgressFill = styled.div`
  width: 65%;
  height: 100%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

const ShimmerModernStatsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
`;

const ShimmerModernStatItem = styled.div`
  text-align: center;
`;

const ShimmerModernStatLabel = styled.div`
  height: 12px;
  width: 50px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin: 0 auto 4px;
`;

const ShimmerModernStatValue = styled.div`
  height: 18px;
  width: 70px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin: 0 auto;
`;

const ShimmerModernStatusBadge = styled.div`
  height: 32px;
  width: 100px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 20px;
  margin: 0 auto;
`;

// Team Stats
const ShimmerTeamStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ShimmerTeamStatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ShimmerTeamStatIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 10px;
  flex-shrink: 0;
`;

const ShimmerTeamStatContent = styled.div`
  flex: 1;
`;

const ShimmerTeamStatValue = styled.div`
  height: 20px;
  width: 60px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 4px;
`;

const ShimmerTeamStatLabel = styled.div`
  height: 14px;
  width: 80px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

// Business Metrics
const ShimmerBusinessMetrics = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ShimmerBusinessMetric = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ShimmerBusinessMetricLabel = styled.div`
  height: 14px;
  width: 100px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const ShimmerBusinessMetricValue = styled.div`
  height: 24px;
  width: 120px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
`;

// Placeholders de gráficos (usados dentro de ChartCard/ChartContent do dashboard)
const ShimmerChartTitle = styled.div`
  height: 24px;
  width: 200px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const ShimmerChart = styled.div`
  height: 280px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  flex: 1;

  @media (max-width: 768px) {
    height: 250px;
  }

  @media (max-width: 480px) {
    height: 220px;
  }
`;

// Placeholders de atividades (ActivityCard/ActivityList/ActivityItem vêm do dashboard)
const ShimmerActivityTitle = styled.div`
  height: 24px;
  width: 200px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 20px;
`;

const ShimmerActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
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

const ShimmerActivityContent = styled.div`
  flex: 1;
`;

const ShimmerActivityItemTitle = styled.div`
  height: 16px;
  width: 200px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;

  @media (max-width: 480px) {
    height: 14px;
    width: 150px;
  }
`;

const ShimmerActivityDescription = styled.div`
  height: 12px;
  width: 250px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 4px;

  @media (max-width: 480px) {
    height: 10px;
    width: 200px;
  }
`;

const ShimmerActivityTime = styled.div`
  height: 12px;
  width: 100px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;

  @media (max-width: 480px) {
    height: 10px;
    width: 80px;
  }
`;

interface AdminDashboardShimmerProps {
  showCompanyGoal?: boolean;
  showWidgets?: boolean;
  showModernPerformance?: boolean;
  showCharts?: boolean;
  showActivities?: boolean;
}

const AdminDashboardShimmer: React.FC<AdminDashboardShimmerProps> = ({
  showCompanyGoal = false,
  showWidgets = true,
  showModernPerformance = true,
  showCharts = true,
  showActivities = true,
}) => {
  return (
    <PageContainer>
      {/* Header (igual ao dashboard: título, subtítulo, Filtros + Configurar) */}
      <PageHeader>
        <ShimmerHeaderLeft>
          <ShimmerTitle />
          <ShimmerSubtitle />
        </ShimmerHeaderLeft>
        <QuickActions>
          <ShimmerButton />
          <ShimmerButton />
        </QuickActions>
      </PageHeader>

      {/* Informação sobre Configuração (espelha InfoConfiguracao) */}
      <ShimmerInfoBar />

      {/* Cards de Estatísticas (10 cards como no dashboard) */}
      <StatsGrid>
        {Array.from({ length: 10 }).map((_, index) => (
          <StatCard key={index}>
            <ShimmerStatHeader>
              <ShimmerStatIcon />
              <ShimmerStatTrend />
            </ShimmerStatHeader>
            <ShimmerStatValue />
            <ShimmerStatLabel />
          </StatCard>
        ))}
      </StatsGrid>

      {/* Card da Meta da Empresa (opcional, para visão proprietário) */}
      {showCompanyGoal && (
        <ShimmerCompanyGoalCard>
          <ShimmerGoalHeader>
            <ShimmerGoalIcon />
            <div>
              <ShimmerGoalTitle />
              <ShimmerGoalSubtitle />
            </div>
          </ShimmerGoalHeader>

          <ShimmerProgressSection>
            <ShimmerProgressValue />
            <ShimmerProgressBar>
              <ShimmerProgressFill />
            </ShimmerProgressBar>
          </ShimmerProgressSection>

          <ShimmerStatsRow>
            <ShimmerGoalStatItem>
              <ShimmerGoalStatLabel />
              <ShimmerGoalStatValue />
            </ShimmerGoalStatItem>
            <ShimmerGoalStatItem>
              <ShimmerGoalStatLabel />
              <ShimmerGoalStatValue />
            </ShimmerGoalStatItem>
            <ShimmerGoalStatItem>
              <ShimmerGoalStatLabel />
              <ShimmerGoalStatValue />
            </ShimmerGoalStatItem>
          </ShimmerStatsRow>

          <ShimmerStatusRow>
            <ShimmerStatusBadge />
            <ShimmerDaysLeft />
          </ShimmerStatusRow>
        </ShimmerCompanyGoalCard>
      )}

      {/* Widgets (3: Top Performers, Tarefas Urgentes, Leads Recentes) */}
      {showWidgets && (
        <WidgetsGrid>
          {Array.from({ length: 3 }).map((_, index) => (
            <ShimmerWidgetCard key={index}>
              <ShimmerWidgetTitle />
              <ShimmerWidgetContent />
            </ShimmerWidgetCard>
          ))}
        </WidgetsGrid>
      )}

      {/* Performance: 2 colunas (Performance da Equipe + Análise de Negócios) */}
      {showModernPerformance && (
        <ShimmerModernPerformanceGrid>
          <ShimmerModernCard>
            <ShimmerModernCardHeader>
              <ShimmerModernCardIcon />
              <ShimmerModernCardTitle />
              <ShimmerModernCardSubtitle />
            </ShimmerModernCardHeader>

            <ShimmerTeamStats>
              <ShimmerTeamStatItem>
                <ShimmerTeamStatIcon />
                <ShimmerTeamStatContent>
                  <ShimmerTeamStatValue />
                  <ShimmerTeamStatLabel />
                </ShimmerTeamStatContent>
              </ShimmerTeamStatItem>
              <ShimmerTeamStatItem>
                <ShimmerTeamStatIcon />
                <ShimmerTeamStatContent>
                  <ShimmerTeamStatValue />
                  <ShimmerTeamStatLabel />
                </ShimmerTeamStatContent>
              </ShimmerTeamStatItem>
              <ShimmerTeamStatItem>
                <ShimmerTeamStatIcon />
                <ShimmerTeamStatContent>
                  <ShimmerTeamStatValue />
                  <ShimmerTeamStatLabel />
                </ShimmerTeamStatContent>
              </ShimmerTeamStatItem>
            </ShimmerTeamStats>
          </ShimmerModernCard>

          <ShimmerModernCard>
            <ShimmerModernCardHeader>
              <ShimmerModernCardIcon />
              <ShimmerModernCardTitle />
              <ShimmerModernCardSubtitle />
            </ShimmerModernCardHeader>

            <ShimmerBusinessMetrics>
              <ShimmerBusinessMetric>
                <ShimmerBusinessMetricLabel />
                <ShimmerBusinessMetricValue />
              </ShimmerBusinessMetric>
              <ShimmerBusinessMetric>
                <ShimmerBusinessMetricLabel />
                <ShimmerBusinessMetricValue />
              </ShimmerBusinessMetric>
              <ShimmerBusinessMetric>
                <ShimmerBusinessMetricLabel />
                <ShimmerBusinessMetricValue />
              </ShimmerBusinessMetric>
            </ShimmerBusinessMetrics>
          </ShimmerModernCard>
        </ShimmerModernPerformanceGrid>
      )}

      {/* Gráficos (4: Vendas, Tipos, Região, Origem) */}
      {showCharts && (
        <ChartsGrid>
          {Array.from({ length: 4 }).map((_, index) => (
            <ChartCard key={index}>
              <ShimmerChartTitle />
              <ChartContent>
                <ShimmerChart />
              </ChartContent>
            </ChartCard>
          ))}
        </ChartsGrid>
      )}

      {/* Feed de Atividades Recentes */}
      {showActivities && (
        <ActivityCard>
          <ShimmerActivityTitle />
          <ActivityList>
            {Array.from({ length: 4 }).map((_, index) => (
              <ActivityItem key={index}>
                <ShimmerActivityIcon />
                <ShimmerActivityContent>
                  <ShimmerActivityItemTitle />
                  <ShimmerActivityDescription />
                  <ShimmerActivityTime />
                </ShimmerActivityContent>
              </ActivityItem>
            ))}
          </ActivityList>
        </ActivityCard>
      )}
    </PageContainer>
  );
};

export default AdminDashboardShimmer;
