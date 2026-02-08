import React, { useState, useEffect } from 'react';
import { usePropertyPublicFlag } from '../../hooks/usePropertyPublicFlag';
import { MdPublic, MdLock } from 'react-icons/md';
import styled from 'styled-components';
import type { PropertyStatus } from '../../types/property';
import { Tooltip } from '../ui/Tooltip';
import { propertyApi } from '../../services/propertyApi';

interface PropertyPublicToggleProps {
  propertyId: string;
  initialValue: boolean;
  propertyStatus?: PropertyStatus;
  isActive?: boolean;
  imageCount?: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

interface ToggleContainerProps {
  $fullWidth?: boolean;
}

const ToggleContainer = styled.div<ToggleContainerProps>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};
  box-sizing: border-box;
  min-width: 0;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
`;

const ToggleInput = styled.input`
  width: 0;
  height: 0;
  opacity: 0;
  position: absolute;
`;

interface ToggleSliderProps {
  $isPublic: boolean;
  $disabled: boolean;
  $size: 'small' | 'medium' | 'large';
  $fullWidth?: boolean;
}

const ToggleSlider = styled.span<ToggleSliderProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: ${props => {
    if (props.$fullWidth) {
      return '100%';
    }
    switch (props.$size) {
      case 'small':
        return '140px';
      case 'large':
        return '200px';
      default:
        return '180px';
    }
  }};
  box-sizing: border-box;
  flex-shrink: 0;
  height: ${props => {
    switch (props.$size) {
      case 'small':
        return '36px';
      case 'large':
        return '48px';
      default:
        return '40px';
    }
  }};
  background: ${props =>
    props.$isPublic
      ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
      : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'};
  color: white;
  border: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  padding: 8px 16px;
  font-weight: 600;
  font-size: ${props => {
    switch (props.$size) {
      case 'small':
        return '13px';
      case 'large':
        return '16px';
      default:
        return '14px';
    }
  }};
  opacity: ${props => (props.$disabled ? 0.6 : 1)};
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  box-shadow: ${props =>
    props.$isPublic
      ? '0 2px 8px rgba(76, 175, 80, 0.3)'
      : '0 2px 8px rgba(107, 114, 128, 0.3)'};

  &:hover {
    ${props =>
      !props.$disabled &&
      `
      box-shadow: ${
        props.$isPublic
          ? '0 4px 12px rgba(76, 175, 80, 0.4)'
          : '0 4px 12px rgba(107, 114, 128, 0.4)'
      };
      transform: translateY(-2px);
    `}
  }

  &:active {
    ${props =>
      !props.$disabled &&
      `
      transform: translateY(0);
    `}
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 14px;
  padding: 8px;
  background: #ffebee;
  border-radius: 4px;
  border-left: 4px solid #d32f2f;
`;

const WarningMessage = styled.div`
  color: #f59e0b;
  font-size: 12px;
  padding: 8px;
  background: #fef3c7;
  border-radius: 4px;
  border-left: 4px solid #f59e0b;
  margin-top: 4px;
  text-align: center;
`;

const LoadingMessage = styled.div`
  color: #2563eb;
  font-size: 12px;
  padding: 8px;
  background: #eff6ff;
  border-radius: 4px;
  border-left: 4px solid #2563eb;
  text-align: center;
`;

export const PropertyPublicToggle: React.FC<PropertyPublicToggleProps> = ({
  propertyId,
  initialValue,
  propertyStatus,
  isActive: propIsActive,
  imageCount: propImageCount,
  onSuccess,
  onError,
  size = 'medium',
  fullWidth = false,
}) => {
  const { isPublic, loading, error, togglePublic } = usePropertyPublicFlag(
    propertyId,
    initialValue,
    propertyStatus
  );

  const [isActive, setIsActive] = useState(propIsActive ?? true);
  const [imageCount, setImageCount] = useState(propImageCount ?? 0);
  const [isLoadingValidation, setIsLoadingValidation] = useState(false);

  // Carregar informações da propriedade se não foram fornecidas
  useEffect(() => {
    if (propIsActive === undefined || propImageCount === undefined) {
      setIsLoadingValidation(true);
      propertyApi
        .getPropertyById(propertyId)
        .then(property => {
          setIsActive(property.isActive ?? true);
          const validImages =
            property.images?.filter(
              img => img && img.url && img.url.trim() !== ''
            ) || [];
          setImageCount(validImages.length);
        })
        .catch(() => {
          // Em caso de erro, assumir valores padrão
          setIsActive(true);
          setImageCount(0);
        })
        .finally(() => {
          setIsLoadingValidation(false);
        });
    }
  }, [propertyId, propIsActive, propImageCount]);

  // Verificar se a propriedade está disponível
  const isAvailable = propertyStatus === 'available';
  const hasEnoughImages = imageCount >= 5;

  // Determinar se o botão deve estar desabilitado
  const isDisabled =
    loading ||
    isLoadingValidation ||
    (!isPublic && (!isActive || !isAvailable || !hasEnoughImages));

  // Gerar mensagem do tooltip
  const getTooltipMessage = (): string => {
    if (isPublic) {
      return '🌐 Propriedade está visível no site Dream Keys. Clique para ocultar e tornar privada.';
    }

    const reasons: string[] = [];
    if (!isActive) {
      reasons.push('Propriedade deve estar ativa');
    }
    if (!isAvailable) {
      reasons.push('Status deve ser "Disponível"');
    }
    if (!hasEnoughImages) {
      reasons.push(`Necessário ter 5 imagens (atualmente: ${imageCount})`);
    }

    if (reasons.length > 0) {
      return `🔒 Não é possível publicar: ${reasons.join(', ')}.`;
    }

    return '🔒 Propriedade não está visível no site Dream Keys. Clique para tornar pública.';
  };

  const handleToggle = async () => {
    if (isDisabled) return;

    try {
      await togglePublic();
      onSuccess?.();
    } catch (err: any) {
      onError?.(err.message || 'Erro ao atualizar propriedade');
    }
  };

  const toggleButton = (
    <ToggleLabel>
      <ToggleInput
        type='checkbox'
        checked={isPublic}
        onChange={handleToggle}
        disabled={isDisabled}
      />
      <ToggleSlider
        $isPublic={isPublic}
        $disabled={isDisabled}
        $size={size}
        $fullWidth={true}
      >
        {isPublic ? (
          <>
            <MdPublic
              size={size === 'small' ? 18 : size === 'large' ? 24 : 20}
            />
            Marcar como Privada
          </>
        ) : (
          <>
            <MdLock size={size === 'small' ? 18 : size === 'large' ? 24 : 20} />
            Marcar como Pública
          </>
        )}
      </ToggleSlider>
    </ToggleLabel>
  );

  return (
    <ToggleContainer $fullWidth={fullWidth}>
      <Tooltip content={getTooltipMessage()} placement='top'>
        {toggleButton}
      </Tooltip>

      {error && !loading && <ErrorMessage>⚠️ {error}</ErrorMessage>}

      {loading && <LoadingMessage>Atualizando...</LoadingMessage>}
    </ToggleContainer>
  );
};
