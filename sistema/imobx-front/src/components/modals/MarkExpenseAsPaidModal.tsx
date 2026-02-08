import React from 'react';
import styled from 'styled-components';
import { MdCheckCircle, MdClose, MdAttachMoney } from 'react-icons/md';

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
  z-index: 10000;
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

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  animation: slideUp 0.3s ease;

  @media (max-width: 768px) {
    max-width: 90%;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    max-width: 95%;
    border-radius: 12px;
  }

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
`;

const ModalHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.colors.backgroundSecondary};

  @media (max-width: 768px) {
    padding: 20px 24px;
  }

  @media (max-width: 480px) {
    padding: 16px 20px;
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

  @media (max-width: 480px) {
    font-size: 1.125rem;
    gap: 8px;
  }
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

const ModalContent = styled.div`
  padding: 32px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 24px;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 2rem;
  color: white;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);

  @media (max-width: 480px) {
    width: 56px;
    height: 56px;
    font-size: 1.75rem;
    margin-bottom: 20px;
  }
`;

const Message = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
  line-height: 1.6;
`;

const ExpenseName = styled.strong`
  display: block;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 16px 0;
`;

const ModalActions = styled.div`
  padding: 24px 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  background: ${props => props.theme.colors.backgroundSecondary};

  @media (max-width: 768px) {
    padding: 20px 24px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    padding: 16px 20px;
    gap: 10px;
  }
`;

const Button = styled.button<{ $variant?: 'success' | 'secondary' }>`
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

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 0.9375rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
    padding: 14px 20px;
  }

  ${props => {
    if (props.$variant === 'success') {
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

interface MarkExpenseAsPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expenseTitle: string;
  isLoading?: boolean;
}

export const MarkExpenseAsPaidModal: React.FC<MarkExpenseAsPaidModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  expenseTitle,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdAttachMoney />
            Marcar como Paga
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <SuccessIcon>
            <MdCheckCircle />
          </SuccessIcon>

          <Message>Deseja marcar a despesa como paga?</Message>

          <ExpenseName>"{expenseTitle}"</ExpenseName>

          <Message style={{ fontSize: '0.875rem', marginTop: '16px' }}>
            Esta ação atualizará o status da despesa para "Paga" e registrará a
            data de pagamento.
          </Message>
        </ModalContent>

        <ModalActions>
          <Button onClick={onClose} $variant='secondary'>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            $variant='success'
            disabled={isLoading}
          >
            {isLoading ? (
              <>Marcando...</>
            ) : (
              <>
                <MdCheckCircle />
                Confirmar Pagamento
              </>
            )}
          </Button>
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
};
