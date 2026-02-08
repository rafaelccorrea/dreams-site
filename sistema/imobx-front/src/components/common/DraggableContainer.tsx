import React from 'react';
import styled from 'styled-components';
import { useHorizontalDrag } from '@/hooks/useHorizontalDrag';

interface DraggableContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = styled.div<{ $isDragging?: boolean }>`
  position: relative;
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.colors.primary}60 transparent;
  user-select: none;

  /* Cursor de mão para indicar que pode arrastar */
  cursor: ${props => (props.$isDragging ? 'grabbing !important' : 'grab')};

  /* Durante o arraste, todos os elementos devem mostrar cursor grabbing */
  ${props =>
    props.$isDragging &&
    `
    * {
      user-select: none;
      cursor: grabbing !important;
    }
    
    button, a {
      cursor: grabbing !important;
    }
  `}

  /* Quando não está arrastando, manter cursor padrão em elementos interativos */
  ${props =>
    !props.$isDragging &&
    `
    button, a, input, select, textarea {
      cursor: pointer;
      user-select: auto;
    }
    
    button:active, a:active {
      cursor: pointer;
    }
  `}
  
  /* Estilizar scrollbar para WebKit */
  &::-webkit-scrollbar {
    height: 8px;

    @media (max-width: 768px) {
      height: 6px;
    }
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;

    @media (max-width: 768px) {
      background: ${props => props.theme.colors.primary}80;
    }

    &:hover {
      background: ${props => props.theme.colors.primary}80;
    }
  }

  /* Melhor scroll para mobile */
  @media (max-width: 768px) {
    overflow-x: scroll;
    overflow-y: visible;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: none;
    padding-bottom: 8px;
    touch-action: pan-x;
    overscroll-behavior-x: contain;
    width: 100%;

    /* Scrollbar mais visível no mobile */
    scrollbar-width: auto;
    scrollbar-color: ${props => props.theme.colors.primary}80 transparent;
  }

  @media (min-width: 1201px) {
    /* Em telas grandes, não mostrar indicador */
    .scroll-indicator {
      display: none;
    }
  }
`;

export const DraggableContainer: React.FC<DraggableContainerProps> = ({
  children,
  className,
}) => {
  const { ref, isDragging, handlers } = useHorizontalDrag();

  return (
    <Container
      ref={ref}
      className={className}
      $isDragging={isDragging}
      {...handlers}
    >
      {children}
    </Container>
  );
};
