import React from 'react';
import styled, { keyframes } from 'styled-components';

export const CompetitionsShimmer: React.FC = () => {
  return (
    <Container>
      {/* Header Shimmer */}
      <HeaderShimmer>
        <HeaderContent>
          <TitleShimmer />
          <SubtitleShimmer />
        </HeaderContent>
        <ActionsShimmer>
          <FilterShimmer />
          <ButtonShimmer />
        </ActionsShimmer>
      </HeaderShimmer>

      {/* Stats Cards Shimmer */}
      <StatsGrid>
        {[1, 2, 3, 4].map(i => (
          <StatCard key={i}>
            <IconShimmer />
            <StatContent>
              <LineShimmer style={{ width: '60%', height: '14px' }} />
              <LineShimmer
                style={{ width: '40%', height: '28px', marginTop: '8px' }}
              />
            </StatContent>
          </StatCard>
        ))}
      </StatsGrid>

      {/* Competitions Grid Shimmer */}
      <CompetitionsGrid>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <CompetitionCard key={i}>
            <CardHeader>
              <StatusBadgeShimmer />
              <ActionsButtonsShimmer>
                <SmallButtonShimmer />
                <SmallButtonShimmer />
                <SmallButtonShimmer />
              </ActionsButtonsShimmer>
            </CardHeader>

            <CardBody>
              <LineShimmer style={{ width: '70%', height: '24px' }} />
              <LineShimmer
                style={{ width: '100%', height: '14px', marginTop: '12px' }}
              />
              <LineShimmer
                style={{ width: '90%', height: '14px', marginTop: '4px' }}
              />
            </CardBody>

            <CardInfo>
              <InfoRow>
                <LineShimmer style={{ width: '80px', height: '14px' }} />
                <LineShimmer style={{ width: '120px', height: '14px' }} />
              </InfoRow>
              <InfoRow>
                <LineShimmer style={{ width: '80px', height: '14px' }} />
                <LineShimmer style={{ width: '150px', height: '14px' }} />
              </InfoRow>
              <InfoRow>
                <LineShimmer style={{ width: '80px', height: '14px' }} />
                <LineShimmer style={{ width: '100px', height: '14px' }} />
              </InfoRow>
            </CardInfo>

            <CardFooter>
              <LineShimmer style={{ width: '120px', height: '14px' }} />
              <LineShimmer style={{ width: '100px', height: '14px' }} />
            </CardFooter>
          </CompetitionCard>
        ))}
      </CompetitionsGrid>
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

  @media (max-width: 768px) {
    padding: 1rem;
  }
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
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 36px;
  margin-bottom: 0.5rem;
`;

const SubtitleShimmer = styled(ShimmerBase)`
  width: 300px;
  height: 20px;
`;

const ActionsShimmer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const FilterShimmer = styled(ShimmerBase)`
  width: 150px;
  height: 40px;
`;

const ButtonShimmer = styled(ShimmerBase)`
  width: 180px;
  height: 40px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
`;

const IconShimmer = styled(ShimmerBase)`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;
`;

const StatContent = styled.div`
  flex: 1;
`;

const LineShimmer = styled(ShimmerBase)``;

const CompetitionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CompetitionCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const StatusBadgeShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 28px;
  border-radius: 14px;
`;

const ActionsButtonsShimmer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SmallButtonShimmer = styled(ShimmerBase)`
  width: 36px;
  height: 36px;
  border-radius: 8px;
`;

const CardBody = styled.div`
  flex: 1;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export default CompetitionsShimmer;
