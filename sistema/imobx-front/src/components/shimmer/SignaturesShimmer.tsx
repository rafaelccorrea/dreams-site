import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  StatsBar,
  SignaturesList,
  SignatureCard,
  CardHeader,
  HeaderLeft,
  CardBody,
  InfoRow,
  CardActions,
} from '../../styles/pages/AllSignaturesPageStyles';

// Animations
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Shimmer Base
const ShimmerBase = styled.div<{
  $width?: string;
  $height?: string;
  $radius?: string;
}>`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover || props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$radius || '8px'};
`;

// Shimmer Components
const ShimmerStatsBar = styled(StatsBar)`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ShimmerStatsText = styled(ShimmerBase)`
  width: 180px;
  height: 18px;
`;

const ShimmerCard = styled(SignatureCard)`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  pointer-events: none;
`;

const ShimmerCardHeader = styled(CardHeader)`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: 16px;
  margin-bottom: 16px;
`;

const ShimmerName = styled(ShimmerBase)`
  width: 200px;
  height: 18px;
  margin-bottom: 8px;
`;

const ShimmerEmail = styled(ShimmerBase)`
  width: 250px;
  height: 14px;
`;

const ShimmerBadge = styled(ShimmerBase)`
  width: 100px;
  height: 24px;
  border-radius: 12px;
`;

const ShimmerInfoRow = styled(InfoRow)`
  margin-bottom: 12px;
`;

const ShimmerLabel = styled(ShimmerBase)`
  width: 120px;
  height: 14px;
`;

const ShimmerValue = styled(ShimmerBase)`
  width: 150px;
  height: 14px;
`;

const ShimmerActions = styled(CardActions)`
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ShimmerActionButton = styled(ShimmerBase)`
  width: 120px;
  height: 36px;
  border-radius: 8px;
`;

export const SignaturesShimmer: React.FC = () => {
  return (
    <>
      <ShimmerStatsBar>
        <ShimmerStatsText />
      </ShimmerStatsBar>

      <SignaturesList>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <ShimmerCard key={i}>
            <ShimmerCardHeader>
              <HeaderLeft>
                <ShimmerName />
                <ShimmerEmail />
              </HeaderLeft>
              <ShimmerBadge />
            </ShimmerCardHeader>

            <CardBody>
              <ShimmerInfoRow>
                <ShimmerLabel />
                <ShimmerValue />
              </ShimmerInfoRow>
              <ShimmerInfoRow>
                <ShimmerLabel />
                <ShimmerValue />
              </ShimmerInfoRow>
              {i % 2 === 0 && (
                <ShimmerInfoRow>
                  <ShimmerLabel />
                  <ShimmerValue />
                </ShimmerInfoRow>
              )}
            </CardBody>

            <ShimmerActions>
              <ShimmerActionButton />
              {i % 3 === 0 && <ShimmerActionButton />}
            </ShimmerActions>
          </ShimmerCard>
        ))}
      </SignaturesList>
    </>
  );
};
