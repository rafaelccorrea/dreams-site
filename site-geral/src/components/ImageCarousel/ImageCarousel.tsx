import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { IconButton, Button, Dialog, Box, Grid } from '@mui/material'
import { ChevronLeft, ChevronRight, Close, ZoomIn, ZoomOut } from '@mui/icons-material'
import styled, { keyframes } from 'styled-components'



const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: high-quality;
  image-rendering: auto;
  image-rendering: -moz-crisp-edges;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
  cursor: pointer;
  transition: transform 0.3s ease;
  /* Melhora a qualidade da renderização */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* Força renderização de alta qualidade */
  will-change: transform;

  &:hover {
    transform: scale(1.02);
  }
`

const MainImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
`


const Thumbnail = styled.div<{ $isActive: boolean; $hasBlur?: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${({ $isActive }) => ($isActive ? '#212121' : 'transparent')};
  transition: all 0.3s ease;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.7)};
  background: ${({ theme }) => theme.colors.neutralLight};

  &:hover {
    opacity: 1;
    border-color: #212121;
    transform: scale(1.02);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    image-rendering: high-quality;
    image-rendering: auto;
    image-rendering: -moz-crisp-edges;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transform: translateZ(0);
    /* Melhora a qualidade da renderização */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* Força renderização de alta qualidade */
    will-change: transform;
    filter: ${({ $hasBlur }) => ($hasBlur ? 'blur(4px)' : 'none')};
  }
`

const NavigationButton = styled(IconButton)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 2;
  transition: all 0.3s ease;
  color: #212121;

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-50%) scale(1.1);
  }

  &.left {
    left: ${({ theme }) => theme.spacing.md};
  }

  &.right {
    right: ${({ theme }) => theme.spacing.md};
  }

  &:disabled {
    opacity: 0.3;
  }
`

const ImageCounter = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.md};
  left: ${({ theme }) => theme.spacing.md};
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: white;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 600;
  z-index: 2;
`

const ViewMoreButton = styled(Button)`
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  background: rgba(0, 0, 0, 0.8) !important;
  backdrop-filter: blur(10px) !important;
  color: white !important;
  text-transform: none !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg} !important;
  border-radius: ${({ theme }) => theme.borderRadius.md} !important;
  z-index: 10 !important;
  pointer-events: all !important;
  visibility: visible !important;
  opacity: 1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  &:hover {
    background: rgba(0, 0, 0, 0.9) !important;
    transform: translate(-50%, -50%) scale(1.05) !important;
  }
`

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: #000;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const ModalImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  overflow: hidden;
  touch-action: none;
  user-select: none;
`

const ModalImageWrapper = styled.div<{ $scale: number; $translateX: number; $translateY: number }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(${({ $translateX }) => $translateX}px, ${({ $translateY }) => $translateY}px) scale(${({ $scale }) => $scale});
  transition: ${({ $scale }) => ($scale === 1 ? 'transform 0.3s ease-out' : 'none')};
  cursor: ${({ $scale }) => ($scale > 1 ? 'move' : 'zoom-in')};
`

const ModalImage = styled.img<{ $isLoading?: boolean }>`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: high-quality;
  image-rendering: auto;
  image-rendering: -moz-crisp-edges;
  animation: ${fadeIn} 0.3s ease-out;
  opacity: ${({ $isLoading }) => ($isLoading ? 0.5 : 1)};
  transition: opacity 0.2s ease;
  /* Melhora a qualidade da renderização */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* Força renderização de alta qualidade */
  will-change: transform;
  /* Garante que a imagem seja renderizada em alta resolução */
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
`

const ModalNavigationButton = styled(IconButton)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 10;
  color: #212121;
  transition: all 0.3s ease;
  width: 48px;
  height: 48px;

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-50%) scale(1.15);
  }

  &.left {
    left: ${({ theme }) => theme.spacing.lg};
  }

  &.right {
    right: ${({ theme }) => theme.spacing.lg};
  }

  &:disabled {
    opacity: 0.3;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    
    &.left {
      left: ${({ theme }) => theme.spacing.md};
    }

    &.right {
      right: ${({ theme }) => theme.spacing.md};
    }
  }
`

