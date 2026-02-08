import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdAdd,
  MdViewList,
  MdViewModule,
  MdFilterList,
  MdEdit as MdSignature,
} from 'react-icons/md';
import styled, { keyframes } from 'styled-components';
import { Layout } from '../components/layout/Layout';
import { useDocuments } from '../hooks/useDocuments';
import { useDocumentPermissions } from '../hooks/useDocumentPermissions';
import { CreateDocumentUploadLinkModal } from '../components/documents/CreateDocumentUploadLinkModal';
import {
  DocumentFilters,
  type DocumentFilters as DocumentFiltersType,
} from '../components/documents/DocumentFilters';
import { DocumentsTable } from '../components/documents/DocumentsTable';
import { GroupedDocumentsView } from '../components/documents/GroupedDocumentsView';
import { BulkActions } from '../components/documents/BulkActions';
import { PermissionButton } from '../components/common/PermissionButton';
import { DocumentsShimmer } from '../components/shimmer/DocumentsShimmer';
import type { DocumentModel } from '../types/document';
import { deleteDocuments, approveDocument } from '../services/documentApi';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { toast } from 'react-toastify';
import {
  PageContainer,
  PageHeader,
  HeaderContent,
  PageTitle,
  PageSubtitle,
  HeaderActions,
  ViewModeToggle,
  ViewModeButton,
  FilterButton,
  FilterBadge,
} from '../styles/pages/DocumentsPageStyles';

