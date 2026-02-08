import React, { useState, useEffect, useCallback } from 'react';
import {
  getCompanyModules,
  type CompanyModulesResponse,
} from '../services/modulesService';
import { isModuleAvailable } from '../utils/moduleMapping';
import { ModulesContext } from './ModulesContextTypes';

interface ModulesProviderProps {
  children: React.ReactNode;
  companyId: string | null;
}

// Cache para evitar chamadas desnecessárias
const CACHE_TIME = 5 * 60 * 1000; // 5 minutos
interface CachedModulesEntry {
  data: CompanyModulesResponse;
  normalizedModules: string[];
  timestamp: number;
}

const modulesCache = new Map<string, CachedModulesEntry>();

const normalizeModuleName = (value: unknown): string | null => {
  if (!value) return null;
  if (typeof value === 'string') return value.toLowerCase();
  if (
    typeof value === 'object' &&
    'code' in (value as Record<string, unknown>)
  ) {
    return String((value as Record<string, unknown>).code).toLowerCase();
  }
  return null;
};

const normalizeModules = (input: unknown): string[] => {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map(normalizeModuleName)
    .filter((moduleName): moduleName is string => Boolean(moduleName));
};

export function ModulesProvider({ children, companyId }: ModulesProviderProps) {
  const [modules, setModules] = useState<string[]>([]);
  const [planType, setPlanType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadModules = useCallback(async () => {
    if (!companyId) {
      setModules([]);
      setPlanType(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Verificar cache
      const cached = modulesCache.get(companyId);
      if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
        setModules(cached.normalizedModules);
        setPlanType(cached.data.planType || null);
        setLoading(false);
        return;
      }

      // Buscar da API
      const data = await getCompanyModules(companyId);
      const normalizedModules = normalizeModules(data.modules);

      // Atualizar cache
      modulesCache.set(companyId, {
        data,
        normalizedModules,
        timestamp: Date.now(),
      });

      setModules(normalizedModules);
      setPlanType(data.planType || null);
    } catch (err) {
      console.error('Erro ao buscar módulos da empresa:', err);
      setError('Erro ao carregar módulos disponíveis');
      setModules([]);
      setPlanType(null);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  // Limpar cache quando trocar de empresa
  useEffect(() => {
    if (companyId) {
      // Limpar cache de outras empresas (manter apenas a atual)
      const keysToDelete: string[] = [];
      modulesCache.forEach((_, key) => {
        if (key !== companyId) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => modulesCache.delete(key));
    }
  }, [companyId]);

  const hasModule = useCallback(
    (moduleName: string): boolean => {
      // Usar a função isModuleAvailable que já tem suporte completo a aliases
      // Isso garante que todos os módulos sejam verificados corretamente,
      // incluindo match_system, matches, match, etc.
      return isModuleAvailable(moduleName, modules);
    },
    [modules]
  );

  const refresh = useCallback(async () => {
    // Invalidar cache da empresa atual
    if (companyId) {
      modulesCache.delete(companyId);
    }
    await loadModules();
  }, [companyId, loadModules]);

  return (
    <ModulesContext.Provider
      value={{
        modules,
        planType,
        hasModule,
        loading,
        error,
        refresh,
      }}
    >
      {children}
    </ModulesContext.Provider>
  );
}
