import React from 'react';
import styled, { keyframes } from 'styled-components';

export const RewardCatalogShimmer: React.FC = () => {
  return (
    <Container>
      {/* Header com Pontos Shimmer */}
      <PointsHeader>
        <PointsContent>
          <LineShimmer style={{ width: '180px', height: '16px' }} />
          <LineShimmer
            style={{ width: '200px', height: '56px', marginTop: '8px' }}
          />
          <LineShimmer
            style={{ width: '250px', height: '16px', marginTop: '8px' }}
          />
        </PointsContent>
        <ButtonShimmer style={{ width: '200px', height: '56px' }} />
      </PointsHeader>

      {/* Título */}
      <HeaderSection>
        <TitleShimmer />
        <SubtitleShimmer />
      </HeaderSection>

      {/* Grid de Prêmios */}
      <RewardsGrid>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <RewardCard key={i}>
            <ImageShimmer />
            <ContentShimmer>
              <LineShimmer style={{ width: '80%', height: '20px' }} />
              <LineShimmer
                style={{ width: '100%', height: '14px', marginTop: '8px' }}
              />
              <LineShimmer
                style={{ width: '60%', height: '14px', marginTop: '4px' }}
              />
              <LineShimmer
                style={{
                  width: '120px',
                  height: '32px',
                  marginTop: '12px',
                  borderRadius: '9999px',
                }}
              />
              <LineShimmer
                style={{ width: '90px', height: '14px', marginTop: '8px' }}
              />
              <ButtonShimmer
                style={{ width: '100%', height: '44px', marginTop: '12px' }}
              />
            </ContentShimmer>
          </RewardCard>
        ))}
      </RewardsGrid>
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

const PointsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 1.5rem;
  margin-bottom: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }
`;

const PointsContent = styled.div`
  flex: 1;
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
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
  width: 500px;
  height: 16px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const RewardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const RewardCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 1rem;
  overflow: hidden;
`;

const ImageShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 200px;
  border-radius: 0;
`;

const ContentShimmer = styled.div`
  padding: 1.25rem;
`;
