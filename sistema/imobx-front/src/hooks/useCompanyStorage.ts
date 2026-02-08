import { useState, useEffect, useCallback } from 'react';
import { storageApi } from '../services/storageApi';
import type {
  CompanyStorageDetails,
  CompanyStorageUsage,
} from '../types/storage';

/**
 * Hook para obter informações de armazenamento de uma empresa específica
 *
 * @param companyId - ID da empresa
 * @param includeDetails - Se true, retorna detalhes completos com breakdown (padrão: false)
 *
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useCompanyStorage(companyId, true);
 *
 * if (loading) return <div>Carregando...</div>;
 * if (error) return <div>Erro: {error}</div>;
 *
 * return (
 *   <div>
 *     <p>{data?.usage.totalSizeGB.toFixed(2)} GB</p>
 *     <p>Imagens: {data?.breakdown.images.count}</p>
 *   </div>
 * );
 * ```
 */
export function useCompanyStorage(
  companyId: string | null,
  includeDetails: boolean = false
) {
  const [data, setData] = useState<
    CompanyStorageDetails | CompanyStorageUsage | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (forceRecalculate = false) => {
      if (!companyId) {
        setData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (includeDetails) {
          const response = await storageApi.getCompanyStorageDetails(
            companyId,
            forceRecalculate
          );
          setData(response);
        } else {
          const response = await storageApi.getCompanyStorageUsage(companyId);
          setData(response);
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'Erro ao carregar uso de armazenamento da empresa';
        setError(errorMessage);
        console.error('Error fetching company storage:', err);
      } finally {
        setLoading(false);
      }
    },
    [companyId, includeDetails]
  );

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
