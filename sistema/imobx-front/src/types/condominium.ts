// Tipos para o sistema de condomínios

export interface CondominiumImage {
  id: string;
  originalName: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: 'active' | 'inactive';
  category: string;
  altText: string;
  isMain: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface Condominium {
  id: string;
  name: string;
  description?: string;
  address: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  email?: string;
  cnpj?: string;
  website?: string;
  isActive: boolean;
  companyId: string;
  createdById: string;
  images: CondominiumImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCondominiumDto {
  name: string;
  description?: string;
  address: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  email?: string;
  cnpj?: string;
  website?: string;
}

export interface UpdateCondominiumDto extends Partial<CreateCondominiumDto> {
  isActive?: boolean;
}

export interface SimilarCondominium {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  similarityScore: number;
  isActive: boolean;
}

export interface SimilarityCheckResult {
  hasSimilar: boolean;
  similarCondominiums: SimilarCondominium[];
  count: number;
}

export interface CondominiumListFilters {
  search?: string;
  name?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'city' | 'createdAt' | 'updatedAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface CondominiumListResponse {
  data: Condominium[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}
