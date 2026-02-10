import type { Attachment } from './attachment';

export interface KanbanColumn {
  id: string;
  title: string;
  description?: string;
  color?: string;
  position: number;
  isActive: boolean;
  teamId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaces para Cliente e Imóvel vinculados às tarefas
export interface KanbanTaskClient {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  secondaryPhone?: string | null;
  cpf?: string | null;
  type?: string | null; // buyer, seller, renter, lessor, investor, general
  status?: string | null; // active, inactive, contacted, interested, closed
  city?: string | null;
  responsibleUserName?: string | null;
  createdAt?: Date | null;
}

export interface KanbanTaskProperty {
  id: string;
  title: string;
  code?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  neighborhood?: string | null;
  type?: string | null; // house, apartment, commercial, land, rural
  status?: string | null; // available, rented, sold, maintenance, draft
  salePrice?: number | null;
  rentPrice?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parkingSpaces?: number | null;
  totalArea?: number | null;
  builtArea?: number | null;
  responsibleUserName?: string | null;
  createdAt?: Date | null;
}

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  position: number;
  priority?: string;
  isCompleted: boolean;
  assignedToId?: string;
  createdById: string;
  dueDate?: Date;
  projectId?: string;
  /** ID da equipe (retornado ao buscar tarefa por ID; permite abrir detalhes sem contexto do funil) */
  teamId?: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdBy?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  project?: KanbanProject;
  tags?: string[];
  comments?: KanbanTaskComment[];
  commentsCount?: number;
  attachmentsCount?: number;
  // Sub-tarefas
  subtasks?: KanbanSubTask[];
  // Resultado
  result?: 'won' | 'lost';
  resultDate?: string;
  resultById?: string;
  resultNotes?: string;
  lossReason?: LossReason;
  // Campos adicionais
  qualification?: string;
  totalValue?: number;
  closingForecast?: string;
  source?: string;
  campaign?: string;
  preService?: string;
  vgc?: string;
  transferDate?: string;
  sector?: string;
  customFields?: {
    [key: string]: any;
  };
  // Pessoas envolvidas
  involvedUsers?: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
  // Cliente e Imóvel vinculados
  clientId?: string | null;
  client?: KanbanTaskClient | null;
  propertyId?: string | null;
  property?: KanbanTaskProperty | null;
  // Anexos da tarefa
  attachments?: Attachment[];
  // Cor calculada baseada nas regras de cor
  color?: string;
  // ID da tarefa original se esta foi transferida/duplicada
  originalTaskId?: string;
  // Dados de origem (importação de outro CRM/funil)
  externalId?: string | null;
  lastActivityAt?: string | null;
  contactSnapshot?: Array<{
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  }> | null;
  productSnapshot?: unknown[] | null;
  externalCustomFields?: Record<string, unknown> | null;
  enrichedFromSource?: boolean;
  /** Histórico da negociação no sistema de origem (ex.: RD Station) */
  sourceHistory?: Array<{
    at?: string;
    userName?: string;
    text?: string;
    type?: string;
  }> | null;
}

export interface KanbanBoard {
  columns: KanbanColumn[];
  tasks: KanbanTask[];
  projects?: KanbanProject[];
  permissions?: KanbanPermissions;
}

export interface CreateColumnDto {
  title: string;
  description?: string;
  color?: string;
  teamId: string;
}

export interface UpdateColumnDto {
  title?: string;
  description?: string;
  color?: string;
  position?: number;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  columnId: string;
  position?: number;
  priority?: string;
  assignedToId?: string;
  dueDate?: Date;
  projectId?: string;
  totalValue?: number;
  clientId?: string | null;
  propertyId?: string | null;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  columnId?: string;
  position?: number;
  priority?: string;
  assignedToId?: string;
  dueDate?: Date;
  projectId?: string;
  tags?: string[];
  clientId?: string | null;
  propertyId?: string | null;
}

