import React from 'react';
import styled, { keyframes } from 'styled-components';
import { MdArrowBack } from 'react-icons/md';

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
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 24px;
`;

// Header
const ShimmerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const ShimmerBackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
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

const ShimmerTitle = styled.div`
  height: 40px;
  width: 250px;
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

// Grid principal
const ShimmerMainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Card de status
const ShimmerStatusCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
`;

const ShimmerCardTitle = styled.div`
  height: 24px;
  width: 150px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 16px;
`;

const ShimmerStatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ShimmerStatusLabel = styled.div`
  height: 16px;
  width: 100px;
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

const ShimmerStatusValue = styled.div`
  height: 16px;
  width: 80px;
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

// Card de alertas
const ShimmerAlertsCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
`;

const ShimmerAlertItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
`;

const ShimmerAlertIcon = styled.div`
  width: 24px;
  height: 24px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 50%;
`;

const ShimmerAlertContent = styled.div`
  flex: 1;
`;

const ShimmerAlertTitle = styled.div`
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
  margin-bottom: 8px;
`;

const ShimmerAlertMessage = styled.div`
  height: 14px;
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

// Card de planos disponíveis
const ShimmerPlansCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  grid-column: 1 / -1;
`;

const ShimmerPlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const ShimmerPlanCard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  padding: 16px;
`;

const ShimmerPlanHeader = styled.div`
  margin-bottom: 12px;
`;

const ShimmerPlanTitle = styled.div`
  height: 20px;
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
  margin-bottom: 8px;
`;

const ShimmerPlanPrice = styled.div`
  height: 24px;
  width: 80px;
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

const ShimmerPlanButton = styled.div`
  height: 36px;
  width: 100%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  margin-top: 12px;
`;

const SubscriptionManagementShimmer: React.FC = () => {
  return (
    <ShimmerContainer>
      <ShimmerHeader>
        <ShimmerBackButton />
        <ShimmerTitle />
      </ShimmerHeader>

      <ShimmerMainGrid>
        {/* Card de Status */}
        <ShimmerStatusCard>
          <ShimmerCardTitle />
          <ShimmerStatusItem>
            <ShimmerStatusLabel />
            <ShimmerStatusValue />
          </ShimmerStatusItem>
          <ShimmerStatusItem>
            <ShimmerStatusLabel />
            <ShimmerStatusValue />
          </ShimmerStatusItem>
          <ShimmerStatusItem>
            <ShimmerStatusLabel />
            <ShimmerStatusValue />
          </ShimmerStatusItem>
          <ShimmerStatusItem>
            <ShimmerStatusLabel />
            <ShimmerStatusValue />
          </ShimmerStatusItem>
        </ShimmerStatusCard>

        {/* Card de Alertas */}
        <ShimmerAlertsCard>
          <ShimmerCardTitle />
          <ShimmerAlertItem>
            <ShimmerAlertIcon />
            <ShimmerAlertContent>
              <ShimmerAlertTitle />
              <ShimmerAlertMessage />
            </ShimmerAlertContent>
          </ShimmerAlertItem>
          <ShimmerAlertItem>
            <ShimmerAlertIcon />
            <ShimmerAlertContent>
              <ShimmerAlertTitle />
              <ShimmerAlertMessage />
            </ShimmerAlertContent>
          </ShimmerAlertItem>
        </ShimmerAlertsCard>
      </ShimmerMainGrid>

      {/* Card de Planos Disponíveis */}
      <ShimmerPlansCard>
        <ShimmerCardTitle />
        <ShimmerPlansGrid>
          <ShimmerPlanCard>
            <ShimmerPlanHeader>
              <ShimmerPlanTitle />
              <ShimmerPlanPrice />
            </ShimmerPlanHeader>
            <ShimmerPlanButton />
          </ShimmerPlanCard>
          <ShimmerPlanCard>
            <ShimmerPlanHeader>
              <ShimmerPlanTitle />
              <ShimmerPlanPrice />
            </ShimmerPlanHeader>
            <ShimmerPlanButton />
          </ShimmerPlanCard>
          <ShimmerPlanCard>
            <ShimmerPlanHeader>
              <ShimmerPlanTitle />
              <ShimmerPlanPrice />
            </ShimmerPlanHeader>
            <ShimmerPlanButton />
          </ShimmerPlanCard>
        </ShimmerPlansGrid>
      </ShimmerPlansCard>
    </ShimmerContainer>
  );
};

export default SubscriptionManagementShimmer;
