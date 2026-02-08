import React, { useMemo } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from './Task';
import type { KanbanTask, FunnelInsights } from '../../types/kanban';

interface VirtualizedTaskListProps {
  tasks: KanbanTask[];
  onEditTask?: (task: KanbanTask) => void;
  onDeleteTask?: (taskId: string) => void;
  onTaskClick?: (task: KanbanTask) => void;
  canEditTasks?: boolean;
  canDeleteTasks?: boolean;
  canMoveTasks?: boolean;
  viewSettings?: any;
  settings?: any;
  taskInsightsMap?: Map<string, FunnelInsights['taskInsights'][0]>;
}

export const VirtualizedTaskList: React.FC<VirtualizedTaskListProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onTaskClick,
  canEditTasks,
  canDeleteTasks,
  canMoveTasks,
  viewSettings,
  settings,
  taskInsightsMap,
}) => {
  // Renderização simples sem virtualização para evitar problemas de compatibilidade
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => a.position - b.position);
  }, [tasks]);

  return (
    <SortableContext
      items={tasks.map(task => task.id)}
      strategy={verticalListSortingStrategy}
    >
      {sortedTasks.map(task => (
        <Task
          key={task.id}
          task={task}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onClick={onTaskClick}
          canEdit={canEditTasks}
          canDelete={canDeleteTasks}
          canMove={canMoveTasks}
          viewSettings={viewSettings}
          settings={settings}
          taskInsight={taskInsightsMap?.get(task.id)}
        />
      ))}
    </SortableContext>
  );
};
