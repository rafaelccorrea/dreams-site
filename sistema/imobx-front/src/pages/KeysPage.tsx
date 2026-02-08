import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdGridView,
  MdViewList,
  MdClear,
} from 'react-icons/md';
import {
  PlusOutlined,
  KeyOutlined,
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
  LoginOutlined,
  InfoCircleOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Layout } from '../components/layout/Layout';
import {
  useKeys,
  useKeyControls,
  useUserKeyControls,
  useKeyStatistics,
  useOverdueKeys,
} from '../hooks/useKeys';
import { useProperties } from '../hooks/useProperties';
import { usePermissions } from '../hooks/usePermissions';
import { KeyPermissionGuard } from '../components/keys/KeyPermissionGuard';
import { PermissionButton } from '../components/common/PermissionButton';
import { FilterDrawer } from '../components/common/FilterDrawer';
import DataScopeFilter from '../components/common/DataScopeFilter';
import { KeysPageShimmer } from '../components/common/Shimmer';
import { KeyHistoryModal } from '../components/key/KeyHistoryModal';
import {
  type Key,
  type KeyControl,
  type UpdateKeyData,
  type CreateKeyControlData,
  type ReturnKeyData,
} from '../services/keyService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styled from 'styled-components';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  ActionsBar,
  LeftActions,
  RightActions,
  SearchContainer,
  SearchInput,
  SearchIcon,
  FilterToggle,
  CounterBadge,
  ViewControls,
  ViewLabel,
  ViewToggle,
  ViewButton,
  StatsGrid,
  StatCard,
  StatLabel,
  StatValue,
  StatHelp,
  TabsContainer,
  TabsHeader,
  TabButton,
  TabsContent,
  KeysGrid,
  KeyCard,
  KeyCardHeader,
  KeyCardTitle,
  KeyCardActions,
  ActionButton,
  KeyCardContent,
  KeyCardInfo,
  KeyCardBadges,
  KeyCardBadge,
  KeyCardDescription,
  KeyCardLocation,
  KeyCardPropertyHighlight,
  PropertyIcon,
  PropertyInfo,
  PropertyTitle,
  PropertyType,
  KeyCardAdminActions,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateMessage,
  EmptyStateAction,
  AlertContainer,
  AlertTitle,
  AlertMessage,
} from '../styles/pages/KeysPageStyles';

// Removed Ant Design components

const KeysPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [editKeyOpen, setEditKeyOpen] = useState(false);
  const [checkoutKeyOpen, setCheckoutKeyOpen] = useState(false);
  const [returnKeyOpen, setReturnKeyOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [selectedKeyControl, setSelectedKeyControl] =
    useState<KeyControl | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filters, setFilters] = useState<{
    propertyId?: string;
    status?: string;
    name: string;
    description: string;
    search: string;
    available?: boolean;
    borrowed?: boolean;
    onlyMyData: boolean;
  }>({
    propertyId: undefined,
    status: undefined,
    name: '',
    description: '',
    search: '',
    available: undefined,
    borrowed: undefined,
    onlyMyData: false,
  });
  // Filtros locais para o drawer
  const [localFilters, setLocalFilters] = useState({
    propertyId: undefined as string | undefined,
    status: undefined as string | undefined,
    name: '',
    description: '',
    search: '',
    available: undefined as boolean | undefined,
    borrowed: undefined as boolean | undefined,
    onlyMyData: false,
  });

  // Inicializar filtros locais quando o drawer abrir
  useEffect(() => {
    if (showFiltersModal) {
      setLocalFilters({
        propertyId: filters.propertyId,
        status: filters.status,
        name: filters.name,
        description: filters.description,
        search: filters.search,
        available: filters.available,
        borrowed: filters.borrowed,
        onlyMyData: filters.onlyMyData,
      });
    }
  }, [showFiltersModal]);
  const [viewMode] = useState<'grid' | 'list'>('grid');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<Key | null>(null);

  const {
    keys,
    loading: keysLoading,
    updateKey,
    deleteKey,
    updateKeyStatus,
  } = useKeys();
  const {
    keyControls,
    loading: controlsLoading,
    checkoutKey,
    returnKey,
  } = useKeyControls();
  const { keyControls: userKeyControls, loading: userControlsLoading } =
    useUserKeyControls();
  const { statistics, loading: statsLoading } = useKeyStatistics();
  const { overdueKeys, loading: overdueLoading } = useOverdueKeys();
  const { properties, isLoading: propertiesLoading } = useProperties();
  const { hasPermission } = usePermissions();

  // Garantir que os dados sejam sempre arrays (fallback de segurança)
  const safeKeys = Array.isArray(keys) ? keys : [];
  const safeKeyControls = Array.isArray(keyControls) ? keyControls : [];
  const safeUserKeyControls = Array.isArray(userKeyControls)
    ? userKeyControls
    : [];
  const safeOverdueKeys = Array.isArray(overdueKeys) ? overdueKeys : [];
  const safeProperties = Array.isArray(properties) ? properties : [];

  // Carregamento de propriedades agora é feito automaticamente pelo hook useProperties
  // Não precisamos mais carregar manualmente aqui para evitar loops infinitos

  // const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setTabValue(newValue);
  // };

  const handleCreateKey = async () => {
    // Se ainda está carregando, aguardar
    if (propertiesLoading) {
      // console.log('⏳ Ainda carregando propriedades...');
      toast.info('Carregando propriedades...');
      return;
    }

    // Se não há propriedades, redirecionar para criação
    if (!safeProperties || safeProperties.length === 0) {
      // console.log('❌ Nenhuma propriedade encontrada, redirecionando para criação...');
      toast.warning(
        'Você precisa cadastrar pelo menos uma propriedade antes de criar chaves.'
      );
      navigate('/properties/create');
    } else {
      // console.log('✅ Propriedades encontradas, redirecionando para criação de chave...');
      navigate('/keys/create');
    }
  };

  // const handleRefreshProperties = async () => {
  //   console.log('🔄 Recarregando propriedades...');
  //   try {
  //     await getProperties({}, { page: 1, limit: 100 });
  //     message.success('Propriedades recarregadas com sucesso!');
  //   } catch (error) {
  //     console.error('❌ Erro ao recarregar propriedades:', error);
  //     message.error('Erro ao recarregar propriedades. Tente novamente.');
  //   }
  // };

  const handleUpdateKey = async (data: UpdateKeyData) => {
    if (!selectedKey) return;
    try {
      await updateKey(selectedKey.id, data);
      setEditKeyOpen(false);
      setSelectedKey(null);
    } catch {
      // Error is handled by the hook
    }
  };

  const handleDeleteKey = (key: Key) => {
    setKeyToDelete(key);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!keyToDelete) return;
    try {
      await deleteKey(keyToDelete.id);
    } finally {
      setConfirmOpen(false);
      setKeyToDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setKeyToDelete(null);
  };

  const handleCheckoutKey = async (data: CreateKeyControlData) => {
    try {
      await checkoutKey(data);
      // Atualizar status da chave no estado local
      updateKeyStatus(data.keyId, 'in_use');
      setCheckoutKeyOpen(false);
      setSelectedKey(null);
    } catch {
      // Error is handled by the hook
    }
  };

  const handleReturnKey = async (data: ReturnKeyData) => {
    if (!selectedKeyControl) return;
    try {
      await returnKey(selectedKeyControl.id, data);
      // Atualizar status da chave no estado local
      updateKeyStatus(selectedKeyControl.keyId, 'available');
      setReturnKeyOpen(false);
      setSelectedKeyControl(null);
    } catch {
      // Error is handled by the hook
    }
  };

  const handleViewHistory = (key: Key) => {
    setSelectedKey(key);
    setHistoryModalOpen(true);
  };

  const getKeyTypeLabel = (type: string) => {
    const types = {
      main: 'Principal',
      backup: 'Reserva',
      emergency: 'Emergência',
      garage: 'Garagem',
      mailbox: 'Caixa de Correio',
      other: 'Outro',
    };
    return types[type as keyof typeof types] || type;
  };

  // const getKeyStatusColor = (status: string) => {
  //   const colors = {
  //     available: 'success',
  //     in_use: 'warning',
  //     lost: 'error',
  //     damaged: 'error',
  //     maintenance: 'info',
  //   };
  //   return colors[status as keyof typeof colors] || 'default';
  // };

  const getKeyStatusLabel = (status: string) => {
    const labels = {
      available: 'Disponível',
      in_use: 'Em Uso',
      lost: 'Perdida',
      damaged: 'Danificada',
      maintenance: 'Manutenção',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getControlTypeLabel = (type: string) => {
    const types = {
      showing: 'Visita',
      maintenance: 'Manutenção',
      inspection: 'Vistoria',
      cleaning: 'Limpeza',
      other: 'Outro',
    };
    return types[type as keyof typeof types] || type;
  };

  // const getControlStatusColor = (status: string) => {
  //   const colors = {
  //     checked_out: 'warning',
  //     returned: 'success',
  //     overdue: 'error',
  //     lost: 'error',
  //   };
  //   return colors[status as keyof typeof colors] || 'default';
  // };

  const getControlStatusLabel = (status: string) => {
    const labels = {
      checked_out: 'Retirada',
      returned: 'Devolvida',
      overdue: 'Em Atraso',
      lost: 'Perdida',
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (
    keysLoading ||
    controlsLoading ||
    userControlsLoading ||
    statsLoading ||
    overdueLoading
  ) {
    return (
      <Layout>
        <PageContainer>
          <KeysPageShimmer />
        </PageContainer>
      </Layout>
    );
  }

  const tabItems = [
    {
      key: '0',
      label: 'Todas as Chaves',
      children: (
        <>
          {safeKeys.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <KeyOutlined />
              </EmptyStateIcon>
              <EmptyStateTitle>Nenhuma chave cadastrada</EmptyStateTitle>
              <EmptyStateMessage>
                Comece organizando o controle de chaves do seu negócio.
                <br />
                {safeProperties.length === 0 ? (
                  <>
                    Primeiro, cadastre uma propriedade e depois suas chaves.
                    <br />
                    As chaves devem estar vinculadas a uma propriedade.
                  </>
                ) : (
                  'Cadastre a primeira chave para começar a usar o sistema.'
                )}
              </EmptyStateMessage>
              {hasPermission('key:create') && safeProperties.length > 0 && (
                <EmptyStateAction onClick={handleCreateKey}>
                  <PlusOutlined />
                  Cadastrar Primeira Chave
                </EmptyStateAction>
              )}
              {safeProperties.length === 0 && (
                <EmptyStateAction
                  onClick={() => navigate('/properties/create')}
                >
                  <PlusOutlined />
                  Cadastrar Primeira Propriedade
                </EmptyStateAction>
              )}
            </EmptyState>
          ) : (
            <KeysGrid>
              {safeKeys.map(key => (
                <KeyCard key={key.id}>
                  {/* Header com título e propriedade em destaque */}
                  <KeyCardHeader>
                    <KeyCardTitle>
                      <KeyOutlined />
                      {key.name}
                    </KeyCardTitle>
                    <KeyCardBadges>
                      <KeyCardBadge $status={key.status}>
                        {key.status === 'available' && <LoginOutlined />}
                        {key.status === 'in_use' && <LogoutOutlined />}
                        {key.status === 'lost' && <DeleteOutlined />}
                        {key.status === 'damaged' && <DeleteOutlined />}
                        {key.status === 'maintenance' && <InfoCircleOutlined />}
                        {getKeyStatusLabel(key.status)}
                      </KeyCardBadge>
                    </KeyCardBadges>
                  </KeyCardHeader>

                  <KeyCardContent>
                    {/* Propriedade em destaque */}
                    <KeyCardPropertyHighlight>
                      <PropertyIcon>🏠</PropertyIcon>
                      <PropertyInfo>
                        <PropertyTitle>{key.property?.title}</PropertyTitle>
                        <PropertyType>{getKeyTypeLabel(key.type)}</PropertyType>
                      </PropertyInfo>
                    </KeyCardPropertyHighlight>

                    {/* Informações adicionais */}
                    <KeyCardInfo>
                      {key.description && (
                        <KeyCardDescription>
                          {key.description}
                        </KeyCardDescription>
                      )}

                      {key.location && (
                        <KeyCardLocation>
                          <InfoCircleOutlined />
                          {key.location}
                        </KeyCardLocation>
                      )}

                      {/* Mostrar informações de quem retirou a chave */}
                      {key.status === 'in_use' && key.keyControls && (
                        <KeyCardLocation
                          style={{
                            color: 'var(--color-warning)',
                            fontWeight: '600',
                          }}
                        >
                          <LogoutOutlined />
                          Em uso por:{' '}
                          {key.keyControls[0]?.user?.name ||
                            'Usuário desconhecido'}
                        </KeyCardLocation>
                      )}
                    </KeyCardInfo>

                    {/* Ações principais */}
                    <KeyCardActions>
                      {key.status === 'available' && (
                        <PermissionButton
                          permission='key:checkout'
                          variant='primary'
                          size='small'
                          onClick={() => {
                            setSelectedKey(key);
                            setCheckoutKeyOpen(true);
                          }}
                        >
                          <LoginOutlined />
                          Retirar Chave
                        </PermissionButton>
                      )}

                      {key.status === 'in_use' && (
                        <PermissionButton
                          permission='key:return'
                          variant='secondary'
                          size='small'
                          onClick={() => {
                            // Encontrar o controle ativo para esta chave
                            const activeControl = safeKeyControls.find(
                              control =>
                                control.keyId === key.id &&
                                control.status === 'checked_out'
                            );
                            if (activeControl) {
                              setSelectedKeyControl(activeControl);
                              setReturnKeyOpen(true);
                            }
                          }}
                        >
                          <LogoutOutlined />
                          Devolver Chave
                        </PermissionButton>
                      )}
                    </KeyCardActions>

                    {/* Ações administrativas */}
                    <KeyCardAdminActions>
                      <ActionButton
                        onClick={() => handleViewHistory(key)}
                        title='Ver histórico'
                        $variant='secondary'
                      >
                        <HistoryOutlined />
                      </ActionButton>
                      <PermissionButton
                        permission='key:update'
                        variant='secondary'
                        size='small'
                        onClick={() => {
                          setSelectedKey(key);
                          setEditKeyOpen(true);
                        }}
                      >
                        <EditOutlined />
                      </PermissionButton>
                      <PermissionButton
                        permission='key:delete'
                        variant='danger'
                        size='small'
                        onClick={() => handleDeleteKey(key)}
                      >
                        <DeleteOutlined />
                      </PermissionButton>
                    </KeyCardAdminActions>
                  </KeyCardContent>
                </KeyCard>
              ))}
            </KeysGrid>
          )}
        </>
      ),
    },
    {
      key: '1',
      label: 'Controles de Chave',
      children: (
        <>
          {safeKeyControls.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <LoginOutlined />
              </EmptyStateIcon>
              <EmptyStateTitle>
                Nenhum controle de chave registrado
              </EmptyStateTitle>
              <EmptyStateMessage>
                Ainda não há registros de chaves retiradas ou devolvidas.
                <br />
                Quando alguém retirar uma chave, aparecerá aqui.
              </EmptyStateMessage>
            </EmptyState>
          ) : (
            <KeysGrid>
              {safeKeyControls.map(control => (
                <KeyCard key={control.id}>
                  {/* Header com título e status */}
                  <KeyCardHeader>
                    <KeyCardTitle>
                      <KeyOutlined />
                      {control.key?.name}
                    </KeyCardTitle>
                    <KeyCardBadges>
                      <KeyCardBadge $status={control.status}>
                        {getControlStatusLabel(control.status)}
                      </KeyCardBadge>
                    </KeyCardBadges>
                  </KeyCardHeader>

                  <KeyCardContent>
                    {/* Propriedade em destaque */}
                    <KeyCardPropertyHighlight>
                      <PropertyIcon>🏠</PropertyIcon>
                      <PropertyInfo>
                        <PropertyTitle>
                          {control.key?.property?.title}
                        </PropertyTitle>
                        <PropertyType>
                          {getControlTypeLabel(control.type)}
                        </PropertyType>
                      </PropertyInfo>
                    </KeyCardPropertyHighlight>

                    {/* Informações do controle */}
                    <KeyCardInfo>
                      <KeyCardDescription>
                        <strong>👤 Retirada por:</strong> {control.user?.name}
                      </KeyCardDescription>

                      <KeyCardDescription>
                        <strong>📅 Data de retirada:</strong>{' '}
                        {format(
                          new Date(control.checkoutDate),
                          'dd/MM/yyyy HH:mm',
                          { locale: ptBR }
                        )}
                      </KeyCardDescription>

                      {control.expectedReturnDate && (
                        <KeyCardDescription>
                          <strong>⏰ Devolução esperada:</strong>{' '}
                          {format(
                            new Date(control.expectedReturnDate),
                            'dd/MM/yyyy HH:mm',
                            { locale: ptBR }
                          )}
                        </KeyCardDescription>
                      )}

                      {control.actualReturnDate && (
                        <KeyCardDescription>
                          <strong>✅ Devolvida em:</strong>{' '}
                          {format(
                            new Date(control.actualReturnDate),
                            'dd/MM/yyyy HH:mm',
                            { locale: ptBR }
                          )}
                        </KeyCardDescription>
                      )}

                      <KeyCardDescription>
                        <strong>📝 Motivo:</strong> {control.reason}
                      </KeyCardDescription>
                    </KeyCardInfo>

                    {/* Ação principal */}
                    {control.status === 'checked_out' &&
                      hasPermission('key:return') && (
                        <KeyCardActions>
                          <ActionButton
                            onClick={() => {
                              setSelectedKeyControl(control);
                              setReturnKeyOpen(true);
                            }}
                            $variant='secondary'
                          >
                            <LogoutOutlined />
                            Devolver Chave
                          </ActionButton>
                        </KeyCardActions>
                      )}
                  </KeyCardContent>
                </KeyCard>
              ))}
            </KeysGrid>
          )}
        </>
      ),
    },
    {
      key: '2',
      label: 'Minhas Chaves',
      children: (
        <>
          {safeUserKeyControls.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <KeyOutlined />
              </EmptyStateIcon>
              <EmptyStateTitle>
                Você não possui chaves retiradas
              </EmptyStateTitle>
              <EmptyStateMessage>
                Você ainda não retirou nenhuma chave.
                <br />
                Quando retirar uma chave, ela aparecerá nesta aba.
              </EmptyStateMessage>
            </EmptyState>
          ) : (
            <KeysGrid>
              {safeUserKeyControls.map(control => (
                <KeyCard key={control.id}>
                  {/* Header com título e status */}
                  <KeyCardHeader>
                    <KeyCardTitle>
                      <KeyOutlined />
                      {control.key?.name}
                    </KeyCardTitle>
                    <KeyCardBadges>
                      <KeyCardBadge $status={control.status}>
                        {getControlStatusLabel(control.status)}
                      </KeyCardBadge>
                    </KeyCardBadges>
                  </KeyCardHeader>

                  <KeyCardContent>
                    {/* Propriedade em destaque */}
                    <KeyCardPropertyHighlight>
                      <PropertyIcon>🏠</PropertyIcon>
                      <PropertyInfo>
                        <PropertyTitle>
                          {control.key?.property?.title}
                        </PropertyTitle>
                        <PropertyType>
                          {getControlTypeLabel(control.type)}
                        </PropertyType>
                      </PropertyInfo>
                    </KeyCardPropertyHighlight>

                    {/* Informações do controle */}
                    <KeyCardInfo>
                      <KeyCardDescription>
                        <strong>📅 Data de retirada:</strong>{' '}
                        {format(
                          new Date(control.checkoutDate),
                          'dd/MM/yyyy HH:mm',
                          { locale: ptBR }
                        )}
                      </KeyCardDescription>

                      {control.expectedReturnDate && (
                        <KeyCardDescription>
                          <strong>⏰ Devolução esperada:</strong>{' '}
                          {format(
                            new Date(control.expectedReturnDate),
                            'dd/MM/yyyy HH:mm',
                            { locale: ptBR }
                          )}
                        </KeyCardDescription>
                      )}

                      <KeyCardDescription>
                        <strong>📝 Motivo:</strong> {control.reason}
                      </KeyCardDescription>
                    </KeyCardInfo>

                    {/* Ação principal */}
                    {control.status === 'checked_out' &&
                      hasPermission('key:return') && (
                        <KeyCardActions>
                          <ActionButton
                            onClick={() => {
                              setSelectedKeyControl(control);
                              setReturnKeyOpen(true);
                            }}
                            $variant='secondary'
                          >
                            <LogoutOutlined />
                            Devolver Chave
                          </ActionButton>
                        </KeyCardActions>
                      )}
                  </KeyCardContent>
                </KeyCard>
              ))}
            </KeysGrid>
          )}
        </>
      ),
    },
  ];

  return (
    <KeyPermissionGuard permission='key:view'>
      <Layout>
        <PageContainer>
          <PageContent>
            <PageHeader>
              <PageTitleContainer>
                <PageTitle>Controle de Chaves</PageTitle>
                <PageSubtitle>Gerencie o acesso às propriedades</PageSubtitle>
              </PageTitleContainer>

              <PermissionButton
                permission='key:create'
                variant='primary'
                size='medium'
                onClick={handleCreateKey}
              >
                <MdAdd />
                Nova Chave
              </PermissionButton>
            </PageHeader>

            <ActionsBar>
              <LeftActions>
                <SearchContainer>
                  <SearchIcon>
                    <MdSearch />
                  </SearchIcon>
                  <SearchInput
                    placeholder='Buscar chaves...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </SearchContainer>

                <FilterToggle onClick={() => setShowFiltersModal(true)}>
                  <MdFilterList />
                  Filtros
                  {Object.values(filters).some(
                    value =>
                      value !== undefined && value !== '' && value !== false
                  ) && (
                    <CounterBadge>
                      {
                        Object.values(filters).filter(
                          value =>
                            value !== undefined &&
                            value !== '' &&
                            value !== false
                        ).length
                      }
                    </CounterBadge>
                  )}
                </FilterToggle>
              </LeftActions>

              <RightActions>
                <ViewControls>
                  <ViewLabel>Visualização:</ViewLabel>
                  <ViewToggle>
                    <ViewButton $active={viewMode === 'grid'}>
                      <MdGridView />
                    </ViewButton>
                    <ViewButton $active={viewMode === 'list'}>
                      <MdViewList />
                    </ViewButton>
                  </ViewToggle>
                </ViewControls>
              </RightActions>
            </ActionsBar>

            {/* Estatísticas */}
            {statistics && (
              <StatsGrid>
                <StatCard>
                  <StatLabel>Total de Chaves</StatLabel>
                  <StatValue>{statistics.totalKeys}</StatValue>
                  <StatHelp>Todas as chaves cadastradas</StatHelp>
                </StatCard>
                <StatCard>
                  <StatLabel>Disponíveis</StatLabel>
                  <StatValue style={{ color: 'var(--color-success)' }}>
                    {statistics.availableKeys}
                  </StatValue>
                  <StatHelp>Prontas para uso</StatHelp>
                </StatCard>
                <StatCard>
                  <StatLabel>Em Uso</StatLabel>
                  <StatValue style={{ color: 'var(--color-warning)' }}>
                    {statistics.inUseKeys}
                  </StatValue>
                  <StatHelp>Retiradas no momento</StatHelp>
                </StatCard>
                <StatCard>
                  <StatLabel>Em Atraso</StatLabel>
                  <StatValue style={{ color: 'var(--color-error)' }}>
                    {statistics.overdueCount}
                  </StatValue>
                  <StatHelp>Fora do prazo</StatHelp>
                </StatCard>
              </StatsGrid>
            )}

            {/* Alertas de chaves em atraso */}
            {safeOverdueKeys.length > 0 && (
              <AlertContainer>
                <AlertTitle>Chaves em Atraso</AlertTitle>
                <AlertMessage>
                  {safeOverdueKeys.map(control => (
                    <div key={control.id}>
                      • {control.key?.name} - {control.user?.name} (Esperado:{' '}
                      {control.expectedReturnDate
                        ? format(
                            new Date(control.expectedReturnDate),
                            'dd/MM/yyyy HH:mm',
                            { locale: ptBR }
                          )
                        : 'N/A'}
                      )
                    </div>
                  ))}
                </AlertMessage>
              </AlertContainer>
            )}

            {/* Tabs */}
            <TabsContainer>
              <TabsHeader>
                <TabButton
                  $active={tabValue === 0}
                  onClick={() => setTabValue(0)}
                >
                  Todas as Chaves
                </TabButton>
                <TabButton
                  $active={tabValue === 1}
                  onClick={() => setTabValue(1)}
                >
                  Controles de Chave
                </TabButton>
                <TabButton
                  $active={tabValue === 2}
                  onClick={() => setTabValue(2)}
                >
                  Minhas Chaves
                </TabButton>
              </TabsHeader>
              <TabsContent>{tabItems[tabValue]?.children}</TabsContent>
            </TabsContainer>

            {/* Modal para editar chave */}
            <EditKeyModal
              open={editKeyOpen}
              onClose={() => {
                setEditKeyOpen(false);
                setSelectedKey(null);
              }}
              onSubmit={handleUpdateKey}
              selectedKey={selectedKey}
            />

            {/* Modal para retirar chave */}
            <CheckoutKeyModal
              open={checkoutKeyOpen}
              onClose={() => {
                setCheckoutKeyOpen(false);
                setSelectedKey(null);
              }}
              onSubmit={handleCheckoutKey}
              selectedKey={selectedKey}
            />

            {/* Modal para devolver chave */}
            <ReturnKeyModal
              open={returnKeyOpen}
              onClose={() => {
                setReturnKeyOpen(false);
                setSelectedKeyControl(null);
              }}
              onSubmit={handleReturnKey}
              keyControl={selectedKeyControl}
            />

            {/* Modal para histórico da chave */}
            <KeyHistoryModal
              open={historyModalOpen}
              onClose={() => {
                setHistoryModalOpen(false);
                setSelectedKey(null);
              }}
              keyId={selectedKey?.id || ''}
              keyName={selectedKey?.name || ''}
            />

            {/* Modal de confirmação para exclusão */}
            <ConfirmModal
              open={confirmOpen}
              title='Excluir chave'
              message={
                keyToDelete
                  ? `Tem certeza que deseja excluir a chave "${keyToDelete.name}"? Esta ação não pode ser desfeita.`
                  : ''
              }
              confirmLabel='Excluir'
              cancelLabel='Cancelar'
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
              variant='danger'
            />
          </PageContent>
        </PageContainer>

        {/* Modal de Filtros */}
        <FilterDrawer
          isOpen={showFiltersModal}
          onClose={() => setShowFiltersModal(false)}
          title='Filtros de Chaves'
          footer={
            <>
              {Object.values(localFilters).some(
                value => value !== undefined && value !== '' && value !== false
              ) && (
                <ClearButton
                  onClick={() => {
                    const cleared = {
                      propertyId: undefined,
                      status: undefined,
                      name: '',
                      description: '',
                      search: '',
                      available: undefined,
                      borrowed: undefined,
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
                    propertyId: localFilters.propertyId,
                    status: localFilters.status,
                    name: localFilters.name,
                    description: localFilters.description,
                    search: localFilters.search,
                    available: localFilters.available,
                    borrowed: localFilters.borrowed,
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
                  placeholder='Buscar por nome ou descrição...'
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
              <FilterSectionTitle>🔑 Filtros por Categoria</FilterSectionTitle>

              <FilterGrid>
                <FilterGroup>
                  <FilterLabel>Nome da Chave</FilterLabel>
                  <FilterInput
                    type='text'
                    placeholder='Nome da chave...'
                    value={localFilters.name || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Descrição</FilterLabel>
                  <FilterInput
                    type='text'
                    placeholder='Descrição da chave...'
                    value={localFilters.description || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        description: e.target.value,
                      }))
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
                    <option value='available'>Disponível</option>
                    <option value='borrowed'>Emprestada</option>
                    <option value='lost'>Perdida</option>
                    <option value='damaged'>Danificada</option>
                  </FilterSelect>
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Propriedade</FilterLabel>
                  <FilterSelect
                    value={localFilters.propertyId || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        propertyId: e.target.value || undefined,
                      }))
                    }
                  >
                    <option value=''>Todas as propriedades</option>
                    {safeProperties?.map(property => (
                      <option key={property.id} value={property.id}>
                        {property.title}
                      </option>
                    ))}
                  </FilterSelect>
                </FilterGroup>
              </FilterGrid>
            </FilterSection>

            <FilterSection>
              <FilterSectionTitle>📊 Filtros Especiais</FilterSectionTitle>

              <FilterGrid>
                <FilterGroup>
                  <FilterLabel>Disponibilidade</FilterLabel>
                  <FilterSelect
                    value={
                      localFilters.available !== undefined
                        ? localFilters.available.toString()
                        : ''
                    }
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        available:
                          e.target.value === 'true'
                            ? true
                            : e.target.value === 'false'
                              ? false
                              : undefined,
                      }))
                    }
                  >
                    <option value=''>Todas</option>
                    <option value='true'>Apenas disponíveis</option>
                    <option value='false'>Apenas indisponíveis</option>
                  </FilterSelect>
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Emprestadas</FilterLabel>
                  <FilterSelect
                    value={
                      localFilters.borrowed !== undefined
                        ? localFilters.borrowed.toString()
                        : ''
                    }
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        borrowed:
                          e.target.value === 'true'
                            ? true
                            : e.target.value === 'false'
                              ? false
                              : undefined,
                      }))
                    }
                  >
                    <option value=''>Todas</option>
                    <option value='true'>Apenas emprestadas</option>
                    <option value='false'>Apenas não emprestadas</option>
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
                label='Mostrar apenas minhas chaves'
                description='Quando marcado, mostra apenas chaves que você criou, ignorando hierarquia de usuários.'
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
    </KeyPermissionGuard>
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

