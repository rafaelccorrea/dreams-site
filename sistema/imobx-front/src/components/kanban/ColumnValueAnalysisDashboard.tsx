import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdTrendingUp,
  MdRefresh,
  MdFileDownload,
  MdAttachMoney,
  MdWarning,
  MdBarChart,
  MdTimeline,
} from 'react-icons/md';
import { kanbanMetricsApi } from '../../services/kanbanMetricsApi';
import type {
  ColumnValueAnalysis,
  ColumnValueAnalysisParams,
} from '../../types/kanban';
import { showError, showSuccess } from '../../utils/notifications';
import { MetricsShimmer } from '../shimmer/MetricsShimmer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bar, Line } from 'react-chartjs-2';
import { ensureChartRegistration } from '../charts/chartConfig';
import { SafeChartWrapper } from '../charts/ChartProvider';

ensureChartRegistration();

interface ColumnValueAnalysisDashboardProps {
  teamId: string; // obrigatório
  columnId?: string;
  minDaysStuck?: number;
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

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  width: 80px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const SummaryCard = styled.div<{ $alert?: boolean }>`
  background: ${props =>
    props.$alert
      ? props.theme.colors.error + '15'
      : props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid
    ${props =>
      props.$alert ? props.theme.colors.error : props.theme.colors.primary};
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  overflow: visible;
  word-wrap: break-word;
  box-sizing: border-box;
`;

const SummaryLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const SummaryValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  word-break: break-word;
  overflow-wrap: break-word;
  min-width: 0;
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

const SummarySubLabel = styled.span`
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

const TableCell = styled.td<{ $alert?: boolean }>`
  padding: 12px;
  font-size: 0.875rem;
  color: ${props =>
    props.$alert ? props.theme.colors.error : props.theme.colors.text};
  font-weight: ${props => (props.$alert ? 600 : 400)};
  word-break: break-word;
  overflow-wrap: break-word;
  min-width: 0;
  max-width: 200px;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 0.8rem;
    max-width: 150px;
  }
