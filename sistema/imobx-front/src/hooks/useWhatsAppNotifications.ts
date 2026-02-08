import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { whatsappApi } from '../services/whatsappApi';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { useModuleAccess } from './useModuleAccess';
import { useCompanyContext } from '../contexts';
import { useUserPreferences } from './useUserPreferences';
import { showInfo } from '../utils/notifications';
import type { WhatsAppMessage } from '../types/whatsapp';
import { formatPhoneDisplay } from '../utils/whatsappUtils';

/**
 * Hook para monitorar novas mensagens WhatsApp e mostrar notificações
 * quando o usuário não estiver na página de WhatsApp
 */
export const useWhatsAppNotifications = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const permissionsContext = usePermissionsContextOptional();
  const { selectedCompany } = useCompanyContext();
  const moduleAccess = useModuleAccess();
  const { preferences } = useUserPreferences();

  // Refs para rastrear mensagens já notificadas
  const notifiedMessageIdsRef = useRef<Set<string>>(new Set());
  const previousUnreadCountRef = useRef<number>(0);
  const lastCheckTimeRef = useRef<number>(Date.now());

  // Verificar se está na página de WhatsApp
  const isOnWhatsAppPage = useCallback(() => {
    const path = location.pathname;
    return (
      path === '/whatsapp' ||
      path === '/sistema/whatsapp' ||
      path.startsWith('/whatsapp/') ||
      path.startsWith('/sistema/whatsapp/') ||
      path.startsWith('/integrations/whatsapp')
    );
  }, [location.pathname]);

  // Verificar se o usuário tem acesso ao WhatsApp
  const hasWhatsAppAccess = useCallback(() => {
    // Verificar permissões
    const hasViewPermission =
      permissionsContext?.hasPermission('whatsapp:view') ?? false;
    const hasViewMessagesPermission =
      permissionsContext?.hasPermission('whatsapp:view_messages') ?? false;
    if (!hasViewPermission && !hasViewMessagesPermission) {
      return false;
    }

    // Verificar se a empresa tem o módulo API_INTEGRATIONS
    if (!moduleAccess.isModuleAvailableForCompany('API_INTEGRATIONS')) {
      return false;
    }

    return true;
  }, [permissionsContext, moduleAccess]);

  // Verificar se o usuário tem notificações habilitadas
  const hasNotificationsEnabled = useCallback(() => {
    // Verificar preferências do usuário (inApp ou push)
    const notificationSettings = preferences?.notificationSettings;
    const hasInAppNotifications = notificationSettings?.inApp ?? true; // Padrão: true
    const hasPushNotifications = notificationSettings?.push ?? true; // Padrão: true

    // Se nenhuma notificação estiver habilitada, não mostrar
    if (!hasInAppNotifications && !hasPushNotifications) {
      return false;
    }

    // Para notificações push do navegador, verificar permissão
    if (hasPushNotifications && 'Notification' in window) {
      return Notification.permission === 'granted';
    }

    // Se apenas inApp estiver habilitada, sempre mostrar toast
    return hasInAppNotifications;
  }, [preferences]);

  // Função para mostrar notificação
  const showWhatsAppNotification = useCallback(
    (message: WhatsAppMessage) => {
      const phoneDisplay = formatPhoneDisplay(message.phoneNumber);
      const contactName = message.contactName || phoneDisplay;
      const messagePreview = message.message
        ? message.message.length > 50
          ? message.message.substring(0, 50) + '...'
          : message.message
        : 'Nova mensagem';

      const notificationSettings = preferences?.notificationSettings;
      const hasInAppNotifications = notificationSettings?.inApp ?? true; // Padrão: true
      const hasPushNotifications = notificationSettings?.push ?? true; // Padrão: true

      // Notificação push do navegador (se permitida e habilitada)
      if (
        hasPushNotifications &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        try {
          const notification = new Notification(
            `📱 Nova mensagem de ${contactName}`,
            {
              body: messagePreview,
              icon: '/favicon.ico', // Usar ícone do sistema
              badge: '/favicon.ico',
              tag: `whatsapp-${message.id}`, // Evitar duplicatas
              requireInteraction: false,
              silent: false,
            }
          );

          notification.onclick = () => {
            window.focus();
            navigate('/whatsapp');
            notification.close();
          };

          // Fechar automaticamente após 5 segundos
          setTimeout(() => {
            notification.close();
          }, 5000);
        } catch (error) {
          console.error('Erro ao mostrar notificação do navegador:', error);
        }
      }

      // Notificação toast in-app (se habilitada)
      if (hasInAppNotifications) {
        showInfo(`📱 Nova mensagem de ${contactName}`, {
          autoClose: 6000,
          onClick: () => {
            navigate('/whatsapp');
          },
        });
      }
    },
    [preferences, navigate]
  );

  // Monitorar novas mensagens
  useEffect(() => {
    // Verificar condições antes de iniciar monitoramento
    if (!hasWhatsAppAccess()) {
      return;
    }

    // Verificar se o usuário tem notificações habilitadas
    const notificationSettings = preferences?.notificationSettings;
    const hasInAppNotifications = notificationSettings?.inApp ?? true; // Padrão: true
    const hasPushNotifications = notificationSettings?.push ?? true; // Padrão: true

    if (!hasInAppNotifications && !hasPushNotifications) {
      return; // Usuário desabilitou todas as notificações
    }

    // Se estiver na página de WhatsApp, não mostrar notificações
    if (isOnWhatsAppPage()) {
      return;
    }

    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const checkForNewMessages = async () => {
      if (!isMounted || document.hidden) return;
      if (isOnWhatsAppPage()) return; // Verificar novamente

      try {
        // Buscar apenas mensagens não lidas recentes
        const response = await whatsappApi.getMessages({
          unreadOnly: true,
          direction: 'inbound',
          limit: 50, // Limitar para performance
        });

        if (!isMounted) return;

        // Verificar se há novas mensagens comparando com as já notificadas
        const newMessages = response.messages.filter(
          msg => !notifiedMessageIdsRef.current.has(msg.id)
        );

        // Notificar apenas mensagens novas
        newMessages.forEach(message => {
          // Adicionar ao set de mensagens notificadas
          notifiedMessageIdsRef.current.add(message.id);

          // Mostrar notificação
          showWhatsAppNotification(message);
        });

        // Atualizar contagem anterior
        previousUnreadCountRef.current = response.total;
        lastCheckTimeRef.current = Date.now();
      } catch (error) {
        // Erro silencioso - não interromper a experiência
        if (isMounted) {
          console.error('Erro ao verificar novas mensagens WhatsApp:', error);
        }
      }
    };

    // Verificar quando a página volta a ficar visível
    const handleVisibilityChange = () => {
      if (!document.hidden && isMounted && !isOnWhatsAppPage()) {
        // Pequeno delay para evitar chamadas muito frequentes
        setTimeout(() => {
          checkForNewMessages();
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Verificar a cada 5 segundos quando a página está visível
    intervalId = setInterval(() => {
      if (!document.hidden && isMounted && !isOnWhatsAppPage()) {
        checkForNewMessages();
      }
    }, 5000);

    // Verificação inicial
    checkForNewMessages();

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    hasWhatsAppAccess,
    isOnWhatsAppPage,
    showWhatsAppNotification,
    location.pathname,
    preferences,
  ]);

  // Limpar mensagens notificadas quando mudar de página ou empresa
  useEffect(() => {
    // Limpar quando sair da página de WhatsApp (para notificar novamente se voltar)
    if (!isOnWhatsAppPage()) {
      // Não limpar tudo, apenas mensagens antigas (mais de 5 minutos)
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      // Manter apenas IDs recentes para evitar notificações duplicadas
    }
  }, [isOnWhatsAppPage]);

  // Limpar quando mudar de empresa
  useEffect(() => {
    notifiedMessageIdsRef.current.clear();
    previousUnreadCountRef.current = 0;
  }, [selectedCompany?.id]);
};
