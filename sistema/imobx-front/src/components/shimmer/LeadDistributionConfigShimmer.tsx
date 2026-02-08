import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const ShimmerBase = styled.div<{
  $width?: string;
  $height?: string;
  $radius?: string;
}>`
  background: linear-gradient(
    90deg,
    ${p => p.theme.colors.backgroundSecondary} 25%,
    ${p => p.theme.colors.border} 50%,
    ${p => p.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${p => p.$width ?? '100%'};
  height: ${p => p.$height ?? '20px'};
  border-radius: ${p => p.$radius ?? '8px'};
`;

const Container = styled.div`
  padding: 12px;
  width: 100%;
  @media (min-width: 480px) {
    padding: 16px;
  }
  @media (min-width: 600px) {
    padding: 24px;
  }
  @media (min-width: 960px) {
    padding: 28px 32px;
  }
`;

const BackButtonShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 44px;
  margin-bottom: 16px;
  border-radius: 10px;
  @media (min-width: 600px) {
    margin-bottom: 24px;
  }
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 280px;
  height: 28px;
  margin-bottom: 6px;
  @media (min-width: 480px) {
    width: 320px;
    height: 32px;
  }
  @media (min-width: 960px) {
    width: 380px;
    height: 36px;
  }
`;

const SubtitleShimmer = styled(ShimmerBase)`
  width: 95%;
  max-width: 520px;
  height: 18px;
  margin-bottom: 12px;
  @media (min-width: 600px) {
    margin-bottom: 12px;
  }
`;

const AnalysisLinkShimmer = styled(ShimmerBase)`
  width: 260px;
  height: 22px;
  margin-bottom: 24px;
`;

const ToolbarShimmer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
`;

const ButtonShimmer = styled(ShimmerBase)`
  height: 48px;
  border-radius: 10px;
  min-width: 180px;
  @media (min-width: 480px) {
    height: 44px;
    min-width: 200px;
  }
`;

const CardShimmer = styled.div`
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const CardHeaderShimmer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CardTitleShimmer = styled(ShimmerBase)`
  width: 160px;
  height: 20px;
`;

const CardActionsShimmer = styled.div`
  display: flex;
  gap: 4px;
`;

const CardActionBtnShimmer = styled(ShimmerBase)`
  width: 36px;
  height: 36px;
  border-radius: 8px;
`;

const CardGridShimmer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 16px;
  @media (min-width: 480px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const CardItemShimmer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardLabelShimmer = styled(ShimmerBase)`
  width: 70px;
  height: 14px;
  border-radius: 4px;
`;

const CardValueShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 18px;
  border-radius: 4px;
`;

export const LeadDistributionConfigShimmer: React.FC = () => {
  return (
    <Container>
      <BackButtonShimmer />
      <TitleShimmer />
      <SubtitleShimmer />
      <AnalysisLinkShimmer />

      <ToolbarShimmer>
        <ButtonShimmer $width='auto' />
        <ButtonShimmer $width='auto' />
      </ToolbarShimmer>

      <CardShimmer>
        <CardHeaderShimmer>
          <CardTitleShimmer />
          <CardActionsShimmer>
            <CardActionBtnShimmer />
            <CardActionBtnShimmer />
          </CardActionsShimmer>
        </CardHeaderShimmer>
        <CardGridShimmer>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <CardItemShimmer key={i}>
              <CardLabelShimmer />
              <CardValueShimmer />
            </CardItemShimmer>
          ))}
        </CardGridShimmer>
      </CardShimmer>

      <CardShimmer>
        <CardHeaderShimmer>
          <CardTitleShimmer $width='140px' />
          <CardActionsShimmer>
            <CardActionBtnShimmer />
            <CardActionBtnShimmer />
          </CardActionsShimmer>
        </CardHeaderShimmer>
        <CardGridShimmer>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <CardItemShimmer key={i}>
              <CardLabelShimmer />
              <CardValueShimmer />
            </CardItemShimmer>
          ))}
        </CardGridShimmer>
      </CardShimmer>
    </Container>
  );
};
