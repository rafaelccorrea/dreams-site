import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { subscriptionService } from '../../services/subscriptionService';
import {
  MdWarning,
  MdError,
  MdInfo,
  MdClose,
  MdNotifications,
} from 'react-icons/md';

// Animações
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
`;

const NotificationCard = styled.div<{
  type: 'error' | 'warning' | 'info';
  isVisible: boolean;
}>`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-left: 4px solid
    ${props => {
      switch (props.type) {
        case 'error':
          return '#ef4444';
        case 'warning':
          return '#f59e0b';
        case 'info':
          return '#3b82f6';
        default:
          return '#6b7280';
      }
    }};
  animation: ${props => (props.isVisible ? slideIn : slideOut)} 0.3s ease-in-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${props => {
        switch (props.type) {
          case 'error':
            return '#ef4444, #dc2626';
          case 'warning':
            return '#f59e0b, #d97706';
          case 'info':
            return '#3b82f6, #1d4ed8';
          default:
            return '#6b7280, #4b5563';
        }
      }}
    );
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const NotificationIcon = styled.div<{ type: 'error' | 'warning' | 'info' }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => {
    switch (props.type) {
      case 'error':
        return '#fef2f2';
      case 'warning':
        return '#fffbeb';
      case 'info':
        return '#eff6ff';
      default:
        return '#f9fafb';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const NotificationTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const NotificationMessage = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px 0;
  line-height: 1.4;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props =>
    props.variant === 'primary'
      ? `
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const NotificationBell = styled.div<{ hasAlerts: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => (props.hasAlerts ? '#ef4444' : '#6b7280')};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  ${props =>
    props.hasAlerts &&
    `
    animation: ${pulse} 2s ease-in-out infinite;
  `}
`;

const AlertBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface SubscriptionAlert {
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  daysUntilExpiry: number;
  priority: 'high' | 'medium' | 'low';
  action: string;
}

export const SubscriptionNotification: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  const [alerts, setAlerts] = useState<SubscriptionAlert[]>([]);
  const [visibleNotifications, setVisibleNotifications] = useState<Set<string>>(
    new Set()
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'master') {
      loadAlerts();

      // Verificar alertas a cada 5 minutos
      const interval = setInterval(loadAlerts, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getSubscriptionAlerts();

      if (response.hasActiveSubscription && response.alerts) {
        setAlerts(response.alerts);

        // Mostrar notificações para novos alertas
        response.alerts.forEach((alert: SubscriptionAlert, index: number) => {
          const alertId = `${alert.type}-${alert.daysUntilExpiry}-${index}`;

          setTimeout(() => {
            setVisibleNotifications(prev => new Set([...prev, alertId]));
          }, index * 500); // Delay entre notificações
        });
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismissNotification = (alertId: string) => {
    setVisibleNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(alertId);
      return newSet;
    });
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'renew':
        navigate('/subscription-management');
        break;
      case 'manage':
        navigate('/subscription-management');
        break;
      default:
        break;
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const hasHighPriorityAlerts = alerts.some(alert => alert.priority === 'high');

  if (!user || (user.role !== 'admin' && user.role !== 'master')) {
    return null;
  }

  return (
    <>
      {/* Botão de notificação */}
      <NotificationBell
        hasAlerts={hasHighPriorityAlerts}
        onClick={toggleNotifications}
      >
        <MdNotifications size={20} />
        {alerts.length > 0 && (
          <AlertBadge>{alerts.length > 9 ? '9+' : alerts.length}</AlertBadge>
        )}
      </NotificationBell>

      {/* Notificações */}
      {showNotifications && (
        <NotificationContainer>
          {alerts.map((alert, index) => {
            const alertId = `${alert.type}-${alert.daysUntilExpiry}-${index}`;
            const isVisible = visibleNotifications.has(alertId);

            return (
              <NotificationCard
                key={alertId}
                type={alert.type}
                isVisible={isVisible}
              >
                <NotificationHeader>
                  <NotificationIcon type={alert.type}>
                    {alert.type === 'error' && <MdError />}
                    {alert.type === 'warning' && <MdWarning />}
                    {alert.type === 'info' && <MdInfo />}
                  </NotificationIcon>
                  <NotificationTitle>{alert.title}</NotificationTitle>
                  <CloseButton onClick={() => dismissNotification(alertId)}>
                    <MdClose size={14} />
                  </CloseButton>
                </NotificationHeader>

                <NotificationMessage>{alert.message}</NotificationMessage>

                <NotificationActions>
                  <ActionButton
                    variant='primary'
                    onClick={() => handleAction(alert.action)}
                  >
                    {alert.action === 'renew' ? 'Renovar' : 'Gerenciar'}
                  </ActionButton>
                  <ActionButton
                    variant='secondary'
                    onClick={() => navigate('/subscription-management')}
                  >
                    Ver Detalhes
                  </ActionButton>
                </NotificationActions>
              </NotificationCard>
            );
          })}

          {alerts.length === 0 && (
            <NotificationCard type='info' isVisible={true}>
              <NotificationHeader>
                <NotificationIcon type='info'>
                  <MdInfo />
                </NotificationIcon>
                <NotificationTitle>Nenhum Alerta</NotificationTitle>
                <CloseButton onClick={() => setShowNotifications(false)}>
                  <MdClose size={14} />
                </CloseButton>
              </NotificationHeader>
              <NotificationMessage>
                Sua assinatura está em dia. Não há alertas no momento.
              </NotificationMessage>
            </NotificationCard>
          )}
        </NotificationContainer>
      )}
    </>
  );
};

export default SubscriptionNotification;
