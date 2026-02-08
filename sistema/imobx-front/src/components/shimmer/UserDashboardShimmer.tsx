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
  margin: -24px;
  margin-top: -24px;
  width: calc(100% + 48px);
  min-height: calc(100vh - 100px);
  background: ${props => props.theme.colors.background};

  /* Padding apenas nas laterais e inferior */
  padding: 24px;
  padding-top: 0;

  @media (max-width: 1024px) {
    margin: -20px;
    margin-top: -20px;
    width: calc(100% + 40px);
    padding: 20px;
    padding-top: 0;
  }

  @media (max-width: 768px) {
    margin: -16px;
    margin-top: -16px;
    width: calc(100% + 32px);
    padding: 16px;
    padding-top: 0;
  }

  @media (max-width: 480px) {
    margin: -14px -12px;
    margin-top: -14px;
    width: calc(100% + 24px);
    padding: 14px 12px;
    padding-top: 0;
  }
`;

// Welcome Section
const ShimmerWelcomeSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const ShimmerWelcomeLeft = styled.div`
  flex: 1;
  min-width: 200px;
`;

const ShimmerWelcomeTitle = styled.div`
  height: 32px;
  width: 250px;
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

const ShimmerWelcomeSubtitle = styled.div`
  height: 20px;
  width: 300px;
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

const ShimmerWelcomeRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
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
`;

const ShimmerDate = styled.div`
  height: 18px;
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
`;

// Performance Card
const ShimmerPerformanceCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const ShimmerPerformanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const ShimmerPerformanceTitle = styled.div`
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
`;

const ShimmerBadges = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ShimmerBadge = styled.div`
  height: 28px;
  width: 80px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 14px;
`;

const ShimmerPerformanceValue = styled.div`
  height: 48px;
  width: 250px;
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

const ShimmerPerformanceComparison = styled.div`
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
  margin-bottom: 20px;
`;

const ShimmerChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ShimmerChartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ShimmerChartLabel = styled.div`
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

const ShimmerChartBar = styled.div`
  flex: 1;
  height: 24px;
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

// Stats Grid
const ShimmerStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const ShimmerStatCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
`;

const ShimmerStatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ShimmerStatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const ShimmerStatBadge = styled.div`
  height: 24px;
  width: 60px;
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

const ShimmerStatValue = styled.div`
  height: 36px;
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

const ShimmerStatLabel = styled.div`
  height: 18px;
  width: 150px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 12px;
`;

const ShimmerStatFooter = styled.div`
  height: 16px;
  width: 180px;
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

// Section
const ShimmerSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const ShimmerSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const ShimmerSectionTitle = styled.div`
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
`;

const ShimmerActivitiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ShimmerActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

const ShimmerActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const ShimmerActivityContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ShimmerActivityTitle = styled.div`
  height: 18px;
  width: 70%;
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

const ShimmerActivityDescription = styled.div`
  height: 16px;
  width: 50%;
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

const ShimmerActivityTime = styled.div`
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

export const UserDashboardShimmer: React.FC = () => {
  return (
    <ShimmerContainer>
      {/* Welcome Section */}
      <ShimmerWelcomeSection style={{ marginTop: '0' }}>
        <ShimmerWelcomeLeft>
          <ShimmerWelcomeTitle />
          <ShimmerWelcomeSubtitle />
        </ShimmerWelcomeLeft>
        <ShimmerWelcomeRight>
          <ShimmerButton />
          <ShimmerDate />
        </ShimmerWelcomeRight>
      </ShimmerWelcomeSection>

      {/* Performance Card */}
      <ShimmerPerformanceCard>
        <ShimmerPerformanceHeader>
          <ShimmerPerformanceTitle />
          <ShimmerBadges>
            <ShimmerBadge />
            <ShimmerBadge />
            <ShimmerBadge />
          </ShimmerBadges>
        </ShimmerPerformanceHeader>
        <ShimmerPerformanceValue />
        <ShimmerPerformanceComparison />
        <ShimmerChartContainer>
          {[1, 2, 3].map(i => (
            <ShimmerChartItem key={i}>
              <ShimmerChartLabel />
              <ShimmerChartBar />
            </ShimmerChartItem>
          ))}
        </ShimmerChartContainer>
      </ShimmerPerformanceCard>

      {/* Stats Grid */}
      <ShimmerStatsGrid>
        {[1, 2, 3, 4].map(i => (
          <ShimmerStatCard key={i}>
            <ShimmerStatHeader>
              <ShimmerStatIcon />
              <ShimmerStatBadge />
            </ShimmerStatHeader>
            <ShimmerStatValue />
            <ShimmerStatLabel />
            <ShimmerStatFooter />
          </ShimmerStatCard>
        ))}
      </ShimmerStatsGrid>

      {/* Activities Section */}
      <ShimmerSection>
        <ShimmerSectionHeader>
          <ShimmerSectionTitle />
        </ShimmerSectionHeader>
        <ShimmerActivitiesList>
          {[1, 2, 3, 4].map(i => (
            <ShimmerActivityItem key={i}>
              <ShimmerActivityIcon />
              <ShimmerActivityContent>
                <ShimmerActivityTitle />
                <ShimmerActivityDescription />
              </ShimmerActivityContent>
              <ShimmerActivityTime />
            </ShimmerActivityItem>
          ))}
        </ShimmerActivitiesList>
      </ShimmerSection>
    </ShimmerContainer>
  );
};
