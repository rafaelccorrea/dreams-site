import { useState, useEffect, useCallback } from 'react';
import {
  calculateCustomPlan,
  type CustomQuote,
  type CalculateCustomRequest,
} from '../services/pricingService';

// Debounce simples
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface Addons {
  companies: number;
  users: number;
  properties: number;
  storage: number;
  apiCalls: number;
}

/**
 * Hook para calcular plano customizado em tempo real
 * Usa debounce para não sobrecarregar a API
 */
export function useCustomPlanCalculator() {
  const [modules, setModules] = useState<string[]>([]);
  const [addons, setAddons] = useState<Addons>({
    companies: 0,
    users: 0,
    properties: 0,
    storage: 0,
    apiCalls: 0,
  });
  const [quote, setQuote] = useState<CustomQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para calcular (com debounce)
  const calculate = useCallback(
    debounce(async (selectedModules: string[], selectedAddons: Addons) => {
      if (selectedModules.length === 0) {
        setQuote(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const request: CalculateCustomRequest = {
          modules: selectedModules,
          extraCompanies: selectedAddons.companies || 0,
          extraUsers: selectedAddons.users || 0,
          extraProperties: selectedAddons.properties || 0,
          extraStorage: selectedAddons.storage || 0,
          extraApiCalls: selectedAddons.apiCalls || 0,
        };

        const result = await calculateCustomPlan(request);
        setQuote(result);
        setError(null);
      } catch (err: any) {
        console.error('Erro ao calcular plano custom:', err);

        // Mensagem de erro amigável
        let errorMessage = 'Erro ao calcular orçamento. Tente novamente.';

        if (err?.message) {
          errorMessage = err.message;
        } else if (err?.response?.status === 404) {
          errorMessage =
            'API de cálculo não disponível. Entre em contato com o suporte.';
        } else if (err?.response?.status === 400) {
          errorMessage =
            'Dados inválidos. Verifique os módulos e recursos selecionados.';
        } else if (err?.code === 'ERR_NETWORK') {
          errorMessage =
            'Erro de conexão. Verifique sua internet e tente novamente.';
        }

        setError(errorMessage);
        setQuote(null);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  // Recalcular quando mudar seleção
  useEffect(() => {
    calculate(modules, addons);
  }, [modules, addons, calculate]);

  const toggleModule = (moduleCode: string) => {
    setModules(prev =>
      prev.includes(moduleCode)
        ? prev.filter(c => c !== moduleCode)
        : [...prev, moduleCode]
    );
  };

  const updateAddon = (type: keyof Addons, value: number) => {
    setAddons(prev => ({ ...prev, [type]: value }));
  };

  const reset = () => {
    setModules([]);
    setAddons({
      companies: 0,
      users: 0,
      properties: 0,
      storage: 0,
      apiCalls: 0,
    });
    setQuote(null);
  };

  return {
    modules,
    setModules,
    toggleModule,
    addons,
    setAddons,
    updateAddon,
    quote,
    loading,
    error,
    reset,
  };
}
