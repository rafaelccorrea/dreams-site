import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import {
  MdNotifications,
  MdClose,
  MdCheckCircle,
  MdInfo,
  MdWarning,
  MdError,
  MdDoneAll,
} from 'react-icons/md';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNotifications } from '../../hooks/useNotifications';
import { useCompanyContext } from '../../hooks/useCompanyContext';
import type { Notification } from '../../services/notificationApi';
import { getNotificationNavigationUrl } from '../../utils/notificationNavigation';

const NotificationButton = styled.button<{ $hasUnread: boolean }>`
  position: relative;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: ${props => props.theme.colors.text};

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
  border: 2px solid ${props => props.theme.colors.cardBackground};
`;

const NotificationPanel = styled.div<{
  $isOpen: boolean;
  $embedded?: boolean;
  $usePortal?: boolean;
}>`
  position: ${props => {
    if (props.$embedded) return 'relative';
    if (props.$usePortal) return 'fixed';
    return 'absolute';
  }};
  top: ${props => {
    if (props.$embedded) return 'auto';
    if (props.$usePortal) return '72px';
    return 'calc(100% + 8px)';
  }};
  right: ${props => {
    if (props.$embedded) return 'auto';
    if (props.$usePortal) return '20px';
    return '0';
  }};
  width: ${props => (props.$embedded ? '100%' : '420px')};
  max-height: 600px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  flex-direction: column;
  z-index: ${props => (props.$usePortal ? 10002 : props.$embedded ? 1 : 10002)};
  overflow: hidden;
  animation: slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    width: ${props => (props.$embedded ? '100%' : 'calc(100vw - 32px)')};
    right: ${props => (props.$embedded ? 'auto' : '-16px')};
  }
`;

const NotificationHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NotificationTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MarkAllButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}10;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const NotificationList = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 480px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.primaryDark};
    }
  }
