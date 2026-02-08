import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../hooks/useAuth';

interface SubscriptionProtectedRouteProps {
  children: React.ReactNode;
  requiredFeature?: string;
}

export const SubscriptionProtectedRoute: React.FC<
  SubscriptionProtectedRouteProps
> = ({ children, requiredFeature }) => {
  const { subscriptionStatus, loading, isMasterUser } = useSubscription();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  // Se ainda está carregando, mostrar conteúdo normalmente (sem loading visível)
  if (loading) {
    return <>{children}</>;
  }

  // Se for usuário master, sempre permitir acesso
  if (isMasterUser) {
    return <>{children}</>;
  }

  // Se for usuário comum (user) ou admin, verificar se tem assinatura ativa
  if (user?.role === 'user' || user?.role === 'admin') {
    const resolveRedirectPath = (reason?: string) => {
      if (reason === 'none') {
        return '/subscription-plans';
      }
      return user?.role === 'admin'
        ? '/subscription-management'
        : '/system-unavailable';
    };

    const statusReason =
      subscriptionStatus?.statusReason ??
      (subscriptionStatus?.subscription?.status as string | undefined);

    // Se não tem assinatura ativa, redirecionar para página de planos
    if (!subscriptionStatus?.hasActiveSubscription) {
      return <Navigate to={resolveRedirectPath(statusReason)} replace />;
    }
    // Se tem assinatura mas não pode acessar a feature específica, redirecionar para planos
    if (requiredFeature && !subscriptionStatus.canAccessFeatures) {
      return <Navigate to={resolveRedirectPath(statusReason)} replace />;
    }
    // Se tem assinatura, permitir acesso
    return <>{children}</>;
  }

  // Se tudo ok, renderizar o conteúdo
  return <>{children}</>;
};
