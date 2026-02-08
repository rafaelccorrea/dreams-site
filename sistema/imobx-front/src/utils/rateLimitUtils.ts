/**
 * Utilitários para tratamento de Rate Limit (429)
 */

export interface RateLimitError extends Error {
  isRateLimit?: boolean;
  rateLimitMessage?: string;
  waitTime?: string;
  limit?: string;
  response?: {
    status: number;
    data?: {
      message?: string;
      statusCode?: number;
      errorCode?: string;
    };
  };
}

/**
 * Verifica se um erro é de rate limit (429)
 */
export const isRateLimitError = (error: any): error is RateLimitError => {
  return (
    error?.isRateLimit === true ||
    error?.response?.status === 429 ||
    error?.response?.data?.statusCode === 429
  );
};

/**
 * Extrai informações do erro de rate limit
 */
export const extractRateLimitInfo = (
  error: any
): {
  message: string;
  waitTime?: string;
  limit?: string;
} => {
  const errorData = error?.response?.data || {};
  const errorMessage =
    errorData.message ||
    error?.rateLimitMessage ||
    'Muitas requisições. Limite excedido.';

  let waitTime = '';
  let limit = '';

  // Tentar extrair tempo de espera da mensagem (ex: "Tente novamente em 26 minuto(s)")
  const waitTimeMatch = errorMessage.match(
    /Tente novamente em (\d+) (minuto|hora|segundo)/i
  );
  if (waitTimeMatch) {
    waitTime = `${waitTimeMatch[1]} ${waitTimeMatch[2]}${parseInt(waitTimeMatch[1]) > 1 ? 's' : ''}`;
  }

  // Tentar extrair limite da mensagem (ex: "Limite: 50 requisições por hora")
  const limitMatch = errorMessage.match(/Limite: (\d+) requisições/i);
  if (limitMatch) {
    limit = limitMatch[1];
  }

  return {
    message: errorMessage,
    waitTime,
    limit,
  };
};

/**
 * Cria uma mensagem amigável para o usuário sobre rate limit
 */
export const getRateLimitFriendlyMessage = (error: any): string => {
  const { message, waitTime, limit } = extractRateLimitInfo(error);

  let friendlyMessage = '⚠️ Muitas requisições realizadas.';
  if (waitTime) {
    friendlyMessage += ` Aguarde ${waitTime} antes de tentar novamente.`;
  } else {
    friendlyMessage += ' Aguarde alguns minutos antes de tentar novamente.';
  }
  if (limit) {
    friendlyMessage += ` (Limite: ${limit} requisições por hora)`;
  }

  return friendlyMessage;
};
