import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

/**
 * API pública para Ficha de Proposta de Compra
 * Esta API não requer autenticação
 */

// Instância do axios sem interceptors de autenticação
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Tipos baseados na documentação da API
export interface ProponenteDto {
  nome: string;
  rg: string;
  cpf: string; // 11 dígitos, apenas números
  nacionalidade: string;
  estadoCivil: string;
  regimeCasamento?: string; // Opcional
  dataNascimento: string; // YYYY-MM-DD
  profissao?: string; // Opcional
  email: string; // Email válido
  telefone: string; // 10 ou 11 dígitos (com DDD)
  residenciaAtual: string;
  bairro: string;
  cep: string; // 8 dígitos, apenas números
  cidade: string;
  estado: string; // 2 letras maiúsculas
}

export interface ProponenteConjugeDto {
  nome: string;
  rg: string;
  cpf: string; // 11 dígitos, apenas números
  profissao?: string; // Opcional
  email: string;
  telefone: string; // 10 ou 11 dígitos (com DDD)
}

export interface ImovelDto {
  matricula: string;
  cartorio: string;
  cadastroPrefeitura?: string; // Opcional
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string; // 2 letras maiúsculas
}

export interface ProprietarioDto {
  nome: string;
  rg: string;
  cpf: string; // 11 dígitos, apenas números
  nacionalidade: string;
  estadoCivil: string;
  regimeCasamento?: string; // Opcional
  dataNascimento: string; // YYYY-MM-DD
  profissao?: string; // Opcional
  email: string; // Email válido
  telefone: string; // 10 ou 11 dígitos (com DDD)
  residenciaAtual: string;
  bairro: string;
}

export interface ProprietarioConjugeDto {
  nome: string;
  rg: string;
  cpf: string; // 11 dígitos, apenas números
  profissao?: string; // Opcional
  email: string;
  telefone: string; // 10 ou 11 dígitos (com DDD)
}

export interface PropostaDto {
  dataProposta: string; // YYYY-MM-DD
  prazoValidade: number; // Dias úteis (mínimo: 1)
  precoProposto: number; // Valor em reais (sem formatação)
  condicoesPagamento: string; // Texto livre
  valorSinal?: number; // Valor do sinal/arras (sem formatação) - OPCIONAL
  prazoPagamentoSinal?: number; // Dias úteis (mínimo: 1) - OPCIONAL
  porcentagemComissao: number; // 0-100
  prazoEntrega: number; // Dias úteis (mínimo: 1)
  multaMensal: number; // Multa mensal por atraso (sem formatação)
  unidadeVenda: string; // "Uniao Esmeralda" ou "Uniao Rio Branco" (sem acentos)
  unidadeCaptacao: string; // "Uniao Esmeralda" ou "Uniao Rio Branco" (sem acentos)
}

export interface CorretorDto {
  id: string; // ID ou nome do corretor
  nome: string; // Nome do corretor
  email: string; // Email do corretor
  unidade?: string; // Unidade do corretor (opcional - será buscada automaticamente se não fornecida)
}

export interface CaptadorDto {
  id: string; // ID ou nome do captador
  nome: string; // Nome do captador
  unidade?: string; // Unidade do captador (opcional - será buscada automaticamente se não fornecida)
  porcentagem?: number; // Porcentagem do captador (0-100, opcional)
}

export interface CreatePurchaseProposalDto {
  proposta: PropostaDto;
  proponente: ProponenteDto;
  proponenteConjuge?: ProponenteConjugeDto | null;
  imovel: ImovelDto;
  proprietario: ProprietarioDto;
  proprietarioConjuge?: ProprietarioConjugeDto | null;
  corretores?: CorretorDto[]; // Até 3 corretores (opcional)
  captadores?: CaptadorDto[]; // Até 3 captadores (opcional)
  /** Opcional; default no backend: 'rascunho' */
  status?: 'rascunho' | 'disponivel';
}

export interface CreateProposalResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    numero: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ExtractedProposalDataDto {
  success: boolean;
  message: string;
  data: Partial<CreatePurchaseProposalDto>;
  confidence: number;
  rawText: string;
  missingFields: string[];
}

/** Status da proposta na listagem (conforme doc FRONTEND_AJUSTES_STATUS_VISIBILIDADE_FICHA_PROPOSTA) */
export type PropostaStatus = 'rascunho' | 'disponivel';

