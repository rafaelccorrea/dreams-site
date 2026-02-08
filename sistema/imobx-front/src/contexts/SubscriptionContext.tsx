/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { authStorage } from '../services/authStorage';
import type {
  SubscriptionStatus,
  SubscriptionStatusType,
  SubscriptionPlan,
  UserSubscription,
} from '../types/subscription';
import type {
  Plan,
  Subscription as RawSubscription,
  StartSubscriptionPayload,
  CompanyLimits,
  SubscriptionLimits,
  SubscriptionValidations,
} from '../types/subscriptionTypes';

export interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus | null;
  plans: Plan[];
  loading: boolean;
  error: string | null;
  // Dados completos da nova API
  subscriptionLimits: SubscriptionLimits | null; // Todos os limites (users, properties, storage, companies)
  subscriptionValidations: SubscriptionValidations | null; // Validações (expired, payments, etc)
  hasAccess: boolean | null; // Se tem acesso ao sistema
  accessReason: string | null; // Motivo se não tem acesso
  loadSubscriptionStatus: () => Promise<void>;
  loadPlans: () => Promise<void>;
  createSubscription: (payload: StartSubscriptionPayload) => Promise<void>;
  isMasterUser: () => boolean;
  getCurrentPlan: () => Plan | null;
  clearSubscription: () => void;
}

export const SubscriptionContext = React.createContext<
  SubscriptionContextType | undefined
>(undefined);

export const useSubscriptionContext = (): SubscriptionContextType => {
  const context = React.useContext(SubscriptionContext);
  if (!context) {
    // CORREÇÃO: Em vez de lançar erro, retornar valores padrão
    // Isso evita quebrar a aplicação se o componente for renderizado antes do provider estar pronto
    console.warn(
      '⚠️ useSubscriptionContext: Contexto não encontrado. Usando valores padrão.'
    );
    return {
      subscriptionStatus: null,
      plans: [],
      loading: false,
      error: null,
      subscriptionLimits: null,
      subscriptionValidations: null,
      hasAccess: null,
      accessReason: null,
      loadSubscriptionStatus: async () => {},
      loadPlans: async () => {},
      createSubscription: async () => {},
      isMasterUser: () => false,
      getCurrentPlan: () => null,
      clearSubscription: () => {},
    };
  }
  return context;
};

