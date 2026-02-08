import { useEffect, useRef, useCallback } from 'react';
import { permissionsApi } from '../services/permissionsApi';
import { kanbanApi } from '../services/kanbanApi';
import { authStorage } from '../services/authStorage';
import { authApi } from '../services/api';

interface PermissionsMonitorOptions {
  interval?: number; // Intervalo em ms (padrão: 30 segundos)
  enabled?: boolean; // Se o monitoramento está ativo
  onPermissionsChanged?: (newPermissions: any) => void;
}

export const usePermissionsMonitor = (
  options: PermissionsMonitorOptions = {}
) => {
  const {
    interval = 30000, // 30 segundos
    enabled = true,
    onPermissionsChanged,
  } = options;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPermissionsRef = useRef<string>('');
  const isMonitoringRef = useRef(false);

  const checkPermissions = useCallback(async () => {
    if (!enabled || isMonitoringRef.current) return;

    isMonitoringRef.current = true;

    try {
      // Verificar se está autenticado
      if (!authStorage.isAuthenticated()) {
        isMonitoringRef.current = false;
        return;
      }

      const user = authStorage.getUserData();
      if (!user || user.role !== 'master') {
        isMonitoringRef.current = false;
        return;
      }

      // console.log('🔍 Verificando permissões do usuário master...');
      // Buscar permissões atualizadas (usar getMyPermissions ao invés de getUserPermissions)
      const [userPermissions, kanbanPermissions] = await Promise.all([
        permissionsApi.getMyPermissions(),
        kanbanApi.getPermissions().catch(() => null), // Se falhar, continua
      ]);

      // Criar hash das permissões para comparar
      const permissionsHash = JSON.stringify({
        user: userPermissions,
        kanban: kanbanPermissions,
      });

      // Se as permissões mudaram
      if (
        lastPermissionsRef.current &&
        lastPermissionsRef.current !== permissionsHash
      ) {
        // console.log('🔄 Permissões atualizadas detectadas!');
        // Atualizar dados do usuário
        try {
          const response = await authApi.getProfile();
          const currentAuthData = authStorage.getAuthData();
          if (currentAuthData) {
            const updatedAuthData = {
              ...currentAuthData,
              user: response.data,
            };
            authStorage.saveAuthData(updatedAuthData, false);
          }
        } catch (refreshError) {
          console.error('❌ Erro ao atualizar dados do usuário:', refreshError);
        }

        // Notificar sobre mudanças
        if (onPermissionsChanged) {
          onPermissionsChanged({
            user: userPermissions,
            kanban: kanbanPermissions,
          });
        }

        // Mostrar notificação
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Permissões Atualizadas', {
            body: 'Suas permissões foram atualizadas automaticamente.',
            icon: '/intellisys.png',
          });
        }
      }

      lastPermissionsRef.current = permissionsHash;
    } catch (error) {
      console.error('❌ Erro ao verificar permissões:', error);
    } finally {
      isMonitoringRef.current = false;
    }
  }, [enabled, onPermissionsChanged]);

  const startMonitoring = useCallback(() => {
    if (intervalRef.current) return;

    // console.log('🚀 Iniciando monitoramento de permissões...');
    // Verificação inicial
    checkPermissions();

    // Configurar intervalo
    intervalRef.current = setInterval(checkPermissions, interval);
  }, [checkPermissions, interval]);

  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      // console.log('⏹️ Parando monitoramento de permissões...');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      // console.log('🔔 Permissão de notificação:', permission);
    }
  }, []);

  useEffect(() => {
    const user = authStorage.getUserData();

    if (enabled && user?.role === 'master') {
      startMonitoring();
      requestNotificationPermission();
    } else {
      stopMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [enabled, startMonitoring, stopMonitoring, requestNotificationPermission]);

  // Limpar intervalo quando componente desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    startMonitoring,
    stopMonitoring,
    checkPermissions,
    isMonitoring: intervalRef.current !== null,
  };
};