export interface KanbanTaskComment {
  id: string;
  taskId: string;
  userId: string;
  message: string;
  attachments: Attachment[];
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateKanbanTaskCommentDto {
  message: string;
  attachments?: Attachment[];
}

export interface MoveTaskDto {
  taskId: string;
  sourceColumnId: string;
  targetColumnId: string;
  sourcePosition: number;
  targetPosition: number;
}

export interface KanbanPermissions {
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canMoveTasks: boolean;
  canCreateColumns: boolean;
  canEditColumns: boolean;
  canDeleteColumns: boolean;
}

// Interfaces para filtros
export interface KanbanFilters {
  // Filtros básicos
  searchText?: string;
  assigneeId?: string;
  involvedUserId?: string;
  priority?: string;
  status?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  createdFrom?: Date;
  createdTo?: Date;
  updatedFrom?: Date;
  updatedTo?: Date;
  tags?: string[];
  isCompleted?: boolean;
  columnId?: string;
  createdById?: string;
  overdue?: boolean;

  // Filtros de Status
  taskStatus?:
    | 'pending'
    | 'in_progress'
    | 'completed'
    | 'blocked'
    | 'cancelled'
    | 'on_hold';
  validationStatus?: 'valid' | 'invalid' | 'pending_validation' | 'warning';
  actionStatus?: 'action_pending' | 'action_completed' | 'action_failed';

  // Filtros por Relacionamentos
  clientId?: string;
  clientIds?: string[]; // Múltiplos clientes
  propertyId?: string;
  propertyIds?: string[]; // Múltiplas propriedades
  documentId?: string;
  documentType?: string;
  hasDocuments?: boolean;

  // Filtros por Validações e Ações
  validationType?: string;
  actionType?: string;
  hasFailedValidations?: boolean;
  hasWarnings?: boolean;
  hasPendingActions?: boolean;

  // Filtros Avançados
  timeInColumn?: {
    operator: 'more_than' | 'less_than';
    days: number;
  };
  minMovements?: number;
  maxMovements?: number;
  lastMovedAfter?: Date;
  lastMovedBefore?: Date;

  // Filtros de Campos Adicionais
  result?: 'won' | 'lost' | 'open' | 'cancelled';
  qualification?: string;
  minTotalValue?: number;
  maxTotalValue?: number;
  closingForecastBefore?: Date;
  closingForecastAfter?: Date;
  source?: string;
  campaign?: string;
  preService?: string;
  vgc?: string;
  transferDateBefore?: Date;
  transferDateAfter?: Date;
  sector?: string;
  unassigned?: boolean;
  noDueDate?: boolean;

  // Filtros Combinados (para implementação futura)
  operator?: 'AND' | 'OR';
  savedFilterId?: string;
}

export interface KanbanFilterOptions {
  users: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
  priorities: Array<{
    value: string;
    label: string;
    color: string;
  }>;
  statuses: Array<{
    value: string;
    label: string;
    color: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  columns?: Array<{
    id: string;
    title: string;
    color?: string;
  }>;
  clients?: Array<{
    id: string;
    name: string;
    email?: string;
  }>;
  properties?: Array<{
    id: string;
    title: string;
    address?: string;
  }>;
  documentTypes?: Array<{
    value: string;
    label: string;
  }>;
  validationTypes?: Array<{
    value: string;
    label: string;
  }>;
  actionTypes?: Array<{
    value: string;
    label: string;
  }>;
}

// Interfaces para configurações
export interface KanbanSettings {
  // Tags e Prioridades
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  priorities: Array<{
    value: string;
    label: string;
    color: string;
  }>;

  // Configurações Visuais
  theme: 'light' | 'dark' | 'auto';
  cardDensity: 'compact' | 'normal' | 'comfortable';
  showTaskCount: boolean;
  showAssigneeAvatars: boolean;
  showPriorityIndicators: boolean;
  showDueDateIndicators: boolean;
  defaultColumnColors: string[];

  // Configurações de Comportamento
  autoSave: boolean;
  autoSaveInterval: number; // em segundos
  allowTaskReordering: boolean;
  allowTaskDuplication: boolean;
  allowTaskArchiving: boolean;
  autoArchiveCompleted: boolean;
  autoArchiveAfterDays: number;

