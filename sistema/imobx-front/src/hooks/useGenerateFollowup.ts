import { useState } from 'react';
import {
  aiAssistantApi,
  type GenerateFollowupRequest,
  type GenerateFollowupResponse,
} from '../services/aiAssistantApi';
import { useRetry } from './useRetry';

export function useGenerateFollowup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { executeWithRetry, canRetry } = useRetry({
    maxRetries: 3,
    retryWindowMs: 60000,
  });

  const generate = async (
    clientId: string,
    context?: string,
    daysSinceLastContact?: number
  ): Promise<GenerateFollowupResponse | null> => {
    // Verificar se pode tentar antes de iniciar
    if (!canRetry()) {
      setError(
        'Limite de tentativas excedido. Aguarde 1 minuto antes de tentar novamente.'
      );
      return null;
    }

    setLoading(true);
    setError(null);

    const data: GenerateFollowupRequest = {
      clientId,
      ...(context && { context }),
      ...(daysSinceLastContact !== undefined && { daysSinceLastContact }),
    };

    const result = await executeWithRetry(
      () => aiAssistantApi.generateFollowup(data),
      (err: any, attempt: number) => {
        // Tratar erro 400 (limite diário)
        if (err?.response?.status === 400) {
          const friendlyMessage =
            '😊 O limite diário de gerações de IA foi atingido. Tente novamente amanhã ou entre em contato com o suporte para mais informações.';
          setError(friendlyMessage);
          return;
        }

        // Tratar erro 429 (muitas requisições)
        if (err?.response?.status === 429) {
          const friendlyMessage =
            '😊 Muitas requisições foram feitas. Aguarde alguns minutos antes de tentar novamente.';
          setError(friendlyMessage);
          return;
        }

        const errorMessage =
          err?.response?.status === 404
            ? 'API de follow-up não encontrada'
            : err?.response?.status === 403
              ? 'Acesso negado à API de follow-up'
              : err?.message || 'Erro ao gerar mensagem de follow-up';

        setError(errorMessage);

        // Se for erro definitivo (404/403), não tentar novamente
        if (err?.response?.status === 404 || err?.response?.status === 403) {
          setError(
            `${errorMessage}. Esta funcionalidade pode não estar disponível.`
          );
        }
      }
    );

    // Verificar se a resposta está vazia ou inválida
    if (result && (!result.message || result.message.trim() === '')) {
      setError(
        '😊 Não foi possível gerar a mensagem no momento. O limite diário de IA pode ter sido atingido. Tente novamente amanhã.'
      );
      setLoading(false);
      return null;
    }

    setLoading(false);
    return result;
  };

  const clearError = () => {
    setError(null);
  };

  return { generate, loading, error, clearError, canRetry };
}
