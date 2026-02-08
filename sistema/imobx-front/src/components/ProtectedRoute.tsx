import React from 'react';
import { Navigate } from 'react-router-dom';
import { authStorage } from '../services/authStorage';
import CompanyRequiredGuard from './CompanyRequiredGuard';
import { SubscriptionGuard } from './SubscriptionGuardNew';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // console.log('🔒 ProtectedRoute: Verificando autenticação...');
  const isAuthenticated = authStorage.isAuthenticated();
  const user = authStorage.getUserData();

  // SEGURANÇA REFORÇADA: Verificar autenticação E dados do usuário
  // console.log('🔐 ProtectedRoute: isAuthenticated:', isAuthenticated, 'user:', !!user);
  if (!isAuthenticated || !user) {
    console.error(
      '❌ ProtectedRoute: Usuário não autenticado ou sem dados, redirecionando para login'
    );
    return <Navigate to='/login' replace />;
  }

  // SEGURANÇA ADICIONAL: Verificar se o token ainda é válido
  const hasValidToken = !!authStorage.getToken();
  const hasRefreshToken = !!authStorage.getRefreshToken();

  if (!hasValidToken && !hasRefreshToken) {
    console.error(
      '❌ ProtectedRoute: Token inválido ou ausente, redirecionando para login'
    );
    authStorage.clearAllAuthData();
    return <Navigate to='/login' replace />;
  }

  // console.log('✅ ProtectedRoute: Usuário autenticado, aplicando guards de segurança...');
  return (
    <SubscriptionGuard>
      <CompanyRequiredGuard>{children}</CompanyRequiredGuard>
    </SubscriptionGuard>
  );
};

export default ProtectedRoute;
