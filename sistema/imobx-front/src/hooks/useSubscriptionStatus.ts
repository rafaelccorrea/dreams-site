import { useState, useEffect, useCallback } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import type { SubscriptionAccessInfo } from '../types/subscription';

interface UseSubscriptionStatusOptions {
  autoRefresh?: boolean;
  skip?: boolean;
}

export const useSubscriptionStatus = (
  options?: boolean | UseSubscriptionStatusOptions
) => {
  const resolvedOptions: UseSubscriptionStatusOptions =
    typeof options === 'boolean' ? { autoRefresh: options } : (options ?? {});

  const { autoRefresh = true, skip = false } = resolvedOptions;

  const [accessInfo, setAccessInfo] = useState<SubscriptionAccessInfo | null>(
    () => subscriptionService.getCachedSubscriptionAccess()
  );
  const [loading, setLoading] = useState(
    () => !subscriptionService.getCachedSubscriptionAccess()
  );
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (skip) {
      return null;
    }

    try {
      setLoading(true);
      const info = await subscriptionService.checkSubscriptionAccess();
      setAccessInfo(info);
      setError(null);
      return info;
    } catch (err) {
      setError('Erro ao verificar assinatura');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [skip]);

  useEffect(() => {
    if (skip) {
      setLoading(false);
      return;
    }

    if (!subscriptionService.getCachedSubscriptionAccess()) {
      fetchStatus().catch(() => {});
    } else {
      setLoading(false);
    }

    if (!autoRefresh) {
      return;
    }

    const interval = window.setInterval(
      () => {
        fetchStatus().catch(() => {});
      },
      5 * 60 * 1000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [autoRefresh, fetchStatus, skip]);

  return {
    accessInfo,
    loading,
    error,
    refresh: fetchStatus,

    // Helpers
    hasAccess: accessInfo?.hasAccess || false,
    isActive: accessInfo?.status === 'active',
    isSuspended: accessInfo?.isSuspended || false,
    isExpired: accessInfo?.isExpired || false,
    isExpiringSoon: accessInfo?.isExpiringSoon || false,
    daysUntilExpiry: accessInfo?.daysUntilExpiry,
    status: accessInfo?.status || 'none',
    reason: accessInfo?.reason,
    subscription: accessInfo?.subscription,
  };
};
