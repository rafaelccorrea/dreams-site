import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdNotifications,
  MdNotificationsActive,
  MdClose,
  MdWarning,
  MdError,
  MdCheckCircle,
} from 'react-icons/md';
import type { KanbanTask } from '../../types/kanban';
import { useDeadlineAlerts } from '../../hooks/useDeadlineAlerts';

interface KanbanNotificationsProps {
  tasks: KanbanTask[];
  className?: string;
}

const NotificationsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const NotificationButton = styled.button<{ $hasAlerts: boolean }>`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  position: relative;
  color: ${props =>
    props.$hasAlerts
      ? props.theme.colors.error
      : props.theme.colors.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  background: ${props => props.theme.colors.error};
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  border: 2px solid ${props => props.theme.colors.surface};
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const NotificationDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  min-width: 320px;
  max-width: 400px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  margin-top: 8px;
`;

const NotificationHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NotificationTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const NotificationList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const NotificationItem = styled.div<{ type: 'warning' | 'overdue' }>`
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationIcon = styled.div<{ type: 'warning' | 'overdue' }>`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props =>
    props.type === 'overdue'
      ? props.theme.colors.error
      : props.theme.colors.warning};
  color: ${props => props.theme.colors.cardBackground};
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTaskTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
  word-break: break-word;
`;

const NotificationMessage = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
`;

const NotificationDate = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ClearAllButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => `${props.theme.colors.primary}20`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MarkAsReadButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: ${props => `${props.theme.colors.primary}20`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NotificationItemActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const MarkItemAsReadButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: ${props => `${props.theme.colors.primary}20`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NotificationItemRead = styled.div<{ $isRead: boolean }>`
  opacity: ${props => (props.$isRead ? 0.6 : 1)};
  position: relative;

  ${props =>
    props.$isRead &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${props.theme.colors.background};
      opacity: 0.3;
      pointer-events: none;
    }
  `}
`;

export const KanbanNotifications: React.FC<KanbanNotificationsProps> = ({
  tasks,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { alerts, unreadCount, markAsRead, markAllAsRead, refreshAlerts } =
    useDeadlineAlerts();

  // Atualizar alertas quando as tarefas mudarem
  useEffect(() => {
    refreshAlerts(tasks);
  }, [tasks, refreshAlerts]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleMarkAsRead = (alertId: string) => {
    markAsRead(alertId);
  };

  // Filtrar apenas alertas não lidos para exibição
  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <NotificationsContainer className={className}>
      <NotificationButton $hasAlerts={unreadCount > 0} onClick={handleToggle}>
        {unreadCount > 0 ? (
          <MdNotificationsActive size={24} />
        ) : (
          <MdNotifications size={24} />
        )}
        {unreadCount > 0 && (
          <NotificationBadge>
            {unreadCount > 99 ? '99+' : unreadCount}
          </NotificationBadge>
        )}
      </NotificationButton>

      <NotificationDropdown $isOpen={isOpen}>
        <NotificationHeader>
          <NotificationTitle>
            Alertas de Prazo ({unreadCount} não lidos)
          </NotificationTitle>
          <NotificationActions>
            {unreadCount > 0 && (
              <MarkAsReadButton onClick={handleMarkAllAsRead}>
                <MdCheckCircle size={14} />
                Marcar como lidas
              </MarkAsReadButton>
            )}
            <CloseButton onClick={handleClose}>
              <MdClose size={16} />
            </CloseButton>
          </NotificationActions>
        </NotificationHeader>

        <NotificationList>
          {alerts.length === 0 ? (
            <EmptyState>Nenhum alerta de prazo no momento</EmptyState>
          ) : (
            alerts.map(alert => (
              <NotificationItem
                key={alert.id}
                type={alert.type}
                as={NotificationItemRead}
                $isRead={alert.isRead}
              >
                <NotificationIcon type={alert.type}>
                  {alert.type === 'overdue' ? (
                    <MdError size={16} />
                  ) : (
                    <MdWarning size={16} />
                  )}
                </NotificationIcon>
                <NotificationContent>
                  <NotificationTaskTitle>
                    {alert.taskTitle}
                  </NotificationTaskTitle>
                  <NotificationMessage>{alert.message}</NotificationMessage>
                  <NotificationDate>
                    Vence em: {formatDate(alert.dueDate)}
                  </NotificationDate>
                  {!alert.isRead && (
                    <NotificationItemActions>
                      <MarkItemAsReadButton
                        onClick={() => handleMarkAsRead(alert.id)}
                      >
                        <MdCheckCircle size={14} />
                        Marcar como lida
                      </MarkItemAsReadButton>
                    </NotificationItemActions>
                  )}
                </NotificationContent>
              </NotificationItem>
            ))
          )}
        </NotificationList>
      </NotificationDropdown>
    </NotificationsContainer>
  );
};

export default KanbanNotifications;
