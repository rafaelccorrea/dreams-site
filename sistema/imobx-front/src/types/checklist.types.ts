// Tipos para Checklist de Vendas/Aluguéis

export const ChecklistType = {
  SALE: 'sale',
  RENTAL: 'rental',
} as const;

export type ChecklistType = (typeof ChecklistType)[keyof typeof ChecklistType];

export const ChecklistStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  SKIPPED: 'skipped',
} as const;

export type ChecklistStatus =
  (typeof ChecklistStatus)[keyof typeof ChecklistStatus];

export const ItemStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  SKIPPED: 'skipped',
} as const;

export type ItemStatus = (typeof ItemStatus)[keyof typeof ItemStatus];

// Labels em português
export const ChecklistTypeLabels: Record<ChecklistType, string> = {
  [ChecklistType.SALE]: 'Venda',
  [ChecklistType.RENTAL]: 'Aluguel',
};

export const ChecklistStatusLabels: Record<ChecklistStatus, string> = {
  [ChecklistStatus.PENDING]: 'Pendente',
  [ChecklistStatus.IN_PROGRESS]: 'Em Andamento',
  [ChecklistStatus.COMPLETED]: 'Concluído',
  [ChecklistStatus.SKIPPED]: 'Pulado',
};

export const ItemStatusLabels: Record<ItemStatus, string> = {
  [ItemStatus.PENDING]: 'Pendente',
  [ItemStatus.IN_PROGRESS]: 'Em Andamento',
  [ItemStatus.COMPLETED]: 'Concluído',
  [ItemStatus.SKIPPED]: 'Pulado',
};

// Cores para status
export const ChecklistStatusColors: Record<ChecklistStatus, string> = {
  [ChecklistStatus.PENDING]: '#6b7280',
  [ChecklistStatus.IN_PROGRESS]: '#3b82f6',
  [ChecklistStatus.COMPLETED]: '#10b981',
  [ChecklistStatus.SKIPPED]: '#f59e0b',
};

export const ItemStatusColors: Record<ItemStatus, string> = {
  [ItemStatus.PENDING]: '#6b7280',
  [ItemStatus.IN_PROGRESS]: '#3b82f6',
  [ItemStatus.COMPLETED]: '#10b981',
  [ItemStatus.SKIPPED]: '#f59e0b',
};

// DTOs para criação
export interface ChecklistItemDto {
  title: string;
  description?: string;
  status: ItemStatus;
  requiredDocuments?: string[];
  estimatedDays?: number;
  order: number;
  notes?: string;
}

export interface CreateChecklistDto {
  propertyId: string;
  clientId: string;
  type: ChecklistType;
  items?: ChecklistItemDto[];
  notes?: string;
}

// DTOs para atualização
export interface UpdateChecklistItemDto {
  id?: string;
  title?: string;
  description?: string;
  status?: ItemStatus;
  requiredDocuments?: string[];
  estimatedDays?: number;
  order?: number;
  notes?: string;
}

export interface UpdateChecklistDto {
  type?: ChecklistType;
  items?: UpdateChecklistItemDto[];
  status?: ChecklistStatus;
  notes?: string;
}

export interface UpdateItemStatusDto {
  itemId: string;
  status: ItemStatus;
  notes?: string;
}

// Respostas da API
export interface ChecklistItemResponseDto {
  id: string;
  title: string;
  description?: string;
  status: ItemStatus;
  requiredDocuments?: string[];
  estimatedDays?: number;
  order: number;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

export interface ChecklistStatistics {
  totalItems: number;
  completedItems: number;
  pendingItems: number;
  inProgressItems: number;
  completionPercentage: number;
}

export interface ChecklistProperty {
  id: string;
  title: string;
  code?: string;
}

export interface ChecklistClient {
  id: string;
  name: string;
  email?: string;
  phone: string;
}

export interface ChecklistResponsibleUser {
  id: string;
  name: string;
  email: string;
}

export interface ChecklistResponseDto {
  id: string;
  propertyId: string;
  clientId: string;
  companyId: string;
  responsibleUserId: string;
  type: ChecklistType;
  items: ChecklistItemResponseDto[];
  status: ChecklistStatus;
  startedAt: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  property?: ChecklistProperty;
  client?: ChecklistClient;
  responsibleUser?: ChecklistResponsibleUser;
  statistics: ChecklistStatistics;
}

// Filtros para listagem
export interface ChecklistFilter {
  propertyId?: string;
  clientId?: string;
  type?: ChecklistType;
  status?: ChecklistStatus;
  search?: string;
  page?: number;
  limit?: number;
}
