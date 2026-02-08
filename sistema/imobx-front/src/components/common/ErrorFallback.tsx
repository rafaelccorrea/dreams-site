import React from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';
import { getNavigationUrl } from '../../utils/pathUtils';

const ErrorFallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: ${props => props.theme.colors.error};
  margin-bottom: 24px;
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

const ErrorDetails = styled.details`
  margin-top: 32px;
  padding: 20px;
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  max-width: 800px;
  width: 100%;
`;

const ErrorDetailsSummary = styled.summary`
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text};
`;

const ErrorCode = styled.pre`
  background: ${props => props.theme.colors.background};
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.9rem;
  white-space: pre-wrap;
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
`;

interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: any;
  onRetry?: () => void;
  onGoHome?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  onRetry,
  onGoHome,
}) => {
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
    <ErrorFallbackContainer>
      <ErrorIcon>
        <FaExclamationTriangle />
      </ErrorIcon>

      <ErrorTitle>Ops! Algo deu errado</ErrorTitle>

      <ErrorMessage>
        Ocorreu um erro inesperado na aplicação. Isso pode ser devido a
        problemas de conexão, um bug temporário ou uma atualização em andamento.
        Tente recarregar a página ou voltar para a página inicial.
      </ErrorMessage>

      <ActionButtons>
        <ActionButton $variant='primary' onClick={handleRetry}>
          <FaRedo />
          Tentar Novamente
        </ActionButton>

        <ActionButton $variant='secondary' onClick={handleGoHome}>
          <FaHome />
          Ir para Início
        </ActionButton>
      </ActionButtons>

      {(error || errorInfo) && (
        <ErrorDetails>
          <ErrorDetailsSummary>
            Detalhes técnicos (clique para expandir)
          </ErrorDetailsSummary>

          {error && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'inherit' }}>Erro:</h4>
              <ErrorCode>{error.toString()}</ErrorCode>
            </div>
          )}

          {errorInfo && (
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: 'inherit' }}>
                Stack Trace:
              </h4>
              <ErrorCode>{errorInfo.componentStack}</ErrorCode>
            </div>
          )}
        </ErrorDetails>
      )}
    </ErrorFallbackContainer>
  );
};

export default ErrorFallback;
