import { useState, useCallback } from 'react';
import { assetApi } from '../services/assetApi';
import { useAutoReloadOnCompanyChange } from './useCompanyMonitor';
import type {
  Asset,
  CreateAssetDto,
  UpdateAssetDto,
  TransferAssetDto,
  CreateAssetMovementDto,
  AssetQueryParams,
  AssetStats,
  AssetMovement,
} from '../types/asset';

interface UseAssetsReturn {
  // Estados
  assets: Asset[];
  currentAsset: Asset | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  stats: AssetStats | null;

  // Ações CRUD
  createAsset: (data: CreateAssetDto) => Promise<Asset>;
  getAssetById: (id: string) => Promise<Asset>;
  getAssets: (
    params?: AssetQueryParams
  ) => Promise<{ assets: Asset[]; total: number }>;
  updateAsset: (id: string, data: UpdateAssetDto) => Promise<Asset>;
  deleteAsset: (id: string) => Promise<void>;

  // Ações específicas
  transferAsset: (id: string, data: TransferAssetDto) => Promise<Asset>;
  getAssetStats: () => Promise<AssetStats>;
  getAssetMovements: (assetId: string) => Promise<AssetMovement[]>;
  createAssetMovement: (data: CreateAssetMovementDto) => Promise<AssetMovement>;

  // Utilitários
  clearError: () => void;
  setCurrentAsset: (asset: Asset | null) => void;
  refreshAssets: () => Promise<void>;
}

