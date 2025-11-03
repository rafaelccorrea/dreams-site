/**
 * Serviço para integração com API pública do IMOBX
 */

const API_BASE_URL = 'http://localhost:3000/public'

export interface Property {
  id: string
  code: string | null
  title: string
  description: string
  type: 'house' | 'apartment' | 'commercial' | 'land' | 'rural'
  status: 'available' | 'rented'
  address: string
  street: string
  number: string
  complement?: string | null
  city: string
  state: string
  zipCode: string
  neighborhood: string
  totalArea: string | number // Pode vir como string da API
  builtArea: string | number | null // Pode vir como string da API
  bedrooms: number
  bathrooms: number
  parkingSpaces: number
  salePrice: string | number | null // Pode vir como string da API
  rentPrice: string | number | null // Pode vir como string da API
  condominiumFee?: string | number | null // Pode vir como string da API
  iptu?: string | number | null // Pode vir como string da API
  features: string[]
  isActive: boolean
  isFeatured: boolean
  isAvailableForSite: boolean
  companyId: string
  responsibleUserId: string
  createdAt: string
  updatedAt: string
  imageCount: number
  hasPendingFinancialApproval?: boolean
  pendingFinancialApprovalId?: string | null
  pendingFinancialApprovalStatus?: string | null
  mainImage?: {
    id: string
    url: string
    thumbnailUrl?: string
  }
  company?: {
    id: string
    name: string
    logo?: string
    phone: string
    email: string
    website?: string | null
  }
  responsibleUser?: {
    id: string
    name: string
    email: string
    phone?: string
    avatar?: string
  }
}

export interface PropertyListResponse {
  properties: Property[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PropertySearchFilters {
  city: string // ✅ Obrigatório
  state?: string
  type?: 'house' | 'apartment' | 'commercial' | 'land' | 'rural'
  neighborhood?: string
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  bedrooms?: number
  bathrooms?: number
  parkingSpaces?: number
  isFeatured?: boolean
  search?: string
  companyId?: string
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  page?: number
  limit?: number
}

export interface City {
  city: string
  state: string
  count: number
}

export interface Company {
  id: string
  name: string
  logo?: string | null
  city: string
  state?: string
  propertyCount: number
  phone?: string
  email?: string
  website?: string | null
  address?: string
  description?: string
  brokerCount?: number
  cnpj?: string
  corporateName?: string
  zipCode?: string
}

export interface Broker {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  city: string
  propertyCount: number
  company?: {
    id: string
    name: string
    city: string
    state: string
  }
}

/**
 * Busca propriedades públicas com filtros
 */
export async function searchProperties(
  filters: PropertySearchFilters
): Promise<PropertyListResponse> {
    const params = new URLSearchParams()

    // Cidade é obrigatória ✅
    params.append('city', filters.city)

    // Filtros de localização
    if (filters.state) params.append('state', filters.state)
    if (filters.neighborhood) params.append('neighborhood', filters.neighborhood)
  
  // Filtros de tipo e características
  if (filters.type) params.append('type', filters.type)
  if (filters.bedrooms !== undefined) params.append('bedrooms', filters.bedrooms.toString())
  if (filters.bathrooms !== undefined) params.append('bathrooms', filters.bathrooms.toString())
  if (filters.parkingSpaces !== undefined) params.append('parkingSpaces', filters.parkingSpaces.toString())
  
  // Filtros de preço
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString())
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString())
  
  // Filtros de área
  if (filters.minArea !== undefined) params.append('minArea', filters.minArea.toString())
  if (filters.maxArea !== undefined) params.append('maxArea', filters.maxArea.toString())
  
  // Filtros especiais
  if (filters.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured.toString())
  if (filters.search) params.append('search', filters.search)
  if (filters.companyId) params.append('companyId', filters.companyId)
  
