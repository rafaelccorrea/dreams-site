import { useEffect, useState } from 'react';
import { useSubscription } from './useSubscription';

export const useSubscriptionReady = () => {
  const { subscriptionStatus, loading } = useSubscription();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading && subscriptionStatus !== null) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [loading, subscriptionStatus]);

  return {
    isReady,
    subscriptionStatus,
    loading,
  };
};
