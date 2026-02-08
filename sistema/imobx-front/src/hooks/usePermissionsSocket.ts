import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { authStorage } from '../services/authStorage';
import { API_BASE_URL } from '../config/apiConfig';

interface PermissionsChangedEvent {
  action: 'added' | 'removed' | 'updated';
  permissions: string[];
  message: string;
  timestamp: string;
}

interface RoleChangedEvent {
  oldRole: string;
  newRole: string;
  message: string;
  timestamp: string;
}

interface UsePermissionsSocketReturn {
  isConnected: boolean;
  permissionsChanged: PermissionsChangedEvent | null;
  roleChanged: RoleChangedEvent | null;
  clearNotifications: () => void;
  socket: Socket | null;
}

/**
 * Hook para escutar mudanças de permissões e roles via WebSocket
 * Conecta ao namespace /notifications conforme documentação
 */
export const usePermissionsSocket = (
  token: string | null,
  onPermissionsChanged?: (event: PermissionsChangedEvent) => void,
  onRoleChanged?: (event: RoleChangedEvent) => void
): UsePermissionsSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [permissionsChanged, setPermissionsChanged] =
    useState<PermissionsChangedEvent | null>(null);
  const [roleChanged, setRoleChanged] = useState<RoleChangedEvent | null>(null);

  // CORREÇÃO: Usar refs para callbacks para evitar loop infinito
  const onPermissionsChangedRef = useRef(onPermissionsChanged);
  const onRoleChangedRef = useRef(onRoleChanged);

  // Atualizar refs quando callbacks mudarem
  useEffect(() => {
    onPermissionsChangedRef.current = onPermissionsChanged;
  }, [onPermissionsChanged]);

  useEffect(() => {
    onRoleChangedRef.current = onRoleChanged;
  }, [onRoleChanged]);

  const clearNotifications = useCallback(() => {
    setPermissionsChanged(null);
    setRoleChanged(null);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    // URL do backend WebSocket com namespace /notifications
    const BACKEND_URL = API_BASE_URL;
    const NOTIFICATIONS_URL = `${BACKEND_URL}/notifications`;

    // console.log('🔌 Conectando ao WebSocket de notificações:', NOTIFICATIONS_URL);
    // Criar conexão WebSocket no namespace /notifications
    const socketInstance = io(NOTIFICATIONS_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Handlers de conexão
    socketInstance.on('connect', () => {
      // console.log('✅ WebSocket conectado para notificações de permissões');
      setIsConnected(true);

      // Entrar no canal do usuário conforme documentação
      const user = authStorage.getUserData();
      if (user?.id) {
        // console.log('📡 Entrando no canal do usuário:', user.id);
        socketInstance.emit('join', user.id);
      }
    });

    socketInstance.on('disconnect', reason => {
      // console.log('❌ WebSocket desconectado:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', error => {
      console.error('❌ Erro na conexão WebSocket:', error.message);
      setIsConnected(false);
    });

    // Debug: Log de todos os eventos (apenas em desenvolvimento)
    if (import.meta.env.DEV) {
      socketInstance.onAny((eventName, ...args) => {
        // console.log(`📨 Evento WebSocket recebido: ${eventName}`, args);
      });
    }

    // Handler para mudanças de permissões
    socketInstance.on(
      'permissions-changed',
      (event: PermissionsChangedEvent) => {
        // console.log('🔐 Permissões alteradas:', event);
        setPermissionsChanged(event);

        // Callback customizado usando ref para evitar loop
        if (onPermissionsChangedRef.current) {
          onPermissionsChangedRef.current(event);
        }
      }
    );

    // Handler para mudanças de role
    socketInstance.on('role-changed', (event: RoleChangedEvent) => {
      // console.log('👤 Role alterado:', event);
      setRoleChanged(event);

      // Callback customizado usando ref para evitar loop
      if (onRoleChangedRef.current) {
        onRoleChangedRef.current(event);
      }
    });

    setSocket(socketInstance);

    // Cleanup ao desmontar
    return () => {
      // console.log('🔌 Desconectando WebSocket de permissões');
      socketInstance.disconnect();
      setIsConnected(false);
      setSocket(null);
    };
  }, [token]); // CORREÇÃO: Remover callbacks das dependências (usar refs)

  return {
    isConnected,
    permissionsChanged,
    roleChanged,
    clearNotifications,
    socket,
  };
};
