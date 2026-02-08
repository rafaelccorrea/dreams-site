// Sistema de cache para otimizar performance
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class PerformanceCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 100; // Máximo de itens no cache
  private defaultTTL = 5 * 60 * 1000; // 5 minutos por padrão

  // Definir item no cache
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    // Se cache está cheio, remover item mais antigo
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    });
  }

  // Obter item do cache
  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Verificar se expirou
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  // Verificar se item existe e não expirou
  has(key: string): boolean {
    const item = this.cache.get(key);

    if (!item) {
      return false;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Remover item do cache
  delete(key: string): void {
    this.cache.delete(key);
  }

  // Limpar cache
  clear(): void {
    this.cache.clear();
  }

  // Limpar itens expirados
  cleanup(): void {
    const now = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Obter estatísticas do cache
  getStats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    for (const item of this.cache.values()) {
      if (now > item.expiresAt) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.cache.size,
      active,
      expired,
      maxSize: this.maxSize,
    };
  }

  // Definir tamanho máximo do cache
  setMaxSize(size: number): void {
    this.maxSize = size;

    // Se cache atual excede o novo tamanho, remover itens mais antigos
    while (this.cache.size > this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }
}

// Instância global do cache
export const performanceCache = new PerformanceCache();

// Funções utilitárias para cache de API
export const cacheApiResponse = <T>(
  key: string,
  apiCall: () => Promise<T>,
  ttl?: number
): Promise<T> => {
  // Verificar se existe no cache
  const cached = performanceCache.get<T>(key);
  if (cached) {
    return Promise.resolve(cached);
  }

  // Fazer chamada da API e armazenar no cache
  return apiCall().then(data => {
    performanceCache.set(key, data, ttl);
    return data;
  });
};

// Função para invalidar cache por padrão
export const invalidateCache = (pattern: string): void => {
  const keysToDelete: string[] = [];

  for (const key of performanceCache['cache'].keys()) {
    if (key.includes(pattern)) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach(key => performanceCache.delete(key));
};

// Limpeza automática do cache a cada 5 minutos
setInterval(
  () => {
    performanceCache.cleanup();
  },
  5 * 60 * 1000
);

export default performanceCache;
