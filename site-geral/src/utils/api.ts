import { config } from '../config'
import { useLocation } from '../contexts/LocationContext'

/**
 * Obtém headers padrão incluindo autenticação JWT e localização
 */
export const getDefaultHeaders = (): HeadersInit => {
  const location = getLocationFromStorage()
  const token = localStorage.getItem('authToken')
  
  return {
    'Content-Type': 'application/json',
    ...(location && {
      'X-User-City': location.city,
      'X-User-State': location.state,
    }),
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  }
}

/**
 * Função para fazer chamadas à API incluindo a localização do usuário e autenticação
 */
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const headers = {
    ...getDefaultHeaders(),
    ...options.headers,
  }

  const url = `${config.api.url}${endpoint}`

  return fetch(url, {
    ...options,
    headers,
  })
}

/**
 * Função auxiliar para obter localização do localStorage
 */
const getLocationFromStorage = () => {
  try {
    const stored = localStorage.getItem('user_location')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

/**
 * Hook para obter headers com localização para chamadas de API
 */
export const useApiHeaders = () => {
  const { location } = useLocation()
  
  return {
    'Content-Type': 'application/json',
    ...(location && {
      'X-User-City': location.city,
      'X-User-State': location.state,
    }),
  }
}



