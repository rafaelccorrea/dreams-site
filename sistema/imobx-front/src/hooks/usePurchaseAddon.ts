import { useState } from 'react';
import { addonsApi } from '../services/addonsApi';
import type { SubscriptionAddon, PurchaseAddonDto } from '../types/addons';

/**
 * Hook para comprar add-ons
 *
 * @param subscriptionId - ID da assinatura
 *
 * @example
 * ```tsx
 * const { purchaseAddon, loading, error } = usePurchaseAddon(subscriptionId);
 *
 * const handlePurchase = async () => {
 *   try {
 *     const addon = await purchaseAddon({
 *       type: AddonType.EXTRA_USERS,
 *       quantity: 10,
 *     });
 *     console.log('Add-on comprado:', addon);
 *   } catch (err) {
 *     console.error('Erro:', err);
 *   }
 * };
 * ```
 */
export function usePurchaseAddon(subscriptionId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseAddon = async (
    purchaseDto: PurchaseAddonDto
  ): Promise<SubscriptionAddon> => {
    try {
      setLoading(true);
      setError(null);

      const addon = await addonsApi.purchaseAddon(subscriptionId, purchaseDto);
      return addon;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || 'Erro ao comprar add-on';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { purchaseAddon, loading, error };
}
