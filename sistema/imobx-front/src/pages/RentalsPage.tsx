import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdAdd,
  MdHome,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdBed,
  MdBathtub,
  MdDirectionsCar,
  MdLocationOn,
  MdImage,
  MdSearch,
  MdFilterList,
  MdPayment,
  MdAttachMoney,
  MdClear,
  MdSquareFoot,
  MdPhone,
  MdEmail,
} from 'react-icons/md';
import { Layout } from '@/components/layout/Layout';
import { RentalsShimmer } from '@/components/shimmer/RentalsShimmer';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';
import { FilterDrawer } from '@/components/common/FilterDrawer';
import DataScopeFilter from '@/components/common/DataScopeFilter';
import { useRentals } from '@/hooks/useRentals';
import type { Rental, RentalFilter } from '@/types/rental.types';
import { RentalStatusLabels, RentalStatusColors } from '@/types/rental.types';
import { useCompany } from '@/hooks/useCompany';
import { PermissionButton } from '@/components/common/PermissionButton';
import styled from 'styled-components';
import { maskCPF, maskCNPJ, maskPhone } from '@/utils/masks';
import { ViewModeToggle } from '@/components/common/ViewModeToggle';
import type { ViewMode } from '@/types/viewMode';
import {
  RentalsListContainer,
  ListHeader,
  RentalRow,
  RentalInfo,
  RentalProperty,
  RentalTenant,
  RentalDates,
  DateLabel,
  DateValue,
  RentalPrice,
  RentalStatus as ListRentalStatus,
  RowActions,
  ActionButton as ListActionButton,
  MobileHidden,
  TabletHidden,
  MobileOnly,
  MobileRentalDetails,
  MobileDetailRow,
  MobileDetailLabel,
  MobileDetailValue,
} from './styles/RentalsListView.styles';

