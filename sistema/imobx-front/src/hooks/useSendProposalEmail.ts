import { useState } from 'react';
import {
  aiAssistantApi,
  type SendProposalEmailRequest,
  type SendProposalEmailResponse,
} from '../services/aiAssistantApi';
import { useRetry } from './useRetry';

export function useSendProposalEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { executeWithRetry, canRetry } = useRetry();

  const sendEmail = async (
    data: SendProposalEmailRequest
  ): Promise<SendProposalEmailResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeWithRetry(async () => {
        return await aiAssistantApi.sendProposalEmail(data);
      });
      if (!result) return null;
      return result as SendProposalEmailResponse;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao enviar proposta por email';
      let friendly = message;
      const status = err?.response?.status;
      if (status === 400) {
        if (/email/i.test(message)) {
          friendly =
            'Cliente sem email cadastrado. Informe um email ou cadastre no perfil do cliente.';
        } else {
          friendly = 'Dados inválidos. Verifique propriedade/cliente.';
        }
      } else if (status === 403)
        friendly = 'Módulo AI Assistant não está ativo no seu plano.';
      else if (status === 429)
        friendly = 'Muitas requisições. Aguarde e tente novamente.';
      setError(friendly);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendEmail, loading, error, canRetry };
}
