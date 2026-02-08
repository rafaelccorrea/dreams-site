import React, { useState, useEffect, useCallback } from 'react';
import {
  MdClose,
  MdSend,
  MdPerson,
  MdEmail,
  MdAdd,
  MdDelete,
  MdLink,
  MdCheckCircle,
} from 'react-icons/md';
import { showSuccess, showError } from '../../utils/notifications';
import {
  listarAssinaturasProposta,
  enviarPropostaParaAssinatura,
  obterLinkAssinaturaProposta,
  type ProposalSignature,
  type AssinaturaSignerInput,
  type SendProposalSignaturesPayload,
} from '../../services/fichaPropostaApi';
import styled, { keyframes } from 'styled-components';

// --- Cores e tema (compatível com Ficha) ---
const colors = {
  primary: '#A63126',
  primaryHover: '#8B251C',
  primaryLight: 'rgba(166, 49, 38, 0.08)',
  danger: '#dc3545',
  dangerHover: '#c82333',
  success: '#28a745',
  successBg: '#d4edda',
  warning: '#ffc107',
  warningBg: '#fff3cd',
  rejected: '#dc3545',
  rejectedBg: '#f8d7da',
  pending: '#6c757d',
  pendingBg: '#e9ecef',
  border: '#dee2e6',
  text: '#212529',
  textSecondary: '#6c757d',
  bg: '#fff',
  bgSecondary: '#f8f9fa',
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// --- Overlay e container responsivos ---
const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: ${p => (p.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 16px;
  animation: ${fadeIn} 0.2s ease-out;
  overflow-y: auto;

  @media (max-width: 480px) {
    padding: 12px;
    align-items: flex-start;
    padding-top: 24px;
  }
`;

const Container = styled.div`
  background: ${colors.bg};
  border-radius: 20px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  max-width: 560px;
  width: 100%;
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.25s ease-out;

  @media (max-width: 600px) {
    max-width: 100%;
    border-radius: 16px;
    max-height: calc(100vh - 24px);
  }

  @media (max-width: 480px) {
    border-radius: 14px;
    max-height: none;
  }
`;

const Header = styled.div`
  padding: 24px 24px 20px;
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    padding: 20px 20px 16px;
  }
`;

const Title = styled.h2`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${colors.text};
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.3;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const CloseBtn = styled.button`
  width: 40px;
  height: 40px;
  min-width: 40px;
  border: none;
  background: ${colors.bgSecondary};
  color: ${colors.textSecondary};
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s,
    color 0.2s;

  &:hover {
    background: ${colors.border};
    color: ${colors.text};
  }

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
    min-width: 44px;
  }
`;

const Body = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const Footer = styled.div`
  padding: 20px 24px 24px;
  border-top: 1px solid ${colors.border};
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
  flex-shrink: 0;

  @media (max-width: 480px) {
    padding: 16px 20px 20px;
    flex-direction: column-reverse;

    button {
      width: 100%;
      min-height: 48px;
    }
  }
`;

// --- Formulário moderno ---
const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  background: ${colors.bg};
  color: ${colors.text};
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &::placeholder {
    color: ${colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryLight};
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    min-height: 48px;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  background: ${colors.bg};
  color: ${colors.text};
  resize: vertical;
  min-height: 80px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &::placeholder {
    color: ${colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryLight};
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  font-size: 0.9375rem;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  background: ${colors.bg};
  color: ${colors.text};
  min-height: 44px;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }

  @media (max-width: 480px) {
    min-height: 48px;
  }
`;

const CheckboxRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px 24px;
  margin-bottom: 20px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.9375rem;
  color: ${colors.text};

  input {
    width: 20px;
    height: 20px;
    accent-color: ${colors.primary};
    cursor: pointer;
  }
`;

const HelperText = styled.p`
  font-size: 0.8125rem;
  color: ${colors.textSecondary};
  margin: 6px 0 0 0;
  line-height: 1.45;
`;

// --- Signatários ---
const SignerRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 12px;
  flex-wrap: wrap;

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

const SignerFields = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 520px) {
    flex-direction: column;

    select,
    input {
      width: 100%;
    }
  }
`;

const BtnPrimary = styled.button`
  padding: 12px 20px;
  font-size: 0.9375rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  background: ${colors.primary};
  color: white;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    background 0.2s,
    transform 0.1s;

  &:hover:not(:disabled) {
    background: ${colors.primaryHover};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    min-height: 48px;
    padding: 14px 20px;
  }
`;

const BtnSecondary = styled(BtnPrimary)`
  background: ${colors.bgSecondary};
  color: ${colors.text};

  &:hover:not(:disabled) {
    background: ${colors.border};
  }
`;

const BtnDanger = styled(BtnPrimary)`
  background: ${colors.danger};

  &:hover:not(:disabled) {
    background: ${colors.dangerHover};
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const BtnAdd = styled(BtnSecondary)`
  margin-top: 8px;
  width: 100%;
  border: 2px dashed ${colors.border};

  &:hover {
    border-color: ${colors.primary};
    color: ${colors.primary};
  }
`;

// --- Lista de assinaturas (cards modernos) ---
const SignaturesList = styled.div`
  margin-top: 8px;
`;

const ListTitle = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.text};
  margin: 0 0 8px 0;
`;

const ListHelper = styled.p`
  font-size: 0.8125rem;
  color: ${colors.textSecondary};
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const SignatureCard = styled.div`
  padding: 16px 18px;
  background: ${colors.bgSecondary};
  border: 1px solid ${colors.border};
  border-radius: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    padding: 14px 16px;
  }
`;

const SignatureMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
`;

const SignatureName = styled.span`
  font-weight: 600;
  color: ${colors.text};
  font-size: 0.9375rem;
`;

const SignatureEmail = styled.span`
  font-size: 0.8125rem;
  color: ${colors.textSecondary};
`;

const StatusBadge = styled.span<{ $status: string }>`
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: ${p =>
    p.$status === 'signed'
      ? colors.successBg
      : p.$status === 'rejected'
        ? colors.rejectedBg
        : p.$status === 'viewed'
          ? colors.warningBg
          : colors.pendingBg};
  color: ${p =>
    p.$status === 'signed'
      ? '#155724'
      : p.$status === 'rejected'
        ? '#721c24'
        : p.$status === 'viewed'
          ? '#856404'
          : '#495057'};
`;

const SignatureDate = styled.span`
  font-size: 0.75rem;
  color: ${colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const BtnLink = styled.button`
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  background: ${colors.primary};
  color: white;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: ${colors.primaryHover};
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
    min-height: 44px;
  }
`;

// --- Loading ---
const LoadingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: ${colors.textSecondary};
  font-size: 0.9375rem;
`;

// ---
export interface PropostaAssinaturasModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: string;
  proposalNumber: string;
  userCpf: string;
  userTipo: 'gestor' | 'corretor';
  onSent?: () => void;
}

const ACTIONS: { value: AssinaturaSignerInput['action']; label: string }[] = [
  { value: 'SIGN', label: 'Assinar' },
  { value: 'APPROVE', label: 'Aprovar' },
  { value: 'RECOGNIZE', label: 'Reconhecer' },
  { value: 'SIGN_AS_A_WITNESS', label: 'Testemunhar' },
];

export const PropostaAssinaturasModal: React.FC<
  PropostaAssinaturasModalProps
> = ({
  isOpen,
  onClose,
  proposalId,
  proposalNumber,
  userCpf,
  userTipo,
  onSent,
}) => {
  const [signatures, setSignatures] = useState<ProposalSignature[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingLinkId, setLoadingLinkId] = useState<string | null>(null);

  const [documentName, setDocumentName] = useState('');
  const [documentMessage, setDocumentMessage] = useState('');
  const [refusable, setRefusable] = useState(true);
  const [sortable, setSortable] = useState(true);
  const [signers, setSigners] = useState<
    Array<{
      type: 'email' | 'name';
      email?: string;
      name?: string;
      action: AssinaturaSignerInput['action'];
    }>
  >([{ type: 'email', email: '', action: 'SIGN' }]);

  const loadSignatures = useCallback(async () => {
    if (!proposalId || !isOpen || !userCpf || !userTipo) return;
    setLoading(true);
    try {
      const list = await listarAssinaturasProposta(
        proposalId,
        userCpf,
        userTipo
      );
      setSignatures(list);
      if (list.length === 0 && !documentName) {
        setDocumentName(`Proposta de Compra ${proposalNumber}`);
        setDocumentMessage('Por favor, assine a proposta.');
      }
    } catch (err: any) {
      showError(err?.message || 'Erro ao carregar assinaturas.');
      setSignatures([]);
    } finally {
      setLoading(false);
    }
  }, [proposalId, isOpen, proposalNumber, userCpf, userTipo, documentName]);

  useEffect(() => {
    if (isOpen && proposalId) loadSignatures();
  }, [isOpen, proposalId, loadSignatures]);

  const addSigner = () => {
    setSigners(s => [...s, { type: 'email', email: '', action: 'SIGN' }]);
  };

  const removeSigner = (index: number) => {
    if (signers.length <= 1) return;
    setSigners(s => s.filter((_, i) => i !== index));
  };

  const updateSigner = (index: number, field: string, value: string) => {
    setSigners(s => {
      const next = [...s];
      if (field === 'type') {
        next[index] = {
          ...next[index],
          type: value as 'email' | 'name',
          email: undefined,
          name: undefined,
        };
      } else if (field === 'email')
        next[index] = { ...next[index], email: value };
      else if (field === 'name') next[index] = { ...next[index], name: value };
      else if (field === 'action')
        next[index] = {
          ...next[index],
          action: value as AssinaturaSignerInput['action'],
        };
      return next;
    });
  };

  const handleSend = async () => {
    const nameTrim = documentName.trim();
    if (!nameTrim) {
      showError('Informe o nome do documento.');
      return;
    }
    const signersPayload: AssinaturaSignerInput[] = signers
      .map(s => {
        if (s.type === 'email') {
          const email = (s.email || '').trim();
          if (!email) return null;
          return { email, action: s.action };
        }
        const name = (s.name || '').trim();
        if (!name) return null;
        return { name, action: s.action };
      })
      .filter((s): s is AssinaturaSignerInput => s != null);
    if (signersPayload.length === 0) {
      showError('Adicione ao menos um signatário (email ou nome).');
      return;
    }
    const payload: SendProposalSignaturesPayload = {
      document: {
        name: nameTrim,
        message: documentMessage.trim() || undefined,
        refusable,
        sortable,
      },
      signers: signersPayload,
    };
    setSending(true);
    try {
      await enviarPropostaParaAssinatura(
        proposalId,
        userCpf,
        userTipo,
        payload
      );
      showSuccess('Proposta enviada para assinatura.');
      onSent?.();
      await loadSignatures();
    } catch (err: any) {
      showError(err?.message || 'Erro ao enviar para assinatura.');
    } finally {
      setSending(false);
    }
  };

  const handleCopyLink = async (sig: ProposalSignature) => {
    if (sig.signatureUrl) {
      await navigator.clipboard.writeText(sig.signatureUrl);
      showSuccess(
        'Link de assinatura copiado. Envie apenas ao signatário correspondente.'
      );
      return;
    }
    setLoadingLinkId(sig.id);
    try {
      const { short_link } = await obterLinkAssinaturaProposta(
        proposalId,
        sig.id,
        userCpf,
        userTipo
      );
      await navigator.clipboard.writeText(short_link);
      showSuccess(
        'Link de assinatura copiado. Envie apenas ao signatário correspondente.'
      );
    } catch (err: any) {
      showError(err?.message || 'Erro ao obter link.');
    } finally {
      setLoadingLinkId(null);
    }
  };

  const alreadySent = signatures.length > 0;

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <Container onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Assinaturas – {proposalNumber}</Title>
          <CloseBtn type='button' onClick={onClose} aria-label='Fechar'>
            <MdClose size={22} />
          </CloseBtn>
        </Header>
        <Body>
          {loading ? (
            <LoadingWrap>Carregando assinaturas...</LoadingWrap>
          ) : (
            <>
              {alreadySent && (
                <SignaturesList>
                  <ListTitle>Signatários</ListTitle>
                  <ListHelper>
                    Envie o link de assinatura apenas ao signatário
                    correspondente (cada um recebe seu próprio link).
                  </ListHelper>
                  {signatures.map(sig => (
                    <SignatureCard key={sig.id}>
                      <SignatureMeta>
                        {sig.signerEmail ? (
                          <MdEmail
                            size={20}
                            style={{ color: colors.textSecondary }}
                          />
                        ) : (
                          <MdPerson
                            size={20}
                            style={{ color: colors.textSecondary }}
                          />
                        )}
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: '8px 12px',
                          }}
                        >
                          <SignatureName>
                            {sig.signerName || sig.signerEmail || '—'}
                          </SignatureName>
                          {sig.signerEmail && (
                            <SignatureEmail>({sig.signerEmail})</SignatureEmail>
                          )}
                          <StatusBadge $status={sig.status}>
                            {sig.status === 'signed'
                              ? 'Assinado'
                              : sig.status === 'rejected'
                                ? 'Rejeitado'
                                : sig.status === 'viewed'
                                  ? 'Visualizado'
                                  : 'Pendente'}
                          </StatusBadge>
                          {sig.signedAt && (
                            <SignatureDate>
                              <MdCheckCircle size={14} />{' '}
                              {new Date(sig.signedAt).toLocaleString('pt-BR')}
                            </SignatureDate>
                          )}
                        </div>
                      </SignatureMeta>
                      {sig.status !== 'signed' && sig.status !== 'rejected' && (
                        <BtnLink
                          type='button'
                          onClick={() => handleCopyLink(sig)}
                          disabled={loadingLinkId === sig.id}
                        >
                          {loadingLinkId === sig.id ? (
                            'Aguarde...'
                          ) : (
                            <>
                              <MdLink size={18} /> Link de assinatura
                            </>
                          )}
                        </BtnLink>
                      )}
                    </SignatureCard>
                  ))}
                </SignaturesList>
              )}

              {!alreadySent && (
                <>
                  <FormGroup>
                    <Label>Nome do documento</Label>
                    <Input
                      type='text'
                      value={documentName}
                      onChange={e => setDocumentName(e.target.value)}
                      placeholder='Ex: Proposta de Compra 2025-001'
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Mensagem ao signatário (opcional)</Label>
                    <Textarea
                      value={documentMessage}
                      onChange={e => setDocumentMessage(e.target.value)}
                      placeholder='Por favor, assine este documento.'
                      rows={2}
                    />
                  </FormGroup>
                  <CheckboxRow>
                    <CheckboxLabel>
                      <input
                        type='checkbox'
                        checked={refusable}
                        onChange={e => setRefusable(e.target.checked)}
                      />
                      Permitir rejeitar
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <input
                        type='checkbox'
                        checked={sortable}
                        onChange={e => setSortable(e.target.checked)}
                      />
                      Ordem de assinatura
                    </CheckboxLabel>
                  </CheckboxRow>

                  <FormGroup>
                    <Label>Signatários</Label>
                    <HelperText>
                      Use e-mail para envio automático; use nome para gerar link
                      e enviar por WhatsApp.
                    </HelperText>
                    {signers.map((s, i) => (
                      <SignerRow key={i}>
                        <SignerFields>
                          <Select
                            value={s.type}
                            onChange={e =>
                              updateSigner(i, 'type', e.target.value)
                            }
                            style={{ minWidth: 100 }}
                          >
                            <option value='email'>E-mail</option>
                            <option value='name'>Nome</option>
                          </Select>
                          {s.type === 'email' ? (
                            <Input
                              type='email'
                              value={s.email || ''}
                              onChange={e =>
                                updateSigner(i, 'email', e.target.value)
                              }
                              placeholder='email@exemplo.com'
                              style={{ flex: 1, minWidth: 140 }}
                            />
                          ) : (
                            <Input
                              type='text'
                              value={s.name || ''}
                              onChange={e =>
                                updateSigner(i, 'name', e.target.value)
                              }
                              placeholder='Nome do signatário'
                              style={{ flex: 1, minWidth: 140 }}
                            />
                          )}
                          <Select
                            value={s.action}
                            onChange={e =>
                              updateSigner(i, 'action', e.target.value)
                            }
                            style={{ minWidth: 120 }}
                          >
                            {ACTIONS.map(a => (
                              <option key={a.value} value={a.value}>
                                {a.label}
                              </option>
                            ))}
                          </Select>
                        </SignerFields>
                        <BtnDanger
                          type='button'
                          onClick={() => removeSigner(i)}
                          disabled={signers.length <= 1}
                        >
                          <MdDelete size={18} /> Remover
                        </BtnDanger>
                      </SignerRow>
                    ))}
                    <BtnAdd type='button' onClick={addSigner}>
                      <MdAdd size={20} /> Adicionar signatário
                    </BtnAdd>
                  </FormGroup>
                </>
              )}
            </>
          )}
        </Body>
        <Footer>
          {!alreadySent && !loading && (
            <BtnPrimary type='button' onClick={handleSend} disabled={sending}>
              {sending ? (
                'Enviando...'
              ) : (
                <>
                  <MdSend size={20} /> Enviar para assinatura
                </>
              )}
            </BtnPrimary>
          )}
          <BtnSecondary type='button' onClick={onClose}>
            Fechar
          </BtnSecondary>
        </Footer>
      </Container>
    </Overlay>
  );
};

export default PropostaAssinaturasModal;
