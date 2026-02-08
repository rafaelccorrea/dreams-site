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

// Componentes base do shimmer
const ShimmerContainer = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;
`;

const ShimmerHeader = styled.div`
  margin-bottom: 32px;
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
`;

const ShimmerSubtitle = styled.div`
  height: 24px;
  width: 250px;
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

const ShimmerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const ShimmerExtendedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const ShimmerCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ShimmerCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ShimmerIcon = styled.div`
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

const ShimmerTrend = styled.div`
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

const ShimmerValue = styled.div`
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
  margin-bottom: 8px;
`;

const ShimmerLabel = styled.div`
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

const ShimmerChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ShimmerExtendedChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ShimmerChartCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  margin-bottom: 20px;
`;

const ShimmerChart = styled.div`
  height: 300px;
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

const ShimmerActivityCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ShimmerActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
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
`;

const ShimmerActivityContent = styled.div`
  flex: 1;
`;

const ShimmerActivityTitle = styled.div`
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
`;

const ShimmerActivityTime = styled.div`
  height: 14px;
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

const ShimmerMetricsCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ShimmerMetricItem = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ShimmerMetricLabel = styled.div`
  height: 14px;
  width: 120px;
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

const ShimmerMetricValue = styled.div`
  height: 24px;
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
`;

interface DashboardShimmerProps {
  userRole?: string;
}

const DashboardShimmer: React.FC<DashboardShimmerProps> = ({
  userRole = 'user',
}) => {
  const isAdminOrMaster = userRole === 'admin' || userRole === 'master';

  return (
    <ShimmerContainer>
      <ShimmerHeader>
        <ShimmerTitle />
        <ShimmerSubtitle />
      </ShimmerHeader>

      {/* Cards de Estatísticas */}
      <ShimmerGrid>
        {Array.from({ length: 4 }).map((_, index) => (
          <ShimmerCard key={index}>
            <ShimmerCardHeader>
              <ShimmerIcon />
              <ShimmerTrend />
            </ShimmerCardHeader>
            <ShimmerValue />
            <ShimmerLabel />
          </ShimmerCard>
        ))}
      </ShimmerGrid>

      {/* Gráficos Principais */}
      <ShimmerChartsGrid>
        <ShimmerChartCard>
          <ShimmerChartTitle />
          <ShimmerChart />
        </ShimmerChartCard>

        <ShimmerChartCard>
          <ShimmerChartTitle />
          <ShimmerChart />
        </ShimmerChartCard>
      </ShimmerChartsGrid>

      {/* Gráficos Adicionais */}
      <ShimmerExtendedChartsGrid>
        <ShimmerChartCard>
          <ShimmerChartTitle />
          <ShimmerChart />
        </ShimmerChartCard>

        <ShimmerMetricsCard>
          <ShimmerChartTitle />
          <ShimmerMetricItem>
            <ShimmerMetricLabel />
            <ShimmerMetricValue />
          </ShimmerMetricItem>
          <ShimmerMetricItem>
            <ShimmerMetricLabel />
            <ShimmerMetricValue />
          </ShimmerMetricItem>
          <ShimmerMetricItem>
            <ShimmerMetricLabel />
            <ShimmerMetricValue />
          </ShimmerMetricItem>
        </ShimmerMetricsCard>
      </ShimmerExtendedChartsGrid>

      {/* Estatísticas Adicionais */}
      <ShimmerExtendedGrid>
        {Array.from({ length: 4 }).map((_, index) => (
          <ShimmerCard key={index}>
            <ShimmerCardHeader>
              <ShimmerIcon />
            </ShimmerCardHeader>
            <ShimmerValue />
            <ShimmerLabel />
          </ShimmerCard>
        ))}
      </ShimmerExtendedGrid>

      {/* Atividades Recentes */}
      <ShimmerActivityCard>
        <ShimmerChartTitle />
        {Array.from({ length: 4 }).map((_, index) => (
          <ShimmerActivityItem key={index}>
            <ShimmerActivityIcon />
            <ShimmerActivityContent>
              <ShimmerActivityTitle />
              <ShimmerActivityTime />
            </ShimmerActivityContent>
          </ShimmerActivityItem>
        ))}
      </ShimmerActivityCard>
    </ShimmerContainer>
  );
};

export default DashboardShimmer;
