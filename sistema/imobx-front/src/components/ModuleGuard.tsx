import React, { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCompanyContext } from '../contexts';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { moduleMapping, isModuleAvailable } from '../utils/moduleMapping';
import { useAuth } from '../hooks/useAuth';

interface ModuleGuardProps {
  children: React.ReactNode;
  fallbackRoute?: string;
}

/**
 * Guard que verifica se o usuário tem acesso ao módulo baseado em:
 * 1. Se o módulo está disponível para a empresa
 * 2. Se o usuário tem as permissões necessárias
 */
export const ModuleGuard: React.FC<ModuleGuardProps> = ({
  children,
  fallbackRoute = '/dashboard',
}) => {
  const location = useLocation();
  const { selectedCompany } = useCompanyContext();
  const permissionsContext = usePermissionsContextOptional();
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();

  // Se o contexto não está disponível, permitir acesso temporariamente
  if (!permissionsContext) {
    if (import.meta.env.DEV) {
      // console.log('⏳ ModuleGuard: Contexto não disponível, permitindo acesso temporário...');
    }
    return <>{children}</>;
  }

  // Se não há empresa selecionada, permitir acesso (será tratado pelo CompanyRequiredGuard)
  if (!selectedCompany) {
    return <>{children}</>;
  }

  const normalize = (value: unknown): string | null => {
    if (!value) return null;
    if (typeof value === 'string') return value.toLowerCase();
    if (
      typeof value === 'object' &&
      value !== null &&
      'code' in (value as Record<string, unknown>)
    ) {
      return String((value as Record<string, unknown>).code).toLowerCase();
    }
    return null;
  };

  const moduleInfo = useMemo(
    () =>
      Object.values(moduleMapping).find(
        module => module.route === location.pathname
      ),
    [location.pathname]
  );

  if (!moduleInfo) {
    return <>{children}</>;
  }

  const companyModules = selectedCompany?.availableModules || [];

  if (companyModules.length === 0) {
    return <>{children}</>;
  }

  // Usar isModuleAvailable que tem suporte completo a aliases
  if (isModuleAvailable(moduleInfo.id, companyModules)) {
    return <>{children}</>;
  }

  const userRole = currentUser?.role?.toLowerCase();
  const isFullAccessUser = userRole
    ? ['master', 'admin', 'manager'].includes(userRole)
    : false;

  if (isFullAccessUser) {
    return <>{children}</>;
  }

  console.warn(`🚫 ModuleGuard bloqueou rota ${location.pathname}`, {
    moduleId: moduleInfo.id,
    availableModules: companyModules,
    userRole,
  });

  return <Navigate to={fallbackRoute} replace />;
};

export default ModuleGuard;
