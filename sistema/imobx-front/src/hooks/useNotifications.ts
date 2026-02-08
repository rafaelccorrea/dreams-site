import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationApi } from '../services/notificationApi';
import type {
  Notification,
  NotificationQueryParams,
} from '../services/notificationApi';
import { useAuth } from './useAuth';
import { useCompanyContext } from './useCompanyContext';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  loadNotifications: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  connected: boolean;
}

export const useNotifications = (
  params?: NotificationQueryParams
): UseNotificationsReturn => {
  const { getToken, getCurrentUser } = useAuth();
  const { selectedCompany } = useCompanyContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);

  // Debug: monitorar mudanças no unreadCount (removed console.trace for performance)
  useEffect(() => {
    // console.log('[useNotifications] 🔢 unreadCount mudou para:', unreadCount);
    // Removed console.trace to prevent performance issues
  }, [unreadCount]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [connected, setConnected] = useState(false);
  const wsInitialized = useRef(false);

  /**
   * Inicializa a conexão WebSocket
   */
  const initializeWebSocket = useCallback(() => {
    if (wsInitialized.current) {
      console.log(
        '[useNotifications] ⏭️ WebSocket já inicializado, pulando...'
      );
      return;
    }

    const token = getToken();
    if (!token) {
      console.error(
        '[useNotifications] ❌ Token não encontrado! Não é possível conectar ao WebSocket'
      );
      return;
    }

    // Obter dados do usuário - CORRIGIDO: usando a chave correta do localStorage
    // A chave correta é 'dream_keys_user_data' (conforme authStorage.ts)
    let userId: string | undefined;

    // Tentar primeiro com a chave correta (dream_keys_user_data)
    let userData =
      localStorage.getItem('dream_keys_user_data') ||
      sessionStorage.getItem('dream_keys_user_data');

    // Fallback para chave antiga se existir
    if (!userData) {
      userData =
        localStorage.getItem('dream_keys_user') ||
        sessionStorage.getItem('dream_keys_user');
    }

    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user?.id;
        console.log('[useNotifications] 📦 UserId do localStorage:', userId);
        console.log('[useNotifications] 👤 Dados do usuário:', {
          id: user?.id,
          name: user?.name,
          email: user?.email,
        });
      } catch (error) {
        console.error(
          '[useNotifications] ❌ Erro ao parsear dados do usuário do localStorage:',
          error
        );
      }
    } else {
      console.error(
        '[useNotifications] ❌ Nenhum dado de usuário encontrado no localStorage/sessionStorage'
      );
      console.error(
        '[useNotifications] 🔍 Chaves verificadas: dream_keys_user_data, dream_keys_user'
      );
    }

    // Se não conseguiu pelo localStorage, não conecta
    if (!userId) {
      console.error(
        '[useNotifications] ❌ UserId não encontrado! Não é possível conectar ao WebSocket'
      );
      console.error(
        '[useNotifications] 💡 Dica: Faça logout e login novamente'
      );
      return;
    }

    console.log('[useNotifications] 🚀 Inicializando WebSocket...');
    console.log('[useNotifications] 👤 UserId:', userId);
    console.log('[useNotifications] 🔑 Token presente:', !!token);
    notificationApi.connect(token, userId);
    wsInitialized.current = true;

    // CORREÇÃO: Definir callbacks como funções nomeadas para poder remover depois
    const handleConnected = () => {
      console.log('[useNotifications] ✅ WebSocket conectado com sucesso!');
      setConnected(true);

      // Inscrever na empresa atual se houver
      if (selectedCompany?.id) {
        console.log(
          '[useNotifications] 🏢 Inscrevendo na empresa:',
          selectedCompany.id
        );
        notificationApi.subscribeToCompany(selectedCompany.id);
      }
    };

    const handleDisconnected = () => {
      console.log('[useNotifications] ❌ WebSocket desconectado');
      setConnected(false);
    };

    const handleNewNotification = (notification: Notification) => {
      console.log(
        '[useNotifications] 🔔 Nova notificação recebida:',
        notification
      );
      // Verificar se a notificação já existe para evitar duplicação
      setNotifications(prev => {
        const exists = prev.some(n => n.id === notification.id);
        if (exists) {
          // console.log('[useNotifications] Notificação já existe, ignorando duplicata');
          return prev;
        }
        return [notification, ...prev];
      });

      // Incrementar contador de não lidas se não foi lida
      if (!notification.read) {
        setUnreadCount(prev => prev + 1);
      }
    };

    const handleBadgeUpdate = (count: number) => {
      // console.log('[useNotifications] Badge atualizado via WebSocket:', count);
      // console.log('[useNotifications] Badge anterior:', unreadCount);
      // console.log('[useNotifications] isMarkingAllAsRead:', isMarkingAllAsRead);
      // Sempre aceitar atualizações do WebSocket, mas com prioridade para o estado local
      if (isMarkingAllAsRead) {
        // Se estamos marcando todas como lidas, só aceitar se o count for 0 ou menor que o atual
        if (count === 0 || count < unreadCount) {
          // console.log('[useNotifications] Aceitando badge_update durante markAllAsRead:', count);
          setUnreadCount(count);
        } else {
          // console.log('[useNotifications] Ignorando badge_update durante markAllAsRead (count maior que esperado):', count);
        }
      } else {
        // Normalmente, aceitar todas as atualizações do WebSocket
        setUnreadCount(count);
      }
    };

    const handleNotificationRead = (notificationId: string) => {
      // console.log('[useNotifications] Notificação marcada como lida:', notificationId);
      // Atualizar notificação na lista
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );

      // CORREÇÃO: Decrementar contador de badge
      setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleError = (error: any) => {
      console.error('[useNotifications] Erro do WebSocket:', error);
      setError(error.message || 'Erro na conexão com notificações');
    };

    // Adicionar listeners
    notificationApi.on('connected', handleConnected);
    notificationApi.on('disconnected', handleDisconnected);
    notificationApi.on('new_notification', handleNewNotification);
    notificationApi.on('badge_update', handleBadgeUpdate);
    notificationApi.on('notification_read', handleNotificationRead);
    notificationApi.on('error', handleError);

    // CORREÇÃO: Retornar função de cleanup para remover listeners
    return () => {
      notificationApi.off('connected', handleConnected);
      notificationApi.off('disconnected', handleDisconnected);
      notificationApi.off('new_notification', handleNewNotification);
      notificationApi.off('badge_update', handleBadgeUpdate);
      notificationApi.off('notification_read', handleNotificationRead);
      notificationApi.off('error', handleError);
    };
  }, [getToken]); // CORREÇÃO: Remover selectedCompany para evitar reconexões

  /**
   * Carrega notificações
   */
  const loadNotifications = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        setError(null);

        const currentPage = reset ? 1 : page;

        // Aguardar inicialização (permissões) antes de carregar notificações
        const { initializationService } = await import(
          '../services/initializationService'
        );
        await initializationService.waitForInitialization();

        // Usar endpoint principal de notificações
        const response = await notificationApi.getNotifications({
          ...params,
          page: currentPage,
          limit: 20,
        });

        if (reset) {
          setNotifications(response.notifications);
          setPage(1);
        } else {
          setNotifications(prev => [...prev, ...response.notifications]);
        }

        // console.log('[useNotifications] 🔄 loadNotifications - Definindo unreadCount para:', response.unreadCount);
        // console.log('[useNotifications] 🔄 loadNotifications - isMarkingAllAsRead:', isMarkingAllAsRead);
        // Não sobrescrever se acabamos de marcar todas como lidas
        if (!isMarkingAllAsRead) {
          setUnreadCount(response.unreadCount);
        } else {
          // console.log('[useNotifications] 🔄 loadNotifications - Ignorando porque acabamos de marcar todas como lidas');
          // Se estamos marcando todas como lidas, manter em 0
          setUnreadCount(0);
        }
        setHasMore(currentPage < response.totalPages);
      } catch (err: any) {
        console.error('[useNotifications] Erro ao carregar notificações:', err);
        setError(err.message || 'Erro ao carregar notificações');
      } finally {
        setLoading(false);
      }
    },
    [page, params]
  );

  /**
   * Carrega mais notificações
   */
  const loadMore = useCallback(async () => {
    // console.log('[useNotifications] 📄 loadMore chamado - loading:', loading, 'hasMore:', hasMore);
    if (loading || !hasMore) return;

    setPage(prev => prev + 1);
    await loadNotifications(false);
  }, [loading, hasMore, loadNotifications]);

  /**
   * Atualiza a lista de notificações
   */
  const refresh = useCallback(async () => {
    // console.log('[useNotifications] 🔄 refresh chamado');
    setPage(1);
    await loadNotifications(true);
  }, [loadNotifications]);

  /**
   * Marca uma notificação como lida
   */
  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationApi.markAsRead(id);

      // Atualizar localmente
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, read: true, readAt: new Date() } : n
        )
      );

      // Decrementar contador
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('[useNotifications] Erro ao marcar como lida:', err);
      setError(err.message || 'Erro ao marcar notificação como lida');
    }
  }, []);

  /**
   * Marca todas as notificações como lidas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      setIsMarkingAllAsRead(true);
      // console.log('[useNotifications] Marcando todas as notificações como lidas...');
      // console.log('[useNotifications] Company ID:', selectedCompany?.id);
      // console.log('[useNotifications] UnreadCount atual:', unreadCount);
      // Zerar contador imediatamente para feedback visual
      setUnreadCount(0);

      const result = await notificationApi.markAllAsRead(selectedCompany?.id);

      // console.log('[useNotifications] Resultado do markAllAsRead:', result);
      // console.log('[useNotifications] UnreadCount retornado:', result.unreadCount);
      // Atualizar localmente
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, readAt: new Date() }))
      );

      // Garantir que o contador permaneça em 0 independente do que retornou a API
      // console.log('[useNotifications] Forçando unreadCount para 0');
      setUnreadCount(0);

      // Aguardar um pouco mais para garantir que o WebSocket processe
      setTimeout(() => {
        // console.log('[useNotifications] Verificando se badge ainda está em 0 após timeout');
        if (unreadCount !== 0) {
          // console.log('[useNotifications] Badge não está em 0, forçando novamente');
          setUnreadCount(0);
        }
        setIsMarkingAllAsRead(false);
        // console.log('[useNotifications] Resetando flag isMarkingAllAsRead');
      }, 2000);
    } catch (err: any) {
      console.error('[useNotifications] Erro ao marcar todas como lidas:', err);
      setError(err.message || 'Erro ao marcar todas notificações como lidas');
      setIsMarkingAllAsRead(false);
      // Em caso de erro, recarregar notificações para sincronizar
      refresh();
    }
  }, [selectedCompany?.id, refresh, unreadCount]);

  /**
   * Remove uma notificação
   */
  const deleteNotification = useCallback(
    async (id: string) => {
      try {
        await notificationApi.deleteNotification(id);

        // Remover localmente
        setNotifications(prev => prev.filter(n => n.id !== id));

        // Decrementar contador se não estava lida
        const notification = notifications.find(n => n.id === id);
        if (notification && !notification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      } catch (err: any) {
        console.error('[useNotifications] Erro ao remover notificação:', err);
        setError(err.message || 'Erro ao remover notificação');
      }
    },
    [notifications]
  );

  /**
   * Atualiza inscrição de empresa quando muda
   */
  useEffect(() => {
    if (!connected || !selectedCompany?.id) return;

    // console.log('[useNotifications] Atualizando inscrição de empresa:', selectedCompany.id);
    notificationApi.subscribeToCompany(selectedCompany.id);

    return () => {
      // Não desinscrever ao desmontar, apenas quando empresa mudar
    };
  }, [selectedCompany?.id, connected]);

  /**
   * Inicializa WebSocket e carrega notificações
   */
  useEffect(() => {
    // Guardar função de cleanup dos listeners
    let cleanupListeners: (() => void) | undefined;

    const init = async () => {
      cleanupListeners = initializeWebSocket();
      await loadNotifications(true);
    };

    init();

    return () => {
      // Limpar listeners primeiro
      if (cleanupListeners) {
        cleanupListeners();
      }

      // Limpar WebSocket apenas ao desmontar completamente
      if (wsInitialized.current) {
        // console.log('[useNotifications] Limpando WebSocket');
        notificationApi.disconnect();
        wsInitialized.current = false;
      }
    };
  }, []); // Executar apenas uma vez

  /**
   * Recarrega notificações quando parâmetros mudam
   * CORREÇÃO: Usar ref para evitar múltiplas chamadas desnecessárias
   */
  const lastParamsRef = useRef<string>('');

  useEffect(() => {
    if (!wsInitialized.current) return;

    // Criar string de comparação dos parâmetros
    const paramsKey = JSON.stringify({
      read: params?.read,
      type: params?.type,
      companyId: params?.companyId,
    });

    // Só recarregar se os parâmetros realmente mudaram
    if (lastParamsRef.current !== paramsKey) {
      lastParamsRef.current = paramsKey;
      refresh();
    }
  }, [params?.read, params?.type, params?.companyId, refresh]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    page,
    loadNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
    connected,
  };
};
