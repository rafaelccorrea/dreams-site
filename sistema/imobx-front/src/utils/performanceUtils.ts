/**
 * Utilidades para sistema de performance
 */

import type { PeriodPreset, PeriodConfig } from '../types/performance';

/**
 * Converte período preset em datas
 */
export function getPeriodDates(
  preset: PeriodPreset,
  customStart?: Date,
  customEnd?: Date
): PeriodConfig {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (preset) {
    case '7days':
      start.setDate(now.getDate() - 7);
      break;

    case '30days':
      start.setDate(now.getDate() - 30);
      break;

    case 'thisMonth':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;

    case 'lastMonth':
      start.setMonth(now.getMonth() - 1);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setDate(0); // Último dia do mês anterior
      end.setHours(23, 59, 59, 999);
      break;

    case 'thisYear':
      start.setMonth(0);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;

    case 'custom':
      if (customStart && customEnd) {
        return { start: customStart, end: customEnd };
      }
      // Se não tiver custom, usar últimos 30 dias como fallback
      start.setDate(now.getDate() - 30);
      break;

    default:
      start.setDate(now.getDate() - 30);
  }

  // Garantir que end está sempre no final do dia
  if (preset !== 'custom' && preset !== 'lastMonth') {
    end.setHours(23, 59, 59, 999);
  }

  return { start, end };
}

/**
 * Formata período para exibição
 */
export function formatPeriodLabel(preset: PeriodPreset): string {
  const labels: Record<PeriodPreset, string> = {
    '7days': 'Últimos 7 dias',
    '30days': 'Últimos 30 dias',
    thisMonth: 'Este mês',
    lastMonth: 'Mês passado',
    thisYear: 'Este ano',
    custom: 'Período customizado',
  };

  return labels[preset] || '30 dias';
}

/**
 * Formata tempo de resposta em formato legível
 */
export function formatResponseTime(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  } else if (hours < 24) {
    return `${hours.toFixed(1)} h`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days} dias`;
  }
}

/**
 * Calcula cor para taxa de aceitação
 */
export function getAcceptanceRateColor(rate: number): string {
  if (rate >= 80) return '#10B981'; // Verde
  if (rate >= 60) return '#3B82F6'; // Azul
  if (rate >= 40) return '#F59E0B'; // Amarelo
  return '#EF4444'; // Vermelho
}

/**
 * Calcula cor para score médio
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#10B981'; // Verde
  if (score >= 60) return '#F59E0B'; // Amarelo
  return '#EF4444'; // Vermelho
}

/**
 * Retorna medalha para ranking
 */
export function getRankMedal(position: number): string | null {
  if (position === 1) return '🥇';
  if (position === 2) return '🥈';
  if (position === 3) return '🥉';
  return null;
}

/**
 * Retorna classe CSS para cor baseada em porcentagem
 */
export function getPercentageColorClass(percentage: number): string {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-blue-600';
  if (percentage >= 40) return 'text-yellow-600';
  return 'text-red-600';
}
