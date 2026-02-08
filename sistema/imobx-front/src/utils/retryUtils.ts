/**
 * Utilitário para retry de requisições com backoff exponencial
 */

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

export const defaultRetryOptions: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000, // 1 segundo
  maxDelay: 10000, // 10 segundos
  backoffMultiplier: 2,
};

/**
 * Executa uma função com retry automático
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...defaultRetryOptions, ...options };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      console.log(`🔄 Tentativa ${attempt + 1}/${opts.maxRetries + 1}`);
      const result = await fn();
      console.log(`✅ Sucesso na tentativa ${attempt + 1}`);
      return result;
    } catch (error: any) {
      lastError = error;
      console.error(`❌ Erro na tentativa ${attempt + 1}:`, error.message);

      // Se é a última tentativa, não aguardar
      if (attempt === opts.maxRetries) {
        break;
      }

      // Calcular delay com backoff exponencial
      const delay = Math.min(
        opts.baseDelay * Math.pow(opts.backoffMultiplier, attempt),
        opts.maxDelay
      );

      console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Erro desconhecido após todas as tentativas');
}

/**
 * Verifica se um erro deve ser considerado para retry
 */
export function shouldRetry(error: any): boolean {
  // Erros de rede
  if (!error.response) {
    return true;
  }

  // Status codes que devem ser retentados
  const retryableStatusCodes = [
    408, // Request Timeout
    429, // Too Many Requests
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
  ];

  return retryableStatusCodes.includes(error.response.status);
}

/**
 * Executa uma função com retry apenas para erros específicos
 */
export async function withSelectiveRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...defaultRetryOptions, ...options };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      console.log(`🔄 Tentativa ${attempt + 1}/${opts.maxRetries + 1}`);
      const result = await fn();
      console.log(`✅ Sucesso na tentativa ${attempt + 1}`);
      return result;
    } catch (error: any) {
      lastError = error;
      console.error(`❌ Erro na tentativa ${attempt + 1}:`, error.message);

      // Verificar se deve tentar novamente
      if (!shouldRetry(error) || attempt === opts.maxRetries) {
        break;
      }

      // Calcular delay com backoff exponencial
      const delay = Math.min(
        opts.baseDelay * Math.pow(opts.backoffMultiplier, attempt),
        opts.maxDelay
      );

      console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Erro desconhecido após todas as tentativas');
}