export const RentalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const { rentals, loading, fetchRentals, deleteRental } = useRentals();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('rentals_view_mode');
    return (saved as ViewMode) || 'cards';
  });
  const [filters, setFilters] = useState<RentalFilter>({
    page: 1,
    limit: 12,
  });
  const [listData, setListData] = useState<{
    total: number;
    totalPages: number;
  }>({
    total: 0,
    totalPages: 1,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    rental: Rental | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    rental: null,
    isDeleting: false,
  });

  useEffect(() => {
    loadRentals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany, filters]);

  // Aplicar busca com debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
      } else {
        setFilters(prev => {
          const newFilters = { ...prev };
          delete newFilters.search;
          return newFilters;
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadRentals = async () => {
    if (!selectedCompany) return;

    const data = await fetchRentals(filters);
    if (data) {
      setListData({
        total: data.total,
        totalPages: data.totalPages,
      });
    }
  };

  // Filtros locais para o drawer
  const [localFilters, setLocalFilters] = useState<RentalFilter>({
    page: 1,
    limit: 12,
  });

  // Inicializar filtros locais quando o drawer abrir
  useEffect(() => {
    if (showFiltersModal) {
      setLocalFilters(filters);
    }
  }, [showFiltersModal]);

  const handleApplyFilters = () => {
    setFilters({ ...localFilters, page: 1 });
    setShowFiltersModal(false);
  };

  const handleClearFilters = () => {
    const cleared = { page: 1, limit: 12 };
    setLocalFilters(cleared);
    setSearchTerm('');
    setFilters(cleared);
    setShowFiltersModal(false);
  };

  const activeFiltersCount = Object.keys(filters).filter(
    key =>
      !['page', 'limit'].includes(key) && filters[key as keyof RentalFilter]
  ).length;

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('rentals_view_mode', mode);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderRentalRow = (rental: Rental) => (
    <RentalRow key={rental.id}>
      <RentalInfo>
        <RentalProperty
          onClick={() => navigate(`/rentals/${rental.id}`)}
          title='Clique para ver detalhes'
        >
          {rental.property?.title || 'Propriedade não especificada'}
        </RentalProperty>
        <RentalTenant>
          {rental.tenantName || 'Inquilino não especificado'}
        </RentalTenant>
      </RentalInfo>

      <TabletHidden>
        <RentalDates>
          <div>
            <DateLabel>Início:</DateLabel>{' '}
            <DateValue>{formatDate(rental.startDate)}</DateValue>
          </div>
          <div>
            <DateLabel>Fim:</DateLabel>{' '}
            <DateValue>{formatDate(rental.endDate)}</DateValue>
          </div>
        </RentalDates>
      </TabletHidden>

      <MobileHidden>
        <ListRentalStatus $status={rental.status}>
          {RentalStatusLabels[rental.status]}
        </ListRentalStatus>
      </MobileHidden>

      <RentalPrice>{formatPrice(rental.monthlyValue)}</RentalPrice>

      <MobileHidden>
        <div style={{ fontSize: '13px', color: 'var(--theme-text-secondary)' }}>
          Dia {rental.dueDay}
        </div>
      </MobileHidden>

      <RowActions>
        <ListActionButton
          $variant='primary'
          onClick={() => navigate(`/rentals/${rental.id}`)}
          title='Ver detalhes'
        >
          <MdVisibility />
        </ListActionButton>
        <PermissionButton
          permission='rental:manage_payments'
          onClick={() => navigate(`/rentals/${rental.id}/payments`)}
          variant='primary'
          size='small'
          title='Gerenciar pagamentos'
        >
          <MdPayment />
        </PermissionButton>
        <PermissionButton
          permission='rental:update'
          onClick={() => navigate(`/rentals/edit/${rental.id}`)}
          variant='secondary'
          size='small'
        >
          <MdEdit />
        </PermissionButton>
        <PermissionButton
          permission='rental:delete'
          onClick={() => handleDeleteClick(rental)}
          variant='danger'
          size='small'
        >
          <MdDelete />
        </PermissionButton>
      </RowActions>

      {/* Versão mobile com mais detalhes */}
      <MobileOnly style={{ gridColumn: '1 / -1' }}>
        <MobileRentalDetails>
          <MobileDetailRow>
            <MobileDetailLabel>Status:</MobileDetailLabel>
            <ListRentalStatus $status={rental.status}>
              {RentalStatusLabels[rental.status]}
            </ListRentalStatus>
          </MobileDetailRow>
          <MobileDetailRow>
            <MobileDetailLabel>Início:</MobileDetailLabel>
            <MobileDetailValue>
              {formatDate(rental.startDate)}
            </MobileDetailValue>
          </MobileDetailRow>
          <MobileDetailRow>
            <MobileDetailLabel>Fim:</MobileDetailLabel>
            <MobileDetailValue>{formatDate(rental.endDate)}</MobileDetailValue>
          </MobileDetailRow>
          <MobileDetailRow>
            <MobileDetailLabel>Vencimento:</MobileDetailLabel>
            <MobileDetailValue>Dia {rental.dueDay}</MobileDetailValue>
          </MobileDetailRow>
        </MobileRentalDetails>
      </MobileOnly>
    </RentalRow>
  );

  const handleDeleteClick = (rental: Rental) => {
    setDeleteModal({
      isOpen: true,
      rental,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.rental) return;

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      await deleteRental(deleteModal.rental.id);
      setDeleteModal({ isOpen: false, rental: null, isDeleting: false });
      loadRentals();
    } catch {
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const getStatusLabel = (status: string) => {
    return (
      RentalStatusLabels[status as keyof typeof RentalStatusLabels] || status
    );
  };

  const getStatusColor = (status: string) => {
    return (
      RentalStatusColors[status as keyof typeof RentalStatusColors] || '#6b7280'
    );
  };

  const getPropertyTypeLabel = (type?: string) => {
    const labels: Record<string, string> = {
      house: 'Casa',
      apartment: 'Apartamento',
      commercial: 'Comercial',
      land: 'Terreno',
      rural: 'Rural',
    };
    return type ? labels[type] || type : 'Imóvel';
  };

  const formatDocument = (document: string) => {
    const cleaned = document.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return maskCPF(document);
    } else {
      return maskCNPJ(document);
    }
  };

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitleContainer>
            <PageTitle>Aluguéis</PageTitle>
            <PageSubtitle>
              Gerencie contratos de aluguel e pagamentos
            </PageSubtitle>
            <PageCount>{listData.total} aluguéis</PageCount>
          </PageTitleContainer>
          <PermissionButton
            permission='rental:create'
            onClick={() => navigate('/rentals/new')}
            variant='primary'
            size='medium'
          >
            <MdAdd />
            Novo Aluguel
          </PermissionButton>
        </PageHeader>

        {/* Barra de Busca e Filtros */}
        <ControlsContainer>
          <SearchContainer>
            <MdSearch />
            <SearchInput
              type='text'
              placeholder='Buscar por inquilino, documento, endereço da propriedade...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          <FilterButton onClick={() => setShowFiltersModal(true)}>
            <MdFilterList />
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <FilterBadge>{activeFiltersCount}</FilterBadge>
            )}
          </FilterButton>

          <ViewModeToggle
            currentMode={viewMode}
            onModeChange={handleViewModeChange}
          />
        </ControlsContainer>

        {loading ? (
          <RentalsShimmer />
        ) : rentals.length === 0 ? (
          <EmptyState>
            <EmptyStateTitle>Nenhum aluguel encontrado</EmptyStateTitle>
            <EmptyStateDescription>
              Comece criando um novo aluguel para gerenciar suas propriedades
            </EmptyStateDescription>
            <PermissionButton
              permission='rental:create'
              onClick={() => navigate('/rentals/new')}
              variant='primary'
              size='medium'
            >
              <MdAdd />
              Criar Primeiro Aluguel
            </PermissionButton>
          </EmptyState>
        ) : viewMode === 'list' ? (
          <>
            <RentalsListContainer>
              <ListHeader>
                <div>Aluguel</div>
                <TabletHidden>
                  <div>Período</div>
                </TabletHidden>
                <MobileHidden>
                  <div>Status</div>
                </MobileHidden>
                <div>Valor</div>
                <MobileHidden>
                  <div>Vencimento</div>
                </MobileHidden>
                <div>Ações</div>
              </ListHeader>
              {rentals.map(renderRentalRow)}
            </RentalsListContainer>

            {listData.totalPages > 1 && (
              <Pagination>
                <PaginationButton
                  onClick={() =>
                    setFilters({ ...filters, page: (filters.page || 1) - 1 })
                  }
                  disabled={filters.page === 1}
                >
                  Anterior
                </PaginationButton>
                <PageInfo>
                  Página {filters.page} de {listData.totalPages}
                </PageInfo>
                <PaginationButton
                  onClick={() =>
                    setFilters({ ...filters, page: (filters.page || 1) + 1 })
                  }
                  disabled={filters.page === listData.totalPages}
                >
                  Próxima
                </PaginationButton>
              </Pagination>
            )}
          </>
        ) : (
          <>
            <RentalsGrid>
              {rentals.map(rental => (
                <RentalCard key={rental.id}>
                  {rental.property?.mainImage ? (
                    <PropertyImage
                      src={rental.property.mainImage.fileUrl}
                      alt={
                        rental.property.mainImage.altText ||
                        rental.property.title
                      }
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="%23999"%3ESem imagem%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <PropertyImagePlaceholder>
                      <MdImage />
                      <span>Sem imagem</span>
                    </PropertyImagePlaceholder>
                  )}

                  <CardContent>
                    <CardHeader>
                      <TenantInfo>
                        <TenantName>{rental.tenantName}</TenantName>
                        <TenantDocument>
                          {formatDocument(rental.tenantDocument)}
                        </TenantDocument>
                        {(rental.tenantPhone || rental.tenantEmail) && (
                          <TenantContactInfo>
                            {rental.tenantPhone && (
                              <span>
                                <MdPhone size={14} />
                                {maskPhone(rental.tenantPhone)}
                              </span>
                            )}
                            {rental.tenantEmail && (
                              <span>
                                <MdEmail size={14} />
                                {rental.tenantEmail}
                              </span>
                            )}
                          </TenantContactInfo>
                        )}
                      </TenantInfo>
                      <StatusBadge $color={getStatusColor(rental.status)}>
                        {getStatusLabel(rental.status)}
                      </StatusBadge>
                    </CardHeader>

                    <PropertySection>
                      <PropertyHeader>
                        <MdHome />
                        <PropertyTitle>
                          {rental.property?.title || 'Propriedade'}
                        </PropertyTitle>
                      </PropertyHeader>

                      {rental.property?.code && (
                        <PropertyCode>
                          Código: {rental.property.code}
                        </PropertyCode>
                      )}

                      <PropertyType>
                        {getPropertyTypeLabel(rental.property?.type)}
                      </PropertyType>

                      {rental.property?.city && rental.property?.state && (
                        <PropertyLocation>
                          <MdLocationOn />
                          {rental.property.neighborhood &&
                            `${rental.property.neighborhood}, `}
                          {rental.property.city} - {rental.property.state}
                        </PropertyLocation>
                      )}

                      {(rental.property?.bedrooms ||
                        rental.property?.bathrooms ||
                        rental.property?.parkingSpaces ||
                        rental.property?.totalArea) && (
                        <PropertyFeatures>
                          {rental.property.totalArea !== undefined &&
                            rental.property.totalArea > 0 && (
                              <Feature>
                                <MdSquareFoot />
                                {rental.property.totalArea} m²
                              </Feature>
                            )}
                          {rental.property.bedrooms !== undefined &&
                            rental.property.bedrooms > 0 && (
                              <Feature>
                                <MdBed />
                                {rental.property.bedrooms}{' '}
                                {rental.property.bedrooms === 1
                                  ? 'quarto'
                                  : 'quartos'}
                              </Feature>
                            )}
                          {rental.property.bathrooms !== undefined &&
                            rental.property.bathrooms > 0 && (
                              <Feature>
                                <MdBathtub />
                                {rental.property.bathrooms}{' '}
                                {rental.property.bathrooms === 1
                                  ? 'banheiro'
                                  : 'banheiros'}
                              </Feature>
                            )}
                          {rental.property.parkingSpaces !== undefined &&
                            rental.property.parkingSpaces > 0 && (
                              <Feature>
                                <MdDirectionsCar />
                                {rental.property.parkingSpaces}{' '}
                                {rental.property.parkingSpaces === 1
                                  ? 'vaga'
                                  : 'vagas'}
                              </Feature>
                            )}
                        </PropertyFeatures>
                      )}
                    </PropertySection>

                    <CardInfo>
                      <InfoItem style={{ gridColumn: 'span 2' }}>
                        <InfoLabel>
                          <MdAttachMoney /> Valor Mensal
                        </InfoLabel>
                        <InfoValue
                          style={{
                            fontSize: '1.25rem',
                            color: '#10b981',
                            fontWeight: '700',
                          }}
                        >
                          {formatPrice(rental.monthlyValue)}
                        </InfoValue>
                      </InfoItem>
                      {rental.depositValue && rental.depositValue > 0 && (
                        <InfoItem>
                          <InfoLabel>Depósito:</InfoLabel>
                          <InfoValue>
                            {formatPrice(rental.depositValue)}
                          </InfoValue>
                        </InfoItem>
                      )}
                      <InfoItem>
                        <InfoLabel>Vencimento:</InfoLabel>
                        <InfoValue>Dia {rental.dueDay}</InfoValue>
                      </InfoItem>
                      <InfoItem style={{ gridColumn: 'span 2' }}>
                        <InfoLabel>Período do Contrato:</InfoLabel>
                        <InfoValue>
                          {formatDate(rental.startDate)} até{' '}
                          {formatDate(rental.endDate)}
                        </InfoValue>
                      </InfoItem>
                      {rental.autoGeneratePayments && (
                        <InfoItem style={{ gridColumn: 'span 2' }}>
                          <InfoValue
                            style={{ fontSize: '0.75rem', color: '#10b981' }}
                          >
                            ✓ Geração automática de pagamentos
                          </InfoValue>
                        </InfoItem>
                      )}
                    </CardInfo>

                    <CardActions>
                      <ActionButton
                        onClick={() => navigate(`/rentals/${rental.id}`)}
                      >
                        <MdVisibility />
                        Ver Detalhes
                      </ActionButton>
                      <PermissionButton
                        permission='rental:manage_payments'
                        onClick={() =>
                          navigate(`/rentals/${rental.id}/payments`)
                        }
                        variant='primary'
                        size='small'
                      >
                        <MdPayment />
                        Pagamentos
                      </PermissionButton>
                      <PermissionButton
                        permission='rental:update'
                        onClick={() => navigate(`/rentals/${rental.id}/edit`)}
                        variant='secondary'
                        size='small'
                      >
                        <MdEdit />
                        Editar
                      </PermissionButton>
                      <PermissionButton
                        permission='rental:delete'
                        onClick={() => handleDeleteClick(rental)}
                        variant='danger'
                        size='small'
                      >
                        <MdDelete />
                        Excluir
                      </PermissionButton>
                    </CardActions>
                  </CardContent>
                </RentalCard>
              ))}
            </RentalsGrid>

            {listData.totalPages > 1 && (
              <Pagination>
                <PaginationButton
                  onClick={() =>
                    setFilters({ ...filters, page: (filters.page || 1) - 1 })
                  }
                  disabled={(filters.page || 1) <= 1}
                >
                  Anterior
                </PaginationButton>
                <PageInfo>
                  Página {filters.page} de {listData.totalPages}
                </PageInfo>
                <PaginationButton
                  onClick={() =>
                    setFilters({ ...filters, page: (filters.page || 1) + 1 })
                  }
                  disabled={(filters.page || 1) >= listData.totalPages}
                >
                  Próxima
                </PaginationButton>
              </Pagination>
            )}
          </>
        )}

        <ConfirmDeleteModal
          isOpen={deleteModal.isOpen}
          onClose={() =>
            setDeleteModal({ isOpen: false, rental: null, isDeleting: false })
          }
          onConfirm={handleConfirmDelete}
          title='Excluir Aluguel'
          message='Tem certeza que deseja excluir este aluguel? Esta ação não poderá ser desfeita e todos os pagamentos associados também serão removidos.'
          itemName={deleteModal.rental?.tenantName}
          isLoading={deleteModal.isDeleting}
        />

        <FilterDrawer
          isOpen={showFiltersModal}
          onClose={() => setShowFiltersModal(false)}
          title='Filtros de Aluguéis'
          footer={
            <>
              {Object.values(localFilters).some(
                value =>
                  value !== undefined &&
                  value !== '' &&
                  value !== false &&
                  value !== 1 &&
                  value !== 12
              ) && (
                <ClearButton onClick={handleClearFilters}>
                  <MdClear size={16} />
                  Limpar Filtros
                </ClearButton>
              )}
              <ApplyButton onClick={handleApplyFilters}>
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

              <SearchContainer>
                <SearchIcon>
                  <MdSearch size={18} />
                </SearchIcon>
                <SearchInput
                  type='text'
                  placeholder='Buscar por inquilino ou propriedade...'
                  value={localFilters.tenantName || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      tenantName: e.target.value,
                    }))
                  }
                />
              </SearchContainer>
            </FilterSection>

            <FilterSection>
              <FilterSectionTitle>
                <MdHome size={20} />
                Filtros por Categoria
              </FilterSectionTitle>

              <FilterGrid>
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
                    {Object.entries(RentalStatusLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </FilterSelect>
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Documento do Inquilino</FilterLabel>
                  <FilterInput
                    type='text'
                    placeholder='CPF ou CNPJ...'
                    value={localFilters.tenantDocument || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        tenantDocument: e.target.value,
                      }))
                    }
                  />
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
                label='Mostrar apenas meus aluguéis'
                description='Quando marcado, mostra apenas aluguéis que você criou, ignorando hierarquia de usuários.'
              />
            </FilterSection>

            {Object.values(localFilters).some(
              value =>
                value !== undefined &&
                value !== '' &&
                value !== false &&
                value !== 1 &&
                value !== 12
            ) && (
              <FilterStats>
                <span>Filtros ativos aplicados</span>
              </FilterStats>
            )}
          </FiltersContainer>
        </FilterDrawer>
      </PageContainer>
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
  background: ${props => props.theme.colors.inputBackground};
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
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.textSecondary};
    font-size: 1.25rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
  }

  @media (max-width: 480px) {
    svg {
      left: 10px;
      font-size: 1.1rem;
    }
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 400;
  transition: all 0.2s;
  height: auto;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  @media (max-width: 768px) {
    padding: 0.625rem 0.875rem 0.625rem 2.5rem;
    font-size: 16px; /* Prevent iOS zoom */
    min-height: 44px;
  }

  @media (max-width: 480px) {
    padding: 0.625rem 0.75rem 0.625rem 2.25rem;
    font-size: 16px;
    border-radius: 0.5rem;
  }
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
  background: ${props => props.theme.colors.danger};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.dangerHover};
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

