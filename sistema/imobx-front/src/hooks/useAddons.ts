import { useState, useEffect, useCallback } from 'react';
import { addonsApi } from '../services/addonsApi';
import type { SubscriptionAddon } from '../types/addons';

/**
 * Hook para obter add-ons de uma assinatura
 *
 * @param subscriptionId - ID da assinatura
 * @param activeOnly - Se true, retorna apenas add-ons ativos (padrão: false)
 *
 * @example
 * ```tsx
 * const { addons, loading, error, refetch } = useAddons(subscriptionId, false);
 *
 * if (loading) return <div>Carregando...</div>;
 * if (error) return <div>Erro: {error}</div>;
 *
 * return (
 *   <div>
 *     {addons.map(addon => (
 *       <div key={addon.id}>{addon.type} - {addon.quantity}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useAddons(subscriptionId: string | null, activeOnly = false) {
  const [addons, setAddons] = useState<SubscriptionAddon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddons = useCallback(async () => {
    if (!subscriptionId) {
      setAddons([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = activeOnly
        ? await addonsApi.getActiveAddons(subscriptionId)
        : await addonsApi.getAddons(subscriptionId);

      setAddons(data);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || 'Erro ao carregar add-ons';
      setError(errorMessage);
      console.error('Error fetching addons:', err);
    } finally {
      setLoading(false);
    }
  }, [subscriptionId, activeOnly]);

  useEffect(() => {
    fetchAddons();
  }, [fetchAddons]);

  const refetch = useCallback(() => {
    fetchAddons();
  }, [fetchAddons]);

  return { addons, loading, error, refetch };
}
