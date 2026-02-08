import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdSave } from 'react-icons/md';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import type { UpdateDocumentDto } from '../types/document';
import {
  DocumentType,
  DocumentStatus,
  DocumentTypeLabels,
  DocumentStatusLabels,
} from '../types/document';
import { useDocuments } from '../hooks/useDocuments';
import { useDocumentPermissions } from '../hooks/useDocumentPermissions';
import { useClients } from '../hooks/useClients';
import { useProperties } from '../hooks/useProperties';
import { usePermissionsContext } from '../contexts/PermissionsContext';
import {
  canExecuteFunctionality,
  getDisabledFunctionalityMessage,
} from '../utils/permissionContextualDependencies';
import { Layout } from '../components/layout/Layout';
import { EditDocumentShimmer } from '../components/shimmer/EditDocumentShimmer';
import { maskCPF } from '../utils/masks';

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
const Container = styled.div`
  padding: 24px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
`;

const BackButton = styled.button`
  background: var(--color-background-secondary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-background);
    border-color: var(--color-primary);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--color-text);
  font-size: 14px;

  &.required::after {
    content: ' *';
    color: var(--color-error);
  }
`;

const Input = styled.input`
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--color-text);
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
`;

const Select = styled.select`
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--color-text);
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: var(--color-primary);
    color: white;

    &:hover:not(:disabled) {
      background: var(--color-primary-dark);
      transform: translateY(-1px);
    }

    &:disabled {
      background: var(--color-text-secondary);
      cursor: not-allowed;
      transform: none;
    }
  `
      : `
    background: var(--color-background-secondary);
    color: var(--color-text);
    border: 1px solid var(--color-border);

    &:hover {
      background: var(--color-background);
      border-color: var(--color-primary);
    }
  `}
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

