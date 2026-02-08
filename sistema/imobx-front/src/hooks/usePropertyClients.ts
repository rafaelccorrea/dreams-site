import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { useAutoReloadOnCompanyChange } from './useCompanyMonitor';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type?: string;
  responsibleUser?: {
    id: string;
    name: string;
  };
  responsibleUserId?: string;
}

interface ClientAssociation {
  client: Client;
  interestType?: string;
  notes?: string;
  contactedAt?: string;
  createdAt?: string;
}

interface UsePropertyClientsReturn {
  propertyClients: ClientAssociation[];
  availableClients: Client[];
  selectedClients: Client[];
  loading: boolean;
  error: string | null;
  fetchPropertyClients: (propertyId: string) => Promise<void>;
  fetchAvailableClients: () => Promise<void>;
  assignClientsToProperty: (
    propertyId: string,
    clientIds: string[]
  ) => Promise<void>;
  removeClientFromProperty: (
    propertyId: string,
    clientId: string
  ) => Promise<void>;
  setSelectedClients: (clients: Client[]) => void;
}

export const usePropertyClients = (): UsePropertyClientsReturn => {
  const [propertyClients, setPropertyClients] = useState<ClientAssociation[]>(
    []
  );
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPropertyClients = async (propertyId: string) => {
    try {
      setLoading(true);
      setError(null);
      // Buscar detalhes da propriedade (inclui lista de clientes)
      const response = await api.get(`/properties/${propertyId}`);

      const property = response.data || {};
      const clientsFromProperty = Array.isArray(property.clients)
        ? property.clients
        : [];

      // Mapear para o formato esperado por PropertyClientsManager
      const mappedAssociations: ClientAssociation[] = clientsFromProperty.map(
        (c: any) => ({
          client: {
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            type: c.type,
            // Backend retorna somente o nome do responsável; criar objeto compatível
            responsibleUser: c.responsibleUserName
              ? { id: c.responsibleUserId, name: c.responsibleUserName }
              : undefined,
            responsibleUserId: c.responsibleUserId,
          },
          interestType: c.interestType,
          notes: c.notes,
          contactedAt: c.contactedAt,
          createdAt: c.createdAt,
        })
      );

      setPropertyClients(mappedAssociations);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Erro ao carregar clientes da propriedade';
      setError(errorMessage);
      setPropertyClients([]); // Reset to empty array on error
      console.error('Erro ao buscar clientes da propriedade:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableClients = async (currentUserId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/clients');

      // Ensure we have a valid array
      let filteredClients = Array.isArray(response.data) ? response.data : [];

      if (currentUserId) {
        // Filtrar apenas clientes vinculados ao usuário responsável atual
        filteredClients = filteredClients.filter(
          (client: any) => client && client.responsibleUserId === currentUserId
        );
      }

      setAvailableClients(filteredClients);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao carregar clientes disponíveis';
      setError(errorMessage);
      setAvailableClients([]); // Reset to empty array on error
      console.error('Erro ao buscar clientes disponíveis:', err);
    } finally {
      setLoading(false);
    }
  };

  const assignClientsToProperty = async (
    propertyId: string,
    clientIds: string[]
  ) => {
    try {
      setLoading(true);

      // Vincular cada cliente à propriedade
      for (const clientId of clientIds) {
        await api.post(`/clients/${clientId}/properties/${propertyId}`, {
          interestType: 'interested',
          notes: '',
        });
      }

      // Recarregar clientes da propriedade
      await fetchPropertyClients(propertyId);

      toast.success(`${clientIds.length} cliente(s) vinculado(s) com sucesso!`);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao vincular clientes';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Erro ao vincular clientes à propriedade:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeClientFromProperty = async (
    propertyId: string,
    clientId: string
  ) => {
    try {
      setLoading(true);
      await api.delete(`/clients/${clientId}/properties/${propertyId}`);

      // Recarregar clientes da propriedade
      await fetchPropertyClients(propertyId);

      toast.success('Cliente desvinculado com sucesso!');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao desvincular cliente';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Erro ao desvincular cliente:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função estável para limpar dados de clientes de propriedade (sem dependências para evitar loop)
  const clearPropertyClients = useCallback(() => {
    setPropertyClients([]);
    setAvailableClients([]);
    setSelectedClients([]);
    setError(null);
    // console.log('🧹 Dados de clientes de propriedade limpos após mudança de empresa');
  }, []); // Sem dependências para evitar loop

  // Monitorar mudanças de empresa e limpar dados automaticamente
  useAutoReloadOnCompanyChange(clearPropertyClients);

  return {
    propertyClients,
    availableClients,
    selectedClients,
    loading,
    error,
    fetchPropertyClients,
    fetchAvailableClients,
    assignClientsToProperty,
    removeClientFromProperty,
    setSelectedClients,
  };
};
