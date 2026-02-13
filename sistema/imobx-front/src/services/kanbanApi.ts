'use client';
import { api } from './api';
import type {
  KanbanBoard,
  KanbanColumn,
  KanbanTask,
  KanbanTaskClient,
  KanbanTaskProperty,
  BoardPermissionPayload,
  BoardPermissionItem,
  CreateColumnDto,
  UpdateColumnDto,
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskDto,
  KanbanTaskComment,
  MarkResultDto,
  UpdateTaskFieldsDto,
  TaskHistoryEntry,
  TransferTaskDto,
  TaskTransferResponse,
  TaskTransferHistory,
} from '../types/kanban';

class KanbanApiService {
  private baseUrl = '/kanban';

  async getBoard(
    teamId: string,
    options?: {
      projectId?: string;
      isCompleted?: boolean;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      assignedToId?: string;
      tagIds?: string[];
      columnId?: string;
      dueDateBefore?: string;
      dueDateAfter?: string;
      overdue?: boolean;
      search?: string;
      createdById?: string;
      // Novos filtros
      taskStatus?:
        | 'pending'
        | 'in_progress'
        | 'completed'
        | 'blocked'
        | 'cancelled'
        | 'on_hold';
      validationStatus?: 'valid' | 'invalid' | 'pending_validation' | 'warning';
      actionStatus?: 'action_pending' | 'action_completed' | 'action_failed';
      clientId?: string;
      clientIds?: string[];
      propertyId?: string;
      propertyIds?: string[];
      documentId?: string;
      documentType?: string;
      hasDocuments?: boolean;
      validationType?: string;
      actionType?: string;
      hasFailedValidations?: boolean;
      hasWarnings?: boolean;
      hasPendingActions?: boolean;
      updatedAfter?: string;
      updatedBefore?: string;
      timeInColumnDays?: number;
      timeInColumnOperator?: 'more_than' | 'less_than';
      minMovements?: number;
      maxMovements?: number;
      lastMovedAfter?: string;
      lastMovedBefore?: string;
      minScore?: number;
      maxScore?: number;
      // Filtros de Campos Adicionais
      result?: 'won' | 'lost' | 'open' | 'cancelled';
      qualification?: string;
      minTotalValue?: number;
      maxTotalValue?: number;
      closingForecastBefore?: string;
      closingForecastAfter?: string;
      source?: string;
      campaign?: string;
      preService?: string;
      vgc?: string;
      transferDateBefore?: string;
      transferDateAfter?: string;
      sector?: string;
      unassigned?: boolean;
      noDueDate?: boolean;
      involvedUserId?: string;
      /** Limite de cards por coluna no carregamento inicial (paginação por coluna). Ex: 20 */
      perColumnLimit?: number;
    }
  ): Promise<KanbanBoard> {
    try {
      // console.log('📋 Buscando quadro Kanban para equipe:', teamId, 'opções:', options);
      // Validar teamId - mas permitir teamId especial para workspace pessoal
      if (!teamId || teamId === 'undefined' || teamId === 'null') {
        // Se for workspace pessoal (teamId começa com "personal"), permitir
        if (
          teamId &&
          (teamId.startsWith('personal') || teamId.includes('personal'))
        ) {
          // Permitir continuar para workspace pessoal
        } else {
          throw new Error('ID da equipe é obrigatório');
        }
      }

      const params: Record<string, any> = {};

      if (options) {
        // Filtros básicos
        if (options.projectId) params.projectId = options.projectId;
        if (options.isCompleted !== undefined)
          params.isCompleted = options.isCompleted;
        if (options.priority) params.priority = options.priority;
        if (options.assignedToId) params.assignedToId = options.assignedToId;
        if (options.tagIds && options.tagIds.length > 0)
          params.tagIds = options.tagIds.join(',');
        if (options.columnId) params.columnId = options.columnId;
        if (options.dueDateBefore) params.dueDateBefore = options.dueDateBefore;
        if (options.dueDateAfter) params.dueDateAfter = options.dueDateAfter;
        if (options.overdue !== undefined) params.overdue = options.overdue;
        if (options.search) params.search = options.search;
        if (options.createdById) params.createdById = options.createdById;

        // Filtros de Status
        if (options.taskStatus) params.taskStatus = options.taskStatus;
        if (options.validationStatus)
          params.validationStatus = options.validationStatus;
        if (options.actionStatus) params.actionStatus = options.actionStatus;

        // Filtros por Relacionamentos
        if (options.clientId) params.clientId = options.clientId;
        if (options.clientIds && options.clientIds.length > 0)
          params.clientIds = options.clientIds.join(',');
        if (options.propertyId) params.propertyId = options.propertyId;
        if (options.propertyIds && options.propertyIds.length > 0)
          params.propertyIds = options.propertyIds.join(',');
        if (options.documentId) params.documentId = options.documentId;
        if (options.documentType) params.documentType = options.documentType;
        if (options.hasDocuments !== undefined)
          params.hasDocuments = options.hasDocuments;

        // Filtros por Validações e Ações
        if (options.validationType)
          params.validationType = options.validationType;
        if (options.actionType) params.actionType = options.actionType;
        if (options.hasFailedValidations !== undefined)
          params.hasFailedValidations = options.hasFailedValidations;
        if (options.hasWarnings !== undefined)
          params.hasWarnings = options.hasWarnings;
        if (options.hasPendingActions !== undefined)
          params.hasPendingActions = options.hasPendingActions;

        // Filtros Avançados
        if (options.updatedAfter) params.updatedAfter = options.updatedAfter;
        if (options.updatedBefore) params.updatedBefore = options.updatedBefore;
        if (options.timeInColumnDays !== undefined)
          params.timeInColumnDays = options.timeInColumnDays;
        if (options.timeInColumnOperator)
          params.timeInColumnOperator = options.timeInColumnOperator;
        if (options.minMovements !== undefined)
          params.minMovements = options.minMovements;
        if (options.maxMovements !== undefined)
          params.maxMovements = options.maxMovements;
        if (options.lastMovedAfter)
          params.lastMovedAfter = options.lastMovedAfter;
        if (options.lastMovedBefore)
          params.lastMovedBefore = options.lastMovedBefore;

        // Filtros por Score (Lead Scoring)
        if (options.minScore !== undefined) params.minScore = options.minScore;
        if (options.maxScore !== undefined) params.maxScore = options.maxScore;

        // Filtros de Campos Adicionais
        if (options.result) params.result = options.result;
        if (options.qualification) params.qualification = options.qualification;
        if (options.minTotalValue !== undefined)
          params.minTotalValue = options.minTotalValue;
        if (options.maxTotalValue !== undefined)
          params.maxTotalValue = options.maxTotalValue;
        if (options.closingForecastBefore)
          params.closingForecastBefore = options.closingForecastBefore;
        if (options.closingForecastAfter)
          params.closingForecastAfter = options.closingForecastAfter;
        if (options.source) params.source = options.source;
        if (options.campaign) params.campaign = options.campaign;
        if (options.preService) params.preService = options.preService;
        if (options.vgc) params.vgc = options.vgc;
        if (options.transferDateBefore)
          params.transferDateBefore = options.transferDateBefore;
        if (options.transferDateAfter)
          params.transferDateAfter = options.transferDateAfter;
        if (options.sector) params.sector = options.sector;
        if (options.unassigned !== undefined)
          params.unassigned = options.unassigned;
        if (options.noDueDate !== undefined)
          params.noDueDate = options.noDueDate;
        if (options.involvedUserId)
          params.involvedUserId = options.involvedUserId;
        if (options.perColumnLimit != null)
          params.perColumnLimit = options.perColumnLimit;
      }

      const response = await api.get(`${this.baseUrl}/board/${teamId}`, {
        params,
        timeout: 60000, // 60s para quadros grandes (paginação no backend reduz carga)
      });
      if (import.meta.env.DEV) {
        console.log('✅ kanbanApi - Quadro Kanban obtido:', {
          teamId,
          columnsCount: response.data.columns?.length || 0,
          tasksCount: response.data.tasks?.length || 0,
        });
      }

      // Mapear a resposta da API para o formato esperado pelo frontend
      const apiData = response.data;

      // Verificar pessoas envolvidas nas tarefas
      const tasksWithInvolvedUsersCount =
        apiData.tasks?.filter(
          (t: any) => t.involvedUsers && t.involvedUsers.length > 0
        ) || [];
      if (import.meta.env.DEV) {
        console.log('👥 kanbanApi - Tarefas com pessoas envolvidas:', {
          total: tasksWithInvolvedUsersCount.length,
          tasks: tasksWithInvolvedUsersCount.map((t: any) => ({
            id: t.id,
            title: t.title,
            involvedUsers: t.involvedUsers,
            involvedCount: t.involvedUsers?.length || 0,
          })),
        });
      }

      // Verificar todas as tarefas para ver se têm involvedUsers
      if (import.meta.env.DEV && apiData.tasks && apiData.tasks.length > 0) {
        console.log('🔍 kanbanApi - Verificando todas as tarefas:', {
          totalTasks: apiData.tasks.length,
          tasksWithInvolvedUsers: tasksWithInvolvedUsersCount.length,
          sampleTask: {
            id: apiData.tasks[0].id,
            title: apiData.tasks[0].title,
            hasInvolvedUsers: !!apiData.tasks[0].involvedUsers,
            involvedUsers: apiData.tasks[0].involvedUsers,
            involvedCount: apiData.tasks[0].involvedUsers?.length || 0,
          },
        });
      }

      // Garantir que todas as tarefas tenham o campo involvedUsers (mesmo que vazio)
      // e preservar o campo color que vem do backend
      const tasksWithInvolvedUsers = (apiData.tasks || []).map((task: any) => ({
        ...task,
        involvedUsers: task.involvedUsers || [],
        // Preservar campo color se existir (calculado pelo backend baseado nas regras de cor)
        color: task.color || undefined,
      }));

      if (import.meta.env.DEV) {
        const tasksWithColor = tasksWithInvolvedUsers.filter(
          (t: any) => t.color
        );
        if (tasksWithColor.length > 0) {
          console.log('🎨 kanbanApi - Tarefas com cor aplicada:', {
            total: tasksWithColor.length,
            tasks: tasksWithColor.map((t: any) => ({
              id: t.id,
              title: t.title,
              color: t.color,
              updatedAt: t.updatedAt,
            })),
          });
        }
      }

      // Preservar totalTaskCount e totalValue por coluna (evita contador e valor aumentarem ao "Carregar mais")
      const columnsWithTotal = (apiData.columns || []).map((col: any) => ({
        ...col,
        totalTaskCount:
          typeof col.totalTaskCount === 'number'
            ? col.totalTaskCount
            : typeof (col as any).total_task_count === 'number'
              ? (col as any).total_task_count
              : undefined,
        totalValue:
          typeof col.totalValue === 'number'
            ? col.totalValue
            : typeof (col as any).total_value === 'number'
              ? (col as any).total_value
              : undefined,
      }));

      const mappedBoard = {
        columns: columnsWithTotal,
        tasks: tasksWithInvolvedUsers,
        permissions: apiData.permissions || {
          canCreateTasks: false,
          canEditTasks: false,
          canDeleteTasks: false,
          canMoveTasks: false,
          canCreateColumns: false,
          canEditColumns: false,
          canDeleteColumns: false,
        },
      };

      if (import.meta.env.DEV) {
        console.log('📦 kanbanApi - Board mapeado:', {
          columnsCount: mappedBoard.columns.length,
          tasksCount: mappedBoard.tasks.length,
          tasksWithInvolvedUsers: mappedBoard.tasks.filter(
            (t: any) => t.involvedUsers && t.involvedUsers.length > 0
          ).length,
          sampleTaskInvolvedUsers: mappedBoard.tasks[0]?.involvedUsers || [],
        });
      }

      return mappedBoard;
    } catch (error: any) {
      console.error('❌ Erro ao buscar quadro Kanban:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Lista funis (boards) que o usuário pode acessar na empresa, com permissões resolvidas (paginado).
   * Permissões específicas por funil sobrepõem as globais.
   */
  async getMyBoards(params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    data: Array<{
      teamId: string;
      team: { id: string; name: string; color: string };
      permissions: {
        canCreateColumns: boolean;
        canEditColumns: boolean;
        canDeleteColumns: boolean;
        canCreateTasks: boolean;
        canEditTasks: boolean;
        canDeleteTasks: boolean;
        canMoveTasks: boolean;
        canManageUsers?: boolean;
      };
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await api.get(`${this.baseUrl}/my-boards`, {
      params: { page: params?.page, limit: params?.limit },
    });
    return (
      response.data ?? {
        data: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      }
    );
  }

  /**
   * Lista permissões por funil (por usuário) para um board.
   * Usado na tela de configuração de permissões do Kanban.
   */
  async getBoardPermissionsByTeam(teamId: string): Promise<BoardPermissionItem[]> {
    const response = await api.get(
      `${this.baseUrl}/board-permissions/team/${teamId}`
    );
    return response.data ?? [];
  }

  /**
   * Define permissão de um usuário em um funil específico.
   * Só visualizar = canView true e demais false.
   */
  async setBoardPermission(
    teamId: string,
    userId: string,
    payload: BoardPermissionPayload
  ): Promise<unknown> {
    const response = await api.put(
      `${this.baseUrl}/board-permissions/team/${teamId}/user/${userId}`,
      payload
    );
    return response.data;
  }

  /**
   * Remove permissão específica do funil (usuário volta a usar permissões globais).
   */
  async deleteBoardPermission(permissionId: string): Promise<void> {
    await api.delete(`${this.baseUrl}/board-permissions/${permissionId}`);
  }

  /**
   * Busca tarefas de uma coluna com paginação e busca (para "Carregar mais" e busca na coluna).
   */
  async getColumnTasks(
    teamId: string,
    columnId: string,
    params?: {
      projectId?: string;
      page?: number;
      limit?: number;
      search?: string;
    }
  ): Promise<{
    data: KanbanTask[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const query: Record<string, string | number> = { teamId };
      if (params?.projectId) query.projectId = params.projectId;
      if (params?.page != null) query.page = params.page;
      if (params?.limit != null) query.limit = params.limit;
      if (params?.search != null && params.search.trim())
        query.search = params.search.trim();

      const response = await api.get(
        `${this.baseUrl}/columns/${columnId}/tasks`,
        { params: query }
      );
      const data = (response.data.data || []).map((task: any) => ({
        ...task,
        involvedUsers: task.involvedUsers || [],
      }));
      return {
        data,
        total: response.data.total ?? 0,
        page: response.data.page ?? 1,
        limit: response.data.limit ?? 20,
        totalPages: response.data.totalPages ?? 1,
      };
    } catch (error: any) {
      console.error('❌ Erro ao buscar tarefas da coluna:', error);
      throw this.handleError(error);
    }
  }

  async getColumns(): Promise<KanbanColumn[]> {
    try {
      // console.log('📋 Buscando colunas...');
      const response = await api.get(`${this.baseUrl}/columns`);
      // console.log('✅ Colunas obtidas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar colunas:', error);
      throw this.handleError(error);
    }
  }

  async getTasks(): Promise<KanbanTask[]> {
    try {
      // console.log('📋 Buscando tarefas...');
      const response = await api.get(`${this.baseUrl}/tasks`);
      // console.log('✅ Tarefas obtidas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar tarefas:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Busca uma tarefa pelo ID (sem precisar de teamId/projectId).
   * Útil para abrir detalhes da tarefa a partir de um link direto.
   */
  async getTaskById(taskId: string): Promise<KanbanTask> {
    try {
      const response = await api.get<KanbanTask>(
        `${this.baseUrl}/tasks/${taskId}/fields`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar tarefa por ID:', error);
      throw this.handleError(error);
    }
  }

  async createColumn(data: CreateColumnDto): Promise<KanbanColumn> {
    try {
      // console.log('➕ Criando coluna:', data);
      const response = await api.post(`${this.baseUrl}/columns`, data);
      // console.log('✅ Coluna criada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar coluna:', error);
      throw this.handleError(error);
    }
  }

  async updateColumn(
    columnId: string,
    data: UpdateColumnDto
  ): Promise<KanbanColumn> {
    try {
      // console.log('✏️ Atualizando coluna:', columnId, data);
      const response = await api.put(
        `${this.baseUrl}/columns/${columnId}`,
        data
      );
      // console.log('✅ Coluna atualizada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar coluna:', error);
      throw this.handleError(error);
    }
  }

  async deleteColumn(columnId: string): Promise<void> {
    try {
      // console.log('🗑️ Excluindo coluna:', columnId);
      await api.delete(`${this.baseUrl}/columns/${columnId}`);
      // console.log('✅ Coluna excluída');
    } catch (error: any) {
      console.error('❌ Erro ao excluir coluna:', error);
      throw this.handleError(error);
    }
  }

  async reorderColumns(
    teamId: string,
    columnIds: string[],
    projectId?: string
  ): Promise<void> {
    try {
      if (import.meta.env.DEV) {
        console.log('🔄 [kanbanApi.reorderColumns] Recebido:', {
          teamId,
          columnIds,
          columnIdsLength: columnIds.length,
          projectId,
        });
        console.log(
          '🔄 [kanbanApi.reorderColumns] Array completo de IDs:',
          columnIds
        );
        console.log(
          '🔄 [kanbanApi.reorderColumns] Body que será enviado:',
          JSON.stringify({ columnIds, projectId }, null, 2)
        );
      }

      const requestBody = { columnIds, projectId };

      await api.post(`${this.baseUrl}/columns/reorder/${teamId}`, requestBody);
      if (import.meta.env.DEV) {
        console.log(
          '✅ [kanbanApi.reorderColumns] Colunas reordenadas com sucesso'
        );
      }
    } catch (error: any) {
      console.error(
        '❌ [kanbanApi.reorderColumns] Erro ao reordenar colunas:',
        error
      );
      throw this.handleError(error);
    }
  }

  async createTask(data: CreateTaskDto): Promise<KanbanTask> {
    try {
      // console.log('➕ kanbanApi: Criando tarefa:', data);
      // console.log('➕ kanbanApi: URL:', `${this.baseUrl}/tasks`);
      const response = await api.post(`${this.baseUrl}/tasks`, data);
      // console.log('✅ kanbanApi: Tarefa criada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ kanbanApi: Erro ao criar tarefa:', error);
      console.error('❌ kanbanApi: Response:', error.response?.data);
      console.error('❌ kanbanApi: Status:', error.response?.status);
      throw this.handleError(error);
    }
  }

  async updateTask(taskId: string, data: UpdateTaskDto): Promise<KanbanTask> {
    try {
      // console.log('✏️ Atualizando tarefa:', taskId, data);
      const response = await api.put(`${this.baseUrl}/tasks/${taskId}`, data);
      // console.log('✅ Tarefa atualizada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar tarefa:', error);
      throw this.handleError(error);
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      // console.log('🗑️ Excluindo tarefa:', taskId);
      await api.delete(`${this.baseUrl}/tasks/${taskId}`);
      // console.log('✅ Tarefa excluída');
    } catch (error: any) {
      console.error('❌ Erro ao excluir tarefa:', error);
      throw this.handleError(error);
    }
  }

  async moveTask(data: MoveTaskDto): Promise<void> {
    try {
      // console.log('🔄 Movendo tarefa:', data);
      await api.post(`${this.baseUrl}/tasks/move`, {
        taskId: data.taskId,
        targetColumnId: data.targetColumnId,
        targetPosition: data.targetPosition,
      });
      // console.log('✅ Tarefa movida');
    } catch (error: any) {
      console.error('❌ Erro ao mover tarefa:', error);
      throw this.handleError(error);
    }
  }

  // Método novo que usa a API com validações e ações
  async moveTaskWithValidation(data: {
    taskId: string;
    fromColumnId: string; // ⚠️ OBRIGATÓRIO: ID da coluna de origem (de onde está vindo)
    targetColumnId: string; // ID da coluna de destino (para onde está indo)
    targetPosition: number; // Nova posição na coluna destino
    skipValidations?: boolean;
    skipActions?: boolean;
    actionData?: Record<string, Record<string, any>>;
  }): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/tasks/move`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao mover tarefa:', error);

      // Se for erro de validação (400), retornar dados do erro sem passar pelo handleError
      // Isso evita que o interceptor de erro redirecione para dashboard
      if (error.response?.status === 400 && error.response?.data) {
        const validationError: any = {
          ...error.response.data,
          isValidationError: true,
          blocked: error.response.data.blocked || true,
          _skipGlobalHandlers: true,
          _isValidationError: true,
          _handled: true,
          response: error.response, // Preservar response original
          config: error.config, // Preservar config original
        };

        // Marcar no objeto de erro original também para o interceptor
        error._skipGlobalHandlers = true;
        error._isValidationError = true;
        error._handled = true;

        // Preservar também no validationError para garantir
        Object.defineProperty(validationError, '_skipGlobalHandlers', {
          value: true,
          writable: false,
          enumerable: true,
        });
        Object.defineProperty(validationError, '_isValidationError', {
          value: true,
          writable: false,
          enumerable: true,
        });
        Object.defineProperty(validationError, '_handled', {
          value: true,
          writable: false,
          enumerable: true,
        });

        throw validationError;
      }

      throw this.handleError(error);
    }
  }

  async getTaskHistory(taskId: string): Promise<TaskHistoryEntry[]> {
    try {
      // console.log('📋 Buscando histórico da tarefa:', taskId);
      const response = await api.get<TaskHistoryEntry[]>(
        `${this.baseUrl}/tasks/${taskId}/history`
      );
      // console.log('✅ Histórico obtido:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar histórico:', error);
      throw this.handleError(error);
    }
  }

  async getAvailableTags(teamId: string): Promise<string[]> {
    try {
      const response = await api.get(`${this.baseUrl}/tags/${teamId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar tags:', error);
      throw this.handleError(error);
    }
  }

  /** Tags da equipe (id, name, color) para uso em selects. */
  async getTeamTags(
    teamId: string
  ): Promise<{ id: string; name: string; color: string }[]> {
    try {
      const response = await api.get(`${this.baseUrl}/tags/${teamId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      return [];
    }
  }

  async getTaskComments(taskId: string): Promise<KanbanTaskComment[]> {
    try {
      const response = await api.get(
        `${this.baseUrl}/tasks/${taskId}/comments`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar comentários da tarefa:', error);
      throw this.handleError(error);
    }
  }

  async createTaskComment(
    taskId: string,
    formData: FormData
  ): Promise<KanbanTaskComment> {
    try {
      const response = await api.post(
        `${this.baseUrl}/tasks/${taskId}/comments`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar comentário da tarefa:', error);
      throw this.handleError(error);
    }
  }

  async deleteTaskComment(taskId: string, commentId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/tasks/${taskId}/comments/${commentId}`);
    } catch (error: any) {
      console.error('❌ Erro ao remover comentário da tarefa:', error);
      throw this.handleError(error);
    }
  }

  async getProjectMembers(
    projectId: string,
    options?: { page?: number; limit?: number }
  ): Promise<
    Array<{
      id: string;
      role: 'member' | 'leader';
      isActive: boolean;
      createdAt: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }>
  > {
    try {
      const params: Record<string, number> = {};
      if (options?.page != null) params.page = options.page;
      if (options?.limit != null) params.limit = options.limit;
      const response = await api.get(`/kanban/projects/${projectId}/members`, {
        params: Object.keys(params).length ? params : undefined,
      });
      const body = response.data;
      return Array.isArray(body) ? body : body?.data ?? [];
    } catch (error: any) {
      console.error('❌ Erro ao buscar membros do projeto:', error);
      throw this.handleError(error);
    }
  }

  // ============================================
  // Resultados e Campos Adicionais
  // ============================================

  async markTaskResult(
    taskId: string,
    data: MarkResultDto
  ): Promise<KanbanTask> {
    try {
      const response = await api.post(
        `${this.baseUrl}/tasks/${taskId}/mark-result`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao marcar resultado da tarefa:', error);
      throw this.handleError(error);
    }
  }

  async updateTaskFields(
    taskId: string,
    data: {
      qualification?: string;
      totalValue?: number;
      closingForecast?: string;
      source?: string;
      campaign?: string;
      preService?: string;
      vgc?: string;
      transferDate?: string;
      sector?: string;
      customFields?: { [key: string]: any };
    }
  ): Promise<KanbanTask> {
    try {
      const response = await api.put(
        `${this.baseUrl}/tasks/${taskId}/fields`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar campos da tarefa:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Adicionar pessoa envolvida a uma tarefa
   */
  async addInvolvedUser(taskId: string, userId: string): Promise<KanbanTask> {
    if (import.meta.env.DEV) {
      console.log('📡 kanbanApi - Adicionando pessoa envolvida:', {
        taskId,
        userId,
      });
    }
    try {
      const response = await api.post(
        `${this.baseUrl}/tasks/${taskId}/involved-users/${userId}`
      );
      if (import.meta.env.DEV) {
        console.log('✅ kanbanApi - Pessoa envolvida adicionada:', {
          taskId: response.data.id,
          involvedUsers: response.data.involvedUsers,
          count: response.data.involvedUsers?.length || 0,
        });
      }
      return response.data;
    } catch (error: any) {
      console.error(
        '❌ kanbanApi - Erro ao adicionar pessoa envolvida:',
        error
      );
      throw this.handleError(error);
    }
  }

  /**
   * Remover pessoa envolvida de uma tarefa
   */
  async removeInvolvedUser(
    taskId: string,
    userId: string
  ): Promise<KanbanTask> {
    if (import.meta.env.DEV) {
      console.log('📡 kanbanApi - Removendo pessoa envolvida:', {
        taskId,
        userId,
      });
    }
    try {
      const response = await api.delete(
        `${this.baseUrl}/tasks/${taskId}/involved-users/${userId}`
      );
      if (import.meta.env.DEV) {
        console.log('✅ kanbanApi - Pessoa envolvida removida:', {
          taskId: response.data.id,
          involvedUsers: response.data.involvedUsers,
          count: response.data.involvedUsers?.length || 0,
        });
      }
      return response.data;
    } catch (error: any) {
      console.error('❌ kanbanApi - Erro ao remover pessoa envolvida:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Definir lista completa de pessoas envolvidas
   */
  async setInvolvedUsers(
    taskId: string,
    userIds: string[]
  ): Promise<KanbanTask> {
    if (import.meta.env.DEV) {
      console.log('📡 kanbanApi - Definindo pessoas envolvidas:', {
        taskId,
        userIds,
        count: userIds.length,
        url: `${this.baseUrl}/tasks/${taskId}/involved-users`,
      });
    }
    try {
      const response = await api.put(
        `${this.baseUrl}/tasks/${taskId}/involved-users`,
        { userIds }
      );
      if (import.meta.env.DEV) {
        console.log('✅ kanbanApi - Pessoas envolvidas definidas:', {
          taskId: response.data.id,
          involvedUsers: response.data.involvedUsers,
          count: response.data.involvedUsers?.length || 0,
          userIds: response.data.involvedUsers?.map((u: any) => u.id),
        });
      }
      return response.data;
    } catch (error: any) {
      console.error('❌ kanbanApi - Erro ao definir pessoas envolvidas:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw this.handleError(error);
    }
  }

  /**
   * Lista clientes disponíveis para vincular a tarefas do projeto
   * @param projectId ID do projeto Kanban (não usado, mantido para compatibilidade)
   * @param search Termo de busca (nome, email ou telefone)
   */
  async getProjectClients(
    projectId: string,
    search?: string
  ): Promise<KanbanTaskClient[]> {
    try {
      const params: Record<string, string> = {};
      if (search) {
        params.search = search;
      }
      // Usar endpoint geral de clientes, já que o endpoint específico do projeto não existe
      const response = await api.get('/clients', { params });
      const clients = response.data?.data || response.data || [];

      // Mapear para o formato KanbanTaskClient
      return clients.map((client: any) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        type: client.type,
        status: client.status,
        responsibleUserId: client.responsibleUserId,
        responsibleUser: client.responsibleUser,
      }));
    } catch (error: any) {
      console.error('❌ Erro ao buscar clientes do projeto:', error);
      // Retornar array vazio em caso de erro para não quebrar a aplicação
      return [];
    }
  }

  /**
   * Lista imóveis disponíveis para vincular a tarefas do projeto
   * @param projectId ID do projeto Kanban (não usado, mantido para compatibilidade)
   * @param search Termo de busca (título, código ou endereço)
   */
  async getProjectProperties(
    projectId: string,
    search?: string
  ): Promise<KanbanTaskProperty[]> {
    try {
      const params: Record<string, string> = {};
      if (search) {
        params.search = search;
      }
      // Usar endpoint geral de propriedades, já que o endpoint específico do projeto não existe
      const response = await api.get('/properties', { params });
      const properties = response.data?.data || response.data || [];

      // Mapear para o formato KanbanTaskProperty
      return properties.map((property: any) => ({
        id: property.id,
        title: property.title || property.name,
        code: property.code,
        address: property.address,
        city: property.city,
        state: property.state,
        price: property.price,
        type: property.type,
        status: property.status,
        responsibleUserId: property.responsibleUserId,
        responsibleUser: property.responsibleUser,
      }));
    } catch (error: any) {
      console.error('❌ Erro ao buscar imóveis do projeto:', error);
      // Retornar array vazio em caso de erro para não quebrar a aplicação
      return [];
    }
  }

  /**
   * Upload de arquivos na tarefa
   * @param taskId ID da tarefa
   * @param files Array de arquivos para upload (máximo 10, 5MB cada)
   */
  async uploadTaskAttachments(
    taskId: string,
    files: File[]
  ): Promise<KanbanTask> {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await api.post(
        `${this.baseUrl}/tasks/${taskId}/attachments`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao fazer upload de anexos:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Lista anexos da tarefa
   * @param taskId ID da tarefa
   */
  async getTaskAttachments(taskId: string): Promise<Attachment[]> {
    try {
      const response = await api.get(
        `${this.baseUrl}/tasks/${taskId}/attachments`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar anexos da tarefa:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remove um anexo da tarefa
   * @param taskId ID da tarefa
   * @param attachmentKey Chave do anexo no S3
   */
  async removeTaskAttachment(
    taskId: string,
    attachmentKey: string
  ): Promise<KanbanTask> {
    try {
      const response = await api.delete(
        `${this.baseUrl}/tasks/${taskId}/attachments/${encodeURIComponent(attachmentKey)}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao remover anexo:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Transferir tarefa para outro projeto
   */
  async transferTask(
    taskId: string,
    data: TransferTaskDto
  ): Promise<TaskTransferResponse> {
    try {
      const response = await api.post(
        `${this.baseUrl}/tasks/${taskId}/transfer`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao transferir tarefa:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter histórico de transferências de uma tarefa
   */
  async getTransferHistory(taskId: string): Promise<TaskTransferHistory[]> {
    try {
      const response = await api.get(
        `${this.baseUrl}/tasks/${taskId}/transfer-history`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao obter histórico de transferências:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    if (error.message) {
      return new Error(error.message);
    }

    return new Error('Erro interno do servidor');
  }
}

export const kanbanApi = new KanbanApiService();
