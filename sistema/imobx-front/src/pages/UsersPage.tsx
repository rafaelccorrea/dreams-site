import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { useUsers } from '../hooks/useUsers';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { translateUserRole, getRoleIcon } from '../utils/roleTranslations';
import { OptimizedLoading } from '../components/common/OptimizedLoading';
import { useDebounce } from '../hooks/useDebounce';
import { FilterDrawer } from '../components/common/FilterDrawer';
import DataScopeFilter from '../components/common/DataScopeFilter';
import type { User } from '../services/usersApi';
import { toast } from 'react-toastify';
import { PermissionButton } from '../components/common/PermissionButton';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import {
  MdSearch,
  MdFilterList,
  MdAdd,
  MdEdit,
  MdDelete,
  MdShield,
  MdCheckCircle,
  MdCancel,
  MdClear,
} from 'react-icons/md';
import styled from 'styled-components';
import { ResetTwoFactorModal } from '../components/modals/ResetTwoFactorModal';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  SummaryContainer,
  SummaryCard,
  SummaryIcon,
  SummaryValue,
  SummaryLabel,
  ActionsBar,
  LeftActions,
  RightActions,
  SearchContainer,
  SearchInput,
  SearchIcon,
  FilterToggle,
  CounterBadge,
  UsersCard,
  UsersTable,
  TableHeader,
  TableRow,
  TableCell,
  MobileLabel,
  UserInfo,
  UserAvatar,
  UserDetails,
  UserName,
  UserEmail,
  RoleBadge,
  StatusBadge,
  UserActions,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateAction,
  PaginationWrapper,
  PaginationButton,
} from '../styles/pages/UsersPageStyles';
import { settingsApi } from '../services/settingsApi';

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, isLoading, error, deleteUser, getUsers } = useUsers();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filters, setFilters] = useState<{
    search: string;
    role?: string;
    active?: boolean;
    hasAvatar?: boolean;
    dateRange?: string;
    onlyMyData: boolean;
  }>({
    search: '',
    role: undefined,
    active: undefined,
    hasAvatar: undefined,
    dateRange: undefined,
    onlyMyData: false,
  });
  // Filtros locais para o drawer
  const [localFilters, setLocalFilters] = useState({
    search: '',
    role: undefined as string | undefined,
    active: undefined as boolean | undefined,
    hasAvatar: undefined as boolean | undefined,
    dateRange: undefined as string | undefined,
    onlyMyData: false,
  });

  // Inicializar filtros locais quando o drawer abrir
  useEffect(() => {
    if (showFiltersModal) {
      setLocalFilters({
        search: filters.search,
        role: filters.role,
        active: filters.active,
        hasAvatar: filters.hasAvatar,
        dateRange: filters.dateRange,
        onlyMyData: filters.onlyMyData,
      });
    }
  }, [showFiltersModal]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);
  const [resetModalUser, setResetModalUser] = useState<User | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Aplicar debounce na busca (500ms, mínimo 3 caracteres)
  const debouncedSearchTerm = useDebounce(searchTerm, 500, 3);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleCreateUser = () => {
    navigate('/users/create');
  };

  const handleEditUser = (user: User) => {
    navigate(`/users/${user.id}/edit`);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      toast.success('Usuário excluído com sucesso!');
      setDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir usuário');
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter(user => {
    // Só aplica filtro de busca se tiver 3+ caracteres ou estiver vazio
    if (debouncedSearchTerm.length > 0 && debouncedSearchTerm.length < 3) {
      return true; // Retorna todos os usuários se a busca tem menos de 3 caracteres
    }

    const matchesSearch =
      user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

    return matchesSearch;
  });

  // Calcular estatísticas
  const totalUsers = users.length;
  const adminUsers = users.filter(
    user => user.role === 'admin' || user.role === 'master'
  ).length;
  const regularUsers = users.filter(user => user.role === 'user').length;
  const recentUsers = users.filter(user => {
    if (!user.lastLogin) return false;
    const lastLogin = new Date(user.lastLogin);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastLogin > thirtyDaysAgo;
  }).length;

  // Paginação
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Layout>
        <PageContainer>
          <OptimizedLoading type='card' />
        </PageContainer>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <PageContainer>
          <EmptyState>
            <EmptyStateIcon>⚠️</EmptyStateIcon>
            <EmptyStateTitle>Erro ao carregar usuários</EmptyStateTitle>
            <EmptyStateDescription>
              Ocorreu um erro ao carregar a lista de usuários. Tente novamente.
            </EmptyStateDescription>
            <EmptyStateAction onClick={() => getUsers()}>
              Tentar Novamente
            </EmptyStateAction>
          </EmptyState>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <div>
                <PageTitle>Usuários</PageTitle>
                <PageSubtitle>
                  Gerencie todos os usuários do sistema e suas permissões
                </PageSubtitle>
              </div>
              <PermissionButton
                permission='user:create'
                variant='primary'
                size='medium'
                onClick={handleCreateUser}
              >
                <MdAdd size={20} />
                Novo Usuário
              </PermissionButton>
            </PageTitleContainer>
          </PageHeader>

          {/* Summary Cards */}
          <SummaryContainer>
            <SummaryCard $type='total'>
              <SummaryIcon $type='total'>👥</SummaryIcon>
              <SummaryValue>{totalUsers}</SummaryValue>
              <SummaryLabel>Total de Usuários</SummaryLabel>
            </SummaryCard>

            <SummaryCard $type='active'>
              <SummaryIcon $type='active'>👤</SummaryIcon>
              <SummaryValue>{regularUsers}</SummaryValue>
              <SummaryLabel>Usuários Regulares</SummaryLabel>
            </SummaryCard>

            <SummaryCard $type='inactive'>
              <SummaryIcon $type='inactive'>🕒</SummaryIcon>
              <SummaryValue>{recentUsers}</SummaryValue>
              <SummaryLabel>Usuários Recentes</SummaryLabel>
            </SummaryCard>

            <SummaryCard $type='admin'>
              <SummaryIcon $type='admin'>👑</SummaryIcon>
              <SummaryValue>{adminUsers}</SummaryValue>
              <SummaryLabel>Administradores</SummaryLabel>
            </SummaryCard>
          </SummaryContainer>

          {/* Actions Bar */}
          <ActionsBar>
            <LeftActions>
              <SearchContainer>
                <SearchIcon>
                  <MdSearch size={20} />
                </SearchIcon>
                <SearchInput
                  type='text'
                  placeholder='Buscar usuários...'
                  value={searchTerm}
                  onChange={e => handleSearch(e.target.value)}
                />
              </SearchContainer>
            </LeftActions>

            <RightActions>
              <FilterToggle
                $hasActiveFilters={Object.values(filters).some(
                  value =>
                    value !== undefined && value !== '' && value !== false
                )}
                onClick={() => setShowFiltersModal(true)}
              >
                <MdFilterList size={16} />
                Filtros
                {Object.values(filters).some(
                  value =>
                    value !== undefined && value !== '' && value !== false
                ) && (
                  <CounterBadge>
                    {
                      Object.values(filters).filter(
                        value =>
                          value !== undefined && value !== '' && value !== false
                      ).length
                    }
                  </CounterBadge>
                )}
              </FilterToggle>
            </RightActions>
          </ActionsBar>

          {/* Users Table */}
          <UsersCard>
            {paginatedUsers.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>👥</EmptyStateIcon>
                <EmptyStateTitle>Nenhum usuário encontrado</EmptyStateTitle>
                <EmptyStateDescription>
                  {searchTerm
                    ? 'Não foram encontrados usuários que correspondam à sua busca.'
                    : 'Ainda não há usuários cadastrados no sistema.'}
                </EmptyStateDescription>
                <EmptyStateAction onClick={handleCreateUser}>
                  <MdAdd size={20} />
                  Criar Primeiro Usuário
                </EmptyStateAction>
              </EmptyState>
            ) : (
              <>
                <UsersTable>
                  <TableHeader>
                    <TableCell>Usuário</TableCell>
                    <TableCell $align='center'>Função</TableCell>
                    <TableCell $align='center'>Status</TableCell>
                    <TableCell $align='center' style={{ fontSize: '0.85rem' }}>
                      Visibilidade
                    </TableCell>
                    <TableCell $align='center'>Último Acesso</TableCell>
                    <TableCell $align='center'>Ações</TableCell>
                  </TableHeader>

                  {paginatedUsers.map((user, index) => (
                    <TableRow key={user.id} $isEven={index % 2 === 0}>
                      <TableCell>
                        <UserInfo>
                          <UserAvatar>{getInitials(user.name)}</UserAvatar>
                          <UserDetails>
                            <UserName>{user.name}</UserName>
                            <UserEmail>{user.email}</UserEmail>
                          </UserDetails>
                        </UserInfo>
                      </TableCell>

                      <TableCell $align='center'>
                        <RoleBadge $role={user.role}>
                          {getRoleIcon(user.role)}{' '}
                          {translateUserRole(user.role)}
                        </RoleBadge>
                      </TableCell>

                      <TableCell $align='center'>
                        <StatusBadge
                          $status={user.lastLogin ? 'active' : 'inactive'}
                        >
                          {user.lastLogin ? (
                            <>
                              <MdCheckCircle size={12} /> Ativo
                            </>
                          ) : (
                            <>
                              <MdCancel size={12} /> Nunca acessou
                            </>
                          )}
                        </StatusBadge>
                      </TableCell>

                      <TableCell $align='center'>
                        {user.isAvailableForPublicSite !== undefined ? (
                          <StatusBadge
                            $status={
                              user.isAvailableForPublicSite
                                ? 'active'
                                : 'inactive'
                            }
                            style={{
                              fontSize: '0.7rem',
                              padding: '3px 6px',
                              background: user.isAvailableForPublicSite
                                ? '#10b98120'
                                : '#6b728020',
                              color: user.isAvailableForPublicSite
                                ? '#10b981'
                                : '#6b7280',
                              border: `1px solid ${user.isAvailableForPublicSite ? '#10b981' : '#6b7280'}`,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {user.isAvailableForPublicSite
                              ? '🌐 Público'
                              : '🔒 Privado'}
                          </StatusBadge>
                        ) : (
                          <span
                            style={{
                              color: 'var(--color-text-secondary)',
                              fontSize: '0.75rem',
                            }}
                          >
                            —
                          </span>
                        )}
                      </TableCell>

                      <TableCell $align='center'>
                        <MobileLabel>Último Acesso:</MobileLabel>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString('pt-BR')
                          : 'Nunca'}
                      </TableCell>

                      <TableCell $align='center'>
                        <UserActions>
                          <UserMenu
                            userId={user.id}
                            isOpen={openMenuUserId === user.id}
                            onToggle={() =>
                              setOpenMenuUserId(prev =>
                                prev === user.id ? null : user.id
                              )
                            }
                            onClose={() => setOpenMenuUserId(null)}
                            onEdit={() => {
                              setOpenMenuUserId(null);
                              handleEditUser(user);
                            }}
                            onReset2FA={() => {
                              setOpenMenuUserId(null);
                              setResetModalUser(user);
                            }}
                            onDelete={() => {
                              setOpenMenuUserId(null);
                              handleDeleteUser(user);
                            }}
                          />
                        </UserActions>
                      </TableCell>
                    </TableRow>
                  ))}
                </UsersTable>

                {/* Pagination */}
                {totalPages > 1 && (
                  <PaginationWrapper>
                    <PaginationButton
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </PaginationButton>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      page => (
                        <PaginationButton
                          key={page}
                          $active={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationButton>
                      )
                    )}

                    <PaginationButton
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </PaginationButton>
                  </PaginationWrapper>
                )}
              </>
            )}
          </UsersCard>
        </PageContent>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={confirmDeleteUser}
          title='Excluir Usuário'
          itemName={selectedUser?.name || ''}
          message={`Tem certeza que deseja excluir o usuário "${selectedUser?.name}"? Esta ação não pode ser desfeita.`}
          isLoading={false}
        />

        {/* Modal de Filtros */}
        <FilterDrawer
          isOpen={showFiltersModal}
          onClose={() => setShowFiltersModal(false)}
          title='Filtros de Usuários'
          footer={
            <>
              {Object.values(localFilters).some(
                value => value !== undefined && value !== '' && value !== false
              ) && (
                <ClearButton
                  onClick={() => {
                    const cleared = {
                      search: '',
                      role: undefined,
                      active: undefined,
                      hasAvatar: undefined,
                      dateRange: undefined,
                      onlyMyData: false,
                    };
                    setLocalFilters(cleared);
                    setFilters(cleared);
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
                    search: localFilters.search,
                    role: localFilters.role,
                    active: localFilters.active,
                    hasAvatar: localFilters.hasAvatar,
                    dateRange: localFilters.dateRange,
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
                  placeholder='Buscar por nome ou email...'
                  value={localFilters.search || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                />
              </FilterSearchContainer>
            </FilterSection>

            <FilterSection>
              <FilterSectionTitle>👥 Filtros por Categoria</FilterSectionTitle>

              <FilterGrid>
                <FilterGroup>
                  <FilterLabel>Role/Função</FilterLabel>
                  <FilterSelect
                    value={localFilters.role || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        role: e.target.value || undefined,
                      }))
                    }
                  >
                    <option value=''>Todas as funções</option>
                    <option value='master'>Master</option>
                    <option value='admin'>Admin</option>
                    <option value='manager'>Manager</option>
                    <option value='user'>User</option>
                  </FilterSelect>
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Status</FilterLabel>
                  <FilterSelect
                    value={
                      localFilters.active !== undefined
                        ? String(localFilters.active)
                        : ''
                    }
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        active:
                          e.target.value === 'true'
                            ? true
                            : e.target.value === 'false'
                              ? false
                              : undefined,
                      }))
                    }
                  >
                    <option value=''>Todos os status</option>
                    <option value='true'>Apenas ativos</option>
                    <option value='false'>Apenas inativos</option>
                  </FilterSelect>
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Avatar</FilterLabel>
                  <FilterSelect
                    value={
                      localFilters.hasAvatar !== undefined
                        ? String(localFilters.hasAvatar)
                        : ''
                    }
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        hasAvatar:
                          e.target.value === 'true'
                            ? true
                            : e.target.value === 'false'
                              ? false
                              : undefined,
                      }))
                    }
                  >
                    <option value=''>Todos</option>
                    <option value='true'>Com avatar</option>
                    <option value='false'>Sem avatar</option>
                  </FilterSelect>
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Período de Criação</FilterLabel>
                  <FilterSelect
                    value={localFilters.dateRange || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        dateRange: e.target.value || undefined,
                      }))
                    }
                  >
                    <option value=''>Todos os períodos</option>
                    <option value='today'>Hoje</option>
                    <option value='week'>Esta semana</option>
                    <option value='month'>Este mês</option>
                    <option value='quarter'>Este trimestre</option>
                    <option value='year'>Este ano</option>
                  </FilterSelect>
                </FilterGroup>
              </FilterGrid>
            </FilterSection>

            <FilterSection>
              <FilterSectionTitle>🔒 Escopo de Dados</FilterSectionTitle>

              <DataScopeFilter
                onlyMyData={localFilters.onlyMyData || false}
                onChange={value =>
                  setLocalFilters(prev => ({ ...prev, onlyMyData: value }))
                }
                label='Mostrar apenas meus usuários'
                description='Quando marcado, mostra apenas usuários que você criou, ignorando hierarquia de usuários.'
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
      </PageContainer>

      {/* Modal Reset 2FA */}
      <ResetTwoFactorModal
        isOpen={!!resetModalUser}
        onClose={() => setResetModalUser(null)}
        userName={resetModalUser?.name || ''}
        isLoading={isResetting}
        onConfirm={async () => {
          if (!resetModalUser) return;
          try {
            setIsResetting(true);
            await settingsApi.adminResetUser2FA(resetModalUser.id);
            toast.success(
              '2FA do usuário resetado. Ele precisará reconfigurar no próximo login.'
            );
            setResetModalUser(null);
          } catch (e: any) {
            toast.error(e?.message || 'Erro ao resetar 2FA do usuário.');
          } finally {
            setIsResetting(false);
          }
        }}
      />
    </Layout>
  );
};

