import { useState, useEffect, useCallback } from 'react';
import { documentSignatureApi } from '../services/documentSignatureApi';
import { useNotifications } from './useNotifications';
import { useCompany } from './useCompany';
import type {
  DocumentSignature,
  CreateSignatureDto,
  SignatureStats,
} from '../types/documentSignature';

interface UseDocumentSignaturesReturn {
  signatures: DocumentSignature[];
  stats: SignatureStats | null;
  loading: boolean;
  error: string | null;
  createSignature: (
    data: CreateSignatureDto
  ) => Promise<DocumentSignature | null>;
  loadSignatures: () => Promise<void>;
  refreshSignatures: () => Promise<void>;
  sendEmail: (signatureId: string) => Promise<void>;
  resendEmail: (signatureId: string) => Promise<void>;
  markAsViewed: (signatureId: string) => Promise<void>;
  markAsSigned: (signatureId: string) => Promise<void>;
  markAsRejected: (signatureId: string, reason: string) => Promise<void>;
}

export const useDocumentSignatures = (
  documentId?: string
): UseDocumentSignaturesReturn => {
  const { selectedCompany } = useCompany();
  const { notifications } = useNotifications();
  const [signatures, setSignatures] = useState<DocumentSignature[]>([]);
  const [stats, setStats] = useState<SignatureStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar assinaturas
  const loadSignatures = useCallback(async () => {
    if (!documentId || !selectedCompany?.id) return;

    setLoading(true);
    setError(null);
    try {
      const [signaturesData, statsData] = await Promise.all([
        documentSignatureApi.listSignatures(documentId, selectedCompany.id),
        documentSignatureApi.getStats(documentId, selectedCompany.id),
      ]);
      setSignatures(signaturesData);
      setStats(statsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao carregar assinaturas'
      );
    } finally {
      setLoading(false);
    }
  }, [documentId, selectedCompany?.id]);

  // Escutar notificações de assinatura
  useEffect(() => {
    if (!notifications || !documentId) return;

    const signatureNotifications = notifications.filter(
      n =>
        (n.type === 'document_signed' || n.type === 'document_rejected') &&
        n.metadata?.documentId === documentId
    );

    if (signatureNotifications.length > 0) {
      // Recarregar assinaturas quando notificação chegar
      loadSignatures();
    }
  }, [notifications, documentId, loadSignatures]);

  // Carregar ao montar ou quando documentId/companyId mudar
  useEffect(() => {
    loadSignatures();
  }, [loadSignatures]);

  // Criar assinatura
  const createSignature = useCallback(
    async (data: CreateSignatureDto): Promise<DocumentSignature | null> => {
      if (!documentId || !selectedCompany?.id) {
        setError('Documento ou empresa não encontrado');
        return null;
      }

      setLoading(true);
      setError(null);
      try {
        const signature = await documentSignatureApi.createSignature(
          documentId,
          data,
          selectedCompany.id
        );
        // Recarregar lista após criar
        await loadSignatures();
        return signature;
      } catch (err: any) {
        // O backend agora valida assinaturas válidas (não expiradas, não canceladas)
        // Se houver erro, mostrar a mensagem do backend
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'Erro ao criar assinatura';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [documentId, selectedCompany?.id, loadSignatures]
  );

  // Enviar email
  const sendEmail = useCallback(
    async (signatureId: string): Promise<void> => {
      if (!documentId || !selectedCompany?.id) return;

      try {
        await documentSignatureApi.sendSignatureEmail(
          documentId,
          signatureId,
          selectedCompany.id
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao enviar email');
        throw err;
      }
    },
    [documentId, selectedCompany?.id]
  );

  // Reenviar email (reutiliza URL existente)
  const resendEmail = useCallback(
    async (signatureId: string): Promise<void> => {
      if (!documentId || !selectedCompany?.id) return;

      try {
        await documentSignatureApi.resendSignatureEmail(
          documentId,
          signatureId,
          selectedCompany.id
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao reenviar email');
        throw err;
      }
    },
    [documentId, selectedCompany?.id]
  );

  // Marcar como visualizada
  const markAsViewed = useCallback(
    async (signatureId: string): Promise<void> => {
      if (!documentId || !selectedCompany?.id) return;

      try {
        await documentSignatureApi.markAsViewed(
          documentId,
          signatureId,
          selectedCompany.id
        );
        await loadSignatures();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao marcar como visualizada'
        );
        throw err;
      }
    },
    [documentId, selectedCompany?.id, loadSignatures]
  );

  // Marcar como assinada
  const markAsSigned = useCallback(
    async (signatureId: string): Promise<void> => {
      if (!documentId || !selectedCompany?.id) return;

      try {
        await documentSignatureApi.markAsSigned(
          documentId,
          signatureId,
          selectedCompany.id
        );
        await loadSignatures();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao marcar como assinada'
        );
        throw err;
      }
    },
    [documentId, selectedCompany?.id, loadSignatures]
  );

  // Marcar como rejeitada
  const markAsRejected = useCallback(
    async (signatureId: string, reason: string): Promise<void> => {
      if (!documentId || !selectedCompany?.id) return;

      try {
        await documentSignatureApi.markAsRejected(
          documentId,
          signatureId,
          selectedCompany.id,
          reason
        );
        await loadSignatures();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao marcar como rejeitada'
        );
        throw err;
      }
    },
    [documentId, selectedCompany?.id, loadSignatures]
  );

  return {
    signatures,
    stats,
    loading,
    error,
    createSignature,
    loadSignatures,
    refreshSignatures: loadSignatures,
    sendEmail,
    markAsViewed,
    markAsSigned,
    markAsRejected,
  };
};
