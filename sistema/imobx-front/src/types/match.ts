/**
 * Tipos para o sistema de Matches
 * Sistema inteligente de compatibilidade cliente-imóvel
 */

export type MatchStatus =
  | 'pending'
  | 'viewed'
  | 'accepted'
  | 'contacted'
  | 'scheduled'
  | 'ignored'
  | 'not_interested'
  | 'completed'
  | 'expired';

export const MatchStatus = {
  PENDING: 'pending' as const,
  VIEWED: 'viewed' as const,
  ACCEPTED: 'accepted' as const,
  CONTACTED: 'contacted' as const,
  SCHEDULED: 'scheduled' as const,
  IGNORED: 'ignored' as const,
  NOT_INTERESTED: 'not_interested' as const,
  COMPLETED: 'completed' as const,
  EXPIRED: 'expired' as const,
};

export type IgnoreReason =
  | 'price_too_high'
  | 'price_too_low'
  | 'location_bad'
  | 'already_shown'
  | 'client_not_interested'
  | 'property_sold'
  | 'other';

export const IgnoreReason = {
  PRICE_TOO_HIGH: 'price_too_high' as const,
  PRICE_TOO_LOW: 'price_too_low' as const,
  LOCATION_BAD: 'location_bad' as const,
  ALREADY_SHOWN: 'already_shown' as const,
  CLIENT_NOT_INTERESTED: 'client_not_interested' as const,
  PROPERTY_SOLD: 'property_sold' as const,
  OTHER: 'other' as const,
};

export interface PropertySummary {
  id: string;
  title: string;
  code?: string;
  salePrice?: number;
  rentPrice?: number;
  address?: string;
  city?: string;
  neighborhood?: string;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  builtArea?: number;
  area?: number;
  images?: Array<
    | string
    | {
        id?: string;
        url: string;
        thumbnailUrl?: string;
        isMain?: boolean;
        category?: string;
      }
  >;
  mainImage?: {
    id?: string;
    url: string;
    thumbnailUrl?: string;
  };
}

export interface ClientSummary {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  cpf?: string;
  type?: string;
}

export interface DesiredFeatures {
  hasGarage?: boolean;
  hasPool?: boolean;
  hasGarden?: boolean;
  hasBalcony?: boolean;
  hasGrill?: boolean;
  hasElevator?: boolean;
  isFurnished?: boolean;
  petsAllowed?: boolean;
  hasAirConditioning?: boolean;
  hasGatedCommunity?: boolean;
  hasSportsArea?: boolean;
  hasPartyRoom?: boolean;
  hasPlayground?: boolean;
  hasSecurity?: boolean;
  garageSpots?: number;
  other?: string[];
}

export interface MatchDetails {
  priceMatch: boolean;
  pricePercentage: number;
  locationMatch: boolean;
  typeMatch: boolean;
  sizeMatch: boolean;
  bedroomsMatch: boolean;
  bathroomsMatch: boolean;
  reasons: string[];
}

export interface PropertyClientMatch {
  id: string;
  matchScore: number;
  propertyId: string;
  clientId: string;
  property: PropertySummary;
  client: ClientSummary;
  matchDetails: MatchDetails;
}

export interface Match {
  id: string;
  matchScore: number; // 0-100
  status: MatchStatus;

  property: PropertySummary;
  client: ClientSummary;
  matchDetails: MatchDetails;

  // Flags de automação
  taskCreated: boolean;
  appointmentCreated: boolean;
  emailSent: boolean;
  notificationSent: boolean;

  // Timestamps
  createdAt: string;
  viewedAt?: string;
  actionTakenAt?: string;

  // Para matches ignorados
  ignoreReason?: IgnoreReason;
  notes?: string;
}

export interface MatchListResponse {
  matches: Match[];
  total: number;
  page: number;
  totalPages: number;
}

export interface MatchSummary {
  total: number;
  pending: number;
  accepted: number;
  ignored: number;
  highScore: number;
}

export interface AcceptMatchResponse {
  message: string;
  match: {
    id: string;
    status: MatchStatus;
    taskCreated: boolean;
    actionTakenAt: string;
  };
}

export interface IgnoreMatchRequest {
  reason: IgnoreReason;
  notes?: string;
}

export interface IgnoreMatchResponse {
  message: string;
  match: {
    id: string;
    status: MatchStatus;
    ignoreReason: IgnoreReason;
    notes?: string;
    actionTakenAt: string;
  };
}

export const IGNORE_REASON_LABELS: Record<
  IgnoreReason,
  { label: string; icon: string }
> = {
  [IgnoreReason.PRICE_TOO_HIGH]: { label: 'Preço muito alto', icon: '💰' },
  [IgnoreReason.PRICE_TOO_LOW]: {
    label: 'Preço muito baixo (suspeito)',
    icon: '💸',
  },
  [IgnoreReason.LOCATION_BAD]: { label: 'Localização ruim', icon: '📍' },
  [IgnoreReason.ALREADY_SHOWN]: { label: 'Já mostrado ao cliente', icon: '👁️' },
  [IgnoreReason.CLIENT_NOT_INTERESTED]: {
    label: 'Cliente não se interessou',
    icon: '😐',
  },
  [IgnoreReason.PROPERTY_SOLD]: { label: 'Imóvel já vendido', icon: '🏷️' },
  [IgnoreReason.OTHER]: { label: 'Outro motivo', icon: '🔹' },
};

export const MATCH_STATUS_LABELS: Record<
  MatchStatus,
  { label: string; icon: string; color: string }
> = {
  [MatchStatus.PENDING]: { label: 'Pendente', icon: '⏳', color: 'yellow' },
  [MatchStatus.VIEWED]: { label: 'Visualizado', icon: '👁️', color: 'blue' },
  [MatchStatus.ACCEPTED]: { label: 'Aceito', icon: '✅', color: 'green' },
  [MatchStatus.CONTACTED]: { label: 'Contatado', icon: '📞', color: 'blue' },
  [MatchStatus.SCHEDULED]: { label: 'Agendado', icon: '📅', color: 'purple' },
  [MatchStatus.IGNORED]: { label: 'Ignorado', icon: '❌', color: 'gray' },
  [MatchStatus.NOT_INTERESTED]: {
    label: 'Sem Interesse',
    icon: '🚫',
    color: 'red',
  },
  [MatchStatus.COMPLETED]: { label: 'Concluído', icon: '🎉', color: 'green' },
  [MatchStatus.EXPIRED]: { label: 'Expirado', icon: '⌛', color: 'gray' },
};
