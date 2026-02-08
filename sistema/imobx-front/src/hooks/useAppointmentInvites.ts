import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { toast } from 'react-toastify';

export interface AppointmentInvite {
  id: string;
  appointmentId: string;
  inviterUserId: string;
  invitedUserId: string;
  companyId: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  message?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
  appointment: {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    location?: string;
    type: string;
    visibility: string;
    color: string;
  };
  inviter: {
    id: string;
    name: string;
    email: string;
  };
  invitedUser: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateAppointmentInviteData {
  appointmentId: string;
  invitedUserId: string;
  message?: string;
}

export interface RespondInviteData {
  status: 'accepted' | 'declined';
  responseMessage?: string;
}

export const useAppointmentInvites = () => {
  const [invites, setInvites] = useState<AppointmentInvite[]>([]);
  const [pendingInvites, setPendingInvites] = useState<AppointmentInvite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInvites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/appointment-invites/my-invites');
      setInvites(response.data);
    } catch (err: any) {
      // Não exibir mensagens técnicas de permissões para o usuário
      const backendMessage = err.response?.data?.message || '';
      let userFriendlyMessage = 'Erro ao carregar convites';

      if (
        backendMessage.includes('calendar:') ||
        backendMessage.includes('permiss')
      ) {
        userFriendlyMessage = 'Você não tem permissão para visualizar convites';
      } else if (backendMessage && !backendMessage.includes(':')) {
        userFriendlyMessage = backendMessage;
      }

      setError(userFriendlyMessage);
      toast.error(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPendingInvites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/appointment-invites/pending');
      setPendingInvites(response.data);
    } catch (err: any) {
      // Não exibir mensagens técnicas de permissões para o usuário
      const backendMessage = err.response?.data?.message || '';
      let userFriendlyMessage = 'Erro ao carregar convites pendentes';

      if (
        backendMessage.includes('calendar:') ||
        backendMessage.includes('permiss')
      ) {
        userFriendlyMessage =
          'Você não tem permissão para visualizar convites pendentes';
      } else if (backendMessage && !backendMessage.includes(':')) {
        userFriendlyMessage = backendMessage;
      }

      setError(userFriendlyMessage);
      toast.error(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createInvite = useCallback(
    async (data: CreateAppointmentInviteData): Promise<AppointmentInvite> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.post('/appointment-invites', data);
        toast.success('Convite enviado com sucesso!');
        await loadInvites(); // Recarregar lista de convites
        return response.data;
      } catch (err: any) {
        // Não exibir mensagens técnicas de permissões para o usuário
        const backendMessage = err.response?.data?.message || '';
        let userFriendlyMessage = 'Erro ao enviar convite';

        if (
          backendMessage.includes('calendar:') ||
          backendMessage.includes('permiss')
        ) {
          userFriendlyMessage = 'Você não tem permissão para enviar convites';
        } else if (backendMessage && !backendMessage.includes(':')) {
          userFriendlyMessage = backendMessage;
        }

        setError(userFriendlyMessage);
        toast.error(userFriendlyMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [loadInvites]
  );

  const respondToInvite = useCallback(
    async (
      inviteId: string,
      data: RespondInviteData
    ): Promise<AppointmentInvite> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.patch(
          `/appointment-invites/${inviteId}/respond`,
          data
        );
        const message =
          data.status === 'accepted' ? 'Convite aceito!' : 'Convite recusado!';
        toast.success(message);
        await loadInvites(); // Recarregar lista de convites
        await loadPendingInvites(); // Recarregar convites pendentes
        return response.data;
      } catch (err: any) {
        // Não exibir mensagens técnicas de permissões para o usuário
        const backendMessage = err.response?.data?.message || '';
        let userFriendlyMessage = 'Erro ao responder convite';

        if (
          backendMessage.includes('calendar:update') ||
          backendMessage.includes('permiss')
        ) {
          userFriendlyMessage =
            'Você não tem permissão para responder este convite';
        } else if (
          backendMessage.includes('convite não encontrado') ||
          backendMessage.includes('invite not found')
        ) {
          userFriendlyMessage = 'Convite não encontrado';
        } else if (
          backendMessage.includes('convite já respondido') ||
          backendMessage.includes('already responded')
        ) {
          userFriendlyMessage = 'Este convite já foi respondido';
        } else if (backendMessage && !backendMessage.includes(':')) {
          // Se a mensagem não contém informações técnicas, usar ela
          userFriendlyMessage = backendMessage;
        }

        setError(userFriendlyMessage);
        toast.error(userFriendlyMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [loadInvites, loadPendingInvites]
  );

  const cancelInvite = useCallback(
    async (inviteId: string): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        await api.delete(`/appointment-invites/${inviteId}`);
        toast.success('Convite cancelado com sucesso!');
        await loadInvites(); // Recarregar lista de convites
      } catch (err: any) {
        // Não exibir mensagens técnicas de permissões para o usuário
        const backendMessage = err.response?.data?.message || '';
        let userFriendlyMessage = 'Erro ao cancelar convite';

        if (
          backendMessage.includes('calendar:') ||
          backendMessage.includes('permiss')
        ) {
          userFriendlyMessage = 'Você não tem permissão para cancelar convites';
        } else if (backendMessage && !backendMessage.includes(':')) {
          userFriendlyMessage = backendMessage;
        }

        setError(userFriendlyMessage);
        toast.error(userFriendlyMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [loadInvites]
  );

  return {
    invites,
    pendingInvites,
    isLoading,
    error,
    loadInvites,
    loadPendingInvites,
    createInvite,
    respondToInvite,
    cancelInvite,
  };
};
