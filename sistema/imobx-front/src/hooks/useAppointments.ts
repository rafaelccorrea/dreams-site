import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useCompany } from './useCompany';

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
  status?: string;
  visibility?: string;
  startDate: string;
  endDate: string;
  location?: string;
  notes?: string;
  color?: string;
  isRecurring?: boolean;
  propertyId?: string;
  clientId?: string;
  participantIds?: string[];
  inviteUserIds?: string[];
}

export type UpdateAppointmentData = Partial<CreateAppointmentData>;

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useCompany();

  const loadAppointments = useCallback(async () => {
    if (!selectedCompany) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Erro ao carregar agendamentos';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedCompany]);

  const getAppointmentById = useCallback(
    async (id: string): Promise<Appointment> => {
      try {
        const response = await api.get(`/appointments/${id}`);
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao buscar detalhes do agendamento';
        throw new Error(errorMessage);
      }
    },
    []
  );

  const createAppointment = useCallback(
    async (data: CreateAppointmentData) => {
      try {
        // Extrair IDs de usuários para convites
        const { inviteUserIds, ...appointmentData } = data;

        // Criar o agendamento
        const response = await api.post('/appointments', appointmentData);
        const appointment = response.data;

        // Criar convites se houver usuários selecionados
        if (inviteUserIds && inviteUserIds.length > 0) {
          const invitePromises = inviteUserIds.map(userId =>
            api.post('/appointment-invites', {
              appointmentId: appointment.id,
              invitedUserId: userId,
            })
          );

          await Promise.all(invitePromises);
        }

        await loadAppointments();
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao criar agendamento';
        throw new Error(errorMessage);
      }
    },
    [loadAppointments]
  );

  const updateAppointment = useCallback(
    async (id: string, data: UpdateAppointmentData) => {
      try {
        const response = await api.patch(`/appointments/${id}`, data);
        await loadAppointments();
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao atualizar agendamento';
        throw new Error(errorMessage);
      }
    },
    [loadAppointments]
  );

  const deleteAppointment = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/appointments/${id}`);
        await loadAppointments();
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao excluir agendamento';
        throw new Error(errorMessage);
      }
    },
    [loadAppointments]
  );

  const addParticipant = useCallback(
    async (appointmentId: string, userId: string): Promise<Appointment> => {
      try {
        const response = await api.post(
          `/appointments/${appointmentId}/participants/${userId}`
        );
        await loadAppointments();
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao vincular participante';
        throw new Error(errorMessage);
      }
    },
    [loadAppointments]
  );

  const removeParticipant = useCallback(
    async (appointmentId: string, userId: string): Promise<Appointment> => {
      try {
        const response = await api.delete(
          `/appointments/${appointmentId}/participants/${userId}`
        );
        await loadAppointments();
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao desvincular participante';
        throw new Error(errorMessage);
      }
    },
    [loadAppointments]
  );

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  return {
    appointments,
    isLoading,
    error,
    loadAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    addParticipant,
    removeParticipant,
  };
};
