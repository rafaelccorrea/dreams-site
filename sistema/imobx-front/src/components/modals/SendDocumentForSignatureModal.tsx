import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  MdClose,
  MdPerson,
  MdEmail,
  MdPhone,
  MdSchedule,
  MdSend,
  MdCancel,
  MdDescription,
  MdAdd,
  MdDelete,
  MdWarning,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { useClients } from '../../hooks/useClients';
import { useUsers } from '../../hooks/useUsers';
import { useDocumentSignatures } from '../../hooks/useDocumentSignatures';
import { useCompany } from '../../hooks/useCompany';
import { documentSignatureApi } from '../../services/documentSignatureApi';
import type { DocumentModel } from '../../types/document';
import type {
  SignerType,
  DocumentSignature,
} from '../../types/documentSignature';
import { maskCPF, maskPhone, validateEmail } from '../../utils/masks';

interface SendDocumentForSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentModel | null;
  onSuccess?: () => void;
}

interface SignerFormData {
  id: string;
  signerType: SignerType;
  clientId: string;
  userId: string;
  signerName: string;
  signerEmail: string;
  signerPhone: string;
  signerCpf: string;
}

export const SendDocumentForSignatureModal: React.FC<
  SendDocumentForSignatureModalProps
> = ({ isOpen, onClose, document, onSuccess }) => {
  const { selectedCompany } = useCompany();
  const [signers, setSigners] = useState<SignerFormData[]>([
    {
      id: '1',
      signerType: 'external',
      clientId: '',
      userId: '',
      signerName: '',
      signerEmail: '',
      signerPhone: '',
      signerCpf: '',
    },
  ]);
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [sendEmail, setSendEmail] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { clients, fetchClients } = useClients();
  const { users, getUsers } = useUsers();
  const { signatures, refreshSignatures } = useDocumentSignatures(document?.id);

  useEffect(() => {
    if (isOpen && document?.id) {
      if (clients.length === 0) fetchClients();
      if (users.length === 0) getUsers({ limit: 100 });
      refreshSignatures();
    }
  }, [
    isOpen,
    document?.id,
    clients.length,
    fetchClients,
    users.length,
    getUsers,
    refreshSignatures,
  ]);

  // Preencher dados quando selecionar cliente ou usuário
  const handleSignerTypeChange = (
    id: string,
    signerType: SignerType,
    clientId?: string,
    userId?: string
  ) => {
    updateSigner(id, {
      signerType,
      clientId: clientId || '',
      userId: userId || '',
      signerName: '',
      signerEmail: '',
      signerPhone: '',
      signerCpf: '',
    });

    // Preencher dados automaticamente
    setTimeout(() => {
      if (signerType === 'client' && clientId) {
        const client = clients.find(c => c.id === clientId);
        if (client) {
          updateSigner(id, {
            signerName: client.name || '',
            signerEmail: client.email || '',
            signerPhone: client.phone || '',
            signerCpf: client.cpf || '',
          });
        }
      } else if (signerType === 'user' && userId) {
        const user = users.find(u => u.id === userId);
        if (user) {
          updateSigner(id, {
            signerName: user.name || '',
            signerEmail: user.email || '',
            signerPhone: user.phone || '',
          });
        }
      }
    }, 0);
  };

  const handleClose = () => {
    setSigners([
      {
        id: '1',
        signerType: 'external',
        clientId: '',
        userId: '',
        signerName: '',
        signerEmail: '',
        signerPhone: '',
        signerCpf: '',
      },
    ]);
    setExpiresAt('');
    setSendEmail(true);
    setIsCreating(false);
    setShowConfirmModal(false);
    onClose();
  };

  const addSigner = () => {
    setSigners([
      ...signers,
      {
        id: Date.now().toString(),
        signerType: 'external',
        clientId: '',
        userId: '',
        signerName: '',
        signerEmail: '',
        signerPhone: '',
        signerCpf: '',
      },
    ]);
  };

  const removeSigner = (id: string) => {
    if (signers.length > 1) {
      setSigners(signers.filter(s => s.id !== id));
    } else {
      toast.error('É necessário pelo menos um signatário');
    }
  };

  const updateSigner = (id: string, updates: Partial<SignerFormData>) => {
    setSigners(signers.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const validateSigner = (signer: SignerFormData): string | null => {
    if (signer.signerType === 'client' && !signer.clientId) {
      return 'Cliente é obrigatório';
    }
    if (signer.signerType === 'user' && !signer.userId) {
      return 'Usuário é obrigatório';
    }
    if (!signer.signerName.trim()) {
      return 'Nome do signatário é obrigatório';
    }
    if (!signer.signerEmail.trim()) {
      return 'Email do signatário é obrigatório';
    }
    if (!validateEmail(signer.signerEmail)) {
      return 'Email inválido';
    }

    // Verificar duplicatas na lista
    const duplicate = signers.find(
      s =>
        s.id !== signer.id &&
        s.signerEmail.toLowerCase() === signer.signerEmail.toLowerCase()
    );
    if (duplicate) {
      return 'Este email já está na lista de signatários';
    }

    // Verificar se já existe assinatura válida
    const normalizedEmail = signer.signerEmail.trim().toLowerCase();
    let existingSignature: DocumentSignature | undefined;

    if (signer.signerType === 'client' && signer.clientId) {
      existingSignature = signatures.find(
        sig =>
          sig.clientId === signer.clientId &&
          sig.status !== 'expired' &&
          sig.status !== 'cancelled'
      );
    } else if (signer.signerType === 'user' && signer.userId) {
      existingSignature = signatures.find(
        sig =>
          sig.userId === signer.userId &&
          sig.status !== 'expired' &&
          sig.status !== 'cancelled'
      );
    } else {
      existingSignature = signatures.find(
        sig =>
          sig.signerEmail.toLowerCase() === normalizedEmail &&
          !sig.clientId &&
          !sig.userId &&
          sig.status !== 'expired' &&
          sig.status !== 'cancelled'
      );
    }

    if (existingSignature) {
      return `Já existe uma assinatura válida para ${existingSignature.signerName}`;
    }

    return null;
  };

  const validateAllSigners = (): boolean => {
    for (const signer of signers) {
      const error = validateSigner(signer);
      if (error) {
        toast.error(error);
        return false;
      }
    }
    if (expiresAt && new Date(expiresAt) <= new Date()) {
      toast.error('Data de expiração deve ser futura');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!document || !selectedCompany?.id || !validateAllSigners()) return;

    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    if (!document || !selectedCompany?.id) return;

    setShowConfirmModal(false);
    setIsCreating(true);

    try {
      const signersData = signers.map(s => ({
        clientId: s.signerType === 'client' ? s.clientId : undefined,
        userId: s.signerType === 'user' ? s.userId : undefined,
        signerName: s.signerName.trim(),
        signerEmail: s.signerEmail.trim(),
        signerPhone: s.signerPhone
          ? s.signerPhone.replace(/\D/g, '')
          : undefined,
        signerCpf: s.signerCpf ? s.signerCpf.replace(/\D/g, '') : undefined,
      }));

      const response = await documentSignatureApi.createBatchSignatures(
        document.id,
        {
          signers: signersData,
          expiresAt: expiresAt || undefined,
          sendEmail,
        },
        selectedCompany.id
      );

      if (response.success > 0) {
        toast.success(
          `${response.success} assinatura(s) criada(s) com sucesso!`
        );
        if (response.errors.length > 0) {
          response.errors.forEach(err => {
            toast.warning(`${err.signer}: ${err.error}`);
          });
        }
        await refreshSignatures();
        onSuccess?.();
        handleClose();
      } else {
        toast.error('Nenhuma assinatura foi criada. Verifique os erros acima.');
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao enviar documento para assinatura';
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const isFormValid = () => {
    return signers.every(s => {
      if (s.signerType === 'client') return !!s.clientId;
      if (s.signerType === 'user') return !!s.userId;
      return (
        !!s.signerName.trim() &&
        !!s.signerEmail.trim() &&
        validateEmail(s.signerEmail)
      );
    });
  };

  if (!isOpen || !document) return null;

  return (
    <>
      <ModalOverlay onClick={handleClose}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Enviar para Assinatura</ModalTitle>
            <CloseButton onClick={handleClose}>
              <MdClose size={24} />
            </CloseButton>
          </ModalHeader>

          <ModalBody>
            <DocumentInfo>
              <DocumentIcon>
                <MdDescription size={40} />
              </DocumentIcon>
              <DocumentDetails>
                <DocumentName>
                  {document.title || document.originalName}
                </DocumentName>
              </DocumentDetails>
            </DocumentInfo>

            <InfoMessage>
              <MdWarning size={20} />
              <span>
                Adicione todos os signatários agora. Após o envio, não será
                possível adicionar mais signatários.
              </span>
            </InfoMessage>

            {signers.map((signer, index) => (
              <SignerCard key={signer.id}>
                <SignerHeader>
                  <SignerTitle>Signatário {index + 1}</SignerTitle>
                  {signers.length > 1 && (
                    <RemoveButton onClick={() => removeSigner(signer.id)}>
                      <MdDelete size={18} />
                    </RemoveButton>
                  )}
                </SignerHeader>

                <FormGroup>
                  <Label>Tipo de Signatário *</Label>
                  <Select
                    value={signer.signerType}
                    onChange={e =>
                      handleSignerTypeChange(
                        signer.id,
                        e.target.value as SignerType
                      )
                    }
                  >
                    <option value='external'>Signatário Externo</option>
                    <option value='client'>Cliente do Sistema</option>
                    <option value='user'>Usuário do Sistema</option>
                  </Select>
                </FormGroup>

                {signer.signerType === 'client' && (
                  <FormGroup>
                    <Label>Cliente *</Label>
                    <Select
                      value={signer.clientId}
                      onChange={e => {
                        const clientId = e.target.value;
                        updateSigner(signer.id, { clientId });
                        const client = clients.find(c => c.id === clientId);
                        if (client) {
                          updateSigner(signer.id, {
                            signerName: client.name || '',
                            signerEmail: client.email || '',
                            signerPhone: client.phone || '',
                            signerCpf: client.cpf || '',
                          });
                        }
                      }}
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
                )}

                {signer.signerType === 'user' && (
                  <FormGroup>
                    <Label>Usuário *</Label>
                    <Select
                      value={signer.userId}
                      onChange={e => {
                        const userId = e.target.value;
                        updateSigner(signer.id, { userId });
                        const user = users.find(u => u.id === userId);
                        if (user) {
                          updateSigner(signer.id, {
                            signerName: user.name || '',
                            signerEmail: user.email || '',
                            signerPhone: user.phone || '',
                          });
                        }
                      }}
                      required
                    >
                      <option value=''>Selecione um usuário</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} {user.email && `(${user.email})`}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                )}

                <FormGroup>
                  <Label>
                    <MdPerson size={16} />
                    Nome do Signatário *
                  </Label>
                  <Input
                    type='text'
                    placeholder='Nome completo'
                    value={signer.signerName}
                    onChange={e =>
                      updateSigner(signer.id, { signerName: e.target.value })
                    }
                    disabled={signer.signerType !== 'external'}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <MdEmail size={16} />
                    Email do Signatário *
                  </Label>
                  <Input
                    type='email'
                    placeholder='email@exemplo.com'
                    value={signer.signerEmail}
                    onChange={e =>
                      updateSigner(signer.id, { signerEmail: e.target.value })
                    }
                    disabled={signer.signerType !== 'external'}
                    required
                  />
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <Label>
                      <MdPhone size={16} />
                      Telefone
                    </Label>
                    <Input
                      type='text'
                      placeholder='(00) 00000-0000'
                      value={signer.signerPhone}
                      onChange={e =>
                        updateSigner(signer.id, {
                          signerPhone: maskPhone(e.target.value),
                        })
                      }
                      disabled={signer.signerType !== 'external'}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>CPF</Label>
                    <Input
                      type='text'
                      placeholder='000.000.000-00'
                      value={signer.signerCpf}
                      onChange={e =>
                        updateSigner(signer.id, {
                          signerCpf: maskCPF(e.target.value),
                        })
                      }
                      disabled={signer.signerType !== 'external'}
                      maxLength={14}
                    />
                  </FormGroup>
                </FormRow>
              </SignerCard>
            ))}

            <AddSignerButton onClick={addSigner}>
              <MdAdd size={20} />
              Adicionar Signatário
            </AddSignerButton>

            <FormGroup>
              <Label>
                <MdSchedule size={16} />
                Data de Expiração (opcional)
              </Label>
              <Input
                type='datetime-local'
                value={expiresAt}
                onChange={e => setExpiresAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
              <HelperText>Aplicar a todos os signatários</HelperText>
            </FormGroup>

            <FormGroup>
              <CheckboxContainer>
                <Checkbox
                  type='checkbox'
                  checked={sendEmail}
                  onChange={e => setSendEmail(e.target.checked)}
                  disabled={isCreating}
                />
                <CheckboxLabel>
                  Enviar email automaticamente com link de assinatura para todos
                  os signatários
                </CheckboxLabel>
              </CheckboxContainer>
            </FormGroup>

            <ButtonGroup>
              <Button
                onClick={handleClose}
                $variant='secondary'
                disabled={isCreating}
              >
                <MdCancel size={18} />
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isCreating || !isFormValid()}
                $variant='primary'
              >
                {isCreating ? (
                  <>
                    <LoadingSpinner />
                    Enviando...
                  </>
                ) : (
                  <>
                    <MdSend size={18} />
                    Enviar para Assinatura ({signers.length} signatário
                    {signers.length > 1 ? 's' : ''})
                  </>
                )}
              </Button>
            </ButtonGroup>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <ConfirmModalOverlay onClick={() => setShowConfirmModal(false)}>
          <ConfirmModalContent onClick={e => e.stopPropagation()}>
            <ConfirmIcon>
              <MdWarning size={48} />
            </ConfirmIcon>
            <ConfirmTitle>Atenção!</ConfirmTitle>
            <ConfirmMessage>
              Após enviar este documento para assinatura,{' '}
              <strong>não será possível adicionar mais signatários</strong>.
              <br />
              <br />
              Você está prestes a enviar para{' '}
              <strong>
                {signers.length} signatário{signers.length > 1 ? 's' : ''}
              </strong>
              .
              <br />
              <br />
              Deseja continuar?
            </ConfirmMessage>
            <ConfirmButtonGroup>
              <ConfirmButton
                onClick={() => setShowConfirmModal(false)}
                $variant='secondary'
              >
                <MdCancel size={18} />
                Cancelar
              </ConfirmButton>
              <ConfirmButton
                onClick={confirmSubmit}
                $variant='primary'
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <LoadingSpinner />
                    Enviando...
                  </>
                ) : (
                  <>
                    <MdSend size={18} />
                    Confirmar e Enviar
                  </>
                )}
              </ConfirmButton>
            </ConfirmButtonGroup>
          </ConfirmModalContent>
        </ConfirmModalOverlay>
      )}
    </>
  );
};

