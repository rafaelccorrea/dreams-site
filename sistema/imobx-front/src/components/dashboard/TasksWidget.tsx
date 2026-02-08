import React from 'react';
import styled from 'styled-components';
import {
  MdCheckCircle,
  MdSchedule,
  MdPriorityHigh,
  MdMoreVert,
} from 'react-icons/md';
import { InfoTooltip } from '../common/InfoTooltip';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low' | 'urgent';
  assignee: {
    id: string;
    name: string;
  };
  status: string;
  relatedEntity?: {
    type: string;
    id: string;
    name: string;
  };
}

interface TasksWidgetProps {
  tasks?: Task[];
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Visitar imóvel com cliente Maria',
    dueDate: '2024-01-20',
    priority: 'high',
    assignee: { id: 'user-1', name: 'João Silva' },
    status: 'pending',
  },
  {
    id: '2',
    title: 'Preparar contrato de locação',
    dueDate: '2024-01-21',
    priority: 'high',
    assignee: { id: 'user-2', name: 'Pedro Costa' },
    status: 'in_progress',
  },
  {
    id: '3',
    title: 'Follow-up cliente interessado',
    dueDate: '2024-01-22',
    priority: 'medium',
    assignee: { id: 'user-3', name: 'Maria Santos' },
    status: 'pending',
  },
  {
    id: '4',
    title: 'Atualizar fotos do imóvel',
    dueDate: '2024-01-23',
    priority: 'low',
    assignee: { id: 'user-1', name: 'João Silva' },
    status: 'pending',
  },
];

const TasksWidget: React.FC<TasksWidgetProps> = ({ tasks = mockTasks }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <MdCheckCircle />;
      case 'in_progress':
        return <MdSchedule />;
      default:
        return <MdSchedule />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'in_progress':
        return '#3B82F6';
      default:
        return '#F59E0B';
    }
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Amanhã';
    }
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const pendingTasks = tasks.filter(t => t.status !== 'completed');

  return (
    <Widget>
      <WidgetHeader>
        <HeaderLeft>
          <HeaderIcon>
            <MdSchedule />
          </HeaderIcon>
          <WidgetTitle>Tarefas Urgentes</WidgetTitle>
        </HeaderLeft>
        <HeaderRight>
          <TaskCount>{pendingTasks.length}</TaskCount>
          <InfoTooltip content='Lista de tarefas que precisam ser concluídas com urgência, incluindo visitas, follow-ups e preparação de documentos.' />
        </HeaderRight>
      </WidgetHeader>

      {pendingTasks.length > 0 ? (
        <TasksList>
          {pendingTasks.map(task => (
            <TaskCard key={task.id}>
              <TaskPriority $color={getPriorityColor(task.priority)}>
                <MdPriorityHigh />
              </TaskPriority>

              <TaskContent>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskMeta>
                  <TaskAssignee>{task.assignee.name}</TaskAssignee>
                  <TaskMetaDivider>•</TaskMetaDivider>
                  <TaskDueDate $isOverdue={new Date(task.dueDate) < new Date()}>
                    {formatDueDate(task.dueDate)}
                  </TaskDueDate>
                </TaskMeta>
              </TaskContent>

              <TaskStatus $color={getStatusColor(task.status)}>
                {getStatusIcon(task.status)}
              </TaskStatus>

              <TaskActions>
                <MdMoreVert />
              </TaskActions>
            </TaskCard>
          ))}
        </TasksList>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <MdCheckCircle size={48} />
          </EmptyIcon>
          <EmptyTitle>Nenhuma negociação encontrada</EmptyTitle>
          <EmptyDescription>
            Não há negociações urgentes no momento.
            <br />
            As tarefas aparecerão aqui quando forem criadas.
          </EmptyDescription>
        </EmptyState>
      )}
    </Widget>
  );
};

export default TasksWidget;

// Styled Components
const Widget = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  height: 100%;
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
`;

const WidgetTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const TaskCount = styled.div`
  padding: 6px 12px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 20px;
`;

const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TaskCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TaskPriority = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TaskContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TaskTitle = styled.div`
  font-size: 0.938rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
`;

const TaskAssignee = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const TaskMetaDivider = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const TaskDueDate = styled.span<{ $isOverdue: boolean }>`
  color: ${props =>
    props.$isOverdue ? '#EF4444' : props.theme.colors.textSecondary};
  font-weight: ${props => (props.$isOverdue ? '700' : '400')};
`;

const TaskStatus = styled.div<{ $color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TaskActions = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  min-height: 200px;
`;

const EmptyIcon = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  line-height: 1.5;
  max-width: 280px;
`;
