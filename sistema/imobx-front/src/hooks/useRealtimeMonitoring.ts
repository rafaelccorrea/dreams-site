import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { webSocketService } from '../services/websocketService';
import { API_BASE_URL } from '../config/apiConfig';

export interface RealtimeData {
  timestamp: string;
  module: string;
  data: any;
  type: 'update' | 'create' | 'delete' | 'status_change';
  userId?: string;
  companyId?: string;
}

export interface MonitoringConfig {
  module: string;
  interval?: number; // em milissegundos, padrão 30000 (30s)
  enabled?: boolean;
  onDataUpdate?: (data: RealtimeData) => void;
  onError?: (error: Error) => void;
}

export const useRealtimeMonitoring = (config: MonitoringConfig) => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wsConnectionRef = useRef<boolean>(false);
  const configRef = useRef(config);

  // Atualizar configuração quando mudar
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Função para buscar dados do módulo específico
  const fetchModuleData = useCallback(async () => {
    if (!user || !configRef.current.enabled) return;

    try {
      setLoading(true);
      setError(null);

      const endpoint = getModuleEndpoint(configRef.current.module);
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }

      const moduleData = await response.json();

      const realtimeData: RealtimeData = {
        timestamp: new Date().toISOString(),
        module: configRef.current.module,
        data: moduleData,
        type: 'update',
        userId: user.id,
        companyId: user.companyId,
      };

      setData(moduleData);
      setLastUpdate(new Date());

      // Callback personalizado se fornecido
      if (configRef.current.onDataUpdate) {
        configRef.current.onDataUpdate(realtimeData);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error);

      if (configRef.current.onError) {
        configRef.current.onError(error);
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Função para obter endpoint baseado no módulo
  const getModuleEndpoint = (module: string): string => {
    switch (module) {
      case 'dashboard':
        return `${API_BASE_URL}/dashboard`;
      case 'properties':
        return `${API_BASE_URL}/properties`;
      case 'users':
        return `${API_BASE_URL}/admin/users`;
      case 'teams':
        return `${API_BASE_URL}/teams`;
      case 'kanban':
        return `${API_BASE_URL}/kanban`;
      case 'subscriptions':
        return `${API_BASE_URL}/subscriptions/admin/dashboard`;
      case 'companies':
        return `${API_BASE_URL}/companies`;
      case 'audit':
        return `${API_BASE_URL}/audit-logs`;
      default:
        throw new Error(`Módulo não suportado: ${module}`);
    }
  };

  // Configurar WebSocket para atualizações em tempo real
  const setupWebSocket = useCallback(() => {
    if (!user || wsConnectionRef.current) return;

    try {
      // Só conectar se não estiver já conectado
      if (!webSocketService.isConnected()) {
        webSocketService.connect();
      }
      wsConnectionRef.current = true;
      setIsConnected(true);

      // Escutar eventos específicos do módulo
      const eventName = `${configRef.current.module}_update`;

      webSocketService.on(eventName, (eventData: RealtimeData) => {
        if (eventData.module === configRef.current.module) {
          setData(eventData.data);
          setLastUpdate(new Date());

          if (configRef.current.onDataUpdate) {
            configRef.current.onDataUpdate(eventData);
          }
        }
      });

      // Escutar eventos gerais de atualização
      webSocketService.on('data_update', (eventData: RealtimeData) => {
        if (eventData.module === configRef.current.module) {
          setData(eventData.data);
          setLastUpdate(new Date());

          if (configRef.current.onDataUpdate) {
            configRef.current.onDataUpdate(eventData);
          }
        }
      });

      // Escutar eventos de conexão
      webSocketService.on('connect', () => {
        setIsConnected(true);
      });

      webSocketService.on('disconnect', () => {
        setIsConnected(false);
      });
    } catch (err) {
      console.error('Erro ao configurar WebSocket:', err);
      setIsConnected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Limpar WebSocket (não desconectar completamente, apenas remover listeners)
  const cleanupWebSocket = useCallback(() => {
    if (wsConnectionRef.current) {
      // Remover apenas os listeners específicos deste hook
      const eventName = `${configRef.current.module}_update`;
      webSocketService.off(eventName);
      webSocketService.off('data_update');
      webSocketService.off('connect');
      webSocketService.off('disconnect');

      wsConnectionRef.current = false;
      setIsConnected(false);
    }
  }, []);

  // Inicializar monitoramento
  useEffect(() => {
    if (!user || !configRef.current.enabled) return;

    // Buscar dados iniciais
    fetchModuleData();

    // Configurar WebSocket
    setupWebSocket();

    // Configurar polling como fallback
    if (configRef.current.interval && configRef.current.interval > 0) {
      intervalRef.current = setInterval(
        fetchModuleData,
        configRef.current.interval
      );
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      cleanupWebSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, configRef.current.enabled, configRef.current.interval]);

  // Função para forçar atualização
  const refresh = useCallback(() => {
    fetchModuleData();
  }, [fetchModuleData]);

  // Função para pausar/retomar monitoramento
  const toggleMonitoring = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        fetchModuleData();
        setupWebSocket();
        if (configRef.current.interval && configRef.current.interval > 0) {
          intervalRef.current = setInterval(
            fetchModuleData,
            configRef.current.interval
          );
        }
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        cleanupWebSocket();
      }
    },
    [fetchModuleData, setupWebSocket, cleanupWebSocket]
  );

  // Função para enviar dados via WebSocket
  const broadcastUpdate = useCallback(
    (
      updateData: any,
      type: 'update' | 'create' | 'delete' | 'status_change' = 'update'
    ) => {
      if (!user || !isConnected) return;

      const realtimeData: RealtimeData = {
        timestamp: new Date().toISOString(),
        module: configRef.current.module,
        data: updateData,
        type,
        userId: user.id,
        companyId: user.companyId,
      };

      webSocketService.emit('data_update', realtimeData);
    },
    [user, isConnected]
  );

  return {
    data,
    loading,
    error,
    lastUpdate,
    isConnected,
    refresh,
    toggleMonitoring,
    broadcastUpdate,
  };
};

// Hook específico para cada módulo
export const useDashboardMonitoring = (config?: Partial<MonitoringConfig>) => {
  return useRealtimeMonitoring({
    module: 'dashboard',
    interval: 30000, // 30 segundos
    enabled: true,
    ...config,
  });
};

export const usePropertiesMonitoring = (config?: Partial<MonitoringConfig>) => {
  return useRealtimeMonitoring({
    module: 'properties',
    interval: 60000, // 1 minuto
    enabled: true,
    ...config,
  });
};

export const useUsersMonitoring = (config?: Partial<MonitoringConfig>) => {
  return useRealtimeMonitoring({
    module: 'users',
    interval: 120000, // 2 minutos
    enabled: true,
    ...config,
  });
};

export const useTeamsMonitoring = (config?: Partial<MonitoringConfig>) => {
  return useRealtimeMonitoring({
    module: 'teams',
    interval: 60000, // 1 minuto
    enabled: true,
    ...config,
  });
};

export const useKanbanMonitoring = (config?: Partial<MonitoringConfig>) => {
  return useRealtimeMonitoring({
    module: 'kanban',
    interval: 15000, // 15 segundos (mais frequente para Kanban)
    enabled: true,
    ...config,
  });
};

export const useSubscriptionsMonitoring = (
  config?: Partial<MonitoringConfig>
) => {
  return useRealtimeMonitoring({
    module: 'subscriptions',
    interval: 300000, // 5 minutos
    enabled: true,
    ...config,
  });
};

export const useCompaniesMonitoring = (config?: Partial<MonitoringConfig>) => {
  return useRealtimeMonitoring({
    module: 'companies',
    interval: 300000, // 5 minutos
    enabled: true,
    ...config,
  });
};

export const useAuditMonitoring = (config?: Partial<MonitoringConfig>) => {
  return useRealtimeMonitoring({
    module: 'audit',
    interval: 60000, // 1 minuto
    enabled: true,
    ...config,
  });
};