  // Configurações de Notificações
  enableNotifications: boolean;
  notifyOnTaskAssignment: boolean;
  notifyOnDueDateApproaching: boolean;
  notifyOnDueDateOverdue: boolean;
  dueDateWarningDays: number;

  // Configurações de Colunas
  allowColumnCreation: boolean;
  allowColumnDeletion: boolean;
  allowColumnReordering: boolean;
  maxColumnsPerBoard: number;
  defaultColumnLimit: number;

  // Configurações de Tarefas
  defaultTaskPriority: 'low' | 'medium' | 'high' | 'urgent';
  requireTaskDescription: boolean;
  allowTaskComments: boolean;
  allowTaskAttachments: boolean;
  maxTaskTitleLength: number;
  maxTaskDescriptionLength: number;

  // Configurações de Filtros
  enableAdvancedFilters: boolean;
  saveFilterPresets: boolean;
  defaultFilterView: 'all' | 'my-tasks' | 'overdue' | 'completed';

  // Configurações de Exportação
  allowExport: boolean;
  exportFormats: ('pdf' | 'excel' | 'csv')[];
  includeCompletedTasks: boolean;
  includeTaskHistory: boolean;

  // Configurações de Integração
  enableWebhooks: boolean;
  webhookUrl?: string;
  syncWithCalendar: boolean;
  calendarProvider?: 'google' | 'outlook' | 'apple';

