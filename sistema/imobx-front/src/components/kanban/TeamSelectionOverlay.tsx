import React, { useState, useEffect } from 'react';
import {
  MdGroup,
  MdAdd,
  MdMoreVert,
  MdEdit,
  MdDelete,
  MdCheck,
  MdClose,
  MdSearch,
  MdPeople,
  MdRefresh,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useTeams } from '../../hooks/useTeams';
import { useAuth } from '../../hooks/useAuth';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { useKanban } from '../../hooks/useKanban';
import KanbanShimmer from '../shimmer/KanbanShimmer';
import { Column } from './Column';
import type { Team } from '../../services/teamApi';
import {
  OverlayContainer,
  BackgroundKanban,
  SelectionCard,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CloseButton,
  TeamsGrid,
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
  CreateTeamButton,
  RequestAccessButton,
} from '../../styles/components/TeamSelectionOverlayStyles';

interface TeamSelectionOverlayProps {
  onTeamSelect: (team: Team | null) => void;
  selectedTeam: Team | null;
  onClose?: () => void;
}

export const TeamSelectionOverlay: React.FC<TeamSelectionOverlayProps> = ({
  onTeamSelect,
  selectedTeam,
  onClose,
}) => {
  const navigate = useNavigate();
  const { teams, loading: teamsLoading } = useTeams();
  const { getCurrentUser } = useAuth();
  const permissionsContext = usePermissionsContextOptional();
  const hasPermission = permissionsContext?.hasPermission || (() => false);
  const permissionsLoading = permissionsContext?.isLoading || false;
  const { hasRoleAccess } = useRoleAccess();
  const [showMenuForTeam, setShowMenuForTeam] = useState<string | null>(null);
  const [backgroundTeam, setBackgroundTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const currentUser = getCurrentUser();
  const canCreateTeams = () =>
    hasPermission('team:create') || hasRoleAccess('admin');
  const canEditTeams = () =>
    hasPermission('team:update') || hasRoleAccess('admin');
  const canDeleteTeams = () =>
    hasPermission('team:delete') || hasRoleAccess('admin');

  // Carregar dados da primeira equipe para o fundo
  const {
    board: backgroundBoard,
    loading: backgroundLoading,
    error: backgroundError,
    refresh: refreshBackground,
  } = useKanban(backgroundTeam?.id || '');

  // Definir primeira equipe como fundo quando as equipes carregam
  useEffect(() => {
    if (teams && teams.length > 0 && !backgroundTeam) {
      setBackgroundTeam(teams[0]);
    }
  }, [teams, backgroundTeam]);

  // Auto-selecionar se há apenas uma equipe
  useEffect(() => {
    if (teams && teams.length === 1 && !selectedTeam) {
      onTeamSelect(teams[0]);
    }
  }, [teams, selectedTeam, onTeamSelect]);

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

  const handleRefreshTeams = () => {
    // Recarregar equipes
    window.location.reload();
  };

  const handleRequestAccess = () => {
    // TODO: Implementar página de equipes ou modal de solicitação
  };

  // Função helper para identificar time pessoal
  const isPersonalTeam = (team: Team) => {
    const teamNameLower = team.name.toLowerCase();
    const teamDescriptionLower = (team.description || '').toLowerCase();
    return (
      teamNameLower.includes('pessoal') ||
      teamNameLower.startsWith('pessoal -') ||
      teamDescriptionLower.includes('time pessoal') ||
      teamDescriptionLower.includes('tarefas particulares') ||
      team.id?.toLowerCase().startsWith('personal')
    );
  };

  // Filtrar equipes baseado no termo de busca e remover time pessoal
  const filteredTeams =
    teams?.filter(team => {
      // Filtrar time pessoal - não mostrar em nenhuma hipótese
      if (isPersonalTeam(team)) return false;

      // Filtrar por termo de busca
      return team.name.toLowerCase().includes(searchTerm.toLowerCase());
    }) || [];

  // Contar equipes visíveis (excluindo pessoal)
  const visibleTeamsCount =
    teams?.filter(team => !isPersonalTeam(team)).length || 0;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Se está carregando permissões ou equipes, mostrar shimmer
  if (permissionsLoading || teamsLoading) {
    return <KanbanShimmer columnCount={3} taskCountPerColumn={2} />;
  }

  // Se há apenas uma equipe, não mostrar o overlay
  if (teams && teams.length === 1) {
    return null;
  }

  // Se não há equipes, mostrar estado vazio
  if (!teams || teams.length === 0) {
    return (
      <OverlayContainer>
        <BackgroundKanban>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--color-text-secondary)',
              fontSize: '1.2rem',
            }}
          >
            Nenhuma equipe disponível
          </div>
        </BackgroundKanban>
        <SelectionCard>
          <CardHeader>
            <CardTitle>
              <MdGroup size={24} />
              Selecionar Equipe
            </CardTitle>
            {onClose && (
              <CloseButton onClick={handleClose}>
                <MdClose size={20} />
              </CloseButton>
            )}
          </CardHeader>

          <EmptyState>
            <EmptyMessage>
              Você não tem acesso a nenhuma equipe ainda.
            </EmptyMessage>
            <ActionButtons>
              <CreateTeamButton onClick={handleCreateTeam}>
                <MdAdd size={16} />
                Criar Equipe
              </CreateTeamButton>
              <RequestAccessButton onClick={handleRequestAccess}>
                <MdGroup size={16} />
                Solicitar Acesso
              </RequestAccessButton>
              {!canCreateTeams() && (
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)',
                    fontStyle: 'italic',
                  }}
                >
                  Entre em contato com um administrador para criar uma equipe
                </div>
              )}
            </ActionButtons>
          </EmptyState>
        </SelectionCard>
      </OverlayContainer>
    );
  }

  return (
    <OverlayContainer>
      <BackgroundKanban>
        {backgroundLoading ? (
          <KanbanShimmer columnCount={4} taskCountPerColumn={3} />
        ) : backgroundError ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--color-text-secondary)',
              fontSize: '1rem',
            }}
          >
            Erro ao carregar dados da equipe
          </div>
        ) : backgroundBoard && backgroundBoard.columns.length > 0 ? (
          <div
            style={{
              display: 'flex',
              gap: '24px',
              padding: '24px',
              opacity: 0.3,
              filter: 'blur(2px)',
              pointerEvents: 'none',
            }}
          >
            {backgroundBoard.columns
              .sort((a, b) => a.position - b.position)
              .map(column => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={backgroundBoard.tasks.filter(
                    task => task.columnId === column.id
                  )}
                  scrollMode='expand'
                  onAddTask={() => {}}
                  onEditTask={() => {}}
                  onDeleteTask={() => {}}
                  onTaskClick={() => {}}
                  onEditColumn={() => {}}
                  onDeleteColumn={() => {}}
                  canCreateTasks={false}
                  canEditTasks={false}
                  canDeleteTasks={false}
                  canMoveTasks={false}
                  canEditColumns={false}
                  canDeleteColumns={false}
                  viewSettings={{}}
                  settings={{}}
                />
              ))}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--color-text-secondary)',
              fontSize: '1rem',
            }}
          >
            Quadro vazio
          </div>
        )}
      </BackgroundKanban>

      <SelectionCard>
        <CardHeader>
          <div style={{ flex: 1 }}>
            <CardTitle>
              <MdGroup size={24} />
              Selecionar Equipe
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 'normal',
                  opacity: 0.7,
                  marginLeft: '8px',
                }}
              >
                ({visibleTeamsCount}{' '}
                {visibleTeamsCount === 1 ? 'equipe' : 'equipes'})
              </span>
            </CardTitle>
            {visibleTeamsCount === 0 && (
              <CardSubtitle>
                Nenhuma equipe disponível. Entre em contato com um administrador
                para criar uma equipe ou solicitar acesso.
              </CardSubtitle>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleRefreshTeams}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background =
                  'var(--color-background-secondary)';
                e.currentTarget.style.color = 'var(--color-text)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
              title='Atualizar lista de equipes'
            >
              <MdRefresh size={18} />
            </button>
            {onClose && (
              <CloseButton onClick={handleClose}>
                <MdClose size={20} />
              </CloseButton>
            )}
          </div>
        </CardHeader>

        {/* Campo de Busca */}
        {teams && teams.length > 2 && (
          <div
            style={{
              marginBottom: '20px',
              position: 'relative',
            }}
          >
            <MdSearch
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-secondary)',
                zIndex: 1,
              }}
            />
            <input
              type='text'
              placeholder='Buscar equipe...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '2px solid var(--color-border)',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'var(--color-background-secondary)',
                color: 'var(--color-text)',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--color-primary)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--color-border)';
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                }}
              >
                <MdClose size={16} />
              </button>
            )}
          </div>
        )}

        <TeamsGrid>
          {filteredTeams.map(team => (
            <TeamCard
              key={team.id}
              $isSelected={selectedTeam?.id === team.id}
              onClick={() => handleTeamClick(team)}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flex: 1,
                }}
              >
                <TeamColor color={team.color} />
                <div style={{ flex: 1 }}>
                  <TeamName>{team.name}</TeamName>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      opacity: 0.7,
                      marginTop: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <MdPeople size={12} />
                      {team.memberCount || 0} membros
                    </span>
                  </div>
                </div>
              </div>

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

              {selectedTeam?.id === team.id && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginLeft: '8px',
                  }}
                >
                  <MdCheck size={20} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                    Selecionada
                  </span>
                </div>
              )}
            </TeamCard>
          ))}
        </TeamsGrid>

        {/* Mensagem quando não há resultados na busca */}
        {searchTerm && filteredTeams.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'var(--color-text-secondary)',
            }}
          >
            <MdSearch
              size={48}
              style={{ opacity: 0.3, marginBottom: '16px' }}
            />
            <div style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
              Nenhuma equipe encontrada
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              Tente um termo de busca diferente
            </div>
            <button
              onClick={() => setSearchTerm('')}
              style={{
                marginTop: '16px',
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Limpar busca
            </button>
          </div>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <CreateTeamButton onClick={handleCreateTeam}>
            <MdAdd size={16} />
            Nova Equipe
          </CreateTeamButton>
          {!canCreateTeams() && (
            <div
              style={{
                marginTop: '8px',
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                fontStyle: 'italic',
              }}
            >
              Entre em contato com um administrador para criar uma equipe
            </div>
          )}
        </div>
      </SelectionCard>
    </OverlayContainer>
  );
};
