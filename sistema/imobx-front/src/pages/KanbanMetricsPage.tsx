import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdFilterList,
  MdDateRange,
  MdAutoAwesome,
  MdOpenInNew,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { SubtaskMetricsDashboard } from '../components/kanban/SubtaskMetricsDashboard';
import { TasksMetricsDashboard } from '../components/kanban/TasksMetricsDashboard';
import { ColumnValueAnalysisDashboard } from '../components/kanban/ColumnValueAnalysisDashboard';
import { useTeams } from '../hooks/useTeams';
import { useProjects } from '../hooks/useProjects';
import { useUsers } from '../hooks/useUsers';
import { MetricsShimmer } from '../components/shimmer/MetricsShimmer';
import { kanbanMetricsApi } from '../services/kanbanMetricsApi';
import type { FunnelInsights } from '../types/kanban';

const PageContainer = styled.div`
  padding: 8px 16px;
  width: 100%;
  max-width: 100%;
  margin: 0;

  @media (max-width: 768px) {
    padding: 8px 12px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
    transform: translateX(-4px);
  }
`;

const FiltersSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const FiltersTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary + '15'};
  }
`;

const DateInput = styled.input`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  font-family: inherit;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary + '15'};
  }
`;

const DateRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ClearFiltersButton = styled.button`
  padding: 10px 20px;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 24px;
  background: transparent;
  color: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  border: none;
  border-bottom: 2px solid
    ${props => (props.$active ? props.theme.colors.primary : 'transparent')};
  font-size: 0.95rem;
  font-weight: ${props => (props.$active ? 600 : 500)};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: -2px;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const InsightsCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const InsightsTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InsightsText = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

