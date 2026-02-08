import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdAdd,
  MdDownload,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdFilePresent,
  MdAccessTime,
  MdCheckCircle,
  MdCancel,
} from 'react-icons/md';
import { useDocumentsByEntity } from '../../hooks/useDocumentsByEntity';
import { useDocumentPermissions } from '../../hooks/useDocumentPermissions';
import { PermissionButton } from '../common/PermissionButton';
import { Tooltip } from '../ui/Tooltip';
import {
  DocumentTypeLabels,
  DocumentStatusLabels,
  StatusColors,
} from '../../types/document';
import { formatFileSize } from '../../utils/format';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import { toast } from 'react-toastify';

interface EntityDocumentsListProps {
  entityId: string;
  entityType: 'client' | 'property';
  entityName: string;
}

export const EntityDocumentsList: React.FC<EntityDocumentsListProps> = ({
  entityId,
  entityType,
  entityName,
}) => {
  const navigate = useNavigate();
  const {
    documents,
    loading,
    error,
    total,
    loadDocuments,
    refreshDocuments,
    deleteDocument,
  } = useDocumentsByEntity({
    entityId,
    entityType,
  });

  const { canCreate, canUpdate, canDelete, canDownload } =
    useDocumentPermissions();

  // Estados dos modais
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (documentId: string, documentName: string) => {
    setDocumentToDelete({ id: documentId, name: documentName });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;

    setIsDeleting(true);
    try {
      await deleteDocument(documentToDelete.id);
      toast.success('Documento excluído com sucesso!');
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      toast.error('Erro ao excluir documento');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = (documentUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <MdCheckCircle color='#10b981' />;
      case 'rejected':
        return <MdCancel color='#ef4444' />;
      case 'pending_review':
        return <MdAccessTime color='#f59e0b' />;
      default:
        return <MdFilePresent color='#6b7280' />;
    }
  };

  if (loading && documents.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Documentos de {entityName}</Title>
        </Header>
        <LoadingContainer>
          <LoadingMessage>Carregando documentos...</LoadingMessage>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>Documentos de {entityName}</Title>
        </Header>
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={() => refreshDocuments()}>
            Tentar Novamente
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Documentos de {entityName}</Title>
      </Header>

      {documents.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <MdFilePresent size={48} />
          </EmptyIcon>
          <EmptyTitle>Nenhum documento encontrado</EmptyTitle>
          <EmptyDescription>
            Este {entityType === 'client' ? 'cliente' : 'propriedade'} ainda não
            possui documentos.
          </EmptyDescription>
          {canCreate && (
            <PermissionButton
              permission='document:create'
              onClick={() => {
                const params = new URLSearchParams();
                if (entityType === 'client') {
                  params.set('clientId', entityId);
                } else {
                  params.set('propertyId', entityId);
                }
                navigate(`/documents/create?${params.toString()}`);
              }}
            >
              <MdAdd size={16} />
              Adicionar Primeiro Documento
            </PermissionButton>
          )}
        </EmptyState>
      ) : (
        <>
          <DocumentsGrid>
            {documents.map(document => (
              <DocumentCard key={document.id}>
                <DocumentHeader>
                  <DocumentIcon>
                    <MdFilePresent size={24} />
                  </DocumentIcon>
                  <DocumentStatus>
                    {getStatusIcon(document.status)}
                  </DocumentStatus>
                </DocumentHeader>

                <DocumentContent>
                  <DocumentTitle>
                    {document.title || document.originalName}
                  </DocumentTitle>
                  <DocumentMeta>
                    <MetaItem>
                      <strong>Tipo:</strong> {DocumentTypeLabels[document.type]}
                    </MetaItem>
                    <MetaItem>
                      <strong>Tamanho:</strong>{' '}
                      {formatFileSize(document.fileSize)}
                    </MetaItem>
                    <MetaItem>
                      <strong>Status:</strong>
                      <StatusBadge status={document.status}>
                        {DocumentStatusLabels[document.status]}
                      </StatusBadge>
                    </MetaItem>
                    {document.expiryDate && (
                      <MetaItem>
                        <strong>Vencimento:</strong>
                        {new Date(document.expiryDate).toLocaleDateString(
                          'pt-BR'
                        )}
                      </MetaItem>
                    )}
                  </DocumentMeta>

                  {document.description && (
                    <DocumentDescription>
                      {document.description}
                    </DocumentDescription>
                  )}
                </DocumentContent>

                <DocumentActions>
                  <ActionButton
                    onClick={() => navigate(`/documents/${document.id}`)}
                    title='Visualizar'
                  >
                    <MdVisibility size={16} />
                  </ActionButton>

                  {canDownload ? (
                    <ActionButton
                      onClick={() =>
                        handleDownload(document.fileUrl, document.originalName)
                      }
                      title='Download'
                    >
                      <MdDownload size={16} />
                    </ActionButton>
                  ) : (
                    <Tooltip content='Você não tem permissão para fazer download de documentos'>
                      <ActionButton
                        disabled
                        title='Você não tem permissão para fazer download'
                      >
                        <MdDownload size={16} />
                      </ActionButton>
                    </Tooltip>
                  )}

                  {canUpdate ? (
                    <ActionButton
                      onClick={() => navigate(`/documents/${document.id}/edit`)}
                      title='Editar'
                    >
                      <MdEdit size={16} />
                    </ActionButton>
                  ) : (
                    <Tooltip content='Você não tem permissão para editar documentos'>
                      <ActionButton
                        disabled
                        title='Você não tem permissão para editar'
                      >
                        <MdEdit size={16} />
                      </ActionButton>
                    </Tooltip>
                  )}

                  {canDelete ? (
                    <ActionButton
                      onClick={() =>
                        handleDelete(
                          document.id,
                          document.title || document.originalName
                        )
                      }
                      title='Excluir'
                      danger
                    >
                      <MdDelete size={16} />
                    </ActionButton>
                  ) : (
                    <Tooltip content='Você não tem permissão para excluir documentos'>
                      <ActionButton
                        disabled
                        danger
                        title='Você não tem permissão para excluir'
                      >
                        <MdDelete size={16} />
                      </ActionButton>
                    </Tooltip>
                  )}
                </DocumentActions>
              </DocumentCard>
            ))}
          </DocumentsGrid>

          {/* Botão de adicionar - só aparece quando há mais de 1 documento */}
          {documents.length > 1 && canCreate && (
            <AddButtonContainer>
              <PermissionButton
                permission='document:create'
                onClick={() => {
                  const params = new URLSearchParams();
                  if (entityType === 'client') {
                    params.set('clientId', entityId);
                  } else {
                    params.set('propertyId', entityId);
                  }
                  navigate(`/documents/create?${params.toString()}`);
                }}
                size='medium'
                style={{ width: '100%', maxWidth: '300px' }}
              >
                <MdAdd size={18} />
                Adicionar Documento
              </PermissionButton>
            </AddButtonContainer>
          )}
        </>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDocumentToDelete(null);
        }}
        onConfirm={confirmDelete}
        title='Excluir Documento'
        message='Tem certeza que deseja excluir este documento?'
        itemName={documentToDelete?.name}
        isLoading={isDeleting}
      />
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const AddButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const LoadingMessage = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background-color: ${({ theme }) => `${theme.colors.error}15`};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => `${theme.colors.error}30`};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  text-align: center;
`;

const RetryButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primaryDark || theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 2rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.5;
`;

const EmptyTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  max-width: 300px;
`;

const DocumentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const DocumentCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const DocumentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const DocumentIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
`;

const DocumentStatus = styled.div`
  display: flex;
  align-items: center;
`;

const DocumentContent = styled.div`
  margin-bottom: 1rem;
`;

const DocumentTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const DocumentMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

const MetaItem = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.25rem;

  strong {
    font-weight: 500;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.125rem 0.375rem;
  border-radius: 12px;
  font-size: 0.625rem;
  font-weight: 500;
  background-color: ${({ status }) => {
    const statusKey = status as keyof typeof StatusColors;
    return StatusColors[statusKey]?.background || '#f3f4f6';
  }};
  color: ${({ status }) => {
    const statusKey = status as keyof typeof StatusColors;
    return StatusColors[statusKey]?.color || '#374151';
  }};
  margin-left: 0.25rem;
`;

const DocumentDescription = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const DocumentActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme, danger }) =>
    danger ? `${theme.colors.error}15` : `${theme.colors.textSecondary}15`};
  color: ${({ theme, danger }) =>
    danger ? theme.colors.error : theme.colors.textSecondary};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme, danger }) =>
      danger ? `${theme.colors.error}25` : `${theme.colors.textSecondary}25`};
    color: ${({ theme, danger }) =>
      danger ? theme.colors.error : theme.colors.text};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
