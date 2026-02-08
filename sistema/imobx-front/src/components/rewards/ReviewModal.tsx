import React, { useState } from 'react';
import styled from 'styled-components';
import { MdClose, MdCheckCircle, MdCancel } from 'react-icons/md';
import type { RewardRedemption } from '@/types/rewards.types';
import { formatPoints } from '@/utils/rewards';

interface ReviewModalProps {
  redemption: RewardRedemption;
  onApprove: (notes: string) => void;
  onReject: (notes: string) => void;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  redemption,
  onApprove,
  onReject,
  onClose,
}) => {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!action) return;

    setLoading(true);
    try {
      if (action === 'approve') {
        await onApprove(notes);
      } else {
        await onReject(notes);
      }
      // Modal será fechado pelo componente pai em caso de sucesso
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <Modal>
        <Header>
          <Title>⚡ Analisar Solicitação</Title>
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </Header>

        <Content>
          {/* Informações do Usuário */}
          <UserSection>
            <UserLabel>👤 Solicitante:</UserLabel>
            <UserName>{redemption.user?.name || 'Usuário'}</UserName>
            <UserEmail>{redemption.user?.email}</UserEmail>
          </UserSection>

          {/* Informações do Prêmio */}
          <RewardSection>
            <RewardIcon>{redemption.reward?.icon || '🎁'}</RewardIcon>
            <RewardInfo>
              <RewardName>{redemption.reward?.name}</RewardName>
              <RewardPoints>
                💎 {formatPoints(redemption.pointsSpent)} pontos serão debitados
              </RewardPoints>
              {redemption.reward?.description && (
                <RewardDescription>
                  {redemption.reward.description}
                </RewardDescription>
              )}
            </RewardInfo>
          </RewardSection>

          {/* Observações do Usuário */}
          {redemption.userNotes && (
            <NotesSection>
              <NotesLabel>📝 Observações do usuário:</NotesLabel>
              <NotesText>{redemption.userNotes}</NotesText>
            </NotesSection>
          )}

          {/* Ações */}
          {!action ? (
            <ActionButtons>
              <RejectActionButton onClick={() => setAction('reject')}>
                <MdCancel size={20} />
                Rejeitar
              </RejectActionButton>
              <ApproveActionButton onClick={() => setAction('approve')}>
                <MdCheckCircle size={20} />
                Aprovar
              </ApproveActionButton>
            </ActionButtons>
          ) : (
            <Form onSubmit={handleSubmit}>
              <ActionSelected $type={action}>
                {action === 'approve' ? (
                  <>
                    <MdCheckCircle size={24} />
                    Aprovar Resgate
                  </>
                ) : (
                  <>
                    <MdCancel size={24} />
                    Rejeitar Resgate
                  </>
                )}
              </ActionSelected>

              {action === 'approve' && (
                <InfoBox $type='approve'>
                  <InfoTitle>ℹ️ O que acontecerá?</InfoTitle>
                  <InfoText>
                    • Os{' '}
                    <strong>
                      {formatPoints(redemption.pointsSpent)} pontos
                    </strong>{' '}
                    serão <strong>debitados</strong> do usuário
                  </InfoText>
                  <InfoText>• O status mudará para "Aprovado"</InfoText>
                  <InfoText>• O usuário receberá uma notificação</InfoText>
                  <InfoText>
                    • Depois você poderá marcar como "Entregue"
                  </InfoText>
                </InfoBox>
              )}

              {action === 'reject' && (
                <InfoBox $type='reject'>
                  <InfoTitle>ℹ️ O que acontecerá?</InfoTitle>
                  <InfoText>
                    • Os pontos <strong>NÃO serão debitados</strong> do usuário
                  </InfoText>
                  <InfoText>• O status mudará para "Rejeitado"</InfoText>
                  <InfoText>
                    • O usuário receberá uma notificação com o motivo
                  </InfoText>
                  <InfoText>• O usuário poderá fazer nova solicitação</InfoText>
                </InfoBox>
              )}

              <Label>
                {action === 'approve'
                  ? 'Mensagem para o usuário (opcional)'
                  : 'Motivo da rejeição (obrigatório)'}
                <Textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={
                    action === 'approve'
                      ? 'Ex: Aprovado! Pode retirar o prêmio no RH.'
                      : 'Ex: Fora do período estabelecido pela empresa.'
                  }
                  rows={4}
                  required={action === 'reject'}
                  disabled={loading}
                />
              </Label>

              <ButtonGroup>
                <BackButton
                  type='button'
                  onClick={() => setAction(null)}
                  disabled={loading}
                >
                  Voltar
                </BackButton>
                <ConfirmButton
                  type='submit'
                  $type={action}
                  disabled={loading || (action === 'reject' && !notes.trim())}
                >
                  {loading
                    ? 'Processando...'
                    : action === 'approve'
                      ? 'Confirmar Aprovação'
                      : 'Confirmar Rejeição'}
                </ConfirmButton>
              </ButtonGroup>
            </Form>
          )}
        </Content>
      </Modal>
    </>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  z-index: 10000;
  width: 90%;
  max-width: 750px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    font-size: 1.5rem;
  }

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
`;

const Content = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const UserSection = styled.div`
  padding: 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 0.75rem;
`;

const UserLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const UserName = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const RewardSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.75rem;
`;

const RewardIcon = styled.div`
  font-size: 4rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  flex-shrink: 0;
`;

const RewardInfo = styled.div`
  flex: 1;
`;

const RewardName = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.375rem;
`;

const RewardPoints = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
`;

const RewardDescription = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`;

const NotesSection = styled.div`
  padding: 1rem;
  background: #dbeafe;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
`;

const NotesLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.5rem;
`;

const NotesText = styled.div`
  font-size: 0.875rem;
  color: #1e3a8a;
  line-height: 1.5;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const RejectActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }
`;

const ApproveActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActionSelected = styled.div<{ $type: 'approve' | 'reject' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${props =>
    props.$type === 'approve'
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'};
  color: white;
  border-radius: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
`;

const InfoBox = styled.div<{ $type: 'approve' | 'reject' }>`
  padding: 1rem;
  background: ${props => (props.$type === 'approve' ? '#d1fae5' : '#fee2e2')};
  border: 1px solid
    ${props => (props.$type === 'approve' ? '#10b981' : '#ef4444')}40;
  border-radius: 0.5rem;
`;

const InfoTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.75rem;
`;

const InfoText = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.375rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const BackButton = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.hover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ConfirmButton = styled.button<{ $type: 'approve' | 'reject' }>`
  flex: 2;
  padding: 0.875rem 1.5rem;
  background: ${props =>
    props.$type === 'approve'
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props =>
      props.$type === 'approve'
        ? '0 6px 20px rgba(16, 185, 129, 0.3)'
        : '0 6px 20px rgba(239, 68, 68, 0.3)'};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;
