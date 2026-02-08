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

const ShimmerContainer = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background};
`;

const ShimmerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ShimmerTitle = styled.div`
  height: 36px;
  width: 180px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

const ShimmerFilterButton = styled.div`
  height: 40px;
  width: 120px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

const ShimmerTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const ShimmerTab = styled.div`
  height: 40px;
  width: 140px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

const ShimmerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const ShimmerCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  background: ${props => props.theme.colors.cardBackground};
`;

const ShimmerCover = styled.div`
  height: 180px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const ShimmerCardBody = styled.div`
  padding: 12px;
  display: grid;
  gap: 8px;
`;

const ShimmerLine = styled.div<{ width?: string }>`
  height: 16px;
  width: ${props => props.width || '100%'};
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const ShimmerDetails = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

const ShimmerDetailItem = styled.div`
  height: 14px;
  width: 60px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const ShimmerPrice = styled.div`
  height: 20px;
  width: 100px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-top: 4px;
`;

const GalleryShimmer: React.FC = () => {
  return (
    <ShimmerContainer>
      <ShimmerHeader>
        <ShimmerTitle />
        <ShimmerFilterButton />
      </ShimmerHeader>

      <ShimmerTabs>
        <ShimmerTab />
        <ShimmerTab />
        <ShimmerTab />
      </ShimmerTabs>

      <ShimmerGrid>
        {Array.from({ length: 12 }).map((_, index) => (
          <ShimmerCard key={index}>
            <ShimmerCover />
            <ShimmerCardBody>
              <ShimmerLine width='90%' />
              <ShimmerLine width='70%' />
              <ShimmerDetails>
                <ShimmerDetailItem />
                <ShimmerDetailItem />
                <ShimmerDetailItem />
              </ShimmerDetails>
              <ShimmerPrice />
            </ShimmerCardBody>
          </ShimmerCard>
        ))}
      </ShimmerGrid>
    </ShimmerContainer>
  );
};

export default GalleryShimmer;
