import { api } from './api';
import type {
  CommissionConfig,
  CreateCommissionConfigDTO,
  UpdateCommissionConfigDTO,
  Commission,
  CreateCommissionDTO,
  UpdateCommissionDTO,
  RejectCommissionDTO,
  PayCommissionDTO,
  CommissionsListResponse,
  CommissionReport,
} from '../types/commission';
import type { CommissionFilters } from '../types/filters';

// Configurações de Comissão
export const commissionConfigApi = {
  // Buscar configuração da empresa
  async getConfig(): Promise<CommissionConfig> {
    const response = await api.get('/commission-configs');
    return response.data;
  },

  // Criar configuração (apenas admin)
  async createConfig(
    data: CreateCommissionConfigDTO
  ): Promise<CommissionConfig> {
    const response = await api.post('/commission-configs', data);
    return response.data;
  },

  // Atualizar configuração (apenas admin)
  async updateConfig(
    data: UpdateCommissionConfigDTO
  ): Promise<CommissionConfig> {
    const response = await api.put('/commission-configs', data);
    return response.data;
  },

  // Desativar configuração (apenas admin)
  async deleteConfig(): Promise<void> {
    await api.delete('/commission-configs');
  },
};

// Gestão de Comissões
export const commissionsApi = {
  // Listar comissões
  async getCommissions(
    filters?: CommissionFilters
  ): Promise<CommissionsListResponse> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.propertyId) params.append('propertyId', filters.propertyId);
    if (filters?.month) params.append('month', filters.month.toString());
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    if (filters?.onlyMyData) params.append('onlyMyData', 'true');

    const queryString = params.toString();
    const url = queryString ? `/commissions?${queryString}` : '/commissions';

    const response = await api.get(url);
    return response.data;
  },

  // Buscar comissão por ID
  async getCommissionById(id: string): Promise<Commission> {
    const response = await api.get(`/commissions/${id}`);
    return response.data;
  },

  // Criar comissão
  async createCommission(data: CreateCommissionDTO): Promise<Commission> {
    const response = await api.post('/commissions', data);
    return response.data;
  },

  // Atualizar comissão
  async updateCommission(
    id: string,
    data: UpdateCommissionDTO
  ): Promise<Commission> {
    const response = await api.put(`/commissions/${id}`, data);
    return response.data;
  },

  // Aprovar comissão (apenas admin/manager)
  async approveCommission(id: string): Promise<Commission> {
    const response = await api.post(`/commissions/${id}/approve`);
    return response.data;
  },

  // Rejeitar comissão (apenas admin/manager)
  async rejectCommission(
    id: string,
    data: RejectCommissionDTO
  ): Promise<Commission> {
    const response = await api.post(`/commissions/${id}/reject`, data);
    return response.data;
  },

  // Marcar como paga (apenas admin)
  async payCommission(id: string, data: PayCommissionDTO): Promise<Commission> {
    const response = await api.post(`/commissions/${id}/pay`, data);
    return response.data;
  },

  // Cancelar comissão
  async cancelCommission(id: string, reason: string): Promise<Commission> {
    const response = await api.post(`/commissions/${id}/cancel`, { reason });
    return response.data;
  },

  // Recalcular comissão
  async recalculateCommission(id: string): Promise<Commission> {
    const response = await api.post(`/commissions/${id}/recalculate`);
    return response.data;
  },

  // Excluir comissão (apenas admin)
  async deleteCommission(id: string): Promise<void> {
    await api.delete(`/commissions/${id}`);
  },

  // Gerar relatório de comissões
  async generateReport(filters?: CommissionFilters): Promise<CommissionReport> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.month) params.append('month', filters.month.toString());
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    const url = queryString
      ? `/commissions/report?${queryString}`
      : '/commissions/report';

    const response = await api.get(url);
    return response.data;
  },

  // Buscar comissões de um usuário
  async getUserCommissions(
    userId: string,
    filters?: Omit<CommissionFilters, 'userId'>
  ): Promise<CommissionsListResponse> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.month) params.append('month', filters.month.toString());
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    const url = queryString
      ? `/commissions/user/${userId}?${queryString}`
      : `/commissions/user/${userId}`;

    const response = await api.get(url);
    return response.data;
  },
};
