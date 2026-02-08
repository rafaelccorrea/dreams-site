import { useEffect, useRef } from 'react';
import { authStorage } from '../services/authStorage';
import { api } from '../services/api';
import { getNavigationUrl } from '../utils/pathUtils';

export const useTokenRefresh = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  const performRefresh = async (): Promise<boolean> => {
    if (isRefreshingRef.current) {
      return false; // Já está fazendo refresh
    }

    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    isRefreshingRef.current = true;

    try {
      const response = await api.post('/auth/refresh', {
        refresh_token: refreshToken,
      });

      // Salvar novos tokens
      authStorage.saveAuthData(response.data, authStorage.shouldRememberUser());

      return true;
    } catch (error) {
      // Se o refresh falhar, fazer logout
      authStorage.clearAllAuthData();
      window.location.href = getNavigationUrl('/login');
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  };

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const token = authStorage.getToken();
      if (!token) return;

      try {
        const decodedToken = authStorage.getDecodedToken();
        if (!decodedToken) return;

        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = decodedToken.exp - currentTime;

        // Se o token expira em menos de 3 minutos, fazer refresh
        if (timeUntilExpiry < 180 && timeUntilExpiry > 0) {
          await performRefresh();
        }
      } catch (error) {
        // Erro ao verificar token
      }
    };

    // Verificar imediatamente
    checkAndRefreshToken();

    // Verificar a cada 1 minuto
    intervalRef.current = setInterval(checkAndRefreshToken, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    performRefresh,
  };
};