const PageContainer = styled.div`
  padding: 2rem;
  width: 100%;

  @media (max-width: 1024px) {
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const PageTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PageTitle = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};

  svg {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 1024px) {
    font-size: 1.75rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const PageCount = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  gap: 1rem;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    min-height: 300px;
    padding: 1.5rem 1rem;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    min-height: 250px;
    padding: 1rem 0.75rem;
    gap: 0.5rem;
  }
`;

const EmptyStateTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

const EmptyStateDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const RentalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
`;

const RentalCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s;

  @media (max-width: 768px) {
    border-radius: 0.625rem;
  }

  @media (max-width: 480px) {
    border-radius: 0.5rem;
  }

  &:hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    transform: translateY(-2px);
  }
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: ${props => props.theme.colors.backgroundSecondary};

  @media (max-width: 768px) {
    height: 180px;
  }

  @media (max-width: 480px) {
    height: 160px;
  }
`;

const PropertyImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.backgroundSecondary} 0%,
    ${props => props.theme.colors.background} 100%
  );
  color: ${props => props.theme.colors.textSecondary};

  svg {
    font-size: 3rem;
    opacity: 0.5;
  }

  span {
    font-size: 0.875rem;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    height: 180px;

    svg {
      font-size: 2.5rem;
    }
  }

  @media (max-width: 480px) {
    height: 160px;

    svg {
      font-size: 2rem;
    }

    span {
      font-size: 0.8125rem;
    }
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 0.75rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.625rem;
    padding-bottom: 0.625rem;
  }
