import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdCheckCircle,
  MdSchedule,
  MdTrendingUp,
  MdPerson,
  MdRefresh,
  MdWarning,
  MdAssignment,
  MdFileDownload,
  MdPieChart,
} from 'react-icons/md';
import { kanbanMetricsApi } from '../../services/kanbanMetricsApi';
import type { SubtaskMetrics, SubtaskMetricsParams } from '../../types/kanban';
import { showError, showSuccess } from '../../utils/notifications';
import { MetricsShimmer } from '../shimmer/MetricsShimmer';
import { format } from 'date-fns';
import { Bar, Pie } from 'react-chartjs-2';
import { ensureChartRegistration } from '../charts/chartConfig';
import { SafeChartWrapper } from '../charts/ChartProvider';

ensureChartRegistration();

interface SubtaskMetricsDashboardProps {
  teamId?: string;
  taskId?: string;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StatCard = styled.div`
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

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatIcon = styled.div<{ $color?: string }>`
  color: ${props => props.$color || props.theme.colors.primary};
  display: flex;
  align-items: center;
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

const CompletionRate = styled.span<{ $rate: number }>`
  font-weight: 600;
  color: ${props => {
    if (props.$rate >= 80) return '#10B981';
    if (props.$rate >= 50) return '#F59E0B';
    return '#EF4444';
  }};
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

const DistributionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DistributionCard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DistributionLabel = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const DistributionValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const DistributionPercentage = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const SubtaskMetricsDashboard: React.FC<
  SubtaskMetricsDashboardProps
> = ({ teamId, taskId, userId, startDate, endDate, className }) => {
  const [metrics, setMetrics] = useState<SubtaskMetrics | null>(null);
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

      const params: SubtaskMetricsParams = {};
      if (teamId) params.teamId = teamId;
      if (taskId) params.taskId = taskId;
      if (userId) params.userId = userId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const data = await kanbanMetricsApi.getSubtaskMetrics(params);
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
  }, [teamId, taskId, userId, startDate, endDate]);

  const handleRefresh = () => {
    loadMetrics(true);
  };

  const handleExportToExcel = async () => {
    try {
      setExporting(true);
      const params: SubtaskMetricsParams = {};
      if (teamId) params.teamId = teamId;
      if (taskId) params.taskId = taskId;
      if (userId) params.userId = userId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const blob = await kanbanMetricsApi.exportSubtaskMetricsToExcel(params);

      // Criar link de download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `metricas_subtarefas_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
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
          Métricas de Subtarefas
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

      <StatsGrid>
        <StatCard>
          <StatLabel>Total de Subtarefas</StatLabel>
          <StatValue>
            <StatIcon $color='#3B82F6'>
              <MdAssignment size={24} />
            </StatIcon>
            {metrics.totalSubtasks}
          </StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Completadas</StatLabel>
          <StatValue>
            <StatIcon $color='#10B981'>
              <MdCheckCircle size={24} />
            </StatIcon>
            {metrics.completedSubtasks}
          </StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Pendentes</StatLabel>
          <StatValue>
            <StatIcon $color='#F59E0B'>
              <MdSchedule size={24} />
            </StatIcon>
            {metrics.pendingSubtasks}
          </StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Taxa de Conclusão</StatLabel>
          <StatValue>
            <StatIcon
              $color={
                metrics.completionRate >= 80
                  ? '#10B981'
                  : metrics.completionRate >= 50
                    ? '#F59E0B'
                    : '#EF4444'
              }
            >
              <MdTrendingUp size={24} />
            </StatIcon>
            {metrics.completionRate.toFixed(1)}%
          </StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Tempo Médio</StatLabel>
          <StatValue>
            <StatIcon $color='#8B5CF6'>
              <MdSchedule size={24} />
            </StatIcon>
            {metrics.averageCompletionTime.toFixed(1)}h
          </StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Vencidas</StatLabel>
          <StatValue>
            <StatIcon $color='#EF4444'>
              <MdWarning size={24} />
            </StatIcon>
            {metrics.overdueSubtasks}
          </StatValue>
        </StatCard>
      </StatsGrid>

