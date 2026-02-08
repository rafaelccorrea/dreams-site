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

export const MCMVBlacklistShimmer: React.FC = () => {
  return (
    <Container>
      {/* Header Shimmer */}
      <HeaderShimmer>
        <TitleShimmer />
        <ButtonsRow>
          <ButtonShimmer />
          <ButtonShimmer />
        </ButtonsRow>
      </HeaderShimmer>

      {/* Table Shimmer */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCellShimmer />
            <TableHeaderCellShimmer />
            <TableHeaderCellShimmer />
            <TableHeaderCellShimmer />
            <TableHeaderCellShimmer />
            <TableHeaderCellShimmer />
          </TableRow>
        </TableHeader>
        <tbody>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <TableRow key={i}>
              <TableCellShimmer>
                <TableCellContent style={{ width: '60%' }} />
              </TableCellShimmer>
              <TableCellShimmer>
                <TableCellContent style={{ width: '70%' }} />
              </TableCellShimmer>
              <TableCellShimmer>
                <TableCellContent style={{ width: '50%' }} />
              </TableCellShimmer>
              <TableCellShimmer>
                <TableCellContent style={{ width: '80%' }} />
              </TableCellShimmer>
              <TableCellShimmer>
                <TableCellContent style={{ width: '40%' }} />
              </TableCellShimmer>
              <TableCellShimmer>
                <ActionsShimmer>
                  <ActionButtonShimmer />
                  <ActionButtonShimmer />
                </ActionsShimmer>
              </TableCellShimmer>
            </TableRow>
          ))}
        </tbody>
      </Table>
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

const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

const ButtonShimmer = styled(ShimmerBase)`
  width: 150px;
  height: 44px;
  border-radius: 8px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
`;

const TableHeader = styled.thead`
  background: ${props => props.theme.colors.background};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const TableHeaderCellShimmer = styled.th`
  padding: 16px;
  text-align: left;
`;

const TableCellShimmer = styled.td`
  padding: 16px;
`;

const TableCellContent = styled(ShimmerBase)`
  width: 80%;
  height: 16px;
  border-radius: 4px;
`;

const ActionsShimmer = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButtonShimmer = styled(ShimmerBase)`
  width: 32px;
  height: 32px;
  border-radius: 6px;
`;

export default MCMVBlacklistShimmer;