export interface PropostaListItem {
  id: string;
  numero: string;
  dataProposta: string;
  precoProposto: number;
  createdAt: string;
  updatedAt: string;
  /** Status da proposta: rascunho | disponivel (sempre presente na listagem/detalhe) */
  status?: PropostaStatus;
  proponente?: {
    nome: string;
    cpf: string;
    email?: string;
  };
  imovel?: {
    endereco: string;
    cidade: string;
    estado: string;
  };
  corretores?: Array<{
    id: string;
    nome: string;
    email: string;
    unidade?: string;
  }>;
  captadores?: Array<{
    id: string;
    nome: string;
    unidade?: string;
    porcentagem?: number;
  }>;
}

export interface ListProposalsFilters {
  /** CPF do corretor – lista só propostas vinculadas a ele (um dos dois é obrigatório) */
  corretorCpf?: string;
  /** CPF do gestor – lista só propostas da equipe (um dos dois é obrigatório; se ambos, API usa gestorCpf) */
  gestorCpf?: string;
  page?: number;
  limit?: number;
  /** Filtrar por status: rascunho | disponivel */
  status?: PropostaStatus | string;
  dataInicio?: string; // YYYY-MM-DD
  dataFim?: string; // YYYY-MM-DD
  search?: string;
}

export interface ListProposalsResponse {
  success: boolean;
  message?: string;
  data: {
    propostas: PropostaListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  error?: string; // Apenas em desenvolvimento
}

/**
 * Cria uma nova ficha de proposta de compra
 * @param dados - Dados da proposta formatados conforme a API
 * @returns Resposta da API com os dados da proposta criada
 * @throws ApiError em caso de erro de validação ou servidor
 */
export const criarFichaProposta = async (
  dados: CreatePurchaseProposalDto
): Promise<CreateProposalResponse> => {
  try {
    const response = await publicApi.post<any>('/api/ficha-proposta', dados);

    const data = response.data;
    // API pode retornar { success, data: { id, numero, ... } } ou { success, data: { propostas: [...] } }
    const id = data?.data?.id ?? data?.id;
    const propostas = data?.data?.propostas ?? data?.propostas;
    const firstProposta =
      Array.isArray(propostas) && propostas.length > 0 ? propostas[0] : null;
    const resolvedId = id ?? firstProposta?.id;
    const numero =
      data?.data?.numero ?? data?.numero ?? firstProposta?.numero ?? '';
    const createdAt =
      data?.data?.createdAt ??
      data?.createdAt ??
      firstProposta?.createdAt ??
      new Date().toISOString();
    const updatedAt =
      data?.data?.updatedAt ??
      data?.updatedAt ??
      firstProposta?.updatedAt ??
      createdAt;

    if (!resolvedId) {
      console.warn(
        'Resposta da API de criação não trouxe id da proposta:',
        data
      );
    }

    return {
      success: data?.success ?? true,
      message: data?.message ?? 'Proposta criada com sucesso.',
      data: {
        id: resolvedId ?? '',
        numero: numero ?? '',
        createdAt,
        updatedAt,
      },
    };
  } catch (error: any) {
    // Tratar erros da API
    if (error.response) {
      // Erro do servidor (400, 500, etc)
      const apiError: ApiError = error.response.data;
      throw apiError;
    }
    // Erro de rede ou outro erro
    throw {
      success: false,
      message: error.message || 'Erro ao conectar com o servidor',
    } as ApiError;
  }
};

/**
 * Lista propostas de compra (corretor vê só as suas, gestor vê só da equipe)
 * Um dos dois é obrigatório: corretorCpf ou gestorCpf. Se ambos, a API usa gestorCpf.
 */
export const listarPropostas = async (
  filters: ListProposalsFilters
): Promise<ListProposalsResponse> => {
  try {
    const corretorCpf = filters.corretorCpf?.replace(/\D/g, '') || '';
    const gestorCpf = filters.gestorCpf?.replace(/\D/g, '') || '';
    if (!gestorCpf && !corretorCpf) {
      throw {
        success: false,
        message: 'Informe corretorCpf (corretor) ou gestorCpf (gestor)',
      } as ApiError;
    }

    const params = new URLSearchParams();
    if (gestorCpf) params.append('gestorCpf', gestorCpf);
    else params.append('corretorCpf', corretorCpf);

    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.status) params.append('status', filters.status);
    if (filters.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters.dataFim) params.append('dataFim', filters.dataFim);
    if (filters.search) params.append('search', filters.search);
    if (!filters.page) params.append('page', '1');
    if (!filters.limit) params.append('limit', '50');

    const response = await publicApi.get<ListProposalsResponse>(
      `/api/ficha-proposta?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data as ApiError;
    }
    throw {
      success: false,
      message: error.message || 'Erro ao conectar com o servidor',
    } as ApiError;
  }
};

/**
 * Busca uma proposta por ID (exige corretorCpf ou gestorCpf para vínculo).
 * Aceita resposta direta (PropostaListItem) ou wrapper ({ success, data }).
 */
export const buscarPropostaPorId = async (
  id: string,
  cpfParam: { corretorCpf?: string; gestorCpf?: string }
): Promise<{ success: boolean; data: PropostaListItem }> => {
  try {
    const idTrim = (id ?? '').toString().trim();
    if (!idTrim || idTrim === 'undefined' || idTrim === 'null') {
      throw {
        success: false,
        message:
          'ID da proposta é obrigatório. Verifique se o link ou o parâmetro foi informado corretamente.',
      } as ApiError;
    }
    const corretorCpf = cpfParam.corretorCpf?.replace(/\D/g, '') || '';
    const gestorCpf = cpfParam.gestorCpf?.replace(/\D/g, '') || '';
    if (!gestorCpf && !corretorCpf) {
      throw {
        success: false,
        message: 'Informe corretorCpf ou gestorCpf para acessar a proposta',
      } as ApiError;
    }
    const param = gestorCpf
      ? `gestorCpf=${gestorCpf}`
      : `corretorCpf=${corretorCpf}`;
    const response = await publicApi.get<any>(
      `/api/ficha-proposta/${idTrim}?${param}`
    );

    // Se a resposta já tem { success, data }, retornar como está
    if (
      response.data &&
      typeof response.data === 'object' &&
      'success' in response.data &&
      'data' in response.data
    ) {
      return response.data as { success: boolean; data: PropostaListItem };
    }

    // Se a resposta é o objeto direto da proposta, wrappar
    if (
      response.data &&
      typeof response.data === 'object' &&
      'id' in response.data
    ) {
      return { success: true, data: response.data as PropostaListItem };
    }

    // Fallback: tentar response.data.data ou response.data
    const data = (response.data as any)?.data || response.data;
    if (data && typeof data === 'object' && 'id' in data) {
      return { success: true, data: data as PropostaListItem };
    }

    throw {
      success: false,
      message: 'Resposta da API em formato inesperado',
    } as ApiError;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw {
        ...(error.response?.data || {}),
        statusCode: 403,
        message:
          error.response?.data?.message ||
          'Acesso negado. Somente corretores, captadores ou gestores vinculados à proposta podem acessar.',
      };
    }
    if (error.response) {
      const apiError = error.response.data as ApiError;
      throw apiError;
    }
    throw {
      success: false,
      message: error.message || 'Erro ao conectar com o servidor',
    } as ApiError;
  }
};

/**
 * Retorna a URL para download do PDF da proposta (exige CPF do corretor ou gestor)
 */
export const getUrlPdfProposta = (
  propostaId: string,
  userCpf: string,
  userTipo: 'gestor' | 'corretor'
): string => {
  const cpf = userCpf.replace(/\D/g, '');
  const param =
    userTipo === 'gestor' ? `gestorCpf=${cpf}` : `corretorCpf=${cpf}`;
  return `${API_BASE_URL}/api/ficha-proposta/${propostaId}/pdf?${param}`;
};

/**
 * Lista propostas por ID do corretor
 * @param corretorId - ID do corretor (UUID)
 * @param filters - Filtros opcionais adicionais
 * @returns Lista de propostas do corretor
 * @throws ApiError em caso de erro
 */
export const listarPropostasPorCorretorId = async (
  corretorId: string,
  filters: Omit<ListProposalsFilters, 'corretorCpf'> = {}
): Promise<ListProposalsResponse> => {
  try {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.status) params.append('status', filters.status);
    if (filters.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters.dataFim) params.append('dataFim', filters.dataFim);
    if (filters.search) params.append('search', filters.search);

    // Valores padrão se não fornecidos
    if (!filters.page) params.append('page', '1');
    if (!filters.limit) params.append('limit', '50');

    const queryString = params.toString();
    const url = `/api/ficha-proposta/corretor/${corretorId}${queryString ? `?${queryString}` : ''}`;

    const response = await publicApi.get<ListProposalsResponse>(url);

    return response.data;
  } catch (error: any) {
    if (error.response) {
      const apiError: ApiError = error.response.data;
      throw apiError;
    }
    throw {
      success: false,
      message: error.message || 'Erro ao conectar com o servidor',
    } as ApiError;
  }
};

/**
 * Lista propostas por CPF do corretor
 * @param cpf - CPF do corretor (com ou sem formatação)
 * @param filters - Filtros opcionais adicionais
 * @returns Lista de propostas do corretor
 * @throws ApiError em caso de erro
 */
export const listarPropostasPorCorretorCpf = async (
  cpf: string,
  filters: Omit<ListProposalsFilters, 'corretorCpf'> = {}
): Promise<ListProposalsResponse> => {
  try {
    // Remover formatação do CPF se houver
    const cpfLimpo = cpf.replace(/\D/g, '');

    const params = new URLSearchParams();

    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.status) params.append('status', filters.status);
    if (filters.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters.dataFim) params.append('dataFim', filters.dataFim);
    if (filters.search) params.append('search', filters.search);

    // Valores padrão se não fornecidos
    if (!filters.page) params.append('page', '1');
    if (!filters.limit) params.append('limit', '50');

    const queryString = params.toString();
    const url = `/api/ficha-proposta/corretor/cpf/${cpfLimpo}${queryString ? `?${queryString}` : ''}`;

    const response = await publicApi.get<ListProposalsResponse>(url);

    return response.data;
  } catch (error: any) {
    if (error.response) {
      const apiError: ApiError = error.response.data;
      throw apiError;
    }
    throw {
      success: false,
      message: error.message || 'Erro ao conectar com o servidor',
    } as ApiError;
  }
};

/**
 * Extrai dados de imagens da ficha de proposta usando OCR/IA
 * @param files - Array de arquivos de imagem (JPEG, PNG, WEBP) - máximo 2 imagens
 * @returns Dados extraídos das imagens
 * @throws ApiError em caso de erro
 */
export const extrairDadosDaImagem = async (
  files: File[]
): Promise<ExtractedProposalDataDto> => {
  try {
    // Validar quantidade de imagens
    if (files.length === 0) {
      throw {
        success: false,
        message: 'Nenhuma imagem fornecida',
      } as ApiError;
    }

    if (files.length > 2) {
      throw {
        success: false,
        message: 'Máximo de 2 imagens permitidas',
      } as ApiError;
    }

    const formData = new FormData();

    // Adicionar todas as imagens (até 2)
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await publicApi.post<ExtractedProposalDataDto>(
      '/api/ficha-proposta/extract-from-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    // Tratar erros da API
    if (error.response) {
      // Erro do servidor (400, 500, etc)
      const apiError: ApiError = error.response.data;
      throw apiError;
    }
    // Erro de rede ou outro erro
    throw {
      success: false,
      message: error.message || 'Erro ao processar imagem',
    } as ApiError;
  }
};

// --- Assinaturas (Autentique) – API aberta com corretorCpf/gestorCpf ---

export type AssinaturaAction =
  | 'SIGN'
  | 'APPROVE'
  | 'RECOGNIZE'
  | 'SIGN_AS_A_WITNESS';

export interface AssinaturaSignerInput {
  email?: string;
  name?: string;
  action: AssinaturaAction;
}

export interface ProposalSignature {
  id: string;
  proposalId: string;
  autentiqueDocumentId?: string;
  autentiqueSignaturePublicId?: string;
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
  signers: AssinaturaSignerInput[];
  document: {
    name: string;
    message?: string;
    refusable?: boolean;
    sortable?: boolean;
    deadline_at?: string;
    sandbox?: boolean;
  };
}

function buildAssinaturasCpfParam(
  userCpf: string,
  userTipo: 'gestor' | 'corretor'
): string {
  const cpf = userCpf.replace(/\D/g, '');
  return userTipo === 'gestor' ? `gestorCpf=${cpf}` : `corretorCpf=${cpf}`;
}

/**
 * Enviar proposta para assinatura (API aberta – corretorCpf ou gestorCpf na query).
 * Uma proposta só pode ser enviada uma vez.
 */
export const enviarPropostaParaAssinatura = async (
  propostaId: string,
  userCpf: string,
  userTipo: 'gestor' | 'corretor',
  payload: SendProposalSignaturesPayload
): Promise<ProposalSignature[]> => {
  try {
    const query = buildAssinaturasCpfParam(userCpf, userTipo);
    const response = await publicApi.post<ProposalSignature[]>(
      `/api/ficha-proposta/${propostaId}/assinaturas?${query}`,
      payload
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    if (error.response?.data) throw error.response.data as ApiError;
    throw {
      success: false,
      message: error.message || 'Erro ao enviar para assinatura.',
    } as ApiError;
  }
};

/**
 * Listar assinaturas da proposta (API aberta – corretorCpf ou gestorCpf na query).
 */
export const listarAssinaturasProposta = async (
  propostaId: string,
  userCpf: string,
  userTipo: 'gestor' | 'corretor'
): Promise<ProposalSignature[]> => {
  try {
    const query = buildAssinaturasCpfParam(userCpf, userTipo);
    const response = await publicApi.get<ProposalSignature[]>(
      `/api/ficha-proposta/${propostaId}/assinaturas?${query}`
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    if (error.response?.data) throw error.response.data as ApiError;
    throw {
      success: false,
      message: error.message || 'Erro ao carregar assinaturas.',
    } as ApiError;
  }
};

/**
 * Obter uma assinatura da proposta (API aberta).
 */
export const buscarAssinaturaProposta = async (
  propostaId: string,
  signatureId: string,
  userCpf: string,
  userTipo: 'gestor' | 'corretor'
): Promise<ProposalSignature> => {
  try {
    const query = buildAssinaturasCpfParam(userCpf, userTipo);
    const response = await publicApi.get<ProposalSignature>(
      `/api/ficha-proposta/${propostaId}/assinaturas/${signatureId}?${query}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) throw error.response.data as ApiError;
    throw {
      success: false,
      message: error.message || 'Erro ao buscar assinatura.',
    } as ApiError;
  }
};

