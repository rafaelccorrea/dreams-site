import React, { useState } from 'react';
import {
  MdAdd,
  MdGroup,
  MdMoreVert,
  MdEdit,
  MdDelete,
  MdCheck,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useTeams } from '../../hooks/useTeams';
import { useAuth } from '../../hooks/useAuth';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import type { Team } from '../../services/teamApi';
import {
  TeamSelectorContainer,
  TeamSelectorHeader,
  TeamSelectorTitle,
  TeamSelectorActions,
  CreateTeamButton,
  RequestAccessButton,
  TeamsList,
  TeamCard,
  TeamColor,
  TeamName,
  TeamMenu,
  MenuButton,
  MenuDropdown,
  MenuItem,
  EmptyState,
  EmptyMessage,
  ActionButtons,
} from '../../styles/components/TeamSelectorStyles';

interface TeamSelectorProps {
  onTeamSelect: (team: Team | null) => void;
  selectedTeam: Team | null;
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({
  onTeamSelect,
  selectedTeam,
}) => {
  const navigate = useNavigate();
  const { teams, loading } = useTeams();
  const { getCurrentUser } = useAuth();
  const permissionsContext = usePermissionsContextOptional();
  const hasPermission = permissionsContext?.hasPermission || (() => false);
  const { hasRoleAccess } = useRoleAccess();
  const [showMenuForTeam, setShowMenuForTeam] = useState<string | null>(null);

  const currentUser = getCurrentUser();
  const canCreateTeams = () =>
    hasPermission('team:create') || hasRoleAccess('admin');
  const canEditTeams = () =>
    hasPermission('team:update') || hasRoleAccess('admin');
  const canDeleteTeams = () =>
    hasPermission('team:delete') || hasRoleAccess('admin');

  const handleTeamClick = (team: Team) => {
    onTeamSelect(team);
    setShowMenuForTeam(null);
  };

  const handleEditTeam = (team: Team) => {
    // TODO: Implementar modal de edição de equipe
    setShowMenuForTeam(null);
  };

  const handleDeleteTeam = (team: Team) => {
    // TODO: Implementar confirmação e exclusão de equipe
    setShowMenuForTeam(null);
  };

  const handleCreateTeam = () => {
    navigate('/teams/create');
  };

  const handleRequestAccess = () => {
    // TODO: Implementar página de equipes ou modal de solicitação
  };

  if (loading) {
    return (
      <TeamSelectorContainer>
        <EmptyState>
          <EmptyMessage>Carregando equipes...</EmptyMessage>
        </EmptyState>
      </TeamSelectorContainer>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <TeamSelectorContainer>
        <TeamSelectorHeader>
          <TeamSelectorTitle>
            <MdGroup size={20} />
            Selecionar Equipe
          </TeamSelectorTitle>
        </TeamSelectorHeader>

        <EmptyState>
          <EmptyMessage>
            Você não tem acesso a nenhuma equipe ainda.
          </EmptyMessage>
          <ActionButtons>
            {canCreateTeams() && (
              <CreateTeamButton onClick={handleCreateTeam}>
                <MdAdd size={16} />
                Criar Equipe
              </CreateTeamButton>
            )}
            <RequestAccessButton onClick={handleRequestAccess}>
              <MdGroup size={16} />
              Solicitar Acesso
            </RequestAccessButton>
          </ActionButtons>
        </EmptyState>
      </TeamSelectorContainer>
    );
  }

  return (
    <TeamSelectorContainer>
      <TeamSelectorHeader>
        <TeamSelectorTitle>
          <MdGroup size={20} />
          Selecionar Equipe
        </TeamSelectorTitle>
        <TeamSelectorActions>
          {canCreateTeams() && (
            <CreateTeamButton onClick={handleCreateTeam}>
              <MdAdd size={16} />
              Nova Equipe
            </CreateTeamButton>
          )}
        </TeamSelectorActions>
      </TeamSelectorHeader>

      <TeamsList>
        {teams
          .filter(team => {
            // Filtrar time pessoal - não mostrar em nenhuma hipótese
            const teamNameLower = team.name.toLowerCase();
            const teamDescriptionLower = (team.description || '').toLowerCase();
            const isPersonal =
              teamNameLower.includes('pessoal') ||
              teamNameLower.startsWith('pessoal -') ||
              teamDescriptionLower.includes('time pessoal') ||
              teamDescriptionLower.includes('tarefas particulares') ||
              team.id?.toLowerCase().startsWith('personal');
            return !isPersonal;
          })
          .map(team => (
            <TeamCard
              key={team.id}
              $isSelected={selectedTeam?.id === team.id}
              onClick={() => handleTeamClick(team)}
            >
              <TeamColor color={team.color} />
              <TeamName>{team.name}</TeamName>

              {(canEditTeams() || canDeleteTeams()) && (
                <TeamMenu>
                  <MenuButton
                    onClick={e => {
                      e.stopPropagation();
                      setShowMenuForTeam(
                        showMenuForTeam === team.id ? null : team.id
                      );
                    }}
                  >
                    <MdMoreVert size={16} />
                  </MenuButton>
                  <MenuDropdown $isOpen={showMenuForTeam === team.id}>
                    {canEditTeams() && (
                      <MenuItem onClick={() => handleEditTeam(team)}>
                        <MdEdit size={16} />
                        Editar
                      </MenuItem>
                    )}
                    {canDeleteTeams() && (
                      <MenuItem onClick={() => handleDeleteTeam(team)}>
                        <MdDelete size={16} />
                        Excluir
                      </MenuItem>
                    )}
                  </MenuDropdown>
                </TeamMenu>
              )}

              {selectedTeam?.id === team.id && <MdCheck size={16} />}
            </TeamCard>
          ))}
      </TeamsList>
    </TeamSelectorContainer>
  );
};
