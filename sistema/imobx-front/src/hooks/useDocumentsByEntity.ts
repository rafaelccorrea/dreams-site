import { useState, useEffect, useCallback } from 'react';
import { listDocuments, deleteDocuments } from '../services/documentApi';
import type { DocumentModel } from '../types/document';

interface UseDocumentsByEntityProps {
  entityId: string;
  entityType: 'client' | 'property';
  enabled?: boolean;
}

interface UseDocumentsByEntityReturn {
  documents: DocumentModel[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  loadDocuments: (page?: number) => Promise<void>;
  refreshDocuments: () => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
  deleteDocuments: (documentIds: string[]) => Promise<void>;
}

export const useDocumentsByEntity = ({
  entityId,
  entityType,
  enabled = true,
}: UseDocumentsByEntityProps): UseDocumentsByEntityReturn => {
  const [documents, setDocuments] = useState<DocumentModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const loadDocuments = useCallback(
    async (pageNumber = 1) => {
      if (!entityId || !enabled) return;

      setLoading(true);
      setError(null);

      try {
        const params = {
          page: pageNumber,
          limit,
          ...(entityType === 'client'
            ? { clientId: entityId }
            : { propertyId: entityId }),
        };

        const response = await listDocuments(params);

        setDocuments(response.documents || []);
        setTotal(response.total || 0);
        setPage(pageNumber);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar documentos'
        );
        console.error('Erro ao carregar documentos:', err);
      } finally {
        setLoading(false);
      }
    },
    [entityId, entityType, limit, enabled]
  );

  const refreshDocuments = useCallback(async () => {
    await loadDocuments(page);
  }, [loadDocuments, page]);

  const deleteDocument = useCallback(async (documentId: string) => {
    try {
      await deleteDocuments([documentId]);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      setTotal(prev => prev - 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao excluir documento'
      );
      throw err;
    }
  }, []);

  const deleteDocuments = useCallback(async (documentIds: string[]) => {
    try {
      await deleteDocuments(documentIds);
      setDocuments(prev => prev.filter(doc => !documentIds.includes(doc.id)));
      setTotal(prev => prev - documentIds.length);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao excluir documentos'
      );
      throw err;
    }
  }, []);

  useEffect(() => {
    if (entityId && enabled) {
      loadDocuments(1);
    }
  }, [entityId, enabled, loadDocuments]);

  return {
    documents,
    loading,
    error,
    total,
    page,
    limit,
    loadDocuments,
    refreshDocuments,
    deleteDocument,
    deleteDocuments,
  };
};
