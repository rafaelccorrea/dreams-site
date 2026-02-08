import React, { useState } from 'react';
import styled from 'styled-components';
import { MdClose, MdCancel, MdWarning, MdInfo } from 'react-icons/md';
import type { Subscription } from '../../types/subscriptionTypes';
import { subscriptionService } from '../../services/subscriptionService';
import { toast } from 'react-toastify';

interface SubscriptionCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
  onSuccess?: () => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: flex-start;
  justify-content: center;
  z-index: 9999999 !important;
  padding: 100px 20px 20px 20px;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 10000000 !important;
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const DangerAlert = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid ${props => props.theme.colors.error};
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
`;

const DangerTitle = styled.h4`
  margin: 0 0 8px 0;
  color: ${props => props.theme.colors.error};
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const LostAccessCard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const LostAccessTitle = styled.h5`
  margin: 0 0 12px 0;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
`;

const LostAccessItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ConfirmationInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  text-transform: uppercase;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.error};
  }
`;

const TipCard = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid ${props => props.theme.colors.info};
  padding: 12px;
  border-radius: 8px;
  margin-top: 16px;
`;

const TipText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.info};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;

  ${props => {
    if (props.$variant === 'danger') {
      return `
        background: ${props.theme.colors.error};
        color: white;
        
        &:hover {
          filter: brightness(0.9);
          transform: translateY(-1px);
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      `;
    } else if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;
        
        &:hover {
          background: ${props.theme.colors.primaryDark};
          transform: translateY(-1px);
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
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

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const CONFIRM_TEXT = 'CANCELAR';

export const SubscriptionCancelModal: React.FC<
  SubscriptionCancelModalProps
> = ({ isOpen, onClose, subscription, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (confirmText !== CONFIRM_TEXT) {
      toast.error(`Digite "${CONFIRM_TEXT}" para confirmar`);
      return;
    }

    if (!reason) {
      toast.error('Selecione um motivo');
      return;
    }

    try {
      setLoading(true);

      await subscriptionService.deactivateSubscription({
        reason,
        notes: notes || undefined,
      });

      toast.success('Assinatura cancelada com sucesso');

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao cancelar assinatura';
      toast.error('Erro ao cancelar assinatura: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setReason('');
      setNotes('');
      setConfirmText('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay
      $isOpen={isOpen}
      onClick={handleClose}
      style={{ zIndex: 9999999 }}
    >
      <ModalContent
        onClick={e => e.stopPropagation()}
        style={{ zIndex: 10000000 }}
      >
        <ModalHeader>
          <ModalTitle>
            <MdCancel size={24} />
            Cancelar Assinatura
          </ModalTitle>
          <CloseButton onClick={handleClose} disabled={loading}>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Aviso Grave */}
          <DangerAlert>
            <DangerTitle>
              <MdWarning size={20} />
              ATENÇÃO - Ação Irreversível
            </DangerTitle>
            <p
              style={{
                margin: '0',
                fontSize: '0.95rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              Ao cancelar, você perderá acesso imediato a todos os recursos do
              sistema. Todos os dados serão mantidos por 30 dias para
              recuperação.
            </p>
          </DangerAlert>

          {/* Motivo do Cancelamento */}
          <FormGroup>
            <Label>Por que você está cancelando?</Label>
            <Select
              value={reason}
              onChange={e => setReason(e.target.value)}
              disabled={loading}
            >
              <option value=''>Selecione um motivo...</option>
              <option value='too_expensive'>Muito caro</option>
              <option value='not_using'>Não estou usando</option>
              <option value='missing_features'>Faltam recursos</option>
              <option value='found_alternative'>Encontrei alternativa</option>
              <option value='business_closed'>Fechei meu negócio</option>
              <option value='other'>Outro motivo</option>
            </Select>
          </FormGroup>

          {/* Observações */}
          <FormGroup>
            <Label>Conte-nos mais (opcional)</Label>
            <TextArea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder='Seu feedback é importante para nós...'
              disabled={loading}
            />
          </FormGroup>

          {/* Lista do que será perdido */}
          <LostAccessCard>
            <LostAccessTitle>Você perderá acesso a:</LostAccessTitle>
            <LostAccessItem>
              <span>•</span>
              <span>Todos os módulos e funcionalidades</span>
            </LostAccessItem>
            <LostAccessItem>
              <span>•</span>
              <span>Acesso de todos os usuários</span>
            </LostAccessItem>
            <LostAccessItem>
              <span>•</span>
              <span>Sincronização de dados</span>
            </LostAccessItem>
            <LostAccessItem>
              <span>•</span>
              <span>Suporte técnico</span>
            </LostAccessItem>
          </LostAccessCard>

          {/* Confirmação Final */}
          <FormGroup>
            <Label>Digite "{CONFIRM_TEXT}" para confirmar</Label>
            <ConfirmationInput
              type='text'
              value={confirmText}
              onChange={e => setConfirmText(e.target.value.toUpperCase())}
              placeholder={CONFIRM_TEXT}
              disabled={loading}
            />
          </FormGroup>

          <TipCard>
            <TipText>
              <MdInfo size={16} />
              Dica: Você pode fazer downgrade ao invés de cancelar completamente
            </TipText>
          </TipCard>

          {/* Botões de Ação */}
          <ActionButtons>
            <Button
              $variant='secondary'
              onClick={handleClose}
              disabled={loading}
            >
              Voltar
            </Button>
            <Button
              $variant='danger'
              onClick={handleCancel}
              disabled={confirmText !== CONFIRM_TEXT || !reason || loading}
            >
              {loading && <LoadingSpinner />}
              {loading ? 'Cancelando...' : 'Cancelar Assinatura'}
            </Button>
          </ActionButtons>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};
