import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { MdClose, MdArrowDownward, MdWarning, MdCancel } from 'react-icons/md';
import type {
  Plan,
  Subscription,
  SubscriptionUsage,
} from '../../types/subscriptionTypes';
import { subscriptionService } from '../../services/subscriptionService';
import { toast } from 'react-toastify';

interface SubscriptionDowngradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: Plan | null;
  currentSubscription?: Subscription | null;
  currentUsage?: SubscriptionUsage | null;
  currentPrice?: number | null;
  onSuccess?: () => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: flex-start;
  justify-content: center;
  z-index: 9999999 !important;
  padding: 100px 20px 20px 20px;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 10000000 !important;
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const WarningAlert = styled.div`
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid ${props => props.theme.colors.warning};
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
`;

const WarningTitle = styled.h4`
  margin: 0 0 8px 0;
  color: ${props => props.theme.colors.warning};
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PlansComparison = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

const PlanCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
`;

const PlanName = styled.h3`
  margin: 0 0 8px 0;
  color: ${props => props.theme.colors.text};
  font-size: 1.25rem;
`;

const PlanPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 16px;
`;

const PlanFeatures = styled.div`
  margin-bottom: 16px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const LostResourcesCard = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid ${props => props.theme.colors.error};
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
`;

const LostResourcesTitle = styled.h4`
  margin: 0 0 16px 0;
  color: ${props => props.theme.colors.error};
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LostResourceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
`;

const ConfirmationCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  line-height: 1.4;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{
  $variant?: 'primary' | 'secondary' | 'warning';
}>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;

  ${props => {
    if (props.$variant === 'warning') {
      return `
        background: ${props.theme.colors.warning};
        color: white;
        
        &:hover {
          filter: brightness(0.9);
          transform: translateY(-1px);
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      `;
    } else if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;
        
        &:hover {
          background: ${props.theme.colors.primaryDark};
          transform: translateY(-1px);
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.backgroundSecondary};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};
        
        &:hover {
          background: ${props.theme.colors.border};
        }
      `;
    }
  }}
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const SubscriptionDowngradeModal: React.FC<
  SubscriptionDowngradeModalProps
