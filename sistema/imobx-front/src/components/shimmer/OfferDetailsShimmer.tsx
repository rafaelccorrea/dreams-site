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
  padding: 32px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ShimmerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

const ShimmerSection = styled.div`
  margin-bottom: 32px;
`;

const ShimmerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const ShimmerDivider = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: 32px 0;
`;

export const OfferDetailsShimmer: React.FC = () => {
  return (
    <ShimmerContainer>
      <ShimmerHeader>
        <div style={{ flex: 1 }}>
          <ShimmerBox $height='32px' $width='300px' $margin='0 0 8px 0' />
          <ShimmerBox $height='20px' $width='250px' />
        </div>
        <ShimmerBox $height='40px' $width='120px' $borderRadius='8px' />
      </ShimmerHeader>

      <ShimmerSection>
        <ShimmerBox $height='28px' $width='250px' $margin='0 0 20px 0' />
        <ShimmerGrid>
          <div>
            <ShimmerBox $height='18px' $width='120px' $margin='0 0 8px 0' />
            <ShimmerBox $height='20px' $width='200px' />
          </div>
          <div>
            <ShimmerBox $height='18px' $width='80px' $margin='0 0 8px 0' />
            <ShimmerBox $height='20px' $width='150px' />
          </div>
          <div>
            <ShimmerBox $height='18px' $width='100px' $margin='0 0 8px 0' />
            <ShimmerBox $height='24px' $width='100px' $borderRadius='20px' />
          </div>
          <div>
            <ShimmerBox $height='18px' $width='120px' $margin='0 0 8px 0' />
            <ShimmerBox $height='20px' $width='180px' />
          </div>
        </ShimmerGrid>
      </ShimmerSection>

      <ShimmerDivider />

      <ShimmerSection>
        <ShimmerBox $height='28px' $width='150px' $margin='0 0 20px 0' />
        <ShimmerGrid>
          <div>
            <ShimmerBox $height='18px' $width='120px' $margin='0 0 8px 0' />
            <ShimmerBox $height='20px' $width='200px' />
          </div>
          <div>
            <ShimmerBox $height='18px' $width='150px' $margin='0 0 8px 0' />
            <ShimmerBox $height='20px' $width='180px' />
          </div>
          <div>
            <ShimmerBox $height='18px' $width='130px' $margin='0 0 8px 0' />
            <ShimmerBox $height='32px' $width='220px' />
          </div>
        </ShimmerGrid>
      </ShimmerSection>

      <ShimmerDivider />

      <ShimmerSection>
        <ShimmerBox $height='28px' $width='200px' $margin='0 0 20px 0' />
        <ShimmerGrid>
          <div>
            <ShimmerBox $height='18px' $width='80px' $margin='0 0 8px 0' />
            <ShimmerBox $height='20px' $width='250px' />
          </div>
          <div>
            <ShimmerBox $height='18px' $width='100px' $margin='0 0 8px 0' />
            <ShimmerBox $height='20px' $width='180px' />
          </div>
        </ShimmerGrid>
      </ShimmerSection>

      <ShimmerDivider />

      <ShimmerSection>
        <ShimmerBox $height='28px' $width='220px' $margin='0 0 20px 0' />
        <ShimmerBox
          $height='100px'
          $width='100%'
          $borderRadius='8px'
          style={{ marginTop: '12px' }}
        />
      </ShimmerSection>

      <ShimmerDivider />

      <ShimmerSection>
        <ShimmerBox $height='28px' $width='180px' $margin='0 0 20px 0' />
        <ShimmerBox
          $height='120px'
          $width='100%'
          $borderRadius='8px'
          style={{ marginBottom: '24px' }}
        />
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          <ShimmerBox $height='44px' $width='120px' $borderRadius='8px' />
          <ShimmerBox $height='44px' $width='140px' $borderRadius='8px' />
          <ShimmerBox $height='44px' $width='150px' $borderRadius='8px' />
        </div>
      </ShimmerSection>
    </ShimmerContainer>
  );
};
