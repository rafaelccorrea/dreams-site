import React from 'react';
import styled, { keyframes } from 'styled-components';

export const EditUserShimmer: React.FC = () => {
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
          <IconShimmer />
          <SectionTitleShimmer />
        </SectionHeaderShimmer>
        {[1, 2, 3, 4, 5].map(i => (
          <FieldGroup key={i}>
            <LabelShimmer />
            <InputShimmer />
          </FieldGroup>
        ))}
      </FormSection>

      {/* Permissões */}
      <FormSection>
        <SectionHeaderShimmer>
          <IconShimmer />
          <SectionTitleShimmer />
        </SectionHeaderShimmer>

        {/* Info Box */}
        <InfoBoxShimmer />

        {/* Profile Selector */}
        <FieldGroup>
          <LabelShimmer />
          <InputShimmer />
        </FieldGroup>

        {/* Search */}
        <FieldGroup>
          <LabelShimmer />
          <InputShimmer />
        </FieldGroup>

        {/* Botões de Ação Rápida */}
        <ActionsRow>
          <ActionButtonShimmer />
          <ActionButtonShimmer />
        </ActionsRow>

        {/* Permissions Grid */}
        <PermissionsGrid>
          {[1, 2, 3].map(category => (
            <PermissionCategory key={category}>
              <CategoryHeader>
                <IconSmallShimmer />
                <CategoryTitleShimmer />
              </CategoryHeader>
              {[1, 2, 3].map(permission => (
                <PermissionItem key={permission}>
                  <CheckboxShimmer />
                  <PermissionInfo>
                    <PermissionNameShimmer />
                    <PermissionDescShimmer />
                  </PermissionInfo>
                </PermissionItem>
              ))}
            </PermissionCategory>
          ))}
        </PermissionsGrid>
      </FormSection>

      {/* Tags */}
      <FormSection>
        <SectionHeaderShimmer>
          <IconShimmer />
          <SectionTitleShimmer />
        </SectionHeaderShimmer>

        <InfoBoxShimmer />
        <TagSelectorShimmer />
      </FormSection>

      {/* Actions */}
      <ActionsBar>
        <TextShimmer />
        <SaveButtonShimmer />
      </ActionsBar>
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
  min-height: 100vh;
  background: ${props => props.theme.colors.background};

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
  width: 280px;
  height: 36px;
  margin-bottom: 0.5rem;
`;

const SubtitleShimmer = styled(ShimmerBase)`
  width: 400px;
  height: 20px;
`;

const BackButtonShimmer = styled(ShimmerBase)`
  width: 120px;
  height: 44px;
`;

const FormSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const SectionHeaderShimmer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const IconShimmer = styled(ShimmerBase)`
  width: 40px;
  height: 40px;
  border-radius: 10px;
`;

const SectionTitleShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 24px;
`;

const FieldGroup = styled.div`
  margin-bottom: 28px;
`;

const LabelShimmer = styled(ShimmerBase)`
  width: 120px;
  height: 16px;
  margin-bottom: 8px;
`;

const InputShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 44px;
`;

const InfoBoxShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 60px;
  margin-bottom: 24px;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const ActionButtonShimmer = styled(ShimmerBase)`
  width: 150px;
  height: 40px;
`;

const PermissionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PermissionCategory = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const IconSmallShimmer = styled(ShimmerBase)`
  width: 32px;
  height: 32px;
  border-radius: 8px;
`;

const CategoryTitleShimmer = styled(ShimmerBase)`
  width: 140px;
  height: 18px;
`;

const PermissionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const CheckboxShimmer = styled(ShimmerBase)`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  flex-shrink: 0;
`;

const PermissionInfo = styled.div`
  flex: 1;
`;

const PermissionNameShimmer = styled(ShimmerBase)`
  width: 150px;
  height: 14px;
  margin-bottom: 4px;
`;

const PermissionDescShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 12px;
`;

const TagSelectorShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 120px;
`;

const ActionsBar = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TextShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 20px;
`;

const SaveButtonShimmer = styled(ShimmerBase)`
  width: 180px;
  height: 48px;
`;

export default EditUserShimmer;
