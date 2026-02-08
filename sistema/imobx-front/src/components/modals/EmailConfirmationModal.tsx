import React, { useEffect, useState } from 'react';
import { IoMail, IoCheckmarkCircle, IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  redirectToLogin?: boolean;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
`;

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: ${props => (props.isOpen ? fadeIn : fadeOut)} 0.3s ease-in-out;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
`;

const ModalCard = styled.div<{ isOpen: boolean }>`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  position: relative;
  animation: ${props => (props.isOpen ? fadeIn : fadeOut)} 0.3s ease-in-out;
  transform: ${props =>
    props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)'};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: ${fadeIn} 0.5s ease-in-out 0.2s both;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #10b981, #059669);
    opacity: 0.2;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.2;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.1;
    }
    100% {
      transform: scale(1);
      opacity: 0.2;
    }
  }
`;

const MailIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: ${fadeIn} 0.5s ease-in-out 0.2s both;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    opacity: 0.2;
    animation: pulse 2s infinite;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 16px;
  animation: ${fadeIn} 0.5s ease-in-out 0.3s both;
`;

const Message = styled.p`
  font-size: 16px;
  color: #6b7280;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease-in-out 0.4s both;
`;

const EmailHighlight = styled.span`
  color: #3b82f6;
  font-weight: 600;
`;

const Instructions = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease-in-out 0.5s both;
`;

const InstructionsTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InstructionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InstructionItem = styled.li`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  gap: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: '•';
    color: #3b82f6;
    font-weight: bold;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const CountdownContainer = styled.div`
  text-align: center;
  animation: ${fadeIn} 0.5s ease-in-out 0.6s both;
`;

const CountdownText = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
`;

const CountdownTimer = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #3b82f6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #eff6ff;
  border-radius: 50%;
  border: 2px solid #3b82f6;
`;

const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  isOpen,
  onClose,
  email,
  redirectToLogin = true,
}) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!isOpen) return;

    setCountdown(10);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    if (redirectToLogin) {
      navigate('/login');
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalCard isOpen={isOpen}>
        <CloseButton onClick={handleClose} title='Fechar'>
          <IoClose size={20} />
        </CloseButton>

        <IconContainer>
          <MailIcon>
            <IoMail size={32} color='white' />
          </MailIcon>
        </IconContainer>

        <Title>Email de Confirmação Enviado!</Title>

        <Message>
          Enviamos um link de confirmação para{' '}
          <EmailHighlight>{email}</EmailHighlight>.
          <br />
          Clique no link para ativar sua conta.
        </Message>

        <Instructions>
          <InstructionsTitle>
            <IoCheckmarkCircle size={16} color='#10b981' />
            Próximos passos:
          </InstructionsTitle>
          <InstructionsList>
            <InstructionItem>Verifique sua caixa de entrada</InstructionItem>
            <InstructionItem>
              Procure também na pasta de spam/lixo eletrônico
            </InstructionItem>
            <InstructionItem>
              Clique no link de confirmação no email
            </InstructionItem>
            <InstructionItem>
              Faça login após confirmar sua conta
            </InstructionItem>
          </InstructionsList>
        </Instructions>

        <CountdownContainer>
          <CountdownText>Este modal será fechado em:</CountdownText>
          <CountdownTimer>{countdown}</CountdownTimer>
        </CountdownContainer>
      </ModalCard>
    </ModalOverlay>
  );
};

export default EmailConfirmationModal;
