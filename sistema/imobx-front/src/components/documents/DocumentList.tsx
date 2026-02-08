import React, { useState } from 'react';
import styled from 'styled-components';
import type { DocumentModel } from '../../types/document';
import {
  DocumentStatusLabels,
  DocumentTypeLabels,
  StatusColors,
} from '../../types/document';
import { useDocumentPermissions } from '../../hooks/useDocumentPermissions';
import { PermissionButton } from '../common/PermissionButton';
import { Tooltip } from '../ui/Tooltip';

interface DocumentListProps {
  documents: DocumentModel[];
  loading?: boolean;
  onDelete?: (documentIds: string[]) => void;
  onApprove?: (id: string, status: 'approved' | 'rejected') => void;
  onUpdate?: (id: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  loading = false,
  onDelete,
  onApprove,
  onUpdate,
}) => {
  const { canDelete, canApprove, canUpdate, canDownload } =
    useDocumentPermissions();
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedDocs.length === documents.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documents.map(doc => doc.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedDocs.includes(id)) {
      setSelectedDocs(selectedDocs.filter(docId => docId !== id));
    } else {
      setSelectedDocs([...selectedDocs, id]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedDocs.length === 0) return;

    if (
      window.confirm(
        `Deseja realmente excluir ${selectedDocs.length} documento(s)?`
      )
    ) {
      onDelete?.(selectedDocs);
      setSelectedDocs([]);
    }
  };

  const handleDeleteSingle = (id: string) => {
    if (window.confirm('Deseja realmente excluir este documento?')) {
      onDelete?.([id]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const isExpiring = (expiryDate?: Date | string): boolean => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffDays = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate?: Date | string): boolean => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  if (loading) {
    return <LoadingMessage>Carregando documentos...</LoadingMessage>;
  }

  if (documents.length === 0) {
    return <EmptyMessage>Nenhum documento encontrado.</EmptyMessage>;
  }

  return (
    <Container>
      {selectedDocs.length > 0 && (
        <BulkActions>
          <BulkText>{selectedDocs.length} documento(s) selecionado(s)</BulkText>
          {canDelete ? (
            <BulkButton onClick={handleDeleteSelected}>
              Excluir Selecionados
            </BulkButton>
          ) : (
            <Tooltip content='Você não tem permissão para excluir documentos'>
              <BulkButton disabled>Excluir Selecionados</BulkButton>
            </Tooltip>
          )}
        </BulkActions>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader style={{ width: '40px' }}>
              <Checkbox
                type='checkbox'
                checked={selectedDocs.length === documents.length}
                onChange={handleSelectAll}
                disabled={!canDelete}
                title={
                  canDelete
                    ? 'Selecionar todos'
                    : 'Você não tem permissão para excluir documentos'
                }
              />
            </TableHeader>
            <TableHeader>Nome</TableHeader>
            <TableHeader>Tipo</TableHeader>
            <TableHeader>Tamanho</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Vencimento</TableHeader>
            <TableHeader>Data Upload</TableHeader>
            <TableHeader style={{ width: '200px' }}>Ações</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map(doc => (
            <TableRow key={doc.id}>
              <TableCell>
                <Checkbox
                  type='checkbox'
                  checked={selectedDocs.includes(doc.id)}
                  onChange={() => handleSelect(doc.id)}
                  disabled={!canDelete}
                  title={
                    canDelete
                      ? 'Selecionar'
                      : 'Você não tem permissão para excluir documentos'
                  }
                />
              </TableCell>
              <TableCell>
                <DocumentName>
                  <FileIcon>{getFileIcon(doc.fileExtension)}</FileIcon>
                  <div>
                    <DocumentTitle>
                      {doc.title || doc.originalName}
                    </DocumentTitle>
                    {doc.description && (
                      <DocumentDesc>{doc.description}</DocumentDesc>
                    )}
                  </div>
                </DocumentName>
              </TableCell>
              <TableCell>
                <TypeBadge>
                  {DocumentTypeLabels[doc.type] || 'Desconhecido'}
                </TypeBadge>
              </TableCell>
              <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
              <TableCell>
                <StatusBadge
                  $color={StatusColors[doc.status]?.background || '#6b7280'}
                >
                  {DocumentStatusLabels[doc.status] || 'Desconhecido'}
                </StatusBadge>
              </TableCell>
              <TableCell>
                {doc.expiryDate ? (
                  <ExpiryDate
                    $expired={isExpired(doc.expiryDate)}
                    $expiring={isExpiring(doc.expiryDate)}
                  >
                    {formatDate(doc.expiryDate)}
                    {isExpired(doc.expiryDate) && ' ⚠️'}
                    {isExpiring(doc.expiryDate) && ' 🔔'}
                  </ExpiryDate>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>{formatDate(doc.createdAt)}</TableCell>
              <TableCell>
                <Actions>
                  {canDownload ? (
                    <ActionButton
                      onClick={() => window.open(doc.fileUrl, '_blank')}
                      title='Download'
                    >
                      📥
                    </ActionButton>
                  ) : (
                    <Tooltip content='Você não tem permissão para fazer download de documentos'>
                      <ActionButton
                        disabled
                        title='Você não tem permissão para fazer download'
                      >
                        📥
                      </ActionButton>
                    </Tooltip>
                  )}
                  {canUpdate ? (
                    <ActionButton
                      onClick={() => onUpdate?.(doc.id)}
                      title='Editar'
                    >
                      ✏️
                    </ActionButton>
                  ) : (
                    <Tooltip content='Você não tem permissão para editar documentos'>
                      <ActionButton
                        disabled
                        title='Você não tem permissão para editar'
                      >
                        ✏️
                      </ActionButton>
                    </Tooltip>
                  )}
                  {doc.status === 'pending_review' && (
                    <>
                      {canApprove ? (
                        <>
                          <ActionButton
                            onClick={() => onApprove?.(doc.id, 'approved')}
                            title='Aprovar'
                            $color='green'
                          >
                            ✓
                          </ActionButton>
                          <ActionButton
                            onClick={() => onApprove?.(doc.id, 'rejected')}
                            title='Rejeitar'
                            $color='red'
                          >
                            ✗
                          </ActionButton>
                        </>
                      ) : (
                        <>
                          <Tooltip content='Você não tem permissão para aprovar documentos'>
                            <ActionButton
                              disabled
                              $color='green'
                              title='Você não tem permissão para aprovar'
                            >
                              ✓
                            </ActionButton>
                          </Tooltip>
                          <Tooltip content='Você não tem permissão para rejeitar documentos'>
                            <ActionButton
                              disabled
                              $color='red'
                              title='Você não tem permissão para rejeitar'
                            >
                              ✗
                            </ActionButton>
                          </Tooltip>
                        </>
                      )}
                    </>
                  )}
                  {canDelete ? (
                    <ActionButton
                      onClick={() => handleDeleteSingle(doc.id)}
                      title='Excluir'
                      $color='red'
                    >
                      🗑️
                    </ActionButton>
                  ) : (
                    <Tooltip content='Você não tem permissão para excluir documentos'>
                      <ActionButton
                        disabled
                        $color='red'
                        title='Você não tem permissão para excluir'
                      >
                        🗑️
                      </ActionButton>
                    </Tooltip>
                  )}
                </Actions>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

const getFileIcon = (extension: string): string => {
  const icons: Record<string, string> = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    webp: '🖼️',
    txt: '📃',
  };
  return icons[extension.toLowerCase()] || '📎';
};

const Container = styled.div`
  width: 100%;
`;

const BulkActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: ${({ theme }) => `${theme.colors.primary}10`};
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const BulkText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const BulkButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}05`};
  }
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const TableBody = styled.tbody``;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
`;

const DocumentName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FileIcon = styled.span`
  font-size: 1.5rem;
`;

const DocumentTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
`;

const DocumentDesc = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TypeBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: ${({ theme }) => `${theme.colors.primary}20`};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: ${({ $color }) => {
    const colors: Record<string, string> = {
      green: '#10b981',
      gray: '#6b7280',
      red: '#ef4444',
      orange: '#f59e0b',
      blue: '#3b82f6',
    };
    return `${colors[$color] || colors.gray}20`;
  }};
  color: ${({ $color }) => {
    const colors: Record<string, string> = {
      green: '#10b981',
      gray: '#6b7280',
      red: '#ef4444',
      orange: '#f59e0b',
      blue: '#3b82f6',
    };
    return colors[$color] || colors.gray;
  }};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ExpiryDate = styled.span<{ $expired?: boolean; $expiring?: boolean }>`
  color: ${({ theme, $expired, $expiring }) =>
    $expired ? theme.colors.error : $expiring ? '#f59e0b' : theme.colors.text};
  font-weight: ${({ $expired, $expiring }) =>
    $expired || $expiring ? '600' : '400'};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $color?: string }>`
  padding: 0.375rem 0.5rem;
  background-color: ${({ theme, $color }) => {
    if ($color === 'green') return '#10b981';
    if ($color === 'red') return theme.colors.error;
    return theme.colors.backgroundSecondary;
  }};
  color: ${({ $color }) => ($color ? 'white' : 'inherit')};
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  opacity: ${props => (props.disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    opacity: 0.8;
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
