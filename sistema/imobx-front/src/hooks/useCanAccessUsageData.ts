import { useAuth } from './useAuth';
import { useOwner } from './useOwner';

/**
 * Hook para verificar se o usuário pode acessar dados de uso da assinatura
 * Apenas usuários admin, owner ou master podem acessar esses dados
 */
export const useCanAccessUsageData = (): boolean => {
  const { getCurrentUser } = useAuth();
  const { isOwner } = useOwner();

  const user = getCurrentUser();

  // Verificar se o usuário tem permissão para acessar dados de uso
  const canAccess =
    user?.role === 'admin' || user?.role === 'master' || isOwner;

  return canAccess;
};
