import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authStorage } from '../services/authStorage';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authStorage.isAuthenticated();

  // Rotas que devem redirecionar usuários autenticados
  const redirectIfAuthenticated = ['/login', '/register'];

  // Se está autenticado e tentando acessar login/register, redirecionar para dashboard
  if (isAuthenticated && redirectIfAuthenticated.includes(location.pathname)) {
    const STORAGE_KEY = 'user_home_page_preference';
    const homePage = localStorage.getItem(STORAGE_KEY) || '/dashboard';
    return <Navigate to={homePage} replace />;
  }

  // Para outras rotas públicas (como landing page), permitir acesso mesmo se autenticado
  return <>{children}</>;
};

export default PublicRoute;
