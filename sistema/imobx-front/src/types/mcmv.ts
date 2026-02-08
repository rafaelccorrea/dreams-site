/**
 * Tipos TypeScript para integração com APIs MCMV
 */

// ==================== TIPOS E ENUMS ====================

/**
 * Faixa de renda MCMV
 * Usado tanto em Clientes quanto em Propriedades
 */
export type McmvIncomeRange = 'faixa1' | 'faixa2' | 'faixa3';

// ==================== LEADS ====================

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'converted'
  | 'lost';

export interface MCMVLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  monthlyIncome: number;
  familySize: number;
  incomeRange: string;
  eligible: boolean;
  city: string;
  state: string;
  status: LeadStatus;
  score: number;
  clientId: string | null;
  companyId: string | null;
  assignedToUserId: string | null;
  lastContactAt: string | null;
  followUpCount: number;
  rating: number | null;
  ratingComment?: string | null;
  ratedByUserId?: string | null;
  ratedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadsListResponse {
  items: MCMVLead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface LeadFilters {
  status?: LeadStatus;
  city?: string;
  state?: string;
  eligible?: boolean;
  minScore?: number;
  page?: number;
  limit?: number;
}

export interface UpdateLeadStatusRequest {
  status: LeadStatus;
}

export interface AssignLeadRequest {
  userId: string | null;
}

export interface RateLeadRequest {
  rating: number; // 1-5
  comment?: string; // máximo 1000 caracteres
}

export interface ConvertLeadResponse {
  clientId: string;
  lead: MCMVLead;
}

// ==================== BLACKLIST ====================

export interface BlacklistEntry {
  id: string;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  reason: string;
  isPermanent: boolean;
  expiresAt: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlacklistEntryRequest {
  cpf?: string;
  email?: string;
  phone?: string;
  reason: string;
  isPermanent?: boolean;
  expiresAt?: string | null;
}

export interface UpdateBlacklistEntryRequest {
  reason?: string;
  isPermanent?: boolean;
  expiresAt?: string | null;
}

export interface BlacklistFilters {
  cpf?: string;
  email?: string;
  phone?: string;
  isPermanent?: boolean;
  expired?: boolean;
}

// ==================== TEMPLATES ====================

export type TemplateType = 'email' | 'whatsapp' | 'sms';

export interface MCMVTemplate {
  id: string;
  name: string;
  content: string;
  type: TemplateType;
  companyId: string | null;
  variables: string[];
  isActive: boolean;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateRequest {
  name: string;
  content: string;
  type: TemplateType;
  variables?: string[];
  description?: string;
  isActive?: boolean;
}

export interface UpdateTemplateRequest {
  name?: string;
  content?: string;
  type?: TemplateType;
  variables?: string[];
  description?: string;
  isActive?: boolean;
}
