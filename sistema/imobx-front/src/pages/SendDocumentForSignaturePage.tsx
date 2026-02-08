import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MdArrowBack,
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
import { Layout } from '../components/layout/Layout';
import { useClients } from '../hooks/useClients';
import { useUsers } from '../hooks/useUsers';
import { useDocumentSignatures } from '../hooks/useDocumentSignatures';
import { useCompany } from '../hooks/useCompany';
import { documentSignatureApi } from '../services/documentSignatureApi';
import { fetchDocumentById } from '../services/documentApi';
import type { SignerType, DocumentSignature } from '../types/documentSignature';
import { maskCPF, maskPhone, validateEmail } from '../utils/masks';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  BackButton,
  FormContainer,
  Section,
  SectionHeader,
  SectionTitle,
  FormActions,
  Button as FormButton,
} from '../styles/pages/ClientFormPageStyles';
import {
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  ErrorContainer,
  ErrorMessage,
  InfoMessage,
  FormGroup,
  FormRow,
  Label,
  Input,
  Select,
  HelperText,
  AddSignerButton,
  CheckboxContainer,
  Checkbox,
  CheckboxLabel,
  ConfirmModalOverlay,
  ConfirmModalContent,
  ConfirmIcon,
  ConfirmTitle,
  ConfirmMessage,
  ConfirmButtonGroup,
  ConfirmButton,
  RemoveButton,
} from '../styles/pages/SendDocumentForSignaturePageStyles';

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

export const SendDocumentForSignaturePage: React.FC = () => {
  const { id: documentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
  const { signatures, refreshSignatures } = useDocumentSignatures(documentId);
  const hasLoadedData = useRef(false);

  useEffect(() => {
    const loadDocument = async () => {
      if (!documentId) {
        toast.error('Documento não encontrado');
        navigate('/documents');
        return;
      }

      setLoading(true);
      try {
        const doc = await fetchDocumentById(documentId);
        if (doc) {
          setDocument(doc);
        } else {
          toast.error('Documento não encontrado');
          navigate('/documents');
        }
      } catch (error) {
        toast.error('Erro ao carregar documento');
        navigate('/documents');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentId, navigate]);

  useEffect(() => {
    if (document?.id && !hasLoadedData.current) {
      hasLoadedData.current = true;
      if (clients.length === 0) fetchClients();
      if (users.length === 0) getUsers({ limit: 100 });
      refreshSignatures();
    }
  }, [
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

  const handleBack = () => {
    navigate(`/documents/${documentId}`);
  };

  const addSigner = () => {
    if (signers.length >= 3) {
      toast.warning('Máximo de 3 signatários por documento');
      return;
    }
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

  const handleSubmit = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!document || !selectedCompany?.id) {
      toast.error('Documento ou empresa não encontrado');
      return;
    }

    if (!validateAllSigners()) {
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    if (!document || !selectedCompany?.id || !documentId) return;

    setShowConfirmModal(false);
    setIsCreating(true);

    const signersData = signers.map(s => ({
      clientId: s.signerType === 'client' ? s.clientId : undefined,
      userId: s.signerType === 'user' ? s.userId : undefined,
      signerName: s.signerName.trim(),
      signerEmail: s.signerEmail.trim(),
      signerPhone: s.signerPhone ? s.signerPhone.replace(/\D/g, '') : undefined,
      signerCpf: s.signerCpf ? s.signerCpf.replace(/\D/g, '') : undefined,
    }));

    const promise = documentSignatureApi.createBatchSignatures(
      documentId,
      {
        signers: signersData,
        expiresAt: expiresAt || undefined,
        sendEmail,
      },
      selectedCompany.id
    );

    toast.promise(
      promise,
      {
        pending: 'Enviando documento para assinatura...',
        success: {
          render({ data }: any) {
            const response = data;
            if (response.success > 0) {
              if (response.errors && response.errors.length > 0) {
                response.errors.forEach((err: any) => {
                  toast.warning(
                    `${err.signer || err.signerEmail}: ${err.error || err.message}`
                  );
                });
              }
              // Fechar a tela e navegar após sucesso
              setTimeout(() => {
                navigate(`/documents/${documentId}`);
              }, 500);
              return `${response.success} assinatura(s) criada(s) com sucesso!`;
            } else {
              throw new Error(
                'Nenhuma assinatura foi criada. Verifique os erros acima.'
              );
            }
          },
        },
        error: {
          render({ data }: any) {
            const errorMessage =
              data?.response?.data?.message ||
              data?.message ||
              'Erro ao enviar documento para assinatura';
            return errorMessage;
          },
        },
      },
      {
        position: 'top-center',
        autoClose: 3000,
      }
    );

    try {
      const response = await promise;
      // Não precisa chamar refreshSignatures aqui pois a navegação vai fechar a página
      // e a página de detalhes do documento vai recarregar os dados
    } catch (error) {
      // Erro já tratado pelo toast.promise
      setIsCreating(false);
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

  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>Carregando documento...</LoadingText>
            </LoadingContainer>
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

  if (!document) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <ErrorContainer>
              <ErrorMessage>Documento não encontrado</ErrorMessage>
              <BackButton onClick={() => navigate('/documents')}>
                <MdArrowBack size={20} />
                Voltar para Documentos
              </BackButton>
            </ErrorContainer>
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Enviar para Assinatura</PageTitle>
              <PageSubtitle>
                Adicione todos os signatários para este documento
              </PageSubtitle>
            </PageTitleContainer>
            <BackButton onClick={handleBack}>
              <MdArrowBack size={20} />
              Voltar
            </BackButton>
          </PageHeader>

          {/* Informações do Documento */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <MdDescription size={20} />
                {document.title || document.originalName}
              </SectionTitle>
            </SectionHeader>
          </Section>

          {/* Aviso */}
          <InfoMessage>
            <MdWarning size={20} />
            <span>
              Adicione todos os signatários agora. Após o envio, não será
              possível adicionar mais signatários.
            </span>
          </InfoMessage>

          <FormContainer>
            {signers.map((signer, index) => (
              <Section key={signer.id}>
                <SectionHeader>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <SectionTitle>Signatário {index + 1}</SectionTitle>
                    {signers.length > 1 && (
                      <RemoveButton onClick={() => removeSigner(signer.id)}>
                        <MdDelete size={18} />
                        Remover
                      </RemoveButton>
                    )}
                  </div>
                </SectionHeader>

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
              </Section>
            ))}

            {signers.length < 3 ? (
              <AddSignerButton onClick={addSigner}>
                <MdAdd size={20} />
                Adicionar Signatário
              </AddSignerButton>
            ) : (
              <InfoMessage>
                <MdWarning size={20} />
                <span>Limite de 3 signatários por documento atingido</span>
              </InfoMessage>
            )}

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

            <FormActions>
              <FormButton
                type='button'
                onClick={handleBack}
                $variant='secondary'
                disabled={isCreating}
              >
                <MdCancel size={18} />
                Cancelar
              </FormButton>
              <FormButton
                type='button'
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
              </FormButton>
            </FormActions>
          </FormContainer>
        </PageContent>
      </PageContainer>

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
    </Layout>
  );
};
