import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdClose, MdContentCopy, MdEmail, MdWarning } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useClients } from '../../hooks/useClients';
import { useUploadTokens } from '../../hooks/useUploadTokens';
import { PermissionButton } from '../common/PermissionButton';
import type { DocumentModel, UploadToken } from '../../types/document';

interface CreateDocumentUploadLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentModel | null;
}

export const CreateDocumentUploadLinkModal: React.FC<
  CreateDocumentUploadLinkModalProps
> = ({ isOpen, onClose, document }) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [expirationDays, setExpirationDays] = useState<number>(7);
  const [sendEmailAutomatically, setSendEmailAutomatically] =
    useState<boolean>(true);
  const [createdToken, setCreatedToken] = useState<UploadToken | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { clients, fetchClients } = useClients();
  const { createToken, sendEmail } = useUploadTokens();

  useEffect(() => {
    if (isOpen && clients.length === 0) {
      fetchClients();
    }
  }, [isOpen, clients.length, fetchClients]);

  const handleClose = () => {
    setSelectedClientId('');
    setExpirationDays(7);
    setSendEmailAutomatically(true);
    setCreatedToken(null);
    setIsCreating(false);
    onClose();
  };

  const handleCreateLink = async () => {
    if (!selectedClientId || !document) return;

    setIsCreating(true);
    try {
      // Criar token com informações do documento nas notas
      const token = await createToken({
        clientId: selectedClientId,
        expirationDays,
        notes: `Link para upload do documento: ${document.title || document.originalName}`,
      });

      setCreatedToken(token);

      // Enviar email automaticamente se solicitado
      if (sendEmailAutomatically && token.id) {
        try {
          await sendEmail(token.id);
          toast.success('Link criado e enviado por email com sucesso!');
        } catch (emailError) {
          toast.warning('Link criado, mas erro ao enviar email');
        }
      } else {
        toast.success('Link criado com sucesso!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar link');
    } finally {
      setIsCreating(false);
    }
  };

  const copyLinkToClipboard = async () => {
    if (!createdToken?.token) return;

    // Criar URL do frontend para a página pública (considerando base path /sistema)
    const basePath = '/sistema'; // Deve corresponder ao configurado no vite.config.ts
    const frontendUrl = `${window.location.origin}${basePath}/public/upload-documents/${createdToken.token}`;

    try {
      await navigator.clipboard.writeText(frontendUrl);
      toast.success('Link copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar link');
    }
  };

  const sendEmailManually = async () => {
    if (!createdToken?.id) return;

    try {
      await sendEmail(createdToken.id);
      toast.success('Email enviado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar email');
    }
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const hasEmail = selectedClient?.email;

  if (!isOpen || !document) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Criar Link de Upload</ModalTitle>
          <CloseButton onClick={handleClose}>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {!createdToken ? (
            <>
              {/* Informações do Documento */}
              <DocumentInfo>
                <DocumentIcon>📄</DocumentIcon>
                <DocumentDetails>
                  <DocumentName>
                    {document.title || document.originalName}
                  </DocumentName>
                  <DocumentMeta>
                    {document.type} •{' '}
                    {document.fileSize
                      ? `${(document.fileSize / 1024).toFixed(1)} KB`
                      : 'Tamanho desconhecido'}
                  </DocumentMeta>
                </DocumentDetails>
              </DocumentInfo>

              <FormGroup>
                <Label>Cliente para Upload</Label>
                <Select
                  value={selectedClientId}
                  onChange={e => setSelectedClientId(e.target.value)}
                  required
                >
                  <option value=''>Selecione um cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.email && `(${client.email})`}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Validade do Link</Label>
                <Select
                  value={expirationDays}
                  onChange={e => setExpirationDays(Number(e.target.value))}
                >
                  <option value={1}>1 dia</option>
                  <option value={3}>3 dias</option>
                  <option value={7}>7 dias</option>
                  <option value={15}>15 dias</option>
                  <option value={30}>30 dias</option>
                </Select>
              </FormGroup>

              {selectedClientId && (
                <FormGroup>
                  <CheckboxContainer>
                    <Checkbox
                      type='checkbox'
                      id='sendEmail'
                      checked={sendEmailAutomatically}
                      onChange={e =>
                        setSendEmailAutomatically(e.target.checked)
                      }
                    />
                    <CheckboxLabel htmlFor='sendEmail'>
                      Enviar link por email automaticamente
                    </CheckboxLabel>
                  </CheckboxContainer>

                  {!hasEmail && sendEmailAutomatically && (
                    <WarningMessage>
                      <MdWarning size={16} />
                      Cliente selecionado não possui email cadastrado
                    </WarningMessage>
                  )}
                </FormGroup>
              )}
            </>
          ) : (
            <SuccessContent>
              <SuccessIcon>✅</SuccessIcon>
              <SuccessTitle>Link Criado com Sucesso!</SuccessTitle>
              <SuccessDescription>
                O link público foi gerado para o documento "
                {document.title || document.originalName}"
              </SuccessDescription>

              <LinkContainer>
                <LinkLabel>Link Público:</LinkLabel>
                <LinkDisplay>
                  <LinkText>{`${window.location.origin}/sistema/public/upload-documents/${createdToken.token}`}</LinkText>
                  <CopyButton onClick={copyLinkToClipboard}>
                    <MdContentCopy size={16} />
                  </CopyButton>
                </LinkDisplay>
              </LinkContainer>

              <TokenInfo>
                <InfoItem>
                  <InfoLabel>Cliente:</InfoLabel>
                  <InfoValue>{selectedClient?.name}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Expira em:</InfoLabel>
                  <InfoValue>{expirationDays} dia(s)</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Status:</InfoLabel>
                  <InfoValue>Ativo</InfoValue>
                </InfoItem>
              </TokenInfo>

              <ActionButtons>
                <ActionButton onClick={copyLinkToClipboard} variant='primary'>
                  <MdContentCopy size={16} />
                  Copiar Link
                </ActionButton>
                {hasEmail && (
                  <ActionButton onClick={sendEmailManually} variant='secondary'>
                    <MdEmail size={16} />
                    Enviar Email
                  </ActionButton>
                )}
              </ActionButtons>
            </SuccessContent>
          )}
        </ModalBody>

        {!createdToken && (
          <ModalFooter>
            <FooterButton onClick={handleClose} variant='secondary'>
              Cancelar
            </FooterButton>
            <PermissionButton
              permission='document:create'
              onClick={handleCreateLink}
              disabled={
                !selectedClientId ||
                isCreating ||
                (!hasEmail && sendEmailAutomatically)
              }
              variant='primary'
            >
              {isCreating ? 'Criando...' : 'Criar Link'}
            </PermissionButton>
          </ModalFooter>
        )}

        {createdToken && (
          <ModalFooter>
            <FooterButton onClick={handleClose} variant='primary'>
              Fechar
            </FooterButton>
          </ModalFooter>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 0 24px;
`;

const DocumentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  margin-bottom: 24px;
`;

const DocumentIcon = styled.div`
  font-size: 32px;
  flex-shrink: 0;
`;

const DocumentDetails = styled.div`
  flex: 1;
`;

const DocumentName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  margin-bottom: 4px;
`;

const DocumentMeta = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  font-size: 14px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  margin: 0;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const WarningMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.warning};
  font-size: 13px;
  margin-top: 8px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.warning}15;
  border-radius: 8px;
`;

const SuccessContent = styled.div`
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const SuccessTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px;
`;

const SuccessDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px;
`;

const LinkContainer = styled.div`
  margin-bottom: 24px;
`;

const LinkLabel = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  text-align: left;
`;

const LinkDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
`;

const LinkText = styled.div`
  flex: 1;
  font-family: monospace;
  font-size: 13px;
  color: ${props => props.theme.colors.text};
  word-break: break-all;
`;

const CopyButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}dd;
  }
`;

const TokenInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

const InfoItem = styled.div`
  text-align: left;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props =>
    props.variant === 'primary' &&
    `
    background: ${props.theme.colors.primary};
    color: white;

    &:hover {
      background: ${props.theme.colors.primary}dd;
    }
  `}

  ${props =>
    props.variant === 'secondary' &&
    `
    background: ${props.theme.colors.background};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover {
      background: ${props.theme.colors.primary}10;
    }
  `}
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  margin-top: 24px;
`;

const FooterButton = styled.button<{
  variant: 'primary' | 'secondary';
  disabled?: boolean;
}>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props =>
    props.variant === 'primary' &&
    `
    background: ${props.disabled ? props.theme.colors.textSecondary : props.theme.colors.primary};
    color: white;

    &:hover:not(:disabled) {
      background: ${props.theme.colors.primary}dd;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  `}

  ${props =>
    props.variant === 'secondary' &&
    `
    background: ${props.theme.colors.background};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover {
      background: ${props.theme.colors.primary}10;
    }
  `}
`;
