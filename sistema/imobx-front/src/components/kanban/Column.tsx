import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import {
  MdAdd,
  MdMoreVert,
  MdEdit,
  MdDelete,
  MdDragIndicator,
  MdCheckCircle,
  MdFlashOn,
  MdWarning,
  MdBarChart,
  MdRefresh,
  MdSchedule,
  MdAutoAwesome,
  MdSearch,
  MdExpandMore,
} from 'react-icons/md';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from './Task';
import { VirtualizedTaskList } from './VirtualizedTaskList';
import type { KanbanColumn, KanbanTask } from '../../types/kanban';
import type { FunnelInsights } from '../../types/kanban';
import { DeleteColumnModal } from '../modals/DeleteColumnModal';
import { formatCurrencyValue } from '../../utils/masks';

/** Exibir opção "Configurar Ações" no menu da coluna (oculto por enquanto) */
const SHOW_CONFIGURE_ACTIONS = false;

const ColumnTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const ColumnTitleRow = styled.h3<{
  $headerStyle?: 'simple' | 'gradient' | 'colored';
}>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: -0.01em;
  padding: 4px 8px;
  border-radius: 4px;
  flex-wrap: wrap;
  min-width: 0;
  overflow: hidden;

  /* Configuração de estilo do cabeçalho */
  ${props => {
    switch (props.$headerStyle) {
      case 'gradient':
        return `
          background: linear-gradient(135deg, ${props.theme.colors.primary}20 0%, ${props.theme.colors.primary}10 100%);
          border: 1px solid ${props.theme.colors.primary}30;
        `;
      case 'colored':
        return `
          background: ${props.theme.colors.primary};
          color: white;
          border: 1px solid ${props.theme.colors.primary};
        `;
      case 'simple':
      default:
        return `
          background: transparent;
          border: none;
        `;
    }
  }}

  @media (max-width: 1024px) and (min-width: 769px) {
    font-size: 0.9rem;
    padding: 5px 8px;
    gap: 6px;
    flex-wrap: nowrap;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 5px 8px;
    gap: 4px;
    flex-wrap: wrap;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 4px 6px;
    gap: 3px;
  }
`;

const ColumnValueBadge = styled.div<{ $hasStuck?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${props =>
    props.$hasStuck
      ? props.theme.colors.error + '20'
      : props.theme.colors.primary + '15'};
  color: ${props =>
    props.$hasStuck ? props.theme.colors.error : props.theme.colors.primary};
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0;
  border: 1px solid
    ${props =>
      props.$hasStuck
        ? props.theme.colors.error + '40'
        : props.theme.colors.primary + '30'};
  white-space: nowrap;
  flex-shrink: 0;
  align-self: flex-start;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 3px 6px;
    gap: 3px;

    svg {
      width: 12px;
      height: 12px;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.65rem;
    padding: 2px 4px;
    gap: 2px;

    svg {
      width: 10px;
      height: 10px;
    }
  }
`;

const StuckIndicator = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: 4px;
  padding-left: 4px;
  border-left: 1px solid currentColor;
  opacity: 0.8;
`;

/** Pills sutis para contagem IA: parados 7+ dias e follow-up */
const ColumnInsightsWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 6px;
  flex-shrink: 0;
`;

const InsightPill = styled.span<{ $variant: 'stuck' | 'followup' }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  opacity: 0.9;
  ${props =>
    props.$variant === 'stuck' &&
    `
    background: rgba(245, 158, 11, 0.12);
    color: #B45309;
  `}
  ${props =>
    props.$variant === 'followup' &&
    `
    background: rgba(59, 130, 246, 0.1);
    color: #2563EB;
  `}
  @media (max-width: 768px) {
    padding: 2px 5px;
    font-size: 0.6rem;
  }
`;

const ColumnHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

/** Botão de atualizar dados da coluna */
const RefreshColumnButton = styled.button<{ $loading?: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: ${props => (props.$loading ? 'wait' : 'pointer')};
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.7;
  }

  svg {
    animation: ${props =>
      props.$loading ? 'spin 0.8s linear infinite' : 'none'};
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

/** Botão que abre o dropdown de estatísticas */
const StatsMenuButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.primary};
  }
`;

/** Dropdown de estatísticas (abre ao clicar no botão) */
const StatsDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: #fff;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  min-width: 220px;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  padding: 12px 16px;
`;

const StatsDropdownTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: ${props =>
    props.theme.colors.textSecondary || props.theme.colors.text};
  margin-bottom: 10px;
  opacity: 0.9;
`;

const ColumnStatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: ${props =>
    props.theme.colors.textSecondary || props.theme.colors.text};
  line-height: 1.4;
  padding: 2px 0;
`;

const ColumnStatLabel = styled.span`
  opacity: 0.9;
`;

const ColumnStatValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  min-width: 1.5rem;
  text-align: right;
`;

const formatCurrency = (value: number | undefined | null) => {
  // Converter para número e garantir que seja válido
  const numValue = typeof value === 'number' ? value : Number(value) || 0;

  // Validar se é um número válido
  if (isNaN(numValue) || !isFinite(numValue)) {
    return 'R$ 0,00';
  }

  // Usar formatCurrencyValue que já formata corretamente com 2 casas decimais
  return formatCurrencyValue(numValue);
};
import {
  ColumnContainer,
  ColumnHeader,
  ColumnColor,
  ColumnMenu,
  MenuButton,
  MenuDropdown,
  MenuItem,
  MenuDivider,
  TasksList,
  TaskCount,
  AddTaskButton,
} from '../../styles/components/ColumnStyles';

const ColumnSearchWrap = styled.div`
  margin-bottom: 8px;
  flex-shrink: 0;
`;
const ColumnSearchInput = styled.input`
  width: 100%;
  padding: 6px 10px 6px 32px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;
const ColumnSearchInputWrap = styled.div`
  position: relative;
  .search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.textSecondary};
    pointer-events: none;
    font-size: 14px;
  }
