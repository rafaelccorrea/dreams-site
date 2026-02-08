import { useState } from 'react';
import {
  aiAssistantApi,
  type BrokerPerformanceRequest,
  type BrokerPerformanceResponse,
} from '../services/aiAssistantApi';
import { useRetry } from './useRetry';

export function useBrokerPerformance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { executeWithRetry, canRetry } = useRetry();

  const analyze = async (
    data: BrokerPerformanceRequest
  ): Promise<
    BrokerPerformanceResponse | BrokerPerformanceResponse[] | null
  > => {
    setLoading(true);
    setError(null);

    try {
      const result = await executeWithRetry(async () => {
        return await aiAssistantApi.analyzeBrokerPerformance(data);
      });

      if (!result) {
        throw new Error('Resposta vazia da API');
      }

      // Verificar se é array vazio
      if (Array.isArray(result) && result.length === 0) {
        return [];
      }

      // Verificar se é objeto único e está vazio
      if (!Array.isArray(result) && !result.brokerId) {
        throw new Error('Análise vazia. Tente novamente.');
      }

      return result;
    } catch (err: any) {
      // Se for erro 429 (rate limit), o interceptor global já mostrou a notificação
      // Não definir erro aqui para não quebrar a página
      if (err?.isRateLimit || err?.response?.status === 429) {
        console.warn(
          '⚠️ Rate limit detectado em useBrokerPerformance - retornando null sem erro'
        );
        setLoading(false);
        return null; // Retornar null sem definir erro para não quebrar a página
      }

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao analisar performance';

      // Mensagens amigáveis para erros específicos
      let friendlyMessage = errorMessage;
      if (err?.response?.status === 400) {
        if (errorMessage.includes('limite') || errorMessage.includes('limit')) {
          friendlyMessage =
            'Limite diário de análises atingido. Tente novamente amanhã.';
        } else {
          friendlyMessage =
            'Dados inválidos. Verifique os parâmetros da análise.';
        }
      } else if (err?.response?.status === 404) {
        friendlyMessage = 'Corretor não encontrado.';
      } else if (err?.response?.status === 403) {
        friendlyMessage = 'Módulo AI Assistant não está ativo no seu plano.';
      }

      setError(friendlyMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, error, canRetry };
}
