// Tipos globais da aplicação

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
}

// Responsividade
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Formulários
export interface FormFieldError {
  message: string
  type?: string
}

export type FormErrors<T> = Partial<Record<keyof T, FormFieldError>>

// Imagens
export interface ImageAsset {
  id: string
  url: string
  alt: string
  width?: number
  height?: number
}






















