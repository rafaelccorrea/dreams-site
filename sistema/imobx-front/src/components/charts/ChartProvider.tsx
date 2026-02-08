import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {
  ensureChartRegistration,
  verifyChartRegistration,
  forceChartRegistration,
} from './chartConfig';

interface ChartContextValue {
  isReady: boolean;
  retryRegistration: () => void;
}

const ChartContext = createContext<ChartContextValue>({
  isReady: false,
  retryRegistration: () => {},
});

export const useChartContext = () => useContext(ChartContext);

interface ChartProviderProps {
  children: ReactNode;
}

/**
 * ChartProvider ensures Chart.js is properly registered before any chart components render.
 * This solves the "linear is not a registered scale" error that occurs with Vite code splitting.
 */
export const ChartProvider: React.FC<ChartProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const performRegistration = useCallback(() => {
    try {
      // Force registration
      ensureChartRegistration();

      // Verify it worked
      if (verifyChartRegistration()) {
        setIsReady(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[ChartProvider] Registration failed:', error);
      return false;
    }
  }, []);

  const retryRegistration = useCallback(() => {
    setIsReady(false);
    setAttempts(prev => prev + 1);
    forceChartRegistration();
    performRegistration();
  }, [performRegistration]);

  useEffect(() => {
    // Try registration immediately
    if (performRegistration()) {
      return;
    }

    // If immediate registration failed, retry a few times with delays
    let attempt = 0;
    const maxAttempts = 5;

    const tryRegistration = () => {
      attempt++;
      if (performRegistration()) {
        return;
      }

      if (attempt < maxAttempts) {
        // Exponential backoff: 10ms, 20ms, 40ms, 80ms, 160ms
        setTimeout(tryRegistration, 10 * Math.pow(2, attempt));
      } else {
        console.error(
          '[ChartProvider] Failed to register Chart.js after',
          maxAttempts,
          'attempts'
        );
        // Still set as ready to avoid blocking the app - charts will show their own errors
        setIsReady(true);
      }
    };

    // Start retry process
    setTimeout(tryRegistration, 10);
  }, [performRegistration, attempts]);

  const value = React.useMemo(
    () => ({
      isReady,
      retryRegistration,
    }),
    [isReady, retryRegistration]
  );

  return (
    <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
  );
};

/**
 * HOC to wrap chart components and ensure Chart.js is registered before rendering.
 * Use this for any chart component that might have registration timing issues.
 */
export function withChartRegistration<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  const WithChartRegistration: React.FC<P> = props => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      ensureChartRegistration();

      // Small delay to ensure registration is complete
      const timer = setTimeout(() => {
        if (verifyChartRegistration()) {
          setIsReady(true);
        } else {
          // Retry once more
          ensureChartRegistration();
          setIsReady(true);
        }
      }, 0);

      return () => clearTimeout(timer);
    }, []);

    if (!isReady) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  WithChartRegistration.displayName = `withChartRegistration(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithChartRegistration;
}

/**
 * Wrapper component that ensures Chart.js is registered before rendering children.
 * Use this to wrap individual chart components.
 */
interface SafeChartWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const SafeChartWrapper: React.FC<SafeChartWrapperProps> = ({
  children,
  fallback = null,
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure registration
    ensureChartRegistration();

    // Use microtask to ensure registration completes before render
    queueMicrotask(() => {
      if (verifyChartRegistration()) {
        setIsReady(true);
      } else {
        // If still not ready, force registration and retry
        forceChartRegistration();
        ensureChartRegistration();
        setIsReady(true);
      }
    });
  }, []);

  if (!isReady) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ChartProvider;