// Componentes styled para modais melhorados
const EditModalBox = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const EditModalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-secondary);
`;

const EditModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const EditIcon = styled.span`
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-background);
    color: var(--color-text);
  }
`;

const EditModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

const PropertySection = styled.div`
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PropertyLabel = styled.span`
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 14px;
`;

const PropertyName = styled.span`
  font-weight: 600;
  color: var(--color-text);
  font-size: 16px;
`;

const FormSection = styled.div`
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--color-primary);
  display: inline-block;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--color-text);
  background: var(--color-background);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary) 20;
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--color-text);
  background: var(--color-background);
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary) 20;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--color-text);
  background: var(--color-background);
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary) 20;
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
`;

const ModalButton = styled.button<{
  $variant: 'primary' | 'secondary' | 'danger';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 16px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  min-width: 140px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  ${props =>
    props.$variant === 'danger' &&
    `
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);

    &:hover {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    }

    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  `}

  ${props =>
    props.$variant === 'secondary' &&
    `
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    color: #475569;
    border: 2px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &:hover {
      background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
      border-color: #cbd5e1;
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  ${props =>
    props.$variant === 'primary' &&
    `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);

    &:hover {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }

    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  `}
`;

// Componentes de Modal

interface EditKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateKeyData) => void;
  selectedKey: Key | null;
}

