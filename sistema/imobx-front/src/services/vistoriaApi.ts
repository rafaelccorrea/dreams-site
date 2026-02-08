import { api } from './api';
import type {
  Inspection,
  CreateInspectionRequest,
  UpdateInspectionRequest,
  InspectionListResponse,
  InspectionHistoryEntry,
} from '../types/vistoria-types';
import type { InspectionFilters } from '../types/filters';
import { validateStorageBeforeUpload } from '../utils/storageValidation';

export const inspectionApi = {
  // Criar nova inspeção
  create: async (data: CreateInspectionRequest): Promise<Inspection> => {
    const response = await api.post('/inspection', data);
    return response.data;
  },

  // Listar inspeções com filtros
  list: async (
    filters: InspectionFilters = {}
  ): Promise<InspectionListResponse> => {
    const params = new URLSearchParams();

    if (filters.title) params.append('title', filters.title);
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.propertyId) params.append('propertyId', filters.propertyId);
    if (filters.inspectorId) params.append('inspectorId', filters.inspectorId);
    if (filters.startDate) params.append('dataInicial', filters.startDate);
    if (filters.endDate) params.append('dataFinal', filters.endDate);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if ((filters as any).onlyMyData) params.append('onlyMyData', 'true');
    // O backend automaticamente filtra baseado nas permissões do usuário

    const response = await api.get(`/inspection?${params.toString()}`);
    const data = response.data;

    // Suportar resposta como 'vistorias' ou 'inspections'
    if (data.vistorias && !data.inspections) {
      return {
        inspections: data.vistorias,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      };
    }

    return data;
  },

  // Buscar inspeção por ID
  getById: async (id: string): Promise<Inspection> => {
    const response = await api.get(`/inspection/${id}`);
    return response.data;
  },

  // Atualizar inspeção
  update: async (
    id: string,
    data: UpdateInspectionRequest
  ): Promise<Inspection> => {
    const response = await api.put(`/inspection/${id}`, data);
    return response.data;
  },

  // Excluir inspeção
  delete: async (id: string): Promise<void> => {
    await api.delete(`/inspection/${id}`);
  },

  // Listar inspeções de uma propriedade
  getByProperty: async (propertyId: string): Promise<Inspection[]> => {
    const response = await api.get(`/inspection/property/${propertyId}`);
    return response.data;
  },

  // Listar inspeções de um inspetor (vistoriador)
  getByInspector: async (inspectorId: string): Promise<Inspection[]> => {
    const response = await api.get(`/inspection/vistoriador/${inspectorId}`);
    return response.data;
  },

  // Upload de foto (pode usar upload-foto ou upload-photo)
  uploadPhoto: async (id: string, file: File): Promise<Inspection> => {
    // Validar armazenamento antes de fazer upload
    const storageValidation = await validateStorageBeforeUpload(
      file.size,
      false
    );
    if (!storageValidation.canUpload) {
      throw new Error(
        storageValidation.reason ||
          `Limite de armazenamento excedido. Uso atual: ${storageValidation.totalStorageUsedGB.toFixed(2)} GB de ${storageValidation.totalStorageLimitGB} GB`
      );
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/inspection/${id}/upload-foto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Remover foto
  removePhoto: async (id: string, photoUrl: string): Promise<Inspection> => {
    const response = await api.delete(
      `/inspection/${id}/foto/${encodeURIComponent(photoUrl)}`
    );
    return response.data;
  },

  // Solicitar aprovação financeira (endpoint direto da vistoria)
  requestApproval: async (id: string): Promise<{ message: string }> => {
    const response = await api.post(`/inspection/${id}/request-approval`);
    return response.data;
  },

  // Histórico de vistoria
  // Adicionar registro ao histórico
  addHistoryEntry: async (
    inspectionId: string,
    description: string
  ): Promise<InspectionHistoryEntry> => {
    const response = await api.post(`/inspection/${inspectionId}/history`, {
      description,
    });
    return response.data;
  },

  // Listar histórico
  getHistory: async (
    inspectionId: string
  ): Promise<InspectionHistoryEntry[]> => {
    const response = await api.get(`/inspection/${inspectionId}/history`);
    return response.data;
  },

  // Remover registro do histórico
  removeHistoryEntry: async (
    inspectionId: string,
    historyId: string
  ): Promise<void> => {
    await api.delete(`/inspection/${inspectionId}/history/${historyId}`);
  },
};

// Manter compatibilidade com código existente
export const vistoriaApi = inspectionApi;
