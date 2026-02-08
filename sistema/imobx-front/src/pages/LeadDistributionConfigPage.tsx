import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdAdd,
  MdEdit,
  MdDelete,
  MdPeople,
  MdInfo,
  MdBarChart,
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { LeadDistributionConfigShimmer } from '../components/shimmer/LeadDistributionConfigShimmer';
import { leadDistributionApi } from '../services/leadDistributionApi';
import { projectsApi } from '../services/projectsApi';
import { showSuccess, showError } from '../utils/notifications';
import type { LeadDistributionConfigDto } from '../services/leadDistributionApi';
import type { KanbanProjectResponseDto } from '../types/kanban';

const PageContainer = styled.div`
  padding: 12px;
  min-height: 100vh;
  background: ${p => p.theme.colors.background};
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  @media (min-width: 480px) {
    padding: 16px;
  }
  @media (min-width: 600px) {
    padding: 24px;
  }
  @media (min-width: 960px) {
    max-width: 1520px;
    margin: 0 auto;
    padding: 28px 32px;
  }
`;

const BackButton = styled.button`
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  color: ${p => p.theme.colors.text};
  cursor: pointer;
  padding: 10px 14px;
  min-height: 44px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 16px;
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;
  &:hover {
    background: ${p => p.theme.colors.primary};
    color: white;
    border-color: ${p => p.theme.colors.primary};
  }
  @media (max-width: 480px) {
    padding: 12px 14px;
    min-height: 48px;
    margin-bottom: 12px;
  }
  @media (min-width: 600px) {
    padding: 10px 16px;
    margin-bottom: 24px;
  }
`;

const Title = styled.h1`
  font-size: 1.35rem;
  font-weight: 700;
  color: ${p => p.theme.colors.text};
  margin: 0 0 6px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.02em;
  flex-wrap: wrap;
  @media (min-width: 480px) {
    font-size: 1.5rem;
    gap: 10px;
  }
  @media (min-width: 600px) {
    font-size: 1.75rem;
    gap: 12px;
    margin-bottom: 8px;
  }
  @media (min-width: 960px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${p => p.theme.colors.textSecondary};
  margin: 0 0 12px 0;
  line-height: 1.5;
  @media (min-width: 480px) {
    font-size: 0.9375rem;
  }
  @media (min-width: 600px) {
    font-size: 1rem;
    margin-bottom: 12px;
  }
`;

const AnalysisLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${p => p.theme.colors.primary};
  text-decoration: none;
  margin-bottom: 24px;
  &:hover {
    text-decoration: underline;
  }
  @media (min-width: 600px) {
    margin-bottom: 24px;
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  width: 100%;
  @media (min-width: 600px) {
    gap: 12px;
    margin-bottom: 24px;
    width: auto;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  min-height: 48px;
  background: ${p => p.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.15s,
    box-shadow 0.2s;
  flex: 1;
  min-width: 0;
  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
  }
  @media (min-width: 480px) {
    flex: none;
    font-size: 0.9375rem;
    padding: 10px 18px;
    min-height: 44px;
  }
`;

const TableWrap = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 12px;
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  @media (min-width: 960px) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`;

const Table = styled.table`
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 14px 12px;
  font-weight: 600;
  color: ${p => p.theme.colors.text};
  border-bottom: 2px solid ${p => p.theme.colors.border};
  white-space: nowrap;
  font-size: 0.8125rem;
  @media (min-width: 960px) {
    padding: 16px 14px;
    font-size: 0.875rem;
  }
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${p => p.theme.colors.border};
  color: ${p => p.theme.colors.text};
  vertical-align: middle;
  font-size: 0.8125rem;
  @media (min-width: 960px) {
    padding: 14px;
    font-size: 0.875rem;
  }
`;

const Tr = styled.tr`
  transition: background 0.15s;
  &:hover {
    background: ${p => p.theme.colors.backgroundSecondary};
  }
  &:last-child td {
    border-bottom: none;
  }
`;

const Badge = styled.span<{ $active?: boolean }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${p => (p.$active ? '#10B98120' : '#6B728020')};
  color: ${p => (p.$active ? '#10B981' : '#6B7280')};
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  padding: 10px;
  min-width: 44px;
  min-height: 44px;
  cursor: pointer;
  color: ${p => p.theme.colors.textSecondary};
  border-radius: 8px;
  transition:
    background 0.15s,
    color 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${p => p.theme.colors.backgroundSecondary};
    color: ${p => p.theme.colors.primary};
  }
  & + & {
    margin-left: 2px;
  }
  @media (min-width: 600px) {
    padding: 8px;
    min-width: 36px;
    min-height: 36px;
    & + & {
      margin-left: 4px;
    }
  }
`;

/* Cards para lista em mobile */
const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (min-width: 960px) {
    display: none;
  }
`;

const ConfigCard = styled.div`
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  @media (max-width: 480px) {
    padding: 14px 12px;
  }
`;

const ConfigCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
`;

const ConfigCardTitle = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: ${p => p.theme.colors.text};
`;

const ConfigCardActions = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`;

const ConfigCardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
  font-size: 0.8125rem;
  @media (max-width: 380px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const ConfigCardItem = styled.div<{ $full?: boolean }>`
  grid-column: ${p => (p.$full ? '1 / -1' : 'span 1')};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ConfigCardLabel = styled.span`
  color: ${p => p.theme.colors.textSecondary};
  font-size: 0.75rem;
  font-weight: 500;
`;

const ConfigCardValue = styled.span`
  color: ${p => p.theme.colors.text};
  font-weight: 500;
`;

const TableOnly = styled.div`
  display: none;
  @media (min-width: 960px) {
    display: block;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${p => p.theme.colors.textSecondary};
  font-size: 0.9375rem;
`;

const EmptyStateCard = styled.div`
  max-width: 520px;
  margin: 32px auto 0;
  padding: 40px 24px;
  text-align: center;
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 20px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.02);
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${p => p.theme.colors.primary} 0%,
      ${p => p.theme.colors.primary} 100%
    );
    opacity: 0.85;
  }
  @media (min-width: 480px) {
    padding: 48px 40px;
    margin-top: 40px;
    border-radius: 24px;
  }
`;

const EmptyStateIconWrap = styled.div`
  width: 88px;
  height: 88px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.theme.colors.backgroundSecondary};
  border-radius: 24px;
  color: ${p => p.theme.colors.primary};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  @media (min-width: 480px) {
    width: 96px;
    height: 96px;
    margin-bottom: 28px;
    border-radius: 28px;
  }
`;

const EmptyStateTitle = styled.h2`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${p => p.theme.colors.text};
  margin: 0 0 12px 0;
  line-height: 1.25;
  letter-spacing: -0.02em;
  @media (min-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 14px;
  }
`;

const EmptyStateDescription = styled.p`
  font-size: 0.9375rem;
  color: ${p => p.theme.colors.textSecondary};
  margin: 0 auto 28px;
  line-height: 1.6;
  max-width: 380px;
  @media (min-width: 480px) {
    font-size: 1rem;
    margin-bottom: 32px;
  }
`;

const EmptyStateFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 28px;
`;

const EmptyStateFeaturePill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${p => p.theme.colors.backgroundSecondary};
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${p => p.theme.colors.textSecondary};
  @media (min-width: 480px) {
    font-size: 0.875rem;
    padding: 8px 14px;
  }
`;

const EmptyStateActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
  @media (min-width: 400px) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 14px;
  }
`;

const EmptyStatePrimaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  background: ${p => p.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
  min-width: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  }
  &:active {
    transform: translateY(0);
  }
  @media (min-width: 400px) {
    min-width: 220px;
  }
`;

const EmptyStateSecondaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  background: ${p => p.theme.colors.backgroundSecondary};
  color: ${p => p.theme.colors.text};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
  min-width: 0;
  &:hover {
    background: ${p => p.theme.colors.border};
    border-color: ${p => p.theme.colors.primary};
    color: ${p => p.theme.colors.primary};
  }
  @media (min-width: 400px) {
    min-width: 220px;
  }
`;

const InfoBox = styled.div`
  padding: 12px 14px;
  background: ${p => p.theme.colors.backgroundSecondary};
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 0.8125rem;
  color: ${p => p.theme.colors.textSecondary};
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.45;
  @media (max-width: 480px) {
    padding: 10px 12px;
    margin-bottom: 16px;
    font-size: 0.75rem;
  }
  @media (min-width: 600px) {
    padding: 12px 16px;
    font-size: 0.875rem;
    margin-bottom: 24px;
  }
