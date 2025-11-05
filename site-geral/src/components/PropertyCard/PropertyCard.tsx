import { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import styled from 'styled-components'
import { Bed, Bathtub, SquareFoot } from '@mui/icons-material'
import { Property, getPropertyImages } from '../../services/propertyService'
import { formatPrice, formatArea } from '../../utils/formatPrice'
import { PropertyCardCarousel } from './PropertyCardCarousel'
import { FavoriteButton } from '../FavoriteButton'
import { ShareButton } from '../ShareButton'

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`

const ImageContainer = styled.div`
  height: 250px;
  position: relative;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 200px;
  }
`

const ActionButtonsContainer = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  left: ${({ theme }) => theme.spacing.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  z-index: 4;
  pointer-events: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    top: ${({ theme }) => theme.spacing.sm};
    left: ${({ theme }) => theme.spacing.sm};
    gap: ${({ theme }) => theme.spacing.xs};
  }
`

const ActionButtonWrapper = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all 0.3s ease;
  pointer-events: auto;

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }
`

const PriceBadge = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 3;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.9rem;
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    top: ${({ theme }) => theme.spacing.sm};
    right: ${({ theme }) => theme.spacing.sm};
  }
`

const PriceBadgeItem = styled.div<{ $isSecondary?: boolean }>`
  background: ${({ theme, $isSecondary }) => $isSecondary ? 'rgba(0, 0, 0, 0.7)' : theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 700;
  font-size: ${({ $isSecondary }) => $isSecondary ? '0.85rem' : '1.1rem'};
  box-shadow: ${({ theme }) => theme.shadows.md};
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ $isSecondary }) => $isSecondary ? '0.75rem' : '0.9rem'};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  }
`

const PriceContainer = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  z-index: 3;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    top: ${({ theme }) => theme.spacing.sm};
    right: ${({ theme }) => theme.spacing.sm};
    gap: ${({ theme }) => theme.spacing.xs};
  }
`

const CardContentStyled = styled(CardContent)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`

const Title = styled(Typography)`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1rem;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
`

const Address = styled(Typography)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const FeaturesContainer = styled(Box)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`

const FeatureItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`

const FeaturesList = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: auto;
`

const StyledChip = styled(Chip)`
  font-size: 0.75rem;
  height: 24px;
