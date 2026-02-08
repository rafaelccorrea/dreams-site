import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useClients } from '../../hooks/useClients';
import { useUploadTokens } from '../../hooks/useUploadTokens';
import { useToast } from '../../hooks/useToast';
import {
  copyToClipboard,
  sendViaWhatsApp,
} from '../../services/uploadTokenApi';

interface CreateUploadTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateUploadTokenModal: React.FC<CreateUploadTokenModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { clients, fetchClients } = useClients();
  const { createToken, sendEmail, loading } = useUploadTokens();
  const { showToast } = useToast();

  const [selectedClientId, setSelectedClientId] = useState('');
  const [expirationDays, setExpirationDays] = useState(3);
  const [notes, setNotes] = useState('');
  const [sendEmailAutomatically, setSendEmailAutomatically] = useState(true);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [createdToken, setCreatedToken] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen, fetchClients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClientId) {
      showToast('Selecione um cliente', 'error');
      return;
    }

    const selectedClient = clients.find(c => c.id === selectedClientId);
    const hasEmail =
      selectedClient?.email && selectedClient.email.trim() !== '';

    // Verificar se marcou para enviar email mas cliente não tem email
    if (sendEmailAutomatically && !hasEmail) {
      showToast(
        'Cliente não possui email cadastrado. Desmarque a opção de envio automático ou adicione um email ao cliente.',
        'error'
      );
      return;
    }

    const result = await createToken({
      clientId: selectedClientId,
      expirationDays,
      notes: notes.trim() || undefined,
    });

    if (result) {
      setCreatedLink(result.uploadUrl);
      setCreatedToken(result);

      // Se marcou para enviar email automaticamente
      if (sendEmailAutomatically && hasEmail) {
        try {
          const emailResult = await sendEmail(result.id);
          if (emailResult) {
            showToast(`Link criado! ${emailResult.message}`, 'success');
          }
        } catch (error: any) {
          showToast(
            `Link criado, mas erro ao enviar email: ${error.message}. Copie o link manualmente.`,
            'warning'
          );
        }
      } else {
        showToast('Link criado com sucesso!', 'success');
      }

      if (onSuccess) {
        onSuccess();
      }
    }
  };

  const handleClose = () => {
    setSelectedClientId('');
    setExpirationDays(3);
    setNotes('');
    setSendEmailAutomatically(true);
    setCreatedLink(null);
    setCreatedToken(null);
    onClose();
  };

  const handleCopyLink = async () => {
    if (createdLink) {
      const success = await copyToClipboard(createdLink);
      if (success) {
        showToast('Link copiado para área de transferência!', 'success');
      } else {
        showToast('Erro ao copiar link', 'error');
      }
    }
  };

  const handleSendWhatsApp = () => {
    if (createdToken) {
      const client = clients.find(c => c.id === createdToken.clientId);
      if (client?.phone) {
        sendViaWhatsApp(
          client.phone,
          createdToken.uploadUrl,
          createdToken.clientName,
          createdToken.expiresAt
        );
      } else {
        showToast('Cliente não possui telefone cadastrado', 'error');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>Criar Link de Upload de Documentos</h2>
          <CloseButton onClick={handleClose}>&times;</CloseButton>
        </ModalHeader>

        {!createdLink ? (
          <form onSubmit={handleSubmit}>
            <ModalBody>
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
                      {client.name} - {client.cpf}
                    </option>
                  ))}
                </Select>
                {selectedClientId &&
                  (() => {
                    const client = clients.find(c => c.id === selectedClientId);
                    const hasEmail =
                      client?.email && client.email.trim() !== '';
                    return hasEmail ? (
                      <HelpText style={{ color: '#10b981' }}>
                        ✓ Email: {client.email}
                      </HelpText>
                    ) : (
                      <HelpText style={{ color: '#f59e0b' }}>
                        ⚠️ Cliente não possui email cadastrado
                      </HelpText>
                    );
                  })()}
              </FormGroup>

              {selectedClientId &&
                (() => {
                  const client = clients.find(c => c.id === selectedClientId);
                  const hasEmail = client?.email && client.email.trim() !== '';
                  return hasEmail ? (
                    <FormGroup>
                      <CheckboxLabel>
                        <Checkbox
                          type='checkbox'
                          checked={sendEmailAutomatically}
                          onChange={e =>
                            setSendEmailAutomatically(e.target.checked)
                          }
                        />
                        <span>Enviar link por email automaticamente</span>
                      </CheckboxLabel>
                      <HelpText>
                        O cliente receberá um email com o link e instruções de
                        uso
                      </HelpText>
                    </FormGroup>
                  ) : null;
                })()}

              <FormGroup>
                <Label>Validade (dias) *</Label>
                <Input
                  type='number'
                  min='1'
                  max='3'
                  value={expirationDays}
                  onChange={e => setExpirationDays(Number(e.target.value))}
                  required
                />
                <HelpText>O link expira após 1 a 3 dias</HelpText>
              </FormGroup>

              <FormGroup>
                <Label>Observações</Label>
                <TextArea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder='Ex: Documentos para compra do apartamento'
                  rows={3}
                />
              </FormGroup>
            </ModalBody>

            <ModalFooter>
              <Button type='button' onClick={handleClose} variant='secondary'>
                Cancelar
              </Button>
              <Button type='submit' disabled={loading}>
                {loading ? 'Criando...' : 'Criar Link'}
              </Button>
            </ModalFooter>
          </form>
        ) : (
          <>
            <ModalBody>
              <SuccessMessage>
                <SuccessIcon>✅</SuccessIcon>
                <h3>Link criado com sucesso!</h3>
                <p>Cliente: {createdToken?.clientName}</p>
                <p>
                  Expira em:{' '}
                  {new Date(createdToken?.expiresAt).toLocaleString('pt-BR')}
                </p>
              </SuccessMessage>

              <LinkContainer>
                <LinkInput value={createdLink} readOnly />
              </LinkContainer>

              <ActionsGrid>
                <ActionButton onClick={handleCopyLink}>
                  📋 Copiar Link
                </ActionButton>
                <ActionButton onClick={handleSendWhatsApp}>
                  📱 Enviar via WhatsApp
                </ActionButton>
              </ActionsGrid>
            </ModalBody>

            <ModalFooter>
              <Button type='button' onClick={handleClose}>
                Fechar
              </Button>
            </ModalFooter>
          </>
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
  z-index: 9999;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 20px;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const ModalFooter = styled.div`
  padding: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const HelpText = styled.small`
  display: block;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${({ variant = 'primary', theme }) =>
    variant === 'primary'
      ? `
    background: ${theme.colors.primary};
    color: white;

    &:hover:not(:disabled) {
      background: ${theme.colors.primaryDark || theme.colors.primary};
    }
  `
      : `
    background: transparent;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};

    &:hover:not(:disabled) {
      background: ${theme.colors.hover};
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  margin-bottom: 24px;

  h3 {
    margin: 12px 0 8px 0;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    margin: 4px 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const SuccessIcon = styled.div`
  font-size: 48px;
`;

const LinkContainer = styled.div`
  margin-bottom: 20px;
`;

const LinkInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.text};
  font-family: monospace;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
