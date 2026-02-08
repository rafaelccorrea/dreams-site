import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { MdClose, MdShield, MdAutorenew } from 'react-icons/md';

interface TwoFactorVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  error?: string | null;
}

export const TwoFactorVerifyModal: React.FC<TwoFactorVerifyModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  error,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>
            <MdShield /> Verificação 2FA
          </Title>
          <CloseButton onClick={onClose}>
            <MdClose size={18} />
          </CloseButton>
        </Header>
        <Body>
          <Description>
            Insira o código de 6 dígitos do seu aplicativo autenticador.
          </Description>
          <Input
            placeholder='000000'
            value={code}
            onChange={e =>
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
          />
          {error && <ErrorText>{error}</ErrorText>}
          <Actions>
            <PrimaryButton
              disabled={code.length !== 6 || loading}
              onClick={async () => {
                setLoading(true);
                await onVerify(code);
                setLoading(false);
              }}
            >
              {loading ? (
                <>
                  <SpinnerIcon size={18} />
                  Verificando...
                </>
              ) : (
                'Confirmar'
              )}
            </PrimaryButton>
          </Actions>
        </Body>
      </Modal>
    </Overlay>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000000;
  padding: 20px;
  opacity: 0;
  animation: ${fadeIn} 160ms ease-out forwards;
`;
const Modal = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  width: 100%;
  max-width: 560px;
  overflow: hidden;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
  opacity: 0;
  transform: translateY(10px) scale(0.985);
  animation: ${slideIn} 200ms ease-out 60ms forwards;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 18px 22px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;
const Title = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.1rem;
  font-weight: 700;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  border-radius: 6px;
  padding: 6px;
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
  }
`;
const Body = styled.div`
  padding: 20px 22px 22px;
`;
const Description = styled.p`
  margin: 0 0 14px 0;
  color: ${({ theme }) => theme.colors.textSecondary || theme.colors.text};
  font-size: 1rem;
  line-height: 1.5;
`;
const Input = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 1.25rem;
  letter-spacing: 3px;
  text-align: center;
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease,
    background 120ms ease;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(28, 78, 255, 0.15);
    background: ${({ theme }) => theme.colors.backgroundSecondary};
  }
`;
const Actions = styled.div`
  display: flex;
  justify-content: stretch;
  margin-top: 16px;
`;
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;
const PrimaryButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(28, 78, 255, 0.25);
  transition:
    transform 120ms ease,
    box-shadow 120ms ease,
    filter 120ms ease,
    opacity 120ms ease;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(28, 78, 255, 0.3);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
    filter: brightness(0.96);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;
const SpinnerIcon = styled(MdAutorenew)`
  animation: ${rotate} 800ms linear infinite;
`;
const ErrorText = styled.div`
  color: #ef4444;
  margin-top: 8px;
`;
