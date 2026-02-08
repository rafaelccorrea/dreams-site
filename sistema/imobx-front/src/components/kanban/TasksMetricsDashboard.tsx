import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdTrendingUp,
  MdPerson,
  MdRefresh,
  MdFileDownload,
  MdAttachMoney,
  MdSchedule,
  MdWarning,
  MdBarChart,
  MdAssignment,
  MdCampaign,
  MdSource,
  MdTimeline,
  MdShowChart,
} from 'react-icons/md';
import { kanbanMetricsApi } from '../../services/kanbanMetricsApi';
import type { TasksMetrics, TasksMetricsParams } from '../../types/kanban';
import { showError, showSuccess } from '../../utils/notifications';
import { MetricsShimmer } from '../shimmer/MetricsShimmer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { ensureChartRegistration } from '../charts/chartConfig';
import { SafeChartWrapper } from '../charts/ChartProvider';

ensureChartRegistration();

interface TasksMetricsDashboardProps {
  teamId?: string;
  projectId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  className?: string;
}

const DashboardContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DashboardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RefreshButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ExportButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  margin-left: 8px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const KPICard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  overflow: visible;
  word-wrap: break-word;
  box-sizing: border-box;
`;

const KPILabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const KPIValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  line-height: 1.2;

  @media (max-width: 1024px) {
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const KPISubLabel = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const Section = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-top: 16px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const TableHeader = styled.thead`
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const TableCell = styled.td`
  padding: 12px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 0.8rem;
    max-width: 150px;
  }
`;

const TableBody = styled.tbody``;

const ConversionRate = styled.span<{ $rate: number }>`
  font-weight: 600;
  color: ${props => {
    if (props.$rate >= 70) return '#10B981';
    if (props.$rate >= 50) return '#F59E0B';
    return '#EF4444';
  }};
`;

const FunnelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const FunnelStage = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
  word-wrap: break-word;
`;

const StageName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const StageValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  word-break: break-word;
  overflow-wrap: break-word;
  min-width: 0;
  max-width: 100%;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const StageCount = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const StageTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const AlertBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${props => props.theme.colors.error}20;
  color: ${props => props.theme.colors.error};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 8px;
`;

const AlertList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AlertItem = styled.li`
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  border-left: 4px solid ${props => props.theme.colors.error};
`;

const AlertTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const AlertDetails = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.colors.error};
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 16px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;

  @media (max-width: 768px) {
    height: 250px;
    padding: 12px;
  }
`;

const ChartTitle = styled.h5`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
  text-align: center;
