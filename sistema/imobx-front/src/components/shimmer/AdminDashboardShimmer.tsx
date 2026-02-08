import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animação de shimmer
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Container principal
const ShimmerContainer = styled.div`
  padding: 16px 24px;
  width: 100%;
  min-height: calc(100vh - 100px);
  background: ${props => props.theme.colors.background};

  @media (max-width: 768px) {
    padding: 12px 16px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
  }
`;

// Header
const ShimmerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
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

const ShimmerHeaderRight = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
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

// Grid de estatísticas
const ShimmerStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;

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

const ShimmerStatCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
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
`;

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

// Widgets
const ShimmerWidgetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
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

// Performance Grid Moderna
const ShimmerModernPerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

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

// Gráficos
const ShimmerChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 32px;
  margin-bottom: 50px;

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

const ShimmerChartCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
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

// Feed de Atividades
const ShimmerActivityCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

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

const ShimmerActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ShimmerActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.borderLight};

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
  showCompanyGoal = true,
  showWidgets = true,
  showModernPerformance = true,
  showCharts = true,
  showActivities = true,
}) => {
  return (
    <ShimmerContainer>
      {/* Header */}
      <ShimmerHeader>
        <ShimmerHeaderLeft>
          <ShimmerTitle />
          <ShimmerSubtitle />
        </ShimmerHeaderLeft>
        <ShimmerHeaderRight>
          <ShimmerButton />
          <ShimmerButton />
        </ShimmerHeaderRight>
      </ShimmerHeader>

      {/* Cards de Estatísticas */}
      <ShimmerStatsGrid>
        {Array.from({ length: 7 }).map((_, index) => (
          <ShimmerStatCard key={index}>
            <ShimmerStatHeader>
              <ShimmerStatIcon />
              <ShimmerStatTrend />
            </ShimmerStatHeader>
            <ShimmerStatValue />
            <ShimmerStatLabel />
          </ShimmerStatCard>
        ))}
      </ShimmerStatsGrid>

      {/* Card da Meta da Empresa */}
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

      {/* Widgets */}
      {showWidgets && (
        <ShimmerWidgetsGrid>
          {Array.from({ length: 3 }).map((_, index) => (
            <ShimmerWidgetCard key={index}>
              <ShimmerWidgetTitle />
              <ShimmerWidgetContent />
            </ShimmerWidgetCard>
          ))}
        </ShimmerWidgetsGrid>
      )}

      {/* Performance Grid Moderna */}
      {showModernPerformance && (
        <ShimmerModernPerformanceGrid>
          {/* Meta Mensal de Vendas */}
          <ShimmerModernSalesGoalCard>
            <ShimmerModernCardHeader>
              <ShimmerModernCardIcon />
              <ShimmerModernCardTitle />
              <ShimmerModernCardSubtitle />
            </ShimmerModernCardHeader>

            <ShimmerModernProgressValue />
            <ShimmerModernProgressBar>
              <ShimmerModernProgressFill />
            </ShimmerModernProgressBar>

            <ShimmerModernStatsRow>
              <ShimmerModernStatItem>
                <ShimmerModernStatLabel />
                <ShimmerModernStatValue />
              </ShimmerModernStatItem>
              <ShimmerModernStatItem>
                <ShimmerModernStatLabel />
                <ShimmerModernStatValue />
              </ShimmerModernStatItem>
            </ShimmerModernStatsRow>

            <ShimmerModernStatusBadge />
          </ShimmerModernSalesGoalCard>

          {/* Performance da Equipe */}
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

          {/* Análise de Negócios */}
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

      {/* Gráficos */}
      {showCharts && (
        <ShimmerChartsGrid>
          {Array.from({ length: 4 }).map((_, index) => (
            <ShimmerChartCard key={index}>
              <ShimmerChartTitle />
              <ShimmerChart />
            </ShimmerChartCard>
          ))}
        </ShimmerChartsGrid>
      )}

      {/* Feed de Atividades */}
      {showActivities && (
        <ShimmerActivityCard>
          <ShimmerActivityTitle />
          <ShimmerActivityList>
            {Array.from({ length: 4 }).map((_, index) => (
              <ShimmerActivityItem key={index}>
                <ShimmerActivityIcon />
                <ShimmerActivityContent>
                  <ShimmerActivityItemTitle />
                  <ShimmerActivityDescription />
                  <ShimmerActivityTime />
                </ShimmerActivityContent>
              </ShimmerActivityItem>
            ))}
          </ShimmerActivityList>
        </ShimmerActivityCard>
      )}
    </ShimmerContainer>
  );
};

export default AdminDashboardShimmer;
