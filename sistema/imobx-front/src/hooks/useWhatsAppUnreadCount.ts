import { useState, useEffect, useMemo, useCallback } from 'react';
import { whatsappApi } from '../services/whatsappApi';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';

/**
 * Hook para obter o contador de mensagens não lidas do WhatsApp
 * Carrega quando necessário (ao montar, quando a página ganha foco, e a cada 30 segundos)
 */
export const useWhatsAppUnreadCount = (): number => {
  const permissionsContext = usePermissionsContextOptional();
  const [unreadCount, setUnreadCount] = useState(0);

  // Verificar permissão e Company ID antes de fazer requisições
  const hasViewMessagesPermission =
    permissionsContext?.hasPermission('whatsapp:view_messages') ?? false;
  const hasCompanyId = !!localStorage.getItem('dream_keys_selected_company_id');

  const loadUnreadCount = useCallback(async () => {
    // Não fazer requisição se não tiver permissão ou Company ID
    if (!hasViewMessagesPermission || !hasCompanyId) {
      setUnreadCount(0);
      return;
    }

    try {
      const count = await whatsappApi.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      // Silenciosamente ignorar erros - não fazer nada
      setUnreadCount(0);
    }
  }, [hasViewMessagesPermission, hasCompanyId]);

  // Carregar apenas ao montar
  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  // Recarregar quando a página volta a ficar visível e periodicamente (a cada 30 segundos)
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Pequeno delay para evitar chamadas muito frequentes
        setTimeout(() => {
          loadUnreadCount();
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Atualizar a cada 30 segundos quando a página está visível (reduzido de 5s para evitar chamadas excessivas)
    intervalId = setInterval(() => {
      if (!document.hidden) {
        loadUnreadCount();
      }
    }, 30000); // 30 segundos ao invés de 5 segundos

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalId) clearInterval(intervalId);
    };
  }, [loadUnreadCount]);

  return useMemo(() => {
    return unreadCount || 0;
  }, [unreadCount]);
};
