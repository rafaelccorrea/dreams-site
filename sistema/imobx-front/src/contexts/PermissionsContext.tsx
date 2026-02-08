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

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({
  children,
}) => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const permissionsHook = usePermissionsOptimized();

  usePermissionsInvalidation({
    invalidateOnAuthChange: true,
    invalidateOnCompanyChange: true,
    invalidateOnRoleChange: true,
    invalidateOnPermissionsUpdate: true,
  });

  // Memoizar o valor padrão para evitar recriações desnecessárias
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

  // Usar o hook diretamente quando há usuário, garantindo que mudanças sejam propagadas
  const providerValue = user ? permissionsHook : defaultProviderValue;

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
