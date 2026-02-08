import React from 'react';
import styled, { keyframes } from 'styled-components';

export const SettingsShimmer: React.FC = () => {
  return (
    <Container>
      {/* Header Shimmer */}
      <HeaderShimmer>
        <TitleShimmer />
        <SubtitleShimmer />
      </HeaderShimmer>

      {/* Settings Cards */}
      {[1, 2, 3, 4, 5, 6].map(i => (
        <CardShimmer key={i}>
          <CardHeaderShimmer>
            <IconLineShimmer />
          </CardHeaderShimmer>
          <CardContentShimmer>
            <RowShimmer>
              <LabelShimmer />
              <InputShimmer />
            </RowShimmer>
            <RowShimmer>
              <LabelShimmer />
              <InputShimmer />
            </RowShimmer>
            <RowShimmer>
              <LabelShimmer />
              <InputShimmer />
            </RowShimmer>
          </CardContentShimmer>
        </CardShimmer>
      ))}

      {/* Save Button Shimmer */}
      <ButtonShimmer />
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
  padding: 24px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
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
  border-radius: 8px;
`;

const HeaderShimmer = styled.div`
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 320px;
  height: 36px;
  margin-bottom: 12px;
`;

const SubtitleShimmer = styled(ShimmerBase)`
  width: 480px;
  height: 20px;
  max-width: 100%;
`;

const CardShimmer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    margin-bottom: 16px;
  }
`;

const CardHeaderShimmer = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border}40;
`;

const IconLineShimmer = styled(ShimmerBase)`
  width: 220px;
  height: 28px;
`;

const CardContentShimmer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RowShimmer = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const LabelShimmer = styled(ShimmerBase)`
  height: 20px;
`;

const InputShimmer = styled(ShimmerBase)`
  height: 44px;
`;

const ButtonShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 52px;
  margin-top: 8px;
`;
