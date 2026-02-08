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

export const MCMVLeadsShimmer: React.FC = () => {
  return (
    <Container>
      {/* Header Shimmer */}
      <HeaderShimmer>
        <HeaderContent>
          <TitleShimmer />
          <SubtitleShimmer />
        </HeaderContent>
        <ButtonShimmer />
      </HeaderShimmer>

      {/* Leads Grid Shimmer */}
      <LeadsGrid>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <LeadCard key={i}>
            <CardHeader>
              <NameShimmer />
              <ScoreBadgeShimmer />
            </CardHeader>

            <CardContent>
              <LineShimmer
                style={{ width: '80%', height: '16px', marginBottom: '8px' }}
              />
              <LineShimmer
                style={{ width: '60%', height: '14px', marginBottom: '8px' }}
              />
              <LineShimmer
                style={{ width: '70%', height: '14px', marginBottom: '12px' }}
              />

              <InfoRow>
                <LineShimmer style={{ width: '100px', height: '14px' }} />
                <LineShimmer style={{ width: '80px', height: '14px' }} />
              </InfoRow>
            </CardContent>

            <StatusBadgeShimmer />

            <ActionsRow>
              <ActionButtonShimmer style={{ flex: 1 }} />
              <ActionButtonShimmer />
            </ActionsRow>
          </LeadCard>
        ))}
      </LeadsGrid>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 24px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const HeaderShimmer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 300px;
  height: 40px;
  margin-bottom: 8px;
  border-radius: 8px;
`;

const SubtitleShimmer = styled(ShimmerBase)`
  width: 400px;
  height: 24px;
  border-radius: 8px;
`;

const ButtonShimmer = styled(ShimmerBase)`
  width: 120px;
  height: 44px;
  border-radius: 8px;
`;

const LeadsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeadCard = styled.div`
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
  align-items: center;
  margin-bottom: 16px;
`;

const NameShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 24px;
  border-radius: 6px;
`;

const ScoreBadgeShimmer = styled(ShimmerBase)`
  width: 60px;
  height: 28px;
  border-radius: 14px;
`;

const CardContent = styled.div`
  margin-bottom: 16px;
`;

const LineShimmer = styled(ShimmerBase)``;

const InfoRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
`;

const StatusBadgeShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 24px;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButtonShimmer = styled(ShimmerBase)`
  height: 40px;
  border-radius: 8px;

  @media (max-width: 768px) {
    height: 36px;
  }
`;

export default MCMVLeadsShimmer;
