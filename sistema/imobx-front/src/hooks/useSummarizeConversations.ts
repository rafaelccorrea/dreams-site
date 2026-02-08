import { useState } from 'react';
import {
  aiAssistantApi,
  type SummarizeConversationsRequest,
  type SummarizeConversationsResponse,
} from '../services/aiAssistantApi';
import { useRetry } from './useRetry';

export function useSummarizeConversations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { executeWithRetry, canRetry } = useRetry({
    maxRetries: 3,
    retryWindowMs: 60000,
  });

  const summarize = async (
    clientId: string,
    summaryType?: 'executive' | 'detailed' | 'timeline'
  ): Promise<SummarizeConversationsResponse | null> => {
    // Verificar se pode tentar antes de iniciar
    if (!canRetry()) {
      setError(
        'Limite de tentativas excedido. Aguarde 1 minuto antes de tentar novamente.'
      );
      return null;
    }

    setLoading(true);
    setError(null);

    const data: SummarizeConversationsRequest = {
      clientId,
      ...(summaryType && { summaryType }),
    };

    const result = await executeWithRetry(
      () => aiAssistantApi.summarizeConversations(data),
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
            ? 'API de resumo de conversas não encontrada'
            : err?.response?.status === 403
              ? 'Acesso negado à API de resumo de conversas'
              : err?.message || 'Erro ao resumir conversas';

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
    if (result && (!result.summary || result.summary.trim() === '')) {
      setError(
        '😊 Não foi possível gerar o resumo no momento. O limite diário de IA pode ter sido atingido. Tente novamente amanhã.'
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

  return { summarize, loading, error, clearError, canRetry };
}
