import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useModules } from '../hooks/useModules';
import { MODULE_LABELS } from '../services/modulesService';
import { useCompany } from '../hooks/useCompany';
import { useAuth } from '../hooks/useAuth';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { moduleMapping, isModuleAvailable } from '../utils/moduleMapping';

interface ModuleRouteProps {
  children: React.ReactNode;
  /** Módulo obrigatório (usado quando apenas um é necessário) */
  requiredModule?: string;
  /** Módulos alternativos: acesso liberado se a empresa tiver QUALQUER um deles */
  requiredModules?: string[];
  redirectTo?: string;
  showToast?: boolean;
}

/**
 * Componente para proteger rotas baseado em módulos disponíveis
 *
 * @example
 * ```tsx
 * <Route
 *   path="/rentals"
 *   element={
 *     <ModuleRoute requiredModule="rental_management">
 *       <RentalsPage />
 *     </ModuleRoute>
 *   }
 * />
 * ```
 */
export function ModuleRoute({
  children,
  requiredModule: requiredModuleProp,
  requiredModules: requiredModulesProp,
  redirectTo = '/dashboard',
  showToast = true,
}: ModuleRouteProps): JSX.Element | null {
  const { hasModule, loading } = useModules();
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const { getCurrentUser } = useAuth();
  const permissionsContext = usePermissionsContextOptional();
  const currentUser = getCurrentUser();

  const requiredModule =
    requiredModuleProp ?? (requiredModulesProp && requiredModulesProp[0]);
  const requiredModules =
    requiredModulesProp ?? (requiredModule ? [requiredModule] : []);

  const isFullAccessUser = useMemo(() => {
    if (!currentUser?.role) return false;
    const role = currentUser.role.toLowerCase();
    return ['master', 'admin', 'manager'].includes(role);
  }, [currentUser]);

  const permissionNames =
    permissionsContext?.userPermissions?.permissionNames ?? [];
  const permissionsLoading = permissionsContext?.isLoading ?? false;

  const moduleInfo = requiredModule
    ? (moduleMapping[requiredModule] ?? null)
    : null;

  const hasPermissionForModule = useMemo(() => {
    if (!moduleInfo) {
      return true;
    }
    if (permissionsLoading) {
      return true;
    }
    if (permissionNames.length === 0) {
      return false;
    }
    return moduleInfo.requiredPermissions.some(permission =>
      permissionNames.includes(permission)
    );
  }, [moduleInfo, permissionsLoading, permissionNames]);

  const moduleAvailable = useMemo(() => {
    const companyModules = selectedCompany?.availableModules || [];

    if (loading || permissionsLoading) {
      return true;
    }

    if (companyModules.length === 0) {
      return true;
    }

    const modulesToCheck =
      requiredModules.length > 0
        ? requiredModules
        : requiredModule
          ? [requiredModule]
          : [];

    for (const mod of modulesToCheck) {
      if (import.meta.env.DEV && mod === 'match_system') {
        console.log('🔍 ModuleRoute - Verificando match_system:', {
          mod,
          companyModules,
          isModuleAvailableResult: isModuleAvailable(mod, companyModules),
          hasModuleResult: hasModule(mod),
        });
      }
      if (isModuleAvailable(mod, companyModules)) return true;
      if (hasModule(mod)) return true;
    }

    if (hasPermissionForModule) {
      return true;
    }

    return isFullAccessUser;
  }, [
    hasModule,
    requiredModule,
    requiredModules,
    selectedCompany,
    isFullAccessUser,
    loading,
    permissionsLoading,
    hasPermissionForModule,
  ]);

  useEffect(() => {
    if (!selectedCompany) return;
    if (loading) return;
    if (permissionsLoading) return;
    if (moduleAvailable) return;

    if (showToast) {
      const label = requiredModule
        ? MODULE_LABELS[requiredModule] || requiredModule
        : 'Integrações';
      toast.error(`Seu plano não inclui acesso ao módulo: ${label}`, {
        autoClose: 5000,
        position: 'top-center',
      });
    }

    navigate(redirectTo, { replace: true });
  }, [
    loading,
    permissionsLoading,
    moduleAvailable,
    requiredModule,
    requiredModules,
    navigate,
    redirectTo,
    showToast,
    selectedCompany,
  ]);

  if (loading || permissionsLoading || !selectedCompany) {
    return null;
  }

  if (!moduleAvailable) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Componente para mostrar conteúdo apenas se o módulo estiver disponível
 *
 * @example
 * ```tsx
 * <ModuleGuard module="rental_management">
 *   <RentalButton />
 * </ModuleGuard>
 * ```
 */
export function ModuleGuard({
  children,
  module,
  fallback = null,
}: {
  children: React.ReactNode;
  module: string;
  fallback?: React.ReactNode;
}): JSX.Element | null {
  const { hasModule, loading } = useModules();
  const { selectedCompany } = useCompany();
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();

  const isFullAccessUser = useMemo(() => {
    if (!currentUser?.role) return false;
    const role = currentUser.role.toLowerCase();
    return ['master', 'admin', 'manager'].includes(role);
  }, [currentUser]);

  const moduleAvailable = useMemo(() => {
    const companyModules = selectedCompany?.availableModules || [];

    // Usar isModuleAvailable que tem suporte completo a aliases
    if (isModuleAvailable(module, companyModules)) {
      return true;
    }

    // Verificar também via hasModule do contexto
    if (hasModule(module)) {
      return true;
    }

    return isFullAccessUser;
  }, [hasModule, module, selectedCompany, isFullAccessUser]);

  if (loading || !selectedCompany) {
    return null;
  }

  if (!moduleAvailable) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Badge para indicar que um módulo requer upgrade
 */
export function UpgradeBadge({
  moduleName,
}: {
  moduleName: string;
}): JSX.Element {
  const navigate = useNavigate();
  const moduleLabel = MODULE_LABELS[moduleName] || moduleName;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--color-background-secondary)',
        borderRadius: '12px',
        border: '2px dashed var(--color-border)',
        textAlign: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          fontSize: '48px',
          opacity: 0.5,
        }}
      >
        🔒
      </div>

      <div>
        <h3
          style={{
            margin: '0 0 8px 0',
            color: 'var(--color-text)',
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          Módulo não disponível
        </h3>
        <p
          style={{
            margin: 0,
            color: 'var(--color-text-secondary)',
            fontSize: '14px',
          }}
        >
          O módulo <strong>{moduleLabel}</strong> não está incluído no seu plano
          atual.
        </p>
      </div>

      <button
        onClick={() => navigate('/subscription')}
        style={{
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--color-primary-dark)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--color-primary)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        Ver Planos e Fazer Upgrade
      </button>
    </div>
  );
}
