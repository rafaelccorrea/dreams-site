/**
 * Utilitários para WhatsApp
 */

/**
 * Normaliza número de telefone para formato internacional (5511999999999)
 */
export const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return '';

  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');

  // Se já começa com 55, retorna como está
  if (cleaned.startsWith('55')) {
    return cleaned;
  }

  // Se começa com 0, remove o 0
  const withoutZero = cleaned.startsWith('0') ? cleaned.slice(1) : cleaned;

  // Adiciona código do país (55) se não tiver
  return withoutZero.startsWith('55') ? withoutZero : `55${withoutZero}`;
};

/**
 * Formata número de telefone para exibição (11) 99999-9999
 */
export const formatPhoneDisplay = (phone: string): string => {
  if (!phone) return '';

  const normalized = normalizePhoneNumber(phone);

  // Remove código do país (55) para formatação
  const withoutCountry = normalized.startsWith('55')
    ? normalized.slice(2)
    : normalized;

  // Formata baseado no tamanho
  if (withoutCountry.length === 10) {
    // (11) 9999-9999
    return `(${withoutCountry.slice(0, 2)}) ${withoutCountry.slice(2, 6)}-${withoutCountry.slice(6)}`;
  } else if (withoutCountry.length === 11) {
    // (11) 99999-9999
    return `(${withoutCountry.slice(0, 2)}) ${withoutCountry.slice(2, 7)}-${withoutCountry.slice(7)}`;
  }

  return phone; // Retorna original se não conseguir formatar
};

/**
 * Gera link do WhatsApp Web para um número
 */
export const getWhatsAppWebLink = (phone: string, message?: string): string => {
  const normalized = normalizePhoneNumber(phone);
  const encodedMessage = message ? encodeURIComponent(message) : '';
  const messageParam = encodedMessage ? `&text=${encodedMessage}` : '';
  return `https://wa.me/${normalized}${messageParam}`;
};

/**
 * Verifica se um número é válido
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  if (!phone) return false;
  const normalized = normalizePhoneNumber(phone);
  // Deve ter pelo menos 10 dígitos (código do país + DDD + número)
  return normalized.length >= 12 && normalized.length <= 15;
};

/**
 * Extrai DDD de um número normalizado
 */
export const extractAreaCode = (phone: string): string => {
  const normalized = normalizePhoneNumber(phone);
  const withoutCountry = normalized.startsWith('55')
    ? normalized.slice(2)
    : normalized;
  return withoutCountry.slice(0, 2);
};

/**
 * Formata timestamp para exibição relativa
 */
export const formatMessageTime = (date: Date | string): string => {
  const messageDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - messageDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;

  return messageDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year:
      messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Trata erros de token expirado do WhatsApp
 * @param error - Erro capturado
 * @param showErrorFn - Função para exibir erro (obrigatória)
 * @returns true se o erro foi tratado (token expirado), false caso contrário
 */
export const handleWhatsAppTokenExpired = (
  error: any,
  showErrorFn: (message: string) => void
): boolean => {
  const errorCode = error?.response?.data?.errorCode;
  const isTokenExpired = errorCode === 'WHATSAPP_TOKEN_EXPIRED';

  if (isTokenExpired) {
    const errorMessage =
      error?.response?.data?.message ||
      'Token de acesso do WhatsApp expirado. Por favor, renove o token nas configurações do WhatsApp.';

    showErrorFn(errorMessage);
    return true;
  }

  return false;
};

/**
 * Calcula o status de tempo de uma mensagem recebida
 * @param message - Mensagem WhatsApp
 * @param config - Configuração de notificações (onTimeMinutes, delayedMinutes, criticalMinutes)
 * @returns Status de tempo: 'on_time', 'delayed', 'critical' ou null se não aplicável
 */
export const calculateMessageTimeStatus = (
  message: {
    direction: string;
    createdAt: Date | string;
    readAt?: Date | string | null;
  },
  config?: {
    onTimeMinutes?: number;
    delayedMinutes?: number;
    criticalMinutes?: number;
    isActive?: boolean;
  }
): 'on_time' | 'delayed' | 'critical' | null => {
  // Apenas mensagens recebidas (inbound) têm status de tempo
  if (message.direction !== 'inbound') {
    return null;
  }

  // Se não há configuração ou está inativa, retorna null
  if (
    !config ||
    !config.isActive ||
    !config.onTimeMinutes ||
    !config.delayedMinutes ||
    !config.criticalMinutes
  ) {
    return null;
  }

  // Se já foi lida, não precisa mostrar status de tempo
  if (message.readAt) {
    return null;
  }

  const messageDate =
    typeof message.createdAt === 'string'
      ? new Date(message.createdAt)
      : message.createdAt;
  const now = new Date();
  const diffMs = now.getTime() - messageDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  // Calcula status baseado nos tempos configurados
  // on_time: até onTimeMinutes
  // delayed: entre onTimeMinutes e delayedMinutes
  // critical: acima de delayedMinutes (ou criticalMinutes se configurado)
  if (diffMinutes <= config.onTimeMinutes) {
    return 'on_time';
  } else if (diffMinutes <= config.delayedMinutes) {
    return 'delayed';
  } else {
    // Acima de delayedMinutes é considerado crítico
    return 'critical';
  }
};
