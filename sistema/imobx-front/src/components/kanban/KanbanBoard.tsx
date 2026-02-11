import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import {
  MdAdd,
  MdDragIndicator,
  MdSettings,
  MdClose,
  MdFilterList,
  MdColorLens,
  MdBarChart,
  MdMoreVert,
  MdAutoAwesome,
} from 'react-icons/md';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useNavigate } from 'react-router-dom';
import { Column } from './Column';
import { Task } from './Task';
import { TeamSelectorCompact } from './TeamSelectorCompact';
import { TeamSelectionOverlay } from './TeamSelectionOverlay';
import { AssigneeFilter } from './AssigneeFilter';
import { KanbanFiltersDrawer } from './KanbanFiltersDrawer';
import { NoTeamsMessage } from './NoTeamsMessage';
import { ScrollControls } from './ScrollControls';
import KanbanShimmer from '../shimmer/KanbanShimmer';
import { useKanban } from '../../hooks/useKanban';
import { useTeamsConditional } from '../../hooks/useTeamsConditional';
import { useAuth } from '../../hooks/useAuth';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { useKanbanSettings } from '../../hooks/useKanbanSettings';
import { useKanbanViewSettings } from '../../hooks/useKanbanViewSettings';
import { useDeadlineAlerts } from '../../hooks/useDeadlineAlerts';
import { useModal } from '../../hooks/useModal';
import { useKanbanScroll } from '../../hooks/useKanbanScroll';
import { KanbanNotifications } from './KanbanNotifications';
import { EditColumnModal } from '../modals/EditColumnModal';
// TaskDetailsModal removido - usando navegação para TaskDetailsPage
import { ValidationFeedbackModal } from '../modals/ValidationFeedbackModal';
import { ValidationErrorModal } from '../modals/ValidationErrorModal';
import { ColumnValidationsModal } from '../modals/ColumnValidationsModal';
import { ColumnActionsModal } from '../modals/ColumnActionsModal';
import { ActionDataFormModal } from '../modals/ActionDataFormModal';
import { showError, showSuccess } from '../../utils/notifications';
import { saveKanbanState, getKanbanState } from '../../utils/kanbanState';
import {
  getApplicableActions,
  isColumnUsedInValidationsOrActions,
  canMoveColumnWithRelations,
} from '../../utils/kanbanValidations';
import { LottieLoading } from '../common/LottieLoading';
import type { ColumnAction } from '../../types/kanbanValidations';
import { kanbanMetricsApi } from '../../services/kanbanMetricsApi';
import { ActionType } from '../../types/kanbanValidations';
import { kanbanApi } from '../../services/kanbanApi';
import type { MoveTaskResponse } from '../../types/kanbanValidations';
import type {
  KanbanTask,
  KanbanColumn,
  KanbanProjectResponseDto,
  FunnelInsights,
} from '../../types/kanban';
import type { Team } from '../../services/teamApi';
import { projectsApi } from '../../services/projectsApi';
import { ProjectSelect } from '../projects/ProjectSelect';

const ProjectSelectWrapperInline = styled.div`
  flex: 0 0 30%;
  min-width: 200px;
  max-width: 300px;

  @media (max-width: 1024px) {
    flex: 1;
    width: 100%;
    max-width: 100%;
    min-width: 100%;
  }

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const MoreMenuWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const MoreDropdown = styled.div<{ $open: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  min-width: 180px;
  background: #fff;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
  display: ${props => (props.$open ? 'block' : 'none')};
  padding: 4px 0;
`;

const MoreMenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  background: none;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:hover {
    background: #f1f5f9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

import {
  KanbanContainer,
  KanbanHeader,
  KanbanTitleSection,
  KanbanTitle,
  KanbanProjectDescription,
  TeamMembersSection,
  KanbanActions,
  AddColumnButton,
  SettingsButton,
  KanbanBoardWrapper,
  KanbanBoard,
  ErrorContainer,
  ErrorTitle,
  ErrorMessage,
  RetryButton,
  EmptyState,
  EmptyTitle,
  EmptyMessage,
  SearchBar,
  SearchInputWrapper,
  SearchInput,
  ClearSearchButton,
  NegotiationsCountBar,
  NegotiationsCountValue,
} from '../../styles/components/KanbanBoardStyles';

interface KanbanBoardComponentProps {
  initialTeamId?: string;
  initialProjectId?: string;
  /** Dados do projeto já carregados pela página (evita chamar getProjectById de novo) */
  initialProjectData?: KanbanProjectResponseDto | null;
  isPersonalWorkspace?: boolean;
  selectedProjectId?: string | null;
  onProjectChange?: (projectId: string, teamId?: string) => void;
}

export const KanbanBoardComponent: React.FC<KanbanBoardComponentProps> = ({
  initialTeamId,
  initialProjectId,
  initialProjectData,
  isPersonalWorkspace: isPersonalWorkspaceProp = false,
  selectedProjectId: selectedProjectIdProp,
  onProjectChange,
}) => {
  const { getCurrentUser } = useAuth();
  const permissionsContext = usePermissionsContextOptional();
  const hasPermission = permissionsContext?.hasPermission || (() => false);
  const permissionsLoading = permissionsContext?.isLoading || false;
  const { isMaster } = useRoleAccess();
  const { openModal } = useModal();
  const navigate = useNavigate();
  const kanbanContainerRef = useRef<HTMLDivElement>(null);

  // Estado para valores das colunas
  const [columnValues, setColumnValues] = useState<
    Map<
      string,
      { totalValue: number; stuckValue?: number; stuckTasks?: number }
    >
  >(new Map());
  const [loadingColumnValues, setLoadingColumnValues] = useState(false);

  // Determinar se é workspace pessoal ANTES de decidir se deve carregar equipes
  const inferredPersonalWorkspaceEarly =
    Boolean(
      initialTeamId && initialTeamId.toLowerCase().startsWith('personal')
    ) || isPersonalWorkspaceProp;

  // OTIMIZAÇÃO: Só carregar useTeams se não temos initialTeamId E não for workspace pessoal
  const shouldLoadTeams = !initialTeamId && !inferredPersonalWorkspaceEarly;
  const {
    teams,
    selectedTeam,
    selectTeam,
    loading: teamsLoading,
    error: teamsError,
    reloadTeams,
  } = useTeamsConditional(shouldLoadTeams);
  const {
    board,
    filters,
    filterOptions,
    filterOptionsLoading,
    permissions,
    loading,
    error,
    selectedProjectId,
    setSelectedProjectId,
    refresh,
    refreshColumn,
    moveTask,
    moveTaskWithValidation,
    updateColumn,
    deleteColumn,
    handleFiltersChange,
    handleClearFilters,
    loadMoreColumnTasks,
    searchColumnTasks,
    perColumnPageSize,
  } = useKanban();

  const { settings } = useKanbanSettings();
  const { settings: viewSettings } = useKanbanViewSettings();

  const inferredPersonalWorkspace =
    Boolean(
      initialTeamId && initialTeamId.toLowerCase().startsWith('personal')
    ) || Boolean(selectedTeam && (selectedTeam as any)?.isPersonal);

  const isPersonalWorkspace =
    isPersonalWorkspaceProp || inferredPersonalWorkspace;

  // Estado para armazenar apenas o teamId do projeto (quando for workspace pessoal)
  const [projectTeamId, setProjectTeamId] = useState<string | null>(null);

  // Estado para armazenar os dados do projeto (nome e descrição)
  const [projectData, setProjectData] =
    useState<KanbanProjectResponseDto | null>(null);

  // Buscar o projeto para obter o teamId quando for workspace pessoal e também para obter nome/descrição
  // Usa initialProjectData quando disponível para evitar chamada duplicada (já carregado na KanbanPage)
  useEffect(() => {
    const projectId = selectedProjectId;
    if (projectId) {
      if (initialProjectData?.id === projectId) {
        setProjectData(initialProjectData);
        if (isPersonalWorkspace && initialProjectData.teamId && !projectTeamId) {
          setProjectTeamId(initialProjectData.teamId);
        }
        return;
      }
      const fetchProjectData = async () => {
        try {
          const project = await projectsApi.getProjectById(projectId);
          setProjectData(project);

          // Se for workspace pessoal, também armazenar o teamId
          if (isPersonalWorkspace && project?.teamId && !projectTeamId) {
            setProjectTeamId(project.teamId);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do projeto:', error);
          setProjectData(null);
        }
      };
      fetchProjectData();
    } else {
      setProjectData(null);
      if (!isPersonalWorkspace || !projectId) {
        setProjectTeamId(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPersonalWorkspace, selectedProjectId, initialProjectData?.id]);

  // Estados locais

  // Debug: Log das configurações
  // console.log('🔧 KanbanBoard - settings:', settings);
  // console.log('🔧 KanbanBoard - viewSettings:', viewSettings);
  // console.log('🔧 KanbanBoard - teams:', teams);
  // console.log('🔧 KanbanBoard - teamsLoading:', teamsLoading);
  // console.log('🔧 KanbanBoard - teamsError:', teamsError);
  // console.log('🔧 KanbanBoard - selectedTeam:', selectedTeam);

  // Recarregar configurações quando a página receber foco (voltar da página de configurações)
  useEffect(() => {
    const handleFocus = () => {
      // Forçar recarregamento das configurações quando voltar para a página
      const savedSettings = localStorage.getItem('kanban-view-settings');
      if (savedSettings) {
        try {
          JSON.parse(savedSettings);
          // O hook useKanbanViewSettings já deve ter atualizado, mas forçamos um re-render
          window.dispatchEvent(new Event('kanban-settings-updated'));
        } catch (error) {
          console.error('Erro ao recarregar configurações:', error);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Auto-selecionar equipe se há apenas uma disponível ou se foi fornecida via props
  useEffect(() => {
    if (teams && teams.length > 0) {
      if (initialTeamId) {
        // Selecionar equipe específica fornecida via props
        const team = teams.find((t: any) => t.id === initialTeamId);
        if (team && team.id !== selectedTeam?.id) {
          // console.log('🔄 Selecionando equipe via props:', team);
          selectTeam(team);
        } else if (!team) {
          // console.log('⚠️ Equipe não encontrada na lista (provavelmente workspace pessoal):', initialTeamId);
          // Para workspace pessoal, o teamId não estará na lista de teams
          // Isso é OK - vamos usar initialTeamId diretamente
        }
      } else if (teams.length === 1 && !selectedTeam) {
        // Auto-selecionar única equipe disponível
        // console.log('🔄 Auto-selecionando única equipe disponível:', teams[0]);
        selectTeam(teams[0]);
      }
    }
  }, [teams, selectedTeam, initialTeamId, selectTeam]);

  // Auto-selecionar projeto se foi fornecido via props
  useEffect(() => {
    if (initialProjectId && initialProjectId !== selectedProjectId) {
      // console.log('🔄 Selecionando projeto via props:', initialProjectId);
      setSelectedProjectId(initialProjectId);
    }
  }, [initialProjectId, selectedProjectId, setSelectedProjectId]);

  // Determinar teamId atual
  // Para workspace pessoal, usar o teamId do projeto (projectTeamId) ou initialTeamId
  const currentTeamId = isPersonalWorkspace
    ? projectTeamId || initialTeamId || selectedTeam?.id
    : selectedTeam?.id || initialTeamId;

  // Validar se o teamId é válido (não undefined, null ou string "undefined"/"null")
  const isValidTeamId = Boolean(
    currentTeamId &&
      currentTeamId !== 'undefined' &&
      currentTeamId !== 'null' &&
      typeof currentTeamId === 'string' &&
      currentTeamId.trim() !== ''
  );

  // Atualizar quadro quando projeto mudar e salvar estado
  const lastRefreshRef = useRef<{ teamId: string; projectId: string } | null>(
    null
  );
  /** Coalesce chamadas simultâneas a loadColumnValues (evita getColumnValueAnalysis duplicado) */
  const loadColumnValuesInFlightRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    // Validar que temos teamId válido antes de tentar carregar
    if (!isValidTeamId || !currentTeamId) {
      return;
    }

    if (!selectedProjectId) {
      return;
    }

    // Evitar chamadas duplicadas para o mesmo teamId e projectId
    if (
      lastRefreshRef.current?.teamId === currentTeamId &&
      lastRefreshRef.current?.projectId === selectedProjectId
    ) {
      return;
    }

    const user = getCurrentUser();

    // Para workspace pessoal, só carregar se tiver teamId válido do projeto
    if (isPersonalWorkspace && selectedProjectId && isValidTeamId) {
      lastRefreshRef.current = {
        teamId: currentTeamId,
        projectId: selectedProjectId,
      };
      refresh(currentTeamId, selectedProjectId);
      // Salvar estado do Kanban com userId
      saveKanbanState({
        projectId: selectedProjectId,
        teamId: currentTeamId,
        workspace: 'personal',
        userId: user?.id || undefined,
      });
    } else if (!isPersonalWorkspace && isValidTeamId && selectedProjectId) {
      lastRefreshRef.current = {
        teamId: currentTeamId,
        projectId: selectedProjectId,
      };
      refresh(currentTeamId, selectedProjectId);
      // Salvar estado do Kanban com userId
      saveKanbanState({
        projectId: selectedProjectId,
        teamId: currentTeamId,
        workspace: undefined,
        userId: user?.id || undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId, currentTeamId, isValidTeamId, isPersonalWorkspace]);

  // Função para carregar valores das colunas (extraída para poder ser chamada manualmente)
  const loadColumnValues = useCallback(async () => {
    const teamIdToUse = isPersonalWorkspace
      ? projectTeamId || initialTeamId || selectedTeam?.id
      : selectedTeam?.id || initialTeamId;

    // Inicializar todas as colunas com 0 primeiro
    const initializeZeroValues = () => {
      const zeroValuesMap = new Map<
        string,
        { totalValue: number; stuckValue?: number; stuckTasks?: number }
      >();
      if (board.columns && board.columns.length > 0) {
        board.columns.forEach(column => {
          zeroValuesMap.set(column.id, {
            totalValue: 0,
            stuckValue: 0,
            stuckTasks: 0,
          });
        });
      }
      return zeroValuesMap;
    };

    if (!teamIdToUse || isPersonalWorkspace) {
      setColumnValues(initializeZeroValues());
      return;
    }

    if (!board.columns?.length) {
      setColumnValues(initializeZeroValues());
      return;
    }

    if (loadColumnValuesInFlightRef.current) {
      return loadColumnValuesInFlightRef.current;
    }

    const runLoad = async (): Promise<void> => {
      try {
        setLoadingColumnValues(true);
        const analyses = await kanbanMetricsApi.getColumnValueAnalysis({
          teamId: teamIdToUse,
          minDaysStuck: 7,
        });

        const valuesMap = initializeZeroValues();

        // Preencher com valores reais quando disponíveis
        if (analyses && analyses.length > 0) {
          analyses.forEach(analysis => {
            valuesMap.set(analysis.columnId, {
              totalValue: analysis.totalValue || 0,
              stuckValue: analysis.stuckValue || 0,
              stuckTasks: analysis.stuckTasks || 0,
            });
          });
        }

        // Criar um novo Map completamente novo para forçar atualização do React
        const newColumnValues = new Map<
          string,
          { totalValue: number; stuckValue?: number; stuckTasks?: number }
        >();
        valuesMap.forEach((value, key) => {
          newColumnValues.set(key, { ...value });
        });

        setColumnValues(newColumnValues);
      } catch (error) {
        console.error('Erro ao carregar valores das colunas:', error);
        setColumnValues(initializeZeroValues());
      } finally {
        setLoadingColumnValues(false);
      }
    };

    const promise = runLoad();
    loadColumnValuesInFlightRef.current = promise;
    promise.finally(() => {
      if (loadColumnValuesInFlightRef.current === promise) {
        loadColumnValuesInFlightRef.current = null;
      }
    });
    return promise;
  }, [
    selectedTeam?.id,
    isPersonalWorkspace,
    projectTeamId,
    initialTeamId,
    board.columns,
  ]);

  // Carregar valores das colunas após o board estar visível (evita competir com getBoard no carregamento inicial)
  const DEFER_SECONDARY_MS = 600;
  useEffect(() => {
    const t = setTimeout(() => {
      loadColumnValues();
    }, DEFER_SECONDARY_MS);
    return () => clearTimeout(t);
  }, [loadColumnValues]);

  /** Carregar insights IA do funil após o board (adiado para não travar a tela) */
  useEffect(() => {
    if (!canViewMetrics()) {
      setFunnelInsights(null);
      setInsightsLoading(false);
      return;
    }
    if (!currentTeamId || !selectedProjectId || board.columns.length === 0) {
      setFunnelInsights(null);
      return;
    }
    if (isPersonalWorkspace || currentTeamId.startsWith('personal')) {
      setFunnelInsights(null);
      return;
    }
    let cancelled = false;
    const t = setTimeout(() => {
      setInsightsLoading(true);
      kanbanMetricsApi
        .getFunnelInsights(currentTeamId, selectedProjectId)
        .then(data => {
          if (!cancelled) setFunnelInsights(data);
        })
        .catch(() => {
          if (!cancelled) setFunnelInsights(null);
        })
        .finally(() => {
          if (!cancelled) setInsightsLoading(false);
        });
    }, DEFER_SECONDARY_MS);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [
    currentTeamId,
    selectedProjectId,
    board.columns.length,
    isPersonalWorkspace,
    board.tasks.length,
    permissionsContext?.isLoading,
  ]);

  /** Carregar valor (R$) apenas de uma coluna e atualizar o estado */
  const loadColumnValue = useCallback(
    async (columnId: string) => {
      const teamIdToUse = isPersonalWorkspace
        ? projectTeamId || initialTeamId || selectedTeam?.id
        : selectedTeam?.id || initialTeamId;
      if (!teamIdToUse || isPersonalWorkspace) return;
      try {
        const analyses = await kanbanMetricsApi.getColumnValueAnalysis({
          teamId: teamIdToUse,
          columnId,
          minDaysStuck: 7,
        });
        const analysis = analyses?.[0];
        if (analysis) {
          setColumnValues(prev => {
            const next = new Map(prev);
            next.set(columnId, {
              totalValue: analysis.totalValue || 0,
              stuckValue: analysis.stuckValue || 0,
              stuckTasks: analysis.stuckTasks || 0,
            });
            return next;
          });
        }
      } catch (e) {
        console.warn('Erro ao carregar valor da coluna:', e);
      }
    },
    [isPersonalWorkspace, projectTeamId, initialTeamId, selectedTeam?.id]
  );

  /** Atualizar apenas os dados de uma coluna (tarefas + valor R$), sem recarregar a página */
  const handleRefreshColumn = useCallback(
    async (columnId: string) => {
      if (!currentTeamId) return;
      await refreshColumn(
        currentTeamId,
        selectedProjectId || undefined,
        columnId,
        filters
      );
      await loadColumnValue(columnId);
      showSuccess('Coluna atualizada');
    },
    [currentTeamId, selectedProjectId, filters, refreshColumn, loadColumnValue]
  );

  // Recarregar quando filtros mudarem (com debounce para evitar muitas requisições)
  const lastFiltersRefreshRef = useRef<string | null>(null);

  useEffect(() => {
    // Validar que temos teamId válido antes de tentar carregar
    if (!isValidTeamId || !currentTeamId || !selectedProjectId) {
      return;
    }

    // Criar uma chave única para os filtros
    const filtersKey = JSON.stringify(filters);

    // Evitar refresh duplicado para os mesmos filtros
    if (lastFiltersRefreshRef.current === filtersKey) {
      return;
    }

    const timeoutId = setTimeout(() => {
      // Validar novamente antes de chamar refresh
      if (isValidTeamId && currentTeamId && selectedProjectId) {
        lastFiltersRefreshRef.current = filtersKey;
        // Passar filters explicitamente para evitar usar ref
        refresh(currentTeamId, selectedProjectId, filters);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentTeamId, isValidTeamId, selectedProjectId]); // Removido refresh das dependências

  const { refreshAlerts } = useDeadlineAlerts();
  const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<KanbanColumn | null>(null);
  const [isValidationsModalOpen, setIsValidationsModalOpen] = useState(false);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [configuringColumn, setConfiguringColumn] =
    useState<KanbanColumn | null>(null);
  const [validationFeedback, setValidationFeedback] = useState<{
    isOpen: boolean;
    validationResults: any[];
    actionResults: any[];
    warnings: string[];
    blocked: boolean;
  }>({
    isOpen: false,
    validationResults: [],
    actionResults: [],
    warnings: [],
    blocked: false,
  });
  const [validationErrorModal, setValidationErrorModal] = useState<{
    isOpen: boolean;
    errorMessage: string;
    taskId: string;
    taskUrl: string;
    taskTitle?: string;
  }>({
    isOpen: false,
    errorMessage: '',
    taskId: '',
    taskUrl: '',
    taskTitle: undefined,
  });
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [localColumns, setLocalColumns] = useState<KanbanColumn[]>([]);
  const [activeColumn, setActiveColumn] = useState<KanbanColumn | null>(null);
  // selectedTask removido - usando navegação para TaskDetailsPage
  const [overTaskId, setOverTaskId] = useState<string | null>(null);
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
  const [funnelInsights, setFunnelInsights] = useState<FunnelInsights | null>(
    null
  );
  const [insightsLoading, setInsightsLoading] = useState(false);

  const taskInsightsMap = React.useMemo(() => {
    if (!funnelInsights?.taskInsights?.length)
      return new Map<string, FunnelInsights['taskInsights'][0]>();
    const m = new Map<string, FunnelInsights['taskInsights'][0]>();
    funnelInsights.taskInsights.forEach(t => m.set(t.taskId, t));
    return m;
  }, [funnelInsights]);

  const columnStuckCountMap = React.useMemo(() => {
    if (!funnelInsights?.columnStuckCounts?.length)
      return new Map<string, { stuckCount: number; followUpCount: number }>();
    const m = new Map<string, { stuckCount: number; followUpCount: number }>();
    funnelInsights.columnStuckCounts.forEach(c =>
      m.set(c.columnId, {
        stuckCount: c.stuckCount,
        followUpCount: c.followUpCount,
      })
    );
    return m;
  }, [funnelInsights]);
  const [lockedColumns, setLockedColumns] = useState<Set<string>>(new Set()); // Colunas bloqueadas (vinculadas a validações/ações)
  const validationsCacheRef = useRef<{
    teamId: string | null;
    projectId: string | null;
    data: { validations: any[]; actions: any[] } | null;
    timestamp: number;
  }>({ teamId: null, projectId: null, data: null, timestamp: 0 });

  // Estados para modal de dados de ação
  const [isActionDataModalOpen, setIsActionDataModalOpen] = useState(false);
  const [isMovingTask, setIsMovingTask] = useState(false);
  const [isReorderingColumns, setIsReorderingColumns] = useState(false);
  const [movingTaskId, setMovingTaskId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    action: ColumnAction;
    task: KanbanTask;
    targetColumnId: string;
    targetPosition: number;
  } | null>(null);

  // ✅ Função removida - usar fetchValidationsAndActions() ao invés de loadActions()
  // Isso evita chamadas duplicadas e usa o cache

  // Garantir que o DragOverlay fique acima de tudo
  useEffect(() => {
    if (activeTask || activeColumn) {
      // Adicionar estilo global para garantir z-index máximo no DragOverlay
      const styleId = 'kanban-drag-overlay-global-style';
      let style = document.getElementById(styleId) as HTMLStyleElement;

      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
      }

      style.textContent = `
        .kanban-drag-overlay,
        [data-dnd-kit-drag-overlay],
        [role="dialog"][data-dnd-kit-drag-overlay] {
          z-index: 2147483647 !important;
          isolation: isolate !important;
        }
        .kanban-drag-overlay *,
        [data-dnd-kit-drag-overlay] *,
        [role="dialog"][data-dnd-kit-drag-overlay] * {
          z-index: 2147483647 !important;
        }
        /* Garantir que colunas e tasks normais tenham z-index menor */
        [data-kanban-board="true"] > * {
          z-index: 1 !important;
        }
        [data-kanban-board="true"] > * > * {
          z-index: 1 !important;
        }
        /* Transições suaves para tasks durante drag */
        [data-kanban-board="true"] [data-dnd-kit-sortable-item] {
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease !important;
        }
      `;

      return () => {
        // Não remover o estilo, pois pode ser usado novamente
      };
    }
  }, [activeTask, activeColumn]);

  // Hook de scroll - apenas ativo quando há 5+ colunas
  const hasManyColumns = localColumns.length >= 5;
  const kanbanScrollRef = useKanbanScroll({ hasManyColumns });

  // Debug: Monitorar mudanças nas configurações
  useEffect(() => {
    console.log('🔄 KanbanBoard - viewSettings mudaram:', viewSettings);
    console.log('🔄 KanbanBoard - cardDensity:', viewSettings?.cardDensity);
    console.log('🔄 KanbanBoard - zoomLevel:', viewSettings?.zoomLevel);
  }, [viewSettings]);

  // isTaskDetailsModalOpen removido - usando navegação para TaskDetailsPage
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | null>(
    null
  );
  const [searchText, setSearchText] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };
    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreMenu]);

  const user = getCurrentUser();

  // Detectar se é mobile/tablet
  const isMobileOrTablet =
    typeof window !== 'undefined' && window.innerWidth <= 1024;

  // Configurar sensores para drag and drop
  // Em mobile/tablet: usar maior distância e delay para diferenciar scroll de drag
  // Em desktop: usar distância menor
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: isMobileOrTablet
        ? {
            // Mobile/Tablet: maior distância e delay para evitar conflito com scroll
            distance: 15, // Requer movimento de 15px antes de iniciar o drag
            delay: 200, // Delay de 200ms para diferenciar scroll de drag
            tolerance: 5, // Tolerância de 5px
          }
        : {
            // Desktop: distância menor para resposta rápida, mas suficiente para diferenciar clique de drag
            distance: 5, // Requer movimento de 5px antes de iniciar o drag
          },
    })
  );

  // Função helper para buscar validações e ações de uma vez (com cache)
  const fetchValidationsAndActions = useCallback(
    async (
      forceRefresh = false
    ): Promise<{ validations: any[]; actions: any[] }> => {
      if (!currentTeamId) {
        return { validations: [], actions: [] };
      }

      // Verificar cache (válido por 5 segundos, ou se forceRefresh for true, ignorar cache)
      const cache = validationsCacheRef.current;
      const now = Date.now();
      const cacheValid =
        !forceRefresh &&
        cache.data &&
        cache.teamId === currentTeamId &&
        cache.projectId === selectedProjectId &&
        now - cache.timestamp < 5000; // ✅ Reduzido para 5 segundos

      if (cacheValid && cache.data) {
        console.log('📦 Usando cache de validações/ações');
        return cache.data;
      }

      console.log('🔄 Buscando validações e ações do servidor...');
      try {
        const { kanbanValidationsApi } = await import(
          '../../services/kanbanValidationsApi'
        );

        // ✅ Usar endpoint otimizado que retorna tudo de uma vez
        const columnsWithData =
          await kanbanValidationsApi.getColumnsWithValidationsAndActions(
            currentTeamId,
            selectedProjectId || undefined
          );

        // Extrair todas as validações e ações, preservando o columnId
        const allValidations: any[] = [];
        const allActions: any[] = [];

        for (const column of columnsWithData) {
          if (column.validations) {
            // Garantir que cada validação tenha o columnId da coluna que a contém
            allValidations.push(
              ...column.validations.map((v: any) => ({
                ...v,
                columnId: v.columnId || column.id, // Usar columnId da validação ou da coluna
                toColumnId: v.toColumnId || v.columnId || column.id, // Usar toColumnId ou columnId
              }))
            );
          }
          if (column.actions) {
            // Garantir que cada ação tenha o columnId da coluna que a contém
            allActions.push(
              ...column.actions.map((a: any) => ({
                ...a,
                columnId: a.columnId || column.id, // Usar columnId da ação ou da coluna
                toColumnId: a.toColumnId || a.columnId || column.id, // Usar toColumnId ou columnId
              }))
            );
          }
        }

        const result = { validations: allValidations, actions: allActions };

        // Atualizar cache
        validationsCacheRef.current = {
          teamId: currentTeamId,
          projectId: selectedProjectId,
          data: result,
          timestamp: now,
        };

        console.log(
          `✅ Validações e ações carregadas: ${allValidations.length} validações, ${allActions.length} ações`
        );
        return result;
      } catch (error) {
        console.error('❌ Erro ao buscar validações e ações:', error);
        return { validations: [], actions: [] };
      }
    },
    [currentTeamId, selectedProjectId]
  );

  // Sincronizar colunas locais com o board
  useEffect(() => {
    setLocalColumns(board.columns);
  }, [board.columns]);

  // Verificar colunas bloqueadas (separado para evitar chamadas desnecessárias)
  useEffect(() => {
    // ✅ Só verificar se tiver teamId e colunas
    if (!currentTeamId || board.columns.length === 0) {
      setLockedColumns(new Set());
      return;
    }

    // Verificar quais colunas estão bloqueadas (vinculadas a validações/ações)
    const checkLockedColumns = async () => {
      try {
        // ✅ Usar função helper com cache
        const { validations, actions } = await fetchValidationsAndActions();

        // Verificar quais colunas estão bloqueadas (considerando relações com colunas adjacentes)
        const locked = new Set<string>();
        for (const column of board.columns) {
          const moveCheck = canMoveColumnWithRelations(
            column.id,
            board.columns,
            validations,
            actions
          );

          if (!moveCheck.canMove) {
            locked.add(column.id);
            // Também bloquear a coluna relacionada (anterior ou seguinte)
            if (moveCheck.relatedColumnId) {
              locked.add(moveCheck.relatedColumnId);
            }
          }
        }

        setLockedColumns(locked);
      } catch (error) {
        console.error('❌ Erro ao verificar colunas bloqueadas:', error);
        setLockedColumns(new Set());
      }
    };

    checkLockedColumns();
  }, [
    board.columns,
    currentTeamId,
    selectedProjectId,
    fetchValidationsAndActions,
  ]);

  // Função para ordenar tarefas
  const sortTasks = useCallback(
    (tasks: KanbanTask[]) => {
      const sortBy = viewSettings?.defaultSortBy || 'position';
      const direction = viewSettings?.sortDirection || 'asc';

      // console.log('🔄 Ordenando tarefas por:', sortBy, 'direção:', direction);
      // console.log('📋 Tarefas antes da ordenação:', tasks.map(t => ({ title: t.title, position: t.position, priority: t.priority, dueDate: t.dueDate })));
      const sortedTasks = [...tasks].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortBy) {
          case 'position':
            aValue = a.position;
            bValue = b.position;
            break;
          case 'priority': {
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            aValue =
              priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
            bValue =
              priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
            break;
          }
          case 'dueDate':
            // Tarefas sem data vão para o final
            aValue = a.dueDate
              ? new Date(a.dueDate).getTime()
              : Number.MAX_SAFE_INTEGER;
            bValue = b.dueDate
              ? new Date(b.dueDate).getTime()
              : Number.MAX_SAFE_INTEGER;
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          default:
            aValue = a.position;
            bValue = b.position;
        }

        if (direction === 'desc') {
          return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
      });

      // console.log('✅ Tarefas após ordenação:', sortedTasks.map(t => ({ title: t.title, position: t.position, priority: t.priority, dueDate: t.dueDate })));
      return sortedTasks;
    },
    [viewSettings?.defaultSortBy, viewSettings?.sortDirection]
  );

  // Filtrar e ordenar tarefas
  const filteredTasks = React.useMemo(() => {
    let tasks = board.tasks;

    // console.log('🔍 KanbanBoard - filteredTasks - board.tasks:', board.tasks);
    // console.log('🔍 KanbanBoard - filteredTasks - tasks inicial:', tasks);
    // Filtro por responsável
    if (selectedAssigneeId) {
      if (selectedAssigneeId === 'unassigned') {
        tasks = tasks.filter(task => !task.assignedToId);
      } else {
        tasks = tasks.filter(task => task.assignedToId === selectedAssigneeId);
      }
      // console.log('🔍 KanbanBoard - filteredTasks - após filtro responsável:', tasks);
    }

    // Filtro por busca de texto
    if (searchText && viewSettings?.showSearchBar !== false) {
      const searchLower = searchText.toLowerCase();
      tasks = tasks.filter(task => {
        const titleMatch = task.title.toLowerCase().includes(searchLower);
        const descriptionMatch = task.description
          ?.toLowerCase()
          .includes(searchLower);
        const assigneeMatch = task.assignedTo?.name
          .toLowerCase()
          .includes(searchLower);

        return titleMatch || descriptionMatch || assigneeMatch;
      });
      // console.log('🔍 KanbanBoard - filteredTasks - após filtro busca:', tasks);
    }

    // Ordenar tarefas
    tasks = sortTasks(tasks);
    // console.log('🔍 KanbanBoard - filteredTasks - após ordenação:', tasks);
    return tasks;
  }, [
    board.tasks,
    selectedAssigneeId,
    searchText,
    viewSettings?.showSearchBar,
    sortTasks,
  ]);

  // Verificar permissões para criar equipes
  const canCreateTeams = () => {
    if (!user) return false;

    // Master sempre pode criar equipes
    if (isMaster()) return true;

    // Admin sempre pode criar equipes
    if (user.role === 'admin') return true;

    // User precisa ter permissão específica
    if (user.role === 'user') {
      return hasPermission('teams.create');
    }

    return false;
  };

  // Verificar permissões para gerenciar configurações
  const canManageSettings = () => {
    if (!user) return false;

    // Master sempre pode gerenciar configurações
    if (isMaster()) return true;

    // Admin sempre pode gerenciar configurações
    if (user.role === 'admin') return true;

    // User precisa ter permissão específica
    if (user.role === 'user') {
      return hasPermission('kanban.settings');
    }

    return false;
  };

  // Verificar permissões para gerenciar regras de cor (requer permissão de criar projeto)
  const canManageColorRules = () => {
    if (!user) return false;

    // Master sempre pode gerenciar regras de cor
    if (isMaster()) return true;

    // Admin sempre pode gerenciar regras de cor
    if (user.role === 'admin') return true;

    // User precisa ter permissão de criar projeto
    if (user.role === 'user') {
      return hasPermission('kanban:project:create');
    }

    return false;
  };

  // Verificar permissões para visualizar métricas
  const canViewMetrics = () => {
    if (!user) return false;

    // Master sempre pode visualizar métricas
    if (isMaster()) return true;

    // Admin sempre pode visualizar métricas
    if (user.role === 'admin') return true;

    // User precisa ter permissão específica
    if (user.role === 'user') {
      return hasPermission('kanban:view_analytics');
    }

    return false;
  };

  // Verificar permissões para gerenciar validações e ações
  const canManageValidationsActions = () => {
    if (!user) return false;

    // Validações e ações não podem aparecer no projeto pessoal
    if (isPersonalWorkspace) return false;

    // Master sempre pode gerenciar
    if (isMaster()) return true;

    // Admin sempre pode gerenciar
    if (user.role === 'admin') return true;

    // User precisa ter permissão específica
    if (user.role === 'user') {
      return hasPermission('kanban:manage_validations_actions');
    }

    return false;
  };

  const handleAddColumn = (e?: React.MouseEvent) => {
    // Prevenir propagação de eventos
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    // Determinar qual time usar: selectedTeam, initialTeamId, ou o único time disponível
    let teamToUse = selectedTeam;
    let teamIdToUse = selectedTeam?.id || initialTeamId;

    // Se não houver time selecionado mas houver apenas um time disponível, usar esse
    if (!teamToUse && teams && teams.length === 1) {
      teamToUse = teams[0];
      teamIdToUse = teams[0].id;
      // Selecionar automaticamente para manter sincronização
      selectTeam(teams[0]);
    }

    // Se ainda não houver time disponível
    if (!teamIdToUse) {
      showError('Selecione uma equipe primeiro');
      return;
    }

    // Verificar limite de colunas (máximo 6)
    if (localColumns.length >= 6) {
      showError(
        'Máximo de 6 colunas permitidas para manter o layout otimizado'
      );
      return;
    }

    // Navegar para a página de criação de coluna
    const params = new URLSearchParams();
    if (selectedProjectId) params.append('projectId', selectedProjectId);
    if (teamIdToUse) params.append('teamId', teamIdToUse);
    if (isPersonalWorkspace) params.append('workspace', 'personal');

    navigate(`/kanban/create-column?${params.toString()}`);
  };

  const handleEditColumn = (column: KanbanColumn) => {
    setEditingColumn(column);
    setIsEditColumnModalOpen(true);
  };

  const handleConfigureValidations = (column: KanbanColumn) => {
    setConfiguringColumn(column);
    setIsValidationsModalOpen(true);
  };

  const handleConfigureActions = (column: KanbanColumn) => {
    setConfiguringColumn(column);
    setIsActionsModalOpen(true);
  };

  // ✅ Função para invalidar cache de validações/ações
  const invalidateValidationsCache = useCallback(() => {
    validationsCacheRef.current = {
      teamId: null,
      projectId: null,
      data: null,
      timestamp: 0,
    };
  }, []);

  const handleUpdateColumn = async (data: any) => {
    if (!editingColumn) return;

    await updateColumn(editingColumn.id, data);
    setIsEditColumnModalOpen(false);
    setEditingColumn(null);
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (!currentTeamId) return;

    try {
      // ✅ Usar função helper com cache (forçar refresh para ter dados atualizados)
      const { validations, actions } = await fetchValidationsAndActions(true);

      // Verificar se a coluna está sendo usada
      const usageCheck = isColumnUsedInValidationsOrActions(
        columnId,
        validations,
        actions
      );

      if (usageCheck.isUsed) {
        showError(
          usageCheck.reason ||
            'Esta coluna não pode ser excluída pois está vinculada a validações ou ações.'
        );
        return;
      }

      // Se passou na validação, tentar excluir (o backend também valida)
      await deleteColumn(columnId);

      // ✅ Invalidar cache após exclusão
      invalidateValidationsCache();

      setIsEditColumnModalOpen(false);
      setEditingColumn(null);
    } catch (error: any) {
      // Se o backend retornar erro 400 com detalhes, mostrar mensagem específica
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        showError(`Não é possível excluir esta coluna:\n${errors.join('\n')}`);
      } else {
        showError(error.message || 'Erro ao excluir coluna');
      }
    }
  };

  const handleOpenSettings = () => {
    navigate('/kanban/settings');
  };

  const handleOpenColorRules = () => {
    const params = new URLSearchParams();
    const teamIdToUse = selectedTeam?.id || initialTeamId;
    if (teamIdToUse) params.append('teamId', teamIdToUse);
    if (selectedProjectId) params.append('projectId', selectedProjectId);
    navigate(`/kanban/color-rules?${params.toString()}`);
  };

  const handleTeamSelect = (team: Team | null) => {
    selectTeam(team);
    if (team) {
      // Salvar teamId para uso em modals
      sessionStorage.setItem('selectedTeamId', team.id);
      refresh(team.id, selectedProjectId || undefined);
    } else {
      sessionStorage.removeItem('selectedTeamId');
    }
  };

  const handleTaskClick = (task: KanbanTask) => {
    // Navegar para a página de detalhes da task
    const params = new URLSearchParams();
    if (selectedProjectId) params.append('projectId', selectedProjectId);

    // Determinar o teamId: usar selectedTeam?.id, projectTeamId (workspace pessoal), ou initialTeamId
    const currentTeamId = isPersonalWorkspace
      ? projectTeamId || initialTeamId || selectedTeam?.id
      : selectedTeam?.id || initialTeamId;

    if (currentTeamId) {
      params.append('teamId', currentTeamId);
    }

    if (isPersonalWorkspace) {
      params.append('workspace', 'personal');
    }

    navigate(`/kanban/task/${task.id}?${params.toString()}`);
  };

  // handleCloseTaskDetails removido - usando navegação para TaskDetailsPage

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Verificar se é uma tarefa sendo arrastada
    const task = board.tasks.find(task => task.id === active.id);
    if (task) {
      setActiveTask(task);
      setActiveColumn(null);
      setOverTaskId(null);
      return;
    }

    // Verificar se é uma coluna sendo arrastada
    const column = localColumns.find(col => col.id === active.id);
    if (column) {
      setActiveColumn(column);
      setActiveTask(null);
      setOverTaskId(null);
    }
  };

  const handleDragOver = (event: any) => {
    const { over, active } = event;
    if (!over || !active) {
      setOverTaskId(null);
      return;
    }

    console.log(
      '🔄 handleDragOver - active:',
      active.id,
      'over:',
      over.id,
      'over.data:',
      over.data
    );

    // Verificar primeiro se é uma tarefa (prioridade sobre coluna)
    const task = board.tasks.find(t => t.id === over.id);
    if (task) {
      setOverTaskId(task.id);
      console.log('🔄 handleDragOver - sobre tarefa:', task.title);
      return;
    }

    // Se não é tarefa, verificar se é coluna
    const isColumn = localColumns.some(col => col.id === over.id);
    if (isColumn) {
      setOverTaskId(null);
      console.log('🔄 handleDragOver - sobre coluna, limpando overTaskId');
      return;
    }

    // Se não encontrou nem tarefa nem coluna, limpar
    setOverTaskId(null);
    console.log(
      '🔄 handleDragOver - não encontrou tarefa nem coluna para:',
      over.id
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    console.log(
      '🔄 handleDragEnd - active:',
      active.id,
      'over:',
      over?.id,
      'overTaskId (rastreado):',
      overTaskId
    );
    setActiveTask(null);
    setActiveColumn(null);
    const trackedOverTaskId = overTaskId;
    setOverTaskId(null);

    if (!over) {
      console.log('⚠️ handleDragEnd - sem over, retornando');
      return;
    }

    // Verificar se estamos arrastando uma coluna
    const isColumn = localColumns.some(col => col.id === active.id);
    console.log('📋 handleDragEnd - isColumn:', isColumn);

    if (isColumn && active.id !== over.id) {
      console.log('📋 Reordenando colunas');
      console.log('📋 active.id:', active.id);
      console.log('📋 over.id:', over.id);
      console.log(
        '📋 localColumns:',
        localColumns.map(c => ({ id: c.id, name: c.name }))
      );
      const columnIdToMove = active.id as string;

      // Validar se a coluna está sendo usada em validações ou ações antes de mover
      (async () => {
        try {
          console.log('📋 Iniciando validação de coluna...');
          // ✅ Usar função helper com cache (não forçar refresh, usar cache se disponível)
          const { validations, actions } = await fetchValidationsAndActions();
          console.log('📋 Validações obtidas:', validations.length);
          console.log('📋 Ações obtidas:', actions.length);

          // Verificar se a coluna pode ser movida considerando relações com colunas adjacentes
          // Se uma coluna tem validação/ação para a próxima coluna, ambas não podem ser movidas
          const moveCheck = canMoveColumnWithRelations(
            columnIdToMove,
            localColumns,
            validations,
            actions
          );
          console.log(
            '📋 Resultado da verificação de movimentação:',
            moveCheck
          );

          if (!moveCheck.canMove) {
            console.log(
              '⚠️ Coluna não pode ser movida devido a relações com colunas adjacentes'
            );
            showError(
              moveCheck.reason ||
                'Esta coluna não pode ser movida pois possui validações ou ações configuradas para colunas adjacentes.'
            );
            return;
          }

          // Verificar também se a coluna de destino (over.id) pode ser movida
          const targetColumnId = over.id as string;
          if (targetColumnId !== columnIdToMove) {
            const targetMoveCheck = canMoveColumnWithRelations(
              targetColumnId,
              localColumns,
              validations,
              actions
            );
            console.log(
              '📋 Resultado da verificação da coluna de destino:',
              targetMoveCheck
            );

            if (!targetMoveCheck.canMove) {
              console.log(
                '⚠️ Coluna de destino não pode ser movida devido a relações com colunas adjacentes'
              );
              showError(
                targetMoveCheck.reason ||
                  'A coluna de destino não pode ser movida pois possui validações ou ações configuradas para colunas adjacentes.'
              );
              return;
            }
          }

          // Se passou na validação, proceder com a movimentação
          // IMPORTANTE: Garantir que localColumns está ordenado por position antes de encontrar índices
          const sortedColumns = [...localColumns].sort(
            (a, b) => a.position - b.position
          );
          const oldIndex = sortedColumns.findIndex(col => col.id === active.id);
          const newIndex = sortedColumns.findIndex(col => col.id === over.id);
          console.log(
            '📋 Índices encontrados - oldIndex:',
            oldIndex,
            'newIndex:',
            newIndex
          );
          console.log(
            '📋 Coluna sendo movida:',
            sortedColumns[oldIndex]?.title || sortedColumns[oldIndex]?.name,
            '(id:',
            active.id,
            ')'
          );
          console.log(
            '📋 Coluna de destino:',
            sortedColumns[newIndex]?.title || sortedColumns[newIndex]?.name,
            '(id:',
            over.id,
            ')'
          );

          if (oldIndex !== -1 && newIndex !== -1) {
            const previousColumns = [...sortedColumns];
            console.log(
              '📋 Colunas ANTES do arrayMove:',
              previousColumns.map((c, idx) => ({
                index: idx,
                id: c.id,
                name: c.name || c.title,
                position: c.position,
              }))
            );
            console.log(
              '📋 Movendo coluna do índice',
              oldIndex,
              'para o índice',
              newIndex
            );

            const newColumns = arrayMove(sortedColumns, oldIndex, newIndex);
            console.log(
              '📋 Colunas DEPOIS do arrayMove:',
              newColumns.map((c, idx) => ({
                index: idx,
                id: c.id,
                name: c.name || c.title,
                position: c.position,
              }))
            );

            // Verificar se arrayMove funcionou corretamente
            if (newColumns.length !== sortedColumns.length) {
              console.error('❌ ERRO: arrayMove alterou o número de colunas!', {
                antes: sortedColumns.length,
                depois: newColumns.length,
              });
            }

            // ✅ VALIDAÇÃO: Verificar se a coluna que está sendo movida está bloqueada
            const movedColumn = sortedColumns[oldIndex];
            if (lockedColumns.has(movedColumn.id)) {
              const columnName =
                movedColumn.name || movedColumn.title || movedColumn.id;
              console.error(
                '❌ Tentativa de mover coluna bloqueada:',
                columnName
              );
              showError(
                `Não é possível mover a coluna "${columnName}". Esta coluna possui validações ou ações configuradas, ou é adjacente a uma coluna com validações/ações.`
              );
              return;
            }

            // Verificar se alguma coluna bloqueada mudou de posição (não deveria acontecer se o drag está desabilitado)
            // Mas vamos verificar como segurança extra
            for (let i = 0; i < sortedColumns.length; i++) {
              const oldCol = sortedColumns[i];
              const newCol = newColumns[i];

              // Se a coluna na posição i mudou de ID, significa que houve movimento
              if (oldCol.id !== newCol.id && lockedColumns.has(oldCol.id)) {
                const columnName = oldCol.name || oldCol.title || oldCol.id;
                console.error(
                  '❌ Coluna bloqueada mudou de posição:',
                  columnName
                );
                showError(
                  `Não é possível mover a coluna "${columnName}". Esta coluna possui validações ou ações configuradas, ou é adjacente a uma coluna com validações/ações.`
                );
                return;
              }
            }

            // Atualizar UI instantaneamente (optimistic)
            setLocalColumns(newColumns);

            // Enviar para servidor em background
            setIsReorderingColumns(true);
            try {
              // IMPORTANTE: Enviar TODAS as colunas na nova ordem (backend usa índice como position)
              const columnIds = newColumns.map((col, index) => {
                console.log(
                  `📋 Mapeando coluna ${index}: id=${col.id}, name=${col.name || col.title}`
                );
                return col.id;
              });

              console.log('📋 Total de colunas:', columnIds.length);
              console.log(
                '📋 IDs que serão enviados para API (COMPLETO):',
                columnIds
              );
              console.log('📋 Verificação detalhada:');
              columnIds.forEach((id, idx) => {
                const col = newColumns.find(c => c.id === id);
                console.log(
                  `  [${idx}] ID: ${id}, Nome: ${col?.name || col?.title || 'N/A'}`
                );
              });
              console.log(
                '📋 Enviando para API - currentTeamId:',
                currentTeamId,
                'columnIds:',
                columnIds,
                'projectId:',
                selectedProjectId
              );

              // Validar se temos um teamId válido
              if (!currentTeamId) {
                console.error('❌ currentTeamId não está disponível');
                showError(
                  'Não foi possível identificar a equipe. Tente recarregar a página.'
                );
                setLocalColumns(previousColumns);
                setIsReorderingColumns(false);
                return;
              }

              await kanbanApi.reorderColumns(
                currentTeamId,
                columnIds,
                selectedProjectId || undefined
              );
              console.log('✅ Colunas reordenadas com sucesso');

              // Atualizar o board para refletir a nova ordem das colunas
              if (currentTeamId) {
                await refresh(currentTeamId, selectedProjectId || undefined);
                console.log('✅ Board atualizado com nova ordem de colunas');
              } else {
                console.warn(
                  '⚠️ currentTeamId não disponível, pulando refresh'
                );
              }
            } catch (error: any) {
              console.error('❌ Erro ao reordenar colunas:', error);
              console.error('❌ Detalhes do erro:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                stack: error.stack,
              });

              // Extrair mensagem de erro do backend
              let errorMessage = 'Erro ao reordenar colunas';
              if (error.message) {
                errorMessage = error.message;
              } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
              }

              showError(errorMessage);

              // Rollback - reverter para ordem original
              setLocalColumns(previousColumns);
            } finally {
              setIsReorderingColumns(false);
            }
          } else {
            console.error(
              '❌ Índices inválidos - oldIndex:',
              oldIndex,
              'newIndex:',
              newIndex
            );
            showError(
              'Não foi possível determinar a posição das colunas. Tente novamente.'
            );
          }
        } catch (error: any) {
          console.error('❌ Erro ao validar coluna antes de mover:', error);
          console.error('❌ Detalhes do erro de validação:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            stack: error.stack,
          });
          showError('Erro ao validar coluna. Tente novamente.');
          setIsReorderingColumns(false);
        }
      })();

      return;
    }

    // Lógica de mover tarefas com optimistic update
    if (!permissions.canMoveTasks) {
      console.log('⚠️ handleDragEnd - sem permissão para mover tarefas');
      return;
    }

    const taskId = active.id as string;
    console.log('🎯 handleDragEnd - taskId:', taskId);

    // Encontrar a tarefa atual
    const task = board.tasks.find(t => t.id === taskId);
    if (!task) {
      console.log('⚠️ handleDragEnd - tarefa não encontrada:', taskId);
      return;
    }
    console.log(
      '📝 handleDragEnd - task atual:',
      task.title,
      'coluna:',
      task.columnId,
      'posição:',
      task.position
    );

    // Verificar se over.id é uma tarefa ou uma coluna
    // IMPORTANTE: Usar o overTaskId rastreado durante o drag, pois o over.id pode ser a coluna
    let overTask: KanbanTask | undefined = undefined;

    // Prioridade 1: usar o overTaskId rastreado durante o drag
    if (trackedOverTaskId) {
      overTask = board.tasks.find(t => t.id === trackedOverTaskId);
      console.log(
        '🎯 handleDragEnd - usando trackedOverTaskId:',
        trackedOverTaskId,
        'overTask encontrada:',
        overTask ? overTask.title : 'null'
      );
    }

    // Prioridade 2: tentar pelo over.id diretamente
    if (!overTask) {
      overTask = board.tasks.find(t => t.id === over.id);
      console.log(
        '🎯 handleDragEnd - tentando over.id:',
        over.id,
        'overTask encontrada:',
        overTask ? overTask.title : 'null'
      );
    }

    const isOverColumn = localColumns.some(col => col.id === over.id);

    console.log('🎯 handleDragEnd - over.id:', over.id);
    console.log('🎯 handleDragEnd - trackedOverTaskId:', trackedOverTaskId);
    console.log(
      '🎯 handleDragEnd - overTask:',
      overTask
        ? `${overTask.title} (coluna: ${overTask.columnId}, pos: ${overTask.position})`
        : 'null'
    );
    console.log('🎯 handleDragEnd - isOverColumn:', isOverColumn);

    let targetColumnId: string;
    let newPosition: number;

    // Se encontrou uma tarefa, usar ela (prioridade sobre coluna)
    if (overTask) {
      // Se foi solto sobre uma tarefa, usar a coluna dessa tarefa
      targetColumnId = overTask.columnId;
      console.log(
        '✅ handleDragEnd - solto sobre tarefa, targetColumnId:',
        targetColumnId
      );

      // Se já está na mesma coluna, reordenar dentro da coluna
      if (task.columnId === targetColumnId) {
        console.log('🔄 handleDragEnd - REORDENANDO dentro da mesma coluna');
        // Obter todas as tarefas da coluna ordenadas por posição
        const columnTasks = board.tasks
          .filter(t => t.columnId === targetColumnId)
          .sort((a, b) => a.position - b.position);

        console.log(
          '📋 handleDragEnd - tarefas da coluna:',
          columnTasks.map(t => ({
            id: t.id,
            title: t.title,
            position: t.position,
          }))
        );

        const oldIndex = columnTasks.findIndex(t => t.id === taskId);
        const newIndex = columnTasks.findIndex(t => t.id === overTask!.id);

        console.log(
          '📊 handleDragEnd - oldIndex:',
          oldIndex,
          'newIndex:',
          newIndex
        );
        console.log(
          '📊 handleDragEnd - taskId:',
          taskId,
          'overTask.id:',
          overTask!.id
        );

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          // Reordenar usando arrayMove
          const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
          console.log(
            '🔄 handleDragEnd - tarefas reordenadas:',
            reorderedTasks.map(t => ({
              id: t.id,
              title: t.title,
              position: t.position,
            }))
          );

          // Atualizar posições de todas as tarefas afetadas
          reorderedTasks.forEach((t, index) => {
            if (t.position !== index) {
              console.log(
                `📝 handleDragEnd - atualizando tarefa ${t.title} de posição ${t.position} para ${index}`
              );
              // Ativar loading apenas para a primeira tarefa sendo movida
              if (t.id === taskId) {
                setIsMovingTask(true);
                setMovingTaskId(t.id);
              }
              moveTask({
                taskId: t.id,
                sourceColumnId: targetColumnId,
                sourcePosition: t.position,
                targetColumnId,
                targetPosition: index,
              })
                .then(() => {
                  if (t.id === taskId) {
                    setIsMovingTask(false);
                    setMovingTaskId(null);
                    // Recarregar valores das colunas após mover tarefa
                    // Usar setTimeout para garantir que o estado do board foi atualizado primeiro
                    setTimeout(() => {
                      console.log(
                        '🔄 Recarregando valores das colunas após reordenar tarefa'
                      );
                      loadColumnValues();
                    }, 100);
                  }
                })
                .catch((error: any) => {
                  if (t.id === taskId) {
                    setIsMovingTask(false);
                    setMovingTaskId(null);
                  }
                  console.error('❌ Erro ao reordenar tarefa:', error);
                  // Tratar erro com mapeamento (não propagar o erro)
                  try {
                    handleMoveError(error, t);
                  } catch (handleError: any) {
                    console.error(
                      '❌ Erro ao tratar erro de reordenação:',
                      handleError
                    );
                    // Não propagar o erro para evitar redirecionamentos indesejados
                  }
                });
            }
          });
        } else {
          console.log(
            '⚠️ handleDragEnd - índices inválidos ou iguais, não reordenando'
          );
        }
        return;
      }

      // Inserir no topo (posição 0) quando solto sobre uma tarefa de outra coluna
      newPosition = 0;
      console.log(
        '📝 handleDragEnd - movendo para outra coluna, nova posição:',
        newPosition
      );
    } else {
      // Se foi solto sobre a coluna (não sobre uma tarefa), adicionar no final
      targetColumnId = over.id as string;
      console.log(
        '✅ handleDragEnd - solto sobre coluna, targetColumnId:',
        targetColumnId
      );

      // Se já está na mesma coluna, não fazer nada (já está no final)
      if (task.columnId === targetColumnId) {
        console.log('⚠️ handleDragEnd - já está na mesma coluna, retornando');
        return;
      }

      // Inserir no topo (posição 0) quando solto sobre a coluna
      newPosition = 0;
      console.log(
        '📝 handleDragEnd - movendo para topo da coluna, nova posição:',
        newPosition
      );
    }

    // Verificar se a coluna destino tem ações de criação que requerem dados do usuário
    const creationActions: ActionType[] = [
      ActionType.CREATE_PROPERTY,
      ActionType.CREATE_CLIENT,
      ActionType.CREATE_DOCUMENT,
      ActionType.CREATE_VISTORIA,
      ActionType.CREATE_RENTAL,
      ActionType.CREATE_TRANSACTION,
    ];

    try {
      // ✅ Buscar todas as validações e ações de uma vez (usando cache)
      const { actions } = await fetchValidationsAndActions();

      // ✅ Usar função utilitária para obter ações aplicáveis considerando fromColumnId, toColumnId e requireAdjacentPosition
      // A função já filtra as ações da coluna correta baseado no trigger
      const applicableActions = getApplicableActions(
        board.columns,
        task.columnId, // fromColumnId (origem do movimento)
        targetColumnId, // toColumnId (destino do movimento)
        'on_enter',
        actions // Passar todas as ações, a função filtra internamente
      );

      // Filtrar ações de criação que requerem dados do usuário
      const actionsRequiringData = applicableActions.filter(
        action =>
          creationActions.includes(action.type) && action.config?.fieldMapping
      );

      // Se houver ações que requerem dados, mostrar modal para a primeira
      if (actionsRequiringData.length > 0) {
        const firstAction = actionsRequiringData[0];
        setPendingAction({
          action: firstAction,
          task,
          targetColumnId,
          targetPosition: newPosition,
        });
        setIsActionDataModalOpen(true);
        return; // Não mover ainda, aguardar confirmação do modal
      }

      // Se não houver ações que requerem dados, mover normalmente
      executeMoveTask(task, targetColumnId, newPosition);
    } catch (error: any) {
      console.error('❌ Erro ao verificar ações:', error);
      // Em caso de erro ao buscar ações, tentar mover normalmente
      executeMoveTask(task, targetColumnId, newPosition);
    }
  };

  // Função para mapear erros e navegar para detalhes da task quando necessário
  const handleMoveError = useCallback(
    (error: any, task: KanbanTask) => {
      console.log('🔍 [handleMoveError] Tratando erro:', {
        error,
        errorMessage: error.message,
        failedValidations: error.failedValidations,
        validationResults: error.validationResults,
        taskId: task.id,
        taskTitle: task.title,
      });

      // Verificar se há failedValidations (novo formato do backend)
      const hasFailedValidations =
        error.failedValidations && error.failedValidations.length > 0;

      // Verificar se é erro de validação com dados faltantes usando o novo formato
      const hasMissingData =
        hasFailedValidations &&
        error.failedValidations.some((failed: any) => {
          const type = failed.validationType?.toLowerCase();
          return (
            type === 'required_field' ||
            type === 'required_checklist' ||
            type === 'required_document' ||
            type === 'required_relationship'
          );
        });

      // Verificar também no formato antigo (compatibilidade)
      const hasMissingDataOldFormat = error.validationResults?.some(
        (result: any) =>
          result.passed === false &&
          (result.message?.toLowerCase().includes('faltante') ||
            result.message?.toLowerCase().includes('obrigatório') ||
            result.message?.toLowerCase().includes('required') ||
            result.message?.toLowerCase().includes('missing'))
      );

      // Verificar se a mensagem de erro indica dados faltantes
      const errorMessageLower = error.message?.toLowerCase() || '';
      const hasRequiredFieldError =
        errorMessageLower.includes('obrigatório') ||
        errorMessageLower.includes('required') ||
        errorMessageLower.includes('faltante') ||
        errorMessageLower.includes('missing') ||
        errorMessageLower.includes('relacionamento');

      console.log('🔍 [handleMoveError] Verificações:', {
        hasMissingData,
        hasMissingDataOldFormat,
        hasRequiredFieldError,
        errorMessageLower,
      });

      // Se houver dados faltantes, abrir modal de erro ao invés de navegar automaticamente
      if (hasMissingData || hasMissingDataOldFormat || hasRequiredFieldError) {
        console.log('✅ [handleMoveError] Abrindo modal de erro de validação');
        // Marcar erro como tratado para evitar que outros handlers o processem
        error._handled = true;
        error._isValidationError = true;
        error._skipGlobalHandlers = true;

        const params = new URLSearchParams();
        if (selectedTeam?.id) params.set('teamId', selectedTeam.id);
        if (selectedProjectId) params.set('projectId', selectedProjectId);
        if (isPersonalWorkspace) params.set('workspace', 'personal');

        const queryString = params.toString();
        // CORREÇÃO: Usar rota singular /kanban/task/:taskId (não /kanban/tasks/:taskId)
        const taskUrl = `/kanban/task/${task.id}${queryString ? `?${queryString}` : ''}`;

        // Usar mensagem específica do backend se disponível, senão usar mensagem genérica
        const errorMessage =
          error.message ||
          (hasFailedValidations && error.failedValidations[0]?.message) ||
          'Por favor, preencha os dados obrigatórios da tarefa para continuar.';

        // Abrir modal de erro ao invés de navegar automaticamente
        console.log('✅ [handleMoveError] Abrindo modal com:', {
          errorMessage,
          taskId: task.id,
          taskUrl,
          taskTitle: task.title,
        });

        setValidationErrorModal({
          isOpen: true,
          errorMessage,
          taskId: task.id,
          taskUrl,
          taskTitle: task.title,
        });

        // Retornar sem propagar o erro
        return;
      }

      // Se for erro de validação, exibir feedback (rollback já foi feito no hook)
      if (error.isValidationError || error.blocked || hasFailedValidations) {
        // Converter failedValidations para validationResults se necessário
        let validationResults = error.validationResults || [];
        if (hasFailedValidations && error.failedValidations) {
          // Converter failedValidations para o formato ValidationResult (doc §10: fieldName/customFieldId para destacar campo)
          const convertedResults = error.failedValidations.map(
            (failed: any) => ({
              validationId: failed.validationId,
              validationType: failed.validationType,
              passed: false,
              message: failed.message,
              details: failed.details || {},
              fieldName: failed.fieldName,
              customFieldId: failed.customFieldId ?? undefined,
            })
          );
          // Combinar com validationResults existentes (priorizar failedValidations)
          validationResults = [...convertedResults, ...validationResults];
        }

        setValidationFeedback({
          isOpen: true,
          validationResults,
          actionResults: error.actionResults || [],
          warnings: error.warnings || [],
          blocked: true,
        });
      } else {
        // Para outros erros, mostrar erro (rollback já foi feito no hook)
        console.error('❌ Erro ao mover tarefa:', error);
        // Usar mensagem específica do backend se disponível
        const errorMessage =
          error.message || 'Erro ao mover tarefa. A posição foi restaurada.';
        showError(errorMessage);
      }
    },
    [navigate, selectedTeam, selectedProjectId, isPersonalWorkspace]
  );

  // Função para executar a movimentação da tarefa
  const executeMoveTask = useCallback(
    (
      task: KanbanTask,
      targetColumnId: string,
      targetPosition: number,
      actionData?: Record<string, Record<string, any>>
    ) => {
      // Validar se os IDs são UUIDs válidos
      const isValidUUID = (id: string): boolean => {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          id
        );
      };

      // Validar fromColumnId
      if (!task.columnId || !isValidUUID(task.columnId)) {
        console.error('❌ fromColumnId inválido:', {
          columnId: task.columnId,
          taskId: task.id,
          taskTitle: task.title,
          isValid: task.columnId ? isValidUUID(task.columnId) : false,
        });
        showError(
          `Erro: ID da coluna de origem inválido. Por favor, recarregue a página.`
        );
        return;
      }

      // Validar targetColumnId
      if (!targetColumnId || !isValidUUID(targetColumnId)) {
        console.error('❌ targetColumnId inválido:', targetColumnId);
        showError(
          `Erro: ID da coluna de destino inválido. Por favor, recarregue a página.`
        );
        return;
      }

      // Validar taskId
      if (!task.id || !isValidUUID(task.id)) {
        console.error('❌ taskId inválido:', task.id);
        showError(
          `Erro: ID da tarefa inválido. Por favor, recarregue a página.`
        );
        return;
      }

      // Ativar loading
      setIsMovingTask(true);
      setMovingTaskId(task.id);

      if (moveTaskWithValidation) {
        moveTaskWithValidation({
          taskId: task.id,
          fromColumnId: task.columnId, // ⚠️ OBRIGATÓRIO: Coluna atual da tarefa (de onde está vindo)
          targetColumnId, // Coluna destino (para onde está indo)
          targetPosition, // Nova posição na coluna destino
          actionData,
        })
          .then(async (response: MoveTaskResponse) => {
            // Desativar loading
            setIsMovingTask(false);
            setMovingTaskId(null);

            // Recarregar valores das colunas após mover tarefa com sucesso
            // Usar setTimeout para garantir que o estado do board foi atualizado primeiro
            setTimeout(() => {
              console.log(
                '🔄 Recarregando valores das colunas após mover tarefa'
              );
              loadColumnValues();
            }, 100);

            // Só abrir o modal quando houver algo que exija atenção: falhas ou avisos.
            // Quando todas as validações passaram e não há avisos, não mostrar modal.
            const hasFailedValidations = response.validationResults?.some(
              (r: any) => r.passed === false
            );
            const hasWarnings =
              response.warnings && response.warnings.length > 0;
            if (hasFailedValidations || hasWarnings) {
              setValidationFeedback({
                isOpen: true,
                validationResults: response.validationResults || [],
                actionResults: response.actionResults || [],
                warnings: response.warnings || [],
                blocked: false,
              });
            }
          })
          .catch((error: any) => {
            // Desativar loading
            setIsMovingTask(false);
            setMovingTaskId(null);

            console.log('🔍 [executeMoveTask] Erro capturado:', {
              error,
              errorMessage: error.message,
              errorResponse: error.response?.data,
              errorData: error.response?.data || error,
            });

            // Tratar erro com mapeamento (não propagar o erro)
            try {
              // Se o erro vier do Axios, extrair a mensagem do response.data
              const errorToHandle = error.response?.data || error;
              handleMoveError(errorToHandle, task);
            } catch (handleError: any) {
              console.error(
                '❌ Erro ao tratar erro de movimentação:',
                handleError
              );
              // Não propagar o erro para evitar redirecionamentos indesejados
            }
          });
      } else {
        // Fallback para método antigo se moveTaskWithValidation não estiver disponível
        moveTask({
          taskId: task.id,
          sourceColumnId: task.columnId,
          sourcePosition: task.position,
          targetColumnId,
          targetPosition,
        })
          .then(() => {
            // Desativar loading
            setIsMovingTask(false);
            setMovingTaskId(null);
            // Recarregar valores das colunas após mover tarefa
            // Usar setTimeout para garantir que o estado do board foi atualizado primeiro
            setTimeout(() => {
              console.log(
                '🔄 Recarregando valores das colunas após mover tarefa (método antigo)'
              );
              loadColumnValues();
            }, 100);
          })
          .catch((error: any) => {
            // Desativar loading
            setIsMovingTask(false);
            setMovingTaskId(null);

            console.error('❌ Erro ao mover tarefa:', error);
            // Tratar erro com mapeamento (não propagar o erro)
            try {
              handleMoveError(error, task);
            } catch (handleError: any) {
              console.error(
                '❌ Erro ao tratar erro de movimentação:',
                handleError
              );
              // Não propagar o erro para evitar redirecionamentos indesejados
            }
          });
      }
    },
    [moveTaskWithValidation, moveTask, handleMoveError]
  );

  // Handler para confirmar dados da ação
  const handleActionDataConfirm = useCallback(
    async (data: Record<string, any>) => {
      if (!pendingAction) return;

      setIsActionDataModalOpen(false);

      // Preparar actionData no formato esperado pelo backend
      const actionData: Record<string, Record<string, any>> = {
        [pendingAction.action.id]: data,
      };

      // Executar movimentação com os dados fornecidos
      executeMoveTask(
        pendingAction.task,
        pendingAction.targetColumnId,
        pendingAction.targetPosition,
        actionData
      );

      // Limpar estado pendente
      setPendingAction(null);
    },
    [pendingAction, executeMoveTask]
  );

  // Handler para cancelar modal de ação
  const handleActionDataCancel = useCallback(() => {
    setIsActionDataModalOpen(false);
    setPendingAction(null);
  }, []);

  // Atualizar alertas sempre que as tarefas mudarem
  useEffect(() => {
    if (board.tasks && board.tasks.length > 0) {
      refreshAlerts(board.tasks);
    }
  }, [board.tasks, refreshAlerts]);

  // Se está carregando permissões ou equipes, mostrar shimmer
  if (permissionsLoading || teamsLoading) {
    return <KanbanShimmer columnCount={3} taskCountPerColumn={2} />;
  }

  // Se há erro ao carregar equipes, mostrar erro
  if (teamsError) {
    return (
      <KanbanContainer>
        <ErrorContainer>
          <ErrorTitle>Erro ao carregar equipes</ErrorTitle>
          <ErrorMessage>{teamsError}</ErrorMessage>
          <RetryButton onClick={() => window.location.reload()}>
            Tentar novamente
          </RetryButton>
        </ErrorContainer>
      </KanbanContainer>
    );
  }

  // Se não há equipes disponíveis, mostrar mensagem explicativa
  // IMPORTANTE: Só verificar após permissões carregarem
  // NÃO mostrar se for workspace pessoal (workspace pessoal não precisa de equipe)
  if (
    shouldLoadTeams &&
    !permissionsLoading &&
    teams.length === 0 &&
    !isPersonalWorkspace
  ) {
    return (
      <KanbanContainer>
        <NoTeamsMessage
          onCreateTeam={() => {
            navigate('/teams/create');
          }}
          onRequestAccess={() => {
            // TODO: Implementar modal de solicitação de acesso
          }}
          showRequestAccess={!canCreateTeams()}
          hasTeamPermission={hasPermission('team:view')}
          teamsError={teamsError}
          onRetry={reloadTeams}
        />
      </KanbanContainer>
    );
  }

  // Se não há equipe selecionada E as equipes já foram carregadas E não temos initialTeamId, mostrar overlay de seleção
  // NÃO mostrar se for workspace pessoal (workspace pessoal não precisa de equipe)
  if (
    !selectedTeam &&
    !teamsLoading &&
    teams.length > 0 &&
    !initialTeamId &&
    !isPersonalWorkspace
  ) {
    return (
      <TeamSelectionOverlay
        onTeamSelect={handleTeamSelect}
        selectedTeam={selectedTeam}
      />
    );
  }

  if (loading) {
    return <KanbanShimmer columnCount={4} taskCountPerColumn={3} />;
  }

  // Verificar se há projeto selecionado (considerar initialProjectId também)
  const hasProjectSelected = selectedProjectId || initialProjectId;

  // CORREÇÃO: Não mostrar erro se for MODULE_NOT_AVAILABLE (modal global cuida disso)
  if (error && error !== 'MODULE_NOT_AVAILABLE') {
    return (
      <KanbanContainer>
        <ErrorContainer>
          <ErrorTitle>Erro ao carregar quadro</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton
            onClick={() =>
              currentTeamId &&
              refresh(currentTeamId, hasProjectSelected || undefined)
            }
          >
            Tentar novamente
          </RetryButton>
        </ErrorContainer>
      </KanbanContainer>
    );
  }

  if (currentTeamId && !hasProjectSelected) {
    return (
      <KanbanContainer>
        <KanbanHeader>
          <KanbanTitleSection>
            <KanbanTitle>
              <MdDragIndicator size={24} />
              {projectData?.name || 'Funil de Vendas'}
            </KanbanTitle>
            {projectData?.description && (
              <KanbanProjectDescription>
                {projectData.description}
              </KanbanProjectDescription>
            )}
          </KanbanTitleSection>
          <KanbanActions></KanbanActions>
        </KanbanHeader>

        {/* Drawer de Filtros */}
        <KanbanFiltersDrawer
          isOpen={isFiltersDrawerOpen}
          onClose={() => setIsFiltersDrawerOpen(false)}
          filters={filters}
          filterOptions={filterOptions}
          filterOptionsLoading={filterOptionsLoading}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        <EmptyState>
          <EmptyTitle>Selecione um funil para começar</EmptyTitle>
          <EmptyMessage>
            Para usar o Kanban, você precisa selecionar ou criar um funil
            primeiro.
          </EmptyMessage>
        </EmptyState>
      </KanbanContainer>
    );
  }

  if (board.columns.length === 0) {
    return (
      <KanbanContainer>
        <KanbanHeader>
          <KanbanTitleSection>
            <KanbanTitle>
              <MdDragIndicator size={24} />
              {projectData?.name || 'Funil de Vendas'}
            </KanbanTitle>
            {projectData?.description && (
              <KanbanProjectDescription>
                {projectData.description}
              </KanbanProjectDescription>
            )}
            <TeamMembersSection>
              {/* TeamAvatars será implementado quando os dados da equipe estiverem disponíveis */}
            </TeamMembersSection>
          </KanbanTitleSection>
          <KanbanActions>
            <KanbanNotifications tasks={board.tasks} />

            {/* Botão de Filtros */}
            <SettingsButton
              onClick={() => setIsFiltersDrawerOpen(true)}
              title='Filtros do Kanban'
            >
              <MdFilterList size={20} />
            </SettingsButton>

            {permissions.canCreateColumns && (
              <AddColumnButton
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleAddColumn(e);
                }}
                onMouseDown={e => {
                  e.stopPropagation();
                }}
              >
                <MdAdd size={16} />
                Adicionar coluna
              </AddColumnButton>
            )}
          </KanbanActions>
        </KanbanHeader>

        <EmptyState>
          <EmptyTitle>Nenhuma coluna encontrada</EmptyTitle>
          <EmptyMessage>
            Comece criando sua primeira coluna para organizar suas tarefas.
          </EmptyMessage>
          {permissions.canCreateColumns && (
            <AddColumnButton onClick={e => handleAddColumn(e)}>
              <MdAdd size={16} />
              Criar primeira coluna
            </AddColumnButton>
          )}
        </EmptyState>
      </KanbanContainer>
    );
  }

  return (
    <KanbanContainer ref={kanbanContainerRef}>
      <KanbanHeader>
        <KanbanTitleSection>
          <KanbanTitle>
            <MdDragIndicator size={24} />
            {projectData?.name || 'Funil de Vendas'}
          </KanbanTitle>
          {projectData?.description && (
            <KanbanProjectDescription>
              {projectData.description}
            </KanbanProjectDescription>
          )}
        </KanbanTitleSection>
        <KanbanActions>
          <KanbanNotifications tasks={board.tasks} />

          {canViewMetrics() && (
            <SettingsButton
              onClick={() => navigate('/kanban/metrics')}
              title='Métricas e Analytics do Funil de Vendas'
            >
              <MdBarChart size={20} />
            </SettingsButton>
          )}
          {canViewMetrics() && (
            <SettingsButton
              onClick={() => {
                const params = new URLSearchParams();
                if (currentTeamId && !isPersonalWorkspace)
                  params.set('teamId', currentTeamId);
                if (selectedProjectId)
                  params.set('projectId', selectedProjectId);
                navigate(
                  `/kanban/insights${params.toString() ? `?${params.toString()}` : ''}`
                );
              }}
              title='Insights IA — resumo e prioridades do funil'
            >
              <MdAutoAwesome size={20} />
            </SettingsButton>
          )}
          {canManageColorRules() && (
            <SettingsButton
              onClick={handleOpenColorRules}
              title='Regras de Cor do Funil de Vendas'
            >
              <MdColorLens size={20} />
            </SettingsButton>
          )}
          {permissions.canCreateColumns && (
            <MoreMenuWrapper ref={moreMenuRef}>
              <SettingsButton
                onClick={() => setShowMoreMenu(prev => !prev)}
                title='Mais opções'
              >
                <MdMoreVert size={20} />
              </SettingsButton>
              <MoreDropdown $open={showMoreMenu}>
                <MoreMenuItem
                  onClick={e => {
                    e.preventDefault();
                    setShowMoreMenu(false);
                    handleAddColumn(e as any);
                  }}
                  disabled={localColumns.length >= 6}
                  title={
                    localColumns.length >= 6
                      ? 'Máximo de 6 colunas atingido'
                      : 'Adicionar nova coluna'
                  }
                >
                  <MdAdd size={16} />
                  Nova Coluna
                  {localColumns.length >= 6 && ' (6/6)'}
                </MoreMenuItem>
              </MoreDropdown>
            </MoreMenuWrapper>
          )}

          {/* Seletor de equipe compacto - só mostra se houver mais de 1 equipe */}
          {!isPersonalWorkspace && teams && teams.length > 1 && (
            <TeamSelectorCompact
              teams={teams}
              selectedTeam={selectedTeam}
              onTeamSelect={handleTeamSelect}
            />
          )}
        </KanbanActions>
      </KanbanHeader>

      {/* Filtro por responsável com avatares e botão de filtros */}
      {!isPersonalWorkspace && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <AssigneeFilter
            tasks={board.tasks}
            selectedAssigneeId={selectedAssigneeId}
            onAssigneeSelect={setSelectedAssigneeId}
          />
          <SettingsButton
            onClick={() => setIsFiltersDrawerOpen(true)}
            title='Filtros do Kanban'
          >
            <MdFilterList size={20} />
          </SettingsButton>
        </div>
      )}

      {/* Barra de busca com select de projeto ao lado */}
      {viewSettings?.showSearchBar !== false && (
        <SearchBar>
          <SearchInputWrapper>
            {isPersonalWorkspace && (
              <SettingsButton
                onClick={() => setIsFiltersDrawerOpen(true)}
                title='Filtros do Kanban'
              >
                <MdFilterList size={20} />
              </SettingsButton>
            )}
            <SearchInput
              type='text'
              placeholder={
                isPersonalWorkspace
                  ? 'Buscar tarefas por título ou descrição...'
                  : 'Buscar tarefas por título, descrição ou responsável...'
              }
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            {searchText && (
              <ClearSearchButton onClick={() => setSearchText('')}>
                <MdClose size={16} />
              </ClearSearchButton>
            )}
          </SearchInputWrapper>
          {onProjectChange && (
            <ProjectSelectWrapperInline>
              <ProjectSelect
                selectedProjectId={selectedProjectIdProp || selectedProjectId}
                onProjectChange={onProjectChange}
              />
            </ProjectSelectWrapperInline>
          )}
        </SearchBar>
      )}

      <NegotiationsCountBar>
        <NegotiationsCountValue>{filteredTasks.length}</NegotiationsCountValue>
        {filteredTasks.length === 1 ? 'Negociação' : 'Negociações'}
        {filteredTasks.length === 0 && board.tasks.length > 0 && (
          <span
            style={{
              marginLeft: 12,
              fontSize: '0.85rem',
              fontWeight: 'normal',
              color: 'var(--text-secondary, #666)',
            }}
          >
            Dica: use &quot;Sugeridos pela IA&quot; nos filtros para ver
            negociações que precisam de follow-up.
          </span>
        )}
      </NegotiationsCountBar>

      {/* Drawer de Filtros */}
      <KanbanFiltersDrawer
        isOpen={isFiltersDrawerOpen}
        onClose={() => setIsFiltersDrawerOpen(false)}
        filters={filters}
        filterOptions={filterOptions}
        filterOptionsLoading={filterOptionsLoading}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localColumns.map(col => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          <KanbanBoardWrapper
            ref={kanbanScrollRef}
            $hasManyColumns={localColumns.length >= 5}
            data-kanban-board='true'
          >
            <KanbanBoard
              $viewMode={viewSettings.viewMode}
              $zoomLevel={viewSettings.zoomLevel}
              $hasManyColumns={localColumns.length >= 5}
            >
              {localColumns
                .sort((a, b) => a.position - b.position)
                .map(column => {
                  const columnValue = columnValues.get(column.id);
                  // Debug: Log para verificar valores
                  if (import.meta.env.DEV) {
                    console.log(
                      `📊 Column ${column.name || column.title} (${column.id}): totalValue=${columnValue?.totalValue || 0}, columnValues.size=${columnValues.size}`
                    );
                  }
                  // Criar uma key única que inclui o valor para forçar re-render quando o valor mudar
                  const columnKey = `${column.id}-${columnValue?.totalValue || 0}`;
                  return (
                    <Column
                      key={columnKey}
                      column={column}
                      tasks={filteredTasks}
                      teamId={currentTeamId || board.teamId}
                      projectId={selectedProjectId}
                      onLoadMore={(columnId, opts) =>
                        loadMoreColumnTasks(
                          currentTeamId || board.teamId || '',
                          columnId,
                          {
                            projectId: selectedProjectId,
                            currentCount: opts.currentCount,
                            search: opts.search,
                          }
                        )
                      }
                      onSearchColumn={(columnId, opts) =>
                        searchColumnTasks(
                          currentTeamId || board.teamId || '',
                          columnId,
                          { projectId: selectedProjectId, search: opts.search }
                        )
                      }
                      perColumnPageSize={perColumnPageSize}
                      scrollMode={viewSettings.columnScrollMode}
                      isColumnLocked={lockedColumns.has(column.id)}
                      canViewAnalytics={canViewMetrics()}
                      taskInsightsMap={canViewMetrics() ? taskInsightsMap : undefined}
                      columnStuckCount={canViewMetrics() ? columnStuckCountMap.get(column.id) : undefined}
                      onOpenColumnInsights={
                        canViewMetrics()
                          ? col => {
                              const params = new URLSearchParams();
                              if (currentTeamId && !isPersonalWorkspace)
                                params.set('teamId', currentTeamId);
                              if (selectedProjectId)
                                params.set('projectId', selectedProjectId);
                              params.set('columnId', col.id);
                              if (col.title)
                                params.set('columnTitle', col.title);
                              navigate(`/kanban/insights?${params.toString()}`);
                            }
                          : undefined
                      }
                      onAddTask={columnId => {
                        const column = board.columns.find(
                          c => c.id === columnId
                        );

                        // Garantir que temos todos os dados necessários antes de navegar
                        // 1. Obter teamId: usar currentTeamId (já tem todos os fallbacks) ou buscar do estado salvo
                        let teamIdToUse: string | null = null;

                        // Prioridade: currentTeamId > selectedTeam > initialTeamId > projectTeamId > projectData > estado salvo
                        if (
                          currentTeamId &&
                          currentTeamId !== 'undefined' &&
                          currentTeamId !== 'null'
                        ) {
                          teamIdToUse = currentTeamId;
                        } else if (
                          selectedTeam?.id &&
                          selectedTeam.id !== 'undefined' &&
                          selectedTeam.id !== 'null'
                        ) {
                          teamIdToUse = selectedTeam.id;
                        } else if (
                          initialTeamId &&
                          initialTeamId !== 'undefined' &&
                          initialTeamId !== 'null'
                        ) {
                          teamIdToUse = initialTeamId;
                        } else if (
                          projectTeamId &&
                          projectTeamId !== 'undefined' &&
                          projectTeamId !== 'null'
                        ) {
                          teamIdToUse = projectTeamId;
                        } else if (
                          projectData?.teamId &&
                          projectData.teamId !== 'undefined' &&
                          projectData.teamId !== 'null'
                        ) {
                          teamIdToUse = projectData.teamId;
                        } else {
                          // Último recurso: buscar do estado salvo
                          const savedState = getKanbanState();
                          if (
                            savedState?.teamId &&
                            savedState.teamId !== 'undefined' &&
                            savedState.teamId !== 'null'
                          ) {
                            teamIdToUse = savedState.teamId;
                          }
                        }

                        // 2. Obter projectId: sempre deve existir no contexto do quadro
                        let projectIdToUse: string | null = null;

                        if (
                          selectedProjectId &&
                          selectedProjectId !== 'undefined' &&
                          selectedProjectId !== 'null'
                        ) {
                          projectIdToUse = selectedProjectId;
                        } else {
                          // Buscar do estado salvo se não tiver no contexto atual
                          const savedState = getKanbanState();
                          if (
                            savedState?.projectId &&
                            savedState.projectId !== 'undefined' &&
                            savedState.projectId !== 'null'
                          ) {
                            projectIdToUse = savedState.projectId;
                          }
                        }

                        // 3. Validar que temos os dados obrigatórios
                        if (!projectIdToUse) {
                          console.error(
                            '❌ Não é possível criar tarefa sem projectId'
                          );
                          showError(
                            'Selecione um funil antes de criar uma tarefa'
                          );
                          return;
                        }

                        if (
                          !columnId ||
                          columnId === 'undefined' ||
                          columnId === 'null'
                        ) {
                          console.error(
                            '❌ Não é possível criar tarefa sem columnId válido'
                          );
                          showError('Erro ao identificar a coluna');
                          return;
                        }

                        // 4. Salvar estado atual antes de navegar (garantir que está atualizado)
                        const user = getCurrentUser();
                        saveKanbanState({
                          projectId: projectIdToUse,
                          teamId: teamIdToUse,
                          workspace: isPersonalWorkspace
                            ? 'personal'
                            : undefined,
                          userId: user?.id || undefined,
                        });

                        // 5. Construir URL apenas com valores válidos (nunca undefined ou string "undefined")
                        const params = new URLSearchParams();

                        // Adicionar teamId apenas se for válido e não for workspace pessoal
                        if (teamIdToUse && !isPersonalWorkspace) {
                          params.append('teamId', teamIdToUse);
                        }

                        // Adicionar projectId (sempre válido neste ponto)
                        params.append('projectId', projectIdToUse);

                        // Adicionar columnId (sempre válido neste ponto)
                        params.append('columnId', columnId);

                        // Adicionar columnTitle se existir e for válido
                        if (
                          column?.title &&
                          column.title !== 'undefined' &&
                          column.title !== 'null'
                        ) {
                          params.append('columnTitle', column.title);
                        }

                        // Adicionar workspace se for pessoal
                        if (isPersonalWorkspace) {
                          params.append('workspace', 'personal');
                        }

                        // Navegar com URL válida
                        const finalUrl = `/kanban/create-task?${params.toString()}`;
                        navigate(finalUrl);
                      }}
                      onEditTask={task => {
                        // Navegar para página de detalhes da tarefa para edição
                        const params = new URLSearchParams();
                        if (selectedProjectId)
                          params.append('projectId', selectedProjectId);

                        const currentTeamId = isPersonalWorkspace
                          ? projectTeamId || initialTeamId || selectedTeam?.id
                          : selectedTeam?.id || initialTeamId;

                        if (currentTeamId) {
                          params.append('teamId', currentTeamId);
                        }

                        if (isPersonalWorkspace) {
                          params.append('workspace', 'personal');
                        }

                        navigate(
                          `/kanban/task/${task.id}?${params.toString()}`
                        );
                      }}
                      onDeleteTask={taskId => {
                        const task = board.tasks.find(t => t.id === taskId);
                        openModal('deleteTask', {
                          taskId,
                          taskTitle: task?.title,
                        });
                      }}
                      onTaskClick={handleTaskClick}
                      onEditColumn={handleEditColumn}
                      onDeleteColumn={handleDeleteColumn}
                      onConfigureValidations={handleConfigureValidations}
                      onConfigureActions={handleConfigureActions}
                      canCreateTasks={permissions.canCreateTasks}
                      canEditTasks={permissions.canEditTasks}
                      canDeleteTasks={permissions.canDeleteTasks}
                      canMoveTasks={permissions.canMoveTasks}
                      canEditColumns={permissions.canEditColumns}
                      canDeleteColumns={permissions.canDeleteColumns}
                      canManageValidationsActions={canManageValidationsActions()}
                      viewSettings={viewSettings}
                      settings={settings}
                      columnValue={columnValue}
                      onRefreshColumn={handleRefreshColumn}
                    />
                  );
                })}
            </KanbanBoard>
          </KanbanBoardWrapper>
        </SortableContext>

        <DragOverlay
          className='kanban-drag-overlay'
          style={
            {
              cursor: 'grabbing',
            } as React.CSSProperties
          }
        >
          {activeTask ? (
            <div
              style={
                {
                  transform: 'rotate(2deg) scale(1.05)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                  width: '280px',
                } as React.CSSProperties
              }
            >
              <Task
                task={activeTask}
                canEdit={permissions.canEditTasks}
                canDelete={permissions.canDeleteTasks}
                canMove={permissions.canMoveTasks}
                viewSettings={viewSettings}
                settings={settings}
              />
            </div>
          ) : null}
          {activeColumn ? (
            <Column
              column={activeColumn}
              tasks={filteredTasks}
              scrollMode={viewSettings.columnScrollMode}
              canCreateTasks={permissions.canCreateTasks}
              canEditTasks={permissions.canEditTasks}
              canDeleteTasks={permissions.canDeleteTasks}
              canMoveTasks={permissions.canMoveTasks}
              canEditColumns={permissions.canEditColumns}
              canDeleteColumns={permissions.canDeleteColumns}
              viewSettings={viewSettings}
              settings={settings}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modal de Edição de Coluna */}
      <EditColumnModal
        isOpen={isEditColumnModalOpen}
        onClose={() => {
          setIsEditColumnModalOpen(false);
          setEditingColumn(null);
        }}
        onSave={handleUpdateColumn}
        onDelete={handleDeleteColumn}
        column={editingColumn}
      />

      {/* Modal de Configuração de Validações */}
      <ColumnValidationsModal
        isOpen={isValidationsModalOpen}
        onClose={async () => {
          setIsValidationsModalOpen(false);
          setConfiguringColumn(null);
          // ✅ Invalidar cache e recarregar quando fechar o modal
          invalidateValidationsCache();
          if (currentTeamId && board.columns.length > 0) {
            const { validations, actions } =
              await fetchValidationsAndActions(true);
            const locked = new Set<string>();
            for (const column of board.columns) {
              const moveCheck = canMoveColumnWithRelations(
                column.id,
                board.columns,
                validations,
                actions
              );
              if (!moveCheck.canMove) {
                locked.add(column.id);
                if (moveCheck.relatedColumnId) {
                  locked.add(moveCheck.relatedColumnId);
                }
              }
            }
            setLockedColumns(locked);
          }
        }}
        column={configuringColumn}
        columns={localColumns.map(col => ({
          id: col.id,
          title: col.title,
          position: col.position,
        }))}
        projectId={selectedProjectId || undefined}
        teamId={currentTeamId || undefined}
        workspace={isPersonalWorkspace ? 'personal' : undefined}
      />

      {/* Modal de Configuração de Ações */}
      <ColumnActionsModal
        isOpen={isActionsModalOpen}
        onClose={async () => {
          setIsActionsModalOpen(false);
          setConfiguringColumn(null);
          // ✅ Invalidar cache e recarregar quando fechar o modal
          invalidateValidationsCache();
          // Recarregar dados para atualizar colunas bloqueadas
          if (currentTeamId && board.columns.length > 0) {
            const { validations, actions } =
              await fetchValidationsAndActions(true);
            const locked = new Set<string>();
            for (const column of board.columns) {
              const moveCheck = canMoveColumnWithRelations(
                column.id,
                board.columns,
                validations,
                actions
              );
              if (!moveCheck.canMove) {
                locked.add(column.id);
                if (moveCheck.relatedColumnId) {
                  locked.add(moveCheck.relatedColumnId);
                }
              }
            }
            setLockedColumns(locked);
          }
        }}
        column={configuringColumn}
        columns={localColumns.map(col => ({
          id: col.id,
          title: col.title,
          position: col.position,
        }))}
        projectId={selectedProjectId || undefined}
        teamId={currentTeamId || undefined}
        workspace={isPersonalWorkspace ? 'personal' : undefined}
      />

      {/* Modal de Detalhes da Tarefa removido - usando navegação para TaskDetailsPage */}

      {/* Controles de scroll vertical */}
      <ScrollControls
        containerRef={kanbanContainerRef as React.RefObject<HTMLDivElement>}
      />

      {/* Modal de Feedback de Validações e Ações */}
      <ValidationFeedbackModal
        isOpen={validationFeedback.isOpen}
        onClose={() =>
          setValidationFeedback({
            isOpen: false,
            validationResults: [],
            actionResults: [],
            warnings: [],
            blocked: false,
          })
        }
        validationResults={validationFeedback.validationResults}
        actionResults={validationFeedback.actionResults}
        warnings={validationFeedback.warnings}
        blocked={validationFeedback.blocked}
      />

      <ValidationErrorModal
        isOpen={validationErrorModal.isOpen}
        onClose={() =>
          setValidationErrorModal({
            isOpen: false,
            errorMessage: '',
            taskId: '',
            taskUrl: '',
            taskTitle: undefined,
          })
        }
        errorMessage={validationErrorModal.errorMessage}
        taskId={validationErrorModal.taskId}
        taskUrl={validationErrorModal.taskUrl}
        taskTitle={validationErrorModal.taskTitle}
      />

      {/* Loading Lottie durante movimentação */}
      {(isMovingTask || isReorderingColumns) && (
        <LottieLoading asOverlay={true} />
      )}

      {/* Modal para preencher dados de ações de criação */}
      {pendingAction && (
        <ActionDataFormModal
          isOpen={isActionDataModalOpen}
          onClose={handleActionDataCancel}
          onConfirm={handleActionDataConfirm}
          action={pendingAction.action}
          task={pendingAction.task}
        />
      )}
    </KanbanContainer>
  );
};

export default KanbanBoardComponent;
