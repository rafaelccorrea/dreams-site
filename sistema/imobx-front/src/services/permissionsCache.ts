import { authStorage } from './authStorage';

interface CachedPermissions {
  permissions: string[];
  role: string;
  companyId: string;
  userId: string;
  timestamp: number;
  version: string;
}

interface PermissionsDiff {
  added: string[];
  removed: string[];
  changed: boolean;
}

class PermissionsCacheService {
  private readonly CACHE_KEY = 'dream_keys_permissions_cache';
  private readonly CACHE_VERSION = '1.0.0';
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos
  private readonly MAX_CACHE_AGE = 2 * 60 * 60 * 1000; // 2 horas máximo

  /**
   * Salva as permissões no cache local
   */
  setCache(
    permissions: string[],
    role: string,
    companyId: string,
    userId: string
  ): void {
    try {
      const cachedData: CachedPermissions = {
        permissions: [...permissions], // Clonar array
        role,
        companyId,
        userId,
        timestamp: Date.now(),
        version: this.CACHE_VERSION,
      };

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cachedData));
      // console.log('💾 PermissionsCache: Cache salvo com sucesso', {
      //   permissionsCount: permissions.length,
      //   role,
      //   companyId,
      //   userId,
      //   timestamp: new Date(cachedData.timestamp).toISOString()
      // });
    } catch (error) {
      console.error('❌ PermissionsCache: Erro ao salvar cache:', error);
    }
  }

  /**
   * Recupera as permissões do cache local
   */
  getCache(): CachedPermissions | null {
    try {
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (!cachedData) {
        return null;
      }

      const parsed: CachedPermissions = JSON.parse(cachedData);

      // Verificar se o cache é da versão atual
      if (parsed.version !== this.CACHE_VERSION) {
        // console.log('🔄 PermissionsCache: Versão do cache desatualizada, limpando...');
        this.clearCache();
        return null;
      }

      // Verificar se o cache não expirou
      const now = Date.now();
      const age = now - parsed.timestamp;

      if (age > this.MAX_CACHE_AGE) {
        // console.log('⏰ PermissionsCache: Cache expirado (muito antigo), limpando...');
        this.clearCache();
        return null;
      }

      // Verificar se é do mesmo usuário e empresa
      const currentUser = authStorage.getUserData();
      if (
        !currentUser ||
        parsed.userId !== currentUser.id ||
        parsed.companyId !==
          localStorage.getItem('dream_keys_selected_company_id')
      ) {
        // console.log('🔄 PermissionsCache: Usuário/empresa mudou, limpando cache...');
        this.clearCache();
        return null;
      }

      // if (import.meta.env.DEV) {
      //   console.log('✅ PermissionsCache: Cache válido encontrado', {
      //     permissionsCount: parsed.permissions.length,
      //     role: parsed.role,
      //     age: Math.round(age / 1000) + 's',
      //     isStale: age > this.CACHE_DURATION
      //   });
      // }

      return parsed;
    } catch (error) {
      console.error('❌ PermissionsCache: Erro ao recuperar cache:', error);
      this.clearCache();
      return null;
    }
  }

  /**
   * Verifica se o cache está válido e não está stale
   */
  isCacheValid(): boolean {
    const cached = this.getCache();
    if (!cached) return false;

    const now = Date.now();
    const age = now - cached.timestamp;

    return age < this.CACHE_DURATION;
  }

  /**
   * Verifica se o cache está stale (precisa ser atualizado em background)
   */
  isCacheStale(): boolean {
    const cached = this.getCache();
    if (!cached) return false;

    const now = Date.now();
    const age = now - cached.timestamp;

    return age >= this.CACHE_DURATION && age < this.MAX_CACHE_AGE;
  }

  /**
   * Compara permissões antigas com novas e retorna as diferenças
   */
  comparePermissions(
    oldPermissions: string[],
    newPermissions: string[]
  ): PermissionsDiff {
    const oldSet = new Set(oldPermissions);
    const newSet = new Set(newPermissions);

    const added = newPermissions.filter(perm => !oldSet.has(perm));
    const removed = oldPermissions.filter(perm => !newSet.has(perm));
    const changed = added.length > 0 || removed.length > 0;

    return { added, removed, changed };
  }

  /**
   * Atualiza o cache com novas permissões, mantendo histórico de mudanças
   */
  updateCache(
    newPermissions: string[],
    role: string,
    companyId: string,
    userId: string
  ): PermissionsDiff | null {
    const oldCached = this.getCache();
    const oldPermissions = oldCached?.permissions || [];

    // Salvar novo cache
    this.setCache(newPermissions, role, companyId, userId);

    // Calcular diferenças
    const diff = this.comparePermissions(oldPermissions, newPermissions);

    if (diff.changed) {
      // console.log('🔄 PermissionsCache: Mudanças detectadas nas permissões', {
      //   added: diff.added,
      //   removed: diff.removed,
      //   oldCount: oldPermissions.length,
      //   newCount: newPermissions.length
      // });

      // Disparar evento global para notificar outros componentes
      window.dispatchEvent(
        new CustomEvent('permissions-changed', {
          detail: {
            added: diff.added,
            removed: diff.removed,
            newPermissions,
            oldPermissions,
          },
        })
      );
    }

    return diff.changed ? diff : null;
  }

  /**
   * Invalida o cache (força nova busca na próxima verificação)
   */
  invalidateCache(): void {
    // console.log('🗑️ PermissionsCache: Invalidando cache...');
    this.clearCache();

    // Disparar evento para notificar que o cache foi invalidado
    window.dispatchEvent(new CustomEvent('permissions-cache-invalidated'));
  }

  /**
   * Limpa completamente o cache
   */
  clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
      // console.log('🧹 PermissionsCache: Cache limpo');
    } catch (error) {
      console.error('❌ PermissionsCache: Erro ao limpar cache:', error);
    }
  }

  /**
   * Obtém estatísticas do cache atual
   */
  getCacheStats(): {
    exists: boolean;
    isValid: boolean;
    isStale: boolean;
    age?: number;
    permissionsCount?: number;
    role?: string;
  } {
    const cached = this.getCache();

    if (!cached) {
      return { exists: false, isValid: false, isStale: false };
    }

    const now = Date.now();
    const age = now - cached.timestamp;

    return {
      exists: true,
      isValid: age < this.CACHE_DURATION,
      isStale: age >= this.CACHE_DURATION && age < this.MAX_CACHE_AGE,
      age: Math.round(age / 1000),
      permissionsCount: cached.permissions.length,
      role: cached.role,
    };
  }
}

// Instância singleton
export const permissionsCache = new PermissionsCacheService();

// Eventos globais para comunicação entre componentes
export const PERMISSIONS_EVENTS = {
  CHANGED: 'permissions-changed',
  CACHE_INVALIDATED: 'permissions-cache-invalidated',
} as const;
