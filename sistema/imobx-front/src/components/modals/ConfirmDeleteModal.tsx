import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { MdWarning, MdClose, MdDelete, MdCheckCircle } from 'react-icons/md';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div<{ $wide?: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: ${props => (props.$wide ? '680px' : '480px')};
  overflow: hidden;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @media (max-width: 768px) {
    max-width: 90%;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    max-width: 95%;
    border-radius: 12px;
  }
`;

const ModalHeader = styled.div<{ $compact?: boolean }>`
  padding: ${props => (props.$compact ? '16px 32px' : '24px 32px')};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.colors.backgroundSecondary};

  @media (max-width: 768px) {
    padding: ${props => (props.$compact ? '14px 24px' : '20px 24px')};
  }

  @media (max-width: 480px) {
    padding: ${props => (props.$compact ? '12px 20px' : '16px 20px')};
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    transform: scale(1.1);
  }
`;

const ModalContent = styled.div<{ $compact?: boolean }>`
  padding: ${props => (props.$compact ? '20px 32px' : '32px')};
  text-align: center;

  @media (max-width: 768px) {
    padding: ${props => (props.$compact ? '18px 24px' : '24px')};
  }

  @media (max-width: 480px) {
    padding: ${props => (props.$compact ? '16px 20px' : '20px')};
  }
`;

const WarningIcon = styled.div<{
  $variant?: 'warning' | 'success';
  $compact?: boolean;
}>`
  width: ${props => (props.$compact ? '48px' : '64px')};
  height: ${props => (props.$compact ? '48px' : '64px')};
  background: ${props =>
    props.$variant === 'success'
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => (props.$compact ? '16px' : '24px')};
  font-size: ${props => (props.$compact ? '1.5rem' : '2rem')};
  color: white;
  box-shadow: ${props =>
    props.$variant === 'success'
      ? '0 8px 25px rgba(16, 185, 129, 0.3)'
      : '0 8px 25px rgba(245, 158, 11, 0.3)'};
`;

const WarningTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
`;

const WarningMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

const WarningAlert = styled.strong`
  display: block;
  margin-top: 12px;
  padding: 12px;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(239, 68, 68, 0.1)'
      : 'rgba(239, 68, 68, 0.05)'};
  border-left: 3px solid ${props => props.theme.colors.error || '#ef4444'};
  border-radius: 8px;
  color: ${props => props.theme.colors.error || '#ef4444'};
  font-size: 0.95rem;
`;

const ItemName = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ModalActions = styled.div<{ $compact?: boolean }>`
  padding: ${props => (props.$compact ? '16px 32px' : '24px 32px')};
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  background: ${props => props.theme.colors.backgroundSecondary};

  @media (max-width: 768px) {
    padding: ${props => (props.$compact ? '14px 24px' : '20px 24px')};
    gap: 12px;
  }

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    padding: ${props => (props.$compact ? '12px 20px' : '16px 20px')};
    gap: 10px;
  }
`;

const Button = styled.button<{ $variant?: 'danger' | 'secondary' | 'success' }>`
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  position: relative;
  overflow: hidden;

  ${props => {
    if (props.$variant === 'danger') {
      return `
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.25);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.35);
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    } else if (props.$variant === 'success') {
      return `
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.25);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.35);
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 2px solid ${props.theme.colors.border};
        
        &:hover {
          background: ${props.theme.colors.primary}10;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${props.theme.colors.primary}15;
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
  variant?: 'delete' | 'mark-as-sold' | 'mark-as-rented';
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  wide?: boolean;
  compact?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
  variant = 'delete',
  confirmLabel,
  cancelLabel = 'Cancelar',
  loadingLabel,
  wide = false,
  compact = false,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  // Determinar ícone e cor baseado na variante
  const isSuccessVariant = variant !== 'delete';
  const IconComponent = isSuccessVariant ? MdCheckCircle : MdWarning;
  const buttonVariant = isSuccessVariant ? 'success' : 'danger';
  const defaultConfirmLabel =
    variant === 'delete'
      ? 'Confirmar Exclusão'
      : variant === 'mark-as-sold'
        ? 'Confirmar Venda'
        : 'Confirmar Aluguel';
  const defaultLoadingLabel =
    variant === 'delete'
      ? 'Excluindo...'
      : variant === 'mark-as-sold'
        ? 'Confirmando Venda...'
        : 'Confirmando Aluguel...';

  const modalContent = (
    <ModalOverlay>
      <ModalContainer $wide={wide}>
        <ModalHeader $compact={compact}>
          <ModalTitle>
            <IconComponent />
            {title}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </ModalHeader>

        <ModalContent $compact={compact}>
          <WarningIcon
            $variant={isSuccessVariant ? 'success' : 'warning'}
            $compact={compact}
          >
            <IconComponent />
          </WarningIcon>

          <WarningTitle>Confirmação Necessária</WarningTitle>

          <WarningMessage>
            {message}
            {itemName && (
              <>
                <br />
                <ItemName>"{itemName}"</ItemName>
              </>
            )}
            {variant === 'delete' && (
              <>
                <br />
                <br />
                <WarningAlert>
                  ⚠️ Atenção: Nenhum usuário vinculado a esta empresa ou dado
                  poderá ser acessado após a exclusão!
                </WarningAlert>
              </>
            )}
          </WarningMessage>
        </ModalContent>

        <ModalActions $compact={compact}>
          <Button onClick={onClose} $variant='secondary'>
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            $variant={buttonVariant}
            disabled={isLoading}
          >
            {isLoading ? (
              <>{loadingLabel || defaultLoadingLabel}</>
            ) : (
              <>
                {variant === 'delete' && <MdDelete />}
                {variant !== 'delete' && <MdCheckCircle />}
                {confirmLabel || defaultConfirmLabel}
              </>
            )}
          </Button>
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmDeleteModal;
