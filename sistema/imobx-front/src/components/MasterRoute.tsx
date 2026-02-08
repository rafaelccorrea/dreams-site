import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface MasterRouteProps {
  children: React.ReactNode;
}

export const MasterRoute: React.FC<MasterRouteProps> = ({ children }) => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  // Verificar se o usuário tem permissão MASTER apenas
  if (!user || user.role !== 'master') {
    // Redirecionar para dashboard
    return <Navigate to='/dashboard' replace />;
  }

  return <>{children}</>;
};