`;

const NotificationItem = styled.div<{ $read: boolean; $type: string }>`
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props =>
    props.$read ? 'transparent' : props.theme.colors.backgroundSecondary};
  position: relative;

  ${props => {
    const typeColors: Record<string, string> = {
      // Aluguéis
      RENTAL_EXPIRING: '#f59e0b',
      RENTAL_EXPIRED: '#ef4444',
      rental_expiring: '#f59e0b',
      rental_expired: '#ef4444',

      // Pagamentos
      PAYMENT_DUE: '#f59e0b',
      PAYMENT_OVERDUE: '#ef4444',
      payment_due: '#f59e0b',
      payment_overdue: '#ef4444',

      // Chaves
      KEY_PENDING_RETURN: '#f59e0b',
      KEY_OVERDUE: '#ef4444',
      key_pending_return: '#f59e0b',
      key_overdue: '#ef4444',

      // Vistorias
      INSPECTION_SCHEDULED: '#3b82f6',
      INSPECTION_OVERDUE: '#ef4444',
      INSPECTION_APPROVAL_REQUESTED: '#ef4444',
      INSPECTION_APPROVED: '#10b981',
      INSPECTION_REJECTED: '#ef4444',
      inspection_scheduled: '#3b82f6',
      inspection_overdue: '#ef4444',
      inspection_approval_requested: '#ef4444',
      inspection_approved: '#10b981',
      inspection_rejected: '#ef4444',

      // Documentos
      CLIENT_DOCUMENT_EXPIRING: '#f59e0b',
      PROPERTY_DOCUMENT_EXPIRING: '#f59e0b',
      client_document_expiring: '#f59e0b',
      property_document_expiring: '#f59e0b',

      // Tarefas
      TASK_ASSIGNED: '#10b981',
      TASK_DUE: '#f59e0b',
      TASK_OVERDUE: '#ef4444',
      task_assigned: '#10b981',
      task_due: '#f59e0b',
      task_overdue: '#ef4444',

      // Notas
      NOTE_PENDING: '#3b82f6',
      note_pending: '#3b82f6',

      // Compromissos
      APPOINTMENT_REMINDER: '#f59e0b',
      APPOINTMENT_INVITE: '#3b82f6',
      APPOINTMENT_INVITE_ACCEPTED: '#10b981',
      APPOINTMENT_INVITE_DECLINED: '#ef4444',
      appointment_reminder: '#f59e0b',
      appointment_invite: '#3b82f6',
      appointment_invite_accepted: '#10b981',
      appointment_invite_declined: '#ef4444',

      // Assinaturas
      SUBSCRIPTION_EXPIRING_SOON: '#f59e0b',
      SUBSCRIPTION_EXPIRED: '#ef4444',
      subscription_expiring_soon: '#f59e0b',
      subscription_expired: '#ef4444',

      // Sistema
      SYSTEM_ALERT: '#8b5cf6',
      NEW_MESSAGE: '#3b82f6',
      system_alert: '#8b5cf6',
      new_message: '#3b82f6',
    };
    const color = typeColors[props.$type] || '#3b82f6';
    return `
      border-left: 3px solid ${color};
    `;
  }}

  &:hover {
    background: ${props => props.theme.colors.primary}08;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationIcon = styled.div<{ $type: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${props => {
    const typeStyles: Record<string, string> = {
      // Aluguéis
      RENTAL_EXPIRING: 'background: #f59e0b20; color: #f59e0b;',
      RENTAL_EXPIRED: 'background: #ef444420; color: #ef4444;',
      rental_expiring: 'background: #f59e0b20; color: #f59e0b;',
      rental_expired: 'background: #ef444420; color: #ef4444;',

      // Pagamentos
      PAYMENT_DUE: 'background: #f59e0b20; color: #f59e0b;',
      PAYMENT_OVERDUE: 'background: #ef444420; color: #ef4444;',
      payment_due: 'background: #f59e0b20; color: #f59e0b;',
      payment_overdue: 'background: #ef444420; color: #ef4444;',

      // Chaves
      KEY_PENDING_RETURN: 'background: #f59e0b20; color: #f59e0b;',
      KEY_OVERDUE: 'background: #ef444420; color: #ef4444;',
      key_pending_return: 'background: #f59e0b20; color: #f59e0b;',
      key_overdue: 'background: #ef444420; color: #ef4444;',

      // Vistorias
      INSPECTION_SCHEDULED: 'background: #3b82f620; color: #3b82f6;',
      INSPECTION_OVERDUE: 'background: #ef444420; color: #ef4444;',
      INSPECTION_APPROVAL_REQUESTED: 'background: #ef444420; color: #ef4444;',
      INSPECTION_APPROVED: 'background: #10b98120; color: #10b981;',
      INSPECTION_REJECTED: 'background: #ef444420; color: #ef4444;',
      inspection_scheduled: 'background: #3b82f620; color: #3b82f6;',
      inspection_overdue: 'background: #ef444420; color: #ef4444;',
      inspection_approval_requested: 'background: #ef444420; color: #ef4444;',
      inspection_approved: 'background: #10b98120; color: #10b981;',
      inspection_rejected: 'background: #ef444420; color: #ef4444;',

      // Documentos
      CLIENT_DOCUMENT_EXPIRING: 'background: #f59e0b20; color: #f59e0b;',
      PROPERTY_DOCUMENT_EXPIRING: 'background: #f59e0b20; color: #f59e0b;',
      client_document_expiring: 'background: #f59e0b20; color: #f59e0b;',
      property_document_expiring: 'background: #f59e0b20; color: #f59e0b;',

      // Tarefas
      TASK_ASSIGNED: 'background: #10b98120; color: #10b981;',
      TASK_DUE: 'background: #f59e0b20; color: #f59e0b;',
      TASK_OVERDUE: 'background: #ef444420; color: #ef4444;',
      task_assigned: 'background: #10b98120; color: #10b981;',
      task_due: 'background: #f59e0b20; color: #f59e0b;',
      task_overdue: 'background: #ef444420; color: #ef4444;',

      // Notas
      NOTE_PENDING: 'background: #3b82f620; color: #3b82f6;',
      note_pending: 'background: #3b82f620; color: #3b82f6;',

      // Compromissos
      APPOINTMENT_REMINDER: 'background: #f59e0b20; color: #f59e0b;',
      APPOINTMENT_INVITE: 'background: #3b82f620; color: #3b82f6;',
      APPOINTMENT_INVITE_ACCEPTED: 'background: #10b98120; color: #10b981;',
      APPOINTMENT_INVITE_DECLINED: 'background: #ef444420; color: #ef4444;',
      appointment_reminder: 'background: #f59e0b20; color: #f59e0b;',
      appointment_invite: 'background: #3b82f620; color: #3b82f6;',
      appointment_invite_accepted: 'background: #10b98120; color: #10b981;',
      appointment_invite_declined: 'background: #ef444420; color: #ef4444;',

      // Assinaturas
      SUBSCRIPTION_EXPIRING_SOON: 'background: #f59e0b20; color: #f59e0b;',
      SUBSCRIPTION_EXPIRED: 'background: #ef444420; color: #ef4444;',
      subscription_expiring_soon: 'background: #f59e0b20; color: #f59e0b;',
      subscription_expired: 'background: #ef444420; color: #ef4444;',

      // Sistema
      SYSTEM_ALERT: 'background: #8b5cf620; color: #8b5cf6;',
      NEW_MESSAGE: 'background: #3b82f620; color: #3b82f6;',
      system_alert: 'background: #8b5cf620; color: #8b5cf6;',
      new_message: 'background: #3b82f620; color: #3b82f6;',
    };
    return typeStyles[props.$type] || 'background: #3b82f620; color: #3b82f6;';
  }}
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationItemHeader = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
`;

const NotificationItemTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  margin-bottom: 4px;
`;

const NotificationMessage = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
`;

const NotificationTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 8px;
`;

const NotificationMetadata = styled.div`
  margin-top: 6px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const LoadingIndicator = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-top: 2px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const EndMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  font-style: italic;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
`;

const CompanyBadge = styled.span`
  display: inline-block;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 4px;
`;

const ConnectionStatus = styled.div<{ $connected: boolean }>`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => (props.$connected ? '#10b981' : '#ef4444')};
  border: 2px solid ${props => props.theme.colors.cardBackground};
`;

interface NotificationCenterProps {
  embedded?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  embedded = false,
  isOpen: externalIsOpen,
  onClose,
  onUnreadCountChange,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [panelPosition, setPanelPosition] = useState({ top: 72, right: 20 });
  const navigate = useNavigate();
  const { setSelectedCompany, companies } = useCompanyContext();

  const {
    notifications: notificationsFromHook,
    unreadCount,
    loading,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
    connected,
  } = useNotifications();

  // Garantir que notifications seja sempre um array válido
  const notifications = Array.isArray(notificationsFromHook)
    ? notificationsFromHook
    : [];

  useEffect(() => {
    if (typeof onUnreadCountChange === 'function') {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  // Calcular posição do painel quando abrir (para usar com portal)
  useEffect(() => {
    if (embedded || !internalIsOpen || !buttonRef.current) {
      return;
    }

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const headerHeight = 72; // Altura do header
    const spacing = 8;

    setPanelPosition({
      top: buttonRect.bottom + spacing,
      right: window.innerWidth - buttonRect.right,
    });
  }, [embedded, internalIsOpen]);

  useEffect(() => {
    if (embedded) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setInternalIsOpen(false);
      }
    };

    if (internalIsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [embedded, internalIsOpen]);

  const isPanelOpen = embedded ? Boolean(externalIsOpen) : internalIsOpen;

  const closePanel = () => {
    if (embedded) {
      onClose?.();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleToggle = () => {
    if (embedded) {
      if (isPanelOpen) {
        onClose?.();
      }
    } else {
      setInternalIsOpen(prev => !prev);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Marcar como lida
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Trocar de empresa se necessário
    if (notification.companyId && companies && Array.isArray(companies)) {
      const currentCompanyId = companies.find(c => c.id)?.id; // Pegar a empresa atual
      const targetCompany = companies.find(
        c => c.id === notification.companyId
      );

      if (targetCompany && currentCompanyId !== notification.companyId) {
        // console.log('[NotificationCenter] Trocando para empresa:', targetCompany.name);
        setSelectedCompany(targetCompany);
      }
    }

    // Determinar a URL de navegação usando o utilitário
    const navigationUrl = getNotificationNavigationUrl(notification);

    // Navegar para a URL determinada
    if (navigationUrl) {
      // console.log('[NotificationCenter] Navegando para:', navigationUrl);
      navigate(navigationUrl);
      closePanel();
    } else {
      console.warn(
        '[NotificationCenter] Não foi possível determinar URL de navegação para a notificação:',
        notification
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  // Scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current || loading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = listRef.current;

      // Quando chegar a 80% do scroll, carrega mais
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        loadMore();
      }
    };

    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading, hasMore, notifications.length, loadMore]);

  const getNotificationIcon = (type: string) => {
    const iconMap: Record<string, JSX.Element> = {
      // Aluguéis
      RENTAL_EXPIRING: <MdWarning size={18} />,
      RENTAL_EXPIRED: <MdError size={18} />,
      rental_expiring: <MdWarning size={18} />,
      rental_expired: <MdError size={18} />,

      // Pagamentos
      PAYMENT_DUE: <MdWarning size={18} />,
      PAYMENT_OVERDUE: <MdError size={18} />,
      payment_due: <MdWarning size={18} />,
      payment_overdue: <MdError size={18} />,

      // Chaves
      KEY_PENDING_RETURN: <MdWarning size={18} />,
      KEY_OVERDUE: <MdError size={18} />,
      key_pending_return: <MdWarning size={18} />,
      key_overdue: <MdError size={18} />,

      // Vistorias
      INSPECTION_SCHEDULED: <MdInfo size={18} />,
      INSPECTION_OVERDUE: <MdError size={18} />,
      INSPECTION_APPROVAL_REQUESTED: <MdError size={18} />,
      INSPECTION_APPROVED: <MdCheckCircle size={18} />,
      INSPECTION_REJECTED: <MdError size={18} />,
      inspection_scheduled: <MdInfo size={18} />,
      inspection_overdue: <MdError size={18} />,
      inspection_approval_requested: <MdError size={18} />,
      inspection_approved: <MdCheckCircle size={18} />,
      inspection_rejected: <MdError size={18} />,

      // Documentos
      CLIENT_DOCUMENT_EXPIRING: <MdWarning size={18} />,
      PROPERTY_DOCUMENT_EXPIRING: <MdWarning size={18} />,
      client_document_expiring: <MdWarning size={18} />,
      property_document_expiring: <MdWarning size={18} />,

      // Tarefas
      TASK_ASSIGNED: <MdCheckCircle size={18} />,
      TASK_DUE: <MdWarning size={18} />,
      TASK_OVERDUE: <MdError size={18} />,
      task_assigned: <MdCheckCircle size={18} />,
      task_due: <MdWarning size={18} />,
      task_overdue: <MdError size={18} />,

      // Notas
      NOTE_PENDING: <MdInfo size={18} />,
      note_pending: <MdInfo size={18} />,

      // Compromissos
      APPOINTMENT_REMINDER: <MdWarning size={18} />,
      APPOINTMENT_INVITE: <MdInfo size={18} />,
      APPOINTMENT_INVITE_ACCEPTED: <MdCheckCircle size={18} />,
      APPOINTMENT_INVITE_DECLINED: <MdError size={18} />,
      appointment_reminder: <MdWarning size={18} />,
      appointment_invite: <MdInfo size={18} />,
      appointment_invite_accepted: <MdCheckCircle size={18} />,
      appointment_invite_declined: <MdError size={18} />,

      // Assinaturas
      SUBSCRIPTION_EXPIRING_SOON: <MdWarning size={18} />,
      SUBSCRIPTION_EXPIRED: <MdError size={18} />,
      subscription_expiring_soon: <MdWarning size={18} />,
      subscription_expired: <MdError size={18} />,

      // Sistema
      SYSTEM_ALERT: <MdInfo size={18} />,
      NEW_MESSAGE: <MdInfo size={18} />,
      system_alert: <MdInfo size={18} />,
      new_message: <MdInfo size={18} />,
    };
    return iconMap[type] || <MdInfo size={18} />;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;

    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const formatDateLong = (value?: string | null) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const getMetadataLines = (notification: Notification): string[] => {
    if (!notification?.metadata) return [];
    const type = notification.type?.toLowerCase();
    const metadata = notification.metadata;

    if (type === 'subscription_expiring_soon') {
      const lines: string[] = [];
      const reminderDays = metadata.reminderDays ?? metadata.reminder_days;
      const trialEndsAt = metadata.trialEndsAt ?? metadata.trial_ends_at;
      const nextBillingDate =
        metadata.nextBillingDate ?? metadata.next_billing_date;

      if (typeof reminderDays === 'number') {
        if (reminderDays <= 0) {
          lines.push('Último dia do período de teste.');
        } else {
          lines.push(
            `Faltam ${reminderDays} ${reminderDays === 1 ? 'dia' : 'dias'} para o fim do trial.`
          );
        }
      }

      const formattedTrialEnds = formatDateLong(trialEndsAt);
      if (formattedTrialEnds) {
        lines.push(`Trial encerra em ${formattedTrialEnds}.`);
      }

      const formattedNextBilling = formatDateLong(nextBillingDate);
      if (formattedNextBilling) {
        lines.push(
          `Cobrança automática programada para ${formattedNextBilling}.`
        );
      }

      return lines;
    }

    return [];
  };

  const panelContent = (
    <>
      <NotificationHeader>
        <NotificationTitle>
          <MdNotifications size={20} />
          Notificações
        </NotificationTitle>
        <HeaderActions>
          {unreadCount > 0 && (
            <MarkAllButton onClick={handleMarkAllAsRead} disabled={loading}>
              <MdDoneAll size={16} />
              Marcar todas como lida
            </MarkAllButton>
          )}
          {!embedded && (
            <CloseButton onClick={() => closePanel()}>
              <MdClose size={20} />
            </CloseButton>
          )}
        </HeaderActions>
      </NotificationHeader>

      <NotificationList ref={listRef}>
        {notifications.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🔔</EmptyIcon>
            <EmptyText>Nenhuma notificação ainda</EmptyText>
          </EmptyState>
        ) : (
          <>
            {notifications.map(notification => {
              const metadataLines = getMetadataLines(notification);

              return (
                <NotificationItem
                  key={notification.id}
                  $read={notification.read}
                  $type={notification.type}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <NotificationItemHeader>
                    <NotificationIcon $type={notification.type}>
                      {getNotificationIcon(notification.type)}
                    </NotificationIcon>
                    <NotificationContent>
                      <NotificationItemTitle>
                        {notification.title}
                      </NotificationItemTitle>
                      <NotificationMessage>
                        {notification.message}
                      </NotificationMessage>
                      {metadataLines.length > 0 && (
                        <NotificationMetadata>
                          {metadataLines.map((line, index) => (
                            <span key={index}>{line}</span>
                          ))}
                        </NotificationMetadata>
                      )}
                      <NotificationTime>
                        {formatTimestamp(new Date(notification.createdAt))}
                      </NotificationTime>
                    </NotificationContent>
                  </NotificationItemHeader>
                </NotificationItem>
              );
            })}

            {loading && (
              <LoadingIndicator>
                <LoadingSpinner />
                <LoadingText>Carregando mais notificações...</LoadingText>
              </LoadingIndicator>
            )}

            {!hasMore && (
              <EndMessage>Todas as notificações foram carregadas</EndMessage>
            )}
          </>
        )}
      </NotificationList>
    </>
  );

  if (embedded) {
    return (
      <NotificationPanel ref={panelRef} $isOpen={isPanelOpen} $embedded>
        {panelContent}
      </NotificationPanel>
    );
  }

  const buttonElement = (
    <NotificationButton
      ref={buttonRef}
      onClick={handleToggle}
      $hasUnread={unreadCount > 0}
    >
      <MdNotifications size={20} />
      {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
      <ConnectionStatus
        $connected={connected}
        title={connected ? 'Conectado' : 'Desconectado'}
      />
    </NotificationButton>
  );

  return (
    <>
      <div style={{ position: 'relative' }}>{buttonElement}</div>
      {isPanelOpen &&
        createPortal(
          <NotificationPanel
            ref={panelRef}
            $isOpen={isPanelOpen}
            $usePortal={true}
            style={{
              top: `${panelPosition.top}px`,
              right: `${panelPosition.right}px`,
            }}
          >
            {panelContent}
          </NotificationPanel>,
          document.body
        )}
    </>
  );
};
