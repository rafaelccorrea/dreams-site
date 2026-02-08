export interface PlanFeatures {
  maxUsers?: number;
  maxProperties?: number;
  storageGB?: number;
  [key: string]: number | undefined;
}

export interface Plan {
  id: string;
  name: string;
  type: 'basic' | 'pro' | 'custom' | string;
  price: number;
  maxCompanies: number;
  description: string;
  modules: string[];
  features: PlanFeatures;
  isActive: boolean;
  displayOrder: number;
  billingType?: 'monthly' | 'yearly';
  trialDays?: number;
  planChangeLockedUntil?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subscription {
  id: string;
  planId: string;
  status:
    | 'active'
    | 'suspended'
    | 'cancelled'
    | 'expired'
    | 'inactive'
    | 'pending';
  startDate: string;
  endDate: string;
  plan: Plan;
  price?: number;
  notes?: string | null;
  currentCompanies?: number;
  nextBillingDate?: string | null;
  trialEndsAt?: string | null;
  asaasSubscriptionId?: string | null;
  deactivatedAt?: string | null;
  planChangeLockedUntil?: string | null;
  reactivationAvailableAt?: string | null;
  lastCardValidatedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionUsage {
  subscriptionId: string;
  planName: string;
  planType: string;
  monthlyPrice: string;
  status: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  plan?: Plan;
  isTrialActive?: boolean;
  trialEndsAt?: string | null;
  trialDaysRemaining?: number | null;
  companies: {
    used: number;
    limit: number;
    percentage: number;
    isOverLimit?: boolean;
  };
  users: {
    used: number;
    limit: number;
    percentage: number;
    isOverLimit?: boolean;
  };
  properties: {
    used: number;
    limit: number;
    percentage: number;
    isOverLimit?: boolean;
  };
  storage: {
    used: number;
    limit: number;
    percentage: number;
    isOverLimit?: boolean;
  };
  apiCalls?: {
    usedThisMonth: number;
    limit: number;
    percentage: number;
    isOverLimit?: boolean;
  };
  activeModules: string[];
  alerts?: string[];
}

export interface ChangePlanResponse {
  subscriptionId: string;
  previousPlan: {
    id: string;
    name: string;
    type: string;
    modules: string[];
  };
  newPlan: {
    id: string;
    name: string;
    type: string;
    modules: string[];
  };
  changeType: string;
  affectedCompanies: Array<{
    id: string;
    name: string;
    previousModules: string[];
    newModules: string[];
    usersCount: number;
  }>;
  totalUsersAffected: number;
  changeDate: Date;
  effectiveDate: Date;
  status: 'completed' | 'scheduled' | 'failed';
  message: string;
}

export interface ManageSubscriptionResponse {
  subscriptionId: string;
  action: 'activate' | 'suspend' | 'cancel' | 'change_plan';
  previousStatus: string;
  newStatus: string;
  previousPlan: any;
  newPlan: any;
  message: string;
  affectedUsers: number;
  affectedCompanies: number;
  executedAt: Date;
}

export interface SubscriptionAccessInfo {
  hasAccess: boolean;
  status:
    | 'active'
    | 'suspended'
    | 'cancelled'
    | 'expired'
    | 'inactive'
    | 'pending'
    | 'none';
  reason: string | null;
  canAccessFeatures: boolean;
  daysUntilExpiry: number | null;
  isExpired: boolean;
  isSuspended: boolean;
  isExpiringSoon: boolean;
  subscription: Subscription | null;
}

export interface CardPayload {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export interface CardHolderPayload {
  name: string;
  email: string;
  cpfCnpj: string;
  postalCode: string;
  addressNumber: string;
  addressComplement?: string;
  mobilePhone: string;
  phone?: string;
}

export interface StartSubscriptionPayload {
  planId: string;
  card: CardPayload;
  cardHolder: CardHolderPayload;
  remoteIp?: string;
  trialDays?: number;
}

export interface DeactivateSubscriptionPayload {
  reason?: string;
  notes?: string;
}

export interface ReactivateSubscriptionPayload {
  remoteIp?: string;
}

export interface UpdateCardPayload {
  card: CardPayload;
  cardHolder: CardHolderPayload;
  remoteIp?: string;
}

// Nova estrutura da API my-active-subscription
export interface CompanyLimits {
  max: number;
  current: number;
  remaining: number;
  percentUsed: number;
  isNearLimit: boolean;
  canCreate: boolean;
}

export interface KanbanProjectLimit {
  limit: number; // Limite total (-1 = ilimitado)
  current: number; // Quantidade atual
  remaining: number; // Restante (-1 = ilimitado)
  percentUsed: number; // Percentual usado (0-100)
  isNearLimit: boolean; // true se >= 80%
  canCreate?: boolean; // true se pode criar mais projetos
  message?: string; // Mensagem descritiva sobre o status
}

export interface SubscriptionLimits {
  users: number;
  properties: number;
  storage: number;
  companies: CompanyLimits;
  kanbanProjects?: number; // Limite total (plano + add-ons)
}

export interface SubscriptionValidations {
  isExpired: boolean;
  hasOutstandingPayments: boolean;
  daysUntilExpiry: number;
  isNearExpiry: boolean;
}

export interface SubscriptionData {
  id: string;
  status: Subscription['status'];
  startDate: string;
  endDate: string;
  price: number;
  plan: Plan;
  limits: SubscriptionLimits;
  validations: SubscriptionValidations;
}

export interface CustomPlanCompany {
  companyId: string;
  companyName: string;
  planType: string;
  availableModules: string[];
  userRole: string;
}

export interface CustomPlanResponse {
  type: 'custom_plan';
  companies: CustomPlanCompany[];
  hasAccess: boolean;
  limits: {
    companies: CompanyLimits;
  };
}

export interface SubscriptionResponse {
  type: 'subscription';
  subscription: SubscriptionData;
  hasAccess: boolean;
  reason: string | null;
}

export type MyActiveSubscriptionResponse =
  | SubscriptionResponse
  | CustomPlanResponse;

// Tipo legado mantido para compatibilidade
export interface SubscriptionResponseDto {
  id: string;
  plan: string;
  status: Subscription['status'];
  currentCompanies: number;
  startDate: string;
  endDate: string;
  price: number;
  notes: string | null;
  userId: string;
  planId: string;
  createdAt: string;
  updatedAt: string;
  nextBillingDate: string | null;
  trialEndsAt: string | null;
  asaasSubscriptionId: string | null;
  deactivatedAt?: string | null;
  planChangeLockedUntil?: string | null;
  reactivationAvailableAt?: string | null;
  validationPaymentId?: string | null;
  lastCardValidatedAt?: string | null;
  autoRenew?: boolean;
}

export interface SubscriptionAlert {
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  daysUntilExpiry: number;
  priority: 'high' | 'medium' | 'low';
  action: 'renew' | 'manage' | string;
}

export interface SubscriptionAlertsResponse {
  hasActiveSubscription: boolean;
  alerts: SubscriptionAlert[];
}