  // Configurações de Performance
  enableVirtualization: boolean;
  maxTasksPerColumn: number;
  enableLazyLoading: boolean;
  cacheExpirationTime: number; // em minutos
}

// Interfaces para projetos
export interface KanbanProject {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived' | 'cancelled';
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  completedById?: string;
  teamId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  taskCount: number;
  completedTaskCount?: number;
  tasks?: KanbanTask[];
  isPersonal?: boolean; // Indica se é um projeto pessoal (workspace)
  progress?: number; // Progresso do projeto em %
  createdBy?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  completedBy?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface CreateKanbanProjectDto {
  name: string;
  description?: string;
  teamId: string;
  startDate?: string;
  dueDate?: string;
}

export interface UpdateKanbanProjectDto {
  name?: string;
  description?: string;
  status?: 'active' | 'completed' | 'archived' | 'cancelled';
  startDate?: string;
  dueDate?: string;
}

export interface KanbanProjectResponseDto {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived' | 'cancelled';
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  completedById?: string;
  teamId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  taskCount: number;
  completedTaskCount?: number;
  tasks: KanbanTask[];
  isPersonal?: boolean; // Indica se é um projeto pessoal (workspace)
  progress?: number; // Progresso do projeto em %
}

export interface ProjectFiltersDto {
  page?: string;
  limit?: string;
  search?: string;
  status?: 'active' | 'completed' | 'archived' | 'cancelled';
  createdById?: string;
  completedById?: string;
  dateRange?: string;
}

export interface PaginatedKanbanProjectsResponseDto {
  data: KanbanProjectResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interfaces para alertas de prazo
export interface DeadlineAlert {
  id: string;
  taskId: string;
  taskTitle: string;
  dueDate: Date;
  type: 'overdue' | 'approaching' | 'today';
  isRead: boolean;
  createdAt: Date;
}

// ============================================
// Sub-tarefas
// ============================================

export interface KanbanSubTask {
  id: string;
  title: string;
  description?: string;
  position: number;
  isCompleted: boolean;
  dueDate?: string;
  completedAt?: string;
  assignedToId?: string;
  taskId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdBy?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface CreateSubTaskDto {
  title: string;
  description?: string;
  assignedToId?: string;
  dueDate?: string;
  position?: number;
}

export interface UpdateSubTaskDto {
  title?: string;
  description?: string;
  assignedToId?: string;
  dueDate?: string;
  isCompleted?: boolean;
  position?: number;
}

export interface ReorderSubTasksDto {
  subTaskIds: string[];
}

// ============================================
// Campos Personalizados
// ============================================

/**
 * Tipos de campos personalizados aceitos pelo sistema.
 *
 * IMPORTANTE: O valor 'multi_select' deve usar underscore (não 'multiselect').
 * Todos os valores abaixo são os únicos aceitos pelo backend.
 *
 * Valores válidos:
 * - 'text'
 * - 'number'
 * - 'date'
 * - 'datetime'
 * - 'select'
 * - 'multi_select' (com underscore - NÃO usar 'multiselect')
 * - 'checkbox'
 * - 'url'
 * - 'email'
 * - 'phone'
 * - 'currency'
 * - 'percentage'
 * - 'user'
 * - 'client'
 * - 'property'
 */
export const CustomFieldType = {
  TEXT: 'text',
  NUMBER: 'number',
  CURRENCY: 'currency',
  PERCENTAGE: 'percentage',
  DATE: 'date',
  DATETIME: 'datetime',
  SELECT: 'select',
  MULTISELECT: 'multi_select', // ⚠️ IMPORTANTE: usar 'multi_select' (com underscore), não 'multiselect'
  CHECKBOX: 'checkbox',
  EMAIL: 'email',
  URL: 'url',
  PHONE: 'phone',
  USER: 'user',
  CLIENT: 'client',
  PROPERTY: 'property',
} as const;

export type CustomFieldType =
  (typeof CustomFieldType)[keyof typeof CustomFieldType];

export interface CustomFieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface KanbanCustomField {
  id: string;
  name: string;
  key: string;
  description?: string;
  type: CustomFieldType;
  options?: string[];
  isRequired: boolean;
  isActive: boolean;
  position: number;
  validation?: CustomFieldValidation;
  defaultValue?: any;
  teamId: string;
  projectId?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomFieldDto {
  name: string;
  key: string;
  description?: string;
  type: CustomFieldType;
  options?: string[];
  isRequired?: boolean;
  isActive?: boolean;
  position?: number;
  validation?: CustomFieldValidation;
  defaultValue?: any;
  teamId: string;
  projectId?: string;
}

export interface UpdateCustomFieldDto {
  name?: string;
  key?: string;
  description?: string;
  type?: CustomFieldType;
  options?: string[];
  isRequired?: boolean;
  isActive?: boolean;
  position?: number;
  validation?: CustomFieldValidation;
  defaultValue?: any;
  projectId?: string;
}

export interface ReorderCustomFieldsDto {
  fieldIds: string[];
}

// ============================================
// Resultados e Campos Adicionais
// ============================================

export const LossReason = {
  ALUGOU_EM_OUTRO_LUGAR: 'alugou_em_outro_lugar',
  ALUGUEL: 'aluguel',
  ATENDIDO_POR_OUTRO_CORRETOR: 'atendido_por_outro_corretor',
  CLICOU_ERRADO: 'clicou_errado',
  CLIENTE_EM_ATENDIMENTO_ATIVO: 'cliente_em_atendimento_ativo',
  COMPROU_EM_OUTRO_LUGAR: 'comprou_em_outro_lugar',
  CURRICULO: 'curriculo',
  DESISTIU_DA_CAPTACAO: 'desistiu_da_captacao',
  DESISTIU_DA_COMPRA: 'desistiu_da_compra',
  DESISTIU_DE_ALUGAR: 'desistiu_de_alugar',
  FECHOU_COM_OUTRO_CORRETOR_DA_EQUIPE: 'fechou_com_outro_corretor_da_equipe',
  FINANCEIRO: 'financeiro',
  FORNECEDOR: 'fornecedor',
  IMOVEL_JA_CADASTRADO: 'imovel_ja_cadastrado',
  NAO_CONSEGUIU_CONTATO_TEL_EXISTE: 'nao_conseguiu_contato_tel_existe',
  NAO_E_LEAD: 'nao_e_lead',
  NAO_SE_ENQUADRA: 'nao_se_enquadra',
  PARCERIA_DE_NEGOCIOS: 'parceria_de_negocios',
  PAROU_DE_RESPONDER: 'parou_de_responder',
  RESTRICAO: 'restricao',
  SEM_FORMA_DE_CONTATO_TEL_NAO_EXISTE: 'sem_forma_de_contato_tel_nao_existe',
  SEM_INTERESSE_IMOVEL_EM_MARILIA: 'sem_interesse_imovel_em_marilia',
} as const;

export type LossReason = (typeof LossReason)[keyof typeof LossReason];

export const LossReasonLabels: Record<LossReason, string> = {
  [LossReason.ALUGOU_EM_OUTRO_LUGAR]: 'Alugou em outro lugar',
  [LossReason.ALUGUEL]: 'Aluguel',
  [LossReason.ATENDIDO_POR_OUTRO_CORRETOR]: 'Atendido p/ outro corretor',
  [LossReason.CLICOU_ERRADO]: 'Clicou errado',
  [LossReason.CLIENTE_EM_ATENDIMENTO_ATIVO]: 'Cliente em atendimento ativo',
  [LossReason.COMPROU_EM_OUTRO_LUGAR]: 'Comprou em outro lugar',
  [LossReason.CURRICULO]: 'Currículo',
  [LossReason.DESISTIU_DA_CAPTACAO]: 'Desistiu da captação',
  [LossReason.DESISTIU_DA_COMPRA]: 'Desistiu da compra',
  [LossReason.DESISTIU_DE_ALUGAR]: 'Desistiu de Alugar',
  [LossReason.FECHOU_COM_OUTRO_CORRETOR_DA_EQUIPE]:
    'Fechou com Outro Corretor da Equipe',
  [LossReason.FINANCEIRO]: 'Financeiro',
  [LossReason.FORNECEDOR]: 'Fornecedor',
  [LossReason.IMOVEL_JA_CADASTRADO]: 'Imóvel ja cadastrado',
  [LossReason.NAO_CONSEGUIU_CONTATO_TEL_EXISTE]:
    'Não conseguiu contato (tel existe)',
  [LossReason.NAO_E_LEAD]: 'Não é lead',
  [LossReason.NAO_SE_ENQUADRA]: 'Não se enquadra',
  [LossReason.PARCERIA_DE_NEGOCIOS]: 'Parceria de negócios',
  [LossReason.PAROU_DE_RESPONDER]: 'Parou de responder',
  [LossReason.RESTRICAO]: 'Restrição',
  [LossReason.SEM_FORMA_DE_CONTATO_TEL_NAO_EXISTE]:
    'Sem forma de contato (tel não existe)',
  [LossReason.SEM_INTERESSE_IMOVEL_EM_MARILIA]:
    'Sem interesse imóvel em Marília',
};

export interface MarkResultDto {
  result: 'won' | 'lost' | 'open' | 'cancelled'; // 'open' = voltar para em andamento
  lossReason?: LossReason; // ⚠️ OBRIGATÓRIO quando result === 'lost'
  notes?: string;
}

export interface UpdateTaskFieldsDto {
  qualification?: string;
  totalValue?: number;
  closingForecast?: string;
  source?: string;
  campaign?: string;
  preService?: string;
  vgc?: string;
  transferDate?: string;
  sector?: string;
  customFields?: {
    [key: string]: any;
  };
}

// ============================================
// Histórico de Tarefas e Subtarefas
// ============================================

// Tipos de ações do histórico
export enum TaskHistoryActionType {
  // Ações básicas
  CREATED = 'created',
  MOVED = 'moved',
  UPDATED = 'updated',

