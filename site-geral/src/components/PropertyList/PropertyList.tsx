import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
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
  margin-top: ${({ theme }) => theme.spacing.md};
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
  margin-bottom: ${({ theme }) => theme.spacing['3xl'] || '64px'};
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing.lg};
  font-size: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-left: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing['2xl'] || '48px'};
  }
`

const PropertiesGrid = styled(Grid)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const EmptyContainer = styled(Box)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  min-height: 400px;
  justify-content: center;
`

const EmptyImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  opacity: 0.8;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 300px;
  }
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

const ClearFiltersContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }
`

const ClearFiltersButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: ${({ theme }) => theme.borderRadius.md || '8px'};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    border-color: rgba(0, 0, 0, 0.12);
    color: ${({ theme }) => theme.colors.textPrimary};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }

  svg {
    font-size: 1rem;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: rotate(90deg);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    font-size: 0.8125rem;
  }
`

interface PropertyListProps {
  filters?: Omit<PropertySearchFilters, 'city' | 'state' | 'page' | 'limit'>
  shouldLoad?: boolean // Flag para controlar quando deve carregar
  onClearFilters?: () => void // Callback para limpar filtros
}

export const PropertyList = ({ filters, shouldLoad = true, onClearFilters }: PropertyListProps) => {
  const navigate = useNavigate()
  const { location, isLocationConfirmed } = useLocation()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFiltersRef = useRef<typeof filters>(undefined)
  const shouldScrollRef = useRef(false)

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

      // Manter 'search' para enviar para a API (usado para transaction type)
      // A API suporta o parâmetro 'search' para filtrar por tipo de transação
      const result = await searchProperties(searchFilters)
      
      // Filtrar por tipo de transação (venda ou locação) se especificado no front-end também
      // Isso garante que mesmo se a API não filtrar corretamente, o front-end filtra
      let filteredProperties = result.properties
      if (filters?.search === 'sale') {
        filteredProperties = result.properties.filter(p => p.salePrice && Number(p.salePrice) > 0)
      } else if (filters?.search === 'rent') {
        filteredProperties = result.properties.filter(p => p.rentPrice && Number(p.rentPrice) > 0)
      }

      // Recalcular total baseado nos filtros
      const totalFiltered = filters?.search 
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
      const previousFiltersString = previousFiltersRef.current 
        ? JSON.stringify(previousFiltersRef.current) 
        : 'undefined'
      const currentFiltersString = filters 
        ? JSON.stringify(filters) 
        : 'undefined'
      const filtersChanged = previousFiltersString !== currentFiltersString
      
      // Marcar para fazer scroll se filtros foram aplicados (mudaram ou é a primeira vez)
      const filtersApplied = filters !== undefined && (
        previousFiltersRef.current === undefined || 
        filtersChanged
      )
      
      shouldScrollRef.current = filtersApplied
      
      // Sempre resetar e recarregar para permitir múltiplas buscas, mesmo com os mesmos filtros
      setProperties([])
      setPage(1)
      setTotal(0)
      setHasMore(false)
      
      // Atualizar referência dos filtros
      previousFiltersRef.current = filters
      
      // Carregar propriedades da nova cidade ou com novos filtros
      loadProperties(1, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.city, location?.state, isLocationConfirmed, shouldLoad, filters])

  // Fazer scroll quando as propriedades forem carregadas após aplicar filtros
  useEffect(() => {
    // Só fazer scroll se:
    // 1. Está marcado para fazer scroll (filtros foram aplicados)
    // 2. Não está mais carregando (propriedades foram carregadas)
    // 3. Container existe
    if (
      shouldScrollRef.current && 
      !loading && 
      !loadingMore && 
      containerRef.current
    ) {
      // Aguardar um pouco para garantir que o DOM foi atualizado e renderizado
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          })
          // Resetar flag após fazer scroll
          shouldScrollRef.current = false
        }
      }, 800) // Delay aumentado para garantir que o conteúdo foi renderizado completamente
    }
  }, [loading, loadingMore, properties.length, total])

  // Intersection Observer para scroll infinito - carrega automaticamente quando está próximo do fim
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '800px', // Aumentado para carregar quando estiver a 800px do fim
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

  // Verificação adicional de scroll para carregar automaticamente quando próximo do fim
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || loading || !hasMore) return

      const scrollPosition = window.innerHeight + window.scrollY
      const documentHeight = document.documentElement.scrollHeight
      const distanceFromBottom = documentHeight - scrollPosition

      // Carrega quando estiver a 1000px do fim
      if (distanceFromBottom < 1000) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasMore, loadingMore, loading, loadMore])

  const handlePropertyClick = (property: Property) => {
    navigate(`/imovel/${property.id}`)
  }

  // Verificar se há filtros aplicados
  const hasFilters = filters && Object.keys(filters).length > 0

  // Função para contar quantos filtros estão ativos
  const getActiveFiltersCount = () => {
    if (!filters) return 0
    return Object.keys(filters).filter(key => {
      const value = filters[key as keyof typeof filters]
      return value !== undefined && value !== null && value !== ''
    }).length
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

      {/* Botão de limpar filtros */}
      {hasFilters && onClearFilters && (
        <ClearFiltersContainer>
          <ClearFiltersButton onClick={onClearFilters}>
            <CloseIcon />
            Limpar filtros {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
          </ClearFiltersButton>
        </ClearFiltersContainer>
      )}

      {loading && properties.length === 0 ? (
        <PropertiesGrid container spacing={{ xs: 2, sm: 3, md: 3 }}>
          <PropertyCardShimmer count={12} />
        </PropertiesGrid>
      ) : properties.length === 0 ? (
        <EmptyContainer>
          <EmptyImage src="/not_found.png" alt="Nenhuma propriedade encontrada" />
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

