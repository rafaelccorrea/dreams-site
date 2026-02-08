import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { DocumentModel, UpdateDocumentDto } from '../../types/document';
import {
  DocumentType,
  DocumentStatus,
  DocumentTypeLabels,
  DocumentStatusLabels,
} from '../../types/document';
import { useDocuments } from '../../hooks/useDocuments';
import { useDocumentPermissions } from '../../hooks/useDocumentPermissions';

// Helper functions
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

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

const FileIcon = styled.div`
  font-size: 2rem;
`;

const FileName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const FileSize = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) =>
      theme.colors.primaryDark || theme.colors.primary};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PermissionMessage = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: ${({ theme }) => `${theme.colors.error}15`};
  color: ${({ theme }) => theme.colors.error};
  border-radius: 8px;
`;

const CharCounter = styled.div<{ $isNearLimit: boolean }>`
  font-size: 12px;
  color: ${({ theme, $isNearLimit }) =>
    $isNearLimit ? '#f59e0b' : theme.colors.textSecondary};
  text-align: right;
  margin-top: 4px;
`;

const HelpText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
  font-style: italic;
`;

// Component
interface DocumentEditModalProps {
  documentId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DocumentEditModal: React.FC<DocumentEditModalProps> = ({
  documentId,
  onClose,
  onSuccess,
}) => {
  const { canUpdate } = useDocumentPermissions();
  const { fetchById, update, loading } = useDocuments();

  const [document, setDocument] = useState<DocumentModel | null>(null);
  const [type, setType] = useState<DocumentType>(DocumentType.CONTRACT);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState<DocumentStatus>(DocumentStatus.ACTIVE);
  const [saving, setSaving] = useState(false);

  const MAX_NOTES_LENGTH = 300;
  const MAX_DESCRIPTION_LENGTH = 300;

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    const doc = await fetchById(documentId);
    if (doc) {
      setDocument(doc);
      setType(doc.type);
      setTitle(doc.title || '');
      setDescription(doc.description || '');
      setTags(doc.tags?.join(', ') || '');
      setNotes(doc.notes || '');
      setExpiryDate(
        doc.expiryDate
          ? new Date(doc.expiryDate).toISOString().split('T')[0]
          : ''
      );
      setStatus(doc.status);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canUpdate) {
      alert('Você não tem permissão para editar documentos');
      return;
    }

    // Validar data de vencimento
    if (expiryDate) {
      // Criar data local sem problemas de timezone
      const [year, month, day] = expiryDate.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        alert('A data de vencimento não pode ser anterior a hoje');
        return;
      }
    }

    setSaving(true);

    const updateData: UpdateDocumentDto = {
      type,
      title: title || undefined,
      description: description || undefined,
      tags: tags ? tags.split(',').map(t => t.trim()) : undefined,
      notes: notes || undefined,
      expiryDate: expiryDate || undefined,
      status,
    };

    const result = await update(documentId, updateData);

    setSaving(false);

    if (result) {
      onSuccess?.();
      onClose();
    }
  };

  if (loading || !document) {
    return (
      <Overlay onClick={onClose}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <LoadingMessage>Carregando...</LoadingMessage>
        </ModalContent>
      </Overlay>
    );
  }

  if (!canUpdate) {
    return (
      <Overlay onClick={onClose}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <PermissionMessage>
            Você não tem permissão para editar documentos.
          </PermissionMessage>
        </ModalContent>
      </Overlay>
    );
  }

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Editar Documento</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FileInfo>
              <FileIcon>{getFileIcon(document.fileExtension)}</FileIcon>
              <div>
                <FileName>{document.originalName}</FileName>
                <FileSize>{formatFileSize(document.fileSize)}</FileSize>
              </div>
            </FileInfo>

            <FormRow>
              <FormGroup>
                <Label htmlFor='type'>Tipo de Documento *</Label>
                <Select
                  id='type'
                  value={type}
                  onChange={e => setType(e.target.value as DocumentType)}
                  required
                >
                  {Object.entries(DocumentTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor='status'>Status *</Label>
                <Select
                  id='status'
                  value={status}
                  onChange={e => setStatus(e.target.value as DocumentStatus)}
                  required
                >
                  {Object.entries(DocumentStatusLabels).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </Select>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor='title'>Título</Label>
              <Input
                id='title'
                type='text'
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder='Nome descritivo do documento'
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor='description'>Descrição</Label>
              <TextArea
                id='description'
                value={description}
                onChange={e => {
                  if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                    setDescription(e.target.value);
                  }
                }}
                placeholder='Descrição detalhada do documento'
                rows={3}
                maxLength={MAX_DESCRIPTION_LENGTH}
              />
              <CharCounter
                $isNearLimit={description.length > MAX_DESCRIPTION_LENGTH * 0.8}
              >
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </CharCounter>
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor='tags'>Tags</Label>
                <Input
                  id='tags'
                  type='text'
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder='Separadas por vírgula'
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='expiryDate'>Data de Vencimento</Label>
                <Input
                  id='expiryDate'
                  type='date'
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                {expiryDate && (
                  <HelpText>
                    Documento vencerá em{' '}
                    {(() => {
                      const [year, month, day] = expiryDate
                        .split('-')
                        .map(Number);
                      const expiryDateObj = new Date(year, month - 1, day);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const diffTime =
                        expiryDateObj.getTime() - today.getTime();
                      const diffDays = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                      );
                      return Math.max(0, diffDays);
                    })()}{' '}
                    dia(s)
                  </HelpText>
                )}
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor='notes'>Observações</Label>
              <TextArea
                id='notes'
                value={notes}
                onChange={e => {
                  if (e.target.value.length <= MAX_NOTES_LENGTH) {
                    setNotes(e.target.value);
                  }
                }}
                placeholder='Observações adicionais'
                rows={2}
                maxLength={MAX_NOTES_LENGTH}
              />
              <CharCounter $isNearLimit={notes.length > MAX_NOTES_LENGTH * 0.8}>
                {notes.length}/{MAX_NOTES_LENGTH}
              </CharCounter>
            </FormGroup>

            <ButtonGroup>
              <CancelButton type='button' onClick={onClose}>
                Cancelar
              </CancelButton>
              <SubmitButton type='submit' disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </SubmitButton>
            </ButtonGroup>
          </Form>
        </ModalBody>
      </ModalContent>
    </Overlay>
  );
};
