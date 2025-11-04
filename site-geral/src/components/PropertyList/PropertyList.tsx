import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid } from '@mui/material'
import styled from 'styled-components'
import { PropertyCard } from '../PropertyCard'
import { PropertyCardShimmer } from '../Shimmer'
import { searchProperties, Property, PropertySearchFilters } from '../../services/propertyService'
import { useLocation } from '../../contexts/LocationContext'

const ContainerWrapper = styled(Box)`
  width: 100%;
  padding-top: ${({ theme }) => theme.spacing['2xl']};
  padding-bottom: ${({ theme }) => theme.spacing['2xl']};
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  z-index: 3;
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
  padding-left: ${({ theme }) => theme.spacing.lg};
  padding-right: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  /* Garantir que a imagem de background não apareça aqui */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.background};
    z-index: -1;
    border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
  }
`

const SectionTitle = styled(Typography)`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-align: left;
  font-size: 2rem;
  position: relative;
  padding-left: ${({ theme }) => theme.spacing.lg};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 40px;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
    border-radius: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.5rem;
    padding-left: ${({ theme }) => theme.spacing.md};
    
    &::before {
      height: 30px;
    }
  }
`

const SectionSubtitle = styled(Typography)`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing.lg};
  font-size: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-left: ${({ theme }) => theme.spacing.md};
  }
`

const PropertiesGrid = styled(Grid)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const LoadingContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
`

const EmptyContainer = styled(Box)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
`

const LoadMoreTrigger = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const EndMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  margin-top: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryLight} 0%, ${({ theme }) => theme.colors.primary} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: white;
`

const EndMessageTitle = styled(Typography)`
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: white;
`

const EndMessageSubtitle = styled(Typography)`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
`

const LoadingMoreContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
`

interface PropertyListProps {
  filters?: Omit<PropertySearchFilters, 'city' | 'state' | 'page' | 'limit'>
  shouldLoad?: boolean // Flag para controlar quando deve carregar
}

