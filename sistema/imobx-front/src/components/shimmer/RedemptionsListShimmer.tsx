import React from 'react';
import styled, { keyframes } from 'styled-components';

export const RedemptionsListShimmer: React.FC = () => {
  return (
    <Container>
      {/* Header */}
      <HeaderSection>
        <HeaderContent>
          <TitleShimmer />
          <SubtitleShimmer />
        </HeaderContent>
        <ButtonShimmer style={{ width: '180px', height: '44px' }} />
      </HeaderSection>

      {/* Filtros */}
      <FiltersContainer>
        {[1, 2, 3, 4, 5].map(i => (
          <FilterButton key={i} />
        ))}
      </FiltersContainer>

      {/* Lista de Solicitações */}
      <RedemptionsList>
        {[1, 2, 3, 4, 5].map(i => (
          <RedemptionCard key={i}>
            <CardHeader>
              <RewardInfo>
                <IconShimmer />
                <RewardDetails>
                  <LineShimmer style={{ width: '200px', height: '20px' }} />
                  <LineShimmer
                    style={{ width: '120px', height: '14px', marginTop: '4px' }}
                  />
                </RewardDetails>
              </RewardInfo>
              <BadgeShimmer />
            </CardHeader>
            <CardContent>
              <LineShimmer style={{ width: '150px', height: '14px' }} />
              <NotesShimmer>
                <LineShimmer style={{ width: '100%', height: '14px' }} />
                <LineShimmer
                  style={{ width: '80%', height: '14px', marginTop: '4px' }}
                />
              </NotesShimmer>
            </CardContent>
          </RedemptionCard>
        ))}
      </RedemptionsList>
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

const LineShimmer = styled(ShimmerBase)`
  margin-bottom: 0.5rem;
`;

const ButtonShimmer = styled(ShimmerBase)``;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 300px;
  height: 32px;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    width: 200px;
    height: 24px;
  }
`;

const SubtitleShimmer = styled(ShimmerBase)`
  width: 400px;
  height: 16px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled(ShimmerBase)`
  width: 150px;
  height: 40px;
`;

const RedemptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RedemptionCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 1rem;
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 1rem;
`;

const RewardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconShimmer = styled(ShimmerBase)`
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  flex-shrink: 0;
`;

const RewardDetails = styled.div``;

const BadgeShimmer = styled(ShimmerBase)`
  width: 140px;
  height: 32px;
  border-radius: 9999px;
`;

const CardContent = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NotesShimmer = styled.div`
  padding: 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 0.5rem;
`;
