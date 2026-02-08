import React from 'react';
import styled from 'styled-components';
import { addonsApi } from '../../services/addonsApi';
import { toast } from 'react-toastify';
import { useTheme } from '../../contexts/ThemeContext';
import { CancelAddonConfirmationModal } from '../modals/CancelAddonConfirmationModal';
import type { SubscriptionAddon } from '../../types/addons';
import {
  ADDON_TYPE_LABELS,
  ADDON_STATUS_LABELS,
  AddonStatus,
} from '../../types/addons';

interface AddonCardProps {
  addon: SubscriptionAddon;
  subscriptionId: string;
  onCancel?: () => void;
  className?: string;
}

const Card = styled.div<{ $isActive: boolean }>`
  padding: 20px;
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(148, 163, 184, 0.2)'
        : 'rgba(226, 232, 240, 0.8)'};
  border-radius: 12px;
  margin-bottom: 16px;
  background: ${props =>
    props.theme.mode === 'dark'
      ? props.$isActive
        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
        : 'rgba(30, 41, 59, 0.6)'
      : props.$isActive
        ? '#ffffff'
        : '#f8fafc'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props =>
      props.$isActive
        ? 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)'
        : 'transparent'};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props =>
      props.theme.mode === 'dark'
        ? '0 8px 24px rgba(0, 0, 0, 0.4)'
        : '0 8px 24px rgba(0, 0, 0, 0.1)'};
    border-color: ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(59, 130, 246, 0.4)'
        : 'rgba(59, 130, 246, 0.3)'};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => (props.theme.mode === 'dark' ? '#e2e8f0' : '#1e293b')};
`;

const CardInfo = styled.p`
  margin: 4px 0;
  font-size: 0.875rem;
  color: ${props => (props.theme.mode === 'dark' ? '#94a3b8' : '#64748b')};
`;

const StatusBadge = styled.span<{ $isActive: boolean }>`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props =>
    props.theme.mode === 'dark'
      ? props.$isActive
        ? 'rgba(34, 197, 94, 0.2)'
        : 'rgba(239, 68, 68, 0.2)'
      : props.$isActive
        ? '#d4edda'
        : '#f8d7da'};
  color: ${props =>
    props.theme.mode === 'dark'
      ? props.$isActive
        ? '#4ade80'
        : '#f87171'
      : props.$isActive
        ? '#155724'
        : '#721c24'};
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark'
        ? props.$isActive
          ? 'rgba(34, 197, 94, 0.3)'
          : 'rgba(239, 68, 68, 0.3)'
        : 'transparent'};
`;

const CardContent = styled.div`
  margin-bottom: 16px;
`;

const InfoRow = styled.p`
  margin: 8px 0;
  font-size: 0.875rem;
  color: ${props => (props.theme.mode === 'dark' ? '#cbd5e1' : '#475569')};

  strong {
    color: ${props => (props.theme.mode === 'dark' ? '#e2e8f0' : '#1e293b')};
    font-weight: 600;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: ${props => (props.theme.mode === 'dark' ? '#ef4444' : '#dc3545')};
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props =>
      props.theme.mode === 'dark' ? '#dc2626' : '#c82333'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(239, 68, 68, 0.3)'
          : 'rgba(220, 53, 69, 0.3)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/**
 * Componente de card para exibir um add-on
 */
export function AddonCard({
  addon,
  subscriptionId,
  onCancel,
  className,
}: AddonCardProps) {
  const { theme } = useTheme();
  const [cancelling, setCancelling] = React.useState(false);
  const [showCancelModal, setShowCancelModal] = React.useState(false);

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      setCancelling(true);
      await addonsApi.cancelAddon(subscriptionId, addon.id);
      toast.success('Extra cancelado com sucesso');
      setShowCancelModal(false);
      onCancel?.();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Erro ao cancelar extra';
      toast.error(errorMessage);
      setShowCancelModal(false);
    } finally {
      setCancelling(false);
    }
  };

  const isActive = addon.status === AddonStatus.ACTIVE;
  const monthlyPrice =
    typeof addon.monthlyPrice === 'number'
      ? addon.monthlyPrice
      : Number(addon.monthlyPrice || 0);

  return (
    <Card className={className} $isActive={isActive}>
      <CardHeader>
        <div>
          <CardTitle>{ADDON_TYPE_LABELS[addon.type]}</CardTitle>
          <CardInfo>Quantidade: {addon.quantity}</CardInfo>
        </div>
        <StatusBadge $isActive={isActive}>
          {ADDON_STATUS_LABELS[addon.status]}
        </StatusBadge>
      </CardHeader>

      <CardContent>
        <InfoRow>
          <strong>Valor mensal:</strong> R$ {monthlyPrice.toFixed(2)}
        </InfoRow>
        <InfoRow>
          <strong>Início:</strong>{' '}
          {new Date(addon.startDate).toLocaleDateString('pt-BR')}
        </InfoRow>
        {addon.endDate && (
          <InfoRow>
            <strong>Fim:</strong>{' '}
            {new Date(addon.endDate).toLocaleDateString('pt-BR')}
          </InfoRow>
        )}
        {addon.notes && (
          <InfoRow>
            <strong>Notas:</strong> {addon.notes}
          </InfoRow>
        )}
      </CardContent>

      {isActive && (
        <CancelButton onClick={handleCancelClick} disabled={cancelling}>
          Cancelar Extra
        </CancelButton>
      )}

      <CancelAddonConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        addon={addon}
        loading={cancelling}
      />
    </Card>
  );
}
