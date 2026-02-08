import React, { useState } from 'react';
import styled from 'styled-components';
import { MdInfo } from 'react-icons/md';

interface InfoTooltipProps {
  content: string;
  children?: React.ReactNode;
  direction?: 'up' | 'down' | 'top-right';
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  children,
  direction = 'up',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TooltipContainer>
      <TooltipTrigger
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children || <MdInfo size={16} />}
      </TooltipTrigger>

      {isVisible && (
        <TooltipContent $direction={direction}>
          <TooltipArrow $direction={direction} />
          {content}
        </TooltipContent>
      )}
    </TooltipContainer>
  );
};

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  z-index: 1; /* Garantir que o container tenha contexto de empilhamento */
`;

const TooltipTrigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.1);
  }
`;

const TooltipContent = styled.div<{ $direction: 'up' | 'down' | 'top-right' }>`
  position: absolute;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  font-size: 13px;
  line-height: 1.4;
  white-space: nowrap;
  max-width: 280px;
  white-space: normal;
  z-index: 99999; /* Z-index muito alto para ficar acima de todos os cards */
  pointer-events: none; /* Permitir que eventos passem através quando não estiver visível */

  ${({ $direction }) => {
    if ($direction === 'top-right') {
      return `
        bottom: 100%;
        right: 0;
        margin-bottom: 8px;
        transform: translateX(0);
      `;
    } else if ($direction === 'up') {
      return `
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-bottom: 8px;
      `;
    } else {
      return `
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 8px;
      `;
    }
  }}

  /* Responsive positioning */
  @media (max-width: 768px) {
    position: fixed;
    bottom: auto;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin-bottom: 0;
    margin-top: 0;
    max-width: 90vw;
  }
`;

const TooltipArrow = styled.div<{ $direction: 'up' | 'down' | 'top-right' }>`
  position: absolute;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  z-index: 100000; /* Z-index ainda maior para a seta */

  ${({ $direction, theme }) => {
    if ($direction === 'top-right') {
      return `
        top: 100%;
        right: 16px;
        transform: translateX(0);
        border-top: 6px solid ${theme.colors.border};
        
        &::after {
          content: '';
          position: absolute;
          top: -7px;
          right: -6px;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid ${theme.colors.surface};
        }
      `;
    } else if ($direction === 'up') {
      return `
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-top: 6px solid ${theme.colors.border};
        
        &::after {
          content: '';
          position: absolute;
          top: -7px;
          left: -6px;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid ${theme.colors.surface};
        }
      `;
    } else {
      return `
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-bottom: 6px solid ${theme.colors.border};
        
        &::after {
          content: '';
          position: absolute;
          bottom: -7px;
          left: -6px;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid ${theme.colors.surface};
        }
      `;
    }
  }}
`;
