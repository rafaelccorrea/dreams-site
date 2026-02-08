import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authStorage } from '../services/authStorage';

/**
 * Componente que redireciona para a página apropriada quando uma rota não é encontrada
 * - Se o usuário estiver autenticado: redireciona para /dashboard
 * - Se o usuário NÃO estiver autenticado: redireciona para /login
 */
export const NotFoundRedirect: React.FC = () => {
  const isAuthenticated = authStorage.isAuthenticated();

  useEffect(() => {}, [isAuthenticated]);

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  return <Navigate to='/login' replace />;
};
