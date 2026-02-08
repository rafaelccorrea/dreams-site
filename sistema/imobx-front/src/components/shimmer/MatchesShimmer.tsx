/**
 * Shimmer de Loading para Página de Matches
 * Skeleton screen enquanto os matches carregam
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';

export const MatchesShimmer: React.FC = () => {
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
        {[1, 2, 3, 4].map(i => (
          <StatCard key={i}>
            <IconShimmer />
            <StatContent>
              <LineShimmer style={{ width: '60%', height: '14px' }} />
              <LineShimmer
                style={{ width: '80%', height: '28px', marginTop: '8px' }}
              />
            </StatContent>
          </StatCard>
        ))}
      </StatsGrid>

      {/* Filters Shimmer */}
      <FiltersSection>
        <FilterShimmer />
        <FilterShimmer />
      </FiltersSection>

      {/* Matches Grid Shimmer */}
      <MatchesGrid>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <MatchCard key={i}>
            {/* Score Badge */}
            <ScoreBadgeShimmer />

            {/* Image */}
            <ImageShimmer />

            {/* Property Info */}
            <CardContent>
              <LineShimmer
                style={{ width: '80%', height: '20px', marginBottom: '8px' }}
              />
              <LineShimmer
                style={{ width: '50%', height: '18px', marginBottom: '8px' }}
              />
              <LineShimmer
                style={{ width: '70%', height: '14px', marginBottom: '12px' }}
              />

              {/* Specs */}
              <SpecsRow>
                <LineShimmer style={{ width: '50px', height: '14px' }} />
                <LineShimmer style={{ width: '50px', height: '14px' }} />
                <LineShimmer style={{ width: '50px', height: '14px' }} />
              </SpecsRow>
            </CardContent>

            {/* Reasons Section */}
            <ReasonsShimmer>
              <LineShimmer
                style={{ width: '100%', height: '14px', marginBottom: '8px' }}
              />
              <LineShimmer
                style={{ width: '95%', height: '14px', marginBottom: '8px' }}
              />
              <LineShimmer style={{ width: '90%', height: '14px' }} />
            </ReasonsShimmer>

            {/* Actions */}
            <ActionsRow>
              <ActionButtonShimmer style={{ flex: 1 }} />
              <ActionButtonShimmer />
              <ActionButtonShimmer />
            </ActionsRow>
          </MatchCard>
        ))}
      </MatchesGrid>
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
  padding: 24px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ShimmerBase = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary || '#f0f0f0'} 0%,
    ${props => props.theme.colors.hover || '#e8e8e8'} 50%,
    ${props => props.theme.colors.backgroundSecondary || '#f0f0f0'} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 8px;
`;

const HeaderShimmer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 300px;
  height: 40px;
  margin-bottom: 8px;
  border-radius: 8px;
`;

const SubtitleShimmer = styled(ShimmerBase)`
  width: 400px;
  height: 24px;
  border-radius: 8px;
`;

const ButtonShimmer = styled(ShimmerBase)`
  width: 120px;
  height: 44px;
  border-radius: 8px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconShimmer = styled(ShimmerBase)`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  flex-shrink: 0;
`;

const StatContent = styled.div`
  flex: 1;
`;

const LineShimmer = styled(ShimmerBase)``;

const FiltersSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 44px;
  border-radius: 8px;
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MatchCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ScoreBadgeShimmer = styled(ShimmerBase)`
  width: 80px;
  height: 36px;
  border-radius: 20px;
  margin-bottom: 16px;
`;

const ImageShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const CardContent = styled.div`
  margin-bottom: 16px;
`;

const SpecsRow = styled.div`
  display: flex;
  gap: 16px;
`;

const ReasonsShimmer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButtonShimmer = styled(ShimmerBase)`
  height: 44px;
  border-radius: 8px;

  @media (max-width: 768px) {
    height: 40px;
  }
`;

export default MatchesShimmer;
