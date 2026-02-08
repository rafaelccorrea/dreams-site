import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animação do shimmer
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
  $borderRadius?: string;
  $margin?: string;
}>`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary || '#f0f0f0'} 25%,
    ${props => props.theme.colors.border || '#e0e0e0'} 50%,
    ${props => props.theme.colors.backgroundSecondary || '#f0f0f0'} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$borderRadius || '8px'};
  margin: ${props => props.$margin || '0'};
`;

const PageContainer = styled.div`
  padding: 20px 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 24px;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
`;

const BackButtonShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 40px;
  border-radius: 8px;
  flex-shrink: 0;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 60%;
  height: 32px;
`;

const SubtitleShimmer = styled(ShimmerBase)`
  width: 80%;
  height: 20px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const AddButtonShimmer = styled(ShimmerBase)`
  width: 140px;
  height: 40px;
  border-radius: 8px;
`;

const TeamProjectSelector = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 24px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SelectorShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 40px;
  border-radius: 8px;
`;

const InfoBoxShimmer = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
`;

const InfoIconShimmer = styled(ShimmerBase)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const InfoTextShimmer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoLineShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 16px;

  &:first-child {
    width: 40%;
  }
`;

const RulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RuleCardShimmer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ColorPreviewShimmer = styled(ShimmerBase)`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  flex-shrink: 0;
`;

const RuleInfoShimmer = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RuleNameShimmer = styled(ShimmerBase)`
  width: 60%;
  height: 20px;
`;

const RuleDescriptionShimmer = styled(ShimmerBase)`
  width: 80%;
  height: 16px;
`;

const RuleDetailsShimmer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const RuleDetailShimmer = styled(ShimmerBase)`
  width: 120px;
  height: 14px;
`;

const RuleActionsShimmer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
`;

const ActionButtonShimmer = styled(ShimmerBase)`
  width: 36px;
  height: 36px;
  border-radius: 6px;
`;

const ToggleButtonShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 36px;
  border-radius: 6px;
`;

export const ColorRulesShimmer: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader>
        <HeaderTop>
          <HeaderLeft>
            <BackButtonShimmer />
            <TitleSection>
              <TitleShimmer />
              <SubtitleShimmer />
            </TitleSection>
          </HeaderLeft>
          <HeaderRight>
            <AddButtonShimmer />
          </HeaderRight>
        </HeaderTop>

        <TeamProjectSelector>
          <SelectorShimmer />
          <SelectorShimmer />
          <SelectorShimmer />
        </TeamProjectSelector>
      </PageHeader>

      <InfoBoxShimmer>
        <InfoIconShimmer />
        <InfoTextShimmer>
          <InfoLineShimmer />
          <InfoLineShimmer />
          <InfoLineShimmer $width='70%' />
        </InfoTextShimmer>
      </InfoBoxShimmer>

      <RulesList>
        {Array.from({ length: 3 }).map((_, index) => (
          <RuleCardShimmer key={index}>
            <ColorPreviewShimmer />
            <RuleInfoShimmer>
              <RuleNameShimmer />
              <RuleDescriptionShimmer />
              <RuleDetailsShimmer>
                <RuleDetailShimmer />
                <RuleDetailShimmer />
                <RuleDetailShimmer />
                <RuleDetailShimmer />
              </RuleDetailsShimmer>
            </RuleInfoShimmer>
            <RuleActionsShimmer>
              <ToggleButtonShimmer />
              <ActionButtonShimmer />
              <ActionButtonShimmer />
            </RuleActionsShimmer>
          </RuleCardShimmer>
        ))}
      </RulesList>
    </PageContainer>
  );
};
