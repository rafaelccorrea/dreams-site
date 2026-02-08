import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdInventory,
  MdEdit,
  MdDelete,
  MdSync,
  MdVisibility,
  MdTransferWithinAStation,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { Layout } from '../components/layout/Layout';
import { useAssets } from '../hooks/useAssets';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { PermissionButton } from '../components/common/PermissionButton';
import { PermissionWrapper } from '../components/PermissionWrapper';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import type { Asset, AssetQueryParams, AssetCategory } from '../types/asset';
import {
  AssetStatus,
  AssetCategoryOptions,
  AssetStatusOptions,
  formatAssetValue,
  getCategoryLabel,
  getStatusLabel,
} from '../types/asset';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  CreateButton,
  ActionsBar,
  LeftActions,
  RightActions,
  ViewToggle,
  ViewToggleButton,
  SearchContainer,
  SearchInput,
  SearchIcon,
  FilterToggle,
  CounterBadge,
  StatsGrid,
  StatCard,
  StatLabel,
  StatValue,
  StatHelp,
  AssetsGrid,
  AssetsList,
  AssetRow,
  RowCell,
  RowActions,
  AssetCard,
  AssetCardHeader,
  AssetCardTitle,
  AssetCardActions,
  ActionButton,
  AssetCardContent,
  AssetCardInfo,
  AssetCardBadges,
  AssetCardBadge,
  AssetCardDescription,
  AssetCardDetails,
  AssetCardDetail,
  AssetCardDetailLabel,
  AssetCardDetailValue,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateMessage,
  EmptyStateAction,
  PaginationWrapper,
  PaginationButton,
} from '../styles/pages/AssetsPageStyles';
import { TransferAssetModal } from '../components/assets/TransferAssetModal';
import { AssetFiltersDrawer } from '../components/assets/AssetFiltersDrawer';
import { AssetDetailsModal } from '../components/assets/AssetDetailsModal';
import { AssetsShimmer } from '../components/shimmer';
import { assetApi } from '../services/assetApi';

const AssetsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    assets,
    isLoading,
    error,
    total,
    stats,
    getAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    transferAsset,
    getAssetStats,
    refreshAssets,
  } = useAssets();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // onlyMyData control moved to filters drawer

  const [filters, setFilters] = useState<AssetQueryParams>({
    page: 1,
    limit: 50,
  });

  const [viewMode, setViewMode] = useState<'list' | 'cards'>(() => {
    const saved = localStorage.getItem('assets_view_mode');
    return (saved as 'list' | 'cards') || 'list';
  });
  const itemsPerPage = 50;

  // Hook de scroll infinito
  const {
    items: displayedAssets,
    page,
    limit,
    hasMore,
    loading: isLoadingInfinite,
    error: loadError,
    setQuery,
    reset,
    loadMore,
    loadInitial,
    loadMoreRef,
    stats: pageStats,
  } = useInfiniteScroll<Asset, AssetQueryParams>({
    pageSize: itemsPerPage,
    collectionKey: 'assets',
    fetchPage: async q => {
      const res = await assetApi.getAssets(q);
      return res as any;
    },
    initialQuery: {
      ...filters,
      search: undefined,
    },
  });

  // Carregar estatísticas iniciais
  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recarregar quando filtros/busca mudarem (substitui completamente a query)
  useEffect(() => {
    setCurrentPage(1);
    setQuery(() => ({
      ...filters,
      search: searchTerm || undefined,
      page: 1,
      limit: itemsPerPage,
    }));
  }, [filters, searchTerm, itemsPerPage, setQuery]);

  // Persistir modo de visualização
  useEffect(() => {
    localStorage.setItem('assets_view_mode', viewMode);
  }, [viewMode]);

  // Removido: carregamento manual substituído pelo hook

  const loadStats = async () => {
    try {
      await getAssetStats();
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  // Aplicar busca com debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchTerm || undefined,
        page: 1,
      }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Removido: observer e handleLoadMore substituídos pelo hook

  const handleApplyFilters = (newFilters: AssetQueryParams) => {
    const cleaned: AssetQueryParams = {
      page: 1,
      limit: itemsPerPage,
      status: newFilters.status || undefined,
      category: newFilters.category || undefined,
      assignedToUserId: newFilters.assignedToUserId || undefined,
      propertyId: newFilters.propertyId || undefined,
      search: newFilters.search || undefined,
      onlyMyData: newFilters.onlyMyData || undefined,
    };
    setFilters(cleaned);
    setQuery(() => cleaned);
    setCurrentPage(1);
    setShowFiltersDrawer(false);
  };

  const handleClearFilters = () => {
    const base = { page: 1, limit: itemsPerPage } as AssetQueryParams;
    setFilters(base);
    setSearchTerm('');
    setQuery(() => base);
    reset();
    setCurrentPage(1);
    setShowFiltersDrawer(false);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.status) count++;
    if (filters.category) count++;
    if (filters.assignedToUserId) count++;
    if (filters.propertyId) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  const handleDeleteAsset = () => {
    if (!selectedAsset) return;
    setShowDeleteModal(true);
  };

  const confirmDeleteAsset = async () => {
    if (!selectedAsset) return;

    setIsDeleting(true);
    try {
      await deleteAsset(selectedAsset.id);
      toast.success('Patrimônio removido com sucesso!');
      setShowDeleteModal(false);
      setSelectedAsset(null);
      await refreshAssets();
      await loadStats();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao remover patrimônio');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTransferAsset = async (id: string, data: any) => {
    try {
      await transferAsset(id, data);
      toast.success('Patrimônio transferido com sucesso!');
      setShowTransferModal(false);
      setSelectedAsset(null);
      await refreshAssets();
      await loadStats();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao transferir patrimônio');
    }
  };

  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowDetailsModal(true);
  };

  const handleEdit = (asset: Asset) => {
    navigate(`/assets/${asset.id}/edit`);
  };

  const handleTransfer = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowTransferModal(true);
  };

  const totalPages = useMemo(() => {
    if (pageStats?.total && limit) return Math.ceil(pageStats.total / limit);
    if (total && itemsPerPage) return Math.ceil(total / itemsPerPage);
    return 1;
  }, [pageStats?.total, limit, total, itemsPerPage]);

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Gestão Patrimonial</PageTitle>
              <PageSubtitle>
                Gerencie todo o patrimônio da empresa (equipamentos, móveis,
                veículos, etc.)
              </PageSubtitle>
            </PageTitleContainer>
            <PermissionButton
              permission='asset:create'
              onClick={() => navigate('/assets/create')}
            >
              <MdAdd size={20} />
              Novo Patrimônio
            </PermissionButton>
          </PageHeader>

          {/* Estatísticas */}
          {stats && (
            <StatsGrid>
              <StatCard>
                <StatLabel>Total de Itens</StatLabel>
                <StatValue>{stats.total}</StatValue>
                <StatHelp>Todos os patrimônios</StatHelp>
              </StatCard>
              <StatCard>
                <StatLabel>Valor Total Investido</StatLabel>
                <StatValue>{formatAssetValue(stats.totalValue)}</StatValue>
                <StatHelp>Total em patrimônio</StatHelp>
              </StatCard>
              <StatCard>
                <StatLabel>Em Uso</StatLabel>
                <StatValue>{stats.byStatus.in_use || 0}</StatValue>
                <StatHelp>Itens atualmente em uso</StatHelp>
              </StatCard>
              <StatCard>
                <StatLabel>Disponíveis</StatLabel>
                <StatValue>{stats.byStatus.available || 0}</StatValue>
                <StatHelp>Itens disponíveis</StatHelp>
              </StatCard>
            </StatsGrid>
          )}

          {/* Barra de ações */}
          <ActionsBar>
            <LeftActions>
              <SearchContainer>
                <SearchIcon>
                  <MdSearch size={20} />
                </SearchIcon>
                <SearchInput
                  type='text'
                  placeholder='Buscar patrimônios...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </SearchContainer>
              <FilterToggle
                $active={showFiltersDrawer || activeFiltersCount > 0}
                onClick={() => setShowFiltersDrawer(true)}
              >
                <MdFilterList size={20} />
                Filtros
                {activeFiltersCount > 0 && (
                  <CounterBadge>{activeFiltersCount}</CounterBadge>
                )}
              </FilterToggle>
              {/* Escopo de dados controlado no Drawer de filtros */}
            </LeftActions>
            <RightActions>
              <ViewToggle>
                <ViewToggleButton
                  $active={viewMode === 'list'}
                  onClick={() => setViewMode('list')}
                >
                  Lista
                </ViewToggleButton>
                <ViewToggleButton
                  $active={viewMode === 'cards'}
                  onClick={() => setViewMode('cards')}
                >
                  Cards
                </ViewToggleButton>
              </ViewToggle>
              <ActionButton
                onClick={() => {
                  refreshAssets();
                  loadStats();
                }}
                title='Atualizar'
              >
                <MdSync size={20} />
              </ActionButton>
            </RightActions>
          </ActionsBar>

          {/* Loading */}
          {isLoadingInfinite && displayedAssets.length === 0 && (
            <AssetsShimmer />
          )}

          {/* Lista vazia */}
          {!isLoadingInfinite && displayedAssets.length === 0 && (
            <EmptyState>
              <EmptyStateIcon>
                <MdInventory size={64} />
              </EmptyStateIcon>
              <EmptyStateTitle>Nenhum patrimônio encontrado</EmptyStateTitle>
              <EmptyStateMessage>
                {searchTerm || activeFiltersCount > 0
                  ? 'Tente ajustar os filtros ou termos de busca.'
                  : 'Comece adicionando seu primeiro patrimônio à empresa.'}
              </EmptyStateMessage>
              <PermissionButton
                permission='asset:create'
                onClick={() => navigate('/assets/create')}
              >
                <MdAdd size={20} />
                Criar Primeiro Patrimônio
              </PermissionButton>
            </EmptyState>
          )}

          {/* Lista de patrimônios */}
          {!isLoading &&
            !isLoadingInfinite &&
            displayedAssets.length > 0 &&
            viewMode === 'list' && (
              <>
                <AssetsList>
                  {displayedAssets.map(asset => (
                    <AssetRow key={asset.id}>
                      <RowCell>{asset.name}</RowCell>
                      <RowCell>{getCategoryLabel(asset.category)}</RowCell>
                      <RowCell>{getStatusLabel(asset.status)}</RowCell>
                      <RowCell>{formatAssetValue(asset.value)}</RowCell>
                      <RowActions>
                        <PermissionButton
                          permission='asset:view'
                          onClick={() => handleViewDetails(asset)}
                          variant='secondary'
                        >
                          <MdVisibility size={18} />
                        </PermissionButton>
                        <PermissionButton
                          permission='asset:update'
                          onClick={() => handleEdit(asset)}
                          variant='secondary'
                        >
                          <MdEdit size={18} />
                        </PermissionButton>
                        <PermissionButton
                          permission='asset:delete'
                          onClick={() => {
                            setSelectedAsset(asset);
                            handleDeleteAsset();
                          }}
                          variant='danger'
                        >
                          <MdDelete size={18} />
                        </PermissionButton>
                      </RowActions>
                    </AssetRow>
                  ))}
                </AssetsList>

                <div ref={loadMoreRef} />
                {isLoadingInfinite && <AssetsShimmer count={4} />}
              </>
            )}

          {/* Grid de patrimônios */}
          {!isLoading &&
            !isLoadingInfinite &&
            displayedAssets.length > 0 &&
            viewMode === 'cards' && (
              <>
                <AssetsGrid>
                  {displayedAssets.map(asset => (
                    <AssetCard key={asset.id}>
                      <AssetCardHeader>
                        <AssetCardTitle>{asset.name}</AssetCardTitle>
                        <AssetCardActions>
                          <PermissionButton
                            permission='asset:view'
                            onClick={() => handleViewDetails(asset)}
                            variant='secondary'
                          >
                            <MdVisibility size={18} />
                          </PermissionButton>
                          <PermissionButton
                            permission='asset:update'
                            onClick={() => handleEdit(asset)}
                            variant='secondary'
                          >
                            <MdEdit size={18} />
                          </PermissionButton>
                          <PermissionButton
                            permission='asset:delete'
                            onClick={() => {
                              setSelectedAsset(asset);
                              handleDeleteAsset();
                            }}
                            variant='danger'
                          >
                            <MdDelete size={18} />
                          </PermissionButton>
                        </AssetCardActions>
                      </AssetCardHeader>
                      <AssetCardContent>
                        <AssetCardBadges>
                          <AssetCardBadge $variant='info'>
                            {getCategoryLabel(asset.category)}
                          </AssetCardBadge>
                          <AssetCardBadge
                            $variant={
                              asset.status === AssetStatus.AVAILABLE
                                ? 'success'
                                : asset.status === AssetStatus.IN_USE
                                  ? 'info'
                                  : asset.status === AssetStatus.MAINTENANCE
                                    ? 'warning'
                                    : 'error'
                            }
                          >
                            {getStatusLabel(asset.status)}
                          </AssetCardBadge>
                        </AssetCardBadges>
                        {asset.description && (
                          <AssetCardDescription>
                            {asset.description}
                          </AssetCardDescription>
                        )}
                        <AssetCardDetails>
                          <AssetCardDetail>
                            <AssetCardDetailLabel>Valor</AssetCardDetailLabel>
                            <AssetCardDetailValue>
                              {formatAssetValue(asset.value)}
                            </AssetCardDetailValue>
                          </AssetCardDetail>
                          <AssetCardDetail>
                            <AssetCardDetailLabel>Status</AssetCardDetailLabel>
                            <AssetCardDetailValue>
                              {getStatusLabel(asset.status)}
                            </AssetCardDetailValue>
                          </AssetCardDetail>
                          {asset.assignedToUser && (
                            <AssetCardDetail>
                              <AssetCardDetailLabel>
                                Responsável
                              </AssetCardDetailLabel>
                              <AssetCardDetailValue>
                                {asset.assignedToUser.name}
                              </AssetCardDetailValue>
                            </AssetCardDetail>
                          )}
                          {asset.property && (
                            <AssetCardDetail>
                              <AssetCardDetailLabel>
                                Propriedade
                              </AssetCardDetailLabel>
                              <AssetCardDetailValue>
                                {asset.property.title}
                              </AssetCardDetailValue>
                            </AssetCardDetail>
                          )}
                        </AssetCardDetails>
                        <PermissionWrapper permission='asset:transfer'>
                          <ActionButton
                            onClick={() => handleTransfer(asset)}
                            style={{
                              marginTop: '12px',
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            title='Transferir patrimônio'
                          >
                            <MdTransferWithinAStation size={18} />
                            Transferir
                          </ActionButton>
                        </PermissionWrapper>
                      </AssetCardContent>
                    </AssetCard>
                  ))}
                </AssetsGrid>

                <div ref={loadMoreRef} />
                {isLoadingInfinite && <AssetsShimmer count={4} />}
              </>
            )}

          {/* Modals */}
          {showTransferModal && selectedAsset && (
            <TransferAssetModal
              isOpen={showTransferModal}
              onClose={() => {
                setShowTransferModal(false);
                setSelectedAsset(null);
              }}
              onTransfer={data => handleTransferAsset(selectedAsset.id, data)}
              asset={selectedAsset}
            />
          )}

          {showDetailsModal && selectedAsset && (
            <AssetDetailsModal
              isOpen={showDetailsModal}
              onClose={() => {
                setShowDetailsModal(false);
                setSelectedAsset(null);
              }}
              asset={selectedAsset}
            />
          )}

          {showDeleteModal && selectedAsset && (
            <ConfirmDeleteModal
              isOpen={showDeleteModal}
              onClose={() => {
                setShowDeleteModal(false);
                setSelectedAsset(null);
              }}
              onConfirm={confirmDeleteAsset}
              title='Remover Patrimônio'
              message={`Tem certeza que deseja remover o patrimônio "${selectedAsset.name}"? Esta ação não pode ser desfeita.`}
              isLoading={isDeleting}
              wide={true}
              compact={true}
            />
          )}

          {/* Filters Drawer */}
          <AssetFiltersDrawer
            isOpen={showFiltersDrawer}
            onClose={() => setShowFiltersDrawer(false)}
            filters={filters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default AssetsPage;
