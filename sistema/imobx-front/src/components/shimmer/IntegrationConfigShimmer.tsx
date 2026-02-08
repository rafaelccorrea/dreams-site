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
  padding: 24px;
  width: 100%;
`;

const BackButtonShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 40px;
  margin-bottom: 24px;
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 320px;
  height: 32px;
  margin-bottom: 8px;
`;

const SubtitleShimmer = styled(ShimmerBase)`
  width: 90%;
  max-width: 560px;
  height: 20px;
  margin-bottom: 32px;
`;

const InfoBoxShimmer = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  margin-bottom: 32px;
  display: flex;
  gap: 12px;
`;

const InfoIconShimmer = styled(ShimmerBase)`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  flex-shrink: 0;
`;

const InfoLinesShimmer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionShimmer = styled.div`
  margin-bottom: 32px;
`;

const SectionTitleShimmer = styled(ShimmerBase)`
  width: 180px;
  height: 24px;
  margin-bottom: 16px;
`;

const FormGroupShimmer = styled.div`
  margin-bottom: 20px;
`;

const LabelShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 18px;
  margin-bottom: 8px;
`;

const InputShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 44px;
`;

const CheckboxShimmer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const CheckboxBoxShimmer = styled(ShimmerBase)`
  width: 20px;
  height: 20px;
  border-radius: 4px;
`;

const CheckboxLabelShimmer = styled(ShimmerBase)`
  width: 260px;
  height: 20px;
`;

const SaveButtonShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 44px;
  margin-top: 8px;
`;

export const IntegrationConfigShimmer: React.FC = () => {
  return (
    <Container>
      <BackButtonShimmer />
      <TitleShimmer />
      <SubtitleShimmer />

      <InfoBoxShimmer>
        <InfoIconShimmer />
        <InfoLinesShimmer>
          <ShimmerBase $height='14px' />
          <ShimmerBase $height='14px' $width='80%' />
          <ShimmerBase $height='14px' $width='60%' />
        </InfoLinesShimmer>
      </InfoBoxShimmer>

      <SectionShimmer>
        <SectionTitleShimmer />
        <FormGroupShimmer>
          <LabelShimmer />
          <InputShimmer />
        </FormGroupShimmer>
        <FormGroupShimmer>
          <LabelShimmer />
          <InputShimmer />
        </FormGroupShimmer>
        <FormGroupShimmer>
          <LabelShimmer />
          <InputShimmer />
        </FormGroupShimmer>
        <FormGroupShimmer>
          <CheckboxShimmer>
            <CheckboxBoxShimmer />
            <CheckboxLabelShimmer />
          </CheckboxShimmer>
        </FormGroupShimmer>
      </SectionShimmer>

      <SaveButtonShimmer />
    </Container>
  );
};
