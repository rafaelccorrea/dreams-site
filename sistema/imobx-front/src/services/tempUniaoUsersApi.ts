import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

/**
 * API pública para buscar corretores e gestores da União
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

// Tipos
export interface TempUniaoUser {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  tipo?: 'corretor' | 'gestor';
  type?: 'corretor' | 'gestor'; // Campo alternativo (API pode retornar 'type')
  unidade?: string;
  /** Porcentagem padrão (0–100) para comissão na ficha de venda */
  porcentagem?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TempUniaoUsersResponse {
  success: boolean;
  data: TempUniaoUser[];
  message?: string;
}

export interface TempUniaoUserByCpfResponse {
  success: boolean;
  data: TempUniaoUser | null;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

/** Resposta do login – API retorna { success, user? } com dados completos do usuário */
export interface LoginResponse {
  success: boolean;
  user?: TempUniaoUser;
}

const mapUserFromApi = (user: any): TempUniaoUser => ({
  id: user.id,
  nome: user.nome,
  email: user.email,
  cpf: user.cpf,
  telefone: user.telefone,
  tipo: (user.type ?? user.tipo ?? 'corretor') as 'corretor' | 'gestor',
  type: (user.type ?? user.tipo ?? 'corretor') as 'corretor' | 'gestor',
  unidade: user.unidade,
  porcentagem: user.porcentagem,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/**
 * Login por CPF (corretor ou gestor) – verifica se o CPF está cadastrado
 * POST /api/temp-uniao-users/login
 * @returns { success, user? } – user traz id, nome, email, cpf, type, unidade, porcentagem, etc.
 */
export const loginPorCpf = async (cpf: string): Promise<LoginResponse> => {
  try {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return { success: false };
    const response = await publicApi.post<{ success: boolean; user?: any }>(
      '/api/temp-uniao-users/login',
      { cpf: cleanCpf }
    );
    const data = response.data;
    if (!data?.success || !data.user) return { success: false };
    return { success: true, user: mapUserFromApi(data.user) };
  } catch {
    return { success: false };
  }
};

/**
 * Login de gestor por CPF ou CNPJ – verifica se pertence a um gestor (inclui super user por CNPJ)
 * POST /api/temp-uniao-users/login-gestor
 * @returns { success, user? } – user traz dados do gestor quando success true
 */
export const loginGestorPorCpf = async (
  cpf: string
): Promise<LoginResponse> => {
  try {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11 && cleanCpf.length !== 14)
      return { success: false };
    const response = await publicApi.post<{ success: boolean; user?: any }>(
      '/api/temp-uniao-users/login-gestor',
      { cpf: cleanCpf }
    );
    const data = response.data;
    if (!data?.success || !data.user) return { success: false };
    return { success: true, user: mapUserFromApi(data.user) };
  } catch {
    return { success: false };
  }
};

export interface IdentificarUsuarioResult {
  tipo: 'gestor' | 'corretor' | null;
  user?: TempUniaoUser;
}

/**
 * Identifica o tipo de usuário (gestor ou corretor) pelo CPF ou CNPJ.
 * @returns { tipo, user? } – tipo null se não cadastrado; user com id, nome, email, cpf, type, unidade, etc.
 */
export const identificarUsuarioPorCpf = async (
  cpf: string
): Promise<IdentificarUsuarioResult> => {
  const cleaned = cpf.replace(/\D/g, '');
  const loginResult = await loginPorCpf(cpf);
  if ((!loginResult.success || !loginResult.user) && cleaned.length === 14) {
    const gestorResult = await loginGestorPorCpf(cpf);
    if (gestorResult.success && gestorResult.user) {
      return { tipo: 'gestor', user: gestorResult.user };
    }
    return { tipo: null };
  }
  if (!loginResult.success || !loginResult.user) return { tipo: null };
  const gestorResult = await loginGestorPorCpf(cpf);
  return {
    tipo: gestorResult.success ? 'gestor' : 'corretor',
    user: loginResult.user,
  };
};

/**
 * Busca lista de corretores disponíveis
 * @returns Lista de corretores
 * @throws ApiError em caso de erro
 */
export const buscarCorretores = async (): Promise<TempUniaoUser[]> => {
  try {
    const response = await publicApi.get<any>(
      '/api/temp-uniao-users/corretores'
    );

    const mapUser = (user: any) => ({
      id: user.id,
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      telefone: user.telefone,
      tipo: (user.type || user.tipo || 'corretor') as 'corretor' | 'gestor',
      unidade: user.unidade,
      porcentagem:
        typeof user.porcentagem === 'number' ? user.porcentagem : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    // Verificar se é array direto
    if (Array.isArray(response.data)) {
      return response.data.map(mapUser);
    }

    // API retorna objeto com wrapper
    if (response.data && typeof response.data === 'object') {
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data.map(mapUser);
      }
    }

    throw {
      success: false,
      message: response.data?.message || 'Erro ao buscar corretores',
    } as ApiError;
  } catch (error: any) {
    // Se o erro contém dados válidos (array), retornar os dados
    if (error.response?.data && Array.isArray(error.response.data)) {
      return error.response.data.map((user: any) => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        cpf: user.cpf,
        telefone: user.telefone,
        tipo: (user.type || user.tipo || 'corretor') as 'corretor' | 'gestor',
        unidade: user.unidade,
        porcentagem:
          typeof user.porcentagem === 'number' ? user.porcentagem : undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
    }

    // Tratar erro padrão
    if (error.response?.data) {
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
 * Busca lista de gestores disponíveis
 * @returns Lista de gestores
 * @throws ApiError em caso de erro
 */
export const buscarGestores = async (): Promise<TempUniaoUser[]> => {
  try {
    const response = await publicApi.get<any>('/api/temp-uniao-users/gestores');

    const mapGestor = (user: any) => ({
      id: user.id,
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      telefone: user.telefone,
      tipo: (user.type || user.tipo || 'gestor') as 'corretor' | 'gestor',
      unidade: user.unidade,
      porcentagem:
        typeof user.porcentagem === 'number' ? user.porcentagem : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    if (Array.isArray(response.data)) {
      return response.data.map(mapGestor);
    }

    if (response.data && typeof response.data === 'object') {
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data.map(mapGestor);
      }
    }

    throw {
      success: false,
      message: response.data?.message || 'Erro ao buscar gestores',
    } as ApiError;
  } catch (error: any) {
    if (error.response?.data && Array.isArray(error.response.data)) {
      return error.response.data.map((user: any) => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        cpf: user.cpf,
        telefone: user.telefone,
        tipo: (user.type || user.tipo || 'gestor') as 'corretor' | 'gestor',
        unidade: user.unidade,
        porcentagem:
          typeof user.porcentagem === 'number' ? user.porcentagem : undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
    }

    // Tratar erro padrão
    if (error.response?.data) {
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
 * Busca usuário por CPF
 * @param cpf - CPF do usuário (apenas números)
 * @returns Dados do usuário ou null se não encontrado
 * @throws ApiError em caso de erro
 */
export const buscarUsuarioPorCpf = async (
  cpf: string
): Promise<TempUniaoUser | null> => {
  try {
    const cleanCpf = cpf.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
      throw {
        success: false,
        message: 'CPF deve conter 11 dígitos',
      } as ApiError;
    }

    const response = await publicApi.get<TempUniaoUserByCpfResponse>(
      `/api/temp-uniao-users/cpf/${cleanCpf}`
    );

    if (response.data.success) {
      return response.data.data;
    }

    return null;
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

/** Resposta do import de porcentagens (formato da API) */
export interface ImportPorcentagensResponse {
  total?: number;
  updated?: number;
  notFound?: number;
  errors?: Array<{ row?: number; cpf?: string; error?: string }>;
  /** Compatibilidade com wrapper success/data */
  success?: boolean;
  message?: string;
  data?: {
    imported?: number;
    updated?: number;
    errors?: Array<{ row?: number; cpf?: string; error?: string }>;
  };
}

/**
 * Importa porcentagens em massa (Excel .xlsx ou CSV).
 * Planilha com 2 colunas: CPF (do corretor) e Porcentagem (0-100).
 * Requer senha de aprovação (campo password no form).
 * POST /api/temp-uniao-users/import-porcentagens
 */
export const importPorcentagens = async (
  file: File,
  password: string
): Promise<ImportPorcentagensResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    const config: { timeout: number; headers?: Record<string, unknown> } = {
      timeout: 60000,
    };
    const headers = {
      ...(publicApi.defaults.headers?.common as Record<string, unknown>),
    };
    delete headers['Content-Type'];
    config.headers = headers;

    const response = await publicApi.post<ImportPorcentagensResponse>(
      '/api/temp-uniao-users/import-porcentagens',
      formData,
      config
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw {
        success: false,
        message: 'Senha de aprovação inválida ou não informada.',
      };
    }
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Erro ao enviar arquivo',
    };
  }
};
