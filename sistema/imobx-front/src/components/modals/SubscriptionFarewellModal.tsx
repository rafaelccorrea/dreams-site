import React from 'react';
import styled from 'styled-components';
import { MdClose, MdLogout } from 'react-icons/md';

interface SubscriptionFarewellModalProps {
  isOpen: boolean;
  secondsRemaining: number;
  onClose: () => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 10000000;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 460px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  box-shadow: 0 24px 40px rgba(0, 0, 0, 0.35);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.35rem;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FarewellMessage = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: ${props => props.theme.colors.textSecondary};
`;

const CountdownBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  padding: 8px 14px;
  border-radius: 999px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 0.9rem;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`;

const PrimaryButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    #6366f1 100%
  );
  color: #ffffff;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(59, 130, 246, 0.35);
  }
`;

export const SubscriptionFarewellModal: React.FC<
  SubscriptionFarewellModalProps
> = ({ isOpen, secondsRemaining, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={event => event.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Até breve!</ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={22} />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          <FarewellMessage>
            Sua assinatura foi cancelada e vamos sentir sua falta. Esperamos te
            ver novamente em breve! Você será desconectado automaticamente, mas
            pode sair agora se preferir.
          </FarewellMessage>
          <CountdownBadge>
            Saindo em {secondsRemaining}{' '}
            {secondsRemaining === 1 ? 'segundo' : 'segundos'}
          </CountdownBadge>
          <Actions>
            <PrimaryButton onClick={onClose}>
              <MdLogout size={20} />
              Sair agora
            </PrimaryButton>
          </Actions>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};
