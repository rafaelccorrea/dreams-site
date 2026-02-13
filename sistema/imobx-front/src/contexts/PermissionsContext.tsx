import React, { createContext, useContext, type ReactNode } from 'react';
import { usePermissionsOptimized } from '../hooks/usePermissionsOptimized';
import { usePermissionsInvalidation } from '../hooks/usePermissionsInvalidation';
import { useAuth } from '../hooks/useAuth';

interface PermissionsContextType {
  userPermissions: {
    permissionNames: string[];
    role: string;
    companyId: string;
  } | null;
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

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

interface PermissionsProviderProps {
  children: ReactNode;
}

function roleToStr(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'object' && v !== null && 'name' in v) {
    const name = (v as { name?: unknown }).name;
    if (typeof name === 'string') return name;
    if (name == null) return '';
    if (typeof name === 'number' || typeof name === 'boolean') return String(name);
    return '';
  }
  return '';
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({
  children,
}) => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser?.() ?? null;

  const permissionsHook = usePermissionsOptimized();

  usePermissionsInvalidation({
    invalidateOnAuthChange: true,
    invalidateOnCompanyChange: true,
    invalidateOnRoleChange: true,
    invalidateOnPermissionsUpdate: true,
  });

  const defaultProviderValue = React.useMemo(
    () => ({
      userPermissions: null,
      hasPermission: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
      isLoading: false,
      error: null,
      refreshPermissions: async () => {},
      invalidateCache: () => {},
      cacheStats: {
        exists: false,
        isValid: false,
        isStale: false,
      },
    }),
    []
  );

  const providerValue = React.useMemo(() => {
    if (!user) return defaultProviderValue;
    const h = permissionsHook;
    return {
      ...h,
      userPermissions: h.userPermissions
        ? {
            permissionNames: Array.isArray(h.userPermissions.permissionNames)
              ? h.userPermissions.permissionNames.filter((p): p is string => typeof p === 'string')
              : [],
            role: roleToStr(h.userPermissions.role),
            companyId: typeof h.userPermissions.companyId === 'string' ? h.userPermissions.companyId : '',
          }
        : null,
      error: h.error != null ? String(h.error) : null,
      cacheStats: {
        exists: Boolean(h.cacheStats?.exists),
        isValid: Boolean(h.cacheStats?.isValid),
        isStale: Boolean(h.cacheStats?.isStale),
        age: typeof h.cacheStats?.age === 'number' ? h.cacheStats.age : undefined,
        permissionsCount: typeof h.cacheStats?.permissionsCount === 'number' ? h.cacheStats.permissionsCount : undefined,
        role: roleToStr(h.cacheStats?.role),
      },
    };
  }, [user, permissionsHook]);

  return (
    <PermissionsContext.Provider value={providerValue}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissionsContext = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    // Em vez de lançar erro, retornar um contexto padrão
    console.warn(
      'usePermissionsContext: Contexto não disponível, retornando valores padrão'
    );
    return {
      userPermissions: null,
      hasPermission: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
      isLoading: false,
      error: null,
      refreshPermissions: async () => {},
      invalidateCache: () => {},
      cacheStats: {
        exists: false,
        isValid: false,
        isStale: false,
      },
    };
  }
  return context;
};

/**
 * Hook opcional que retorna o contexto de permissões ou null se não estiver disponível
 * Útil para componentes que podem ser renderizados fora do PermissionsProvider
 */
export const usePermissionsContextOptional =
  (): PermissionsContextType | null => {
    const context = useContext(PermissionsContext);
    return context || null;
  };
