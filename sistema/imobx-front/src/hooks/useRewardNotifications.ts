import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNotifications } from './useNotifications';
import { getNavigationUrl } from '../utils/pathUtils';

interface RewardNotificationData {
  redemptionId?: string;
  rewardId?: string;
  userId?: string;
  message?: string;
}

interface UseRewardNotificationsOptions {
  onRedemptionRequested?: () => void;
  onRedemptionApproved?: () => void;
  onRedemptionRejected?: () => void;
  onRedemptionDelivered?: () => void;
}

/**
 * Hook para lidar com notificações de resgates de prêmios via WebSocket
 */
export const useRewardNotifications = (
  options: UseRewardNotificationsOptions = {}
) => {
  const { notifications } = useNotifications();

  useEffect(() => {
    // Processa as notificações recebidas
    notifications.forEach(notification => {
      const data = notification.data as RewardNotificationData;

      // Solicitação de resgate (para gestores)
      if (notification.type === 'reward_redemption_requested') {
        toast.info(notification.message, {
          autoClose: 8000,
          onClick: () => {
            window.location.href = getNavigationUrl('/rewards/approve');
          },
        });
        options.onRedemptionRequested?.();
      }

      // Resgate aprovado (para usuário)
      if (notification.type === 'reward_redemption_approved') {
        toast.success(notification.message, {
          autoClose: 5000,
          icon: '✅',
          onClick: () => {
            window.location.href = getNavigationUrl('/rewards/my-redemptions');
          },
        });
        options.onRedemptionApproved?.();
      }

      // Resgate rejeitado (para usuário)
      if (notification.type === 'reward_redemption_rejected') {
        toast.error(notification.message, {
          autoClose: 8000,
          icon: '❌',
          onClick: () => {
            window.location.href = getNavigationUrl('/rewards/my-redemptions');
          },
        });
        options.onRedemptionRejected?.();
      }

      // Prêmio entregue (para usuário)
      if (notification.type === 'reward_delivered') {
        toast.success(notification.message, {
          autoClose: 5000,
          icon: '🎁',
          onClick: () => {
            window.location.href = getNavigationUrl('/rewards/my-redemptions');
          },
        });
        options.onRedemptionDelivered?.();
      }
    });
  }, [notifications, options]);
};

/**
 * Hook simplificado para auto-refresh de listas ao receber notificações de rewards
 */
export const useRewardNotificationsRefresh = (refetch?: () => void) => {
  useRewardNotifications({
    onRedemptionRequested: refetch,
    onRedemptionApproved: refetch,
    onRedemptionRejected: refetch,
    onRedemptionDelivered: refetch,
  });
};
