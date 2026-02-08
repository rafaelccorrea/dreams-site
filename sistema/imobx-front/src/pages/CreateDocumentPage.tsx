import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdArrowBack, MdSave, MdUploadFile } from 'react-icons/md';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import type { UploadDocumentDto } from '../types/document';
import { DocumentType, DocumentTypeLabels } from '../types/document';
import { validateFile } from '../services/documentApi';
import { useDocumentPermissions } from '../hooks/useDocumentPermissions';
import { useDocuments } from '../hooks/useDocuments';
import { useClients } from '../hooks/useClients';
import { useProperties } from '../hooks/useProperties';
import { usePermissionsContext } from '../contexts/PermissionsContext';
import {
  canExecuteFunctionality,
  getDisabledFunctionalityMessage,
} from '../utils/permissionContextualDependencies';
import { PermissionButton } from '../components/common/PermissionButton';
import { maskCPF } from '../utils/masks';
import { Layout } from '../components/layout/Layout';
import { CreateDocumentShimmer } from '../components/shimmer/CreateDocumentShimmer';

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
  display: flex;
  align-items: center;
  gap: 12px;
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

const DropZone = styled.div<{ $active: boolean }>`
  border: 2px dashed
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  border-radius: 12px;
  padding: 48px 32px;
  text-align: center;
  background-color: ${({ theme, $active }) =>
    $active ? `${theme.colors.primary}10` : theme.colors.backgroundSecondary};
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
  gap: 12px;
`;

const UploadIcon = styled.div`
  font-size: 64px;
`;

const UploadText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const UploadSubtext = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
`;

const FileIcon = styled.div`
  font-size: 48px;
`;

const FileDetails = styled.div`
  text-align: left;
`;

const FileName = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px 0;
`;

const FileSize = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 24px;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const Radio = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const RadioLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
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

const ErrorMessage = styled.div`
  padding: 12px 16px;
  background-color: ${({ theme }) => `${theme.colors.error}15`};
  color: ${({ theme }) => theme.colors.error};
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.colors.error};
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

const PermissionMessage = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: ${({ theme }) => `${theme.colors.error}15`};
  color: ${({ theme }) => theme.colors.error};
  border-radius: 8px;
`;

const PermissionWarning = styled.div`
  padding: 16px;
  background: ${({ theme }) => `${theme.colors.warning || '#f59e0b'}15`};
  color: ${({ theme }) => theme.colors.warning || '#f59e0b'};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => `${theme.colors.warning || '#f59e0b'}40`};
  font-size: 14px;
  line-height: 1.5;

  div {
    margin-top: 8px;
    font-size: 13px;
    opacity: 0.9;
  }
`;

