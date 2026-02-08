/**
 * Card Otimizado de Match Cliente-Imóvel
 * Versão com carregamento de imagens controlado e otimizado
 */

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import type { PropertyClientMatch } from '../../types/match';
import { IgnoreMatchModal } from './IgnoreMatchModal';
import { formatPhoneDisplay } from '../../utils/masks';

interface MatchCardOptimizedProps {
  match: PropertyClientMatch;
  onAccept: () => void;
  onIgnore: (reason?: string, notes?: string) => void;
  onView?: () => void;
  showProperty?: boolean;
}

export const MatchCardOptimized: React.FC<MatchCardOptimizedProps> = React.memo(
  ({ match, onAccept, onIgnore, onView, showProperty = true }) => {
    const navigate = useNavigate();
    const [showIgnoreModal, setShowIgnoreModal] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Intersection Observer para lazy loading
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (cardRef.current) {
        observer.observe(cardRef.current);
      }

      return () => observer.disconnect();
    }, []);

    const getScoreColor = useCallback((score: number): string => {
      if (score >= 90) return '#27AE60';
      if (score >= 80) return '#2ECC71';
      if (score >= 70) return '#F39C12';
      if (score >= 50) return '#E67E22';
      if (score >= 25) return '#E74C3C';
      if (score > 0) return '#C0392B';
      return '#7F8C8D';
    }, []);

    const getScoreLabel = useCallback((score: number): string => {
      if (score >= 90) return 'Match Perfeito!';
      if (score >= 80) return 'Ótimo Match';
      if (score >= 70) return 'Bom Match';
      if (score >= 50) return 'Match Moderado';
      if (score >= 25) return 'Match Baixo';
      if (score > 0) return 'Match Muito Baixo';
      return 'Sem Compatibilidade';
    }, []);

    const formatPrice = useCallback((price: string | number): string => {
      const numericPrice =
        typeof price === 'string' ? parseFloat(price) : price;
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
      }).format(numericPrice);
    }, []);

    const handleViewProperty = useCallback(() => {
      if (onView) {
        onView();
      }
      if (match.property) {
        navigate(`/properties/${match.propertyId}`);
      }
    }, [onView, match.property, match.propertyId, navigate]);

    const handleIgnoreConfirm = useCallback(
      (reason?: string, notes?: string) => {
        onIgnore(reason, notes);
        setShowIgnoreModal(false);
      },
      [onIgnore]
    );

    const handleImageLoad = useCallback(() => {
      setImageLoaded(true);
      setImageError(false);
    }, []);

    const handleImageError = useCallback(() => {
      setImageError(true);
      setImageLoaded(false);
    }, []);

    const property = useMemo(() => match.property, [match.property]);

    if (!showProperty || !property) {
      return null;
    }

    const scoreColor = useMemo(
      () => getScoreColor(match.matchScore),
      [match.matchScore, getScoreColor]
    );
    const scoreLabel = useMemo(
      () => getScoreLabel(match.matchScore),
      [match.matchScore, getScoreLabel]
    );

    // URL da imagem com fallback - usar fileUrl em vez de url
    const imageUrl = property.images?.[0]?.fileUrl;
    const shouldLoadImage = isVisible && imageUrl && !imageError;

    return (
      <>
        <Card ref={cardRef}>
          {/* Header com Score */}
          <Header>
            <ScoreBadge $color={scoreColor}>
              {match.matchScore}%
              {match.matchScore >= 90 && <FireIcon>🔥</FireIcon>}
            </ScoreBadge>
            <MatchLabel>{scoreLabel}</MatchLabel>
          </Header>

          {/* Imagem do Imóvel com Lazy Loading */}
          <PropertyImageContainer>
            {shouldLoadImage ? (
              <>
                {!imageLoaded && (
                  <ImageSkeleton>
                    <SkeletonIcon>🏠</SkeletonIcon>
                    <SkeletonText>Carregando...</SkeletonText>
                  </ImageSkeleton>
                )}
                <PropertyImage $loaded={imageLoaded} $visible={shouldLoadImage}>
                  <img
                    src={imageUrl}
                    alt={property.title}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading='lazy'
                  />
                </PropertyImage>
              </>
            ) : (
              <ImagePlaceholder>
                <PlaceholderIcon>🏠</PlaceholderIcon>
                <PlaceholderText>
                  {imageError ? 'Imagem não disponível' : 'Imagem do Imóvel'}
                </PlaceholderText>
              </ImagePlaceholder>
            )}
          </PropertyImageContainer>

          {/* Informações do Cliente */}
          {match.client && (
            <ClientInfo>
              <ClientTitle>Cliente: {match.client.name}</ClientTitle>
              <ClientDetails>
                📧 {match.client.email}
                {match.client.phone &&
                  ` • 📞 ${formatPhoneDisplay(match.client.phone)}`}
              </ClientDetails>
              {match.client.maxValue && (
                <ClientBudget>
                  💰 Orçamento: até {formatPrice(match.client.maxValue)}
                </ClientBudget>
              )}
            </ClientInfo>
          )}

          {/* Informações do Imóvel */}
          <PropertyInfo>
            <PropertyTitle>{property.title}</PropertyTitle>
            <PropertyPrice>
              {property.salePrice
                ? formatPrice(property.salePrice)
                : property.rentPrice
                  ? formatPrice(property.rentPrice)
                  : 'Preço não informado'}
            </PropertyPrice>
            <PropertyLocation>
              📍 {property.neighborhood}
              {property.city && `, ${property.city}`}
            </PropertyLocation>
            <PropertySpecs>
              {property.bedrooms && <Spec>🛏️ {property.bedrooms}Q</Spec>}
              {property.bathrooms && <Spec>🚿 {property.bathrooms}B</Spec>}
              {property.totalArea && <Spec>📐 {property.totalArea}m²</Spec>}
              {property.parkingSpaces && (
                <Spec>🚗 {property.parkingSpaces} vagas</Spec>
              )}
            </PropertySpecs>

            {/* Características do Imóvel */}
            {property.features && property.features.length > 0 && (
              <PropertyFeatures>
                <FeaturesTitle>Características:</FeaturesTitle>
                <FeaturesList>
                  {property.features.slice(0, 4).map((feature, index) => (
                    <FeatureTag key={index}>✨ {feature}</FeatureTag>
                  ))}
                  {property.features.length > 4 && (
                    <FeatureTag>
                      +{property.features.length - 4} mais
                    </FeatureTag>
                  )}
                </FeaturesList>
              </PropertyFeatures>
            )}
          </PropertyInfo>

          {/* Ações */}
          <Actions>
            <AcceptButton onClick={onAccept}>✓ Aceitar</AcceptButton>
            <ViewButton onClick={handleViewProperty}>
              👁️ Ver Detalhes
            </ViewButton>
            <IgnoreButton onClick={() => setShowIgnoreModal(true)}>
              ✕ Ignorar
            </IgnoreButton>
          </Actions>
        </Card>

        {/* Modal para Ignorar */}
        {showIgnoreModal && (
          <IgnoreMatchModal
            onConfirm={handleIgnoreConfirm}
            onCancel={() => setShowIgnoreModal(false)}
          />
        )}
      </>
    );
  }
);

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const ScoreBadge = styled.div<{ $color: string }>`
  padding: 8px 16px;
  border-radius: 20px;
  background: ${({ $color }) => $color};
  color: white;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 6px ${({ $color }) => `${$color}40`};
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 6px 14px;
  }
`;

