import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { usePermissions } from './usePermissions';

export interface KanbanPermissions {
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canViewHistory: boolean;
  canManageValidationsActions: boolean;
  canViewAnalytics: boolean;
  canManageUsers: boolean;
  canCreateProject: boolean;
}

/**
 * Hook com permissões do Kanban para controlar visualização, criação, edição e exclusão.
 * Super admin (kanban:manage_users) pode gerir permissões dos demais usuários no Kanban.
 */
function roleToString(r: unknown): string {
  if (r == null) return '';
  if (typeof r === 'string') return r;
  if (typeof r === 'number' || typeof r === 'boolean') return String(r);
  return '';
}

export const useKanbanPermissions = (): KanbanPermissions => {
  const { getCurrentUser } = useAuth();
  const { hasPermission } = usePermissions();
  const user = getCurrentUser();

  return useMemo(() => {
    if (!user) {
      return {
        canView: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        canViewHistory: false,
        canManageValidationsActions: false,
        canViewAnalytics: false,
        canManageUsers: false,
        canCreateProject: false,
      };
    }

    const role = roleToString(user && typeof user === 'object' && 'role' in user ? (user as { role?: unknown }).role : '');
    if (role === 'master') {
      return {
        canView: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true,
        canViewHistory: true,
        canManageValidationsActions: true,
        canViewAnalytics: true,
        canManageUsers: true,
        canCreateProject: true,
      };
    }

    return {
      canView: hasPermission('kanban:view'),
      canCreate: hasPermission('kanban:create'),
      canUpdate: hasPermission('kanban:update'),
      canDelete: hasPermission('kanban:delete'),
      canViewHistory: hasPermission('kanban:view_history'),
      canManageValidationsActions: hasPermission(
        'kanban:manage_validations_actions'
      ),
      canViewAnalytics: hasPermission('kanban:view_analytics'),
      canManageUsers: hasPermission('kanban:manage_users'),
      canCreateProject: hasPermission('kanban:project:create'),
    };
  }, [user, hasPermission]);
};
