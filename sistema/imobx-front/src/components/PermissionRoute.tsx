import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { useAuth } from '../hooks/useAuth';

interface PermissionRouteProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallbackPath?: string;
  noRoleBypass?: boolean;
}

function safeString(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

class PermissionRouteErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackPath?: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(): void {
    this.setState({ hasError: true });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      const path = this.props.fallbackPath;
      if (path && typeof path === 'string') {
        return <Navigate to={path} replace />;
      }
      return null;
    }
    return this.props.children;
  }
}

function PermissionRouteInner(props: PermissionRouteProps): React.ReactNode {
  const {
    children,
    permission,
    permissions = [],
    requireAll = false,
    fallbackPath,
    noRoleBypass = false,
  } = props;

  const permissionsContext = usePermissionsContextOptional();
  const auth = useAuth();
  const getCurrentUser = auth?.getCurrentUser;
  const currentUser =
    typeof getCurrentUser === 'function' ? getCurrentUser() : null;

  const userRole = safeString(
    currentUser && typeof currentUser === 'object' && 'role' in currentUser
      ? (currentUser as { role?: unknown }).role
      : ''
  ).toLowerCase();
  const hasRoleBypass = userRole
    ? ['master', 'admin', 'manager'].includes(userRole)
    : false;

  const permissionStr = safeString(permission);
  const permissionsList = Array.isArray(permissions)
    ? permissions.map(p => safeString(p)).filter(Boolean)
    : [];

  let hasAccess = false;
  if (permissionsContext === undefined || permissionsContext === null) {
    if (fallbackPath) return <Navigate to={fallbackPath} replace />;
    return null;
  }

  try {
    const hasPermission = permissionsContext.hasPermission;
    const hasAnyPermission = permissionsContext.hasAnyPermission;
    const hasAllPermissions = permissionsContext.hasAllPermissions;

    if (permissionStr) {
      hasAccess =
        typeof hasPermission === 'function' && hasPermission(permissionStr);
    } else if (permissionsList.length > 0) {
      if (requireAll) {
        hasAccess =
          typeof hasAllPermissions === 'function' &&
          hasAllPermissions(permissionsList);
      } else {
        hasAccess =
          typeof hasAnyPermission === 'function' &&
          hasAnyPermission(permissionsList);
      }
    } else {
      hasAccess = true;
    }
  } catch {
    hasAccess = false;
  }

  if (!hasAccess && hasRoleBypass && !noRoleBypass) {
    hasAccess = true;
  }

  if (!hasAccess) {
    if (fallbackPath) return <Navigate to={fallbackPath} replace />;
    return null;
  }

  return <>{children}</>;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = (props) => (
  <PermissionRouteErrorBoundary fallbackPath={props.fallbackPath}>
    <PermissionRouteInner {...props} />
  </PermissionRouteErrorBoundary>
);
