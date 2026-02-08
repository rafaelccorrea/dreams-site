import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  isOwnerFromToken,
  isOwnerFromUser,
  getOwnerInfoFromToken,
} from '../utils/ownerUtils';

interface UseOwnerReturn {
  isOwner: boolean;
  loading: boolean;
  error: string | null;
  ownerInfo: {
    owner: boolean;
    role: string;
  } | null;
  refreshOwnerStatus: () => Promise<void>;
}

/**
 * Hook para gerenciar o estado do campo owner do usuário
 * Verifica se o usuário atual é o proprietário real da empresa
 */
export function useOwner(): UseOwnerReturn {
  const { getCurrentUser, getToken, isAuthenticated } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<{
    owner: boolean;
    role: string;
  } | null>(null);

  /**
   * Verifica o status de owner do usuário atual
   */
  const checkOwnerStatus = useCallback(async () => {
    // Use authStorage directly to avoid function recreation issues
    const authStorage = await import('../services/authStorage');
    const isAuth = authStorage.authStorage.isAuthenticated();

    if (!isAuth) {
      setIsOwner(false);
      setOwnerInfo(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Primeiro, tenta verificar via token (mais rápido)
      const token = getToken();
      if (token) {
        const tokenInfo = getOwnerInfoFromToken(token);
        if (tokenInfo) {
          setIsOwner(tokenInfo.owner);
          setOwnerInfo(tokenInfo);
          setLoading(false);
          return;
        }
      }

      // Se não conseguir via token, busca dados do usuário
      const user = getCurrentUser();
      if (user) {
        const userIsOwner = isOwnerFromUser(user);
        setIsOwner(userIsOwner);
        setOwnerInfo({
          owner: userIsOwner,
          role: user.role || 'USER',
        });
      } else {
        setIsOwner(false);
        setOwnerInfo(null);
      }
    } catch (err) {
      console.error('Erro ao verificar status de owner:', err);
      setError('Erro ao verificar status de proprietário');
      setIsOwner(false);
      setOwnerInfo(null);
    } finally {
      setLoading(false);
    }
  }, []); // Remove all dependencies to prevent infinite loops

  /**
   * Atualiza o status de owner (útil após mudanças no perfil)
   */
  const refreshOwnerStatus = useCallback(async () => {
    await checkOwnerStatus();
  }, [checkOwnerStatus]);

  // Verificar status inicial apenas uma vez
  useEffect(() => {
    checkOwnerStatus();
  }, []); // Execute only once on mount

  // Escutar mudanças nos dados do usuário
  useEffect(() => {
    const handleUserDataUpdate = () => {
      checkOwnerStatus();
    };

    window.addEventListener('user-data-updated', handleUserDataUpdate);

    return () => {
      window.removeEventListener('user-data-updated', handleUserDataUpdate);
    };
  }, []); // Remove checkOwnerStatus dependency to prevent infinite loops

  return {
    isOwner,
    loading,
    error,
    ownerInfo,
    refreshOwnerStatus,
  };
}

/**
 * Hook simplificado que retorna apenas se é owner
 * Útil para verificações rápidas
 */
export function useIsOwner(): boolean {
  const { isOwner } = useOwner();
  return isOwner;
}

/**
 * Hook para obter informações completas do owner
 * Útil quando precisa de mais detalhes além do boolean
 */
export function useOwnerInfo() {
  const { isOwner, ownerInfo, loading, error } = useOwner();

  return {
    isOwner,
    role: ownerInfo?.role || 'USER',
    loading,
    error,
    label: isOwner ? 'Proprietário Real' : 'Administrador',
    icon: isOwner ? '👑' : '👤',
    color: isOwner ? '#FFD700' : '#6B7280',
  };
}
