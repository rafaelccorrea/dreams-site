import { useState, useMemo, useEffect } from 'react'
import { IconButton, Box } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import styled from 'styled-components'

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  overflow: visible !important;
  background: ${({ theme }) => theme.colors.neutralLight};
  
  /* Garante que os botões não sejam cortados */
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 60px;
    z-index: 99;
    pointer-events: none;
  }
  
  &::before {
    left: 0;
  }
  
  &::after {
    right: 0;
  }
`

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CarouselImage = styled.img<{ $isActive: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
  position: ${({ $isActive }) => ($isActive ? 'relative' : 'absolute')};
  top: 0;
  left: 0;
  transition: opacity 0.3s ease;
`

const NavigationButton = styled(IconButton)`
  position: absolute !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  background: white !important;
  color: ${({ theme }) => theme.colors.primary} !important;
  z-index: 100 !important;
  transition: all 0.3s ease;
  width: 50px !important;
  height: 50px !important;
  min-width: 50px !important;
  min-height: 50px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6) !important;
  border: 2px solid ${({ theme }) => theme.colors.primary} !important;
  border-radius: 50% !important;
  opacity: 1 !important;
  visibility: visible !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  pointer-events: auto !important;

  &:hover {
    background: ${({ theme }) => theme.colors.primary} !important;
    color: white !important;
    transform: translateY(-50%) scale(1.2) !important;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.8) !important;
    border-color: ${({ theme }) => theme.colors.primaryDark} !important;
  }

  &:active {
    transform: translateY(-50%) scale(0.9) !important;
  }

  &.left {
    left: 12px !important;
  }

  &.right {
    right: 12px !important;
  }

  &:disabled {
    opacity: 0.3 !important;
    cursor: not-allowed !important;
  }

  svg {
    font-size: 1.5rem !important;
    font-weight: 700 !important;
  }
`

const ImageCounter = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.xs};
  right: ${({ theme }) => theme.spacing.xs};
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: white;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
`

const DotIndicator = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.xs};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  z-index: 2;
`

const Dot = styled.div<{ $isActive: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $isActive, theme }) =>
    $isActive ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.8);
  }
`

interface PropertyCardCarouselProps {
  images: string[]
}

export const PropertyCardCarousel = ({ images }: PropertyCardCarouselProps) => {
  // Usa as imagens que vêm do PropertyCard
  // Mantém TODAS as imagens, mesmo que URLs sejam iguais
  const allImages = useMemo(() => {
    // Remove apenas valores vazios, mantém todas as URLs (mesmo que sejam iguais)
    return images.filter(img => img && img.trim() !== '')
  }, [images])
  
  console.log(`[PropertyCardCarousel] Recebeu ${images.length} imagens, ${allImages.length} após filtrar vazias`)

  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Reseta o índice quando as imagens mudarem
  useEffect(() => {
    setCurrentIndex(0)
  }, [images.length])

  // Se não há imagens, mostra placeholder
  if (!allImages || allImages.length === 0) {
    return (
      <CarouselContainer>
        <CarouselImage
          src="https://via.placeholder.com/400x250?text=Sem+Imagem"
          alt="Sem imagem"
          $isActive={true}
        />
      </CarouselContainer>
    )
  }

  // Se só tem uma imagem, não mostra controles
  if (allImages.length === 1) {
    return (
      <CarouselContainer>
        <CarouselImage
          src={allImages[0] || 'https://via.placeholder.com/400x250?text=Sem+Imagem'}
          alt="Propriedade"
          $isActive={true}
        />
      </CarouselContainer>
    )
  }

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex(index)
  }

  return (
    <CarouselContainer>
      <ImageWrapper>
        {allImages.map((image, index) => (
          <CarouselImage
            key={index}
            src={image || 'https://via.placeholder.com/400x250?text=Sem+Imagem'}
            alt={`Propriedade ${index + 1}`}
            $isActive={index === currentIndex}
          />
        ))}
      </ImageWrapper>

      <NavigationButton
        className="left nav-button"
        onClick={goToPrevious}
        aria-label="Imagem anterior"
      >
        <ChevronLeft />
      </NavigationButton>
      <NavigationButton
        className="right nav-button"
        onClick={goToNext}
        aria-label="Próxima imagem"
      >
        <ChevronRight />
      </NavigationButton>

      <ImageCounter>
        {currentIndex + 1} / {allImages.length}
      </ImageCounter>

      <DotIndicator>
        {allImages.map((_, index) => (
          <Dot
            key={index}
            $isActive={index === currentIndex}
            onClick={(e) => goToImage(index, e)}
            aria-label={`Ir para imagem ${index + 1}`}
          />
        ))}
      </DotIndicator>
    </CarouselContainer>
  )
}

