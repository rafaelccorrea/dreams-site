/**
 * Serviço para integração com API de usuários públicos e favoritos
 * 
 * Base URL: config.api.url deve ser a URL base (ex: http://localhost:3000)
 * Todas as rotas de usuários públicos começam com /api/public/users
 */

import { config } from '../config'
import { Property } from './propertyService'

// Remove /api se já estiver presente para evitar duplicação
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

// ========== TIPOS ==========

export interface PublicUser {
  id: string
  email: string
  phone: string
  isEmailConfirmed: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  phone: string
}

export interface RegisterResponse {
  message: string
  success: boolean
  email: string
  expirationHours: number
}

export interface ConfirmEmailRequest {
  token: string
}

export interface ConfirmEmailResponse {
  message: string
  success: boolean
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: PublicUser
}

export interface FavoriteResponse {
  message: string
  success: boolean
  favoriteId?: string
}

export interface CheckFavoriteResponse {
  isFavorite: boolean
  favoriteId?: string
}

export interface FavoritesListResponse {
  properties: Property[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface FavoritesCountResponse {
  total: number
}

// ========== FUNÇÕES AUXILIARES ==========

/**
 * Obtém headers de autenticação com token JWT
 */
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('authToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

/**
 * Processa resposta da API e lança erro se necessário
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `Erro ${response.status}: ${response.statusText}`,
    }))
    throw new Error(error.message || 'Erro ao processar solicitação')
  }
  return response.json()
}

// ========== AUTENTICAÇÃO ==========

/**
 * Registra um novo usuário público
 */
export async function register(
  email: string,
  password: string,
  phone: string
): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/public/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, phone }),
  })

  return handleResponse<RegisterResponse>(response)
}

/**
 * Confirma o email do usuário usando token
 */
export async function confirmEmail(token: string): Promise<ConfirmEmailResponse> {
  const response = await fetch(`${API_BASE_URL}/public/users/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  })

  return handleResponse<ConfirmEmailResponse>(response)
}

/**
 * Reenvia email de confirmação
 */
export async function resendConfirmationEmail(
  email: string
): Promise<ConfirmEmailResponse> {
  const response = await fetch(`${API_BASE_URL}/public/users/resend-confirmation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  return handleResponse<ConfirmEmailResponse>(response)
}

/**
 * Faz login e retorna token JWT
 */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/public/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await handleResponse<LoginResponse>(response)

  // Salvar token e dados do usuário
  localStorage.setItem('authToken', data.accessToken)
  localStorage.setItem('user', JSON.stringify(data.user))

  return data
}

/**
 * Faz logout removendo tokens do localStorage
 */
export function logout(): void {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
}

/**
 * Verifica se o usuário está autenticado
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('authToken')
}

/**
 * Obtém dados do usuário do localStorage
 */
export function getUser(): PublicUser | null {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

/**
 * Obtém o token JWT do localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem('authToken')
}

// ========== FAVORITOS ==========

/**
 * Adiciona uma propriedade aos favoritos
 */
export async function addFavorite(propertyId: string): Promise<FavoriteResponse> {
  const response = await fetch(`${API_BASE_URL}/public/users/favorites`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ propertyId }),
  })

  return handleResponse<FavoriteResponse>(response)
}

/**
 * Remove uma propriedade dos favoritos
 */
export async function removeFavorite(
  propertyId: string
): Promise<FavoriteResponse> {
  const response = await fetch(`${API_BASE_URL}/public/users/favorites`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify({ propertyId }),
  })

  return handleResponse<FavoriteResponse>(response)
}

/**
 * Lista propriedades favoritadas (paginado)
 */
export async function listFavorites(
  page = 1,
  limit = 20
): Promise<FavoritesListResponse> {
  const response = await fetch(
    `${API_BASE_URL}/public/users/favorites?page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  )

  return handleResponse<FavoritesListResponse>(response)
}

/**
 * Verifica se uma propriedade está favoritada
 */
export async function checkFavorite(
  propertyId: string
): Promise<CheckFavoriteResponse> {
  const response = await fetch(
    `${API_BASE_URL}/public/users/favorites/check/${propertyId}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  )

  return handleResponse<CheckFavoriteResponse>(response)
}

/**
 * Conta total de favoritos do usuário
 */
export async function getFavoritesCount(): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/public/users/favorites/count`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await handleResponse<FavoritesCountResponse>(response)
  return data.total
}

/**
 * Alterna favorito (adiciona se não existe, remove se existe)
 */
export async function toggleFavorite(
  propertyId: string
): Promise<FavoriteResponse> {
  const check = await checkFavorite(propertyId)

  if (check.isFavorite) {
    return await removeFavorite(propertyId)
  } else {
    return await addFavorite(propertyId)
  }
}