`;

const TableBody = styled.tbody``;

const TimeRangeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TimeRangeCard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TimeRangeLabel = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const TimeRangeValue = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  word-break: break-word;
  overflow-wrap: break-word;
  min-width: 0;
  max-width: 100%;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

const TimeRangePercentage = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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

export const ColumnValueAnalysisDashboard: React.FC<
  ColumnValueAnalysisDashboardProps
> = ({
  teamId,
  columnId,
  minDaysStuck: initialMinDaysStuck = 7,
  startDate,
  endDate,
  className,
}) => {
  const [analyses, setAnalyses] = useState<ColumnValueAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minDaysStuck, setMinDaysStuck] = useState(initialMinDaysStuck);

  const loadAnalyses = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const params: ColumnValueAnalysisParams = {
        teamId,
        minDaysStuck,
      };
      if (columnId) params.columnId = columnId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const data = await kanbanMetricsApi.getColumnValueAnalysis(params);
      setAnalyses(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar análise');
      showError(err.message || 'Erro ao carregar análise');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (teamId) {
      loadAnalyses();
    }
  }, [teamId, columnId, minDaysStuck, startDate, endDate]);

  const handleRefresh = () => {
    loadAnalyses(true);
  };

  const handleExportToExcel = async () => {
    try {
      setExporting(true);
      const params: ColumnValueAnalysisParams = {
        teamId,
        minDaysStuck,
      };
      if (columnId) params.columnId = columnId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const blob =
        await kanbanMetricsApi.exportColumnValueAnalysisToExcel(params);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `analise_valores_colunas_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showSuccess('Análise exportada com sucesso!');
    } catch (err: any) {
      showError(err.message || 'Erro ao exportar análise');
    } finally {
      setExporting(false);
    }
  };

  const handleMinDaysStuckChange = (value: number) => {
    setMinDaysStuck(value);
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

  if (!analyses || analyses.length === 0) {
    return (
      <DashboardContainer className={className}>
        <ErrorState>
          Nenhuma análise disponível para os filtros selecionados
        </ErrorState>
      </DashboardContainer>
    );
  }

  const totalValue = analyses.reduce((sum, a) => sum + a.totalValue, 0);
  const totalStuckValue = analyses.reduce((sum, a) => sum + a.stuckValue, 0);
  const totalStuckTasks = analyses.reduce((sum, a) => sum + a.stuckTasks, 0);
  const totalTasks = analyses.reduce((sum, a) => sum + a.taskCount, 0);

  return (
    <DashboardContainer className={className}>
      <DashboardHeader>
        <DashboardTitle>
          <MdAttachMoney size={20} />
          Análise de Valores por Coluna
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

      {/* Filtro de dias parados */}
      <FilterSection>
        <FilterLabel>
          Considerar parado após:
          <FilterInput
            type='number'
            value={minDaysStuck}
            onChange={e =>
              handleMinDaysStuckChange(parseInt(e.target.value) || 7)
            }
            min='1'
          />
          dias
        </FilterLabel>
      </FilterSection>

      {/* Resumo Geral */}
      <SummaryGrid>
        <SummaryCard>
          <SummaryLabel>Valor Total no Pipeline</SummaryLabel>
          <SummaryValue>{formatCurrency(totalValue)}</SummaryValue>
          <SummarySubLabel>{totalTasks} negociações</SummarySubLabel>
        </SummaryCard>
        <SummaryCard $alert={totalStuckValue > 0}>
          <SummaryLabel>Valor Parado</SummaryLabel>
          <SummaryValue>{formatCurrency(totalStuckValue)}</SummaryValue>
          <SummarySubLabel>{totalStuckTasks} tarefas paradas</SummarySubLabel>
        </SummaryCard>
      </SummaryGrid>

      {/* Por Coluna */}
      <Section>
        <SectionTitle>
          <MdBarChart size={18} />
          Valores por Coluna
        </SectionTitle>
        <ChartContainer>
          <SafeChartWrapper>
            <Bar
              data={{
                labels: analyses.map(a => a.columnName),
                datasets: [
                  {
                    label: 'Valor Total',
                    data: analyses.map(a => a.totalValue),
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                  },
                  {
                    label: 'Valor Parado',
                    data: analyses.map(a => a.stuckValue),
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
                  legend: { display: true },
                  tooltip: {
                    callbacks: {
                      label: (context: any) => {
                        const analysis = analyses[context.dataIndex];
                        if (context.datasetIndex === 0) {
                          return [
                            `Valor Total: ${formatCurrency(context.parsed.y)}`,
                            `Quantidade: ${analysis.taskCount}`,
                          ];
                        }
                        return [
                          `Valor Parado: ${formatCurrency(context.parsed.y)}`,
                          `Tarefas Paradas: ${analysis.stuckTasks}`,
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
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Coluna</TableHeaderCell>
                <TableHeaderCell>Valor Total</TableHeaderCell>
                <TableHeaderCell>Quantidade</TableHeaderCell>
                <TableHeaderCell>Valor Médio</TableHeaderCell>
                <TableHeaderCell>Tempo Médio (dias)</TableHeaderCell>
                <TableHeaderCell>Valor Parado</TableHeaderCell>
                <TableHeaderCell>Tarefas Paradas</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyses.map(analysis => (
                <TableRow key={analysis.columnId}>
                  <TableCell>{analysis.columnName}</TableCell>
                  <TableCell>{formatCurrency(analysis.totalValue)}</TableCell>
                  <TableCell>{analysis.taskCount}</TableCell>
                  <TableCell>{formatCurrency(analysis.averageValue)}</TableCell>
                  <TableCell>
                    {(analysis.averageTimeInColumn / 24).toFixed(1)}
                  </TableCell>
                  <TableCell $alert={analysis.stuckValue > 0}>
                    {formatCurrency(analysis.stuckValue)}
                  </TableCell>
                  <TableCell $alert={analysis.stuckTasks > 0}>
                    {analysis.stuckTasks}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      </Section>

      {/* Distribuição por Tempo */}
      {analyses.some(
        a => a.valueByTimeRange && a.valueByTimeRange.length > 0
      ) && (
        <Section>
          <SectionTitle>
            <MdTimeline size={18} />
            Distribuição por Tempo
          </SectionTitle>
          {analyses.map(
            analysis =>
              analysis.valueByTimeRange &&
              analysis.valueByTimeRange.length > 0 && (
                <div key={analysis.columnId} style={{ marginBottom: '24px' }}>
                  <h5 style={{ marginBottom: '12px', color: 'inherit' }}>
                    {analysis.columnName}
                  </h5>
                  <TimeRangeGrid>
                    {analysis.valueByTimeRange.map((range, index) => (
                      <TimeRangeCard key={index}>
                        <TimeRangeLabel>{range.range}</TimeRangeLabel>
                        <TimeRangeValue>
                          {formatCurrency(range.value)}
                        </TimeRangeValue>
                        <TimeRangePercentage>
                          {range.taskCount} tarefas (
                          {range.percentage.toFixed(1)}%)
                        </TimeRangePercentage>
                      </TimeRangeCard>
                    ))}
                  </TimeRangeGrid>
                </div>
              )
          )}
        </Section>
      )}

      {/* Alto Valor Parado */}
      {analyses.some(a => a.highValueTasks && a.highValueTasks.length > 0) && (
        <Section>
          <SectionTitle>
            <MdWarning size={18} />
            Alto Valor Parado
          </SectionTitle>
          {analyses
            .filter(a => a.highValueTasks && a.highValueTasks.length > 0)
            .map(analysis => (
              <div key={analysis.columnId} style={{ marginBottom: '24px' }}>
                <h5 style={{ marginBottom: '12px', color: 'inherit' }}>
                  {analysis.columnName}
                </h5>
                <AlertList>
                  {analysis.highValueTasks.map(task => (
                    <AlertItem key={task.taskId}>
                      <AlertTitle>{task.taskTitle}</AlertTitle>
                      <AlertDetails>
                        {formatCurrency(task.value)} •{' '}
                        {task.daysInColumn.toFixed(1)} dias na coluna
                      </AlertDetails>
                    </AlertItem>
                  ))}
                </AlertList>
              </div>
            ))}
        </Section>
      )}

      {/* Evolução Mensal */}
      {analyses.some(a => a.valueByPeriod && a.valueByPeriod.length > 0) && (
        <Section>
          <SectionTitle>
            <MdTrendingUp size={18} />
            Evolução Mensal (Últimos 12 Meses)
          </SectionTitle>
          {analyses.map(
            analysis =>
              analysis.valueByPeriod &&
              analysis.valueByPeriod.length > 0 && (
                <div key={analysis.columnId} style={{ marginBottom: '24px' }}>
                  <h5 style={{ marginBottom: '12px', color: 'inherit' }}>
                    {analysis.columnName}
                  </h5>
                  <ChartContainer>
                    <SafeChartWrapper>
                      <Line
                        data={{
                          labels: analysis.valueByPeriod.map(p =>
                            formatMonth(p.period)
                          ),
                          datasets: [
                            {
                              label: 'Valor Entrado',
                              data: analysis.valueByPeriod.map(
                                p => p.enteredValue
                              ),
                              borderColor: 'rgba(16, 185, 129, 1)',
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              borderWidth: 3,
                              fill: true,
                              tension: 0.4,
                            },
                            {
                              label: 'Valor Saído',
                              data: analysis.valueByPeriod.map(
                                p => p.leftValue
                              ),
                              borderColor: 'rgba(239, 68, 68, 1)',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              borderWidth: 3,
                              fill: true,
                              tension: 0.4,
                            },
                            {
                              label: 'Valor Atual',
                              data: analysis.valueByPeriod.map(
                                p => p.currentValue
                              ),
                              borderColor: 'rgba(59, 130, 246, 1)',
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              borderWidth: 3,
                              fill: true,
                              tension: 0.4,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: true, position: 'top' as const },
                            tooltip: {
                              callbacks: {
                                label: (context: any) => {
                                  return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
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
                          <TableHeaderCell>Valor Entrado</TableHeaderCell>
                          <TableHeaderCell>Valor Saído</TableHeaderCell>
                          <TableHeaderCell>Valor Atual</TableHeaderCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysis.valueByPeriod.map(period => (
                          <TableRow key={period.period}>
                            <TableCell>{formatMonth(period.period)}</TableCell>
                            <TableCell>
                              {formatCurrency(period.enteredValue)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(period.leftValue)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(period.currentValue)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableWrapper>
                </div>
              )
          )}
        </Section>
      )}
    </DashboardContainer>
  );
};