const FireIcon = styled.span`
  font-size: 20px;
  animation: pulse 1s infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
`;

const MatchLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-size: 16px;
`;

const PropertyImageContainer = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  position: relative;
`;

const PropertyImage = styled.div<{ $loaded: boolean; $visible: boolean }>`
  width: 100%;
  height: 100%;
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  position: ${({ $loaded }) => ($loaded ? 'relative' : 'absolute')};
  top: 0;
  left: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const ImageSkeleton = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const SkeletonIcon = styled.div`
  font-size: 48px;
  margin-bottom: 8px;
  opacity: 0.6;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.6;
    }
    50% {
      opacity: 0.3;
    }
  }
`;

const SkeletonText = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border: 2px dashed ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, #e9ecef, #dee2e6);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PlaceholderIcon = styled.div`
  font-size: 48px;
  margin-bottom: 8px;
  opacity: 0.6;
`;

const PlaceholderText = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

const ClientInfo = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const ClientTitle = styled.h5`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ClientDetails = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  margin-bottom: 8px;
`;

const ClientBudget = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
`;

const PropertyInfo = styled.div`
  margin-bottom: 16px;
`;

const PropertyTitle = styled.h4`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const PropertyPrice = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const PropertyLocation = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  margin-bottom: 12px;
`;

const PropertySpecs = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const Spec = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

const PropertyFeatures = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FeaturesTitle = styled.h6`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const FeatureTag = styled.span`
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
  }
`;

const AcceptButton = styled(Button)`
  flex: 1;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
  }
`;

const ViewButton = styled(Button)`
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
  }
`;

const IgnoreButton = styled(Button)`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
  }
`;

MatchCardOptimized.displayName = 'MatchCardOptimized';

export default MatchCardOptimized;
