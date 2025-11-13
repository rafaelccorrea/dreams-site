import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, IconButton, Card, CardContent, CardMedia } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import styled from 'styled-components'
import { getFeaturedProperties, Property } from '../../services/propertyService'
import { PropertyCard } from '../PropertyCard'
import { ShimmerBase } from '../Shimmer'
import { useLocation } from '../../contexts/LocationContext'

const FeaturedContainer = styled(Box)`
  width: 100%;
  padding-top: ${({ theme }) => theme.spacing['2xl']};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  z-index: 2;
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
  padding-left: ${({ theme }) => theme.spacing.lg};
  padding-right: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: visible !important;
  
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
    border-radius: ${({ theme }) => theme.borderRadius.lg};
  }
`

const ContentWrapper = styled(Box)`
  position: relative;
  z-index: 1;
  width: 100%;
  overflow: visible !important;
`

const SectionHeader = styled(Box)`
  margin-bottom: 0;
  padding-left: 0;
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
  margin-top: ${({ theme }) => theme.spacing.md};
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing.lg};
  font-size: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-left: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing['2xl'] || '48px'};
  }
`

const CarouselContainer = styled(Box)`
  position: relative;
  width: 100%;
  padding-left: 0;
  padding-right: 0;
  margin-bottom: 0;
  overflow: hidden !important;

  /* Máscara de fade nas laterais para cards sumirem gradualmente */
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 60px;
    z-index: 5;
    pointer-events: none;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, ${({ theme }) => theme.colors.background}, transparent);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, ${({ theme }) => theme.colors.background}, transparent);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-left: 0;
    padding-right: 0;
    
    &::before,
    &::after {
      width: 40px;
    }
  }
`

const CarouselScroll = styled(Box)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  padding-left: ${({ theme }) => theme.spacing.lg};
  padding-right: ${({ theme }) => theme.spacing.lg};
  position: relative;
  
  /* Esconder scrollbar completamente */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.md};
    padding-right: ${({ theme }) => theme.spacing.md};
  }
`

const CardWrapper = styled(Box)`
  flex: 0 0 380px;
  min-width: 380px;
  max-width: 380px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: 0 0 320px;
    min-width: 320px;
    max-width: 320px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex: 0 0 280px;
    min-width: 280px;
    max-width: 280px;
  }
`

const NavigationButton = styled(IconButton)<{ $position: 'start' | 'end' }>`
  position: absolute !important;
  /* Altura da imagem (250px) + padding (24px) + título (24px) + margin título (8px) + endereço (16px) + margin endereço (16px) + metade da descrição (~12px) */
  top: calc(250px + 24px + 24px + 8px + 16px + 16px + 12px) !important;
  ${({ $position }) => 
    $position === 'start' 
      ? `left: 10px !important;` 
      : `right: 10px !important;`
  }
  transform: translateY(-50%);
  background: ${({ theme }) => theme.colors.primary} !important;
  backdrop-filter: blur(10px);
  z-index: 1000 !important;
  box-shadow: ${({ theme }) => theme.shadows.md} !important;
  color: white !important;
  width: 48px !important;
  height: 48px !important;
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight} !important;
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed;
    pointer-events: auto !important;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 40px !important;
    height: 40px !important;
    top: calc(250px + 16px + 24px + 8px + 16px + 16px + 12px) !important;
    ${({ $position }) => 
      $position === 'start' 
        ? `left: 10px !important;` 
        : `right: 10px !important;`
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    top: calc(200px + 16px + 24px + 8px + 16px + 16px + 12px) !important;
  }
`

const ShimmerCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const ShimmerCardMedia = styled(CardMedia)`
  height: 250px;
  position: relative;
  overflow: hidden;
`

const ShimmerImage = styled(ShimmerBase)`
  width: 100%;
  height: 100%;
`

const ShimmerPriceBadge = styled(ShimmerBase)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  width: 100px;
  height: 35px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const ShimmerCardContent = styled(CardContent)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.lg};
`

const ShimmerTitle = styled(ShimmerBase)`
  height: 24px;
  width: 80%;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const ShimmerAddress = styled(ShimmerBase)`
  height: 16px;
  width: 60%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const ShimmerDescription = styled(ShimmerBase)`
  height: 16px;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  &:nth-child(2) {
    width: 90%;
  }
`

const ShimmerFeatures = styled(Box)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const ShimmerFeature = styled(ShimmerBase)`
  height: 20px;
  width: 80px;
`

const ShimmerChips = styled(Box)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  margin-top: auto;
`

const ShimmerChip = styled(ShimmerBase)`
  height: 24px;
  width: 90px;
  border-radius: 12px;
