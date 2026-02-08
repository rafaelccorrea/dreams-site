/**
 * Utilitário para gerenciar cache de dados de análise no localStorage
 * Salva dados de cada API separadamente para atualização independente
 */

export interface CachedAnalyticsData {
  data: any;
  timestamp: number;
  version: string; // Versão do cache para invalidar se necessário
}

const CACHE_VERSION = '1.0.0';
const CACHE_PREFIX = 'analytics_cache_';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutos

// Chaves para cada tipo de dado
export const CACHE_KEYS = {
  COMPANY_PERFORMANCE: 'company_performance',
  PENDING_MATCHES: 'pending_matches',
  BROKERS_PERFORMANCE: 'brokers_performance',
  CHURN_ANALYSIS: 'churn_analysis',
  CONVERSION_FUNNEL: 'conversion_funnel',
  CAPTURES_STATISTICS: 'captures_statistics',
} as const;

/**
 * Compara dois objetos para verificar se são iguais (deep comparison simplificada)
 */
function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

  // Para arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    // Comparação simplificada: verifica se os IDs principais são iguais
    const ids1 = obj1
      .map(
        (item: any) =>
          item?.id || item?.brokerId || item?.clientId || JSON.stringify(item)
      )
      .sort();
    const ids2 = obj2
      .map(
        (item: any) =>
          item?.id || item?.brokerId || item?.clientId || JSON.stringify(item)
      )
      .sort();
    return JSON.stringify(ids1) === JSON.stringify(ids2);
  }

  // Para objetos
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

/**
 * Salva dados no cache
 */
export function saveToCache(key: string, data: any): void {
  try {
    const cached: CachedAnalyticsData = {
      data,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cached));
    console.log(`💾 [AnalyticsCache] Dados salvos no cache: ${key}`, {
      timestamp: new Date(cached.timestamp).toLocaleString('pt-BR'),
      dataSize: JSON.stringify(data).length,
    });
  } catch (error) {
    console.error(
      `❌ [AnalyticsCache] Erro ao salvar no cache (${key}):`,
      error
    );
  }
}

/**
 * Recupera dados do cache
 */
export function getFromCache<T>(
  key: string
): { data: T; timestamp: number; isExpired: boolean } | null {
  try {
    const cachedStr = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cachedStr) return null;

    const cached: CachedAnalyticsData = JSON.parse(cachedStr);

    // Verificar versão
    if (cached.version !== CACHE_VERSION) {
      console.log(
        `🔄 [AnalyticsCache] Versão do cache inválida para ${key}, limpando...`
      );
      removeFromCache(key);
      return null;
    }

    const isExpired = Date.now() - cached.timestamp > CACHE_EXPIRY_MS;

    return {
      data: cached.data as T,
      timestamp: cached.timestamp,
      isExpired,
    };
  } catch (error) {
    console.error(
      `❌ [AnalyticsCache] Erro ao recuperar do cache (${key}):`,
      error
    );
    return null;
  }
}

/**
 * Remove dados do cache
 */
export function removeFromCache(key: string): void {
  try {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    console.log(`🗑️ [AnalyticsCache] Cache removido: ${key}`);
  } catch (error) {
    console.error(
      `❌ [AnalyticsCache] Erro ao remover do cache (${key}):`,
      error
    );
  }
}

/**
 * Limpa todo o cache de analytics
 */
export function clearAllCache(): void {
  try {
    Object.values(CACHE_KEYS).forEach(key => {
      removeFromCache(key);
    });
    console.log('🗑️ [AnalyticsCache] Todo o cache foi limpo');
  } catch (error) {
    console.error('❌ [AnalyticsCache] Erro ao limpar cache:', error);
  }
}

/**
 * Verifica se os dados novos são iguais aos dados em cache
 */
export function isDataEqual(key: string, newData: any): boolean {
  const cached = getFromCache(key);
  if (!cached) return false;

  return deepEqual(cached.data, newData);
}

/**
 * Obtém informações do cache (timestamp formatado, etc)
 */
export function getCacheInfo(
  key: string
): { timestamp: number; formattedTime: string; isExpired: boolean } | null {
  const cached = getFromCache(key);
  if (!cached) return null;

  return {
    timestamp: cached.timestamp,
    formattedTime: new Date(cached.timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    isExpired: cached.isExpired,
  };
}
