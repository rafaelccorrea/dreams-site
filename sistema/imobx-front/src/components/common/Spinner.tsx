/**
 * Componente Spinner (Loading)
 * Indicador de carregamento
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SpinnerProps {
  size?: number;
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 40, color }) => {
  return (
    <SpinnerContainer>
      <SpinnerElement $size={size} $color={color} />
    </SpinnerContainer>
  );
};

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerElement = styled.div<{ $size: number; $color?: string }>`
  border: 3px solid
    ${({ theme, $color }) => $color || theme.colors.border || '#f3f3f3'};
  border-top: 3px solid ${({ theme, $color }) => $color || theme.colors.primary};
  border-radius: 50%;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  animation: ${spin} 1s linear infinite;
`;

export default Spinner;
