import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdSave,
  MdArrowBack,
  MdInfo,
  MdCheckCircle,
  MdWarning,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { zezinApi } from '../services/zezinApi';
import { showSuccess, showError } from '../utils/notifications';
import { maskPhoneAuto } from '../utils/masks';
import type {
  ZezinConfig,
  CreateZezinConfigRequest,
} from '../types/zezin';

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 40px 64px;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 32px 24px 48px;
  }

  @media (max-width: 480px) {
    padding: 24px 20px 40px;
  }
`;

const PageHeader = styled.header`
  margin-bottom: 48px;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const BackButton = styled.button`
  flex-shrink: 0;
  background: ${props => props.theme.colors.cardBackground || '#fff'};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 12px 20px;
  min-height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}30;
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    gap: 12px;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.6;
  max-width: 520px;
`;

const ConfigCard = styled.div`
  background: ${props => props.theme.colors.cardBackground || '#fff'};
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 28px 24px;
    margin-bottom: 28px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 24px 20px;
    margin-bottom: 24px;
  }
`;

const Section = styled.div`
  margin-bottom: 40px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SectionIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 4px 14px rgba(139, 92, 246, 0.35);
`;

const SectionTitle = styled.h3`
  font-size: 1.1875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: 14px 18px;
  min-height: 48px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.12);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const HelpText = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 6px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.55;
`;

const InfoBox = styled.div<{ $variant?: 'info' | 'success' | 'warning' }>`
  padding: 20px 24px;
  border-radius: 14px;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 32px;

  ${props => {
    if (props.$variant === 'success') {
      return `
        background: #10B98115;
        border: 1px solid #10B98130;
        color: #10B981;
      `;
    }
    if (props.$variant === 'warning') {
      return `
        background: #F59E0B15;
        border: 1px solid #F59E0B30;
        color: #F59E0B;
      `;
    }
    return `
      background: #6366F115;
      border: 1px solid #6366F130;
      color: #6366F1;
    `;
  }}
`;

const StatusBadge = styled.span<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;

  ${props =>
    props.$isActive
      ? `
    background: #10B98120;
    color: #10B981;
  `
      : `
    background: #6B728020;
    color: #6B7280;
  `}
`;

const FooterActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    margin-top: 32px;
    padding-top: 28px;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 28px;
  min-height: 52px;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;

  ${props =>
    props.$variant === 'secondary'
      ? `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    &:hover:not(:disabled) {
      background: ${props.theme.colors.border};
    }
  `
      : `
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
    color: white;
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(139, 92, 246, 0.35);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.error};
  padding: 16px 20px;
  background: ${props => props.theme.colors.error}12;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.error}25;
  margin-bottom: 24px;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ZezinIcon = () => (
  <span style={{ fontSize: '1.5rem' }} title="Zezin">🤖</span>
);

const ZezinConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<CreateZezinConfigRequest>({
    phoneNumberId: '',
    apiToken: '',
    phoneNumber: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [existingConfig, setExistingConfig] = useState<ZezinConfig | null>(null);
  const [availability, setAvailability] = useState<{ available: boolean } | null>(null);

  const loadAvailability = useCallback(async () => {
    try {
      const data = await zezinApi.getAvailability();
      setAvailability(data);
      if (!data.available) {
        setLoading(false);
        return;
      }
    } catch {
      setAvailability({ available: false });
      setLoading(false);
      return;
    }
  }, []);

  const loadConfig = useCallback(async () => {
    try {
      const data = await zezinApi.getConfig();
      setExistingConfig(data);
      if (data) {
        setConfig({
          phoneNumberId: data.phoneNumberId || '',
          apiToken: '', // não preencher token (vem mascarado)
          phoneNumber: data.phoneNumber || '',
          isActive: data.isActive !== false,
        });
      } else {
        setConfig({
          phoneNumberId: '',
          apiToken: '',
          phoneNumber: '',
          isActive: true,
        });
      }
    } catch (e) {
      console.error('Erro ao carregar config Zezin:', e);
      setExistingConfig(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  useEffect(() => {
    if (availability?.available) {
      loadConfig();
    }
  }, [availability?.available, loadConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!config.phoneNumberId?.trim()) {
      setError('ID do número de telefone é obrigatório.');
      return;
    }
    if (!existingConfig && (!config.apiToken || !config.apiToken.trim())) {
      setError('Token de acesso é obrigatório na primeira configuração.');
      return;
    }

    setSaving(true);
    try {
      if (existingConfig && !config.apiToken?.trim()) {
        // Atualização parcial sem alterar token
        await zezinApi.updateConfig({
          phoneNumberId: config.phoneNumberId.trim(),
          phoneNumber: config.phoneNumber?.trim() || undefined,
          isActive: config.isActive !== false,
        });
      } else {
        const toSend: CreateZezinConfigRequest = {
          phoneNumberId: config.phoneNumberId.trim(),
          apiToken: (config.apiToken || '').trim(),
          phoneNumber: config.phoneNumber?.trim() || undefined,
          isActive: config.isActive !== false,
        };
        if (!toSend.apiToken && !existingConfig) {
          setError('Token de acesso é obrigatório.');
          setSaving(false);
          return;
        }
        await zezinApi.createOrUpdateConfig(toSend);
      }
      showSuccess('Configuração do Zezin salva com sucesso!');
      loadConfig();
    } catch (err: any) {
      const msg = err.message || 'Erro ao salvar configuração.';
      setError(msg);
      showError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !availability) {
    return (
      <Layout>
        <PageContainer>
          <div style={{ padding: '64px 40px', textAlign: 'center', color: 'var(--textSecondary, #64748b)', fontSize: '1rem' }}>
            Carregando...
          </div>
        </PageContainer>
      </Layout>
    );
  }

  if (availability && !availability.available) {
    return (
      <Layout>
        <PageContainer>
          <InfoBox $variant="warning">
            <strong>Zezin não disponível</strong>
            <p style={{ margin: '12px 0 0 0' }}>
              O assistente Zezin é exclusivo para administradores no plano Pro
              com o módulo Assistente de IA. Verifique seu plano e permissões.
            </p>
          </InfoBox>
          <BackButton onClick={() => navigate('/integrations')} style={{ marginTop: 24 }}>
            <MdArrowBack size={18} />
            Voltar para Integrações
          </BackButton>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <HeaderTop>
            <TitleSection>
              <Title>
                <ZezinIcon />
                Configuração do Zezin
              </Title>
              <Subtitle>
                Configure número e token do WhatsApp para o assistente Zezin
                enviar mensagens e responder perguntas com base nos dados da empresa.
                O Zezin não fica só na página: quem enviar mensagem para este número no WhatsApp
                também recebe a resposta da IA.
              </Subtitle>
            </TitleSection>
            <BackButton onClick={() => navigate('/integrations')}>
              <MdArrowBack size={18} />
              Voltar
            </BackButton>
          </HeaderTop>
        </PageHeader>

        <form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <InfoBox $variant="info">
            <strong>Zezin na página e no WhatsApp</strong>
            <p style={{ margin: '12px 0 0 0' }}>
              Além de usar a página &quot;Perguntar ao Zezin&quot;, você (e quem tiver o número) pode
              enviar qualquer mensagem para este número no WhatsApp. O Zezin responde com base nos
              dados da empresa (metas, vendas, leads, clientes, etc.) direto no chat.
            </p>
          </InfoBox>

          <ConfigCard>
          {existingConfig && (
            <InfoBox $variant="success" style={{ marginBottom: 28 }}>
              <StatusBadge $isActive={existingConfig.isActive}>
                {existingConfig.isActive ? (
                  <>
                    <MdCheckCircle size={16} />
                    Configuração ativa
                  </>
                ) : (
                  <>
                    <MdWarning size={16} />
                    Configuração inativa
                  </>
                )}
              </StatusBadge>
            </InfoBox>
          )}

          <Section>
            <SectionHeader>
              <SectionIcon>
                <ZezinIcon />
              </SectionIcon>
              <SectionTitle>Número e token WhatsApp (Zezin)</SectionTitle>
            </SectionHeader>

            <FormGroup>
              <Label>
                ID do número de telefone (Phone Number ID) <span style={{ color: 'red' }}>*</span>
              </Label>
              <HelpText>
                <MdInfo size={14} />
                No painel do Facebook (WhatsApp → Números de telefone), copie o &quot;ID do número&quot;.
              </HelpText>
              <Input
                type="text"
                value={config.phoneNumberId || ''}
                onChange={e => setConfig({ ...config, phoneNumberId: e.target.value })}
                placeholder="Ex: 123456789012345"
                disabled={saving}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Token de acesso (API Token) {!existingConfig && <span style={{ color: 'red' }}>*</span>}
              </Label>
              <HelpText>
                <MdInfo size={14} />
                Chave de acesso permanente do WhatsApp Business. No painel: Configurações do sistema → WhatsApp.
                {existingConfig && ' Deixe em branco para não alterar.'}
              </HelpText>
              <PasswordInputWrapper>
                <Input
                  type={showToken ? 'text' : 'password'}
                  value={config.apiToken || ''}
                  onChange={e => setConfig({ ...config, apiToken: e.target.value })}
                  placeholder={existingConfig ? 'Deixe em branco para não alterar' : 'Cole o token'}
                  required={!existingConfig}
                  disabled={saving}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  disabled={saving}
                >
                  {showToken ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </PasswordToggle>
              </PasswordInputWrapper>
            </FormGroup>

            <FormGroup>
              <Label>Número de telefone (opcional)</Label>
              <HelpText>
                <MdInfo size={14} />
                Formato internacional (ex: 5511999999999). Apenas para identificação.
              </HelpText>
              <Input
                type="text"
                value={config.phoneNumber || ''}
                onChange={e => {
                  const masked = maskPhoneAuto(e.target.value);
                  setConfig({ ...config, phoneNumber: masked });
                }}
                placeholder="5511999999999"
                disabled={saving}
                maxLength={15}
              />
            </FormGroup>

            <FormGroup>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={config.isActive !== false}
                  onChange={e => setConfig({ ...config, isActive: e.target.checked })}
                  disabled={saving}
                />
                <span>Configuração ativa</span>
              </label>
            </FormGroup>
          </Section>

          </ConfigCard>

          <FooterActions>
            <Button
              type="button"
              $variant="secondary"
              onClick={() => navigate('/integrations')}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              $variant="primary"
              disabled={
                saving ||
                !config.phoneNumberId?.trim() ||
                (!existingConfig && !(config.apiToken?.trim()))
              }
            >
              {saving ? (
                <>
                  <LoadingSpinner style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Salvando...
                </>
              ) : (
                <>
                  <MdSave size={18} />
                  {existingConfig ? 'Atualizar' : 'Salvar'} configuração
                </>
              )}
            </Button>
          </FooterActions>
        </form>
      </PageContainer>
    </Layout>
  );
};

export default ZezinConfigPage;