const LinkToInsightsPage = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const KanbanMetricsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { teams, refreshTeams } = useTeams();
  const { users, getUsers } = useUsers();

  const [funnelInsights, setFunnelInsights] = useState<FunnelInsights | null>(
    null
  );
  const [insightsLoading, setInsightsLoading] = useState(false);

  const [selectedTeamId, setSelectedTeamId] = useState<string>(
    searchParams.get('teamId') || ''
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    searchParams.get('projectId') || ''
  );
  const [selectedUserId, setSelectedUserId] = useState<string>(
    searchParams.get('userId') || ''
  );
  const [startDate, setStartDate] = useState<string>(
    searchParams.get('startDate') || ''
  );
  const [endDate, setEndDate] = useState<string>(
    searchParams.get('endDate') || ''
  );
  const [activeTab, setActiveTab] = useState<
    'negotiations' | 'subtasks' | 'column-values'
  >(
    (searchParams.get('tab') as
      | 'negotiations'
      | 'subtasks'
      | 'column-values') || 'negotiations'
  );
  const [loading, setLoading] = useState(true);

  const validTeamId =
    selectedTeamId && selectedTeamId !== '' ? selectedTeamId : undefined;
  const { projects } = useProjects(validTeamId);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([refreshTeams(), getUsers({ limit: 100 })]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [refreshTeams, getUsers]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedTeamId) params.set('teamId', selectedTeamId);
    if (selectedProjectId) params.set('projectId', selectedProjectId);
    if (selectedUserId) params.set('userId', selectedUserId);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (activeTab) params.set('tab', activeTab);
    setSearchParams(params, { replace: true });
  }, [
    selectedTeamId,
    selectedProjectId,
    selectedUserId,
    startDate,
    endDate,
    activeTab,
    setSearchParams,
  ]);

  useEffect(() => {
    if (!selectedTeamId || !selectedProjectId) {
      setFunnelInsights(null);
      return;
    }
    let cancelled = false;
    setInsightsLoading(true);
    kanbanMetricsApi
      .getFunnelInsights(selectedTeamId, selectedProjectId)
      .then(data => {
        if (!cancelled) setFunnelInsights(data);
      })
      .catch(() => {
        if (!cancelled) setFunnelInsights(null);
      })
      .finally(() => {
        if (!cancelled) setInsightsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedTeamId, selectedProjectId]);

  const handleClearFilters = () => {
    setSelectedTeamId('');
    setSelectedProjectId('');
    setSelectedUserId('');
    setStartDate('');
    setEndDate('');
  };

  const handleBack = () => {
    navigate('/kanban');
  };

  // Obter taskId se houver projectId selecionado (opcional, pode ser usado para filtrar)
  const taskId = selectedProjectId || undefined;

  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <MetricsShimmer />
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <Header>
          <HeaderLeft>
            <Title>Métricas e Analytics do Funil de Vendas</Title>
            <Subtitle>
              Analise o desempenho de negociações, subtarefas e corretores
            </Subtitle>
          </HeaderLeft>
          <BackButton onClick={handleBack} type='button'>
            <MdArrowBack size={20} />
            Voltar
          </BackButton>
        </Header>

        <FiltersSection>
          <FiltersHeader>
            <MdFilterList size={20} />
            <FiltersTitle>Filtros</FiltersTitle>
          </FiltersHeader>
          <FiltersGrid>
            <FilterGroup>
              <FilterLabel>Equipe</FilterLabel>
              <Select
                value={selectedTeamId}
                onChange={e => {
                  setSelectedTeamId(e.target.value);
                  setSelectedProjectId(''); // Limpar projeto ao mudar equipe
                }}
              >
                <option value=''>Todas as equipes</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Projeto</FilterLabel>
              <Select
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                disabled={!selectedTeamId}
              >
                <option value=''>Todos os projetos</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Corretor</FilterLabel>
              <Select
                value={selectedUserId}
                onChange={e => setSelectedUserId(e.target.value)}
              >
                <option value=''>Todos os corretores</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </FilterGroup>
          </FiltersGrid>

          <DateRow>
            <FilterGroup>
              <FilterLabel>
                <MdDateRange
                  size={16}
                  style={{ marginRight: '4px', verticalAlign: 'middle' }}
                />
                Data Inicial
              </FilterLabel>
              <DateInput
                type='date'
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                <MdDateRange
                  size={16}
                  style={{ marginRight: '4px', verticalAlign: 'middle' }}
                />
                Data Final
              </FilterLabel>
              <DateInput
                type='date'
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                min={startDate}
              />
            </FilterGroup>
          </DateRow>

          {(selectedTeamId ||
            selectedProjectId ||
            selectedUserId ||
            startDate ||
            endDate) && (
            <ClearFiltersButton onClick={handleClearFilters}>
              Limpar Filtros
            </ClearFiltersButton>
          )}
        </FiltersSection>

        {selectedTeamId && selectedProjectId && (
          <InsightsCard>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 8,
              }}
            >
              <InsightsTitle style={{ marginBottom: 0 }}>
                <MdAutoAwesome size={20} />
                Insights IA
              </InsightsTitle>
              <LinkToInsightsPage
                href={`/kanban/insights?teamId=${selectedTeamId}&projectId=${selectedProjectId}`}
                onClick={e => {
                  e.preventDefault();
                  navigate(
                    `/kanban/insights?teamId=${selectedTeamId}&projectId=${selectedProjectId}`
                  );
                }}
              >
                <MdOpenInNew size={18} />
                Ver tela completa
              </LinkToInsightsPage>
            </div>
            {insightsLoading ? (
              <InsightsText>Carregando insights do funil...</InsightsText>
            ) : funnelInsights ? (
              <>
                {funnelInsights.summaryText ? (
                  <InsightsText>{funnelInsights.summaryText}</InsightsText>
                ) : (
                  <InsightsText>
                    O funil tem{' '}
                    <strong>{funnelInsights.summary.totalOpenTasks}</strong>{' '}
                    negociação(ões) aberta(s).
                    {funnelInsights.summary.stuckCount > 0 && (
                      <>
                        {' '}
                        <strong>
                          {funnelInsights.summary.stuckCount}
                        </strong>{' '}
                        parada(s) há 7+ dias.
                      </>
                    )}
                    {funnelInsights.summary.needFollowUpCount > 0 && (
                      <>
                        {' '}
                        <strong>
                          {funnelInsights.summary.needFollowUpCount}
                        </strong>{' '}
                        precisam de follow-up.
                      </>
                    )}
                    {funnelInsights.summary.priorityCount > 0 && (
                      <>
                        {' '}
                        Sugestão: foque em{' '}
                        <strong>
                          {funnelInsights.summary.priorityCount}
                        </strong>{' '}
                        prioridade(s) hoje.
                      </>
                    )}
                    {funnelInsights.summary.totalOpenTasks === 0 &&
                      ' Nenhuma negociação aberta no momento.'}
                  </InsightsText>
                )}
                {funnelInsights.focusSuggestions &&
                  funnelInsights.focusSuggestions.length > 0 && (
                    <ul
                      style={{
                        margin: '12px 0 0 0',
                        paddingLeft: 20,
                        fontSize: '0.9rem',
                      }}
                    >
                      {funnelInsights.focusSuggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  )}
              </>
            ) : (
              <InsightsText>
                Selecione equipe e projeto para ver os insights do funil.
              </InsightsText>
            )}
          </InsightsCard>
        )}

        <TabsContainer>
          <Tab
            $active={activeTab === 'negotiations'}
            onClick={() => setActiveTab('negotiations')}
          >
            Métricas de Negociações
          </Tab>
          <Tab
            $active={activeTab === 'subtasks'}
            onClick={() => setActiveTab('subtasks')}
          >
            Métricas de Subtarefas
          </Tab>
        </TabsContainer>

        {activeTab === 'negotiations' ? (
          <TasksMetricsDashboard
            teamId={selectedTeamId || undefined}
            projectId={selectedProjectId || undefined}
            userId={selectedUserId || undefined}
            startDate={startDate || undefined}
            endDate={endDate || undefined}
          />
        ) : activeTab === 'subtasks' ? (
          <SubtaskMetricsDashboard
            teamId={selectedTeamId || undefined}
            taskId={taskId}
            userId={selectedUserId || undefined}
            startDate={startDate || undefined}
            endDate={endDate || undefined}
          />
        ) : selectedTeamId ? (
          <ColumnValueAnalysisDashboard
            teamId={selectedTeamId}
            startDate={startDate || undefined}
            endDate={endDate || undefined}
          />
        ) : (
          <div
            style={{ padding: '40px', textAlign: 'center', color: 'inherit' }}
          >
            Selecione uma equipe para visualizar a análise de valores por coluna
          </div>
        )}
      </PageContainer>
    </Layout>
  );
};

export default KanbanMetricsPage;