  // Ordenação
  if (filters.sortBy) params.append('sortBy', filters.sortBy)
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)
  
  // Paginação
  if (filters.page) params.append('page', filters.page.toString())
  if (filters.limit) params.append('limit', filters.limit.toString())

  try {
    const response = await fetch(`${API_BASE_URL}/properties?${params}`)

    if (!response.ok) {
      // Se for erro 400 (Bad Request) ou 404, retorna resposta vazia
      if (response.status === 400 || response.status === 404) {
        return {
          properties: [],
          total: 0,
          page: 1,
          limit: filters.limit || 50,
          totalPages: 0,
        }
      }

      // Para outros erros, tenta ler a mensagem
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Nada foi encontrado')
    }

    return response.json()
  } catch (error) {
    // Erro de rede ou outros erros - retorna resposta vazia amigável
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Erro de conexão
      return {
        properties: [],
        total: 0,
        page: 1,
        limit: filters.limit || 50,
        totalPages: 0,
      }
    }

    // Re-lança o erro para ser tratado no componente
    throw error
  }
}

/**
 * Busca detalhes de uma propriedade por ID
 */
export async function getPropertyById(id: string): Promise<Property> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Nada foi encontrado')
      }
      throw new Error('Nada foi encontrado')
    }

    return response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Nada foi encontrado')
    }
    throw error
  }
}

/**
 * Lista cidades disponíveis
 */
export async function getAvailableCities(): Promise<City[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/cities`)

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.cities || []
  } catch (error) {
    return []
  }
}

/**
 * Lista imobiliárias disponíveis
 * @param city - Cidade obrigatória para buscar imobiliárias
 */
export async function getAvailableCompanies(city: string): Promise<Company[]> {
  try {
    if (!city) {
      throw new Error('Cidade é obrigatória para buscar imobiliárias')
    }

    const url = `${API_BASE_URL}/properties/companies?city=${encodeURIComponent(city)}`

    const response = await fetch(url)

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.companies || []
  } catch (error) {
    return []
  }
}

/**
 * Obtém detalhes de uma imobiliária específica
 */
export async function getCompanyById(id: string): Promise<Company | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/companies/${id}`)
    
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao buscar detalhes da imobiliária:', error)
    return null
  }
}

/**
 * Lista corretores disponíveis
 * Requer o parâmetro city obrigatório
 * @param city - Cidade obrigatória
 * @param companyId - ID da imobiliária (opcional) para filtrar corretores
 */
export async function getAvailableBrokers(city: string, companyId?: string): Promise<Broker[]> {
  if (!city) {
    console.warn('getAvailableBrokers requer o parâmetro city')
    return []
  }

  try {
    const params = new URLSearchParams()
    params.append('city', city)
    if (companyId) {
      params.append('companyId', companyId)
    }

    const url = `${API_BASE_URL}/properties/brokers?${params.toString()}`

    const response = await fetch(url)

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.brokers || []
  } catch (error) {
    console.error('Erro ao buscar corretores:', error)
    return []
  }
}

/**
 * Obtém detalhes de um corretor específico
 */
