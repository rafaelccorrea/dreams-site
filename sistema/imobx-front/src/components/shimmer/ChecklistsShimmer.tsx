import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  PageContainer,
  PageHeader,
  PageTitleContainer,
  ControlsContainer,
  SearchContainer,
  ChecklistsGrid,
  ChecklistCard,
  CardHeader,
  CardMeta,
  ProgressBar,
  ProgressText,
} from '../../pages/styles/ChecklistsPage.styles';

// Animação de shimmer
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
  $radius?: string;
}>`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover || props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$radius || '8px'};
`;

const ShimmerTitle = styled(ShimmerBase)`
  width: 200px;
  height: 32px;
  margin-bottom: 8px;
`;

const ShimmerSubtitle = styled(ShimmerBase)`
  width: 300px;
  height: 18px;
`;

const ShimmerButton = styled(ShimmerBase)`
  width: 160px;
  height: 44px;
  border-radius: 8px;
`;

const ShimmerSearch = styled(ShimmerBase)`
  flex: 1;
  height: 44px;
  border-radius: 8px;
`;

const ShimmerFilterButton = styled(ShimmerBase)`
  width: 120px;
  height: 44px;
  border-radius: 8px;
`;

const ShimmerCardTitle = styled(ShimmerBase)`
  width: 70%;
  height: 20px;
  margin-bottom: 8px;
`;

const ShimmerBadge = styled(ShimmerBase)`
  width: 80px;
  height: 24px;
  border-radius: 12px;
`;

const ShimmerMetaLine = styled(ShimmerBase)`
  width: 100%;
  height: 14px;
  margin-bottom: 6px;
`;

const ShimmerMetaLineShort = styled(ShimmerBase)`
  width: 60%;
  height: 14px;
`;

const ShimmerStatusBadge = styled(ShimmerBase)`
  width: 100px;
  height: 24px;
  border-radius: 12px;
  margin-bottom: 12px;
`;

const ShimmerProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ShimmerProgressFill = styled(ShimmerBase)`
  height: 100%;
  width: 65%;
  border-radius: 4px;
`;

const ShimmerProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ShimmerProgressTextLeft = styled(ShimmerBase)`
  width: 120px;
  height: 14px;
`;

const ShimmerProgressTextRight = styled(ShimmerBase)`
  width: 40px;
  height: 14px;
`;

const ShimmerActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
`;

const ShimmerActionButton = styled(ShimmerBase)`
  width: 120px;
  height: 36px;
  border-radius: 6px;
`;

const ShimmerActionIcon = styled(ShimmerBase)`
  width: 36px;
  height: 36px;
  border-radius: 6px;
`;

export const ChecklistsShimmer: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitleContainer>
          <ShimmerTitle />
          <ShimmerSubtitle />
        </PageTitleContainer>
        <ShimmerButton />
      </PageHeader>

      <ControlsContainer>
        <SearchContainer
          style={{ background: 'transparent', border: 'none', padding: 0 }}
        >
          <ShimmerSearch />
        </SearchContainer>
        <ShimmerFilterButton />
      </ControlsContainer>

      <ChecklistsGrid>
        {Array.from({ length: 6 }).map((_, index) => (
          <ChecklistCard key={index} style={{ cursor: 'default' }}>
            <CardHeader>
              <div style={{ flex: 1 }}>
                <ShimmerCardTitle />
                <ShimmerCardTitle $width='50%' />
              </div>
              <ShimmerBadge />
            </CardHeader>

            <CardMeta>
              <ShimmerMetaLine />
              <ShimmerMetaLineShort />
              <ShimmerMetaLine $width='80%' />
            </CardMeta>

            <ShimmerStatusBadge />

            <ShimmerProgressBar>
              <ShimmerProgressFill />
            </ShimmerProgressBar>

            <ShimmerProgressText>
              <ShimmerProgressTextLeft />
              <ShimmerProgressTextRight />
            </ShimmerProgressText>

            <ShimmerActions>
              <ShimmerActionButton />
              <ShimmerActionIcon />
            </ShimmerActions>
          </ChecklistCard>
        ))}
      </ChecklistsGrid>
    </PageContainer>
  );
};
