/**
 * Componente para exibir características desejadas de forma legível
 * Usado em visualização de clientes
 */

import React from 'react';
import styled from 'styled-components';
import type { DesiredFeatures } from '../../types/match';

interface FeaturesDisplayProps {
  features?: DesiredFeatures;
  compact?: boolean;
}

const featureConfig = [
  { key: 'hasGarage' as const, label: 'Garagem', icon: '🚗' },
  { key: 'hasPool' as const, label: 'Piscina', icon: '🏊' },
  { key: 'hasGarden' as const, label: 'Jardim', icon: '🌳' },
  { key: 'hasBalcony' as const, label: 'Varanda', icon: '🪟' },
  { key: 'hasGrill' as const, label: 'Churrasqueira', icon: '🍖' },
  { key: 'hasElevator' as const, label: 'Elevador', icon: '🛗' },
  { key: 'isFurnished' as const, label: 'Mobiliado', icon: '🛋️' },
  { key: 'petsAllowed' as const, label: 'Aceita Pets', icon: '🐕' },
  { key: 'hasAirConditioning' as const, label: 'Ar Condicionado', icon: '❄️' },
  {
    key: 'hasGatedCommunity' as const,
    label: 'Condomínio Fechado',
    icon: '🏘️',
  },
  { key: 'hasSportsArea' as const, label: 'Área de Esportes', icon: '⚽' },
  { key: 'hasPartyRoom' as const, label: 'Salão de Festas', icon: '🎉' },
  { key: 'hasPlayground' as const, label: 'Playground', icon: '🎪' },
  { key: 'hasSecurity' as const, label: 'Segurança 24h', icon: '🔒' },
];

export const FeaturesDisplay: React.FC<FeaturesDisplayProps> = ({
  features,
  compact = false,
}) => {
  if (!features || Object.keys(features).length === 0) {
    return <EmptyText>Nenhuma característica especificada</EmptyText>;
  }

  const activeFeatures = featureConfig.filter(config => features[config.key]);

  if (
    activeFeatures.length === 0 &&
    !features.garageSpots &&
    (!features.other || features.other.length === 0)
  ) {
    return <EmptyText>Nenhuma característica especificada</EmptyText>;
  }

  if (compact) {
    return (
      <CompactList>
        {activeFeatures.map(({ key, icon, label }) => (
          <CompactChip key={key}>
            <Icon>{icon}</Icon>
            {label}
            {key === 'hasGarage' && features.garageSpots && (
              <Count>
                {' '}
                ({features.garageSpots} vaga
                {features.garageSpots > 1 ? 's' : ''})
              </Count>
            )}
          </CompactChip>
        ))}
        {features.other?.map((item, idx) => (
          <CompactChip key={`other-${idx}`}>
            <Icon>✨</Icon>
            {item}
          </CompactChip>
        ))}
      </CompactList>
    );
  }

  return (
    <Container>
      <Title>Características Desejadas</Title>

      {activeFeatures.length > 0 && (
        <Grid>
          {activeFeatures.map(({ key, icon, label }) => (
            <FeatureItem key={key}>
              <FeatureIcon>{icon}</FeatureIcon>
              <FeatureLabel>
                {label}
                {key === 'hasGarage' && features.garageSpots && (
                  <span>
                    {' '}
                    ({features.garageSpots} vaga
                    {features.garageSpots > 1 ? 's' : ''})
                  </span>
                )}
              </FeatureLabel>
            </FeatureItem>
          ))}
        </Grid>
      )}

      {features.other && features.other.length > 0 && (
        <OtherSection>
          <OtherTitle>Outras características:</OtherTitle>
          <OtherList>
            {features.other.map((item, idx) => (
              <OtherItem key={idx}>
                <OtherIcon>✨</OtherIcon>
                {item}
              </OtherItem>
            ))}
          </OtherList>
        </OtherSection>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin: 16px 0;
`;

const Title = styled.h4`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 8px 10px;
  }
`;

const FeatureIcon = styled.span`
  font-size: 20px;
  flex-shrink: 0;
`;

const FeatureLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;

  span {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 13px;
  }
`;

const OtherSection = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const OtherTitle = styled.h5`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
`;

const OtherList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const OtherItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${({ theme }) => theme.colors.primary}15;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  border-radius: 16px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}25;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 5px 10px;
  }
`;

const OtherIcon = styled.span`
  font-size: 14px;
`;

const CompactList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CompactChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 16px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 5px 10px;
  }
`;

const Icon = styled.span`
  font-size: 16px;
`;

const Count = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
`;

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  font-style: italic;
  margin: 0;
`;

export default FeaturesDisplay;
