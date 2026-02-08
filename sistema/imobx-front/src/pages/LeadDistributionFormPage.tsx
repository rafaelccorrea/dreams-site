import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdPeople,
  MdSchedule,
  MdNotifications,
  MdTrendingUp,
  MdSave,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { LeadDistributionFormShimmer } from '../components/shimmer/LeadDistributionFormShimmer';
import { InfoTooltip } from '../components/common/InfoTooltip';
import { leadDistributionApi } from '../services/leadDistributionApi';
import { projectsApi } from '../services/projectsApi';
import { showSuccess, showError } from '../utils/notifications';
import type {
  LeadDistributionConfigDto,
  CreateLeadDistributionConfigDto,
} from '../services/leadDistributionApi';
import type { KanbanProjectResponseDto } from '../types/kanban';

const DISTRIBUTION_RULES: { value: string; label: string }[] = [
  { value: 'round_robin', label: 'Round Robin (alternado)' },
  { value: 'by_workload', label: 'Por carga (quem tem menos)' },
  { value: 'manual', label: 'Manual' },
];

/** Opções fixas para SLA primeiro contato (min) – usuário não digita valor livre */
const SLA_FIRST_CONTACT_OPTIONS: { value: number; label: string }[] = [
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 h' },
  { value: 120, label: '2 h' },
  { value: 240, label: '4 h' },
  { value: 480, label: '8 h' },
  { value: 720, label: '12 h' },
  { value: 1440, label: '24 h' },
];

/** Opções fixas para alerta antes de estourar SLA (min) */
const ALERT_WARNING_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Não alertar' },
  { value: 5, label: '5 min antes' },
  { value: 10, label: '10 min antes' },
  { value: 15, label: '15 min antes' },
  { value: 20, label: '20 min antes' },
  { value: 30, label: '30 min antes' },
  { value: 60, label: '1 h antes' },
  { value: 120, label: '2 h antes' },
];

/** Opções fixas para reatribuir após (min); 0 = desligado */
const REASSIGN_AFTER_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Desligado' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 h' },
  { value: 120, label: '2 h' },
  { value: 240, label: '4 h' },
  { value: 480, label: '8 h' },
  { value: 720, label: '12 h' },
  { value: 1440, label: '24 h' },
];

/** Opções fixas para máx. leads por corretor/dia; 0 = ilimitado */
const MAX_LEADS_PER_DAY_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Ilimitado' },
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
  { value: 20, label: '20' },
  { value: 25, label: '25' },
  { value: 30, label: '30' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 200, label: '200' },
  { value: 500, label: '500' },
];

/** Normaliza valor numérico para a opção mais próxima da lista (para selects ao editar config salva com valor fora da lista). */
function normalizeToOption(
  value: number,
  options: { value: number }[]
): number {
  if (options.some(o => o.value === value)) return value;
  const sorted = [...options].sort((a, b) => a.value - b.value);
  let closest = sorted[0].value;
  let minDiff = Math.abs(value - closest);
  for (const o of sorted) {
    const d = Math.abs(value - o.value);
    if (d < minDiff) {
      minDiff = d;
      closest = o.value;
    }
  }
  return closest;
}

const defaultForm: CreateLeadDistributionConfigDto = {
  kanbanProjectId: null,
  distributionRule: 'round_robin',
  slaFirstContactMinutes: 30,
  alertWarningMinutes: 15,
  reassignAfterMinutes: 0,
  notifyManagerOnSlaBreach: true,
  sendAutoReplyToLead: false,
  maxNewLeadsPerUserPerDay: 0,
  isActive: true,
};

