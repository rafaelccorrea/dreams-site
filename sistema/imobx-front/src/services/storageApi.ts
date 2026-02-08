import { api } from './api';
import type {
  CanUploadResponse,
  UserTotalStorageInfo,
  CompanyStorageDetails,
  CompanyStorageUsage,
  StorageLimitsResponse,
} from '../types/storage';

/**
 * Serviço de API para controle de armazenamento por empresa
 *
 * O armazenamento é contabilizado de todas as empresas de um usuário (owner) juntas.
 */
class StorageApiService {
  private baseUrl = '/storage/company';

  /**
   * Verifica se o usuário pode fazer upload de um arquivo
   * considerando o limite de armazenamento de todas as suas empresas
   *
   * @param fileSizeBytes - Tamanho do arquivo em bytes
   * @returns Resposta indicando se pode fazer upload e informações de armazenamento
   */
  async canUpload(fileSizeBytes: number): Promise<CanUploadResponse> {
    try {
      const response = await api.get<CanUploadResponse>(
        `${this.baseUrl}/can-upload`,
        {
          params: { fileSizeBytes },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking if can upload:', error);
      throw error;
    }
  }

  /**
   * Obtém o uso consolidado de armazenamento de todas as empresas
   * onde o usuário é owner
   *
   * @param forceRecalculate - Forçar recálculo (padrão: false)
   * @returns Informações consolidadas de armazenamento
   */
  async getMyCompaniesStorage(
    forceRecalculate: boolean = false
  ): Promise<UserTotalStorageInfo> {
    try {
      const response = await api.get<UserTotalStorageInfo>(
        `${this.baseUrl}/my-companies`,
        {
          params: forceRecalculate ? { forceRecalculate: true } : {},
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching my companies storage:', error);
      throw error;
    }
  }

  /**
   * Obtém informações detalhadas sobre o uso de armazenamento
   * de uma empresa específica, incluindo breakdown por tipo de arquivo
   *
   * @param companyId - ID da empresa
   * @param forceRecalculate - Forçar recálculo (padrão: false)
   * @returns Informações detalhadas de armazenamento da empresa
   */
  async getCompanyStorageDetails(
    companyId: string,
    forceRecalculate: boolean = false
  ): Promise<CompanyStorageDetails> {
    try {
      const response = await api.get<CompanyStorageDetails>(
        `${this.baseUrl}/company/${companyId}`,
        {
          params: forceRecalculate ? { forceRecalculate: true } : {},
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching company storage details:', error);
      throw error;
    }
  }

  /**
   * Obtém apenas os dados básicos de uso de armazenamento de uma empresa
   *
   * @param companyId - ID da empresa
   * @returns Dados básicos de uso de armazenamento
   */
  async getCompanyStorageUsage(
    companyId: string
  ): Promise<CompanyStorageUsage> {
    try {
      const response = await api.get<CompanyStorageUsage>(
        `${this.baseUrl}/company/${companyId}/usage`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching company storage usage:', error);
      throw error;
    }
  }

  /**
   * Obtém os limites de armazenamento configurados para cada plano
   *
   * @returns Limites de armazenamento por plano
   */
  async getStorageLimits(): Promise<StorageLimitsResponse> {
    try {
      const response = await api.get<StorageLimitsResponse>(
        '/gallery/storage/limits'
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching storage limits:', error);
      throw error;
    }
  }
}

export const storageApi = new StorageApiService();
