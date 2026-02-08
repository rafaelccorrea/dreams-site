import { useEffect, useCallback } from 'react';
import { useSubscription } from './useSubscription';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

export const useSubscriptionMonitor = () => {
  const { subscriptionStatus, loadSubscriptionStatus } = useSubscription();
  const { getCurrentUser } = useAuth();
  const navigate = useNavigate();

  const checkAndRedirect = useCallback(() => {
    const user = getCurrentUser();

    if (!user) return;

    // Se for master, não fazer nada
    if (user.role === 'master') return;

    // Se não tem assinatura ativa
    if (!subscriptionStatus?.hasActiveSubscription) {
      const reason =
        subscriptionStatus?.statusReason ??
        (subscriptionStatus?.subscription?.status as string | undefined);

      if (reason === 'none') {
        navigate('/subscription-plans', { replace: true });
        return;
      }

      if (user.role === 'admin') {
        navigate('/subscription-management', { replace: true });
      } else if (user.role === 'user') {
        navigate('/system-unavailable', { replace: true });
      }
    }
  }, [subscriptionStatus, getCurrentUser, navigate]);

  // Verificar assinatura periodicamente (apenas se necessário)
  useEffect(() => {
    // DESABILITADO: Verificação a cada 30s causa muitas chamadas desnecessárias
    // Se precisar de monitoramento em tempo real, usar WebSocket
    // const interval = setInterval(() => {
    //   loadSubscriptionStatus();
    // }, 300000); // 5 minutos
    // return () => clearInterval(interval);
  }, []);

  // Verificar e redirecionar quando o status mudar
  useEffect(() => {
    checkAndRedirect();
  }, [checkAndRedirect]);

  return {
    subscriptionStatus,
    checkAndRedirect,
  };
};