  // Alterações de campos
  TITLE_CHANGED = 'title_changed',
  DESCRIPTION_CHANGED = 'description_changed',
  PRIORITY_CHANGED = 'priority_changed',
  DUE_DATE_CHANGED = 'due_date_changed',
  TAGS_CHANGED = 'tags_changed',

  // Atribuições
  ASSIGNED = 'assigned',
  UNASSIGNED = 'unassigned',

  // Status
  COMPLETED = 'completed',
  REOPENED = 'reopened',
  RESULT_CHANGED = 'result_changed',

  // Sub-tarefas
  SUBTASK_CREATED = 'subtask_created',
  SUBTASK_UPDATED = 'subtask_updated',
  SUBTASK_DELETED = 'subtask_deleted',
  SUBTASK_COMPLETED = 'subtask_completed',
  SUBTASK_REOPENED = 'subtask_reopened',
  SUBTASK_ASSIGNED = 'subtask_assigned',
  SUBTASK_UNASSIGNED = 'subtask_unassigned',
  SUBTASK_TITLE_CHANGED = 'subtask_title_changed',
  SUBTASK_DESCRIPTION_CHANGED = 'subtask_description_changed',
  SUBTASK_DUE_DATE_CHANGED = 'subtask_due_date_changed',

  // Campos adicionais
  QUALIFICATION_CHANGED = 'qualification_changed',
  TOTAL_VALUE_CHANGED = 'total_value_changed',
  CLOSING_FORECAST_CHANGED = 'closing_forecast_changed',
  SOURCE_CHANGED = 'source_changed',
  CAMPAIGN_CHANGED = 'campaign_changed',
  PRESERVICE_CHANGED = 'preservice_changed',
  VGC_CHANGED = 'vgc_changed',
  TRANSFER_DATE_CHANGED = 'transfer_date_changed',
  SECTOR_CHANGED = 'sector_changed',
  CUSTOM_FIELDS_CHANGED = 'custom_fields_changed',