> = ({
  isOpen,
  onClose,
  currentPlan,
  currentSubscription,
  currentUsage,
  currentPrice,
  onSuccess,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);

  const basePrice = useMemo(() => {
    if (typeof currentPrice === 'number' && !Number.isNaN(currentPrice)) {
      return currentPrice;
    }
    if (typeof currentPlan?.price === 'number') {
      return currentPlan.price;
    }
    if (typeof currentSubscription?.price === 'number') {
      return currentSubscription.price;
    }
    return 0;
  }, [currentPrice, currentPlan, currentSubscription]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setConfirmed(false);
    setSelectedPlan(null);
    loadPlans();
  }, [isOpen, basePrice]);

  const loadPlans = async () => {
    try {
      const allPlans = await subscriptionService.getAvailablePlans();

      // Filtrar apenas planos inferiores ao atual
      const downgradablePlans = allPlans.filter(
        plan => plan.isActive && plan.price < basePrice
      );

      setPlans(downgradablePlans);
    } catch (error) {
      toast.error('Erro ao carregar planos');
    }
  };

  const handleDowngrade = async () => {
    if (!selectedPlan || !confirmed) return;

    if (!currentPlan || !currentSubscription) {
      toast.error(
        'Informações da assinatura indisponíveis. Tente novamente mais tarde.'
      );
      return;
    }

    try {
      setLoading(true);

      await subscriptionService.downgradePlan(
        currentSubscription.id,
        selectedPlan.id,
        {
          notes: `Downgrade de ${currentPlanName} para ${selectedPlan.name}`,
          notifyUsers: true,
          applyImmediately: true,
        }
      );

      toast.success('✅ Downgrade realizado com sucesso!');

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao fazer downgrade';
      toast.error('Erro ao fazer downgrade: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calcular recursos que serão perdidos
  const getLostModules = () => {
    if (!selectedPlan) return [];
    return currentModules.filter(
      module => !selectedPlan.modules.includes(module)
    );
  };

  const getLostFeatures = () => {
    if (!selectedPlan) return [];
    const lost = [];

    if (currentPropertiesLimit > (selectedPlan.features?.maxProperties ?? 0)) {
      lost.push({
        type: 'properties',
        current: currentPropertiesLimit,
        new: selectedPlan.features?.maxProperties ?? 0,
        label: 'Limite de Propriedades',
      });
    }

    if (currentUsersLimit > (selectedPlan.features?.maxUsers ?? 0)) {
      lost.push({
        type: 'users',
        current: currentUsersLimit,
        new: selectedPlan.features?.maxUsers ?? 0,
        label: 'Limite de Usuários',
      });
    }

    if (currentStorageLimit > (selectedPlan.features?.storageGB ?? 0)) {
      lost.push({
        type: 'storage',
        current: currentStorageLimit,
        new: selectedPlan.features?.storageGB ?? 0,
        label: 'Armazenamento',
      });
    }

    return lost;
  };

  const currentPlanName = useMemo(() => {
    return (
      currentPlan?.name ??
      currentUsage?.planName ??
      currentSubscription?.plan?.name ??
      'Plano atual'
    );
  }, [currentPlan, currentUsage, currentSubscription]);

  const currentCompaniesLimit = useMemo(() => {
    if (typeof currentPlan?.maxCompanies === 'number')
      return currentPlan.maxCompanies;
    if (typeof currentUsage?.companies?.limit === 'number')
      return currentUsage.companies.limit;
    return 0;
  }, [currentPlan, currentUsage]);

  const currentUsersLimit = useMemo(() => {
    if (typeof currentPlan?.features?.maxUsers === 'number')
      return currentPlan.features.maxUsers;
    if (typeof currentUsage?.users?.limit === 'number')
      return currentUsage.users.limit;
    return 0;
  }, [currentPlan, currentUsage]);

  const currentPropertiesLimit = useMemo(() => {
    if (typeof currentPlan?.features?.maxProperties === 'number')
      return currentPlan.features.maxProperties;
    if (typeof currentUsage?.properties?.limit === 'number')
      return currentUsage.properties.limit;
    return 0;
  }, [currentPlan, currentUsage]);

  const currentStorageLimit = useMemo(() => {
    if (typeof currentPlan?.features?.storageGB === 'number')
      return currentPlan.features.storageGB;
    if (typeof currentUsage?.storage?.limit === 'number')
      return currentUsage.storage.limit;
    return 0;
  }, [currentPlan, currentUsage]);

  const currentModules = useMemo<string[]>(() => {
    if (Array.isArray(currentPlan?.modules) && currentPlan.modules.length) {
      return currentPlan.modules as string[];
    }
    if (Array.isArray(currentUsage?.activeModules)) {
      return currentUsage.activeModules;
    }
    return [];
  }, [currentPlan, currentUsage]);

  if (!isOpen) return null;

  return (
    <ModalOverlay
      $isOpen={isOpen}
      onClick={onClose}
      style={{ zIndex: 9999999 }}
    >
      <ModalContent
        onClick={e => e.stopPropagation()}
        style={{ zIndex: 10000000 }}
      >
        <ModalHeader>
          <ModalTitle>
            <MdArrowDownward size={24} />
            Downgrade de Plano
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Aviso */}
          <WarningAlert>
            <WarningTitle>
              <MdWarning size={20} />
              Atenção
            </WarningTitle>
            <p
              style={{
                margin: '0',
                fontSize: '0.95rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              Ao fazer downgrade, alguns recursos e módulos serão removidos.
              Revise as mudanças abaixo com atenção.
            </p>
          </WarningAlert>

          {/* Comparação de Planos */}
          <h4 style={{ marginBottom: '16px' }}>Escolha seu novo plano</h4>

          <PlansComparison>
            {/* Plano Atual */}
            <PlanCard>
              <PlanName>{currentPlanName}</PlanName>
              <PlanPrice>R$ {basePrice.toFixed(2)}/mês</PlanPrice>
              <PlanFeatures>
                <FeatureItem>
                  <span>🏢</span>
                  <span>{currentCompaniesLimit} empresas</span>
                </FeatureItem>
                <FeatureItem>
                  <span>👥</span>
                  <span>{currentUsersLimit} usuários</span>
                </FeatureItem>
                <FeatureItem>
                  <span>🏠</span>
                  <span>{currentPropertiesLimit} propriedades</span>
                </FeatureItem>
                <FeatureItem>
                  <span>💾</span>
                  <span>{currentStorageLimit} GB</span>
                </FeatureItem>
                <FeatureItem>
                  <span>⚙️</span>
                  <span>{currentModules.length} módulos</span>
                </FeatureItem>
              </PlanFeatures>
            </PlanCard>

            {/* Planos Disponíveis */}
            <PlanCard>
              <select
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  marginBottom: '16px',
                }}
                value={selectedPlan?.id || ''}
                onChange={e => {
                  const plan = plans.find(p => p.id === e.target.value);
                  setSelectedPlan(plan || null);
                }}
                disabled={!plans.length}
              >
                <option value=''>
                  {plans.length
                    ? 'Selecione um plano...'
                    : 'Nenhum plano disponível'}
                </option>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - R$ {plan.price.toFixed(2)}/mês
                  </option>
                ))}
              </select>
              {!plans.length && (
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9rem',
                  }}
                >
                  Não há planos com preço inferior ao atual disponíveis no
                  momento.
                </p>
              )}

              {selectedPlan && (
                <>
                  <PlanName>{selectedPlan.name}</PlanName>
                  <PlanPrice>R$ {selectedPlan.price.toFixed(2)}/mês</PlanPrice>
                  <PlanFeatures>
                    <FeatureItem>
                      <span>🏢</span>
                      <span>{selectedPlan.maxCompanies} empresas</span>
                    </FeatureItem>
                    <FeatureItem>
                      <span>👥</span>
                      <span>
                        {selectedPlan.features?.maxUsers ?? 0} usuários
                      </span>
                    </FeatureItem>
                    <FeatureItem>
                      <span>🏠</span>
                      <span>
                        {selectedPlan.features?.maxProperties ?? 0} propriedades
                      </span>
                    </FeatureItem>
                    <FeatureItem>
                      <span>💾</span>
                      <span>{selectedPlan.features?.storageGB ?? 0} GB</span>
                    </FeatureItem>
                    <FeatureItem>
                      <span>⚙️</span>
                      <span>{selectedPlan.modules.length} módulos</span>
                    </FeatureItem>
                  </PlanFeatures>
                </>
              )}
            </PlanCard>
          </PlansComparison>

          {/* O que você vai perder */}
          {selectedPlan && (
            <LostResourcesCard>
              <LostResourcesTitle>
                <MdCancel size={20} />O que você vai perder:
              </LostResourcesTitle>

              {getLostModules().length > 0 && (
                <LostResourceItem>
                  <MdCancel size={16} />
                  <div>
                    <strong>Módulos:</strong> {getLostModules().length} módulos
                    serão removidos
                    <div
                      style={{
                        fontSize: '0.85rem',
                        marginTop: '4px',
                        opacity: 0.8,
                      }}
                    >
                      {getLostModules().join(', ')}
                    </div>
                  </div>
                </LostResourceItem>
              )}

              {getLostFeatures().map(feature => (
                <LostResourceItem key={feature.type}>
                  <MdCancel size={16} />
                  <div>
                    <strong>{feature.label}:</strong> De {feature.current} para{' '}
                    {feature.new}
                  </div>
                </LostResourceItem>
              ))}
            </LostResourcesCard>
          )}

          {/* Checkbox de confirmação */}
          {selectedPlan && (
            <ConfirmationCheckbox>
              <Checkbox
                type='checkbox'
                id='confirm-downgrade'
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
              />
              <CheckboxLabel htmlFor='confirm-downgrade'>
                Entendo que vou perder recursos e aceito fazer o downgrade
              </CheckboxLabel>
            </ConfirmationCheckbox>
          )}

          {/* Botões de Ação */}
          <ActionButtons>
            <Button $variant='secondary' onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              $variant='warning'
              onClick={handleDowngrade}
              disabled={!selectedPlan || !confirmed || loading}
            >
              {loading && <LoadingSpinner />}
              {loading ? 'Processando...' : 'Confirmar Downgrade'}
            </Button>
          </ActionButtons>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};
