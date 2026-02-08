import React from 'react';
import styled, { keyframes } from 'styled-components';

export const ManageRewardsShimmer: React.FC = () => {
  return (
    <Container>
      {/* Header */}
      <HeaderSection>
        <TitleShimmer />
        <SubtitleShimmer />
      </HeaderSection>

      {/* Estatísticas */}
      <StatsGrid>
        {[1, 2, 3, 4].map(i => (
          <StatCard key={i}>
            <LineShimmer style={{ width: '140px', height: '14px' }} />
            <LineShimmer
              style={{ width: '80px', height: '32px', marginTop: '8px' }}
            />
          </StatCard>
        ))}
      </StatsGrid>

      {/* Controles */}
      <ControlsSection>
        <ButtonShimmer style={{ width: '150px', height: '44px' }} />
        <ButtonShimmer style={{ width: '180px', height: '44px' }} />
      </ControlsSection>

      {/* Tabela */}
      <TableContainer>
        <TableHeader>
          <LineShimmer style={{ width: '100px', height: '14px' }} />
          <LineShimmer style={{ width: '100px', height: '14px' }} />
          <LineShimmer style={{ width: '80px', height: '14px' }} />
          <LineShimmer style={{ width: '80px', height: '14px' }} />
          <LineShimmer style={{ width: '80px', height: '14px' }} />
          <LineShimmer style={{ width: '80px', height: '14px' }} />
          <LineShimmer style={{ width: '100px', height: '14px' }} />
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <TableRow key={i}>
              <RewardCell>
                <IconShimmer />
                <div>
                  <LineShimmer style={{ width: '150px', height: '16px' }} />
                  <LineShimmer
                    style={{ width: '80px', height: '14px', marginTop: '4px' }}
                  />
                </div>
              </RewardCell>
              <LineShimmer style={{ width: '120px', height: '14px' }} />
              <LineShimmer
                style={{
                  width: '100px',
                  height: '24px',
                  borderRadius: '9999px',
                }}
              />
              <LineShimmer style={{ width: '80px', height: '14px' }} />
              <LineShimmer style={{ width: '40px', height: '14px' }} />
              <LineShimmer
                style={{
                  width: '90px',
                  height: '24px',
                  borderRadius: '9999px',
                }}
              />
              <ActionsCell>
                <ActionButton />
                <ActionButton />
                <ActionButton />
              </ActionsCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
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

const LineShimmer = styled(ShimmerBase)``;

const ButtonShimmer = styled(ShimmerBase)``;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 300px;
  height: 32px;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    width: 200px;
    height: 24px;
  }
`;

const SubtitleShimmer = styled(ShimmerBase)`
  width: 400px;
  height: 16px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  padding: 1.5rem;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 1rem;
`;

const ControlsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TableContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 1rem;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.2fr 1fr 1fr 1fr 1.5fr;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 968px) {
    display: none;
  }
`;

const TableBody = styled.div``;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.2fr 1fr 1fr 1fr 1.5fr;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const RewardCell = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconShimmer = styled(ShimmerBase)`
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  flex-shrink: 0;
`;

const ActionsCell = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(ShimmerBase)`
  width: 36px;
  height: 36px;
`;
