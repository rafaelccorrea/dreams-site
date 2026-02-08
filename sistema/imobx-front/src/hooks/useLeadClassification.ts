import { useState } from 'react';
import {
  aiAssistantApi,
  type LeadClassificationRequest,
  type LeadClassificationResponse,
} from '../services/aiAssistantApi';
import { useRetry } from './useRetry';

export function useLeadClassification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { executeWithRetry, canRetry } = useRetry();

  const classify = async (
    data: LeadClassificationRequest
  ): Promise<
    LeadClassificationResponse | LeadClassificationResponse[] | null
  > => {
    setLoading(true);
    setError(null);

    try {
      const result = await executeWithRetry(async () => {
        return await aiAssistantApi.classifyLead(data);
      });

      if (!result) {
        throw new Error('Resposta vazia da API');
      }

      // Verificar se é array vazio
      if (Array.isArray(result) && result.length === 0) {
        return [];
      }

      // Verificar se é objeto único e está vazio
      if (!Array.isArray(result) && !result.clientId) {
        throw new Error('Classificação vazia. Tente novamente.');
      }

      return result;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao classificar lead';

      // Mensagens amigáveis para erros específicos
      let friendlyMessage = errorMessage;
      if (err?.response?.status === 400) {
        if (errorMessage.includes('limite') || errorMessage.includes('limit')) {
          friendlyMessage =
            'Limite diário de classificações atingido. Tente novamente amanhã.';
        } else {
          friendlyMessage = 'Dados inválidos. Verifique se o cliente existe.';
        }
      } else if (err?.response?.status === 429) {
        friendlyMessage =
          'Muitas requisições. Aguarde alguns instantes e tente novamente.';
      } else if (err?.response?.status === 404) {
        friendlyMessage = 'Cliente não encontrado.';
      } else if (err?.response?.status === 403) {
        friendlyMessage = 'Módulo AI Assistant não está ativo no seu plano.';
      }

      setError(friendlyMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { classify, loading, error, canRetry };
}
