import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import {
  MdAttachFile,
  MdDelete,
  MdCloudUpload,
  MdDownload,
} from 'react-icons/md';
import { kanbanApi } from '../../services/kanbanApi';
import { showError, showSuccess } from '../../utils/notifications';
import type { Attachment } from '../../types/attachment';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import { ShimmerBase } from '../common/Shimmer';

interface TaskAttachmentsManagerProps {
  taskId: string;
  canEdit?: boolean;
  onUpdate?: () => void;
}

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => `${props.theme.colors.primary}40`};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const AttachmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 8px;
`;

const ShimmerCard = styled.div`
  border-radius: 12px;
  overflow: hidden;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ShimmerPreviewWrap = styled.div`
  position: relative;
  width: 100%;
  padding-top: 75%;
  overflow: hidden;
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const ShimmerPreview = styled(ShimmerBase)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0;
`;

const ShimmerInfo = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AttachmentCard = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.colors.primary}40;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const AttachmentPreview = styled.div`
  position: relative;
  width: 100%;
  padding-top: 75%;
  background: ${props => props.theme.colors.backgroundSecondary};
  overflow: hidden;
`;

const AttachmentImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AttachmentIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${props => props.theme.colors.textSecondary};
  font-size: 32px;
`;

const AttachmentInfo = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AttachmentName = styled.div`
  font-size: 0.813rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AttachmentMeta = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(239, 68, 68, 1);
    transform: scale(1.1);
  }
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 10px;
  margin-top: 6px;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary}40;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: ${props => props.theme.colors.primary}25;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  border: 1px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 0.813rem;
  margin-top: 8px;
