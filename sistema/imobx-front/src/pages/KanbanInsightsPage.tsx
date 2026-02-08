import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdAutoAwesome,
  MdWarning,
  MdSchedule,
  MdTrendingUp,
  MdViewColumn,
  MdFilterList,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { useTeams } from '../hooks/useTeams';
import { useProjects } from '../hooks/useProjects';
import { kanbanMetricsApi } from '../services/kanbanMetricsApi';
import type { FunnelInsights } from '../types/kanban';

const PageContainer = styled.div`
  padding: 8px 16px;
  width: 100%;
  max-width: 100%;
  margin: 0;
  box-sizing: border-box;

  @media (min-width: 960px) {
    max-width: 1520px;
    margin: 0 auto;
    padding: 24px 32px;
  }

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
    margin-bottom: 24px;
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
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
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

  @media (max-width: 768px) {
    padding: 20px 16px;
    margin-bottom: 20px;
  }
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

const ContentSection = styled.section`
  margin-bottom: 24px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Card = styled.div<{ $accent?: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 0;
  ${props =>
    props.$accent &&
    `
    border-left: 4px solid ${props.theme.colors.primary};
  `}

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
`;

const SummaryItem = styled.div<{ $highlight?: boolean }>`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 20px 16px;
  text-align: center;
  ${props =>
    props.$highlight &&
    `
    border-color: ${props.theme.colors.primary};
    background: ${props.theme.colors.primary}12;
  `}

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

const SummaryValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SummaryLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 6px;
  line-height: 1.3;
`;

const InsightsParagraph = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
`;

const FocusList = styled.ul`
  margin: 14px 0 0 0;
  padding-left: 22px;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const PriorityTask = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 16px 18px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}0a;
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
    margin-bottom: 10px;
  }
`;

const PriorityTaskTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const PriorityTaskMeta = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 6px;
`;

const Badge = styled.span<{ $variant: 'high' | 'medium' | 'low' }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 8px;
  ${props => {
    const colors = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' };
    return `background: ${colors[props.$variant]}22; color: ${colors[props.$variant]};`;
  }}
`;

const ColumnRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-size: 0.95rem;

  &:last-child {
    border-bottom: none;
  }
`;

const ShimmerBlock = styled.div`
  height: 80px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
  border-radius: 10px;
  margin-bottom: 16px;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const EmptyMessage = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  margin: 0;
  padding: 32px 24px;
  text-align: center;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 1px dashed ${props => props.theme.colors.border};
`;

const ColumnFilterBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  margin-bottom: 20px;
  background: ${props => props.theme.colors.primary + '12'};
  border: 1px solid ${props => props.theme.colors.primary + '30'};
  border-radius: 10px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
`;

const ClearColumnFilterLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    opacity: 0.9;
  }
