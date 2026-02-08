import React, { useState } from 'react';
import styled from 'styled-components';
import type { UploadDocumentDto, DocumentModel } from '../../types/document';
import { DocumentType, DocumentTypeLabels } from '../../types/document';
import { validateFile } from '../../services/documentApi';
import { useDocumentPermissions } from '../../hooks/useDocumentPermissions';
import { useDocuments } from '../../hooks/useDocuments';

interface DocumentUploadProps {
  clientId?: string;
  propertyId?: string;
  onSuccess?: (document: DocumentModel) => void;
  onError?: (error: string) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  clientId,
  propertyId,
  onSuccess,
  onError,
}) => {
  const { canCreate } = useDocumentPermissions();
  const { upload, loading: uploading } = useDocuments();
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<DocumentType>(DocumentType.CONTRACT);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  if (!canCreate) {
    return (
      <PermissionMessage>
        Você não tem permissão para fazer upload de documentos.
      </PermissionMessage>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validation = validateFile(selectedFile);
      if (!validation.valid) {
        onError?.(validation.error || 'Arquivo inválido');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validation = validateFile(droppedFile);
      if (!validation.valid) {
        onError?.(validation.error || 'Arquivo inválido');
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      onError?.('Selecione um arquivo');
      return;
    }

    if (!clientId && !propertyId) {
      onError?.('O documento deve estar vinculado a um cliente ou propriedade');
      return;
    }

    try {
      const uploadData: UploadDocumentDto = {
        file,
        type,
        clientId,
        propertyId,
        title: title || undefined,
        description: description || undefined,
        tags: tags ? tags.split(',').map(t => t.trim()) : undefined,
        notes: notes || undefined,
        expiryDate: expiryDate || undefined,
        isEncrypted,
      };

      const document = await upload(uploadData);

      if (document) {
        onSuccess?.(document);

        // Limpar formulário
        setFile(null);
        setTitle('');
        setDescription('');
        setTags('');
        setNotes('');
        setExpiryDate('');
        setIsEncrypted(false);
      }
    } catch (error: any) {
      onError?.(error.message || 'Erro ao fazer upload');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <DropZone
          $active={dragActive}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type='file'
            id='file-upload'
            onChange={handleFileChange}
            accept='.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.txt'
            style={{ display: 'none' }}
          />
          <label htmlFor='file-upload'>
            {file ? (
              <FileInfo>
                <FileName>{file.name}</FileName>
                <FileSize>{formatFileSize(file.size)}</FileSize>
              </FileInfo>
            ) : (
              <UploadPrompt>
                <UploadIcon>📁</UploadIcon>
                <UploadText>Clique ou arraste um arquivo aqui</UploadText>
                <UploadSubtext>
                  PDF, DOC, XLS, imagens (máx. 50MB)
                </UploadSubtext>
              </UploadPrompt>
            )}
          </label>
        </DropZone>

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
            <Label htmlFor='title'>Título</Label>
            <Input
              id='title'
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Nome descritivo do documento'
            />
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label htmlFor='description'>Descrição</Label>
          <TextArea
            id='description'
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder='Descrição detalhada do documento'
            rows={3}
          />
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
            />
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label htmlFor='notes'>Observações</Label>
          <TextArea
            id='notes'
            value={notes}
            onChange={e => {
              if (e.target.value.length <= 300) {
                setNotes(e.target.value);
              }
            }}
            placeholder='Observações adicionais (máx. 300 caracteres)'
            maxLength={300}
            rows={2}
          />
        </FormGroup>

        <CheckboxGroup>
          <Checkbox
            type='checkbox'
            id='isEncrypted'
            checked={isEncrypted}
            onChange={e => setIsEncrypted(e.target.checked)}
          />
          <CheckboxLabel htmlFor='isEncrypted'>
            Documento criptografado
          </CheckboxLabel>
        </CheckboxGroup>

        <ButtonGroup>
          <SubmitButton type='submit' disabled={uploading || !file}>
            {uploading ? 'Enviando...' : 'Fazer Upload'}
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DropZone = styled.div<{ $active: boolean }>`
  border: 2px dashed
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background-color: ${({ theme, $active }) =>
    $active ? `${theme.colors.primary}10` : theme.colors.background};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => `${theme.colors.primary}05`};
  }

  label {
    cursor: pointer;
    display: block;
  }
`;

const UploadPrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const UploadIcon = styled.div`
  font-size: 3rem;
`;

const UploadText = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const UploadSubtext = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FileName = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const FileSize = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
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

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
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

const PermissionMessage = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => `${theme.colors.error}15`};
  color: ${({ theme }) => theme.colors.error};
  border-radius: 4px;
  text-align: center;
`;
