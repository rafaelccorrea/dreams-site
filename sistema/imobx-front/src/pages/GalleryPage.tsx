import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { galleryApi } from '../services/galleryApi';
import {
  MdPhotoLibrary,
  MdGridOn,
  MdBarChart,
  MdSearch,
  MdFilterList,
  MdClear,
  MdArrowBack,
  MdPhotoCamera,
} from 'react-icons/md';
import { useCompanyContext } from '../contexts';
import { FilterDrawer } from '../components/common/FilterDrawer';
import { GalleryShimmer } from '../components/shimmer';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { Layout } from '../components/layout/Layout';
import { ImageGalleryModal } from '../components/modals/ImageGalleryModal';
import { translateStatus, translateType } from '../utils/galleryTranslations';
import { formatPrice } from '../utils/propertyUtils';
import { useStatesCities } from '../hooks/useStatesCities';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
} from '../styles/pages/PropertiesPageStyles';
import * as S from '../styles/pages/GalleryPageStyles';

type TabKey = 'properties' | 'images' | 'stats';

const GalleryPage: React.FC = () => {
  const nav = useNavigate();
  const { selectedCompany } = useCompanyContext();
  const [tab, setTab] = useState<TabKey>('properties');
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [onlyMyData, setOnlyMyData] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Hook para estados e cidades
  const statesCitiesHook = useStatesCities();
  const {
    states = [],
    cities = [],
    selectedState = null,
    selectedCity = null,
    loadingStates = false,
    loadingCities = false,
    handleSetSelectedState = () => {},
    handleSetSelectedCity = () => {},
  } = statesCitiesHook || {};

  // Filtros locais para o drawer
  const [localFilters, setLocalFilters] = useState({
    city: '',
    type: '',
    status: '',
    onlyMyData: false,
    stateId: '',
    cityId: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  // Infinite scroll - Propriedades
  const {
    items: propertiesItems,
    loadMoreRef: propsLoadMoreRef,
    loading: propsLoading,
    setQuery: setPropsQuery,
    reset: resetProps,
    stats: propsStats,
  } = useInfiniteScroll<
    any,
    { city?: string; type?: string; status?: string; onlyMyData?: boolean }
  >({
    pageSize: 50,
    collectionKey: 'properties',
    initialQuery: {
      city: undefined,
      type: undefined,
      status: undefined,
      onlyMyData: false,
    },
    fetchPage: async q => {
      return await galleryApi.getGalleryProperties({ ...q });
    },
  });

  // Infinite scroll - Imagens
  const {
    items: imagesItems,
    loadMoreRef: imagesLoadMoreRef,
    loading: imagesLoading,
    setQuery: setImagesQuery,
    reset: resetImages,
    stats: imagesStats,
  } = useInfiniteScroll<
    any,
    { city?: string; type?: string; status?: string; onlyMyData?: boolean }
  >({
    pageSize: 50,
    collectionKey: 'images',
    initialQuery: {
      city: undefined,
      type: undefined,
      status: undefined,
      onlyMyData: false,
    },
    fetchPage: async q => {
      return await galleryApi.getGalleryImages({ ...q, limit: 50 });
    },
  });

  const load = async (isInitial = false) => {
    setLoading(true);
    if (isInitial) setInitialLoading(true);
    setError(null);
    try {
      if (tab === 'stats') {
        const res = await galleryApi.getGalleryStats();
        setData(res);
      }
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar galeria');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    load(false); /* eslint-disable-next-line */
  }, [tab]);

  // Recarregar quando a empresa selecionada mudar (padrão global do app)
  useEffect(() => {
    setPage(1);
    resetProps();
    resetImages();
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany?.id]);

  const resetAndLoad = () => {
    setPage(1);
    resetProps();
    resetImages();
    load();
  };

  const handleOpenGallery = (property: any, imageIndex = 0) => {
    setSelectedProperty(property);
    setSelectedImageIndex(imageIndex);
    setModalOpen(true);
  };

  const handleCloseGallery = () => {
    setModalOpen(false);
    setSelectedProperty(null);
    setSelectedImageIndex(0);
  };

  const properties = tab === 'properties' ? propertiesItems : [];
  const images = tab === 'images' ? imagesItems : [];
  const pagination = data?.pagination;

  const hasActiveFilters = city || type || status || onlyMyData;
  const totalItems =
    tab === 'properties'
      ? pagination?.totalItems
      : tab === 'images'
        ? pagination?.totalItems
        : 0;
  const filteredCount = totalItems;

  // Inicializar filtros locais quando o drawer abrir
  useEffect(() => {
    if (filtersOpen) {
      setLocalFilters({
        city,
        type,
        status,
        onlyMyData,
        stateId: selectedState?.id || '',
        cityId: selectedCity?.id || '',
      });
    }
  }, [
    filtersOpen,
    city,
    type,
    status,
    onlyMyData,
    selectedState,
    selectedCity,
  ]);

  // Sincronizar cidade quando cidades são carregadas após aplicar filtros
  useEffect(() => {
    if (
      localFilters.cityId &&
      cities.length > 0 &&
      !loadingCities &&
      selectedState
    ) {
      const city = cities.find(c => c.id === localFilters.cityId);
      if (city && selectedCity?.id !== city.id) {
        handleSetSelectedCity(city);
      }
    }
  }, [
    cities,
    localFilters.cityId,
    loadingCities,
    selectedState,
    selectedCity,
    handleSetSelectedCity,
  ]);

  const clearFilters = () => {
    const cleared = {
      city: '',
      type: '',
      status: '',
      onlyMyData: false,
      stateId: '',
      cityId: '',
    };
    setLocalFilters(cleared);
    setCity(cleared.city);
    setType(cleared.type);
    setStatus(cleared.status);
    setOnlyMyData(cleared.onlyMyData);

    // Limpar estados selecionados
    handleSetSelectedState(null);
    handleSetSelectedCity(null);

    setPage(1);
    setFiltersOpen(false);
    // Recarregar dados
    setPropsQuery({
      city: undefined,
      type: undefined,
      status: undefined,
      onlyMyData: false,
    });
    setImagesQuery({
      city: undefined,
      type: undefined,
      status: undefined,
      onlyMyData: false,
    });
  };

  const applyFilters = () => {
    setCity(localFilters.city);
    setType(localFilters.type);
    setStatus(localFilters.status);
    setOnlyMyData(localFilters.onlyMyData);

    // Sincronizar estados selecionados com os filtros locais
    if (localFilters.stateId) {
      const state = states.find(s => s.id === localFilters.stateId);
      if (state) {
        handleSetSelectedState(state);
        // A cidade será sincronizada automaticamente quando as cidades carregarem (via useEffect no hook)
        if (!localFilters.cityId) {
          handleSetSelectedCity(null);
        }
      }
    } else {
      handleSetSelectedState(null);
      handleSetSelectedCity(null);
    }

    setPage(1);
    setFiltersOpen(false);
    // Aplicar aos queries do infinite scroll
    setPropsQuery({
      city: localFilters.city || undefined,
      type: localFilters.type || undefined,
      status: localFilters.status || undefined,
      onlyMyData: localFilters.onlyMyData,
    });
    setImagesQuery({
      city: localFilters.city || undefined,
      type: localFilters.type || undefined,
      status: localFilters.status || undefined,
      onlyMyData: localFilters.onlyMyData,
    });
  };

  const footer = (
    <>
      {hasActiveFilters && (
        <S.ClearButton onClick={clearFilters}>
          <MdClear size={16} />
          Limpar Filtros
        </S.ClearButton>
      )}
      <S.ApplyButton onClick={applyFilters}>
        <MdFilterList size={16} />
        Aplicar Filtros
      </S.ApplyButton>
    </>
  );

  if (initialLoading) {
    return (
      <Layout>
        <GalleryShimmer />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Galeria de Imagens</PageTitle>
              <PageSubtitle>Gerencie as imagens das propriedades</PageSubtitle>
            </PageTitleContainer>
            <S.HeaderActions>
              <S.FilterButton onClick={() => setFiltersOpen(true)}>
                <MdFilterList size={20} />
                Filtros
                {hasActiveFilters && (
                  <S.FilterBadge>
                    {[city, type, status].filter(Boolean).length}
                  </S.FilterBadge>
                )}
              </S.FilterButton>
              <S.BackButton onClick={() => nav(-1)}>
                <MdArrowBack size={20} />
                Voltar
              </S.BackButton>
            </S.HeaderActions>
          </PageHeader>

          <S.Tabs>
            <S.Tab
              $active={tab === 'properties'}
              onClick={() => setTab('properties')}
            >
              <MdPhotoLibrary /> Propriedades
            </S.Tab>
            <S.Tab $active={tab === 'images'} onClick={() => setTab('images')}>
              <MdGridOn /> Imagens
            </S.Tab>
            <S.Tab $active={tab === 'stats'} onClick={() => setTab('stats')}>
              <MdBarChart /> Estatísticas
            </S.Tab>
          </S.Tabs>

          {loading && !initialLoading && (
            <S.LoadingOverlay>
              <S.LoadingSpinner />
              <span>Carregando...</span>
            </S.LoadingOverlay>
          )}

          {error && <div style={{ color: 'var(--color-error)' }}>{error}</div>}

          {!error && tab === 'properties' && (
            <>
              {properties.length === 0 && !propsLoading ? (
                <S.EmptyState>
                  <S.EmptyStateCard>
                    <S.EmptyStateIcon>
                      <MdPhotoLibrary />
                    </S.EmptyStateIcon>
                    <S.EmptyStateTitle>
                      {hasActiveFilters
                        ? 'Nenhuma propriedade encontrada'
                        : 'Nenhuma propriedade cadastrada'}
                    </S.EmptyStateTitle>
                    <S.EmptyStateDescription>
                      {hasActiveFilters
                        ? 'Tente ajustar os filtros para encontrar propriedades'
                        : 'Comece cadastrando propriedades para visualizar suas imagens na galeria'}
                    </S.EmptyStateDescription>
                  </S.EmptyStateCard>
                </S.EmptyState>
              ) : (
                <>
                  <S.Grid>
                    {properties.map((p: any) => {
                      const main =
                        p.images?.find((i: any) => i.isMain) || p.images?.[0];
                      const hasImages = p.images && p.images.length > 0;
                      return (
                        <S.Card
                          key={p.id}
                          onClick={() =>
                            hasImages
                              ? handleOpenGallery(p, 0)
                              : nav(`/properties/${p.id}?fromGallery=true`)
                          }
                          style={{ cursor: 'pointer' }}
                          title={
                            hasImages
                              ? 'Clique para ver todas as imagens'
                              : 'Ver detalhes da propriedade'
                          }
                        >
                          <S.Cover>
                            {main && (
                              <img src={main.url} alt={main.alt || p.title} />
                            )}
                            {p.imageCount > 1 && (
                              <div className='count'>{p.imageCount} fotos</div>
                            )}
                            {!hasImages && (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '100%',
                                  gap: '8px',
                                  color: 'var(--color-text-secondary)',
                                  position: 'absolute',
                                  inset: 0,
                                }}
                              >
                                <MdPhotoCamera
                                  size={48}
                                  style={{ opacity: 0.5 }}
                                />
                                <span
                                  style={{ fontSize: '14px', fontWeight: 500 }}
                                >
                                  Sem imagens
                                </span>
                              </div>
                            )}
                          </S.Cover>
                          <S.CardBody>
                            <strong>{p.title}</strong>
                            <S.PricesContainer>
                              {p.salePrice && Number(p.salePrice) > 0 && (
                                <S.PriceTag $type='sale'>
                                  <S.PriceLabel>Venda</S.PriceLabel>
                                  <S.PriceValue>
                                    {formatPrice(Number(p.salePrice))}
                                  </S.PriceValue>
                                </S.PriceTag>
                              )}
                              {p.rentPrice && Number(p.rentPrice) > 0 && (
                                <S.PriceTag $type='rent'>
                                  <S.PriceLabel>Aluguel</S.PriceLabel>
                                  <S.PriceValue>
                                    {formatPrice(Number(p.rentPrice))}/mês
                                  </S.PriceValue>
                                </S.PriceTag>
                              )}
                            </S.PricesContainer>
                            <span
                              style={{ color: 'var(--color-text-secondary)' }}
                            >
                              {p.city}
                              {p.neighborhood ? ` - ${p.neighborhood}` : ''}
                            </span>
                            <div
                              style={{
                                display: 'flex',
                                gap: 8,
                                flexWrap: 'wrap',
                                fontSize: 12,
                                color: 'var(--color-text-secondary)',
                              }}
                            >
                              {p.bedrooms ? (
                                <span>{p.bedrooms} quartos</span>
                              ) : null}
                              {p.bathrooms ? (
                                <span>{p.bathrooms} banheiros</span>
                              ) : null}
                              {p.totalArea ? (
                                <span>{p.totalArea}m²</span>
                              ) : null}
                            </div>
                          </S.CardBody>
                        </S.Card>
                      );
                    })}
                  </S.Grid>
                  <div ref={propsLoadMoreRef} />
                  {propsLoading && <GalleryShimmer />}
                </>
              )}
            </>
          )}

          {!error && tab === 'images' && (
            <>
              {images.length === 0 && !imagesLoading ? (
                <S.EmptyState>
                  <S.EmptyStateCard>
                    <S.EmptyStateIcon>
                      <MdGridOn />
                    </S.EmptyStateIcon>
                    <S.EmptyStateTitle>
                      {hasActiveFilters
                        ? 'Nenhuma imagem encontrada'
                        : 'Nenhuma imagem na galeria'}
                    </S.EmptyStateTitle>
                    <S.EmptyStateDescription>
                      {hasActiveFilters
                        ? 'Tente ajustar os filtros para encontrar imagens'
                        : 'Adicione imagens às suas propriedades para visualizá-las aqui na galeria'}
                    </S.EmptyStateDescription>
                  </S.EmptyStateCard>
                </S.EmptyState>
              ) : (
                <>
                  <S.ImagesGrid>
                    {images.map((img: any) => {
                      return (
                        <S.ImageOnlyCard
                          key={img.id}
                          onClick={() => {
                            // Criar um objeto de propriedade com a imagem atual
                            const propertyWithImage = {
                              ...img.property,
                              images: [
                                {
                                  id: img.id,
                                  url: img.url,
                                  alt: img.alt,
                                  isMain: img.isMain,
                                },
                              ],
                            };
                            handleOpenGallery(propertyWithImage, 0);
                          }}
                          title='Clique para visualizar'
                        >
                          <img
                            src={img.url}
                            alt={img.alt || img.property.title}
                          />
                        </S.ImageOnlyCard>
                      );
                    })}
                  </S.ImagesGrid>
                  <div ref={imagesLoadMoreRef} />
                  {imagesLoading && <GalleryShimmer />}
                </>
              )}
            </>
          )}

          {!error && tab === 'stats' && (
            <S.StatsContainer>
              <S.StatsGrid>
                <S.StatCard>
                  <S.StatLabel>Total de Imagens</S.StatLabel>
                  <S.StatValue>{data?.totalImages ?? '-'}</S.StatValue>
                </S.StatCard>
                <S.StatCard>
                  <S.StatLabel>Total de Propriedades</S.StatLabel>
                  <S.StatValue>{data?.totalProperties ?? '-'}</S.StatValue>
                </S.StatCard>
                <S.StatCard>
                  <S.StatLabel>Com Imagens</S.StatLabel>
                  <S.StatValue>{data?.propertiesWithImages ?? '-'}</S.StatValue>
                </S.StatCard>
                <S.StatCard>
                  <S.StatLabel>Sem Imagens</S.StatLabel>
                  <S.StatValue>
                    {data?.propertiesWithoutImages ?? '-'}
                  </S.StatValue>
                </S.StatCard>
              </S.StatsGrid>

              <S.DetailedStatsSection>
                {data?.byStatus && Object.keys(data.byStatus).length > 0 && (
                  <S.DetailedStatCard>
                    <S.DetailedStatTitle>Por Status</S.DetailedStatTitle>
                    <S.DetailedStatList>
                      {Object.entries(data.byStatus).map(
                        ([status, stats]: [string, any]) => (
                          <S.DetailedStatItem key={status}>
                            <S.DetailedStatItemLabel>
                              {translateStatus(status)}
                            </S.DetailedStatItemLabel>
                            <S.DetailedStatItemValue>
                              {stats.images} imagens · {stats.properties}{' '}
                              propriedades
                            </S.DetailedStatItemValue>
                          </S.DetailedStatItem>
                        )
                      )}
                    </S.DetailedStatList>
                  </S.DetailedStatCard>
                )}

                {data?.byType && Object.keys(data.byType).length > 0 && (
                  <S.DetailedStatCard>
                    <S.DetailedStatTitle>Por Tipo</S.DetailedStatTitle>
                    <S.DetailedStatList>
                      {Object.entries(data.byType).map(
                        ([type, stats]: [string, any]) => (
                          <S.DetailedStatItem key={type}>
                            <S.DetailedStatItemLabel>
                              {translateType(type)}
                            </S.DetailedStatItemLabel>
                            <S.DetailedStatItemValue>
                              {stats.images} imagens · {stats.properties}{' '}
                              propriedades
                            </S.DetailedStatItemValue>
                          </S.DetailedStatItem>
                        )
                      )}
                    </S.DetailedStatList>
                  </S.DetailedStatCard>
                )}

                {data?.byCity && Object.keys(data.byCity).length > 0 && (
                  <S.DetailedStatCard>
                    <S.DetailedStatTitle>Por Cidade</S.DetailedStatTitle>
                    <S.DetailedStatList>
                      {Object.entries(data.byCity)
                        .slice(0, 10)
                        .map(([city, stats]: [string, any]) => (
                          <S.DetailedStatItem key={city}>
                            <S.DetailedStatItemLabel>
                              {city}
                            </S.DetailedStatItemLabel>
                            <S.DetailedStatItemValue>
                              {stats.images} imagens · {stats.properties}{' '}
                              propriedades
                            </S.DetailedStatItemValue>
                          </S.DetailedStatItem>
                        ))}
                    </S.DetailedStatList>
                  </S.DetailedStatCard>
                )}
              </S.DetailedStatsSection>
            </S.StatsContainer>
          )}

          <FilterDrawer
            isOpen={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            title='Filtros da Galeria'
            footer={footer}
          >
            <S.FiltersContainer>
              <S.SectionTitle>
                <MdSearch size={20} />
                Filtros de Busca
              </S.SectionTitle>

              <S.FilterGroup>
                <S.FilterLabel>Estado</S.FilterLabel>
                <S.FilterSelect
                  value={localFilters.stateId}
                  onChange={e => {
                    const stateId = e.target.value;
                    const state = states.find(s => s.id === stateId);
                    handleSetSelectedState(state || null);
                    setLocalFilters(prev => ({
                      ...prev,
                      stateId: stateId,
                      cityId: '',
                      city: '', // Limpar cidade quando mudar estado
                    }));
                  }}
                  disabled={loadingStates}
                >
                  <option value=''>
                    {loadingStates
                      ? 'Carregando estados...'
                      : 'Selecione o estado'}
                  </option>
                  {states.map(state => (
                    <option key={state.id} value={state.id}>
                      {state.nome} - {state.sigla}
                    </option>
                  ))}
                </S.FilterSelect>
              </S.FilterGroup>

              <S.FilterGroup>
                <S.FilterLabel>Cidade</S.FilterLabel>
                <S.FilterSelect
                  value={localFilters.cityId}
                  onChange={e => {
                    const cityId = e.target.value;
                    const cityObj = cities.find(c => c.id === cityId);
                    handleSetSelectedCity(cityObj || null);
                    const cityName = cityObj?.nome || '';
                    setLocalFilters(prev => ({
                      ...prev,
                      cityId: cityId,
                      city: cityName, // Enviar nome da cidade para API
                    }));
                  }}
                  disabled={!localFilters.stateId || loadingCities}
                >
                  <option value=''>
                    {!localFilters.stateId
                      ? 'Selecione primeiro um estado'
                      : loadingCities
                        ? 'Carregando cidades...'
                        : 'Selecione a cidade'}
                  </option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.nome}
                    </option>
                  ))}
                </S.FilterSelect>
              </S.FilterGroup>

              <S.FilterGroup>
                <S.FilterLabel>Tipo de Imóvel</S.FilterLabel>
                <S.FilterInput
                  type='text'
                  placeholder='Casa, Apartamento, Terreno...'
                  value={localFilters.type}
                  onChange={e =>
                    setLocalFilters(prev => ({ ...prev, type: e.target.value }))
                  }
                />
              </S.FilterGroup>

              <S.FilterGroup>
                <S.FilterLabel>Status</S.FilterLabel>
                <S.FilterSelect
                  value={localFilters.status}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  <option value=''>Todos os status</option>
                  <option value='available'>Disponível</option>
                  <option value='sold'>Vendida</option>
                  <option value='rented'>Alugada</option>
                  <option value='reserved'>Reservada</option>
                  <option value='inactive'>Inativa</option>
                </S.FilterSelect>
              </S.FilterGroup>

              <S.FilterGroup>
                <S.FilterLabel>Escopo de Dados</S.FilterLabel>
                <S.FilterSelect
                  value={localFilters.onlyMyData ? 'true' : 'false'}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      onlyMyData: e.target.value === 'true',
                    }))
                  }
                >
                  <option value='false'>Todos os dados</option>
                  <option value='true'>Apenas meus dados</option>
                </S.FilterSelect>
              </S.FilterGroup>

              {hasActiveFilters && (
                <S.FilterStats>
                  <span>Total: {totalItems} itens</span>
                  <span>•</span>
                  <span>Filtrados: {filteredCount} itens</span>
                </S.FilterStats>
              )}
            </S.FiltersContainer>
          </FilterDrawer>

          {selectedProperty && (
            <ImageGalleryModal
              isOpen={modalOpen}
              onClose={handleCloseGallery}
              images={selectedProperty.images || []}
              propertyTitle={selectedProperty.title}
              propertyId={selectedProperty.id}
              initialIndex={selectedImageIndex}
            />
          )}
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default GalleryPage;
