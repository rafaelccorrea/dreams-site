import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SubscriptionContext } from '../contexts/SubscriptionContext';
import type { SubscriptionStatusType } from '../types/subscription';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const PUBLIC_PATHS = new Set([
  '/subscription-plans',
  '/system-unavailable',
  '/subscription-management',
  '/verifying-access',
  '/create-first-company',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/email-confirmation',
]);

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  children,
}) => {
  const subscriptionContext = useContext(SubscriptionContext);
  const { getCurrentUser } = useAuth();
  const location = useLocation();
  const user = getCurrentUser();

  if (!subscriptionContext) {
    console.error(
      '❌ SubscriptionGuard: SubscriptionContext não disponível, bloqueando acesso'
    );
    return <Navigate to='/login' replace />;
  }

  if (!user) {
    console.error(
      '❌ SubscriptionGuard: Usuário não encontrado, bloqueando acesso'
    );
    return <Navigate to='/login' replace />;
  }

  const { subscriptionStatus, isMasterUser, loading } = subscriptionContext;

  const hasCompanyId = Boolean(
    localStorage.getItem('dream_keys_selected_company_id')
  );
  const userRole = user.role;
  const isMaster = isMasterUser();
  const isAdmin = userRole === 'admin';

  const shouldCheckSubscription =
    hasCompanyId &&
    !isMaster &&
    !PUBLIC_PATHS.has(location.pathname) &&
    (userRole === 'admin' || userRole === 'user');

  if (isMaster || PUBLIC_PATHS.has(location.pathname)) {
    return <>{children}</>;
  }

  if (!hasCompanyId || !shouldCheckSubscription) {
    return <>{children}</>;
  }

  if (loading) {
    return <>{children}</>;
  }

  if (!subscriptionStatus) {
    console.warn(
      '⚠️ SubscriptionGuard: Subscription carregou mas está null, permitindo acesso'
    );
    return <>{children}</>;
  }

  if (!subscriptionStatus.hasActiveSubscription) {
    const statusReason: SubscriptionStatusType | 'unknown' | undefined =
      subscriptionStatus.statusReason ??
      (subscriptionStatus.subscription?.status as
        | SubscriptionStatusType
        | undefined);

    if (statusReason === 'none') {
      return <Navigate to='/subscription-plans' replace />;
    }

    if (isAdmin) {
      return <Navigate to='/subscription-management' replace />;
    }

    return <Navigate to='/system-unavailable' replace />;
  }

  if (
    isAdmin &&
    (subscriptionStatus.isExpired || subscriptionStatus.isExpiringSoon) &&
    location.pathname !== '/subscription-management'
  ) {
    return <Navigate to='/subscription-management' replace />;
  }

  return <>{children}</>;
};