// Styled Components para FilterDrawer
const FiltersContainer = styled.div`
  padding: 0;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterSectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 6px;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const FilterSearchContainer = styled.div`
  position: relative;
`;

const FilterSearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  pointer-events: none;
`;

const FilterSearchInput = styled(FilterInput)`
  padding-left: 40px;
`;

const FilterStats = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default UsersPage;

// Componente de Menu de Ações do Usuário
interface UserMenuProps {
  userId: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onEdit: () => void;
  onReset2FA: () => void;
  onDelete: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  userId,
  isOpen,
  onToggle,
  onClose,
  onEdit,
  onReset2FA,
  onDelete,
}) => {
  const permissionsContext = usePermissionsContextOptional();
  const canUpdate = permissionsContext?.hasPermission('user:update') ?? false;
  const canDelete = permissionsContext?.hasPermission('user:delete') ?? false;

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current && dropdownRef.current) {
      const calculatePosition = () => {
        const buttonRect = buttonRef.current!.getBoundingClientRect();
        const dropdownHeight = 180; // Altura estimada do dropdown (3 itens + padding)
        const isMobile = window.innerWidth <= 768;
        const spacing = 8; // Espaçamento entre botão e dropdown

        // Calcular posição acima do botão
        let top = buttonRect.top - dropdownHeight - spacing;

        // Verificar se há espaço suficiente acima, se não, abrir abaixo
        if (top < 10) {
          top = buttonRect.bottom + spacing;
        }

        if (isMobile) {
          // Em mobile, posicionar fixo no canto direito
          const right = 16;
          setPosition({ top, right });
        } else {
          // Em desktop, posicionar relativo ao botão
          const right = window.innerWidth - buttonRect.right;
          setPosition({ top, right });
        }
      };

      calculatePosition();
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition, true);

      return () => {
        window.removeEventListener('resize', calculatePosition);
        window.removeEventListener('scroll', calculatePosition, true);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleToggle = () => {
    // Só permitir abrir se tiver pelo menos uma permissão
    if (canUpdate || canDelete) {
      onToggle();
    }
  };

  return (
    <MenuWrapper ref={menuRef}>
      <MenuButton
        ref={buttonRef}
        aria-label='Ações'
        onClick={handleToggle}
        disabled={!canUpdate && !canDelete}
        $disabled={!canUpdate && !canDelete}
        title={
          !canUpdate && !canDelete
            ? 'Você não tem permissão para realizar ações'
            : 'Ações'
        }
      >
        •••
      </MenuButton>
      {isOpen && (canUpdate || canDelete) && (
        <MenuDropdown
          ref={dropdownRef}
          $top={position.top}
          $right={position.right}
          onMouseLeave={() => {
            // Só fechar no mouse leave em desktop
            if (window.innerWidth > 768) {
              onClose();
            }
          }}
        >
          <MenuItem
            onClick={canUpdate ? onEdit : undefined}
            disabled={!canUpdate}
            $disabled={!canUpdate}
            title={
              !canUpdate
                ? 'Você não tem permissão para editar usuários'
                : 'Editar'
            }
          >
            <MdEdit size={16} /> Editar
          </MenuItem>
          <MenuItem
            onClick={canUpdate ? onReset2FA : undefined}
            disabled={!canUpdate}
            $disabled={!canUpdate}
            title={
              !canUpdate
                ? 'Você não tem permissão para resetar 2FA'
                : 'Resetar 2FA'
            }
          >
            <MdShield size={16} /> Resetar 2FA
          </MenuItem>
          <MenuDivider />
          <MenuItem
            $danger
            onClick={canDelete ? onDelete : undefined}
            disabled={!canDelete}
            $disabled={!canDelete}
            title={
              !canDelete
                ? 'Você não tem permissão para excluir usuários'
                : 'Excluir'
            }
          >
            <MdDelete size={16} /> Excluir
          </MenuItem>
        </MenuDropdown>
      )}
    </MenuWrapper>
  );
};

