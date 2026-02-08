/**
 * Formata valores monetários de forma inteligente
 * Exemplos:
 * - 1.500 → R$ 1,5K
 * - 15.000 → R$ 15K
 * - 150.000 → R$ 150K
 * - 1.500.000 → R$ 1,5M
 * - 15.000.000 → R$ 15M
 * - 1.500.000.000 → R$ 1,5B
 */
export const formatCurrency = (value: number | null | undefined): string => {
  // Tratar valores inválidos
  if (
    value === null ||
    value === undefined ||
    isNaN(value) ||
    !isFinite(value)
  ) {
    return 'R$ 0';
  }

  if (value === 0) return 'R$ 0';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1000000000) {
    // Bilhões
    return `${sign}R$ ${(absValue / 1000000000).toFixed(1)}B`;
  } else if (absValue >= 1000000) {
    // Milhões
    return `${sign}R$ ${(absValue / 1000000).toFixed(1)}M`;
  } else if (absValue >= 1000) {
    // Milhares
    return `${sign}R$ ${(absValue / 1000).toFixed(0)}K`;
  } else {
    // Valores menores que 1000
    return `${sign}R$ ${absValue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
};

/**
 * Formata valores numéricos de forma inteligente (sem símbolo de moeda)
 * Exemplos:
 * - 1.500 → 1,5K
 * - 15.000 → 15K
 * - 150.000 → 150K
 * - 1.500.000 → 1,5M
 * - 15.000.000 → 15M
 * - 1.500.000.000 → 1,5B
 */
export const formatNumber = (value: number): string => {
  if (value === 0) return '0';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1000000000) {
    // Bilhões
    return `${sign}${(absValue / 1000000000).toFixed(1)}B`;
  } else if (absValue >= 1000000) {
    // Milhões
    return `${sign}${(absValue / 1000000).toFixed(1)}M`;
  } else if (absValue >= 1000) {
    // Milhares
    return `${sign}${(absValue / 1000).toFixed(0)}K`;
  } else {
    // Valores menores que 1000
    return `${sign}${absValue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
};

/**
 * Formata valores monetários com precisão completa (para valores menores)
 * Exemplos:
 * - 1.500,50 → R$ 1.500,50
 * - 15.000,00 → R$ 15.000,00
 * - 150.000,00 → R$ 150.000,00
 */
export const formatCurrencyFull = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formata valores monetários de forma compacta para metas
 * Exemplos:
 * - 1.500.000 → R$ 1,5M
 * - 244.450 → R$ 244K
 * - 2.444.500 → R$ 2,4M
 */
export const formatCurrencyCompact = (value: number): string => {
  if (value === 0) return 'R$ 0';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1000000) {
    // Milhões
    return `${sign}R$ ${(absValue / 1000000).toFixed(1)}M`;
  } else if (absValue >= 1000) {
    // Milhares
    return `${sign}R$ ${(absValue / 1000).toFixed(0)}K`;
  } else {
    // Valores menores que 1000
    return `${sign}R$ ${absValue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
};
