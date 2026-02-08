import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { kanbanApi } from '../services/kanbanApi';
import { companyMembersApi } from '../services/companyMembersApi';
import { clientsApi } from '../services/clientsApi';
import { propertyApi } from '../services/propertyApi';
import { useAutoReloadOnCompanyChange } from './useCompanyMonitor';
import { kanbanSocketService } from '../services/kanbanSocketService';
import type {
  KanbanBoard,
  KanbanTask,
  CreateColumnDto,
  UpdateColumnDto,
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskDto,
  KanbanPermissions,
  KanbanFilters,
  KanbanFilterOptions,
} from '../types/kanban';

export const useKanban = () => {
  const [board, setBoard] = useState<KanbanBoard>({ columns: [], tasks: [] });
  const boardRef = useRef<KanbanBoard>(board);

  // Atualizar ref sempre que board mudar
  useEffect(() => {
    boardRef.current = board;
  }, [board]);
  const [filterOptions, setFilterOptions] = useState<KanbanFilterOptions>({
    users: [],
    priorities: [
      { value: 'low', label: 'Baixa', color: '#10B981' },
      { value: 'medium', label: 'Média', color: '#F59E0B' },
      { value: 'high', label: 'Alta', color: '#EF4444' },
      { value: 'urgent', label: 'Urgente', color: '#DC2626' },
    ],
    statuses: [
      { value: 'todo', label: 'A Fazer', color: '#6B7280' },
      { value: 'in-progress', label: 'Em Progresso', color: '#3B82F6' },
      { value: 'done', label: 'Concluído', color: '#10B981' },
    ],
    tags: [],
  });
  const [filters, setFilters] = useState<KanbanFilters>({});
  const filtersRef = useRef<KanbanFilters>({});
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [permissions, setPermissions] = useState<KanbanPermissions>({
    canCreateTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canMoveTasks: false,
    canCreateColumns: false,
    canEditColumns: false,
    canDeleteColumns: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /** Opções de filtro (users, clients, properties) carregam em background; true até concluir */
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(false);

  /** Deduplicação: evita chamadas duplicadas ao getBoard com os mesmos parâmetros */
  const fetchBoardInFlightRef = useRef<{
    key: string;
    promise: Promise<void>;
  } | null>(null);

  const fetchBoard = useCallback(
    async (
      teamId: string,
      projectId?: string,
      currentFilters?: KanbanFilters,
      options?: { columnIdOnly?: string }
    ) => {
      const isColumnOnlyRefresh = Boolean(options?.columnIdOnly);
      try {
        if (!isColumnOnlyRefresh) {
          setLoading(true);
          setError(null);
        }
        // console.log('🔄 Carregando quadro Kanban para equipe:', teamId, 'projeto:', projectId);

        // Validar teamId - mas permitir teamId especial para workspace pessoal
        if (!teamId || teamId === 'undefined' || teamId === 'null') {
          // Se for workspace pessoal (teamId começa com "personal"), permitir
          if (
            teamId &&
            (teamId.startsWith('personal') || teamId.includes('personal'))
          ) {
            // Permitir continuar para workspace pessoal
          } else {
            console.error('❌ ID da equipe é obrigatório');
            throw new Error('ID da equipe é obrigatório');
          }
        }

        // Usar filtros passados como parâmetro ou os filtros do ref (sempre atualizado)
        const effectiveFilters = currentFilters || filtersRef.current;

        // Atualização apenas de uma coluna: filtrar só essa coluna
        const columnIdOnly = options?.columnIdOnly;

        // Preparar filtros para enviar ao backend
        const filterParams: any = {
          projectId: projectId || selectedProjectId,
        };
        if (columnIdOnly) {
          filterParams.columnId = columnIdOnly;
        }

        // Converter filtros para formato da API
        // Filtros básicos
        if (effectiveFilters.isCompleted !== undefined) {
          filterParams.isCompleted = effectiveFilters.isCompleted;
        }
        if (effectiveFilters.priority) {
          filterParams.priority = effectiveFilters.priority;
        }
        if (effectiveFilters.assigneeId) {
          filterParams.assignedToId = effectiveFilters.assigneeId;
        }
        if (effectiveFilters.involvedUserId) {
          filterParams.involvedUserId = effectiveFilters.involvedUserId;
        }
        if (effectiveFilters.tags && effectiveFilters.tags.length > 0) {
          filterParams.tagIds = effectiveFilters.tags;
        }
        if (!columnIdOnly && effectiveFilters.columnId) {
          filterParams.columnId = effectiveFilters.columnId;
        }
        if (effectiveFilters.dueDateFrom) {
          filterParams.dueDateAfter = effectiveFilters.dueDateFrom
            .toISOString()
            .split('T')[0];
        }
        if (effectiveFilters.dueDateTo) {
          filterParams.dueDateBefore = effectiveFilters.dueDateTo
            .toISOString()
            .split('T')[0];
        }
        if (
          effectiveFilters.searchText &&
          effectiveFilters.searchText.length >= 3
        ) {
          filterParams.search = effectiveFilters.searchText;
        }
        if (effectiveFilters.createdById) {
          filterParams.createdById = effectiveFilters.createdById;
        }
        if (effectiveFilters.overdue !== undefined) {
          filterParams.overdue = effectiveFilters.overdue;
        }

        // Filtros de Status
        if (effectiveFilters.taskStatus) {
          filterParams.taskStatus = effectiveFilters.taskStatus;
        }
        if (effectiveFilters.validationStatus) {
          filterParams.validationStatus = effectiveFilters.validationStatus;
        }
        if (effectiveFilters.actionStatus) {
          filterParams.actionStatus = effectiveFilters.actionStatus;
        }

        // Filtros por Relacionamentos
        if (effectiveFilters.clientId) {
          filterParams.clientId = effectiveFilters.clientId;
        }
        if (
          effectiveFilters.clientIds &&
          effectiveFilters.clientIds.length > 0
        ) {
          filterParams.clientIds = effectiveFilters.clientIds;
        }
        if (effectiveFilters.propertyId) {
          filterParams.propertyId = effectiveFilters.propertyId;
        }
        if (
          effectiveFilters.propertyIds &&
          effectiveFilters.propertyIds.length > 0
        ) {
          filterParams.propertyIds = effectiveFilters.propertyIds;
        }
        if (effectiveFilters.documentId) {
          filterParams.documentId = effectiveFilters.documentId;
        }
        if (effectiveFilters.documentType) {
          filterParams.documentType = effectiveFilters.documentType;
        }
        if (effectiveFilters.hasDocuments !== undefined) {
          filterParams.hasDocuments = effectiveFilters.hasDocuments;
        }

        // Filtros por Validações e Ações
        if (effectiveFilters.validationType) {
          filterParams.validationType = effectiveFilters.validationType;
        }
        if (effectiveFilters.actionType) {
          filterParams.actionType = effectiveFilters.actionType;
        }
        if (effectiveFilters.hasFailedValidations !== undefined) {
          filterParams.hasFailedValidations =
            effectiveFilters.hasFailedValidations;
        }
        if (effectiveFilters.hasWarnings !== undefined) {
          filterParams.hasWarnings = effectiveFilters.hasWarnings;
        }
        if (effectiveFilters.hasPendingActions !== undefined) {
          filterParams.hasPendingActions = effectiveFilters.hasPendingActions;
        }

        // Filtros Avançados
        if (effectiveFilters.updatedFrom) {
          filterParams.updatedAfter = effectiveFilters.updatedFrom
            .toISOString()
            .split('T')[0];
        }
        if (effectiveFilters.updatedTo) {
          filterParams.updatedBefore = effectiveFilters.updatedTo
            .toISOString()
            .split('T')[0];
        }
        if (effectiveFilters.timeInColumn) {
          filterParams.timeInColumnDays = effectiveFilters.timeInColumn.days;
          filterParams.timeInColumnOperator =
            effectiveFilters.timeInColumn.operator;
        }
        if (effectiveFilters.minMovements !== undefined) {
          filterParams.minMovements = effectiveFilters.minMovements;
        }
        if (effectiveFilters.maxMovements !== undefined) {
          filterParams.maxMovements = effectiveFilters.maxMovements;
        }
        if (effectiveFilters.lastMovedAfter) {
          filterParams.lastMovedAfter = effectiveFilters.lastMovedAfter
            .toISOString()
            .split('T')[0];
        }
        if (effectiveFilters.lastMovedBefore) {
          filterParams.lastMovedBefore = effectiveFilters.lastMovedBefore
            .toISOString()
            .split('T')[0];
        }

        // Filtros de Campos Adicionais
        if (effectiveFilters.result) {
          filterParams.result = effectiveFilters.result;
        }
        if (effectiveFilters.qualification) {
          filterParams.qualification = effectiveFilters.qualification;
        }
        if (effectiveFilters.minTotalValue !== undefined) {
          filterParams.minTotalValue = effectiveFilters.minTotalValue;
        }
        if (effectiveFilters.maxTotalValue !== undefined) {
          filterParams.maxTotalValue = effectiveFilters.maxTotalValue;
        }
        if (effectiveFilters.closingForecastBefore) {
          filterParams.closingForecastBefore =
            effectiveFilters.closingForecastBefore.toISOString().split('T')[0];
        }
        if (effectiveFilters.closingForecastAfter) {
          filterParams.closingForecastAfter =
            effectiveFilters.closingForecastAfter.toISOString().split('T')[0];
        }
        if (effectiveFilters.source) {
          filterParams.source = effectiveFilters.source;
        }
        if (effectiveFilters.campaign) {
          filterParams.campaign = effectiveFilters.campaign;
        }
        if (effectiveFilters.preService) {
          filterParams.preService = effectiveFilters.preService;
        }
        if (effectiveFilters.vgc) {
          filterParams.vgc = effectiveFilters.vgc;
        }
        if (effectiveFilters.transferDateBefore) {
          filterParams.transferDateBefore = effectiveFilters.transferDateBefore
            .toISOString()
            .split('T')[0];
        }
        if (effectiveFilters.transferDateAfter) {
          filterParams.transferDateAfter = effectiveFilters.transferDateAfter
            .toISOString()
            .split('T')[0];
        }
        if (effectiveFilters.sector) {
          filterParams.sector = effectiveFilters.sector;
        }
        if (effectiveFilters.unassigned !== undefined) {
          filterParams.unassigned = effectiveFilters.unassigned;
        }
        if (effectiveFilters.noDueDate !== undefined) {
          filterParams.noDueDate = effectiveFilters.noDueDate;
        }

        // Verificar se há tarefas vencidas (fallback se não foi definido explicitamente)
        if (
          effectiveFilters.dueDateTo &&
          effectiveFilters.overdue === undefined
        ) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (effectiveFilters.dueDateTo < today) {
            filterParams.overdue = true;
          }
        }

        // Deduplicação: mesma requisição em flight → reutilizar promise (evita getBoard duplicado)
        const requestKey = `${teamId}|${projectId ?? ''}|${options?.columnIdOnly ?? ''}|${JSON.stringify(filterParams)}`;
        const inFlight = fetchBoardInFlightRef.current;
        if (inFlight?.key === requestKey) {
          return inFlight.promise;
        }

        const runRequest = async (): Promise<void> => {
          const boardData = await kanbanApi.getBoard(teamId, filterParams);

          // Se os filtros foram aplicados no backend, não precisamos filtrar novamente
          // Caso contrário, aplicar filtros locais como fallback
          // Garantir que involvedUsers está presente em todas as tarefas (mesmo que vazio)
          if (boardData.tasks) {
            boardData.tasks = boardData.tasks.map((task: any) => ({
              ...task,
              involvedUsers: task.involvedUsers || [],
            }));
          }

          if (columnIdOnly) {
            // Atualizar apenas as tarefas da coluna; manter o resto do board
            setBoard(prev => ({
              ...prev,
              tasks: [
                ...prev.tasks.filter(
                  (t: KanbanTask) => t.columnId !== columnIdOnly
                ),
                ...(boardData.tasks || []),
              ],
            }));
          } else {
            setBoard(boardData);
          }

          if (!columnIdOnly) {
            setPermissions(
              boardData.permissions || {
                canCreateTasks: false,
                canEditTasks: false,
                canDeleteTasks: false,
                canMoveTasks: false,
                canCreateColumns: false,
                canEditColumns: false,
                canDeleteColumns: false,
              }
            );

            // Opções que não dependem de API: preencher na hora para o drawer já poder mostrar
            setFilterOptions(prev => ({
              ...prev,
              columns: (boardData.columns || []).map((column: any) => ({
                id: column.id,
                title: column.title,
                color: column.color,
              })),
              documentTypes: [
                { value: 'contract', label: 'Contrato' },
                { value: 'proposal', label: 'Proposta' },
                { value: 'receipt', label: 'Recibo' },
                { value: 'invoice', label: 'Nota Fiscal' },
                { value: 'certificate', label: 'Certidão' },
                { value: 'other', label: 'Outro' },
              ],
              validationTypes: [
                { value: 'required_field', label: 'Campo Obrigatório' },
                { value: 'custom_validation', label: 'Validação Customizada' },
                { value: 'field_format', label: 'Formato de Campo' },
                { value: 'field_value', label: 'Valor de Campo' },
                { value: 'field_comparison', label: 'Comparação de Campos' },
              ],
              actionTypes: [
                { value: 'CREATE_PROPERTY', label: 'Criar Propriedade' },
                { value: 'CREATE_CLIENT', label: 'Criar Cliente' },
                { value: 'CREATE_DOCUMENT', label: 'Criar Documento' },
                { value: 'SEND_EMAIL', label: 'Enviar Email' },
                { value: 'SEND_NOTIFICATION', label: 'Enviar Notificação' },
                { value: 'ASSIGN_TASK', label: 'Atribuir Tarefa' },
                { value: 'ADD_TAG', label: 'Adicionar Tag' },
                { value: 'SET_PRIORITY', label: 'Definir Prioridade' },
              ],
            }));

            // Cards do funil já podem aparecer; filtros (users, clients, properties) carregam em background
            setFilterOptionsLoading(true);
            (async () => {
              try {
                const [membersRes, clientsRes, propertiesRes] =
                  await Promise.all([
                    companyMembersApi
                      .getMembers({ limit: 100 })
                      .catch(() => ({ data: [] })),
                    clientsApi
                      .getClients({ limit: 100 })
                      .then((r: any) => r)
                      .catch(() => []),
                    propertyApi
                      .getPropertiesForFilters(100)
                      .catch(() => ({ data: [] })),
                  ]);
                const membersData = membersRes?.data ?? [];
                const clientsData = Array.isArray(clientsRes)
                  ? clientsRes
                  : (clientsRes?.data ?? clientsRes?.items ?? []);
                const propertiesData = propertiesRes?.data ?? [];
                setFilterOptions(prev => ({
                  ...prev,
                  users: membersData.map((m: any) => ({
                    id: m.id,
                    name: m.name,
                    email: m.email,
                    avatar: m.avatar,
                  })),
                  clients: clientsData.map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    email: c.email,
                  })),
                  properties: propertiesData.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    address: p.address ?? '',
                  })),
                }));
              } catch (e) {
                console.warn(
                  '⚠️ Erro ao carregar opções de filtros em background:',
                  e
                );
              } finally {
                setFilterOptionsLoading(false);
              }
            })();
          }
        };

        const promise = runRequest();
        const wrapped = promise
          .catch((err: any) => {
            console.error('❌ Erro ao carregar quadro Kanban:', err);
            if (!isColumnOnlyRefresh) {
              if (err.isModuleNotAvailable) {
                setError('MODULE_NOT_AVAILABLE');
              } else {
                setError(err.message || 'Erro ao carregar quadro Kanban');
              }
            }
            throw err;
          })
          .finally(() => {
            if (!isColumnOnlyRefresh) setLoading(false);
            if (fetchBoardInFlightRef.current?.promise === wrapped)
              fetchBoardInFlightRef.current = null;
          });
        fetchBoardInFlightRef.current = { key: requestKey, promise: wrapped };
        return wrapped;
      } catch (err: any) {
        if (!isColumnOnlyRefresh) setLoading(false);
        throw err;
      }
    },
    [selectedProjectId]
  ); // Removido filters das dependências - usar filtersRef dentro

  /** Atualizar apenas as tarefas e dados de uma coluna (não recarrega a página inteira) */
  const refreshColumn = useCallback(
    async (
      teamId: string,
      projectId?: string,
      columnId?: string,
      currentFilters?: KanbanFilters
    ) => {
      if (!columnId) return;
      const filtersToUse =
        currentFilters !== undefined ? currentFilters : filtersRef.current;
      await fetchBoard(teamId, projectId, filtersToUse, {
        columnIdOnly: columnId,
      });
    },
    [fetchBoard]
  );

  // Aplicar filtros às tarefas
  const filteredTasks = useMemo(() => {
    // console.log('🔍 Filtros - Board tasks count:', board.tasks?.length || 0);
    // console.log('🔍 Filtros - Selected Project ID:', selectedProjectId);
    // console.log('🔍 Filtros - Board tasks:', board.tasks);
    if (!board.tasks || board.tasks.length === 0) {
      // console.log('🔍 Filtros - No tasks in board, returning empty array');
      return [];
    }

    const filtered = board.tasks.filter(task => {
      // Filtro por texto de busca
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDescription = task.description
          ?.toLowerCase()
          .includes(searchLower);
        if (!matchesTitle && !matchesDescription) return false;
      }

      // Filtro por responsável
      if (filters.assigneeId && task.assignedToId !== filters.assigneeId) {
        return false;
      }

      // Filtro por projeto - temporariamente desabilitado para debug
      if (selectedProjectId) {
        // Se a tarefa não tem projectId, considerar como válida (problema no backend)
        if (!task.projectId) {
          // console.log('⚠️ Tarefa sem projectId, permitindo:', task.id);
          // Se a tarefa não tem projectId, considere como válida por enquanto
          // Isso indica um problema no backend que precisa ser corrigido
        } else {
          if (selectedProjectId === 'none' && task.projectId) {
            // console.log('🔍 Filtro rejeita: projeto "none" mas tarefa tem projectId', task.id);
            return false;
          }
          if (
            selectedProjectId !== 'none' &&
            task.projectId !== selectedProjectId
          ) {
            // console.log('🔍 Filtro rejeita: projectId não coincide', task.id, task.projectId, selectedProjectId);
            return false;
          }
        }
      }

      // Filtro por prioridade
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      // Filtro por data de vencimento
      if (filters.dueDateFrom && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        if (dueDate < filters.dueDateFrom) return false;
      }

      if (filters.dueDateTo && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        if (dueDate > filters.dueDateTo) return false;
      }

      // Filtro por data de criação
      if (filters.createdFrom && task.createdAt) {
        const createdDate = new Date(task.createdAt);
        if (createdDate < filters.createdFrom) return false;
      }

      if (filters.createdTo && task.createdAt) {
        const createdDate = new Date(task.createdAt);
        if (createdDate > filters.createdTo) return false;
      }

      // Filtro por tags
      if (filters.tags && filters.tags.length > 0 && task.tags) {
        const hasMatchingTag = filters.tags.some(tagId =>
          task.tags!.includes(tagId)
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });

    // console.log('🔍 Filtros - Filtered tasks count:', filtered.length);
    // console.log('🔍 Filtros - Filtered tasks:', filtered);
    return filtered;
  }, [board.tasks, filters, selectedProjectId]);

  // Criar board filtrado
  const filteredBoard = useMemo(
    () => ({
      ...board,
      tasks: filteredTasks,
    }),
    [board, filteredTasks]
  );

  const handleFiltersChange = useCallback((newFilters: KanbanFilters) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const createColumn = useCallback(async (data: CreateColumnDto) => {
    try {
      const newColumn = await kanbanApi.createColumn(data);
      setBoard(prev => ({
        ...prev,
        columns: [...prev.columns, newColumn].sort(
          (a, b) => a.position - b.position
        ),
      }));
      return newColumn;
    } catch (err: any) {
      console.error('❌ Erro ao criar coluna:', err);
      throw err;
    }
  }, []);

  const updateColumn = useCallback(
    async (columnId: string, data: UpdateColumnDto) => {
      try {
        const updatedColumn = await kanbanApi.updateColumn(columnId, data);
        setBoard(prev => ({
          ...prev,
          columns: prev.columns
            .map(col => (col.id === columnId ? updatedColumn : col))
            .sort((a, b) => a.position - b.position),
        }));
        return updatedColumn;
      } catch (err: any) {
        console.error('❌ Erro ao atualizar coluna:', err);
        throw err;
      }
    },
    []
  );

  const deleteColumn = useCallback(async (columnId: string) => {
    try {
      await kanbanApi.deleteColumn(columnId);
      setBoard(prev => ({
        ...prev,
        columns: prev.columns.filter(col => col.id !== columnId),
        tasks: prev.tasks.filter(task => task.columnId !== columnId),
      }));
    } catch (err: any) {
      console.error('❌ Erro ao deletar coluna:', err);
      throw err;
    }
  }, []);

  const createTask = useCallback(
    async (data: CreateTaskDto, teamId: string, projectId?: string) => {
      try {
        // console.log('📋 useKanban: Criando tarefa no servidor:', data);
        const newTask = await kanbanApi.createTask(data);
        // console.log('✅ useKanban: Tarefa criada:', newTask);
        // Recarregar o board completo para atualizar a estrutura
        await fetchBoard(teamId, projectId);

        return newTask;
      } catch (err: any) {
        console.error('❌ useKanban: Erro ao criar tarefa:', err);
        throw err;
      }
    },
    [fetchBoard]
  );

  const updateTask = useCallback(
    async (taskId: string, data: UpdateTaskDto) => {
      if (import.meta.env.DEV) {
        console.log('🔄 useKanban - Atualizando tarefa:', { taskId, data });
      }
      // Optimistic update - salvar estado anterior
      const previousBoard = { ...board };

      // Atualizar localmente primeiro
      setBoard(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === taskId ? { ...task, ...data } : task
        ),
      }));

      try {
        const updatedTask = await kanbanApi.updateTask(taskId, data);
        if (import.meta.env.DEV) {
          console.log('✅ useKanban - Tarefa atualizada:', {
            taskId: updatedTask.id,
            title: updatedTask.title,
            involvedUsers: updatedTask.involvedUsers,
            involvedCount: updatedTask.involvedUsers?.length || 0,
          });
        }

        // Substituir com dados reais do servidor
        setBoard(prev => ({
          ...prev,
          tasks: prev.tasks.map(task =>
            task.id === taskId ? updatedTask : task
          ),
        }));

        if (import.meta.env.DEV) {
          console.log('🔄 useKanban - Board atualizado com nova tarefa');
        }

        return updatedTask;
      } catch (err: any) {
        console.error('❌ Erro ao atualizar tarefa, fazendo rollback:', err);

        // Rollback
        setBoard(previousBoard);
        throw err;
      }
    },
    [board]
  );

  const deleteTask = useCallback(async (taskId: string) => {
    // Optimistic update - remover imediatamente
    // Usar ref para ter acesso ao board atual sem depender dele no callback
    const currentBoard = boardRef.current;
    const taskToDelete = currentBoard.tasks.find(t => t.id === taskId);

    // Remover task imediatamente do estado
    setBoard(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId),
    }));

    try {
      await kanbanApi.deleteTask(taskId);
      // console.log('✅ Tarefa deletada');
    } catch (err: any) {
      console.error('❌ Erro ao deletar tarefa, fazendo rollback:', err);

      // Rollback - restaurar task se tivermos ela salva
      if (taskToDelete) {
        setBoard(prev => {
          // Verificar se a task já não está no board (evitar duplicatas)
          const taskExists = prev.tasks.some(t => t.id === taskToDelete.id);
          if (taskExists) {
            return prev;
          }

          // Restaurar task na posição original
          const originalIndex = currentBoard.tasks.findIndex(
            t => t.id === taskToDelete.id
          );
          const newTasks = [...prev.tasks];

          if (originalIndex >= 0 && originalIndex < currentBoard.tasks.length) {
            // Inserir na posição original
            newTasks.splice(originalIndex, 0, taskToDelete);
          } else {
            // Se não conseguir determinar a posição, adicionar no final
            newTasks.push(taskToDelete);
          }

          return {
            ...prev,
            tasks: newTasks,
          };
        });
      }
      throw err;
    }
  }, []);

  const moveTask = useCallback(
    async (data: MoveTaskDto) => {
      // Salvar estado anterior para rollback
      const previousBoard = board;

      try {
        // Atualizar estado localmente primeiro para melhor UX
        setBoard(prev => {
          const { taskId, targetColumnId, targetPosition } = data;

          return {
            ...prev,
            tasks: prev.tasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  columnId: targetColumnId,
                  position: targetPosition,
                };
              }
              return task;
            }),
          };
        });

        // Tentar mover no backend (usando API antiga para compatibilidade)
        await kanbanApi.moveTask(data);
        // console.log('✅ Tarefa movida com sucesso');
      } catch (err: any) {
        console.error('❌ Erro ao mover tarefa, fazendo rollback:', err);

        // Rollback: restaurar estado anterior
        setBoard(previousBoard);

        // Mostrar erro para o usuário
        throw new Error('Falha ao mover tarefa. A posição foi restaurada.');
      }
    },
    [board]
  );

  // Nova função para mover tarefa com validações e ações
  const moveTaskWithValidation = useCallback(
    async (data: {
      taskId: string;
      fromColumnId: string; // ⚠️ OBRIGATÓRIO: ID da coluna de origem (de onde está vindo)
      targetColumnId: string; // ID da coluna de destino (para onde está indo)
      targetPosition: number; // Nova posição na coluna destino
      skipValidations?: boolean;
      skipActions?: boolean;
      actionData?: Record<string, Record<string, any>>;
    }) => {
      // Salvar estado anterior para rollback
      const previousBoard = board;

      // Optimistic update: atualizar UI imediatamente
      setBoard(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => {
          if (t.id === data.taskId) {
            return {
              ...t,
              columnId: data.targetColumnId,
              position: data.targetPosition,
            };
          }
          return t;
        }),
      }));

      try {
        // Tentar mover no backend com validações
        const response = await kanbanApi.moveTaskWithValidation(data);

        // Se foi bloqueado, fazer rollback e lançar erro
        if (response.blocked || response.failedValidations?.length > 0) {
          setBoard(previousBoard);
          throw {
            ...response,
            isValidationError: true,
            blocked: true,
            _skipGlobalHandlers: true,
            _isValidationError: true,
            _handled: true,
          };
        }

        // Atualizar com dados reais do servidor
        setBoard(prev => ({
          ...prev,
          tasks: prev.tasks.map(t => {
            if (t.id === data.taskId) {
              return {
                ...t,
                ...(response.task || {}),
              };
            }
            return t;
          }),
        }));

        return response;
      } catch (err: any) {
        console.error('❌ Erro ao mover tarefa com validações:', err);

        // Fazer rollback para qualquer erro
        setBoard(previousBoard);

        // Se for erro de validação, preservar flags para evitar redirecionamentos
        if (
          err.isValidationError ||
          err._isValidationError ||
          err.failedValidations ||
          err.blocked
        ) {
          throw {
            ...err,
            isValidationError: true,
            blocked: err.blocked || true,
            _skipGlobalHandlers: true,
            _isValidationError: true,
            _handled: true,
          };
        }

        // Para outros erros, lançar normalmente
        throw err;
      }
    },
    [board]
  );

  // Atualizar ref quando filters mudar
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const refresh = useCallback(
    (teamId: string, projectId?: string, currentFilters?: KanbanFilters) => {
      // fetchBoard já inclui os filtros atuais
      // Usar currentFilters se fornecido, senão usar filtersRef (sempre atualizado)
      const filtersToUse =
        currentFilters !== undefined ? currentFilters : filtersRef.current;
      fetchBoard(teamId, projectId, filtersToUse);
    },
    [fetchBoard] // Sem dependência de filters para evitar loop
  );

  // Função estável para limpar dados do kanban (sem dependências para evitar loop)
  const clearKanbanData = useCallback(() => {
    setBoard({ columns: [], tasks: [] });
    setFilters({});
    setSelectedProjectId(null);
    setError(null);
    // console.log('🧹 Dados do Kanban limpos após mudança de empresa');
  }, []); // Sem dependências para evitar loop

  // Monitorar mudanças de empresa e limpar dados do kanban automaticamente
  useAutoReloadOnCompanyChange(clearKanbanData);

  // Recarregar board quando filtros mudarem (com debounce)
  useEffect(() => {
    // Não recarregar automaticamente para evitar loops
    // Os filtros serão enviados na próxima chamada de fetchBoard
    // Esta função está aqui apenas para manter a estrutura caso seja necessário no futuro
  }, [filters]);

  useEffect(() => {
    const handleTaskUpdated = (updatedTask: KanbanTask) => {
      setBoard(prev => {
        if (!prev) {
          return prev;
        }

        const tasksWithoutUpdated = prev.tasks.filter(
          task => task.id !== updatedTask.id
        );
        const nextTasks = [...tasksWithoutUpdated, updatedTask].sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0)
        );

        return {
          ...prev,
          tasks: nextTasks,
        };
      });
    };

    kanbanSocketService.on('task_updated', handleTaskUpdated);

    return () => {
      kanbanSocketService.off('task_updated', handleTaskUpdated);
    };
  }, []);

  return {
    board: filteredBoard,
    originalBoard: board,
    filters,
    filterOptions,
    filterOptionsLoading,
    permissions,
    loading,
    error,
    selectedProjectId,
    setSelectedProjectId,
    createColumn,
    updateColumn,
    deleteColumn,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    moveTaskWithValidation,
    refresh,
    refreshColumn,
    handleFiltersChange,
    handleClearFilters,
  };
};
