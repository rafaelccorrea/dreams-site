import { config } from '../config'
import { PropertyOffer, PropertyOfferType } from './propertyService'

// Remove /api se já estiver presente para evitar duplicação
const getApiBaseUrl = (): string => {
  const baseUrl = config.api.url.trim()
  if (baseUrl.endsWith('/api')) {
    return baseUrl
  }
  return baseUrl.endsWith('/') ? `${baseUrl}api` : `${baseUrl}/api`
}

const API_BASE_URL = getApiBaseUrl()

interface CreatePropertyOfferRequest {
  propertyId: string
  type: PropertyOfferType
  offeredValue: number
  message?: string
}

interface CreatePropertyOfferResponse {
  offer: PropertyOffer
  message?: string
}

export interface PropertyOffersListResponse {
  offers: PropertyOffer[]
  total?: number
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('authToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `Erro ${response.status}: ${response.statusText}`,
    }))
    throw new Error(error.message || 'Erro ao processar solicitação')
  }
  return response.json()
}

/**
 * Cria uma nova oferta para uma propriedade
 * Endpoint: POST /api/public/properties/offers
 */
export async function createPropertyOffer(
  payload: CreatePropertyOfferRequest
): Promise<CreatePropertyOfferResponse> {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('Você precisa estar autenticado para fazer uma oferta.')
  }

  const response = await fetch(`${API_BASE_URL}/public/properties/offers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })

  return handleResponse<CreatePropertyOfferResponse>(response)
}

/**
 * Lista TODAS as ofertas do usuário público autenticado
 * Endpoint: GET /api/public/properties/offers
 */
export async function listMyOffers(): Promise<PropertyOffer[]> {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('Você precisa estar autenticado para ver suas ofertas.')
  }

  const response = await fetch(`${API_BASE_URL}/public/properties/offers`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await handleResponse<PropertyOffersListResponse | PropertyOffer[]>(response)

  if (Array.isArray(data)) {
    return data
  }

  return data.offers || []
}

/**
 * Lista ofertas da propriedade para o usuário público autenticado
 * Endpoint: GET /api/public/properties/offers/property/:id
 */
export async function listMyOffersByPropertyId(
  propertyId: string
): Promise<PropertyOffer[]> {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('Você precisa estar autenticado para ver suas ofertas.')
  }

  const response = await fetch(
    `${API_BASE_URL}/public/properties/offers/property/${propertyId}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  )

  const data = await handleResponse<PropertyOffersListResponse | PropertyOffer[]>(response)

  if (Array.isArray(data)) {
    return data
  }

  return data.offers || []
}

/**
 * Verifica se há oferta pendente para uma propriedade
 * Endpoint: GET /api/public/properties/offers/check/:propertyId
 */
export interface CheckPendingOfferResponse {
  hasPendingOffer: boolean
  offer?: PropertyOffer
  message?: string
}

export async function checkPendingOffer(
  propertyId: string
): Promise<CheckPendingOfferResponse> {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('Você precisa estar autenticado para verificar ofertas.')
  }

  const response = await fetch(
    `${API_BASE_URL}/public/properties/offers/check/${propertyId}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  )

  return handleResponse<CheckPendingOfferResponse>(response)
}
