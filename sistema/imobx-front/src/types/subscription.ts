export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly';
  features: string[];
  isPopular?: boolean;
  maxUsers?: number;
  maxProperties?: number;
  maxCompanies?: number;
  maxStorage?: number; // em GB
  supportLevel: 'basic' | 'priority' | 'dedicated';
  modules?: string[]; // Módulos disponíveis no plano
  billingType?: 'monthly' | 'yearly';
  trialDays?: number;
  planChangeLockedUntil?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'expired' | 'cancelled' | 'pending';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod?: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  trialEndsAt?: string | null;
  deactivatedAt?: string | null;
  planChangeLockedUntil?: string | null;
  reactivationAvailableAt?: string | null;
  lastCardValidatedAt?: string | null;
  currentCompanies?: number;
  price?: number;
  notes?: string | null;
  asaasSubscriptionId?: string | null;
  plan?: SubscriptionPlan;
  createdAt: string;
  updatedAt: string;
}

// ✅ NOVOS TIPOS PARA API DETALHADA
export type SubscriptionStatusType =
  | 'active'
  | 'suspended'
  | 'expired'
  | 'cancelled'
  | 'inactive'
  | 'pending'
  | 'none';

export interface SubscriptionAccessInfo {
  hasAccess: boolean;
  status: SubscriptionStatusType;
  reason: string | null;
  canAccessFeatures: boolean;
  daysUntilExpiry: number | null;
  isExpired: boolean;
  isSuspended: boolean;
  isExpiringSoon: boolean;
  subscription: {
    id: string;
    planName: string;
    planType: string;
    startDate: string;
    endDate: string;
  } | null;
}

export interface SubscriptionInfo {
  id: string;
  planName: string;
  planType: string;
  startDate: string;
  endDate: string;
}

// ✅ TIPOS LEGADOS (manter para compatibilidade)
export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  subscription?: UserSubscription;
  plan?: SubscriptionPlan;
  daysUntilExpiry?: number;
  isExpired: boolean;
  isExpiringSoon: boolean; // menos de 7 dias
  canAccessFeatures: boolean;
  isMasterUser?: boolean; // Indica se é usuário master (bypass de assinatura)
  statusReason?: SubscriptionStatusType | 'unknown';
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'pix' | 'boleto' | 'bank_transfer';
  lastFour?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface SubscriptionCheckResult {
  status: SubscriptionStatus;
  requiresUpgrade: boolean;
  blockedFeatures: string[];
  allowedFeatures: string[];
}