export async function getBrokerById(id: string): Promise<Broker | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/brokers/${id}`)
    
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao buscar detalhes do corretor:', error)
    return null
  }
}

/**
 * Busca propriedades de um corretor específico
 */
export async function getBrokerProperties(
  brokerId: string,
  page: number = 1,
  limit: number = 12
): Promise<PropertyListResponse> {
  try {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await fetch(`${API_BASE_URL}/properties/brokers/${brokerId}?${params.toString()}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          properties: [],
          total: 0,
          page: 1,
          limit,
          totalPages: 0,
        }
      }
      throw new Error('Erro ao buscar propriedades do corretor')
    }

    const data = await response.json()
    
    // Se a resposta já contém as propriedades diretamente
    if (data.properties && Array.isArray(data.properties)) {
      return {
        properties: data.properties,
        total: data.total || data.properties.length,
        page: data.page || page,
        limit: data.limit || limit,
        totalPages: data.totalPages || Math.ceil((data.total || data.properties.length) / limit),
      }
    }
    
    // Se a resposta é um objeto com propriedades aninhadas
    if (data.broker && data.broker.properties) {
      return {
        properties: data.broker.properties,
        total: data.total || data.broker.properties.length,
        page: data.page || page,
        limit: data.limit || limit,
        totalPages: data.totalPages || Math.ceil((data.total || data.broker.properties.length) / limit),
      }
    }
    
    // Retorno padrão se não encontrar propriedades
    return {
      properties: [],
      total: 0,
      page: 1,
      limit,
      totalPages: 0,
    }
  } catch (error) {
    console.error('Erro ao buscar propriedades do corretor:', error)
    return {
      properties: [],
      total: 0,
      page: 1,
      limit,
      totalPages: 0,
    }
  }
}

// Cache de imagens para evitar múltiplas chamadas
const imageCache = new Map<string, { images: string[], timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos
const pendingRequests = new Map<string, Promise<string[]>>()

/**
 * Busca todas as imagens de uma propriedade pública
 * Retorna array de URLs das imagens
 * Usa cache e evita chamadas duplicadas simultâneas
 */
export async function getPropertyImages(propertyId: string): Promise<string[]> {
  // Verifica cache primeiro
  const cached = imageCache.get(propertyId)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.images
  }

  // Se já existe uma requisição em andamento, retorna a mesma Promise
  if (pendingRequests.has(propertyId)) {
    return pendingRequests.get(propertyId)!
  }

  // Cria nova requisição
  const requestPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/images`)

      if (!response.ok) {
        // Se não houver endpoint específico, retorna array vazio
        if (response.status !== 404) {
          console.warn(`Endpoint de imagens não encontrado (${response.status}) para propriedade ${propertyId}`)
        }
        return []
      }

      const data = await response.json()
      
      // A API pode retornar { images: [...], total: number } OU um array direto
      let imageObjects: any[] = []
      
      // Se retornar array direto (formato mais comum)
      if (Array.isArray(data)) {
        imageObjects = data
      } else if (data.images && Array.isArray(data.images)) {
        // Se retornar objeto com propriedade images
        imageObjects = data.images
      } else {
        console.warn(`[getPropertyImages] Formato de resposta não reconhecido para ${propertyId}:`, data)
        return []
      }
      
      // Processa as imagens e mantém TODAS, mesmo que URLs sejam iguais
      // Não remove duplicatas - mantém todas as imagens retornadas pela API
      const imageUrls: string[] = []
      
      imageObjects.forEach((img: any) => {
        if (typeof img === 'string') {
          // Se for string, adiciona diretamente
          if (img && img.trim() !== '') {
            imageUrls.push(img)
          }
        } else {
          // Prioriza url sobre thumbnailUrl
          const imgUrl = img.url || img.thumbnailUrl || ''
          if (imgUrl && imgUrl.trim() !== '') {
            // Adiciona TODAS as URLs, mesmo que sejam iguais
            imageUrls.push(imgUrl)
          }
        }
      })
      
      console.log(`[getPropertyImages] ${propertyId}: ${imageObjects.length} imagens recebidas, ${imageUrls.length} URLs extraídas (mantendo duplicatas)`)
      
      // Salva no cache
      imageCache.set(propertyId, {
        images: imageUrls,
        timestamp: Date.now()
      })
      
      // Remove da lista de requisições pendentes
      pendingRequests.delete(propertyId)
      
      return imageUrls
    } catch (error) {
      console.error('Erro ao buscar imagens:', error)
      // Remove da lista de requisições pendentes em caso de erro
      pendingRequests.delete(propertyId)
      return []
    }
  })()

  // Adiciona à lista de requisições pendentes
  pendingRequests.set(propertyId, requestPromise)

  return requestPromise
}

