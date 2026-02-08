import { useState, useEffect } from 'react';
import { addonsApi } from '../services/addonsApi';
import type { AddonLimits } from '../types/addons';

/**
 * Hook para obter limites totais (plano base + add-ons ativos)
 *
 * @param subscriptionId - ID da assinatura
 *
 * @example
 * ```tsx
 * const { limits, loading, error } = useAddonLimits(subscriptionId);
 *
 * if (loading) return <div>Carregando...</div>;
 *
 * return (
 *   <div>
 *     <p>Usuários: {limits?.users}</p>
 *     <p>Propriedades: {limits?.properties}</p>
 *     <p>Armazenamento: {limits?.storage} GB</p>
 *   </div>
 * );
 * ```
 */
export function useAddonLimits(subscriptionId: string | null) {
  const [limits, setLimits] = useState<AddonLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLimits = async () => {
      if (!subscriptionId) {
        setLimits(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await addonsApi.getLimits(subscriptionId);
        setLimits(data);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || 'Erro ao carregar limites';
        setError(errorMessage);
        console.error('Error fetching addon limits:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLimits();
  }, [subscriptionId]);

  return { limits, loading, error };
}
