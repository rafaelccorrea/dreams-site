import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '../services/authStorage';

interface AuthInitializationState {
  isInitializing: boolean;
  isAuthenticated: boolean;
  user: any;
}

/**
 * Hook para gerenciar a inicialização da autenticação
 * Verifica se o usuário está logado ao carregar a aplicação
 */
export const useAuthInitialization = (): AuthInitializationState => {
  const [state, setState] = useState<AuthInitializationState>({
    isInitializing: true,
    isAuthenticated: false,
    user: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      // console.log('🔐 Iniciando verificação de autenticação...');
      try {
        // Verificar se há dados de autenticação salvos
        const token = authStorage.getToken();
        const refreshToken = authStorage.getRefreshToken();
        const userData = authStorage.getUserData();
        const shouldRemember = authStorage.shouldRememberUser();

        if (!token || !refreshToken || !userData) {
          // console.log('❌ Dados de autenticação incompletos');
          setState({
            isInitializing: false,
            isAuthenticated: false,
            user: null,
          });
          return;
        }

        // Verificar se o token ainda é válido
        const isTokenValid = authStorage.isTokenValid();
        // console.log('🔍 Token válido:', isTokenValid);
        if (isTokenValid) {
          // Token válido, usuário autenticado
          // console.log('✅ Usuário autenticado com token válido');
          setState({
            isInitializing: false,
            isAuthenticated: true,
            user: userData,
          });
          return;
        }

        // Token expirado, mas temos refresh token
        if (refreshToken) {
          // console.log('🔄 Token expirado, mas refresh token disponível');
          setState({
            isInitializing: false,
            isAuthenticated: true, // Considerar autenticado para permitir refresh automático
            user: userData,
          });
          return;
        }

        // Sem refresh token, fazer logout
        // console.log('❌ Sem refresh token, fazendo logout');
        authStorage.clearAllAuthData();
        setState({
          isInitializing: false,
          isAuthenticated: false,
          user: null,
        });
      } catch (error) {
        console.error('❌ Erro na inicialização da autenticação:', error);
        authStorage.clearAllAuthData();
        setState({
          isInitializing: false,
          isAuthenticated: false,
          user: null,
        });
      }
    };

    initializeAuth();
  }, []);

  return state;
};