`

interface PropertyCardProps {
  property: Property
  onClick?: () => void
}

export const PropertyCard = ({ property, onClick }: PropertyCardProps) => {
  const [images, setImages] = useState<string[]>([])
  const [loadingImages, setLoadingImages] = useState(false)

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      house: 'Casa',
      apartment: 'Apartamento',
      commercial: 'Comercial',
      land: 'Terreno',
      rural: 'Rural',
    }
    return types[type] || type
  }
  
  // Determina quais preços mostrar (venda e/ou aluguel)
  const hasSalePrice = property.salePrice && Number(property.salePrice) > 0
  const hasRentPrice = property.rentPrice && Number(property.rentPrice) > 0

  // Buscar todas as imagens se houver imagens
  useEffect(() => {
    // Reseta imagens quando a propriedade muda
    setImages([])
    setLoadingImages(false)

    if (property.imageCount > 0) {
      const mainImageUrl = property.mainImage?.url || property.mainImage?.thumbnailUrl
      
      // SEMPRE busca todas as imagens da API quando há imagens
      setLoadingImages(true)
      
      // Usa setTimeout para evitar múltiplas chamadas simultâneas
      const timeoutId = setTimeout(() => {
        getPropertyImages(property.id)
          .then((allImages) => {
            // getPropertyImages retorna um array de strings (URLs) mantendo TODAS as imagens
            // Apenas adiciona a mainImage se não estiver presente
            const combinedImages: string[] = []
            
            // Adiciona TODAS as imagens da API (mantendo todas, mesmo que URLs sejam iguais)
            if (allImages && allImages.length > 0) {
              combinedImages.push(...allImages)
            }
            
            // Adiciona a mainImage primeiro na lista se existir e não estiver nas imagens
            if (mainImageUrl && !combinedImages.includes(mainImageUrl)) {
              combinedImages.unshift(mainImageUrl)
            }
            
            // Se não conseguiu combinar imagens, usa pelo menos a principal
            if (combinedImages.length === 0 && mainImageUrl) {
              combinedImages.push(mainImageUrl)
            }
            
            console.log(`Property ${property.id}: API retornou ${allImages?.length || 0} URLs, ${combinedImages.length} após adicionar mainImage`)
            setImages(combinedImages)
          })
          .catch((error) => {
            console.error('Erro ao carregar imagens:', error)
            // Se falhar, usa a imagem principal se disponível
            if (mainImageUrl) {
              setImages([mainImageUrl])
            }
          })
          .finally(() => {
            setLoadingImages(false)
          })
      }, 100) // Delay pequeno para evitar chamadas simultâneas
      
      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [property.id, property.imageCount])

  return (
    <StyledCard onClick={onClick}>
      <ImageContainer>
        <PropertyCardCarousel images={images} />
        {/* Botões de ação - Favoritar e Compartilhar */}
        <ActionButtonsContainer
          onClick={(e) => {
            // Prevenir propagação do clique nos botões de ação
            e.stopPropagation()
          }}
        >
          <ActionButtonWrapper>
            <FavoriteButton
              propertyId={property.id}
              size="small"
              showTooltip={true}
            />
          </ActionButtonWrapper>
          <ActionButtonWrapper>
            <ShareButton
              propertyId={property.id}
              propertyTitle={property.title}
              size="small"
              showTooltip={true}
            />
          </ActionButtonWrapper>
        </ActionButtonsContainer>
        {/* Preço */}
        {hasSalePrice && hasRentPrice ? (
          <PriceContainer>
            <PriceBadgeItem>{formatPrice(property.salePrice)}</PriceBadgeItem>
            <PriceBadgeItem $isSecondary>Aluguel: {formatPrice(property.rentPrice)}</PriceBadgeItem>
          </PriceContainer>
        ) : hasSalePrice ? (
          <PriceBadge>{formatPrice(property.salePrice)}</PriceBadge>
        ) : hasRentPrice ? (
          <PriceBadge>Aluguel: {formatPrice(property.rentPrice)}</PriceBadge>
        ) : null}
      </ImageContainer>
      <CardContentStyled>
        <Title variant="h6">{property.title}</Title>
        <Address variant="body2">
          {property.neighborhood || property.street}
          {property.number && `, ${property.number}`}
          {property.complement && ` - ${property.complement}`}
          {`, ${property.city} - ${property.state}`}
        </Address>

        {property.description && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {property.description}
          </Typography>
        )}

        <FeaturesContainer>
          {property.bedrooms > 0 && (
            <FeatureItem>
              <Bed fontSize="small" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}</span>
            </FeatureItem>
          )}
          {property.bathrooms > 0 && (
            <FeatureItem>
              <Bathtub fontSize="small" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'banheiro' : 'banheiros'}</span>
            </FeatureItem>
          )}
          {property.totalArea && Number(property.totalArea) > 0 && (
            <FeatureItem>
              <SquareFoot fontSize="small" />
              <span>{formatArea(property.totalArea)} m² total</span>
            </FeatureItem>
          )}
          {property.builtArea && Number(property.builtArea) > 0 && 
           Number(property.builtArea) !== Number(property.totalArea) && (
            <FeatureItem>
              <SquareFoot fontSize="small" />
              <span>{formatArea(property.builtArea)} m² construídos</span>
            </FeatureItem>
          )}
        </FeaturesContainer>

        <FeaturesList>
          <StyledChip label={getTypeLabel(property.type)} size="small" color="primary" />
          {property.parkingSpaces > 0 && (
            <StyledChip
              label={`${property.parkingSpaces} ${property.parkingSpaces === 1 ? 'vaga' : 'vagas'}`}
              size="small"
            />
          )}
          {property.isFeatured && (
            <StyledChip label="Destaque" size="small" color="secondary" />
          )}
        </FeaturesList>

        {/* Features da propriedade */}
        {property.features && property.features.length > 0 && (
          <Box sx={{ mt: 1, mb: 1 }}>
            {property.features.slice(0, 3).map((feature, index) => (
              <StyledChip
                key={index}
                label={feature}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
            {property.features.length > 3 && (
              <StyledChip
                label={`+${property.features.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            )}
          </Box>
        )}

        {/* Informações adicionais */}
        {(property.condominiumFee || property.iptu) && (
          <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
            {property.condominiumFee && Number(property.condominiumFee) > 0 && (
              <Typography variant="caption" display="block">
                Condomínio: {formatPrice(property.condominiumFee)}
              </Typography>
            )}
            {property.iptu && Number(property.iptu) > 0 && (
              <Typography variant="caption" display="block">
                IPTU: {formatPrice(property.iptu)}
              </Typography>
            )}
          </Box>
        )}
        
        {/* Status da propriedade */}
        {property.code && (
          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
            Código: {property.code}
          </Typography>
        )}

        {/* Informações da Imobiliária */}
        {property.company && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
              {property.company.name}
            </Typography>
          </Box>
        )}
      </CardContentStyled>
    </StyledCard>
  )
}

