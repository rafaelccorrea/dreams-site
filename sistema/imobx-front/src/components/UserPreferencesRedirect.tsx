/**
 * Componente para redirecionar usuários baseado em suas preferências
 * Usado na rota raiz para levar o usuário à sua tela inicial preferida
 */

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { getDefaultRouteSync } from '../utils/userPreferencesNavigation';

interface UserPreferencesRedirectProps {
  fallbackRoute?: string;
}

export const UserPreferencesRedirect: React.FC<
  UserPreferencesRedirectProps
> = ({ fallbackRoute = '/dashboard' }) => {
  const { preferences, isLoading, error } = useUserPreferences();
  const [redirectRoute, setRedirectRoute] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !error) {
      if (preferences?.defaultHomeScreen) {
        const route = getDefaultRouteSync(preferences.defaultHomeScreen);
        // console.log('🧭 UserPreferencesRedirect: Redirecionando para:', route);
        setRedirectRoute(route);
      } else {
        // console.log('🧭 UserPreferencesRedirect: Nenhuma preferência, usando fallback:', fallbackRoute);
        setRedirectRoute(fallbackRoute);
      }
    } else if (!isLoading && error) {
      // console.log('🧭 UserPreferencesRedirect: Erro ao carregar preferências, usando fallback:', fallbackRoute);
      setRedirectRoute(fallbackRoute);
    }
  }, [preferences, isLoading, error, fallbackRoute]);

  // Mostrar loading enquanto carrega preferências
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(255,255,255,0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <div>Carregando suas preferências...</div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Redirecionar quando a rota estiver determinada
  if (redirectRoute) {
    return <Navigate to={redirectRoute} replace />;
  }

  // Fallback final
  return <Navigate to={fallbackRoute} replace />;
};