`;
const LoadMoreButton = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 8px 12px;
  border: 1px dashed ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;

interface ColumnProps {
  column: KanbanColumn;
  tasks: KanbanTask[];
  onAddTask?: (columnId: string) => void;
  onEditTask?: (task: KanbanTask) => void;
  onDeleteTask?: (taskId: string) => void;
  onTaskClick?: (task: KanbanTask) => void;
  onEditColumn?: (column: KanbanColumn) => void;
  onDeleteColumn?: (columnId: string) => void;
  onConfigureValidations?: (column: KanbanColumn) => void;
  onConfigureActions?: (column: KanbanColumn) => void;
  canCreateTasks?: boolean;
  canEditTasks?: boolean;
  canDeleteTasks?: boolean;
  canMoveTasks?: boolean;
  canEditColumns?: boolean;
  canDeleteColumns?: boolean;
  canManageValidationsActions?: boolean;
  columnValue?: {
    totalValue: number;
    stuckValue?: number;
    stuckTasks?: number;
  };
  isColumnLocked?: boolean; // Se true, a coluna não pode ser movida (está vinculada a validações/ações)
  scrollMode?: 'scroll' | 'expand';
  viewSettings?: any;
  settings?: any;
  /** Atualizar dados desta coluna (recarrega board e valores por coluna) */
  onRefreshColumn?: (columnId: string) => void;
  /** Se o usuário pode ver métricas/insights (permissão kanban:view_analytics / SDR) */
  canViewAnalytics?: boolean;
  /** Insights IA por tarefa (prioridade, próxima ação) */
  taskInsightsMap?: Map<string, FunnelInsights['taskInsights'][0]>;
  /** Contagem de parados/follow-up nesta coluna (insights IA) */
  columnStuckCount?: { stuckCount: number; followUpCount: number };
  /** Abre a tela de Insights IA filtrada por esta coluna (quem tem permissão de analytics) */
  onOpenColumnInsights?: (column: KanbanColumn) => void;
  /** Paginação por coluna: teamId para carregar mais / buscar */
  teamId?: string | null;
  /** projectId para carregar mais / buscar */
  projectId?: string | null;
  /** Carregar mais cards nesta coluna */
  onLoadMore?: (columnId: string, options: { currentCount: number; search?: string }) => void;
  /** Buscar cards nesta coluna (substitui lista pelo resultado) */
  onSearchColumn?: (columnId: string, options: { search?: string }) => void;
  /** Tamanho da página por coluna (ex: 20) para mostrar "Carregar mais" */
  perColumnPageSize?: number;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onTaskClick,
  onEditColumn,
  onDeleteColumn,
  onConfigureValidations,
  onConfigureActions,
  canCreateTasks = false,
  canEditTasks = false,
  canDeleteTasks = false,
  canMoveTasks = false,
  canEditColumns = false,
  canDeleteColumns = false,
  canManageValidationsActions = false,
  isColumnLocked = false,
  scrollMode = 'scroll',
  viewSettings,
  settings,
  columnValue,
  onRefreshColumn,
  canViewAnalytics = false,
  taskInsightsMap,
  columnStuckCount,
  onOpenColumnInsights,
  teamId,
  projectId,
  onLoadMore,
  onSearchColumn,
  perColumnPageSize = 20,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showStatsDropdown, setShowStatsDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isRefreshingColumn, setIsRefreshingColumn] = useState(false);
  const [columnSearchText, setColumnSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const columnTasks = tasks.filter(task => task.columnId === column.id);

  const handleSearchChange = (value: string) => {
    setColumnSearchText(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!onSearchColumn || !teamId) return;
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearching(true);
      onSearchColumn(column.id, { search: value.trim() || undefined })
        .finally(() => setIsSearching(false));
    }, 400);
  };

  const handleLoadMore = () => {
    if (!onLoadMore || !teamId || isLoadingMore) return;
    setIsLoadingMore(true);
    onLoadMore(column.id, {
      currentCount: columnTasks.length,
      search: columnSearchText.trim() || undefined,
    }).finally(() => setIsLoadingMore(false));
  };

  const canLoadMore =
    Boolean(teamId && onLoadMore && columnTasks.length >= perColumnPageSize);

  // Hook para tornar a coluna ordenável (drag and drop)
  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    disabled: !canEditColumns || isColumnLocked, // Desabilita se não pode editar ou se está bloqueada
  });

  // Hook para tornar a coluna um alvo de drop para tarefas
  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id: column.id,
  });

  // Combinar refs (sortable + droppable)
  const setNodeRef = (node: HTMLElement | null) => {
    setSortableNodeRef(node);
    setDroppableNodeRef(node);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  /** Estatísticas do estágio: em andamento, esfriando, sem tarefas, atrasadas, sem produtos/serviços */
  const columnStats = useMemo(() => {
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    let emAndamento = 0;
    let esfriando = 0;
    let semTarefas = 0;
    let comTarefasAtrasadas = 0;
    let semProdutosOuServicos = 0;
    for (const task of columnTasks) {
      const updatedAt = task.updatedAt ? new Date(task.updatedAt).getTime() : 0;
      const isRecent = updatedAt && now - updatedAt < sevenDaysMs;
      if (isRecent) emAndamento += 1;
      else if (updatedAt) esfriando += 1;
      const hasSubtasks = task.subtasks && task.subtasks.length > 0;
      if (!hasSubtasks) semTarefas += 1;
      const hasOverdueSubtask =
        hasSubtasks &&
        task.subtasks!.some(st => {
          if (st.isCompleted) return false;
          const due = st.dueDate ? new Date(st.dueDate).getTime() : 0;
          return due > 0 && due < now;
        });
      if (hasOverdueSubtask) comTarefasAtrasadas += 1;
      if (!task.propertyId) semProdutosOuServicos += 1;
    }
    return {
      emAndamento,
      esfriando,
      semTarefas,
      comTarefasAtrasadas,
      semProdutosOuServicos,
    };
  }, [columnTasks]);

  const menuRef = useRef<HTMLDivElement>(null);
  const statsDropdownRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (
        statsDropdownRef.current &&
        !statsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowStatsDropdown(false);
      }
    };

    if (showMenu || showStatsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu, showStatsDropdown]);

  const handleAddTask = () => {
    if (onAddTask && canCreateTasks) {
      onAddTask(column.id);
      setShowMenu(false);
    }
  };

  const handleEditColumn = () => {
    if (onEditColumn) {
      onEditColumn(column);
    }
    setShowMenu(false);
  };

  const handleDeleteColumn = () => {
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleConfigureValidations = () => {
    onConfigureValidations?.(column);
    setShowMenu(false);
  };

  const handleConfigureActions = () => {
    onConfigureActions?.(column);
    setShowMenu(false);
  };

  const handleConfirmDelete = () => {
    if (onDeleteColumn) {
      onDeleteColumn(column.id);
    }
    setShowDeleteModal(false);
  };

  const handleRefreshColumn = () => {
    if (!onRefreshColumn || isRefreshingColumn) return;
    setIsRefreshingColumn(true);
    onRefreshColumn(column.id);
    setTimeout(() => setIsRefreshingColumn(false), 2500);
  };

  return (
    <>
      <ColumnContainer
        ref={setNodeRef}
        $isOver={isOver}
        $scrollMode={scrollMode}
        style={style}
        className='column-container'
      >
        <ColumnHeader className='column-header'>
          <ColumnTitleContainer>
            <ColumnTitleRow $headerStyle={settings?.columnHeaderStyle}>
              <ColumnColor color={column.color || '#6B7280'} />
              <div
                {...attributes}
                {...listeners}
                style={{
                  cursor:
                    canEditColumns && !isColumnLocked ? 'grab' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: isColumnLocked ? 0.5 : 1,
                }}
                title={
                  isColumnLocked
                    ? 'Esta coluna não pode ser movida pois está vinculada a validações ou ações'
                    : canEditColumns
                      ? 'Arrastar para reordenar'
                      : ''
                }
              >
                <MdDragIndicator size={16} />
              </div>
              {column.title}
              {viewSettings?.showTaskCount !== false && (
                <TaskCount data-show-task-count='true'>
                  ({columnTasks.length})
                </TaskCount>
              )}
            </ColumnTitleRow>
            <ColumnValueBadge
              $hasStuck={Boolean(
                columnValue?.stuckValue && columnValue.stuckValue > 0
              )}
            >
              {formatCurrency(columnValue?.totalValue || 0)}
              {columnValue?.stuckValue && columnValue.stuckValue > 0 && (
                <StuckIndicator
                  title={`${formatCurrency(columnValue.stuckValue)} parado há mais de 7 dias`}
                >
                  <MdWarning size={12} />
                  {columnValue.stuckTasks || 0}
                </StuckIndicator>
              )}
            </ColumnValueBadge>
            {canViewAnalytics &&
              columnStuckCount &&
              (columnStuckCount.stuckCount > 0 ||
                columnStuckCount.followUpCount > 0) && (
                <ColumnInsightsWrap title='Insights IA: parados 7+ dias e precisando follow-up'>
                  {columnStuckCount.stuckCount > 0 && (
                    <InsightPill $variant='stuck'>
                      <MdWarning size={10} />
                      {columnStuckCount.stuckCount}
                    </InsightPill>
                  )}
                  {columnStuckCount.followUpCount > 0 && (
                    <InsightPill $variant='followup'>
                      <MdSchedule size={10} />
                      {columnStuckCount.followUpCount}
                    </InsightPill>
                  )}
                </ColumnInsightsWrap>
              )}
          </ColumnTitleContainer>
          <ColumnHeaderActions>
            {onRefreshColumn && (
              <RefreshColumnButton
                type='button'
                $loading={isRefreshingColumn}
                disabled={isRefreshingColumn}
                onClick={e => {
                  e.stopPropagation();
                  handleRefreshColumn();
                }}
                title='Atualizar dados desta coluna'
              >
                <MdRefresh size={18} />
              </RefreshColumnButton>
            )}
            {canViewAnalytics && (
              <div ref={statsDropdownRef} style={{ position: 'relative' }}>
                <StatsMenuButton
                  type='button'
                  onClick={e => {
                    e.stopPropagation();
                    setShowMenu(false);
                    setShowStatsDropdown(prev => !prev);
                  }}
                  title='Estatísticas do estágio'
                >
                  <MdBarChart size={18} />
                </StatsMenuButton>
                <StatsDropdown
                  $isOpen={showStatsDropdown}
                  onClick={e => e.stopPropagation()}
                >
                  <StatsDropdownTitle>Estatísticas do estágio</StatsDropdownTitle>
                  <ColumnStatRow>
                    <ColumnStatLabel>Em andamento</ColumnStatLabel>
                    <ColumnStatValue>{columnStats.emAndamento}</ColumnStatValue>
                  </ColumnStatRow>
                  <ColumnStatRow>
                    <ColumnStatLabel>Esfriando</ColumnStatLabel>
                    <ColumnStatValue>
                      {columnStats.esfriando > 0 ? columnStats.esfriando : '-'}
                    </ColumnStatValue>
                  </ColumnStatRow>
                  <ColumnStatRow>
                    <ColumnStatLabel>Sem tarefas</ColumnStatLabel>
                    <ColumnStatValue>{columnStats.semTarefas}</ColumnStatValue>
                  </ColumnStatRow>
                  <ColumnStatRow>
                    <ColumnStatLabel>Com tarefas atrasadas</ColumnStatLabel>
                    <ColumnStatValue>
                      {columnStats.comTarefasAtrasadas}
                    </ColumnStatValue>
                  </ColumnStatRow>
                  <ColumnStatRow>
                    <ColumnStatLabel>Sem produtos ou serviços</ColumnStatLabel>
                    <ColumnStatValue>
                      {columnStats.semProdutosOuServicos}
                    </ColumnStatValue>
                  </ColumnStatRow>
                </StatsDropdown>
              </div>
            )}
            <ColumnMenu ref={menuRef}>
              <MenuButton
                onClick={e => {
                  e.stopPropagation();
                  setShowStatsDropdown(false);
                  setShowMenu(!showMenu);
                }}
                title='Menu da coluna'
              >
                <MdMoreVert size={18} />
              </MenuButton>
              <MenuDropdown
                $isOpen={showMenu}
                onClick={e => e.stopPropagation()}
              >
                {canCreateTasks && (
                  <MenuItem onClick={handleAddTask}>
                    <MdAdd size={16} />
                    Nova negociação
                  </MenuItem>
                )}
                {onOpenColumnInsights && (
                  <MenuItem
                    onClick={() => {
                      onOpenColumnInsights(column);
                      setShowMenu(false);
                    }}
                    title='Ver análise e sugestões da IA só para esta coluna'
                  >
                    <MdAutoAwesome size={16} />
                    Insights IA desta coluna
                  </MenuItem>
                )}
                {canCreateTasks && (canEditColumns || canDeleteColumns) && (
                  <MenuDivider />
                )}
                {canEditColumns && (
                  <MenuItem onClick={handleEditColumn}>
                    <MdEdit size={16} />
                    Editar coluna
                  </MenuItem>
                )}
                {canEditColumns && canManageValidationsActions && (
                  <>
                    <MenuItem onClick={handleConfigureValidations}>
                      <MdCheckCircle size={16} />
                      Configurar Validações
                    </MenuItem>
                    {SHOW_CONFIGURE_ACTIONS && (
                      <MenuItem onClick={handleConfigureActions}>
                        <MdFlashOn size={16} />
                        Configurar Ações
                      </MenuItem>
                    )}
                  </>
                )}
                {canDeleteColumns && (
                  <MenuItem onClick={handleDeleteColumn}>
                    <MdDelete size={16} />
                    Excluir coluna
                  </MenuItem>
                )}
              </MenuDropdown>
            </ColumnMenu>
          </ColumnHeaderActions>
        </ColumnHeader>

        {onSearchColumn && teamId && (
          <ColumnSearchWrap>
            <ColumnSearchInputWrap>
              <MdSearch className="search-icon" />
              <ColumnSearchInput
                type="text"
                placeholder="Buscar card..."
                value={columnSearchText}
                onChange={e => handleSearchChange(e.target.value)}
                disabled={isSearching}
              />
            </ColumnSearchInputWrap>
          </ColumnSearchWrap>
        )}

        <TasksList
          $scrollMode={scrollMode}
          data-has-many-tasks={columnTasks.length > 8 ? 'true' : 'false'}
        >
          {columnTasks.length > 15 ? (
            // Usar virtualização para muitas tarefas
            <VirtualizedTaskList
              tasks={columnTasks.sort((a, b) => a.position - b.position)}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onTaskClick={onTaskClick}
              canEditTasks={canEditTasks}
              canDeleteTasks={canDeleteTasks}
              canMoveTasks={canMoveTasks}
              viewSettings={viewSettings}
              settings={settings}
              taskInsightsMap={taskInsightsMap}
            />
          ) : (
            // Renderização normal para poucas tarefas
            <SortableContext
              items={columnTasks.map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {columnTasks
                .sort((a, b) => a.position - b.position)
                .map(task => (
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
          )}
          {canLoadMore && (
            <LoadMoreButton
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                'Carregando...'
              ) : (
                <>
                  <MdExpandMore size={18} />
                  Carregar mais
                </>
              )}
            </LoadMoreButton>
          )}
        </TasksList>

        {canCreateTasks && (
          <AddTaskButton onClick={handleAddTask}>
            <MdAdd size={16} />
            Adicionar negociação
          </AddTaskButton>
        )}
      </ColumnContainer>

      {/* Modal de Exclusão de Coluna */}
      <DeleteColumnModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        column={column}
        tasks={tasks}
      />
    </>
  );
};
