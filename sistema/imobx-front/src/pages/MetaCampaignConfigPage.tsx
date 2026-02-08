import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdSave,
  MdInfo,
  MdAdd,
  MdDelete,
  MdContentCopy,
} from 'react-icons/md';
import { FaFacebookF } from 'react-icons/fa';
import { Layout } from '../components/layout/Layout';
import { IntegrationConfigShimmer } from '../components/shimmer/IntegrationConfigShimmer';
import { getApiUrl } from '../config/apiConfig';
import { metaCampaignApi } from '../services/metaCampaignApi';
import { projectsApi } from '../services/projectsApi';
import { kanbanApi } from '../services/kanbanApi';
import { showSuccess, showError } from '../utils/notifications';
import {
  normalizeTokenForIntegration,
  normalizeTokenForSave,
} from '../utils/integrationTokenUtils';
import type {
  MetaCampaignConfig,
  CreateMetaCampaignConfigRequest,
} from '../types/metaCampaign';
import type { KanbanProjectResponseDto } from '../types/kanban';

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
    max-width: 1520px;
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
  margin: 0 0 32px 0;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
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
  align-items: center;
  gap: 10px;
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const HelperText = styled.p`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 6px 0 0 0;
  line-height: 1.4;
  padding-left: 28px;
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

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
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
  background: rgba(24, 119, 242, 0.08);
  border: 1px solid rgba(24, 119, 242, 0.2);
  border-radius: 10px;
  margin-bottom: 24px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  display: flex;
  gap: 12px;

  svg {
    flex-shrink: 0;
    color: #1877f2;
  }
`;

const AdAccountRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 12px;
`;

const SmallButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  font-size: 0.875rem;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const AddAccountButton = styled(SmallButton)`
  border-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primary};
  &:hover {
    background: rgba(24, 119, 242, 0.08);
  }
`;

const UrlCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  margin-top: 8px;
`;
const UrlText = styled.code`
  flex: 1;
  font-size: 0.8125rem;
  word-break: break-all;
  color: ${props => props.theme.colors.text};
`;
const CopyButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 0.8125rem;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;
const UrlHowItWorks = styled.p`
  margin: 10px 0 0;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.45;
`;

const MetaCampaignConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<MetaCampaignConfig | null>(null);
  const [projects, setProjects] = useState<KanbanProjectResponseDto[]>([]);
  const [projectMembers, setProjectMembers] = useState<
    Array<{ id: string; name: string; email: string }>
  >([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [form, setForm] = useState<CreateMetaCampaignConfigRequest>({
    accessToken: '',
    adAccounts: [],
    businessName: '',
    syncLeads: true,
    isActive: false,
    kanbanProjectId: '',
    responsibleUserId: '',
    webhookVerifyToken: '',
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const [data, projectsRes] = await Promise.all([
        metaCampaignApi.getConfig(),
        projectsApi
          .getFilteredProjects({ limit: '100', page: '1', status: 'active' })
          .then(r => r.data ?? [])
          .catch(() => []),
      ]);
      setConfig(data ?? null);
      setProjects(Array.isArray(projectsRes) ? projectsRes : []);
      if (data) {
        const adAccounts = (
          data.adAccounts?.length
            ? data.adAccounts
            : data.adAccountId
              ? [{ id: data.adAccountId, name: '' }]
              : []
        ) as { id: string; name?: string }[];
        setForm({
          accessToken: data.accessToken ?? '',
          adAccounts,
          businessName: data.businessName ?? '',
          syncLeads: data.syncLeads ?? true,
          isActive: data.isActive ?? false,
          kanbanProjectId: data.kanbanProjectId ?? '',
          responsibleUserId: data.responsibleUserId ?? '',
          webhookVerifyToken: normalizeTokenForIntegration(
            data.webhookVerifyToken ?? ''
          ),
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
    const adAccountsToSave = (form.adAccounts ?? []).filter(a =>
      (a?.id ?? '').trim()
    );
    const invalidId = adAccountsToSave.find(
      a => !/^act_\d+$/.test((a.id ?? '').trim())
    );
    if (invalidId) {
      showError(
        'ID da conta inválido: use apenas act_ seguido de números (ex: act_6173168946141065). O nome da campanha deve ir no campo "Nome (opcional)".'
      );
      return;
    }
    setSaving(true);
    try {
      const hasAdAccounts = adAccountsToSave.length > 0;
      await metaCampaignApi.createOrUpdateConfig({
        ...form,
        isActive: !!(form.accessToken && hasAdAccounts),
        adAccounts: adAccountsToSave.map(a => ({
          id: a.id!.trim(),
          name: a.name?.trim() || undefined,
        })),
        kanbanProjectId: form.kanbanProjectId || undefined,
        responsibleUserId: form.responsibleUserId || undefined,
        webhookVerifyToken:
          normalizeTokenForSave(form.webhookVerifyToken) || undefined,
      });
      showSuccess(
        'Configuração da integração Meta Campanhas salva com sucesso.'
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
      showSuccess(`${label} copiado.`);
    } catch {
      showError('Não foi possível copiar.');
    }
  };

  const metaWebhookUrl = config?.webhookToken
    ? getApiUrl(
        `integrations/meta-campaign/webhook/leads?token=${config.webhookToken}`
      )
    : null;
  /** Token que a Meta deve enviar na verificação: o da empresa ou o padrão */
  const effectiveVerifyToken =
    (config?.webhookVerifyToken ?? form.webhookVerifyToken)?.trim() ||
    'meta-lead-verify';

  const [regeneratingToken, setRegeneratingToken] = useState(false);
  const handleRegenerateWebhookToken = async () => {
    setRegeneratingToken(true);
    try {
      await metaCampaignApi.regenerateWebhookToken();
      await loadConfig();
      showSuccess(
        'Token regenerado. Atualize a URL do webhook no app da Meta com a nova URL.'
      );
    } catch (err: any) {
      showError(err?.message ?? 'Erro ao regenerar token.');
    } finally {
      setRegeneratingToken(false);
    }
  };

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
          <FaFacebookF size={32} color='#1877F2' />
          Campanha META (Facebook/Instagram)
        </Title>
        <Subtitle>
          Conecte sua conta de anúncios da Meta para sincronizar campanhas e
          leads com o CRM.
        </Subtitle>

        <InfoBox>
          <MdInfo size={22} />
          <div>
            Para obter o token de acesso e o ID da conta de anúncios, acesse o{' '}
            <a
              href='https://developers.facebook.com/docs/marketing-api'
              target='_blank'
              rel='noopener noreferrer'
              style={{ color: '#1877F2' }}
            >
              Meta for Developers
            </a>
            . É necessário criar um app, configurar a API de Marketing e gerar
            um token com permissões de ads_management.
          </div>
        </InfoBox>

        <form onSubmit={handleSave}>
          <Section>
            <SectionTitle>Credenciais</SectionTitle>
            <FormGroup>
              <Label>Token de acesso (Access Token)</Label>
              <Input
                type='password'
                placeholder='EAA...'
                value={form.accessToken ?? ''}
                onChange={e =>
                  setForm(f => ({ ...f, accessToken: e.target.value }))
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Contas de anúncios (act_XXXXX)</Label>
              <HelperText style={{ paddingLeft: 0, marginBottom: 12 }}>
                Adicione uma ou mais contas de anúncios da Meta. O{' '}
                <strong>ID</strong> é obrigatório e tem o formato{' '}
                <code>act_</code> + números (ex: act_123456789). O{' '}
                <strong>nome</strong> é só para você identificar a conta na
                lista.
              </HelperText>
              {(form.adAccounts ?? []).map((acc, index) => {
                const idValue = (acc.id ?? '').trim();
                const idLooksLikeName =
                  idValue.length > 0 &&
                  (!/^act_\d+$/.test(idValue) ||
                    idValue.includes(' ') ||
                    idValue.length > 20);
                return (
                  <AdAccountRow key={index}>
                    <div>
                      <Label style={{ fontSize: 0.8125 + 'rem' }}>
                        ID da conta (obrigatório)
                      </Label>
                      <Input
                        placeholder='act_123456789'
                        value={acc.id ?? ''}
                        onChange={e =>
                          setForm(f => ({
                            ...f,
                            adAccounts: (f.adAccounts ?? []).map((a, i) =>
                              i === index
                                ? {
                                    ...a,
                                    id: e.target.value.replace(/\s/g, ''),
                                  }
                                : a
                            ),
                          }))
                        }
                        title='Apenas act_ seguido de números, sem espaços'
                      />
                      {idLooksLikeName && (
                        <HelperText
                          style={{
                            color: 'var(--color-error, #c53030)',
                            marginTop: 4,
                            fontSize: '0.75rem',
                          }}
                        >
                          O ID deve ser no formato act_ + números (ex:
                          act_6173168946141065). Não coloque o nome da campanha
                          aqui.
                        </HelperText>
                      )}
                    </div>
                    <div>
                      <Label style={{ fontSize: 0.8125 + 'rem' }}>
                        Nome (opcional)
                      </Label>
                      <Input
                        placeholder='Ex: CA IMOB UNIAO - EMPREENDIMENTOS'
                        value={acc.name ?? ''}
                        onChange={e =>
                          setForm(f => ({
                            ...f,
                            adAccounts: (f.adAccounts ?? []).map((a, i) =>
                              i === index ? { ...a, name: e.target.value } : a
                            ),
                          }))
                        }
                        title='Só para você identificar a conta na lista'
                      />
                    </div>
                    <SmallButton
                      type='button'
                      onClick={() =>
                        setForm(f => ({
                          ...f,
                          adAccounts: (f.adAccounts ?? []).filter(
                            (_, i) => i !== index
                          ),
                        }))
                      }
                      title='Remover conta'
                    >
                      <MdDelete size={18} />
                    </SmallButton>
                  </AdAccountRow>
                );
              })}
              <AddAccountButton
                type='button'
                onClick={() =>
                  setForm(f => ({
                    ...f,
                    adAccounts: [...(f.adAccounts ?? []), { id: '', name: '' }],
                  }))
                }
              >
                <MdAdd size={18} /> Adicionar conta
              </AddAccountButton>
            </FormGroup>
            <FormGroup>
              <Label>Nome do negócio (opcional)</Label>
              <Input
                type='text'
                placeholder='Minha Imobiliária'
                value={form.businessName ?? ''}
                onChange={e =>
                  setForm(f => ({ ...f, businessName: e.target.value }))
                }
              />
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
                Sincronizar leads das campanhas com o CRM
              </CheckboxLabel>
              <HelperText>
                Quando ativado, os leads que chegarem das suas campanhas
                (Facebook/Instagram) serão criados automaticamente como tarefas
                no funil que você configurou abaixo (ou no funil definido por
                campanha em Campanhas META). Se desativar, a integração continua
                exibindo as campanhas, mas nenhum lead será enviado ao CRM.
              </HelperText>
            </FormGroup>
          </Section>

          <Section>
            <SectionTitle>Leads → Funil de vendas</SectionTitle>
            <HelperText style={{ paddingLeft: 0, marginBottom: 12 }}>
              <strong>Funil padrão:</strong> usado quando uma campanha ainda não
              tem funil definido. Cada campanha pode mandar leads para um funil
              diferente: na tela <strong>Campanhas META</strong> você escolhe o
              funil (e responsável) por campanha. Assim, por exemplo, a Campanha
              A pode ir para o funil Vendas e a Campanha B para o funil Locação.
            </HelperText>
            <FormGroup>
              <Label>Funil padrão (obrigatório para receber leads)</Label>
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

          <Section>
            <SectionTitle>
              Como os leads entram no sistema (webhook)
            </SectionTitle>
            <HelperText style={{ paddingLeft: 0, marginBottom: 12 }}>
              Os leads novos (Facebook/Instagram Lead Ads) chegam
              automaticamente quando a Meta envia um evento para a URL da sua
              empresa. Cadastre essa URL no app da Meta em{' '}
              <strong>
                Meta for Developers → seu app → Webhooks → Leadgen
              </strong>
              . Cada empresa tem uma URL e pode ter seu próprio token de
              verificação; se precisar invalidar o token da URL, use Regenerar
              token e atualize o cadastro na Meta.
            </HelperText>
            <FormGroup>
              <Label>Token de verificação da Meta (Verify token)</Label>
              <Input
                type='text'
                placeholder='Ex: meta-lead-verify ou um token só seu'
                value={form.webhookVerifyToken ?? ''}
                onChange={e =>
                  setForm(f => ({
                    ...f,
                    webhookVerifyToken: normalizeTokenForIntegration(
                      e.target.value
                    ),
                  }))
                }
              />
              <HelperText>
                Cada empresa pode definir o seu. No app da Meta (Webhooks →
                Leadgen), no campo &quot;Verify token&quot;, cole exatamente
                este valor. Se deixar em branco, o sistema usa{' '}
                <code>meta-lead-verify</code>.
              </HelperText>
            </FormGroup>
            {metaWebhookUrl ? (
              <FormGroup>
                <Label>URL do webhook (Callback URL na Meta)</Label>
                <UrlCard>
                  <UrlText>{metaWebhookUrl}</UrlText>
                  <CopyButton
                    type='button'
                    onClick={() => copyUrl(metaWebhookUrl, 'URL do webhook')}
                  >
                    <MdContentCopy size={16} /> Copiar
                  </CopyButton>
                  <CopyButton
                    type='button'
                    onClick={handleRegenerateWebhookToken}
                    disabled={regeneratingToken}
                    title='Gera um novo token; será preciso atualizar a URL no app da Meta'
                  >
                    {regeneratingToken ? 'Regenerando...' : 'Regenerar token'}
                  </CopyButton>
                </UrlCard>
                <UrlHowItWorks>
                  <strong>Na Meta:</strong> Callback URL = a URL acima. Verify
                  token = <code>{effectiveVerifyToken}</code> (ou copie o valor
                  que você definiu acima). Clique em Verificar e salve.
                </UrlHowItWorks>
              </FormGroup>
            ) : (
              <FormGroup>
                <HelperText>
                  Salve a configuração acima para gerar a URL do webhook (com
                  token da sua empresa).
                </HelperText>
              </FormGroup>
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

export default MetaCampaignConfigPage;
