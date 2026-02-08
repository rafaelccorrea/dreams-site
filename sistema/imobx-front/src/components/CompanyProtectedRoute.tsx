import React, { useEffect, useState } from 'react';
import { useCompany } from '../hooks/useCompany';
import { useAuth } from '../hooks/useAuth';
import { CompanyCreationModal } from './modals/CompanyCreationModal';
import styled from 'styled-components';

interface CompanyProtectedRouteProps {
  children: React.ReactNode;
}

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 20px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  text-align: center;
`;

const LoadingSubtext = styled.p`
  font-size: 16px;
  opacity: 0.8;
  margin: 8px 0 0 0;
  text-align: center;
`;

const AccessDeniedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
`;

const AccessDeniedIcon = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
`;

const AccessDeniedTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-align: center;
`;

const AccessDeniedMessage = styled.p`
  font-size: 18px;
  opacity: 0.9;
  margin: 0 0 32px 0;
  text-align: center;
  max-width: 600px;
`;

const RetryButton = styled.button`
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);
  }
`;

export const CompanyProtectedRoute: React.FC<CompanyProtectedRouteProps> = ({
  children,
}) => {
  const { hasCompany, isLoading, checkCompanyStatus } = useCompany();
  const { getCurrentUser } = useAuth();
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [hasCheckedCompany, setHasCheckedCompany] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    if (!isLoading && !hasCheckedCompany) {
      setHasCheckedCompany(true);

      if (!hasCompany) {
        // Verificar se usuário tem permissão para criar empresa
        const canCreateCompany =
          user?.role === 'admin' || user?.role === 'master';

        if (canCreateCompany) {
          // Se não tem empresa e tem permissão, mostrar modal após um pequeno delay para melhor UX
          setTimeout(() => {
            setShowCompanyModal(true);
          }, 1000);
        }
      }
    }
  }, [isLoading, hasCompany, hasCheckedCompany, user?.role]);

  // CORREÇÃO: Timeout de segurança para evitar loading infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCheckedCompany) {
        console.warn(
          '⚠️ CompanyProtectedRoute: Timeout de segurança - forçando hasCheckedCompany = true'
        );
        setHasCheckedCompany(true);
      }
    }, 5000); // 5 segundos de timeout

    return () => clearTimeout(timeout);
  }, [hasCheckedCompany]);

  const handleCompanyModalSuccess = () => {
    setShowCompanyModal(false);
    // Recarregar status da empresa e dados do usuário
    checkCompanyStatus();
    // Forçar recarregamento da página para atualizar os dados do usuário
    window.location.reload();
  };

  const handleRetry = () => {
    setHasCheckedCompany(false);
    checkCompanyStatus();
  };

  // Mostrar loading enquanto verifica
  if (isLoading || !hasCheckedCompany) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Verificando acesso...</LoadingText>
        <LoadingSubtext>
          Verificando se você tem uma empresa cadastrada
        </LoadingSubtext>
      </LoadingContainer>
    );
  }

  // Se não tem empresa, mostrar tela de acesso negado
  if (!hasCompany) {
    return (
      <>
        <AccessDeniedContainer>
          <AccessDeniedIcon>🏢</AccessDeniedIcon>
          <AccessDeniedTitle>Acesso Restrito</AccessDeniedTitle>
          <AccessDeniedMessage>
            {user?.role === 'user' ? (
              <>
                Para acessar esta funcionalidade, você precisa ter uma empresa
                cadastrada.
                <br />
                <br />
                <strong>⚠️ Usuários comuns não podem criar empresas.</strong>
                <br />
                Entre em contato com um administrador para criar uma empresa
                para você.
              </>
            ) : (
              <>
                Para acessar esta funcionalidade, você precisa ter uma empresa
                cadastrada.
                <br />
                <br />
                Clique em "Verificar Novamente" após criar sua empresa.
              </>
            )}
          </AccessDeniedMessage>
          <RetryButton onClick={handleRetry}>Verificar Novamente</RetryButton>
        </AccessDeniedContainer>

        <CompanyCreationModal
          isOpen={showCompanyModal}
          onSuccess={handleCompanyModalSuccess}
        />
      </>
    );
  }

  // Se tem empresa, mostrar o conteúdo normalmente
  return <>{children}</>;
};
