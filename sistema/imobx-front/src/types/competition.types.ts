export const CompetitionType = {
  INDIVIDUAL: 'individual',
  TEAM: 'team',
  MIXED: 'mixed',
} as const;

export type CompetitionType =
  (typeof CompetitionType)[keyof typeof CompetitionType];

export const CompetitionStatus = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  FINISHED: 'finished',
  CANCELLED: 'cancelled',
} as const;

export type CompetitionStatus =
  (typeof CompetitionStatus)[keyof typeof CompetitionStatus];

export interface Competition {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  type: CompetitionType;
  status: CompetitionStatus;
  startDate: string;
  endDate: string;
  useCompanyPointsConfig: boolean;
  customPointsConfig?: {
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
  };
  participantUserIds?: string[];
  participantTeamIds?: string[];
  autoStart: boolean;
  autoEnd: boolean;
  minParticipants?: number;
  maxParticipants?: number;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  prizes?: CompetitionPrize[];
}

export interface CompetitionPrize {
  id: string;
  competitionId: string;
  position: number;
  name: string;
  description?: string;
  value?: number;
  imageUrl?: string;
  isDelivered: boolean;
  winnerUserId?: string;
  winnerTeamId?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  winnerUser?: {
    id: string;
    name: string;
  };
  winnerTeam?: {
    id: string;
    name: string;
  };
}

export interface CreateCompetitionRequest {
  name: string;
  description?: string;
  type: CompetitionType;
  startDate: string;
  endDate: string;
  useCompanyPointsConfig?: boolean;
  customPointsConfig?: any;
  participantUserIds?: string[];
  participantTeamIds?: string[];
  autoStart?: boolean;
  autoEnd?: boolean;
  minParticipants?: number;
  maxParticipants?: number;
}

export interface CreatePrizeRequest {
  position: number;
  name: string;
  description?: string;
  value?: number;
  imageUrl?: string;
}

// Labels em português
export const CompetitionTypeLabels: Record<CompetitionType, string> = {
  [CompetitionType.INDIVIDUAL]: 'Individual',
  [CompetitionType.TEAM]: 'Por Equipe',
  [CompetitionType.MIXED]: 'Misto (Individual + Equipe)',
};

export const CompetitionStatusLabels: Record<CompetitionStatus, string> = {
  [CompetitionStatus.DRAFT]: 'Rascunho',
  [CompetitionStatus.SCHEDULED]: 'Agendada',
  [CompetitionStatus.ACTIVE]: 'Em Andamento',
  [CompetitionStatus.FINISHED]: 'Finalizada',
  [CompetitionStatus.CANCELLED]: 'Cancelada',
};

export const CompetitionStatusColors: Record<CompetitionStatus, string> = {
  [CompetitionStatus.DRAFT]: '#6b7280',
  [CompetitionStatus.SCHEDULED]: '#3b82f6',
  [CompetitionStatus.ACTIVE]: '#10b981',
  [CompetitionStatus.FINISHED]: '#8b5cf6',
  [CompetitionStatus.CANCELLED]: '#ef4444',
};

export const CompetitionTypeColors: Record<CompetitionType, string> = {
  [CompetitionType.INDIVIDUAL]: '#3b82f6', // Azul
  [CompetitionType.TEAM]: '#10b981', // Verde
  [CompetitionType.MIXED]: '#f59e0b', // Amarelo/Laranja
};

export const CompetitionTypeOptions = Object.entries(CompetitionTypeLabels).map(
  ([value, label]) => ({
    value,
    label,
  })
);

export const CompetitionStatusOptions = Object.entries(
  CompetitionStatusLabels
).map(([value, label]) => ({
  value,
  label,
}));