  // Pessoas envolvidas
  INVOLVED_USER_ADDED = 'involved_user_added',
  INVOLVED_USER_REMOVED = 'involved_user_removed',

  // Transferências
  TRANSFERRED = 'transferred',
  RECEIVED_FROM_TRANSFER = 'received_from_transfer',
}

// Informações do usuário no histórico
export interface HistoryUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Informações da coluna no histórico
export interface HistoryColumn {
  id: string;
  title: string;
  color: string;
}

// Entrada do histórico
export interface TaskHistoryEntry {
  id: string;
  action: TaskHistoryActionType;
  user: HistoryUser | null;
  fromColumn: HistoryColumn | null;
  toColumn: HistoryColumn | null;
  oldValue?: string;
  newValue?: string;
  description?: string;
  createdAt: string;
}

// ============================================
// Regras de Cor do Kanban
// ============================================

export type ColorRuleOperator =
  | 'greater_than'
  | 'greater_than_or_equal'
  | 'less_than'
  | 'less_than_or_equal'
  | 'equal'
  | 'between';

export interface KanbanColorRule {
  id: string;
  teamId: string;
  projectId?: string | null;
  name: string;
  description?: string;
  operator: ColorRuleOperator;
  days: number;
  daysTo?: number | null; // Para operador 'between'
  color: string; // Formato hexadecimal (#RRGGBB)
  order: number; // Prioridade (menor número = maior prioridade)
  isActive: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateColorRuleDto {
  teamId: string;
  projectId?: string | null;
  name: string;
  description?: string;
  operator: ColorRuleOperator;
  days: number;
  daysTo?: number | null;
  color: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateColorRuleDto {
  name?: string;
  description?: string;
  operator?: ColorRuleOperator;
  days?: number;
  daysTo?: number | null;
  color?: string;
  order?: number;
  isActive?: boolean;
}

export interface ReorderColorRulesDto {
  ruleIds: string[];
}

// ==================== MÉTRICAS DO KANBAN ====================

export interface ColumnHistoryEntry {
  columnId: string;
  columnName: string;
  enteredAt: string; // ISO date string
  leftAt?: string; // ISO date string (novo nome)
  exitedAt?: string; // ISO date string (deprecated - usar leftAt)
  timeInColumn?: number; // em horas (novo nome)
  duration?: number; // em horas (deprecated - usar timeInColumn)
}

export interface ProjectHistoryEntry {
  projectId: string;
  projectName: string;
  enteredAt: string; // ISO date string
  leftAt?: string | null; // ISO date string (null se ainda está no projeto)
  timeInProject: number; // em horas
  isCurrentProject: boolean;
}

export interface TaskMetrics {
  taskId: string;
  taskTitle: string;
  totalSubtasks: number;
  completedSubtasks: number;
  subtaskCompletionRate: number;
  averageSubtaskCompletionTime: number; // em horas
  timeInCurrentColumn: number; // em horas
  totalTimeInBoard: number; // em horas
  status: string;
  priority: string;
  assignedTo?: {
    id: string;
    name: string;
  };
  subtasksByUser: SubtaskMetricsByUser[];
  // Novos campos
  columnName?: string;
  projectName?: string;
  clientName?: string;
  propertyTitle?: string;
  totalValue?: number;
  closingForecast?: string; // ISO date string
  source?: string;
  campaign?: string;
  qualification?: string;
  result?: string;
  resultDate?: string; // ISO date string
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  dueDate?: string; // ISO date string
  daysOverdue?: number;
  columnHistory?: ColumnHistoryEntry[];
  commentsCount?: number;
  involvedUsersCount?: number;
  projectHistory?: ProjectHistoryEntry[]; // Histórico de tempo por projeto (tarefas transferidas)
  totalTimeAcrossProjects?: number; // Tempo total em todos os projetos (horas)
}

export interface SubtaskMetricsByUser {
  userId: string;
  userName: string;
  total: number;
  completed: number;
  pending?: number;
  completionRate: number;
  averageCompletionTime?: number; // em horas
}

export interface CompletionTimeDistribution {
  range: string; // "0-24h", "24-48h", "48-72h", ">72h"
  count: number;
  percentage: number;
}

export interface OverdueByUser {
  userId: string;
  userName: string;
  count: number;
}

export interface AverageCompletionTimeByUser {
  userId: string;
  userName: string;
  averageTime: number; // em horas
}

export interface SubtaskMetrics {
  totalSubtasks: number;
  completedSubtasks: number;
  pendingSubtasks: number;
  completionRate: number;
  averageCompletionTime: number; // em horas
  overdueSubtasks: number;
  subtasksByUser: SubtaskMetricsByUser[];
  subtasksByTask: SubtaskMetricsByTask[];
  completionTrend: CompletionTrendDay[];
  // Novos campos
  completionTimeDistribution?: CompletionTimeDistribution[];
  overdueByUser?: OverdueByUser[];
  averageCompletionTimeByUser?: AverageCompletionTimeByUser[];
}

export interface SubtaskMetricsByTask {
  taskId: string;
  taskTitle: string;
  total: number;
  completed: number;
  completionRate: number;
}

export interface CompletionTrendDay {
  date: string; // ISO date string
  completed: number;
  created: number;
}

export interface TaskMetricsParams {
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

export interface SubtaskMetricsParams {
  teamId?: string;
  taskId?: string;
  userId?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

// Métricas de Negociações (Vendas)
export interface TasksByStatus {
  status: string;
  count: number;
  totalValue: number;
  averageValue: number;
  conversionRate: number;
}

export interface TasksByPriority {
  priority: string;
  count: number;
  totalValue: number;
  averageValue: number;
  conversionRate: number;
}

export interface TasksByColumn {
  columnId: string;
  columnName: string;
  count: number;
  totalValue: number;
  averageValue: number;
  averageTimeInColumn: number; // em horas
  conversionRate: number;
  stuckTasks: number;
}

export interface TasksByUser {
  userId: string;
  userName: string;
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  wonTasks: number;
  lostTasks: number;
  conversionRate: number;
  winRate: number;
  totalValue: number;
  wonValue: number;
  averageDealValue: number;
  averageTimeToClose: number; // em horas
  tasksByStatus: Array<{
    status: string;
    count: number;
  }>;
}

export interface TasksBySource {
  source: string;
  count: number;
  totalValue: number;
  wonValue: number;
  conversionRate: number;
  averageDealValue: number;
}

export interface TasksByCampaign {
  campaign: string;
  count: number;
  totalValue: number;
  wonValue: number;
  conversionRate: number;
  averageDealValue: number;
}

export interface TasksByQualification {
  qualification: string;
  count: number;
  totalValue: number;
  wonValue: number;
  conversionRate: number;
}

export interface TasksByMonth {
  month: string; // "YYYY-MM"
  created: number;
  completed: number;
  won: number;
  lost: number;
  totalValue: number;
  wonValue: number;
}

export interface Bottleneck {
  columnId: string;
  columnName: string;
  averageTime: number; // em horas
  stuckTasks: number;
  reason: string;
}

export interface HighValueStuckTask {
  taskId: string;
  taskTitle: string;
  columnName: string;
  value: number;
  daysStuck: number;
}

export interface ForecastByMonth {
  month: string; // "YYYY-MM"
  forecastValue: number;
  probability: number; // 0.0 a 1.0
}

export interface TasksMetrics {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  lostTasks: number;
  wonTasks: number;
  conversionRate: number;
  winRate: number;
  averageDealValue: number;
  totalPipelineValue: number;
  totalWonValue: number;
  averageTimeToClose: number; // em horas
  tasksByStatus: TasksByStatus[];
  tasksByPriority: TasksByPriority[];
  tasksByColumn: TasksByColumn[];
  tasksByUser: TasksByUser[];
  tasksBySource: TasksBySource[];
  tasksByCampaign: TasksByCampaign[];
  tasksByQualification: TasksByQualification[];
  tasksByMonth: TasksByMonth[];
  bottlenecks: Bottleneck[];
  overdueTasks: number;
  highValueStuckTasks: HighValueStuckTask[];
  forecastByMonth: ForecastByMonth[];
}

export interface TasksMetricsParams {
  teamId?: string;
  projectId?: string;
  userId?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

// Análise de Valores por Coluna
export interface ValueByTimeRange {
  range: string; // "0-24h", "24-48h", "48-72h", "72h-7d"
  value: number;
  taskCount: number;
  percentage: number;
}

export interface ValueByPeriod {
  period: string; // "YYYY-MM"
  enteredValue: number;
  leftValue: number;
  currentValue: number;
}

export interface HighValueTask {
  taskId: string;
  taskTitle: string;
  value: number;
  timeInColumn: number; // em horas
  daysInColumn: number;
}

export interface ColumnValueAnalysis {
  columnId: string;
  columnName: string;
  totalValue: number;
  taskCount: number;
  averageValue: number;
  averageTimeInColumn: number; // em horas
  valueByTimeRange: ValueByTimeRange[];
  valueByPeriod: ValueByPeriod[];
  stuckValue: number;
  stuckTasks: number;
  highValueTasks: HighValueTask[];
}

export interface ColumnValueAnalysisParams {
  teamId: string; // obrigatório
  columnId?: string;
  minDaysStuck?: number; // padrão: 7
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

/** Insights IA do funil: resumo, prioridades, parados por coluna, sugestões por tarefa */
export interface FunnelInsights {
  summary: {
    totalOpenTasks: number;
    stuckCount: number;
    needFollowUpCount: number;
    priorityCount: number;
  };
  priorityTaskIds: string[];
  columnStuckCounts: Array<{
    columnId: string;
    columnName: string;
    stuckCount: number;
    followUpCount: number;
  }>;
  taskInsights: Array<{
    taskId: string;
    title: string;
    columnId: string;
    columnName: string;
    daysSinceUpdate: number;
    aiPriority: 'high' | 'medium' | 'low';
    nextActionSuggestion: string;
    isOverdue: boolean;
  }>;
  /** Resumo em linguagem natural (Grok/xAI), quando configurado */
  summaryText?: string;
  /** Até 3 sugestões de foco (Grok) */
  focusSuggestions?: string[];
}

// Transferência de Tarefas entre Projetos
export interface TransferTaskDto {
  toProjectId: string;
  toColumnId?: string;
  assignedToId?: string;
  notes?: string;
}

export interface TaskTransferResponse {
  transferId: string;
  originalTask: KanbanTask;
  duplicatedTask: KanbanTask;
  fromProject: {
    id: string;
    name: string;
  };
  toProject: {
    id: string;
    name: string;
  };
  transferredBy: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  transferredAt: string;
  notes?: string;
}

export interface TaskTransferHistory {
  id: string;
  originalTask: {
    id: string;
    title: string;
    projectId?: string;
    projectName?: string;
  };
  duplicatedTask: {
    id: string;
    title: string;
    projectId?: string;
    projectName?: string;
  };
  fromProject: {
    id: string;
    name: string;
  };
  toProject: {
    id: string;
    name: string;
  };
  transferredBy: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  transferredAt: string;
  notes?: string;
}
