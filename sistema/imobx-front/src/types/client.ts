import type { Attachment } from './attachment';

export const ClientType = {
  BUYER: 'buyer',
  SELLER: 'seller',
  RENTER: 'renter',
  LESSOR: 'lessor',
  INVESTOR: 'investor',
  GENERAL: 'general',
} as const;

export type ClientType = (typeof ClientType)[keyof typeof ClientType];

export const ClientStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  CONTACTED: 'contacted',
  INTERESTED: 'interested',
  CLOSED: 'closed',
} as const;

export type ClientStatus = (typeof ClientStatus)[keyof typeof ClientStatus];

export const CLIENT_TYPE_LABELS: { [key in ClientType]: string } = {
  [ClientType.BUYER]: 'Comprador',
  [ClientType.SELLER]: 'Vendedor',
  [ClientType.RENTER]: 'Locatário',
  [ClientType.LESSOR]: 'Locador',
  [ClientType.INVESTOR]: 'Investidor',
  [ClientType.GENERAL]: 'Geral',
};

export const CLIENT_STATUS_LABELS: { [key in ClientStatus]: string } = {
  [ClientStatus.ACTIVE]: 'Ativo',
  [ClientStatus.INACTIVE]: 'Inativo',
  [ClientStatus.CONTACTED]: 'Contactado',
  [ClientStatus.INTERESTED]: 'Interessado',
  [ClientStatus.CLOSED]: 'Fechado',
};

export const CLIENT_STATUS_COLORS: { [key in ClientStatus]: string } = {
  [ClientStatus.ACTIVE]: '#10B981',
  [ClientStatus.INACTIVE]: '#6B7280',
  [ClientStatus.CONTACTED]: '#3B82F6',
  [ClientStatus.INTERESTED]: '#F59E0B',
  [ClientStatus.CLOSED]: '#DC2626',
};

export const CLIENT_TYPE_COLORS: { [key in ClientType]: string } = {
  [ClientType.BUYER]: '#059669',
  [ClientType.SELLER]: '#DC2626',
  [ClientType.RENTER]: '#2563EB',
  [ClientType.LESSOR]: '#7C3AED',
  [ClientType.INVESTOR]: '#D97706',
  [ClientType.GENERAL]: '#6B7280',
};

// Enums importados de useClients para labels
export const MaritalStatus = {
  SINGLE: 'single',
  MARRIED: 'married',
  DIVORCED: 'divorced',
  WIDOWED: 'widowed',
  SEPARATED: 'separated',
  COMMON_LAW: 'common_law',
} as const;

export const EmploymentStatus = {
  EMPLOYED: 'employed',
  UNEMPLOYED: 'unemployed',
  RETIRED: 'retired',
  SELF_EMPLOYED: 'self_employed',
  STUDENT: 'student',
  FREELANCER: 'freelancer',
} as const;

export const ClientSource = {
  WHATSAPP: 'whatsapp',
  SOCIAL_MEDIA: 'social_media',
  PHONE: 'phone',
  OLX: 'olx',
  ZAP_IMOVEIS: 'zap_imoveis',
  VIVA_REAL: 'viva_real',
  DREAM_KEYS: 'dream_keys', // Site público Dream Keys - usado para leads MCMV
  OTHER: 'other',
} as const;

export type MaritalStatus = (typeof MaritalStatus)[keyof typeof MaritalStatus];
export type EmploymentStatus =
  (typeof EmploymentStatus)[keyof typeof EmploymentStatus];
export type ClientSource = (typeof ClientSource)[keyof typeof ClientSource];

// Labels para Estado Civil
export const MARITAL_STATUS_LABELS: { [key: string]: string } = {
  [MaritalStatus.SINGLE]: 'Solteiro(a)',
  [MaritalStatus.MARRIED]: 'Casado(a)',
  [MaritalStatus.DIVORCED]: 'Divorciado(a)',
  [MaritalStatus.WIDOWED]: 'Viúvo(a)',
  [MaritalStatus.SEPARATED]: 'Separado(a)',
  [MaritalStatus.COMMON_LAW]: 'União Estável',
};

// Labels para Situação Profissional
export const EMPLOYMENT_STATUS_LABELS: { [key: string]: string } = {
  [EmploymentStatus.EMPLOYED]: 'Empregado',
  [EmploymentStatus.UNEMPLOYED]: 'Desempregado',
  [EmploymentStatus.RETIRED]: 'Aposentado',
  [EmploymentStatus.SELF_EMPLOYED]: 'Autônomo',
  [EmploymentStatus.STUDENT]: 'Estudante',
  [EmploymentStatus.FREELANCER]: 'Freelancer',
};

// Labels para Origem do Lead
export const CLIENT_SOURCE_LABELS: { [key: string]: string } = {
  [ClientSource.WHATSAPP]: 'WhatsApp',
  [ClientSource.SOCIAL_MEDIA]: 'Redes Sociais',
  [ClientSource.PHONE]: 'Telefone',
  [ClientSource.OLX]: 'OLX',
  [ClientSource.ZAP_IMOVEIS]: 'Zap Imóveis',
  [ClientSource.VIVA_REAL]: 'VivaReal',
  [ClientSource.DREAM_KEYS]: 'Dream Keys - Site',
  [ClientSource.OTHER]: 'Outros',
};

// Cores para Origem do Lead
export const CLIENT_SOURCE_COLORS: { [key: string]: string } = {
  [ClientSource.WHATSAPP]: '#25D366',
  [ClientSource.SOCIAL_MEDIA]: '#1877F2',
  [ClientSource.PHONE]: '#6B7280',
  [ClientSource.OLX]: '#6E0AD6',
  [ClientSource.ZAP_IMOVEIS]: '#FF6B00',
  [ClientSource.VIVA_REAL]: '#E63888',
  [ClientSource.DREAM_KEYS]: '#10B981',
  [ClientSource.OTHER]: '#9CA3AF',
};

// Opções de tipo de contrato
export const CONTRACT_TYPE_OPTIONS = [
  'CLT',
  'PJ (Pessoa Jurídica)',
  'Contrato Temporário',
  'Estágio',
  'Autônomo',
  'Outro',
];

// Opções de tipo de conta bancária
export const ACCOUNT_TYPE_OPTIONS = [
  'Conta Corrente',
  'Conta Poupança',
  'Conta Salário',
  'Conta Digital',
];

export interface ClientInteraction {
  id: string;
  clientId: string;
  companyId: string;
  createdById: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  title?: string | null;
  notes: string;
  interactionAt?: string | null;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientInteractionDto {
  title?: string;
  notes: string;
  interactionAt?: string;
  attachments?: Attachment[];
}

export type UpdateClientInteractionDto = Partial<CreateClientInteractionDto>;
