import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { useAutoReloadOnCompanyChange } from './useCompanyMonitor';
import { useAuth } from './useAuth';
import type { Spouse } from '../types/spouse';

export const ClientType = {
  BUYER: 'buyer',
  SELLER: 'seller',
  RENTER: 'renter',
  LESSOR: 'lessor',
  INVESTOR: 'investor',
  GENERAL: 'general',
} as const;

export const ClientStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  CONTACTED: 'contacted',
  INTERESTED: 'interested',
  CLOSED: 'closed',
} as const;

// Estado civil (Marital Status)
export const MaritalStatus = {
  SINGLE: 'single',
  MARRIED: 'married',
  DIVORCED: 'divorced',
  WIDOWED: 'widowed',
  SEPARATED: 'separated',
  COMMON_LAW: 'common_law',
} as const;

// Situação profissional (Employment Status)
export const EmploymentStatus = {
  EMPLOYED: 'employed',
  UNEMPLOYED: 'unemployed',
  RETIRED: 'retired',
  SELF_EMPLOYED: 'self_employed',
  STUDENT: 'student',
  FREELANCER: 'freelancer',
} as const;

export type ClientType = (typeof ClientType)[keyof typeof ClientType];
export type ClientStatus = (typeof ClientStatus)[keyof typeof ClientStatus];
export type MaritalStatus = (typeof MaritalStatus)[keyof typeof MaritalStatus];
export type EmploymentStatus =
  (typeof EmploymentStatus)[keyof typeof EmploymentStatus];

// Re-exportar Spouse para manter compatibilidade
export type { Spouse } from '../types/spouse';

export interface Client {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  secondaryPhone?: string;
  whatsapp?: string;

  // NOVOS: Dados pessoais básicos
  birthDate?: string;
  anniversaryDate?: string; // Formato MM-DD
  rg?: string;

  // Endereço
  zipCode: string;
  address: string;
  city: string;
  state: string;
  neighborhood: string;

  // Tipo e Status
  type: ClientType;
  status: ClientStatus;

  // NOVOS: Situação Pessoal
  maritalStatus?: MaritalStatus;
  hasDependents?: boolean;
  numberOfDependents?: number;
  dependentsNotes?: string;

  // NOVOS: Informações Profissionais
  employmentStatus?: EmploymentStatus;
  companyName?: string;
  jobPosition?: string;
  jobStartDate?: string;
  jobEndDate?: string;
  isCurrentlyWorking?: boolean;
  companyTimeMonths?: number;
  contractType?: string;
  isRetired?: boolean;

  // NOVOS: Informações Financeiras
  monthlyIncome?: number;
  grossSalary?: number;
  netSalary?: number;
  thirteenthSalary?: number;
  vacationPay?: number;
  otherIncomeSources?: string;
  otherIncomeAmount?: number;
  familyIncome?: number;
  creditScore?: number;
  lastCreditCheck?: string;

  // NOVOS: Dados Bancários (Não Sensíveis)
  bankName?: string;
  bankAgency?: string;
  accountType?: string;

  // NOVOS: Patrimônio e Bens
  hasProperty?: boolean;
  hasVehicle?: boolean;

  // NOVOS: Referências
  referenceName?: string;
  referencePhone?: string;
  referenceRelationship?: string;
  professionalReferenceName?: string;
  professionalReferencePhone?: string;
  professionalReferencePosition?: string;

  // Preferências imobiliárias (existentes)
  incomeRange?: string;
  loanRange?: string;
  priceRange?: string;
  preferences?: string;
  notes?: string;
  preferredContactMethod?: string;
  preferredPropertyType?: string;
  preferredCity?: string;
  preferredNeighborhood?: string;
  minArea?: number;
  maxArea?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  minValue?: number;
  maxValue?: number;
  desiredFeatures?: any;

