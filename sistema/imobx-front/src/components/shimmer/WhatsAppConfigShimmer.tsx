import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
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
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
`;

const HeaderShimmer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const TitleShimmer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const TitleLine = styled(ShimmerBase)`
  width: 400px;
  height: 32px;

  @media (max-width: 768px) {
    width: 100%;
    height: 28px;
  }
`;

const SubtitleLine = styled(ShimmerBase)`
  width: 500px;
  height: 20px;

  @media (max-width: 768px) {
    width: 100%;
    height: 18px;
  }
`;

const BackButtonShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 40px;
  flex-shrink: 0;
`;

const SectionShimmer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionHeaderShimmer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const IconShimmer = styled(ShimmerBase)`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  flex-shrink: 0;
`;

const SectionTitleShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 24px;
`;

const FormGroupShimmer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const LabelShimmer = styled(ShimmerBase)`
  width: 180px;
  height: 20px;
`;

const InputShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 44px;
`;

const ButtonRowShimmer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ButtonShimmer = styled(ShimmerBase)`
  width: 160px;
  height: 44px;
`;

export const WhatsAppConfigShimmer: React.FC = () => {
  return (
    <Container>
      <HeaderShimmer>
        <TitleShimmer>
          <TitleLine />
          <SubtitleLine />
        </TitleShimmer>
        <BackButtonShimmer />
      </HeaderShimmer>

      <SectionShimmer>
        <SectionHeaderShimmer>
          <IconShimmer />
          <SectionTitleShimmer />
        </SectionHeaderShimmer>
        <FormGroupShimmer>
          <LabelShimmer />
          <InputShimmer />
        </FormGroupShimmer>
        <FormGroupShimmer>
          <LabelShimmer />
          <InputShimmer />
        </FormGroupShimmer>
      </SectionShimmer>

      <SectionShimmer>
        <SectionHeaderShimmer>
          <IconShimmer />
          <SectionTitleShimmer />
        </SectionHeaderShimmer>
        <FormGroupShimmer>
          <LabelShimmer />
          <InputShimmer />
        </FormGroupShimmer>
        <FormGroupShimmer>
          <LabelShimmer />
          <InputShimmer />
        </FormGroupShimmer>
        <FormGroupShimmer>
          <LabelShimmer style={{ width: '150px' }} />
        </FormGroupShimmer>
      </SectionShimmer>

      <ButtonRowShimmer>
        <ButtonShimmer />
        <ButtonShimmer />
      </ButtonRowShimmer>
    </Container>
  );
};
