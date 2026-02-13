import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  SummaryContainer,
  SummaryCard,
  ActionsBar,
  LeftActions,
  RightActions,
  SearchContainer,
  UsersCard,
  UsersTable,
  TableHeader,
  TableRow,
  TableCell,
} from '../../styles/pages/UsersPageStyles';

// Animação do shimmer — adaptada ao tema (dark/light)
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const ShimmerBlock = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
  $maxWidth?: string;
}>`
  --shimmer-base: ${props =>
    props.theme.mode === 'dark'
      ? props.theme.colors.backgroundSecondary
      : '#e2e8f0'};
  --shimmer-highlight: ${props =>
    props.theme.mode === 'dark'
      ? props.theme.colors.border
      : '#cbd5e1'};
  background: linear-gradient(
    90deg,
    var(--shimmer-base) 0%,
    var(--shimmer-base) 40%,
    var(--shimmer-highlight) 50%,
    var(--shimmer-base) 60%,
    var(--shimmer-base) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s ease-in-out infinite;
  width: ${props => props.$width ?? '100%'};
  max-width: ${props => props.$maxWidth ?? 'none'};
  height: ${props => props.$height ?? '16px'};
  border-radius: ${props => props.$borderRadius ?? '8px'};
`;

// Header shimmer: título + subtítulo + botão
const HeaderTitleShimmer = styled(ShimmerBlock)`
  height: 32px;
  width: 180px;
  border-radius: 10px;
  margin-bottom: 10px;
`;
const HeaderSubtitleShimmer = styled(ShimmerBlock)`
  height: 20px;
  width: 320px;
  max-width: 100%;
  border-radius: 8px;
`;
const HeaderButtonShimmer = styled(ShimmerBlock)`
  height: 48px;
  width: 160px;
  border-radius: 16px;
  flex-shrink: 0;
`;

// Summary card shimmer (ícone + valor + label)
const SummaryIconShimmer = styled(ShimmerBlock)`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  margin-bottom: 16px;
  @media (max-width: 600px) {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
  }
`;
const SummaryValueShimmer = styled(ShimmerBlock)`
  height: 30px;
  width: 64px;
  border-radius: 8px;
  margin-bottom: 6px;
`;
const SummaryLabelShimmer = styled(ShimmerBlock)`
  height: 16px;
  width: 110px;
  border-radius: 6px;
`;

// Search bar — responsivo
const SearchBarShimmer = styled(ShimmerBlock)`
  height: 44px;
  width: 100%;
  min-width: 0;
  max-width: 400px;
  border-radius: 12px;
  @media (max-width: 768px) {
    max-width: none;
  }
`;
const FilterButtonShimmer = styled(ShimmerBlock)`
  height: 44px;
  width: 100px;
  border-radius: 12px;
`;

// Table row shimmer (avatar + 2 lines, depois blocos para função/status/etc)
const RowAvatarShimmer = styled(ShimmerBlock)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
`;
const RowBadgeShimmer = styled(ShimmerBlock)`
  height: 28px;
  width: 90px;
  border-radius: 8px;
`;
const RowSmallShimmer = styled(ShimmerBlock)`
  height: 20px;
  width: 70px;
  border-radius: 6px;
`;

export const UsersListShimmer: React.FC = () => {
  return (
    <PageContainer>
      <PageContent>
        <PageHeader>
          <PageTitleContainer>
            <div>
              <HeaderTitleShimmer />
              <HeaderSubtitleShimmer />
            </div>
            <HeaderButtonShimmer />
          </PageTitleContainer>
        </PageHeader>

        <SummaryContainer>
          {[
            { $type: 'total' as const },
            { $type: 'active' as const },
            { $type: 'inactive' as const },
            { $type: 'admin' as const },
          ].map((props, i) => (
            <SummaryCard key={i} $type={props.$type}>
              <SummaryIconShimmer />
              <SummaryValueShimmer />
              <SummaryLabelShimmer />
            </SummaryCard>
          ))}
        </SummaryContainer>

        <ActionsBar>
          <LeftActions>
            <SearchContainer>
              <SearchBarShimmer />
            </SearchContainer>
          </LeftActions>
          <RightActions>
            <FilterButtonShimmer />
          </RightActions>
        </ActionsBar>

        <UsersCard>
          <UsersTable>
            <TableHeader>
              <TableCell>
                <ShimmerBlock $height="14px" $width="80px" $borderRadius="6px" />
              </TableCell>
              <TableCell $align="center">
                <ShimmerBlock $height="14px" $width="50px" $borderRadius="6px" />
              </TableCell>
              <TableCell $align="center">
                <ShimmerBlock $height="14px" $width="50px" $borderRadius="6px" />
              </TableCell>
              <TableCell $align="center">
                <ShimmerBlock $height="14px" $width="70px" $borderRadius="6px" />
              </TableCell>
              <TableCell $align="center">
                <ShimmerBlock $height="14px" $width="90px" $borderRadius="6px" />
              </TableCell>
              <TableCell $align="center">
                <ShimmerBlock $height="14px" $width="50px" $borderRadius="6px" />
              </TableCell>
            </TableHeader>

            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
              <TableRow key={index} $isEven={index % 2 === 0}>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <RowAvatarShimmer />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <ShimmerBlock $height="14px" $width="140px" $borderRadius="6px" />
                      <ShimmerBlock $height="12px" $width="180px" $borderRadius="6px" />
                    </div>
                  </div>
                </TableCell>
                <TableCell $align="center">
                  <RowBadgeShimmer />
                </TableCell>
                <TableCell $align="center">
                  <RowBadgeShimmer />
                </TableCell>
                <TableCell $align="center">
                  <RowSmallShimmer />
                </TableCell>
                <TableCell $align="center">
                  <RowSmallShimmer />
                </TableCell>
                <TableCell $align="center">
                  <ShimmerBlock $height="32px" $width="32px" $borderRadius="8px" />
                </TableCell>
              </TableRow>
            ))}
          </UsersTable>
        </UsersCard>
      </PageContent>
    </PageContainer>
  );
};

export default UsersListShimmer;
