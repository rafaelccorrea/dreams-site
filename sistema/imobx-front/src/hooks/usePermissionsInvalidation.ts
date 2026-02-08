import { useEffect, useCallback } from 'react';
import {
  permissionsCache,
  PERMISSIONS_EVENTS,
} from '../services/permissionsCache';
import { authStorage } from '../services/authStorage';

interface UsePermissionsInvalidationOptions {
  /**
   * Invalida o cache quando o usuário faz login/logout
   */
  invalidateOnAuthChange?: boolean;

  /**
   * Invalida o cache quando a empresa muda
   */
  invalidateOnCompanyChange?: boolean;

  /**
   * Invalida o cache quando há mudanças de role
   */
  invalidateOnRoleChange?: boolean;

  /**
   * Invalida o cache quando há mudanças de permissões via API
   */
  invalidateOnPermissionsUpdate?: boolean;
}

/**
 * Hook para gerenciar invalidação inteligente do cache de permissões
 */
export const usePermissionsInvalidation = (
  options: UsePermissionsInvalidationOptions = {}
) => {
  const {
    invalidateOnAuthChange = true,
    invalidateOnCompanyChange = true,
    invalidateOnRoleChange = true,
    invalidateOnPermissionsUpdate = true,
  } = options;

  /**
   * Invalida o cache quando detecta mudanças relevantes
   */
  const invalidateIfNeeded = useCallback((reason: string) => {
    // console.log(`🗑️ PermissionsInvalidation: Invalidando cache - ${reason}`);
    permissionsCache.invalidateCache();
  }, []);

  /**
   * Verifica se houve mudança de usuário/empresa
   */
  const checkForChanges = useCallback(() => {
    const currentUser = authStorage.getUserData();
    const currentCompanyId = localStorage.getItem(
      'dream_keys_selected_company_id'
    );

    const cached = permissionsCache.getCache();
    if (!cached || !currentUser) return;

    // Verificar mudança de usuário
    if (cached.userId !== currentUser.id) {
      invalidateIfNeeded('usuário mudou');
      return;
    }

    // Verificar mudança de empresa
    if (cached.companyId !== currentCompanyId) {
      invalidateIfNeeded('empresa mudou');
      return;
    }

    // Verificar mudança de role
    if (cached.role !== currentUser.role) {
      invalidateIfNeeded('role mudou');
      return;
    }
  }, [invalidateIfNeeded]);

  // Monitorar mudanças de autenticação
  useEffect(() => {
    if (!invalidateOnAuthChange) return;

    const handleAuthChange = () => {
      // console.log('🔄 PermissionsInvalidation: Mudança de autenticação detectada');
      invalidateIfNeeded('autenticação mudou');
    };

    // Escutar eventos de login/logout
    window.addEventListener('user-login', handleAuthChange);
    window.addEventListener('user-logout', handleAuthChange);
    window.addEventListener('user-changed', handleAuthChange);

    return () => {
      window.removeEventListener('user-login', handleAuthChange);
      window.removeEventListener('user-logout', handleAuthChange);
      window.removeEventListener('user-changed', handleAuthChange);
    };
  }, [invalidateOnAuthChange, invalidateIfNeeded]);

  // Monitorar mudanças de empresa
  useEffect(() => {
    if (!invalidateOnCompanyChange) return;

    const handleCompanyChange = () => {
      // console.log('🔄 PermissionsInvalidation: Mudança de empresa detectada');
      invalidateIfNeeded('empresa mudou');
    };

    window.addEventListener('company-changed', handleCompanyChange);

    return () => {
      window.removeEventListener('company-changed', handleCompanyChange);
    };
  }, [invalidateOnCompanyChange, invalidateIfNeeded]);

  // Monitorar mudanças de role
  useEffect(() => {
    if (!invalidateOnRoleChange) return;

    const handleRoleChange = () => {
      // console.log('🔄 PermissionsInvalidation: Mudança de role detectada');
      invalidateIfNeeded('role mudou');
    };

    window.addEventListener('role-changed', handleRoleChange);

    return () => {
      window.removeEventListener('role-changed', handleRoleChange);
    };
  }, [invalidateOnRoleChange, invalidateIfNeeded]);

  // Monitorar atualizações de permissões
  useEffect(() => {
    if (!invalidateOnPermissionsUpdate) return;

    const handlePermissionsUpdate = (event: CustomEvent) => {
      // console.log('🔄 PermissionsInvalidation: Atualização de permissões detectada', event.detail);
      // Verificar se a mudança afeta o usuário atual
      const currentUser = authStorage.getUserData();
      if (currentUser && event.detail.userId === currentUser.id) {
        invalidateIfNeeded('permissões foram atualizadas');
      }
    };

    // Escutar eventos de atualização de permissões
    window.addEventListener(
      'permissions-updated',
      handlePermissionsUpdate as EventListener
    );
    window.addEventListener(
      'permissions-assigned',
      handlePermissionsUpdate as EventListener
    );
    window.addEventListener(
      'permissions-removed',
      handlePermissionsUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        'permissions-updated',
        handlePermissionsUpdate as EventListener
      );
      window.removeEventListener(
        'permissions-assigned',
        handlePermissionsUpdate as EventListener
      );
      window.removeEventListener(
        'permissions-removed',
        handlePermissionsUpdate as EventListener
      );
    };
  }, [invalidateOnPermissionsUpdate, invalidateIfNeeded]);

  // Verificar mudanças periodicamente
  useEffect(() => {
    const interval = setInterval(checkForChanges, 30000); // Verificar a cada 30s

    return () => {
      clearInterval(interval);
    };
  }, [checkForChanges]);

  // Verificar mudanças quando a janela ganha foco (com debounce)
  useEffect(() => {
    let focusTimeout: NodeJS.Timeout | null = null;

    const handleFocus = () => {
      // Debounce para evitar verificações excessivas
      if (focusTimeout) {
        clearTimeout(focusTimeout);
      }

      focusTimeout = setTimeout(() => {
        // console.log('🔄 PermissionsInvalidation: Janela ganhou foco, verificando mudanças...');
        checkForChanges();
      }, 500); // Aguardar 500ms antes de verificar
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        handleFocus();
      }
    });

    return () => {
      if (focusTimeout) {
        clearTimeout(focusTimeout);
      }
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
    };
  }, [checkForChanges]);

  return {
    invalidateCache: invalidateIfNeeded,
    checkForChanges,
  };
};

/**
 * Hook para disparar eventos quando permissões são atualizadas
 */
export const usePermissionsEventDispatcher = () => {
  const dispatchPermissionsUpdated = useCallback(
    (userId: string, permissions: string[]) => {
      const event = new CustomEvent('permissions-updated', {
        detail: { userId, permissions, timestamp: Date.now() },
      });
      window.dispatchEvent(event);
    },
    []
  );

  const dispatchPermissionsAssigned = useCallback(
    (userId: string, permissions: string[]) => {
      const event = new CustomEvent('permissions-assigned', {
        detail: { userId, permissions, timestamp: Date.now() },
      });
      window.dispatchEvent(event);
    },
    []
  );

  const dispatchPermissionsRemoved = useCallback(
    (userId: string, permissions: string[]) => {
      const event = new CustomEvent('permissions-removed', {
        detail: { userId, permissions, timestamp: Date.now() },
      });
      window.dispatchEvent(event);
    },
    []
  );

  return {
    dispatchPermissionsUpdated,
    dispatchPermissionsAssigned,
    dispatchPermissionsRemoved,
  };
};