`

const CarouselShimmerCard = () => (
  <ShimmerCard>
    <ShimmerCardMedia>
      <ShimmerImage />
      <ShimmerPriceBadge />
    </ShimmerCardMedia>
    <ShimmerCardContent>
      <ShimmerTitle />
      <ShimmerAddress />
      <ShimmerDescription />
      <ShimmerDescription />
      <ShimmerFeatures>
        <ShimmerFeature />
        <ShimmerFeature />
        <ShimmerFeature />
      </ShimmerFeatures>
      <ShimmerChips>
        <ShimmerChip />
        <ShimmerChip />
        <ShimmerChip />
      </ShimmerChips>
    </ShimmerCardContent>
  </ShimmerCard>
)

export const FeaturedProperties = () => {
  const navigate = useNavigate()
  const { location, isLocationConfirmed } = useLocation()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isUserInteractingRef = useRef(false)
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (location?.city && isLocationConfirmed) {
      loadFeaturedProperties()
    } else {
      setProperties([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.city, isLocationConfirmed])

  const loadFeaturedProperties = async () => {
    if (!location?.city) return

    setLoading(true)
    try {
      const result = await getFeaturedProperties(location.city, {
        limit: 6,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      })
      setProperties(result.properties || [])
    } catch (error) {
      console.error('Erro ao carregar propriedades em destaque:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handlePropertyClick = (property: Property) => {
    navigate(`/imovel/${property.id}`)
  }

  const checkScrollButtons = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      const scrollableWidth = scrollWidth - clientWidth
      // Desabilita botão esquerdo quando está no início
      setCanScrollLeft(scrollLeft > 5)
      // Desabilita botão direito quando está no fim
      setCanScrollRight(scrollLeft < scrollableWidth - 5)
    }
  }, [])

  // Função para iniciar auto-scroll
  const startAutoScroll = useCallback(() => {
    // Limpa qualquer intervalo existente
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current)
      autoScrollIntervalRef.current = null
    }
    
    // Limpa qualquer timeout de reset pendente
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current)
      resetTimeoutRef.current = null
    }
    
    autoScrollIntervalRef.current = setInterval(() => {
      if (scrollRef.current && !isUserInteractingRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        const maxScroll = scrollWidth - clientWidth
        
        // Se não há scroll disponível, não faz nada
        if (maxScroll <= 0) {
          return
        }
        
        // Verifica se já está no fim com uma margem maior
        if (scrollLeft >= maxScroll - 2) {
          // Para o intervalo antes de resetar
          if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current)
            autoScrollIntervalRef.current = null
          }
          
          // Aguarda um pouco antes de resetar para evitar loop
          resetTimeoutRef.current = setTimeout(() => {
            if (scrollRef.current && !isUserInteractingRef.current) {
              const currentScroll = scrollRef.current.scrollLeft
              const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth
              
              // Animação de retrocesso rápida
              const startTime = Date.now()
              const duration = 600 // 600ms para retrocesso rápido
              
              const animate = () => {
                if (!scrollRef.current || isUserInteractingRef.current) {
                  resetTimeoutRef.current = null
                  return
                }
                
                const elapsed = Date.now() - startTime
                const progress = Math.min(elapsed / duration, 1)
                
                // Easing function para animação suave
                const easeOut = 1 - Math.pow(1 - progress, 3)
                
                scrollRef.current.scrollLeft = currentScroll - (currentScroll * easeOut)
                
                if (progress < 1) {
                  requestAnimationFrame(animate)
                } else {
                  // Garante que chegou no início
                  scrollRef.current.scrollLeft = 0
                  // Aguarda um pouco antes de reiniciar o auto-scroll
                  setTimeout(() => {
                    if (!isUserInteractingRef.current && scrollRef.current) {
                      startAutoScroll()
                    }
                  }, 200)
                  resetTimeoutRef.current = null
                }
              }
              
              requestAnimationFrame(animate)
            }
          }, 300)
          return
        }
        
        // Move lentamente para a direita
        scrollRef.current.scrollLeft = scrollLeft + 0.5
      }
    }, 30)
  }, [])

  // Pausar auto-scroll quando usuário interagir
  const handleUserInteraction = useCallback(() => {
    isUserInteractingRef.current = true
    
    // Limpa o intervalo de auto-scroll
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current)
      autoScrollIntervalRef.current = null
    }
    
    // Limpa qualquer timeout de retomada pendente
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
      resumeTimeoutRef.current = null
    }
    
    // Limpa qualquer timeout de reset pendente
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current)
      resetTimeoutRef.current = null
    }
    
    // Retoma após 5 segundos de inatividade
    resumeTimeoutRef.current = setTimeout(() => {
      isUserInteractingRef.current = false
      if (scrollRef.current && properties.length > 0) {
        startAutoScroll()
      }
      resumeTimeoutRef.current = null
    }, 5000)
  }, [startAutoScroll, properties.length])

  const scrollLeft = () => {
    handleUserInteraction()
    if (scrollRef.current) {
      // Calcula a largura do card baseado no tamanho da tela
      const containerWidth = scrollRef.current.clientWidth
      let cardWidth = 380 // desktop
      let gap = 24 // theme.spacing.lg
      
      if (containerWidth <= 600) {
        // mobile
        cardWidth = 280
        gap = 16 // theme.spacing.md
      } else if (containerWidth <= 960) {
        // tablet
        cardWidth = 320
        gap = 16 // theme.spacing.md
      }
      
      // Scroll por um card completo + gap
      const scrollAmount = cardWidth + gap
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    handleUserInteraction()
    if (scrollRef.current) {
      // Calcula a largura do card baseado no tamanho da tela
      const containerWidth = scrollRef.current.clientWidth
      let cardWidth = 380 // desktop
      let gap = 24 // theme.spacing.lg
      
      if (containerWidth <= 600) {
        // mobile
        cardWidth = 280
        gap = 16 // theme.spacing.md
      } else if (containerWidth <= 960) {
        // tablet
        cardWidth = 320
        gap = 16 // theme.spacing.md
      }
      
      // Scroll por um card completo + gap
      const scrollAmount = cardWidth + gap
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    // Aguarda um pouco para garantir que o DOM foi renderizado
    const timeoutId = setTimeout(() => {
      checkScrollButtons()
    }, 100)
    
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons)
      window.addEventListener('resize', checkScrollButtons)
      return () => {
        clearTimeout(timeoutId)
        scrollElement.removeEventListener('scroll', checkScrollButtons)
        window.removeEventListener('resize', checkScrollButtons)
      }
    }
    
    return () => {
      clearTimeout(timeoutId)
    }
  }, [properties, loading, checkScrollButtons])

  // Auto-scroll lento
  useEffect(() => {
    if (loading || properties.length === 0) {
      // Limpa o intervalo se estiver carregando ou sem propriedades
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
        autoScrollIntervalRef.current = null
      }
      return
    }

    // Aguarda um pouco antes de iniciar para garantir que o DOM foi renderizado
    const timeoutId = setTimeout(() => {
      // Verifica novamente se ainda há propriedades e não está interagindo
      if (properties.length > 0 && !isUserInteractingRef.current) {
        startAutoScroll()
      }
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
        autoScrollIntervalRef.current = null
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
        resetTimeoutRef.current = null
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
        resumeTimeoutRef.current = null
      }
    }
  }, [loading, properties, startAutoScroll])

  // Não renderiza nada se não houver localização confirmada
  if (!isLocationConfirmed || !location?.city) {
    return null
  }

  // Não renderiza nada se não houver propriedades em destaque
  if (!loading && properties.length === 0) {
    return null
  }

  return (
    <FeaturedContainer>
      <ContentWrapper>
        <SectionHeader>
          <Box>
            <SectionTitle variant="h3">
              Propriedades em Destaque
            </SectionTitle>
            <SectionSubtitle variant="body1">
              Imóveis selecionados especialmente para você
            </SectionSubtitle>
          </Box>
        </SectionHeader>

        {loading ? (
          <CarouselContainer>
            <CarouselScroll>
              {[...Array(6)].map((_, index) => (
                <CardWrapper key={index}>
                  <CarouselShimmerCard />
                </CardWrapper>
              ))}
            </CarouselScroll>
          </CarouselContainer>
        ) : (
          <Box sx={{ position: 'relative', width: '100%' }}>
            <CarouselContainer>
              <CarouselScroll 
                ref={scrollRef}
                onMouseEnter={handleUserInteraction}
                onMouseLeave={() => {
                  // Não faz nada ao sair do mouse, apenas pausa ao entrar
                }}
                onTouchStart={handleUserInteraction}
                onWheel={handleUserInteraction}
              >
                {properties.map((property) => (
                  <CardWrapper key={property.id}>
                    <PropertyCard
                      property={property}
                      onClick={() => handlePropertyClick(property)}
                    />
                  </CardWrapper>
                ))}
              </CarouselScroll>
            </CarouselContainer>
            <NavigationButton
              $position="start"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft />
            </NavigationButton>
            <NavigationButton
              $position="end"
              onClick={scrollRight}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight />
            </NavigationButton>
          </Box>
        )}
      </ContentWrapper>
    </FeaturedContainer>
  )
}

