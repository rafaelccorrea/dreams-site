import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Componente que adiciona uma transição suave ao carregar páginas
 * Evita o efeito de "flash" ou "F5" na navegação
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Pequeno delay para suavizar a transição
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  return <Container $isVisible={isVisible}>{children}</Container>;
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div<{ $isVisible: boolean }>`
  opacity: ${props => (props.$isVisible ? 1 : 0)};
  animation: ${props => (props.$isVisible ? fadeIn : 'none')} 0.3s ease-out;
  width: 100%;
  height: 100%;
`;
