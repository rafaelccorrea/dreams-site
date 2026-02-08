import React from 'react';
import styled, { keyframes } from 'styled-components';
import { MdShield } from 'react-icons/md';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  userName: string;
  isLoading?: boolean;
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(8px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${p => (p.$open ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: ${fadeIn} 120ms ease-out;
`;

const Modal = styled.div`
  width: 94%;
  max-width: 480px;
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  animation: ${slideIn} 160ms ease-out;
`;

const Header = styled.div`
  padding: 18px 22px;
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
`;

const Body = styled.div`
  padding: 22px;
`;

const Description = styled.p`
  margin: 0 0 10px 0;
  color: ${p => p.theme.colors.text};
  line-height: 1.5;
`;

const Emphasis = styled.span`
  font-weight: 700;
  color: ${p => (p.theme.mode === 'dark' ? '#fecaca' : '#991b1b')};
`;

const Footer = styled.div`
  padding: 16px 22px;
  background: ${p => p.theme.colors.backgroundSecondary};
  border-top: 1px solid ${p => p.theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button<{ $variant?: 'ghost' | 'danger' }>`
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 700;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s ease;

  ${p =>
    p.$variant === 'danger'
      ? `
    background: #ef4444;
    color: #fff;
    &:hover { background: #dc2626; transform: translateY(-1px); }
    &:active { transform: none; }
    &:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  `
      : `
    background: transparent;
    color: ${p.theme.colors.text};
    border: 1px solid ${p.theme.colors.border};
    &:hover { background: ${p.theme.colors.background}; }
  `}
`;

export const ResetTwoFactorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isLoading = false,
}) => {
  return (
    <Overlay $open={isOpen}>
      <Modal>
        <Header>
          <MdShield size={20} />
          <Title>Resetar 2FA do Usuário</Title>
        </Header>
        <Body>
          <Description>
            Tem certeza que deseja resetar a autenticação de dois fatores de{' '}
            <Emphasis>{userName}</Emphasis>?
          </Description>
          <Description>
            O usuário precisará reconfigurar o 2FA no próximo login.
          </Description>
        </Body>
        <Footer>
          <Button onClick={onClose}>Cancelar</Button>
          <Button $variant='danger' onClick={onConfirm} disabled={isLoading}>
            <MdShield size={16} />
            {isLoading ? 'Resetando...' : 'Resetar 2FA'}
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default ResetTwoFactorModal;
