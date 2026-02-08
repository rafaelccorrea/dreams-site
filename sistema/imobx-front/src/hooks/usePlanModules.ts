import { useState, useEffect, useCallback } from 'react';
import { plansApi } from '../services/plansApi';
import type {
  PlanModulesResponse,
  PlanType,
  AllModulesResponse,
  ModuleAccessResponse,
} from '../types/planModules';

/**
 * Hook para obter módulos por plano (Básico e Pro)
 */
export function usePlanModules() {
  const [data, setData] = useState<PlanModulesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await plansApi.getModulesByPlan();
      setData(response);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao carregar módulos dos planos';
      setError(errorMessage);
      console.error('Erro ao carregar módulos dos planos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return { data, loading, error, refetch: fetchModules };
}

/**
 * Hook para obter todos os planos
 */
export function useAllPlans(activeOnly = false) {
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = activeOnly
        ? await plansApi.getActivePlans()
        : await plansApi.getAllPlans();
      setPlans(response);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao carregar planos';
      setError(errorMessage);
      console.error('Erro ao carregar planos:', err);
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, error, refetch: fetchPlans };
}

/**
 * Hook para obter um plano específico por tipo
 */
export function usePlanByType(type: 'basic' | 'pro' | 'custom') {
  const [plan, setPlan] = useState<PlanType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await plansApi.getPlanByType(type);
      setPlan(response);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        `Erro ao carregar plano ${type}`;
      setError(errorMessage);
      console.error(`Erro ao carregar plano ${type}:`, err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return { plan, loading, error, refetch: fetchPlan };
}

/**
 * Hook para obter todos os módulos disponíveis no sistema
 */
export function useAllModules() {
  const [modules, setModules] = useState<AllModulesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await plansApi.getAllModules();
      setModules(response);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao carregar módulos';
      setError(errorMessage);
      console.error('Erro ao carregar módulos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return { modules, loading, error, refetch: fetchModules };
}

/**
 * Hook para verificar acesso a um módulo em um plano
 */
export function useModuleAccess(planId: string | null, moduleType: string) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAccess = useCallback(async () => {
    if (!planId || !moduleType) {
      setHasAccess(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await plansApi.checkModuleAccess(planId, moduleType);
      setHasAccess(response.hasAccess);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao verificar acesso ao módulo';
      setError(errorMessage);
      console.error('Erro ao verificar acesso ao módulo:', err);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  }, [planId, moduleType]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  return { hasAccess, loading, error, refetch: checkAccess };
}
