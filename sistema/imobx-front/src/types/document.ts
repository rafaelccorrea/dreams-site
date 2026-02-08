// Tipos e Enums para o Módulo de Documentos

export const DocumentType = {
  CONTRACT: 'contract',
  IDENTITY: 'identity',
  PROOF_OF_ADDRESS: 'proof_of_address',
  PROOF_OF_INCOME: 'proof_of_income',
  DEED: 'deed',
  REGISTRATION: 'registration',
  TAX_DOCUMENT: 'tax_document',
  INSPECTION_REPORT: 'inspection_report',
  APPRAISAL: 'appraisal',
  PHOTO: 'photo',
  OTHER: 'other',
} as const;

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];

export const DocumentStatus = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type DocumentStatus =
  (typeof DocumentStatus)[keyof typeof DocumentStatus];

// Labels para exibição
export const DocumentTypeLabels: Record<DocumentType, string> = {
  [DocumentType.CONTRACT]: 'Contrato',
  [DocumentType.IDENTITY]: 'Identidade',
  [DocumentType.PROOF_OF_ADDRESS]: 'Comp. Endereço',
  [DocumentType.PROOF_OF_INCOME]: 'Comp. Renda',
  [DocumentType.DEED]: 'Escritura',
  [DocumentType.REGISTRATION]: 'Registro',
  [DocumentType.TAX_DOCUMENT]: 'Doc. Fiscal',
  [DocumentType.INSPECTION_REPORT]: 'Laudo Vistoria',
  [DocumentType.APPRAISAL]: 'Avaliação',
  [DocumentType.PHOTO]: 'Foto',
  [DocumentType.OTHER]: 'Outro',
};

export const DocumentStatusLabels: Record<DocumentStatus, string> = {
  [DocumentStatus.ACTIVE]: 'Ativo',
  [DocumentStatus.ARCHIVED]: 'Arquivado',
  [DocumentStatus.DELETED]: 'Deletado',
  [DocumentStatus.PENDING_REVIEW]: 'Pendente de Revisão',
  [DocumentStatus.APPROVED]: 'Aprovado',
  [DocumentStatus.REJECTED]: 'Rejeitado',
};

// Cores para badges
export const StatusColors: Record<
  DocumentStatus,
  { background: string; color: string }
> = {
  [DocumentStatus.ACTIVE]: { background: '#10b981', color: '#ffffff' },
  [DocumentStatus.ARCHIVED]: { background: '#6b7280', color: '#ffffff' },
  [DocumentStatus.DELETED]: { background: '#ef4444', color: '#ffffff' },
  [DocumentStatus.PENDING_REVIEW]: { background: '#f59e0b', color: '#ffffff' },
  [DocumentStatus.APPROVED]: { background: '#3b82f6', color: '#ffffff' },
  [DocumentStatus.REJECTED]: { background: '#ef4444', color: '#ffffff' },
};

// Informações de assinatura retornadas pela API
export interface DocumentSigner {
  id: string;
  name: string;
  email: string;
  status:
    | 'pending'
    | 'viewed'
    | 'signed'
    | 'rejected'
    | 'expired'
    | 'cancelled';
  signedAt?: Date | string;
  viewedAt?: Date | string;
  signatureUrl?: string; // Link de assinatura (só aparece se status for PENDING ou VIEWED e não estiver expirado)
  expiresAt?: Date | string; // Data de expiração
  isExpired?: boolean; // Indica se a assinatura está expirada
  daysUntilExpiration?: number; // Dias até a expiração (ou undefined se não houver data)
}

export interface DocumentSignaturesInfo {
  hasSignatures: boolean;
  total: number;
  pending: number;
  signed: number;
  rejected: number;
  expired: number;
  signers: DocumentSigner[];
}

export interface DocumentModel {
  id: string;
  originalName: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  fileExtension: string;
  type: DocumentType;
  status: DocumentStatus;
  title?: string;
  description?: string;
  tags?: string[];
  notes?: string;
  expiryDate?: Date | string;
  companyId: string;
  uploadedById: string;
  clientId?: string;
  propertyId?: string;
  isEncrypted: boolean;
  approvedAt?: Date | string;
  approvedById?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isForSignature?: boolean;
  signatures?: DocumentSignaturesInfo;
}

