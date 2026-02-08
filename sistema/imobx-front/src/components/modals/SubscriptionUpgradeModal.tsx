import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { MdClose, MdArrowUpward, MdCheck } from 'react-icons/md';
import type {
  Plan,
  Subscription,
  SubscriptionUsage,
} from '../../types/subscriptionTypes';
import { subscriptionService } from '../../services/subscriptionService';
import { toast } from 'react-toastify';

interface SubscriptionUpgradeModalProps {
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

const CurrentPlanCard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 2px solid ${props => props.theme.colors.border};
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const PlanCard = styled.div<{ $isSelected: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid
    ${props =>
      props.$isSelected
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const PlanName = styled.h3`
  margin: 0 0 8px 0;
  color: ${props => props.theme.colors.text};
  font-size: 1.25rem;
`;

const PlanPrice = styled.div`
  font-size: 2rem;
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

const SelectedBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const SummaryCard = styled.div`
  background: rgba(34, 197, 94, 0.1);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.success};
`;

const SummaryTitle = styled.h4`
  margin: 0 0 12px 0;
  color: ${props => props.theme.colors.success};
  font-size: 1.1rem;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
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
  `
      : `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.border};
    }
  `}
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

export const SubscriptionUpgradeModal: React.FC<
  SubscriptionUpgradeModalProps
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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!currentPlan && !currentSubscription && !currentUsage) {
      setPlans([]);
      setSelectedPlan(null);
      return;
    }

    loadPlans();
  }, [isOpen, currentPlan, currentSubscription, currentUsage, basePrice]);

  const loadPlans = async () => {
    try {
      const allPlans = await subscriptionService.getAvailablePlans();

      // Filtrar apenas planos superiores ao atual
      const upgradablePlans = allPlans.filter(
        plan => plan.isActive && plan.price > basePrice
      );

      setPlans(upgradablePlans);
    } catch (error) {
      toast.error('Erro ao carregar planos');
    }
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;

    if (!currentPlan || !currentSubscription) {
      toast.error(
        'Informações da assinatura indisponíveis. Tente novamente mais tarde.'
      );
      return;
    }

    try {
      setLoading(true);

      const result = await subscriptionService.upgradePlan(
        currentSubscription.id,
        selectedPlan.id,
        {
          notes: `Upgrade de ${currentPlan.name} para ${selectedPlan.name}`,
          notifyUsers: true,
          applyImmediately: true,
        }
      );

      toast.success(`✅ Upgrade realizado com sucesso! ${result.message}`);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao fazer upgrade';
      toast.error('Erro ao fazer upgrade: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateSavings = () => {
    if (!selectedPlan) return 0;
    return selectedPlan.price - basePrice;
  };

  const getNewModules = () => {
    if (!selectedPlan) return [];
    return selectedPlan.modules.filter(
      module => !currentModules.includes(module)
    );
  };

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
            <MdArrowUpward size={24} />
            Upgrade de Plano
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Plano Atual */}
          <CurrentPlanCard>
            <h4
              style={{
                margin: '0 0 8px 0',
                color: 'var(--color-text-secondary)',
              }}
            >
              Plano Atual
            </h4>
            <h3 style={{ margin: '0 0 4px 0' }}>{currentPlanName}</h3>
            <p
              style={{
                margin: '0',
                fontSize: '1.1rem',
                color: 'var(--color-primary)',
              }}
            >
              R$ {basePrice.toFixed(2)}/mês
            </p>
          </CurrentPlanCard>

          {/* Planos Disponíveis */}
          <h4 style={{ marginBottom: '16px' }}>Escolha seu novo plano</h4>

          <PlansGrid>
            {plans.length === 0 && (
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.95rem',
                }}
              >
                Nenhum plano superior ao atual está disponível neste momento.
              </p>
            )}
            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                $isSelected={selectedPlan?.id === plan.id}
                onClick={() => setSelectedPlan(plan)}
              >
                {selectedPlan?.id === plan.id && (
                  <SelectedBadge>
                    <MdCheck size={12} />
                    Selecionado
                  </SelectedBadge>
                )}

                <PlanName>{plan.name}</PlanName>
                <PlanPrice>R$ {plan.price.toFixed(2)}/mês</PlanPrice>

                <PlanFeatures>
                  <FeatureItem>
                    <span>🏢</span>
                    <span>{plan.maxCompanies} empresas</span>
                  </FeatureItem>
                  <FeatureItem>
                    <span>👥</span>
                    <span>{plan.features.maxUsers} usuários</span>
                  </FeatureItem>
                  <FeatureItem>
                    <span>🏠</span>
                    <span>{plan.features.maxProperties} propriedades</span>
                  </FeatureItem>
                  <FeatureItem>
                    <span>💾</span>
                    <span>{plan.features.storageGB} GB armazenamento</span>
                  </FeatureItem>
                  <FeatureItem>
                    <span>⚙️</span>
                    <span>{plan.modules.length} módulos incluídos</span>
                  </FeatureItem>
                </PlanFeatures>
              </PlanCard>
            ))}
          </PlansGrid>

          {/* Resumo da Mudança */}
          {selectedPlan && (
            <SummaryCard>
              <SummaryTitle>📊 Resumo da Mudança</SummaryTitle>
              <SummaryItem>
                <span>Diferença mensal:</span>
                <span
                  style={{ fontWeight: '600', color: 'var(--color-success)' }}
                >
                  +R$ {calculateSavings().toFixed(2)}
                </span>
              </SummaryItem>
              <SummaryItem>
                <span>Novos módulos:</span>
                <span>{getNewModules().length} módulos adicionais</span>
              </SummaryItem>
              <SummaryItem>
                <span>Aplicação:</span>
                <span>Imediata</span>
              </SummaryItem>
              {getNewModules().length > 0 && (
                <div style={{ marginTop: '12px', fontSize: '0.85rem' }}>
                  <strong>Novos módulos:</strong> {getNewModules().join(', ')}
                </div>
              )}
            </SummaryCard>
          )}

          {/* Botões de Ação */}
          <ActionButtons>
            <Button $variant='secondary' onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              $variant='primary'
              onClick={handleUpgrade}
              disabled={!selectedPlan || loading}
            >
              {loading && <LoadingSpinner />}
              {loading ? 'Processando...' : 'Confirmar Upgrade'}
            </Button>
          </ActionButtons>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};
