import React, { ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import { ModalButton } from './ModalButton';

interface ModalPadrãoProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  icon?: ReactNode;
  className?: string;
}

// Overlay do modal
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 10000;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
    align-items: flex-start;
    padding-top: 40px;
  }
`;

// Container principal do modal - SEMPRE LARGO
const ModalContainer = styled.div<{ $maxWidth?: string }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  width: 100%;
  max-width: ${props => props.$maxWidth || '1200px'};
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
  border: 1px solid ${props => props.theme.colors.border};
  animation: slideIn 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;

  @keyframes slideIn {
    from {
      transform: scale(0.95) translateY(20px);
      opacity: 0;
    }
    to {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 1024px) {
    max-width: 95%;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 95vh;
    border-radius: 16px;
  }
`;

// Header do modal
const ModalHeader = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 24px 32px;
  position: relative;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
`;

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ModalSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.text.secondary};
  margin: 4px 0 0 0;
  line-height: 1.4;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Conteúdo do modal - COM SCROLL INTERNO CORRETO
const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  min-height: 0; /* Importante para o flex funcionar */

  @media (max-width: 768px) {
    padding: 20px 24px;
  }

  /* Scrollbar customizada que NÃO passa das bordas */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 8px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
    border: 2px solid ${props => props.theme.colors.cardBackground};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primary};
  }

  /* Para Firefox */
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.colors.border} transparent;
`;

// Footer do modal
const ModalFooter = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: 20px 32px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 16px 24px;
    flex-direction: column-reverse;
    gap: 10px;

    button {
      width: 100%;
    }
  }
`;

// Componente principal
export const ModalPadrão: React.FC<ModalPadrãoProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = '1200px',
  icon,
  className,
}) => {
  // Fechar modal com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer
        $maxWidth={maxWidth}
        className={className}
        onClick={e => e.stopPropagation()}
      >
        <ModalHeader>
          <HeaderContent>
            <HeaderLeft>
              {icon && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {icon}
                </div>
              )}
              <div>
                <ModalTitle>{title}</ModalTitle>
                {subtitle && <ModalSubtitle>{subtitle}</ModalSubtitle>}
              </div>
            </HeaderLeft>
            <CloseButton onClick={onClose} title='Fechar'>
              <MdClose />
            </CloseButton>
          </HeaderContent>
        </ModalHeader>

        <ModalContent>{children}</ModalContent>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalPadrão;