const mapPlanToSubscriptionPlan = (
  plan?: Plan | null
): SubscriptionPlan | null => {
  if (!plan) {
    return null;
  }

  const featureSummary: string[] = [];
  const maxUsers = plan.features?.maxUsers;
  if (typeof maxUsers === 'number') {
    featureSummary.push(`${maxUsers} usuários incluídos`);
  }

  const maxProperties = plan.features?.maxProperties;
  if (typeof maxProperties === 'number') {
    featureSummary.push(`${maxProperties} propriedades`);
  }

  const maxStorage = plan.features?.storageGB;
  if (typeof maxStorage === 'number') {
    featureSummary.push(`${maxStorage}GB de armazenamento`);
  }

  return {
    id: String(plan.id),
    name: plan.name ?? 'Plano',
    description: plan.description ?? '',
    price: plan.price ?? 0,
    currency: 'BRL',
    interval: 'monthly',
    features: featureSummary,
    isPopular: plan.displayOrder === 0 ? true : undefined,
    maxUsers,
    maxProperties,
    maxCompanies: plan.maxCompanies,
    maxStorage,
    supportLevel: 'priority',
    modules: plan.modules ?? [],
    billingType: plan.billingType,
    trialDays: plan.trialDays,
    planChangeLockedUntil: plan.planChangeLockedUntil ?? null,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
};

const mapSubscriptionToUserSubscription = (
  subscription: RawSubscription | null | undefined,
  legacyPlan: SubscriptionPlan | null,
  userId?: string
): UserSubscription | undefined => {
  if (!subscription) {
    return undefined;
  }

  return {
    id: subscription.id,
    userId: userId ?? '',
    planId: subscription.planId,
    status: subscription.status as UserSubscription['status'],
    startDate: subscription.startDate,
    endDate: subscription.endDate,
    autoRenew: true,
    paymentMethod: undefined,
    lastPaymentDate: undefined,
    nextPaymentDate: subscription.nextBillingDate ?? undefined,
    trialEndsAt: subscription.trialEndsAt ?? undefined,
    deactivatedAt: subscription.deactivatedAt ?? undefined,
    planChangeLockedUntil: subscription.planChangeLockedUntil ?? undefined,
    reactivationAvailableAt: subscription.reactivationAvailableAt ?? undefined,
    lastCardValidatedAt: subscription.lastCardValidatedAt ?? undefined,
    currentCompanies: subscription.currentCompanies,
    price: subscription.price,
    notes: subscription.notes ?? undefined,
    asaasSubscriptionId: subscription.asaasSubscriptionId ?? undefined,
    plan: legacyPlan ?? undefined,
    createdAt: subscription.createdAt ?? new Date().toISOString(),
    updatedAt: subscription.updatedAt ?? new Date().toISOString(),
  };
};

const calculateDaysUntilExpiry = (
  endDate?: string | null
): number | undefined => {
  if (!endDate) {
    return undefined;
  }

  const parsedDate = new Date(endDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  const diffInMs = parsedDate.getTime() - Date.now();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  // console.log('💳 SubscriptionProvider: Componente sendo renderizado...');
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [subscriptionLimits, setSubscriptionLimits] =
    useState<SubscriptionLimits | null>(null);
  const [subscriptionValidations, setSubscriptionValidations] =
    useState<SubscriptionValidations | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [accessReason, setAccessReason] = useState<string | null>(null);

  // Verificar se usuário é master (bypass de assinatura)
  const isMasterUser = useCallback((): boolean => {
    const user = authStorage.getUserData();
    return user?.role === 'master';
  }, []);

  // Verificar assinatura real do backend
  // CORREÇÃO: Cache para evitar chamadas repetidas
  const subscriptionCacheRef = React.useRef<{
    data: SubscriptionStatus | null;
    timestamp: number;
  }>({ data: null, timestamp: 0 });
  const CACHE_DURATION_MS = 5000; // 5 segundos de cache

  const checkSubscription =
    useCallback(async (): Promise<SubscriptionStatus> => {
      const user = authStorage.getUserData();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Verificar cache
      const now = Date.now();
      if (
        subscriptionCacheRef.current.data &&
        now - subscriptionCacheRef.current.timestamp < CACHE_DURATION_MS
      ) {
        console.log('📦 SubscriptionContext: Usando cache de subscription');
        return subscriptionCacheRef.current.data;
      }

      if (user.role === 'master') {
        const activeSubscription =
          await subscriptionService.getMyActiveSubscription();

        // Buscar limites de empresas da nova API também para master
        let companyLimitsData: CompanyLimits | null = null;
        try {
          companyLimitsData = await subscriptionService.getCompanyLimits();
        } catch (err) {
          console.warn('⚠️ Erro ao buscar limites de empresas (master):', err);
        }

        const legacyPlan = mapPlanToSubscriptionPlan(
          activeSubscription?.plan ?? null
        );
        const legacySubscription = mapSubscriptionToUserSubscription(
          activeSubscription,
          legacyPlan,
          user.id
        );
        const daysUntilExpiry = calculateDaysUntilExpiry(
          activeSubscription?.endDate
        );
        const isExpired =
          typeof daysUntilExpiry === 'number' ? daysUntilExpiry <= 0 : false;
        const isExpiringSoon =
          typeof daysUntilExpiry === 'number'
            ? daysUntilExpiry > 0 && daysUntilExpiry <= 7
            : false;

        const result = {
          hasActiveSubscription: true,
          subscription: legacySubscription,
          plan: legacyPlan ?? undefined,
          daysUntilExpiry,
          isExpired,
          isExpiringSoon,
          canAccessFeatures: true,
          isMasterUser: true,
          statusReason:
            (activeSubscription?.status as
              | SubscriptionStatusType
              | undefined) ?? 'active',
        };

        // Buscar dados completos da nova API também para master
        try {
          const fullData =
            await subscriptionService.getMyActiveSubscriptionFull();
          if (fullData && fullData.type === 'subscription') {
            setSubscriptionLimits(fullData.subscription.limits);
            setSubscriptionValidations(fullData.subscription.validations);
            setHasAccess(fullData.hasAccess);
            setAccessReason(fullData.reason);
          }
        } catch (err) {
          console.warn('⚠️ Erro ao buscar dados completos (master):', err);
        }

        // Atualizar cache
        subscriptionCacheRef.current = { data: result, timestamp: now };
        return result;
      }

      const accessInfo = await subscriptionService.checkSubscriptionAccess();

      if (!accessInfo.hasAccess) {
        return {
          hasActiveSubscription: false,
          subscription: undefined,
          plan: undefined,
          daysUntilExpiry: accessInfo.daysUntilExpiry ?? undefined,
          isExpired: accessInfo.isExpired,
          isExpiringSoon: accessInfo.isExpiringSoon,
          canAccessFeatures: false,
          isMasterUser: false,
          statusReason: accessInfo.status ?? 'unknown',
        };
      }

      // Verificar se o usuário é owner antes de chamar a API de assinatura
      // Mas ainda usar o accessInfo para determinar se pode acessar features
      const isOwner = user?.owner === true;
      if (!isOwner) {
        console.log(
          '⚠️ SubscriptionContext: Usuário não é owner, usando apenas checkSubscriptionAccess'
        );
        // Retornar status baseado apenas no accessInfo (que não requer owner)
        return {
          hasActiveSubscription: accessInfo.hasAccess,
          subscription: undefined,
          plan: undefined,
          daysUntilExpiry: accessInfo.daysUntilExpiry ?? undefined,
          isExpired: accessInfo.isExpired ?? false,
          isExpiringSoon: accessInfo.isExpiringSoon ?? false,
          canAccessFeatures:
            accessInfo.hasAccess && accessInfo.canAccessFeatures !== false,
          isMasterUser: false,
          statusReason: accessInfo.status ?? 'active',
        };
      }

      const activeSubscription =
        await subscriptionService.getMyActiveSubscription();

      // Buscar TODOS os dados da nova API (limites completos, validações, etc)
      let fullSubscriptionData = null;
      try {
        fullSubscriptionData =
          await subscriptionService.getMyActiveSubscriptionFull();

        if (fullSubscriptionData) {
          // Armazenar todos os limites
          if (fullSubscriptionData.type === 'subscription') {
            setSubscriptionLimits(fullSubscriptionData.subscription.limits);
            setSubscriptionValidations(
              fullSubscriptionData.subscription.validations
            );
            setHasAccess(fullSubscriptionData.hasAccess);
            setAccessReason(fullSubscriptionData.reason);
          } else if (fullSubscriptionData.type === 'custom_plan') {
            // Para custom_plan, criar estrutura mínima
            setSubscriptionLimits({
              users: 0,
              properties: 0,
              storage: 0,
              companies: fullSubscriptionData.limits.companies,
            });
            setSubscriptionValidations(null);
            setHasAccess(fullSubscriptionData.hasAccess);
            setAccessReason(null);
          }
        }
      } catch (err) {
        console.warn('⚠️ Erro ao buscar dados completos da assinatura:', err);
      }

      const legacyPlan = mapPlanToSubscriptionPlan(
        activeSubscription?.plan ?? null
      );
      const legacySubscription = mapSubscriptionToUserSubscription(
        activeSubscription,
        legacyPlan,
        user.id
      );

      const computedDays =
        typeof accessInfo.daysUntilExpiry === 'number'
          ? accessInfo.daysUntilExpiry
          : calculateDaysUntilExpiry(activeSubscription?.endDate);

      const isExpired =
        accessInfo.isExpired ||
        (typeof computedDays === 'number' ? computedDays <= 0 : false);

      const isExpiringSoon =
        accessInfo.isExpiringSoon ||
        (typeof computedDays === 'number'
          ? computedDays > 0 && computedDays <= 7
          : false);

      const result = {
        hasActiveSubscription: accessInfo.hasAccess && !isExpired,
        subscription: legacySubscription,
        plan: legacyPlan ?? undefined,
        daysUntilExpiry: computedDays,
        isExpired,
        isExpiringSoon,
        canAccessFeatures: accessInfo.canAccessFeatures,
        isMasterUser: false,
        statusReason: accessInfo.status ?? 'active',
      };

      // Atualizar cache
      subscriptionCacheRef.current = { data: result, timestamp: Date.now() };
      return result;
    }, []);

  // CORREÇÃO: Ref para evitar chamadas simultâneas
  const isLoadingRef = React.useRef(false);
  const lastLoadTimeRef = React.useRef<number>(0);
  const LOAD_DEBOUNCE_MS = 2000; // 2 segundos entre chamadas

  // Carregar status da assinatura
  const loadSubscriptionStatus = useCallback(async () => {
    // Evitar chamadas simultâneas ou muito frequentes
    const now = Date.now();
    if (isLoadingRef.current) {
      console.log('⏭️ SubscriptionContext: Já está carregando, pulando...');
      return;
    }

    if (now - lastLoadTimeRef.current < LOAD_DEBOUNCE_MS) {
      console.log(
        '⏭️ SubscriptionContext: Chamada muito recente, aguardando debounce...'
      );
      return;
    }

    isLoadingRef.current = true;
    lastLoadTimeRef.current = now;

    try {
      setLoading(true);
      setError(null);

      const status = await checkSubscription();
      setSubscriptionStatus(status);
      setHasLoadedOnce(true);
    } catch (err: any) {
      console.error('Erro ao carregar assinatura:', err);
      setError('Erro ao carregar status da assinatura');
      // Se o erro for sobre não ser owner, criar um status básico baseado no accessInfo
      if (
        err?.message?.includes('owner') ||
        err?.message?.includes('proprietário')
      ) {
        // Tentar obter accessInfo mesmo com erro
        try {
          const accessInfo =
            await subscriptionService.checkSubscriptionAccess();
          setSubscriptionStatus({
            hasActiveSubscription: accessInfo.hasAccess,
            subscription: undefined,
            plan: undefined,
            daysUntilExpiry: accessInfo.daysUntilExpiry ?? undefined,
            isExpired: accessInfo.isExpired ?? false,
            isExpiringSoon: accessInfo.isExpiringSoon ?? false,
            canAccessFeatures:
              accessInfo.hasAccess && accessInfo.canAccessFeatures !== false,
            isMasterUser: false,
            statusReason: accessInfo.status ?? 'active',
          });
        } catch {
          // Se falhar, deixar null mas marcar como carregado
          setSubscriptionStatus(null);
        }
      } else {
        setSubscriptionStatus(null);
      }
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [checkSubscription]);

  // Carregar planos disponíveis
  const loadPlans = useCallback(async () => {
    try {
      // console.log('🔄 SubscriptionContext: Carregando planos...');
      setLoading(true);
      setError(null);

      const backendPlans = await subscriptionService.getAvailablePlans();
      // console.log('🔄 SubscriptionContext: Planos recebidos do backend:', backendPlans);
      const frontendPlans = backendPlans;

      // console.log('🔄 SubscriptionContext: Planos convertidos para frontend:', frontendPlans);
      setPlans(frontendPlans);
    } catch (err) {
      setError('Erro ao carregar planos');
      console.error('❌ SubscriptionContext: Erro ao carregar planos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar assinatura (não implementado no backend)
  const createSubscription = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_payload: StartSubscriptionPayload) => {
      throw new Error(
        'Funcionalidade não implementada. Use o fluxo de upgrade/downgrade.'
      );
    },
    []
  );

  // Obter plano atual
  const getCurrentPlan = useCallback((): Plan | null => {
    return (subscriptionStatus?.plan as unknown as Plan) || null;
  }, [subscriptionStatus]);

  // Limpar dados de subscription
  const clearSubscription = useCallback(() => {
    setSubscriptionStatus(null);
    setPlans([]);
    setError(null);
    setHasLoadedOnce(false);
    setSubscriptionLimits(null);
    setSubscriptionValidations(null);
    setHasAccess(null);
    setAccessReason(null);
  }, []);

  // Carregar subscription apenas uma vez na inicialização
  useEffect(() => {
    // Evitar múltiplas execuções - executar apenas UMA VEZ
    if (hasLoadedOnce) {
      // console.log('🔄 SubscriptionContext: Já carregou uma vez, pulando...');
      return;
    }

    const checkAndLoadSubscription = async () => {
      // console.log('🔄 SubscriptionContext: useEffect executado - PRIMEIRA VEZ');
      // Não carregar subscription se estiver na página system-unavailable
      if (window.location.pathname === '/system-unavailable') {
        // console.log('🔄 SubscriptionContext: Página system-unavailable detectada, pulando carregamento de subscription');
        setLoading(false);
        setHasLoadedOnce(true);
        return;
      }

      // Verificar se tem dados básicos de autenticação
      const token = authStorage.getToken();
      const userData = authStorage.getUserData();

      const hasAuthData = token || userData;

      // console.log('🔄 SubscriptionContext: Verificação:', { hasAuthData });
      if (hasAuthData) {
        // CORREÇÃO: Se o usuário é owner, pode carregar subscription mesmo sem Company ID
        const user = authStorage.getUserData();
        const isOwner = user?.owner === true;
        const selectedCompanyId = localStorage.getItem(
          'dream_keys_selected_company_id'
        );

        // Se não é owner e não tem Company ID, aguardar
        if (!isOwner && !selectedCompanyId) {
          console.log(
            '⚠️ SubscriptionContext: Sem Company ID e não é owner, aguardando...'
          );
          setLoading(false);
          setHasLoadedOnce(true);
          return;
        }

        // Se é owner mas não tem Company ID, ainda pode carregar (mas só uma vez)
        if (isOwner && !selectedCompanyId) {
          console.log(
            'ℹ️ SubscriptionContext: Owner sem Company ID, carregando subscription mesmo assim...'
          );
        } else {
          console.log(
            '✅ SubscriptionContext: Company ID encontrado, carregando subscription...'
          );
        }

        // console.log('🔄 SubscriptionContext: Carregando subscription e planos...');
        try {
          // Adicionar timeout de 5 segundos para evitar trava
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(
              () => reject(new Error('Timeout ao carregar subscription')),
              5000
            );
          });

          await Promise.race([
            loadSubscriptionStatus().catch(e => {
              console.error('❌ Erro em loadSubscriptionStatus:', e);
              // Não propagar erro, deixar app continuar
            }),
            timeoutPromise,
          ]);

          // console.log('✅ SubscriptionContext: Subscription e planos carregados com sucesso');
        } catch (error) {
          console.error(
            '❌ SubscriptionContext: Erro ao carregar subscription:',
            error
          );
          setLoading(false);
          // Mesmo com erro, permitir que a aplicação continue
          setHasLoadedOnce(true);
        }
      } else {
        // console.log('🔄 SubscriptionContext: Sem dados de auth, pulando carregamento');
        setLoading(false);
        setHasLoadedOnce(true);
      }
    };

    checkAndLoadSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar APENAS uma vez na montagem

  // CORREÇÃO: Usar ref para evitar múltiplas chamadas de loadSubscriptionStatus
  const isLoadingSubscriptionRef = React.useRef(false);
  const retryCountRef = React.useRef(0);

  // Tentar carregar subscription quando Company ID ficar disponível
  useEffect(() => {
    // Se já tentou carregar mas não tem subscription, tentar novamente quando Company ID ficar disponível
    // IMPORTANTE: Limitar retentativas para evitar loops infinitos
    if (hasLoadedOnce && !subscriptionStatus && retryCountRef.current < 3) {
      const checkCompanyId = () => {
        // Evitar múltiplas chamadas simultâneas
        if (isLoadingSubscriptionRef.current) {
          return;
        }

        const selectedCompanyId = localStorage.getItem(
          'dream_keys_selected_company_id'
        );
        const token = authStorage.getToken();
        const userData = authStorage.getUserData();

        if (token && userData && selectedCompanyId) {
          console.log(
            '🔄 SubscriptionContext: Company ID detectado após inicialização, tentando carregar subscription...'
          );
          isLoadingSubscriptionRef.current = true;
          retryCountRef.current++;

          loadSubscriptionStatus()
            .catch(e => {
              console.error(
                '❌ Erro ao carregar subscription após Company ID:',
                e
              );
            })
            .finally(() => {
              isLoadingSubscriptionRef.current = false;
            });
        }
      };

      // Verificar apenas uma vez com um pequeno delay
      const timeout = setTimeout(checkCompanyId, 500);

      return () => clearTimeout(timeout);
    }
  }, [hasLoadedOnce, subscriptionStatus, loadSubscriptionStatus]);

  // Limpar dados quando usuário faz logout
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dream_keys_access_token' && !e.newValue) {
        // Token foi removido, limpar dados do subscription
        // console.log('🔄 SubscriptionContext: Token removido, limpando subscription...');
        clearSubscription();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [clearSubscription]);

  const value: SubscriptionContextType = {
    subscriptionStatus,
    plans,
    loading,
    error,
    subscriptionLimits,
    subscriptionValidations,
    hasAccess,
    accessReason,
    loadSubscriptionStatus,
    loadPlans,
    createSubscription,
    isMasterUser,
    getCurrentPlan,
    clearSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
