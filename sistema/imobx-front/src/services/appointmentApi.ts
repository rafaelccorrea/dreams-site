import { api } from './api';
import type { AppointmentFilters } from '../types/filters';

export interface AppointmentInvite {
  id: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  message: string | null;
  respondedAt: string | null;
  createdAt: string;
  invitedUser: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    phone: string | null;
  };
  inviter: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  visibility: string;
  startDate: string;
  endDate: string;
  location?: string;
  notes?: string;
  color: string;
  isRecurring?: boolean;
  userId: string;
  companyId: string;
  propertyId?: string;
  clientId?: string;
  participantIds?: string[];
  createdAt: string;
  updatedAt: string;
  property?: any;
  client?: any;
  user?: any;
  invites?: AppointmentInvite[];
  participants?: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    phone: string | null;
    role: string;
  }[];
}

export interface CreateAppointmentData {
  title: string;
  description?: string;
  type: string;
  status: string;
  visibility: string;
  startDate: string;
  endDate: string;
  location?: string;
  notes?: string;
  color: string;
  isRecurring?: boolean;
  propertyId?: string;
  clientId?: string;
  participantIds?: string[];
  inviteUserIds?: string[];
}

export interface UpdateAppointmentData extends Partial<CreateAppointmentData> {}

export interface AppointmentListResponse {
  appointments: Appointment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class AppointmentApiService {
  private baseUrl = '/appointments';

  async getAppointments(
    filters?: AppointmentFilters
  ): Promise<AppointmentListResponse> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.propertyId) params.append('propertyId', filters.propertyId);
    if (filters?.clientId) params.append('clientId', filters.clientId);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.onlyMyData) params.append('onlyMyData', 'true');

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    const response = await api.get(url);
    return response.data;
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  async updateAppointment(
    id: string,
    data: UpdateAppointmentData
  ): Promise<Appointment> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteAppointment(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async addParticipant(
    appointmentId: string,
    userId: string
  ): Promise<Appointment> {
    const response = await api.post(
      `${this.baseUrl}/${appointmentId}/participants/${userId}`
    );
    return response.data;
  }

  async removeParticipant(
    appointmentId: string,
    userId: string
  ): Promise<Appointment> {
    const response = await api.delete(
      `${this.baseUrl}/${appointmentId}/participants/${userId}`
    );
    return response.data;
  }
}

export const appointmentApi = new AppointmentApiService();
