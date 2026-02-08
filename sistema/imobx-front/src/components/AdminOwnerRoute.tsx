import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useIsOwner } from '../hooks/useOwner';

interface AdminOwnerRouteProps {
  children: React.ReactNode;
}

/**
 * Rota protegida que requer que o usuário seja ADMIN e OWNER
 * Apenas administradores que são proprietários da empresa podem acessar
 */
export const AdminOwnerRoute: React.FC<AdminOwnerRouteProps> = ({
  children,
}) => {
  const { getCurrentUser } = useAuth();
  const isOwner = useIsOwner();
  const user = getCurrentUser();

  // Verificar se o usuário tem permissão de admin ou master
  const isAdmin = user && (user.role === 'admin' || user.role === 'master');

  // Verificar se o usuário é admin E owner
  // CORREÇÃO: Para master, permitir acesso mesmo sem owner=true
  const isMaster = user && user.role === 'master';
  const canAccess = user && isAdmin && (isMaster || isOwner);

  if (!canAccess) {
    console.log('🚫 [AdminOwnerRoute] Acesso negado:', {
      hasUser: !!user,
      userRole: user?.role,
      isAdmin,
      isMaster,
      isOwner,
      canAccess,
    });
    // Redirecionar para página inicial preferida do usuário
    const STORAGE_KEY = 'user_home_page_preference';
    const homePage = localStorage.getItem(STORAGE_KEY) || '/dashboard';
    return <Navigate to={homePage} replace />;
  }

  return <>{children}</>;
};
