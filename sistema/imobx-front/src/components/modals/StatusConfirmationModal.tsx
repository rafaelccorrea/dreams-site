import React from 'react';
import styled from 'styled-components';
import {
  MdWarning,
  MdClose,
  MdPlayArrow,
  MdCancel,
  MdCheckCircle,
} from 'react-icons/md';
import type { Inspection } from '@/types/vistoria-types';

interface StatusConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  inspection: Inspection | null;
  newStatus: string;
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
  z-index: 10000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 0;
  width: 90%;
  max-width: 400px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalSlideIn 0.2s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const ModalHeader = styled.div<{ $variant?: 'warning' | 'danger' | 'primary' }>`
  background: ${props => {
    if (props.$variant === 'danger') return props.theme.colors.error;
    if (props.$variant === 'primary') return props.theme.colors.primary;
    return props.theme.colors.warning || '#f59e0b';
  }};
  color: white;
  padding: 24px;
  border-radius: 12px 12px 0 0;
  text-align: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const ModalBody = styled.div`
  padding: 32px 24px;
  text-align: center;
`;

const WarningIcon = styled.div<{ $variant?: 'warning' | 'danger' | 'primary' }>`
  width: 64px;
  height: 64px;
  background: ${props => {
    if (props.$variant === 'danger') return '#fef2f2';
    if (props.$variant === 'primary') return props.theme.colors.primary + '20';
    return '#fffbeb';
  }};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: ${props => {
    if (props.$variant === 'danger') return props.theme.colors.error;
    if (props.$variant === 'primary') return props.theme.colors.primary;
    return props.theme.colors.warning || '#f59e0b';
  }};
  font-size: 2rem;
`;

const Message = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
  line-height: 1.5;
`;

const ItemName = styled.strong`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  display: block;
  margin-top: 8px;
`;

const WarningText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 16px 0 0 0;
  font-style: italic;
`;

const ModalFooter = styled.div`
  background: ${props => props.theme.colors.backgroundTertiary};
  padding: 20px 24px;
  border-radius: 0 0 12px 12px;
  display: flex;
  justify-content: center;
  gap: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
  justify-content: center;

  ${props => {
    if (props.variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;
        border-color: ${props.theme.colors.primary};
        
        &:hover {
          background: ${props.theme.colors.primaryHover || props.theme.colors.primary};
          border-color: ${props.theme.colors.primaryHover || props.theme.colors.primary};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px ${props.theme.colors.primary}30;
        }
        
        &:active {
          transform: translateY(0);
        }
        
        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      `;
    } else if (props.variant === 'danger') {
      return `
        background: ${props.theme.colors.error};
        color: white;
        border-color: ${props.theme.colors.error};
        
        &:hover {
          background: #dc2626;
          border-color: #dc2626;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
        
        &:active {
          transform: translateY(0);
        }
        
        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.textSecondary};
        border-color: ${props.theme.colors.border};
        
        &:hover {
          background: ${props.theme.colors.hover};
          border-color: ${props.theme.colors.borderLight};
          color: ${props.theme.colors.text};
        }
      `;
    }
  }}
`;

const getStatusInfo = (status: string) => {
  const statusInfo: Record<
    string,
    {
      label: string;
      variant: 'warning' | 'danger' | 'primary';
      icon: React.ReactNode;
    }
  > = {
    in_progress: {
      label: 'Em Andamento',
      variant: 'warning',
      icon: <MdPlayArrow size={24} />,
    },
    completed: {
      label: 'Concluída',
      variant: 'primary',
      icon: <MdCheckCircle size={24} />,
    },
    cancelled: {
      label: 'Cancelada',
      variant: 'danger',
      icon: <MdCancel size={24} />,
    },
  };

  return (
    statusInfo[status] || {
      label: status,
      variant: 'warning' as const,
      icon: <MdWarning size={24} />,
    }
  );
};

export const StatusConfirmationModal: React.FC<
  StatusConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  inspection,
  newStatus,
  isLoading = false,
}) => {
  if (!isOpen || !inspection) return null;

  const statusInfo = getStatusInfo(newStatus);

  const getTitle = () => {
    if (newStatus === 'in_progress') {
      return 'Marcar como Em Andamento';
    } else if (newStatus === 'completed') {
      return 'Marcar como Concluída';
    } else if (newStatus === 'cancelled') {
      return 'Cancelar Vistoria';
    }
    return 'Confirmar Mudança de Status';
  };

  const getMessage = () => {
    if (newStatus === 'in_progress') {
      return 'Tem certeza que deseja marcar esta vistoria como em andamento?';
    } else if (newStatus === 'completed') {
      return 'Tem certeza que deseja marcar esta vistoria como concluída?';
    } else if (newStatus === 'cancelled') {
      return 'Tem certeza que deseja cancelar esta vistoria? Esta ação não pode ser desfeita.';
    }
    return `Tem certeza que deseja alterar o status desta vistoria para "${statusInfo.label}"?`;
  };

  const getConfirmLabel = () => {
    if (newStatus === 'in_progress') {
      return isLoading ? 'Marcando...' : 'Marcar como Em Andamento';
    } else if (newStatus === 'completed') {
      return isLoading ? 'Concluindo...' : 'Marcar como Concluída';
    } else if (newStatus === 'cancelled') {
      return isLoading ? 'Cancelando...' : 'Cancelar Vistoria';
    }
    return isLoading ? 'Confirmando...' : 'Confirmar';
  };

  return (
    <ModalOverlay isOpen={isOpen} onClick={isLoading ? undefined : onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader $variant={statusInfo.variant}>
          <ModalTitle>
            {statusInfo.icon}
            {getTitle()}
          </ModalTitle>
        </ModalHeader>

        <ModalBody>
          <WarningIcon $variant={statusInfo.variant}>
            {statusInfo.icon}
          </WarningIcon>

          <Message>{getMessage()}</Message>

          <ItemName>{inspection.title}</ItemName>

          {newStatus === 'cancelled' && (
            <WarningText>Esta ação não pode ser desfeita.</WarningText>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            type='button'
            variant='secondary'
            onClick={onClose}
            disabled={isLoading}
          >
            <MdClose size={16} />
            Cancelar
          </Button>
          <Button
            type='button'
            variant={newStatus === 'cancelled' ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {statusInfo.icon}
            {getConfirmLabel()}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};
