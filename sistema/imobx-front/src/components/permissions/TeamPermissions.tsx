import React from 'react';
import styled from 'styled-components';
import {
  MdGroup,
  MdPersonAdd,
  MdEdit,
  MdDelete,
  MdSettings,
  MdVisibility,
} from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import { useTeamPermissions } from '../../hooks/useTeamPermissions';

interface TeamPermissionsProps {
  teamId?: string;
  canManageTeams?: boolean;
  canCreateTeams?: boolean;
}

const PermissionsContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

const PermissionsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const PermissionsTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const PermissionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const PermissionItem = styled.div<{ $hasPermission: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props =>
    props.$hasPermission
      ? props.theme.colors.success + '20'
      : props.theme.colors.backgroundSecondary};
  border: 1px solid
    ${props =>
      props.$hasPermission
        ? props.theme.colors.success
        : props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.875rem;
  color: ${props =>
    props.$hasPermission
      ? props.theme.colors.success
      : props.theme.colors.textSecondary};
`;

const PermissionIcon = styled.div<{ $hasPermission: boolean }>`
  color: ${props =>
    props.$hasPermission
      ? props.theme.colors.success
      : props.theme.colors.textLight};
  display: flex;
  align-items: center;
`;

const PermissionText = styled.span`
  font-weight: 500;
`;

const RoleBadge = styled.span<{ role: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.role) {
      case 'master':
        return '#8B5CF6';
      case 'admin':
        return '#3B82F6';
      case 'user':
        return '#10B981';
      default:
        return props.theme.colors.textSecondary;
    }
  }}20;
  color: ${props => {
    switch (props.role) {
      case 'master':
        return '#8B5CF6';
      case 'admin':
        return '#3B82F6';
      case 'user':
        return '#10B981';
      default:
        return props.theme.colors.textSecondary;
    }
  }};
`;

const TeamPermissions: React.FC<TeamPermissionsProps> = ({
  teamId,
  canManageTeams,
  canCreateTeams,
}) => {
  const { getCurrentUser } = useAuth();
  const teamPermissions = useTeamPermissions(teamId);
  const user = getCurrentUser();

  const getRoleDisplayName = (role: string) => {
    const names: Record<string, string> = {
      master: 'Master',
      admin: 'Admin',
      user: 'Usuário',
    };
    return names[role] || role;
  };

  const permissions = [
    {
      name: 'Visualizar Times',
      icon: <MdVisibility size={16} />,
      hasPermission: teamPermissions.canViewTeams,
      description: 'Visualizar lista de times',
    },
    {
      name: 'Criar Times',
      icon: <MdGroup size={16} />,
      hasPermission: teamPermissions.canCreateTeams,
      description: 'Criar novos times',
    },
    {
      name: 'Editar Times',
      icon: <MdEdit size={16} />,
      hasPermission: teamPermissions.canEditTeams,
      description: 'Editar informações dos times',
    },
    {
      name: 'Excluir Times',
      icon: <MdDelete size={16} />,
      hasPermission: teamPermissions.canDeleteTeams,
      description: 'Excluir times',
    },
    {
      name: 'Adicionar Membros',
      icon: <MdPersonAdd size={16} />,
      hasPermission: teamPermissions.canAddMembers,
      description: 'Adicionar membros aos times',
    },
    {
      name: 'Gerenciar Kanban',
      icon: <MdSettings size={16} />,
      hasPermission: teamPermissions.canManageKanban,
      description: 'Gerenciar quadros Kanban dos times',
    },
  ];

  return (
    <PermissionsContainer>
      <PermissionsHeader>
        <MdSettings size={18} />
        <PermissionsTitle>Permissões de Times</PermissionsTitle>
        {user && (
          <RoleBadge role={user.role}>
            {getRoleDisplayName(user.role)}
          </RoleBadge>
        )}
      </PermissionsHeader>

      <PermissionsGrid>
        {permissions.map((permission, index) => (
          <PermissionItem key={index} $hasPermission={permission.hasPermission}>
            <PermissionIcon $hasPermission={permission.hasPermission}>
              {permission.icon}
            </PermissionIcon>
            <PermissionText>{permission.name}</PermissionText>
          </PermissionItem>
        ))}
      </PermissionsGrid>
    </PermissionsContainer>
  );
};

export default TeamPermissions;
