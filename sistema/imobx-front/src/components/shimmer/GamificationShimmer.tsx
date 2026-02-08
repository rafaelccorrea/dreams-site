import React from 'react';
import styled, { keyframes } from 'styled-components';

export const GamificationShimmer: React.FC = () => {
  return (
    <Container>
      {/* Header Shimmer */}
      <HeaderShimmer>
        <TitleShimmer />
        <ActionsShimmer>
          <ButtonShimmer style={{ width: '100px' }} />
          <ButtonShimmer style={{ width: '100px' }} />
          <ButtonShimmer style={{ width: '120px' }} />
        </ActionsShimmer>
      </HeaderShimmer>

      {/* Metrics Cards Shimmer */}
      <MetricsGrid>
        {[1, 2, 3, 4].map(i => (
          <CardShimmer key={i}>
            <IconShimmer />
            <ContentShimmer>
              <LineShimmer style={{ width: '60%', height: '14px' }} />
              <LineShimmer
                style={{ width: '40%', height: '24px', marginTop: '8px' }}
              />
              <LineShimmer
                style={{ width: '50%', height: '12px', marginTop: '4px' }}
              />
            </ContentShimmer>
          </CardShimmer>
        ))}
      </MetricsGrid>

      {/* Points Breakdown Shimmer */}
      <BreakdownGrid>
        {[1, 2, 3].map(i => (
          <BreakdownCard key={i}>
            <LineShimmer style={{ width: '60%', height: '14px' }} />
            <LineShimmer
              style={{ width: '100%', height: '8px', marginTop: '12px' }}
            />
            <LineShimmer
              style={{ width: '30%', height: '14px', marginTop: '8px' }}
            />
          </BreakdownCard>
        ))}
      </BreakdownGrid>

      {/* Achievements Shimmer */}
      <SectionShimmer>
        <SectionTitleShimmer />
        <AchievementsGrid>
          {[1, 2, 3, 4, 5].map(i => (
            <AchievementCard key={i}>
              <CircleShimmer />
              <LineShimmer
                style={{ width: '80%', height: '16px', marginTop: '12px' }}
              />
              <LineShimmer
                style={{ width: '100%', height: '12px', marginTop: '8px' }}
              />
              <LineShimmer
                style={{ width: '50%', height: '12px', marginTop: '8px' }}
              />
            </AchievementCard>
          ))}
        </AchievementsGrid>
      </SectionShimmer>

      {/* Rankings Table Shimmer */}
      <SectionShimmer>
        <SectionTitleShimmer />
        <TableShimmer>
          {[1, 2, 3, 4, 5].map(i => (
            <TableRowShimmer key={i}>
              <CircleShimmer style={{ width: '40px', height: '40px' }} />
              <LineShimmer style={{ width: '150px', height: '16px' }} />
              <LineShimmer style={{ width: '60px', height: '14px' }} />
              <LineShimmer style={{ width: '60px', height: '14px' }} />
              <LineShimmer style={{ width: '80px', height: '16px' }} />
            </TableRowShimmer>
          ))}
        </TableShimmer>
      </SectionShimmer>
    </Container>
  );
};

// Animations
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

// Styled Components
const Container = styled.div`
  padding: 2rem;
  width: 100%;
`;

const ShimmerBase = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 0%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 0.5rem;
`;

const HeaderShimmer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 250px;
  height: 40px;
`;

const ActionsShimmer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ButtonShimmer = styled(ShimmerBase)`
  height: 40px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const CardShimmer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 1rem;
`;

const IconShimmer = styled(ShimmerBase)`
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  flex-shrink: 0;
`;

const ContentShimmer = styled.div`
  flex: 1;
`;

const LineShimmer = styled(ShimmerBase)`
  margin-bottom: 0.5rem;
`;

const BreakdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BreakdownCard = styled.div`
  padding: 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 0.75rem;
`;

const SectionShimmer = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitleShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 32px;
  margin-bottom: 1rem;
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const AchievementCard = styled.div`
  padding: 1.5rem;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 1rem;
  text-align: center;
`;

const CircleShimmer = styled(ShimmerBase)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto;
`;

const TableShimmer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 1rem;
  padding: 1rem;
`;

const TableRowShimmer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;
