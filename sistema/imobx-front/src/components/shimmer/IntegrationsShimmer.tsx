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

// Componente base do shimmer
const ShimmerBase = styled.div<{
  $width?: string;
  $height?: string;
  $radius?: string;
}>`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$radius || '8px'};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 32px;
  border-radius: 8px;

  @media (max-width: 768px) {
    width: 180px;
    height: 28px;
  }

  @media (max-width: 480px) {
    width: 150px;
    height: 24px;
  }
`;

const SubtitleShimmer = styled(ShimmerBase)`
  width: 100%;
  max-width: 500px;
  height: 20px;
  border-radius: 8px;

  @media (max-width: 768px) {
    height: 18px;
  }

  @media (max-width: 480px) {
    height: 16px;
  }
`;

const BackButtonShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 40px;
  border-radius: 8px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 88px;
    height: 38px;
  }
`;

const IntegrationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  align-items: stretch;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const IntegrationCardShimmer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 280px;
  height: 100%;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 10px;
  }
`;

const CardBodyShimmer = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const IntegrationHeaderShimmer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 0;
`;

const IconShimmer = styled(ShimmerBase)`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }
`;

const IntegrationInfoShimmer = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const IntegrationNameShimmer = styled(ShimmerBase)`
  width: 180px;
  height: 22px;
  border-radius: 6px;

  @media (max-width: 480px) {
    width: 150px;
    height: 20px;
  }
`;

const IntegrationDescriptionShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 14px;
  border-radius: 4px;

  &:nth-of-type(2) {
    width: 85%;
  }
`;

const StatusBadgeShimmer = styled(ShimmerBase)`
  width: 130px;
  height: 28px;
  border-radius: 12px;
  align-self: flex-start;

  @media (max-width: 480px) {
    width: 110px;
    height: 26px;
  }
`;

const IntegrationDetailsShimmer = styled.div`
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailItemShimmer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const DetailLabelShimmer = styled(ShimmerBase)`
  width: 70px;
  height: 14px;
  border-radius: 4px;
`;

const DetailValueShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 14px;
  border-radius: 4px;
`;

const CardActionsShimmer = styled.div`
  margin-top: auto;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
`;

const ConfigButtonShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 42px;
  border-radius: 8px;

  @media (max-width: 480px) {
    height: 40px;
  }
`;

const ActionButtonShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 44px;
  border-radius: 8px;

  @media (max-width: 480px) {
    height: 40px;
  }
`;

export const IntegrationsShimmer: React.FC = () => {
  return (
    <Container>
      <Header>
        <HeaderContent>
          <TitleShimmer />
          <SubtitleShimmer />
        </HeaderContent>
        <BackButtonShimmer />
      </Header>

      <IntegrationsGrid>
        {Array.from({ length: 3 }).map((_, index) => (
          <IntegrationCardShimmer key={index}>
            <CardBodyShimmer>
              <IntegrationHeaderShimmer>
                <IconShimmer />
                <IntegrationInfoShimmer>
                  <IntegrationNameShimmer />
                  <IntegrationDescriptionShimmer />
                  <IntegrationDescriptionShimmer />
                  <StatusBadgeShimmer />
                </IntegrationInfoShimmer>
              </IntegrationHeaderShimmer>

              {index === 0 && (
                <IntegrationDetailsShimmer>
                  <DetailItemShimmer>
                    <DetailLabelShimmer />
                    <DetailValueShimmer />
                  </DetailItemShimmer>
                  <DetailItemShimmer>
                    <DetailLabelShimmer />
                    <DetailValueShimmer />
                  </DetailItemShimmer>
                  <DetailItemShimmer>
                    <DetailLabelShimmer />
                    <DetailValueShimmer />
                  </DetailItemShimmer>
                </IntegrationDetailsShimmer>
              )}
            </CardBodyShimmer>

            <CardActionsShimmer>
              <ConfigButtonShimmer />
              <ConfigButtonShimmer />
              <ActionButtonShimmer />
            </CardActionsShimmer>
          </IntegrationCardShimmer>
        ))}
      </IntegrationsGrid>
    </Container>
  );
};