export const PropertyList = ({ filters, shouldLoad = true }: PropertyListProps) => {
  const navigate = useNavigate()
  const { location, hasLocation, isLocationConfirmed } = useLocation()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFiltersRef = useRef<typeof filters>(undefined)

  const loadProperties = async (pageNum: number = 1, append: boolean = false): Promise<void> => {
    if (!location?.city) {
      setError('Selecione sua localização para ver as propriedades')
      return Promise.resolve()
    }

    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const searchFilters: PropertySearchFilters = {
        city: location.city,
        // A API não precisa do estado, apenas da cidade
        page: pageNum,
        limit: 12,
        ...filters,
      }

      // Remover 'search' se existir (usado para transaction type)
      const { search: transactionType, ...apiFilters } = searchFilters as any
      
      const result = await searchProperties(apiFilters)
      
      // Filtrar por tipo de transação (venda ou locação) se especificado
      let filteredProperties = result.properties
      if (transactionType === 'sale') {
        filteredProperties = result.properties.filter(p => p.salePrice && Number(p.salePrice) > 0)
      } else if (transactionType === 'rent') {
        filteredProperties = result.properties.filter(p => p.rentPrice && Number(p.rentPrice) > 0)
      }

      // Recalcular total baseado nos filtros
      const totalFiltered = transactionType 
        ? filteredProperties.length + (result.total - result.properties.length)
        : result.total

      if (append) {
        setProperties((prev) => [...prev, ...filteredProperties])
      } else {
        setProperties(filteredProperties)
      }

      setTotal(totalFiltered)
      setHasMore(result.page < result.totalPages && filteredProperties.length > 0)
      setPage(result.page)
      setError(null)
    } catch (err) {
      // Não mostra erro, apenas retorna lista vazia
      if (append) {
        // Se estiver carregando mais, não faz nada
      } else {
        setProperties([])
        setTotal(0)
        setHasMore(false)
      }
      setError(null)
    } finally {
      if (append) {
        setLoadingMore(false)
      } else {
        setLoading(false)
      }
    }
  }

  const loadMore = useCallback(() => {
    if (!loadingMore && !loading && hasMore && location?.city) {
      const nextPage = page + 1
      loadProperties(nextPage, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMore, loading, hasMore, page, location?.city])

  useEffect(() => {
    // Só carrega propriedades se houver localização confirmada pelo usuário no modal
    if (location?.city && isLocationConfirmed && shouldLoad) {
      // Verificar se os filtros mudaram ANTES de atualizar a referência
      const filtersChanged = JSON.stringify(previousFiltersRef.current) !== JSON.stringify(filters)
      
      // Resetar propriedades anteriores quando a cidade muda ou filtros mudam
      setProperties([])
      setPage(1)
      setTotal(0)
      setHasMore(false)
      
      // Carregar propriedades da nova cidade ou com novos filtros
      loadProperties(1, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.city, location?.state, isLocationConfirmed, shouldLoad, filters])

  // Fazer scroll quando os filtros mudarem e as propriedades forem carregadas
  useEffect(() => {
    // Verificar se os filtros mudaram (comparando com a referência anterior)
    const previousFiltersString = previousFiltersRef.current 
      ? JSON.stringify(previousFiltersRef.current) 
      : 'undefined'
    const currentFiltersString = filters 
      ? JSON.stringify(filters) 
      : 'undefined'
    const filtersChanged = previousFiltersString !== currentFiltersString
    
    // Detectar se filtros foram aplicados:
    // - Mudou de undefined para um objeto (primeira aplicação de filtros)
    // - Ou mudou de um objeto para outro (filtros foram alterados)
    const filtersApplied = filters !== undefined && (
      previousFiltersRef.current === undefined || 
      filtersChanged
    )
    
    // Só fazer scroll se:
    // 1. Filtros foram aplicados (mudaram)
    // 2. Não está mais carregando (propriedades foram carregadas)
    // 3. Há propriedades carregadas OU houve tentativa de carregar (mesmo que vazio)
    // 4. Container existe
    if (
      filtersApplied && 
      !loading && 
      !loadingMore && 
      containerRef.current &&
      (properties.length > 0 || total > 0 || !loading)
    ) {
      // Aguardar um pouco mais para garantir que o DOM foi atualizado e renderizado
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          })
        }
      }, 500) // Delay aumentado para garantir que o conteúdo foi renderizado completamente
    }
    
    // Atualizar referência dos filtros após verificar a mudança
    previousFiltersRef.current = filters
  }, [loading, loadingMore, filters, properties.length, total])

  // Intersection Observer para scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loadingMore, loading, loadMore])

  const handlePropertyClick = (property: Property) => {
    navigate(`/property/${property.id}`)
  }

  // Não renderiza nada até que a localização seja confirmada pelo usuário
  if (!isLocationConfirmed || !location?.city) {
    return null
  }

  return (
    <ContainerWrapper ref={containerRef}>
      <SectionTitle variant="h3">
        Propriedades em {location.city}
        {location.state && ` - ${location.state}`}
      </SectionTitle>
      <SectionSubtitle variant="body1">
        {loading
          ? 'Buscando propriedades...'
          : total > 0
            ? `${total} propriedade${total === 1 ? '' : 's'} encontrada${total === 1 ? '' : 's'}`
            : ''}
      </SectionSubtitle>

      {loading && properties.length === 0 ? (
        <PropertiesGrid container spacing={{ xs: 2, sm: 3, md: 3 }}>
          <PropertyCardShimmer count={12} />
        </PropertiesGrid>
      ) : properties.length === 0 ? (
        <EmptyContainer>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Nenhuma propriedade encontrada
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Tente ajustar os filtros ou selecionar outra localização
          </Typography>
        </EmptyContainer>
      ) : (
        <>
          <PropertiesGrid container spacing={{ xs: 2, sm: 3, md: 3 }}>
            {properties.map((property) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={property.id}>
                <PropertyCard
                  property={property}
                  onClick={() => handlePropertyClick(property)}
                />
              </Grid>
            ))}
          </PropertiesGrid>

          {/* Trigger para scroll infinito */}
          {hasMore && (
            <LoadMoreTrigger ref={observerTarget}>
              {loadingMore && (
                <PropertiesGrid container spacing={{ xs: 2, sm: 3, md: 3 }} sx={{ mt: 2 }}>
                  <PropertyCardShimmer count={3} />
                </PropertiesGrid>
              )}
            </LoadMoreTrigger>
          )}

          {/* Mensagem quando não há mais propriedades */}
          {!hasMore && properties.length > 0 && (
            <EndMessage>
              <EndMessageTitle variant="h5">
                🎉 Você viu todas as propriedades!
              </EndMessageTitle>
              <EndMessageSubtitle variant="body1">
                Explore nossas outras opções ou ajuste os filtros para encontrar mais imóveis
              </EndMessageSubtitle>
            </EndMessage>
          )}
        </>
      )}
    </ContainerWrapper>
  )
}

