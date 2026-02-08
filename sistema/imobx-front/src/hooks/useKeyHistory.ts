import { useState, useCallback } from 'react';
import { api } from '../services/api';

export interface KeyHistoryRecord {
  id: string;
  keyId: string;
  userId?: string;
  keyControlId?: string;
  action: string;
  description: string;
  previousData?: any;
  newData?: any;
  metadata?: any;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  key?: {
    id: string;
    name: string;
    property?: {
      title: string;
    };
  };
  keyControl?: {
    id: string;
    type: string;
    checkoutDate: string;
    expectedReturnDate?: string;
    actualReturnDate?: string;
    reason: string;
    user?: {
      name: string;
    };
  };
}

export interface KeyHistoryStatistics {
  totalRecords: number;
  actionStats: Array<{
    action: string;
    count: number;
  }>;
  recentActivity: KeyHistoryRecord[];
}

interface UseKeyHistoryReturn {
  // Estados
  history: KeyHistoryRecord[];
  statistics: KeyHistoryStatistics | null;
  isLoading: boolean;
  error: string | null;

  // Ações
  getKeyHistory: (keyId: string, limit?: number) => Promise<void>;
  getUserHistory: (userId: string, limit?: number) => Promise<void>;
  getMyHistory: (limit?: number) => Promise<void>;
  getHistoryStatistics: (keyId?: string, userId?: string) => Promise<void>;

  // Utilitários
  clearError: () => void;
}

export const useKeyHistory = (): UseKeyHistoryReturn => {
  const [history, setHistory] = useState<KeyHistoryRecord[]>([]);
  const [statistics, setStatistics] = useState<KeyHistoryStatistics | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Buscar histórico de uma chave específica
  const getKeyHistory = useCallback(
    async (keyId: string, limit: number = 50): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // console.log('🔍 Buscando histórico da key:', keyId);
        const response = await api.get(
          `/key-history/key/${keyId}?limit=${limit}`
        );
        const data = Array.isArray(response.data) ? response.data : [];
        setHistory(data);
        // console.log('✅ Histórico da chave carregado:', data);
      } catch (err: any) {
        // Se o backend retornar 500 por ausência de metadata, não travar UI, apenas limpar histórico
        if (err?.response?.status >= 500) {
          setHistory([]);
          setError(null);
          console.warn(
            '⚠️ Erro no backend ao carregar histórico da chave. Exibindo vazio.'
          );
        } else {
          const errorMessage =
            err.response?.data?.message ||
            'Erro ao carregar histórico da chave';
          setError(errorMessage);
          console.error('❌ Erro ao carregar histórico da key:', errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Buscar histórico de um usuário específico
  const getUserHistory = useCallback(
    async (userId: string, limit: number = 50): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // console.log('🔍 Buscando histórico do usuário:', userId);
        const response = await api.get(
          `/key-history/user/${userId}?limit=${limit}`
        );
        const data = Array.isArray(response.data) ? response.data : [];
        setHistory(data);
        // console.log('✅ Histórico do usuário carregado:', data);
      } catch (err: any) {
        if (err?.response?.status >= 500) {
          setHistory([]);
          setError(null);
          console.warn(
            '⚠️ Erro no backend ao carregar histórico do usuário. Exibindo vazio.'
          );
        } else {
          const errorMessage =
            err.response?.data?.message ||
            'Erro ao carregar histórico do usuário';
          setError(errorMessage);
          console.error(
            '❌ Erro ao carregar histórico do usuário:',
            errorMessage
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Buscar histórico do usuário logado
  const getMyHistory = useCallback(
    async (limit: number = 50): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // console.log('🔍 Buscando meu histórico');
        const response = await api.get(
          `/key-history/my-history?limit=${limit}`
        );
        const data = Array.isArray(response.data) ? response.data : [];
        setHistory(data);
        // console.log('✅ Meu histórico carregado:', data);
      } catch (err: any) {
        if (err?.response?.status >= 500) {
          setHistory([]);
          setError(null);
          console.warn(
            '⚠️ Erro no backend ao carregar meu histórico. Exibindo vazio.'
          );
        } else {
          const errorMessage =
            err.response?.data?.message || 'Erro ao carregar meu histórico';
          setError(errorMessage);
          console.error('❌ Erro ao carregar meu histórico:', errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Buscar estatísticas do histórico
  const getHistoryStatistics = useCallback(
    async (keyId?: string, userId?: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // console.log('📊 Buscando estatísticas do histórico');
        const params = new URLSearchParams();
        if (keyId) params.append('keyId', keyId);
        if (userId) params.append('userId', userId);

        const response = await api.get(
          `/key-history/statistics?${params.toString()}`
        );
        setStatistics(response.data);
        // console.log('✅ Estatísticas do histórico carregadas:', response.data);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao carregar estatísticas';
        setError(errorMessage);
        console.error('❌ Erro ao carregar estatísticas:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    // Estados
    history,
    statistics,
    isLoading,
    error,

    // Ações
    getKeyHistory,
    getUserHistory,
    getMyHistory,
    getHistoryStatistics,

    // Utilitários
    clearError,
  };
};
