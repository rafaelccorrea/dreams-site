import { api } from './api';

export interface InspectionApproval {
  id: string;
  inspectionId: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number | string;
  rejectionReason?: string | null;
  notes?: string | null;
  isAutomatic: boolean;
  createdAt: string;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  requesterName: string;
  approverName?: string | null;
  inspectionTitle: string;
  propertyCode?: string;
  approvalType?: string;
}

export interface CreateInspectionApprovalRequest {
  inspectionId: string;
  amount: number;
  notes?: string;
}

export interface ApproveInspectionApprovalRequest {
  status: 'approved';
  notes?: string;
}

export interface RejectInspectionApprovalRequest {
  status: 'rejected';
  rejectionReason: string;
  notes?: string;
}

export interface InspectionApprovalListResponse {
  approvals: InspectionApproval[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InspectionApprovalFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const inspectionApprovalApi = {
  // Solicitar aprovação financeira
  requestApproval: async (
    data: CreateInspectionApprovalRequest
  ): Promise<InspectionApproval> => {
    const response = await api.post('/inspection-approval', data);
    return response.data;
  },

  // Listar aprovações
  list: async (
    filters: InspectionApprovalFilters = {}
  ): Promise<InspectionApprovalListResponse> => {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/inspection-approval?${params.toString()}`);
    return response.data;
  },

  // Buscar aprovação por ID
  getById: async (id: string): Promise<InspectionApproval> => {
    const response = await api.get(`/inspection-approval/${id}`);
    return response.data;
  },

  // Aprovar ou rejeitar inspeção
  approve: async (
    id: string,
    data: ApproveInspectionApprovalRequest | RejectInspectionApprovalRequest
  ): Promise<InspectionApproval> => {
    const response = await api.put(`/inspection-approval/${id}/approve`, data);
    return response.data;
  },
};
