import { useState, useCallback } from 'react';
import { authStorage } from '../services/authStorage';
import { subscriptionService } from '../services/subscriptionService';
import type {
  SubscriptionStatus,
  SubscriptionPlan,
  SubscriptionStatusType,
} from '../types/subscription';
import type {
  StartSubscriptionPayload,
  Plan,
} from '../types/subscriptionTypes';

const convertPlanToSubscriptionPlan = (
  plan: Plan | null | undefined
): SubscriptionPlan => {
  if (!plan) {
    return {
      id: 'unknown',
      name: 'Plano Desconhecido',
      description: '',
      price: 0,
      currency: 'BRL',
      interval: 'monthly',
      features: [],
      supportLevel: 'basic',
      modules: [],
    };
  }

  const featureSummary: string[] = [];
  if (plan.features?.maxUsers !== undefined) {
    featureSummary.push(`${plan.features.maxUsers} usuários incluídos`);
  }
  if (plan.features?.maxProperties !== undefined) {
    featureSummary.push(`${plan.features.maxProperties} propriedades`);
  }
  if (plan.features?.storageGB !== undefined) {
    featureSummary.push(`${plan.features.storageGB}GB de armazenamento`);
  }

  return {
    id: plan.id,
    name: plan.name,
    description: plan.description,
    price: plan.price,
    currency: 'BRL',
    interval: 'monthly',
    features: featureSummary,
    isPopular: plan.displayOrder === 0 ? true : undefined,
    maxUsers: plan.features?.maxUsers,
    maxProperties: plan.features?.maxProperties,
    maxCompanies: plan.maxCompanies,
    maxStorage: plan.features?.storageGB,
    supportLevel: 'priority',
    modules: plan.modules,
    billingType: plan.billingType,
    trialDays: plan.trialDays,
    planChangeLockedUntil: plan.planChangeLockedUntil,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
};

export const useSubscription = () => {
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar se usuário é master (bypass de assinatura)
  const isMasterUser = useCallback((): boolean => {
    const user = authStorage.getUserData();
    return user?.role === 'master';
  }, []);

  // Verificar assinatura real do backend
  const checkSubscription =
    useCallback(async (): Promise<SubscriptionStatus> => {
      try {
        const user = authStorage.getUserData();
        if (!user) {
          throw new Error('Usuário não autenticado');
        }

        // Se for usuário master, buscar assinatura real do banco
        if (isMasterUser()) {
          // Buscar assinatura ativa do master no banco
          const activeSubscription =
            await subscriptionService.getMyActiveSubscription();

          if (!activeSubscription) {
            console.warn(
              '⚠️ useSubscription: Usuário master sem assinatura ativa'
            );
            // Retornar acesso completo para master mesmo sem assinatura
            return {
              hasActiveSubscription: true,
              subscription: undefined,
              plan: undefined,
              daysUntilExpiry: 365,
              isExpired: false,
              isExpiringSoon: false,
              canAccessFeatures: true,
              isMasterUser: true,
              statusReason: 'active',
            };
          }

          // Buscar detalhes do plano
          let plan: any = null;
          try {
            const backendPlans = await subscriptionService.getAllPlans();
            const allPlans = backendPlans.map(
              subscriptionService.convertBackendPlanToFrontend
            );
            plan = allPlans.find(p => p.id === activeSubscription.planId);

            if (!plan) {
              console.warn(
                '⚠️ useSubscription: Plano não encontrado para master, usando plano padrão'
              );
              plan = {
                id: activeSubscription.planId,
                name: 'Plano Master',
                type: 'custom' as const,
                price: 0,
                maxCompanies: 999,
                description: 'Plano administrativo master',
                modules: [],
                features: {},
                isActive: true,
                isDefault: false,
                displayOrder: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
            }
          } catch (planError) {
            console.error(
              '❌ useSubscription: Erro ao buscar planos para master:',
              planError
            );
            plan = {
              id: 'master-default',
              name: 'Plano Master',
              type: 'custom' as const,
              price: 0,
              maxCompanies: 999,
              description: 'Plano administrativo master',
              modules: [],
              features: {},
              isActive: true,
              isDefault: false,
              displayOrder: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }

          const frontendPlan =
            subscriptionService.convertBackendPlanToFrontend(plan);
          const frontendSubscription =
            subscriptionService.convertBackendSubscriptionToFrontend(
              activeSubscription,
              frontendPlan
            );

          const endDate = new Date(activeSubscription.endDate);
          const daysUntilExpiry = Math.ceil(
            (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );

          return {
            hasActiveSubscription: true,
            subscription: frontendSubscription,
            plan: frontendPlan,
            daysUntilExpiry,
            isExpired: false,
            isExpiringSoon: daysUntilExpiry <= 7 && daysUntilExpiry > 0,
            canAccessFeatures: true,
            isMasterUser: true,
            statusReason:
              (activeSubscription.status as SubscriptionStatusType) ?? 'active',
          };
        }

        // ✅ NOVA API - Verificar acesso detalhado à assinatura
        const accessInfo = await subscriptionService.checkSubscriptionAccess();

        if (!accessInfo.hasAccess) {
          return {
            hasActiveSubscription: false,
            subscription: accessInfo.subscription ?? undefined,
            plan: undefined,
            daysUntilExpiry: accessInfo.daysUntilExpiry ?? undefined,
            isExpired: accessInfo.isExpired,
            isExpiringSoon: accessInfo.isExpiringSoon,
            canAccessFeatures: accessInfo.canAccessFeatures,
            statusReason: accessInfo.status ?? 'unknown',
          };
        }

        // Buscar assinatura ativa
        const activeSubscription =
          await subscriptionService.getMyActiveSubscription();

        if (!activeSubscription) {
          return {
            hasActiveSubscription: false,
            subscription: undefined,
            plan: undefined,
            daysUntilExpiry: 0,
            isExpired: true,
            isExpiringSoon: false,
            canAccessFeatures: false,
            statusReason: 'none',
          };
        }

        // Verificar se a assinatura não expirou
        const endDate = new Date(activeSubscription.endDate);
        const now = new Date();

        if (endDate < now) {
          return {
            hasActiveSubscription: false,
            subscription: undefined,
            plan: undefined,
            daysUntilExpiry: 0,
            isExpired: true,
            isExpiringSoon: false,
            canAccessFeatures: false,
            statusReason: 'expired',
          };
        }

        // Buscar detalhes do plano
        const backendPlans = await subscriptionService.getAllPlans();
        const allPlans = backendPlans.map(
          subscriptionService.convertBackendPlanToFrontend
        );
        let plan = allPlans.find(p => p.id === activeSubscription.planId);

        // Se o plano não for encontrado (planId undefined ou inválido), usar o primeiro plano disponível
        if (!plan) {
          console.warn(
            '⚠️ useSubscription: Plano não encontrado, usando plano padrão',
            {
              planIdDaAssinatura: activeSubscription.planId,
              planosDisponiveis: allPlans.map(p => p.id),
            }
          );
          plan = allPlans[0]; // Usar primeiro plano como padrão

          if (!plan) {
            throw new Error('Nenhum plano disponível no sistema');
          }
        }

        const frontendPlan =
          subscriptionService.convertBackendPlanToFrontend(plan);
        const frontendSubscription =
          subscriptionService.convertBackendSubscriptionToFrontend(
            activeSubscription,
            frontendPlan
          );

        const daysUntilExpiry = Math.ceil(
          (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        return {
          hasActiveSubscription: true,
          subscription: frontendSubscription,
          plan: frontendPlan,
          daysUntilExpiry,
          isExpired: false,
          isExpiringSoon: daysUntilExpiry <= 7 && daysUntilExpiry > 0,
          canAccessFeatures: true,
          statusReason:
            (activeSubscription.status as SubscriptionStatusType) ?? 'active',
        };
      } catch (err) {
        console.error('Erro ao verificar assinatura:', err);
        throw err;
      }
    }, [isMasterUser]);

  // Verificar se usuário pode acessar uma feature específica
  const canAccessFeature = useCallback(
    (feature: string): boolean => {
      if (!subscriptionStatus) return false;

      // Usuários master sempre têm acesso
      if (isMasterUser()) return true;

      if (!subscriptionStatus.hasActiveSubscription) return false;

      // Verificar se o plano tem o módulo necessário
      if (subscriptionStatus.plan?.modules) {
        const moduleMap: Record<string, string> = {
          kanban: 'kanban_management',
          advanced_reports: 'advanced_reports',
          financial: 'financial_management',
          marketing: 'marketing_tools',
          api: 'api_integrations',
          custom_fields: 'custom_fields',
          automation: 'workflow_automation',
          bi: 'business_intelligence',
          integrations: 'third_party_integrations',
          white_label: 'white_label',
          priority_support: 'priority_support',
        };

        const requiredModule = moduleMap[feature];
        if (requiredModule) {
          return subscriptionStatus.plan.modules.includes(requiredModule);
        }
      }

      return subscriptionStatus.canAccessFeatures;
    },
    [subscriptionStatus, isMasterUser]
  );

  // Obter plano recomendado baseado no uso atual
  const getRecommendedPlan = useCallback((): SubscriptionPlan | null => {
    if (!plans.length) return null;

    if (!subscriptionStatus?.plan) {
      return plans.find(p => p.isPopular) || plans[1] || plans[0];
    }

    // Se já tem assinatura, retornar o próximo plano
    const currentIndex = plans.findIndex(
      p => p.id === subscriptionStatus.plan?.id
    );
    if (currentIndex < plans.length - 1) {
      return plans[currentIndex + 1];
    }

    return subscriptionStatus.plan;
  }, [subscriptionStatus, plans]);

  // Carregar status da assinatura
  const loadSubscriptionStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const status = await checkSubscription();
      setSubscriptionStatus(status);
    } catch (err) {
      console.error('Erro ao carregar assinatura:', err);
      setError('Erro ao carregar status da assinatura');
      setSubscriptionStatus(null);
    } finally {
      setLoading(false);
    }
  }, [checkSubscription]);

  // Carregar planos disponíveis
  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const availablePlans = await subscriptionService.getAvailablePlans();
      setPlans(availablePlans.map(convertPlanToSubscriptionPlan));
    } catch (err) {
      setError('Erro ao carregar planos');
      console.error('Erro ao carregar planos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar assinatura
  const createSubscription = useCallback(
    async (payload: StartSubscriptionPayload) => {
      try {
        setLoading(true);
        setError(null);
        const subscription =
          await subscriptionService.startSubscription(payload);

        const endDate = new Date(subscription.endDate);
        const daysUntilExpiry = Math.ceil(
          (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        const newStatus: SubscriptionStatus = {
          hasActiveSubscription: true,
          subscription: {
            id: subscription.id,
            userId: authStorage.getUserData()?.id ?? '',
            planId: subscription.planId,
            status: subscription.status,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            autoRenew: true,
            nextPaymentDate: subscription.nextBillingDate ?? undefined,
            lastPaymentDate: undefined,
            createdAt: subscription.createdAt ?? new Date().toISOString(),
            updatedAt: subscription.updatedAt ?? new Date().toISOString(),
            trialEndsAt: subscription.trialEndsAt,
            deactivatedAt: subscription.deactivatedAt,
            planChangeLockedUntil: subscription.planChangeLockedUntil,
            reactivationAvailableAt: subscription.reactivationAvailableAt,
            lastCardValidatedAt: subscription.lastCardValidatedAt,
            currentCompanies: subscription.currentCompanies,
            price: subscription.price,
            notes: subscription.notes,
            asaasSubscriptionId: subscription.asaasSubscriptionId,
            plan: convertPlanToSubscriptionPlan(subscription.plan),
          },
          plan: convertPlanToSubscriptionPlan(subscription.plan),
          daysUntilExpiry,
          isExpired: false,
          isExpiringSoon: false,
          canAccessFeatures: true,
        };

        setSubscriptionStatus(newStatus);
        return newStatus;
      } catch (err) {
        setError('Erro ao criar assinatura');
        console.error('Erro ao criar assinatura:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Carregar dados iniciais APENAS quando necessário
  // Removido carregamento automático para evitar chamadas desnecessárias

  return {
    subscriptionStatus,
    plans,
    loading,
    error,
    checkSubscription,
    canAccessFeature,
    getRecommendedPlan,
    createSubscription,
    loadSubscriptionStatus,
    loadPlans,
    isMasterUser,
  };
};
