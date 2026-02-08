import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdAdd,
  MdFilterList,
  MdAutoAwesome,
  MdSearch,
  MdComment,
  MdFileUpload,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { PropertyFiltersDrawer } from '../components/properties/PropertyFiltersDrawer';
import { IntelligentSearchModal } from '../components/properties/IntelligentSearchModal';
import { PropertyPublicToggle } from '../components/properties/PropertyPublicToggle';
import { PropertyActiveToggle } from '../components/properties/PropertyActiveToggle';
import { useProperties } from '../hooks/useProperties';
import { useIntelligentPropertySearch } from '../hooks/useIntelligentPropertySearch';
import { PredictiveAnalysisModal } from '../components/ai/PredictiveAnalysisModal';
import { usePredictiveSales } from '../hooks/usePredictiveSales';
import { useModuleAccess } from '../hooks/useModuleAccess';
import type { PropertyFilters, Property } from '../types/property';
import { PropertyStatus as PropertyStatusEnum } from '../types/property';
import { ViewModeToggle } from '../components/common/ViewModeToggle';
import type { ViewMode } from '../types/viewMode';
import { PermissionButton } from '../components/common/PermissionButton';
import { Tooltip } from '../components/ui/Tooltip';
import { DraggableContainer } from '../components/common/DraggableContainer';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { PropertyOffersModal } from '../components/modals/PropertyOffersModal';
import { toast } from 'react-toastify';
import { propertyApi } from '../services/propertyApi';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  HeaderActions,
  OptimizationButton,
  ActionsBar,
  LeftActions,
  SearchContainer,
  SearchInput,
  SearchIcon,
  FilterToggle,
  IntelligentSearchButton,
  PropertiesGrid,
  PropertyCard,
  PropertyContent,
  PropertyHeader,
  PropertyTitle,
  PropertyCode,
  PropertyPrice,
  PropertyLocation,
  PropertyDetails,
  PropertyDetail,
  PropertyDetailValue,
  PropertyDetailLabel,
  PropertyActions,
  EmptyState,
  EmptyStateCard,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateAction,
  EmptyStateSecondaryAction,
  PaginationWrapper,
  PaginationButton,
} from '../styles/pages/PropertiesPageStyles';
import { OptimizedImage } from '../components/common/OptimizedImage';
import {
  MdLocationOn,
  MdBed,
  MdBathroom,
  MdSquareFoot,
  MdVisibility,
  MdPerson,
  MdEdit,
  MdDelete,
  MdApartment,
  MdVilla,
  MdBusiness,
  MdStore,
  MdWarehouse,
  MdLandscape,
  MdHomeWork,
  MdDirectionsCar,
  MdCheckCircle,
  MdHome,
  MdPublic,
  MdLock,
} from 'react-icons/md';
import {
  PropertiesListContainer,
  ListHeader,
  PropertyRow,
  PropertyInfo,
  PropertyImagesStack,
  PropertyImage,
  ImageCount,
  PropertyDetails as ListPropertyDetails,
  PropertyTitle as ListPropertyTitle,
  PropertyCode as ListPropertyCode,
  PropertyLocation as ListPropertyLocation,
  PropertyPrice as ListPropertyPrice,
  PropertyType,
  PropertySpecs,
  PropertySpec,
  RowActions,
  MobileHidden,
  TabletHidden,
  MobileOnly,
  MobilePropertyDetails,
  MobileDetailRow,
  MobileDetailLabel,
  MobileDetailValue,
  ActionsMenuButton,
  ActionsMenu,
  ActionsMenuItem,
} from './styles/PropertiesListView.styles';

const PropertiesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    properties,
    error,
    deleteProperty,
    getProperties,
    isLoading,
    updateProperty,
  } = useProperties();

  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('properties_view_mode');
    return (saved as ViewMode) || 'cards';
  });
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 1024;
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null
  );
  const [openActionsMenuId, setOpenActionsMenuId] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateKeyCard, setShowCreateKeyCard] = useState(false);
  const [selectedPropertyForKey, setSelectedPropertyForKey] = useState<
    string | null
  >(null);
  const [showIntelligentSearch, setShowIntelligentSearch] = useState(false);
  const [showMarkAsSoldModal, setShowMarkAsSoldModal] = useState(false);
  const [showMarkAsRentedModal, setShowMarkAsRentedModal] = useState(false);
  const [propertyToMarkSold, setPropertyToMarkSold] = useState<Property | null>(
    null
  );
  const [propertyToMarkRented, setPropertyToMarkRented] =
    useState<Property | null>(null);
  const [isMarkingSold, setIsMarkingSold] = useState(false);
  const [isMarkingRented, setIsMarkingRented] = useState(false);
  const [showPredictiveModal, setShowPredictiveModal] = useState(false);
  const [predictiveAnalysis, setPredictiveAnalysis] = useState<any>(null);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [selectedPropertyForOffers, setSelectedPropertyForOffers] =
    useState<Property | null>(null);

  // Hook para verificar permissões
  const permissionsContext = usePermissionsContextOptional();
  const hasCondominiumPermission =
    permissionsContext?.hasPermission('condominium:create') || false;

  // AI Assistant (depois de todos os useState)
  const { isModuleAvailableForCompany } = useModuleAccess();
  const hasAIAssistantModule = isModuleAvailableForCompany('ai_assistant');
  const {
    predict,
    loading: predictiveLoading,
    error: predictiveError,
  } = usePredictiveSales();

  // Hook para busca inteligente
  const {
    search: intelligentSearch,
    results: intelligentResults,
    stats: intelligentStats,
    isLoading: intelligentSearchLoading,
    clearResults: clearIntelligentSearch,
  } = useIntelligentPropertySearch();

  const itemsPerPage = 12;

  // Listener para mostrar card de criar chave na lista
  useEffect(() => {
    const handleShowCreateKeyCard = (event: CustomEvent) => {
      const { propertyId } = event.detail;
      setSelectedPropertyForKey(propertyId);
      setShowCreateKeyCard(true);
    };

    window.addEventListener(
      'showCreateKeyCard',
      handleShowCreateKeyCard as EventListener
    );

    return () => {
      window.removeEventListener(
        'showCreateKeyCard',
        handleShowCreateKeyCard as EventListener
      );
    };
  }, []);

  // Efeito para exibir notificações quando houver resultados de busca inteligente
  useEffect(() => {
    if (intelligentStats && !intelligentSearchLoading) {
      if (intelligentStats.totalFound === 0) {
        toast.warning('Nenhuma propriedade encontrada para este cliente');
      } else {
        toast.success(
          `Busca concluída! ${intelligentStats.totalFound} propriedade(s) encontrada(s)`
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intelligentStats?.totalFound, intelligentSearchLoading]);

  // Responsividade: em mobile/tablet (<=1024px) forçar modo "cards" e ocultar toggle
  useEffect(() => {
    const handleResize = () => {
      const small = window.innerWidth <= 1024;
      setIsSmallScreen(small);
      if (small && viewMode !== 'cards') {
        setViewMode('cards');
        localStorage.setItem('properties_view_mode', 'cards');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const effectiveViewMode: ViewMode = isSmallScreen ? 'cards' : viewMode;

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('properties_view_mode', mode);
  };

  // Função helper para atualizar apenas o estado local da propriedade sem recarregar tudo
  // O hook usePropertyPublicFlag já faz a atualização na API e atualiza seu próprio estado
  // Aqui fazemos uma atualização otimista apenas do campo isAvailableForSite na lista local
  const handlePropertyPublicToggleSuccess = useCallback(
    (propertyId: string, newValue: boolean) => {
      // Não fazer nada aqui - o componente PropertyPublicToggle já gerencia seu próprio estado
      // e a atualização visual já foi feita pelo hook usePropertyPublicFlag
      // Não chamar updateProperty para evitar refresh desnecessário da página
      // A atualização na API já foi feita pelo hook usePropertyPublicFlag
    },
    []
  );

  // Função auxiliar para verificar se pode publicar
  const canPublishProperty = useCallback(
    (property: Property): { canPublish: boolean; reason?: string } => {
      if (!property.isActive) {
        return { canPublish: false, reason: 'Propriedade deve estar ativa' };
      }
      if (property.status !== PropertyStatusEnum.AVAILABLE) {
        return { canPublish: false, reason: 'Status deve ser "Disponível"' };
      }
      const validImages =
        property.images?.filter(
          img => img && img.url && img.url.trim() !== ''
        ) || [];
      if (validImages.length < 5) {
        return {
          canPublish: false,
          reason: `Necessário ter 5 imagens (atualmente: ${validImages.length})`,
        };
      }
      return { canPublish: true };
    },
    []
  );

  // Função para alternar visibilidade no site
  const handleTogglePublicSite = useCallback(
    async (property: Property) => {
      // Validar se está tentando ativar publicação
      const newValue = !property.isAvailableForSite;
      if (newValue) {
        const validation = canPublishProperty(property);
        if (!validation.canPublish) {
          // Não mostrar toast, apenas retornar (o botão já está desabilitado)
          return;
        }
      }

      try {
        // Atualizar na API e obter a propriedade atualizada
        const updatedProperty = await propertyApi.updateProperty(property.id, {
          isAvailableForSite: newValue,
        });

        // Atualizar estado local apenas com o campo isAvailableForSite
        // Não recarregar toda a lista para evitar refresh da página
        updateProperty(property.id, {
          isAvailableForSite: newValue,
        }).catch(() => {
          // Silenciar erro - a atualização visual já foi feita
        });

        if (newValue) {
          toast.success(
            '✅ Propriedade adicionada ao site Intellisys com sucesso!'
          );
        } else {
          toast.info('🔒 Propriedade removida do site Intellisys.');
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao atualizar propriedade';

        // Verificar se é erro de plano Basic
        if (err.response?.status === 403) {
          const message = errorMessage.toLowerCase();
          if (message.includes('seu plano não permite')) {
            toast.error(
              'Seu plano não permite disponibilizar propriedades no site Intellisys.'
            );
          } else if (message.includes('limite de propriedades públicas')) {
            toast.error('Limite de propriedades no site Intellisys atingido.');
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error(errorMessage);
        }
      }
    },
    [updateProperty, canPublishProperty]
  );

  // Carregamento de propriedades agora é feito automaticamente pelo hook useProperties
  // Não precisamos mais carregar manualmente aqui para evitar loops infinitos

  // Usar resultados da busca inteligente se tiver resultados, caso contrário usar propriedades normais
  const hasIntelligentResults =
    intelligentResults && intelligentResults.length > 0;
  const propertiesToUse = hasIntelligentResults
    ? intelligentResults.map(result => {
        // Converter o array de imagens para o formato esperado
        const property = { ...result.property };
        if (
          property.images &&
          Array.isArray(property.images) &&
          property.images.length > 0
        ) {
          // Encontrar a imagem principal ou usar a primeira
          const mainImg =
            property.images.find((img: any) => img.isMain) ||
            property.images[0];
          if (mainImg) {
            property.mainImage = {
              id: mainImg.id,
              url: mainImg.url,
            };
            property.imageCount = property.images.length;
          }
        }
        return property;
      })
    : properties;

  // Se busca inteligente tiver resultados, não aplicar filtros - mostrar exatamente o que veio da API
  const filteredProperties = hasIntelligentResults
    ? propertiesToUse
    : propertiesToUse.filter(property => {
        const matchesSearch =
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.city.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilters = Object.entries(filters).every(([key, value]) => {
          if (!value) return true;

          switch (key) {
            case 'type':
              return property.type === value;
            case 'status':
              return property.status === value;
            case 'state':
              return property.state === value;
            case 'city':
              return property.city.toLowerCase().includes(value.toLowerCase());
            case 'minPrice':
              return (
                property.price !== undefined && property.price >= Number(value)
              );
            case 'maxPrice':
              return (
                property.price !== undefined && property.price <= Number(value)
              );
            case 'minArea':
              return (
                property.area !== undefined && property.area >= Number(value)
              );
            case 'maxArea':
              return (
                property.area !== undefined && property.area <= Number(value)
              );
            case 'bedrooms':
              return (
                property.bedrooms !== undefined &&
                property.bedrooms >= Number(value)
              );
            case 'bathrooms':
              return (
                property.bathrooms !== undefined &&
                property.bathrooms >= Number(value)
              );
            default:
              return true;
          }
        });

        return matchesSearch && matchesFilters;
      });

  // Paginação
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Contar filtros ativos
  const activeFiltersCount = Object.values(filters).filter(
    value => value !== '' && value !== null && value !== undefined
  ).length;

  const handleDeleteProperty = (property: Property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  const confirmDeleteProperty = async () => {
    if (!propertyToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProperty(propertyToDelete.id);
      toast.success('Propriedade excluída com sucesso!');
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir propriedade:', error);
      toast.error('Erro ao excluir propriedade');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowDetails = (property: Property) => {
    navigate(`/properties/${property.id}`);
  };

  const handleOpenMarkAsSoldModal = (property: Property) => {
    setPropertyToMarkSold(property);
    setShowMarkAsSoldModal(true);
  };

  const confirmMarkAsSold = async () => {
    if (!propertyToMarkSold) return;

    setIsMarkingSold(true);
    try {
      // Se a propriedade estiver no site, remover primeiro
      if (propertyToMarkSold.isAvailableForSite) {
        await propertyApi.updateProperty(propertyToMarkSold.id, {
          isAvailableForSite: false,
        });
      }

      await propertyApi.markAsSold(propertyToMarkSold.id, 'Venda realizada');
      toast.success(
        'Propriedade marcada como vendida e removida do site Intellisys!'
      );
      setShowMarkAsSoldModal(false);
      setPropertyToMarkSold(null);
      // Recarregar propriedades
      await getProperties();
    } catch (error: any) {
      console.error('Erro ao marcar como vendida:', error);
      toast.error(error.message || 'Erro ao marcar propriedade como vendida');
    } finally {
      setIsMarkingSold(false);
    }
  };

  const handleOpenMarkAsRentedModal = (property: Property) => {
    setPropertyToMarkRented(property);
    setShowMarkAsRentedModal(true);
  };

  const confirmMarkAsRented = async () => {
    if (!propertyToMarkRented) return;

    setIsMarkingRented(true);
    try {
      // Se a propriedade estiver no site, remover primeiro
      if (propertyToMarkRented.isAvailableForSite) {
        await propertyApi.updateProperty(propertyToMarkRented.id, {
          isAvailableForSite: false,
        });
      }

      await propertyApi.markAsRented(
        propertyToMarkRented.id,
        'Aluguel realizado'
      );
      toast.success(
        'Propriedade marcada como alugada e removida do site Intellisys!'
      );
      setShowMarkAsRentedModal(false);
      setPropertyToMarkRented(null);
      // Recarregar propriedades
      await getProperties();
    } catch (error: any) {
      console.error('Erro ao marcar como alugada:', error);
      toast.error(error.message || 'Erro ao marcar propriedade como alugada');
    } finally {
      setIsMarkingRented(false);
    }
  };

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset para primeira página
  };

  // Usar dados de monitoramento se disponíveis (temporariamente desabilitado)
  // useEffect(() => {
  //   if (monitoringData) {
  //     console.log('Dados de monitoramento de propriedades recebidos:', monitoringData);
  //     // Aqui você pode atualizar a lista de propriedades com dados em tempo real
  //   }
  // }, [monitoringData]);

  // Broadcast de atualizações quando propriedades são modificadas (temporariamente desabilitado)
  // useEffect(() => {
  //   if (properties.length > 0) {
  //     broadcastUpdate({
  //       count: properties.length,
  //       lastUpdate: new Date().toISOString()
  //     }, 'update');
  //   }
  // }, [properties, broadcastUpdate]);

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return 'Preço não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  // Função para determinar ícone e cor baseado no tipo de propriedade
  const getPropertyTypeIcon = (type: string) => {
    const typeMap: Record<
      string,
      { icon: React.ComponentType<any>; color: string; label: string }
    > = {
      house: { icon: MdHome, color: '#10B981', label: 'Casa' },
      apartment: { icon: MdApartment, color: '#3B82F6', label: 'Apartamento' },
      penthouse: { icon: MdVilla, color: '#8B5CF6', label: 'Cobertura' },
      commercial: { icon: MdBusiness, color: '#F59E0B', label: 'Comercial' },
      store: { icon: MdStore, color: '#EC4899', label: 'Loja' },
      warehouse: { icon: MdWarehouse, color: '#6B7280', label: 'Galpão' },
      land: { icon: MdLandscape, color: '#84CC16', label: 'Terreno' },
      rural: { icon: MdHomeWork, color: '#059669', label: 'Rural' },
    };

    return (
      typeMap[type] || { icon: MdHome, color: '#6B7280', label: 'Residência' }
    );
  };

  // Função inteligente para determinar tipo de transação e preço
  const getPropertyPricing = (property: Property) => {
    const rentPrice = property.rentPrice ?? 0;
    const salePrice = property.salePrice ?? 0;
    const hasRentPrice = rentPrice > 0;
    const hasSalePrice = salePrice > 0;

    // PRIMEIRO: Verificar o status atual da propriedade
    if (property.status === 'rented') {
      // Se está ALUGADA, mostrar preço do aluguel
      if (hasRentPrice) {
        return {
          type: 'rented',
          display: 'Alugado',
          price: rentPrice,
          priceFormatted: `${formatPrice(rentPrice)}/mês`,
          color: '#059669', // verde
          status: property.status,
        };
      } else {
        return {
          type: 'rented',
          display: 'Alugado',
          price: null,
          priceFormatted: 'Preço não informado',
          color: '#059669',
          status: property.status,
        };
      }
    }

    if (property.status === 'sold') {
      // Se está VENDIDA, mostrar preço da venda
      if (hasSalePrice) {
        return {
          type: 'sold',
          display: 'Vendido',
          price: salePrice,
          priceFormatted: formatPrice(salePrice),
          color: '#DC2626', // vermelho
          status: property.status,
        };
      } else {
        return {
          type: 'sold',
          display: 'Vendido',
          price: null,
          priceFormatted: 'Preço não informado',
          color: '#DC2626',
          status: property.status,
        };
      }
    }

    // SEGUNDO: Se não tem status específico, determinar baseado nos preços disponíveis
    if (hasRentPrice && hasSalePrice) {
      // Se tem ambos, priorizar aluguel se for mais relevante
      const rentToSaleRatio = rentPrice / salePrice;

      if (rentToSaleRatio > 0.01) {
        // Aluguel representa mais de 1% do valor de venda
        return {
          type: 'rent',
          display: 'Aluguel',
          price: rentPrice,
          priceFormatted: `${formatPrice(rentPrice)}/mês`,
          color: '#3B82F6', // azul
          status: property.status,
        };
      } else {
        return {
          type: 'sale',
          display: 'Venda',
          price: salePrice,
          priceFormatted: formatPrice(salePrice),
          color: '#8B5CF6', // roxo
          status: property.status,
        };
      }
    }

    // Se tem apenas aluguel
    if (hasRentPrice) {
      return {
        type: 'rent',
        display: 'Aluguel',
        price: rentPrice,
        priceFormatted: `${formatPrice(rentPrice)}/mês`,
        color: '#3B82F6',
        status: property.status,
      };
    }

    // Se tem apenas venda
    if (hasSalePrice) {
      return {
        type: 'sale',
        display: 'Venda',
        price: salePrice,
        priceFormatted: formatPrice(salePrice),
        color: '#8B5CF6',
        status: property.status,
      };
    }

    // Se não tem nenhum preço
    return {
      type: 'available',
      display: 'Disponível',
      price: null,
      priceFormatted: 'Preço não informado',
      color: '#6B7280', // cinza
      status: property.status,
    };
  };

  const renderPropertyRow = (property: Property) => {
    const images = property.images || [];
    const maxImagesToShow = 3;
    const imagesToDisplay = images.slice(0, maxImagesToShow);
    const pricing = getPropertyPricing(property);

    return (
      <PropertyRow key={property.id}>
        <PropertyInfo>
          <PropertyImagesStack>
            {imagesToDisplay.length > 0 ? (
              <>
                {imagesToDisplay.map((image, index) => (
                  <PropertyImage
                    key={image.id || index}
                    $imageUrl={image.url || image.thumbnailUrl}
                    $index={index}
                    $total={imagesToDisplay.length}
                  />
                ))}
                {images.length > 1 && <ImageCount>{images.length}</ImageCount>}
              </>
            ) : (
              <PropertyImage>
                <MdHome />
              </PropertyImage>
            )}
          </PropertyImagesStack>
          <ListPropertyDetails>
            <ListPropertyTitle
              onClick={() => handleShowDetails(property)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              title='Clique para ver detalhes'
            >
              {(() => {
                const typeInfo = getPropertyTypeIcon(property.type);
                const TypeIcon = typeInfo.icon;
                const fullTitle = property.title || 'Propriedade sem título';
                const displayTitle =
                  fullTitle.length > 36
                    ? `${fullTitle.slice(0, 36)}…`
                    : fullTitle;
                return (
                  <>
                    <TypeIcon
                      size={20}
                      style={{ color: typeInfo.color, flexShrink: 0 }}
                    />
                    <span
                      style={{
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {displayTitle}
                    </span>
                    {property.acceptsNegotiation &&
                      (property.pendingOffersCount ?? 0) > 0 && (
                        <span
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedPropertyForOffers(property);
                            setShowOffersModal(true);
                          }}
                          style={{
                            marginLeft: '8px',
                            background: '#F59E0B',
                            color: 'white',
                            borderRadius: '12px',
                            padding: '2px 8px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            flexShrink: 0,
                          }}
                          title={`${property.pendingOffersCount} oferta(s) pendente(s)`}
                        >
                          💬 {property.pendingOffersCount}
                        </span>
                      )}
                  </>
                );
              })()}
            </ListPropertyTitle>
            <ListPropertyCode>
              {property.code ? `#${property.code}` : 'Código não informado'}
            </ListPropertyCode>
          </ListPropertyDetails>
        </PropertyInfo>

        <TabletHidden>
          <ListPropertyLocation>
            {property.city && property.state ? (
              <>
                <MdLocationOn size={16} />
                {property.city}, {property.state}
              </>
            ) : (
              <span
                style={{
                  color: 'var(--color-text-secondary)',
                  fontStyle: 'italic',
                  fontSize: '14px',
                }}
              >
                Localização não informada
              </span>
            )}
          </ListPropertyLocation>
        </TabletHidden>

        <MobileHidden>
          <PropertyType style={{ color: pricing.color }}>
            {pricing.display || 'Tipo não informado'}
          </PropertyType>
        </MobileHidden>

        <ListPropertyPrice>
          {pricing.priceFormatted || 'Preço não informado'}
        </ListPropertyPrice>

        <MobileHidden>
          <PropertySpecs>
            <PropertySpec>
              {property.bedrooms && property.bedrooms > 0 ? (
                <>
                  <MdBed size={14} />
                  {property.bedrooms}
                </>
              ) : (
                <span
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '13px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    fontStyle: 'italic',
                  }}
                >
                  <MdBed size={14} />-
                </span>
              )}
            </PropertySpec>
            <PropertySpec>
              {property.bathrooms && property.bathrooms > 0 ? (
                <>
                  <MdBathroom size={14} />
                  {property.bathrooms}
                </>
              ) : (
                <span
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '13px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    fontStyle: 'italic',
                  }}
                >
                  <MdBathroom size={14} />-
                </span>
              )}
            </PropertySpec>
            <PropertySpec>
              {property.builtArea && property.builtArea > 0 ? (
                <>
                  <MdSquareFoot size={14} />
                  {property.builtArea}m²
                </>
              ) : (
                <span
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '13px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    fontStyle: 'italic',
                  }}
                >
                  <MdSquareFoot size={14} />-
                </span>
              )}
            </PropertySpec>
          </PropertySpecs>
        </MobileHidden>

        <RowActions>
          <ActionsMenuButton
            onClick={() =>
              setOpenActionsMenuId(prev =>
                prev === property.id ? null : property.id
              )
            }
          >
            Ações
          </ActionsMenuButton>
          {openActionsMenuId === property.id && (
            <ActionsMenu>
              <ActionsMenuItem
                onClick={() => handleShowDetails(property)}
                title='Visualizar todos os detalhes e informações completas da propriedade'
              >
                <MdVisibility /> Ver detalhes
              </ActionsMenuItem>
              {property.acceptsNegotiation && (
                <ActionsMenuItem
                  onClick={() => {
                    setSelectedPropertyForOffers(property);
                    setShowOffersModal(true);
                    setOpenActionsMenuId(null);
                  }}
                  title={
                    (property.pendingOffersCount ?? 0) > 0
                      ? `${property.pendingOffersCount} oferta(s) pendente(s) - Clique para visualizar e gerenciar`
                      : 'Visualizar e gerenciar ofertas recebidas para esta propriedade'
                  }
                >
                  <MdComment /> Ver Ofertas
                  {(property.pendingOffersCount ?? 0) > 0 && (
                    <span
                      style={{
                        marginLeft: '8px',
                        background: '#F59E0B',
                        color: 'white',
                        borderRadius: '10px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      {property.pendingOffersCount}
                    </span>
                  )}
                </ActionsMenuItem>
              )}
              {property.status === PropertyStatusEnum.AVAILABLE &&
                !property.hasPendingFinancialApproval &&
                property.salePrice &&
                property.salePrice > 0 && (
                  <ActionsMenuItem
                    onClick={() => handleOpenMarkAsSoldModal(property)}
                    title='Marcar esta propriedade como vendida e alterar seu status'
                  >
                    <MdCheckCircle /> Marcar como vendida
                  </ActionsMenuItem>
                )}
              {property.status === PropertyStatusEnum.AVAILABLE &&
                !property.hasPendingFinancialApproval &&
                property.rentPrice &&
                property.rentPrice > 0 && (
                  <ActionsMenuItem
                    onClick={() => handleOpenMarkAsRentedModal(property)}
                    title='Marcar esta propriedade como alugada e alterar seu status'
                  >
                    <MdHome /> Marcar como alugada
                  </ActionsMenuItem>
                )}
              {(() => {
                const validation = canPublishProperty(property);
                const isDisabled =
                  !property.isAvailableForSite && !validation.canPublish;
                const tooltipMessage = property.isAvailableForSite
                  ? 'Propriedade está visível no site Intellisys - Clique para ocultar'
                  : validation.canPublish
                    ? 'Propriedade não está visível no site Intellisys - Clique para tornar pública'
                    : `Não é possível publicar: ${validation.reason}`;

                const menuItem = (
                  <ActionsMenuItem
                    onClick={async () => {
                      if (isDisabled) return;
                      setOpenActionsMenuId(null);
                      await handleTogglePublicSite(property);
                    }}
                    disabled={isDisabled}
                    style={{
                      opacity: isDisabled ? 0.5 : 1,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                    }}
                    title={tooltipMessage}
                  >
                    {property.isAvailableForSite ? (
                      <>
                        <MdLock size={18} />
                        <span>Ocultar do Site</span>
                      </>
                    ) : (
                      <>
                        <MdPublic size={18} />
                        <span>Publicar no Site</span>
                      </>
                    )}
                  </ActionsMenuItem>
                );

                return isDisabled ? (
                  <Tooltip content={tooltipMessage} placement='left'>
                    {menuItem}
                  </Tooltip>
                ) : (
                  menuItem
                );
              })()}
              {hasAIAssistantModule &&
                property.status === PropertyStatusEnum.AVAILABLE && (
                  <ActionsMenuItem
                    onClick={async () => {
                      setShowPredictiveModal(true);
                      setOpenActionsMenuId(null);
                      setPredictiveAnalysis(null); // Limpar análise anterior
                      const result = await predict(property.id);
                      if (result && !Array.isArray(result)) {
                        setPredictiveAnalysis(result);
                      }
                    }}
                    title='Obter análise preditiva com IA sobre valor, tempo de venda e recomendações'
                  >
                    <MdAutoAwesome /> Análise Preditiva (IA)
                  </ActionsMenuItem>
                )}
              <ActionsMenuItem
                onClick={() => navigate(`/properties/edit/${property.id}`)}
                title='Editar informações e detalhes da propriedade'
              >
                <MdEdit /> Editar
              </ActionsMenuItem>
              <ActionsMenuItem
                onClick={() => {
                  handleDeleteProperty(property);
                  setOpenActionsMenuId(null);
                }}
                title='Excluir permanentemente esta propriedade do sistema'
              >
                <MdDelete /> Excluir
              </ActionsMenuItem>
            </ActionsMenu>
          )}
        </RowActions>

        {/* Versão mobile com mais detalhes */}
        <MobileOnly style={{ gridColumn: '1 / -1' }}>
          <MobilePropertyDetails>
            <MobileDetailRow>
              <MobileDetailLabel>Localização:</MobileDetailLabel>
              <MobileDetailValue>
                {property.city}, {property.state}
              </MobileDetailValue>
            </MobileDetailRow>
            <MobileDetailRow>
              <MobileDetailLabel>Tipo:</MobileDetailLabel>
              <MobileDetailValue style={{ color: pricing.color }}>
                {pricing.display}
              </MobileDetailValue>
            </MobileDetailRow>
            <MobileDetailRow>
              <MobileDetailLabel>Quartos:</MobileDetailLabel>
              <MobileDetailValue>
                {property.bedrooms} | Banheiros: {property.bathrooms} | Área:{' '}
                {property.builtArea || '0'}m²
              </MobileDetailValue>
            </MobileDetailRow>
          </MobilePropertyDetails>
        </MobileOnly>
      </PropertyRow>
    );
  };

  if (error) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <PageHeader>
              <PageTitleContainer>
                <PageTitle>Propriedades</PageTitle>
                <PageSubtitle>Gerencie seu portfólio imobiliário</PageSubtitle>
              </PageTitleContainer>
            </PageHeader>
            <EmptyState>
              <EmptyStateIcon>
                <MdHome style={{ fontSize: 64, color: 'var(--color-error)' }} />
              </EmptyStateIcon>
              <EmptyStateTitle style={{ color: 'var(--color-error)' }}>
                Erro ao carregar propriedades
              </EmptyStateTitle>
              <EmptyStateDescription>
                Não foi possível carregar as propriedades. Tente recarregar a
                página.
              </EmptyStateDescription>
            </EmptyState>
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <PageHeader>
              <PageTitleContainer>
                <PageTitle>Propriedades</PageTitle>
                <PageSubtitle>Gerencie seu portfólio imobiliário</PageSubtitle>
              </PageTitleContainer>
            </PageHeader>
            <PropertiesGrid>
              {Array.from({ length: 6 }).map((_, index) => (
                <PropertyCard key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      borderRadius: '8px',
                      padding: '16px',
                    }}
                  >
                    {/* Imagem shimmer */}
                    <div
                      style={{
                        width: '100%',
                        height: '160px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        marginBottom: '12px',
                      }}
                    />

                    {/* Conteúdo shimmer */}
                    <div style={{ flex: 1 }}>
                      {/* Título */}
                      <div
                        style={{
                          height: '18px',
                          backgroundColor: '#e8e8e8',
                          borderRadius: '4px',
                          marginBottom: '8px',
                          width: '85%',
                        }}
                      />

                      {/* Preço */}
                      <div
                        style={{
                          height: '15px',
                          backgroundColor: '#e8e8e8',
                          borderRadius: '4px',
                          marginBottom: '8px',
                          width: '65%',
                        }}
                      />

                      {/* Localização */}
                      <div
                        style={{
                          height: '13px',
                          backgroundColor: '#e8e8e8',
                          borderRadius: '4px',
                          marginBottom: '16px',
                          width: '75%',
                        }}
                      />

                      {/* Detalhes */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          marginBottom: '16px',
                        }}
                      >
                        <div
                          style={{
                            height: '10px',
                            backgroundColor: '#e8e8e8',
                            borderRadius: '4px',
                            flex: 1,
                          }}
                        />
                        <div
                          style={{
                            height: '10px',
                            backgroundColor: '#e8e8e8',
                            borderRadius: '4px',
                            flex: 1,
                          }}
                        />
                        <div
                          style={{
                            height: '10px',
                            backgroundColor: '#e8e8e8',
                            borderRadius: '4px',
                            flex: 1,
                          }}
                        />
                      </div>

                      {/* Botões */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div
                          style={{
                            height: '28px',
                            backgroundColor: '#e8e8e8',
                            borderRadius: '4px',
                            flex: 1,
                          }}
                        />
                        <div
                          style={{
                            height: '28px',
                            backgroundColor: '#e8e8e8',
                            borderRadius: '4px',
                            flex: 1,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </PropertyCard>
              ))}
            </PropertiesGrid>
          </PageContent>
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
              <PageTitle>Propriedades</PageTitle>
              <PageSubtitle>Gerencie seu portfólio imobiliário</PageSubtitle>
            </PageTitleContainer>
            <HeaderActions>
              <PermissionButton
                permission='property:view'
                variant='secondary'
                size='medium'
                onClick={() => navigate('/properties/offers')}
                style={{ marginRight: '8px' }}
              >
                <MdComment />
                Ver Todas as Ofertas
              </PermissionButton>
              <PermissionButton
                permission='property:import'
                variant='secondary'
                size='medium'
                onClick={() => navigate('/properties/import-export')}
                style={{ marginRight: '8px' }}
                tooltip='Importar/Exportar Propriedades (requer property:import ou property:export)'
              >
                <MdFileUpload />
                Importar/Exportar
              </PermissionButton>
              {hasAIAssistantModule && (
                <OptimizationButton
                  onClick={() => navigate('/properties/optimization')}
                >
                  <MdAutoAwesome />
                  Otimização de Portfólio
                </OptimizationButton>
              )}
              {hasCondominiumPermission && (
                <>
                  <PermissionButton
                    permission='condominium:view'
                    variant='secondary'
                    size='medium'
                    onClick={() => navigate('/condominiums')}
                    style={{ marginRight: '8px' }}
                  >
                    <MdHome />
                    Condomínios
                  </PermissionButton>
                  <PermissionButton
                    permission='condominium:create'
                    variant='secondary'
                    size='medium'
                    onClick={() => navigate('/condominiums/create')}
                    style={{ marginRight: '8px' }}
                  >
                    <MdAdd />
                    Novo Condomínio
                  </PermissionButton>
                </>
              )}
              <PermissionButton
                permission='property:create'
                variant='primary'
                size='medium'
                onClick={() => navigate('/properties/create')}
              >
                <MdAdd />
                Nova Propriedade
              </PermissionButton>
            </HeaderActions>
          </PageHeader>

          <ActionsBar>
            <LeftActions>
              <SearchContainer>
                <SearchInput
                  type='text'
                  placeholder='Buscar propriedades...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <SearchIcon />
              </SearchContainer>

              <FilterToggle onClick={() => setShowFiltersModal(true)}>
                <MdFilterList />
                Filtros
                {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
              </FilterToggle>

              {hasIntelligentResults ? (
                <Tooltip
                  content='Limpar os resultados da busca inteligente e voltar para a visualização normal de propriedades'
                  placement='bottom'
                >
                  <FilterToggle
                    onClick={() => {
                      clearIntelligentSearch();
                    }}
                    style={{
                      backgroundColor: 'var(--color-error)',
                      color: 'white',
                    }}
                  >
                    Limpar Busca Inteligente
                  </FilterToggle>
                </Tooltip>
              ) : (
                <Tooltip
                  content='Busca inteligente com IA: Encontre propriedades ideais para um cliente específico baseado no perfil, preferências e critérios dele. A IA analisa automaticamente compatibilidade, localização, preço e características.'
                  placement='bottom'
                >
                  <IntelligentSearchButton
                    onClick={() => setShowIntelligentSearch(true)}
                  >
                    <MdAutoAwesome />
                    Busca Inteligente
                  </IntelligentSearchButton>
                </Tooltip>
              )}

              {!isSmallScreen && (
                <ViewModeToggle
                  currentMode={viewMode}
                  onModeChange={handleViewModeChange}
                />
              )}
            </LeftActions>
          </ActionsBar>

          {paginatedProperties.length === 0 ? (
            <EmptyState>
              <EmptyStateCard>
                <EmptyStateIcon>
                  {searchTerm || activeFiltersCount > 0 ? (
                    <MdSearch />
                  ) : (
                    <MdHome />
                  )}
                </EmptyStateIcon>
                <EmptyStateTitle>
                  {searchTerm || activeFiltersCount > 0
                    ? 'Nenhuma propriedade encontrada'
                    : 'Nenhuma propriedade cadastrada'}
                </EmptyStateTitle>
                <EmptyStateDescription>
                  {searchTerm || activeFiltersCount > 0
                    ? 'Tente ajustar os filtros ou termo de busca para encontrar propriedades'
                    : 'Comece cadastrando sua primeira propriedade e organize seu portfólio imobiliário'}
                </EmptyStateDescription>
                {!searchTerm && activeFiltersCount === 0 && (
                  <EmptyStateAction
                    onClick={() => navigate('/properties/create')}
                  >
                    <MdAdd />
                    Criar Primeira Propriedade
                  </EmptyStateAction>
                )}
                {(searchTerm || activeFiltersCount > 0) && (
                  <EmptyStateSecondaryAction
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({});
                    }}
                  >
                    Limpar Filtros
                  </EmptyStateSecondaryAction>
                )}
              </EmptyStateCard>
            </EmptyState>
          ) : effectiveViewMode === 'list' ? (
            <>
              <DraggableContainer>
                <PropertiesListContainer>
                  <ListHeader>
                    <div>Propriedade</div>
                    <TabletHidden>
                      <div>Localização</div>
                    </TabletHidden>
                    <MobileHidden>
                      <div>Tipo</div>
                    </MobileHidden>
                    <div>Preço</div>
                    <MobileHidden>
                      <div>Especificações</div>
                    </MobileHidden>
                    <div>Ações</div>
                  </ListHeader>
                  {paginatedProperties.map(renderPropertyRow)}
                </PropertiesListContainer>
              </DraggableContainer>

              {totalPages > 1 && (
                <PaginationWrapper>
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
                </PaginationWrapper>
              )}
            </>
          ) : (
            <>
              <PropertiesGrid>
                {/* Card de Criar Chave */}
                {showCreateKeyCard && selectedPropertyForKey && (
                  <PropertyCard
                    style={{
                      border: '2px dashed var(--color-primary)',
                      background:
                        'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.1) 100%)',
                      animation: 'pulse 2s infinite',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        padding: '20px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          background: 'var(--color-primary)',
                          borderRadius: '50%',
                          width: '60px',
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '16px',
                          color: 'white',
                          fontSize: '24px',
                        }}
                      >
                        🔑
                      </div>

                      <h3
                        style={{
                          margin: '0 0 8px 0',
                          color: 'var(--color-primary)',
                          fontSize: '18px',
                          fontWeight: '600',
                        }}
                      >
                        Criar Chave para Propriedade
                      </h3>

                      <p
                        style={{
                          margin: '0 0 20px 0',
                          color: 'var(--color-text-secondary)',
                          fontSize: '14px',
                          lineHeight: '1.4',
                        }}
                      >
                        Complete o cadastro criando uma chave para esta
                        propriedade
                      </p>

                      <div
                        style={{ display: 'flex', gap: '12px', width: '100%' }}
                      >
                        <button
                          onClick={() => {
                            // Aqui você pode abrir um modal ou formulário para criar a chave
                            console.log(
                              'Criar chave para propriedade:',
                              selectedPropertyForKey
                            );
                            // Por enquanto, vamos fechar o card
                            setShowCreateKeyCard(false);
                            setSelectedPropertyForKey(null);
                          }}
                          style={{
                            flex: 1,
                            background: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background =
                              'var(--color-primary-dark)';
                            e.currentTarget.style.transform =
                              'translateY(-1px)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background =
                              'var(--color-primary)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          Criar Chave
                        </button>

                        <button
                          onClick={() => {
                            setShowCreateKeyCard(false);
                            setSelectedPropertyForKey(null);
                          }}
                          style={{
                            background: 'var(--color-background-secondary)',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background =
                              'var(--color-background)';
                            e.currentTarget.style.borderColor =
                              'var(--color-primary)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background =
                              'var(--color-background-secondary)';
                            e.currentTarget.style.borderColor =
                              'var(--color-border)';
                          }}
                        >
                          Depois
                        </button>
                      </div>
                    </div>
                  </PropertyCard>
                )}

                {paginatedProperties.map(property => (
                  <PropertyCard
                    key={property.id}
                    onDoubleClick={() => handleShowDetails(property)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ position: 'relative' }}>
                      <OptimizedImage
                        src={property.mainImage?.url || undefined}
                        alt={property.title}
                        width='100%'
                        height='200px'
                        borderRadius='8px'
                        imageCount={property.imageCount}
                        placeholder={<MdHome size={48} />}
                        loading='lazy'
                        objectFit='cover'
                        status={property.status}
                      />

                      {/* Toggle de Ativação/Desativação */}
                      <PropertyActiveToggle
                        property={property}
                        onStatusChange={updatedProperty => {
                          updateProperty(property.id, updatedProperty);
                        }}
                        size='medium'
                      />

                      {/* Botão de visualizar detalhes */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleShowDetails(property);
                        }}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: 'rgba(0, 0, 0, 0.8)',
                          backdropFilter: 'blur(8px)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1001,
                          cursor: 'pointer',
                          fontSize: '18px',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background =
                            'rgba(59, 130, 246, 0.9)';
                          e.currentTarget.style.transform =
                            'scale(1.1) translateY(-2px)';
                          e.currentTarget.style.boxShadow =
                            '0 8px 20px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background =
                            'rgba(0, 0, 0, 0.8)';
                          e.currentTarget.style.transform =
                            'scale(1) translateY(0)';
                          e.currentTarget.style.boxShadow =
                            '0 4px 12px rgba(0, 0, 0, 0.3)';
                        }}
                        title='Ver detalhes da propriedade'
                      >
                        <MdVisibility />
                      </button>
                    </div>

                    <PropertyContent>
                      <PropertyHeader>
                        {/* 1 - Título sem ícone, ocupando toda a largura */}
                        <PropertyTitle>{property.title}</PropertyTitle>
                        <PropertyPrice>
                          {getPropertyPricing(property).priceFormatted ||
                            'Preço não informado'}
                        </PropertyPrice>
                      </PropertyHeader>

                      {property.code && (
                        <PropertyCode>Código: {property.code}</PropertyCode>
                      )}

                      <PropertyLocation>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                        >
                          <MdLocationOn size={16} />
                        </span>
                        <span style={{ flex: 1 }}>
                          {property.neighborhood &&
                            `${property.neighborhood}, `}
                          {property.address}, {property.city}/{property.state}
                        </span>
                      </PropertyLocation>

                      {/* Badges */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap',
                          marginTop: '4px',
                          marginBottom: '8px',
                        }}
                      >
                        {/* Badge do tipo de propriedade */}
                        <span
                          style={{
                            background: getPropertyTypeIcon(property.type)
                              .color,
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {React.createElement(
                            getPropertyTypeIcon(property.type).icon,
                            { size: 14 }
                          )}
                          {getPropertyTypeIcon(property.type).label}
                        </span>

                        {/* Badge de Propriedade Pública */}
                        {property.isAvailableForSite && (
                          <span
                            style={{
                              background:
                                'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                            }}
                          >
                            <MdPublic size={14} />
                            Pública
                          </span>
                        )}

                        {/* Badge do tipo de transação */}
                        <span
                          style={{
                            background: getPropertyPricing(property).color,
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {getPropertyPricing(property).display}
                        </span>

                        {/* Badge de Ofertas Pendentes */}
                        {property.acceptsNegotiation &&
                          (property.pendingOffersCount ?? 0) > 0 && (
                            <span
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedPropertyForOffers(property);
                                setShowOffersModal(true);
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = '#D97706';
                                e.currentTarget.style.transform =
                                  'translateY(-2px)';
                                e.currentTarget.style.boxShadow =
                                  '0 4px 12px rgba(245, 158, 11, 0.5)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = '#F59E0B';
                                e.currentTarget.style.transform =
                                  'translateY(0)';
                                e.currentTarget.style.boxShadow =
                                  '0 2px 8px rgba(245, 158, 11, 0.3)';
                              }}
                              style={{
                                background: '#F59E0B',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                                transition: 'all 0.2s',
                              }}
                              title={`${property.pendingOffersCount} oferta(s) pendente(s) - Clique para ver`}
                            >
                              💬 {property.pendingOffersCount} Oferta(s)
                            </span>
                          )}
                      </div>

                      {(() => {
                        const hasBedrooms =
                          !!property.bedrooms && property.bedrooms > 0;
                        const hasBathrooms =
                          !!property.bathrooms && property.bathrooms > 0;
                        const hasArea =
                          (!!property.builtArea &&
                            Number(property.builtArea) > 0) ||
                          (!!property.totalArea &&
                            Number(property.totalArea) > 0);
                        const hasParking =
                          !!property.parkingSpaces &&
                          property.parkingSpaces > 0;
                        const hasClients =
                          property.clientCount !== undefined &&
                          property.clientCount > 0;

                        const hasAnyCharacteristic =
                          hasBedrooms ||
                          hasBathrooms ||
                          hasArea ||
                          hasParking ||
                          hasClients;

                        if (!hasAnyCharacteristic) {
                          return null;
                        }

                        return (
                          <PropertyDetails>
                            {hasBedrooms && (
                              <PropertyDetail>
                                <PropertyDetailValue>
                                  {property.bedrooms}
                                </PropertyDetailValue>
                                <PropertyDetailLabel>
                                  <MdBed size={12} /> Quartos
                                </PropertyDetailLabel>
                              </PropertyDetail>
                            )}

                            {hasBathrooms && (
                              <PropertyDetail>
                                <PropertyDetailValue>
                                  {property.bathrooms}
                                </PropertyDetailValue>
                                <PropertyDetailLabel>
                                  <MdBathroom size={12} /> Banheiros
                                </PropertyDetailLabel>
                              </PropertyDetail>
                            )}

                            {hasArea && (
                              <PropertyDetail>
                                <PropertyDetailValue>
                                  {property.builtArea &&
                                  Number(property.builtArea) > 0
                                    ? `${property.builtArea}m²`
                                    : `${property.totalArea}m²`}
                                </PropertyDetailValue>
                                <PropertyDetailLabel>
                                  <MdSquareFoot size={12} /> Área
                                </PropertyDetailLabel>
                              </PropertyDetail>
                            )}

                            {hasParking && (
                              <PropertyDetail>
                                <PropertyDetailValue>
                                  {property.parkingSpaces}
                                </PropertyDetailValue>
                                <PropertyDetailLabel>
                                  <MdDirectionsCar size={12} /> Vagas
                                </PropertyDetailLabel>
                              </PropertyDetail>
                            )}

                            {hasClients && (
                              <PropertyDetail>
                                <PropertyDetailValue>
                                  {property.clientCount}
                                </PropertyDetailValue>
                                <PropertyDetailLabel>
                                  <MdPerson size={12} /> Clientes
                                </PropertyDetailLabel>
                              </PropertyDetail>
                            )}
                          </PropertyDetails>
                        );
                      })()}

                      {/* 2 - Ações organizadas em grupos */}
                      <PropertyActions>
                        {/* Toggle de Propriedade Pública - centralizado */}
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '12px',
                          }}
                        >
                          <PropertyPublicToggle
                            propertyId={property.id}
                            initialValue={property.isAvailableForSite || false}
                            propertyStatus={property.status}
                            size='small'
                            fullWidth={false}
                            onSuccess={() => {
                              handlePropertyPublicToggleSuccess(
                                property.id,
                                property.isAvailableForSite || false
                              );
                            }}
                          />
                        </div>

                        {/* Botões de Marcar como Vendida/Alugada - lado a lado quando ambos existirem */}
                        {property.status === PropertyStatusEnum.AVAILABLE &&
                          !property.hasPendingFinancialApproval && (
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns:
                                  property.salePrice &&
                                  property.salePrice > 0 &&
                                  property.rentPrice &&
                                  property.rentPrice > 0
                                    ? '1fr 1fr'
                                    : '1fr',
                                gap: '8px',
                                width: '100%',
                                marginBottom: '8px',
                              }}
                            >
                              {property.salePrice && property.salePrice > 0 && (
                                <PermissionButton
                                  permission='property:update'
                                  variant='primary'
                                  size='small'
                                  onClick={() =>
                                    handleOpenMarkAsSoldModal(property)
                                  }
                                  style={{
                                    background:
                                      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    border: 'none',
                                    width: '100%',
                                    fontWeight: '600',
                                    boxShadow:
                                      '0 2px 8px rgba(16, 185, 129, 0.3)',
                                    transition: 'all 0.2s ease',
                                  }}
                                  onMouseEnter={e => {
                                    e.currentTarget.style.transform =
                                      'translateY(-2px)';
                                    e.currentTarget.style.boxShadow =
                                      '0 4px 12px rgba(16, 185, 129, 0.4)';
                                  }}
                                  onMouseLeave={e => {
                                    e.currentTarget.style.transform =
                                      'translateY(0)';
                                    e.currentTarget.style.boxShadow =
                                      '0 2px 8px rgba(16, 185, 129, 0.3)';
                                  }}
                                  title='Clique para marcar esta propriedade como vendida'
                                >
                                  <MdCheckCircle size={18} />
                                  Marcar como Vendida
                                </PermissionButton>
                              )}

                              {property.rentPrice && property.rentPrice > 0 && (
                                <PermissionButton
                                  permission='property:update'
                                  variant='primary'
                                  size='small'
                                  onClick={() =>
                                    handleOpenMarkAsRentedModal(property)
                                  }
                                  style={{
                                    background:
                                      'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    border: 'none',
                                    width: '100%',
                                    fontWeight: '600',
                                    boxShadow:
                                      '0 2px 8px rgba(59, 130, 246, 0.3)',
                                    transition: 'all 0.2s ease',
                                  }}
                                  onMouseEnter={e => {
                                    e.currentTarget.style.transform =
                                      'translateY(-2px)';
                                    e.currentTarget.style.boxShadow =
                                      '0 4px 12px rgba(59, 130, 246, 0.4)';
                                  }}
                                  onMouseLeave={e => {
                                    e.currentTarget.style.transform =
                                      'translateY(0)';
                                    e.currentTarget.style.boxShadow =
                                      '0 2px 8px rgba(59, 130, 246, 0.3)';
                                  }}
                                  title='Clique para marcar esta propriedade como alugada'
                                >
                                  <MdHome size={18} />
                                  Marcar como Alugada
                                </PermissionButton>
                              )}
                            </div>
                          )}

                        {/* Botões secundários - Editar e Excluir lado a lado */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '8px',
                            width: '100%',
                          }}
                        >
                          <PermissionButton
                            permission='property:update'
                            variant='secondary'
                            size='small'
                            onClick={() =>
                              navigate(`/properties/edit/${property.id}`)
                            }
                            style={{ width: '100%' }}
                          >
                            <MdEdit size={16} />
                            Editar
                          </PermissionButton>
                          <PermissionButton
                            permission='property:delete'
                            variant='danger'
                            size='small'
                            onClick={() => handleDeleteProperty(property)}
                            style={{ width: '100%' }}
                          >
                            <MdDelete size={16} />
                            Excluir
                          </PermissionButton>
                        </div>
                      </PropertyActions>
                    </PropertyContent>
                  </PropertyCard>
                ))}
              </PropertiesGrid>

              {totalPages > 1 && (
                <PaginationWrapper>
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
                </PaginationWrapper>
              )}
            </>
          )}
        </PageContent>
      </PageContainer>

      <PropertyFiltersDrawer
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        filters={filters}
        onFiltersChange={handleFilterChange}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPropertyToDelete(null);
        }}
        onConfirm={confirmDeleteProperty}
        title='Excluir Propriedade'
        message='Tem certeza que deseja excluir esta propriedade?'
        itemName={propertyToDelete?.title}
        isLoading={isDeleting}
      />

      {/* Modal de Confirmação de Marcar como Vendida */}
      <ConfirmDeleteModal
        isOpen={showMarkAsSoldModal}
        onClose={() => {
          setShowMarkAsSoldModal(false);
          setPropertyToMarkSold(null);
        }}
        onConfirm={confirmMarkAsSold}
        title='Marcar como Vendida'
        message='Tem certeza que deseja marcar esta propriedade como vendida?'
        itemName={propertyToMarkSold?.title}
        isLoading={isMarkingSold}
        variant='mark-as-sold'
      />

      {/* Modal de Confirmação de Marcar como Alugada */}
      <ConfirmDeleteModal
        isOpen={showMarkAsRentedModal}
        onClose={() => {
          setShowMarkAsRentedModal(false);
          setPropertyToMarkRented(null);
        }}
        onConfirm={confirmMarkAsRented}
        title='Marcar como Alugada'
        message='Tem certeza que deseja marcar esta propriedade como alugada?'
        itemName={propertyToMarkRented?.title}
        isLoading={isMarkingRented}
        variant='mark-as-rented'
      />

      {/* AI Assistant - Predictive Analysis Modal */}
      {hasAIAssistantModule && (
        <PredictiveAnalysisModal
          isOpen={showPredictiveModal}
          onClose={() => {
            setShowPredictiveModal(false);
            setPredictiveAnalysis(null);
          }}
          analysis={predictiveAnalysis}
          loading={predictiveLoading}
          error={predictiveError}
        />
      )}

      {/* Modal de Busca Inteligente */}
      <IntelligentSearchModal
        isOpen={showIntelligentSearch}
        onClose={() => {
          setShowIntelligentSearch(false);
        }}
        onSearchSuccess={() => {
          setShowIntelligentSearch(false);
          setCurrentPage(1);
        }}
        onSearch={async (clientId: string) => {
          await intelligentSearch({ clientId });
        }}
        isSearching={intelligentSearchLoading}
      />

      {/* Modal de Ofertas da Propriedade */}
      <PropertyOffersModal
        isOpen={showOffersModal}
        onClose={() => {
          setShowOffersModal(false);
          setSelectedPropertyForOffers(null);
          // Recarregar propriedades para atualizar contadores
          getProperties(filters, { page: currentPage, limit: itemsPerPage });
        }}
        property={selectedPropertyForOffers}
      />
    </Layout>
  );
};

export default PropertiesPage;
