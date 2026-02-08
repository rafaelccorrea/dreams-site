/**
 * API Service para importação de propriedades via link externo
 */

import { api } from './api';
import type {
  PropertyImportData,
  PropertyImportResponse,
} from '../types/propertyImport';

class PropertyImportApiService {
  private readonly baseUrl = '/properties';

  /**
   * Importa dados de propriedade a partir de um link externo
   * @param url URL do site externo
   * @returns Dados coletados da propriedade
   */
  async importFromLink(url: string): Promise<PropertyImportData> {
    try {
      const response = await api.post<
        PropertyImportResponse | PropertyImportData
      >(`${this.baseUrl}/import-from-link`, { url });

      console.log('📥 Resposta da API de importação:', {
        status: response.status,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        dataType: typeof response.data,
      });

      // Verificar se a resposta tem wrapper success/data
      if (
        response.data &&
        typeof response.data === 'object' &&
        'success' in response.data
      ) {
        const wrappedResponse = response.data as PropertyImportResponse;
        console.log('📦 Resposta com wrapper:', {
          success: wrappedResponse.success,
          hasData: !!wrappedResponse.data,
        });

        if (!wrappedResponse.success || !wrappedResponse.data) {
          throw new Error(
            wrappedResponse.error ||
              wrappedResponse.message ||
              'Erro ao importar propriedade'
          );
        }
        return wrappedResponse.data;
      }

      // Se não tem wrapper, assumir que response.data é PropertyImportData diretamente
      const directData = response.data as PropertyImportData;
      console.log('📦 Resposta direta:', {
        hasSourceUrl: !!directData?.sourceUrl,
      });

      if (!directData || !directData.sourceUrl) {
        throw new Error('Resposta inválida da API');
      }

      return directData;
    } catch (error: any) {
      console.error('❌ Erro ao importar propriedade do link:', error);
      console.error('❌ Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw this.handleError(error);
    }
  }

  /**
   * Valida se uma URL é suportada para importação
   * @param url URL para validar
   * @returns true se a URL é suportada
   */
  async validateUrl(
    url: string
  ): Promise<{ valid: boolean; site?: string; message?: string }> {
    try {
      const response = await api.post<{
        valid: boolean;
        site?: string;
        message?: string;
      }>(`${this.baseUrl}/import/validate-url`, { url });
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao validar URL:', error);
      return { valid: false, message: 'Erro ao validar URL' };
    }
  }

  /**
   * Trata erros da API
   */
  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.message) {
      return error;
    }
    return new Error('Erro desconhecido ao importar propriedade');
  }
}

export const propertyImportApi = new PropertyImportApiService();
