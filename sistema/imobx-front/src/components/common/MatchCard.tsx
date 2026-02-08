/**
 * Card de Match Cliente-Imóvel
 * Exibe informações de compatibilidade entre cliente e imóvel
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PropertyClientMatch, Match } from '../../types/match';
import { IgnoreMatchModal } from './IgnoreMatchModal';
import { translateType } from '../../utils/galleryTranslations';
import {
  Card,
  Header,
  ScoreBadge,
  FireIcon,
  MatchLabel,
  PropertyImage,
  PropertyInfo,
  PropertyTitle,
  PropertyPrice,
  PropertyLocation,
  PropertySpecs,
  Spec,
  MatchReasons,
  ReasonsTitle,
  ReasonsList,
  ReasonItem,
  ReasonIcon,
  ReasonText,
  CompatibilityGrid,
  CompatibilityItem,
  Actions,
  AcceptButton,
  ViewButton,
  IgnoreButton,
} from './styles/MatchCard.styles';

interface MatchCardProps {
  match: PropertyClientMatch | Match;
  onAccept: () => void;
  onIgnore: (reason?: string, notes?: string) => void;
  onView?: () => void;
  showProperty?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = React.memo(
  ({ match, onAccept, onIgnore, onView, showProperty = true }) => {
    const navigate = useNavigate();
    const [showIgnoreModal, setShowIgnoreModal] = useState(false);

    const getScoreColor = useCallback((score: number): string => {
      if (score >= 90) return '#27AE60'; // Verde escuro
      if (score >= 80) return '#2ECC71'; // Verde
      if (score >= 70) return '#F39C12'; // Amarelo
      if (score >= 50) return '#E67E22'; // Laranja
      if (score >= 25) return '#E74C3C'; // Vermelho claro
      if (score > 0) return '#C0392B'; // Vermelho escuro
      return '#7F8C8D'; // Cinza escuro para score 0
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

    const getReasonIcon = useCallback((reason: string): string => {
      if (reason.includes('Preço') || reason.includes('R$')) return '💰';
      if (reason.includes('Cidade') || reason.includes('Bairro')) return '📍';
      if (reason.includes('quartos')) return '🛏️';
      if (reason.includes('banheiros')) return '🚿';
      if (reason.includes('Características')) return '✨';
      if (reason.includes('Tipo')) return '🏠';
      if (reason.includes('Área') || reason.includes('m²')) return '📐';
      return '✓';
    }, []);

    // Função para processar e traduzir tipos de imóvel nos motivos do match
    const processReason = useCallback((reason: string): string => {
      if (!reason) return reason;

      // Padrão: "Tipo de imóvel: house" ou "Tipo de imóvel: apartment", etc.
      const typePattern = /Tipo de imóvel:\s*([a-z]+)/i;
      const matchResult = reason.match(typePattern);

      if (matchResult && matchResult[1]) {
        const propertyType = matchResult[1].toLowerCase().trim();
        const translatedType = translateType(propertyType);
        // Substituir o tipo não traduzido pelo traduzido
        return reason.replace(typePattern, `Tipo de imóvel: ${translatedType}`);
      }

      return reason;
    }, []);

    const formatPrice = useCallback((price: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
      }).format(price);
    }, []);

    const handleViewProperty = useCallback(() => {
      if (onView) {
        onView();
      }
      if (match.property) {
        navigate(
          `/properties/${(match as any).propertyId || match.property.id}`
        );
      }
    }, [onView, navigate, match]);

    const handleIgnoreConfirm = useCallback(
      (reason?: string, notes?: string) => {
        onIgnore(reason, notes);
        setShowIgnoreModal(false);
      },
      [onIgnore]
    );

    const property = useMemo(() => match.property, [match.property]);
    const scoreColor = useMemo(
      () => getScoreColor(match.matchScore),
      [match.matchScore, getScoreColor]
    );
    const scoreLabel = useMemo(
      () => getScoreLabel(match.matchScore),
      [match.matchScore, getScoreLabel]
    );

    if (!showProperty || !property) {
      return null;
    }

    return (
      <>
        <Card>
          {/* Header com Score */}
          <Header>
            <ScoreBadge $color={scoreColor}>
              {match.matchScore}%
              {match.matchScore >= 90 && <FireIcon>🔥</FireIcon>}
            </ScoreBadge>
            <MatchLabel>{scoreLabel}</MatchLabel>
          </Header>

          {/* Imagem do Imóvel */}
          <PropertyImage>
            {(() => {
              // Função auxiliar para extrair URL da imagem
              const getImageUrl = (img: any): string | null => {
                if (!img) return null;
                if (typeof img === 'string') return img;
                if (typeof img === 'object') {
                  return img.url || img.thumbnailUrl || img.fileUrl || null;
                }
                return null;
              };

              // Tentar obter a imagem principal ou a primeira imagem disponível
              let imageUrl: string | null = null;

              // 1. Tentar mainImage primeiro
              if ((property as any).mainImage) {
                imageUrl = getImageUrl((property as any).mainImage);
              }

              // 2. Se não encontrou, procurar em images array
              if (
                !imageUrl &&
                property.images &&
                Array.isArray(property.images) &&
                property.images.length > 0
              ) {
                // Procurar imagem principal (isMain)
                const mainImage = property.images.find((img: any) => {
                  if (typeof img === 'object' && img !== null) {
                    return img.isMain === true;
                  }
                  return false;
                });

                if (mainImage) {
                  imageUrl = getImageUrl(mainImage);
                } else {
                  // Usar primeira imagem disponível
                  imageUrl = getImageUrl(property.images[0]);
                }
              }

              // 3. Se não há imagem, usar placeholder diretamente
              const finalImageUrl = imageUrl || '/placeholder.jpg';
              const hasImage = imageUrl !== null;

              // Se não há imagem, usar um placeholder visual simples (sem tentar carregar arquivo)
              if (!hasImage) {
                return (
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: 'var(--background-secondary, #f5f5f5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary, #999)',
                      fontSize: '48px',
                    }}
                  >
                    🏠
                  </div>
                );
              }

              return (
                <img
                  src={finalImageUrl}
                  alt={property.title || 'Imóvel'}
                  onError={e => {
                    // Prevenir loop: só tentar placeholder uma vez
                    const target = e.currentTarget;
                    if (target.dataset.errorHandled === 'true') {
                      // Já tentou placeholder, não fazer nada para evitar loop
                      return;
                    }

                    // Se não era placeholder e falhou, tentar placeholder uma vez
                    if (target.src !== '/placeholder.jpg') {
                      target.dataset.errorHandled = 'true';
                      // Substituir por div placeholder em vez de tentar carregar outro arquivo
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML =
                          '<div style="width: 100%; height: 200px; background-color: var(--background-secondary, #f5f5f5); display: flex; align-items: center; justify-content: center; color: var(--text-secondary, #999); font-size: 48px;">🏠</div>';
                      }
                    }
                  }}
                />
              );
            })()}
          </PropertyImage>

          {/* Informações do Imóvel */}
          <PropertyInfo>
            <PropertyTitle>{property.title}</PropertyTitle>
            <PropertyPrice>
              {formatPrice(
                (property as any).price ||
                  (property as any).salePrice ||
                  (property as any).rentPrice ||
                  0
              )}
            </PropertyPrice>
            <PropertyLocation>
              📍 {property.neighborhood || ''}
              {property.city ? `, ${property.city}` : ''}
            </PropertyLocation>
            <PropertySpecs>
              {property.type && (
                <Spec>🏠 {translateType(String(property.type))}</Spec>
              )}
              {property.bedrooms && <Spec>🛏️ {property.bedrooms}Q</Spec>}
              {property.bathrooms && <Spec>🚿 {property.bathrooms}B</Spec>}
              {((property as any).totalArea ||
                property.builtArea ||
                property.area) && (
                <Spec>
                  📐{' '}
                  {(property as any).totalArea ||
                    property.builtArea ||
                    property.area}
                  m²
                </Spec>
              )}
            </PropertySpecs>
          </PropertyInfo>

          {/* Motivos do Match */}
          {match.matchDetails?.reasons &&
            match.matchDetails.reasons.length > 0 && (
              <MatchReasons>
                <ReasonsTitle>Por que é um bom match:</ReasonsTitle>
                <ReasonsList>
                  {match.matchDetails.reasons.map((reason, idx) => {
                    const processedReason = processReason(reason);
                    return (
                      <ReasonItem key={idx}>
                        <ReasonIcon>
                          {getReasonIcon(processedReason)}
                        </ReasonIcon>
                        <ReasonText>{processedReason}</ReasonText>
                      </ReasonItem>
                    );
                  })}
                </ReasonsList>
              </MatchReasons>
            )}

          {/* Compatibilidade */}
          {match.matchDetails && (
            <CompatibilityGrid>
              {match.matchDetails.priceMatch && (
                <CompatibilityItem>
                  ✓ Preço compatível ({match.matchDetails.pricePercentage}% do
                  orçamento)
                </CompatibilityItem>
              )}
              {match.matchDetails.locationMatch && (
                <CompatibilityItem>✓ Localização desejada</CompatibilityItem>
              )}
              {match.matchDetails.typeMatch && (
                <CompatibilityItem>✓ Tipo de imóvel</CompatibilityItem>
              )}
              {match.matchDetails.bedroomsMatch && (
                <CompatibilityItem>✓ Quartos adequados</CompatibilityItem>
              )}
            </CompatibilityGrid>
          )}

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

MatchCard.displayName = 'MatchCard';

export default MatchCard;
