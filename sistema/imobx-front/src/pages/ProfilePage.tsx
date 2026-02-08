import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { useCompany } from '../hooks/useCompany';
import { useTags } from '../hooks/useTags';
import { usePublicVisibility } from '../hooks/usePublicVisibility';
import { useNavigate } from 'react-router-dom';
import { translateUserRole } from '../utils/roleTranslations';
import { authApi } from '../services/api';
import { companyApi } from '../services/companyApi';
import { formatPhoneDisplay } from '../utils/masks';
import { ProfilePageShimmer } from '../components/shimmer/ProfilePageShimmer';
import { SessionsModal } from '../components/modals/SessionsModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import CompaniesSection from '../components/CompaniesSection';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';
import { toast } from 'react-toastify';
import { settingsApi } from '../services/settingsApi';
import {
  ProfilePageContainer,
  ProfileHeader,
  HeaderLeft,
  ProfileTitle,
  ProfileIcon,
  ProfileCount,
  EditProfileButton,
  ProfileControls,
  SearchContainer,
  SearchInputContainer,
  SearchInput,
  SearchIcon,
  FilterToggle,
  ActiveFiltersIndicator,
  FilterPanel,
  FilterHeader,
  FilterTitle,
  FilterClose,
  FilterContent,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  FilterActions,
  FilterButton,
  ProfileStatsGrid,
  StatCard,
  StatIcon,
  StatContent,
  StatValue,
  StatLabel,
  ProfileGrid,
  ModernProfileCard,
  ProfileCardGradient,
  ProfileCardHeader,
  ProfileInfo,
  ProfileAvatar,
  AvatarImage,
  AvatarPlaceholder,
  ProfileDetails,
  ProfileName,
  ProfileRole,
  ProfileActions,
  ActionButton,
  ProfileStats,
  ProfileStat,
  ProfileStatValue,
  ProfileStatLabel,
  InfoCard,
  CardHeader,
  CardTitle,
  CardAction,
  InfoList,
  InfoItem,
  InfoIcon,
  InfoContent,
  InfoLabel,
  InfoValue,
  InfoAction,
  CompanyCard,
  CompanyHeader,
  CompanyName,
  CompanyActions,
  CompanyActionButton,
  CompanyInfo,
  CompanyDetail,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  LoadingContainer,
  HiddenFileInput,
  ResponsiveGrid,
  ResponsiveStats,
} from '../styles/pages/ProfilePageStyles';
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdBadge,
  MdCalendarToday,
  MdEdit,
  MdBusiness,
  MdAttachMoney,
  MdError,
  MdSecurity,
  MdLocationOn,
  MdSettings,
  MdPhotoCamera,
  MdHome,
  MdPeople,
  MdDescription,
  MdTrendingUp,
  MdDevices,
  MdMoreVert,
  MdFilterList,
  MdClose,
  MdCheck,
  MdAdd,
  MdSearch,
  MdLock,
  MdOpenInNew,
} from 'react-icons/md';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentUser, refreshUser } = useAuth();
  const { hasCompanies } = useCompany();
  const { getUserTags } = useTags();

  // Hook de visibilidade pública - só usar se o contexto de auth estiver pronto
  let publicVisibilityHook;
  try {
    publicVisibilityHook = usePublicVisibility();
  } catch (error) {
    console.warn('Erro ao inicializar hook de visibilidade pública:', error);
    publicVisibilityHook = {
      isVisible: false,
      isLoading: false,
      isUpdating: false,
      toggleVisibility: async () => {},
      error: null,
    };
  }

  const {
    isVisible,
    isLoading: visibilityLoading,
    isUpdating: visibilityUpdating,
    toggleVisibility,
  } = publicVisibilityHook;

  const [user, setUser] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [userTags, setUserTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [company2FAState, setCompany2FAState] = useState<
    Record<string, boolean>
  >({});
  const [savingCompany2FA, setSavingCompany2FA] = useState<
    Record<string, boolean>
  >({});

  // Estados para modais
  // edição de empresa via página (não mais modal)
  const [isDeleteCompanyModalOpen, setIsDeleteCompanyModalOpen] =
    useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<any>(null);
  const [isDeletingCompany, setIsDeletingCompany] = useState(false);

  // Estados para sessões
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);

  // Estado para modal de alteração de senha
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  // Estados para filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Ref para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar dados do perfil da API
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);

        const userData = await getCurrentUser();
        // console.log('📊 Dados do usuário:', userData);
        // console.log('📅 Data de criação:', userData?.created_at);
        setUser(userData);

        // Carregar empresas
        await loadCompanies();

        // Carregar tags do usuário
        if (userData?.id) {
          try {
            const tags = await getUserTags(userData.id);
            setUserTags(tags.map(tag => tag.name));
          } catch (tagError) {
            console.warn('Erro ao carregar tags:', tagError);
            // Não falha o carregamento principal se as tags falharem
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
        toast.error('Erro ao carregar dados do perfil');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []); // Array vazio para executar apenas uma vez

  // Escutar evento de atualização de dados do usuário
  useEffect(() => {
    const handleUserDataUpdated = (event: Event) => {
      // console.log('🔄 ProfilePage: Evento user-data-updated recebido');
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
      // console.log('✅ ProfilePage: Dados do usuário atualizados no estado');
    };

    window.addEventListener('user-data-updated', handleUserDataUpdated);

    return () => {
      window.removeEventListener('user-data-updated', handleUserDataUpdated);
    };
  }, [getCurrentUser]);

  // Carregar empresas
  const loadCompanies = async () => {
    try {
      // console.log('🔄 Carregando empresas...');
      setCompaniesLoading(true);
      setCompaniesError(null);

      // Aguardar inicialização (permissões) antes de carregar empresas
      const { initializationService } = await import(
        '../services/initializationService'
      );
      await initializationService.waitForInitialization();

      // console.log('🏢 ProfilePage: Permissões carregadas, agora carregando empresas...');
      const companies = await companyApi.getCompanies();
      // console.log('✅ Empresas carregadas:', companies);
      setCompanies(companies || []);
      // Inicializar mapa de 2FA (fallback para false se não vier do backend)
      const initialMap: Record<string, boolean> = {};
      (companies || []).forEach((c: any) => {
        initialMap[c.id] = !!(
          c.requireTwoFactor ||
          c.require_2fa ||
          c.totpRequired
        );
      });
      setCompany2FAState(initialMap);
    } catch (error) {
      console.error('❌ Erro ao carregar empresas:', error);
      setCompaniesError('Erro ao carregar empresas');
    } finally {
      setCompaniesLoading(false);
    }
  };

  const toggleCompany2FA = async (companyId: string, next: boolean) => {
    setCompany2FAState(prev => ({ ...prev, [companyId]: next }));
    setSavingCompany2FA(prev => ({ ...prev, [companyId]: true }));
    try {
      await settingsApi.setCompanyRequire2FAFor(companyId, next);
      toast.success(
        `2FA obrigatório ${next ? 'ativado' : 'desativado'} para a empresa.`
      );
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao salvar 2FA da empresa.');
      // Reverter estado em caso de erro
      setCompany2FAState(prev => ({ ...prev, [companyId]: !next }));
    } finally {
      setSavingCompany2FA(prev => ({ ...prev, [companyId]: false }));
    }
  };

  // Função para obter iniciais do usuário
  const getUserInitials = (name: string) => {
    if (!name) return '??';
    const words = name.split(' ');
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return name.substring(0, 2);
  };

  // Função para obter cor baseada no nome
  const getUserColor = (name: string) => {
    const colors = [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#06B6D4', // Cyan
      '#F97316', // Orange
      '#84CC16', // Lime
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Função para formatar data
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'Não informado';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  // Função para formatar dados opcionais
  const formatOptionalData = (
    data: string | undefined | null,
    fallback: string = 'Não informado'
  ) => {
    if (!data || data.trim() === '') return fallback;
    return data;
  };

  // Função para lidar com clique no avatar
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Função para lidar com mudança de arquivo
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await authApi.uploadAvatar(file);

      // Recarregar dados atualizados do usuário do backend
      await refreshUser();
      const updatedUser = getCurrentUser();
      setUser(updatedUser);

      toast.success('Avatar atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      toast.error('Erro ao fazer upload do avatar');
    }
  };

  // Função para editar empresa
  const handleEditCompany = (company: any) => {
    // CORREÇÃO: Apenas admin e master podem editar empresa
    if (user?.role !== 'admin' && user?.role !== 'master') {
      toast.info('Apenas administradores podem editar informações da empresa');
      return;
    }
    navigate(`/companies/${company.id}/edit`);
  };

  // Função para abrir modal de confirmação de exclusão
  const handleDeleteCompany = (company: any) => {
    // CORREÇÃO: Apenas admin e master podem excluir empresa
    if (user?.role !== 'admin' && user?.role !== 'master') {
      toast.info('Apenas administradores podem excluir empresas');
      return;
    }

    // Impedir exclusão da empresa Matrix
    const companyName = company?.name?.toLowerCase() || '';
    if (companyName === 'matrix') {
      toast.error('A empresa Matrix não pode ser excluída!');
      return;
    }

    setCompanyToDelete(company);
    setIsDeleteCompanyModalOpen(true);
  };

  // Função para confirmar e executar exclusão
  const confirmDeleteCompany = async () => {
    if (!companyToDelete) return;

    setIsDeletingCompany(true);
    try {
      await companyApi.deleteCompany(companyToDelete.id);
      await loadCompanies();
      toast.success('Empresa excluída com sucesso!');
      setIsDeleteCompanyModalOpen(false);
      setCompanyToDelete(null);
    } catch (error: any) {
      console.error('Erro ao excluir empresa:', error);
      const errorMessage =
        error.response?.data?.message || 'Erro ao excluir empresa';
      toast.error(errorMessage);
    } finally {
      setIsDeletingCompany(false);
    }
  };

  // Função para abrir modal de sessões
  const handleOpenSessions = () => {
    setIsSessionsModalOpen(true);
  };

  // Filtrar empresas baseado na busca
  const filteredCompanies = companies.filter(
    company =>
      company.name.toLowerCase().includes(companySearchTerm.toLowerCase()) ||
      company.cnpj?.toLowerCase().includes(companySearchTerm.toLowerCase())
  );

  // Calcular estatísticas
  const stats = [
    {
      icon: MdBusiness,
      value: companies.length,
      label: 'Empresas',
      color: '#3B82F6',
    },
    {
      icon: MdHome,
      value: 12, // Placeholder - substituir por dados reais
      label: 'Propriedades',
      color: '#10B981',
    },
    {
      icon: MdPeople,
      value: 8, // Placeholder - substituir por dados reais
      label: 'Clientes',
      color: '#F59E0B',
    },
    {
      icon: MdAttachMoney,
      value: 'R$ 150K', // Placeholder - substituir por dados reais
      label: 'Receita Mensal',
      color: '#8B5CF6',
    },
  ];

  if (isLoading) {
    return (
      <Layout>
        <ProfilePageShimmer />
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <ProfilePageContainer>
          <EmptyState>
            <EmptyStateIcon>
              <MdError size={64} />
            </EmptyStateIcon>
            <EmptyStateTitle>Erro ao carregar perfil</EmptyStateTitle>
            <EmptyStateDescription>
              Não foi possível carregar os dados do seu perfil. Tente novamente.
            </EmptyStateDescription>
          </EmptyState>
        </ProfilePageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <ProfilePageContainer>
        {/* Header */}
        <ProfileHeader>
          <HeaderLeft>
            <ProfileTitle>Meu Perfil</ProfileTitle>
            <ProfileCount>{companies.length} Empresas</ProfileCount>
          </HeaderLeft>

          <EditProfileButton onClick={() => navigate('/profile/edit')}>
            <MdEdit size={20} />
            Editar Perfil
          </EditProfileButton>
        </ProfileHeader>

        {/* Controles de busca e filtro */}
        <ProfileControls>
          <SearchContainer>
            <SearchInput
              type='text'
              placeholder='Buscar empresas...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <SearchIcon />
          </SearchContainer>

          <FilterToggle onClick={() => setShowFilters(!showFilters)}>
            <MdFilterList size={20} />
            Filtros
            {activeFilters > 0 && (
              <ActiveFiltersIndicator>{activeFilters}</ActiveFiltersIndicator>
            )}
          </FilterToggle>
        </ProfileControls>

        {/* Filtros */}
        {showFilters && (
          <FilterPanel>
            <FilterHeader>
              <FilterTitle>Filtros</FilterTitle>
              <FilterClose onClick={() => setShowFilters(false)}>
                <MdClose />
              </FilterClose>
            </FilterHeader>

            <FilterContent>
              <FilterGroup>
                <FilterLabel>Status da Empresa</FilterLabel>
                <FilterSelect>
                  <option value=''>Todas</option>
                  <option value='active'>Ativas</option>
                  <option value='inactive'>Inativas</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Tipo de Empresa</FilterLabel>
                <FilterSelect>
                  <option value=''>Todos</option>
                  <option value='real_estate'>Imobiliária</option>
                  <option value='construction'>Construção</option>
                  <option value='other'>Outros</option>
                </FilterSelect>
              </FilterGroup>

              <FilterActions>
                <FilterButton onClick={() => setActiveFilters(0)}>
                  Limpar
                </FilterButton>
                <FilterButton primary onClick={() => setShowFilters(false)}>
                  Aplicar
                </FilterButton>
              </FilterActions>
            </FilterContent>
          </FilterPanel>
        )}

        {/* Estatísticas */}
        <ResponsiveStats>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <StatIcon color={stat.color}>
                <stat.icon />
              </StatIcon>
              <StatContent>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatContent>
            </StatCard>
          ))}
        </ResponsiveStats>

        {/* Lista de seções - Informações Pessoais e Segurança */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {/* Card de informações pessoais */}
          <InfoCard>
            <CardHeader>
              <CardTitle>
                <MdPerson />
                Informações Pessoais
              </CardTitle>
            </CardHeader>

            <InfoList>
              {/* Avatar e informações básicas */}
              <InfoItem
                style={{
                  padding: '20px 0',
                  borderBottom: '2px solid #e5e7eb',
                  marginBottom: '16px',
                }}
                title='Clique para alterar sua foto de perfil'
              >
                <InfoIcon
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f8fafc',
                  }}
                >
                  <ProfileAvatar
                    onClick={handleAvatarClick}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    {user.avatar ? (
                      <AvatarImage
                        src={`${user.avatar}?t=${Date.now()}`}
                        alt='Avatar'
                        onLoad={() =>
                          console.log('✅ Imagem carregada com sucesso!')
                        }
                        onError={e => {
                          console.error('❌ Erro ao carregar imagem:', e);
                          // console.log('🔗 URL que falhou:', user.avatar);
                        }}
                      />
                    ) : (
                      <AvatarPlaceholder>
                        {getUserInitials(user.name)}
                      </AvatarPlaceholder>
                    )}
                  </ProfileAvatar>
                </InfoIcon>
                <InfoContent style={{ flex: 1, marginLeft: '20px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <InfoLabel>Nome Completo</InfoLabel>
                    <InfoValue style={{ fontSize: '24px', fontWeight: '700' }}>
                      {user.name}
                    </InfoValue>
                  </div>
                  <div>
                    <InfoLabel>Cargo</InfoLabel>
                    <InfoValue style={{ fontSize: '18px', fontWeight: '500' }}>
                      {translateUserRole(user.role)}
                    </InfoValue>
                  </div>
                </InfoContent>
              </InfoItem>

              <InfoItem title={`Email principal: ${user.email}`}>
                <InfoIcon>
                  <MdEmail />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{user.email}</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem
                title={`Telefone: ${user.phone ? formatPhoneDisplay(user.phone) : 'Não informado'}`}
              >
                <InfoIcon>
                  <MdPhone />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Telefone</InfoLabel>
                  <InfoValue>
                    {user.phone
                      ? formatPhoneDisplay(user.phone)
                      : 'Não informado'}
                  </InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem title={`Cargo: ${translateUserRole(user.role)}`}>
                <InfoIcon>
                  <MdBadge />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Cargo</InfoLabel>
                  <InfoValue>{translateUserRole(user.role)}</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem title={`Membro desde ${formatDate(user.created_at)}`}>
                <InfoIcon>
                  <MdCalendarToday />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Membro desde</InfoLabel>
                  <InfoValue>{formatDate(user.created_at)}</InfoValue>
                </InfoContent>
              </InfoItem>
            </InfoList>
          </InfoCard>

          {/* Card de segurança */}
          <InfoCard>
            <CardHeader>
              <CardTitle>
                <MdSecurity />
                Segurança
              </CardTitle>
            </CardHeader>

            <InfoList>
              <InfoItem title='Veja e encerre sessões ativas'>
                <InfoIcon>
                  <MdDevices />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Sessões Ativas</InfoLabel>
                  <InfoValue>3 dispositivos</InfoValue>
                </InfoContent>
                <InfoAction onClick={handleOpenSessions}>
                  <MdMoreVert />
                </InfoAction>
              </InfoItem>

              <InfoItem title='Alterar sua senha de acesso'>
                <InfoIcon>
                  <MdLock />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Alterar Senha</InfoLabel>
                  <InfoValue>Modificar senha de acesso</InfoValue>
                </InfoContent>
                <InfoAction
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  style={{ cursor: 'pointer' }}
                >
                  <MdSettings />
                </InfoAction>
              </InfoItem>

              {/* Visibilidade Pública */}
              <InfoItem
                title={
                  isVisible
                    ? 'Perfil público habilitado'
                    : 'Perfil público desabilitado'
                }
              >
                <InfoIcon>
                  <MdPeople />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Visibilidade Pública</InfoLabel>
                  <InfoValue>
                    {isVisible
                      ? 'Perfil público habilitado na lista de corretores'
                      : 'Perfil público desabilitado para a lista de corretores'}
                  </InfoValue>
                </InfoContent>
                <InfoAction
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: visibilityUpdating ? 'wait' : 'pointer',
                      gap: '8px',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '48px',
                        height: '24px',
                        background: isVisible
                          ? 'var(--color-primary)'
                          : 'var(--color-border)',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        opacity: visibilityUpdating ? 0.6 : 1,
                        cursor: visibilityUpdating ? 'wait' : 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={isVisible}
                        onChange={toggleVisibility}
                        disabled={visibilityLoading || visibilityUpdating}
                        style={{
                          position: 'absolute',
                          opacity: 0,
                          width: '100%',
                          height: '100%',
                          margin: 0,
                          cursor: visibilityUpdating ? 'wait' : 'pointer',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '2px',
                          left: isVisible ? '26px' : '2px',
                          width: '20px',
                          height: '20px',
                          background: 'white',
                          borderRadius: '50%',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--color-text)',
                      }}
                    >
                      {isVisible ? 'Habilitado' : 'Desabilitado'}
                    </span>
                    {visibilityUpdating && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Atualizando...
                      </span>
                    )}
                  </label>
                </InfoAction>
              </InfoItem>
            </InfoList>
          </InfoCard>
        </div>

        {/* Seção de empresas */}
        <InfoCard>
          <CardHeader>
            <CardTitle>
              <MdBusiness />
              Minhas Empresas
            </CardTitle>
          </CardHeader>

          {/* Campo de busca para empresas */}
          <SearchContainer>
            <SearchInputContainer>
              <SearchInput
                type='text'
                placeholder='Buscar empresas...'
                value={companySearchTerm}
                onChange={e => setCompanySearchTerm(e.target.value)}
              />
              <SearchIcon>
                <MdSearch size={20} />
              </SearchIcon>
            </SearchInputContainer>
          </SearchContainer>

          <InfoList>
            {companiesLoading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid #e5e7eb',
                    borderTop: '3px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px auto',
                  }}
                />
                <p style={{ color: '#6b7280', margin: 0 }}>
                  Carregando empresas...
                </p>
              </div>
            ) : companiesError ? (
              <EmptyState>
                <EmptyStateIcon>
                  <MdError />
                </EmptyStateIcon>
                <EmptyStateTitle>Erro ao carregar empresas</EmptyStateTitle>
                <EmptyStateDescription>{companiesError}</EmptyStateDescription>
              </EmptyState>
            ) : filteredCompanies.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>
                  <MdBusiness />
                </EmptyStateIcon>
                <EmptyStateTitle>Nenhuma empresa encontrada</EmptyStateTitle>
                <EmptyStateDescription>
                  {searchTerm
                    ? 'Tente ajustar sua busca ou filtros.'
                    : 'Você ainda não possui empresas cadastradas.'}
                </EmptyStateDescription>
              </EmptyState>
            ) : (
              filteredCompanies.map(company => (
                <CompanyCard key={company.id}>
                  <CompanyHeader>
                    <CompanyName>
                      <MdBusiness size={20} />
                      {company.name}
                    </CompanyName>
                    {/* CORREÇÃO: Apenas admin e master podem editar/excluir empresa */}
                    {(user?.role === 'admin' || user?.role === 'master') && (
                      <CompanyActions>
                        {/* Toggle TOTP obrigatório por empresa */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginRight: 8,
                          }}
                        >
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              fontSize: 12,
                            }}
                          >
                            <input
                              type='checkbox'
                              checked={!!company2FAState[company.id]}
                              onChange={e =>
                                toggleCompany2FA(company.id, e.target.checked)
                              }
                              disabled={!!savingCompany2FA[company.id]}
                            />
                            TOTP obrigatório
                          </label>
                        </div>
                        <CompanyActionButton
                          onClick={() => handleEditCompany(company)}
                          title='Editar empresa'
                        >
                          <MdEdit />
                        </CompanyActionButton>
                        {/* Impedir exclusão da empresa Matrix */}
                        {company?.name?.toLowerCase() !== 'matrix' && (
                          <CompanyActionButton
                            onClick={() => handleDeleteCompany(company)}
                            title='Excluir empresa'
                          >
                            <MdClose />
                          </CompanyActionButton>
                        )}
                      </CompanyActions>
                    )}
                  </CompanyHeader>

                  <CompanyInfo>
                    <CompanyDetail>
                      <MdLocationOn size={16} />
                      {formatOptionalData(
                        company.address,
                        'Endereço não informado'
                      )}
                    </CompanyDetail>
                    <CompanyDetail>
                      <MdAttachMoney size={16} />
                      CNPJ: {formatOptionalData(company.cnpj)}
                    </CompanyDetail>
                    <CompanyDetail>
                      <MdCalendarToday size={16} />
                      Criada em: {formatDate(company.created_at)}
                    </CompanyDetail>
                  </CompanyInfo>

                  {/* Botão para ver no site Dream Keys */}
                  <div
                    style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    <ActionButton
                      onClick={() =>
                        window.open(
                          `https://www.intellisys.com.br/imobiliaria/${company.id}`,
                          '_blank',
                          'noopener,noreferrer'
                        )
                      }
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        background: 'var(--color-background-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        color: 'var(--color-text)',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background =
                          'var(--color-primary)';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor =
                          'var(--color-primary)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background =
                          'var(--color-background-secondary)';
                        e.currentTarget.style.color = 'var(--color-text)';
                        e.currentTarget.style.borderColor =
                          'var(--color-border)';
                      }}
                    >
                      <MdOpenInNew size={18} />
                      Ver no Site Dream Keys
                    </ActionButton>
                  </div>
                </CompanyCard>
              ))
            )}
          </InfoList>
        </InfoCard>

        {/* Input de arquivo oculto */}
        <HiddenFileInput
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleFileChange}
        />

        {/* Modais */}
        <SessionsModal
          isOpen={isSessionsModalOpen}
          onClose={() => setIsSessionsModalOpen(false)}
        />

        <ConfirmDeleteModal
          isOpen={isDeleteCompanyModalOpen}
          onClose={() => {
            setIsDeleteCompanyModalOpen(false);
            setCompanyToDelete(null);
          }}
          onConfirm={confirmDeleteCompany}
          title='Confirmar Exclusão de Empresa'
          message='Tem certeza que deseja excluir esta empresa? Esta ação é irreversível e todos os dados vinculados a esta empresa serão permanentemente removidos.'
          itemName={companyToDelete?.name}
          isLoading={isDeletingCompany}
          variant='delete'
          confirmLabel='Sim, Excluir Empresa'
          loadingLabel='Excluindo empresa...'
        />

        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
        />
      </ProfilePageContainer>
    </Layout>
  );
};

export default ProfilePage;