// Tipos para vínculos detalhados
export interface DocumentClient {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export interface DocumentProperty {
  id: string;
  title: string;
  code?: string;
  address: string;
  city: string;
  state: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  totalArea?: number;
  salePrice?: number;
  rentPrice?: number;
}

export interface DocumentUser {
  id: string;
  name: string;
  role: string;
}

// Tipo estendido com vínculos completos (retornado pela API de detalhes)
export interface DocumentWithDetails extends DocumentModel {
  client?: DocumentClient;
  property?: DocumentProperty;
  uploadedBy?: DocumentUser;
  approvedBy?: DocumentUser;
}

export interface UploadDocumentDto {
  file: File;
  type: DocumentType;
  clientId?: string;
  propertyId?: string;
  title?: string;
  description?: string;
  tags?: string[];
  notes?: string;
  expiryDate?: string;
  isEncrypted?: boolean;
}

export interface UpdateDocumentDto {
  type?: DocumentType;
  title?: string;
  description?: string;
  tags?: string[];
  notes?: string;
  expiryDate?: string;
  status?: DocumentStatus;
  clientId?: string | null;
  propertyId?: string | null;
}

export interface ListDocumentsParams {
  page?: number;
  limit?: number;
  type?: DocumentType;
  status?: DocumentStatus;
  clientId?: string;
  propertyId?: string;
  tags?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  onlyMyDocuments?: boolean;
}

// Entidade agrupada (cliente ou propriedade)
export interface GroupedEntity {
  id: string;
  name: string;
  cpf?: string;
  email?: string;
  phone?: string;
  type?: string;
  status?: string;
  // Campos adicionais para propriedade
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  bedrooms?: number;
  bathrooms?: number;
  totalArea?: number;
  salePrice?: number;
  rentPrice?: number;
}

// Grupo de documentos por entidade
export interface GroupedDocuments {
  entityType: 'client' | 'property';
  entity: GroupedEntity;
  documents: DocumentModel[];
}

export interface DocumentListResponse {
  documents: DocumentModel[];
  groupedDocuments?: GroupedDocuments[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

// ===========================
// UPLOAD TOKENS - Links Públicos de Upload
// ===========================

export const UploadTokenStatus = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  USED: 'used',
  REVOKED: 'revoked',
} as const;

export type UploadTokenStatus =
  (typeof UploadTokenStatus)[keyof typeof UploadTokenStatus];

export interface UploadToken {
  id: string;
  token: string;
  uploadUrl: string;
  clientId: string;
  clientName: string;
  clientCpfMasked: string;
  expiresAt: string;
  status: UploadTokenStatus;
  documentsUploaded: number;
  notes?: string;
  createdAt: string;
}

export interface CreateUploadTokenDto {
  clientId: string;
  expirationDays?: number; // 1-30 dias, padrão 3
  notes?: string;
}

export interface TokenInfo {
  valid: boolean;
  expiresAt?: string;
  message: string;
}

export interface ValidateCpfRequest {
  cpf: string;
}

export interface ValidateCpfResponse {
  valid: boolean;
  clientName?: string;
  expiresAt?: string;
  message?: string;
}

export interface PublicUploadDocumentDto {
  file: File;
  cpf: string;
  type: DocumentType;
  title?: string;
  description?: string;
  notes?: string;
}

export interface PublicUploadMultipleDto {
  files: File[];
  cpf: string;
  type: DocumentType;
  title?: string;
  description?: string;
  notes?: string;
}

export interface PublicUploadResponse {
  id: string;
  originalName: string;
  type: DocumentType;
  title?: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  createdAt: string;
}

export interface PublicUploadMultipleResponse {
  success: boolean;
  message: string;
  documents: PublicUploadResponse[];
  failed: Array<{
    fileName: string;
    error: string;
  }>;
}
