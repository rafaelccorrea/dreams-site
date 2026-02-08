import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { MdClose, MdAutorenew } from 'react-icons/md';

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetup: () => Promise<{ secret: string; qrCodeDataUrl: string }>;
  onVerify: (code: string) => Promise<boolean>;
}

export const TwoFactorSetupModal: React.FC<TwoFactorSetupModalProps> = ({
  isOpen,
  onClose,
  onSetup,
  onVerify,
}) => {
  const [loading, setLoading] = useState(false);
  const [secret, setSecret] = useState<string>('');
  const [qr, setQr] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Ao fechar o modal, limpar estados para não persistirem entre aberturas
    if (!isOpen) {
      setLoading(false);
      setSecret('');
      setQr('');
      setCode('');
      setError(null);
      setSuccess(false);
      setVerifying(false);
      setCopied(false);
      return;
    }

    const load = async () => {
      if (!isOpen) return;
      // Evitar resetar QR/Secret em cada re-render: só carrega se ainda não temos QR
      if (qr) return;
      setLoading(true);
      setError(null);
      setSuccess(false);
      // Não limpar o código já digitado quando apenas ocorrer erro de verificação
      try {
        const data = await onSetup();
        setSecret(data.secret);
        setQr(data.qrCodeDataUrl);
      } catch (e: any) {
        setError(e?.message || 'Falha ao iniciar configuração do 2FA.');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Configurar 2FA</Title>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </Header>
        <Body>
          {loading ? (
            <CenterFeedback>
              <SpinnerIcon size={20} />
              Gerando QR Code...
            </CenterFeedback>
          ) : success ? (
            <CenterSuccess>
              <SuccessTitle>2FA ativado com sucesso!</SuccessTitle>
              <SuccessSub>Agora sua conta está mais protegida.</SuccessSub>
            </CenterSuccess>
          ) : (
            <>
              <LeftCol>
                <Section>
                  <SectionTitle>QR Code</SectionTitle>
                  <SectionSub>Escaneie no seu app autenticador</SectionSub>
                  <QrWrapper>
                    {qr && <img src={qr} alt='QR Code 2FA' />}
                  </QrWrapper>
                </Section>

                {secret && (
                  <Section>
                    <SectionTitle>Chave secreta</SectionTitle>
                    <SectionSub>
                      Use se não conseguir escanear o QR Code
                    </SectionSub>
                    <SecretRow>
                      <CodeBadge title='Clique para copiar'>{secret}</CodeBadge>
                      <CopyButton
                        type='button'
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(secret);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1500);
                          } catch {
                            /* noop */
                          }
                        }}
                      >
                        {copied ? 'Copiado!' : 'Copiar'}
                      </CopyButton>
                    </SecretRow>
                  </Section>
                )}
              </LeftCol>

              <RightCol>
                <Section>
                  <SectionTitle>Ative a verificação em 2 etapas</SectionTitle>
                  <Instructions>
                    1) Abra seu aplicativo autenticador (Google Authenticator,
                    Authy, etc) e adicione a conta escaneando o QR Code ao lado.
                    <br />
                    2) Digite abaixo o código TOTP de 6 dígitos para concluir a
                    ativação.
                  </Instructions>
                </Section>

                <Section>
                  <FieldLabel>Código TOTP</FieldLabel>
                  <Input
                    placeholder='000000'
                    inputMode='numeric'
                    pattern='\d*'
                    value={code}
                    onChange={e =>
                      setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                  />
                  {error && <ErrorText>{error}</ErrorText>}
                </Section>

                <Actions>
                  <PrimaryButton
                    disabled={code.length !== 6 || verifying}
                    onClick={async () => {
                      setError(null);
                      setVerifying(true);
                      try {
                        const ok = await onVerify(code);
                        if (ok) {
                          setSuccess(true);
                        } else {
                          setError('Código inválido.');
                        }
                      } catch (e: any) {
                        setError(
                          e?.message || 'Não foi possível verificar o código.'
                        );
                      } finally {
                        setVerifying(false);
                      }
                    }}
                  >
                    {verifying ? (
                      <>
                        <SpinnerIcon size={18} />
                        Ativando e entrando...
                      </>
                    ) : (
                      'Ativar 2FA'
                    )}
                  </PrimaryButton>
                </Actions>
              </RightCol>
            </>
          )}
        </Body>
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000000;
  padding: 20px;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  width: 100%;
  max-width: 760px;
  max-height: 88vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    max-width: 90vw;
    max-height: 88vh;
  }

  @media (max-width: 768px) {
    max-width: 95vw;
    max-height: 90vh;
    border-radius: 12px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h3`
  margin: 0;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  border-radius: 6px;
  padding: 6px;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
  }
`;

const Body = styled.div`
  padding: 18px 22px 22px;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 20px 24px;
  overflow-y: auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const LeftCol = styled.div`
  display: grid;
  gap: 18px;
  align-content: start;
`;

const RightCol = styled.div`
  display: grid;
  gap: 18px;
  align-content: start;
`;

const Section = styled.div`
  display: grid;
  gap: 10px;
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const SectionSub = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
`;

const Instructions = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const QrWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;

  img {
    width: 260px;
    height: 260px;
  }

  @media (max-width: 1024px) {
    img {
      width: 230px;
      height: 230px;
    }
  }

  @media (max-width: 768px) {
    img {
      width: 210px;
      height: 210px;
    }
  }
`;

const SecretRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;
`;

const FieldLabel = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const CodeBadge = styled.div`
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 6px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CopyButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 10px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 1.05rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.12em;
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(28, 78, 255, 0.2);
  transition:
    transform 120ms ease,
    box-shadow 120ms ease,
    filter 120ms ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(28, 78, 255, 0.25);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SpinnerIcon = styled(MdAutorenew)`
  animation: ${rotate} 900ms linear infinite;
`;

const ErrorText = styled.div`
  color: #ef4444;
`;

const SuccessText = styled.div`
  color: #10b981;
  font-weight: 700;
`;

const CenterFeedback = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CenterSuccess = styled.div`
  width: 100%;
  min-height: 240px;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 6px;
`;

const SuccessTitle = styled.h4`
  margin: 0;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const SuccessSub = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
`;
