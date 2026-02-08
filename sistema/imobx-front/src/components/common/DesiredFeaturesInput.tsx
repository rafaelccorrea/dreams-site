/**
 * Componente para seleção de características desejadas
 * Usado no formulário de cadastro/edição de clientes
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { DesiredFeatures } from '../../types/match';

interface DesiredFeaturesInputProps {
  value?: DesiredFeatures;
  onChange: (features: DesiredFeatures) => void;
  disabled?: boolean;
}

const featuresList = [
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

export const DesiredFeaturesInput: React.FC<DesiredFeaturesInputProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [features, setFeatures] = useState<DesiredFeatures>(value || {});

  useEffect(() => {
    if (value) {
      setFeatures(value);
    }
  }, [value]);

  const handleToggle = (key: keyof DesiredFeatures) => {
    const updated = {
      ...features,
      [key]: !features[key],
    };

    // Se desmarcar garagem, remove o número de vagas
    if (key === 'hasGarage' && !updated.hasGarage) {
      delete updated.garageSpots;
    }

    setFeatures(updated);
    onChange(updated);
  };

  const handleGarageSpots = (value: string) => {
    const spots = parseInt(value) || undefined;
    const updated = {
      ...features,
      garageSpots: spots,
    };
    setFeatures(updated);
    onChange(updated);
  };

  const handleOtherChange = (value: string) => {
    const items = value
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const updated = {
      ...features,
      other: items.length > 0 ? items : undefined,
    };
    setFeatures(updated);
    onChange(updated);
  };

  return (
    <Container>
      <Title>Características Desejadas</Title>
      <Hint>Selecione as características que o cliente procura:</Hint>

      <FeaturesGrid>
        {featuresList.map(({ key, label, icon }) => (
          <FeatureCheckbox
            key={key}
            $checked={!!features[key]}
            onClick={() => !disabled && handleToggle(key)}
          >
            <input
              type='checkbox'
              checked={!!features[key]}
              onChange={() => handleToggle(key)}
              disabled={disabled}
            />
            <Icon>{icon}</Icon>
            <Label>{label}</Label>
          </FeatureCheckbox>
        ))}
      </FeaturesGrid>

      {features.hasGarage && (
        <GarageSpotsSection>
          <label>
            <strong>Número de vagas desejadas:</strong>
            <input
              type='number'
              min='1'
              max='10'
              value={features.garageSpots || ''}
              onChange={e => handleGarageSpots(e.target.value)}
              placeholder='Ex: 2'
              disabled={disabled}
            />
          </label>
        </GarageSpotsSection>
      )}

      <OtherSection>
        <label>
          <strong>Outras características:</strong>
          <Hint style={{ marginTop: '4px' }}>
            Digite características adicionais separadas por vírgula
          </Hint>
          <textarea
            value={features.other?.join(', ') || ''}
            onChange={e => handleOtherChange(e.target.value)}
            placeholder='Ex: Academia, Sala de jogos, Sauna'
            rows={2}
            disabled={disabled}
          />
        </label>
      </OtherSection>
    </Container>
  );
};

const Container = styled.div`
  margin: 20px 0;
`;

const Title = styled.h4`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Hint = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  margin-bottom: 16px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin: 16px 0;
`;

const FeatureCheckbox = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid
    ${({ $checked, theme }) =>
      $checked ? theme.colors.primary : theme.colors.border};
  background: ${({ $checked, theme }) =>
    $checked ? `${theme.colors.primary}15` : theme.colors.cardBackground};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  box-shadow: ${({ $checked }) =>
    $checked ? '0 2px 6px rgba(0, 0, 0, 0.1)' : 'none'};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ $checked, theme }) =>
      $checked ? `${theme.colors.primary}20` : theme.colors.background};
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  input[type='checkbox'] {
    margin: 0;
    cursor: pointer;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Icon = styled.span`
  font-size: 24px;
  transition: transform 0.2s;

  ${FeatureCheckbox}:hover & {
    transform: scale(1.1);
  }
`;

const Label = styled.span`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

const GarageSpotsSection = styled.div`
  margin: 16px 0;
  padding: 16px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  label {
    display: flex;
    flex-direction: column;
    gap: 8px;

    strong {
      color: ${({ theme }) => theme.colors.text};
      font-size: 14px;
      font-weight: 600;
    }

    input {
      max-width: 200px;
      padding: 10px 12px;
      border: 1px solid ${({ theme }) => theme.colors.border};
      border-radius: 8px;
      font-size: 14px;
      background: ${({ theme }) => theme.colors.background};
      color: ${({ theme }) => theme.colors.text};

      &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}15;
      }

      &:disabled {
        background: ${({ theme }) => theme.colors.border};
        cursor: not-allowed;
        opacity: 0.6;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const OtherSection = styled.div`
  margin: 16px 0;

  label {
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong {
      color: ${({ theme }) => theme.colors.text};
      font-size: 14px;
    }

    textarea {
      padding: 10px 12px;
      border: 1px solid ${({ theme }) => theme.colors.border};
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      background: ${({ theme }) => theme.colors.background};
      color: ${({ theme }) => theme.colors.text};

      &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}15;
      }

      &:disabled {
        background: ${({ theme }) => theme.colors.border};
        cursor: not-allowed;
        opacity: 0.6;
      }
    }
  }
`;

export default DesiredFeaturesInput;
