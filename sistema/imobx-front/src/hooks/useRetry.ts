import { useRef, useCallback } from 'react';

interface RetryConfig {
  maxRetries?: number;
  retryWindowMs?: number; // Janela de tempo em ms para contar tentativas
}

interface RetryState {
  attempts: number;
  lastAttemptTime: number;
  isBlocked: boolean;
}

/**
 * Hook para gerenciar retry de chamadas de API
 * Limita tentativas dentro de uma janela de tempo
 */
export function useRetry(config: RetryConfig = {}) {
  const { maxRetries = 3, retryWindowMs = 60000 } = config; // 1 minuto padrão
  const retryStateRef = useRef<RetryState>({
    attempts: 0,
    lastAttemptTime: 0,
    isBlocked: false,
  });

  const resetRetry = useCallback(() => {
    retryStateRef.current = {
      attempts: 0,
      lastAttemptTime: 0,
      isBlocked: false,
    };
  }, []);

  const canRetry = useCallback((): boolean => {
    const now = Date.now();
    const state = retryStateRef.current;

    // Se está bloqueado, verificar se já passou a janela de tempo
    if (state.isBlocked) {
      const timeSinceLastAttempt = now - state.lastAttemptTime;
      if (timeSinceLastAttempt >= retryWindowMs) {
        // Resetar após a janela de tempo
        resetRetry();
        return true;
      }
      return false;
    }

    // Verificar se ainda está dentro da janela de tempo
    const timeSinceLastAttempt = now - state.lastAttemptTime;
    if (timeSinceLastAttempt >= retryWindowMs) {
      // Janela expirou, resetar contador
      resetRetry();
      return true;
    }

    // Verificar se ainda pode tentar
    if (state.attempts < maxRetries) {
      return true;
    }

    // Bloquear se excedeu o limite
    state.isBlocked = true;
    return false;
  }, [maxRetries, retryWindowMs, resetRetry]);

  const recordAttempt = useCallback(
    (success: boolean) => {
      const state = retryStateRef.current;
      const now = Date.now();

      if (success) {
        // Sucesso: resetar contador
        resetRetry();
      } else {
        // Falha: incrementar contador
        state.attempts += 1;
        state.lastAttemptTime = now;

        if (state.attempts >= maxRetries) {
          state.isBlocked = true;
        }
      }
    },
    [maxRetries, resetRetry]
  );

  const executeWithRetry = useCallback(
    async <T>(
      fn: () => Promise<T>,
      onError?: (error: any, attempt: number) => void
    ): Promise<T | null> => {
      if (!canRetry()) {
        if (onError) {
          onError(
            new Error('Limite de tentativas excedido. Aguarde 1 minuto.'),
            retryStateRef.current.attempts
          );
        }
        return null;
      }

      try {
        const result = await fn();
        recordAttempt(true);
        return result;
      } catch (error: any) {
        recordAttempt(false);

        // Verificar se é erro 400 (limite diário), 429 (muitas requisições), 404 (não encontrado) ou 403 (não autorizado)
        const isBadRequest = error?.response?.status === 400;
        const isTooManyRequests = error?.response?.status === 429;
        const isNotFound = error?.response?.status === 404;
        const isForbidden = error?.response?.status === 403;

        // Se for 400, 429, 404 ou 403, bloquear imediatamente (não tentar novamente)
        if (isBadRequest || isTooManyRequests || isNotFound || isForbidden) {
          retryStateRef.current.isBlocked = true;
          retryStateRef.current.attempts = maxRetries;
          if (onError) {
            onError(error, retryStateRef.current.attempts);
          }
          return null;
        }

        // Se ainda pode tentar, fazer retry automático (até 3 tentativas)
        if (canRetry() && retryStateRef.current.attempts < maxRetries) {
          // Aguardar um pouco antes de tentar novamente (backoff exponencial simples)
          const delay = Math.min(
            1000 * Math.pow(2, retryStateRef.current.attempts - 1),
            5000
          );
          await new Promise(resolve => setTimeout(resolve, delay));

          try {
            const result = await fn();
            recordAttempt(true);
            return result;
          } catch (retryError: any) {
            recordAttempt(false);
            if (onError) {
              onError(retryError, retryStateRef.current.attempts);
            }
            return null;
          }
        }

        if (onError) {
          onError(error, retryStateRef.current.attempts);
        }

        return null;
      }
    },
    [canRetry, recordAttempt, maxRetries]
  );

  return {
    executeWithRetry,
    canRetry,
    resetRetry,
    getRetryState: () => ({ ...retryStateRef.current }),
  };
}
