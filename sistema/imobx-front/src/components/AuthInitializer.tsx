import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authStorage } from '../services/authStorage';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * Componente que verifica a autenticação na inicialização da aplicação
 * e mantém o usuário logado se os dados estão válidos
 */
export const AuthInitializer: React.FC<AuthInitializerProps> = ({
  children,
}) => {
  // console.log('🚀 AuthInitializer: Componente sendo renderizado...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthOnLoad = () => {
      // console.log('🔐 AuthInitializer: Verificando autenticação ao carregar...');
      const isAuthenticated = authStorage.isAuthenticated();
      const hasToken = !!authStorage.getToken();
      const hasRefreshToken = !!authStorage.getRefreshToken();
      const shouldRemember = authStorage.shouldRememberUser();
      // Usar location.pathname do React Router (já considera o base path)
      const currentPath = location.pathname;

      // CORREÇÃO: Se tem token e refresh token, considerar autenticado
      // Mesmo que o token esteja expirado, o interceptor da API fará o refresh
      // Apenas redirecionar se estiver em /login ou /register
      if (
        hasToken &&
        hasRefreshToken &&
        (currentPath === '/login' || currentPath === '/register')
      ) {
        // console.log('✅ Usuário tem tokens válidos, redirecionando para dashboard...');
        navigate('/dashboard', { replace: true });
        return;
      }

      // Se está na página de login mas está autenticado, redirecionar para dashboard
      if (
        isAuthenticated &&
        (currentPath === '/login' || currentPath === '/register')
      ) {
        // console.log('✅ Usuário já autenticado, redirecionando para dashboard...');
        navigate('/dashboard', { replace: true });
        return;
      }

      // CORREÇÃO: Não redirecionar para login automaticamente
      // O ProtectedRoute já faz a verificação necessária para rotas protegidas
      // O AuthInitializer apenas gerencia tokens e redireciona usuários autenticados que tentam acessar login/register

      // console.log('✅ Verificação de autenticação concluída');
    };

    // Executar verificação imediatamente
    checkAuthOnLoad();
  }, [navigate, location.pathname]);

  // Listener para mudanças no localStorage (para detectar logout em outras abas)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Rotas públicas que não devem ser redirecionadas
      const publicRoutes = [
        '/ficha-venda',
        '/ficha-proposta',
        '/',
        '/login',
        '/register',
      ];
      const isPublicRoute = publicRoutes.some(
        route =>
          location.pathname === route || location.pathname.startsWith(route)
      );

      if (
        e.key === 'dream_keys_access_token' &&
        !e.newValue &&
        !isPublicRoute
      ) {
        // console.log('🔄 Token removido em outra aba, redirecionando para login...');
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate, location.pathname]);

  // CORREÇÃO: Remover verificação de visibilidade pois estava causando redirects indesejados
  // O ProtectedRoute já faz a verificação de autenticação necessária

  // console.log('🎯 AuthInitializer: Renderizando sem PermissionsProvider...');
  return <>{children}</>;
};
