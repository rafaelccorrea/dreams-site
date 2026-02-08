import { useState, useEffect } from 'react';
import { addonsApi } from '../services/addonsApi';
import type { AddonPricing } from '../types/addons';

/**
 * Hook para obter add-ons disponíveis com preços
 *
 * @param subscriptionId - ID da assinatura
 *
 * @example
 * ```tsx
 * const { addons, loading, error } = useAvailableAddons(subscriptionId);
 *
 * if (loading) return <div>Carregando...</div>;
 *
 * return (
 *   <div>
 *     {addons.map(addon => (
 *       <div key={addon.type}>
 *         {addon.description} - R$ {addon.unitPrice.toFixed(2)}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useAvailableAddons(subscriptionId: string | null) {
  const [addons, setAddons] = useState<AddonPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddons = async () => {
      if (!subscriptionId) {
        setAddons([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await addonsApi.getAvailableAddons(subscriptionId);
        setAddons(data);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          'Erro ao carregar add-ons disponíveis';
        setError(errorMessage);
        console.error('Error fetching available addons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddons();
  }, [subscriptionId]);

  return { addons, loading, error };
}
