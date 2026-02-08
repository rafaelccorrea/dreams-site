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

const Container = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 250px;
  height: 28px;
`;

const ButtonShimmer = styled(ShimmerBase)`
  width: 40px;
  height: 40px;
  border-radius: 8px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StatLabelShimmer = styled(ShimmerBase)`
  width: 60%;
  height: 14px;
`;

const StatValueShimmer = styled(ShimmerBase)`
  width: 80px;
  height: 32px;
`;

const Section = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const SectionTitleShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 20px;
  margin-bottom: 16px;
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

const TableCellShimmer = styled(ShimmerBase)`
  height: 16px;
`;

export const MetricsShimmer: React.FC = () => {
  return (
    <Container>
      <Header>
        <TitleShimmer />
        <ButtonShimmer />
      </Header>

      <StatsGrid>
        {Array.from({ length: 6 }).map((_, index) => (
          <StatCard key={index}>
            <StatLabelShimmer />
            <StatValueShimmer />
          </StatCard>
        ))}
      </StatsGrid>

      <Section>
        <SectionTitleShimmer />
        <Table>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCellShimmer $width='100%' />
              <TableCellShimmer $width='60px' />
              <TableCellShimmer $width='60px' />
              <TableCellShimmer $width='60px' />
              <TableCellShimmer $width='60px' />
              <TableCellShimmer $width='60px' />
            </TableRow>
          ))}
        </Table>
      </Section>
    </Container>
  );
};