const EditKeyModal: React.FC<EditKeyModalProps> = ({
  open,
  onClose,
  onSubmit,
  selectedKey,
}) => {
  const [formData, setFormData] = useState<UpdateKeyData>({
    name: '',
    description: '',
    type: 'main',
    status: 'available',
    location: '',
    notes: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (selectedKey) {
      setFormData({
        name: selectedKey.name,
        description: selectedKey.description || '',
        type: selectedKey.type,
        status: selectedKey.status,
        location: selectedKey.location || '',
        notes: selectedKey.notes || '',
        isActive: selectedKey.isActive,
      });
    }
  }, [selectedKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar chave:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateKeyData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!open || !selectedKey) return null;

  return (
    <ModalOverlay $isOpen={open} onClick={onClose}>
      <EditModalBox onClick={e => e.stopPropagation()}>
        <EditModalHead>
          <EditModalTitle>
            <EditIcon>🔑</EditIcon>
            Editar Chave
          </EditModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </EditModalHead>

        <EditModalBody>
          {/* Informações da propriedade */}
          <PropertySection>
            <PropertyLabel>Propriedade:</PropertyLabel>
            <PropertyName>{selectedKey.property?.title}</PropertyName>
          </PropertySection>

          <FormContainer onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>Informações Básicas</SectionTitle>

              <FormGroup>
                <Label>Nome da Chave *</Label>
                <Input
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder='Ex: Chave principal do apartamento'
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Descrição</Label>
                <TextArea
                  value={formData.description}
                  onChange={e => {
                    if (e.target.value.length <= 300) {
                      handleInputChange('description', e.target.value);
                    }
                  }}
                  placeholder='Descrição adicional da chave... (máx. 300 caracteres)'
                  maxLength={300}
                  rows={3}
                />
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle>Configurações</SectionTitle>

              <FormRow>
                <FormGroup>
                  <Label>Tipo</Label>
                  <Select
                    value={formData.type}
                    onChange={e => handleInputChange('type', e.target.value)}
                  >
                    <option value='main'>Principal</option>
                    <option value='backup'>Reserva</option>
                    <option value='emergency'>Emergência</option>
                    <option value='garage'>Garagem</option>
                    <option value='mailbox'>Caixa de Correio</option>
                    <option value='other'>Outro</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onChange={e => handleInputChange('status', e.target.value)}
                  >
                    <option value='available'>Disponível</option>
                    <option value='in_use'>Em Uso</option>
                    <option value='lost'>Perdida</option>
                    <option value='damaged'>Danificada</option>
                    <option value='maintenance'>Manutenção</option>
                  </Select>
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>Localização</Label>
                <Input
                  value={formData.location}
                  onChange={e => handleInputChange('location', e.target.value)}
                  placeholder='Ex: Cofre da recepção, Gaveta do escritório...'
                />
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle>Observações</SectionTitle>

              <FormGroup>
                <Label>Notas Internas</Label>
                <TextArea
                  value={formData.notes}
                  onChange={e => {
                    if (e.target.value.length <= 300) {
                      handleInputChange('notes', e.target.value);
                    }
                  }}
                  placeholder='Observações internas sobre a chave... (máx. 300 caracteres)'
                  maxLength={300}
                  rows={4}
                />
              </FormGroup>
            </FormSection>

            <ModalActions>
              <ModalButton $variant='secondary' type='button' onClick={onClose}>
                Cancelar
              </ModalButton>
              <ModalButton $variant='primary' type='submit' disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </ModalButton>
            </ModalActions>
          </FormContainer>
        </EditModalBody>
      </EditModalBox>
    </ModalOverlay>
  );
};

interface CheckoutKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateKeyControlData) => void;
  selectedKey: Key | null;
}

