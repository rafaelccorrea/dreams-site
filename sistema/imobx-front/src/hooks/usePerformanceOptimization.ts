import { useCallback, useRef, useEffect } from 'react';

// Hook para otimizar performance de navegação
export const usePerformanceOptimization = () => {
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigationStartRef = useRef<number>(0);

  // Função para iniciar navegação com timeout mínimo
  const startNavigation = useCallback(() => {
    navigationStartRef.current = Date.now();

    // Limpar timeout anterior se existir
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  }, []);

  // Função para finalizar navegação com delay mínimo
  const finishNavigation = useCallback((callback: () => void) => {
    const elapsed = Date.now() - navigationStartRef.current;
    const minDelay = 300; // 300ms mínimo para evitar flash

    if (elapsed < minDelay) {
      const remainingDelay = minDelay - elapsed;
      loadingTimeoutRef.current = setTimeout(callback, remainingDelay);
    } else {
      callback();
    }
  }, []);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return {
    startNavigation,
    finishNavigation,
  };
};

// Hook para debounce de chamadas de API
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// Hook para memoização de dados pesados
export const useMemoizedData = <T>(
  data: T,
  dependencies: any[],
  maxAge: number = 30000 // 30 segundos
) => {
  const dataRef = useRef<{ data: T; timestamp: number } | null>(null);

  useEffect(() => {
    const now = Date.now();

    // Se não há dados em cache ou dados expiraram, atualizar
    if (!dataRef.current || now - dataRef.current.timestamp > maxAge) {
      dataRef.current = {
        data,
        timestamp: now,
      };
    }
  }, dependencies);

  return dataRef.current?.data || data;
};

// Hook para lazy loading de componentes
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const [Component, setComponent] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);

  const loadComponent = useCallback(async () => {
    if (Component || loading) return;

    setLoading(true);
    try {
      const { default: LoadedComponent } = await importFn();
      setComponent(() => LoadedComponent);
    } catch (error) {
      console.error('Erro ao carregar componente:', error);
    } finally {
      setLoading(false);
    }
  }, [Component, loading, importFn]);

  return {
    Component: Component || fallback || null,
    loading,
    loadComponent,
  };
};
