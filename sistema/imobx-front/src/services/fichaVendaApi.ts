import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

/**
 * API pública para Ficha de Venda
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

// Status da ficha (e proposta) – ver FRONTEND_AJUSTES_STATUS_VISIBILIDADE
export type StatusFichaProposta = 'rascunho' | 'disponivel';

// Tipos baseados na documentação da API
export interface EnderecoDto {
  cep: string; // 8 dígitos, apenas números
  rua: string;
  numero: string; // Aceita "S/N" para sem número
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string; // 2 letras maiúsculas (ex: SP, RJ)
}

export interface PessoaDto {
  nome: string;
  cpf: string; // 11 dígitos, apenas números
  rg?: string; // RG (opcional; documentação API não exige)
  dataNascimento: string; // YYYY-MM-DD
  email: string;
  celular: string; // 11 dígitos, apenas números
  profissao?: string;
  endereco: EnderecoDto;
}

export interface CreateSaleFormDto {
  venda: {
    dataVenda: string; // YYYY-MM-DD
    secretariaPresentes?: string;
    midiaOrigem?: string;
    gerente?: string; // Nome do gerente (opcional)
    unidadeVenda: string; // "Uniao Esmeralda" ou "Uniao Rio Branco" (sem acentos)
    grupoGeral?: boolean; // default: false
  };
  comprador: PessoaDto;
  compradorConjuge?: PessoaDto | null;
  vendedor: PessoaDto;
  vendedorConjuge?: PessoaDto | null;
  imovel: {
    cep: string; // 8 dígitos, apenas números
    endereco: string;
    numero: string; // Aceita "S/N" para sem número
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string; // 2 letras maiúsculas
    codigo: string; // Código único do imóvel
  };
  financeiro: {
    valorVenda: number; // Decimal, sem formatação
    comissaoTotal: number; // Decimal, sem formatação
    valorMeta: number; // Decimal, deve ser 5% do valorVenda
  };
  comissoes: {
    corretores: Array<{
      id: string; // ID ou nome do corretor
      porcentagem: number; // 0-100
      /** @deprecated Preferir captadores (até 3 por corretor). */
      captador?: string | null;
      /** Até 3 captadores por corretor, com porcentagem opcional */
      captadores?: Array<{
        id: string;
        nome?: string | null;
        porcentagem?: number | null;
      }>;
    }>;
    gerencias: Array<{
      nivel: number; // 1, 2, 3 ou 4
      porcentagem: number; // 0-100
      nome?: string; // Nome do gestor da gerência
    }>;
  };
  colaboradores?: {
    preAtendimento?: string;
    centralCaptacao?: string;
  };
  /** Opcional; default no backend: 'rascunho'. Enviar 'disponivel' ao finalizar. */
  status?: StatusFichaProposta;
}

export interface CreateSaleResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    numero: string;
    createdAt: string;
    updatedAt?: string;
  };
}

/** Proposta vinculada à ficha (retornada quando includeProposals=true) */
export interface FichaVendaPropostaRef {
  id: string;
  numero: string;
}

