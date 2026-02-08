import { useState, useCallback } from 'react';
import { spouseApi } from '../services/spouseApi';
import type { Spouse, CreateSpouseDto, UpdateSpouseDto } from '../types/spouse';
import { toast } from 'react-toastify';

export interface UseSpouseReturn {
  spouse: Spouse | null;
  loading: boolean;
  error: string | null;
  fetchSpouseByClientId: (clientId: string) => Promise<void>;
  createSpouse: (clientId: string, data: CreateSpouseDto) => Promise<Spouse>;
  updateSpouse: (spouseId: string, data: UpdateSpouseDto) => Promise<Spouse>;
  deleteSpouse: (spouseId: string) => Promise<void>;
  clearSpouse: () => void;
}

export const useSpouse = (): UseSpouseReturn => {
  const [spouse, setSpouse] = useState<Spouse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Buscar cônjuge por ID do cliente
   */
  const fetchSpouseByClientId = useCallback(async (clientId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await spouseApi.getSpouseByClientId(clientId);
      setSpouse(result);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao buscar cônjuge';
      setError(errorMessage);
      console.error('Erro ao buscar cônjuge:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Criar novo cônjuge
   */
  const createSpouse = useCallback(
    async (clientId: string, data: CreateSpouseDto): Promise<Spouse> => {
      setLoading(true);
      setError(null);

      try {
        const result = await spouseApi.createSpouse(clientId, data);
        setSpouse(result);
        toast.success('Cônjuge cadastrado com sucesso!');
        return result;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao criar cônjuge';
        setError(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Atualizar cônjuge existente
   */
  const updateSpouse = useCallback(
    async (spouseId: string, data: UpdateSpouseDto): Promise<Spouse> => {
      setLoading(true);
      setError(null);

      try {
        const result = await spouseApi.updateSpouse(spouseId, data);
        setSpouse(result);
        toast.success('Cônjuge atualizado com sucesso!');
        return result;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao atualizar cônjuge';
        setError(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Deletar cônjuge
   */
  const deleteSpouse = useCallback(async (spouseId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await spouseApi.deleteSpouse(spouseId);
      setSpouse(null);
      toast.success('Cônjuge removido com sucesso!');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao deletar cônjuge';
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpar estado do cônjuge
   */
  const clearSpouse = useCallback(() => {
    setSpouse(null);
    setError(null);
  }, []);

  return {
    spouse,
    loading,
    error,
    fetchSpouseByClientId,
    createSpouse,
    updateSpouse,
    deleteSpouse,
    clearSpouse,
  };
};
