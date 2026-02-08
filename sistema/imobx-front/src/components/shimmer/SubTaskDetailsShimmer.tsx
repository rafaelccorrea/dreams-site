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
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.background};
`;

const Header = styled.div`
  padding: 24px 36px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.background},
    ${props => props.theme.colors.backgroundSecondary}
  );
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 16px;
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const BackButtonShimmer = styled(ShimmerBase)`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  flex-shrink: 0;
`;

const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 60%;
  height: 32px;
  margin-bottom: 8px;
`;

const BadgeShimmer = styled(ShimmerBase)`
  width: 120px;
  height: 24px;
  border-radius: 12px;
  display: inline-block;
`;

const ActionsShimmer = styled.div`
  display: flex;
  gap: 12px;
  flex-shrink: 0;
`;

const ButtonShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 40px;
  border-radius: 8px;
`;

const Content = styled.div`
  flex: 1;
  padding: 32px 36px;
  overflow-y: auto;
  min-height: 0;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const TabsShimmer = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  margin-bottom: 24px;
`;

const TabShimmer = styled(ShimmerBase)`
  width: 120px;
  height: 40px;
  border-radius: 8px;
  margin-right: 16px;
`;

const DetailsSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitleShimmer = styled(ShimmerBase)`
  width: 150px;
  height: 24px;
  margin-bottom: 20px;
`;

const InfoRowShimmer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const LabelShimmer = styled(ShimmerBase)`
  width: 120px;
  height: 16px;
  flex-shrink: 0;
`;

const ValueShimmer = styled(ShimmerBase)`
  flex: 1;
  height: 16px;
`;

const DescriptionShimmer = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const DescriptionLineShimmer = styled(ShimmerBase)`
  height: 16px;
  margin-bottom: 8px;

  &:last-child {
    width: 60%;
    margin-bottom: 0;
  }
`;

export const SubTaskDetailsShimmer: React.FC = () => {
  return (
    <PageContainer>
      <Header>
        <BackButtonShimmer />
        <HeaderContent>
          <TitleShimmer />
          <BadgeShimmer />
        </HeaderContent>
        <ActionsShimmer>
          <ButtonShimmer />
          <ButtonShimmer />
          <ButtonShimmer />
        </ActionsShimmer>
      </Header>

      <Content>
        <TabsShimmer>
          <TabShimmer />
          <TabShimmer />
        </TabsShimmer>

        <DetailsSection>
          <SectionTitleShimmer />

          {Array.from({ length: 6 }).map((_, index) => (
            <InfoRowShimmer key={index}>
              <LabelShimmer />
              <ValueShimmer />
            </InfoRowShimmer>
          ))}

          <DescriptionShimmer>
            <SectionTitleShimmer
              $width='120px'
              $height='20px'
              $margin='0 0 16px 0'
            />
            <DescriptionLineShimmer />
            <DescriptionLineShimmer />
            <DescriptionLineShimmer />
          </DescriptionShimmer>
        </DetailsSection>
      </Content>
    </PageContainer>
  );
};