type ViewMode = 'list' | 'grouped';

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { canApprove } = useDocumentPermissions();
  const {
    documents,
    groupedDocuments,
    loading,
    loadingMore,
    total,
    page,
    totalPages,
    fetchAll,
    loadMore,
  } = useDocuments();
  const isInitialLoad = useRef(true);

  // State for view mode
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // State for modals and drawers
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [showCreateLinkModal, setShowCreateLinkModal] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentModel | null>(null);

  // State for filters
  const [filters, setFilters] = useState<DocumentFiltersType>({
    search: '',
    type: '',
    status: '',
    tags: [],
    page: 1,
    limit: 20,
    onlyMyDocuments: false,
  });

  // State for bulk actions
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // State for confirmation modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] =
    useState<DocumentModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Helper function to convert filters to API format
  const getApiFilters = useCallback((currentFilters: DocumentFiltersType) => {
    return {
      ...currentFilters,
      type: currentFilters.type || undefined,
      status: currentFilters.status || undefined,
      tags:
        currentFilters.tags.length > 0
          ? currentFilters.tags.join(',')
          : undefined,
      onlyMyDocuments: currentFilters.onlyMyDocuments || undefined,
    };
  }, []);

  // Load documents when filters change
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      fetchAll(getApiFilters(filters));
    } else if (!loading) {
      fetchAll(getApiFilters(filters));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFiltersChange = useCallback((newFilters: DocumentFiltersType) => {
    setFilters(newFilters);
  }, []);

  // Calcular filtros ativos
  const hasActiveFilters =
    filters.search ||
    filters.type ||
    filters.status ||
    filters.tags.length > 0 ||
    filters.onlyMyDocuments;
  const activeFiltersCount = [
    filters.search,
    filters.type,
    filters.status,
    filters.tags.length > 0,
    filters.onlyMyDocuments,
  ].filter(Boolean).length;

  const handleDocumentAction = useCallback(
    async (action: string, document: DocumentModel) => {
      try {
        switch (action) {
          case 'download':
            if (document.fileUrl) {
              const link = window.document.createElement('a');
              link.href = document.fileUrl;
              link.download = document.originalName;
              link.target = '_blank';
              window.document.body.appendChild(link);
              link.click();
              window.document.body.removeChild(link);
            }
            break;

          case 'edit':
            navigate(`/documents/${document.id}/edit`);
            break;

          case 'view':
            navigate(`/documents/${document.id}`);
            break;

          case 'delete':
            setDocumentToDelete(document);
            setShowDeleteModal(true);
            break;

          case 'create_link':
            setSelectedDocument(document);
            setShowCreateLinkModal(true);
            break;

          case 'send_for_signature':
            navigate(`/documents/${document.id}/send-for-signature`);
            break;

          default:
            break;
        }
      } catch (error) {
        console.error('Erro ao executar ação:', error);
      }
    },
    [filters, fetchAll, getApiFilters]
  );

  const handleViewDocument = useCallback(
    (document: DocumentModel) => {
      navigate(`/documents/${document.id}`);
    },
    [navigate]
  );

  const handleEditDocument = useCallback(
    (document: DocumentModel) => {
      navigate(`/documents/${document.id}/edit`);
    },
    [navigate]
  );

  const handleDeleteDocument = useCallback((document: DocumentModel) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
  }, []);

  const confirmDeleteDocument = useCallback(async () => {
    if (!documentToDelete) return;

    setIsDeleting(true);
    try {
      await deleteDocuments([documentToDelete.id]);
      toast.success('Documento excluído com sucesso!');
      setShowDeleteModal(false);
      setDocumentToDelete(null);
      fetchAll(getApiFilters(filters));
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      toast.error('Erro ao excluir documento');
    } finally {
      setIsDeleting(false);
    }
  }, [documentToDelete, filters, fetchAll, getApiFilters]);

  // Bulk actions
  const handleBulkDelete = useCallback(async () => {
    if (selectedDocuments.length === 0) return;

    // Para operações em massa, usaremos o mesmo modal de confirmação
    // Vamos usar uma abordagem diferente: mostrar um toast de aviso e permitir desfazer
    const selectedDocs = documents.filter(d =>
      selectedDocuments.includes(d.id)
    );

    try {
      setBulkLoading(true);
      await deleteDocuments(selectedDocuments);
      toast.success(
        `${selectedDocuments.length} documento(s) excluído(s) com sucesso!`
      );
      setSelectedDocuments([]);
      fetchAll(getApiFilters(filters));
    } catch (error) {
      console.error('Erro ao excluir documentos:', error);
      toast.error('Erro ao excluir documentos');
    } finally {
      setBulkLoading(false);
    }
  }, [selectedDocuments, documents, filters, fetchAll, getApiFilters]);

  const handleBulkDownload = useCallback(async () => {
    if (selectedDocuments.length === 0) return;

    try {
      setBulkLoading(true);

      // Download each document individually
      let successCount = 0;
      for (const docId of selectedDocuments) {
        const doc = documents.find(d => d.id === docId);
        if (doc?.fileUrl) {
          const link = window.document.createElement('a');
          link.href = doc.fileUrl;
          link.download = doc.originalName;
          link.target = '_blank';
          window.document.body.appendChild(link);
          link.click();
          window.document.body.removeChild(link);
          successCount++;

          // Pequeno delay entre downloads para evitar bloqueio do navegador
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      toast.success(
        `Download iniciado! ${successCount} arquivo(s) estão sendo baixados.`
      );
    } catch (error) {
      console.error('Erro ao baixar documentos:', error);
      toast.error('Erro ao baixar documentos');
    } finally {
      setBulkLoading(false);
    }
  }, [selectedDocuments, documents]);

  const handleBulkApprove = useCallback(async () => {
    if (selectedDocuments.length === 0) return;

    try {
      setBulkLoading(true);
      await Promise.all(
        selectedDocuments.map(id => approveDocument(id, 'approved'))
      );
      toast.success(
        `${selectedDocuments.length} documento(s) aprovado(s) com sucesso!`
      );
      setSelectedDocuments([]);
      fetchAll(getApiFilters(filters));
    } catch (error) {
      console.error('Erro ao aprovar documentos:', error);
      toast.error('Erro ao aprovar documentos');
    } finally {
      setBulkLoading(false);
    }
  }, [selectedDocuments, filters, fetchAll, getApiFilters]);

  const handleBulkReject = useCallback(async () => {
    if (selectedDocuments.length === 0) return;

    try {
      setBulkLoading(true);
      await Promise.all(
        selectedDocuments.map(id => approveDocument(id, 'rejected'))
      );
      toast.success(
        `${selectedDocuments.length} documento(s) rejeitado(s) com sucesso!`
      );
      setSelectedDocuments([]);
      fetchAll(getApiFilters(filters));
    } catch (error) {
      console.error('Erro ao rejeitar documentos:', error);
      toast.error('Erro ao rejeitar documentos');
    } finally {
      setBulkLoading(false);
    }
  }, [selectedDocuments, filters, fetchAll, getApiFilters]);

  const handleClearSelection = useCallback(() => {
    setSelectedDocuments([]);
  }, []);

  // Show shimmer loading if initial load
  if (loading && documents.length === 0) {
    return (
      <Layout>
        <DocumentsShimmer />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <HeaderContent>
            <PageTitle>Documentos</PageTitle>
            <PageSubtitle>
              Gerencie e organize todos os documentos da sua imobiliária
            </PageSubtitle>
          </HeaderContent>
          <HeaderActions>
            {/* View Mode Toggle */}
            <ViewModeToggle>
              <ViewModeButton
                $active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
                title='Visualização em Lista'
              >
                <MdViewList size={20} />
                Lista
              </ViewModeButton>
              <ViewModeButton
                $active={viewMode === 'grouped'}
                onClick={() => setViewMode('grouped')}
                title='Visualização Agrupada'
              >
                <MdViewModule size={20} />
                Agrupado
              </ViewModeButton>
            </ViewModeToggle>

            <FilterButton onClick={() => setShowFiltersDrawer(true)}>
              <MdFilterList size={20} />
              Filtros
              {hasActiveFilters && (
                <FilterBadge>{activeFiltersCount}</FilterBadge>
              )}
            </FilterButton>

            <PermissionButton
              permission='document:read'
              onClick={() => navigate('/documents/signatures')}
              variant='secondary'
              size='medium'
            >
              <MdSignature size={20} />
              Assinaturas
            </PermissionButton>

            <PermissionButton
              permission='document:create'
              onClick={() => navigate('/documents/create')}
            >
              <MdAdd size={20} />
              Upload
            </PermissionButton>
          </HeaderActions>
        </PageHeader>

        {/* Filtros Drawer */}
        <DocumentFilters
          isOpen={showFiltersDrawer}
          onClose={() => setShowFiltersDrawer(false)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          loading={loading}
        />

        {/* Documentos - Lista ou Agrupado */}
        {viewMode === 'list' ? (
          <>
            <DocumentsTable
              documents={documents}
              loading={loading}
              silentLoading={loading}
              onSelectionChange={setSelectedDocuments}
              onDocumentAction={handleDocumentAction}
              onViewDocument={handleViewDocument}
              onEditDocument={handleEditDocument}
              onDeleteDocument={handleDeleteDocument}
              onSendForSignature={doc => {
                navigate(`/documents/${doc.id}/send-for-signature`);
              }}
            />

            {/* Botão Carregar Mais */}
            {documents.length > 0 &&
              (page < totalPages ||
                (total > documents.length && totalPages === 1)) && (
                <LoadMoreContainer>
                  <LoadMoreButton
                    onClick={async () => {
                      await loadMore(getApiFilters(filters));
                    }}
                    disabled={loadingMore || loading}
                    $loading={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <LoadingSpinner />
                        Carregando...
                      </>
                    ) : (
                      `Carregar mais (${total > documents.length ? total - documents.length : 'mais'} restantes)`
                    )}
                  </LoadMoreButton>
                </LoadMoreContainer>
              )}
          </>
        ) : (
          <GroupedDocumentsView
            groupedDocuments={groupedDocuments}
            loading={loading}
            silentLoading={loading}
            onDocumentAction={handleDocumentAction}
            onViewDocument={handleViewDocument}
            onEditDocument={handleEditDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        )}

        {/* Ações em Massa */}
        <BulkActions
          selectedCount={selectedDocuments.length}
          onDelete={handleBulkDelete}
          onDownload={handleBulkDownload}
          onApprove={canApprove ? handleBulkApprove : undefined}
          onReject={canApprove ? handleBulkReject : undefined}
          onClearSelection={handleClearSelection}
          loading={bulkLoading}
        />

        {/* Modals e Drawers */}
        {showCreateLinkModal && (
          <CreateDocumentUploadLinkModal
            isOpen={showCreateLinkModal}
            onClose={() => setShowCreateLinkModal(false)}
            document={selectedDocument}
          />
        )}

        {/* Modal de Confirmação de Exclusão */}
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDocumentToDelete(null);
          }}
          onConfirm={confirmDeleteDocument}
          title='Excluir Documento'
          message='Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.'
          itemName={documentToDelete?.title || documentToDelete?.originalName}
          isLoading={isDeleting}
        />
      </PageContainer>
    </Layout>
  );
};

export default DocumentsPage;

// Styled Components para Carregar Mais
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  margin-top: 16px;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const LoadMoreButton = styled.button<{ $loading?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => (props.$loading ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.$loading ? 0.7 : 1)};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => props.theme.colors.primary}30;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}50;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    padding: 14px 20px;
    font-size: 13px;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;
