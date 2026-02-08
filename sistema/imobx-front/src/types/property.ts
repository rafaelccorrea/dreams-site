// Enums para tipos e status de propriedades
export const PropertyType = {
  HOUSE: 'house',
  APARTMENT: 'apartment',
  COMMERCIAL: 'commercial',
  LAND: 'land',
  RURAL: 'rural',
} as const;

export const PropertyStatus = {
  AVAILABLE: 'available',
  RENTED: 'rented',
  SOLD: 'sold',
  MAINTENANCE: 'maintenance',
  DRAFT: 'draft',
} as const;

export type PropertyType = (typeof PropertyType)[keyof typeof PropertyType];
export type PropertyStatus =
  (typeof PropertyStatus)[keyof typeof PropertyStatus];

// Interface principal da propriedade
export interface Property {
  id: string;
  code?: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  address: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
  neighborhood: string;
  totalArea: number;
  builtArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  salePrice?: number;
  rentPrice?: number;
  price?: number; // Campo genérico para preço
  area?: number; // Campo genérico para área
  condominiumFee?: number;
  iptu?: number;
  features: string[];
  isActive: boolean;
  isFeatured: boolean;
  isAvailableForSite?: boolean;
  companyId: string;
  responsibleUserId: string;
  capturedById?: string;
  capturedBy?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  imageCount?: number;
  images?: Array<{
    id: string;
    url: string;
    thumbnailUrl?: string;
    category: string;
    isMain: boolean;
    createdAt: string;
  }>;
  mainImage?: {
    id: string;
    url: string;
    thumbnailUrl?: string;
  };
  clients?: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    type: string;
    status: string;
    interestType: string;
    notes?: string;
    contactedAt?: string;
    createdAt: string;
    responsibleUserName: string;
  }>;
  clientCount?: number;
  // Campos de aprovação financeira
  hasPendingFinancialApproval?: boolean;
  pendingFinancialApprovalId?: string;
  pendingFinancialApprovalStatus?: 'pending' | 'approved' | 'rejected';
  // Informações de corretor e imobiliária (disponíveis na API pública)
  responsibleUser?: {
    id: string;
    name: string;
    email: string;
  };
  company?: {
    id: string;
    name: string;
  };
  // Campos MCMV (disponíveis apenas para empresas com módulo MCMV habilitado)
  mcmvEligible?: boolean;
  mcmvIncomeRange?: 'faixa1' | 'faixa2' | 'faixa3' | null;
  mcmvMaxValue?: number | null;
  mcmvSubsidy?: number | null;
  mcmvDocumentation?: string[];
  mcmvNotes?: string | null;
  // Campos de negociação
  acceptsNegotiation?: boolean;
  minSalePrice?: number;
  minRentPrice?: number;
  offerBelowMinSaleAction?: 'reject' | 'pending' | 'notify';
  offerBelowMinRentAction?: 'reject' | 'pending' | 'notify';
  // Informações de ofertas
  totalOffersCount?: number;
  pendingOffersCount?: number;
  acceptedOffersCount?: number;
  rejectedOffersCount?: number;
  hasPendingOffers?: boolean;
  offers?: Array<{
    id: string;
    propertyId: string;
    publicUserId: string;
    publicUser?: {
      id: string;
      email: string;
      phone: string;
    };
    type: 'sale' | 'rental';
    status: 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'expired';
    offeredValue: number;
    message?: string;
    responseMessage?: string;
    createdAt: string;
    updatedAt: string;
    respondedAt?: string;
    respondedByUserId?: string;
  }>;
  // Informações do proprietário
  owner?: {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
    address?: string;
  };
  // Condomínio vinculado
  condominiumId?: string;
}

// Interface para criação de propriedade
export interface CreatePropertyData {
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  address: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
  neighborhood: string;
  totalArea: number;
  builtArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  salePrice?: number;
  rentPrice?: number;
  condominiumFee?: number;
  iptu?: number;
  features?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  isAvailableForSite?: boolean;
  // Campo obrigatório: ID do captador
  capturedById: string;
  // Campo existente: corretor responsável
  responsibleUserId?: string;
  // Campos MCMV (disponíveis apenas para empresas com módulo MCMV habilitado)
  mcmvEligible?: boolean;
  mcmvIncomeRange?: 'faixa1' | 'faixa2' | 'faixa3' | null;
  mcmvMaxValue?: number | null;
  mcmvSubsidy?: number | null;
  mcmvDocumentation?: string[];
  mcmvNotes?: string | null;
  // Campos de negociação
  acceptsNegotiation?: boolean;
  minSalePrice?: number;
  minRentPrice?: number;
  offerBelowMinSaleAction?: 'reject' | 'pending' | 'notify';
  offerBelowMinRentAction?: 'reject' | 'pending' | 'notify';
  // Informações de ofertas
  totalOffersCount?: number;
  pendingOffersCount?: number;
  acceptedOffersCount?: number;
  rejectedOffersCount?: number;
  hasPendingOffers?: boolean;
  offers?: Array<{
    id: string;
    propertyId: string;
    publicUserId: string;
    publicUser?: {
      id: string;
      email: string;
      phone: string;
    };
    type: 'sale' | 'rental';
    status: 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'expired';
    offeredValue: number;
    message?: string;
    responseMessage?: string;
    createdAt: string;
    updatedAt: string;
    respondedAt?: string;
    respondedByUserId?: string;
  }>;
  // Campos do proprietário (obrigatórios)
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerDocument: string;
  ownerAddress: string;
  // Condomínio vinculado
  condominiumId?: string;
}

