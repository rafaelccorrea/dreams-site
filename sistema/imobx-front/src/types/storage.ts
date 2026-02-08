/**
 * Tipos TypeScript para o sistema de controle de armazenamento por empresa
 *
 * O armazenamento é contabilizado de todas as empresas de um usuário (owner) juntas.
 * Por exemplo, se um usuário tem 3 empresas, o limite de armazenamento é compartilhado entre as 3.
 */

/**
 * Resposta da API ao verificar se pode fazer upload
 */
export interface CanUploadResponse {
  canUpload: boolean;
  reason?: string;
  totalStorageUsedGB: number;
  totalStorageLimitGB: number;
  remainingGB: number;
  wouldExceed: boolean;
}

/**
 * Informações de armazenamento de uma empresa específica
 */
export interface CompanyStorageInfo {
  companyId: string;
  companyName: string;
  totalSizeBytes: number;
  totalSizeMB: number;
  totalSizeGB: number;
  fileCount: number;
  imagesSizeBytes: number;
  imagesCount: number;
  documentsSizeBytes: number;
  documentsCount: number;
  otherFilesSizeBytes: number;
  otherFilesCount: number;
  calculatedAt: string | Date;
}

/**
 * Informações consolidadas de armazenamento de todas as empresas do owner
 */
export interface UserTotalStorageInfo {
  userId: string;
  totalCompanies: number;
  totalSizeBytes: number;
  totalSizeMB: number;
  totalSizeGB: number;
  totalFileCount: number;
  companies: CompanyStorageInfo[];
  calculatedAt: string | Date;
  totalStorageLimitGB?: number; // Limite total de armazenamento (opcional, pode vir da API ou ser buscado separadamente)
}

/**
 * Breakdown de armazenamento por tipo de arquivo
 */
export interface StorageBreakdown {
  images: {
    sizeBytes: number;
    sizeMB: number;
    sizeGB: number;
    count: number;
    percentage: number;
  };
  documents: {
    sizeBytes: number;
    sizeMB: number;
    sizeGB: number;
    count: number;
    percentage: number;
  };
  other: {
    sizeBytes: number;
    sizeMB: number;
    sizeGB: number;
    count: number;
    percentage: number;
  };
}

/**
 * Informações detalhadas de uma empresa específica
 */
export interface CompanyStorageDetails {
  usage: {
    id: string;
    companyId: string;
    totalSizeBytes: number;
    totalSizeMB: number;
    totalSizeGB: number;
    fileCount: number;
    imagesSizeBytes: number;
    imagesCount: number;
    documentsSizeBytes: number;
    documentsCount: number;
    otherFilesSizeBytes: number;
    otherFilesCount: number;
    calculatedAt: string | Date;
  };
  company: {
    id: string;
    name: string;
    planType: string;
    planFeatures: {
      storageGB: number;
    };
  };
  breakdown: StorageBreakdown;
}

/**
 * Uso básico de armazenamento de uma empresa
 */
export interface CompanyStorageUsage {
  id: string;
  companyId: string;
  totalSizeBytes: number;
  totalSizeMB: number;
  totalSizeGB: number;
  fileCount: number;
  imagesSizeBytes: number;
  imagesCount: number;
  documentsSizeBytes: number;
  documentsCount: number;
  otherFilesSizeBytes: number;
  otherFilesCount: number;
  calculatedAt: string | Date;
}

/**
 * Limites de armazenamento por plano
 */
export interface StorageLimit {
  plan: string;
  limitGB: number;
  limitBytes: number;
  description: string;
}

/**
 * Resposta da API com limites de armazenamento
 */
export interface StorageLimitsResponse {
  plans: StorageLimit[];
}