export const CreateDocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { canCreate } = useDocumentPermissions();
  const { upload, loading: uploading } = useDocuments();
  const { clients, fetchClients } = useClients();
  const { properties, getProperties } = useProperties();
  const [initialLoading, setInitialLoading] = useState(true);
  const { hasPermission } = usePermissionsContext();
  const hasLoadedRef = useRef(false);
  const lastParamsRef = useRef<string>('');

  // Pegar clientId e propertyId da URL se existir
  const preselectedClientId = searchParams.get('clientId') || undefined;
  const preselectedPropertyId = searchParams.get('propertyId') || undefined;

  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<DocumentType>(DocumentType.CONTRACT);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_NOTES_LENGTH = 300;
  const MAX_DESCRIPTION_LENGTH = 300;

  // Controle de vínculo
  const [entityType, setEntityType] = useState<'client' | 'property'>(
    preselectedClientId
      ? 'client'
      : preselectedPropertyId
        ? 'property'
        : 'client'
  );
  const [selectedClientId, setSelectedClientId] = useState(
    preselectedClientId || ''
  );
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    preselectedPropertyId || ''
  );

  // Buscar clientes e propriedades
  useEffect(() => {
    // Resetar ref quando os parâmetros mudarem para permitir recarregar
    const currentParams = `${preselectedClientId || ''}-${preselectedPropertyId || ''}`;

    if (lastParamsRef.current !== currentParams) {
      hasLoadedRef.current = false;
      lastParamsRef.current = currentParams;
    }

    // Prevenir múltiplas execuções simultâneas
    if (hasLoadedRef.current) return;

    const loadData = async () => {
      hasLoadedRef.current = true;
      try {
        // Verificar se pode vincular a clientes (document:create requer client:view para vincular)
        const canLinkToClient = canExecuteFunctionality(
          hasPermission,
          'document:create',
          'vincular_documento_cliente'
        );

        // Verificar se pode vincular a propriedades (document:create requer property:view para vincular)
        const canLinkToProperty = canExecuteFunctionality(
          hasPermission,
          'document:create',
          'vincular_documento_propriedade'
        );

        // Só carregar dados se tiver permissão para usar a funcionalidade
        if (canLinkToClient && !preselectedClientId) {
          await fetchClients();
        }
        if (canLinkToProperty && !preselectedPropertyId) {
          await getProperties({}, { page: 1, limit: 100 });
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        hasLoadedRef.current = false; // Permite tentar novamente em caso de erro
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedClientId, preselectedPropertyId]); // Só recarregar se os parâmetros da URL mudarem

  // Tipos de documento baseado no contexto
  const documentTypes =
    entityType === 'client'
      ? [
          { value: DocumentType.IDENTITY, label: 'Documento de Identidade' },
          {
            value: DocumentType.PROOF_OF_ADDRESS,
            label: 'Comprovante de Endereço',
          },
          {
            value: DocumentType.PROOF_OF_INCOME,
            label: 'Comprovante de Renda',
          },
          { value: DocumentType.CONTRACT, label: 'Contrato' },
          { value: DocumentType.OTHER, label: 'Outro' },
        ]
      : [
          { value: DocumentType.DEED, label: 'Escritura' },
          { value: DocumentType.REGISTRATION, label: 'Registro/Matrícula' },
          { value: DocumentType.TAX_DOCUMENT, label: 'IPTU/ITR' },
          { value: DocumentType.INSPECTION_REPORT, label: 'Laudo de Vistoria' },
          { value: DocumentType.APPRAISAL, label: 'Avaliação' },
          { value: DocumentType.PHOTO, label: 'Foto' },
          { value: DocumentType.CONTRACT, label: 'Contrato' },
          { value: DocumentType.OTHER, label: 'Outro' },
        ];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validation = validateFile(selectedFile);
      if (!validation.valid) {
        setError(validation.error || 'Arquivo inválido');
        return;
      }
      setFile(selectedFile);
      setError(null);
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
        setError(validation.error || 'Arquivo inválido');
        return;
      }
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Verificar permissão antes de fazer upload
    if (!canCreate) {
      setError('Você não tem permissão para fazer upload de documentos');
      toast.error('Você não tem permissão para fazer upload de documentos');
      return;
    }

    if (!file) {
      setError('Selecione um arquivo');
      return;
    }

    // Validar vínculo
    const clientId = entityType === 'client' ? selectedClientId : undefined;
    const propertyId =
      entityType === 'property' ? selectedPropertyId : undefined;

    if (!clientId && !propertyId) {
      setError('Selecione um cliente ou uma propriedade');
      return;
    }

    // Validar data de vencimento
    if (expiryDate) {
      const [year, month, day] = expiryDate.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setError('A data de vencimento não pode ser anterior a hoje');
        return;
      }
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

      const result = await upload(uploadData);

      if (result) {
        toast.success('Documento enviado com sucesso!');
        navigate('/documents');
      }
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer upload do documento');
      toast.error(error.message || 'Erro ao fazer upload do documento');
    }
  };

  const handleCancel = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    navigate('/documents');
  };

  // Mostrar shimmer enquanto carrega dados iniciais
  if (initialLoading) {
    return (
      <Layout>
        <CreateDocumentShimmer />
      </Layout>
    );
  }

  if (!canCreate) {
    return (
      <Layout>
        <Container>
          <PermissionMessage>
            Você não tem permissão para criar documentos.
          </PermissionMessage>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Header>
          <Title>
            <MdUploadFile />
            Upload de Documento
          </Title>
          <BackButton type='button' onClick={handleCancel}>
            <MdArrowBack />
            Voltar
          </BackButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          {/* Seleção de Vínculo */}
          {!preselectedClientId &&
            !preselectedPropertyId &&
            (() => {
              const canLinkToClient = canExecuteFunctionality(
                hasPermission,
                'document:create',
                'vincular_documento_cliente'
              );
              const canLinkToProperty = canExecuteFunctionality(
                hasPermission,
                'document:create',
                'vincular_documento_propriedade'
              );

              // Se não pode vincular a nenhum, mostrar mensagem
              if (!canLinkToClient && !canLinkToProperty) {
                const clientMessage = getDisabledFunctionalityMessage(
                  'document:create',
                  'vincular_documento_cliente'
                );
                const propertyMessage = getDisabledFunctionalityMessage(
                  'document:create',
                  'vincular_documento_propriedade'
                );
                return (
                  <FormGroup>
                    <PermissionWarning>
                      ⚠️ Para criar documentos, você precisa de permissão para
                      visualizar clientes ou propriedades.
                      {clientMessage && <div>{clientMessage}</div>}
                    </PermissionWarning>
                  </FormGroup>
                );
              }

              // Se pode vincular a apenas um, definir automaticamente
              if (canLinkToClient && !canLinkToProperty) {
                if (entityType !== 'client') {
                  setEntityType('client');
                }
                return null; // Não mostrar seleção, já está definido
              }

              if (canLinkToProperty && !canLinkToClient) {
                if (entityType !== 'property') {
                  setEntityType('property');
                }
                return null; // Não mostrar seleção, já está definido
              }

              // Se pode vincular a ambos, mostrar seleção
              return (
                <FormGroup>
                  <Label className='required'>Vincular a</Label>
                  <RadioGroup>
                    {canLinkToClient && (
                      <RadioOption>
                        <Radio
                          type='radio'
                          name='entityType'
                          value='client'
                          checked={entityType === 'client'}
                          onChange={() => {
                            setEntityType('client');
                            setSelectedPropertyId('');
                          }}
                        />
                        <RadioLabel>Cliente</RadioLabel>
                      </RadioOption>
                    )}
                    {canLinkToProperty && (
                      <RadioOption>
                        <Radio
                          type='radio'
                          name='entityType'
                          value='property'
                          checked={entityType === 'property'}
                          onChange={() => {
                            setEntityType('property');
                            setSelectedClientId('');
                          }}
                        />
                        <RadioLabel>Propriedade</RadioLabel>
                      </RadioOption>
                    )}
                  </RadioGroup>
                </FormGroup>
              );
            })()}

          {/* Select de Cliente */}
          {entityType === 'client' &&
            !preselectedClientId &&
            canExecuteFunctionality(
              hasPermission,
              'document:create',
              'vincular_documento_cliente'
            ) && (
              <FormGroup>
                <Label className='required'>Cliente</Label>
                <Select
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
            !preselectedPropertyId &&
            canExecuteFunctionality(
              hasPermission,
              'document:create',
              'vincular_documento_propriedade'
            ) && (
              <FormGroup>
                <Label className='required'>Propriedade</Label>
                <Select
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
                  <FileIcon>📎</FileIcon>
                  <FileDetails>
                    <FileName>{file.name}</FileName>
                    <FileSize>{formatFileSize(file.size)}</FileSize>
                  </FileDetails>
                </FileInfo>
              ) : (
                <UploadPrompt>
                  <UploadIcon>📁</UploadIcon>
                  <UploadText>Clique ou arraste um arquivo</UploadText>
                  <UploadSubtext>
                    PDF, DOC, XLS, imagens (máx. 50MB)
                  </UploadSubtext>
                </UploadPrompt>
              )}
            </label>
          </DropZone>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Label className='required'>Tipo de Documento</Label>
            <Select
              value={type}
              onChange={e => setType(e.target.value as DocumentType)}
              required
            >
              <option value=''>Selecione o tipo</option>
              {documentTypes.map(docType => (
                <option key={docType.value} value={docType.value}>
                  {docType.label}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Título</Label>
            <Input
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Nome descritivo do documento'
            />
          </FormGroup>

          <FormGroup>
            <Label>Descrição</Label>
            <TextArea
              value={description}
              onChange={e => {
                if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                  setDescription(e.target.value);
                }
              }}
              placeholder='Descrição detalhada'
              rows={3}
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
            <CharCounter
              $isNearLimit={description.length > MAX_DESCRIPTION_LENGTH * 0.8}
            >
              {description.length}/{MAX_DESCRIPTION_LENGTH}
            </CharCounter>
          </FormGroup>

          <FormGroup>
            <Label>Tags</Label>
            <Input
              type='text'
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder='Separadas por vírgula'
            />
          </FormGroup>

          <FormGroup>
            <Label>Data de Vencimento</Label>
            <Input
              type='date'
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            {expiryDate && (
              <HelpText>
                Documento vencerá em{' '}
                {(() => {
                  const [year, month, day] = expiryDate.split('-').map(Number);
                  const expiryDateObj = new Date(year, month - 1, day);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const diffTime = expiryDateObj.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return Math.max(0, diffDays);
                })()}{' '}
                dia(s)
              </HelpText>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Observações</Label>
            <TextArea
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
            <Button onClick={handleCancel} type='button'>
              Cancelar
            </Button>
            <PermissionButton
              permission='document:create'
              onClick={() => {}}
              disabled={uploading || !file}
              variant='primary'
              type='submit'
            >
              {uploading ? (
                <>
                  <LoadingSpinner />
                  Enviando...
                </>
              ) : (
                <>
                  <MdSave />
                  Fazer Upload
                </>
              )}
            </PermissionButton>
          </ButtonGroup>
        </Form>
      </Container>
    </Layout>
  );
};

export default CreateDocumentPage;
