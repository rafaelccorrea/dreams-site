/**
 * API Autentique – integração via backend (proxy).
 * Todos os endpoints exigem JWT no header (usar instância `api` que já adiciona o token).
 * Documentação: https://docs.autentique.com.br/api/
 */

import { api } from './api';

// --- Tipos genéricos (documentos Autentique) ---

export type AutentiqueAction =
  | 'SIGN'
  | 'APPROVE'
  | 'RECOGNIZE'
  | 'SIGN_AS_A_WITNESS';

export interface AutentiqueSignerInput {
  email?: string;
  name?: string;
  action: AutentiqueAction;
}

export interface AutentiqueDocumentInput {
  name: string;
  message?: string;
  refusable?: boolean;
  sortable?: boolean;
  deadline_at?: string; // ISO 8601
  sandbox?: boolean;
}

export interface AutentiqueSignatureLink {
  short_link: string;
}

export interface AutentiqueSignatureResponse {
  public_id: string;
  email?: string;
  name?: string;
  created_at: string;
  action: { name: AutentiqueAction };
  link: AutentiqueSignatureLink | null;
}

export interface AutentiqueDocumentResponse {
  id: string;
  name: string;
  refusable?: boolean;
  sortable?: boolean;
  created_at: string;
  signatures: AutentiqueSignatureResponse[];
}

export interface AutentiqueDocumentListItem {
  id: string;
  name: string;
  refusable?: boolean;
  sortable?: boolean;
  created_at: string;
  signatures: AutentiqueSignatureResponse[];
  files?: { original?: string; signed?: string };
}

export interface ListDocumentsResponse {
  total: number;
  data: AutentiqueDocumentListItem[];
}

// --- Tipos específicos de assinaturas da proposta (ficha de proposta) ---

export interface ProposalSignature {
  id: string;
  proposalId: string;
  autentiqueDocumentId: string;
  autentiqueSignaturePublicId: string;
  signerName: string | null;
  signerEmail: string | null;
  signatureUrl: string | null;
  status: 'pending' | 'viewed' | 'signed' | 'rejected';
  viewedAt: string | null;
  signedAt: string | null;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SendProposalSignaturesPayload {
  signers: AutentiqueSignerInput[];
  document: {
    name: string;
    message?: string;
    refusable?: boolean;
    sortable?: boolean;
    deadline_at?: string;
    sandbox?: boolean;
  };
}

// --- Endpoints genéricos (documentos) ---

/**
 * Criar documento e enviar para assinatura (multipart: file + document + signers).
 */
export async function createDocument(
  file: File,
  document: AutentiqueDocumentInput,
  signers: AutentiqueSignerInput[]
): Promise<AutentiqueDocumentResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document', JSON.stringify(document));
  formData.append('signers', JSON.stringify(signers));

  const { data } = await api.post<AutentiqueDocumentResponse>(
    '/autentique/documents',
    formData
  );
  return data;
}

/**
 * Listar documentos.
 */
export async function listDocuments(params?: {
  limit?: number;
  page?: number;
}): Promise<ListDocumentsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit != null) searchParams.append('limit', String(params.limit));
  if (params?.page != null) searchParams.append('page', String(params.page));
  const query = searchParams.toString();
  const { data } = await api.get<ListDocumentsResponse>(
    `/autentique/documents${query ? `?${query}` : ''}`
  );
  return data;
}

/**
 * Obter um documento por ID.
 */
export async function getDocument(
  documentId: string
): Promise<AutentiqueDocumentListItem> {
  const { data } = await api.get<AutentiqueDocumentListItem>(
    `/autentique/documents/${documentId}`
  );
  return data;
}

/**
 * Gerar link de assinatura (signatário por nome) – endpoint genérico por publicId.
 */
export async function createSignatureLink(
  publicId: string
): Promise<{ short_link: string }> {
  const { data } = await api.post<{ short_link: string }>(
    `/autentique/signatures/${publicId}/link`
  );
  return data;
}

// --- Endpoints de proposta (ficha de proposta → N assinaturas) ---

/**
 * Enviar proposta para assinatura.
 * Gera o PDF da proposta, envia ao Autentique com N signatários e persiste N assinaturas.
 * Uma proposta só pode ser enviada uma vez.
 */
export async function sendProposalForSignature(
  proposalId: string,
  payload: SendProposalSignaturesPayload
): Promise<ProposalSignature[]> {
  const { data } = await api.post<ProposalSignature[]>(
    `/autentique/proposals/${proposalId}/signatures`,
    payload
  );
  return data;
}

/**
 * Listar assinaturas de uma proposta.
 */
export async function listProposalSignatures(
  proposalId: string
): Promise<ProposalSignature[]> {
  const { data } = await api.get<ProposalSignature[]>(
    `/autentique/proposals/${proposalId}/signatures`
  );
  return data;
}

/**
 * Obter uma assinatura da proposta.
 */
export async function getProposalSignature(
  proposalId: string,
  signatureId: string
): Promise<ProposalSignature> {
  const { data } = await api.get<ProposalSignature>(
    `/autentique/proposals/${proposalId}/signatures/${signatureId}`
  );
  return data;
}

/**
 * Gerar link de assinatura para signatário por nome (proposta).
 */
export async function createProposalSignatureLink(
  proposalId: string,
  signatureId: string
): Promise<{ short_link: string }> {
  const { data } = await api.post<{ short_link: string }>(
    `/autentique/proposals/${proposalId}/signatures/${signatureId}/link`
  );
  return data;
}
