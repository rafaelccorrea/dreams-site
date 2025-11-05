import { config } from '../config'
import { Property } from './propertyService'

/**
 * Remove /api se já estiver presente para evitar duplicação
 */
const getApiBaseUrl = (): string => {
  const baseUrl = config.api.url.trim()
  // Se já termina com /api, remove para evitar duplicação
  if (baseUrl.endsWith('/api')) {
    return baseUrl
  }
  // Se não termina com /, adiciona
  return baseUrl.endsWith('/') ? `${baseUrl}api` : `${baseUrl}/api`
}

const API_BASE_URL = getApiBaseUrl()

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    try {
      const text = await response.text()
      if (text && text.trim().length > 0) {
        const error = JSON.parse(text)
        throw new Error(error.message || `Erro ${response.status}: ${response.statusText}`)
      }
    } catch (parseError) {
      // Se não conseguir fazer parse do erro, usar mensagem padrão
    }
    throw new Error(`Erro ${response.status}: ${response.statusText}`)
  }
  
  // Verificar se a resposta tem conteúdo antes de fazer parse
  const contentType = response.headers.get('content-type')
  const text = await response.text()
  
  // Se não houver conteúdo, retornar null para tipos que aceitam null
  if (!text || text.trim().length === 0) {
    return null as T
  }
  
  // Se não for JSON, lançar erro
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Resposta não é JSON válido')
  }
  
  try {
    return JSON.parse(text) as T
  } catch (error) {
    throw new Error('Erro ao fazer parse da resposta JSON')
  }
}

export interface CreatePropertyRequest {
  title: string
  description: string
  type: 'house' | 'apartment' | 'commercial' | 'land' | 'rural'
  status?: 'available' | 'rented' | 'sold' | 'maintenance' | 'draft'
  address: string
  street: string
  number: string
  complement?: string
  city: string
  state: string
  zipCode: string
  neighborhood: string
  totalArea: number
  builtArea?: number
  bedrooms?: number
  bathrooms?: number
  parkingSpaces?: number
  salePrice?: number
  rentPrice?: number
  condominiumFee?: number
  iptu?: number
  features?: string[]
}

export interface CreatePropertyResponse extends Property {}

export interface GetMyPropertyResponse extends Property | null {}

export interface DeletePropertyResponse {
  message: string
}

/**
 * Cria uma nova propriedade para o usuário público autenticado
 */
export async function createProperty(
  data: CreatePropertyRequest
): Promise<CreatePropertyResponse> {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('Usuário não autenticado')
  }

  const response = await fetch(`${API_BASE_URL}/public/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  return handleResponse<CreatePropertyResponse>(response)
}

/**
 * Busca a propriedade do usuário público autenticado
 */
export async function getMyProperty(): Promise<GetMyPropertyResponse> {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('Usuário não autenticado')
  }

  const response = await fetch(`${API_BASE_URL}/public/properties/my-property`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `Erro ${response.status}: ${response.statusText}`,
    }))
    throw new Error(error.message || 'Erro ao buscar propriedade')
  }

  // Verificar se há conteúdo antes de fazer parse
  const contentType = response.headers.get('content-type')
  const text = await response.text()
  
  // Se não houver conteúdo ou não for JSON, retornar null
  if (!text || text.trim().length === 0) {
    return null
  }
  
  if (!contentType || !contentType.includes('application/json')) {
    return null
  }
  
  try {
    return JSON.parse(text) as GetMyPropertyResponse
  } catch (error) {
    // Se não conseguir fazer parse, retornar null
    return null
  }
}

/**
 * Deleta uma propriedade do usuário público
 */
export async function deleteProperty(
  propertyId: string
): Promise<DeletePropertyResponse> {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('Usuário não autenticado')
  }

  const response = await fetch(`${API_BASE_URL}/public/properties/${propertyId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse<DeletePropertyResponse>(response)
}