`;

export const TaskAttachmentsManager: React.FC<TaskAttachmentsManagerProps> = ({
  taskId,
  canEdit = false,
  onUpdate,
}) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] =
    useState<Attachment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAttachments();
  }, [taskId]);

  const loadAttachments = async () => {
    try {
      setLoading(true);
      const data = await kanbanApi.getTaskAttachments(taskId);
      setAttachments(data);
    } catch (error: any) {
      console.error('Erro ao carregar anexos:', error);
      showError('Erro ao carregar anexos');
    } finally {
      setLoading(false);
    }
  };

  const validateFiles = (files: File[]): string | null => {
    if (files.length === 0) {
      return 'Nenhum arquivo selecionado';
    }

    if (files.length > MAX_FILES) {
      return `Máximo de ${MAX_FILES} arquivos permitidos`;
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return `Arquivo ${file.name} excede o tamanho máximo de 5MB`;
      }
    }

    return null;
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    const validationError = validateFiles(files);
    if (validationError) {
      setError(validationError);
      showError(validationError);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const updatedTask = await kanbanApi.uploadTaskAttachments(taskId, files);

      // Atualizar lista de anexos
      if (updatedTask.attachments) {
        setAttachments(updatedTask.attachments);
      } else {
        await loadAttachments();
      }

      showSuccess('Arquivos anexados com sucesso!');

      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      const errorMessage =
        error?.message || 'Erro ao fazer upload dos arquivos';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleOpenDeleteModal = useCallback((attachment: Attachment) => {
    if (!attachment.key) {
      showError('Chave do anexo não encontrada');
      return;
    }
    setAttachmentToDelete(attachment);
    setDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setAttachmentToDelete(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!attachmentToDelete?.key) {
      showError('Chave do anexo não encontrada');
      return;
    }

    setIsDeleting(true);
    try {
      const updatedTask = await kanbanApi.removeTaskAttachment(
        taskId,
        attachmentToDelete.key
      );

      // Atualizar lista de anexos
      if (updatedTask.attachments) {
        setAttachments(updatedTask.attachments);
      } else {
        await loadAttachments();
      }

      showSuccess('Anexo removido com sucesso!');
      handleCloseDeleteModal();

      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error('Erro ao remover anexo:', error);
      showError(error?.message || 'Erro ao remover anexo');
    } finally {
      setIsDeleting(false);
    }
  }, [taskId, attachmentToDelete, onUpdate, handleCloseDeleteModal]);

  const isImage = (contentType?: string) => {
    return contentType?.startsWith('image/');
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleDownload = useCallback(
    (e: React.MouseEvent, attachment: Attachment) => {
      e.stopPropagation();
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name || 'anexo';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    []
  );

  const handleCardClick = useCallback((attachment: Attachment) => {
    window.open(attachment.url, '_blank');
  }, []);

  if (loading) {
    return (
      <Container>
        <SectionHeader>
          <SectionTitle>
            <MdAttachFile size={18} />
            Anexos
          </SectionTitle>
        </SectionHeader>
        <AttachmentsGrid>
          {[1, 2, 3, 4].map(i => (
            <ShimmerCard key={i}>
              <ShimmerPreviewWrap>
                <ShimmerPreview />
              </ShimmerPreviewWrap>
              <ShimmerInfo>
                <ShimmerBase
                  $height='14px'
                  $borderRadius='6px'
                  style={{ width: '80%' }}
                />
                <ShimmerBase
                  $height='12px'
                  $borderRadius='4px'
                  style={{ width: '50%', marginTop: '8px' }}
                />
              </ShimmerInfo>
            </ShimmerCard>
          ))}
        </AttachmentsGrid>
      </Container>
    );
  }

  return (
    <Container>
      <SectionHeader>
        <SectionTitle>
          <MdAttachFile size={18} />
          Anexos {attachments.length > 0 && `(${attachments.length})`}
        </SectionTitle>
        {canEdit && (
          <>
            <UploadButton
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || attachments.length >= MAX_FILES}
            >
              <MdCloudUpload size={18} />
              {uploading ? 'Enviando...' : 'Anexar Arquivos'}
            </UploadButton>
            <HiddenInput
              ref={fileInputRef}
              type='file'
              multiple
              onChange={handleFileSelect}
              accept='*/*'
            />
          </>
        )}
      </SectionHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {attachments.length === 0 ? (
        <EmptyState>Nenhum arquivo anexado</EmptyState>
      ) : (
        <AttachmentsGrid>
          {attachments.map((attachment, index) => (
            <AttachmentCard
              key={attachment.key || index}
              onClick={() => handleCardClick(attachment)}
            >
              <AttachmentPreview>
                {isImage(attachment.contentType) ? (
                  <AttachmentImage
                    src={attachment.previewUrl || attachment.url}
                    alt={attachment.name || 'Anexo'}
                  />
                ) : (
                  <AttachmentIcon>
                    <MdAttachFile size={32} />
                  </AttachmentIcon>
                )}
                {canEdit && (
                  <DeleteButton
                    onClick={e => {
                      e.stopPropagation();
                      handleOpenDeleteModal(attachment);
                    }}
                  >
                    <MdDelete size={16} />
                  </DeleteButton>
                )}
              </AttachmentPreview>
              <AttachmentInfo>
                <AttachmentName title={attachment.name || 'Arquivo sem nome'}>
                  {attachment.name || 'Arquivo sem nome'}
                </AttachmentName>
                <AttachmentMeta>
                  {formatFileSize(attachment.size)}
                </AttachmentMeta>
                <DownloadButton
                  onClick={e => handleDownload(e, attachment)}
                  title='Baixar anexo'
                >
                  <MdDownload size={14} />
                  Baixar
                </DownloadButton>
              </AttachmentInfo>
            </AttachmentCard>
          ))}
        </AttachmentsGrid>
      )}

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title='Remover Anexo'
        message={`Tem certeza que deseja remover o arquivo "${attachmentToDelete?.name || 'anexo'}"? Esta ação não pode ser desfeita.`}
        itemName={attachmentToDelete?.name}
        isLoading={isDeleting}
        variant='delete'
        confirmLabel='Remover'
        loadingLabel='Removendo...'
      />
    </Container>
  );
};
