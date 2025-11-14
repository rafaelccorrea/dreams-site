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

export type GetMyPropertyResponse = Property | null

export interface DeletePropertyResponse {
  message: string
}

export interface GalleryImage {
  id: string
  fileName?: string
  fileUrl?: string
  url?: string
  thumbnailUrl?: string
  filePath?: string
  fileSize?: number
  mimeType?: string
  category?: string
  altText?: string
  description?: string
  status?: string
  tags?: string[]
  createdAt?: string
}

export interface UploadImagesResponse extends Array<GalleryImage> {}

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
    const parsed = JSON.parse(text) as GetMyPropertyResponse
    return parsed
  } catch (error) {
    // Se não conseguir fazer parse, retornar null
    return null
  }
}

/**
 * Busca uma propriedade pública por ID
 * @param propertyId - ID da propriedade
 */
export async function getPublicPropertyById(propertyId: string): Promise<Property> {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('Usuário não autenticado')
  }

  const response = await fetch(`${API_BASE_URL}/public/properties/${propertyId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Propriedade não encontrada')
    }
    const error = await response.json().catch(() => ({
      message: `Erro ${response.status}: ${response.statusText}`,
    }))
    throw new Error(error.message || 'Erro ao buscar propriedade')
  }

  return handleResponse<Property>(response)
}

/**
 * Busca todas as imagens de uma propriedade pública
 * @param propertyId - ID da propriedade
 */
export async function getPublicPropertyImages(propertyId: string): Promise<string[]> {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('Usuário não autenticado')
  }

  try {
    const response = await fetch(`${API_BASE_URL}/public/properties/${propertyId}/images`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return []
      }
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    
    // A API retorna um objeto com { images: [...], total: number } ou um array direto
    let imageObjects: GalleryImage[] = []
    
    if (Array.isArray(data)) {
      imageObjects = data
    } else if (data.images && Array.isArray(data.images)) {
      imageObjects = data.images
    } else {
      return []
    }
    
    // Extrair URLs das imagens
    // Prioriza: url (original) > fileUrl (arquivo original) > thumbnailUrl (versão comprimida)
    // Isso garante que sempre usemos a melhor qualidade disponível
    const imageUrls = imageObjects.map((img: GalleryImage) => {
      // Primeiro tenta url (URL completa da imagem)
      // Depois fileUrl (caminho do arquivo original)
      // Por último thumbnailUrl (versão comprimida/miniatura)
      const url = img.url || img.fileUrl || img.thumbnailUrl
      
      // Log para debug: verificar qual URL está sendo usada
      if (img.thumbnailUrl && !img.url && !img.fileUrl) {
      }
      
      return url
    }).filter((url: string) => url && url.trim() !== '')
    
    
    return imageUrls
  } catch (error) {
    return []
  }
}

/**
 * Faz upload de imagens para uma propriedade do usuário público
 * @param propertyId - ID da propriedade
 * @param files - Array de arquivos de imagem (máximo 5 por requisição)
 */
export async function uploadPropertyImages(
  propertyId: string,
  files: File[]
): Promise<UploadImagesResponse> {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('Usuário não autenticado')
  }

  if (!files || files.length === 0) {
    throw new Error('Nenhum arquivo enviado')
  }

  // Validar tipos de arquivo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Formato de arquivo não suportado: ${file.type}. Use JPEG, PNG ou WebP.`)
    }
  }

  const formData = new FormData()
  files.forEach((file) => {
    formData.append('images', file)
  })

  const response = await fetch(`${API_BASE_URL}/public/properties/${propertyId}/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `Erro ${response.status}: ${response.statusText}`
    
    try {
      if (errorText && errorText.trim().length > 0) {
        const error = JSON.parse(errorText)
        errorMessage = error.message || errorMessage
      }
    } catch {
      // Usar mensagem padrão se não conseguir fazer parse
    }
    
    throw new Error(errorMessage)
  }

  const contentType = response.headers.get('content-type')
  const text = await response.text()
  
  if (!text || text.trim().length === 0) {
    throw new Error('Resposta vazia do servidor')
  }
  
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Resposta não é JSON válido')
  }
  
  try {
    return JSON.parse(text) as UploadImagesResponse
  } catch (error) {
    throw new Error('Erro ao fazer parse da resposta JSON')
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

