import { useState, useEffect, useCallback } from 'react';
import { prizesApi } from '../services/prizesApi';
import type {
  Prize,
  CreatePrizeDto,
  UpdatePrizeDto,
} from '../services/prizesApi';
import { toast } from 'react-toastify';

interface UsePrizesReturn {
  prizes: Prize[];
  isLoading: boolean;
  error: string | null;
  refreshPrizes: () => Promise<void>;
  createPrize: (data: CreatePrizeDto) => Promise<Prize | null>;
  updatePrize: (prizeId: string, data: UpdatePrizeDto) => Promise<Prize | null>;
  deletePrize: (prizeId: string) => Promise<boolean>;
  deliverPrize: (prizeId: string) => Promise<Prize | null>;
}

/**
 * Hook customizado para gerenciar prêmios
 */
export const usePrizes = (): UsePrizesReturn => {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Buscar todos os prêmios
   */
  const refreshPrizes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await prizesApi.getAllPrizes();
      setPrizes(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar prêmios';
      setError(errorMessage);
      console.error('Erro ao carregar prêmios:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Criar novo prêmio
   */
  const createPrize = useCallback(
    async (data: CreatePrizeDto): Promise<Prize | null> => {
      try {
        const newPrize = await prizesApi.createPrize(data);
        setPrizes(prev => [newPrize, ...prev]);
        toast.success('Prêmio criado com sucesso!');
        return newPrize;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao criar prêmio';
        toast.error(errorMessage);
        console.error('Erro ao criar prêmio:', err);
        return null;
      }
    },
    []
  );

  /**
   * Atualizar prêmio
   */
  const updatePrize = useCallback(
    async (prizeId: string, data: UpdatePrizeDto): Promise<Prize | null> => {
      try {
        const updatedPrize = await prizesApi.updatePrize(prizeId, data);
        setPrizes(prev => prev.map(p => (p.id === prizeId ? updatedPrize : p)));
        toast.success('Prêmio atualizado com sucesso!');
        return updatedPrize;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao atualizar prêmio';
        toast.error(errorMessage);
        console.error('Erro ao atualizar prêmio:', err);
        return null;
      }
    },
    []
  );

  /**
   * Excluir prêmio
   */
  const deletePrize = useCallback(async (prizeId: string): Promise<boolean> => {
    try {
      await prizesApi.deletePrize(prizeId);
      setPrizes(prev => prev.filter(p => p.id !== prizeId));
      toast.success('Prêmio excluído com sucesso!');
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir prêmio';
      toast.error(errorMessage);
      console.error('Erro ao excluir prêmio:', err);
      return false;
    }
  }, []);

  /**
   * Marcar prêmio como entregue
   */
  const deliverPrize = useCallback(
    async (prizeId: string): Promise<Prize | null> => {
      try {
        const deliveredPrize = await prizesApi.deliverPrize(prizeId);
        setPrizes(prev =>
          prev.map(p => (p.id === prizeId ? deliveredPrize : p))
        );
        toast.success('Prêmio marcado como entregue!');
        return deliveredPrize;
      } catch (err: any) {
        const errorMessage =
          err.message || 'Erro ao marcar prêmio como entregue';
        toast.error(errorMessage);
        console.error('Erro ao marcar prêmio como entregue:', err);
        return null;
      }
    },
    []
  );

  // Carregar prêmios ao montar o componente
  useEffect(() => {
    refreshPrizes();
  }, [refreshPrizes]);

  return {
    prizes,
    isLoading,
    error,
    refreshPrizes,
    createPrize,
    updatePrize,
    deletePrize,
    deliverPrize,
  };
};
