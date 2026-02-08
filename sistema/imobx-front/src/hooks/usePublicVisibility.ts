import { useState, useEffect, useCallback, useRef } from 'react';
import { authApiService } from '../services/authApi';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';

interface UsePublicVisibilityReturn {
  isVisible: boolean;
  isLoading: boolean;
  isUpdating: boolean;
  toggleVisibility: () => Promise<void>;
  error: string | null;
}

export const usePublicVisibility = (): UsePublicVisibilityReturn => {
  const authContext = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedInitial = useRef(false);
  const isUpdatingRef = useRef(false);
  const isVisibleRef = useRef(false);

  // Verificar se o contexto está disponível
  const getCurrentUser = authContext?.getCurrentUser;
  const refreshUser = authContext?.refreshUser;

  // Sincronizar ref com estado
  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  // Carregar status inicial - apenas uma vez
  useEffect(() => {
    if (!getCurrentUser || hasLoadedInitial.current) {
      if (!getCurrentUser) {
        setIsLoading(false);
      }
      return;
    }

    const loadStatus = async () => {
      try {
        setIsLoading(true);
        const user = getCurrentUser();
        if (user) {
          const visibility = user.isAvailableForPublicSite || false;
          setIsVisible(visibility);
          isVisibleRef.current = visibility;
          setIsLoading(false);
          hasLoadedInitial.current = true;
        } else {
          // Se não tiver usuário no cache, buscar do servidor
          try {
            const profile = await authApiService.getProfile();
            const visibility = profile.isAvailableForPublicSite || false;
            setIsVisible(visibility);
            isVisibleRef.current = visibility;
            hasLoadedInitial.current = true;
          } catch (profileError) {
            // Se falhar ao buscar perfil, manter como false
            setIsVisible(false);
            isVisibleRef.current = false;
            hasLoadedInitial.current = true;
          }
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('Erro ao carregar status de visibilidade:', err);
        setError('Erro ao carregar status');
        setIsLoading(false);
        hasLoadedInitial.current = true;
      }
    };

    loadStatus();
  }, [getCurrentUser]);

  // Alternar visibilidade
  const toggleVisibility = useCallback(async () => {
    if (!getCurrentUser || !refreshUser) {
      toast.error(
        'Sistema não está pronto. Tente novamente em alguns instantes.'
      );
      return;
    }

    if (isUpdatingRef.current) {
      return; // Prevenir múltiplas chamadas simultâneas
    }

    isUpdatingRef.current = true;
    setIsUpdating(true);
    setError(null);

    // Pegar o valor atual usando a ref
    const previousVisibility = isVisibleRef.current;
    const newVisibility = !previousVisibility;

    // Atualizar imediatamente para feedback visual
    setIsVisible(newVisibility);
    isVisibleRef.current = newVisibility;

    try {
      const response =
        await authApiService.updatePublicVisibility(newVisibility);

      if (response.success) {
        // Atualizar com o valor retornado pela API
        const finalVisibility = response.isAvailableForPublicSite;
        setIsVisible(finalVisibility);
        isVisibleRef.current = finalVisibility;

        // Atualizar usuário no cache (sem recarregar o estado inicial)
        if (refreshUser) {
          await refreshUser();
        }
        toast.success('Visibilidade pública atualizada com sucesso!');
      } else {
        // Reverter caso API não confirme
        setIsVisible(previousVisibility);
        isVisibleRef.current = previousVisibility;
        setError(response.message || 'Erro ao atualizar visibilidade');
        toast.error(response.message || 'Erro ao atualizar visibilidade');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Erro ao atualizar visibilidade';
      // Reverter em caso de falha
      setIsVisible(previousVisibility);
      isVisibleRef.current = previousVisibility;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
      isUpdatingRef.current = false;
    }
  }, [getCurrentUser, refreshUser]);

  return { isVisible, isLoading, isUpdating, toggleVisibility, error };
};
