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
  padding: 24px;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 16px;
  }
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${p => p.theme.colors.border};
  @media (max-width: 480px) {
    margin-bottom: 24px;
    padding-bottom: 16px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

const BackButtonShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 44px;
  border-radius: 8px;
  flex-shrink: 0;
  @media (max-width: 480px) {
    height: 48px;
  }
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 320px;
  max-width: 100%;
  height: 32px;
  @media (max-width: 768px) {
    width: 260px;
    height: 28px;
  }
  @media (max-width: 480px) {
    width: 220px;
    height: 26px;
  }
`;

const SubtitleShimmer = styled(ShimmerBase)`
  width: 90%;
  max-width: 480px;
  height: 18px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  @media (max-width: 480px) {
    gap: 24px;
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
  @media (max-width: 480px) {
    margin-bottom: 24px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${p => p.theme.colors.border};
`;

const SectionIconShimmer = styled(ShimmerBase)`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  flex-shrink: 0;
`;

const SectionTitleShimmer = styled(ShimmerBase)`
  width: 160px;
  height: 22px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const LabelShimmer = styled(ShimmerBase)`
  width: 180px;
  height: 18px;
  margin-bottom: 8px;
  border-radius: 4px;
`;

const InputShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 44px;
  border-radius: 8px;
  @media (max-width: 480px) {
    height: 48px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  gap: 20px;
  @media (min-width: 560px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const CheckboxShimmer = styled(ShimmerBase)`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
`;

const CheckboxLabelShimmer = styled(ShimmerBase)`
  width: 240px;
  height: 18px;
`;

const SaveButtonShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 48px;
  border-radius: 8px;
  margin-top: 8px;
`;

export const LeadDistributionFormShimmer: React.FC = () => {
  return (
    <Container>
      <Header>
        <HeaderTop>
          <TitleSection>
            <TitleShimmer />
            <SubtitleShimmer />
          </TitleSection>
          <BackButtonShimmer />
        </HeaderTop>
      </Header>

      <Body>
        {/* Escopo (funil) */}
        <Section>
          <SectionHeader>
            <SectionIconShimmer />
            <SectionTitleShimmer $width='80px' />
          </SectionHeader>
          <FormGroup>
            <LabelShimmer />
            <InputShimmer />
          </FormGroup>
        </Section>

        {/* Distribuição */}
        <Section>
          <SectionHeader>
            <SectionIconShimmer />
            <SectionTitleShimmer $width='140px' />
          </SectionHeader>
          <FormGrid>
            <FormGroup>
              <LabelShimmer $width='160px' />
              <InputShimmer />
            </FormGroup>
          </FormGrid>
        </Section>

        {/* SLA e alertas */}
        <Section>
          <SectionHeader>
            <SectionIconShimmer />
            <SectionTitleShimmer $width='120px' />
          </SectionHeader>
          <FormGrid>
            <FormGroup>
              <LabelShimmer $width='140px' />
              <InputShimmer />
            </FormGroup>
            <FormGroup>
              <LabelShimmer $width='130px' />
              <InputShimmer />
            </FormGroup>
            <FormGroup>
              <LabelShimmer $width='120px' />
              <InputShimmer />
            </FormGroup>
            <FormGroup>
              <LabelShimmer $width='150px' />
              <InputShimmer />
            </FormGroup>
          </FormGrid>
        </Section>

        {/* Checkboxes */}
        <Section>
          <CheckboxRow>
            <CheckboxShimmer />
            <CheckboxLabelShimmer />
          </CheckboxRow>
          <CheckboxRow>
            <CheckboxShimmer />
            <CheckboxLabelShimmer $width='200px' />
          </CheckboxRow>
          <CheckboxRow>
            <CheckboxShimmer />
            <CheckboxLabelShimmer $width='220px' />
          </CheckboxRow>
        </Section>

        <SaveButtonShimmer />
      </Body>
    </Container>
  );
};
