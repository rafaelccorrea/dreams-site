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

// Container principal
const ShimmerContainer = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;
`;

// Header do shimmer
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
  height: 24px;
  width: 250px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin-top: 12px;
`;

const ShimmerLogoutButton = styled.div`
  height: 44px;
  width: 120px;
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

// Grid de planos
const ShimmerPlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

// Card de plano
const ShimmerPlanCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
`;

const ShimmerPlanHeader = styled.div`
  margin-bottom: 24px;
`;

const ShimmerPlanTitle = styled.div`
  height: 32px;
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
  margin: 0 auto 16px;
`;

const ShimmerPlanPrice = styled.div`
  height: 48px;
  width: 150px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  margin: 0 auto 16px;
`;

const ShimmerPlanDescription = styled.div`
  height: 20px;
  width: 100%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const ShimmerPlanDescriptionShort = styled.div`
  height: 20px;
  width: 60%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin: 0 auto 24px;
`;

// Lista de features
const ShimmerFeaturesList = styled.div`
  margin: 24px 0;
`;

const ShimmerFeatureItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const ShimmerFeatureIcon = styled.div`
  width: 20px;
  height: 20px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 50%;
  margin-right: 12px;
`;

const ShimmerFeatureText = styled.div`
  height: 16px;
  width: 80%;
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

const ShimmerFeatureTextShort = styled.div`
  height: 16px;
  width: 60%;
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

// Botão de seleção
const ShimmerSelectButton = styled.div`
  height: 48px;
  width: 100%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 12px;
  margin-top: 24px;
`;

// Badge popular
const ShimmerPopularBadge = styled.div`
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  height: 24px;
  width: 100px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 12px;
`;

const SubscriptionPlansShimmer: React.FC = () => {
  return (
    <ShimmerContainer>
      <ShimmerHeader>
        <div>
          <ShimmerTitle />
          <ShimmerSubtitle />
        </div>
        <ShimmerLogoutButton />
      </ShimmerHeader>

      <ShimmerPlansGrid>
        {/* Plano Básico */}
        <ShimmerPlanCard>
          <ShimmerPlanHeader>
            <ShimmerPlanTitle />
            <ShimmerPlanPrice />
            <ShimmerPlanDescription />
            <ShimmerPlanDescriptionShort />
          </ShimmerPlanHeader>

          <ShimmerFeaturesList>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureText />
            </ShimmerFeatureItem>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureText />
            </ShimmerFeatureItem>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureTextShort />
            </ShimmerFeatureItem>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureText />
            </ShimmerFeatureItem>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureTextShort />
            </ShimmerFeatureItem>
          </ShimmerFeaturesList>

          <ShimmerSelectButton />
        </ShimmerPlanCard>

        {/* Plano Pro (Popular) */}
        <ShimmerPlanCard>
          <ShimmerPopularBadge />
          <ShimmerPlanHeader>
            <ShimmerPlanTitle />
            <ShimmerPlanPrice />
            <ShimmerPlanDescription />
            <ShimmerPlanDescriptionShort />
          </ShimmerPlanHeader>

          <ShimmerFeaturesList>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureText />
            </ShimmerFeatureItem>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureText />
            </ShimmerFeatureItem>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureText />
            </ShimmerFeatureItem>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureTextShort />
            </ShimmerFeatureItem>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureText />
            </ShimmerFeatureItem>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureTextShort />
            </ShimmerFeatureItem>
          </ShimmerFeaturesList>

          <ShimmerSelectButton />
        </ShimmerPlanCard>

        {/* Plano Custom */}
        <ShimmerPlanCard>
          <ShimmerPlanHeader>
            <ShimmerPlanTitle />
            <ShimmerPlanPrice />
            <ShimmerPlanDescription />
            <ShimmerPlanDescriptionShort />
          </ShimmerPlanHeader>

          <ShimmerFeaturesList>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureText />
            </ShimmerFeatureItem>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureText />
            </ShimmerFeatureItem>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureText />
            </ShimmerFeatureItem>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureText />
            </ShimmerFeatureItem>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureTextShort />
            </ShimmerFeatureItem>
            <ShimmerFeatureItem>
              <ShimmerFeatureIcon />
              <ShimmerFeatureText />
            </ShimmerFeatureItem>
          </ShimmerFeaturesList>

          <ShimmerSelectButton />
        </ShimmerPlanCard>
      </ShimmerPlansGrid>
    </ShimmerContainer>
  );
};

export default SubscriptionPlansShimmer;
