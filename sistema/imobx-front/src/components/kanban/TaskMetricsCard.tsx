import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdCheckCircle,
  MdSchedule,
  MdPerson,
  MdRefresh,
  MdFileDownload,
  MdBusiness,
  MdAttachMoney,
  MdComment,
  MdPeople,
  MdWarning,
  MdSwapHoriz,
  MdArrowForward,
} from 'react-icons/md';
import { kanbanMetricsApi } from '../../services/kanbanMetricsApi';
import type { TaskMetrics } from '../../types/kanban';
import { showError, showSuccess } from '../../utils/notifications';
import { MetricsShimmer } from '../shimmer/MetricsShimmer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskMetricsCardProps {
  taskId: string;
  className?: string;
}

const MetricsCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const MetricsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
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

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
`;

const MetricLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;

  @media (max-width: 1024px) {
    font-size: 1.25rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    gap: 6px;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

const MetricIcon = styled.div<{ $color?: string }>`
  color: ${props => props.$color || props.theme.colors.primary};
  display: flex;
  align-items: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 4px;
`;

const ProgressFill = styled.div<{ $percentage: number; $color?: string }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: ${props => props.$color || props.theme.colors.primary};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const UsersSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    margin-top: 20px;
    padding-top: 20px;
  }
`;

const UsersTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
`;

const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const UserStats = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const UserRate = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.colors.error};
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

const InfoSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    margin-top: 20px;
    padding-top: 20px;
  }
`;

const InfoTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 10px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  word-break: break-word;
  overflow-wrap: break-word;
  min-width: 0;
  max-width: 100%;
`;

const WarningBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${props => props.theme.colors.error}20;
  color: ${props => props.theme.colors.error};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 8px;
`;

const TimelineSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    margin-top: 20px;
    padding-top: 20px;
  }
`;

const TimelineTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TimelineItem = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  border-left: 3px solid ${props => props.theme.colors.primary};
`;

const TimelineItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
`;

const TimelineItemName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const TimelineItemTime = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const TimelineItemDates = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CurrentBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${props => props.theme.colors.success}20;
  color: ${props => props.theme.colors.success};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ProjectFunnel = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FunnelStage = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const FunnelStageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
`;

const FunnelStageName = styled.h5`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const FunnelStageBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const FunnelStageFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.primary},
    ${props => props.theme.colors.primary}80
  );
  transition: width 0.3s ease;
`;

const FunnelStageInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  flex-wrap: wrap;
  gap: 8px;
`;

const TotalTimeSummary = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 8px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
`;

