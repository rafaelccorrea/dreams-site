import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Instância axios sem autenticação para rotas públicas
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interface do plano público retornado pela API
 *
 * IMPORTANTE: Esta interface deve corresponder exatamente à estrutura
 * retornada pelo endpoint GET /public/plans
 *
 * Documentação completa: docs/API_PUBLIC_PLANS.md
 */
export interface PublicPlan {
  /** UUID único do plano */
  id: string;
  /** Nome do plano para exibição */
  name: string;
  /** Tipo do plano: 'basic', 'pro' ou 'custom' */
  type: 'basic' | 'pro' | 'custom';
  /** Preço do plano (pode ser string ou number) */
  price: string | number;
  /** Número máximo de empresas permitidas (0 = ilimitado) */
  maxCompanies: number;
  /** Descrição do plano */
  description: string;
  /**
   * Lista de módulos disponíveis no plano
   * Pode ser string JSON ou array de strings
   * Exemplo: "[\"user_management\",\"company_management\"]" ou ["user_management","company_management"]
   */
  modules?: string | string[];
  /**
   * Objeto JSON com features específicas do plano
   * Pode ser string JSON ou object
   * Exemplo: "{\"maxUsers\":5,\"maxProperties\":50}" ou {maxUsers:5,maxProperties:50}
   */
  features?: string | Record<string, any>;
  /** Indica se o plano está ativo e deve ser exibido */
  isActive: boolean;
  /** Indica se é o plano padrão */
  isDefault?: boolean;
  /** Ordem de exibição dos planos (menor número aparece primeiro) */
  displayOrder: number;
  /** Data de criação do plano (ISO format) */
  createdAt?: string;
  /** Data de última atualização do plano (ISO format) */
  updatedAt?: string;
}

/**
 * Buscar planos públicos disponíveis
 *
 * Endpoint: GET /public/plans
 *
 * Retorna apenas planos ativos (isActive: true) ordenados por displayOrder
 *
 * @returns Array de planos públicos
 * @throws Retorna array vazio em caso de erro (frontend usa fallback)
 *
 * Documentação completa da API: docs/API_PUBLIC_PLANS.md
 */
export const getPublicPlans = async (): Promise<PublicPlan[]> => {
  try {
    const response = await publicApi.get<PublicPlan[]>('/public/plans');
    return response.data;
  } catch (error: any) {
    console.error('❌ Erro ao buscar planos públicos:', error);
    // Retornar array vazio em caso de erro (frontend usa fallback para planos mockados)
    return [];
  }
};
