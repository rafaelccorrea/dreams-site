import { useEffect, useRef } from 'react';
import { authStorage } from '../services/authStorage';

export const useAuthMonitor = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Verificar autenticação a cada 30 segundos
    const checkAuth = () => {
      const isAuthenticated = authStorage.isAuthenticated();
      const authData = authStorage.getAuthData();

      if (!isAuthenticated && authData.token) {
        // Token existe mas usuário não está autenticado - pode precisar de refresh
        // console.log('Token encontrado mas usuário não autenticado');
      }
    };

    // Verificar imediatamente
    checkAuth();

    // Configurar verificação periódica
    intervalRef.current = setInterval(checkAuth, 30000); // 30 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return null;
};
