import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.2s ease-out;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalBody = styled.div`
  text-align: center;
`;

const WarningIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.theme.colors.error}15;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: ${props => props.theme.colors.error};
  font-size: 1.5rem;
`;

const Message = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
  line-height: 1.5;
`;

const WarningText = styled.p`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 12px 0 0 0;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: center;

  ${props => {
    if (props.variant === 'primary') {
      return `
        background: ${props.theme.colors.error};
        color: white;
        
        &:hover {
          background: ${props.theme.colors.errorDark || props.theme.colors.error};
        }
        
        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.backgroundSecondary};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};
        
        &:hover {
          background: ${props.theme.colors.border};
        }
      `;
    }
  }}
`;

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, message, isLoading = false }) => {
  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalBody>
          <WarningIcon>
            <span>⚠️</span>
          </WarningIcon>

          <Message>{message}</Message>

          <WarningText>Esta ação não pode ser desfeita.</WarningText>
        </ModalBody>

        <ModalFooter>
          <Button type='button' variant='secondary' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type='button'
            variant='primary'
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );

  return createPortal(modalContent, document.body);
};
