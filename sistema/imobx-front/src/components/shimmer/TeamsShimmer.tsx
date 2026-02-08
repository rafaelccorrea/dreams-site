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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const ShimmerTitle = styled.div`
  height: 40px;
  width: 200px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

const ShimmerButton = styled.div`
  height: 44px;
  width: 140px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

const ShimmerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

const ShimmerCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  position: relative;
`;

const ShimmerCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ShimmerCardContent = styled.div`
  flex: 1;
`;

const ShimmerColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  margin-bottom: 12px;
`;

const ShimmerText = styled.div<{ $width: string; $height: string }>`
  width: ${props => props.$width};
  height: ${props => props.$height};
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: ${props => (props.$height === '14px' ? '8px' : '16px')};
`;

const ShimmerActions = styled.div`
  display: flex;
  gap: 8px;
  opacity: 0.6;
`;

const ShimmerActionButton = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
`;

const ShimmerStats = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

const ShimmerStat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ShimmerStatIcon = styled.div`
  width: 14px;
  height: 14px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 2px;
`;

const ShimmerStatText = styled.div`
  width: 60px;
  height: 12px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

interface TeamsShimmerProps {
  count?: number;
}

const TeamsShimmer: React.FC<TeamsShimmerProps> = ({ count = 6 }) => {
  return (
    <ShimmerContainer>
      <ShimmerHeader>
        <ShimmerTitle />
        <ShimmerButton />
      </ShimmerHeader>

      <ShimmerGrid>
        {Array.from({ length: count }).map((_, index) => (
          <ShimmerCard key={index}>
            <ShimmerCardHeader>
              <ShimmerCardContent>
                <ShimmerColor />
                <ShimmerText $width='180px' $height='18px' />
                <ShimmerText $width='240px' $height='14px' />
              </ShimmerCardContent>
              <ShimmerActions>
                <ShimmerActionButton />
                <ShimmerActionButton />
              </ShimmerActions>
            </ShimmerCardHeader>

            <ShimmerStats>
              <ShimmerStat>
                <ShimmerStatIcon />
                <ShimmerStatText />
              </ShimmerStat>
              <ShimmerStat>
                <ShimmerStatIcon />
                <ShimmerStatText />
              </ShimmerStat>
            </ShimmerStats>
          </ShimmerCard>
        ))}
      </ShimmerGrid>
    </ShimmerContainer>
  );
};

export default TeamsShimmer;
