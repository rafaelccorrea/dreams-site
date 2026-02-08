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

// Header
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

// Grid de propriedades
const ShimmerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

// Card de propriedade
const ShimmerPropertyCard = styled.div`
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

const ShimmerPropertyTitle = styled.div`
  height: 24px;
  width: 80%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 8px;
`;

const ShimmerPropertyAddress = styled.div`
  height: 16px;
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
  margin-bottom: 4px;
`;

const ShimmerPropertyAddressShort = styled.div`
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

const ShimmerStatusBadge = styled.div`
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
  border-radius: 12px;
`;

const ShimmerPropertyDetails = styled.div`
  margin: 16px 0;
`;

const ShimmerDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ShimmerDetailLabel = styled.div`
  height: 14px;
  width: 60px;
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

const ShimmerDetailValue = styled.div`
  height: 14px;
  width: 40px;
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

const ShimmerPropertyPrice = styled.div`
  height: 28px;
  width: 120px;
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

const ShimmerActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ShimmerActionButton = styled.div`
  height: 32px;
  width: 80px;
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

const PropertiesShimmer: React.FC = () => {
  return (
    <ShimmerContainer>
      <ShimmerHeader>
        <ShimmerTitle />
        <ShimmerButton />
      </ShimmerHeader>

      <ShimmerGrid>
        {Array.from({ length: 6 }).map((_, index) => (
          <ShimmerPropertyCard key={index}>
            <ShimmerCardHeader>
              <ShimmerCardContent>
                <ShimmerPropertyTitle />
                <ShimmerPropertyAddress />
                <ShimmerPropertyAddressShort />
              </ShimmerCardContent>
              <ShimmerStatusBadge />
            </ShimmerCardHeader>

            <ShimmerPropertyDetails>
              <ShimmerDetailRow>
                <ShimmerDetailLabel />
                <ShimmerDetailValue />
              </ShimmerDetailRow>
              <ShimmerDetailRow>
                <ShimmerDetailLabel />
                <ShimmerDetailValue />
              </ShimmerDetailRow>
              <ShimmerDetailRow>
                <ShimmerDetailLabel />
                <ShimmerDetailValue />
              </ShimmerDetailRow>
            </ShimmerPropertyDetails>

            <ShimmerPropertyPrice />

            <ShimmerActionButtons>
              <ShimmerActionButton />
              <ShimmerActionButton />
            </ShimmerActionButtons>
          </ShimmerPropertyCard>
        ))}
      </ShimmerGrid>
    </ShimmerContainer>
  );
};

export default PropertiesShimmer;
