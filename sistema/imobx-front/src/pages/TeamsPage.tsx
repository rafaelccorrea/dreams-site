import React, { useState, useMemo, useEffect } from 'react';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdFilterList,
  MdCheck,
  MdError,
  MdGroupAdd,
  MdSearch,
  MdClear,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { useTeams } from '../hooks/useTeams';
import { useUsers } from '../hooks/useUsers';
import { NoUsersMessage } from '../components/teams/NoUsersMessage';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { EditTeamModal } from '../components/teams/EditTeamModal';
import { PermissionButton } from '../components/common/PermissionButton';
import { getPermissionDescription } from '../utils/permissionDescriptions';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { FilterDrawer } from '../components/common/FilterDrawer';
import DataScopeFilter from '../components/common/DataScopeFilter';
import { ViewModeToggle } from '../components/common/ViewModeToggle';
import type { ViewMode } from '../types/viewMode';
// import { useTeamsMonitoring } from '../hooks/useRealtimeMonitoring';
import TeamsShimmer from '../components/shimmer/TeamsShimmer';
import {
  TeamsPageContainer,
  TeamsHeader,
  HeaderLeft,
  TeamsTitle,
  TeamsCount,
  TeamsControls,
  SearchContainer,
  SearchInput,
  SearchIcon,
  FilterToggle,
  TeamsGrid,
  TeamsStatsGrid,
  StatCard,
  StatIcon,
  StatContent,
  StatValue,
  StatLabel,
  ModernTeamCard,
  TeamCardGradient,
  TeamCardHeader,
  TeamInfo,
  TeamColor,
  TeamName,
  TeamDescription,
  TeamStats,
  TeamStat,
  TeamProgress,
  ProgressBar,
  ProgressFill,
  ProgressText,
  TeamActions,
  EmptyState,
  EmptyTitle,
  EmptyMessage,
  ErrorContainer,
  ErrorTitle,
  ErrorMessage,
  RetryButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  FormGroup,
  Label,
  Input,
  TextArea,
  ColorPicker,
  ColorOption,
  ModalActions,
  Button,
  UserSelector,
  UserSearchInput,
  SelectedUsers,
  SelectedUser,
  UsersList,
  UserItem,
  UserInfo,
  UserAvatar,
  UserDetails,
  UserName,
  UserRole,
  AddUserButton,
  RemoveUserButton,
  ToastContainer,
  ToastIcon,
  ToastMessage,
  FiltersContainer,
  FilterSection,
  FilterSectionTitle,
  FilterGrid,
  FilterGroup,
  FilterLabel,
  FilterInput,
  FilterSelect,
  FilterSearchContainer,
  FilterSearchIcon,
  FilterSearchInput,
  FilterStats,
  ClearButton,
  ApplyButton,
  UserTeamsLookup,
  UserTeamsLookupRow,
  UserTeamsLookupLabel,
  UserTeamsSelectWrap,
  UserTeamsSearchInput,
  UserTeamsSearchIcon,
  UserTeamsDropdown,
  UserTeamsOption,
  UserTeamsOptionEmpty,
  UserTeamsResult,
  UserTeamsResultList,
  UserTeamsResultItem,
} from '../styles/pages/TeamsPageStyles';

// Importar estilos da visualiza    o em lista
import {
  TeamsListContainer,
  ListHeader,
  TeamRow,
  TeamInfo as ListTeamInfo,
  TeamColorIndicator,
  TeamDetails,
  TeamName as ListTeamName,
  TeamDescription as ListTeamDescription,
  TeamMembers,
  TeamAdmins,
  TeamProjects,
  RowActions,
  ActionButton as ListActionButton,
  MobileHidden,
  TabletHidden,
  MobileOnly,
  MobileTeamDetails,
  MobileDetailRow,
  MobileDetailLabel,
  MobileDetailValue,
} from '../pages/styles/TeamsListView.styles';

const colors = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#EC4899',
  '#6366F1',
  '#14B8A6',
  '#DC2626',
  '#059669',
  '#7C3AED',
  '#0891B2',
];