  isActive: boolean;
  companyId: string;
  responsibleUserId: string;
  responsibleUser?: {
    id: string;
    name: string;
  };
  capturedById?: string;
  capturedBy?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };

  // Cônjuge relacionado
  spouse?: Spouse;

  // Campos MCMV (quando cliente é criado via conversão de lead MCMV)
  leadSource?: string; // ClientSource - será 'dream_keys' quando criado via conversão de lead MCMV
  mcmvInterested?: boolean;
  mcmvEligible?: boolean;
  mcmvIncomeRange?: 'faixa1' | 'faixa2' | 'faixa3' | null;
  mcmvCadunicoNumber?: string | null;
  mcmvPreRegistrationDate?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  secondaryPhone?: string;
  whatsapp?: string;

  // Dados pessoais básicos
  birthDate?: string;
  anniversaryDate?: string;
  rg?: string;

  // Endereço
  zipCode: string;
  address: string;
  city: string;
  state: string;
  neighborhood: string;

  // Tipo e status
  type: ClientType;
  status?: ClientStatus;

  // Situação pessoal
  maritalStatus?: MaritalStatus;
  hasDependents?: boolean;
  numberOfDependents?: number;
  dependentsNotes?: string;

  // Informações profissionais
  employmentStatus?: EmploymentStatus;
  companyName?: string;
  jobPosition?: string;
  jobStartDate?: string;
  jobEndDate?: string;
  isCurrentlyWorking?: boolean;
  companyTimeMonths?: number;
  contractType?: string;
  isRetired?: boolean;

  // Informações financeiras
  monthlyIncome?: number;
  grossSalary?: number;
  netSalary?: number;
  thirteenthSalary?: number;
  vacationPay?: number;
  otherIncomeSources?: string;
  otherIncomeAmount?: number;
  familyIncome?: number;
  creditScore?: number;
  lastCreditCheck?: string;

  // Dados bancários
  bankName?: string;
  bankAgency?: string;
  accountType?: string;

  // Patrimônio
  hasProperty?: boolean;
  hasVehicle?: boolean;

  // Referências
  referenceName?: string;
  referencePhone?: string;
  referenceRelationship?: string;
  professionalReferenceName?: string;
  professionalReferencePhone?: string;
  professionalReferencePosition?: string;

  // Preferências imobiliárias
  incomeRange?: string;
  loanRange?: string;
  priceRange?: string;
  preferences?: string;
  notes?: string;
  preferredContactMethod?: string;
  preferredPropertyType?: string;
  preferredCity?: string;
  preferredNeighborhood?: string;
  minArea?: number;
  maxArea?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  minValue?: number;
  maxValue?: number;
  desiredFeatures?: any;

  // Campo obrigatório: ID do captador
  capturedById: string;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {
  id?: string;
}

export interface ClientSearchFilters {
  // Texto e campos básicos
  name?: string;
  email?: string;
  phone?: string;
  search?: string;
  document?: string;

  // Localização
  city?: string;
  neighborhood?: string;

  // Classificações
  type?: ClientType;
  status?: ClientStatus;

  // Escopo e estado
  responsibleUserId?: string;
  isActive?: boolean;
  onlyMyData?: boolean;

  // Período de criação
  createdFrom?: string;
  createdTo?: string;

  // Paginação
  limit?: number;
  page?: number;

  // Ordenação
  sortBy?: 'name' | 'createdAt' | 'status' | 'type' | 'city';
  sortOrder?: 'ASC' | 'DESC';
}

export interface ClientStatistics {
  active_clients: number;
  total_clients: number;
  buyers: number;
  sellers: number;
  renters: number;
  lessors: number;
  investors: number;
  general_clients: number;
}

