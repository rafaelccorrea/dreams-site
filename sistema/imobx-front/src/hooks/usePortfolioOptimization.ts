import { useState } from 'react';
import {
  aiAssistantApi,
  type PortfolioOptimizationRequest,
  type PortfolioOptimizationResponse,
} from '../services/aiAssistantApi';
import { useRetry } from './useRetry';
import { toast } from 'react-toastify';

export function usePortfolioOptimization() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { executeWithRetry, canRetry } = useRetry();

  const optimize = async (
    data: PortfolioOptimizationRequest
  ): Promise<
    PortfolioOptimizationResponse | PortfolioOptimizationResponse[] | null
  > => {
    setLoading(true);
    setError(null);

    try {
      const result = await executeWithRetry(async () => {
        return await aiAssistantApi.optimizePortfolio(data);
      });

      if (!result) {
        throw new Error('Resposta vazia da API');
      }

      // Verificar se é array vazio
      if (Array.isArray(result) && result.length === 0) {
        return [];
      }

      // Verificar se é objeto único e está vazio
      if (!Array.isArray(result) && !result.propertyId) {
        throw new Error('Otimização vazia. Tente novamente.');
      }

      return result;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao otimizar portfólio';

      // Mensagens amigáveis para erros específicos
      let friendlyMessage = errorMessage;
      if (err?.response?.status === 400) {
        if (errorMessage.includes('limite') || errorMessage.includes('limit')) {
          friendlyMessage =
            'Limite diário de otimizações atingido. Tente novamente amanhã.';
        } else {
          friendlyMessage =
            'Dados inválidos. Verifique os parâmetros da otimização.';
        }
      } else if (err?.response?.status === 429) {
        friendlyMessage =
          'Muitas requisições. Aguarde alguns instantes e tente novamente.';
      } else if (err?.response?.status === 404) {
        friendlyMessage = 'Propriedade não encontrada.';
      } else if (err?.response?.status === 403) {
        friendlyMessage = 'Módulo AI Assistant não está ativo no seu plano.';
      }

      setError(friendlyMessage);
      toast.error(friendlyMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { optimize, loading, error, canRetry };
}
