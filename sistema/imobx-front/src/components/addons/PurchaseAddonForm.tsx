import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { MdShoppingCart, MdRefresh } from 'react-icons/md';
import { usePurchaseAddon } from '../../hooks/usePurchaseAddon';
import { useAvailableAddons } from '../../hooks/useAvailableAddons';
import { toast } from 'react-toastify';
import { useTheme } from '../../contexts/ThemeContext';
import { PurchaseAddonConfirmationModal } from '../modals/PurchaseAddonConfirmationModal';
import type { AddonType } from '../../types/addons';
import { ADDON_TYPE_LABELS } from '../../types/addons';

interface PurchaseAddonFormProps {
  subscriptionId: string;
  currentSubscriptionPrice?: number | null;
  onSuccess?: () => void;
  className?: string;
}

const FormContainer = styled.div`
  padding: 0;
`;

const FormField = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  color: ${props => (props.theme.mode === 'dark' ? '#e2e8f0' : '#1e293b')};
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(148, 163, 184, 0.3)'
        : 'rgba(226, 232, 240, 0.8)'};
  background: ${props =>
    props.theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : '#ffffff'};
  color: ${props => (props.theme.mode === 'dark' ? '#e2e8f0' : '#1e293b')};
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(59, 130, 246, 0.2)'
          : 'rgba(59, 130, 246, 0.1)'};
  }

  &:hover {
    border-color: ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(148, 163, 184, 0.5)'
        : 'rgba(148, 163, 184, 0.6)'};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(148, 163, 184, 0.3)'
        : 'rgba(226, 232, 240, 0.8)'};
  background: ${props =>
    props.theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : '#ffffff'};
  color: ${props => (props.theme.mode === 'dark' ? '#e2e8f0' : '#1e293b')};
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(59, 130, 246, 0.2)'
          : 'rgba(59, 130, 246, 0.1)'};
  }

  &:hover {
    border-color: ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(148, 163, 184, 0.5)'
        : 'rgba(148, 163, 184, 0.6)'};
  }
`;

const PriceCard = styled.div`
  padding: 20px;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(59, 130, 246, 0.1)'
      : 'rgba(59, 130, 246, 0.05)'};
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(59, 130, 246, 0.2)'
        : 'rgba(59, 130, 246, 0.15)'};
  border-radius: 12px;
  margin-bottom: 20px;
`;

const PriceTitle = styled.p`
  margin: 0 0 8px 0;
  font-weight: 700;
  font-size: 1rem;
  color: ${props => (props.theme.mode === 'dark' ? '#e2e8f0' : '#1e293b')};
`;

const PriceDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${props => (props.theme.mode === 'dark' ? '#cbd5e1' : '#64748b')};
  line-height: 1.5;
`;

const ErrorMessage = styled.div`
  padding: 12px 16px;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(239, 68, 68, 0.15)'
      : 'rgba(239, 68, 68, 0.05)'};
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(239, 68, 68, 0.3)'
        : 'rgba(239, 68, 68, 0.2)'};
  border-radius: 8px;
  margin-bottom: 20px;
  color: ${props => (props.theme.mode === 'dark' ? '#f87171' : '#ef4444')};
  font-size: 0.875rem;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: ${props =>
    props.theme.mode === 'dark' ? '#3b82f6' : props.theme.colors.primary};
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: ${props =>
      props.theme.mode === 'dark' ? '#2563eb' : props.theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(59, 130, 246, 0.3)'
          : 'rgba(59, 130, 246, 0.2)'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.3)'
        : 'rgba(0, 0, 0, 0.2)'};
  border-top-color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : '#3b82f6'};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  display: inline-block;
`;

const LoadingContainer = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${props => (props.theme.mode === 'dark' ? '#cbd5e1' : '#64748b')};
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

/**
 * Componente de formulário para compra de extras (add-ons)
 */
export function PurchaseAddonForm({
  subscriptionId,
  currentSubscriptionPrice = null,
  onSuccess,
  className,
}: PurchaseAddonFormProps) {
  const { theme } = useTheme();
  const { addons: availableAddons, loading: loadingAddons } =
    useAvailableAddons(subscriptionId);
  const { purchaseAddon, loading, error } = usePurchaseAddon(subscriptionId);
  const [selectedType, setSelectedType] = useState<AddonType | ''>('');
  const [quantity, setQuantity] = useState(1);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handlePurchaseClick = () => {
    if (!selectedType) {
      toast.error('Selecione um tipo de extra');
      return;
    }

    if (quantity < 1) {
      toast.error('A quantidade deve ser maior que zero');
      return;
    }

    setShowConfirmationModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedType) return;

    try {
      const addon = await purchaseAddon({
        type: selectedType as AddonType,
        quantity,
      });

      const monthlyPrice =
        typeof addon.monthlyPrice === 'number'
          ? addon.monthlyPrice
          : Number(addon.monthlyPrice || 0);

      toast.success(
        `Extra comprado com sucesso! Valor adicional: R$ ${monthlyPrice.toFixed(2)}/mês`
      );

      // Reset form
      setSelectedType('');
      setQuantity(1);
      setShowConfirmationModal(false);

      // Callback de sucesso
      onSuccess?.();
    } catch (err) {
      console.error('Erro ao comprar add-on:', err);
      setShowConfirmationModal(false);
    }
  };

  const selectedAddon = availableAddons.find(a => a.type === selectedType);
  const totalPrice = selectedAddon ? selectedAddon.unitPrice * quantity : 0;
  const addonName = selectedAddon ? selectedAddon.description : '';

  if (loadingAddons) {
    return (
      <LoadingContainer className={className}>
        <Spinner />
        <span>Carregando extras disponíveis...</span>
      </LoadingContainer>
    );
  }

  return (
    <>
      <FormContainer className={className}>
        <FormField>
          <Label>Tipo de Extra</Label>
          <Select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value as AddonType)}
          >
            <option value=''>Selecione um extra...</option>
            {availableAddons.map(addon => (
              <option key={addon.type} value={addon.type}>
                {addon.description} - R$ {addon.unitPrice.toFixed(2)}/unidade
              </option>
            ))}
          </Select>
        </FormField>

        {selectedType && (
          <FormField>
            <Label>Quantidade</Label>
            <Input
              type='number'
              min='1'
              value={quantity}
              onChange={e =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
          </FormField>
        )}

        {selectedType && (
          <PriceCard>
            <PriceTitle>
              Valor adicional mensal: R$ {totalPrice.toFixed(2)}
            </PriceTitle>
            <PriceDescription>
              Este valor será adicionado à sua assinatura mensal e atualizado
              automaticamente no Asaas.
            </PriceDescription>
          </PriceCard>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button
          onClick={handlePurchaseClick}
          disabled={!selectedType || loading}
        >
          {loading ? (
            <>
              <Spinner />
              Processando...
            </>
          ) : (
            <>
              <MdShoppingCart size={18} />
              Comprar Extra
            </>
          )}
        </Button>
      </FormContainer>

      <PurchaseAddonConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmPurchase}
        addonName={addonName}
        addonQuantity={quantity}
        addonUnitPrice={selectedAddon?.unitPrice || 0}
        addonTotalPrice={totalPrice}
        currentSubscriptionPrice={currentSubscriptionPrice}
        loading={loading}
      />
    </>
  );
}
