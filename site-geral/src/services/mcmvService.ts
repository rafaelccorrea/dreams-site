/**
 * Serviço para integração com API pública do MCMV (Minha Casa Minha Vida)
 * 
 * Base URL: config.api.url deve ser a URL base (ex: http://localhost:3000)
 * Todas as rotas públicas do MCMV começam com /public/mcmv
 */

import { config } from '../config'

// Obter URL base da API
// A documentação indica que a base URL é /public/mcmv
// Então precisamos da URL base do servidor (ex: http://localhost:3000)
const getApiBaseUrl = (): string => {
  const baseUrl = config.api.url.trim()
  // Remove /api se estiver presente (caso a URL já inclua /api)
  if (baseUrl.endsWith('/api')) {
    return baseUrl.slice(0, -4)
  }
  // Remove / no final se houver
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

const API_BASE_URL = getApiBaseUrl()

// ========== TIPOS ==========

export type IncomeRange = 'faixa1' | 'faixa2' | 'faixa3'

export interface CheckEligibilityRequest {
  monthlyIncome: number
  familySize: number
  hasProperty: boolean
  previousBeneficiary: boolean
  city: string
  state: string
  name?: string
  email?: string
  phone?: string
  cadunicoNumber?: string
  source?: string
}

export interface CheckEligibilityResponse {
  eligible: boolean
  incomeRange?: IncomeRange
  reasons: string[]
  maxPropertyValue?: number
  subsidy?: number
  checkId?: string
}

export interface SimulateFinancingRequest {
  propertyValue: number
  monthlyIncome: number
  familySize: number
  loanTerm?: number
  interestRate?: number
  bankCode?: string // Código do banco (opcional)
}

export interface SimulateFinancingResponse {
  propertyValue: number
  loanAmount: number
  subsidy: number
  downPayment: number
  monthlyPayment: number
  loanTerm: number
  interestRate: number
  eligible: boolean
  reasons: string[]
}

export interface PropertyPreferences {
  type?: 'house' | 'apartment' | 'commercial' | 'land' | 'rural'
  minBedrooms?: number
  maxValue?: number
  neighborhoods?: string[]
}

// ========== TAXAS DE JUROS DOS BANCOS ==========

export interface BankInterestRate {
  bank: string
  bankCode: string
  interestRate: number
  minimumRate?: number
  maximumRate?: number
  lastUpdated: string
  source?: string
  notes?: string
}

export interface BankInterestRatesResponse {
  rates: BankInterestRate[]
  lastUpdated: string
}

// ========== PROPRIEDADES MCMV ==========

export interface McmvProperty {
  id: string
  title: string
  description: string
  address: string
  city: string
  state: string
  zipCode: string
  salePrice: number
  bedrooms: number
  bathrooms: number
  mcmvEligible: boolean
  mcmvIncomeRange: IncomeRange
  mcmvMaxValue: number
  mcmvSubsidy: number
  company?: {
    id: string
    name: string
    logo?: string
  }
  mainImage?: {
    id: string
    url: string
  }
  imageCount?: number
}

export interface McmvPropertyListResponse {
  properties: McmvProperty[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface McmvPropertyFilters {
  city: string
  state?: string
  mcmvIncomeRange?: IncomeRange
  page?: number
  limit?: number
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
}

// ========== EMPRESAS MCMV ==========

export interface McmvCompany {
  id: string
  name: string
  logo?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  website?: string
  mcmvPropertyCount: number
}

export interface McmvCompanyListResponse {
  companies: McmvCompany[]
}

export interface McmvCompanyFilters {
  city?: string
  state?: string
  mcmvIncomeRange?: IncomeRange
}

export interface PreRegistrationRequest {
  name: string
  email: string
  phone: string
  cpf: string
  monthlyIncome: number
  familySize: number
  city: string
  state: string
  hasProperty: boolean
  previousBeneficiary: boolean
  propertyPreferences?: PropertyPreferences
  cadunicoNumber?: string
  source?: string
}

export interface PreRegistrationResponse {
  leadId: string
  eligible: boolean
  incomeRange?: IncomeRange
  message: string
}

// ========== FUNÇÕES AUXILIARES ==========

/**
 * Processa resposta da API e lança erro se necessário
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // Aceitar 200 OK e 201 Created como sucesso (response.ok já inclui ambos)
  if (!response.ok) {
    let errorMessage = `Erro ${response.status}: ${response.statusText}`
    
    try {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text()
        if (text && text.trim().length > 0) {
          const error = JSON.parse(text)
          errorMessage = error.message || errorMessage
        }
      }
    } catch (parseError) {
      // Se não conseguir fazer parse do erro, usar mensagem padrão
    }
    
    throw new Error(errorMessage)
  }
  
  // Verificar se a resposta tem conteúdo antes de fazer parse
  const contentType = response.headers.get('content-type')
  const text = await response.text()
  
  // Se não houver conteúdo, retornar null para tipos que aceitam null
  if (!text || text.trim().length === 0) {
    return null as T
  }
  
  // Verificar se é JSON
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Resposta não é JSON válido')
  }
  
  try {
    return JSON.parse(text) as T
  } catch (error) {
    throw new Error('Erro ao fazer parse da resposta JSON')
  }
}

// ========== VERIFICAR ELEGIBILIDADE ==========

/**
 * Verifica se um cliente é elegível para o programa MCMV
 */
export async function checkEligibility(
  data: CheckEligibilityRequest
): Promise<CheckEligibilityResponse> {
  const response = await fetch(`${API_BASE_URL}/public/mcmv/check-eligibility`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return handleResponse<CheckEligibilityResponse>(response)
}

// ========== SIMULAR FINANCIAMENTO ==========

/**
 * Simula um financiamento MCMV com base no valor do imóvel e renda
 */
export async function simulateFinancing(
  data: SimulateFinancingRequest
): Promise<SimulateFinancingResponse> {
  const response = await fetch(`${API_BASE_URL}/public/mcmv/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return handleResponse<SimulateFinancingResponse>(response)
}

// ========== PRÉ-CADASTRO ==========

/**
 * Realiza pré-cadastro no programa MCMV
 */
export async function preRegister(
  data: PreRegistrationRequest
): Promise<PreRegistrationResponse> {
  const response = await fetch(`${API_BASE_URL}/public/mcmv/pre-registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return handleResponse<PreRegistrationResponse>(response)
}

// ========== OBTER TAXAS DE JUROS DOS BANCOS ==========

/**
 * Obtém as taxas de juros reais dos bancos para financiamento MCMV
 */
export async function getBankInterestRates(): Promise<BankInterestRatesResponse> {
  const response = await fetch(`${API_BASE_URL}/public/mcmv/bank-interest-rates`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<BankInterestRatesResponse>(response)
}

// ========== LISTAR PROPRIEDADES MCMV ==========

/**
 * Lista propriedades elegíveis para MCMV disponíveis no site público
 */
export async function listMcmvProperties(
  filters: McmvPropertyFilters
): Promise<McmvPropertyListResponse> {
  const params = new URLSearchParams({
    city: filters.city,
    page: (filters.page || 1).toString(),
    limit: (filters.limit || 50).toString(),
  })

  if (filters.state) params.append('state', filters.state)
  if (filters.mcmvIncomeRange) params.append('mcmvIncomeRange', filters.mcmvIncomeRange)
  if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
  if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString())
  if (filters.bathrooms) params.append('bathrooms', filters.bathrooms.toString())

  const response = await fetch(`${API_BASE_URL}/public/mcmv/properties?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<McmvPropertyListResponse>(response)
}

// ========== LISTAR EMPRESAS MCMV ==========

/**
 * Lista imobiliárias que possuem propriedades MCMV disponíveis
 */
export async function listMcmvCompanies(
  filters?: McmvCompanyFilters
): Promise<McmvCompanyListResponse> {
  const params = new URLSearchParams()

  if (filters?.city) params.append('city', filters.city)
  if (filters?.state) params.append('state', filters.state)
  if (filters?.mcmvIncomeRange) params.append('mcmvIncomeRange', filters.mcmvIncomeRange)

  const queryString = params.toString()
  const url = queryString
    ? `${API_BASE_URL}/public/mcmv/companies?${queryString}`
    : `${API_BASE_URL}/public/mcmv/companies`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<McmvCompanyListResponse>(response)
}