`;

const KanbanInsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { teams } = useTeams();
  const teamIdFromUrl = searchParams.get('teamId') || '';
  const projectIdFromUrl = searchParams.get('projectId') || '';
  const columnIdFromUrl = searchParams.get('columnId') || '';
  const columnTitleFromUrl = searchParams.get('columnTitle') || '';

  const [selectedTeamId, setSelectedTeamId] = useState(teamIdFromUrl);
  const [selectedProjectId, setSelectedProjectId] = useState(projectIdFromUrl);
  const [insights, setInsights] = useState<FunnelInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const filterByColumnId = columnIdFromUrl || undefined;
  const filterByColumnTitle = columnTitleFromUrl || undefined;

  const validTeamId =
    selectedTeamId && selectedTeamId !== '' ? selectedTeamId : undefined;
  const { projects } = useProjects(validTeamId);

  useEffect(() => {
    setSelectedTeamId(teamIdFromUrl);
    setSelectedProjectId(projectIdFromUrl);
  }, [teamIdFromUrl, projectIdFromUrl]);

  useEffect(() => {
    if (!selectedTeamId || !selectedProjectId) {
      setInsights(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    kanbanMetricsApi
      .getFunnelInsights(selectedTeamId, selectedProjectId)
      .then(data => {
        if (!cancelled) setInsights(data);
      })
      .catch(() => {
        if (!cancelled) setInsights(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedTeamId, selectedProjectId]);

  const handleBack = () => {
    const params = new URLSearchParams();
    if (selectedTeamId) params.set('teamId', selectedTeamId);
    if (selectedProjectId) params.set('projectId', selectedProjectId);
    navigate(`/kanban${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleTaskClick = (taskId: string) => {
    const params = new URLSearchParams();
    if (selectedTeamId) params.set('teamId', selectedTeamId);
    if (selectedProjectId) params.set('projectId', selectedProjectId);
    navigate(
      `/kanban/task/${taskId}${params.toString() ? `?${params.toString()}` : ''}`
    );
  };

  const priorityInsights = insights
    ? insights.taskInsights.filter(
        t =>
          insights.priorityTaskIds.includes(t.taskId) &&
          (!filterByColumnId || t.columnId === filterByColumnId)
      )
    : [];

  const columnStuckFiltered =
    insights?.columnStuckCounts.filter(
      c => !filterByColumnId || c.columnId === filterByColumnId
    ) ?? [];
  const showColumnStuckSection = columnStuckFiltered.some(
    c => c.stuckCount > 0 || c.followUpCount > 0
  );

  return (
    <Layout>
      <PageContainer>
        <Header>
          <HeaderLeft>
            <Title>
              <MdAutoAwesome size={28} />
              Insights IA — Funil de Vendas
            </Title>
            <Subtitle>
              Resumo e prioridades do funil gerados por IA. Selecione a equipe e
              o funil abaixo.
            </Subtitle>
          </HeaderLeft>
          <BackButton onClick={handleBack} type='button'>
            <MdArrowBack size={20} />
            Voltar ao funil
          </BackButton>
        </Header>

        {filterByColumnId && (
          <ColumnFilterBadge>
            <MdAutoAwesome size={18} />
            <span>
              Insights da coluna:{' '}
              <strong>{filterByColumnTitle || 'Coluna'}</strong>
            </span>
            <ClearColumnFilterLink
              type='button'
              onClick={() => {
                const params = new URLSearchParams();
                if (selectedTeamId) params.set('teamId', selectedTeamId);
                if (selectedProjectId)
                  params.set('projectId', selectedProjectId);
                navigate(`/kanban/insights?${params.toString()}`);
              }}
            >
              Ver todos os insights
            </ClearColumnFilterLink>
          </ColumnFilterBadge>
        )}

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
                  setSelectedProjectId('');
                }}
              >
                <option value=''>Selecione a equipe</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Funil</FilterLabel>
              <Select
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                disabled={!selectedTeamId}
              >
                <option value=''>Selecione o funil</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </FilterGroup>
          </FiltersGrid>
        </FiltersSection>

        {loading && (
          <ContentSection>
            <SectionTitle>Resumo</SectionTitle>
            <Card>
              <ShimmerBlock />
              <ShimmerBlock />
              <ShimmerBlock />
            </Card>
          </ContentSection>
        )}

        {!loading && insights && (
          <>
            <ContentSection>
              <SectionTitle>Resumo</SectionTitle>
              <Card $accent>
                <SummaryGrid>
                  <SummaryItem>
                    <SummaryValue>
                      {insights.summary.totalOpenTasks}
                    </SummaryValue>
                    <SummaryLabel>Negociações abertas</SummaryLabel>
                  </SummaryItem>
                  <SummaryItem $highlight={insights.summary.stuckCount > 0}>
                    <SummaryValue>{insights.summary.stuckCount}</SummaryValue>
                    <SummaryLabel>Paradas há 7+ dias</SummaryLabel>
                  </SummaryItem>
                  <SummaryItem
                    $highlight={insights.summary.needFollowUpCount > 0}
                  >
                    <SummaryValue>
                      {insights.summary.needFollowUpCount}
                    </SummaryValue>
                    <SummaryLabel>Precisam de follow-up</SummaryLabel>
                  </SummaryItem>
                  <SummaryItem>
                    <SummaryValue>
                      {insights.summary.priorityCount}
                    </SummaryValue>
                    <SummaryLabel>Prioridade para hoje</SummaryLabel>
                  </SummaryItem>
                </SummaryGrid>
              </Card>
            </ContentSection>

            {insights.summaryText && (
              <ContentSection>
                <SectionTitle>
                  <MdAutoAwesome size={20} />
                  Análise da IA
                </SectionTitle>
                <Card>
                  <InsightsParagraph>{insights.summaryText}</InsightsParagraph>
                  {insights.focusSuggestions &&
                    insights.focusSuggestions.length > 0 && (
                      <FocusList>
                        {insights.focusSuggestions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </FocusList>
                    )}
                </Card>
              </ContentSection>
            )}

            {(priorityInsights.length > 0 || filterByColumnId) && (
              <ContentSection>
                <SectionTitle>
                  <MdTrendingUp size={20} />
                  {filterByColumnId ? 'Foque hoje nesta coluna' : 'Foque hoje'}
                </SectionTitle>
                <Card>
                  {priorityInsights.length > 0 ? (
                    priorityInsights.slice(0, 10).map(task => (
                      <PriorityTask
                        key={task.taskId}
                        type='button'
                        onClick={() => handleTaskClick(task.taskId)}
                      >
                        <PriorityTaskTitle>
                          {task.title}
                          <Badge $variant={task.aiPriority}>
                            {task.aiPriority === 'high'
                              ? 'Alta'
                              : task.aiPriority === 'medium'
                                ? 'Média'
                                : 'Baixa'}
                          </Badge>
                        </PriorityTaskTitle>
                        <PriorityTaskMeta>
                          {task.nextActionSuggestion}
                          {task.daysSinceUpdate > 0 &&
                            ` · ${task.daysSinceUpdate}d sem atualização`}
                        </PriorityTaskMeta>
                      </PriorityTask>
                    ))
                  ) : (
                    <EmptyMessage style={{ padding: '20px 16px', margin: 0 }}>
                      Nenhuma negociação prioritária nesta coluna no momento.
                    </EmptyMessage>
                  )}
                </Card>
              </ContentSection>
            )}

            {showColumnStuckSection && (
              <ContentSection>
                <SectionTitle>
                  <MdViewColumn size={20} />
                  {filterByColumnId ? 'Esta coluna' : 'Parados por coluna'}
                </SectionTitle>
                <Card>
                  {columnStuckFiltered
                    .filter(c => c.stuckCount > 0 || c.followUpCount > 0)
                    .map(col => (
                      <ColumnRow key={col.columnId}>
                        <span>{col.columnName}</span>
                        <span
                          style={{
                            display: 'flex',
                            gap: 16,
                            fontSize: '0.9rem',
                          }}
                        >
                          {col.followUpCount > 0 && (
                            <span title='Precisam follow-up (3+ dias)'>
                              <MdSchedule
                                size={16}
                                style={{
                                  verticalAlign: 'middle',
                                  marginRight: 4,
                                }}
                              />
                              {col.followUpCount}
                            </span>
                          )}
                          {col.stuckCount > 0 && (
                            <span title='Parados 7+ dias'>
                              <MdWarning
                                size={16}
                                style={{
                                  verticalAlign: 'middle',
                                  marginRight: 4,
                                }}
                              />
                              {col.stuckCount}
                            </span>
                          )}
                        </span>
                      </ColumnRow>
                    ))}
                </Card>
              </ContentSection>
            )}

            {insights.summary.totalOpenTasks === 0 && (
              <ContentSection>
                <EmptyMessage>
                  Nenhuma negociação aberta neste funil. Os insights aparecem
                  quando houver tarefas em andamento.
                </EmptyMessage>
              </ContentSection>
            )}
          </>
        )}

        {!loading && !insights && selectedTeamId && selectedProjectId && (
          <ContentSection>
            <EmptyMessage>
              Não foi possível carregar os insights. Tente novamente.
            </EmptyMessage>
          </ContentSection>
        )}

        {!loading && (!selectedTeamId || !selectedProjectId) && (
          <ContentSection>
            <EmptyMessage>
              Selecione a equipe e o funil para ver os insights.
            </EmptyMessage>
          </ContentSection>
        )}
      </PageContainer>
    </Layout>
  );
};

export default KanbanInsightsPage;
