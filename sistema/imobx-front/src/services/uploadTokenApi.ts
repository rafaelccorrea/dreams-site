import { api } from './api';
import axios from 'axios';
import type {
  UploadToken,
  CreateUploadTokenDto,
  TokenInfo,
  ValidateCpfRequest,
  ValidateCpfResponse,
  PublicUploadDocumentDto,
  PublicUploadMultipleDto,
  PublicUploadResponse,
  PublicUploadMultipleResponse,
} from '../types/document';

// ===========================
// ROTAS AUTENTICADAS (CORRETOR)
// ===========================

/**
 * Criar link de upload para cliente
 */
export const createUploadToken = async (
  data: CreateUploadTokenDto
): Promise<UploadToken> => {
  const response = await api.post('/documents/upload-tokens', data);
  return response.data;
};

/**
 * Listar links de upload criados pelo corretor
 */
export const listUploadTokens = async (): Promise<UploadToken[]> => {
  const response = await api.get('/documents/upload-tokens');
  return response.data;
};

/**
 * Enviar link por email
 */
export const sendUploadTokenByEmail = async (
  tokenId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(
    `/documents/upload-tokens/${tokenId}/send-email`
  );
  return response.data;
};

/**
 * Revogar link de upload
 */
export const revokeUploadToken = async (
  tokenId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.put(`/documents/upload-tokens/${tokenId}/revoke`);
  return response.data;
};

// ===========================
// ROTAS PÚBLICAS (CLIENTE)
// ===========================

import { API_BASE_URL } from '../config/apiConfig';

// Instância axios sem autenticação para rotas públicas
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Obter informações do link (verificar se é válido)
 */
export const getTokenInfo = async (token: string): Promise<TokenInfo> => {
  const response = await publicApi.get(
    `/public/upload-documents/${token}/info`
  );
  return response.data;
};

/**
 * Validar CPF do cliente
 * POST /public/upload-documents/{token}/validate
 */
export const validateClientCpf = async (
  token: string,
  cpf: string
): Promise<ValidateCpfResponse> => {
  const response = await publicApi.post(
    `/public/upload-documents/${token}/validate`,
    { cpf }
  );
  return response.data;
};

/**
 * Upload de documento único
 */
export const uploadPublicDocument = async (
  token: string,
  data: PublicUploadDocumentDto
): Promise<PublicUploadResponse> => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('cpf', data.cpf);
  formData.append('type', data.type);

  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.notes) formData.append('notes', data.notes);

  const response = await publicApi.post(
    `/public/upload-documents/${token}/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

/**
 * Upload de múltiplos documentos
 */
export const uploadMultiplePublicDocuments = async (
  token: string,
  data: PublicUploadMultipleDto
): Promise<PublicUploadMultipleResponse> => {
  const formData = new FormData();

  // Adicionar múltiplos arquivos
  data.files.forEach(file => {
    formData.append('files', file);
  });

  formData.append('cpf', data.cpf);
  formData.append('type', data.type);

  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.notes) formData.append('notes', data.notes);

  const response = await publicApi.post(
    `/public/upload-documents/${token}/upload-multiple`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

// ===========================
// VALIDAÇÃO DE ARQUIVOS
// ===========================

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB para rotas públicas

const ALLOWED_TYPES = [
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

export const validatePublicFile = (
  file: File
): { valid: boolean; error?: string } => {
  // Verificar tamanho
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Arquivo muito grande: ${file.name}. Tamanho máximo: 10MB`,
    };
  }

  // Verificar tipo
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo não permitido: ${file.name}. Use PDF, DOC, DOCX, XLS, XLSX, imagens ou TXT.`,
    };
  }

  return { valid: true };
};

/**
 * Validar CPF (formato básico)
 */
export const validateCpfFormat = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCpf = cpf.replace(/\D/g, '');
  return cleanCpf.length === 11;
};

/**
 * Formatar CPF (adicionar máscara)
 */
export const formatCpf = (cpf: string): string => {
  const cleanCpf = cpf.replace(/\D/g, '');
  if (cleanCpf.length !== 11) return cpf;

  return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Enviar link via WhatsApp
 */
export const sendViaWhatsApp = (
  phoneNumber: string,
  uploadUrl: string,
  clientName: string,
  expiresAt: string
) => {
  // Remover caracteres não numéricos
  const cleanPhone = phoneNumber.replace(/\D/g, '');

  // Código do país (55 para Brasil)
  const phone = `55${cleanPhone}`;

  // Mensagem formatada
  const message = `
Olá! 👋

Preparei um link seguro para você enviar seus documentos:

🔗 ${uploadUrl}

ℹ️ Instruções:
- Acesse o link
- Informe seu CPF quando solicitado
- Faça upload dos documentos
- Link válido até: ${new Date(expiresAt).toLocaleDateString('pt-BR')}

Precisa de ajuda? Entre em contato!
  `.trim();

  // Encode da mensagem
  const encodedMessage = encodeURIComponent(message);

  // URL do WhatsApp Web
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;

  // Abrir em nova janela
  window.open(url, '_blank');
};

/**
 * Copiar para área de transferência
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Erro ao copiar para área de transferência:', error);
    return false;
  }
};
