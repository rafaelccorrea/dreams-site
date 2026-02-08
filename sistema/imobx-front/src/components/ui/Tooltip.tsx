import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-flex;
  /* Garantir que o wrapper não afete o layout */
  width: fit-content;
  height: fit-content;
`;

const TooltipContent = styled.div<{
  $visible: boolean;
  $placement: string;
  $top?: number;
  $left?: number;
}>`
  position: fixed;
  background: ${props =>
    props.theme.mode === 'dark'
      ? props.theme.colors.backgroundTertiary
      : '#1f2937'};
  color: ${props =>
    props.theme.mode === 'dark' ? props.theme.colors.text : '#ffffff'};
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 9999999;
  opacity: ${props => (props.$visible ? 1 : 0)};
  visibility: ${props => (props.$visible ? 'visible' : 'hidden')};
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
  pointer-events: none;
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)'
      : '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'};

  /* CORREÇÃO: Evitar scroll horizontal */
  max-width: 250px;
  word-wrap: break-word;
  white-space: normal;
  line-height: 1.4;

  /* Garantir que não afete o layout */
  position: fixed !important;
  transform-origin: center;

  /* CORREÇÃO: Posicionamento dinâmico para evitar scroll horizontal */
  top: ${props => (props.$top ? `${props.$top}px` : 'auto')};
  left: ${props => (props.$left ? `${props.$left}px` : 'auto')};
  bottom: ${props => (props.$placement === 'top' ? 'auto' : 'auto')};
  right: ${props => (props.$placement === 'left' ? 'auto' : 'auto')};
  transform: ${props => {
    switch (props.$placement) {
      case 'top':
        return 'translateX(-50%) translateY(-100%)';
      case 'bottom':
        return 'translateX(-50%)';
      case 'left':
        return 'translateX(-100%) translateY(-50%)';
      case 'right':
        return 'translateY(-50%)';
      default:
        return 'translateX(-50%) translateY(-100%)';
    }
  }};
  margin: ${props => {
    switch (props.$placement) {
      case 'top':
        return '0 0 -8px 0';
      case 'bottom':
        return '8px 0 0 0';
      case 'left':
        return '0 -8px 0 0';
      case 'right':
        return '0 0 0 8px';
      default:
        return '0 0 -8px 0';
    }
  }};

  /* Seta do tooltip */
  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 4px solid transparent;

    ${props =>
      props.$placement === 'top' &&
      `
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-top-color: ${
        props.theme.mode === 'dark'
          ? props.theme.colors.backgroundTertiary
          : '#1f2937'
      };
    `}

    ${props =>
      props.$placement === 'bottom' &&
      `
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-bottom-color: ${
        props.theme.mode === 'dark'
          ? props.theme.colors.backgroundTertiary
          : '#1f2937'
      };
    `}

    ${props =>
      props.$placement === 'left' &&
      `
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-left-color: ${
        props.theme.mode === 'dark'
          ? props.theme.colors.backgroundTertiary
          : '#1f2937'
      };
    `}

    ${props =>
      props.$placement === 'right' &&
      `
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-right-color: ${
        props.theme.mode === 'dark'
          ? props.theme.colors.backgroundTertiary
          : '#1f2937'
      };
    `}
  }
`;

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 300,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const calculatePosition = () => {
    if (!wrapperRef.current) return { top: 0, left: 0 };

    const rect = wrapperRef.current.getBoundingClientRect();
    const tooltipWidth = 250; // max-width definido no CSS
    const tooltipHeight = 40; // altura estimada
    const margin = 8;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = rect.top - tooltipHeight - margin;
        left = rect.left + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + margin;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - tooltipWidth - margin;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + margin;
        break;
    }

    // CORREÇÃO: Ajustar posição para não sair da tela
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Ajustar horizontalmente
    if (left < 10) left = 10;
    if (left + tooltipWidth > viewportWidth - 10) {
      left = viewportWidth - tooltipWidth - 10;
    }

    // Ajustar verticalmente
    if (top < 10) top = 10;
    if (top + tooltipHeight > viewportHeight - 10) {
      top = viewportHeight - tooltipHeight - 10;
    }

    return { top, left };
  };

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const pos = calculatePosition();
      setPosition(pos);
      setVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <TooltipWrapper
      ref={wrapperRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <TooltipContent
        $visible={visible}
        $placement={placement}
        $top={position.top}
        $left={position.left}
        role='tooltip'
      >
        {content}
      </TooltipContent>
    </TooltipWrapper>
  );
};
