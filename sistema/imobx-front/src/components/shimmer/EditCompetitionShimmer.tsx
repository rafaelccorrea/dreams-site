import React from 'react';
import styled, { keyframes } from 'styled-components';

export const EditCompetitionShimmer: React.FC = () => {
  return (
    <Container>
      {/* Header Shimmer */}
      <HeaderShimmer>
        <HeaderContent>
          <TitleShimmer />
          <SubtitleShimmer />
        </HeaderContent>
        <BackButtonShimmer />
      </HeaderShimmer>

      {/* Informações Básicas */}
      <FormSection>
        <SectionHeaderShimmer>
          <SectionTitleShimmer />
          <SectionDescShimmer />
        </SectionHeaderShimmer>
        <FormRow>
          <FieldShimmer />
          <FieldShimmer />
        </FormRow>
        <FieldShimmer style={{ height: '100px' }} />
      </FormSection>

      {/* Período */}
      <FormSection>
        <SectionHeaderShimmer>
          <SectionTitleShimmer />
          <SectionDescShimmer />
        </SectionHeaderShimmer>
        <FormRow>
          <FieldShimmer />
          <FieldShimmer />
        </FormRow>
      </FormSection>

      {/* Configurações */}
      <FormSection>
        <SectionHeaderShimmer>
          <SectionTitleShimmer />
          <SectionDescShimmer />
        </SectionHeaderShimmer>
        <FormRow>
          <FieldShimmer />
          <FieldShimmer />
        </FormRow>
        <CheckboxGroup>
          <CheckboxShimmer />
          <CheckboxShimmer />
          <CheckboxShimmer />
        </CheckboxGroup>
      </FormSection>

      {/* Actions */}
      <ActionsShimmer>
        <ButtonShimmer style={{ width: '100px' }} />
        <ButtonShimmer style={{ width: '150px' }} />
      </ActionsShimmer>
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
  padding: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
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
  border-radius: 0.5rem;
`;

const HeaderShimmer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 250px;
  height: 32px;
  margin-bottom: 0.5rem;
`;

const SubtitleShimmer = styled(ShimmerBase)`
  width: 350px;
  height: 20px;
`;

const BackButtonShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 40px;
`;

const FormSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionHeaderShimmer = styled.div`
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SectionTitleShimmer = styled(ShimmerBase)`
  width: 180px;
  height: 20px;
  margin-bottom: 8px;
`;

const SectionDescShimmer = styled(ShimmerBase)`
  width: 280px;
  height: 14px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FieldShimmer = styled(ShimmerBase)`
  height: 48px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const CheckboxShimmer = styled(ShimmerBase)`
  width: 250px;
  height: 20px;
`;

const ActionsShimmer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  margin-top: 24px;
`;

const ButtonShimmer = styled(ShimmerBase)`
  height: 40px;
`;

export default EditCompetitionShimmer;