`;

const DISTRIBUTION_RULES: { value: string; label: string }[] = [
  { value: 'round_robin', label: 'Round Robin (alternado)' },
  { value: 'by_workload', label: 'Por carga (quem tem menos)' },
  { value: 'manual', label: 'Manual' },
];

export default function LeadDistributionConfigPage() {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<LeadDistributionConfigDto[]>([]);
  const [projects, setProjects] = useState<KanbanProjectResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [list, projRes] = await Promise.all([
        leadDistributionApi.list(),
        projectsApi
          .getFilteredProjects({ limit: '100', page: '1', status: 'active' })
          .catch(() => ({ data: [] })),
      ]);
      setConfigs(list);
      setProjects(projRes?.data ?? []);
    } catch (e) {
      showError('Erro ao carregar configurações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = (global: boolean) => {
    navigate(
      global
        ? '/integrations/lead-distribution/config/new'
        : '/integrations/lead-distribution/config/new/funnel'
    );
  };

  const openEdit = (c: LeadDistributionConfigDto) => {
    navigate(`/integrations/lead-distribution/config/edit/${c.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir esta configuração?')) return;
    try {
      await leadDistributionApi.delete(id);
      showSuccess('Configuração excluída.');
      load();
    } catch {
      showError('Erro ao excluir.');
    }
  };

  const scopeLabel = (c: LeadDistributionConfigDto) => {
    if (!c.kanbanProjectId) return 'Global';
    const proj = projects.find(p => p.id === c.kanbanProjectId);
    return proj?.name ?? c.kanbanProjectId;
  };

  const ruleLabel = (rule: string) =>
    DISTRIBUTION_RULES.find(r => r.value === rule)?.label ?? rule;

  return (
    <Layout>
      <PageContainer>
        <BackButton type='button' onClick={() => navigate(-1)}>
          <MdArrowBack size={20} />
          Voltar
        </BackButton>

        <Title>
          <MdPeople size={24} style={{ flexShrink: 0 }} />
          <span>Distribuição de Leads</span>
        </Title>
        <Subtitle>
          Configure regras de distribuição, SLA de primeiro contato, alertas e
          reatribuição por empresa (global) ou por funil.
        </Subtitle>
        <AnalysisLink to='/integrations/lead-distribution/analysis'>
          <MdBarChart size={20} />
          Ver análise de leads (funil, responsável, origem)
        </AnalysisLink>

        {!loading && configs.length > 0 && (
          <InfoBox>
            <MdInfo size={20} style={{ flexShrink: 0 }} />
            <span>
              A configuração <strong>global</strong> vale para todos os funis
              que não tiverem configuração própria. Crie uma configuração por{' '}
              <strong>funil</strong> para sobrescrever apenas naquele funil.
            </span>
          </InfoBox>
        )}

        {!loading && configs.length > 0 && (
          <Toolbar>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <AddButton type='button' onClick={() => openCreate(true)}>
                <MdAdd size={20} />
                Nova configuração global
              </AddButton>
              <AddButton type='button' onClick={() => openCreate(false)}>
                <MdAdd size={20} />
                Nova por funil
              </AddButton>
            </div>
          </Toolbar>
        )}

        {loading ? (
          <LeadDistributionConfigShimmer />
        ) : configs.length === 0 ? (
          <EmptyStateCard>
            <EmptyStateIconWrap>
              <MdPeople size={44} />
            </EmptyStateIconWrap>
            <EmptyStateTitle>Nenhuma configuração ainda</EmptyStateTitle>
            <EmptyStateDescription>
              Comece criando uma configuração global (vale para todos os funis)
              ou uma por funil para regras específicas. Você define SLA, alertas
              e como os leads são distribuídos entre os corretores.
            </EmptyStateDescription>
            <EmptyStateFeatures>
              <EmptyStateFeaturePill>
                SLA de primeiro contato
              </EmptyStateFeaturePill>
              <EmptyStateFeaturePill>
                Alertas e reatribuição
              </EmptyStateFeaturePill>
              <EmptyStateFeaturePill>
                Distribuição entre corretores
              </EmptyStateFeaturePill>
            </EmptyStateFeatures>
            <EmptyStateActions>
              <EmptyStatePrimaryBtn
                type='button'
                onClick={() => openCreate(true)}
              >
                <MdAdd size={20} />
                Nova configuração global
              </EmptyStatePrimaryBtn>
              <EmptyStateSecondaryBtn
                type='button'
                onClick={() => openCreate(false)}
              >
                <MdAdd size={20} />
                Nova por funil
              </EmptyStateSecondaryBtn>
            </EmptyStateActions>
          </EmptyStateCard>
        ) : (
          <>
            <CardsList>
              {configs.map(c => (
                <ConfigCard key={c.id}>
                  <ConfigCardHeader>
                    <ConfigCardTitle>{scopeLabel(c)}</ConfigCardTitle>
                    <ConfigCardActions>
                      <ActionBtn
                        type='button'
                        onClick={() => openEdit(c)}
                        title='Editar'
                      >
                        <MdEdit size={20} />
                      </ActionBtn>
                      <ActionBtn
                        type='button'
                        onClick={() => handleDelete(c.id)}
                        title='Excluir'
                      >
                        <MdDelete size={20} />
                      </ActionBtn>
                    </ConfigCardActions>
                  </ConfigCardHeader>
                  <ConfigCardGrid>
                    <ConfigCardItem>
                      <ConfigCardLabel>Regra</ConfigCardLabel>
                      <ConfigCardValue>
                        {ruleLabel(c.distributionRule)}
                      </ConfigCardValue>
                    </ConfigCardItem>
                    <ConfigCardItem>
                      <ConfigCardLabel>SLA (min)</ConfigCardLabel>
                      <ConfigCardValue>
                        {c.slaFirstContactMinutes}
                      </ConfigCardValue>
                    </ConfigCardItem>
                    <ConfigCardItem>
                      <ConfigCardLabel>Alerta (min)</ConfigCardLabel>
                      <ConfigCardValue>{c.alertWarningMinutes}</ConfigCardValue>
                    </ConfigCardItem>
                    <ConfigCardItem>
                      <ConfigCardLabel>Reatribuir</ConfigCardLabel>
                      <ConfigCardValue>
                        {c.reassignAfterMinutes === 0
                          ? '—'
                          : `${c.reassignAfterMinutes} min`}
                      </ConfigCardValue>
                    </ConfigCardItem>
                    <ConfigCardItem>
                      <ConfigCardLabel>Notif. gestor</ConfigCardLabel>
                      <ConfigCardValue>
                        {c.notifyManagerOnSlaBreach ? 'Sim' : 'Não'}
                      </ConfigCardValue>
                    </ConfigCardItem>
                    <ConfigCardItem>
                      <ConfigCardLabel>Resposta auto</ConfigCardLabel>
                      <ConfigCardValue>
                        {c.sendAutoReplyToLead ? 'Sim' : 'Não'}
                      </ConfigCardValue>
                    </ConfigCardItem>
                    <ConfigCardItem>
                      <ConfigCardLabel>Max leads/dia</ConfigCardLabel>
                      <ConfigCardValue>
                        {c.maxNewLeadsPerUserPerDay === 0
                          ? 'Ilimitado'
                          : c.maxNewLeadsPerUserPerDay}
                      </ConfigCardValue>
                    </ConfigCardItem>
                    <ConfigCardItem $full>
                      <ConfigCardLabel>Status</ConfigCardLabel>
                      <ConfigCardValue>
                        <Badge $active={c.isActive}>
                          {c.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </ConfigCardValue>
                    </ConfigCardItem>
                  </ConfigCardGrid>
                </ConfigCard>
              ))}
            </CardsList>
            <TableOnly>
              <TableWrap>
                <Table>
                  <thead>
                    <Tr>
                      <Th>Escopo</Th>
                      <Th>Regra</Th>
                      <Th>SLA (min)</Th>
                      <Th>Alerta (min)</Th>
                      <Th>Reatribuir (min)</Th>
                      <Th>Notif. gestor</Th>
                      <Th>Resposta auto</Th>
                      <Th>Max leads/dia</Th>
                      <Th>Ativo</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </thead>
                  <tbody>
                    {configs.map(c => (
                      <Tr key={c.id}>
                        <Td>{scopeLabel(c)}</Td>
                        <Td>{ruleLabel(c.distributionRule)}</Td>
                        <Td>{c.slaFirstContactMinutes}</Td>
                        <Td>{c.alertWarningMinutes}</Td>
                        <Td>
                          {c.reassignAfterMinutes === 0
                            ? '—'
                            : c.reassignAfterMinutes}
                        </Td>
                        <Td>{c.notifyManagerOnSlaBreach ? 'Sim' : 'Não'}</Td>
                        <Td>{c.sendAutoReplyToLead ? 'Sim' : 'Não'}</Td>
                        <Td>
                          {c.maxNewLeadsPerUserPerDay === 0
                            ? 'Ilimitado'
                            : c.maxNewLeadsPerUserPerDay}
                        </Td>
                        <Td>
                          <Badge $active={c.isActive}>
                            {c.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </Td>
                        <Td>
                          <ActionBtn
                            type='button'
                            onClick={() => openEdit(c)}
                            title='Editar'
                          >
                            <MdEdit size={18} />
                          </ActionBtn>
                          <ActionBtn
                            type='button'
                            onClick={() => handleDelete(c.id)}
                            title='Excluir'
                          >
                            <MdDelete size={18} />
                          </ActionBtn>
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrap>
            </TableOnly>
          </>
        )}
      </PageContainer>
    </Layout>
  );
}
