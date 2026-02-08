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
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$borderRadius || '4px'};
  margin: ${props => props.$margin || '0'};
`;

const PageContainer = styled.div`
  padding: 24px;
  width: 100%;
  background: ${props => props.theme.colors.background};

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const TableContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TableHeader = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: 16px;
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  vertical-align: middle;
`;

const PropertyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PropertyAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  flex-shrink: 0;
`;

const PropertyDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const InspectionListShimmer: React.FC = () => {
  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShimmerBase $width='32px' $height='32px' $borderRadius='8px' />
          <ShimmerBase $width='200px' $height='40px' $borderRadius='8px' />
          <ShimmerBase $width='80px' $height='24px' $borderRadius='20px' />
        </div>
        <ShimmerBase $width='160px' $height='48px' $borderRadius='10px' />
      </PageHeader>

      {/* Controls */}
      <Controls>
        <SearchBox>
          <ShimmerBase $width='100%' $height='48px' $borderRadius='10px' />
        </SearchBox>
        <ShimmerBase $width='120px' $height='48px' $borderRadius='10px' />
      </Controls>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Título</TableHeader>
              <TableHeader>Tipo</TableHeader>
              <TableHeader>Propriedade</TableHeader>
              <TableHeader>Data Agendada</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader style={{ textAlign: 'center' }}>Ações</TableHeader>
            </TableRow>
          </TableHead>
          <tbody>
            {Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <PropertyDetails>
                    <ShimmerBase
                      $width='200px'
                      $height='18px'
                      $borderRadius='4px'
                    />
                    <ShimmerBase
                      $width='150px'
                      $height='14px'
                      $borderRadius='4px'
                    />
                  </PropertyDetails>
                </TableCell>
                <TableCell>
                  <ShimmerBase
                    $width='80px'
                    $height='24px'
                    $borderRadius='6px'
                  />
                </TableCell>
                <TableCell>
                  <PropertyInfo>
                    <PropertyAvatar>
                      <ShimmerBase
                        $width='100%'
                        $height='100%'
                        $borderRadius='6px'
                      />
                    </PropertyAvatar>
                    <PropertyDetails>
                      <ShimmerBase
                        $width='180px'
                        $height='18px'
                        $borderRadius='4px'
                      />
                      <ShimmerBase
                        $width='100px'
                        $height='14px'
                        $borderRadius='4px'
                      />
                    </PropertyDetails>
                  </PropertyInfo>
                </TableCell>
                <TableCell>
                  <ShimmerBase
                    $width='140px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </TableCell>
                <TableCell>
                  <ShimmerBase
                    $width='100px'
                    $height='24px'
                    $borderRadius='20px'
                  />
                </TableCell>
                <TableCell>
                  <Actions>
                    <ShimmerBase
                      $width='32px'
                      $height='32px'
                      $borderRadius='8px'
                    />
                    <ShimmerBase
                      $width='32px'
                      $height='32px'
                      $borderRadius='8px'
                    />
                    <ShimmerBase
                      $width='32px'
                      $height='32px'
                      $borderRadius='8px'
                    />
                  </Actions>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>

        {/* Pagination */}
        <Pagination>
          <ShimmerBase $width='200px' $height='16px' $borderRadius='4px' />
          <PaginationButtons>
            <ShimmerBase $width='80px' $height='32px' $borderRadius='8px' />
            <ShimmerBase $width='80px' $height='32px' $borderRadius='8px' />
          </PaginationButtons>
        </Pagination>
      </TableContainer>
    </PageContainer>
  );
};

export default InspectionListShimmer;