`;

const TenantInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TenantName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
  }
`;

const TenantDocument = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-family: 'Courier New', monospace;
`;

const TenantContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;

  span {
    font-size: 0.8125rem;
    color: ${props => props.theme.colors.textSecondary};
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

const StatusBadge = styled.span<{ $color: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const PropertySection = styled.div`
  margin-bottom: 0.75rem;
  padding: 0.875rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 0.5rem;
  border-left: 3px solid ${props => props.theme.colors.primary};
`;

const PropertyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.25rem;
  }
`;

const PropertyTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const PropertyCode = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.background};
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  font-family: 'Courier New', monospace;
`;

const PropertyType = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const PropertyLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;

  svg {
    font-size: 1rem;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const PropertyFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  padding: 0.375rem 0.625rem;
  border-radius: 0.375rem;
  font-weight: 500;

  svg {
    font-size: 1rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const CardInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  padding: 0.875rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 0.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CardActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.colors.primary}10;
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-top: 1rem;
  }
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.hover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.colors.hover};
    border-color: ${props => props.theme.colors.primary};
  }

  svg {
    font-size: 1.125rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 0.625rem 1rem;
    min-height: 44px;
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
    border-radius: 0.5rem;
  }
`;

const FilterBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
`;

export default RentalsPage;
