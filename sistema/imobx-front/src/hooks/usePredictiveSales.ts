import { useState } from 'react';
import {
  aiAssistantApi,
  type PredictiveSalesRequest,
  type PredictiveSalesResponse,
} from '../services/aiAssistantApi';
import { useRetry } from './useRetry';

export function usePredictiveSales() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { executeWithRetry, canRetry } = useRetry({
    maxRetries: 3,
    retryWindowMs: 60000,
  });

  const predict = async (
    propertyId?: string
  ): Promise<PredictiveSalesResponse | PredictiveSalesResponse[] | null> => {
    // Verificar se pode tentar antes de iniciar
    if (!canRetry()) {
      setError(
        'Limite de tentativas excedido. Aguarde 1 minuto antes de tentar novamente.'
      );
      return null;
    }

    setLoading(true);
    setError(null);

    const data: PredictiveSalesRequest = propertyId
      ? { propertyId, analysisType: 'single' }
      : { analysisType: 'bulk' };

    const result = await executeWithRetry(
      () => aiAssistantApi.predictiveSales(data),
      (err: any, attempt: number) => {
        // Tratar erro 400 (limite diário)
        if (err?.response?.status === 400) {
          const friendlyMessage =
            '😊 O limite diário de análises de IA foi atingido. Tente novamente amanhã ou entre em contato com o suporte para mais informações.';
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
            ? 'API de análise preditiva não encontrada'
            : err?.response?.status === 403
              ? 'Acesso negado à API de análise preditiva'
              : err?.message || 'Erro na análise preditiva';

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
    if (result) {
      const resultsArray = Array.isArray(result) ? result : [result];
      if (
        resultsArray.length === 0 ||
        resultsArray.every(r => !r || !r.propertyId)
      ) {
        setError(
          '😊 Não foi possível gerar a análise no momento. O limite diário de IA pode ter sido atingido. Tente novamente amanhã.'
        );
        setLoading(false);
        return null;
      }
    }

    setLoading(false);
    return result;
  };

  const clearError = () => {
    setError(null);
  };

  return { predict, loading, error, clearError, canRetry };
}
