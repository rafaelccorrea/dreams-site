import React, { useState } from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import type { Reward } from '@/types/rewards.types';
import { formatPoints, canRedeem } from '@/utils/rewards';

interface RedeemModalProps {
  reward: Reward;
  myPoints: number;
  onConfirm: (notes: string) => void;
  onClose: () => void;
}

export const RedeemModal: React.FC<RedeemModalProps> = ({
  reward,
  myPoints,
  onConfirm,
  onClose,
}) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const canRedeemReward = canRedeem(myPoints, reward.pointsCost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canRedeemReward) return;

    setLoading(true);
    try {
      await onConfirm(notes);
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
          <Title>🎁 Confirmar Resgate</Title>
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </Header>

        <Content>
          <RewardInfo>
            <RewardIcon>{reward.icon || '🎁'}</RewardIcon>
            <RewardDetails>
              <RewardName>{reward.name}</RewardName>
              <RewardCost>
                💎 {formatPoints(reward.pointsCost)} pontos
              </RewardCost>
            </RewardDetails>
          </RewardInfo>

          <PointsBalance>
            <BalanceLabel>Seu saldo:</BalanceLabel>
            <BalanceValue $sufficient={canRedeemReward}>
              💎 {formatPoints(myPoints)} pontos
            </BalanceValue>
          </PointsBalance>

          {!canRedeemReward && (
            <Warning>
              ⚠️ Você não tem pontos suficientes para este resgate.
            </Warning>
          )}

          <Form onSubmit={handleSubmit}>
            <Label>
              Observações (opcional)
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder='Adicione alguma observação sobre o resgate...'
                rows={4}
                disabled={loading}
              />
            </Label>

            <InfoBox>
              <InfoTitle>ℹ️ Como funciona?</InfoTitle>
              <InfoText>
                1. Sua solicitação será enviada para aprovação do gestor
              </InfoText>
              <InfoText>
                2. Os pontos <strong>não serão debitados</strong> até a
                aprovação
              </InfoText>
              <InfoText>
                3. Você receberá uma notificação quando for aprovado/rejeitado
              </InfoText>
              <InfoText>
                4. Após aprovado, você será notificado quando o prêmio for
                entregue
              </InfoText>
            </InfoBox>

            <ButtonGroup>
              <CancelButton type='button' onClick={onClose} disabled={loading}>
                Cancelar
              </CancelButton>
              <ConfirmButton
                type='submit'
                disabled={!canRedeemReward || loading}
              >
                {loading ? 'Enviando...' : 'Confirmar Resgate'}
              </ConfirmButton>
            </ButtonGroup>
          </Form>
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
  max-width: 600px;
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
`;

const RewardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
`;

const RewardIcon = styled.div`
  font-size: 4rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

const RewardDetails = styled.div`
  flex: 1;
`;

const RewardName = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
`;

const RewardCost = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
`;

const PointsBalance = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 0.75rem;
  margin-bottom: 1rem;
`;

const BalanceLabel = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const BalanceValue = styled.div<{ $sufficient: boolean }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => (props.$sufficient ? '#10b981' : '#ef4444')};
`;

const Warning = styled.div`
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 0.5rem;
  color: #92400e;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

const InfoBox = styled.div`
  padding: 1rem;
  background: #dbeafe;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
`;

const InfoTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.5rem;
`;

const InfoText = styled.div`
  font-size: 0.8125rem;
  color: #1e3a8a;
  margin-bottom: 0.25rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const CancelButton = styled.button`
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

const ConfirmButton = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
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