const ZoomControls = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xs};
`

const ZoomButton = styled(IconButton)`
  color: white;
  padding: ${({ theme }) => theme.spacing.xs};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(0, 0, 0, 0.8);
  color: white;
`

const ModalCounter = styled.div`
  color: white;
  font-size: 1rem;
  font-weight: 600;
`

const ModalThumbnails = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(0, 0, 0, 0.8);
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.primary} rgba(0, 0, 0, 0.3);

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 3px;

    &:hover {
      background: ${({ theme }) => theme.colors.primaryDark};
    }
  }
`

const ModalThumbnail = styled.div<{ $isActive: boolean }>`
  min-width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  cursor: pointer;
  border: 3px solid ${({ $isActive }) => ($isActive ? '#3370A6' : 'transparent')};
  transition: all 0.3s ease;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.7)};

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

interface ImageCarouselProps {
  images: string[]
  mainImage?: string
}

export const ImageCarousel = ({ images, mainImage }: ImageCarouselProps) => {
  const allImages = useMemo(() => {
    // Mantém TODAS as imagens, mesmo que URLs sejam iguais
    const result: string[] = []
    
    // Adiciona mainImage primeiro se existir e não estiver no array images
    if (mainImage && mainImage.trim() !== '' && !images.includes(mainImage)) {
      result.push(mainImage)
    }
    
    // Adiciona TODAS as imagens, mantendo a ordem e duplicatas
    images.forEach((img) => {
      if (img && img.trim() !== '') {
        result.push(img)
      }
    })
    
    return result
  }, [images, mainImage])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageLoading, setImageLoading] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Reseta o índice quando as imagens mudarem
  useEffect(() => {
    setCurrentIndex(0)
    setModalIndex(0)
  }, [images.length, mainImage])

  const goToModalPrevious = useCallback(() => {
    setModalIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }, [allImages.length])

  const goToModalNext = useCallback(() => {
    setModalIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }, [allImages.length])

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.5, 3))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1)
      if (newZoom === 1) {
        setTranslateX(0)
        setTranslateY(0)
      }
      return newZoom
    })
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setZoom(1)
    setTranslateX(0)
    setTranslateY(0)
  }, [])

  // Reset zoom quando muda de imagem no modal
  useEffect(() => {
    if (modalOpen) {
      setZoom(1)
      setTranslateX(0)
      setTranslateY(0)
      setImageLoading(true)
    }
  }, [modalIndex, modalOpen])

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modalOpen) return

      switch (e.key) {
        case 'Escape':
          closeModal()
          break
        case 'ArrowLeft':
          e.preventDefault()
          goToModalPrevious()
          break
        case 'ArrowRight':
          e.preventDefault()
          goToModalNext()
          break
        case '+':
        case '=':
          e.preventDefault()
          handleZoomIn()
          break
        case '-':
          e.preventDefault()
          handleZoomOut()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalOpen, closeModal, goToModalPrevious, goToModalNext, handleZoomIn, handleZoomOut])

  // Sempre mostra 5 imagens: 1 principal + 4 miniaturas
  // Se tiver menos de 5, usa as que tem
  const imagesToShow = allImages.slice(0, 5)
  const hasMoreImages = allImages.length > 5
  const remainingCount = allImages.length - 5

  if (!allImages || allImages.length === 0) {
    return (
      <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: 300, sm: 400, md: 500, lg: 600 },
              overflow: 'hidden',
              bgcolor: '#f5f5f5',
              borderRadius: 2,
            }}
          >
            <MainImage
              src="https://via.placeholder.com/1200x600?text=Sem+Imagem"
              alt="Propriedade"
              loading="eager"
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
            <Grid item xs={6} sm={3} md={6}>
              <Thumbnail $isActive={false}>
                <img src="https://via.placeholder.com/300x300?text=Sem+Imagem" alt="" />
              </Thumbnail>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  if (allImages.length === 1) {
    return (
      <>
        <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
          <Grid item xs={12} md={8}>
            <MainImageContainer onClick={() => openModal(0)}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 300, sm: 400, md: 500, lg: 600 },
                  overflow: 'hidden',
                  bgcolor: '#f5f5f5',
                  borderRadius: 2,
                }}
              >
                <MainImage
                  src={allImages[0] || 'https://via.placeholder.com/1200x600?text=Sem+Imagem'}
                  alt="Propriedade"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </Box>
            </MainImageContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
              <Grid item xs={6} sm={3} md={6}>
                <Thumbnail $isActive={true} onClick={() => openModal(0)}>
                  <img src={allImages[0] || 'https://via.placeholder.com/300x300?text=Sem+Imagem'} alt="" />
                </Thumbnail>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Dialog
          open={modalOpen}
          onClose={closeModal}
          maxWidth={false}
          PaperProps={{
            sx: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              maxWidth: '100vw',
              maxHeight: '100vh',
              margin: 0,
              borderRadius: 0,
            },
          }}
          BackdropProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          <ModalContent>
            <ModalHeader>
              <ModalCounter>
                {modalIndex + 1} / {allImages.length}
              </ModalCounter>
              <IconButton
                onClick={closeModal}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Close />
              </IconButton>
            </ModalHeader>

            <ModalImageContainer
              ref={containerRef}
              onWheel={handleWheel}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <ModalImageWrapper
                $scale={zoom}
                $translateX={translateX}
                $translateY={translateY}
                onMouseDown={handleMouseDown}
              >
                <ModalImage
                  ref={imageRef}
                  src={allImages[modalIndex] || 'https://via.placeholder.com/1200x600?text=Sem+Imagem'}
                  alt={`Imagem ${modalIndex + 1}`}
                  $isLoading={imageLoading}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  onDoubleClick={handleImageDoubleClick}
                  onClick={handleImageClick}
                  draggable={false}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </ModalImageWrapper>
              {zoom > 1 && (
                <ZoomControls>
                  <ZoomButton
                    onClick={handleZoomOut}
                    aria-label="Diminuir zoom"
                    size="small"
                  >
                    <ZoomOut />
                  </ZoomButton>
                  <ZoomButton
                    onClick={handleZoomIn}
                    aria-label="Aumentar zoom"
                    size="small"
                    disabled={zoom >= 3}
                  >
                    <ZoomIn />
                  </ZoomButton>
                </ZoomControls>
              )}
            </ModalImageContainer>
          </ModalContent>
        </Dialog>
      </>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? imagesToShow.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === imagesToShow.length - 1 ? 0 : prev + 1))
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  const openModal = (index: number = 0) => {
    setModalIndex(index)
    setModalOpen(true)
  }

  const goToModalImage = (index: number) => {
    setModalIndex(index)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!modalOpen) return
    e.preventDefault()
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newZoom = Math.max(1, Math.min(3, zoom + delta))
    setZoom(newZoom)
    
    if (newZoom === 1) {
      setTranslateX(0)
      setTranslateY(0)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - translateX, y: e.clientY - translateY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return
    setTranslateX(e.clientX - dragStart.x)
    setTranslateY(e.clientY - dragStart.y)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
  }

  const handleImageDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (zoom === 1) {
      setZoom(2)
    } else {
      setZoom(1)
      setTranslateX(0)
      setTranslateY(0)
    }
  }

  const handleImageClick = (e: React.MouseEvent) => {
    // Se não estiver com zoom, não faz nada (permite fechar ao clicar no backdrop)
    if (zoom === 1) {
      return
    }
    // Se estiver com zoom, não fecha o modal
    e.stopPropagation()
  }

  return (
    <>
      <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
        <Grid item xs={12} md={8}>
          <MainImageContainer
            onClick={() => openModal(currentIndex)}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 300, sm: 400, md: 500, lg: 600 },
                overflow: 'hidden',
                bgcolor: '#f5f5f5',
                borderRadius: 2,
              }}
            >
                <MainImage
                  src={imagesToShow[currentIndex] || 'https://via.placeholder.com/1200x600?text=Sem+Imagem'}
                  alt={`Propriedade ${currentIndex + 1}`}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              {imagesToShow.length > 1 && (
                <>
                  <NavigationButton
                    className="left"
                    onClick={(e) => {
                      e.stopPropagation()
                      goToPrevious()
                    }}
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft />
                  </NavigationButton>
                  <NavigationButton
                    className="right"
                    onClick={(e) => {
                      e.stopPropagation()
                      goToNext()
                    }}
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight />
                  </NavigationButton>
                  <ImageCounter>
                    {currentIndex + 1} / {imagesToShow.length}
                    {hasMoreImages && ` (+${remainingCount})`}
                  </ImageCounter>
                </>
              )}
            </Box>
          </MainImageContainer>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: { xs: 1, sm: 1.5, md: 2 },
              height: '100%',
              minHeight: { xs: '240px', sm: '280px', md: '300px' },
            }}
          >
            {imagesToShow.slice(1, 5).map((image, index) => {
              const actualIndex = index + 1
              // A 5ª imagem (index 3) mostra "Ver mais..." quando há 5 ou mais imagens
              const isFifthImage = index === 3 && imagesToShow.length >= 5
              
              return (
                <Thumbnail
                  key={actualIndex}
                  $isActive={actualIndex === currentIndex}
                  onClick={() => {
                    if (isFifthImage && hasMoreImages) {
                      openModal(4)
                    } else {
                      goToImage(actualIndex)
                    }
                  }}
                  style={{
                    gridColumn: 'span 1',
                    gridRow: 'span 1',
                    aspectRatio: '1 / 1',
                    width: '100%',
                    height: '100%',
                  }}
                  $hasBlur={isFifthImage}
                >
                  <img
                    src={image || 'https://via.placeholder.com/300x300?text=Sem+Imagem'}
                    alt={`Miniatura ${actualIndex + 1}`}
                  />
                  {isFifthImage && (
                    <ViewMoreButton
                      onClick={(e) => {
                        e.stopPropagation()
                        if (hasMoreImages) {
                          openModal(4)
                        } else {
                          goToImage(actualIndex)
                        }
                      }}
                    >
                      Ver mais...
                    </ViewMoreButton>
                  )}
                </Thumbnail>
              )
            })}
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={modalOpen}
        onClose={closeModal}
        maxWidth={false}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            maxWidth: '100vw',
            maxHeight: '100vh',
            margin: 0,
            borderRadius: 0,
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <ModalContent>
          <ModalHeader>
            <ModalCounter>
              {modalIndex + 1} / {allImages.length}
            </ModalCounter>
            <IconButton
              onClick={closeModal}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Close />
            </IconButton>
          </ModalHeader>

          <ModalImageContainer
            ref={containerRef}
            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <ModalImageWrapper
              $scale={zoom}
              $translateX={translateX}
              $translateY={translateY}
              onMouseDown={handleMouseDown}
            >
              <ModalImage
                ref={imageRef}
                src={allImages[modalIndex] || 'https://via.placeholder.com/1200x600?text=Sem+Imagem'}
                alt={`Imagem ${modalIndex + 1}`}
                $isLoading={imageLoading}
                onLoad={handleImageLoad}
                onError={handleImageError}
                onDoubleClick={handleImageDoubleClick}
                onClick={handleImageClick}
                draggable={false}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </ModalImageWrapper>
            {allImages.length > 1 && (
              <>
                <ModalNavigationButton
                  className="left"
                  onClick={goToModalPrevious}
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft />
                </ModalNavigationButton>
                <ModalNavigationButton
                  className="right"
                  onClick={goToModalNext}
                  aria-label="Próxima imagem"
                >
                  <ChevronRight />
                </ModalNavigationButton>
              </>
            )}
            {zoom > 1 && (
              <ZoomControls>
                <ZoomButton
                  onClick={handleZoomOut}
                  aria-label="Diminuir zoom"
                  size="small"
                >
                  <ZoomOut />
                </ZoomButton>
                <ZoomButton
                  onClick={handleZoomIn}
                  aria-label="Aumentar zoom"
                  size="small"
                  disabled={zoom >= 3}
                >
                  <ZoomIn />
                </ZoomButton>
              </ZoomControls>
            )}
          </ModalImageContainer>

          {allImages.length > 1 && (
            <ModalThumbnails>
              {allImages.map((image, index) => (
                <ModalThumbnail
                  key={index}
                  $isActive={index === modalIndex}
                  onClick={() => goToModalImage(index)}
                >
                  <img
                    src={image || 'https://via.placeholder.com/80x80?text=Sem+Imagem'}
                    alt={`Miniatura ${index + 1}`}
                  />
                </ModalThumbnail>
              ))}
            </ModalThumbnails>
          )}
        </ModalContent>
      </Dialog>
    </>
  )
}
