import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook de navegação simplificado sem otimizações
 * Use este se o useOptimizedNavigation estiver causando problemas
 */
export const useSimpleNavigation = () => {
  const navigate = useNavigate();

  const simpleNavigate = useCallback(
    (path: string, options?: { replace?: boolean; state?: any }) => {
      // console.log('🔄 Navegando para:', path);
      navigate(path, options);
    },
    [navigate]
  );

  return { navigate: simpleNavigate };
};
