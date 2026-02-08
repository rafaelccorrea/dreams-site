import { api } from './api';
import { authStorage } from './authStorage';
import type {
  Plan,
  PlanFeatures,
  Subscription,
  SubscriptionUsage,
  ChangePlanResponse,
  ManageSubscriptionResponse,
  SubscriptionAccessInfo,
  StartSubscriptionPayload,
  SubscriptionResponseDto,
  DeactivateSubscriptionPayload,
  ReactivateSubscriptionPayload,
  UpdateCardPayload,
  SubscriptionAlertsResponse,
  MyActiveSubscriptionResponse,
  SubscriptionResponse,
  CustomPlanResponse,
  CompanyLimits,
} from '../types/subscriptionTypes';

type BackendPlan = Partial<Plan> &
  Record<string, unknown> & {
    price?: number | string;
    modules?: Array<string | { code: string }>;
    features?: PlanFeatures & Record<string, number | undefined>;
  };

type BackendSubscription = SubscriptionResponseDto & {
  plan?: BackendPlan | Plan;
  subscription?: SubscriptionResponseDto;
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const normalizeModules = (modules?: BackendPlan['modules']): string[] => {
  if (!modules) return [];
  return modules.map(module => {
    if (typeof module === 'string') return module;
    if (module && typeof module === 'object' && 'code' in module) {
      return String(module.code);
    }
    return String(module);
  });
};

const normalizePlan = (plan: BackendPlan): Plan => {
  const features: PlanFeatures = {
    maxUsers: toNumber(
      plan.features?.maxUsers ?? plan.features?.usersMax ?? plan.maxUsers
    ),
    maxProperties: toNumber(
      plan.features?.maxProperties ??
        plan.features?.propertiesMax ??
        plan.maxProperties
    ),
    storageGB: toNumber(
      plan.features?.storageGB ?? plan.features?.storage ?? plan.maxStorage
    ),
  };

  // Para nova estrutura, maxCompanies pode vir de limits.companies.max
  // Mas mantemos compatibilidade com estrutura legada
  let maxCompanies = toNumber(
    plan.maxCompanies ?? plan.features?.maxCompanies ?? 1
  );

  // Se vier da nova estrutura com limits, usar esse valor
  if ((plan as any)?.limits?.companies?.max) {
    maxCompanies = toNumber((plan as any).limits.companies.max);
  }

  return {
    id: String(plan.id),
    name: String(plan.name ?? 'Plano'),
    type: (plan.type as string) ?? 'custom',
    price: toNumber(plan.price),
    maxCompanies,
    description: String(plan.description ?? ''),
    modules: normalizeModules(plan.modules),
    features,
    isActive: plan.isActive ?? true,
    displayOrder: plan.displayOrder ?? 0,
    billingType: plan.billingType,
    trialDays:
      plan.trialDays ??
      (typeof plan.features?.trialDays === 'number'
        ? plan.features?.trialDays
        : undefined),
    planChangeLockedUntil: (plan as any)?.planChangeLockedUntil ?? null,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
};

const normalizeSubscription = (
  subscription:
    | BackendSubscription
    | SubscriptionResponseDto
    | null
    | undefined,
  plan?: Plan
): Subscription => {
  const source =
    subscription && typeof subscription === 'object'
      ? subscription
      : ({} as SubscriptionResponseDto);

  const base =
    'subscription' in source && source.subscription
      ? source.subscription
      : (source as SubscriptionResponseDto);

  const normalizedPlan =
    plan ??
    ('plan' in source && source.plan
      ? normalizePlan(source.plan as BackendPlan)
      : undefined) ??
    undefined;

  const resolveFallbackPlanName = (input: unknown): string => {
    if (typeof input === 'string') {
      return input;
    }
    if (
      input &&
      typeof input === 'object' &&
      'name' in (input as Record<string, unknown>)
    ) {
      const value = (input as Record<string, unknown>).name;
      return typeof value === 'string' ? value : JSON.stringify(value);
    }
    if (input && typeof input === 'object') {
      try {
        return JSON.stringify(input);
      } catch {
        return 'Plano';
      }
    }
    if (input === null || input === undefined) {
      return 'Plano';
    }
    return String(input);
  };

  return {
    id: base?.id ? String(base.id) : '',
    planId: base?.planId ? String(base.planId) : '',
    status: (base.status as Subscription['status']) ?? 'inactive',
    startDate: base?.startDate ?? '',
    endDate: base?.endDate ?? '',
    plan: normalizedPlan ?? {
      id: String(base?.planId ?? 'unknown-plan'),
      name: resolveFallbackPlanName((base as any)?.plan),
      type: 'custom',
      price: toNumber((base as any)?.price ?? 0),
      maxCompanies: (base as any)?.currentCompanies ?? 1,
      description: base?.notes ?? '',
      modules: [],
      features: {},
      isActive: true,
      displayOrder: 0,
    },
    price: toNumber((base as any)?.price ?? 0),
    notes: base?.notes ?? null,
    currentCompanies: (base as any)?.currentCompanies ?? 0,
    nextBillingDate: base?.nextBillingDate ?? null,
    trialEndsAt: base?.trialEndsAt ?? null,
    asaasSubscriptionId: base?.asaasSubscriptionId ?? null,
    deactivatedAt: base?.deactivatedAt ?? null,
    planChangeLockedUntil: base?.planChangeLockedUntil ?? null,
    reactivationAvailableAt: base?.reactivationAvailableAt ?? null,
    lastCardValidatedAt: base?.lastCardValidatedAt ?? null,
    createdAt: base?.createdAt,
    updatedAt: base?.updatedAt,
  };
};

const unwrap = async <T>(promise: Promise<{ data: T }>): Promise<T> => {
  const { data } = await promise;
  return data;
};

interface MyUsageCacheEntry {
  timestamp: number;
  data: SubscriptionUsage | null;
  promise: Promise<SubscriptionUsage> | null;
}

const MY_USAGE_TTL = 60 * 1000; // 60 segundos
let myUsageCache: MyUsageCacheEntry = {
  timestamp: 0,
  data: null,
  promise: null,
};

interface CheckAccessCacheEntry {
  timestamp: number;
  data: SubscriptionAccessInfo | null;
  promise: Promise<SubscriptionAccessInfo> | null;
}

const CHECK_ACCESS_TTL = 60 * 1000;
let checkAccessCache: CheckAccessCacheEntry = {
  timestamp: 0,
  data: null,
  promise: null,
};

export const subscriptionService = {
  /**
   * Obter todos os dados da nova estrutura da API
   * Retorna null se não houver assinatura
   */
  async getMyActiveSubscriptionFull(): Promise<MyActiveSubscriptionResponse | null> {
    const user = authStorage.getUserData();
    if (!user || user.owner !== true) {
      return null;
    }

    try {
      const data = await unwrap(
        api.get<MyActiveSubscriptionResponse>(
          '/subscriptions/my-active-subscription'
        )
      );
      return data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      console.error('Erro ao obter dados completos da assinatura:', error);
      return null;
    }
  },

  /**
   * Obter limites de empresas da nova estrutura da API
   * Retorna null se não houver assinatura ou se for custom_plan sem limites
   */
  async getCompanyLimits(): Promise<CompanyLimits | null> {
    const fullData = await this.getMyActiveSubscriptionFull();
    if (!fullData) return null;

    if (fullData.type === 'subscription') {
      return fullData.subscription.limits.companies;
    }

    if (fullData.type === 'custom_plan' && fullData.limits?.companies) {
      return fullData.limits.companies;
    }

    return null;
  },

  /**
   * Verificar se pode criar mais empresas
   */
  async canCreateCompany(): Promise<{ canCreate: boolean; reason?: string }> {
    const user = authStorage.getUserData();
    if (!user || user.owner !== true) {
      return {
        canCreate: false,
        reason: 'Apenas proprietários podem criar empresas',
      };
    }

    try {
      const data = await unwrap(
        api.get<MyActiveSubscriptionResponse>(
          '/subscriptions/my-active-subscription'
        )
      );

      // Verificar acesso
      if (!data.hasAccess) {
        return {
          canCreate: false,
          reason:
            (data as SubscriptionResponse).reason || 'Assinatura inválida',
        };
      }

      // Verificar limite de empresas
      if (data.type === 'subscription') {
        const companies = data.subscription.limits.companies;
        if (!companies.canCreate) {
          if (companies.remaining === 0) {
            return {
              canCreate: false,
              reason: `Limite de ${companies.max} empresas atingido`,
            };
          }
          return {
            canCreate: false,
            reason: 'Não é possível criar mais empresas no momento',
          };
        }
        return { canCreate: true };
      }

      // Para plano custom
      if (data.type === 'custom_plan') {
        if (data.limits?.companies?.canCreate) {
          return { canCreate: true };
        }
        return {
          canCreate: false,
          reason: 'Limite de empresas atingido',
        };
      }

      return { canCreate: false, reason: 'Tipo de assinatura não suportado' };
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return { canCreate: false, reason: 'Nenhuma assinatura encontrada' };
      }
      console.error('Erro ao verificar se pode criar empresa:', error);
      return { canCreate: false, reason: 'Erro ao verificar assinatura' };
    }
  },

  async checkSubscriptionAccess(): Promise<SubscriptionAccessInfo> {
    const now = Date.now();

    if (
      checkAccessCache.data &&
      now - checkAccessCache.timestamp < CHECK_ACCESS_TTL
    ) {
      return checkAccessCache.data;
    }

    if (checkAccessCache.promise) {
      return checkAccessCache.promise;
    }

    const requestPromise = unwrap(
      api.get<SubscriptionAccessInfo>('/subscriptions/check-access')
    )
      .then(data => {
        checkAccessCache = {
          timestamp: Date.now(),
          data,
          promise: null,
        };
        return data;
      })
      .catch(error => {
        checkAccessCache = {
          timestamp: 0,
          data: null,
          promise: null,
        };
        throw error;
      });

    checkAccessCache.promise = requestPromise;
    return requestPromise;
  },

  async getMySubscription(): Promise<Subscription> {
    // Verificar se o usuário é owner antes de chamar a API
    const user = authStorage.getUserData();
    if (!user || user.owner !== true) {
      throw new Error(
        'Apenas proprietários (owner) podem acessar informações de assinatura'
      );
    }

    const data = await unwrap(
      api.get<SubscriptionResponseDto>('/subscriptions/my-active-subscription')
    );
    return normalizeSubscription(data);
  },

  async getMyActiveSubscription(): Promise<Subscription | null> {
    // Verificar se o usuário é owner antes de chamar a API
    const user = authStorage.getUserData();
    if (!user || user.owner !== true) {
      throw new Error(
        'Apenas proprietários (owner) podem acessar informações de assinatura'
      );
    }

    try {
      const data = await unwrap(
        api.get<MyActiveSubscriptionResponse>(
          '/subscriptions/my-active-subscription'
        )
      );

      // Nova estrutura da API
      if (data.type === 'subscription') {
        const sub = data.subscription;
        // Criar plan com maxCompanies dos limites (que inclui add-ons)
        const planWithLimits = {
          ...sub.plan,
          maxCompanies: sub.limits.companies.max, // Usar limite atualizado (com add-ons)
        };

        // Normalizar para estrutura legada
        return {
          id: sub.id,
          planId: sub.plan.id,
          status: sub.status,
          startDate: sub.startDate,
          endDate: sub.endDate,
          plan: normalizePlan(planWithLimits),
          price: sub.price,
          notes: null,
          currentCompanies: sub.limits.companies.current,
          nextBillingDate: null,
          trialEndsAt: null,
          asaasSubscriptionId: null,
          deactivatedAt: null,
          planChangeLockedUntil: null,
          reactivationAvailableAt: null,
          lastCardValidatedAt: null,
          createdAt: '',
          updatedAt: '',
        };
      }

      // Para custom_plan, retornar null (não há subscription tradicional)
      if (data.type === 'custom_plan') {
        return null;
      }

      // Fallback para estrutura legada
      return normalizeSubscription(data as any);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async getMySubscriptionUsage(): Promise<SubscriptionUsage> {
    // Verificar se o usuário é owner antes de chamar a API
    const user = authStorage.getUserData();
    if (!user || user.owner !== true) {
      throw new Error(
        'Apenas proprietários (owner) podem acessar informações de uso da assinatura'
      );
    }

    // Verificar se há assinatura ativa antes de chamar a API
    try {
      const accessInfo = await this.checkSubscriptionAccess();
      if (!accessInfo.hasAccess || !accessInfo.subscription) {
        // Não há assinatura, não deve chamar a API
        throw new Error(
          'Nenhuma assinatura encontrada para as empresas do usuário'
        );
      }
    } catch (error: any) {
      // Se checkSubscriptionAccess falhar ou não houver assinatura, não chamar a API
      if (
        error?.message?.includes('assinatura') ||
        error?.response?.status === 404
      ) {
        throw new Error(
          'Nenhuma assinatura encontrada para as empresas do usuário'
        );
      }
      // Se for outro erro, propagar
      throw error;
    }

    const now = Date.now();

    // Retornar dados em cache se ainda válidos
    if (myUsageCache.data && now - myUsageCache.timestamp < MY_USAGE_TTL) {
      return myUsageCache.data;
    }

    // Se já existe uma chamada em andamento, reutilizar a mesma promessa
    if (myUsageCache.promise) {
      return myUsageCache.promise;
    }

    const requestPromise = unwrap(
      api.get<SubscriptionUsage>('/subscriptions/my-usage')
    )
      .then(data => {
        myUsageCache = {
          timestamp: Date.now(),
          data,
          promise: null,
        };
        return data;
      })
      .catch(error => {
        // Limpar cache em caso de erro para permitir novas tentativas
        myUsageCache = {
          timestamp: 0,
          data: null,
          promise: null,
        };

        // Se for 404 (nenhuma assinatura), lançar erro específico
        if (error?.response?.status === 404) {
          const errorMessage =
            error?.response?.data?.message ||
            'Nenhuma assinatura encontrada para as empresas do usuário';
          throw new Error(errorMessage);
        }

        throw error;
      });

    myUsageCache.promise = requestPromise;
    return requestPromise;
  },

  async getAvailablePlans(): Promise<Plan[]> {
    const plans = await unwrap(api.get<BackendPlan[]>('/plans'));
    return plans.map(normalizePlan);
  },

  async getActivePlans(): Promise<BackendPlan[]> {
    const plans = await unwrap(api.get<BackendPlan[]>('/plans?status=active'));
    return plans;
  },

  async getAllPlans(): Promise<BackendPlan[]> {
    try {
      return await unwrap(api.get<BackendPlan[]>('/subscriptions/admin/plans'));
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return unwrap(api.get<BackendPlan[]>('/plans?includeInactive=true'));
      }
      throw error;
    }
  },

  async startSubscription(
    payload: StartSubscriptionPayload
  ): Promise<Subscription> {
    const data = await unwrap(
      api.post<SubscriptionResponseDto>('/subscriptions/start', {
        ...payload,
        trialDays: payload.trialDays ?? 7,
      })
    );
    return normalizeSubscription(data);
  },

  async createSubscription(
    payload: StartSubscriptionPayload
  ): Promise<Subscription> {
    return this.startSubscription(payload);
  },

  async deactivateSubscription(
    payload?: DeactivateSubscriptionPayload
  ): Promise<Subscription> {
    const data = await unwrap(
      api.post<SubscriptionResponseDto>(
        '/subscriptions/deactivate',
        payload ?? {}
      )
    );
    return normalizeSubscription(data);
  },

  async reactivateSubscription(
    payload?: ReactivateSubscriptionPayload
  ): Promise<Subscription> {
    const data = await unwrap(
      api.post<SubscriptionResponseDto>(
        '/subscriptions/reactivate',
        payload ?? {}
      )
    );
    return normalizeSubscription(data);
  },

  async updatePaymentMethod(payload: UpdateCardPayload): Promise<Subscription> {
    const data = await unwrap(
      api.patch<SubscriptionResponseDto>(
        '/subscriptions/payment-method',
        payload
      )
    );
    return normalizeSubscription(data);
  },

  async upgradePlan(
    subscriptionId: string,
    newPlanId: string,
    options?: {
      notes?: string;
      notifyUsers?: boolean;
      applyImmediately?: boolean;
      customModules?: string[];
    }
  ): Promise<ChangePlanResponse> {
    return unwrap(
      api.post<ChangePlanResponse>('/subscriptions/admin/change-plan', {
        subscriptionId,
        newPlanId,
        changeType: 'upgrade',
        reason: 'user_request',
        notes: options?.notes,
        notifyUsers: options?.notifyUsers ?? true,
        applyImmediately: options?.applyImmediately ?? true,
        customModules: options?.customModules,
      })
    );
  },

  async downgradePlan(
    subscriptionId: string,
    newPlanId: string,
    options?: {
      notes?: string;
      notifyUsers?: boolean;
      applyImmediately?: boolean;
    }
  ): Promise<ChangePlanResponse> {
    return unwrap(
      api.post<ChangePlanResponse>('/subscriptions/admin/change-plan', {
        subscriptionId,
        newPlanId,
        changeType: 'downgrade',
        reason: 'cost_optimization',
        notes: options?.notes,
        notifyUsers: options?.notifyUsers ?? true,
        applyImmediately: options?.applyImmediately ?? true,
      })
    );
  },

  async cancelSubscription(
    subscriptionId: string,
    options: { reason: string; notes?: string }
  ): Promise<ManageSubscriptionResponse> {
    return unwrap(
      api.post<ManageSubscriptionResponse>('/subscriptions/admin/manage', {
        subscriptionId,
        action: 'cancel',
        reason: options.reason,
        notes: options.notes,
        notifyUsers: true,
      })
    );
  },

  async manageSubscription(payload: {
    subscriptionId: string;
    action: 'activate' | 'suspend' | 'cancel' | 'change_plan';
    reason?: string;
    notes?: string;
    notifyUsers?: boolean;
    newPlanId?: string;
    customModules?: string[];
  }): Promise<ManageSubscriptionResponse> {
    return unwrap(
      api.post<ManageSubscriptionResponse>(
        '/subscriptions/admin/manage',
        payload
      )
    );
  },

  async extendSubscription(
    subscriptionId: string,
    days: number,
    reason?: string
  ): Promise<Subscription> {
    const data = await unwrap(
      api.post<SubscriptionResponseDto>('/subscriptions/admin/extend', {
        subscriptionId,
        days,
        reason,
      })
    );
    return normalizeSubscription(data);
  },

  async updateSubscription(
    subscriptionId: string,
    payload: Partial<{
      endDate: string;
      notes: string;
    }>
  ): Promise<Subscription> {
    const data = await unwrap(
      api.patch<SubscriptionResponseDto>(
        `/subscriptions/admin/${subscriptionId}`,
        payload
      )
    );
    return normalizeSubscription(data);
  },

  async updateCompanyModules(payload: {
    companyId: string;
    modules: string[];
    changeType: 'module_addition' | 'module_removal';
    reason?: string;
    notes?: string;
    notifyUsers?: boolean;
  }): Promise<ManageSubscriptionResponse> {
    return unwrap(
      api.post<ManageSubscriptionResponse>(
        '/subscriptions/admin/company-modules/update',
        payload
      )
    );
  },

  async updateCompanyLimits(
    companyId: string,
    payload: Record<string, unknown>
  ): Promise<ManageSubscriptionResponse> {
    return unwrap(
      api.post<ManageSubscriptionResponse>(
        '/subscriptions/admin/company-limits/update',
        {
          companyId,
          ...payload,
        }
      )
    );
  },

  async getSubscriptionAlerts(): Promise<SubscriptionAlertsResponse> {
    return unwrap(api.get<SubscriptionAlertsResponse>('/subscriptions/alerts'));
  },

  async fetchClientIp(): Promise<string | null> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip ?? null;
    } catch {
      return null;
    }
  },

  convertBackendPlanToFrontend(plan: BackendPlan): Plan {
    return normalizePlan(plan);
  },

  convertBackendSubscriptionToFrontend(
    subscription: BackendSubscription,
    plan?: Plan
  ): Subscription {
    return normalizeSubscription(subscription, plan);
  },

  getCachedSubscriptionUsage(): SubscriptionUsage | null {
    return myUsageCache.data;
  },

  getCachedSubscriptionAccess(): SubscriptionAccessInfo | null {
    return checkAccessCache.data;
  },

  invalidateSubscriptionCaches(): void {
    myUsageCache = { timestamp: 0, data: null, promise: null };
    checkAccessCache = { timestamp: 0, data: null, promise: null };
  },
};
