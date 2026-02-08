import { useState } from 'react';
import {
  aiAssistantApi,
  type DemandForecastRequest,
  type DemandForecastResponse,
} from '../services/aiAssistantApi';
import { useRetry } from './useRetry';
import { toast } from 'react-toastify';

export function useDemandForecast() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { executeWithRetry, canRetry } = useRetry();

  const forecast = async (
    data: DemandForecastRequest
  ): Promise<DemandForecastResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await executeWithRetry(async () => {
        return await aiAssistantApi.forecastDemand(data);
      });

      if (!result) {
        throw new Error('Resposta vazia da API');
      }

      // Verificar se a resposta está vazia
      if (!result.region && !result.propertyType) {
        throw new Error('Previsão vazia. Tente novamente.');
      }

      return result;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao prever demanda';

      // Mensagens amigáveis para erros específicos
      let friendlyMessage = errorMessage;
      if (err?.response?.status === 400) {
        if (errorMessage.includes('limite') || errorMessage.includes('limit')) {
          friendlyMessage =
            'Limite diário de previsões atingido. Tente novamente amanhã.';
        } else {
          friendlyMessage =
            'Dados inválidos. Verifique os parâmetros da previsão.';
        }
      } else if (err?.response?.status === 429) {
        friendlyMessage =
          'Muitas requisições. Aguarde alguns instantes e tente novamente.';
      } else if (err?.response?.status === 404) {
        friendlyMessage = 'Região ou tipo de propriedade não encontrado.';
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

  return { forecast, loading, error, canRetry };
}
