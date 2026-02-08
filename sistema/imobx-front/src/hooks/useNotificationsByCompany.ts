import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../services/notificationApi';

interface NotificationCountByCompany {
  [companyId: string]: number;
  personal?: number;
}

interface UseNotificationsByCompanyReturn {
  countByCompany: NotificationCountByCompany;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook para obter contador de notificações não lidas por empresa
 *
 * Útil para dashboards com múltiplas empresas ou seletor de empresas
 *
 * @example
 * ```tsx
 * const { countByCompany, loading } = useNotificationsByCompany();
 *
 * // Exibir badges por empresa
 * companies.map(company => (
 *   <CompanyBadge
 *     key={company.id}
 *     company={company}
 *     count={countByCompany[company.id] || 0}
 *   />
 * ))
 *
 * // Badge de notificações pessoais
 * <PersonalBadge count={countByCompany.personal || 0} />
 * ```
 */
export const useNotificationsByCompany =
  (): UseNotificationsByCompanyReturn => {
    const [countByCompany, setCountByCompany] =
      useState<NotificationCountByCompany>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCounts = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const counts = await notificationApi.getUnreadCountByCompany();
        setCountByCompany(counts);
      } catch (err: any) {
        console.error(
          '[useNotificationsByCompany] Erro ao carregar contadores:',
          err
        );
        setError(err.message || 'Erro ao carregar contadores de notificações');
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      loadCounts();
    }, [loadCounts]);

    return {
      countByCompany,
      loading,
      error,
      refresh: loadCounts,
    };
  };
