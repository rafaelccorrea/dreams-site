import { useState, useEffect, useCallback } from 'react';
import { storageApi } from '../services/storageApi';
import type { UserTotalStorageInfo } from '../types/storage';

/**
 * Hook para obter o uso consolidado de armazenamento de todas as empresas do owner
 *
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useTotalStorage();
 *
 * if (loading) return <div>Carregando...</div>;
 * if (error) return <div>Erro: {error}</div>;
 *
 * return (
 *   <div>
 *     <p>{data?.totalSizeGB.toFixed(2)} GB de {data?.totalStorageLimitGB} GB</p>
 *     <button onClick={() => refetch(true)}>Atualizar</button>
 *   </div>
 * );
 * ```
 */
export function useTotalStorage() {
  const [data, setData] = useState<UserTotalStorageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (forceRecalculate = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await storageApi.getMyCompaniesStorage(forceRecalculate);
      setData(response);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao carregar uso de armazenamento';
      setError(errorMessage);
      console.error('Error fetching total storage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(
    (forceRecalculate = false) => {
      fetchData(forceRecalculate);
    },
    [fetchData]
  );

  return { data, loading, error, refetch };
}
