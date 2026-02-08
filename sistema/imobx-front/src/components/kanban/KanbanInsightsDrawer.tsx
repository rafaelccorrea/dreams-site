import React from 'react';
import styled from 'styled-components';
import {
  MdAutoAwesome,
  MdWarning,
  MdSchedule,
  MdTrendingUp,
  MdViewColumn,
} from 'react-icons/md';
import { FilterDrawer } from '../common/FilterDrawer';
import type { FunnelInsights } from '../../types/kanban';

interface KanbanInsightsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  insights: FunnelInsights | null;
  loading?: boolean;
  onTaskClick?: (taskId: string) => void;
}

const InsightCard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
`;

const SummaryItem = styled.div<{ $highlight?: boolean }>`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  ${props =>
    props.$highlight &&
    `
    border-color: ${props.theme.colors.primary};
    background: ${props.theme.colors.primary}12;
  `}
`;

const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const SummaryLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
`;

const PriorityTask = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}0a;
  }
`;

const PriorityTaskTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const PriorityTaskMeta = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
`;

const Badge = styled.span<{ $variant: 'high' | 'medium' | 'low' }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 6px;
  ${props => {
    const colors = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' };
    return `background: ${colors[props.$variant]}22; color: ${colors[props.$variant]};`;
  }}
`;

const ColumnRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-size: 0.875rem;

  &:last-child {
    border-bottom: none;
  }
`;

const ShimmerBlock = styled.div`
  height: 60px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
  border-radius: 8px;
  margin-bottom: 12px;

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
  font-size: 0.9rem;
  margin: 0;
  padding: 16px 0;
`;

const InsightsParagraph = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${props => props.theme.colors.text};
`;

export const KanbanInsightsDrawer: React.FC<KanbanInsightsDrawerProps> = ({
  isOpen,
  onClose,
  insights,
  loading = false,
  onTaskClick,
}) => {
  const priorityInsights = insights
    ? insights.taskInsights.filter(t =>
        insights.priorityTaskIds.includes(t.taskId)
      )
    : [];

  return (
    <FilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title='Insights IA — Funil de Vendas'
    >
      <div style={{ padding: '0 4px' }}>
        {loading && (
          <>
            <SectionTitle>
              <MdAutoAwesome size={18} /> Resumo
            </SectionTitle>
            <ShimmerBlock />
            <ShimmerBlock />
            <ShimmerBlock />
          </>
        )}

        {!loading && insights && (
          <>
            <SectionTitle>
              <MdAutoAwesome size={18} />
              Resumo
            </SectionTitle>
            <SummaryGrid>
              <SummaryItem>
                <SummaryValue>{insights.summary.totalOpenTasks}</SummaryValue>
                <SummaryLabel>Negociações abertas</SummaryLabel>
              </SummaryItem>
              <SummaryItem $highlight={insights.summary.stuckCount > 0}>
                <SummaryValue>{insights.summary.stuckCount}</SummaryValue>
                <SummaryLabel>Paradas há 7+ dias</SummaryLabel>
              </SummaryItem>
              <SummaryItem $highlight={insights.summary.needFollowUpCount > 0}>
                <SummaryValue>
                  {insights.summary.needFollowUpCount}
                </SummaryValue>
                <SummaryLabel>Precisam de follow-up</SummaryLabel>
              </SummaryItem>
              <SummaryItem>
                <SummaryValue>{insights.summary.priorityCount}</SummaryValue>
                <SummaryLabel>Prioridade para hoje</SummaryLabel>
              </SummaryItem>
            </SummaryGrid>

            {insights.summaryText && (
              <InsightCard style={{ marginBottom: 12 }}>
                <InsightsParagraph>{insights.summaryText}</InsightsParagraph>
                {insights.focusSuggestions &&
                  insights.focusSuggestions.length > 0 && (
                    <ul
                      style={{
                        margin: '10px 0 0 0',
                        paddingLeft: 20,
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary, #666)',
                      }}
                    >
                      {insights.focusSuggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  )}
              </InsightCard>
            )}

            {priorityInsights.length > 0 && (
              <>
                <SectionTitle>
                  <MdTrendingUp size={18} />
                  Foque hoje
                </SectionTitle>
                <InsightCard>
                  {priorityInsights.slice(0, 8).map(task => (
                    <PriorityTask
                      key={task.taskId}
                      type='button'
                      onClick={() => onTaskClick?.(task.taskId)}
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
                  ))}
                </InsightCard>
              </>
            )}

            {insights.columnStuckCounts.some(
              c => c.stuckCount > 0 || c.followUpCount > 0
            ) && (
              <>
                <SectionTitle>
                  <MdViewColumn size={18} />
                  Parados por coluna
                </SectionTitle>
                <InsightCard>
                  {insights.columnStuckCounts
                    .filter(c => c.stuckCount > 0 || c.followUpCount > 0)
                    .map(col => (
                      <ColumnRow key={col.columnId}>
                        <span>{col.columnName}</span>
                        <span
                          style={{
                            display: 'flex',
                            gap: 12,
                            fontSize: '0.8rem',
                          }}
                        >
                          {col.followUpCount > 0 && (
                            <span title='Precisam follow-up (3+ dias)'>
                              <MdSchedule
                                size={14}
                                style={{
                                  verticalAlign: 'middle',
                                  marginRight: 2,
                                }}
                              />
                              {col.followUpCount}
                            </span>
                          )}
                          {col.stuckCount > 0 && (
                            <span title='Parados 7+ dias'>
                              <MdWarning
                                size={14}
                                style={{
                                  verticalAlign: 'middle',
                                  marginRight: 2,
                                }}
                              />
                              {col.stuckCount}
                            </span>
                          )}
                        </span>
                      </ColumnRow>
                    ))}
                </InsightCard>
              </>
            )}

            {insights.summary.totalOpenTasks === 0 && (
              <EmptyMessage>
                Nenhuma negociação aberta neste funil. Os insights aparecem
                quando houver tarefas em andamento.
              </EmptyMessage>
            )}
          </>
        )}

        {!loading && !insights && (
          <EmptyMessage>Selecione um funil para ver os insights.</EmptyMessage>
        )}
      </div>
    </FilterDrawer>
  );
};
