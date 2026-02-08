import { useState, useEffect } from 'react';
import {
  getPricingPageData,
  type PricingPageData,
} from '../services/pricingService';

/**
 * Hook para buscar dados da página de pricing
 * Usa cache para melhor performance
 */
export function usePricingData() {
  const [data, setData] = useState<PricingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setLoading(true);
        setError(null);

        const pricingData = await getPricingPageData();
        setData(pricingData);
      } catch (err: any) {
        console.error('Erro ao buscar dados de pricing:', err);

        // Mensagem de erro amigável
        let errorMessage = 'Erro ao carregar dados de preços';

        if (err?.message) {
          errorMessage = err.message;
        } else if (err?.response?.status === 404) {
          errorMessage = 'API de pricing não está disponível no backend';
        } else if (
          err?.response?.status === 401 ||
          err?.response?.status === 403
        ) {
          errorMessage = 'Erro de autenticação. Faça login novamente.';
        } else if (err?.code === 'ERR_NETWORK') {
          errorMessage =
            'Erro de conexão com o servidor. Verifique se o backend está rodando.';
        }

        setError(errorMessage);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const pricingData = await getPricingPageData();
      setData(pricingData);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao atualizar dados de pricing:', err);

      let errorMessage = 'Erro ao carregar dados de preços';

      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'API de pricing não está disponível no backend';
      } else if (err?.code === 'ERR_NETWORK') {
        errorMessage = 'Erro de conexão com o servidor';
      }

      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refresh,
  };
}
