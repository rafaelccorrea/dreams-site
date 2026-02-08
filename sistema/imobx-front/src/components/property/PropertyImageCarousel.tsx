import React, { useState, useEffect } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { IoClose, IoExpand } from 'react-icons/io5';
import {
  CarouselContainer,
  CarouselImage,
  CarouselOverlay,
  CarouselModal,
  NavigationButton,
  ThumbnailStrip,
  ThumbnailItem,
  CloseButton,
  FullscreenButton,
  ImageCounter,
} from './PropertyImageCarouselStyles';

interface PropertyImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  category?: string;
  isMain?: boolean;
}

interface PropertyImageCarouselProps {
  images: PropertyImage[];
  mainImage?: {
    id: string;
    url: string;
    thumbnailUrl?: string;
  };
  onImageDoubleClick?: () => void;
}

export const PropertyImageCarousel: React.FC<PropertyImageCarouselProps> = ({
  images,
  mainImage,
  onImageDoubleClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [allImages, setAllImages] = useState<PropertyImage[]>([]);

  useEffect(() => {
    // Combinar imagens da galeria com imagem principal
    let combinedImages = [...images];

    // Se tem imagem principal e não está na lista, adicionar no início
    if (mainImage && !combinedImages.find(img => img.id === mainImage.id)) {
      combinedImages = [
        {
          ...mainImage,
          isMain: true,
        },
        ...combinedImages,
      ];
    }

    // Ordenar por isMain primeiro
    combinedImages = combinedImages.sort((a, b) => {
      if (a.isMain && !b.isMain) return -1;
      if (!a.isMain && b.isMain) return 1;
      return 0;
    });

    setAllImages(combinedImages);
  }, [images, mainImage]);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isFullscreen) {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    }
  };

  useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen]);

  if (allImages.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          minHeight: '400px',
          background: 'var(--color-background-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-secondary)',
          borderRadius: '16px',
          margin: '20px',
          padding: '60px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(135deg, var(--color-primary)05 0%, var(--color-primary-dark)05 50%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <div
          style={{
            width: '100px',
            height: '100px',
            background:
              'linear-gradient(135deg, var(--color-primary)15 0%, var(--color-primary-dark)15 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            color: 'var(--color-primary)',
            fontSize: '3rem',
            position: 'relative',
            zIndex: 1,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          📸
        </div>
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Nenhuma imagem disponível
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: '1rem',
            lineHeight: 1.6,
            maxWidth: '400px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Esta propriedade ainda não possui imagens cadastradas na galeria
        </p>
        <style>{`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 var(--color-primary)30;
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 0 20px var(--color-primary)00;
            }
          }
        `}</style>
      </div>
    );
  }

  const currentImage = allImages[currentIndex];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Garantir que nada saia do container
      }}
    >
      {/* Exibição da Imagem Principal */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#f8f9fa',
          height: '100%', // Usar toda a altura disponível
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100%', // Garantir altura mínima
        }}
      >
        <CarouselContainer>
          <CarouselImage
            src={currentImage.url}
            alt={currentImage.category || 'Imagem da propriedade'}
            onClick={toggleFullscreen}
            onDoubleClick={onImageDoubleClick}
            style={{ cursor: 'pointer' }}
          />

          {/* Badge da Imagem Principal */}
          {currentImage.isMain && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'var(--color-primary)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ⭐ Principal
            </div>
          )}

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <NavigationButton
                $position='left'
                onClick={goToPrevious}
                aria-label='Imagem anterior'
              >
                <MdKeyboardArrowLeft />
              </NavigationButton>

              <NavigationButton
                $position='right'
                onClick={goToNext}
                aria-label='Próxima imagem'
              >
                <MdKeyboardArrowRight />
              </NavigationButton>
            </>
          )}

          {/* Fullscreen Button */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '8px',
              padding: '8px',
            }}
          >
            <FullscreenButton onClick={toggleFullscreen}>
              <IoExpand size={20} />
            </FullscreenButton>
          </div>

          {/* Image Counter */}
          {allImages.length > 1 && (
            <ImageCounter>
              {currentIndex + 1} / {allImages.length}
            </ImageCounter>
          )}
        </CarouselContainer>

        {/* Thumbnail Strip - Overlay no centro da imagem */}
        {allImages.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.7)',
              padding: '8px 12px',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              zIndex: 20,
            }}
          >
            <ThumbnailStrip style={{ gap: '6px' }}>
              {allImages.map((image, index) => (
                <ThumbnailItem
                  key={image.id}
                  isActive={index === currentIndex}
                  onClick={() => goToImage(index)}
                  style={{
                    width: '40px',
                    height: '30px',
                    borderRadius: '6px',
                    border:
                      index === currentIndex
                        ? '2px solid white'
                        : '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <img
                    src={image.thumbnailUrl || image.url}
                    alt={`Miniatura ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                  {image.isMain && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        background: 'var(--color-primary)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '12px',
                        height: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '8px',
                      }}
                    >
                      ⭐
                    </div>
                  )}
                </ThumbnailItem>
              ))}
            </ThumbnailStrip>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <CarouselOverlay onClick={() => setIsFullscreen(false)}>
          <CarouselModal onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setIsFullscreen(false)}>
              <IoClose size={24} />
            </CloseButton>

            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={currentImage.url}
                alt={currentImage.category || 'Imagem da propriedade'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />

              {allImages.length > 1 && (
                <>
                  <NavigationButton
                    $position='left'
                    onClick={e => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                    style={{ position: 'absolute', left: '20px' }}
                  >
                    <MdKeyboardArrowLeft />
                  </NavigationButton>

                  <NavigationButton
                    $position='right'
                    onClick={e => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    style={{ position: 'absolute', right: '20px' }}
                  >
                    <MdKeyboardArrowRight />
                  </NavigationButton>
                </>
              )}
            </div>
          </CarouselModal>
        </CarouselOverlay>
      )}
    </div>
  );
};