const CheckoutKeyModal: React.FC<CheckoutKeyModalProps> = ({
  open,
  onClose,
  onSubmit,
  selectedKey,
}) => {
  const [formData, setFormData] = useState<CreateKeyControlData>({
    type: 'showing',
    keyId: '',
    expectedReturnDate: '',
    reason: '',
    notes: '',
  });

  React.useEffect(() => {
    if (selectedKey) {
      setFormData(prev => ({
        ...prev,
        keyId: selectedKey.id,
      }));
    }
  }, [selectedKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as CreateKeyControlData);
    setFormData({
      type: 'showing',
      keyId: '',
      expectedReturnDate: '',
      reason: '',
      notes: '',
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!selectedKey) return null;

  return (
    <ModalOverlay $isOpen={open} onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <ModalHead>Retirar Chave: {selectedKey.name}</ModalHead>
        <ModalBody>
          <PropertyInfo>
            Propriedade: {selectedKey.property?.title}
          </PropertyInfo>

          <FormContainer onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Tipo de Uso</Label>
              <Select
                value={formData.type}
                onChange={e => handleInputChange('type', e.target.value)}
              >
                <option value='showing'>Visita</option>
                <option value='maintenance'>Manutenção</option>
                <option value='inspection'>Vistoria</option>
                <option value='cleaning'>Limpeza</option>
                <option value='other'>Outro</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Data de Devolução Esperada *</Label>
              <Input
                type='datetime-local'
                min={new Date().toISOString().slice(0, 16)}
                value={formData.expectedReturnDate}
                onChange={e =>
                  handleInputChange('expectedReturnDate', e.target.value)
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Motivo da Retirada *</Label>
              <TextArea
                value={formData.reason}
                onChange={e => handleInputChange('reason', e.target.value)}
                rows={3}
                placeholder='Ex: Visita ao imóvel'
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Observações</Label>
              <TextArea
                value={formData.notes}
                onChange={e => {
                  if (e.target.value.length <= 300) {
                    handleInputChange('notes', e.target.value);
                  }
                }}
                rows={3}
                placeholder='Observações adicionais (máx. 300 caracteres)'
                maxLength={300}
              />
            </FormGroup>

            <ModalActions>
              <ModalButton $variant='secondary' type='button' onClick={onClose}>
                Cancelar
              </ModalButton>
              <ModalButton $variant='primary' type='submit'>
                Retirar Chave
              </ModalButton>
            </ModalActions>
          </FormContainer>
        </ModalBody>
      </ModalBox>
    </ModalOverlay>
  );
};

interface ReturnKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ReturnKeyData) => void;
  keyControl: KeyControl | null;
}

const ReturnKeyModal: React.FC<ReturnKeyModalProps> = ({
  open,
  onClose,
  onSubmit,
  keyControl,
}) => {
  const [formData, setFormData] = useState({
    returnNotes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ returnNotes: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!keyControl) return null;

  return (
    <ModalOverlay $isOpen={open} onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <ModalHead>Devolver Chave: {keyControl.key?.name}</ModalHead>
        <ModalBody>
          <KeyInfo>
            <InfoItem>
              <strong>Retirada por:</strong> {keyControl.user?.name}
            </InfoItem>
            <InfoItem>
              <strong>Data de retirada:</strong>{' '}
              {format(new Date(keyControl.checkoutDate), 'dd/MM/yyyy HH:mm', {
                locale: ptBR,
              })}
            </InfoItem>
            <InfoItem>
              <strong>Motivo:</strong> {keyControl.reason}
            </InfoItem>
          </KeyInfo>

          <FormContainer onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Observações de Devolução</Label>
              <TextArea
                value={formData.returnNotes}
                onChange={e => {
                  if (e.target.value.length <= 300) {
                    handleInputChange('returnNotes', e.target.value);
                  }
                }}
                rows={3}
                placeholder='Observações sobre a devolução (máx. 300 caracteres)'
                maxLength={300}
              />
            </FormGroup>

            <ModalActions>
              <ModalButton $variant='secondary' type='button' onClick={onClose}>
                Cancelar
              </ModalButton>
              <ModalButton $variant='primary' type='submit'>
                Devolver Chave
              </ModalButton>
            </ModalActions>
          </FormContainer>
        </ModalBody>
      </ModalBox>
    </ModalOverlay>
  );
};

// Styled Components for KeyInfo
const KeyInfo = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
`;

const InfoItem = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: ${props => props.theme.colors.text};
    font-weight: 600;
  }
`;

// Modal de Confirmação Moderno
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: ${p => (p.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(8px);
  animation: ${p => (p.$isOpen ? 'fadeIn' : 'fadeOut')} 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const ModalBox = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 24px;
  width: 100%;
  max-width: 480px;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
  }
`;

const ModalIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 32px auto 24px;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 2px solid #fecaca;
  border-radius: 50%;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  svg {
    width: 40px;
    height: 40px;
    color: #ef4444;
  }
`;

const ModalHead = styled.div`
  text-align: center;
  padding: 0 32px 16px;
  color: #1f2937;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1.2;
`;

const ModalBody = styled.div`
  padding: 0 32px 32px;
  color: #6b7280;
  line-height: 1.6;
  text-align: center;
  font-size: 1rem;
`;

const WarningText = styled.div`
  margin-top: 16px;
  padding: 12px 16px;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 12px;
  color: #92400e;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  padding: 0 32px 32px;
`;

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
  onConfirm,
  onCancel,
}) => (
  <ModalOverlay $isOpen={open} onClick={onCancel}>
    <ModalBox onClick={e => e.stopPropagation()}>
      <ModalIcon>
        <svg fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
          />
        </svg>
      </ModalIcon>

      <ModalHead>{title}</ModalHead>
      <ModalBody>{message}</ModalBody>

      <WarningText>
        <svg fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        Esta ação não pode ser desfeita
      </WarningText>

      <ModalActions>
        <ModalButton $variant='secondary' onClick={onCancel}>
          <svg
            width='16'
            height='16'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
          {cancelLabel}
        </ModalButton>
        <ModalButton $variant={variant} onClick={onConfirm}>
          <svg
            width='16'
            height='16'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            />
          </svg>
          {confirmLabel}
        </ModalButton>
      </ModalActions>
    </ModalBox>
  </ModalOverlay>
);

export default KeysPage;
