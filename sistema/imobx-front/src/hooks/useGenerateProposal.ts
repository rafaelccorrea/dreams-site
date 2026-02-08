import { useState } from 'react';
import {
  aiAssistantApi,
  type GenerateProposalRequest,
  type GenerateProposalResponse,
} from '../services/aiAssistantApi';
import { useRetry } from './useRetry';
import { toast } from 'react-toastify';

export function useGenerateProposal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { executeWithRetry, canRetry } = useRetry();

  const generate = async (
    data: GenerateProposalRequest
  ): Promise<GenerateProposalResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await executeWithRetry(async () => {
        return await aiAssistantApi.generateProposal(data);
      });

      if (!result) {
        throw new Error('Resposta vazia da API');
      }

      // Verificar se a resposta está vazia
      if (!result.proposalHtml && !result.proposalText) {
        throw new Error('A proposta gerada está vazia. Tente novamente.');
      }

      return result;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao gerar proposta';

      // Mensagens amigáveis para erros específicos
      let friendlyMessage = errorMessage;
      if (err?.response?.status === 400) {
        if (errorMessage.includes('limite') || errorMessage.includes('limit')) {
          friendlyMessage =
            'Limite diário de gerações atingido. Tente novamente amanhã.';
        } else {
          friendlyMessage =
            'Dados inválidos. Verifique se a propriedade e o cliente existem.';
        }
      } else if (err?.response?.status === 429) {
        friendlyMessage =
          'Muitas requisições. Aguarde alguns instantes e tente novamente.';
      } else if (err?.response?.status === 404) {
        friendlyMessage = 'Propriedade ou cliente não encontrado.';
      } else if (err?.response?.status === 403) {
        friendlyMessage = 'Módulo AI Assistant não está ativo no seu plano.';
      }

      setError(friendlyMessage);
      toast.error(friendlyMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error, canRetry };
}