// Styled Components
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 999999;
  padding: 100px 20px 40px;
  overflow-y: auto;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  width: 100%;
  max-width: 1000px;
  max-height: calc(100vh - 200px);
  margin-top: 0;
  overflow: hidden;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.surface} 0%,
    ${props => props.theme.colors.background} 100%
  );
  border-bottom: 1px solid ${props => props.theme.colors.border};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.primary}80,
      transparent
    );
  }
`;

const ModalTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: ${props => props.theme.colors.primary};
    border-radius: 2px;
  }
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
    transform: rotate(90deg);
    border-color: ${props => props.theme.colors.primary}40;
  }
`;

const ModalBody = styled.div`
  padding: 32px;
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.primary}40;
    }
  }
`;

const DocumentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.background} 0%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  border-radius: 16px;
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const DocumentIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const DocumentDetails = styled.div`
  flex: 1;
`;

const DocumentName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const InfoMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.warningBackground || '#fef3c7'};
  border: 1px solid ${props => props.theme.colors.warningBorder || '#f59e0b'};
  border-radius: 12px;
  margin-bottom: 24px;
  color: ${props => props.theme.colors.warningText || '#92400e'};
  font-size: 14px;
  line-height: 1.5;

  svg {
    flex-shrink: 0;
    color: ${props => props.theme.colors.warning || '#f59e0b'};
  }