`;

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatMonth = (month: string) => {
  try {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    return format(date, 'MMMM yyyy', { locale: ptBR });
  } catch {
    return month;
  }
};

export const TasksMetricsDashboard: React.FC<TasksMetricsDashboardProps> = ({
  teamId,
  projectId,
  userId,
  startDate,
  endDate,
  className,
}) => {
  const [metrics, setMetrics] = useState<TasksMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const params: TasksMetricsParams = {};
      if (teamId) params.teamId = teamId;
      if (projectId) params.projectId = projectId;
      if (userId) params.userId = userId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const data = await kanbanMetricsApi.getTasksMetrics(params);
      setMetrics(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar métricas');
      showError(err.message || 'Erro ao carregar métricas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [teamId, projectId, userId, startDate, endDate]);

  const handleRefresh = () => {
    loadMetrics(true);
  };

  const handleExportToExcel = async () => {
    try {
      setExporting(true);
      const params: TasksMetricsParams = {};
      if (teamId) params.teamId = teamId;
      if (projectId) params.projectId = projectId;
      if (userId) params.userId = userId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const blob = await kanbanMetricsApi.exportTasksMetricsToExcel(params);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `metricas_negociacoes_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showSuccess('Métricas exportadas com sucesso!');
    } catch (err: any) {
      showError(err.message || 'Erro ao exportar métricas');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <MetricsShimmer />;
  }

  if (error) {
    return (
      <DashboardContainer className={className}>
        <ErrorState>{error}</ErrorState>
      </DashboardContainer>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <DashboardContainer className={className}>
      <DashboardHeader>
        <DashboardTitle>
          <MdTrendingUp size={20} />
          Métricas de Negociações (Vendas)
        </DashboardTitle>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ExportButton onClick={handleExportToExcel} disabled={exporting}>
            <MdFileDownload size={18} />
            {exporting ? 'Exportando...' : 'Exportar Excel'}
          </ExportButton>
          <RefreshButton onClick={handleRefresh} disabled={refreshing}>
            <MdRefresh size={18} />
          </RefreshButton>
        </div>
      </DashboardHeader>

      {/* KPIs Principais */}
      <KPIGrid>
        <KPICard>
          <KPILabel>Taxa de Conversão</KPILabel>
          <KPIValue>{metrics.conversionRate.toFixed(1)}%</KPIValue>
          <KPISubLabel>
            {metrics.wonTasks} de {metrics.totalTasks} negociações
          </KPISubLabel>
        </KPICard>

        <KPICard>
          <KPILabel>Valor do Pipeline</KPILabel>
          <KPIValue>{formatCurrency(metrics.totalPipelineValue)}</KPIValue>
          <KPISubLabel>Total em negociação</KPISubLabel>
        </KPICard>

        <KPICard>
          <KPILabel>Valor Ganho</KPILabel>
          <KPIValue>{formatCurrency(metrics.totalWonValue)}</KPIValue>
          <KPISubLabel>Total fechado</KPISubLabel>
        </KPICard>

        <KPICard>
          <KPILabel>Tempo Médio</KPILabel>
          <KPIValue>
            {Math.round(metrics.averageTimeToClose / 24)} dias
          </KPIValue>
          <KPISubLabel>Até fechamento</KPISubLabel>
        </KPICard>

        <KPICard>
          <KPILabel>Taxa de Ganho</KPILabel>
          <KPIValue>{metrics.winRate.toFixed(1)}%</KPIValue>
          <KPISubLabel>
            {metrics.wonTasks} ganhas / {metrics.completedTasks} concluídas
          </KPISubLabel>
        </KPICard>

        <KPICard>
          <KPILabel>Valor Médio</KPILabel>
          <KPIValue>{formatCurrency(metrics.averageDealValue)}</KPIValue>
          <KPISubLabel>Por negociação</KPISubLabel>
        </KPICard>
      </KPIGrid>

      {/* Performance por Corretor */}
      {metrics.tasksByUser && metrics.tasksByUser.length > 0 && (
        <Section>
          <SectionTitle>
            <MdPerson size={18} />
            Performance por Corretor
          </SectionTitle>
          {metrics.tasksByUser.length > 0 && (
            <ChartContainer>
              <SafeChartWrapper>
                <Bar
                  data={{
                    labels: metrics.tasksByUser.map(u => u.userName),
                    datasets: [
                      {
                        label: 'Valor Ganho',
                        data: metrics.tasksByUser.map(u => u.wonValue),
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 2,
                        borderRadius: 8,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true },
                      tooltip: {
                        callbacks: {
                          label: (context: any) => {
                            const user = metrics.tasksByUser[context.dataIndex];
                            return [
                              `Valor: ${formatCurrency(context.parsed.y)}`,
                              `Taxa: ${user.conversionRate.toFixed(1)}%`,
                              `Negociações: ${user.wonTasks}/${user.totalTasks}`,
                            ];
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value: any) => formatCurrency(value),
                        },
                      },
                    },
                  }}
                />
              </SafeChartWrapper>
            </ChartContainer>
          )}
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Corretor</TableHeaderCell>
                  <TableHeaderCell>Total</TableHeaderCell>
                  <TableHeaderCell>Ativas</TableHeaderCell>
                  <TableHeaderCell>Ganhas</TableHeaderCell>
                  <TableHeaderCell>Taxa Conversão</TableHeaderCell>
                  <TableHeaderCell>Valor Ganho</TableHeaderCell>
                  <TableHeaderCell>Tempo Médio</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.tasksByUser.map(user => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.totalTasks}</TableCell>
                    <TableCell>{user.activeTasks}</TableCell>
                    <TableCell>{user.wonTasks}</TableCell>
                    <TableCell>
                      <ConversionRate $rate={user.conversionRate}>
                        {user.conversionRate.toFixed(1)}%
                      </ConversionRate>
                    </TableCell>
                    <TableCell>{formatCurrency(user.wonValue)}</TableCell>
                    <TableCell>
                      {Math.round(user.averageTimeToClose / 24)} dias
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </Section>
      )}

      {/* Análise do Funil */}
      {metrics.tasksByColumn && metrics.tasksByColumn.length > 0 && (
        <Section>
          <SectionTitle>
            <MdBarChart size={18} />
            Análise do Funil de Vendas
          </SectionTitle>
          <ChartContainer>
            <SafeChartWrapper>
              <Bar
                data={{
                  labels: metrics.tasksByColumn.map(c => c.columnName),
                  datasets: [
                    {
                      label: 'Valor Total',
                      data: metrics.tasksByColumn.map(c => c.totalValue),
                      backgroundColor: 'rgba(59, 130, 246, 0.6)',
                      borderColor: 'rgba(59, 130, 246, 1)',
                      borderWidth: 2,
                      borderRadius: 8,
                    },
                    {
                      label: 'Quantidade',
                      data: metrics.tasksByColumn.map(c => c.count),
                      backgroundColor: 'rgba(16, 185, 129, 0.6)',
                      borderColor: 'rgba(16, 185, 129, 1)',
                      borderWidth: 2,
                      borderRadius: 8,
                      yAxisID: 'y1',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: true },
                    tooltip: {
                      callbacks: {
                        label: (context: any) => {
                          if (context.datasetIndex === 0) {
                            return `Valor: ${formatCurrency(context.parsed.y)}`;
                          }
                          return `Quantidade: ${context.parsed.y}`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      position: 'left' as const,
                      ticks: {
                        callback: (value: any) => formatCurrency(value),
                      },
                    },
                    y1: {
                      beginAtZero: true,
                      position: 'right' as const,
                      grid: { drawOnChartArea: false },
                    },
                  },
                }}
              />
            </SafeChartWrapper>
          </ChartContainer>
          <FunnelGrid>
            {metrics.tasksByColumn.map(column => (
              <FunnelStage key={column.columnId}>
                <StageName>{column.columnName}</StageName>
                <StageValue>{formatCurrency(column.totalValue)}</StageValue>
                <StageCount>{column.count} negociações</StageCount>
                <StageTime>
                  Tempo médio: {Math.round(column.averageTimeInColumn / 24)}{' '}
                  dias
                </StageTime>
                {column.stuckTasks > 0 && (
                  <AlertBadge>
                    <MdWarning size={14} />
                    {column.stuckTasks} tarefas paradas
                  </AlertBadge>
                )}
              </FunnelStage>
            ))}
          </FunnelGrid>
        </Section>
      )}

      {/* ROI por Fonte */}
      {metrics.tasksBySource && metrics.tasksBySource.length > 0 && (
        <Section>
          <SectionTitle>
            <MdSource size={18} />
            ROI por Fonte
          </SectionTitle>
          <ChartContainer>
            <SafeChartWrapper>
              <Bar
                data={{
                  labels: metrics.tasksBySource.map(
                    s => s.source || 'Não informado'
                  ),
                  datasets: [
                    {
                      label: 'Valor Ganho',
                      data: metrics.tasksBySource.map(s => s.wonValue),
                      backgroundColor: 'rgba(16, 185, 129, 0.6)',
                      borderColor: 'rgba(16, 185, 129, 1)',
                      borderWidth: 2,
                      borderRadius: 8,
                    },
                    {
                      label: 'Valor Total',
                      data: metrics.tasksBySource.map(s => s.totalValue),
                      backgroundColor: 'rgba(59, 130, 246, 0.6)',
                      borderColor: 'rgba(59, 130, 246, 1)',
                      borderWidth: 2,
                      borderRadius: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: true },
                    tooltip: {
                      callbacks: {
                        label: (context: any) => {
                          const source =
                            metrics.tasksBySource[context.dataIndex];
                          if (context.datasetIndex === 0) {
                            return [
                              `Valor Ganho: ${formatCurrency(context.parsed.y)}`,
                              `Taxa: ${source.conversionRate.toFixed(1)}%`,
                            ];
                          }
                          return `Valor Total: ${formatCurrency(context.parsed.y)}`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value: any) => formatCurrency(value),
                      },
                    },
                  },
                }}
              />
            </SafeChartWrapper>
          </ChartContainer>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Fonte</TableHeaderCell>
                  <TableHeaderCell>Quantidade</TableHeaderCell>
                  <TableHeaderCell>Valor Total</TableHeaderCell>
                  <TableHeaderCell>Valor Ganho</TableHeaderCell>
                  <TableHeaderCell>Taxa Conversão</TableHeaderCell>
                  <TableHeaderCell>Valor Médio</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.tasksBySource.map(source => (
                  <TableRow key={source.source}>
                    <TableCell>{source.source || 'Não informado'}</TableCell>
                    <TableCell>{source.count}</TableCell>
                    <TableCell>{formatCurrency(source.totalValue)}</TableCell>
                    <TableCell>{formatCurrency(source.wonValue)}</TableCell>
                    <TableCell>
                      <ConversionRate $rate={source.conversionRate}>
                        {source.conversionRate.toFixed(1)}%
                      </ConversionRate>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(source.averageDealValue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </Section>
      )}

      {/* ROI por Campanha */}
      {metrics.tasksByCampaign && metrics.tasksByCampaign.length > 0 && (
        <Section>
          <SectionTitle>
            <MdCampaign size={18} />
            ROI por Campanha
          </SectionTitle>
          <ChartContainer>
            <SafeChartWrapper>
              <Bar
                data={{
                  labels: metrics.tasksByCampaign.map(
                    c => c.campaign || 'Não informado'
                  ),
                  datasets: [
                    {
                      label: 'Valor Ganho',
                      data: metrics.tasksByCampaign.map(c => c.wonValue),
                      backgroundColor: 'rgba(139, 92, 246, 0.6)',
                      borderColor: 'rgba(139, 92, 246, 1)',
                      borderWidth: 2,
                      borderRadius: 8,
                    },
                    {
                      label: 'Valor Total',
                      data: metrics.tasksByCampaign.map(c => c.totalValue),
                      backgroundColor: 'rgba(59, 130, 246, 0.6)',
                      borderColor: 'rgba(59, 130, 246, 1)',
                      borderWidth: 2,
                      borderRadius: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: true },
                    tooltip: {
                      callbacks: {
                        label: (context: any) => {
                          const campaign =
                            metrics.tasksByCampaign[context.dataIndex];
                          if (context.datasetIndex === 0) {
                            return [
                              `Valor Ganho: ${formatCurrency(context.parsed.y)}`,
                              `Taxa: ${campaign.conversionRate.toFixed(1)}%`,
                            ];
                          }
                          return `Valor Total: ${formatCurrency(context.parsed.y)}`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value: any) => formatCurrency(value),
                      },
                    },
                  },
                }}
              />
            </SafeChartWrapper>
          </ChartContainer>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Campanha</TableHeaderCell>
                  <TableHeaderCell>Quantidade</TableHeaderCell>
                  <TableHeaderCell>Valor Total</TableHeaderCell>
                  <TableHeaderCell>Valor Ganho</TableHeaderCell>
                  <TableHeaderCell>Taxa Conversão</TableHeaderCell>
                  <TableHeaderCell>Valor Médio</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.tasksByCampaign.map(campaign => (
                  <TableRow key={campaign.campaign}>
                    <TableCell>
                      {campaign.campaign || 'Não informado'}
                    </TableCell>
                    <TableCell>{campaign.count}</TableCell>
                    <TableCell>{formatCurrency(campaign.totalValue)}</TableCell>
                    <TableCell>{formatCurrency(campaign.wonValue)}</TableCell>
                    <TableCell>
                      <ConversionRate $rate={campaign.conversionRate}>
                        {campaign.conversionRate.toFixed(1)}%
                      </ConversionRate>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(campaign.averageDealValue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </Section>
      )}

      {/* Análise por Qualificação */}
      {metrics.tasksByQualification &&
        metrics.tasksByQualification.length > 0 && (
          <Section>
            <SectionTitle>
              <MdAssignment size={18} />
              Análise por Qualificação
            </SectionTitle>
            <ChartContainer>
              <SafeChartWrapper>
                <Pie
                  data={{
                    labels: metrics.tasksByQualification.map(
                      q => q.qualification || 'Não informado'
                    ),
                    datasets: [
                      {
                        data: metrics.tasksByQualification.map(q => q.wonValue),
                        backgroundColor: [
                          'rgba(59, 130, 246, 0.6)',
                          'rgba(16, 185, 129, 0.6)',
                          'rgba(139, 92, 246, 0.6)',
                          'rgba(245, 158, 11, 0.6)',
                          'rgba(239, 68, 68, 0.6)',
                          'rgba(236, 72, 153, 0.6)',
                        ],
                        borderColor: [
                          'rgba(59, 130, 246, 1)',
                          'rgba(16, 185, 129, 1)',
                          'rgba(139, 92, 246, 1)',
                          'rgba(245, 158, 11, 1)',
                          'rgba(239, 68, 68, 1)',
                          'rgba(236, 72, 153, 1)',
                        ],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true, position: 'bottom' as const },
                      tooltip: {
                        callbacks: {
                          label: (context: any) => {
                            const qual =
                              metrics.tasksByQualification[context.dataIndex];
                            const total = metrics.tasksByQualification.reduce(
                              (sum, q) => sum + q.wonValue,
                              0
                            );
                            const percentage = (
                              (context.parsed / total) *
                              100
                            ).toFixed(1);
                            return [
                              `${context.label}: ${formatCurrency(context.parsed)}`,
                              `${percentage}% do total`,
                              `Taxa: ${qual.conversionRate.toFixed(1)}%`,
                            ];
                          },
                        },
                      },
                    },
                  }}
                />
              </SafeChartWrapper>
            </ChartContainer>
            <TableWrapper>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Qualificação</TableHeaderCell>
                    <TableHeaderCell>Quantidade</TableHeaderCell>
                    <TableHeaderCell>Valor Total</TableHeaderCell>
                    <TableHeaderCell>Valor Ganho</TableHeaderCell>
                    <TableHeaderCell>Taxa Conversão</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.tasksByQualification.map(qual => (
                    <TableRow key={qual.qualification}>
                      <TableCell>
                        {qual.qualification || 'Não informado'}
                      </TableCell>
                      <TableCell>{qual.count}</TableCell>
                      <TableCell>{formatCurrency(qual.totalValue)}</TableCell>
                      <TableCell>{formatCurrency(qual.wonValue)}</TableCell>
                      <TableCell>
                        <ConversionRate $rate={qual.conversionRate}>
                          {qual.conversionRate.toFixed(1)}%
                        </ConversionRate>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          </Section>
        )}

      {/* Gargalos */}
      {metrics.bottlenecks && metrics.bottlenecks.length > 0 && (
        <Section>
          <SectionTitle>
            <MdWarning size={18} />
            Gargalos Identificados
          </SectionTitle>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Etapa</TableHeaderCell>
                  <TableHeaderCell>Tempo Médio</TableHeaderCell>
                  <TableHeaderCell>Tarefas Paradas</TableHeaderCell>
                  <TableHeaderCell>Motivo</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.bottlenecks.map(bottleneck => (
                  <TableRow key={bottleneck.columnId}>
                    <TableCell>{bottleneck.columnName}</TableCell>
                    <TableCell>
                      {Math.round(bottleneck.averageTime / 24)} dias
                    </TableCell>
                    <TableCell>{bottleneck.stuckTasks}</TableCell>
                    <TableCell>{bottleneck.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </Section>
      )}

      {/* Alertas: Alto Valor Parado */}
      {metrics.highValueStuckTasks &&
        metrics.highValueStuckTasks.length > 0 && (
          <Section>
            <SectionTitle>
              <MdWarning size={18} />
              Alertas: Alto Valor Parado
            </SectionTitle>
            <AlertList>
              {metrics.highValueStuckTasks.map(task => (
                <AlertItem key={task.taskId}>
                  <AlertTitle>{task.taskTitle}</AlertTitle>
                  <AlertDetails>
                    {formatCurrency(task.value)} • Parado há {task.daysStuck}{' '}
                    dias em {task.columnName}
                  </AlertDetails>
                </AlertItem>
              ))}
            </AlertList>
          </Section>
        )}

      {/* Previsões de Fechamento */}
      {metrics.forecastByMonth && metrics.forecastByMonth.length > 0 && (
        <Section>
          <SectionTitle>
            <MdShowChart size={18} />
            Previsões de Fechamento
          </SectionTitle>
          <ChartContainer>
            <SafeChartWrapper>
              <Bar
                data={{
                  labels: metrics.forecastByMonth.map(f =>
                    formatMonth(f.month)
                  ),
                  datasets: [
                    {
                      label: 'Valor Previsto',
                      data: metrics.forecastByMonth.map(f => f.forecastValue),
                      backgroundColor: 'rgba(59, 130, 246, 0.6)',
                      borderColor: 'rgba(59, 130, 246, 1)',
                      borderWidth: 2,
                      borderRadius: 8,
                    },
                    {
                      label: 'Valor Esperado',
                      data: metrics.forecastByMonth.map(
                        f => f.forecastValue * f.probability
                      ),
                      backgroundColor: 'rgba(16, 185, 129, 0.6)',
                      borderColor: 'rgba(16, 185, 129, 1)',
                      borderWidth: 2,
                      borderRadius: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: true },
                    tooltip: {
                      callbacks: {
                        label: (context: any) => {
                          const forecast =
                            metrics.forecastByMonth[context.dataIndex];
                          if (context.datasetIndex === 0) {
                            return [
                              `Valor Previsto: ${formatCurrency(context.parsed.y)}`,
                              `Probabilidade: ${(forecast.probability * 100).toFixed(0)}%`,
                            ];
                          }
                          return `Valor Esperado: ${formatCurrency(context.parsed.y)}`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value: any) => formatCurrency(value),
                      },
                    },
                  },
                }}
              />
            </SafeChartWrapper>
          </ChartContainer>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Mês</TableHeaderCell>
                  <TableHeaderCell>Valor Previsto</TableHeaderCell>
                  <TableHeaderCell>Probabilidade</TableHeaderCell>
                  <TableHeaderCell>Valor Esperado</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.forecastByMonth.map(forecast => (
                  <TableRow key={forecast.month}>
                    <TableCell>{formatMonth(forecast.month)}</TableCell>
                    <TableCell>
                      {formatCurrency(forecast.forecastValue)}
                    </TableCell>
                    <TableCell>
                      {(forecast.probability * 100).toFixed(0)}%
                    </TableCell>
                    <TableCell>
                      {formatCurrency(
                        forecast.forecastValue * forecast.probability
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </Section>
      )}

      {/* Evolução Mensal */}
      {metrics.tasksByMonth && metrics.tasksByMonth.length > 0 && (
        <Section>
          <SectionTitle>
            <MdTimeline size={18} />
            Evolução Mensal (Últimos 12 Meses)
          </SectionTitle>
          <ChartContainer>
            <SafeChartWrapper>
              <Line
                data={{
                  labels: metrics.tasksByMonth.map(m => formatMonth(m.month)),
                  datasets: [
                    {
                      label: 'Valor Total',
                      data: metrics.tasksByMonth.map(m => m.totalValue),
                      borderColor: 'rgba(59, 130, 246, 1)',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      borderWidth: 3,
                      fill: true,
                      tension: 0.4,
                    },
                    {
                      label: 'Valor Ganho',
                      data: metrics.tasksByMonth.map(m => m.wonValue),
                      borderColor: 'rgba(16, 185, 129, 1)',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderWidth: 3,
                      fill: true,
                      tension: 0.4,
                    },
                    {
                      label: 'Criadas',
                      data: metrics.tasksByMonth.map(m => m.created),
                      borderColor: 'rgba(139, 92, 246, 1)',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      borderWidth: 2,
                      fill: false,
                      tension: 0.4,
                      yAxisID: 'y1',
                    },
                    {
                      label: 'Ganhas',
                      data: metrics.tasksByMonth.map(m => m.won),
                      borderColor: 'rgba(245, 158, 11, 1)',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      borderWidth: 2,
                      fill: false,
                      tension: 0.4,
                      yAxisID: 'y1',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index' as const,
                    intersect: false,
                  },
                  plugins: {
                    legend: { display: true, position: 'top' as const },
                    tooltip: {
                      callbacks: {
                        label: (context: any) => {
                          if (context.datasetIndex < 2) {
                            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                          }
                          return `${context.dataset.label}: ${context.parsed.y}`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      position: 'left' as const,
                      ticks: {
                        callback: (value: any) => formatCurrency(value),
                      },
                    },
                    y1: {
                      beginAtZero: true,
                      position: 'right' as const,
                      grid: { drawOnChartArea: false },
                    },
                  },
                }}
              />
            </SafeChartWrapper>
          </ChartContainer>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Mês</TableHeaderCell>
                  <TableHeaderCell>Criadas</TableHeaderCell>
                  <TableHeaderCell>Concluídas</TableHeaderCell>
                  <TableHeaderCell>Ganhas</TableHeaderCell>
                  <TableHeaderCell>Perdidas</TableHeaderCell>
                  <TableHeaderCell>Valor Total</TableHeaderCell>
                  <TableHeaderCell>Valor Ganho</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.tasksByMonth.map(month => (
                  <TableRow key={month.month}>
                    <TableCell>{formatMonth(month.month)}</TableCell>
                    <TableCell>{month.created}</TableCell>
                    <TableCell>{month.completed}</TableCell>
                    <TableCell>{month.won}</TableCell>
                    <TableCell>{month.lost}</TableCell>
                    <TableCell>{formatCurrency(month.totalValue)}</TableCell>
                    <TableCell>{formatCurrency(month.wonValue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </Section>
      )}
    </DashboardContainer>
  );
};
