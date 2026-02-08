import { useMemo, useState, useEffect } from 'react';
import { useNotifications } from './useNotifications';
import {
  getTestNotifications,
  addUpdateListener,
} from '../utils/testNotificationBadges';

/**
 * Mapeamento de rotas para tipos de notificações
 */
const routeToNotificationTypes: Record<string, string[]> = {
  '/inspections': ['inspection', 'inspection_approval'],
  '/rentals': ['rental'],
  '/keys': ['key'],
  '/financial': ['payment', 'inspection_approval'],
  '/clients': ['client', 'document'],
  '/properties': ['property', 'property_match', 'document'],
  '/matches': ['property_match'],
  '/tasks': ['task'],
  '/appointments': ['appointment', 'appointment_invite'],
  '/notes': ['note'],
  '/messages': ['message'],
  '/subscriptions': ['subscription'],
};

/**
 * Hook para obter contadores de notificações por rota
 */
export const useNotificationCounts = () => {
  const { notifications, unreadCount } = useNotifications();
  const [testNotificationsUpdate, setTestNotificationsUpdate] = useState(0);

  // Escutar atualizações de notificações de teste
  useEffect(() => {
    const handleUpdate = () => {
      setTestNotificationsUpdate(prev => prev + 1);
    };

    const removeListener = addUpdateListener(handleUpdate);

    // Escutar evento customizado também
    window.addEventListener('test-notifications-updated', handleUpdate);

    return () => {
      removeListener();
      window.removeEventListener('test-notifications-updated', handleUpdate);
    };
  }, []);

  const countsByRoute = useMemo(() => {
    const counts: Record<string, number> = {};

    // Inicializar contadores para todas as rotas
    Object.keys(routeToNotificationTypes).forEach(route => {
      counts[route] = 0;
    });

    // Combinar notificações reais com notificações de teste
    const testNotifications = getTestNotifications();
    const allNotifications = [...notifications, ...testNotifications];

    // Contar notificações não lidas por rota
    allNotifications.forEach(notification => {
      if (notification.read) return;

      // Verificar cada rota e seus tipos associados
      Object.entries(routeToNotificationTypes).forEach(([route, types]) => {
        if (
          types.includes(notification.type) ||
          types.includes(notification.entityType || '')
        ) {
          counts[route] = (counts[route] || 0) + 1;
        }
      });
    });

    return counts;
  }, [notifications, testNotificationsUpdate]);

  /**
   * Obtém o contador de notificações para uma rota específica
   */
  const getCountForRoute = (route: string): number => {
    return countsByRoute[route] || 0;
  };

  /**
   * Obtém o contador total de notificações não lidas
   */
  const getTotalCount = (): number => {
    return unreadCount;
  };

  return {
    countsByRoute,
    getCountForRoute,
    getTotalCount,
    unreadCount,
  };
};
