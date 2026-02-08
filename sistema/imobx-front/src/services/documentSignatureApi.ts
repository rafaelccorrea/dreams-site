import { api } from './api';
import type {
  DocumentSignature,
  CreateSignatureDto,
  UpdateSignatureDto,
  SignatureStats,
} from '../types/documentSignature';

const BASE_URL = '/documents';

export const documentSignatureApi = {
  /**
   * Criar assinatura
   * POST /documents/:documentId/signatures?companyId={companyId}
   */
  createSignature: async (
    documentId: string,
    data: CreateSignatureDto,
    companyId: string
  ): Promise<DocumentSignature> => {
    const response = await api.post(
      `${BASE_URL}/${documentId}/signatures?companyId=${companyId}`,
      data
    );
    return response.data;
  },

  /**
   * Criar múltiplas assinaturas em lote (RECOMENDADO)
   * POST /documents/:documentId/signatures/batch?companyId={companyId}
   */
  createBatchSignatures: async (
    documentId: string,
    data: {
      signers: Array<{
        clientId?: string;
        userId?: string;
        signerName: string;
        signerEmail: string;
        signerPhone?: string;
        signerCpf?: string;
      }>;
      expiresAt?: string;
      sendEmail?: boolean;
      metadata?: Record<string, any>;
    },
    companyId: string
  ): Promise<{
    signatures: DocumentSignature[];
    assinafyDocumentId?: string;
    total: number;
    success: number;
    errors: Array<{ signer: string; error: string }>;
  }> => {
    const response = await api.post(
      `${BASE_URL}/${documentId}/signatures/batch?companyId=${companyId}`,
      data
    );
    return response.data;
  },

  /**
   * Listar assinaturas de um documento
   * GET /documents/:documentId/signatures?companyId={companyId}
   */
  listSignatures: async (
    documentId: string,
    companyId: string
  ): Promise<DocumentSignature[]> => {
    const response = await api.get(
      `${BASE_URL}/${documentId}/signatures?companyId=${companyId}`
    );
    return response.data;
  },

  /**
   * Obter estatísticas de assinaturas
   * GET /documents/:documentId/signatures/stats?companyId={companyId}
   */
  getStats: async (
    documentId: string,
    companyId: string
  ): Promise<SignatureStats> => {
    const response = await api.get(
      `${BASE_URL}/${documentId}/signatures/stats?companyId=${companyId}`
    );
    return response.data;
  },

  /**
   * Obter assinatura específica
   * GET /documents/:documentId/signatures/:signatureId?companyId={companyId}
   */
  getSignature: async (
    documentId: string,
    signatureId: string,
    companyId: string
  ): Promise<DocumentSignature> => {
    const response = await api.get(
      `${BASE_URL}/${documentId}/signatures/${signatureId}?companyId=${companyId}`
    );
    return response.data;
  },

  /**
   * Atualizar assinatura
   * PUT /documents/:documentId/signatures/:signatureId?companyId={companyId}
   */
  updateSignature: async (
    documentId: string,
    signatureId: string,
    data: UpdateSignatureDto,
    companyId: string
  ): Promise<DocumentSignature> => {
    const response = await api.put(
      `${BASE_URL}/${documentId}/signatures/${signatureId}?companyId=${companyId}`,
      data
    );
    return response.data;
  },

  /**
   * Enviar link por email
   * POST /documents/:documentId/signatures/:signatureId/send-email?companyId={companyId}
   */
  sendSignatureEmail: async (
    documentId: string,
    signatureId: string,
    companyId: string
  ): Promise<{ success: boolean; message: string; signatureUrl?: string }> => {
    const response = await api.post(
      `${BASE_URL}/${documentId}/signatures/${signatureId}/send-email?companyId=${companyId}`
    );
    return response.data;
  },

  /**
   * Reenviar link por email (reutiliza URL existente)
   * POST /documents/:documentId/signatures/:signatureId/resend-email?companyId={companyId}
   */
  resendSignatureEmail: async (
    documentId: string,
    signatureId: string,
    companyId: string
  ): Promise<{ success: boolean; message: string; signatureUrl?: string }> => {
    const response = await api.post(
      `${BASE_URL}/${documentId}/signatures/${signatureId}/resend-email?companyId=${companyId}`
    );
    return response.data;
  },

  /**
   * Marcar como visualizada
   * PUT /documents/:documentId/signatures/:signatureId/viewed?companyId={companyId}
   */
  markAsViewed: async (
    documentId: string,
    signatureId: string,
    companyId: string
  ): Promise<DocumentSignature> => {
    const response = await api.put(
      `${BASE_URL}/${documentId}/signatures/${signatureId}/viewed?companyId=${companyId}`
    );
    return response.data;
  },

  /**
   * Marcar como assinada
   * PUT /documents/:documentId/signatures/:signatureId/signed?companyId={companyId}
   */
  markAsSigned: async (
    documentId: string,
    signatureId: string,
    companyId: string
  ): Promise<DocumentSignature> => {
    const response = await api.put(
      `${BASE_URL}/${documentId}/signatures/${signatureId}/signed?companyId=${companyId}`
    );
    return response.data;
  },

  /**
   * Marcar como rejeitada
   * PUT /documents/:documentId/signatures/:signatureId/rejected?companyId={companyId}
   */
  markAsRejected: async (
    documentId: string,
    signatureId: string,
    companyId: string,
    rejectionReason: string
  ): Promise<DocumentSignature> => {
    const response = await api.put(
      `${BASE_URL}/${documentId}/signatures/${signatureId}/rejected?companyId=${companyId}`,
      { rejectionReason }
    );
    return response.data;
  },

  /**
   * Listar assinaturas por cliente
   * GET /signatures/client/:clientId?companyId={companyId}&status={status}
   */
  listByClient: async (
    clientId: string,
    companyId: string,
    status?: string
  ): Promise<DocumentSignature[]> => {
    const params = new URLSearchParams({ companyId });
    if (status) params.append('status', status);
    const response = await api.get(
      `/signatures/client/${clientId}?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Listar assinaturas pendentes
   * GET /signatures/pending?companyId={companyId}
   */
  listPending: async (companyId: string): Promise<DocumentSignature[]> => {
    const response = await api.get(
      `/signatures/pending?companyId=${companyId}`
    );
    return response.data;
  },

  /**
   * Listar todas as assinaturas (com filtros)
   * GET /signatures?companyId={companyId}&status={status}&documentId={documentId}&clientId={clientId}&userId={userId}&signerEmail={email}&search={search}&expiresBefore={date}&expiresAfter={date}&page={page}&limit={limit}&sortBy={field}&sortOrder={ASC|DESC}
   */
  listAll: async (
    companyId: string,
    filters?: {
      status?: string;
      documentId?: string;
      clientId?: string;
      userId?: string;
      signerEmail?: string;
      search?: string;
      expiresBefore?: string;
      expiresAfter?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    }
  ): Promise<{
    signatures: DocumentSignature[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const params = new URLSearchParams({ companyId });
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.documentId) params.append('documentId', filters.documentId);
      if (filters.clientId) params.append('clientId', filters.clientId);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.signerEmail)
        params.append('signerEmail', filters.signerEmail);
      if (filters.search) params.append('search', filters.search);
      if (filters.expiresBefore)
        params.append('expiresBefore', filters.expiresBefore);
      if (filters.expiresAfter)
        params.append('expiresAfter', filters.expiresAfter);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    }
    const response = await api.get(`/signatures?${params.toString()}`);
    return response.data;
  },
};
