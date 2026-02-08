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
  width: 300px;
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

const ShimmerSubtitle = styled.div`
  height: 20px;
  width: 400px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 24px;
`;

const ShimmerBackButton = styled.div`
  height: 44px;
  width: 100px;
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

const ShimmerFiltersSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const ShimmerFilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ShimmerFilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ShimmerLabel = styled.div`
  height: 16px;
  width: 120px;
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

const ShimmerInput = styled.div`
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
  width: 180px;
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

const ShimmerModeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const ShimmerModeButton = styled.div`
  height: 36px;
  width: 140px;
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

const ShimmerTable = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

const ShimmerTableHeader = styled.div`
  display: flex;
  background: ${props => props.theme.colors.backgroundSecondary};
  padding: 16px;
`;

const ShimmerTableHeaderCell = styled.div`
  flex: 1;
  height: 20px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-right: 16px;

  &:last-child {
    margin-right: 0;
  }
`;

const ShimmerTableRow = styled.div`
  display: flex;
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ShimmerTableRowCell = styled.div`
  flex: 1;
  height: 16px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-right: 16px;

  &:last-child {
    margin-right: 0;
  }
`;

interface CompareTeamsShimmerProps {
  teamCount?: number;
}

const CompareTeamsShimmer: React.FC<CompareTeamsShimmerProps> = ({
  teamCount = 2,
}) => {
  return (
    <ShimmerContainer>
      <ShimmerHeader>
        <div>
          <ShimmerTitle />
          <ShimmerSubtitle />
        </div>
        <ShimmerBackButton />
      </ShimmerHeader>

      <ShimmerFiltersSection>
        <ShimmerFilterRow>
          <ShimmerFilterGroup>
            <ShimmerLabel />
            <ShimmerInput />
          </ShimmerFilterGroup>
          <ShimmerButton />
        </ShimmerFilterRow>
      </ShimmerFiltersSection>

      <ShimmerModeSelector>
        <ShimmerModeButton />
        <ShimmerModeButton />
        <ShimmerModeButton />
      </ShimmerModeSelector>

      <ShimmerTable>
        <ShimmerTableHeader>
          <ShimmerTableHeaderCell />
          {Array.from({ length: teamCount }).map((_, index) => (
            <ShimmerTableHeaderCell key={index} />
          ))}
        </ShimmerTableHeader>

        {Array.from({ length: 8 }).map((_, rowIndex) => (
          <ShimmerTableRow key={rowIndex}>
            <ShimmerTableRowCell />
            {Array.from({ length: teamCount }).map((_, cellIndex) => (
              <ShimmerTableRowCell key={cellIndex} />
            ))}
          </ShimmerTableRow>
        ))}
      </ShimmerTable>
    </ShimmerContainer>
  );
};

export default CompareTeamsShimmer;
