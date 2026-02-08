import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdFilterList, MdVisibility } from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { usePropertyOffers } from '../hooks/usePropertyOffers';
import { OffersFiltersDrawer } from '../components/modals/OffersFiltersDrawer';
import { PropertyOffersShimmer } from '../components/shimmer/PropertyOffersShimmer';
import { toast } from 'react-toastify';
import type {
  PropertyOffer,
  OfferStatus,
  OfferType,
} from '../types/propertyOffer';
import type { OfferFilters } from '../services/propertyOffersApi';
import {
  PageContainer,
  PageContent,
  PageHeader,
  HeaderLeft,
  PageTitle,
  PageSubtitle,
  BackButton,
  SearchContainer,
  SearchInput,
  SearchIcon,
  FiltersButton,
  OffersGrid,
  OfferCard,
  CardHeader,
  CardTitle,
  CardBody,
  CardRow,
  CardLabel,
  CardValue,
  CardHighlight,
  CardFooter,
  CardDate,
  ViewButton,
  StatusBadge,
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
  LoadingState,
} from '../styles/pages/PropertyOffersPageStyles';
import { MdArrowBack } from 'react-icons/md';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusLabel = (status: OfferStatus): string => {
  const labels: Record<OfferStatus, string> = {
    pending: 'Pendente',
    accepted: 'Aceita',
    rejected: 'Rejeitada',
    withdrawn: 'Retirada',
    expired: 'Expirada',
  };
  return labels[status] || status;
};