export const EditDocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { canUpdate } = useDocumentPermissions();
  const { fetchById, update, loading } = useDocuments();
  const { clients, fetchClients } = useClients();
  const { properties, getProperties } = useProperties();
  const { hasPermission } = usePermissionsContext();

  const [type, setType] = useState<DocumentType>(DocumentType.CONTRACT);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState<DocumentStatus>(DocumentStatus.ACTIVE);
  const [saving, setSaving] = useState(false);
  const [document, setDocument] = useState<any>(null);

  // Controle de vínculo
  const [entityType, setEntityType] = useState<'client' | 'property'>('client');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState('');

  const MAX_NOTES_LENGTH = 300;
  const MAX_DESCRIPTION_LENGTH = 300;

  // Carregar clientes e propriedades
  useEffect(() => {
    // Verificar se pode alterar vínculo com clientes
    const canChangeClientLink = canExecuteFunctionality(
      hasPermission,
      'document:update',
      'alterar_vinculo_cliente'
    );

    // Verificar se pode alterar vínculo com propriedades
    const canChangePropertyLink = canExecuteFunctionality(
      hasPermission,
      'document:update',
      'alterar_vinculo_propriedade'
    );

    if (canChangeClientLink) {
      fetchClients();
    }
    if (canChangePropertyLink) {
      getProperties({}, { page: 1, limit: 100 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Removidas dependências para evitar loop

  useEffect(() => {
    if (id) {
      loadDocument();
    }
  }, [id]);

  const loadDocument = async () => {
    if (!id) return;
    try {
      const doc = await fetchById(id);
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

        // Definir vínculo atual
        if (doc.clientId) {
          setEntityType('client');
          setSelectedClientId(doc.clientId);
          setSelectedPropertyId('');
        } else if (doc.propertyId) {
          setEntityType('property');
          setSelectedPropertyId(doc.propertyId);
          setSelectedClientId('');
        }
      }
    } catch (error) {
      toast.error('Erro ao carregar documento');
      navigate('/documents');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canUpdate) {
      toast.error('Você não tem permissão para editar documentos');
      return;
    }

    if (!id) return;

    // Validar data de vencimento
    if (expiryDate) {
      const [year, month, day] = expiryDate.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        toast.error('A data de vencimento não pode ser anterior a hoje');
        return;
      }
    }

    // Validar vínculo apenas se tiver permissão
    if (
      entityType === 'client' &&
      hasPermission('client:view') &&
      !selectedClientId
    ) {
      toast.error('Selecione um cliente');
      return;
    }
    if (
      entityType === 'property' &&
      hasPermission('property:view') &&
      !selectedPropertyId
    ) {
      toast.error('Selecione uma propriedade');
      return;
    }

    setSaving(true);

    try {
      const updateData: UpdateDocumentDto = {
        type,
        title: title || undefined,
        description: description || undefined,
        tags: tags ? tags.split(',').map(t => t.trim()) : undefined,
        notes: notes || undefined,
        expiryDate: expiryDate || undefined,
        status,
        clientId: entityType === 'client' ? selectedClientId : null,
        propertyId: entityType === 'property' ? selectedPropertyId : null,
      };

      const result = await update(id, updateData);

      if (result) {
        toast.success('Documento atualizado com sucesso!');
        navigate('/documents');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar documento');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigate('/documents');
  };

  const handleBack = () => {
    navigate('/documents');
  };

  if (loading || !document) {
    return (
      <Layout>
        <EditDocumentShimmer />
      </Layout>
    );
  }

  if (!canUpdate) {
    return (
      <Layout>
        <Container>
          <PermissionMessage>
            Você não tem permissão para editar documentos.
          </PermissionMessage>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Header>
          <Title>Editar Documento</Title>
          <BackButton type='button' onClick={handleBack}>
            <MdArrowBack />
            Voltar
          </BackButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FileInfo>
            <FileIcon>{getFileIcon(document.fileExtension)}</FileIcon>
            <div>
              <FileName>{document.originalName}</FileName>
              <FileSize>{formatFileSize(document.fileSize)}</FileSize>
            </div>
          </FileInfo>

          {/* Seleção de Tipo de Vínculo */}
          <FormGroup>
            <Label htmlFor='entityType' className='required'>
              Vincular a
            </Label>
            <Select
              id='entityType'
              value={entityType}
              onChange={e => {
                const newType = e.target.value as 'client' | 'property';
                setEntityType(newType);
                if (newType === 'client') {
                  setSelectedPropertyId('');
                } else {
                  setSelectedClientId('');
                }
              }}
              required
            >
              <option value='client'>Cliente</option>
              <option value='property'>Propriedade</option>
            </Select>
          </FormGroup>

          {/* Select de Cliente */}
          {entityType === 'client' &&
            canExecuteFunctionality(
              hasPermission,
              'document:update',
              'alterar_vinculo_cliente'
            ) && (
              <FormGroup>
                <Label htmlFor='clientId' className='required'>
                  Cliente
                </Label>
                <Select
                  id='clientId'
                  value={selectedClientId}
                  onChange={e => setSelectedClientId(e.target.value)}
                  required
                >
                  <option value=''>Selecione um cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.cpf && `- ${maskCPF(client.cpf)}`}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            )}

          {/* Select de Propriedade */}
          {entityType === 'property' &&
            canExecuteFunctionality(
              hasPermission,
              'document:update',
              'alterar_vinculo_propriedade'
            ) && (
              <FormGroup>
                <Label htmlFor='propertyId' className='required'>
                  Propriedade
                </Label>
                <Select
                  id='propertyId'
                  value={selectedPropertyId}
                  onChange={e => setSelectedPropertyId(e.target.value)}
                  required
                >
                  <option value=''>Selecione uma propriedade</option>
                  {properties.map(prop => (
                    <option key={prop.id} value={prop.id}>
                      {prop.title || prop.code}{' '}
                      {prop.address && `- ${prop.address}`}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            )}

          <FormRow>
            <FormGroup>
              <Label htmlFor='type' className='required'>
                Tipo de Documento
              </Label>
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
              <Label htmlFor='status' className='required'>
                Status
              </Label>
              <Select
                id='status'
                value={status}
                onChange={e => setStatus(e.target.value as DocumentStatus)}
                required
              >
                {Object.entries(DocumentStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
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
                    const diffTime = expiryDateObj.getTime() - today.getTime();
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
            <Button onClick={handleCancel} type='button'>
              Cancelar
            </Button>
            <Button $variant='primary' type='submit' disabled={saving}>
              {saving ? (
                <>
                  <LoadingSpinner />
                  Salvando...
                </>
              ) : (
                <>
                  <MdSave />
                  Salvar Alterações
                </>
              )}
            </Button>
          </ButtonGroup>
        </Form>
      </Container>
    </Layout>
  );
};

export default EditDocumentPage;