/** Resposta do GET /api/ficha-venda/:id */
export interface SaleFormDetailResponse {
  success: true;
  data: {
    id: string;
    formNumber?: string;
    numero?: string;
    status?: StatusFichaProposta;
    createdAt: string;
    updatedAt: string;
    venda: CreateSaleFormDto['venda'];
    comprador: PessoaDto;
    compradorConjuge?: PessoaDto | null;
    vendedor: PessoaDto;
    vendedorConjuge?: PessoaDto | null;
    imovel: CreateSaleFormDto['imovel'];
    financeiro: CreateSaleFormDto['financeiro'];
    comissoes: CreateSaleFormDto['comissoes'];
    colaboradores?: CreateSaleFormDto['colaboradores'];
    /** Lista de propostas vinculadas (quando GET com ?includeProposals=true) */
    propostas?: FichaVendaPropostaRef[];
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

/** Filtros para listar fichas de venda (somente gestores) */
export interface ListFichasVendaFilters {
  gestorCpf: string;
  page?: number;
  limit?: number;
  dataInicio?: string;
  dataFim?: string;
  search?: string;
}

/** Item resumido de ficha de venda (listagem) */
export interface FichaVendaListItem {
  id: string;
  numero?: string;
  formNumber?: string;
  status?: StatusFichaProposta;
  dataVenda?: string;
  valorVenda?: number;
  createdAt: string;
  updatedAt?: string;
  venda?: { dataVenda?: string; unidadeVenda?: string };
  financeiro?: { valorVenda?: number };
}

export interface ListFichasVendaResponse {
  success: boolean;
  data?: {
    fichas?: FichaVendaListItem[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  message?: string;
}

/**
 * Lista fichas de venda da equipe do gestor (somente gestores)
 * GET /api/ficha-venda?gestorCpf=...
 */
export const listarFichasVenda = async (
  filters: ListFichasVendaFilters
): Promise<ListFichasVendaResponse> => {
  try {
    const cpf = filters.gestorCpf.replace(/\D/g, '');
    if (!cpf) {
      throw { success: false, message: 'gestorCpf é obrigatório' } as ApiError;
    }
    const params = new URLSearchParams();
    params.append('gestorCpf', cpf);
    if (filters.page != null) params.append('page', String(filters.page));
    if (filters.limit != null) params.append('limit', String(filters.limit));
    if (filters.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters.dataFim) params.append('dataFim', filters.dataFim);
    if (filters.search) params.append('search', filters.search);
    const response = await publicApi.get<ListFichasVendaResponse>(
      `/api/ficha-venda?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) throw error.response.data as ApiError;
    throw {
      success: false,
      message: error.message || 'Erro ao listar fichas de venda',
    } as ApiError;
  }
};

/**
 * Cria uma nova ficha de venda
 * @param dados - Dados da ficha de venda formatados conforme a API
 * @returns Resposta da API com os dados da ficha criada
 * @throws ApiError em caso de erro de validação ou servidor
 */
export const criarFichaVenda = async (
  dados: CreateSaleFormDto
): Promise<CreateSaleResponse> => {
  try {
    const response = await publicApi.post<CreateSaleResponse>(
      '/api/ficha-venda',
      dados
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
      message: error.message || 'Erro ao conectar com o servidor',
    } as ApiError;
  }
};

/**
 * Carrega uma ficha de venda por ID (somente gestores; equipe = mesma unidade ou gestor_cpf)
 * GET /api/ficha-venda/:id?gestorCpf=...&includeProposals=true (opcional)
 * @param id - UUID da ficha
 * @param gestorCpf - CPF do gestor (obrigatório)
 * @param includeProposals - Se true, retorna data.propostas com as propostas vinculadas
 * @returns Dados da ficha ou null se 404 / não pertencer à equipe
 */
export const carregarFichaVenda = async (
  id: string,
  gestorCpf: string,
  includeProposals?: boolean
): Promise<SaleFormDetailResponse['data'] | null> => {
  try {
    const cpf = gestorCpf.replace(/\D/g, '');
    const query = new URLSearchParams({ gestorCpf: cpf });
    if (includeProposals) query.append('includeProposals', 'true');
    const response = await publicApi.get<SaleFormDetailResponse>(
      `/api/ficha-venda/${id}?${query.toString()}`
    );
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    if (error.response?.status === 403) {
      throw {
        ...(error.response?.data || {}),
        statusCode: 403,
        message:
          error.response?.data?.message ||
          'Acesso negado. Somente o gestor vinculado à ficha pode acessar.',
      };
    }
    if (error.response?.data) {
      throw error.response.data as ApiError;
    }
    throw {
      success: false,
      message: error.message || 'Erro ao carregar ficha',
    } as ApiError;
  }
};

/**
 * Atualiza uma ficha de venda existente (somente gestores; equipe = mesma unidade ou gestor_cpf)
 * PATCH /api/ficha-venda/:id?gestorCpf=...
 * @param id - UUID da ficha
 * @param dados - Payload completo no mesmo formato do POST
 * @param gestorCpf - CPF do gestor (obrigatório)
 */
export const atualizarFichaVenda = async (
  id: string,
  dados: CreateSaleFormDto,
  gestorCpf: string
): Promise<CreateSaleResponse> => {
  try {
    const cpf = gestorCpf.replace(/\D/g, '');
    const response = await publicApi.patch<CreateSaleResponse>(
      `/api/ficha-venda/${id}?gestorCpf=${cpf}`,
      dados
    );
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
 * Busca uma ficha de venda por ID (API pública – link compartilhado).
 * Usado quando o usuário abre o link /ficha-venda/:id sem estar logado como gestor.
 * GET /api/ficha-venda/:id
 * @param id - UUID da ficha
 * @param includeProposals - Se true, adiciona ?includeProposals=true e retorna data.propostas
 */
export const buscarFichaVendaPorId = async (
  id: string,
  includeProposals?: boolean
): Promise<SaleFormDetailResponse['data'] | null> => {
  try {
    const query = includeProposals ? '?includeProposals=true' : '';
    const response = await publicApi.get<SaleFormDetailResponse>(
      `/api/ficha-venda/${id}${query}`
    );
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    if (error.response?.status === 403) {
      throw {
        ...(error.response?.data || {}),
        statusCode: 403,
        message:
          error.response?.data?.message ||
          'Acesso negado. Somente o gestor vinculado à ficha pode acessar.',
      };
    }
    if (error.response?.data) throw error.response.data as ApiError;
    throw {
      success: false,
      message: error.message || 'Erro ao carregar ficha',
    } as ApiError;
  }
};

/**
 * Atualiza uma ficha de venda por ID (API pública – link compartilhado).
 * Usado quando o usuário salva alterações ao continuar o preenchimento pelo link, sem gestorCpf.
 * PATCH /api/ficha-venda/:id (corpo completo no mesmo formato do POST).
 */
export const atualizarFichaVendaPorId = async (
  id: string,
  dados: CreateSaleFormDto
): Promise<CreateSaleResponse> => {
  try {
    const response = await publicApi.patch<CreateSaleResponse>(
      `/api/ficha-venda/${id}`,
      dados
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) throw error.response.data as ApiError;
    throw {
      success: false,
      message: error.message || 'Erro ao salvar alterações',
    } as ApiError;
  }
};

/**
 * Baixa o PDF da ficha de venda (somente gestores da equipe).
 * GET /api/ficha-venda/:id/pdf?gestorCpf=...
 * @param id - UUID da ficha
 * @param gestorCpf - CPF do gestor (11 dígitos)
 * @param formNumber - Número da ficha (ex: FV-2024-001) para nome do arquivo
 */
export const baixarPdfFichaVenda = async (
  id: string,
  gestorCpf: string,
  formNumber?: string
): Promise<void> => {
  const cpf = gestorCpf.replace(/\D/g, '');
  if (!cpf) {
    throw {
      success: false,
      message: 'gestorCpf é obrigatório para baixar o PDF',
    } as ApiError;
  }
  const url = `${API_BASE_URL}/api/ficha-venda/${id}/pdf?gestorCpf=${encodeURIComponent(cpf)}`;
  const response = await fetch(url);
  if (!response.ok) {
    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      const err = await response.json();
      throw err as ApiError;
    }
    throw {
      success: false,
      message:
        response.status === 403
          ? 'Você não tem permissão para baixar o PDF desta ficha.'
          : response.status === 404
            ? 'Ficha não encontrada.'
            : 'Erro ao baixar PDF.',
    } as ApiError;
  }
  const blob = await response.blob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = formNumber
    ? `Ficha_Venda_${formNumber}.pdf`
    : `Ficha_Venda_${id}.pdf`;
  a.click();
  URL.revokeObjectURL(a.href);
};

/**
 * Reenvia o PDF da ficha de venda por email para os endereços informados.
 * Somente gestor da ficha pode reenviar.
 * POST /api/ficha-venda/:id/reenviar-email?gestorCpf=...
 */
export const reenviarEmailFichaVenda = async (
  id: string,
  gestorCpf: string,
  emails: string[]
): Promise<{ success: boolean; message: string }> => {
  const cpf = gestorCpf.replace(/\D/g, '');
  if (!cpf) {
    throw {
      success: false,
      message: 'gestorCpf é obrigatório para reenviar o email',
    } as ApiError;
  }
  const response = await publicApi.post<{ success: boolean; message: string }>(
    `/api/ficha-venda/${id}/reenviar-email?gestorCpf=${encodeURIComponent(cpf)}`,
    { emails }
  );
  return response.data;
};