`;

const SignerCard = styled.div`
  background: ${props =>
    props.theme.colors.cardBackground || props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SignerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SignerTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const RemoveButton = styled.button`
  background: ${props => props.theme.colors.error}15;
  border: 1px solid ${props => props.theme.colors.error}40;
  color: ${props => props.theme.colors.error};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.error}25;
    transform: scale(1.05);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 10px;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 14px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow:
      0 0 0 4px ${props => props.theme.colors.primary}15,
      0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 14px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 18px center;
  padding-right: 40px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow:
      0 0 0 4px ${props => props.theme.colors.primary}15,
      0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const HelperText = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 6px;
`;

const AddSignerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: ${props => props.theme.colors.background};
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 20px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
    color: ${props => props.theme.colors.primary};
  }
`;

const CheckboxContainer = styled.div`
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
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primary}dd 100%);
        color: white;
        box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px ${props.theme.colors.primary}60;
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;
    }
    return `
      background: ${props.theme.colors.background};
      color: ${props.theme.colors.text};
      border: 2px solid ${props.theme.colors.border};
      
      &:hover:not(:disabled) {
        background: ${props.theme.colors.backgroundSecondary};
        border-color: ${props.theme.colors.primary}40;
        transform: translateY(-1px);
      }
    `;
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    background: ${props =>
      props.$variant === 'primary'
        ? props.theme.colors.backgroundSecondary
        : props.theme.colors.background} !important;
    color: ${props => props.theme.colors.textSecondary} !important;
    box-shadow: none !important;
  }
`;

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

// Modal de Confirmação
const ConfirmModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ConfirmModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  padding: 32px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid ${props => props.theme.colors.border};
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: center;
`;

const ConfirmIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.warning || '#f59e0b'};
`;

const ConfirmTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
`;

const ConfirmMessage = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 32px 0;

  strong {
    color: ${props => props.theme.colors.text};
    font-weight: 600;
  }
`;

const ConfirmButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ConfirmButton = styled(Button)``;
