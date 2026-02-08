import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdSave,
  MdInfo,
  MdHome,
  MdContentCopy,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { IntegrationConfigShimmer } from '../components/shimmer/IntegrationConfigShimmer';
import { grupoZapApi } from '../services/grupoZapApi';
import { projectsApi } from '../services/projectsApi';
import { kanbanApi } from '../services/kanbanApi';
import { getApiUrl } from '../config/apiConfig';
import { showSuccess, showError } from '../utils/notifications';
import {
  normalizeTokenForIntegration,
  normalizeTokenForSave,
} from '../utils/integrationTokenUtils';
import type {
  GrupoZapConfig,
  CreateGrupoZapConfigRequest,
} from '../types/grupoZap';
import type { KanbanProjectResponseDto } from '../types/kanban';

const DOC_FEEDS = 'https://developers.grupozap.com/feeds/integration.html';
const DOC_CONTACT = 'https://developers.grupozap.com/contact/contact.html';

const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  width: 100%;
  box-sizing: border-box;
  @media (min-width: 960px) {
    max-width: 1520px;
    margin: 0 auto;
    padding: 28px 32px;
  }
  @media (min-width: 1440px) {
    padding-left: max(32px, 4vw);
    padding-right: max(32px, 4vw);
  }
  @media (min-width: 1920px) {
    max-width: 1600px;
    padding-left: max(48px, 6vw);
    padding-right: max(48px, 6vw);
  }
`;

const BackButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 24px;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StepBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #00a651;
  color: white;
  font-size: 0.8125rem;
  font-weight: 700;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.9375rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 14px 16px;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  margin-bottom: 12px;
  transition:
    border-color 0.2s,
    background 0.2s;

  &:has(input:checked) {
    border-color: #00a651;
    background: rgba(0, 166, 81, 0.06);
  }

  input {
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

const CheckboxDescription = styled.span`
  display: block;
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
  line-height: 1.4;
`;

const HelperText = styled.p`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 6px 0 0 0;
  line-height: 1.5;
`;

const Select = styled.select`
  padding: 10px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.9375rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  width: 100%;
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const UrlCard = styled.div`
  padding: 14px 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const UrlText = styled.code`
  flex: 1;
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.text};
  word-break: break-all;
  line-height: 1.4;
`;

const UrlHowItWorks = styled.p`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 8px 0 0 0;
  line-height: 1.5;
  padding-left: 0;
`;

const CopyButton = styled.button`
  flex-shrink: 0;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    border-color: #00a651;
    color: #00a651;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #00a651;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InfoBox = styled.div`
  padding: 16px;
  background: rgba(0, 166, 81, 0.08);
  border: 1px solid rgba(0, 166, 81, 0.2);
  border-radius: 10px;
  margin-bottom: 28px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;

  a {
    color: #00a651;
    font-weight: 500;
  }
  svg {
    flex-shrink: 0;
    color: #00a651;
    vertical-align: middle;
    margin-right: 4px;
  }
