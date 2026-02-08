import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCompany } from '../hooks/useCompany';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';

interface CompanyGuardProps {
  children: React.ReactNode;
}

/**
 * Componente de guarda que verifica se o usuário tem uma empresa
 * PRIMEIRO verifica se tem assinatura ativa antes de verificar empresas
 * Se não tiver empresa e tiver permissão para criar, redireciona para página de criação
 * Se não tiver permissão, permite acesso normal (pode ser um usuário comum)
 */
const CompanyGuard: React.FC<CompanyGuardProps> = ({ children }) => {
  const { companies, isLoading, error } = useCompany();
  const { getCurrentUser } = useAuth();
  const { subscriptionStatus, loading: subscriptionLoading } =
    useSubscription();

  const user = getCurrentUser();
  const canCreateCompany = user?.role === 'admin' || user?.role === 'master';

  // Se ainda está carregando empresas ou assinatura, mostrar conteúdo normalmente
  if (isLoading || subscriptionLoading) {
    return <>{children}</>;
  }

  // Se houve erro ao carregar empresas, permitir acesso
  if (error) {
    return <>{children}</>;
  }

  // PRIORIDADE 1: Se usuário tem assinatura ativa mas não tem empresa, redirecionar para verificação de acesso
  if (
    subscriptionStatus?.hasActiveSubscription &&
    companies.length === 0 &&
    canCreateCompany
  ) {
    return <Navigate to='/verifying-access' replace />;
  }

  // PRIORIDADE 2: Se não tem assinatura ativa, não verificar empresa ainda
  if (!subscriptionStatus?.hasActiveSubscription && user?.role !== 'master') {
    return <>{children}</>;
  }

  // Se usuário não tem permissão para criar empresa, permitir acesso
  if (!canCreateCompany) {
    return <>{children}</>;
  }

  // Se tem empresa, permitir acesso
  return <>{children}</>;
};

export default CompanyGuard;