export const useClients = () => {
  const { getCurrentUser } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFilters, setLastFilters] = useState<
    ClientSearchFilters | undefined
  >(undefined);

  const fetchClients = async (filters?: ClientSearchFilters) => {
    setLoading(true);
    setError(null);

    // Armazenar filtros para reutilização
    const activeFilters = filters || lastFilters;
    if (filters) {
      setLastFilters(filters);
    }

    try {
      // Enviar onlyMyData apenas quando true
      const params = { ...(activeFilters || {}) } as any;
      if (params.onlyMyData !== true) {
        delete params.onlyMyData;
      }
      const result = await api.get('/clients', {
        params,
      });

      // Ajustar para diferentes formatos de resposta
      const clientsData = result.data?.data || result.data || [];
      // Paginação: se page > 1, concatenar; caso contrário, substituir
      const shouldAppend = Boolean(
        activeFilters?.page && activeFilters.page > 1
      );
      setClients(prev =>
        shouldAppend ? [...prev, ...clientsData] : clientsData
      );
      console.log('Clientes recebidos:', clientsData);
      return clientsData;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar clientes');
      console.error('Erro ao buscar clientes:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (data: CreateClientDto): Promise<Client> => {
    try {
      // Obter ID do usuário atual (captador)
      const currentUser = getCurrentUser();
      if (!currentUser?.id) {
        throw new Error('Usuário não autenticado');
      }

      // Garantir que capturedById está presente
      const clientData: CreateClientDto = {
        ...data,
        capturedById: data.capturedById || currentUser.id,
      };

      const result = await api.post('/clients', clientData);
      // Atualizar a lista de clientes após a criação
      await fetchClients();
      return result.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao criar cliente';
      throw new Error(errorMessage);
    }
  };

  const updateClient = async (
    id: string,
    data: UpdateClientDto
  ): Promise<Client> => {
    try {
      const result = await api.put(`/clients/${id}`, data);
      // Atualizar a lista de clientes após a edição
      await fetchClients();
      return result.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao atualizar cliente';
      throw new Error(errorMessage);
    }
  };

  const deleteClient = async (id: string, permanent = false): Promise<void> => {
    try {
      if (permanent) {
        await api.delete(`/clients/${id}/permanent`);
      } else {
        await api.delete(`/clients/${id}`);
      }
      // Atualizar a lista de clientes após a exclusão
      await fetchClients();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao excluir cliente';
      throw new Error(errorMessage);
    }
  };

  const getClient = async (id: string): Promise<Client> => {
    try {
      const result = await api.get(`/clients/${id}`);
      return result.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao buscar cliente';
      throw new Error(errorMessage);
    }
  };

  const getClientStatistics = async (
    filters?: ClientSearchFilters
  ): Promise<ClientStatistics> => {
    try {
      // Usar os mesmos filtros de fetchClients para garantir consistência
      const params = { ...(filters || {}) } as any;
      if (params.onlyMyData !== true) {
        delete params.onlyMyData;
      }
      // Remover parâmetros de paginação que não são relevantes para estatísticas
      delete params.page;
      delete params.limit;
      const result = await api.get('/clients/statistics', { params });
      return result.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao buscar estatísticas';
      throw new Error(errorMessage);
    }
  };

  const assignClientToProperty = async (
    clientId: string,
    propertyId: string,
    interestType = 'interested',
    notes?: string
  ): Promise<void> => {
    try {
      await api.post(`/clients/${clientId}/properties/${propertyId}`, {
        interestType,
        notes,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao vincular cliente';
      throw new Error(errorMessage);
    }
  };

  const unassignClientFromProperty = async (
    clientId: string,
    propertyId: string
  ): Promise<void> => {
    try {
      await api.delete(`/clients/${clientId}/properties/${propertyId}`);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao desvincular cliente';
      throw new Error(errorMessage);
    }
  };

  const getClientProperties = async (clientId: string): Promise<any[]> => {
    try {
      const result = await api.get(`/clients/${clientId}/properties`);
      return result.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao buscar propriedades do cliente';
      throw new Error(errorMessage);
    }
  };

  const getClientsByProperty = async (propertyId: string): Promise<any[]> => {
    try {
      const result = await api.get(`/clients/properties/${propertyId}`);
      return result.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao buscar clientes da propriedade';
      throw new Error(errorMessage);
    }
  };

  const transferClient = async (
    clientId: string,
    newResponsibleUserId: string
  ): Promise<void> => {
    try {
      await api.put(`/clients/${clientId}/transfer`, {
        newResponsibleUserId,
      });
      // Recarregar a lista de clientes após a transferência
      await fetchClients();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao transferir cliente';
      throw new Error(errorMessage);
    }
  };

  // Função estável para recarregar clientes (sem dependências para evitar loop)
  const reloadClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/clients');
      setClients(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao recarregar clientes');
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependências para evitar loop

  // Monitorar mudanças de empresa e recarregar clientes automaticamente
  useAutoReloadOnCompanyChange(reloadClients);

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    getClient,
    getClientStatistics,
    assignClientToProperty,
    unassignClientFromProperty,
    getClientProperties,
    getClientsByProperty,
    transferClient,
  };
};
