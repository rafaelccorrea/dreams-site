import {
  RewardCategory,
  RedemptionStatus,
  RewardCategoryLabels,
  RedemptionStatusLabels,
  RedemptionStatusColors,
} from '@/types/rewards.types';

/**
 * Obtém o label de uma categoria de prêmio
 */
export function getCategoryLabel(category: RewardCategory | string): string {
  return RewardCategoryLabels[category as RewardCategory] || category;
}

/**
 * Obtém o label de um status de resgate
 */
export function getStatusLabel(status: RedemptionStatus | string): string {
  return RedemptionStatusLabels[status as RedemptionStatus] || status;
}

/**
 * Obtém a cor de um status de resgate
 */
export function getStatusColor(status: RedemptionStatus | string): string {
  return RedemptionStatusColors[status as RedemptionStatus] || '#6b7280';
}

/**
 * Obtém classes CSS para badge de status
 */
export function getStatusBadgeClasses(
  status: RedemptionStatus | string
): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    delivered: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-gray-100 text-gray-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

/**
 * Formata pontos com separador de milhares
 */
export function formatPoints(points: number): string {
  return points.toLocaleString('pt-BR');
}

/**
 * Formata valor monetário
 */
export function formatMoney(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Verifica se o usuário tem pontos suficientes para resgatar
 */
export function canRedeem(myPoints: number, rewardCost: number): boolean {
  return myPoints >= rewardCost;
}

/**
 * Calcula quantos pontos faltam para resgatar
 */
export function getPointsNeeded(myPoints: number, rewardCost: number): number {
  const needed = rewardCost - myPoints;
  return needed > 0 ? needed : 0;
}

/**
 * Verifica se o estoque está disponível
 */
export function hasStock(
  stockQuantity: number | null | undefined,
  redeemedCount: number
): boolean {
  if (stockQuantity === null || stockQuantity === undefined) {
    return true; // Estoque ilimitado
  }
  return redeemedCount < stockQuantity;
}

/**
 * Calcula quantidade disponível em estoque
 */
export function getAvailableStock(
  stockQuantity: number | null | undefined,
  redeemedCount: number
): number | null {
  if (stockQuantity === null || stockQuantity === undefined) {
    return null; // Ilimitado
  }
  return Math.max(0, stockQuantity - redeemedCount);
}

/**
 * Obtém ícone padrão baseado na categoria
 */
export function getDefaultIcon(category: RewardCategory | string): string {
  const icons: Record<string, string> = {
    monetary: '💰',
    time_off: '🏖️',
    gift: '🎁',
    experience: '🎭',
    recognition: '🏆',
    other: '📦',
  };
  return icons[category] || '🎁';
}

/**
 * Formata data de resgate
 */
export function formatRedemptionDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Obtém emoji para status
 */
export function getStatusEmoji(status: RedemptionStatus | string): string {
  const emojis: Record<string, string> = {
    pending: '⏳',
    approved: '✅',
    rejected: '❌',
    delivered: '🎁',
    cancelled: '🚫',
  };
  return emojis[status] || '📋';
}

/**
 * Verifica se o resgate pode ser aprovado/rejeitado
 */
export function canReview(status: RedemptionStatus | string): boolean {
  return status === 'pending';
}

/**
 * Verifica se o resgate pode ser marcado como entregue
 */
export function canDeliver(status: RedemptionStatus | string): boolean {
  return status === 'approved';
}
