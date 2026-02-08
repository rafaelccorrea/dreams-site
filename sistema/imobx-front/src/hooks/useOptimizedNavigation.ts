import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook para navegação
 * SIMPLIFICADO: Removidas otimizações que estavam causando problemas
 */
export const useOptimizedNavigation = () => {
  const navigate = useNavigate();

  const optimizedNavigate = useCallback(
    (path: string, options?: { replace?: boolean; state?: any }) => {
      // console.log('🔄 Navegando para:', path);
      // Navegação direta sem otimizações complexas
      navigate(path, options);
    },
    [navigate]
  );

  return { navigate: optimizedNavigate };
};
