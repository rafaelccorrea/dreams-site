import React from 'react';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { useAuth } from '../hooks/useAuth';

interface PermissionRouteProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallbackPath?: string;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
}) => {
  const permissionsContext = usePermissionsContextOptional();
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const userRole = currentUser?.role?.toLowerCase();
  const hasRoleBypass = userRole
    ? ['master', 'admin', 'manager'].includes(userRole)
    : false;

  // Se o contexto não está disponível, aguardar (não renderizar nada ainda)
  if (!permissionsContext) {
    if (import.meta.env.DEV) {
      // console.log('⏳ PermissionRoute: Contexto não disponível, aguardando...');
    }
    return null;
  }

  const hasPermission = permissionsContext.hasPermission;
  const hasAnyPermission = permissionsContext.hasAnyPermission;
  const hasAllPermissions = permissionsContext.hasAllPermissions;

  let hasAccess = false;

  // Check single permission
  if (permission) {
    hasAccess = hasPermission(permission);
    if (import.meta.env.DEV) {
      // console.log(`🔍 Checking permission "${permission}":`, hasAccess);
    }
  }
  // Check multiple permissions
  else if (permissions.length > 0) {
    if (requireAll) {
      hasAccess = hasAllPermissions(permissions);
    } else {
      hasAccess = hasAnyPermission(permissions);
    }
    if (import.meta.env.DEV) {
      // console.log(`🔍 Checking permissions [${permissions.join(', ')}]:`, hasAccess);
    }
  }
  // No permissions specified, allow access
  else {
    hasAccess = true;
  }

  if (!hasAccess && hasRoleBypass) {
    hasAccess = true;
  }

  // Se não tem acesso, não renderizar nada (elemento simplesmente não aparece)
  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
};