      {metrics.subtasksByUser && metrics.subtasksByUser.length > 0 && (
        <Section>
          <SectionTitle>
            <MdPerson size={18} />
            Desempenho por Usuário
          </SectionTitle>
          <ChartContainer>
            <SafeChartWrapper>
              <Bar
                data={{
                  labels: metrics.subtasksByUser.map(u => u.userName),
                  datasets: [
                    {
                      label: 'Completadas',
                      data: metrics.subtasksByUser.map(u => u.completed),
                      backgroundColor: 'rgba(16, 185, 129, 0.6)',
                      borderColor: 'rgba(16, 185, 129, 1)',
                      borderWidth: 2,
                      borderRadius: 8,
                    },
                    {
                      label: 'Pendentes',
                      data: metrics.subtasksByUser.map(
                        u => u.total - u.completed
                      ),
                      backgroundColor: 'rgba(245, 158, 11, 0.6)',
                      borderColor: 'rgba(245, 158, 11, 1)',
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
                          const user =
                            metrics.subtasksByUser[context.dataIndex];
                          if (context.datasetIndex === 0) {
                            return [
                              `Completadas: ${context.parsed.y}`,
                              `Taxa: ${user.completionRate.toFixed(1)}%`,
                            ];
                          }
                          return `Pendentes: ${context.parsed.y}`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
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
                  <TableHeaderCell>Usuário</TableHeaderCell>
                  <TableHeaderCell>Total</TableHeaderCell>
                  <TableHeaderCell>Completadas</TableHeaderCell>
                  <TableHeaderCell>Pendentes</TableHeaderCell>
                  <TableHeaderCell>Taxa de Conclusão</TableHeaderCell>
                  <TableHeaderCell>Tempo Médio</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.subtasksByUser.map(user => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.total}</TableCell>
                    <TableCell>{user.completed}</TableCell>
                    <TableCell>{user.total - user.completed}</TableCell>
                    <TableCell>
                      <CompletionRate $rate={user.completionRate}>
                        {user.completionRate.toFixed(1)}%
                      </CompletionRate>
                    </TableCell>
                    <TableCell>
                      {user.averageCompletionTime
                        ? `${user.averageCompletionTime.toFixed(1)}h`
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </Section>
      )}

      {metrics.subtasksByTask && metrics.subtasksByTask.length > 0 && (
        <Section>
          <SectionTitle>
            <MdAssignment size={18} />
            Por Negociação
          </SectionTitle>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Negociação</TableHeaderCell>
                  <TableHeaderCell>Total</TableHeaderCell>
                  <TableHeaderCell>Completadas</TableHeaderCell>
                  <TableHeaderCell>Taxa de Conclusão</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.subtasksByTask.map(task => (
                  <TableRow key={task.taskId}>
                    <TableCell>{task.taskTitle}</TableCell>
                    <TableCell>{task.total}</TableCell>
                    <TableCell>{task.completed}</TableCell>
                    <TableCell>
                      <CompletionRate $rate={task.completionRate}>
                        {task.completionRate.toFixed(1)}%
                      </CompletionRate>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </Section>
      )}

      {/* Distribuição de Tempo de Conclusão */}
      {metrics.completionTimeDistribution &&
        metrics.completionTimeDistribution.length > 0 && (
          <Section>
            <SectionTitle>
              <MdPieChart size={18} />
              Distribuição de Tempo de Conclusão
            </SectionTitle>
            <ChartContainer>
              <SafeChartWrapper>
                <Pie
                  data={{
                    labels: metrics.completionTimeDistribution.map(
                      d => d.range
                    ),
                    datasets: [
                      {
                        data: metrics.completionTimeDistribution.map(
                          d => d.count
                        ),
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
                            const dist =
                              metrics.completionTimeDistribution[
                                context.dataIndex
                              ];
                            return [
                              `${context.label}: ${context.parsed} subtarefas`,
                              `${dist.percentage.toFixed(1)}% do total`,
                            ];
                          },
                        },
                      },
                    },
                  }}
                />
              </SafeChartWrapper>
            </ChartContainer>
            <DistributionGrid>
              {metrics.completionTimeDistribution.map((dist, index) => (
                <DistributionCard key={index}>
                  <DistributionLabel>{dist.range}</DistributionLabel>
                  <DistributionValue>{dist.count}</DistributionValue>
                  <DistributionPercentage>
                    {dist.percentage.toFixed(1)}%
                  </DistributionPercentage>
                </DistributionCard>
              ))}
            </DistributionGrid>
          </Section>
        )}

      {/* Subtarefas Vencidas por Usuário */}
      {metrics.overdueByUser && metrics.overdueByUser.length > 0 && (
        <Section>
          <SectionTitle>
            <MdWarning size={18} />
            Subtarefas Vencidas por Usuário
          </SectionTitle>
          <ChartContainer>
            <SafeChartWrapper>
              <Bar
                data={{
                  labels: metrics.overdueByUser.map(u => u.userName),
                  datasets: [
                    {
                      label: 'Subtarefas Vencidas',
                      data: metrics.overdueByUser.map(u => u.count),
                      backgroundColor: 'rgba(239, 68, 68, 0.6)',
                      borderColor: 'rgba(239, 68, 68, 1)',
                      borderWidth: 2,
                      borderRadius: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context: any) => {
                          return `${context.parsed.y} subtarefas vencidas`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
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
                  <TableHeaderCell>Usuário</TableHeaderCell>
                  <TableHeaderCell>Quantidade Vencida</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.overdueByUser.map(user => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>
                      <span style={{ color: '#EF4444', fontWeight: 600 }}>
                        {user.count}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </Section>
      )}

      {/* Tempo Médio de Conclusão por Usuário */}
      {metrics.averageCompletionTimeByUser &&
        metrics.averageCompletionTimeByUser.length > 0 && (
          <Section>
            <SectionTitle>
              <MdSchedule size={18} />
              Tempo Médio de Conclusão por Usuário
            </SectionTitle>
            <ChartContainer>
              <SafeChartWrapper>
                <Bar
                  data={{
                    labels: metrics.averageCompletionTimeByUser.map(
                      u => u.userName
                    ),
                    datasets: [
                      {
                        label: 'Tempo Médio (horas)',
                        data: metrics.averageCompletionTimeByUser.map(
                          u => u.averageTime
                        ),
                        backgroundColor: 'rgba(139, 92, 246, 0.6)',
                        borderColor: 'rgba(139, 92, 246, 1)',
                        borderWidth: 2,
                        borderRadius: 8,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context: any) => {
                            return `Tempo médio: ${context.parsed.y.toFixed(1)}h`;
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value: any) => `${value.toFixed(1)}h`,
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
                    <TableHeaderCell>Usuário</TableHeaderCell>
                    <TableHeaderCell>Tempo Médio (horas)</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.averageCompletionTimeByUser.map(user => (
                    <TableRow key={user.userId}>
                      <TableCell>{user.userName}</TableCell>
                      <TableCell>{user.averageTime.toFixed(1)}h</TableCell>
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
