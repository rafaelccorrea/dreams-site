import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdExpandMore,
} from 'react-icons/md';

interface ScrollControlsProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const ControlsContainer = styled.div`
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const ScrollButton = styled.button<{ $disabled?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props =>
    props.$disabled
      ? props.theme.colors.textSecondary
      : props.theme.colors.primary};
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  opacity: ${props => (props.$disabled ? 0.5 : 1)};

  &:hover {
    ${props =>
      !props.$disabled &&
      `
      background: ${props.theme.colors.primary};
      color: white;
      border-color: ${props.theme.colors.primary};
      transform: scale(1.1);
      box-shadow: 0 8px 25px ${props.theme.colors.primary}40;
    `}
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ScrollIndicator = styled.div`
  width: 4px;
  height: 120px;
  background: ${props => props.theme.colors.border};
  border-radius: 2px;
  position: relative;
  margin: 8px auto;
  overflow: hidden;
`;

const ScrollThumb = styled.div<{ $position: number; $size: number }>`
  position: absolute;
  top: ${props => props.$position}%;
  height: ${props => props.$size}%;
  width: 100%;
  background: ${props => props.theme.colors.primary};
  border-radius: 2px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ScrollHint = styled.div`
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  ${ControlsContainer}:hover & {
    opacity: 1;
  }
`;

export const ScrollControls: React.FC<ScrollControlsProps> = ({
  containerRef,
}) => {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollSize, setScrollSize] = useState(100);
  const [isVisible, setIsVisible] = useState(false);

  const updateScrollState = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;

    setCanScrollUp(scrollTop > 0);
    setCanScrollDown(scrollTop < scrollHeight - clientHeight);

    const maxScroll = scrollHeight - clientHeight;
    const position = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    const size = maxScroll > 0 ? (clientHeight / scrollHeight) * 100 : 100;

    setScrollPosition(position);
    setScrollSize(Math.max(size, 5)); // Mínimo de 5% para visibilidade
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      updateScrollState();
      setIsVisible(true);
      clearTimeout(window.scrollControlsTimeout);
      window.scrollControlsTimeout = setTimeout(
        () => setIsVisible(false),
        2000
      );
    };

    const handleResize = () => {
      updateScrollState();
    };

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Verificar estado inicial
    updateScrollState();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.scrollControlsTimeout);
    };
  }, [containerRef]);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const scrollBy = (direction: 'up' | 'down') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientHeight * 0.8;
      const newScrollTop =
        direction === 'up'
          ? containerRef.current.scrollTop - scrollAmount
          : containerRef.current.scrollTop + scrollAmount;

      containerRef.current.scrollTo({
        top: Math.max(
          0,
          Math.min(newScrollTop, containerRef.current.scrollHeight)
        ),
        behavior: 'smooth',
      });
    }
  };

  return (
    <ControlsContainer style={{ opacity: isVisible ? 1 : 0 }}>
      <ScrollHint>Controles de Scroll</ScrollHint>

      <ScrollButton
        $disabled={!canScrollUp}
        onClick={scrollToTop}
        title='Ir para o topo'
      >
        <MdKeyboardArrowUp size={24} />
      </ScrollButton>

      <ScrollButton
        $disabled={!canScrollUp}
        onClick={() => scrollBy('up')}
        title='Scroll para cima'
      >
        <MdExpandMore size={20} style={{ transform: 'rotate(180deg)' }} />
      </ScrollButton>

      <ScrollIndicator>
        <ScrollThumb $position={scrollPosition} $size={scrollSize} />
      </ScrollIndicator>

      <ScrollButton
        $disabled={!canScrollDown}
        onClick={() => scrollBy('down')}
        title='Scroll para baixo'
      >
        <MdExpandMore size={20} />
      </ScrollButton>

      <ScrollButton
        $disabled={!canScrollDown}
        onClick={scrollToBottom}
        title='Ir para o final'
      >
        <MdKeyboardArrowDown size={24} />
      </ScrollButton>
    </ControlsContainer>
  );
};
