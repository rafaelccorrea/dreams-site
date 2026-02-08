import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdClose, MdSave, MdUploadFile } from 'react-icons/md';
import type { UploadDocumentDto } from '../../types/document';
import { DocumentType, DocumentTypeLabels } from '../../types/document';
import { validateFile } from '../../services/documentApi';
import { useDocumentPermissions } from '../../hooks/useDocumentPermissions';
import { useDocuments } from '../../hooks/useDocuments';
import { useClients } from '../../hooks/useClients';
import { useProperties } from '../../hooks/useProperties';
import { usePermissionsContext } from '../../contexts/PermissionsContext';
import { PermissionButton } from '../common/PermissionButton';
import {
  canExecuteFunctionality,
  getDisabledFunctionalityMessage,
} from '../../utils/permissionContextualDependencies';
import { maskCPF } from '../../utils/masks';

interface DocumentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  clientId?: string;
  propertyId?: string;
}

export const DocumentDrawer: React.FC<DocumentDrawerProps> = ({
  isOpen,
  onClose,
  onSuccess,
  clientId: preselectedClientId,
  propertyId: preselectedPropertyId,
}) => {
  const { canCreate } = useDocumentPermissions();
  const { upload, loading: uploading } = useDocuments();
  const { clients, fetchClients } = useClients();
  const { properties, getProperties } = useProperties();
  const { hasPermission } = usePermissionsContext();

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

  // Buscar clientes e propriedades ao abrir
  useEffect(() => {
    if (isOpen) {
      // Verificar se pode vincular a clientes
      const canLinkToClient = canExecuteFunctionality(
        hasPermission,
        'document:create',
        'vincular_documento_cliente'
      );

      // Verificar se pode vincular a propriedades
      const canLinkToProperty = canExecuteFunctionality(
        hasPermission,
        'document:create',
        'vincular_documento_propriedade'
      );

      if (canLinkToClient && !preselectedClientId) {
        fetchClients();
      }
      if (canLinkToProperty && !preselectedPropertyId) {
        getProperties({}, { page: 1, limit: 100 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Removida dependência de hasPermission para evitar loop

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

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

  const resetForm = () => {
    setFile(null);
    setType(DocumentType.CONTRACT);
    setTitle('');
    setDescription('');
    setTags('');
    setNotes('');
    setExpiryDate('');
    setIsEncrypted(false);
    setError(null);
    if (!preselectedClientId) setSelectedClientId('');
    if (!preselectedPropertyId) setSelectedPropertyId('');
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
      // Criar data local sem problemas de timezone
      const [year, month, day] = expiryDate.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setError('A data de vencimento não pode ser anterior a hoje');
        return;
      }
    }

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
      onSuccess?.();
      onClose();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (!canCreate) return null;

  return (
    <>
      <DrawerOverlay $isOpen={isOpen} onClick={onClose} />
      <DrawerContainer $isOpen={isOpen}>
        <DrawerHeader>
          <HeaderTitle>
            <MdUploadFile size={24} />
            Upload de Documento
          </HeaderTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </DrawerHeader>

        <DrawerBody>
          <Form onSubmit={handleSubmit}>
            {/* Seleção de Vínculo */}
            {!preselectedClientId && !preselectedPropertyId && (
              <FormGroup>
                <Label>Vincular a *</Label>
                <RadioGroup>
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
                </RadioGroup>
              </FormGroup>
            )}

            {/* Select de Cliente */}
            {entityType === 'client' &&
              !preselectedClientId &&
              canExecuteFunctionality(
                hasPermission,
                'document:create',
                'vincular_documento_cliente'
              ) && (
                <FormGroup>
                  <Label>Cliente *</Label>
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
                  <Label>Propriedade *</Label>
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
                id='file-upload-drawer'
                onChange={handleFileChange}
                accept='.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.txt'
                style={{ display: 'none' }}
              />
              <label htmlFor='file-upload-drawer'>
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
              <Label>Tipo de Documento *</Label>
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
                id='isEncrypted-drawer'
                checked={isEncrypted}
                onChange={e => setIsEncrypted(e.target.checked)}
              />
              <CheckboxLabel htmlFor='isEncrypted-drawer'>
                Documento criptografado
              </CheckboxLabel>
            </CheckboxGroup>
          </Form>
        </DrawerBody>

        <DrawerFooter>
          <CancelButton type='button' onClick={onClose}>
            Cancelar
          </CancelButton>
          <PermissionButton
            permission='document:create'
            onClick={handleSubmit}
            disabled={uploading || !file}
            variant='primary'
            type='button'
          >
            <MdSave size={20} />
            {uploading ? 'Enviando...' : 'Fazer Upload'}
          </PermissionButton>
        </DrawerFooter>
      </DrawerContainer>
    </>
  );
};

const DrawerOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  opacity: ${props => (props.$isOpen ? '1' : '0')};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  z-index: 999;
`;

const DrawerContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 500px;
  background: ${props => props.theme.colors.cardBackground};
  box-shadow: -8px 0 32px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.5)'
        : 'rgba(0, 0, 0, 0.15)'};
  border-left: 1px solid ${props => props.theme.colors.border};
  transform: ${props => (props.$isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const DrawerHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
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

const DropZone = styled.div<{ $active: boolean }>`
  border: 2px dashed
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  border-radius: 12px;
  padding: 32px;
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
  gap: 8px;
`;

const UploadIcon = styled.div`
  font-size: 48px;
`;

const UploadText = styled.p`
  font-size: 16px;
  font-weight: 500;
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
`;

const FileIcon = styled.div`
  font-size: 32px;
`;

const FileDetails = styled.div`
  text-align: left;
`;

const FileName = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px 0;
`;

const FileSize = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
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
  margin-top: -4px;
`;

const HelpText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: -4px;
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

const DrawerFooter = styled.div`
  padding: 24px 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
  }
`;

const SaveButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props =>
      props.theme.colors.primaryDark || props.theme.colors.primary};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
