import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const ShimmerBase = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
  $margin?: string;
  $delay?: number;
}>`
  --shimmer-base: ${props =>
    props.theme?.mode === 'dark'
      ? (props.theme?.colors?.backgroundSecondary ?? '#2d3748')
      : '#e2e8f0'};
  --shimmer-mid: ${props =>
    props.theme?.mode === 'dark'
      ? (props.theme?.colors?.border ?? '#4a5568')
      : '#cbd5e1'};
  background: linear-gradient(
    90deg,
    var(--shimmer-base) 0%,
    var(--shimmer-base) 35%,
    var(--shimmer-mid) 50%,
    var(--shimmer-base) 65%,
    var(--shimmer-base) 100%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.8s ease-in-out infinite;
  animation-delay: ${props => (props.$delay ?? 0) * 0.06}s;
  width: ${props => props.$width ?? '100%'};
  height: ${props => props.$height ?? '20px'};
  border-radius: ${props => props.$borderRadius ?? '8px'};
  margin: ${props => props.$margin ?? '0'};
`;

const PageHeaderShimmer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
`;

const TitleRowShimmer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`;

const CardShimmer = styled.div`
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const TableHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr repeat(5, 60px) 100px;
  gap: 12px;
  padding: 16px 24px;
  background: ${p => p.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${p => p.theme.colors.border};
  align-items: center;
`;

const TableBodyRow = styled.div`
  display: grid;
  grid-template-columns: 1fr repeat(5, 60px) 100px;
  gap: 12px;
  padding: 14px 24px;
  border-bottom: 1px solid ${p => p.theme.colors.border};
  align-items: center;
  min-height: 56px;
`;

const PaginationBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid ${p => p.theme.colors.border};
  background: ${p => p.theme.colors.backgroundSecondary};
`;

export const KanbanPermissionsShimmer: React.FC = () => {
  const ROWS = 8;
  const PERM_COLS = 5;

  return (
    <>
      <PageHeaderShimmer>
        <ShimmerBase $width="40px" $height="40px" $borderRadius="10px" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <TitleRowShimmer>
            <ShimmerBase $width="28px" $height="28px" $borderRadius="8px" />
            <ShimmerBase $width="280px" $height="28px" $borderRadius="8px" />
          </TitleRowShimmer>
          <ShimmerBase
            $width="min(100%, 520px)"
            $height="16px"
            $borderRadius="6px"
            $margin="0"
          />
        </div>
      </PageHeaderShimmer>

      <div style={{ marginBottom: 24 }}>
        <ShimmerBase $width="80px" $height="14px" $borderRadius="4px" $margin="0 0 8px 0" />
        <ShimmerBase $width="min(100%, 400px)" $height="44px" $borderRadius="12px" />
      </div>
      <ShimmerBase $width="100%" $height="48px" $borderRadius="12px" $margin="0 0 16px 0" />
      <ShimmerBase $width="min(100%, 320px)" $height="42px" $borderRadius="10px" $margin="0 0 16px 0" />

      <CardShimmer>
        <TableHeaderRow>
          <ShimmerBase $width="120px" $height="16px" $borderRadius="6px" />
          {Array.from({ length: PERM_COLS }).map((_, i) => (
            <ShimmerBase
              key={i}
              $width="36px"
              $height="36px"
              $borderRadius="8px"
              $delay={i}
            />
          ))}
          <ShimmerBase $width="70px" $height="20px" $borderRadius="8px" />
        </TableHeaderRow>

        {Array.from({ length: ROWS }).map((_, rowIndex) => (
          <TableBodyRow key={rowIndex}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ShimmerBase
                $width="40px"
                $height="40px"
                $borderRadius="50%"
                $delay={rowIndex}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <ShimmerBase
                  $width="140px"
                  $height="16px"
                  $borderRadius="6px"
                  $margin="0 0 6px 0"
                  $delay={rowIndex + 1}
                />
                <ShimmerBase
                  $width="180px"
                  $height="14px"
                  $borderRadius="4px"
                  $delay={rowIndex + 2}
                />
              </div>
            </div>
            {Array.from({ length: PERM_COLS }).map((_, colIndex) => (
              <ShimmerBase
                key={colIndex}
                $width="20px"
                $height="20px"
                $borderRadius="6px"
                $delay={rowIndex + colIndex}
              />
            ))}
            <ShimmerBase
              $width="80px"
              $height="36px"
              $borderRadius="10px"
              $delay={rowIndex}
            />
          </TableBodyRow>
        ))}
        <PaginationBar>
          <ShimmerBase $width="140px" $height="16px" $borderRadius="4px" />
          <div style={{ display: 'flex', gap: 8 }}>
            <ShimmerBase $width="72px" $height="36px" $borderRadius="8px" />
            <ShimmerBase $width="64px" $height="36px" $borderRadius="8px" />
          </div>
        </PaginationBar>
      </CardShimmer>
    </>
  );
};

export default KanbanPermissionsShimmer;
