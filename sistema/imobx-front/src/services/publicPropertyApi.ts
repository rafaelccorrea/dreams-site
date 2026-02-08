import axios from 'axios';
import type {
  Property,
  PropertyResponse,
  PaginationOptions,
} from '../types/property';
import { API_BASE_URL } from '../config/apiConfig';

// Instância axios sem autenticação para rotas públicas
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interface para filtros da API pública
export interface PublicPropertyFilters {
  /** Código do imóvel (correspondência exata). Quando informado, city pode ser omitido (API pública ficha de venda). */
  code?: string;
  /** Cidade. Obrigatório exceto quando code for informado. */
  city?: string;
  state?: string;
  neighborhood?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  features?: string[];

  // Filtros específicos para busca por corretor/imobiliária
  companyId?: string;
  companyName?: string;
  responsibleUserId?: string;
  responsibleUserName?: string;

  // Busca textual
  search?: string;
}

/**
 * Listar propriedades públicas disponíveis no site
 * GET /public/properties
 */
export const getPublicProperties = async (
  filters: PublicPropertyFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 50 }
): Promise<PropertyResponse> => {
  try {
    const params = new URLSearchParams();

    // Adicionar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => params.append(key, item));
        } else {
          params.append(key, String(value));
        }
      }
    });

    // Adicionar paginação
    const page =
      Number.isNaN(pagination.page) || pagination.page < 1
        ? 1
        : pagination.page;
    const limit =
      Number.isNaN(pagination.limit) || pagination.limit < 1
        ? 50
        : pagination.limit;

    params.append('page', String(page));
    params.append('limit', String(limit));

    const url = `/public/properties?${params.toString()}`;
    const response = await publicApi.get(url);

    return response.data;
  } catch (error: any) {
    console.error('❌ Erro ao buscar propriedades públicas:', error);
    throw new Error(
      error.response?.data?.message || 'Erro ao buscar propriedades públicas'
    );
  }
};

/**
 * Buscar propriedade pública por ID
 * GET /public/properties/:id
 */
export const getPublicPropertyById = async (id: string): Promise<Property> => {
  try {
    const response = await publicApi.get(`/public/properties/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Erro ao buscar propriedade pública:', error);
    throw new Error(
      error.response?.data?.message || 'Erro ao buscar propriedade pública'
    );
  }
};

/**
 * Buscar propriedades públicas de uma imobiliária específica
 * GET /public/properties?companyId=xxx
 */
export const getPublicPropertiesByCompany = async (
  companyId: string,
  filters: Omit<PublicPropertyFilters, 'companyId'> = {},
  pagination: PaginationOptions = { page: 1, limit: 50 }
): Promise<PropertyResponse> => {
  return getPublicProperties({ ...filters, companyId }, pagination);
};

/**
 * Buscar propriedades públicas de um corretor específico
 * GET /public/properties?responsibleUserId=xxx
 */
export const getPublicPropertiesByBroker = async (
  responsibleUserId: string,
  filters: Omit<PublicPropertyFilters, 'responsibleUserId'> = {},
  pagination: PaginationOptions = { page: 1, limit: 50 }
): Promise<PropertyResponse> => {
  return getPublicProperties({ ...filters, responsibleUserId }, pagination);
};

/**
 * Buscar propriedades públicas por nome da imobiliária
 * GET /public/properties?companyName=xxx
 */
export const getPublicPropertiesByCompanyName = async (
  companyName: string,
  filters: Omit<PublicPropertyFilters, 'companyName'> = {},
  pagination: PaginationOptions = { page: 1, limit: 50 }
): Promise<PropertyResponse> => {
  return getPublicProperties({ ...filters, companyName }, pagination);
};

/**
 * Buscar propriedades públicas por nome do corretor
 * GET /public/properties?responsibleUserName=xxx
 */
export const getPublicPropertiesByBrokerName = async (
  responsibleUserName: string,
  filters: Omit<PublicPropertyFilters, 'responsibleUserName'> = {},
  pagination: PaginationOptions = { page: 1, limit: 50 }
): Promise<PropertyResponse> => {
  return getPublicProperties({ ...filters, responsibleUserName }, pagination);
};

/**
 * Mapeia uma propriedade da API para o bloco "imóvel" da ficha de venda.
 * Usado para preencher automaticamente os campos do imóvel ao selecionar na busca.
 */
export function propriedadeParaImovelFicha(prop: Property): {
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  codigo: string;
} {
  const cep = (prop.zipCode ?? '').replace(/\D/g, '').slice(0, 8) || '00000000';
  return {
    cep,
    endereco: prop.address ?? prop.street ?? '',
    numero: prop.number ?? 'S/N',
    complemento: prop.complement ?? undefined,
    bairro: prop.neighborhood ?? '',
    cidade: prop.city ?? '',
    estado: (prop.state ?? '').toUpperCase().slice(0, 2) || 'SP',
    codigo: prop.code ?? String(prop.id),
  };
}

/**
 * Mapeia uma propriedade da API para o bloco "imóvel" da ficha de proposta.
 * Preenche matrícula (código), CEP, endereço, bairro, cidade e estado.
 * Cartório e cadastro prefeitura permanecem para preenchimento manual.
 */
export function propriedadeParaImovelFichaProposta(prop: Property): {
  matricula: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
} {
  const cep = (prop.zipCode ?? '').replace(/\D/g, '').slice(0, 8) || '00000000';
  return {
    matricula: prop.code ?? String(prop.id),
    cep,
    endereco: prop.address ?? prop.street ?? '',
    bairro: prop.neighborhood ?? '',
    cidade: prop.city ?? '',
    estado: (prop.state ?? '').toUpperCase().slice(0, 2) || 'SP',
  };
}

// Exportar instância da API pública (caso necessário para outras operações)
export { publicApi };
