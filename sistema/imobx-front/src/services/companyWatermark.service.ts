import { api } from './api';

export interface UploadWatermarkResponse {
  watermarkUrl: string;
  message: string;
}

class CompanyWatermarkService {
  /**
   * Faz upload da marca d'água da empresa
   */
  async uploadWatermark(
    companyId: string,
    file: File
  ): Promise<UploadWatermarkResponse> {
    // Validar tipo de arquivo
    if (file.type !== 'image/png') {
      throw new Error('Apenas arquivos PNG são permitidos para marca dágua');
    }

    // Validar tamanho (2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Tamanho máximo: 2MB');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadWatermarkResponse>(
      `/companies/${companyId}/upload-watermark`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * Remove a marca d'água da empresa (opcional - se implementado no backend)
   */
  async removeWatermark(companyId: string): Promise<void> {
    // Nota: Este endpoint pode não estar implementado ainda
    // Se necessário, implementar no backend: DELETE /companies/:id/watermark
    await api.delete(`/companies/${companyId}/watermark`);
  }
}

export const companyWatermarkService = new CompanyWatermarkService();
