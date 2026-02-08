/**
 * Tipos TypeScript para o sistema de compra de extras (add-ons) para assinaturas
 *
 * Os extras permitem que usuários comprem:
 * - Usuários adicionais (+10, +20, etc.)
 * - Propriedades adicionais (+50, +100, etc.)
 * - Armazenamento adicional (+5 GB, +10 GB, etc.)
 */

/**
 * Tipos de add-ons disponíveis
 */
export enum AddonType {
  EXTRA_USERS = 'extra_users',
  EXTRA_PROPERTIES = 'extra_properties',
  EXTRA_STORAGE_GB = 'extra_storage_gb',
}

/**
 * Status de um add-on
 */
export enum AddonStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

/**
 * Preços e informações de add-ons disponíveis
 */
export interface AddonPricing {
  type: AddonType;
  unitPrice: number;
  description: string;
}

/**
 * Add-on de uma assinatura
 */
export interface SubscriptionAddon {
  id: string;
  subscriptionId: string;
  type: AddonType;
  quantity: number;
  monthlyPrice: number;
  status: AddonStatus;
  startDate: string;
  endDate: string | null;
  purchasedByUserId: string;
  notes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * DTO para compra de add-on
 */
export interface PurchaseAddonDto {
  type: AddonType;
  quantity: number;
  startDate?: string;
  endDate?: string | null;
  notes?: string;
}

/**
 * Resposta ao recalcular preço da assinatura
 */
export interface RecalculatePriceResponse {
  newPrice: number;
  message: string;
}

/**
 * Limites totais (plano base + add-ons ativos)
 */
export interface AddonLimits {
  users: number;
  properties: number;
  storage: number;
}

/**
 * Tradução de tipos de add-on para português
 */
export const ADDON_TYPE_LABELS: Record<AddonType, string> = {
  [AddonType.EXTRA_USERS]: 'Usuários Adicionais',
  [AddonType.EXTRA_PROPERTIES]: 'Propriedades Adicionais',
  [AddonType.EXTRA_STORAGE_GB]: 'Armazenamento Adicional (GB)',
};

/**
 * Tradução de status de add-on para português
 */
export const ADDON_STATUS_LABELS: Record<AddonStatus, string> = {
  [AddonStatus.ACTIVE]: 'Ativo',
  [AddonStatus.CANCELLED]: 'Cancelado',
  [AddonStatus.EXPIRED]: 'Expirado',
};
