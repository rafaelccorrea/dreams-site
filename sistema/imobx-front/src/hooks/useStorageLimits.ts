import { useState, useEffect } from 'react';
import { storageApi } from '../services/storageApi';
import type { StorageLimitsResponse } from '../types/storage';

/**
 * Hook para obter os limites de armazenamento configurados para cada plano
 *
 * @example
 * ```tsx
 * const { data, loading, error } = useStorageLimits();
 *
 * if (loading) return <div>Carregando...</div>;
 * if (error) return <div>Erro: {error}</div>;
 *
 * return (
 *   <div>
 *     {data?.plans.map(plan => (
 *       <div key={plan.plan}>
 *         <p>{plan.plan}: {plan.limitGB} GB</p>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useStorageLimits() {
  const [data, setData] = useState<StorageLimitsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await storageApi.getStorageLimits();
        setData(response);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'Erro ao carregar limites de armazenamento';
        setError(errorMessage);
        console.error('Error fetching storage limits:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
