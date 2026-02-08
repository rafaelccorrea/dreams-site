import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  // Verificar se o usuário tem permissão de admin ou master
  if (!user || (user.role !== 'admin' && user.role !== 'master')) {
    // Redirecionar para página inicial preferida do usuário
    const STORAGE_KEY = 'user_home_page_preference';
    const homePage = localStorage.getItem(STORAGE_KEY) || '/dashboard';
    return <Navigate to={homePage} replace />;
  }

  return <>{children}</>;
};