export const useAssets = (): UseAssetsReturn => {
  // Estados principais
  const [assets, setAssets] = useState<Asset[]>([]);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<AssetStats | null>(null);

  // Parâmetros atuais (para refresh)
  const [currentParams, setCurrentParams] = useState<AssetQueryParams>({});

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Criar patrimônio
  const createAsset = useCallback(
    async (data: CreateAssetDto): Promise<Asset> => {
      setIsLoading(true);
      setError(null);

      try {
        const newAsset = await assetApi.createAsset(data);

        // Adicionar à lista local se estivermos na primeira página
        setAssets(prev => [newAsset, ...prev]);
        setTotal(prev => prev + 1);

        return newAsset;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao criar patrimônio';
        console.error('❌ Erro ao criar patrimônio via hook:', errorMessage);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Buscar patrimônio por ID
  const getAssetById = useCallback(async (id: string): Promise<Asset> => {
    setIsLoading(true);
    setError(null);

    try {
      const asset = await assetApi.getAssetById(id);
      setCurrentAsset(asset);
      return asset;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar patrimônio';
      console.error('❌ Erro ao buscar patrimônio via hook:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listar patrimônios
  const getAssets = useCallback(
    async (
      params: AssetQueryParams = {}
    ): Promise<{ assets: Asset[]; total: number }> => {
      setIsLoading(true);
      setError(null);

      try {
        // Salvar parâmetros atuais
        setCurrentParams(params);

        const response = await assetApi.getAssets(params);

        setAssets(response.assets || []);
        setTotal(response.total || 0);
        return { assets: response.assets || [], total: response.total || 0 };
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao listar patrimônios';
        console.error('❌ Erro ao listar patrimônios via hook:', errorMessage);
        setError(errorMessage);
        return { assets: [], total: 0 };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Atualizar patrimônio
  const updateAsset = useCallback(
    async (id: string, data: UpdateAssetDto): Promise<Asset> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedAsset = await assetApi.updateAsset(id, data);

        // Atualizar na lista local
        setAssets(prev =>
          prev.map(asset => (asset.id === id ? updatedAsset : asset))
        );

        // Atualizar patrimônio atual se for o mesmo
        if (currentAsset?.id === id) {
          setCurrentAsset(updatedAsset);
        }

        return updatedAsset;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao atualizar patrimônio';
        console.error(
          '❌ Erro ao atualizar patrimônio via hook:',
          errorMessage
        );
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentAsset?.id]
  );

  // Excluir patrimônio
  const deleteAsset = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await assetApi.deleteAsset(id);

        // Remover da lista local
        setAssets(prev => prev.filter(asset => asset.id !== id));
        setTotal(prev => Math.max(0, prev - 1));

        // Limpar patrimônio atual se for o mesmo
        if (currentAsset?.id === id) {
          setCurrentAsset(null);
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao excluir patrimônio';
        console.error('❌ Erro ao excluir patrimônio via hook:', errorMessage);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentAsset?.id]
  );

  // Transferir patrimônio
  const transferAsset = useCallback(
    async (id: string, data: TransferAssetDto): Promise<Asset> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedAsset = await assetApi.transferAsset(id, data);

        // Atualizar na lista local
        setAssets(prev =>
          prev.map(asset => (asset.id === id ? updatedAsset : asset))
        );

        // Atualizar patrimônio atual se for o mesmo
        if (currentAsset?.id === id) {
          setCurrentAsset(updatedAsset);
        }

        return updatedAsset;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao transferir patrimônio';
        console.error(
          '❌ Erro ao transferir patrimônio via hook:',
          errorMessage
        );
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentAsset?.id]
  );

  // Buscar estatísticas
  const getAssetStats = useCallback(async (): Promise<AssetStats> => {
    setIsLoading(true);
    setError(null);

    try {
      const statsData = await assetApi.getAssetStats();
      setStats(statsData);
      return statsData;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar estatísticas';
      console.error('❌ Erro ao buscar estatísticas via hook:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar movimentações
  const getAssetMovements = useCallback(
    async (assetId: string): Promise<AssetMovement[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const movements = await assetApi.getAssetMovements(assetId);
        return movements;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao buscar movimentações';
        console.error(
          '❌ Erro ao buscar movimentações via hook:',
          errorMessage
        );
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Criar movimentação
  const createAssetMovement = useCallback(
    async (data: CreateAssetMovementDto): Promise<AssetMovement> => {
      setIsLoading(true);
      setError(null);

      try {
        const movement = await assetApi.createAssetMovement(data);

        // Se a movimentação afetar o patrimônio atual, recarregar
        if (currentAsset?.id === data.assetId) {
          const updatedAsset = await assetApi.getAssetById(data.assetId);
          setCurrentAsset(updatedAsset);
        }

        return movement;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao criar movimentação';
        console.error('❌ Erro ao criar movimentação via hook:', errorMessage);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentAsset?.id]
  );

  // Função estável para recarregar patrimônios
  const reloadAssets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await assetApi.getAssets(currentParams);
      setAssets(response.assets || []);
      setTotal(response.total || 0);
    } catch (error: any) {
      console.error(
        'Erro ao recarregar patrimônios após mudança de empresa:',
        error
      );
      setError(
        error.response?.data?.message || 'Erro ao recarregar patrimônios'
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentParams]);

  // Monitorar mudanças de empresa e recarregar patrimônios automaticamente
  useAutoReloadOnCompanyChange(reloadAssets);

  // Atualizar patrimônio atual
  const setCurrentAssetCallback = useCallback((asset: Asset | null) => {
    setCurrentAsset(asset);
  }, []);

  // Atualizar lista com parâmetros atuais
  const refreshAssets = useCallback(async (): Promise<void> => {
    await getAssets(currentParams);
  }, [getAssets, currentParams]);

  return {
    // Estados
    assets,
    currentAsset,
    isLoading,
    error,
    total,
    stats,

    // Ações CRUD
    createAsset,
    getAssetById,
    getAssets,
    updateAsset,
    deleteAsset,

    // Ações específicas
    transferAsset,
    getAssetStats,
    getAssetMovements,
    createAssetMovement,

    // Utilitários
    clearError,
    setCurrentAsset: setCurrentAssetCallback,
    refreshAssets,
  };
};
