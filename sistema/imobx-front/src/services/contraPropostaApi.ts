import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

/** Parâmetros de acesso (corretor ou gestor) para rotas de assinatura/PDF */
export type ContraPropostaAccessParams = {
  corretorCpf?: string;
  gestorCpf?: string;
};

/** Status da assinatura no Autentique */
export type CounterProposalSignatureStatus =
  | 'pending'
  | 'viewed'
  | 'signed'
  | 'rejected'
  | 'expired'
  | 'cancelled';

/** Assinatura da contra proposta (Autentique) */
export interface CounterProposalSignatureItem {
  id: string;
  counterProposalId: string;
  autentiqueDocumentId?: string;
  autentiqueSignaturePublicId?: string;
  status: CounterProposalSignatureStatus;
  signerName?: string;
  signerEmail?: string;
  viewedAt?: string;
  signedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  expiresAt?: string;
  signatureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** Signatário para envio (email ou name + action) */
export interface ContraPropostaSignerInput {
  email?: string;
  name?: string;
  action?: 'SIGN' | 'APPROVE' | 'RECOGNIZE' | 'SIGN_AS_A_WITNESS';
}

function buildContraPropostaAccessQuery(
  params?: ContraPropostaAccessParams
): string {
  if (!params?.corretorCpf && !params?.gestorCpf) return '';
  const search = new URLSearchParams();
  if (params.corretorCpf)
    search.set('corretorCpf', params.corretorCpf.replace(/\D/g, ''));
  if (params.gestorCpf)
    search.set('gestorCpf', params.gestorCpf.replace(/\D/g, ''));
  return search.toString();
}

export interface CreateContraPropostaDto {
  proposalId: string;
  sellerName: string;
  corretorName: string;
  corretorCpf?: string;
  proposedPrice: number;
  downPayment?: number;
  paymentConditions?: string;
  createdByType: 'corretor' | 'gestor' | 'cliente';
  createdByCpf?: string;
  /** E-mail do destinatário para envio e assinatura (ex.: Authentique) */
  recipientEmail?: string;
}

export type ContraPropostaStatus = 'pendente' | 'aprovada' | 'recusada';

export interface ContraPropostaItem {
  id: string;
  proposalId: string;
  sellerName: string;
  corretorName: string;
  corretorCpf?: string;
  proposedPrice: number;
  downPayment?: number;
  paymentConditions?: string;
  createdByType: 'corretor' | 'gestor' | 'cliente';
  createdByCpf?: string;
  recipientEmail?: string;
  /** Status: pendente, aprovada ou recusada */
  status?: ContraPropostaStatus;
  respondedAt?: string;
  respondedByCpf?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContraPropostaResponse {
  success: boolean;
  message: string;
  data: ContraPropostaItem;
}

export interface ListContraPropostasResponse {
  success: boolean;
  data: ContraPropostaItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Cria uma contra proposta a partir de uma proposta de compra.
 * Opcional: corretorCpf ou gestorCpf para validar acesso à proposta.
 */
export const criarContraProposta = async (
  dto: CreateContraPropostaDto,
  params?: { corretorCpf?: string; gestorCpf?: string }
): Promise<CreateContraPropostaResponse> => {
  const search = new URLSearchParams();
  if (params?.corretorCpf)
    search.set('corretorCpf', params.corretorCpf.replace(/\D/g, ''));
  if (params?.gestorCpf)
    search.set('gestorCpf', params.gestorCpf.replace(/\D/g, ''));
  const query = search.toString();
  const url = `/api/contra-proposta${query ? `?${query}` : ''}`;
  const response = await publicApi.post<CreateContraPropostaResponse>(url, dto);
  return response.data;
};

/**
 * Lista contra propostas de uma proposta (mais recentes primeiro). Paginação: page (1-based), limit (default 5).
 */
export const listarContraPropostas = async (
  proposalId: string,
  params?: {
    corretorCpf?: string;
    gestorCpf?: string;
    page?: number;
    limit?: number;
  }
): Promise<ListContraPropostasResponse> => {
  const search = new URLSearchParams({ proposalId });
  if (params?.corretorCpf)
    search.set('corretorCpf', params.corretorCpf.replace(/\D/g, ''));
  if (params?.gestorCpf)
    search.set('gestorCpf', params.gestorCpf.replace(/\D/g, ''));
  if (params?.page != null) search.set('page', String(params.page));
  if (params?.limit != null) search.set('limit', String(params.limit));
  const response = await publicApi.get<ListContraPropostasResponse>(
    `/api/contra-proposta?${search.toString()}`
  );
  const data = response.data;
  return {
    success: data?.success ?? true,
    data: data?.data ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? 5,
    totalPages: data?.totalPages ?? 1,
  };
};

/**
 * Atualiza o status da contra proposta para aprovada ou recusada.
 */
export const atualizarStatusContraProposta = async (
  id: string,
  status: 'aprovada' | 'recusada',
  params?: { corretorCpf?: string; gestorCpf?: string }
): Promise<CreateContraPropostaResponse> => {
  const search = new URLSearchParams();
  if (params?.corretorCpf)
    search.set('corretorCpf', params.corretorCpf.replace(/\D/g, ''));
  if (params?.gestorCpf)
    search.set('gestorCpf', params.gestorCpf.replace(/\D/g, ''));
  const query = search.toString();
  const url = `/api/contra-proposta/${id}/status${query ? `?${query}` : ''}`;
  const response = await publicApi.patch<CreateContraPropostaResponse>(url, {
    status,
  });
  return response.data;
};

/**
 * Exclui uma contra proposta. Só é permitido se não houver assinaturas já realizadas.
 */
export const excluirContraProposta = async (
  id: string,
  params?: { corretorCpf?: string; gestorCpf?: string }
): Promise<{ success: true; message: string }> => {
  const search = new URLSearchParams();
  if (params?.corretorCpf)
    search.set('corretorCpf', params.corretorCpf.replace(/\D/g, ''));
  if (params?.gestorCpf)
    search.set('gestorCpf', params.gestorCpf.replace(/\D/g, ''));
  const query = search.toString();
  const url = `/api/contra-proposta/${id}${query ? `?${query}` : ''}`;
  const response = await publicApi.delete<{ success: true; message: string }>(
    url
  );
  return response.data;
};

/**
 * Retorna a URL para download/visualização do PDF da contra proposta.
 */
export const getUrlPdfContraProposta = (
  contraPropostaId: string,
  params: ContraPropostaAccessParams
): string => {
  const query = buildContraPropostaAccessQuery(params);
  return `${API_BASE_URL}/api/contra-proposta/${contraPropostaId}/pdf${query ? `?${query}` : ''}`;
};

/**
 * Envia a contra proposta para assinatura no Autentique (gera PDF e cria documento).
 * Só pode ser enviada uma vez por contra proposta.
 */
export const enviarParaAssinaturaContraProposta = async (
  contraPropostaId: string,
  payload: {
    signers: ContraPropostaSignerInput[];
    document?: { name?: string; message?: string };
  },
  params?: ContraPropostaAccessParams
): Promise<CounterProposalSignatureItem[]> => {
  const query = buildContraPropostaAccessQuery(params);
  const url = `/api/contra-proposta/${contraPropostaId}/assinaturas${query ? `?${query}` : ''}`;
  const signers = payload.signers.map(s => ({
    ...s,
    action: s.action || 'SIGN',
  }));
  const response = await publicApi.post<CounterProposalSignatureItem[]>(url, {
    signers,
    document: payload.document,
  });
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Lista assinaturas da contra proposta.
 */
export const listarAssinaturasContraProposta = async (
  contraPropostaId: string,
  params?: ContraPropostaAccessParams
): Promise<CounterProposalSignatureItem[]> => {
  const query = buildContraPropostaAccessQuery(params);
  const url = `/api/contra-proposta/${contraPropostaId}/assinaturas${query ? `?${query}` : ''}`;
  const response = await publicApi.get<CounterProposalSignatureItem[]>(url);
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Obtém link de assinatura para enviar ao signatário (um link por signatário).
 */
export const obterLinkAssinaturaContraProposta = async (
  contraPropostaId: string,
  signatureId: string,
  params?: ContraPropostaAccessParams
): Promise<{ short_link: string }> => {
  const query = buildContraPropostaAccessQuery(params);
  const url = `/api/contra-proposta/${contraPropostaId}/assinaturas/${signatureId}/link${query ? `?${query}` : ''}`;
  const response = await publicApi.post<{ short_link: string }>(url);
  return response.data;
};