// Interface para atualização de propriedade
export interface UpdatePropertyData extends Partial<CreatePropertyData> {
  id?: string;
}

// Interface para filtros de propriedades
export interface PropertyFilters {
  type?: PropertyType;
  status?: PropertyStatus;
  city?: string;
  state?: string;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  features?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  companyId?: string;
  responsibleUserId?: string;
  search?: string;
  onlyMyData?: boolean;
  // Novos filtros para busca por corretor/imobiliária
  companyName?: string;
  responsibleUserName?: string;
}

// Interface para opções de paginação
export interface PaginationOptions {
  page: number;
  limit: number;
}

// Interface para resposta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface para resposta de propriedades
export interface PropertyResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Opções para select de tipos
export const PropertyTypeOptions = [
  { value: PropertyType.HOUSE, label: 'Casa' },
  { value: PropertyType.APARTMENT, label: 'Apartamento' },
  { value: PropertyType.COMMERCIAL, label: 'Comercial' },
  { value: PropertyType.LAND, label: 'Terreno' },
  { value: PropertyType.RURAL, label: 'Rural' },
];

// Opções para select de status
export const PropertyStatusOptions = [
  { value: PropertyStatus.DRAFT, label: 'Rascunho' },
  { value: PropertyStatus.AVAILABLE, label: 'Disponível' },
  { value: PropertyStatus.RENTED, label: 'Alugado' },
  { value: PropertyStatus.SOLD, label: 'Vendido' },
  { value: PropertyStatus.MAINTENANCE, label: 'Manutenção' },
];

// Estados brasileiros para select
export const BrazilianStates = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

// Características comuns para propriedades
export const CommonFeatures = [
  'Ar condicionado',
  'Aquecimento',
  'Elevador',
  'Portaria 24h',
  'Segurança 24h',
  'Piscina',
  'Academia',
  'Playground',
  'Churrasqueira',
  'Área gourmet',
  'Jardim',
  'Terraço',
  'Varanda',
  'Sacada',
  'Vista para o mar',
  'Vista para a montanha',
  'Próximo ao metrô',
  'Próximo a escolas',
  'Próximo a hospitais',
  'Próximo a shopping',
  'Garagem coberta',
  'Garagem descoberta',
  'Depósito',
  'Lavanderia',
  'Closet',
  'Home office',
  'Lareira',
  'Sistema de alarme',
  'Câmeras de segurança',
  'Interfone',
  'Antena parabólica',
  'TV a cabo',
  'Internet',
  'Gás encanado',
  'Água quente',
  'Energia solar',
  'Mobiliado',
  'Semi-mobiliado',
  'Pronto para morar',
  'Em construção',
  'Novo',
  'Usado',
];

// Tipos para busca inteligente de propriedades
export const PropertyOperation = {
  RENT: 'rent',
  SALE: 'sale',
} as const;

export type PropertyOperation =
  (typeof PropertyOperation)[keyof typeof PropertyOperation];

export interface IntelligentSearchFilters {
  // Cliente para busca baseada em perfil
  clientId?: string;

  // Tipo e operação
  type?: PropertyType;
  operation?: PropertyOperation;

  // Localização
  city?: string;
  state?: string;
  neighborhood?: string;

  // Faixa de valores
  minValue?: number;
  maxValue?: number;

  // Características
  minBedrooms?: number;
  minBathrooms?: number;
  minParkingSpaces?: number;
  minArea?: number;
  maxArea?: number;

  // Comodidades
  features?: string[];

  // Escopo de busca
  onlyMyProperties?: boolean;
  searchInGroupCompanies?: boolean;
  includeOtherBrokers?: boolean;

  // Paginação
  page?: number;
  limit?: number;
}

export interface IntelligentSearchResult {
  property: Property;
  matchScore: number;
  matchReasons: string[];
  responsibleBroker: {
    id: string;
    name: string;
    email: string;
  };
  company: {
    id: string;
    name: string;
  };
}

export interface IntelligentSearchStats {
  totalFound: number;
  fromMyProperties: number;
  fromOtherBrokers: number;
  fromGroupCompanies: number;
}

export interface IntelligentSearchResponse {
  results: IntelligentSearchResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  searchStats: IntelligentSearchStats;
}

// Opções para select de operação
export const PropertyOperationOptions = [
  { value: PropertyOperation.RENT, label: 'Aluguel' },
  { value: PropertyOperation.SALE, label: 'Venda' },
];

// Re-export removido para evitar conflito
