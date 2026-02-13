import { useState, useEffect, useCallback, useRef } from 'react';
import { permissionsApi } from '../services/permissionsApi';
import {
  permissionsCache,
  PERMISSIONS_EVENTS,
} from '../services/permissionsCache';
import { authStorage } from '../services/authStorage';
import { usePermissionsSocket } from './usePermissionsSocket';

interface UserPermissions {
  permissionNames: string[];
  role: string;
  companyId: string;
}

interface UsePermissionsOptimizedReturn {
  userPermissions: UserPermissions | null;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  isLoading: boolean;
  error: string | null;
  refreshPermissions: () => Promise<void>;
  invalidateCache: () => void;
  cacheStats: {
    exists: boolean;
    isValid: boolean;
    isStale: boolean;
    age?: number;
    permissionsCount?: number;
    role?: string;
  };
}

function roleToString(role: unknown): string {
  if (role == null) return '';
  if (typeof role === 'string') return role;
  if (typeof role === 'object' && role !== null && 'name' in role) return String((role as { name?: unknown }).name ?? '');
  return String(role);
}

export const usePermissionsOptimized = (): UsePermissionsOptimizedReturn => {
  const [userPermissions, setUserPermissions] =
    useState<UserPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs para evitar loops e controlar requisições
  const isInitialized = useRef(false);
  const isRefreshing = useRef(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasSubscriptionError = useRef(false); // Flag para evitar loops quando não há assinatura
  const lastErrorRef = useRef<string | null>(null); // Último erro para evitar loops

  // Obter token para WebSocket
  const token = authStorage.getToken();

  /**
   * Carrega permissões da API e atualiza o cache
   */
  const loadPermissionsFromAPI = useCallback(
    async (force = false): Promise<UserPermissions | null> => {
      try {
        // Se já houve erro de assinatura e não é forçado, não tentar novamente
        if (hasSubscriptionError.current && !force) {
          console.log(
            '⏭️ [usePermissionsOptimized] Erro de assinatura anterior detectado, pulando requisição'
          );
          return null;
        }

        // Carregando permissões da API
        const response = await permissionsApi.getMyPermissions();

        // Resetar flag de erro se a requisição foi bem-sucedida
        hasSubscriptionError.current = false;
        lastErrorRef.current = null;

        if (!response || !response.permissionNames) {
          // Resposta inválida da API
          return null;
        }

        const user = authStorage.getUserData();
        const companyId =
          localStorage.getItem('dream_keys_selected_company_id') || '';

        if (!user) {
          // Usuário não encontrado
          return null;
        }

        const roleStr = roleToString(user.role);
        const newPermissions: UserPermissions = {
          permissionNames: response.permissionNames,
          role: roleStr,
          companyId,
        };

        // Atualizar cache e detectar mudanças
        permissionsCache.updateCache(
          response.permissionNames,
          roleStr,
          companyId,
          user.id
        );

        // Permissões carregadas da API

        return newPermissions;
      } catch (err: any) {
        // Verificar se é erro relacionado à falta de assinatura
        const errorMessage = err?.response?.data?.message || err?.message || '';
        const isSubscriptionError =
          errorMessage.includes('assinatura') ||
          errorMessage.includes('subscription') ||
          err?.response?.status === 403 ||
          err?.response?.status === 402;

        if (isSubscriptionError) {
          hasSubscriptionError.current = true;
          lastErrorRef.current = errorMessage;
          console.log(
            '⚠️ [usePermissionsOptimized] Erro de assinatura detectado, parando tentativas:',
            errorMessage
          );
        }

        // Erro ao carregar permissões da API
        throw err;
      }
    },
    []
  );

  /**
   * Carrega permissões do cache ou da API
   */
  const loadPermissions = useCallback(
    async (force = false): Promise<void> => {
      // Evitar múltiplas requisições simultâneas
      if (isRefreshing.current && !force) {
        // console.log('⏳ usePermissionsOptimized: Já está carregando, aguardando...');
        return;
      }

      try {
        isRefreshing.current = true;
        setError(null);

        // Verificar se há cache válido
        const cached = permissionsCache.getCache();

        if (cached && !force && permissionsCache.isCacheValid()) {
          // console.log('✅ usePermissionsOptimized: Usando cache válido');
          const user = authStorage.getUserData();
          if (user) {
            setUserPermissions({
              permissionNames: cached.permissions,
              role: roleToString(cached.role),
              companyId: cached.companyId,
            });

            // Se o cache está stale, atualizar em background
            if (permissionsCache.isCacheStale()) {
              // console.log('🔄 usePermissionsOptimized: Cache stale, atualizando em background...');
              setTimeout(() => loadPermissionsFromAPI(), 100);
            }

            return;
          }
        }

        // Carregar da API
        setIsLoading(true);
        const newPermissions = await loadPermissionsFromAPI(force);

        if (newPermissions) {
          setUserPermissions(newPermissions);
        } else {
          setError('Falha ao carregar permissões');
        }
      } catch (err: any) {
        console.error(
          '❌ usePermissionsOptimized: Erro ao carregar permissões:',
          err
        );

        // Verificar se é erro relacionado à falta de assinatura
        const errorMessage = err?.response?.data?.message || err?.message || '';
        const isSubscriptionError =
          errorMessage.includes('assinatura') ||
          errorMessage.includes('subscription') ||
          err?.response?.status === 403 ||
          err?.response?.status === 402;

        if (isSubscriptionError) {
          hasSubscriptionError.current = true;
          lastErrorRef.current = errorMessage;
          console.log(
            '⚠️ [usePermissionsOptimized] Erro de assinatura, parando tentativas futuras'
          );

          // Definir permissões vazias para evitar loops
          setUserPermissions({
            permissionNames: [],
            role: roleToString(authStorage.getUserData()?.role),
            companyId:
              localStorage.getItem('dream_keys_selected_company_id') || '',
          });
          setError('Usuário sem assinatura ativa');
          return; // Parar aqui para evitar mais tentativas
        }

        // Em caso de outro erro, tentar usar cache mesmo que expirado
        const cached = permissionsCache.getCache();
        if (cached) {
          // console.log('⚠️ usePermissionsOptimized: Usando cache expirado devido ao erro');
          setUserPermissions({
            permissionNames: cached.permissions,
            role: roleToString(cached.role),
            companyId: cached.companyId,
          });
        } else {
          setError(err.message || 'Erro ao carregar permissões');
        }
      } finally {
        setIsLoading(false);
        isRefreshing.current = false;
      }
    },
    [loadPermissionsFromAPI]
  );

  /**
   * Força refresh das permissões
   */
  const refreshPermissions = useCallback(async (): Promise<void> => {
    // console.log('🔄 usePermissionsOptimized: Forçando refresh das permissões...');
    await loadPermissions(true);
  }, [loadPermissions]);

  /**
   * Invalida o cache
   */
  const invalidateCache = useCallback((): void => {
    // console.log('🗑️ usePermissionsOptimized: Invalidando cache...');
    permissionsCache.invalidateCache();
    setUserPermissions(null);
  }, []);

  /**
   * Verifica se o usuário tem uma permissão específica
   */
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!userPermissions) {
        if (import.meta.env.DEV) {
          // console.log(`🔍 hasPermission("${permission}"): No user permissions available`);
        }
        return false;
      }

      const hasIt = userPermissions.permissionNames.includes(permission);
      // if (import.meta.env.DEV) {
      //   console.log(`🔍 hasPermission("${permission}"):`, hasIt, {
      //     userPermissions: userPermissions.permissionNames,
      //     searching: permission
      //   });
      // }
      return hasIt;
    },
    [userPermissions]
  );

  /**
   * Verifica se o usuário tem qualquer uma das permissões
   */
  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      if (!userPermissions) return false;
      return permissions.some(permission =>
        userPermissions.permissionNames.includes(permission)
      );
    },
    [userPermissions]
  );

  /**
   * Verifica se o usuário tem todas as permissões
   */
  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      if (!userPermissions) return false;
      return permissions.every(permission =>
        userPermissions.permissionNames.includes(permission)
      );
    },
    [userPermissions]
  );

  // Carregar permissões na inicialização - OTIMIZADO: só carrega quando realmente necessário
  useEffect(() => {
    // Verificar se há usuário autenticado primeiro
    const user = authStorage.getUserData();
    const token = authStorage.getToken();

    if (!user || !token) {
      // console.log('⚠️ usePermissionsOptimized: Usuário não autenticado, não carregando permissões');
      return;
    }

    // Verificar se há empresa selecionada - se não há empresa, não tentar carregar permissões
    const selectedCompanyId = localStorage.getItem(
      'dream_keys_selected_company_id'
    );
    if (!selectedCompanyId) {
      console.log(
        '⏭️ [usePermissionsOptimized] Nenhuma empresa selecionada, não carregando permissões'
      );
      // Definir permissões vazias para evitar loops
      setUserPermissions({
        permissionNames: [],
        role: roleToString(user.role),
        companyId: '',
      });
      return;
    }

    // Se já houve erro de assinatura, não tentar novamente
    if (hasSubscriptionError.current) {
      console.log(
        '⏭️ [usePermissionsOptimized] Erro de assinatura anterior, não tentando carregar permissões'
      );
      return;
    }

    // Se já foi inicializado para este usuário, não recarregar
    const currentUserId = user.id;
    const lastUserId = localStorage.getItem(
      'dream_keys_last_permissions_user_id'
    );

    if (isInitialized.current && lastUserId === currentUserId) {
      // console.log('✅ usePermissionsOptimized: Já inicializado para este usuário, usando cache');
      return;
    }

    // console.log('🚀 usePermissionsOptimized: Inicializando para usuário:', currentUserId);
    isInitialized.current = true;
    localStorage.setItem('dream_keys_last_permissions_user_id', currentUserId);

    // Verificar cache primeiro para evitar flash
    const cached = permissionsCache.getCache();
    if (cached && permissionsCache.isCacheValid()) {
      // console.log('✅ usePermissionsOptimized: Cache válido encontrado na inicialização');
      setUserPermissions({
        permissionNames: cached.permissions,
        role: roleToString(cached.role),
        companyId: cached.companyId,
      });

      // Carregar da API em background se cache está stale (sem bloquear UI)
      // Mas só se não houver erro de assinatura
      if (permissionsCache.isCacheStale() && !hasSubscriptionError.current) {
        // console.log('🔄 usePermissionsOptimized: Cache stale, atualizando em background...');
        setTimeout(() => loadPermissionsFromAPI(), 100);
      }
      return;
    }

    // Se não há cache válido, carregar da API
    // console.log('🔄 usePermissionsOptimized: Cache inválido, carregando da API...');
    loadPermissions();
  }, [loadPermissions, loadPermissionsFromAPI]);

  // Escutar mudanças de usuário/empresa
  useEffect(() => {
    const handleUserChange = () => {
      // console.log('🔄 usePermissionsOptimized: Usuário/empresa mudou, recarregando permissões...');
      // Resetar flag de erro quando usuário muda
      hasSubscriptionError.current = false;
      lastErrorRef.current = null;

      // Verificar se há empresa antes de tentar carregar
      const selectedCompanyId = localStorage.getItem(
        'dream_keys_selected_company_id'
      );
      if (!selectedCompanyId) {
        console.log(
          '⏭️ [usePermissionsOptimized] Nenhuma empresa após mudança de usuário, não carregando permissões'
        );
        setUserPermissions({
          permissionNames: [],
          role: authStorage.getUserData()?.role || '',
          companyId: '',
        });
        return;
      }

      invalidateCache();
      loadPermissions(true);
    };

    const handleCompanyChange = () => {
      // console.log('🔄 usePermissionsOptimized: Empresa mudou, recarregando permissões...');
      // Resetar flag de erro quando empresa muda
      hasSubscriptionError.current = false;
      lastErrorRef.current = null;

      // Verificar se há empresa antes de tentar carregar
      const selectedCompanyId = localStorage.getItem(
        'dream_keys_selected_company_id'
      );
      if (!selectedCompanyId) {
        console.log(
          '⏭️ [usePermissionsOptimized] Nenhuma empresa após mudança, não carregando permissões'
        );
        setUserPermissions({
          permissionNames: [],
          role: authStorage.getUserData()?.role || '',
          companyId: '',
        });
        return;
      }

      invalidateCache();
      loadPermissions(true);
    };

    // Escutar eventos de mudança de permissões
    const handlePermissionsChanged = (event: CustomEvent) => {
      // console.log('🔄 usePermissionsOptimized: Permissões mudaram externamente');
      const { newPermissions } = event.detail;

      const user = authStorage.getUserData();
      const companyId =
        localStorage.getItem('dream_keys_selected_company_id') || '';

      if (user) {
        setUserPermissions({
          permissionNames: newPermissions,
          role: roleToString(user.role),
          companyId,
        });
      }
    };

    // Escutar eventos de invalidação de cache
    const handleCacheInvalidated = () => {
      // console.log('🔄 usePermissionsOptimized: Cache invalidado externamente');
      setUserPermissions(null);
    };

    // Adicionar listeners
    window.addEventListener('user-changed', handleUserChange);
    window.addEventListener('company-changed', handleCompanyChange);
    window.addEventListener(
      PERMISSIONS_EVENTS.CHANGED,
      handlePermissionsChanged as EventListener
    );
    window.addEventListener(
      PERMISSIONS_EVENTS.CACHE_INVALIDATED,
      handleCacheInvalidated
    );

    return () => {
      window.removeEventListener('user-changed', handleUserChange);
      window.removeEventListener('company-changed', handleCompanyChange);
      window.removeEventListener(
        PERMISSIONS_EVENTS.CHANGED,
        handlePermissionsChanged as EventListener
      );
      window.removeEventListener(
        PERMISSIONS_EVENTS.CACHE_INVALIDATED,
        handleCacheInvalidated
      );
    };
  }, [loadPermissions, invalidateCache]);

  // Integração com WebSocket para notificações em tempo real
  const handlePermissionsChangedFromSocket = useCallback(() => {
    // console.log('🔔 usePermissionsOptimized: Notificação WebSocket de mudança de permissões recebida');
    // Resetar flag de erro quando receber notificação
    hasSubscriptionError.current = false;
    lastErrorRef.current = null;
    // Invalidar cache e recarregar permissões
    invalidateCache();
    loadPermissions(true);
  }, [invalidateCache, loadPermissions]);

  const handleRoleChangedFromSocket = useCallback(() => {
    // console.log('🔔 usePermissionsOptimized: Notificação WebSocket de mudança de role recebida');
    // Resetar flag de erro quando receber notificação
    hasSubscriptionError.current = false;
    lastErrorRef.current = null;
    // Invalidar cache e recarregar permissões
    invalidateCache();
    loadPermissions(true);
  }, [invalidateCache, loadPermissions]);

  // Conectar ao WebSocket
  usePermissionsSocket(
    token,
    handlePermissionsChangedFromSocket,
    handleRoleChangedFromSocket
  );

  // Refresh automático quando o cache fica stale
  useEffect(() => {
    const checkCacheStatus = () => {
      // Não verificar se já houve erro de assinatura
      if (hasSubscriptionError.current) {
        return;
      }

      if (permissionsCache.isCacheStale()) {
        // console.log('🔄 usePermissionsOptimized: Cache stale detectado, agendando refresh...');
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }

        refreshTimeoutRef.current = setTimeout(() => {
          // Verificar novamente antes de chamar
          if (!hasSubscriptionError.current) {
            loadPermissionsFromAPI();
          }
        }, 5000); // Aguardar 5s para não sobrecarregar
      }
    };

    const interval = setInterval(checkCacheStatus, 60000); // Verificar a cada minuto

    return () => {
      clearInterval(interval);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [loadPermissionsFromAPI]);

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading,
    error,
    refreshPermissions,
    invalidateCache,
    cacheStats: permissionsCache.getCacheStats(),
  };
};
