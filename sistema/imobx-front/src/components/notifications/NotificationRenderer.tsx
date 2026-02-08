/**
 * Renderizador de Notificações
 * Detecta o tipo de notificação e renderiza o componente apropriado
 */

import React from 'react';
import { PropertyMatchNotification } from './PropertyMatchNotification';
import type { Notification } from '../../services/notificationApi';

interface NotificationRendererProps {
  notification: Notification;
  onRead?: () => void;
  fallbackComponent?: React.ComponentType<{
    notification: Notification;
    onRead?: () => void;
  }>;
}

/**
 * Renderiza a notificação com o componente apropriado baseado no tipo
 */
export const NotificationRenderer: React.FC<NotificationRendererProps> = ({
  notification,
  onRead,
  fallbackComponent: FallbackComponent,
}) => {
  // Detectar tipo de notificação de match de propriedade
  const isPropertyMatch =
    notification.type === 'property_match_found' ||
    notification.type === 'property_match_high_score' ||
    notification.type === 'PROPERTY_MATCH_FOUND' ||
    notification.type === 'PROPERTY_MATCH_HIGH_SCORE';

  // Renderizar componente específico para matches de propriedade
  if (isPropertyMatch) {
    return (
      <PropertyMatchNotification notification={notification} onRead={onRead} />
    );
  }

  // Renderizar componente fallback se fornecido
  if (FallbackComponent) {
    return <FallbackComponent notification={notification} onRead={onRead} />;
  }

  // Renderização padrão simples
  return (
    <div
      style={{
        padding: '12px',
        border: '1px solid var(--border)',
        borderRadius: '8px',
      }}
    >
      <h4 style={{ margin: '0 0 8px 0' }}>{notification.title}</h4>
      <p
        style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}
      >
        {notification.message}
      </p>
    </div>
  );
};

/**
 * Hook utilitário para verificar se uma notificação é de match de propriedade
 */
export const useIsPropertyMatchNotification = (
  notification: Notification
): boolean => {
  return (
    notification.type === 'property_match_found' ||
    notification.type === 'property_match_high_score' ||
    notification.type === 'PROPERTY_MATCH_FOUND' ||
    notification.type === 'PROPERTY_MATCH_HIGH_SCORE'
  );
};
