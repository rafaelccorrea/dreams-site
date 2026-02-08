import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    background-position: 200% 0;
    opacity: 0.8;
  }
`;

const ShimmerBox = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
  $margin?: string;
}>`
  background: linear-gradient(
    90deg,
    #e2e8f0 0%,
    #cbd5e1 25%,
    #94a3b8 50%,
    #cbd5e1 75%,
    #e2e8f0 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s ease-in-out infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$borderRadius || '8px'};
  margin: ${props => props.$margin || '0'};
`;

const ShimmerContainer = styled.div`
  padding: 24px;
`;

const ShimmerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 1.5rem;
`;

const ShimmerSearch = styled.div`
  margin-bottom: 24px;
`;

const ShimmerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ShimmerCard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #f59e0b;
  }
`;

export const PropertyOffersShimmer: React.FC = () => {
  return (
    <ShimmerContainer>
      <ShimmerHeader>
        <div style={{ flex: 1 }}>
          <ShimmerBox $height='32px' $width='300px' $margin='0 0 8px 0' />
          <ShimmerBox $height='20px' $width='200px' />
        </div>
        <ShimmerBox $height='40px' $width='120px' $borderRadius='8px' />
      </ShimmerHeader>

      <ShimmerSearch>
        <ShimmerBox $height='44px' $borderRadius='8px' />
      </ShimmerSearch>

      <div style={{ marginBottom: '24px' }}>
        <ShimmerBox $height='40px' $width='120px' $borderRadius='8px' />
      </div>

      <ShimmerGrid>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <ShimmerCard key={i}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <ShimmerBox $height='24px' $width='70%' />
              <ShimmerBox $height='24px' $width='80px' $borderRadius='12px' />
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                }}
              >
                <ShimmerBox $height='16px' $width='100px' />
                <ShimmerBox $height='16px' $width='120px' />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                }}
              >
                <ShimmerBox $height='16px' $width='100px' />
                <ShimmerBox $height='24px' $width='150px' />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                }}
              >
                <ShimmerBox $height='16px' $width='100px' />
                <ShimmerBox $height='16px' $width='120px' />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <ShimmerBox $height='14px' $width='120px' />
              <ShimmerBox $height='36px' $width='120px' $borderRadius='8px' />
            </div>
          </ShimmerCard>
        ))}
      </ShimmerGrid>
    </ShimmerContainer>
  );
};
