import { api } from './api';
import type {
  GenerateDescriptionRequest,
  GeneratedDescription,
} from '../types/ai';

class AiApiService {
  private readonly baseUrl = '/api/ai';

  async generatePropertyDescription(
    data: GenerateDescriptionRequest
  ): Promise<GeneratedDescription> {
    try {
      const response = await api.post(
        `${this.baseUrl}/generate-property-description`,
        data
      );
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao gerar descrição com IA';
      throw new Error(message);
    }
  }
}

export const aiApi = new AiApiService();
export default aiApi;
