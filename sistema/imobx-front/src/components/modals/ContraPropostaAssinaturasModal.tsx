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
  MdPictureAsPdf,
} from 'react-icons/md';
import { showSuccess, showError } from '../../utils/notifications';
import { formatarDataHora } from '../../utils/format';
import {
  listarAssinaturasContraProposta,
  enviarParaAssinaturaContraProposta,
  obterLinkAssinaturaContraProposta,
  getUrlPdfContraProposta,
  type CounterProposalSignatureItem,
  type ContraPropostaSignerInput,
  type ContraPropostaAccessParams,
} from '../../services/contraPropostaApi';
import styled, { keyframes } from 'styled-components';

const colors = {
  primary: '#A63126',
  primaryHover: '#8B251C',
  primaryLight: 'rgba(166, 49, 38, 0.08)',
  danger: '#dc3545',
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

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: ${p => (p.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 12px;
  animation: ${fadeIn} 0.2s ease-out;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 480px) {
    padding: 8px;
    align-items: flex-start;
    padding-top: 24px;
  }
`;

const Container = styled.div`
  background: ${colors.bg};
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 560px;
  width: 100%;
  max-height: calc(100vh - 24px);
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.25s ease-out;

  @media (max-width: 480px) {
    max-height: calc(100vh - 16px);
    border-radius: 16px;
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
    padding: 16px 16px 14px;
  }
`;

const Title = styled.h2`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${colors.text};
  margin: 0;
  line-height: 1.3;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const CloseBtn = styled.button`
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border: none;
  background: ${colors.bgSecondary};
  color: ${colors.textSecondary};
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${colors.border};
    color: ${colors.text};
  }
`;

const Body = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 480px) {
    padding: 16px;
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
    padding: 16px;
    flex-direction: column-reverse;

    button {
      width: 100%;
      min-height: 48px;
    }
  }
`;

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
  min-height: 44px;
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryLight};
  }
  @media (max-width: 480px) {
    min-height: 48px;
    font-size: 16px; /* evita zoom no iOS */
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
  @media (max-width: 480px) {
    min-height: 48px;
  }
`;
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
  gap: 8px;
  &:hover:not(:disabled) {
    background: ${colors.primaryHover};
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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
    background: #c82333;
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
  background: ${p =>
    p.$status === 'signed'
      ? colors.successBg
      : p.$status === 'rejected' ||
          p.$status === 'cancelled' ||
          p.$status === 'expired'
        ? colors.rejectedBg
        : p.$status === 'viewed'
          ? colors.warningBg
          : colors.pendingBg};
  color: ${p =>
    p.$status === 'signed'
      ? '#155724'
      : p.$status === 'rejected' ||
          p.$status === 'cancelled' ||
          p.$status === 'expired'
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
  flex-shrink: 0;
  min-height: 44px;
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
  }
`;
const LoadingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: ${colors.textSecondary};
  font-size: 0.9375rem;
`;
const BtnPdf = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 10px;
  background: ${colors.bgSecondary};
  color: ${colors.text};
  text-decoration: none;
  border: 1px solid ${colors.border};
  margin-bottom: 16px;
  &:hover {
    background: ${colors.border};
  }
`;

const ACTIONS: { value: ContraPropostaSignerInput['action']; label: string }[] =
  [
    { value: 'SIGN', label: 'Assinar' },
    { value: 'APPROVE', label: 'Aprovar' },
    { value: 'RECOGNIZE', label: 'Reconhecer' },
    { value: 'SIGN_AS_A_WITNESS', label: 'Testemunhar' },
  ];

const statusLabel: Record<string, string> = {
  pending: 'Pendente',
  viewed: 'Visualizado',
  signed: 'Assinado',
  rejected: 'Rejeitado',
  expired: 'Expirado',
  cancelled: 'Cancelado',
};

export interface ContraPropostaAssinaturasModalProps {
  isOpen: boolean;
  onClose: () => void;
  contraPropostaId: string;
  proposalNumber?: string;
  accessParams: ContraPropostaAccessParams;
  /** E-mail pré-preenchido ao abrir para envio (ex.: destinatário da contra proposta) */
  defaultRecipientEmail?: string;
  defaultRecipientName?: string;
  onSent?: () => void;
}

export const ContraPropostaAssinaturasModal: React.FC<
  ContraPropostaAssinaturasModalProps
> = ({
  isOpen,
  onClose,
  contraPropostaId,
  proposalNumber,
  accessParams,
  defaultRecipientEmail,
  defaultRecipientName,
  onSent,
}) => {
  const [signatures, setSignatures] = useState<CounterProposalSignatureItem[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingLinkId, setLoadingLinkId] = useState<string | null>(null);
  const [signers, setSigners] = useState<
    Array<{
      type: 'email' | 'name';
      email?: string;
      name?: string;
      action: NonNullable<ContraPropostaSignerInput['action']>;
    }>
  >([
    {
      type: defaultRecipientEmail ? 'email' : 'email',
      email: defaultRecipientEmail || '',
      name: defaultRecipientName,
      action: 'SIGN',
    },
  ]);

  const loadSignatures = useCallback(async () => {
    if (!contraPropostaId || !isOpen) return;
    setLoading(true);
    try {
      const list = await listarAssinaturasContraProposta(
        contraPropostaId,
        accessParams
      );
      setSignatures(list);
    } catch (err: any) {
      showError(err?.message || 'Erro ao carregar assinaturas.');
      setSignatures([]);
    } finally {
      setLoading(false);
    }
  }, [contraPropostaId, isOpen, accessParams]);

  useEffect(() => {
    if (isOpen && contraPropostaId) loadSignatures();
  }, [isOpen, contraPropostaId, loadSignatures]);

  useEffect(() => {
    if (
      isOpen &&
      defaultRecipientEmail &&
      signers.length === 1 &&
      !signers[0].email
    ) {
      setSigners([
        {
          type: 'email',
          email: defaultRecipientEmail,
          name: defaultRecipientName,
          action: 'SIGN',
        },
      ]);
    }
  }, [isOpen, defaultRecipientEmail, defaultRecipientName]);

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
          action: value as NonNullable<ContraPropostaSignerInput['action']>,
        };
      return next;
    });
  };

  const handleSend = async () => {
    const signersPayload: ContraPropostaSignerInput[] = signers
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
      .filter((s): s is ContraPropostaSignerInput => s != null);
    if (signersPayload.length === 0) {
      showError('Adicione ao menos um signatário (e-mail ou nome).');
      return;
    }
    setSending(true);
    try {
      await enviarParaAssinaturaContraProposta(
        contraPropostaId,
        { signers: signersPayload },
        accessParams
      );
      showSuccess('Contra proposta enviada para assinatura.');
      onSent?.();
      await loadSignatures();
    } catch (err: any) {
      showError(
        err?.response?.data?.message ||
          err?.message ||
          'Erro ao enviar para assinatura.'
      );
    } finally {
      setSending(false);
    }
  };

  const handleCopyLink = async (sig: CounterProposalSignatureItem) => {
    if (sig.signatureUrl) {
      await navigator.clipboard.writeText(sig.signatureUrl);
      showSuccess(
        'Link de assinatura copiado. Envie apenas ao signatário correspondente.'
      );
      return;
    }
    setLoadingLinkId(sig.id);
    try {
      const { short_link } = await obterLinkAssinaturaContraProposta(
        contraPropostaId,
        sig.id,
        accessParams
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

  const pdfUrl =
    accessParams.corretorCpf || accessParams.gestorCpf
      ? getUrlPdfContraProposta(contraPropostaId, accessParams)
      : null;

  const alreadySent =
    signatures.length > 0 && signatures.some(s => s.autentiqueDocumentId);

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <Container onClick={e => e.stopPropagation()}>
        <Header>
          <Title>
            Assinaturas – Contra proposta{' '}
            {proposalNumber ? `Ref. ${proposalNumber}` : ''}
          </Title>
          <CloseBtn type='button' onClick={onClose} aria-label='Fechar'>
            <MdClose size={22} />
          </CloseBtn>
        </Header>
        <Body>
          {pdfUrl && (
            <BtnPdf href={pdfUrl} target='_blank' rel='noopener noreferrer'>
              <MdPictureAsPdf size={20} /> Ver PDF da contra proposta
            </BtnPdf>
          )}
          {loading ? (
            <LoadingWrap>Carregando assinaturas...</LoadingWrap>
          ) : (
            <>
              {alreadySent && (
                <SignaturesList>
                  <ListTitle>Signatários</ListTitle>
                  <ListHelper>
                    Envie o link de assinatura apenas ao signatário
                    correspondente.
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
                            {statusLabel[sig.status] || sig.status}
                          </StatusBadge>
                          {sig.signedAt && (
                            <SignatureDate>
                              <MdCheckCircle size={14} />{' '}
                              {formatarDataHora(sig.signedAt)}
                            </SignatureDate>
                          )}
                        </div>
                      </SignatureMeta>
                      {sig.status !== 'signed' &&
                        sig.status !== 'rejected' &&
                        sig.status !== 'expired' &&
                        sig.status !== 'cancelled' && (
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
                    <Label>Signatários</Label>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: colors.textSecondary,
                        margin: '0 0 12px 0',
                      }}
                    >
                      Use e-mail para envio automático; use nome para gerar link
                      e enviar por WhatsApp.
                    </p>
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

export default ContraPropostaAssinaturasModal;
