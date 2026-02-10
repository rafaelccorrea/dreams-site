import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdOpenInNew,
  MdPeople,
  MdFilterList,
  MdPerson,
  MdPersonOff,
  MdBarChart,
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { IntegrationConfigShimmer } from '../components/shimmer/IntegrationConfigShimmer';
import { leadDistributionApi } from '../services/leadDistributionApi';
import { projectsApi } from '../services/projectsApi';
import { companyMembersApi } from '../services/companyMembersApi';
import type {
  LeadOverviewItemDto,
  LeadOverviewFilters,
  LeadOverviewResponseDto,
  LeadOverviewSummaryDto,
  LeadOverviewChartsDto,
} from '../services/leadDistributionApi';
import { BarChart, LineChart } from '../components/charts';
import type { KanbanProjectResponseDto } from '../types/kanban';
import type { CompanyMember } from '../services/companyMembersApi';
import { getNavigationUrl } from '../utils/pathUtils';

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
  @media (max-width: 480px) {
    padding: 12px 14px;
    min-height: 48px;
    margin-bottom: 12px;
  }
  &:hover {
    background: ${p => p.theme.colors.primary};
    color: white;
    border-color: ${p => p.theme.colors.primary};
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
  flex-wrap: wrap;
  @media (min-width: 480px) {
    font-size: 1.5rem;
    gap: 10px;
  }
  @media (min-width: 600px) {
    font-size: 1.75rem;
    gap: 12px;
  }
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${p => p.theme.colors.textSecondary};
  margin: 0 0 20px 0;
  line-height: 1.5;
  @media (min-width: 480px) {
    font-size: 0.9375rem;
    margin-bottom: 24px;
  }
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  @media (max-width: 480px) {
    gap: 10px;
    margin-bottom: 20px;
  }
  @media (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SummaryCard = styled.div<{
  $highlight?: 'total' | 'attendance' | 'without';
}>`
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  @media (max-width: 480px) {
    padding: 14px 12px;
    gap: 10px;
  }
  ${p =>
    p.$highlight === 'without' &&
    `
    border-color: #F59E0B40;
    background: #FFFBEB;
  `}
  ${p =>
    p.$highlight === 'attendance' &&
    `
    border-color: #10B98140;
    background: #ECFDF5;
  `}
`;

const SummaryCardIcon = styled.div<{ $variant?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${p => p.theme.colors.backgroundSecondary};
  color: ${p => p.theme.colors.primary};
`;

const SummaryCardContent = styled.div`
  min-width: 0;
`;

const SummaryCardLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${p => p.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
`;

const SummaryCardValue = styled.div`
  font-size: 1.35rem;
  font-weight: 700;
  color: ${p => p.theme.colors.text};
  line-height: 1.2;
  @media (min-width: 480px) {
    font-size: 1.5rem;
  }
`;

const FiltersWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 20px;
  padding: 16px;
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    padding: 14px 12px;
    margin-bottom: 16px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
  @media (max-width: 600px) {
    min-width: 0;
    width: 100%;
  }
`;

const FilterLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${p => p.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  min-height: 44px;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${p => p.theme.colors.background};
  color: ${p => p.theme.colors.text};
  min-width: 160px;
  box-sizing: border-box;
  @media (max-width: 600px) {
    width: 100%;
    min-width: 0;
    min-height: 48px;
  }
  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.primary};
  }
`;

const FilterCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: ${p => p.theme.colors.text};
  cursor: pointer;
  white-space: nowrap;
  min-height: 44px;
  padding: 4px 0;
  @media (max-width: 600px) {
    white-space: normal;
  }
`;

const ApplyBtn = styled.button`
  padding: 12px 16px;
  min-height: 48px;
  background: ${p => p.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  @media (max-width: 600px) {
    width: 100%;
  }
  &:hover {
    opacity: 0.95;
  }
`;

const TableWrap = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 12px;
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  margin-bottom: 16px;
`;

const Table = styled.table`
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 14px;
  font-weight: 600;
  font-size: 0.8125rem;
  color: ${p => p.theme.colors.text};
  border-bottom: 2px solid ${p => p.theme.colors.border};
  background: ${p => p.theme.colors.backgroundSecondary};
`;

const Td = styled.td`
  padding: 12px 14px;
  border-bottom: 1px solid ${p => p.theme.colors.border};
  color: ${p => p.theme.colors.text};
  vertical-align: middle;
`;

const LinkToTask = styled.a`
  color: ${p => p.theme.colors.primary};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  padding: 8px 4px;
  margin: -4px 0;
  border-radius: 6px;
  transition: opacity 0.2s;
  @media (max-width: 480px) {
    padding: 10px 6px;
    margin: -6px 0;
  }
  &:hover {
    text-decoration: underline;
    opacity: 0.9;
  }
`;

const Pagination = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  font-size: 0.875rem;
  color: ${p => p.theme.colors.textSecondary};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  @media (max-width: 480px) {
    font-size: 0.8125rem;
    gap: 10px;
    padding: 12px 14px;
  }
`;

const PaginationBtn = styled.button`
  padding: 10px 14px;
  min-height: 44px;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 8px;
  background: ${p => p.theme.colors.cardBackground};
  color: ${p => p.theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;
  @media (max-width: 480px) {
    min-height: 48px;
    padding: 10px 12px;
  }
  &:hover:not(:disabled) {
    background: ${p => p.theme.colors.backgroundSecondary};
    border-color: ${p => p.theme.colors.primary};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 24px;
  color: ${p => p.theme.colors.textSecondary};
  font-size: 0.9375rem;
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
`;

const EmptyStateLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${p => p.theme.colors.primary};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ChartsSection = styled.section`
  margin-bottom: 28px;
  @media (max-width: 480px) {
    margin-bottom: 22px;
  }
`;

const ChartsTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: ${p => p.theme.colors.text};
  margin: 0 0 14px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  @media (min-width: 480px) {
    font-size: 1.125rem;
    margin-bottom: 16px;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  @media (max-width: 480px) {
    gap: 14px;
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
`;

const ChartCard = styled.div`
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  min-height: 320px;
  @media (max-width: 480px) {
    padding: 14px 12px;
    min-height: 280px;
  }
`;

const ChartCardTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${p => p.theme.colors.text};
  margin: 0 0 12px 0;
`;

/* Cards mobile */
const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  @media (min-width: 960px) {
    display: none;
  }
`;

const LeadCard = styled.div`
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const LeadCardTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: ${p => p.theme.colors.text};
  margin-bottom: 10px;
`;

const LeadCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  margin-bottom: 6px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const LeadCardLabel = styled.span`
  color: ${p => p.theme.colors.textSecondary};
`;

const LeadCardValue = styled.span`
  color: ${p => p.theme.colors.text};
  font-weight: 500;
  text-align: right;
`;

const TableOnly = styled.div`
  display: none;
  @media (min-width: 960px) {
    display: block;
  }
`;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatDateOnly(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendente',
  in_progress: 'Em progresso',
  completed: 'Concluído',
  blocked: 'Bloqueado',
  cancelled: 'Cancelado',
  on_hold: 'Em espera',
};

const RESULT_LABEL: Record<string, string> = {
  open: 'Aberto',
  won: 'Venda',
  lost: 'Perda',
  cancelled: 'Cancelado',
};

export default function LeadDistributionAnalysisPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<LeadOverviewResponseDto | null>(null);
  const [summary, setSummary] = useState<LeadOverviewSummaryDto | null>(null);
  const [charts, setCharts] = useState<LeadOverviewChartsDto | null>(null);
  const [projects, setProjects] = useState<KanbanProjectResponseDto[]>([]);
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LeadOverviewFilters>({
    page: 1,
    limit: 20,
  });
  const [filterProjectId, setFilterProjectId] = useState('');
  const [filterAssignedToId, setFilterAssignedToId] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [onlyWithSource, setOnlyWithSource] = useState(false);
  const limitOptions = [10, 20, 50, 100];

  const loadData = useCallback(async () => {
    setLoading(true);
    const summaryFilters = {
      projectId: filters.projectId,
      assignedToId: filters.assignedToId,
      source: filters.source,
      onlyWithSource: filters.onlyWithSource,
    };
    try {
      const [analysisRes, summaryRes, chartsRes, projRes, membersRes] =
        await Promise.all([
          leadDistributionApi.getAnalysis(filters),
          leadDistributionApi.getAnalysisSummary(summaryFilters),
          leadDistributionApi.getAnalysisCharts(summaryFilters),
          projectsApi
            .getFilteredProjects({ limit: '100', page: '1', status: 'active' })
            .catch(() => ({ data: [] })),
          companyMembersApi
            .getMembers({ limit: 200 })
            .catch(() => ({ data: [] })),
        ]);
      setResult(analysisRes);
      setSummary(summaryRes);
      setCharts(chartsRes);
      setProjects(projRes?.data ?? []);
      setMembers(membersRes?.data ?? []);
    } catch {
      setResult({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
      setSummary({ total: 0, inAttendance: 0, withoutAttendance: 0 });
      setCharts(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const applyFilters = () => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      projectId: filterProjectId || undefined,
      assignedToId: filterAssignedToId || undefined,
      source: filterSource || undefined,
      onlyWithSource,
    }));
  };

  const setPage = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const setLimit = (newLimit: number) => {
    setFilters(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const leads = result?.data ?? [];
  const total = result?.total ?? 0;
  const page = result?.page ?? 1;
  const limit = result?.limit ?? 20;
  const totalPages = result?.totalPages ?? 1;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  if (loading && !result) {
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
        <BackButton
          type='button'
          onClick={() => navigate('/integrations/lead-distribution/config')}
        >
          <MdArrowBack size={20} />
          Voltar à configuração
        </BackButton>

        <Title>
          <MdPeople size={24} style={{ flexShrink: 0 }} />
          Visibilidade de leads
        </Title>
        <Subtitle>
          Visão geral dos leads por funil, responsável e origem. Clique em
          &quot;Abrir tarefa&quot; para ir ao Kanban.
        </Subtitle>

        {summary != null && (
          <SummaryCards>
            <SummaryCard $highlight='total'>
              <SummaryCardIcon>
                <MdPeople size={22} />
              </SummaryCardIcon>
              <SummaryCardContent>
                <SummaryCardLabel>Total de leads</SummaryCardLabel>
                <SummaryCardValue>{summary.total}</SummaryCardValue>
              </SummaryCardContent>
            </SummaryCard>
            <SummaryCard $highlight='attendance'>
              <SummaryCardIcon>
                <MdPerson size={22} />
              </SummaryCardIcon>
              <SummaryCardContent>
                <SummaryCardLabel>Em atendimento</SummaryCardLabel>
                <SummaryCardValue>{summary.inAttendance}</SummaryCardValue>
              </SummaryCardContent>
            </SummaryCard>
            <SummaryCard $highlight='without'>
              <SummaryCardIcon>
                <MdPersonOff size={22} />
              </SummaryCardIcon>
              <SummaryCardContent>
                <SummaryCardLabel>Sem atendimento</SummaryCardLabel>
                <SummaryCardValue>{summary.withoutAttendance}</SummaryCardValue>
              </SummaryCardContent>
            </SummaryCard>
          </SummaryCards>
        )}

        <FiltersWrap>
          <FilterGroup>
            <FilterLabel>Funil</FilterLabel>
            <FilterSelect
              value={filterProjectId}
              onChange={e => setFilterProjectId(e.target.value)}
            >
              <option value=''>Todos</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Responsável</FilterLabel>
            <FilterSelect
              value={filterAssignedToId}
              onChange={e => setFilterAssignedToId(e.target.value)}
            >
              <option value=''>Todos</option>
              {members.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Origem</FilterLabel>
            <FilterSelect
              value={filterSource}
              onChange={e => setFilterSource(e.target.value)}
            >
              <option value=''>Todas</option>
              <option value='meta'>Meta (Facebook/Instagram)</option>
              <option value='grupo_zap'>Grupo ZAP</option>
              <option value='website'>Site</option>
              <option value='whatsapp'>WhatsApp</option>
            </FilterSelect>
          </FilterGroup>
          <FilterGroup
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              minWidth: 'auto',
            }}
          >
            <FilterCheckbox>
              <input
                type='checkbox'
                checked={onlyWithSource}
                onChange={e => setOnlyWithSource(e.target.checked)}
              />
              Só com origem
            </FilterCheckbox>
          </FilterGroup>
          <ApplyBtn type='button' onClick={applyFilters}>
            <MdFilterList size={18} />
            Filtrar
          </ApplyBtn>
        </FiltersWrap>

        {charts != null && (
          <ChartsSection>
            <ChartsTitle>
              <MdBarChart size={22} />
              Gráficos (últimos 30 dias / filtros aplicados)
            </ChartsTitle>
            <ChartsGrid>
              <ChartCard>
                <ChartCardTitle>Leads por dia</ChartCardTitle>
                <LineChart
                  data={(charts.byDay || []).map(d => ({
                    label: new Date(d.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                    }),
                    value: d.count,
                  }))}
                  label='Leads'
                  color='#3B82F6'
                />
              </ChartCard>
              <ChartCard>
                <ChartCardTitle>Leads por origem</ChartCardTitle>
                <BarChart
                  data={(charts.bySource || []).map(d => ({
                    label: d.source || '—',
                    value: d.count,
                  }))}
                  label='Leads'
                  color='#10B981'
                  horizontal
                />
              </ChartCard>
              <ChartCard>
                <ChartCardTitle>Leads por funil</ChartCardTitle>
                <BarChart
                  data={(charts.byProject || []).map(d => ({
                    label: d.projectName || '—',
                    value: d.count,
                  }))}
                  label='Leads'
                  color='#8B5CF6'
                  horizontal
                />
              </ChartCard>
            </ChartsGrid>
          </ChartsSection>
        )}

        <CardsList>
          {leads.length === 0 ? (
            <EmptyState>
              Nenhum lead encontrado com os filtros aplicados.
              <EmptyStateLink to='/integrations/lead-distribution/config'>
                <MdArrowBack size={18} />
                Ir para configuração de distribuição
              </EmptyStateLink>
            </EmptyState>
          ) : (
            leads.map((lead: LeadOverviewItemDto) => (
              <LeadCard key={lead.id}>
                <LeadCardTitle>{lead.title}</LeadCardTitle>
                <LeadCardRow>
                  <LeadCardLabel>Funil</LeadCardLabel>
                  <LeadCardValue>{lead.projectName || '—'}</LeadCardValue>
                </LeadCardRow>
                <LeadCardRow>
                  <LeadCardLabel>Responsável</LeadCardLabel>
                  <LeadCardValue>{lead.assignedToName || '—'}</LeadCardValue>
                </LeadCardRow>
                <LeadCardRow>
                  <LeadCardLabel>Origem</LeadCardLabel>
                  <LeadCardValue>{lead.source || '—'}</LeadCardValue>
                </LeadCardRow>
                <LeadCardRow>
                  <LeadCardLabel>Entrada</LeadCardLabel>
                  <LeadCardValue>{formatDate(lead.createdAt)}</LeadCardValue>
                </LeadCardRow>
                <LeadCardRow>
                  <LeadCardLabel>Última atualização</LeadCardLabel>
                  <LeadCardValue>
                    {lead.updatedAt ? formatDate(lead.updatedAt) : '—'}
                  </LeadCardValue>
                </LeadCardRow>
                <LeadCardRow>
                  <LeadCardLabel>Fechamento</LeadCardLabel>
                  <LeadCardValue>
                    {lead.resultDate
                      ? `${formatDateOnly(lead.resultDate)} ${formatTime(lead.resultDate)}`
                      : '—'}
                  </LeadCardValue>
                </LeadCardRow>
                <LeadCardRow>
                  <LeadCardLabel>Status / Resultado</LeadCardLabel>
                  <LeadCardValue>
                    {STATUS_LABEL[lead.status] || lead.status}
                    {lead.result
                      ? ` · ${RESULT_LABEL[lead.result] || lead.result}`
                      : ''}
                  </LeadCardValue>
                </LeadCardRow>
                <div style={{ marginTop: 10 }}>
                  <LinkToTask
                    href={getNavigationUrl(`/kanban/task/${lead.id}`)}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <MdOpenInNew size={16} />
                    Abrir tarefa
                  </LinkToTask>
                </div>
              </LeadCard>
            ))
          )}
        </CardsList>

        <TableOnly>
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th>Lead</Th>
                  <Th>Funil</Th>
                  <Th>Responsável</Th>
                  <Th>Origem</Th>
                  <Th>Campanha</Th>
                  <Th>Entrada</Th>
                  <Th>Atualizado</Th>
                  <Th>Fechamento</Th>
                  <Th>Status</Th>
                  <Th>Resultado</Th>
                  <Th style={{ width: 100 }}>Ação</Th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <Td
                      colSpan={11}
                      style={{ textAlign: 'center', padding: 32 }}
                    >
                      <div>
                        Nenhum lead encontrado com os filtros aplicados.
                      </div>
                      <EmptyStateLink
                        to='/integrations/lead-distribution/config'
                        style={{ marginTop: 12, display: 'inline-flex' }}
                      >
                        <MdArrowBack size={18} />
                        Ir para configuração de distribuição
                      </EmptyStateLink>
                    </Td>
                  </tr>
                ) : (
                  leads.map((lead: LeadOverviewItemDto) => (
                    <tr key={lead.id}>
                      <Td>
                        <strong>{lead.title}</strong>
                      </Td>
                      <Td>{lead.projectName || '—'}</Td>
                      <Td>{lead.assignedToName || '—'}</Td>
                      <Td>{lead.source || '—'}</Td>
                      <Td>{lead.campaign || '—'}</Td>
                      <Td title={formatDate(lead.createdAt)}>
                        {formatDate(lead.createdAt)}
                      </Td>
                      <Td
                        title={
                          lead.updatedAt
                            ? formatDate(lead.updatedAt)
                            : undefined
                        }
                      >
                        {lead.updatedAt ? formatDate(lead.updatedAt) : '—'}
                      </Td>
                      <Td>
                        {lead.resultDate
                          ? `${formatDateOnly(lead.resultDate)} ${formatTime(lead.resultDate)}`
                          : '—'}
                      </Td>
                      <Td>{STATUS_LABEL[lead.status] || lead.status}</Td>
                      <Td>
                        {lead.result
                          ? RESULT_LABEL[lead.result] || lead.result
                          : '—'}
                      </Td>
                      <Td>
                        <LinkToTask
                          href={getNavigationUrl(`/kanban/task/${lead.id}`)}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <MdOpenInNew size={16} />
                          Abrir
                        </LinkToTask>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </TableWrap>
        </TableOnly>

        <Pagination>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
            <span>
              {total === 0
                ? 'Nenhum lead'
                : `Mostrando ${from}–${to} de ${total} lead(s)`}
            </span>
            <FilterGroup style={{ marginBottom: 0, minWidth: 100 }}>
              <FilterLabel>Por página</FilterLabel>
              <FilterSelect
                value={limit}
                onChange={e => setLimit(Number(e.target.value))}
                style={{ minWidth: 80 }}
              >
                {limitOptions.map(n => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <PaginationBtn
              type='button'
              disabled={page <= 1}
              onClick={() => setPage(1)}
              title='Primeira página'
            >
              Primeira
            </PaginationBtn>
            <PaginationBtn
              type='button'
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              title='Página anterior'
            >
              Anterior
            </PaginationBtn>
            <span>
              Página {page} de {totalPages || 1}
            </span>
            <PaginationBtn
              type='button'
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              title='Próxima página'
            >
              Próxima
            </PaginationBtn>
            <PaginationBtn
              type='button'
              disabled={page >= totalPages}
              onClick={() => setPage(totalPages || 1)}
              title='Última página'
            >
              Última
            </PaginationBtn>
          </div>
        </Pagination>
      </PageContainer>
    </Layout>
  );
}
