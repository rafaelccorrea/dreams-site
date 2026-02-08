import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { usePermissions } from './usePermissions';

interface TeamPermissions {
  canViewTeams: boolean;
  canCreateTeams: boolean;
  canEditTeams: boolean;
  canDeleteTeams: boolean;
  canAddMembers: boolean;
  canManageKanban: boolean;
  canViewTeamMembers: boolean;
}

export const useTeamPermissions = (teamId?: string): TeamPermissions => {
  const { getCurrentUser } = useAuth();
  const { hasPermission } = usePermissions();
  const user = getCurrentUser();

  const permissions = useMemo(() => {
    if (!user) {
      return {
        canViewTeams: false,
        canCreateTeams: false,
        canEditTeams: false,
        canDeleteTeams: false,
        canAddMembers: false,
        canManageKanban: false,
        canViewTeamMembers: false,
      };
    }

    // Master tem todas as permissões por padrão
    if (user.role === 'master') {
      return {
        canViewTeams: true,
        canCreateTeams: true,
        canEditTeams: true,
        canDeleteTeams: true,
        canAddMembers: true,
        canManageKanban: true,
        canViewTeamMembers: true,
      };
    }

    // Para outros usuários, verificar permissões específicas
    return {
      canViewTeams: hasPermission('team:view'),
      canCreateTeams: hasPermission('team:create'),
      canEditTeams: hasPermission('team:update'),
      canDeleteTeams: hasPermission('team:delete'),
      canAddMembers: hasPermission('team:manage_members'),
      canManageKanban:
        hasPermission('kanban:create') || hasPermission('kanban:update'),
      canViewTeamMembers: hasPermission('team:view'),
    };
  }, [user, teamId, hasPermission]);

  return permissions;
};
