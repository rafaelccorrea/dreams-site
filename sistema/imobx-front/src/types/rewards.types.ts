export const RewardCategory = {
  MONETARY: 'monetary',
  TIME_OFF: 'time_off',
  GIFT: 'gift',
  EXPERIENCE: 'experience',
  RECOGNITION: 'recognition',
  OTHER: 'other',
} as const;

export type RewardCategory =
  (typeof RewardCategory)[keyof typeof RewardCategory];

export const RedemptionStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export type RedemptionStatus =
  (typeof RedemptionStatus)[keyof typeof RedemptionStatus];

export interface Reward {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  category: RewardCategory;
  pointsCost: number;
  monetaryValue?: number;
  imageUrl?: string;
  icon?: string;
  stockQuantity?: number;
  redeemedCount: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface RewardRedemption {
  id: string;
  userId: string;
  companyId: string;
  rewardId: string;
  status: RedemptionStatus;
  pointsSpent: number;
  userNotes?: string;
  reviewedById?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  deliveredById?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;

  // Relações
  reward?: Reward;
  user?: {
    id: string;
    name: string;
    email?: string;
    profileImageUrl?: string;
  };
  reviewedBy?: {
    id: string;
    name: string;
  };
  deliveredBy?: {
    id: string;
    name: string;
  };
}

export interface RewardStats {
  pending: number;
  approved: number;
  rejected: number;
  delivered: number;
  total: number;
  totalPointsSpent: number;
}

// Labels em português
export const RewardCategoryLabels: Record<RewardCategory, string> = {
  [RewardCategory.MONETARY]: '💰 Monetário',
  [RewardCategory.TIME_OFF]: '🏖️ Folga',
  [RewardCategory.GIFT]: '🎁 Presente',
  [RewardCategory.EXPERIENCE]: '🎭 Experiência',
  [RewardCategory.RECOGNITION]: '🏆 Reconhecimento',
  [RewardCategory.OTHER]: '📦 Outro',
};

export const RedemptionStatusLabels: Record<RedemptionStatus, string> = {
  [RedemptionStatus.PENDING]: 'Aguardando Aprovação',
  [RedemptionStatus.APPROVED]: 'Aprovado',
  [RedemptionStatus.REJECTED]: 'Rejeitado',
  [RedemptionStatus.DELIVERED]: 'Entregue',
  [RedemptionStatus.CANCELLED]: 'Cancelado',
};

export const RedemptionStatusColors: Record<RedemptionStatus, string> = {
  [RedemptionStatus.PENDING]: '#f59e0b',
  [RedemptionStatus.APPROVED]: '#10b981',
  [RedemptionStatus.REJECTED]: '#ef4444',
  [RedemptionStatus.DELIVERED]: '#3b82f6',
  [RedemptionStatus.CANCELLED]: '#6b7280',
};

export interface CreateRewardRequest {
  name: string;
  description?: string;
  category: RewardCategory;
  pointsCost: number;
  monetaryValue?: number;
  icon?: string;
  imageUrl?: string;
  stockQuantity?: number;
  displayOrder?: number;
}

export interface UpdateRewardRequest extends Partial<CreateRewardRequest> {
  isActive?: boolean;
}

export interface RedeemRewardRequest {
  rewardId: string;
  userNotes?: string;
}

export interface ReviewRedemptionRequest {
  status: 'approved' | 'rejected';
  reviewNotes?: string;
}

export interface DeliverRedemptionRequest {
  reviewNotes?: string;
}
