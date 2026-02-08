import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
`;

const SkeletonLine = styled.div<{ width?: string; height?: string }>`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${pulse} 1.5s ease-in-out infinite;
  border-radius: 4px;
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
`;

const SkeletonCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

/**
 * Componente de loading otimizado para substituir shimmers pesados
 */
export const OptimizedLoading: React.FC<{
  type?: 'card' | 'chart' | 'widget';
}> = ({ type = 'card' }) => {
  if (type === 'chart') {
    return (
      <SkeletonContainer>
        <SkeletonLine height='24px' width='60%' />
        <SkeletonLine height='200px' />
      </SkeletonContainer>
    );
  }

  if (type === 'widget') {
    return (
      <SkeletonCard>
        <SkeletonLine height='20px' width='70%' />
        <SkeletonLine height='16px' width='50%' />
        <SkeletonLine height='100px' />
      </SkeletonCard>
    );
  }

  return (
    <SkeletonCard>
      <SkeletonLine height='20px' width='80%' />
      <SkeletonLine height='16px' width='60%' />
      <SkeletonLine height='16px' width='40%' />
    </SkeletonCard>
  );
};
