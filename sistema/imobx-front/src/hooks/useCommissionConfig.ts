import { useState, useEffect, useCallback } from 'react';
import { commissionConfigApi } from '../services/commissionApi';
import type {
  CommissionConfig,
  CreateCommissionConfigDTO,
  UpdateCommissionConfigDTO,
} from '../types/commission';

export const useCommissionConfig = () => {
  const [config, setConfig] = useState<CommissionConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasConfig, setHasConfig] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await commissionConfigApi.getConfig();
      setConfig(response);
      setHasConfig(!!response.id);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar configuração de comissão');
      setConfig(null);
      setHasConfig(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const createConfig = useCallback(
    async (data: CreateCommissionConfigDTO): Promise<CommissionConfig> => {
      try {
        setLoading(true);
        setError(null);
        const response = await commissionConfigApi.createConfig(data);
        setConfig(response);
        setHasConfig(true);
        return response;
      } catch (err: any) {
        setError(err.message || 'Erro ao criar configuração de comissão');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateConfig = useCallback(
    async (data: UpdateCommissionConfigDTO): Promise<CommissionConfig> => {
      try {
        setLoading(true);
        setError(null);
        const response = await commissionConfigApi.updateConfig(data);
        setConfig(response);
        return response;
      } catch (err: any) {
        setError(err.message || 'Erro ao atualizar configuração de comissão');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteConfig = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await commissionConfigApi.deleteConfig();
      setConfig(null);
      setHasConfig(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao desativar configuração de comissão');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Calcular valores de exemplo
  const calculateExample = useCallback(
    (baseValue: number, type: 'sale' | 'rental') => {
      if (!config) return { commission: 0, profit: 0 };

      const percentage =
        type === 'sale'
          ? config.saleCommissionPercentage
          : config.rentalCommissionPercentage;

      const profitPercentage =
        type === 'sale'
          ? config.companyProfitPercentage
          : config.companyRentalProfitPercentage;

      return {
        commission: (baseValue * percentage) / 100,
        profit: (baseValue * profitPercentage) / 100,
      };
    },
    [config]
  );

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return {
    config,
    loading,
    error,
    hasConfig,
    fetchConfig,
    createConfig,
    updateConfig,
    deleteConfig,
    calculateExample,
  };
};
