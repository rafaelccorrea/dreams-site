export const ScorePeriod = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
  ALL_TIME: 'all_time',
} as const;

export type ScorePeriod = (typeof ScorePeriod)[keyof typeof ScorePeriod];

export const AchievementCategory = {
  SALES: 'sales',
  RELATIONSHIP: 'relationship',
  ACTIVITY: 'activity',
  MILESTONE: 'milestone',
  SPECIAL: 'special',
} as const;

export type AchievementCategory =
  (typeof AchievementCategory)[keyof typeof AchievementCategory];

export const AchievementTier = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond',
} as const;

export type AchievementTier =
  (typeof AchievementTier)[keyof typeof AchievementTier];

export interface GamificationScore {
  id: string;
  userId: string;
  companyId: string;
  period: ScorePeriod;
  periodDate: string;

  // Métricas de vendas
  propertiesSold: number;
  totalSalesValue: number;
  rentalsCreated: number;
  totalCommission: number;

  // Métricas de relacionamento
  clientsContacted: number;
  newClientsCreated: number;
  meetingsScheduled: number;

  // Métricas de atividade
  propertiesCreated: number;
  inspectionsCompleted: number;
  keysDelivered: number;
  tasksCompleted: number;

  // Pontos
  totalPoints: number;
  salesPoints: number;
  activityPoints: number;
  relationshipPoints: number;

  // Ranking
  rankPosition?: number;

  createdAt: string;
  updatedAt: string;

  // Relacionamentos
  user?: {
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
  };
}

export interface TeamScore {
  id: string;
  teamId: string;
  companyId: string;
  period: ScorePeriod;
  periodDate: string;

  totalMembers: number;
  propertiesSold: number;
  totalSalesValue: number;
  rentalsCreated: number;
  totalCommission: number;
  clientsContacted: number;
  newClientsCreated: number;
  propertiesCreated: number;
  inspectionsCompleted: number;
  tasksCompleted: number;

  totalPoints: number;
  averagePointsPerMember: number;
  rankPosition?: number;

  createdAt: string;
  updatedAt: string;

  team?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface Achievement {
  id: string;
  code: string;
  namePt: string;
  descriptionPt: string;
  category: AchievementCategory;
  tier: AchievementTier;
  pointsReward: number;
  iconUrl?: string;
  iconEmoji?: string;
  unlockCriteria: {
    type: string;
    value: number;
    period?: string;
  };
  isActive: boolean;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  companyId: string;
  unlockedAt: string;
  pointsEarned: number;
  unlockMetadata?: Record<string, any>;
  createdAt: string;
  achievement: Achievement;
}

export interface LeaderboardResponse {
  topPerformers: GamificationScore[];
  myScore: GamificationScore | null;
  myPosition: number | null;
  totalParticipants: number;
  period: ScorePeriod;
}

export interface GamificationDashboard {
  myScore: GamificationScore;
  myAchievements: {
    total: number;
    recent: UserAchievement[];
  };
  rankings: {
    myPosition: number;
    totalParticipants: number;
    top5: GamificationScore[];
  };
  period: ScorePeriod;
}

// Labels em português
export const ScorePeriodLabels: Record<ScorePeriod, string> = {
  [ScorePeriod.DAILY]: 'Hoje',
  [ScorePeriod.WEEKLY]: 'Esta Semana',
  [ScorePeriod.MONTHLY]: 'Este Mês',
  [ScorePeriod.QUARTERLY]: 'Este Trimestre',
  [ScorePeriod.YEARLY]: 'Este Ano',
  [ScorePeriod.ALL_TIME]: 'Todo o Período',
};

export const AchievementCategoryLabels: Record<AchievementCategory, string> = {
  [AchievementCategory.SALES]: 'Vendas',
  [AchievementCategory.RELATIONSHIP]: 'Relacionamento',
  [AchievementCategory.ACTIVITY]: 'Atividade',
  [AchievementCategory.MILESTONE]: 'Marco',
  [AchievementCategory.SPECIAL]: 'Especial',
};

export const AchievementTierLabels: Record<AchievementTier, string> = {
  [AchievementTier.BRONZE]: 'Bronze',
  [AchievementTier.SILVER]: 'Prata',
  [AchievementTier.GOLD]: 'Ouro',
  [AchievementTier.PLATINUM]: 'Platina',
  [AchievementTier.DIAMOND]: 'Diamante',
};

export const AchievementTierColors: Record<AchievementTier, string> = {
  [AchievementTier.BRONZE]: '#CD7F32',
  [AchievementTier.SILVER]: '#C0C0C0',
  [AchievementTier.GOLD]: '#FFD700',
  [AchievementTier.PLATINUM]: '#E5E4E2',
  [AchievementTier.DIAMOND]: '#B9F2FF',
};

export const AchievementCategoryColors: Record<AchievementCategory, string> = {
  [AchievementCategory.SALES]: '#10b981',
  [AchievementCategory.RELATIONSHIP]: '#3b82f6',
  [AchievementCategory.ACTIVITY]: '#f59e0b',
  [AchievementCategory.MILESTONE]: '#8b5cf6',
  [AchievementCategory.SPECIAL]: '#ec4899',
};

// Configuração de Gamificação
export interface GamificationConfig {
  id: string;
  companyId: string;
  isEnabled: boolean;

  // Pontos de Vendas
  pointsPropertySale: number;
  pointsRentalCreated: number;
  pointsCommissionMultiplier: number;

  // Pontos de Relacionamento
  pointsNewClient: number;
  pointsClientContact: number;
  pointsMeetingScheduled: number;

  // Pontos de Atividade
  pointsPropertyCreated: number;
  pointsInspectionCompleted: number;
  pointsTaskCompleted: number;
  pointsKeyDelivered: number;

  // Visibilidade
  showIndividualRanking: boolean;
  showTeamRanking: boolean;
  showAchievements: boolean;

  // Períodos habilitados
  enabledPeriods: string[];

  // Mensagens personalizadas
  welcomeMessage?: string;
  rankingMessage?: string;

  // Notificações
  notifyNewAchievement: boolean;
  notifyRankChange: boolean;
  notifyWeeklySummary: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface UpdateGamificationConfigRequest {
  isEnabled?: boolean;
  pointsPropertySale?: number;
  pointsRentalCreated?: number;
  pointsCommissionMultiplier?: number;
  pointsNewClient?: number;
  pointsClientContact?: number;
  pointsMeetingScheduled?: number;
  pointsPropertyCreated?: number;
  pointsInspectionCompleted?: number;
  pointsTaskCompleted?: number;
  pointsKeyDelivered?: number;
  showIndividualRanking?: boolean;
  showTeamRanking?: boolean;
  showAchievements?: boolean;
  enabledPeriods?: string[];
  welcomeMessage?: string;
  rankingMessage?: string;
  notifyNewAchievement?: boolean;
  notifyRankChange?: boolean;
  notifyWeeklySummary?: boolean;
}
