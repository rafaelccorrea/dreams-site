import React from 'react';
import styled, { keyframes } from 'styled-components';

export const PrizesShimmer: React.FC = () => {
  return (
    <Container>
      {/* Header Shimmer */}
      <HeaderShimmer>
        <HeaderContent>
          <TitleShimmer />
          <SubtitleShimmer />
        </HeaderContent>
        <ButtonShimmer />
      </HeaderShimmer>

      {/* Stats Cards Shimmer */}
      <StatsGrid>
        {[1, 2, 3].map(i => (
          <StatCard key={i}>
            <IconShimmer />
            <StatContent>
              <LineShimmer style={{ width: '60%', height: '14px' }} />
              <LineShimmer
                style={{ width: '50%', height: '28px', marginTop: '8px' }}
              />
              <LineShimmer
                style={{ width: '70%', height: '12px', marginTop: '4px' }}
              />
            </StatContent>
          </StatCard>
        ))}
      </StatsGrid>

      {/* Filters Shimmer */}
      <FiltersShimmer>
        <SearchShimmer />
        <FilterButtonsShimmer>
          <FilterButtonShimmer />
          <FilterButtonShimmer />
          <FilterButtonShimmer />
          <FilterButtonShimmer />
        </FilterButtonsShimmer>
      </FiltersShimmer>

      {/* Prizes Grid Shimmer */}
      <PrizesGrid>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <PrizeCard key={i}>
            <CardHeader>
              <StatusBadgeShimmer />
              <ActionsButtonsShimmer>
                <SmallButtonShimmer />
                <SmallButtonShimmer />
                <SmallButtonShimmer />
              </ActionsButtonsShimmer>
            </CardHeader>

            <CardIcon>
              <IconLargeShimmer />
            </CardIcon>

            <CardBody>
              <LineShimmer
                style={{ width: '80%', height: '20px', margin: '0 auto' }}
              />
              <LineShimmer
                style={{ width: '100%', height: '14px', marginTop: '12px' }}
              />
              <LineShimmer
                style={{ width: '90%', height: '14px', marginTop: '4px' }}
              />
            </CardBody>

            <CardInfo>
              <InfoItem>
                <LineShimmer style={{ width: '60px', height: '14px' }} />
                <LineShimmer style={{ width: '80px', height: '14px' }} />
              </InfoItem>
              <InfoItem>
                <LineShimmer style={{ width: '60px', height: '14px' }} />
                <LineShimmer style={{ width: '100px', height: '14px' }} />
              </InfoItem>
              <InfoItem>
                <LineShimmer style={{ width: '60px', height: '14px' }} />
                <LineShimmer style={{ width: '90px', height: '14px' }} />
              </InfoItem>
            </CardInfo>

            <CardFooter>
              <LineShimmer style={{ width: '120px', height: '16px' }} />
            </CardFooter>
          </PrizeCard>
        ))}
      </PrizesGrid>
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

const ButtonShimmer = styled(ShimmerBase)`
  width: 150px;
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

const FiltersShimmer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchShimmer = styled(ShimmerBase)`
  width: 300px;
  height: 40px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterButtonsShimmer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterButtonShimmer = styled(ShimmerBase)`
  width: 80px;
  height: 36px;
`;

const PrizesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PrizeCard = styled.div`
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
`;

const StatusBadgeShimmer = styled(ShimmerBase)`
  width: 90px;
  height: 24px;
  border-radius: 12px;
`;

const ActionsButtonsShimmer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SmallButtonShimmer = styled(ShimmerBase)`
  width: 32px;
  height: 32px;
  border-radius: 6px;
`;

const CardIcon = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem 0;
`;

const IconLargeShimmer = styled(ShimmerBase)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const CardBody = styled.div`
  text-align: center;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 0;
  border-top: 1px solid ${props => props.theme.colors.border};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default PrizesShimmer;