/* Padrão alinhado à tela /integrations/whatsapp/config */
const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${p => p.theme.colors.background};
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  @media (max-width: 768px) {
    padding: 16px;
  }
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${p => p.theme.colors.border};
  @media (max-width: 480px) {
    margin-bottom: 24px;
    padding-bottom: 16px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${p => p.theme.colors.text};
  margin: 0;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 12px;
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${p => p.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`;

const BackButton = styled.button`
  background: ${p => p.theme.colors.background};
  border: 1px solid ${p => p.theme.colors.border};
  color: ${p => p.theme.colors.text};
  cursor: pointer;
  padding: 10px 16px;
  min-height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 500;
  @media (max-width: 480px) {
    min-height: 48px;
    padding: 12px 14px;
  }
  &:hover {
    background: ${p => p.theme.colors.primary};
    color: white;
    border-color: ${p => p.theme.colors.primary};
    transform: translateX(-2px);
  }
`;

const PageBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  @media (max-width: 480px) {
    gap: 24px;
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
  @media (max-width: 480px) {
    margin-bottom: 24px;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${p => p.theme.colors.border};
  @media (max-width: 480px) {
    margin-bottom: 18px;
    padding-bottom: 12px;
    gap: 10px;
  }
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${p => p.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${p => p.theme.colors.text};
  margin: 0;
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  gap: 20px;
  @media (min-width: 560px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormGroup = styled.div<{ $full?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  grid-column: ${p => (p.$full ? '1 / -1' : 'span 1')};
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${p => p.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Input = styled.input`
  padding: 12px 16px;
  min-height: 44px;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 8px;
  font-size: 0.9375rem;
  background: ${p => p.theme.colors.cardBackground};
  color: ${p => p.theme.colors.text};
  width: 100%;
  transition: all 0.2s ease;
  box-sizing: border-box;
  @media (max-width: 480px) {
    min-height: 48px;
    padding: 12px 14px;
  }
  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
  }
  &::placeholder {
    color: ${p => p.theme.colors.textSecondary};
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  min-height: 44px;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 8px;
  font-size: 0.9375rem;
  background: ${p => p.theme.colors.cardBackground};
  color: ${p => p.theme.colors.text};
  width: 100%;
  transition: all 0.2s ease;
  cursor: pointer;
  box-sizing: border-box;
  @media (max-width: 480px) {
    min-height: 48px;
    padding: 12px 14px;
  }
  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
  }
`;

const CheckboxWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9375rem;
  color: ${p => p.theme.colors.text};
  cursor: pointer;
  user-select: none;
  min-height: 44px;
  padding: 4px 0;
  @media (max-width: 480px) {
    min-height: 48px;
  }
  & input {
    width: 22px;
    height: 22px;
    margin: 0;
    accent-color: ${p => p.theme.colors.primary};
    cursor: pointer;
    flex-shrink: 0;
  }
`;

const FooterActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${p => p.theme.colors.border};
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 10px;
    margin-top: 24px;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  min-height: 48px;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
  }
  @media (max-width: 480px) {
    min-height: 48px;
  }
  ${p =>
    p.$variant === 'secondary'
      ? `
    background: ${p.theme.colors.backgroundSecondary};
    color: ${p.theme.colors.text};
    border: 1px solid ${p.theme.colors.border};
    &:hover:not(:disabled) {
      background: ${p.theme.colors.border};
      transform: translateY(-1px);
    }
  `
      : `
    background: ${p.theme.colors.primary};
    color: white;
    &:hover:not(:disabled) {
      filter: brightness(1.05);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
  `}
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid ${p => p.theme.colors.border};
  border-top-color: ${p => p.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const CONFIG_LIST_PATH = '/integrations/lead-distribution/config';

export default function LeadDistributionFormPage() {
  const navigate = useNavigate();
  const { id, scope: scopeParam } = useParams<{ id: string; scope?: string }>();
  const [searchParams] = useSearchParams();
  const scope = scopeParam ?? searchParams.get('scope'); // 'funnel' = por funil, otherwise global

  const [form, setForm] =
    useState<CreateLeadDistributionConfigDto>(defaultForm);
  const [projects, setProjects] = useState<KanbanProjectResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(id);
  const isGlobal = !form.kanbanProjectId && (scope !== 'funnel' || isEdit);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const projRes = await projectsApi
          .getFilteredProjects({ limit: '100', page: '1', status: 'active' })
          .catch(() => ({ data: [] }));
        if (!cancelled) setProjects(projRes?.data ?? []);

        if (id) {
          const list = await leadDistributionApi.list();
          const config = list.find(c => c.id === id);
          if (!cancelled && config) {
            setForm({
              kanbanProjectId: config.kanbanProjectId ?? undefined,
              distributionRule: config.distributionRule,
              slaFirstContactMinutes: normalizeToOption(
                config.slaFirstContactMinutes ?? 30,
                SLA_FIRST_CONTACT_OPTIONS
              ),
              alertWarningMinutes: normalizeToOption(
                config.alertWarningMinutes ?? 15,
                ALERT_WARNING_OPTIONS
              ),
              reassignAfterMinutes: normalizeToOption(
                config.reassignAfterMinutes ?? 0,
                REASSIGN_AFTER_OPTIONS
              ),
              notifyManagerOnSlaBreach: config.notifyManagerOnSlaBreach,
              sendAutoReplyToLead: config.sendAutoReplyToLead,
              maxNewLeadsPerUserPerDay: normalizeToOption(
                config.maxNewLeadsPerUserPerDay ?? 0,
                MAX_LEADS_PER_DAY_OPTIONS
              ),
              isActive: config.isActive,
            });
          } else if (!cancelled && !config) {
            showError('Configuração não encontrada.');
            navigate(CONFIG_LIST_PATH);
          }
        } else {
          if (!cancelled) {
            setForm({
              ...defaultForm,
              kanbanProjectId: scope === 'funnel' ? undefined : null,
            });
          }
        }
      } catch (e) {
        if (!cancelled) showError('Erro ao carregar.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, scope]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: CreateLeadDistributionConfigDto = {
        ...form,
        kanbanProjectId: isGlobal ? null : form.kanbanProjectId || null,
      };
      if (isEdit && id) {
        await leadDistributionApi.update(id, payload);
        showSuccess('Configuração atualizada.');
      } else {
        await leadDistributionApi.create(payload);
        showSuccess('Configuração criada.');
      }
      navigate(CONFIG_LIST_PATH);
    } catch (err: any) {
      showError(err?.response?.data?.message || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const title = isEdit
    ? 'Editar configuração'
    : isGlobal
      ? 'Nova configuração global'
      : 'Nova configuração por funil';
  const subtitle = isEdit
    ? 'Altere os parâmetros de distribuição, SLA e notificações.'
    : isGlobal
      ? 'Esta configuração vale para todos os funis que não tiverem regra própria.'
      : 'Escolha o funil e defina regras específicas para ele.';

  if (loading) {
    return (
      <Layout>
        <LeadDistributionFormShimmer />
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
                <MdPeople
                  size={32}
                  style={{ color: 'var(--color-primary, #6366f1)' }}
                />
                {title}
              </Title>
              <Subtitle>{subtitle}</Subtitle>
            </TitleSection>
            <BackButton
              type='button'
              onClick={() => navigate(CONFIG_LIST_PATH)}
            >
              <MdArrowBack size={18} />
              Voltar
            </BackButton>
          </HeaderTop>
        </PageHeader>

        <PageBody>
          <form onSubmit={handleSubmit}>
            {/* Escopo / Funil */}
            {!isEdit && !isGlobal && (
              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <MdPeople size={20} />
                  </SectionIcon>
                  <SectionTitle>Escopo</SectionTitle>
                </SectionHeader>
                <FormGroup $full>
                  <Label>
                    Funil
                    <InfoTooltip
                      content='Funil (projeto Kanban) ao qual esta configuração se aplica. Só aparece ao criar configuração por funil; na configuração global não é necessário.'
                      direction='up'
                    />
                  </Label>
                  <Select
                    value={form.kanbanProjectId ?? ''}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        kanbanProjectId: e.target.value || undefined,
                      }))
                    }
                    required
                  >
                    <option value=''>Selecione o funil</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </Section>
            )}

            {/* Distribuição */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdTrendingUp size={20} />
                </SectionIcon>
                <SectionTitle>Distribuição</SectionTitle>
              </SectionHeader>
              <FormGrid>
                <FormGroup $full>
                  <Label>
                    Regra de distribuição
                    <InfoTooltip
                      content='Round Robin: leads alternados entre corretores. Por carga: quem tem menos leads recebe. Manual: distribuição feita manualmente pelo gestor.'
                      direction='up'
                    />
                  </Label>
                  <Select
                    value={form.distributionRule ?? 'round_robin'}
                    onChange={e =>
                      setForm(f => ({ ...f, distributionRule: e.target.value }))
                    }
                  >
                    {DISTRIBUTION_RULES.map(r => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </FormGrid>
            </Section>

            {/* SLA e alertas – selects para não permitir valor livre */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdSchedule size={20} />
                </SectionIcon>
                <SectionTitle>SLA e alertas</SectionTitle>
              </SectionHeader>
              <FormGrid>
                <FormGroup>
                  <Label>
                    SLA primeiro contato
                    <InfoTooltip
                      content='Prazo máximo em minutos para o corretor entrar em contato com o lead pela primeira vez após a distribuição. Se ultrapassar, o gestor pode ser notificado.'
                      direction='up'
                    />
                  </Label>
                  <Select
                    value={form.slaFirstContactMinutes ?? 30}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        slaFirstContactMinutes:
                          parseInt(e.target.value, 10) || 30,
                      }))
                    }
                  >
                    {SLA_FIRST_CONTACT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>
                    Alerta antes de estourar SLA
                    <InfoTooltip
                      content='Com quantos minutos de antecedência avisar (ex.: ao corretor ou gestor) que o prazo de primeiro contato está prestes a vencer.'
                      direction='up'
                    />
                  </Label>
                  <Select
                    value={form.alertWarningMinutes ?? 15}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        alertWarningMinutes: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                  >
                    {ALERT_WARNING_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>
                    Reatribuir após (0 = desligado)
                    <InfoTooltip
                      content='Se o lead não for contactado dentro deste tempo (em minutos), ele pode ser reatribuído a outro corretor. Use 0 para não reatribuir automaticamente.'
                      direction='up'
                    />
                  </Label>
                  <Select
                    value={form.reassignAfterMinutes ?? 0}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        reassignAfterMinutes: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                  >
                    {REASSIGN_AFTER_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </FormGrid>
            </Section>

            {/* Limites – select para não permitir valor livre */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdTrendingUp size={20} />
                </SectionIcon>
                <SectionTitle>Limites</SectionTitle>
              </SectionHeader>
              <FormGrid>
                <FormGroup>
                  <Label>
                    Máx. leads novos por corretor/dia
                    <InfoTooltip
                      content='Limite diário de novos leads por corretor. Ilimitado (0) permite que todos os leads sejam distribuídos sem teto por pessoa.'
                      direction='up'
                    />
                  </Label>
                  <Select
                    value={form.maxNewLeadsPerUserPerDay ?? 0}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        maxNewLeadsPerUserPerDay:
                          parseInt(e.target.value, 10) || 0,
                      }))
                    }
                  >
                    {MAX_LEADS_PER_DAY_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </FormGrid>
            </Section>

            {/* Notificações */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdNotifications size={20} />
                </SectionIcon>
                <SectionTitle>Notificações e respostas</SectionTitle>
              </SectionHeader>
              <CheckboxWrap>
                <CheckboxLabel>
                  <input
                    type='checkbox'
                    checked={form.notifyManagerOnSlaBreach ?? true}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        notifyManagerOnSlaBreach: e.target.checked,
                      }))
                    }
                  />
                  Notificar gestor quando SLA estourar
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
                    type='checkbox'
                    checked={form.sendAutoReplyToLead ?? false}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        sendAutoReplyToLead: e.target.checked,
                      }))
                    }
                  />
                  Enviar resposta automática ao lead
                </CheckboxLabel>
              </CheckboxWrap>
            </Section>

            {/* Status */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdPeople size={20} />
                </SectionIcon>
                <SectionTitle>Status</SectionTitle>
              </SectionHeader>
              <CheckboxWrap>
                <CheckboxLabel>
                  <input
                    type='checkbox'
                    checked={form.isActive ?? true}
                    onChange={e =>
                      setForm(f => ({ ...f, isActive: e.target.checked }))
                    }
                  />
                  Configuração ativa
                </CheckboxLabel>
              </CheckboxWrap>
            </Section>

            <Section>
              <FooterActions>
                <Button
                  type='button'
                  $variant='secondary'
                  onClick={() => navigate(CONFIG_LIST_PATH)}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button type='submit' $variant='primary' disabled={saving}>
                  {saving ? (
                    <>
                      <LoadingSpinner
                        style={{
                          width: '16px',
                          height: '16px',
                          borderWidth: '2px',
                        }}
                      />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <MdSave size={18} />
                      {isEdit
                        ? 'Atualizar Configuração'
                        : 'Salvar Configuração'}
                    </>
                  )}
                </Button>
              </FooterActions>
            </Section>
          </form>
        </PageBody>
      </PageContainer>
    </Layout>
  );
}
