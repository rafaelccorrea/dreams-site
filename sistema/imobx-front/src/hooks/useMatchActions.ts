/**
 * Hook para ações de matches (aceitar, ignorar)
 */

import { useState } from 'react';
import { toast } from 'react-toastify';
import { matchApi } from '../services/matchApi';
import type { IgnoreReason } from '../types/match';

export function useMatchActions() {
  const [processing, setProcessing] = useState(false);

  const acceptMatch = async (matchId: string) => {
    setProcessing(true);
    try {
      const response = await matchApi.acceptMatch(matchId);

      toast.success('🎉 Match aceito!', {
        autoClose: 3000,
      });

      // Mostrar informação adicional
      setTimeout(() => {
        toast.info('✅ Task e nota criadas automaticamente no seu workspace', {
          autoClose: 5000,
        });
      }, 500);

      return { success: true, data: response };
    } catch (error) {
      console.error('Erro ao aceitar match:', error);
      toast.error('Erro ao aceitar match. Tente novamente.');
      return { success: false, error };
    } finally {
      setProcessing(false);
    }
  };

  const ignoreMatch = async (
    matchId: string,
    reason: IgnoreReason,
    notes?: string
  ) => {
    setProcessing(true);
    try {
      await matchApi.ignoreMatch(matchId, { reason, notes });

      toast.info('Match ignorado', {
        autoClose: 2000,
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao ignorar match:', error);
      toast.error('Erro ao ignorar match. Tente novamente.');
      return { success: false, error };
    } finally {
      setProcessing(false);
    }
  };

  return {
    acceptMatch,
    ignoreMatch,
    processing,
  };
}
