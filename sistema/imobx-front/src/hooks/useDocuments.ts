import { useState, useCallback } from 'react';
import type {
  DocumentModel,
  DocumentWithDetails,
  UploadDocumentDto,
  UpdateDocumentDto,
  ListDocumentsParams,
  DocumentListResponse,
  GroupedDocuments,
} from '../types/document';
import {
  uploadDocument,
  listDocuments,
  fetchClientDocuments,
  fetchPropertyDocuments,
  fetchExpiringDocuments,
  fetchDocumentById,
  updateDocument,
  approveDocument,
  deleteDocuments,
  handleDocumentError,
} from '../services/documentApi';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<DocumentModel[]>([]);
  const [groupedDocuments, setGroupedDocuments] = useState<GroupedDocuments[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleError = useCallback((err: any) => {
    const errorMessage = handleDocumentError(err);
    setError(errorMessage);
    return errorMessage;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const upload = useCallback(
    async (data: UploadDocumentDto): Promise<DocumentModel | null> => {
      setLoading(true);
      setError(null);
      try {
        const document = await uploadDocument(data);
        setDocuments(prev => [document, ...prev]);
        return document;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const fetchAll = useCallback(
    async (params: ListDocumentsParams = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response: DocumentListResponse = await listDocuments(params);

        // Combinar documentos não agrupados com os agrupados em um array único
        const ungroupedDocs = response.documents || [];
        const groupedDocs = response.groupedDocuments || [];

        // Extrair todos os documentos dos grupos
        const docsFromGroups = groupedDocs.flatMap(group =>
          group.documents.map(doc => ({
            ...doc,
            // Adicionar informações da entidade ao documento
            _groupEntity: group.entity,
            _groupEntityType: group.entityType,
          }))
        );

        // Combinar todos os documentos
        const allDocuments = [...ungroupedDocs, ...docsFromGroups];

        setDocuments(allDocuments);
        setGroupedDocuments(groupedDocs);
        setTotal(response.total);
        setPage(response.page);
        setTotalPages(response.totalPages || 1);
        return response;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const loadMore = useCallback(
    async (params: ListDocumentsParams = {}) => {
      const nextPage = (params.page || page) + 1;

      // Verificar se há mais páginas
      if (nextPage > totalPages) {
        return;
      }

      setLoadingMore(true);
      setError(null);
      try {
        const response: DocumentListResponse = await listDocuments({
          ...params,
          page: nextPage,
        });

        // Combinar documentos não agrupados com os agrupados em um array único
        const ungroupedDocs = response.documents || [];
        const groupedDocs = response.groupedDocuments || [];

        // Extrair todos os documentos dos grupos
        const docsFromGroups = groupedDocs.flatMap(group =>
          group.documents.map(doc => ({
            ...doc,
            // Adicionar informações da entidade ao documento
            _groupEntity: group.entity,
            _groupEntityType: group.entityType,
          }))
        );

        // Combinar todos os documentos (APPEND ao invés de substituir)
        const newDocuments = [...ungroupedDocs, ...docsFromGroups];

        setDocuments(prev => [...prev, ...newDocuments]);
        setGroupedDocuments(prev => {
          // Mesclar grupos existentes com novos
          const existingGroups = new Map(prev.map(g => [g.entity.id, g]));
          groupedDocs.forEach(newGroup => {
            const existing = existingGroups.get(newGroup.entity.id);
            if (existing) {
              existing.documents.push(...newGroup.documents);
            } else {
              existingGroups.set(newGroup.entity.id, newGroup);
            }
          });
          return Array.from(existingGroups.values());
        });
        setTotal(response.total);
        setPage(nextPage);
        setTotalPages(response.totalPages || 1);
        return response;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoadingMore(false);
      }
    },
    [page, totalPages, handleError]
  );

  const fetchByClient = useCallback(
    async (clientId: string, page = 1, limit = 20) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchClientDocuments(clientId, page, limit);
        setDocuments(response.documents);
        setTotal(response.total);
        setPage(response.page);
        setTotalPages(response.totalPages);
        return response;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const fetchByProperty = useCallback(
    async (propertyId: string, page = 1, limit = 20) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchPropertyDocuments(propertyId, page, limit);
        setDocuments(response.documents);
        setTotal(response.total);
        setPage(response.page);
        setTotalPages(response.totalPages);
        return response;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const fetchExpiring = useCallback(
    async (days = 30) => {
      setLoading(true);
      setError(null);
      try {
        const docs = await fetchExpiringDocuments(days);
        setDocuments(docs);
        return docs;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const fetchById = useCallback(
    async (id: string): Promise<DocumentWithDetails | null> => {
      setLoading(true);
      setError(null);
      try {
        const document = await fetchDocumentById(id);
        return document;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const update = useCallback(
    async (id: string, data: UpdateDocumentDto) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await updateDocument(id, data);
        setDocuments(prev => prev.map(doc => (doc.id === id ? updated : doc)));
        return updated;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const approve = useCallback(
    async (id: string, status: 'approved' | 'rejected') => {
      setLoading(true);
      setError(null);
      try {
        const updated = await approveDocument(id, status);
        setDocuments(prev => prev.map(doc => (doc.id === id ? updated : doc)));
        return updated;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const remove = useCallback(
    async (documentIds: string[]) => {
      setLoading(true);
      setError(null);
      try {
        await deleteDocuments(documentIds);
        setDocuments(prev => prev.filter(doc => !documentIds.includes(doc.id)));
        return true;
      } catch (err) {
        handleError(err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  return {
    documents,
    groupedDocuments,
    loading,
    loadingMore,
    error,
    total,
    page,
    totalPages,
    upload,
    fetchAll,
    loadMore,
    fetchByClient,
    fetchByProperty,
    fetchExpiring,
    fetchById,
    update,
    approve,
    remove,
    clearError,
  };
};
