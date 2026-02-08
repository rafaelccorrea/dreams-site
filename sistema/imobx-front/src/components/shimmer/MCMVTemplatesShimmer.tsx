import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animação do shimmer
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

// Componente base do shimmer
const ShimmerBase = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary || '#f0f0f0'} 0%,
    ${props => props.theme.colors.hover || '#e8e8e8'} 50%,
    ${props => props.theme.colors.backgroundSecondary || '#f0f0f0'} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 8px;
`;

export const MCMVTemplatesShimmer: React.FC = () => {
  return (
    <Container>
      {/* Header Shimmer */}
      <HeaderShimmer>
        <TitleShimmer />
        <ButtonShimmer />
      </HeaderShimmer>

      {/* Templates Grid Shimmer */}
      <TemplatesGrid>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <TemplateCard key={i}>
            <CardHeader>
              <NameShimmer />
              <TypeBadgeShimmer />
            </CardHeader>

            <DescriptionShimmer />

            <ContentShimmer>
              <LineShimmer
                style={{ width: '100%', height: '14px', marginBottom: '8px' }}
              />
              <LineShimmer
                style={{ width: '95%', height: '14px', marginBottom: '8px' }}
              />
              <LineShimmer style={{ width: '90%', height: '14px' }} />
            </ContentShimmer>

            <VariablesShimmer>
              <VariableTagShimmer />
              <VariableTagShimmer />
              <VariableTagShimmer />
            </VariablesShimmer>

            <ActionsRow>
              <ActionButtonShimmer style={{ flex: 1 }} />
              <ActionButtonShimmer />
              <ActionButtonShimmer />
            </ActionsRow>
          </TemplateCard>
        ))}
      </TemplatesGrid>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const HeaderShimmer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 250px;
  height: 32px;
  border-radius: 8px;
`;

const ButtonShimmer = styled(ShimmerBase)`
  width: 180px;
  height: 44px;
  border-radius: 8px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TemplateCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 16px;
`;

const NameShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 24px;
  border-radius: 6px;
  flex: 1;
`;

const TypeBadgeShimmer = styled(ShimmerBase)`
  width: 80px;
  height: 24px;
  border-radius: 12px;
  margin-left: 8px;
`;

const DescriptionShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const ContentShimmer = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
`;

const LineShimmer = styled(ShimmerBase)``;

const VariablesShimmer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
`;

const VariableTagShimmer = styled(ShimmerBase)`
  width: 80px;
  height: 24px;
  border-radius: 6px;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButtonShimmer = styled(ShimmerBase)`
  height: 40px;
  border-radius: 8px;

  @media (max-width: 768px) {
    height: 36px;
  }
`;

export default MCMVTemplatesShimmer;
