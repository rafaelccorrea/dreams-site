export interface Inspection {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  scheduledDate: string;
  startDate?: string;
  completionDate?: string;
  observations?: string;
  checklist?: Record<string, any>;
  photos?: string[];
  value?: number;
  responsibleName?: string;
  responsibleDocument?: string;
  responsiblePhone?: string;
  companyId: string;
  propertyId: string;
  userId: string;
  inspectorId?: string;
  hasFinancialApproval?: boolean;
  approvalId?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    title: string;
    address: string;
    code?: string;
    mainImage?: {
      url: string;
      alt?: string;
    };
    images?: Array<{
      url: string;
      alt?: string;
    }>;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
  inspector?: {
    id: string;
    name: string;
    email: string;
  };
  history?: InspectionHistoryEntry[];
}

export interface InspectionHistoryEntry {
  id: string;
  inspectionId: string;
  description: string;
  userId: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface CreateHistoryEntryRequest {
  description: string;
}

export interface InspectionFilter {
  title?: string;
  status?: string;
  type?: string;
  propertyId?: string;
  inspectorId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CreateInspectionRequest {
  title: string;
  description?: string;
  type: string;
  scheduledDate: string;
  propertyId: string;
  inspectorId?: string;
  value?: number;
  responsibleName?: string;
  responsibleDocument?: string;
  responsiblePhone?: string;
  observations?: string;
  // companyId e userId são obtidos automaticamente pelo backend via JWT e CompanyGuard
}

export interface UpdateInspectionRequest {
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  scheduledDate?: string;
  startDate?: string;
  completionDate?: string;
  propertyId?: string;
  inspectorId?: string;
  value?: number;
  responsibleName?: string;
  responsibleDocument?: string;
  responsiblePhone?: string;
  observations?: string;
  checklist?: Record<string, any>;
}

export interface InspectionListResponse {
  inspections: Inspection[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const InspectionStatus = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const InspectionType = {
  ENTRY: 'entry',
  EXIT: 'exit',
  MAINTENANCE: 'maintenance',
  SALE: 'sale',
} as const;

export const INSPECTION_STATUS_LABELS = {
  scheduled: 'Agendada',
  in_progress: 'Em Andamento',
  completed: 'Concluída',
  cancelled: 'Cancelada',
  pending_approval: 'Aguardando Aprovação',
  approved: 'Aprovada',
  rejected: 'Rejeitada',
};

export const INSPECTION_TYPE_LABELS = {
  entry: 'Entrada',
  exit: 'Saida',
  maintenance: 'Manutencao',
  sale: 'Venda',
};

export const INSPECTION_STATUS_COLORS = {
  scheduled: 'blue',
  in_progress: 'orange',
  completed: 'green',
  cancelled: 'red',
  pending_approval: 'yellow',
  approved: 'green',
  rejected: 'red',
};

export const INSPECTION_TYPE_COLORS = {
  entry: 'blue',
  exit: 'red',
  maintenance: 'orange',
  sale: 'green',
};

// Manter compatibilidade com código existente
export type Vistoria = Inspection;
export type VistoriaFilter = InspectionFilter;
export type CreateVistoriaRequest = CreateInspectionRequest;
export type UpdateVistoriaRequest = UpdateInspectionRequest;
export type VistoriaListResponse = InspectionListResponse;
export type VistoriaStatus = typeof InspectionStatus;
export type VistoriaTipo = typeof InspectionType;
export const VISTORIA_STATUS_LABELS = INSPECTION_STATUS_LABELS;
export const VISTORIA_TIPO_LABELS = INSPECTION_TYPE_LABELS;
export const VISTORIA_STATUS_COLORS = INSPECTION_STATUS_COLORS;
export const VISTORIA_TIPO_COLORS = INSPECTION_TYPE_COLORS;