export const TaskMetricsCard: React.FC<TaskMetricsCardProps> = ({
  taskId,
  className,
}) => {
  const [metrics, setMetrics] = useState<TaskMetrics | null>(null);
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

      const data = await kanbanMetricsApi.getTaskMetrics(taskId);
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
    if (taskId) {
      loadMetrics();
    }
  }, [taskId]);

  const handleRefresh = () => {
    loadMetrics(true);
  };

  const handleExportToExcel = async () => {
    try {
      setExporting(true);
      const blob = await kanbanMetricsApi.exportTaskMetricsToExcel([taskId]);

      // Criar link de download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `metricas_negociacao_${taskId.substring(0, 8)}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return <MetricsShimmer />;
  }

  if (error) {
    return (
      <MetricsCard className={className}>
        <ErrorState>{error}</ErrorState>
      </MetricsCard>
    );
  }

  if (!metrics) {
    return null;
  }

  const getProgressColor = (rate: number) => {
    if (rate >= 80) return '#10B981'; // verde
    if (rate >= 50) return '#F59E0B'; // amarelo
    return '#EF4444'; // vermelho
  };

  return (
    <MetricsCard className={className}>
      <MetricsHeader>
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <ExportButton onClick={handleExportToExcel} disabled={exporting}>
            <MdFileDownload size={18} />
            {exporting ? 'Exportando...' : 'Exportar Excel'}
          </ExportButton>
          <RefreshButton onClick={handleRefresh} disabled={refreshing}>
            <MdRefresh size={18} />
          </RefreshButton>
        </div>
      </MetricsHeader>

      <MetricsGrid>
        <MetricItem>
          <MetricLabel>Subtarefas</MetricLabel>
          <MetricValue>
            <MetricIcon $color='#3B82F6'>
              <MdCheckCircle size={24} />
            </MetricIcon>
            {metrics.completedSubtasks}/{metrics.totalSubtasks}
          </MetricValue>
          <ProgressBar>
            <ProgressFill
              $percentage={metrics.subtaskCompletionRate}
              $color={getProgressColor(metrics.subtaskCompletionRate)}
            />
          </ProgressBar>
          <MetricLabel style={{ fontSize: '0.75rem', marginTop: '4px' }}>
            {metrics.subtaskCompletionRate.toFixed(1)}% concluído
          </MetricLabel>
        </MetricItem>

        <MetricItem>
          <MetricLabel>Tempo Médio de Conclusão</MetricLabel>
          <MetricValue>
            <MetricIcon $color='#F59E0B'>
              <MdSchedule size={24} />
            </MetricIcon>
            {metrics.averageSubtaskCompletionTime.toFixed(1)}h
          </MetricValue>
        </MetricItem>

        <MetricItem>
          <MetricLabel>Tempo na Coluna Atual</MetricLabel>
          <MetricValue>
            <MetricIcon $color='#8B5CF6'>
              <MdSchedule size={24} />
            </MetricIcon>
            {metrics.timeInCurrentColumn.toFixed(1)}h
          </MetricValue>
        </MetricItem>

        <MetricItem>
          <MetricLabel>Tempo Total no Board</MetricLabel>
          <MetricValue>
            <MetricIcon $color='#10B981'>
              <MdSchedule size={24} />
            </MetricIcon>
            {metrics.totalTimeInBoard.toFixed(1)}h
          </MetricValue>
        </MetricItem>

        {metrics.daysOverdue !== undefined && metrics.daysOverdue > 0 && (
          <MetricItem>
            <MetricLabel>Dias em Atraso</MetricLabel>
            <MetricValue>
              <MetricIcon $color='#EF4444'>
                <MdWarning size={24} />
              </MetricIcon>
              {metrics.daysOverdue}
              <WarningBadge>
                <MdWarning size={14} />
                Atrasado
              </WarningBadge>
            </MetricValue>
          </MetricItem>
        )}

        {metrics.commentsCount !== undefined && (
          <MetricItem>
            <MetricLabel>Comentários</MetricLabel>
            <MetricValue>
              <MetricIcon $color='#8B5CF6'>
                <MdComment size={24} />
              </MetricIcon>
              {metrics.commentsCount}
            </MetricValue>
          </MetricItem>
        )}

        {metrics.involvedUsersCount !== undefined && (
          <MetricItem>
            <MetricLabel>Pessoas Envolvidas</MetricLabel>
            <MetricValue>
              <MetricIcon $color='#10B981'>
                <MdPeople size={24} />
              </MetricIcon>
              {metrics.involvedUsersCount}
            </MetricValue>
          </MetricItem>
        )}
      </MetricsGrid>

      {/* Informações de Contexto */}
      {(metrics.projectName ||
        metrics.clientName ||
        metrics.propertyTitle ||
        metrics.columnName) && (
        <InfoSection>
          <InfoTitle>
            <MdBusiness size={18} />
            Informações de Contexto
          </InfoTitle>
          <InfoGrid>
            {metrics.columnName && (
              <InfoItem>
                <InfoLabel>Coluna Atual</InfoLabel>
                <InfoValue>{metrics.columnName}</InfoValue>
              </InfoItem>
            )}
            {metrics.projectName && (
              <InfoItem>
                <InfoLabel>Funil</InfoLabel>
                <InfoValue>{metrics.projectName}</InfoValue>
              </InfoItem>
            )}
            {metrics.clientName && (
              <InfoItem>
                <InfoLabel>Cliente</InfoLabel>
                <InfoValue>{metrics.clientName}</InfoValue>
              </InfoItem>
            )}
            {metrics.propertyTitle && (
              <InfoItem>
                <InfoLabel>Propriedade</InfoLabel>
                <InfoValue>{metrics.propertyTitle}</InfoValue>
              </InfoItem>
            )}
          </InfoGrid>
        </InfoSection>
      )}

      {/* Informações Financeiras e de Origem */}
      {(metrics.totalValue ||
        metrics.closingForecast ||
        metrics.source ||
        metrics.campaign ||
        metrics.qualification) && (
        <InfoSection>
          <InfoTitle>
            <MdAttachMoney size={18} />
            Informações Financeiras e de Origem
          </InfoTitle>
          <InfoGrid>
            {metrics.totalValue !== undefined && (
              <InfoItem>
                <InfoLabel>Valor Total</InfoLabel>
                <InfoValue>{formatCurrency(metrics.totalValue)}</InfoValue>
              </InfoItem>
            )}
            {metrics.closingForecast && (
              <InfoItem>
                <InfoLabel>Previsão de Fechamento</InfoLabel>
                <InfoValue>{formatDate(metrics.closingForecast)}</InfoValue>
              </InfoItem>
            )}
            {metrics.source && (
              <InfoItem>
                <InfoLabel>Fonte</InfoLabel>
                <InfoValue>{metrics.source}</InfoValue>
              </InfoItem>
            )}
            {metrics.campaign && (
              <InfoItem>
                <InfoLabel>Campanha</InfoLabel>
                <InfoValue>{metrics.campaign}</InfoValue>
              </InfoItem>
            )}
            {metrics.qualification && (
              <InfoItem>
                <InfoLabel>Qualificação</InfoLabel>
                <InfoValue>{metrics.qualification}</InfoValue>
              </InfoItem>
            )}
            {metrics.result && (
              <InfoItem>
                <InfoLabel>Resultado</InfoLabel>
                <InfoValue>
                  {metrics.result === 'won'
                    ? 'Ganho'
                    : metrics.result === 'lost'
                      ? 'Perdido'
                      : metrics.result}
                </InfoValue>
              </InfoItem>
            )}
            {metrics.resultDate && (
              <InfoItem>
                <InfoLabel>Data do Resultado</InfoLabel>
                <InfoValue>{formatDate(metrics.resultDate)}</InfoValue>
              </InfoItem>
            )}
          </InfoGrid>
        </InfoSection>
      )}

      {metrics.subtasksByUser && metrics.subtasksByUser.length > 0 && (
        <UsersSection>
          <UsersTitle>
            <MdPerson
              size={18}
              style={{ marginRight: '8px', verticalAlign: 'middle' }}
            />
            Desempenho por Usuário
          </UsersTitle>
          <UsersList>
            {metrics.subtasksByUser.map(user => (
              <UserItem key={user.userId}>
                <UserInfo>
                  <UserName>{user.userName}</UserName>
                  <UserStats>
                    {user.completed}/{user.total} subtarefas
                  </UserStats>
                </UserInfo>
                <UserRate>{user.completionRate.toFixed(1)}%</UserRate>
              </UserItem>
            ))}
          </UsersList>
        </UsersSection>
      )}

      {/* Histórico de Movimentação entre Colunas */}
      {metrics.columnHistory && metrics.columnHistory.length > 0 && (
        <TimelineSection>
          <TimelineTitle>
            <MdArrowForward size={18} />
            Histórico de Movimentação entre Colunas
          </TimelineTitle>
          <TimelineList>
            {metrics.columnHistory.map((entry, index) => (
              <TimelineItem key={`${entry.columnId}-${index}`}>
                <TimelineItemHeader>
                  <TimelineItemName>{entry.columnName}</TimelineItemName>
                  {(entry.timeInColumn !== undefined ||
                    entry.duration !== undefined) && (
                    <TimelineItemTime>
                      {(entry.timeInColumn ?? entry.duration ?? 0).toFixed(1)}h
                      {(entry.timeInColumn ?? entry.duration ?? 0) >= 24 && (
                        <span
                          style={{
                            marginLeft: '4px',
                            fontSize: '0.75rem',
                            opacity: 0.8,
                          }}
                        >
                          (
                          {Math.round(
                            (entry.timeInColumn ?? entry.duration ?? 0) / 24
                          )}{' '}
                          dias)
                        </span>
                      )}
                    </TimelineItemTime>
                  )}
                </TimelineItemHeader>
                <TimelineItemDates>
                  <div>
                    Entrada:{' '}
                    {format(
                      new Date(entry.enteredAt),
                      "dd/MM/yyyy 'às' HH:mm",
                      { locale: ptBR }
                    )}
                  </div>
                  {entry.leftAt || entry.exitedAt ? (
                    <div>
                      Saída:{' '}
                      {format(
                        new Date(entry.leftAt || entry.exitedAt!),
                        "dd/MM/yyyy 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </div>
                  ) : (
                    <div style={{ color: '#10B981', fontWeight: 500 }}>
                      Em andamento...
                    </div>
                  )}
                </TimelineItemDates>
              </TimelineItem>
            ))}
          </TimelineList>
        </TimelineSection>
      )}

      {/* Histórico de Tempo por Funil */}
      {metrics.projectHistory && metrics.projectHistory.length > 0 && (
        <TimelineSection>
          <TimelineTitle>
            <MdSwapHoriz size={18} />
            Jornada da Negociação por Funil
          </TimelineTitle>
          <ProjectFunnel>
            {metrics.projectHistory.map((project, index) => {
              const totalTime = metrics.totalTimeAcrossProjects || 1;
              const percentage =
                totalTime > 0 ? (project.timeInProject / totalTime) * 100 : 0;

              return (
                <FunnelStage key={project.projectId}>
                  <FunnelStageHeader>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <FunnelStageName>{project.projectName}</FunnelStageName>
                      {project.isCurrentProject && (
                        <CurrentBadge>
                          <MdCheckCircle size={12} />
                          Funil Atual
                        </CurrentBadge>
                      )}
                    </div>
                    <TimelineItemTime>
                      {project.timeInProject.toFixed(1)}h
                      {project.timeInProject >= 24 && (
                        <span
                          style={{
                            marginLeft: '4px',
                            fontSize: '0.75rem',
                            opacity: 0.8,
                          }}
                        >
                          ({Math.round(project.timeInProject / 24)} dias)
                        </span>
                      )}
                      <span
                        style={{
                          marginLeft: '8px',
                          fontSize: '0.75rem',
                          opacity: 0.7,
                        }}
                      >
                        ({percentage.toFixed(1)}%)
                      </span>
                    </TimelineItemTime>
                  </FunnelStageHeader>
                  <FunnelStageBar>
                    <FunnelStageFill $percentage={percentage} />
                  </FunnelStageBar>
                  <FunnelStageInfo>
                    <div>
                      Entrada:{' '}
                      {format(
                        new Date(project.enteredAt),
                        "dd/MM/yyyy 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </div>
                    {project.leftAt ? (
                      <div>
                        Saída:{' '}
                        {format(
                          new Date(project.leftAt),
                          "dd/MM/yyyy 'às' HH:mm",
                          { locale: ptBR }
                        )}
                      </div>
                    ) : (
                      <div style={{ color: '#10B981', fontWeight: 500 }}>
                        Em andamento...
                      </div>
                    )}
                  </FunnelStageInfo>
                </FunnelStage>
              );
            })}
          </ProjectFunnel>
          {metrics.totalTimeAcrossProjects !== undefined && (
            <TotalTimeSummary>
              Tempo Total no Processo:{' '}
              {metrics.totalTimeAcrossProjects.toFixed(1)}h (
              {Math.round(metrics.totalTimeAcrossProjects / 24)} dias)
            </TotalTimeSummary>
          )}
        </TimelineSection>
      )}
    </MetricsCard>
  );
};