export const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    teams,
    loading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    refreshTeams,
  } = useTeams();
  const {
    users,
    isLoading: usersLoading,
    error: usersError,
    getUsers,
  } = useUsers();
  const permissionsContext = usePermissionsContextOptional();
  const hasPermission = permissionsContext?.hasPermission || (() => false);
  const permissionsLoading = permissionsContext?.isLoading || false;

  // Carregar usu  rios quando a p  gina for montada
  React.useEffect(() => {
    // console.log('     TeamsPage: Carregando usu  rios...');
    getUsers({ page: 1 })
      .then(() => {
        // console.log('    TeamsPage: Usu  rios carregados com sucesso');
      })
      .catch(error => {
        console.error('    TeamsPage: Erro ao carregar usu  rios:', error);
      });
  }, [getUsers]);

  // Estados removidos - agora usando página dedicada CreateTeamPage

  // Código do modal removido - agora usando página dedicada CreateTeamPage

  // Monitoramento em tempo real temporariamente desabilitado
  // const {
  //   data: monitoringData,
  //   loading: monitoringLoading,
  //   error: monitoringError,
  //   lastUpdate: monitoringLastUpdate,
  //   isConnected: monitoringConnected,
  //   refresh: refreshMonitoring,
  //   toggleMonitoring,
  //   broadcastUpdate,
  // } = useTeamsMonitoring({
  //   onDataUpdate: (data) => {
  //     console.log('Equipes atualizadas em tempo real:', data);
  //     // Aqui voc   pode processar as atualiza    es de equipes
  //   },
  //   onError: (error) => {
  //     console.error('Erro no monitoramento de equipes:', error);
  //   },
  // });

  const [searchTerm, setSearchTerm] = useState('');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [deletingTeam, setDeletingTeam] = useState<any>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [filters, setFilters] = useState<{
    teamName: string;
    memberName: string;
    tag: string;
    status?: string;
    color: string;
    dateRange?: string;
    search: string;
    onlyMyData: boolean;
  }>({
    teamName: '',
    memberName: '',
    tag: '',
    status: '',
    color: '',
    dateRange: '',
    search: '',
    onlyMyData: false,
  });
  // Filtros locais para o drawer
  const [localFilters, setLocalFilters] = useState({
    teamName: '',
    memberName: '',
    tag: '',
    status: undefined as string | undefined,
    color: '',
    dateRange: undefined as string | undefined,
    search: '',
    onlyMyData: false,
  });

  // Inicializar filtros locais quando o drawer abrir
  useEffect(() => {
    if (showFiltersModal) {
      setLocalFilters({
        teamName: filters.teamName,
        memberName: filters.memberName,
        tag: filters.tag,
        status: filters.status || undefined,
        color: filters.color,
        dateRange: filters.dateRange || undefined,
        search: filters.search,
        onlyMyData: filters.onlyMyData,
      });
    }
  }, [showFiltersModal]);

  // Estado para o modo de visualiza    o
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('teams_view_mode');
    return (saved as ViewMode) || 'list';
  });

  // Ver equipes de um usuário
  const [selectedUserForTeams, setSelectedUserForTeams] = useState<string>('');
  const [userSearchText, setUserSearchText] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = React.useRef<HTMLDivElement>(null);

  // Usuários ordenados por nome (para o select "Ver equipes do usuário")
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) =>
      (a.name || '').localeCompare(b.name || '', 'pt-BR')
    );
  }, [users]);

  // Filtrar usuários por nome/email na busca
  const filteredUsersForSelect = useMemo(() => {
    const term = (userSearchText || '').trim().toLowerCase();
    if (!term) return sortedUsers;
    return sortedUsers.filter(
      u =>
        (u.name || '').toLowerCase().includes(term) ||
        (u.email || '').toLowerCase().includes(term)
    );
  }, [sortedUsers, userSearchText]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };
    if (showUserDropdown) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown]);

  // Fun    o para alterar o modo de visualiza    o
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('teams_view_mode', mode);
  };

  // Fun    o para renderizar uma linha da equipe na visualiza    o em lista
  const renderTeamRow = (team: any) => (
    <TeamRow key={team.id}>
      <ListTeamInfo>
        <TeamColorIndicator $color={team.color} />
        <TeamDetails>
          <ListTeamName>{team.name}</ListTeamName>
          {team.description && (
            <ListTeamDescription>{team.description}</ListTeamDescription>
          )}
        </TeamDetails>
      </ListTeamInfo>

      <TabletHidden>
        <TeamMembers>{team.members?.length || 0}</TeamMembers>
      </TabletHidden>

      <TabletHidden>
        <TeamAdmins>
          {team.members?.filter((m: any) => m.role === 'admin').length || 0}
        </TeamAdmins>
      </TabletHidden>

      <MobileHidden>
        <TeamProjects>{team.members?.length || 0}</TeamProjects>
      </MobileHidden>

      <RowActions>
        <ListActionButton
          $variant='secondary'
          onClick={() => handleEditTeam(team)}
          title='Editar equipe'
        >
          <MdEdit />
        </ListActionButton>
        <ListActionButton
          $variant='danger'
          onClick={() => handleDeleteTeam(team)}
          title='Excluir equipe'
          disabled={isDeleting === team.id}
        >
          {isDeleting === team.id ? (
            <div
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ccc',
                borderTop: '2px solid #ef4444',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
          ) : (
            <MdDelete />
          )}
        </ListActionButton>
      </RowActions>

      {/* Vers  o mobile com mais detalhes */}
      <MobileOnly style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
        <MobileTeamDetails>
          <MobileDetailRow>
            <MobileDetailLabel>Membros:</MobileDetailLabel>
            <MobileDetailValue>{team.members?.length || 0}</MobileDetailValue>
          </MobileDetailRow>
          <MobileDetailRow>
            <MobileDetailLabel>Admins:</MobileDetailLabel>
            <MobileDetailValue>
              {team.members?.filter((m: any) => m.role === 'admin').length || 0}
            </MobileDetailValue>
          </MobileDetailRow>
          <MobileDetailRow>
            <MobileDetailLabel>Projetos:</MobileDetailLabel>
            <MobileDetailValue>{team.members?.length || 0}</MobileDetailValue>
          </MobileDetailRow>
        </MobileTeamDetails>
      </MobileOnly>
    </TeamRow>
  );

  // Verificar se h   filtros ativos
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Filtrar times baseado na busca e filtros
  // Função helper para identificar time pessoal
  const isPersonalTeam = (team: any) => {
    const teamNameLower = (team.name || '').toLowerCase();
    const teamDescriptionLower = (team.description || '').toLowerCase();
    return (
      teamNameLower.includes('pessoal') ||
      teamNameLower.startsWith('pessoal -') ||
      teamDescriptionLower.includes('time pessoal') ||
      teamDescriptionLower.includes('tarefas particulares') ||
      (team.id && team.id.toLowerCase().startsWith('personal'))
    );
  };

  const filteredTeams = useMemo(() => {
    let filtered = teams;

    // Filtro por busca geral
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        team =>
          team.name.toLowerCase().includes(search) ||
          team.description?.toLowerCase().includes(search) ||
          team.members?.some(
            member =>
              member.user?.name?.toLowerCase().includes(search) ||
              member.user?.email?.toLowerCase().includes(search)
          )
      );
    }

    // Filtro por nome da equipe
    if (filters.teamName.trim()) {
      const search = filters.teamName.toLowerCase();
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(search)
      );
    }

    // Filtro por nome do membro
    if (filters.memberName.trim()) {
      const search = filters.memberName.toLowerCase();
      filtered = filtered.filter(team =>
        team.members?.some(
          member =>
            member.user?.name?.toLowerCase().includes(search) ||
            member.user?.email?.toLowerCase().includes(search)
        )
      );
    }

    // Filtro por tag (descri    o)
    if (filters.tag.trim()) {
      const search = filters.tag.toLowerCase();
      filtered = filtered.filter(team =>
        team.description?.toLowerCase().includes(search)
      );
    }

    // Filtro por status
    if (filters.status) {
      filtered = filtered.filter(team => {
        switch (filters.status) {
          case 'active':
            return team.isActive;
          case 'inactive':
            return !team.isActive;
          default:
            return true;
        }
      });
    }

    // Filtro por cor
    if (filters.color) {
      filtered = filtered.filter(team => team.color === filters.color);
    }

    // Filtro por per  odo de cria    o
    if (filters.dateRange) {
      filtered = filtered.filter(team => {
        const teamDate = new Date(team.createdAt);
        const now = new Date();
        const diffTime = now.getTime() - teamDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filters.dateRange) {
          case 'today':
            return diffDays <= 1;
          case 'week':
            return diffDays <= 7;
          case 'month':
            return diffDays <= 30;
          case 'quarter':
            return diffDays <= 90;
          case 'year':
            return diffDays <= 365;
          default:
            return true;
        }
      });
    }

    // Remover time pessoal - não mostrar em nenhuma hipótese
    filtered = filtered.filter(team => !isPersonalTeam(team));

    return filtered;
  }, [teams, searchTerm, filters]);

  // Equipes em que o usuário selecionado faz parte (para o bloco "Ver equipes do usuário")
  const teamsOfSelectedUser = useMemo(() => {
    if (!selectedUserForTeams) return [];
    return teams.filter(team => {
      if (isPersonalTeam(team)) return false;
      const isMember = team.members?.some(
        (m: any) => m.userId === selectedUserForTeams || m.user?.id === selectedUserForTeams
      );
      return isMember;
    });
  }, [teams, selectedUserForTeams]);

  // Função handleCreateTeam removida - agora usando página dedicada CreateTeamPage

  const handleEditTeam = (team: any) => {
    // console.log('       Abrindo modal de edi    o para equipe:', team);
    setEditingTeam(team);
    setShowEditModal(true);
  };

  const handleManageMembers = (team: any) => {
    // console.log('     Gerenciando membros da equipe:', team);
    // Navegar para p  gina de gerenciamento de membros
    navigate(`/teams/${team.id}/members`);
  };

  const handleDeleteTeam = (team: any) => {
    setDeletingTeam(team);
    setShowDeleteModal(true);
  };

  const confirmDeleteTeam = async () => {
    if (!deletingTeam) return;

    setIsDeleting(deletingTeam.id);
    try {
      await deleteTeam(deletingTeam.id);
      setToastMessage('Equipe exclu  da com sucesso!');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      console.error('Erro ao excluir equipe:', error);
      setToastMessage('Erro ao excluir equipe. Tente novamente.');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsDeleting(null);
      setShowDeleteModal(false);
      setDeletingTeam(null);
    }
  };

  const handleSaveEditTeam = async (teamData: any) => {
    if (!editingTeam) return;

    try {
      // console.log('     Chamando API updateTeam...');
      await updateTeam(editingTeam.id, teamData);
      // console.log('    Equipe atualizada com sucesso:', result);
      setToastMessage('Equipe atualizada com sucesso!');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      setShowEditModal(false);
      setEditingTeam(null);
    } catch (error) {
      console.error('    Erro ao atualizar equipe:', error);
      setToastMessage('Erro ao atualizar equipe. Tente novamente.');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    }
  };

  // Usar dados de monitoramento se dispon  veis (temporariamente desabilitado)
  // React.useEffect(() => {
  //   if (monitoringData) {
  //     console.log('Dados de monitoramento de equipes recebidos:', monitoringData);
  //     // Aqui voc   pode atualizar a lista de equipes com dados em tempo real
  //   }
  // }, [monitoringData]);

  // Broadcast de atualiza    es quando equipes s  o modificadas (temporariamente desabilitado)
  // React.useEffect(() => {
  //   if (teams.length > 0) {
  //     broadcastUpdate({
  //       count: teams.length,
  //       lastUpdate: new Date().toISOString()
  //     }, 'update');
  //   }
  // }, [teams, broadcastUpdate]);

  if (loading) {
    return (
      <Layout>
        <TeamsShimmer />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <TeamsPageContainer>
          <ErrorContainer>
            <ErrorTitle>Erro ao carregar equipes</ErrorTitle>
            <ErrorMessage>{error}</ErrorMessage>
            <RetryButton onClick={refreshTeams}>Tentar novamente</RetryButton>
          </ErrorContainer>
        </TeamsPageContainer>
      </Layout>
    );
  }

  // Se est   carregando usu  rios, mostrar shimmer
  if (usersLoading) {
    return (
      <Layout>
        <TeamsShimmer />
      </Layout>
    );
  }

  // Se h   erro ao carregar usu  rios, mostrar erro
  if (usersError) {
    return (
      <Layout>
        <TeamsPageContainer>
          <ErrorContainer>
            <ErrorTitle>Erro ao carregar usu rios</ErrorTitle>
            <ErrorMessage>{usersError}</ErrorMessage>
            <RetryButton onClick={() => window.location.reload()}>
              Tentar novamente
            </RetryButton>
          </ErrorContainer>
        </TeamsPageContainer>
      </Layout>
    );
  }

  // Verificar se o usu  rio tem permiss  o para ver equipes
  const canViewTeams = hasPermission('team:view');

  // Aguardar carregamento das permiss  es antes de verificar
  if (permissionsLoading) {
    return (
      <Layout>
        <TeamsShimmer />
      </Layout>
    );
  }

  // Se o usu  rio n  o tem permiss  o para ver equipes, mostrar mensagem espec  fica
  if (!canViewTeams) {
    return (
      <Layout>
        <TeamsPageContainer>
          <EmptyState>
            <EmptyTitle>Nenhuma equipe encontrada</EmptyTitle>
            <EmptyMessage>
              Voc n o tem permiss o para{' '}
              {getPermissionDescription('team:view').toLowerCase()}. Entre em
              contato com um administrador para solicitar esta permiss o.
            </EmptyMessage>
          </EmptyState>
        </TeamsPageContainer>
      </Layout>
    );
  }

  // Se n  o h   usu  rios cadastrados, mostrar mensagem explicativa
  // S   mostrar a mensagem se n  o estiver carregando, n  o h   erro, e realmente n  o h   usu  rios
  if (users.length === 0 && !usersLoading && !usersError) {
    // console.log('     CONDITION TRIGGERED - users.length:', users.length, 'usersLoading:', usersLoading, 'usersError:', usersError);
    // console.log('     Teams data:', { teamsLength: teams.length, teams: teams });
    // Se h   equipes mas n  o h   usu  rios, isso indica um problema de sincroniza    o
    // Vamos mostrar a interface normal das equipes em vez da mensagem de erro
    if (teams.length > 0) {
      // console.log('Ha equipes mas nao ha usuarios - mostrando interface normal');
      // Continuar para mostrar a interface normal das equipes
    } else {
      return (
        <Layout>
          <TeamsPageContainer>
            <NoUsersMessage
              onCreateUser={() => {
                navigate('/users');
              }}
            />
          </TeamsPageContainer>
        </Layout>
      );
    }
  }

  return (
    <Layout>
      <TeamsPageContainer>
        <TeamsHeader>
          <HeaderLeft>
            <TeamsTitle>Equipes</TeamsTitle>
            <TeamsCount>
              {teams.length} {teams.length === 1 ? 'equipe' : 'equipes'}
            </TeamsCount>
          </HeaderLeft>
          <PermissionButton
            permission='team:create'
            onClick={() => navigate('/teams/create')}
            variant='primary'
            size='medium'
          >
            <MdAdd size={20} />
            Nova Equipe
          </PermissionButton>
        </TeamsHeader>

        <TeamsControls>
          <SearchContainer>
            <SearchIcon size={20} />
            <SearchInput
              type='text'
              placeholder='Buscar equipes...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <ViewModeToggle
            currentMode={viewMode}
            onModeChange={handleViewModeChange}
          />
          <FilterToggle
            $isActive={hasActiveFilters}
            onClick={() => setShowFiltersModal(true)}
          >
            <MdFilterList size={16} />
            Filtros
            {hasActiveFilters && (
              <span
                style={{
                  background: '#EF4444',
                  color: 'white',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  marginLeft: '8px',
                }}
              >
                {Object.values(filters).filter(value => value !== '').length}
              </span>
            )}
          </FilterToggle>
        </TeamsControls>

        {/* Ver equipes de um usuário */}
        <UserTeamsLookup>
          <UserTeamsLookupRow>
            <UserTeamsLookupLabel htmlFor="user-teams-search">
              Ver equipes do usuário:
            </UserTeamsLookupLabel>
            <UserTeamsSelectWrap ref={userDropdownRef}>
              <UserTeamsSearchIcon>
                <MdSearch size={18} />
              </UserTeamsSearchIcon>
              <UserTeamsSearchInput
                id="user-teams-search"
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={
                  showUserDropdown
                    ? userSearchText
                    : selectedUserForTeams
                      ? sortedUsers.find(u => u.id === selectedUserForTeams)?.name ||
                        users.find(u => u.id === selectedUserForTeams)?.name ||
                        ''
                      : ''
                }
                onChange={e => {
                  setUserSearchText(e.target.value);
                  setShowUserDropdown(true);
                  if (!e.target.value) setSelectedUserForTeams('');
                }}
                onFocus={() => setShowUserDropdown(true)}
              />
              {showUserDropdown && (
                <UserTeamsDropdown>
                  {filteredUsersForSelect.length === 0 ? (
                    <UserTeamsOptionEmpty>
                      Nenhum usuário encontrado
                    </UserTeamsOptionEmpty>
                  ) : (
                    filteredUsersForSelect.map(u => (
                      <UserTeamsOption
                        key={u.id}
                        type="button"
                        onClick={() => {
                          setSelectedUserForTeams(u.id);
                          setUserSearchText('');
                          setShowUserDropdown(false);
                        }}
                      >
                        {u.name}
                        {u.email ? ` (${u.email})` : ''}
                      </UserTeamsOption>
                    ))
                  )}
                </UserTeamsDropdown>
              )}
            </UserTeamsSelectWrap>
          </UserTeamsLookupRow>
          {selectedUserForTeams && (
            <UserTeamsResult>
              {teamsOfSelectedUser.length > 0 ? (
                <>
                  <strong>
                    {users.find(u => u.id === selectedUserForTeams)?.name || 'Usuário'} faz parte de:
                  </strong>
                  <UserTeamsResultList>
                    {teamsOfSelectedUser.map(t => (
                      <UserTeamsResultItem key={t.id}>{t.name}</UserTeamsResultItem>
                    ))}
                  </UserTeamsResultList>
                </>
              ) : (
                <strong>
                  {users.find(u => u.id === selectedUserForTeams)?.name || 'Usuário'} não faz parte de nenhuma equipe.
                </strong>
              )}
            </UserTeamsResult>
          )}
        </UserTeamsLookup>

        {/* Estat  sticas Gerais */}
        <TeamsStatsGrid>
          <StatCard>
            <StatIcon> </StatIcon>
            <StatContent>
              <StatValue>{teams.length}</StatValue>
              <StatLabel>Total de Equipes</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon> </StatIcon>
            <StatContent>
              <StatValue>
                {teams.reduce(
                  (sum, team) => sum + (team.members?.length || 0),
                  0
                )}
              </StatValue>
              <StatLabel>Total de Membros</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon> </StatIcon>
            <StatContent>
              <StatValue>
                {teams.reduce(
                  (sum, team) => sum + (team.members?.length || 0),
                  0
                )}
              </StatValue>
              <StatLabel>Projetos Ativos</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon> </StatIcon>
            <StatContent>
              <StatValue>
                {teams.reduce(
                  (sum, team) => sum + (team.members?.length || 0),
                  0
                )}
              </StatValue>
              <StatLabel>Tarefas Totais</StatLabel>
            </StatContent>
          </StatCard>
        </TeamsStatsGrid>

        {filteredTeams.length === 0 ? (
          <EmptyState>
            <EmptyTitle>
              {teams.length === 0
                ? 'Nenhuma equipe encontrada'
                : 'Nenhuma equipe corresponde aos filtros'}
            </EmptyTitle>
            <EmptyMessage>
              {teams.length === 0
                ? 'Nenhuma equipe foi criada ainda.'
                : 'Tente ajustar os filtros ou termo de busca.'}
            </EmptyMessage>
          </EmptyState>
        ) : viewMode === 'list' ? (
          <TeamsListContainer>
            <ListHeader>
              <div>Equipe</div>
              <TabletHidden>Membros</TabletHidden>
              <TabletHidden>Admins</TabletHidden>
              <MobileHidden>Projetos</MobileHidden>
              <div>Ações</div>
            </ListHeader>
            {filteredTeams.map(renderTeamRow)}
          </TeamsListContainer>
        ) : (
          <TeamsGrid>
            {filteredTeams.map(team => (
              <ModernTeamCard key={team.id}>
                <TeamCardGradient color={team.color} />
                <TeamCardHeader>
                  <TeamInfo>
                    <TeamColor color={team.color} />
                    <TeamName>{team.name}</TeamName>
                    {team.description && (
                      <TeamDescription>{team.description}</TeamDescription>
                    )}
                  </TeamInfo>
                  <TeamActions>
                    <PermissionButton
                      permission='team:update'
                      onClick={() => handleEditTeam(team)}
                      variant='secondary'
                      size='small'
                    >
                      <MdEdit size={18} />
                    </PermissionButton>
                    <PermissionButton
                      permission='team:manage_members'
                      onClick={() => handleManageMembers(team)}
                      variant='primary'
                      size='small'
                    >
                      <MdGroupAdd size={18} />
                    </PermissionButton>
                    <PermissionButton
                      permission='team:delete'
                      onClick={() => handleDeleteTeam(team)}
                      variant='danger'
                      size='small'
                      disabled={isDeleting === team.id}
                    >
                      {isDeleting === team.id ? (
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            border: '2px solid #ccc',
                            borderTop: '2px solid #ef4444',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                          }}
                        />
                      ) : (
                        <MdDelete size={18} />
                      )}
                    </PermissionButton>
                  </TeamActions>
                </TeamCardHeader>

                <TeamStats>
                  <TeamStat>
                    <StatIcon> </StatIcon>
                    <StatContent>
                      <StatValue>{team.members?.length || 0}</StatValue>
                      <StatLabel>Membros</StatLabel>
                    </StatContent>
                  </TeamStat>
                  <TeamStat>
                    <StatIcon> </StatIcon>
                    <StatContent>
                      <StatValue>
                        {team.members?.filter(m => m.role === 'admin').length ||
                          0}
                      </StatValue>
                      <StatLabel>Admins</StatLabel>
                    </StatContent>
                  </TeamStat>
                  <TeamStat>
                    <StatIcon> </StatIcon>
                    <StatContent>
                      <StatValue>{team.members?.length || 0}</StatValue>
                      <StatLabel>Projetos</StatLabel>
                    </StatContent>
                  </TeamStat>
                  <TeamStat>
                    <StatIcon> </StatIcon>
                    <StatContent>
                      <StatValue>{team.members?.length || 0}</StatValue>
                      <StatLabel>Tarefas</StatLabel>
                    </StatContent>
                  </TeamStat>
                </TeamStats>

                <TeamProgress>
                  <ProgressBar>
                    <ProgressFill
                      width={`${Math.min((team.members?.length || 0) * 10, 100)}%`}
                      color={team.color}
                    />
                  </ProgressBar>
                  <ProgressText>
                    Atividade: {Math.min((team.members?.length || 0) * 10, 100)}
                    %
                  </ProgressText>
                </TeamProgress>
              </ModernTeamCard>
            ))}
          </TeamsGrid>
        )}

        {/* Modal removido - agora usando página dedicada CreateTeamPage */}
      </TeamsPageContainer>

      {/* Toast de Sucesso */}
      {showSuccessToast && (
        <ToastContainer $type='success'>
          <ToastIcon>
            <MdCheck size={20} />
          </ToastIcon>
          <ToastMessage>{toastMessage}</ToastMessage>
        </ToastContainer>
      )}

      {/* Toast de Erro */}
      {showErrorToast && (
        <ToastContainer $type='error'>
          <ToastIcon>
            <MdError size={20} />
          </ToastIcon>
          <ToastMessage>{toastMessage}</ToastMessage>
        </ToastContainer>
      )}
      {/* Modais */}
      <EditTeamModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTeam(null);
        }}
        onSave={handleSaveEditTeam}
        team={editingTeam}
        isLoading={isCreating}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingTeam(null);
        }}
        onConfirm={confirmDeleteTeam}
        title='Excluir Equipe'
        message={`Tem certeza que deseja excluir a equipe "${deletingTeam?.name}"? Esta a    o n  o pode ser desfeita.`}
        itemName={deletingTeam?.name || ''}
        isLoading={isDeleting === deletingTeam?.id}
      />

      {/* Modal de Filtros */}
      <FilterDrawer
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        title='Filtros de Equipes'
        footer={
          <>
            {Object.values(localFilters).some(
              value => value !== undefined && value !== '' && value !== false
            ) && (
              <ClearButton
                onClick={() => {
                  const cleared = {
                    teamName: '',
                    memberName: '',
                    tag: '',
                    status: undefined,
                    color: '',
                    dateRange: undefined,
                    search: '',
                    onlyMyData: false,
                  };
                  setLocalFilters(cleared);
                  setFilters({
                    teamName: cleared.teamName,
                    memberName: cleared.memberName,
                    tag: cleared.tag,
                    status: cleared.status || '',
                    color: cleared.color,
                    dateRange: cleared.dateRange || '',
                    search: cleared.search,
                    onlyMyData: cleared.onlyMyData,
                  });
                  setShowFiltersModal(false);
                }}
              >
                <MdClear size={16} />
                Limpar Filtros
              </ClearButton>
            )}
            <ApplyButton
              onClick={() => {
                setFilters({
                  teamName: localFilters.teamName,
                  memberName: localFilters.memberName,
                  tag: localFilters.tag,
                  status: localFilters.status || '',
                  color: localFilters.color,
                  dateRange: localFilters.dateRange || '',
                  search: localFilters.search,
                  onlyMyData: localFilters.onlyMyData,
                });
                setShowFiltersModal(false);
              }}
            >
              <MdFilterList size={16} />
              Aplicar Filtros
            </ApplyButton>
          </>
        }
      >
        <FiltersContainer>
          <FilterSection>
            <FilterSectionTitle>
              <MdSearch size={20} />
              Busca por Texto
            </FilterSectionTitle>

            <FilterSearchContainer>
              <FilterSearchIcon>
                <MdSearch size={18} />
              </FilterSearchIcon>
              <FilterSearchInput
                type='text'
                placeholder='Buscar por nome da equipe ou membro...'
                value={localFilters.search || ''}
                onChange={e =>
                  setLocalFilters(prev => ({ ...prev, search: e.target.value }))
                }
              />
            </FilterSearchContainer>
          </FilterSection>

          <FilterSection>
            <FilterSectionTitle>
              <MdGroupAdd size={20} />
              Filtros por Categoria
            </FilterSectionTitle>

            <FilterGrid>
              <FilterGroup>
                <FilterLabel>Nome da Equipe</FilterLabel>
                <FilterInput
                  type='text'
                  placeholder='Nome da equipe...'
                  value={localFilters.teamName || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      teamName: e.target.value,
                    }))
                  }
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Nome do Membro</FilterLabel>
                <FilterInput
                  type='text'
                  placeholder='Nome do membro...'
                  value={localFilters.memberName || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      memberName: e.target.value,
                    }))
                  }
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Tag/Categoria</FilterLabel>
                <FilterInput
                  type='text'
                  placeholder='Tag ou categoria...'
                  value={localFilters.tag || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({ ...prev, tag: e.target.value }))
                  }
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Status</FilterLabel>
                <FilterSelect
                  value={localFilters.status || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      status: e.target.value || undefined,
                    }))
                  }
                >
                  <option value=''>Todos os status</option>
                  <option value='active'>Ativa</option>
                  <option value='inactive'>Inativa</option>
                  <option value='all'>Todas</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Cor da Equipe</FilterLabel>
                <FilterInput
                  type='text'
                  placeholder='Cor (hex)...'
                  value={localFilters.color || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      color: e.target.value,
                    }))
                  }
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Per odo de Cria o</FilterLabel>
                <FilterSelect
                  value={localFilters.dateRange || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      dateRange: e.target.value || undefined,
                    }))
                  }
                >
                  <option value=''>Todos os per odos</option>
                  <option value='today'>Hoje</option>
                  <option value='week'>Esta semana</option>
                  <option value='month'>Este m s</option>
                  <option value='quarter'>Este trimestre</option>
                  <option value='year'>Este ano</option>
                </FilterSelect>
              </FilterGroup>
            </FilterGrid>
          </FilterSection>

          <FilterSection>
            <FilterSectionTitle>Escopo de Dados</FilterSectionTitle>

            <DataScopeFilter
              onlyMyData={localFilters.onlyMyData || false}
              onChange={value =>
                setLocalFilters(prev => ({ ...prev, onlyMyData: value }))
              }
              label='Mostrar apenas minhas equipes'
              description='Quando marcado, mostra apenas equipes que voc   criou, ignorando hierarquia de usu  rios.'
            />
          </FilterSection>

          {Object.values(localFilters).some(
            value => value !== undefined && value !== '' && value !== false
          ) && (
            <FilterStats>
              <span>Filtros ativos aplicados</span>
            </FilterStats>
          )}
        </FiltersContainer>
      </FilterDrawer>
    </Layout>
  );
};

export default TeamsPage;