/**
 * Obter link de assinatura para enviar ao signatário (API aberta).
 * Retorna short_link – envie apenas à pessoa que deve assinar (um link por signatário).
 */
export const obterLinkAssinaturaProposta = async (
  propostaId: string,
  signatureId: string,
  userCpf: string,
  userTipo: 'gestor' | 'corretor'
): Promise<{ short_link: string }> => {
  try {
    const query = buildAssinaturasCpfParam(userCpf, userTipo);
    const response = await publicApi.post<{ short_link: string }>(
      `/api/ficha-proposta/${propostaId}/assinaturas/${signatureId}/link?${query}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) throw error.response.data as ApiError;
    throw {
      success: false,
      message: error.message || 'Erro ao obter link.',
    } as ApiError;
  }
};

/**
 * Reenvia o PDF da proposta por email para os endereços informados.
 * Requer gestorCpf ou corretorCpf (mesma regra do GET PDF).
 * POST /api/ficha-proposta/:id/reenviar-email?gestorCpf=... ou ?corretorCpf=...
 */
export const reenviarEmailProposta = async (
  propostaId: string,
  gestorCpf: string | undefined,
  corretorCpf: string | undefined,
  emails: string[]
): Promise<{ success: boolean; message: string }> => {
  if (!gestorCpf?.trim() && !corretorCpf?.trim()) {
    throw {
      success: false,
      message: 'Informe gestorCpf ou corretorCpf para reenviar o email',
    } as ApiError;
  }
  const params = new URLSearchParams();
  if (gestorCpf?.trim()) params.append('gestorCpf', gestorCpf.trim().replace(/\D/g, ''));
  if (corretorCpf?.trim()) params.append('corretorCpf', corretorCpf.trim().replace(/\D/g, ''));
  const response = await publicApi.post<{ success: boolean; message: string }>(
    `/api/ficha-proposta/${propostaId}/reenviar-email?${params.toString()}`,
    { emails }
  );
  return response.data;
};
