import React from 'react';
import styled from 'styled-components';
import { MdSchedule, MdWarning, MdError } from 'react-icons/md';
import type { KanbanTask } from '../../types/kanban';

interface TaskDeadlineIndicatorProps {
  task: KanbanTask;
  className?: string;
}

const IndicatorContainer = styled.div<{ type: 'ok' | 'warning' | 'overdue' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: ${props => (props.type === 'overdue' ? '4px' : '2px 6px')};
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 600;
  white-space: nowrap;
  min-width: 0;
  cursor: ${props => (props.type === 'overdue' ? 'help' : 'default')};
  background: ${props => {
    switch (props.type) {
      case 'overdue':
        return props.theme.colors.error;
      case 'warning':
        return props.theme.colors.warning;
      default:
        return props.theme.colors.background;
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'overdue':
        return props.theme.colors.cardBackground;
      case 'warning':
        return props.theme.colors.cardBackground;
      default:
        return props.theme.colors.textSecondary;
    }
  }};
  border: 1px solid
    ${props => {
      switch (props.type) {
        case 'overdue':
          return props.theme.colors.error;
        case 'warning':
          return props.theme.colors.warning;
        default:
          return props.theme.colors.border;
      }
    }};
`;

const DeadlineText = styled.span`
  white-space: nowrap;
`;

const getDeadlineStatus = (
  dueDate: Date
): { type: 'warning' | 'overdue' | 'ok'; daysRemaining: number } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate()
  );

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { type: 'overdue', daysRemaining: Math.abs(diffDays) };
  } else if (diffDays <= 2) {
    return { type: 'warning', daysRemaining: diffDays };
  }

  return { type: 'ok', daysRemaining: diffDays };
};

const getDeadlineText = (
  type: 'warning' | 'overdue' | 'ok',
  daysRemaining: number
): string => {
  if (type === 'overdue') {
    return daysRemaining === 1 ? '1 dia em atraso' : `${daysRemaining} dias em atraso`;
  }
  if (type === 'warning') {
    return daysRemaining === 0 ? 'Hoje' : `${daysRemaining}d`;
  }
  return `${daysRemaining}d`;
};

const getDeadlineIcon = (type: 'warning' | 'overdue' | 'ok') => {
  switch (type) {
    case 'overdue':
      return <MdError size={10} />;
    case 'warning':
      return <MdWarning size={10} />;
    default:
      return <MdSchedule size={10} style={{ color: '#4FC3F7' }} />; // Azul claro fixo
  }
};

export const TaskDeadlineIndicator: React.FC<TaskDeadlineIndicatorProps> = ({
  task,
  className,
}) => {
  if (!task.dueDate) {
    return null;
  }

  const status = getDeadlineStatus(new Date(task.dueDate));
  const text = getDeadlineText(status.type, status.daysRemaining);
  const icon = getDeadlineIcon(status.type);

  // Em atraso: só ícone com tooltip (dias em atraso)
  if (status.type === 'overdue') {
    return (
      <IndicatorContainer
        type='overdue'
        className={className}
        title={text}
        as='span'
      >
        {icon}
      </IndicatorContainer>
    );
  }

  return (
    <IndicatorContainer type={status.type} className={className}>
      {icon}
      <DeadlineText>{text}</DeadlineText>
    </IndicatorContainer>
  );
};

export default TaskDeadlineIndicator;
