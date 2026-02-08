// Tipos e Enums para Assinaturas de Documentos

export enum DocumentSignatureStatus {
  PENDING = 'pending',
  VIEWED = 'viewed',
  SIGNED = 'signed',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export type DocumentSignatureStatusType = DocumentSignatureStatus;

// Labels para exibição
export const DocumentSignatureStatusLabels: Record<
  DocumentSignatureStatus,
  string
> = {
  [DocumentSignatureStatus.PENDING]: 'Aguardando',
  [DocumentSignatureStatus.VIEWED]: 'Visualizado',
  [DocumentSignatureStatus.SIGNED]: 'Assinado',
  [DocumentSignatureStatus.REJECTED]: 'Rejeitado',
  [DocumentSignatureStatus.EXPIRED]: 'Expirado',
  [DocumentSignatureStatus.CANCELLED]: 'Cancelado',
};

// Cores para badges
export const SignatureStatusColors: Record<
  DocumentSignatureStatus,
  { background: string; color: string }
> = {
  [DocumentSignatureStatus.PENDING]: {
    background: '#f59e0b',
    color: '#ffffff',
  },
  [DocumentSignatureStatus.VIEWED]: { background: '#3b82f6', color: '#ffffff' },
  [DocumentSignatureStatus.SIGNED]: { background: '#10b981', color: '#ffffff' },
  [DocumentSignatureStatus.REJECTED]: {
    background: '#ef4444',
    color: '#ffffff',
  },
  [DocumentSignatureStatus.EXPIRED]: {
    background: '#6b7280',
    color: '#ffffff',
  },
  [DocumentSignatureStatus.CANCELLED]: {
    background: '#6b7280',
    color: '#ffffff',
  },
};

// Ícones para status
export const SignatureStatusIcons: Record<DocumentSignatureStatus, string> = {
  [DocumentSignatureStatus.PENDING]: '⏳',
  [DocumentSignatureStatus.VIEWED]: '👁️',
  [DocumentSignatureStatus.SIGNED]: '✅',
  [DocumentSignatureStatus.REJECTED]: '❌',
  [DocumentSignatureStatus.EXPIRED]: '⏰',
  [DocumentSignatureStatus.CANCELLED]: '🚫',
};

export interface DocumentSignature {
  id: string;
  documentId: string;
  companyId: string;
  clientId?: string;
  userId?: string;
  status: DocumentSignatureStatus;
  signerName: string;
  signerEmail: string;
  signerPhone?: string;
  signerCpf?: string;
  expiresAt?: Date | string;
  viewedAt?: Date | string;
  signedAt?: Date | string;
  rejectedAt?: Date | string;
  rejectionReason?: string;
  assinafyDocumentId?: string;
  assinafySignerId?: string;
  assinafyAssignmentId?: string;
  signatureUrl?: string;
  signerAccessCode?: string;
  metadata?: Record<string, any>;
  createdAt: Date | string;
  updatedAt: Date | string;
  document?: {
    id: string;
    title: string;
    originalName: string;
  };
  client?: {
    id: string;
    name: string;
    email: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateSignatureDto {
  clientId?: string; // Se for cliente do sistema
  userId?: string; // Se for usuário do sistema
  signerName: string; // Obrigatório
  signerEmail: string; // Obrigatório
  signerPhone?: string;
  signerCpf?: string;
  expiresAt?: string; // Data de expiração (opcional)
  sendEmail?: boolean; // Enviar email automaticamente (opcional)
  metadata?: Record<string, any>;
}

export interface UpdateSignatureDto {
  status?: DocumentSignatureStatus;
  assinafyDocumentId?: string;
  assinafySignerId?: string;
  assinafyAssignmentId?: string;
  signatureUrl?: string;
  signerAccessCode?: string;
  rejectionReason?: string;
}

export interface SignatureStats {
  total: number;
  pending: number;
  viewed: number;
  signed: number;
  rejected: number;
  expired: number;
}

// Tipo para o signatário no modal
export type SignerType = 'client' | 'user' | 'external';
