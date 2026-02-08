import { api } from './api';

export interface AssinafyDocument {
  id: string;
  name: string;
  status: string;
  [key: string]: any;
}

export interface AssinafySigner {
  id: string;
  email: string;
  full_name: string;
  [key: string]: any;
}

export interface AssinafyAssignment {
  id: string;
  document_id: string;
  signers: any[];
  summary: {
    signer_count: number;
    completed_count: number;
  };
  [key: string]: any;
}

export interface CreateVirtualAssignmentDto {
  method: 'virtual';
  signer_ids: string[];
  message?: string;
  expires_at?: string;
  copy_receivers?: string[];
}

export interface CreateCollectAssignmentDto {
  method: 'collect';
  entries: Array<{
    page_id: string;
    fields: Array<{
      signer_id: string;
      field_id: string;
      display_settings: {
        left: number;
        top: number;
        fontFamily?: string;
        fontSize?: number;
      };
    }>;
  }>;
  message?: string;
  expires_at?: string;
}

export const assinafyApi = {
  /**
   * Upload de documento
   * POST /assinafy/documents/upload
   */
  uploadDocument: async (file: File): Promise<AssinafyDocument> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/assinafy/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Listar documentos
   * GET /assinafy/documents?status={status}&method={method}&search={search}&sort={sort}&page={page}&perPage={perPage}
   */
  listDocuments: async (params?: {
    status?: string;
    method?: string;
    search?: string;
    sort?: string;
    page?: number;
    perPage?: number;
  }): Promise<{ documents: AssinafyDocument[]; total: number }> => {
    const response = await api.get('/assinafy/documents', { params });
    return response.data;
  },

  /**
   * Obter documento
   * GET /assinafy/documents/:documentId
   */
  getDocument: async (documentId: string): Promise<AssinafyDocument> => {
    const response = await api.get(`/assinafy/documents/${documentId}`);
    return response.data;
  },

  /**
   * Criar signatário
   * POST /assinafy/signers
   */
  createSigner: async (data: {
    full_name: string;
    email: string;
    phone?: string;
    cpf?: string;
  }): Promise<AssinafySigner> => {
    const response = await api.post('/assinafy/signers', data);
    return response.data;
  },

  /**
   * Listar signatários
   * GET /assinafy/signers?search={search}
   */
  listSigners: async (search?: string): Promise<AssinafySigner[]> => {
    const response = await api.get('/assinafy/signers', {
      params: search ? { search } : {},
    });
    return response.data;
  },

  /**
   * Obter signatário
   * GET /assinafy/signers/:signerId
   */
  getSigner: async (signerId: string): Promise<AssinafySigner> => {
    const response = await api.get(`/assinafy/signers/${signerId}`);
    return response.data;
  },

  /**
   * Atualizar signatário
   * PUT /assinafy/signers/:signerId
   */
  updateSigner: async (
    signerId: string,
    data: {
      full_name?: string;
      email?: string;
      phone?: string;
      cpf?: string;
    }
  ): Promise<AssinafySigner> => {
    const response = await api.put(`/assinafy/signers/${signerId}`, data);
    return response.data;
  },

  /**
   * Criar atribuição virtual
   * POST /assinafy/documents/:documentId/assignments/virtual
   */
  createVirtualAssignment: async (
    documentId: string,
    data: CreateVirtualAssignmentDto
  ): Promise<AssinafyAssignment> => {
    const response = await api.post(
      `/assinafy/documents/${documentId}/assignments/virtual`,
      data
    );
    return response.data;
  },

  /**
   * Criar atribuição collect (com campos)
   * POST /assinafy/documents/:documentId/assignments/collect
   */
  createCollectAssignment: async (
    documentId: string,
    data: CreateCollectAssignmentDto
  ): Promise<AssinafyAssignment> => {
    const response = await api.post(
      `/assinafy/documents/${documentId}/assignments/collect`,
      data
    );
    return response.data;
  },

  /**
   * Reenviar assinatura
   * PUT /assinafy/documents/:documentId/assignments/:assignmentId/resend
   */
  resendSignature: async (
    documentId: string,
    assignmentId: string,
    email: string
  ): Promise<void> => {
    await api.put(
      `/assinafy/documents/${documentId}/assignments/${assignmentId}/resend`,
      { email }
    );
  },

  /**
   * Renovar expiração
   * PUT /assinafy/documents/:documentId/assignments/:assignmentId/reset-expiration
   */
  resetExpiration: async (
    documentId: string,
    assignmentId: string,
    expiresAt: string | null
  ): Promise<void> => {
    await api.put(
      `/assinafy/documents/${documentId}/assignments/${assignmentId}/reset-expiration`,
      { expires_at: expiresAt }
    );
  },

  /**
   * Download de documento
   * GET /assinafy/documents/:documentId/download/:artifactName
   */
  downloadDocument: async (
    documentId: string,
    artifactName: string = 'signed'
  ): Promise<Blob> => {
    const response = await api.get(
      `/assinafy/documents/${documentId}/download/${artifactName}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  /**
   * Download de thumbnail
   * GET /assinafy/documents/:documentId/thumbnail
   */
  downloadThumbnail: async (documentId: string): Promise<Blob> => {
    const response = await api.get(
      `/assinafy/documents/${documentId}/thumbnail`,
      { responseType: 'blob' }
    );
    return response.data;
  },
};
