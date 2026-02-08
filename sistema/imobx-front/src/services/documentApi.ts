import { api } from './api';
import type {
  DocumentModel,
  DocumentWithDetails,
  UploadDocumentDto,
  UpdateDocumentDto,
  ListDocumentsParams,
  DocumentListResponse,
} from '../types/document';
import type { DocumentFilters } from '../types/filters';
import { validateStorageBeforeUpload } from '../utils/storageValidation';

const DOCUMENTS_BASE_URL = '/documents';

/**
 * Valida o arquivo antes do upload
 */
export const validateFile = (
  file: File
): { valid: boolean; error?: string } => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain',
  ];

  const maxSize = 50 * 1024 * 1024; // 50MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de arquivo não permitido! Use PDF, DOC, XLS ou imagens.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Arquivo muito grande! Tamanho máximo: 50MB',
    };
  }

  return { valid: true };
};

/**
 * Valida o vínculo do documento (deve ter clientId OU propertyId)
 */
export const validateBinding = (
  clientId?: string,
  propertyId?: string
): boolean => {
  return (!!clientId && !propertyId) || (!clientId && !!propertyId);
};

/**
 * Faz upload de um documento
 */
export const uploadDocument = async (
  data: UploadDocumentDto
): Promise<DocumentModel> => {
  const validation = validateFile(data.file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  if (!validateBinding(data.clientId, data.propertyId)) {
    throw new Error(
      'O documento deve estar vinculado a um cliente OU uma propriedade (não ambos).'
    );
  }

  // Validar armazenamento antes de fazer upload
  const storageValidation = await validateStorageBeforeUpload(
    data.file.size,
    false
  );
  if (!storageValidation.canUpload) {
    throw new Error(
      storageValidation.reason ||
        `Limite de armazenamento excedido. Uso atual: ${storageValidation.totalStorageUsedGB.toFixed(2)} GB de ${storageValidation.totalStorageLimitGB} GB`
    );
  }

  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('type', data.type);

  if (data.clientId) formData.append('clientId', data.clientId);
  if (data.propertyId) formData.append('propertyId', data.propertyId);
  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.tags && data.tags.length > 0)
    formData.append('tags', JSON.stringify(data.tags));
  if (data.notes) formData.append('notes', data.notes);
  if (data.expiryDate) formData.append('expiryDate', data.expiryDate);
  if (data.isEncrypted) formData.append('isEncrypted', 'true');

  const response = await api.post(`${DOCUMENTS_BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Lista documentos com filtros
 */
export const listDocuments = async (
  params: DocumentFilters = {}
): Promise<DocumentListResponse> => {
  const response = await api.get(DOCUMENTS_BASE_URL, { params });
  return response.data;
};

/**
 * Busca documentos por cliente
 */
export const fetchClientDocuments = async (
  clientId: string,
  page = 1,
  limit = 20
): Promise<DocumentListResponse> => {
  const response = await api.get(`${DOCUMENTS_BASE_URL}/client/${clientId}`, {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Busca documentos por propriedade
 */
export const fetchPropertyDocuments = async (
  propertyId: string,
  page = 1,
  limit = 20
): Promise<DocumentListResponse> => {
  const response = await api.get(
    `${DOCUMENTS_BASE_URL}/property/${propertyId}`,
    {
      params: { page, limit },
    }
  );
  return response.data;
};

/**
 * Busca documentos que estão vencendo
 */
export const fetchExpiringDocuments = async (
  days = 30
): Promise<DocumentModel[]> => {
  const response = await api.get(`${DOCUMENTS_BASE_URL}/expiring/${days}`);
  return response.data;
};

/**
 * Busca um documento por ID com detalhes completos (incluindo vínculos)
 */
export const fetchDocumentById = async (
  id: string
): Promise<DocumentWithDetails> => {
  const response = await api.get(`${DOCUMENTS_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Atualiza um documento
 */
export const updateDocument = async (
  id: string,
  data: UpdateDocumentDto
): Promise<DocumentModel> => {
  const response = await api.put(`${DOCUMENTS_BASE_URL}/${id}`, data);
  return response.data;
};

/**
 * Aprova ou rejeita um documento
 */
export const approveDocument = async (
  id: string,
  status: 'approved' | 'rejected'
): Promise<DocumentModel> => {
  const response = await api.put(`${DOCUMENTS_BASE_URL}/${id}/approve`, {
    status,
  });
  return response.data;
};

/**
 * Deleta documentos (suporta múltiplos IDs)
 */
export const deleteDocuments = async (documentIds: string[]): Promise<void> => {
  await api.delete(DOCUMENTS_BASE_URL, {
    data: { documentIds },
  });
};

/**
 * Trata erros da API de documentos
 */
export const handleDocumentError = (error: any): string => {
  if (error.response?.status === 403) {
    if (error.response.data.message?.includes('plano')) {
      return 'Este módulo está disponível apenas no plano PRO. Faça upgrade!';
    }
    return 'Você não tem permissão para realizar esta ação.';
  }

  if (error.response?.status === 400) {
    return error.response.data.message || 'Dados inválidos.';
  }

  if (error.response?.status === 404) {
    return 'Documento, cliente ou propriedade não encontrado.';
  }

  return error.message || 'Erro ao processar requisição.';
};
