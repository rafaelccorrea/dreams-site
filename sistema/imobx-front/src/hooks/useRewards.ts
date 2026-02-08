import { useState, useEffect, useCallback } from 'react';
import { rewardsApi } from '../services/rewardsApi';
import { toast } from 'react-toastify';
import type {
  Reward,
  RewardRedemption,
  RewardStats,
  CreateRewardRequest,
  UpdateRewardRequest,
  RedeemRewardRequest,
  ReviewRedemptionRequest,
  DeliverRedemptionRequest,
} from '../types/rewards.types';
import {
  getMockRewards,
  getMockMyRedemptions,
  getMockPendingRedemptions,
  getMockStats,
} from '../mocks/rewards';
import { USE_MOCK_REWARDS as USE_MOCK_DATA } from '../config/mockConfig';

/**
 * Hook para gerenciar prêmios disponíveis e resgates
 */
export const useRewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar prêmios disponíveis
  const fetchAvailable = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = USE_MOCK_DATA
        ? await getMockRewards()
        : await rewardsApi.getAvailable();
      setRewards(data);
    } catch (err: any) {
      console.error('Erro ao buscar prêmios:', err);
      setError(err.message || 'Erro ao carregar prêmios');
      if (!USE_MOCK_DATA) {
        toast.error('Erro ao carregar prêmios disponíveis');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Solicitar resgate de prêmio
  const redeemReward = useCallback(
    async (data: RedeemRewardRequest): Promise<RewardRedemption | null> => {
      try {
        const redemption = await rewardsApi.redeem(data);
        toast.success(
          '🎁 Solicitação enviada! Aguarde aprovação do seu gestor.',
          { autoClose: 5000 }
        );
        return redemption;
      } catch (err: any) {
        console.error('Erro ao solicitar resgate:', err);
        const errorMessage =
          err.response?.data?.message || 'Erro ao solicitar resgate';
        toast.error(errorMessage);
        return null;
      }
    },
    []
  );

  // Carregar prêmios ao montar
  useEffect(() => {
    fetchAvailable();
  }, [fetchAvailable]);

  return {
    // Estado
    rewards,
    loading,
    error,

    // Ações
    refetch: fetchAvailable,
    redeemReward,
  };
};

/**
 * Hook para gerenciar minhas solicitações de resgate
 */
export const useMyRedemptions = () => {
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar minhas solicitações
  const fetchMyRedemptions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = USE_MOCK_DATA
        ? await getMockMyRedemptions()
        : await rewardsApi.getMyRedemptions();
      setRedemptions(data);
    } catch (err: any) {
      console.error('Erro ao buscar solicitações:', err);
      setError(err.message || 'Erro ao carregar solicitações');
      if (!USE_MOCK_DATA) {
        toast.error('Erro ao carregar suas solicitações');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar ao montar
  useEffect(() => {
    fetchMyRedemptions();
  }, [fetchMyRedemptions]);

  return {
    // Estado
    redemptions,
    loading,
    error,

    // Ações
    refetch: fetchMyRedemptions,
  };
};

/**
 * Hook para gestores aprovarem/rejeitarem resgates
 */
export const usePendingRedemptions = () => {
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar solicitações pendentes
  const fetchPending = useCallback(
    async (params?: {
      status?: string;
      userId?: string;
      page?: number;
      limit?: number;
    }) => {
      setLoading(true);
      setError(null);

      try {
        if (USE_MOCK_DATA) {
          const mockData = await getMockPendingRedemptions();
          setRedemptions(mockData);
          setTotal(mockData.length);
        } else {
          const response = await rewardsApi.getPendingRedemptions(params);
          setRedemptions(response.data);
          setTotal(response.total);
        }
      } catch (err: any) {
        console.error('Erro ao buscar solicitações pendentes:', err);
        setError(err.message || 'Erro ao carregar solicitações');
        if (!USE_MOCK_DATA) {
          toast.error('Erro ao carregar solicitações pendentes');
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Aprovar ou rejeitar resgate
  const reviewRedemption = useCallback(
    async (
      id: string,
      data: ReviewRedemptionRequest
    ): Promise<RewardRedemption | null> => {
      try {
        const redemption = await rewardsApi.reviewRedemption(id, data);
        const message =
          data.status === 'approved'
            ? '✅ Resgate aprovado! Pontos debitados do usuário.'
            : '❌ Resgate rejeitado. Pontos não foram debitados.';
        toast.success(message);
        await fetchPending({ status: 'pending' }); // Recarregar lista
        return redemption;
      } catch (err: any) {
        console.error('Erro ao revisar resgate:', err);
        toast.error(err.response?.data?.message || 'Erro ao revisar resgate');
        return null;
      }
    },
    [fetchPending]
  );

  // Marcar como entregue
  const deliverRedemption = useCallback(
    async (
      id: string,
      data: DeliverRedemptionRequest
    ): Promise<RewardRedemption | null> => {
      try {
        const redemption = await rewardsApi.deliverRedemption(id, data);
        toast.success('🎁 Prêmio marcado como entregue!');
        await fetchPending(); // Recarregar lista
        return redemption;
      } catch (err: any) {
        console.error('Erro ao marcar como entregue:', err);
        toast.error(
          err.response?.data?.message || 'Erro ao marcar como entregue'
        );
        return null;
      }
    },
    [fetchPending]
  );

  // Carregar ao montar
  useEffect(() => {
    fetchPending({ status: 'pending' });
  }, [fetchPending]);

  return {
    // Estado
    redemptions,
    total,
    loading,
    error,

    // Ações
    refetch: fetchPending,
    reviewRedemption,
    deliverRedemption,
  };
};

/**
 * Hook para admin gerenciar prêmios (CRUD)
 */
export const useRewardManagement = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [stats, setStats] = useState<RewardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar todos os prêmios
  const fetchAll = useCallback(async (includeInactive = true) => {
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK_DATA) {
        const [rewardsData, statsData] = await Promise.all([
          getMockRewards(includeInactive),
          getMockStats(),
        ]);
        setRewards(rewardsData);
        setStats(statsData);
      } else {
        const [rewardsData, statsData] = await Promise.all([
          rewardsApi.getAll(includeInactive),
          rewardsApi.getStats().catch(() => null),
        ]);
        setRewards(rewardsData);
        if (statsData) {
          setStats(statsData);
        }
      }
    } catch (err: any) {
      console.error('Erro ao buscar prêmios:', err);
      setError(err.message || 'Erro ao carregar prêmios');
      if (!USE_MOCK_DATA) {
        toast.error('Erro ao carregar prêmios');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar prêmio
  const createReward = useCallback(
    async (data: CreateRewardRequest): Promise<Reward | null> => {
      try {
        const reward = await rewardsApi.create(data);
        toast.success('✅ Prêmio criado com sucesso!');
        await fetchAll(); // Recarregar lista
        return reward;
      } catch (err: any) {
        console.error('Erro ao criar prêmio:', err);
        toast.error(err.response?.data?.message || 'Erro ao criar prêmio');
        return null;
      }
    },
    [fetchAll]
  );

  // Atualizar prêmio
  const updateReward = useCallback(
    async (id: string, data: UpdateRewardRequest): Promise<Reward | null> => {
      try {
        const reward = await rewardsApi.update(id, data);
        toast.success('✅ Prêmio atualizado com sucesso!');
        await fetchAll(); // Recarregar lista
        return reward;
      } catch (err: any) {
        console.error('Erro ao atualizar prêmio:', err);
        toast.error(err.response?.data?.message || 'Erro ao atualizar prêmio');
        return null;
      }
    },
    [fetchAll]
  );

  // Excluir prêmio
  const deleteReward = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await rewardsApi.delete(id);
        toast.success('✅ Prêmio excluído com sucesso!');
        await fetchAll(); // Recarregar lista
        return true;
      } catch (err: any) {
        console.error('Erro ao excluir prêmio:', err);
        toast.error(err.response?.data?.message || 'Erro ao excluir prêmio');
        return false;
      }
    },
    [fetchAll]
  );

  // Carregar ao montar
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    // Estado
    rewards,
    stats,
    loading,
    error,

    // Ações
    refetch: fetchAll,
    createReward,
    updateReward,
    deleteReward,
  };
};
