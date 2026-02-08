import { useState, useEffect, useCallback } from 'react';

interface ConnectionStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  lastSeen: Date | null;
}

interface UseConnectionStatusOptions {
  checkInterval?: number;
  slowThreshold?: number;
  onConnectionLost?: () => void;
  onConnectionRestored?: () => void;
}

/**
 * Hook para monitorar status da conexão e detectar problemas
 */
export const useConnectionStatus = (
  options: UseConnectionStatusOptions = {}
) => {
  const {
    checkInterval = 30000, // 30 segundos
    slowThreshold = 5000, // 5 segundos
    onConnectionLost,
    onConnectionRestored,
  } = options;

  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    lastSeen: null,
  });

  const [isChecking, setIsChecking] = useState(false);

  // Função para verificar conectividade
  const checkConnection = useCallback(async () => {
    if (isChecking) return;

    setIsChecking(true);
    const startTime = Date.now();

    try {
      // Tentar fazer uma requisição simples para verificar conectividade
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), slowThreshold);

      const response = await fetch('/api/health', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache',
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      setStatus(prev => {
        const wasOffline = !prev.isOnline;
        const newStatus = {
          isOnline: true,
          isSlowConnection: responseTime > slowThreshold,
          lastSeen: new Date(),
        };

        // Notificar se a conexão foi restaurada
        if (wasOffline && onConnectionRestored) {
          onConnectionRestored();
        }

        return newStatus;
      });
    } catch (error) {
      setStatus(prev => {
        const wasOnline = prev.isOnline;
        const newStatus = {
          isOnline: false,
          isSlowConnection: false,
          lastSeen: prev.lastSeen,
        };

        // Notificar se a conexão foi perdida
        if (wasOnline && onConnectionLost) {
          onConnectionLost();
        }

        return newStatus;
      });
    } finally {
      setIsChecking(false);
    }
  }, [isChecking, slowThreshold, onConnectionLost, onConnectionRestored]);

  // Monitorar eventos de conectividade do navegador
  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({
        ...prev,
        isOnline: true,
        lastSeen: new Date(),
      }));

      if (onConnectionRestored) {
        onConnectionRestored();
      }
    };

    const handleOffline = () => {
      setStatus(prev => ({
        ...prev,
        isOnline: false,
      }));

      if (onConnectionLost) {
        onConnectionLost();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onConnectionLost, onConnectionRestored]);

  // Verificação periódica da conexão
  useEffect(() => {
    const interval = setInterval(checkConnection, checkInterval);

    // Verificação inicial
    checkConnection();

    return () => clearInterval(interval);
  }, [checkConnection, checkInterval]);

  // Função para forçar verificação manual
  const forceCheck = useCallback(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    ...status,
    isChecking,
    forceCheck,
  };
};

/**
 * Hook para detectar timeouts em operações assíncronas
 */
export const useTimeoutDetection = (timeoutMs: number = 10000) => {
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const startTimeout = useCallback(() => {
    setHasTimedOut(false);

    const timeoutId = setTimeout(() => {
      setHasTimedOut(true);
    }, timeoutMs);

    return () => {
      clearTimeout(timeoutId);
      setHasTimedOut(false);
    };
  }, [timeoutMs]);

  const clearTimeout = useCallback(() => {
    setHasTimedOut(false);
  }, []);

  return {
    hasTimedOut,
    startTimeout,
    clearTimeout,
  };
};

/**
 * Hook combinado para monitorar conexão e detectar problemas
 */
export const useConnectionMonitor = (
  options: UseConnectionStatusOptions = {}
) => {
  const connectionStatus = useConnectionStatus(options);
  const timeoutDetection = useTimeoutDetection();

  const isProblematic =
    !connectionStatus.isOnline ||
    connectionStatus.isSlowConnection ||
    timeoutDetection.hasTimedOut;

  return {
    ...connectionStatus,
    ...timeoutDetection,
    isProblematic,
  };
};
