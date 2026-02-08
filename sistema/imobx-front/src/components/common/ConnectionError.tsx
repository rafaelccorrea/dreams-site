import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaWifi, FaExclamationTriangle, FaRedo, FaTimes } from 'react-icons/fa';

interface ConnectionErrorProps {
  error: string;
  onRetry: () => void;
  onClose?: () => void;
  isLoading?: boolean;
  isOpen?: boolean;
}

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const ErrorCard = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 40px;
  box-shadow: ${props => props.theme.shadows.xl};
  border: 2px solid ${props => props.theme.colors.error};
  max-width: 500px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.error},
      ${props => props.theme.colors.warning},
      ${props => props.theme.colors.error}
    );
    background-size: 200% 100%;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: ${props => props.theme.colors.error};
  margin-bottom: 24px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 16px;
  font-family: 'Poppins', sans-serif;
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 32px;
  line-height: 1.6;
`;

const RetryButton = styled.button<{ $isLoading?: boolean }>`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 auto;
  box-shadow: ${props => props.theme.shadows.lg};
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.xl};
    background: linear-gradient(
      135deg,
      ${props => props.theme.colors.primaryDark} 0%,
      ${props => props.theme.colors.primaryDarker} 100%
    );
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${rotate} 1s linear infinite;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding: 12px 20px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};

  svg {
    color: ${props => props.theme.colors.error};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
    transform: scale(1.1);
  }
`;

const ConnectionError: React.FC<ConnectionErrorProps> = ({
  error,
  onRetry,
  onClose,
  isLoading = false,
  isOpen = true,
}) => {
  const getErrorIcon = () => {
    if (error.includes('conexão') || error.includes('Network')) {
      return <FaWifi />;
    }
    return <FaExclamationTriangle />;
  };

  const getErrorTitle = () => {
    if (error.includes('conexão') || error.includes('Network')) {
      return 'Conexão Perdida';
    }
    if (error.includes('Sessão expirada')) {
      return 'Sessão Expirada';
    }
    if (error.includes('Servidor indisponível')) {
      return 'Servidor Indisponível';
    }
    return 'Erro de Conexão';
  };

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ErrorContainer>
        <ErrorCard>
          {onClose && (
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          )}

          <ErrorIcon>{getErrorIcon()}</ErrorIcon>

          <ErrorTitle>{getErrorTitle()}</ErrorTitle>

          <ErrorMessage>{error}</ErrorMessage>

          <RetryButton
            onClick={onRetry}
            disabled={isLoading}
            $isLoading={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Reconectando...
              </>
            ) : (
              <>
                <FaRedo />
                Tentar Novamente
              </>
            )}
          </RetryButton>

          <StatusIndicator>
            <FaWifi />
            Verificando conexão...
          </StatusIndicator>
        </ErrorCard>
      </ErrorContainer>
    </ModalOverlay>
  );
};

export default ConnectionError;
