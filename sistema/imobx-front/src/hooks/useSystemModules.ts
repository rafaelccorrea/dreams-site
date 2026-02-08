import { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface SystemModule {
  id: string;
  code: string;
  name: string;
  description: string;
  category:
    | 'basic'
    | 'intermediate'
    | 'advanced'
    | 'premium'
    | 'additional'
    | 'system';
  icon: string;
  price: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

interface ModulesByCategory {
  basic: SystemModule[];
  intermediate: SystemModule[];
  advanced: SystemModule[];
  premium: SystemModule[];
  additional: SystemModule[];
  system: SystemModule[];
}

const CACHE_KEY = 'system_modules_cache';
const CACHE_TTL = 1000 * 60 * 60; // 1 hora

/**
 * Hook para buscar todos os módulos disponíveis no sistema
 * Usa cache local para melhor performance
 */
export function useSystemModules() {
  const [modules, setModules] = useState<SystemModule[]>([]);
  const [modulesByCategory, setModulesByCategory] =
    useState<ModulesByCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TTL) {
              setModules(data);
              setLoading(false);
              return;
            }
          } catch (e) {
            // Cache inválido, continuar para buscar da API
            localStorage.removeItem(CACHE_KEY);
          }
        }

        // Buscar da API
        const response = await api.get<SystemModule[]>(
          '/modules?isActive=true'
        );
        const data = response.data;

        // Salvar no cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          })
        );

        setModules(data);
      } catch (err) {
        console.error('Erro ao buscar módulos do sistema:', err);
        setError('Erro ao carregar módulos disponíveis');
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // Buscar módulos agrupados por categoria
  useEffect(() => {
    const fetchByCategory = async () => {
      try {
        const response = await api.get<ModulesByCategory>(
          '/modules/by-category'
        );
        setModulesByCategory(response.data);
      } catch (err) {
        console.error('Erro ao buscar módulos por categoria:', err);
      }
    };

    if (modules.length > 0) {
      fetchByCategory();
    }
  }, [modules.length]);

  const getModuleByCode = (code: string): SystemModule | undefined => {
    return modules.find(m => m.code === code);
  };

  const getModulesByCategory = (category: string): SystemModule[] => {
    return modules.filter(m => m.category === category);
  };

  const getModuleCodes = (): string[] => {
    return modules.map(m => m.code);
  };

  const refresh = () => {
    localStorage.removeItem(CACHE_KEY);
    window.location.reload();
  };

  return {
    modules,
    modulesByCategory,
    loading,
    error,
    getModuleByCode,
    getModulesByCategory,
    getModuleCodes,
    refresh,
  };
}

/**
 * Hook simplificado para buscar apenas os códigos dos módulos
 */
export function useModuleCodes() {
  const [codes, setCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const response = await api.get<string[]>('/modules/codes');
        setCodes(response.data);
      } catch (err) {
        console.error('Erro ao buscar códigos dos módulos:', err);
        setCodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, []);

  return { codes, loading };
}
