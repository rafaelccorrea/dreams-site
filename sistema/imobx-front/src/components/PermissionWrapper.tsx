import React from 'react';
import { useModuleAccess } from '../hooks/useModuleAccess';

interface PermissionWrapperProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  moduleId?: string;
  fallback?: React.ReactNode;
  hideIfNoPermission?: boolean;
}

/**
 * Componente que controla a renderização de elementos baseado em permissões
 * Pode ocultar completamente ou mostrar um fallback
 */
export const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
  moduleId,
  fallback = null,
  hideIfNoPermission = true,
}) => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isModuleAvailableForCompany,
    isLoading,
  } = useModuleAccess();

  // Aguardar carregamento antes de verificar permissões
  if (isLoading) {
    return null;
  }

  // Verificar se o módulo está disponível (se especificado)
  if (moduleId && !isModuleAvailableForCompany(moduleId)) {
    return hideIfNoPermission ? null : <>{fallback}</>;
  }

  // Verificar permissões
  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    if (requireAll) {
      hasAccess = hasAllPermissions(permissions);
    } else {
      hasAccess = hasAnyPermission(permissions);
    }
  } else {
    // Se não há permissões especificadas, sempre mostrar
    hasAccess = true;
  }

  if (!hasAccess) {
    return hideIfNoPermission ? null : <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionWrapper;