`;

const GrupoZapConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<GrupoZapConfig | null>(null);
  const [projects, setProjects] = useState<KanbanProjectResponseDto[]>([]);
  const [projectMembers, setProjectMembers] = useState<
    Array<{ id: string; name: string; email: string }>
  >([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [form, setForm] = useState<CreateGrupoZapConfigRequest>({
    apiKey: '',
    partnerId: '',
    syncProperties: true,
    syncLeads: true,
    isActive: false,
    kanbanProjectId: '',
    responsibleUserId: '',
  });
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const [data, projectsRes] = await Promise.all([
        grupoZapApi.getConfig(),
        projectsApi
          .getFilteredProjects({ limit: '100', page: '1', status: 'active' })
          .then(r => r.data ?? [])
          .catch(err => {
            console.warn('Erro ao carregar funis:', err);
            return [];
          }),
      ]);
      setConfig(data ?? null);
      setProjects(Array.isArray(projectsRes) ? projectsRes : []);
      if (data) {
        setForm({
          apiKey: normalizeTokenForIntegration(data.apiKey ?? ''),
          partnerId: normalizeTokenForIntegration(data.partnerId ?? ''),
          syncProperties: data.syncProperties ?? true,
          syncLeads: data.syncLeads ?? true,
          isActive: data.isActive ?? false,
          kanbanProjectId: data.kanbanProjectId ?? '',
          responsibleUserId: data.responsibleUserId ?? '',
        });
      }
    } catch {
      setConfig(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const projectId = form.kanbanProjectId?.trim();
    if (!projectId) {
      setProjectMembers([]);
      setForm(f => (f.responsibleUserId ? { ...f, responsibleUserId: '' } : f));
      return;
    }
    setLoadingMembers(true);
    kanbanApi
      .getProjectMembers(projectId)
      .then(members => {
        const list = (members || [])
          .map(m => ({
            id: m.user?.id ?? m.id,
            name: m.user?.name ?? '',
            email: m.user?.email ?? '',
          }))
          .filter(u => u.id);
        setProjectMembers(list);
        setForm(f => {
          if (
            f.responsibleUserId &&
            !list.some(u => u.id === f.responsibleUserId)
          ) {
            return { ...f, responsibleUserId: '' };
          }
          return f;
        });
      })
      .catch(() => setProjectMembers([]))
      .finally(() => setLoadingMembers(false));
  }, [form.kanbanProjectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await grupoZapApi.createOrUpdateConfig({
        ...form,
        apiKey: normalizeTokenForSave(form.apiKey) || undefined,
        partnerId: normalizeTokenForSave(form.partnerId) || undefined,
        kanbanProjectId: form.kanbanProjectId || undefined,
        responsibleUserId: form.responsibleUserId || undefined,
      });
      showSuccess(
        'Configuração salva. Use as URLs abaixo no Canal Pro do Grupo ZAP.'
      );
      loadConfig();
    } catch (err: any) {
      showError(err?.message || 'Erro ao salvar configuração.');
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showSuccess(`${label} copiada!`);
    } catch {
      showError('Não foi possível copiar.');
    }
  };

  const feedUrl = config?.feedToken
    ? getApiUrl(`integrations/grupo-zap/feed/${config.feedToken}`)
    : null;
  const webhookUrl = config?.webhookToken
    ? getApiUrl(
        `integrations/grupo-zap/webhook/leads?token=${config.webhookToken}`
      )
    : null;

  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <IntegrationConfigShimmer />
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <BackButton onClick={() => navigate('/integrations')}>
          <MdArrowBack size={20} /> Voltar
        </BackButton>

        <Title>
          <MdHome size={32} color='#00A651' />
          Portal Grupo ZAP
        </Title>
        <Subtitle>
          Publique seus imóveis no ZAP, Viva Real e OLX e receba os leads direto
          no seu CRM. Escolha o que deseja ativar, salve a configuração e depois
          cadastre no Canal Pro do Grupo ZAP os endereços que o sistema gerar
          para você.
        </Subtitle>

        <InfoBox>
          <MdInfo size={20} />
          <span>
            Documentação:{' '}
            <a href={DOC_FEEDS} target='_blank' rel='noopener noreferrer'>
              Feeds (imóveis)
            </a>{' '}
            e{' '}
            <a href={DOC_CONTACT} target='_blank' rel='noopener noreferrer'>
              Contato
            </a>{' '}
            para homologação.
          </span>
        </InfoBox>

        <form onSubmit={handleSave}>
          <Section>
            <SectionTitle>
              <StepBadge>1</StepBadge>O que você quer integrar?
            </SectionTitle>
            <FormGroup>
              <CheckboxLabel>
                <input
                  type='checkbox'
                  checked={form.syncProperties ?? true}
                  onChange={e =>
                    setForm(f => ({ ...f, syncProperties: e.target.checked }))
                  }
                />
                <div>
                  <strong>Publicar imóveis</strong> no ZAP / Viva Real / OLX
                  <CheckboxDescription>
                    O Grupo OLX acessa uma URL de feed XML (até 2x ao dia). Você
                    informa essa URL no Canal Pro.
                  </CheckboxDescription>
                </div>
              </CheckboxLabel>
            </FormGroup>
            <FormGroup>
              <CheckboxLabel>
                <input
                  type='checkbox'
                  checked={form.syncLeads ?? true}
                  onChange={e =>
                    setForm(f => ({ ...f, syncLeads: e.target.checked }))
                  }
                />
                <div>
                  <strong>Receber leads</strong> no CRM
                  <CheckboxDescription>
                    Leads do portal viram tarefas no funil que você escolher
                    abaixo. Você informa a URL do webhook no Canal Pro.
                  </CheckboxDescription>
                </div>
              </CheckboxLabel>
            </FormGroup>
          </Section>

          {form.syncLeads && (
            <Section>
              <SectionTitle>
                <StepBadge>2</StepBadge>
                Onde receber os leads?
              </SectionTitle>
              <FormGroup>
                <Label>Funil (obrigatório para receber leads)</Label>
                <Select
                  value={form.kanbanProjectId ?? ''}
                  onChange={e =>
                    setForm(f => ({ ...f, kanbanProjectId: e.target.value }))
                  }
                >
                  <option value=''>Selecione o funil</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Responsável (opcional)</Label>
                <Select
                  value={form.responsibleUserId ?? ''}
                  onChange={e =>
                    setForm(f => ({ ...f, responsibleUserId: e.target.value }))
                  }
                  disabled={!form.kanbanProjectId || loadingMembers}
                >
                  <option value=''>
                    {!form.kanbanProjectId
                      ? 'Selecione um funil antes'
                      : loadingMembers
                        ? 'Carregando...'
                        : 'Nenhum'}
                  </option>
                  {projectMembers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} {u.email ? `(${u.email})` : ''}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </Section>
          )}

          <Section>
            <SectionTitle>
              <StepBadge>{form.syncLeads ? '3' : '2'}</StepBadge>
              Salvar e usar as URLs no Canal Pro
            </SectionTitle>
            {!config?.feedToken && !config?.webhookToken ? (
              <HelperText style={{ paddingLeft: 0, marginBottom: 16 }}>
                Clique em <strong>Salvar configuração</strong> para gerar as
                URLs. Depois, cadastre-as no Canal Pro do Grupo ZAP (formulário
                de homologação / integração).
              </HelperText>
            ) : (
              <>
                <HelperText style={{ paddingLeft: 0, marginBottom: 16 }}>
                  Copie cada URL e cadastre no Canal Pro do Grupo ZAP no lugar
                  indicado (feed de imóveis e webhook de leads). Abaixo está
                  explicado como cada uma funciona.
                </HelperText>
                {feedUrl && form.syncProperties && (
                  <FormGroup>
                    <Label>1. URL do feed XML (publicação de imóveis)</Label>
                    <UrlCard>
                      <UrlText>{feedUrl}</UrlText>
                      <CopyButton
                        type='button'
                        onClick={() => copyUrl(feedUrl, 'URL do feed')}
                      >
                        <MdContentCopy size={16} /> Copiar
                      </CopyButton>
                    </UrlCard>
                    <UrlHowItWorks>
                      <strong>Como funciona:</strong> O Grupo OLX (ZAP, Viva
                      Real, OLX) acessa esta URL até 2 vezes por dia e baixa a
                      lista dos seus imóveis em formato XML. Assim seus anúncios
                      são atualizados nos portais sem você publicar manualmente.
                      No Canal Pro, use esta URL no campo de{' '}
                      <strong>integração por feed</strong> ou &quot;URL do
                      feed&quot;.
                    </UrlHowItWorks>
                  </FormGroup>
                )}
                {webhookUrl && form.syncLeads && (
                  <FormGroup>
                    <Label>2. URL do webhook (recebimento de leads)</Label>
                    <UrlCard>
                      <UrlText>{webhookUrl}</UrlText>
                      <CopyButton
                        type='button'
                        onClick={() => copyUrl(webhookUrl, 'URL do webhook')}
                      >
                        <MdContentCopy size={16} /> Copiar
                      </CopyButton>
                    </UrlCard>
                    <UrlHowItWorks>
                      <strong>Como funciona:</strong> Quando alguém demonstrar
                      interesse em um imóvel (formulário, contato, etc.) no ZAP,
                      Viva Real ou OLX, o portal envia os dados do lead para
                      esta URL. O sistema cria automaticamente uma tarefa no
                      funil que você escolheu. No Canal Pro, use esta URL no
                      campo de <strong>webhook de leads</strong> ou &quot;URL
                      para receber leads&quot;.
                    </UrlHowItWorks>
                  </FormGroup>
                )}
              </>
            )}
          </Section>

          <SaveButton type='submit' disabled={saving}>
            <MdSave size={20} />
            {saving ? 'Salvando...' : 'Salvar configuração'}
          </SaveButton>
        </form>
      </PageContainer>
    </Layout>
  );
};

export default GrupoZapConfigPage;
