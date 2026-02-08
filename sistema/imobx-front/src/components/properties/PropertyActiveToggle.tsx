import React, { useState } from 'react';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import styled from 'styled-components';
import { propertyApi } from '../../services/propertyApi';
import { toast } from 'react-toastify';
import { Tooltip } from '../ui/Tooltip';
import type { Property } from '../../types/property';

interface PropertyActiveToggleProps {
  property: Property;
  onStatusChange?: (property: Property) => void;
  size?: 'small' | 'medium' | 'large';
}

const ToggleButton = styled.button<{
  $isActive: boolean;
  $size: string;
  $loading: boolean;
}>`
  position: relative;
  width: ${props => {
    switch (props.$size) {
      case 'small':
        return '28px';
      case 'large':
        return '40px';
      default:
        return '34px';
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case 'small':
        return '28px';
      case 'large':
        return '40px';
      default:
        return '34px';
    }
  }};
  border-radius: 50%;
  border: 2px solid ${props => (props.$isActive ? '#4caf50' : '#f44336')};
  background: ${props => (props.$isActive ? '#4caf50' : '#f44336')};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => (props.$loading ? 'wait' : 'pointer')};
  opacity: ${props => (props.$loading ? 0.7 : 1)};
  transition: all 0.2s ease;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  pointer-events: auto;

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    width: ${props => {
      switch (props.$size) {
        case 'small':
          return '16px';
        case 'large':
          return '24px';
        default:
          return '20px';
      }
    }};
    height: ${props => {
      switch (props.$size) {
        case 'small':
          return '16px';
        case 'large':
          return '24px';
        default:
          return '20px';
      }
    }};
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const PropertyActiveToggle: React.FC<PropertyActiveToggleProps> = ({
  property,
  onStatusChange,
  size = 'medium',
}) => {
  const [isActive, setIsActive] = useState(property.isActive ?? true);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que o clique propague para o card

    if (loading) return;

    setLoading(true);
    try {
      const updatedProperty = isActive
        ? await propertyApi.deactivateProperty(property.id)
        : await propertyApi.activateProperty(property.id);

      setIsActive(updatedProperty.isActive ?? true);

      if (onStatusChange) {
        onStatusChange(updatedProperty);
      }

      toast.success(
        `Propriedade ${updatedProperty.isActive ? 'ativada' : 'desativada'} com sucesso!`,
        { position: 'top-right', autoClose: 2000 }
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao alterar status da propriedade';

      // Se a propriedade já está no estado desejado, não mostrar erro
      if (errorMessage.includes('já está')) {
        // Atualizar estado local mesmo assim
        const currentProperty = await propertyApi.getPropertyById(property.id);
        setIsActive(currentProperty.isActive ?? true);
        if (onStatusChange) {
          onStatusChange(currentProperty);
        }
        return;
      }

      toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const tooltipMessage = isActive
    ? 'Clique para desativar a propriedade'
    : 'Clique para ativar a propriedade';

  const button = (
    <ToggleButton
      $isActive={isActive}
      $size={size}
      $loading={loading}
      onClick={handleToggle}
      disabled={loading}
      aria-label={tooltipMessage}
    >
      {loading ? (
        <LoadingSpinner />
      ) : isActive ? (
        <MdCheckCircle />
      ) : (
        <MdCancel />
      )}
    </ToggleButton>
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        zIndex: 1001,
        pointerEvents: 'auto',
      }}
    >
      <Tooltip content={tooltipMessage} placement='top'>
        {button}
      </Tooltip>
    </div>
  );
};