const PropertyOffersPage: React.FC = () => {
  const navigate = useNavigate();
  const { offers, loading, error, fetchAllOffers } = usePropertyOffers();

  const [filters, setFilters] = useState<OfferFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  // Carregar ofertas ao montar e quando filtros mudarem
  useEffect(() => {
    // Limpar filtros vazios ou inválidos
    const cleanFilters: OfferFilters = {};

    // Valida e adiciona apenas filtros válidos
    if (filters.propertyId) {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(filters.propertyId.trim())) {
        cleanFilters.propertyId = filters.propertyId.trim();
      } else {
        console.warn(
          '⚠️ propertyId inválido, ignorando filtro:',
          filters.propertyId
        );
      }
    }

    if (filters.status && filters.status !== 'all' && filters.status.trim()) {
      cleanFilters.status = filters.status;
    }

    if (filters.type && filters.type !== 'all' && filters.type.trim()) {
      cleanFilters.type = filters.type;
    }

    // Só passa filtros se houver algum válido, senão passa undefined
    const filtersToUse =
      Object.keys(cleanFilters).length > 0 ? cleanFilters : undefined;
    fetchAllOffers(filtersToUse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Filtrar ofertas por termo de busca
  const filteredOffers = offers.filter(offer => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      offer.property?.title?.toLowerCase().includes(search) ||
      offer.publicUser?.email?.toLowerCase().includes(search) ||
      offer.publicUser?.phone?.toLowerCase().includes(search) ||
      offer.message?.toLowerCase().includes(search)
    );
  });

  const handleViewOffer = (offer: PropertyOffer) => {
    navigate(`/properties/offers/${offer.id}`);
  };

  const handleApplyFilters = (newFilters: OfferFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    // Força recarregar sem filtros
    fetchAllOffers({});
  };

  const hasActiveFilters = Object.keys(filters).some(
    key => filters[key as keyof OfferFilters] !== undefined
  );

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <HeaderLeft>
              <PageTitle>Ofertas de Propriedades</PageTitle>
              <PageSubtitle>
                Gerencie e responda ofertas recebidas para suas propriedades
              </PageSubtitle>
            </HeaderLeft>
            <BackButton onClick={() => navigate('/properties')}>
              <MdArrowBack size={20} />
              Voltar
            </BackButton>
          </PageHeader>

          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type='text'
              placeholder='Buscar por propriedade, email ou telefone...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px',
              flexWrap: 'wrap',
            }}
          >
            <FiltersButton
              $hasActiveFilters={hasActiveFilters}
              onClick={() => setShowFiltersDrawer(true)}
            >
              <MdFilterList size={18} />
              Filtros
            </FiltersButton>
          </div>

          {loading && <PropertyOffersShimmer />}

          {error && (
            <EmptyState>
              <EmptyStateTitle>Erro ao carregar ofertas</EmptyStateTitle>
              <EmptyStateDescription>{error}</EmptyStateDescription>
            </EmptyState>
          )}

          {!loading && !error && filteredOffers.length === 0 && (
            <EmptyState>
              <EmptyStateTitle>Nenhuma oferta encontrada</EmptyStateTitle>
              <EmptyStateDescription>
                {searchTerm || filters.status || filters.type
                  ? 'Tente ajustar os filtros de busca'
                  : 'Ainda não há ofertas recebidas para suas propriedades'}
              </EmptyStateDescription>
            </EmptyState>
          )}

          {!loading && !error && filteredOffers.length > 0 && (
            <OffersGrid>
              {filteredOffers.map(offer => (
                <OfferCard
                  key={offer.id}
                  $status={offer.status}
                  onClick={() => handleViewOffer(offer)}
                >
                  <CardHeader>
                    <CardTitle>{offer.property?.title || 'N/A'}</CardTitle>
                    <StatusBadge $status={offer.status}>
                      {getStatusLabel(offer.status)}
                    </StatusBadge>
                  </CardHeader>

                  <CardBody>
                    <CardRow>
                      <CardLabel>Tipo</CardLabel>
                      <CardValue>
                        {offer.type === 'sale' ? '💰 Venda' : '🏠 Aluguel'}
                      </CardValue>
                    </CardRow>

                    <CardRow>
                      <CardLabel>Valor Oferecido</CardLabel>
                      <CardHighlight>
                        {formatPrice(offer.offeredValue)}
                      </CardHighlight>
                    </CardRow>

                    {offer.property && (
                      <>
                        {offer.type === 'sale' && offer.property.salePrice && (
                          <CardRow>
                            <CardLabel>Valor Original</CardLabel>
                            <CardValue>
                              {formatPrice(offer.property.salePrice)}
                            </CardValue>
                          </CardRow>
                        )}
                        {offer.type === 'rental' &&
                          offer.property.rentPrice && (
                            <CardRow>
                              <CardLabel>Valor Original</CardLabel>
                              <CardValue>
                                {formatPrice(offer.property.rentPrice)}
                              </CardValue>
                            </CardRow>
                          )}
                      </>
                    )}

                    {offer.publicUser && (
                      <>
                        <CardRow>
                          <CardLabel>Email</CardLabel>
                          <CardValue
                            style={{
                              fontSize: '0.8rem',
                              wordBreak: 'break-word',
                            }}
                          >
                            {offer.publicUser.email}
                          </CardValue>
                        </CardRow>
                        <CardRow>
                          <CardLabel>Telefone</CardLabel>
                          <CardValue>{offer.publicUser.phone}</CardValue>
                        </CardRow>
                      </>
                    )}

                    {offer.message && (
                      <div
                        style={{
                          marginTop: '8px',
                          padding: '12px',
                          background: 'var(--color-background)',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        <CardLabel
                          style={{ marginBottom: '4px', display: 'block' }}
                        >
                          Mensagem:
                        </CardLabel>
                        <div
                          style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-text)',
                            lineHeight: '1.5',
                            maxHeight: '60px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {offer.message}
                        </div>
                      </div>
                    )}
                  </CardBody>

                  <CardFooter>
                    <CardDate>{formatDate(offer.createdAt)}</CardDate>
                    <ViewButton
                      onClick={e => {
                        e.stopPropagation();
                        handleViewOffer(offer);
                      }}
                    >
                      <MdVisibility size={16} />
                      Ver Detalhes
                    </ViewButton>
                  </CardFooter>
                </OfferCard>
              ))}
            </OffersGrid>
          )}

          <OffersFiltersDrawer
            isOpen={showFiltersDrawer}
            onClose={() => setShowFiltersDrawer(false)}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            currentFilters={filters}
          />
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default PropertyOffersPage;
