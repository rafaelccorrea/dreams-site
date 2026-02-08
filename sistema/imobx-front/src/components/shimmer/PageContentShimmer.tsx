import React from 'react';
import styled, { keyframes } from 'styled-components';

export const PageContentShimmer: React.FC = () => {
  return (
    <Container>
      <ContentHeaderShimmer>
        <TitleShimmer />
        <SubtitleShimmer />
      </ContentHeaderShimmer>

      <CardsGrid>
        {[1, 2, 3, 4].map(i => (
          <CardShimmer key={i}>
            <CardIconShimmer />
            <CardContentShimmer>
              <LineShimmer style={{ width: '70%', height: '16px' }} />
              <LineShimmer
                style={{ width: '50%', height: '28px', marginTop: '8px' }}
              />
            </CardContentShimmer>
          </CardShimmer>
        ))}
      </CardsGrid>

      <ContentBlockShimmer>
        <LineShimmer style={{ width: '200px', height: '24px' }} />
        <LineShimmer
          style={{ width: '100%', height: '200px', marginTop: '16px' }}
        />
      </ContentBlockShimmer>
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

// Base Shimmer Component
const ShimmerBase = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 0%,
    ${props =>
        props.theme.colors.hover || props.theme.colors.backgroundSecondary}
      50%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 8px;
`;

const Container = styled.div`
  width: 100%;
  padding: 32px;
`;

const ContentHeaderShimmer = styled.div`
  margin-bottom: 32px;
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 300px;
  height: 32px;
  margin-bottom: 8px;
`;

const SubtitleShimmer = styled(ShimmerBase)`
  width: 400px;
  height: 18px;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const CardShimmer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  gap: 16px;
`;

const CardIconShimmer = styled(ShimmerBase)`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;
`;

const CardContentShimmer = styled.div`
  flex: 1;
`;

const ContentBlockShimmer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
`;

const LineShimmer = styled(ShimmerBase)``;
