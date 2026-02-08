import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  FaWifi,
  FaExclamationTriangle,
  FaRedo,
  FaHome,
  FaClock,
} from 'react-icons/fa';
import { getNavigationUrl } from '../../utils/pathUtils';

// Animação de pulso para o ícone
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
`;

// Animação de rotação para o spinner
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const GlobalErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const ErrorIcon = styled.div<{
  $type?: 'connection' | 'timeout' | 'server' | 'general';
}>`
  font-size: 4rem;
  margin-bottom: 24px;
  animation: ${pulse} 2s ease-in-out infinite;

  ${props => {
    switch (props.$type) {
      case 'connection':
        return `color: ${props.theme.colors.warning};`;
      case 'timeout':
        return `color: ${props.theme.colors.error};`;
      case 'server':
        return `color: ${props.theme.colors.error};`;
      default:
        return `color: ${props.theme.colors.textSecondary};`;
    }
  }}
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 16px;
  text-align: center;
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 32px;
  text-align: center;
  max-width: 600px;
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primaryHover};
      transform: translateY(-1px);
    }
  `
      : `
    background: ${props.theme.colors.surface};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.hover};
      transform: translateY(-1px);
    }
  `}
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
  margin-top: 24px;
  padding: 12px 20px;
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

interface GlobalErrorFallbackProps {
  error?: string;
  type?: 'connection' | 'timeout' | 'server' | 'general';
  isLoading?: boolean;
  onRetry?: () => void;
  onGoHome?: () => void;
}

export const GlobalErrorFallback: React.FC<GlobalErrorFallbackProps> = ({
  error,
  type = 'general',
  isLoading = false,
  onRetry,
  onGoHome,
}) => {
  const getErrorIcon = () => {
    switch (type) {
      case 'connection':
        return <FaWifi />;
      case 'timeout':
        return <FaClock />;
      case 'server':
        return <FaExclamationTriangle />;
      default:
        return <FaExclamationTriangle />;
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case 'connection':
        return 'Conexão Perdida';
      case 'timeout':
        return 'Tempo Esgotado';
      case 'server':
        return 'Servidor Indisponível';
      default:
        return 'Ops! Algo deu errado';
    }
  };

  const getErrorMessage = () => {
    if (error) return error;

    switch (type) {
      case 'connection':
        return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.';
      case 'timeout':
        return 'A operação demorou muito para ser concluída. Isso pode ser devido a problemas de conexão ou servidor sobrecarregado.';
      case 'server':
        return 'O servidor está temporariamente indisponível. Nossa equipe foi notificada e está trabalhando para resolver o problema.';
      default:
        return 'Ocorreu um erro inesperado na aplicação. Tente recarregar a página ou voltar para a página inicial.';
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = getNavigationUrl('/dashboard');
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <GlobalErrorContainer>
      <ErrorIcon $type={type}>{getErrorIcon()}</ErrorIcon>

      <ErrorTitle>{getErrorTitle()}</ErrorTitle>

      <ErrorMessage>{getErrorMessage()}</ErrorMessage>

      <ActionButtons>
        <ActionButton
          $variant='primary'
          onClick={handleRetry}
          disabled={isLoading}
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
        </ActionButton>

        <ActionButton $variant='secondary' onClick={handleGoHome}>
          <FaHome />
          Ir para Início
        </ActionButton>
      </ActionButtons>

      {type === 'connection' && (
        <StatusIndicator>
          <FaWifi />
          Verificando conexão...
        </StatusIndicator>
      )}
    </GlobalErrorContainer>
  );
};

export default GlobalErrorFallback;
