import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { MdHome } from 'react-icons/md';
import { StatusBadge } from './StatusBadge';

interface OptimizedImageProps {
  src?: string | null;
  alt: string;
  width?: string | number;
  height?: string | number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  borderRadius?: string;
  onClick?: () => void;
  loading?: 'lazy' | 'eager';
  placeholder?: React.ReactNode;
  className?: string;
  imageCount?: number;
  status?: 'available' | 'rented' | 'sold' | 'maintenance' | 'draft';
}

// Shimmer animation
const shimmerAnimation = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const ImageContainer = styled.div<{
  $width?: string | number;
  $height?: string | number;
  $borderRadius?: string;
  $clickable?: boolean;
}>`
  position: relative;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '100%'};
  border-radius: ${props => props.$borderRadius || '8px'};
  overflow: hidden;
  background: #f0f0f0;
  cursor: ${props => (props.$clickable ? 'pointer' : 'default')};
`;

const ShimmerSkeleton = styled.div<{
  $width?: string | number;
  $height?: string | number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmerAnimation} 1.5s infinite;
  border-radius: inherit;
`;

const ImageElement = styled.img<{
  $objectFit?: string;
  $isLoaded?: boolean;
  $hasError?: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: ${props => props.$objectFit || 'cover'};
  transition: opacity 0.3s ease-in-out;
  opacity: ${props => (props.$hasError ? 0 : props.$isLoaded ? 1 : 0)};
  border-radius: inherit;
`;

const ErrorPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  color: #6c757d;
  border: 2px dashed #dee2e6;
  border-radius: inherit;
`;

const RetryButton = styled.button`
  margin-top: 8px;
  padding: 4px 8px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  z-index: 2;
`;

const DefaultPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  color: #6c757d;
  border-radius: inherit;
`;

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = '100%',
  height = '200px',
  objectFit = 'cover',
  borderRadius = '8px',
  onClick,
  loading = 'lazy',
  placeholder,
  className,
  imageCount,
  status,
}) => {
  // Validar se src é válido (não vazio e não null/undefined)
  const isValidSrc = src != null && src.trim() !== '';

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(
    loading === 'eager' && isValidSrc
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Hook para lazy loading usando IntersectionObserver
  useEffect(() => {
    // Não carregar se não houver src válido
    if (!isValidSrc) {
      setShouldLoad(false);
      return;
    }

    if (loading === 'eager' || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [loading, shouldLoad, isValidSrc]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoaded(false);
    if (imageRef.current) {
      imageRef.current.src = src;
    }
  };

  const DefaultHomeIcon = () => (
    <DefaultPlaceholder>
      <MdHome size={48} />
    </DefaultPlaceholder>
  );

  return (
    <ImageContainer
      ref={containerRef}
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
      $clickable={!!onClick}
      onClick={onClick}
      className={className}
    >
      {/* Shimmer skeleton - só mostrar se houver src válido para carregar */}
      {!shouldLoad && isValidSrc && <ShimmerSkeleton />}

      {/* Default placeholder - mostrar se não houver src válido ou não estiver carregando */}
      {(!isValidSrc || (!shouldLoad && !placeholder)) && <DefaultHomeIcon />}

      {/* Custom placeholder - só mostrar se houver src válido e não estiver carregando */}
      {isValidSrc && !shouldLoad && placeholder && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f9fa',
          }}
        >
          {placeholder}
        </div>
      )}

      {/* Image - só renderizar se houver src válido */}
      {shouldLoad && !hasError && isValidSrc && (
        <ImageElement
          ref={imageRef}
          src={src || undefined}
          alt={alt}
          $objectFit={objectFit}
          $isLoaded={isLoaded}
          $hasError={hasError}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {/* Error state */}
      {shouldLoad && hasError && (
        <ErrorPlaceholder>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>📷</div>
            <div style={{ fontSize: '12px' }}>Erro ao carregar</div>
            <RetryButton onClick={handleRetry}>Tentar novamente</RetryButton>
          </div>
        </ErrorPlaceholder>
      )}

      {/* Image counter */}
      {imageCount && imageCount > 1 && (
        <ImageCounter
          style={{
            top: status ? '48px' : '8px', // Ajusta posição se há badge de status
          }}
        >
          +{imageCount - 1}
        </ImageCounter>
      )}

      {/* Status badge */}
      {status && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px', // 3 - status no canto superior direito
            zIndex: 3,
          }}
        >
          <StatusBadge status={status} />
        </div>
      )}
    </ImageContainer>
  );
};