// Inline styles for actions menu (scoped to UsersPage)
const MenuWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const MenuButton = styled.button<{ $disabled?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid
    ${p => (p.$disabled ? p.theme.colors.border : p.theme.colors.border)};
  background: ${p =>
    p.$disabled
      ? p.theme.colors.backgroundTertiary
      : p.theme.colors.background};
  color: ${p =>
    p.$disabled ? p.theme.colors.textSecondary : p.theme.colors.text};
  cursor: ${p => (p.$disabled ? 'not-allowed' : 'pointer')};
  font-weight: 900;
  line-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  opacity: ${p => (p.$disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background: ${p => p.theme.colors.primary}10;
    border-color: ${p => p.theme.colors.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const MenuDropdown = styled.div<{ $top: number; $right: number }>`
  position: fixed;
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  padding: 8px;
  min-width: 180px;
  z-index: 10000;
  top: ${p => p.$top}px;
  right: ${p => p.$right}px;

  @media (max-width: 768px) {
    min-width: 200px;
    max-width: calc(100vw - 32px);
    right: ${p => Math.min(p.$right, 16)}px !important;
    left: auto !important;
  }

  @media (max-width: 480px) {
    min-width: 180px;
    max-width: calc(100vw - 24px);
    right: ${p => Math.min(p.$right, 12)}px !important;
  }
`;

const MenuItem = styled.button<{ $danger?: boolean; $disabled?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: ${p => {
    if (p.$disabled) return p.theme.colors.textSecondary;
    return p.$danger
      ? p.theme.mode === 'dark'
        ? '#fca5a5'
        : '#991b1b'
      : p.theme.colors.text;
  }};
  cursor: ${p => (p.$disabled ? 'not-allowed' : 'pointer')};
  text-align: left;
  transition: 0.15s ease;
  opacity: ${p => (p.$disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background: ${p =>
      p.$danger
        ? p.theme.mode === 'dark'
          ? '#7f1d1d'
          : '#fee2e2'
        : p.theme.colors.background};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background: ${p => p.theme.colors.border};
  margin: 4px 0;
`;
