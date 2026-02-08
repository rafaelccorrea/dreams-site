// Tipos para Validações e Ações por Coluna no Kanban

/** Máximo de validações permitidas por coluna */
export const MAX_VALIDATIONS_PER_COLUMN = 3;

export const ValidationType = {
  REQUIRED_FIELD: 'required_field',
  REQUIRED_CHECKLIST: 'required_checklist',
  REQUIRED_DOCUMENT: 'required_document',
  REQUIRED_RELATIONSHIP: 'required_relationship',
  CUSTOM_CONDITION: 'custom_condition',
} as const;

export type ValidationType =
  (typeof ValidationType)[keyof typeof ValidationType];

export const ValidationBehavior = {
  BLOCK: 'block',
  WARN: 'warn',
  MARK_INCOMPLETE: 'mark_incomplete',
} as const;

export type ValidationBehavior =
  (typeof ValidationBehavior)[keyof typeof ValidationBehavior];

export const ActionTrigger = {
  ON_ENTER: 'on_enter',
  ON_EXIT: 'on_exit',
  ON_STAY: 'on_stay',
} as const;

export type ActionTrigger = (typeof ActionTrigger)[keyof typeof ActionTrigger];

export const ActionType = {
  CREATE_PROPERTY: 'create_property',
  CREATE_CLIENT: 'create_client',
  CREATE_DOCUMENT: 'create_document',
  CREATE_VISTORIA: 'create_vistoria',
  CREATE_RENTAL: 'create_rental',
  CREATE_NOTE: 'create_note',
  CREATE_APPOINTMENT: 'create_appointment',
  CREATE_TRANSACTION: 'create_transaction',
  UPDATE_PROPERTY: 'update_property',
  UPDATE_CLIENT: 'update_client',
  UPDATE_DOCUMENT: 'update_document',
  SEND_EMAIL: 'send_email',
  SEND_SMS: 'send_sms',
  SEND_NOTIFICATION: 'send_notification',
  SEND_CHAT_MESSAGE: 'send_chat_message',
  ASSIGN_USER: 'assign_user',
  ADD_TAG: 'add_tag',
  SET_PRIORITY: 'set_priority',
  SET_DUE_DATE: 'set_due_date',
  ADD_COMMENT: 'add_comment',
  SET_CUSTOM_FIELD: 'set_custom_field',
  CREATE_TASK: 'create_task',
  ARCHIVE_DOCUMENTS: 'archive_documents',
  UPDATE_RELATIONSHIP: 'update_relationship',
  // Novas ações implementadas
  SCHEDULE_EMAIL: 'schedule_email',
  SCHEDULE_TASK: 'schedule_task',
  START_EMAIL_SEQUENCE: 'start_email_sequence',
  UPDATE_SCORE: 'update_score',
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

/**
 * Tipos de ação implementados no backend (executados ao mover tarefa / on_stay).
 * Ver doc: Kanban – Ações de coluna (API). Não oferecer na UI tipos fora desta lista.
 */
export const IMPLEMENTED_ACTION_TYPES: ActionType[] = [
  ActionType.ASSIGN_USER,
  ActionType.SET_PRIORITY,
  ActionType.SET_DUE_DATE,
  ActionType.ADD_TAG,
  ActionType.CREATE_PROPERTY,
  ActionType.CREATE_CLIENT,
  ActionType.CREATE_DOCUMENT,
  ActionType.SEND_EMAIL,
  ActionType.SEND_NOTIFICATION,
  ActionType.SCHEDULE_TASK,
  ActionType.SCHEDULE_EMAIL,
  ActionType.UPDATE_SCORE,
  ActionType.START_EMAIL_SEQUENCE,
];

/** Opções para select de tipo de ação (apenas implementados), ordem para UI */
export const ACTION_TYPE_OPTIONS_IMPLEMENTED: {
  value: ActionType;
  label: string;
}[] = [
  { value: ActionType.ASSIGN_USER, label: '👥 Atribuir responsável' },
  { value: ActionType.SET_PRIORITY, label: '⚡ Definir prioridade' },
  { value: ActionType.SET_DUE_DATE, label: '📆 Definir data limite' },
  { value: ActionType.ADD_TAG, label: '🏷️ Adicionar tag' },
  { value: ActionType.CREATE_PROPERTY, label: '🏠 Criar propriedade' },
  { value: ActionType.CREATE_CLIENT, label: '👤 Criar cliente' },
  { value: ActionType.CREATE_DOCUMENT, label: '📄 Criar documento' },
  { value: ActionType.SEND_EMAIL, label: '📧 Enviar e-mail' },
  { value: ActionType.SEND_NOTIFICATION, label: '🔔 Enviar notificação' },
  { value: ActionType.SCHEDULE_TASK, label: '📅 Agendar tarefa' },
  { value: ActionType.SCHEDULE_EMAIL, label: '📧 Agendar e-mail' },
  { value: ActionType.UPDATE_SCORE, label: '📊 Atualizar score' },
  {
    value: ActionType.START_EMAIL_SEQUENCE,
    label: '📬 Iniciar sequência de e-mail',
  },
];

/** Triggers permitidos por tipo (backend retorna 400 se combinação inválida). Doc: seção 5.1 */
const TRIGGERS_ON_ENTER_ONLY: ActionTrigger[] = [ActionTrigger.ON_ENTER];
const TRIGGERS_ENTER_EXIT_STAY: ActionTrigger[] = [
  ActionTrigger.ON_ENTER,
  ActionTrigger.ON_EXIT,
  ActionTrigger.ON_STAY,
];
const TRIGGERS_ENTER_STAY: ActionTrigger[] = [
  ActionTrigger.ON_ENTER,
  ActionTrigger.ON_STAY,
];

export const ALLOWED_TRIGGERS_BY_ACTION_TYPE: Record<
  ActionType,
  ActionTrigger[]
> = {
  [ActionType.ASSIGN_USER]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.SET_PRIORITY]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.SET_DUE_DATE]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.ADD_TAG]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.CREATE_PROPERTY]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.CREATE_CLIENT]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.CREATE_DOCUMENT]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.SCHEDULE_TASK]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.SCHEDULE_EMAIL]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.START_EMAIL_SEQUENCE]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.SEND_EMAIL]: TRIGGERS_ENTER_EXIT_STAY,
  [ActionType.SEND_NOTIFICATION]: TRIGGERS_ENTER_EXIT_STAY,
  [ActionType.UPDATE_SCORE]: TRIGGERS_ENTER_STAY,
  // Tipos não implementados (mantidos para tipo não quebrar); backend rejeita uso
  [ActionType.CREATE_VISTORIA]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.CREATE_RENTAL]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.CREATE_NOTE]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.CREATE_APPOINTMENT]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.CREATE_TRANSACTION]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.UPDATE_PROPERTY]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.UPDATE_CLIENT]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.UPDATE_DOCUMENT]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.SEND_SMS]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.SEND_CHAT_MESSAGE]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.ADD_COMMENT]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.SET_CUSTOM_FIELD]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.CREATE_TASK]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.ARCHIVE_DOCUMENTS]: TRIGGERS_ON_ENTER_ONLY,
  [ActionType.UPDATE_RELATIONSHIP]: TRIGGERS_ON_ENTER_ONLY,
};

const TRIGGER_OPTIONS_ALL: { value: ActionTrigger; label: string }[] = [
  { value: ActionTrigger.ON_ENTER, label: '✅ Ao Entrar na Coluna' },
  { value: ActionTrigger.ON_EXIT, label: '⬅️ Ao Sair da Coluna' },
  {
    value: ActionTrigger.ON_STAY,
    label: '⏰ Enquanto Está na Coluna (Periódico)',
  },
];

/** Retorna opções de trigger para o select, conforme tipo (apenas triggers permitidos pelo backend). */
export function getTriggerOptionsForActionType(
  type: ActionType
): { value: ActionTrigger; label: string }[] {
  const allowed =
    ALLOWED_TRIGGERS_BY_ACTION_TYPE[type] ?? TRIGGERS_ON_ENTER_ONLY;
  return TRIGGER_OPTIONS_ALL.filter(opt => allowed.includes(opt.value));
}

/** Primeiro trigger permitido para o tipo (ex.: ao trocar tipo, corrigir trigger inválido). */
export function getDefaultTriggerForActionType(
  type: ActionType
): ActionTrigger {
  const allowed =
    ALLOWED_TRIGGERS_BY_ACTION_TYPE[type] ?? TRIGGERS_ON_ENTER_ONLY;
  return allowed[0];
}

export const FieldTransform = {
  UPPERCASE: 'uppercase',
  LOWERCASE: 'lowercase',
  CAPITALIZE: 'capitalize',
  FORMAT_CPF: 'format_cpf',
  FORMAT_CNPJ: 'format_cnpj',
  FORMAT_PHONE: 'format_phone',
  FORMAT_DATE: 'format_date',
  FORMAT_CURRENCY: 'format_currency',
  EXTRACT_NUMBERS: 'extract_numbers',
  TRIM: 'trim',
} as const;

export type FieldTransform =
  (typeof FieldTransform)[keyof typeof FieldTransform];

// ValidationConfig
export interface ValidationConfig {
  // Para REQUIRED_FIELD
  fieldName?: string;
  fieldType?: string;
  customFieldId?: string;

  // Para REQUIRED_CHECKLIST
  checklistId?: string;
  requiredItems?: string[];
  allItemsRequired?: boolean;

  // Para REQUIRED_DOCUMENT
  documentType?: string;
  documentStatus?: 'any' | 'signed' | 'approved';
  minDocuments?: number;
  documentCategory?: string;

  // Para REQUIRED_RELATIONSHIP
  relationshipType?: 'client' | 'property' | 'project' | 'rental';
  required?: boolean;

  // Para CUSTOM_CONDITION
  condition?: {
    field: string;
    operator:
      | 'equals'
      | 'not_equals'
      | 'greater_than'
      | 'less_than'
      | 'greater_or_equal'
      | 'less_or_equal'
      | 'contains'
      | 'not_contains'
      | 'empty'
      | 'not_empty'
      | 'in'
      | 'not_in';
    value: any;
    valueType?: 'string' | 'number' | 'date' | 'boolean' | 'array';
  };
}

// ColumnValidation
export interface ColumnValidation {
  id: string;
  columnId: string;
  type: ValidationType;
  config: ValidationConfig;
  behavior: ValidationBehavior;
  message: string;
  fromColumnId?: string; // Coluna de destino (opcional): validação só se aplica quando a tarefa está indo PARA esta coluna. Doc: kanban-validacoes-coluna-api §6.
  fromColumn?: { id: string; title: string }; // Informação da coluna de destino (quando fromColumnId está preenchido)
  toColumnId?: string; // ID da coluna de destino (mesmo que fromColumnId quando usado)
  toColumn?: { id: string; title: string }; // Informação da coluna de destino
  requireAdjacentPosition?: boolean; // Se true, só aplica quando o movimento é para a coluna imediatamente à frente (posição origem + 1). Doc: §6.
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string;
}

// FieldMapping
export interface FieldMapping {
  source:
    | 'task_field'
    | 'custom_field'
    | 'user_field'
    | 'project_field'
    | 'team_field'
    | 'company_field'
    | 'fixed_value'
    | 'calculated';
  sourceField?: string;
  customFieldId?: string;
  targetField: string;
  transform?: FieldTransform;
  defaultValue?: any;
  required?: boolean;
}

// ActionCondition
export interface ActionCondition {
  field: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'greater_than'
    | 'less_than'
    | 'contains'
    | 'empty'
    | 'not_empty'
    | 'in'
    | 'not_in';
  value: any;
  valueType?: 'string' | 'number' | 'date' | 'boolean' | 'array';
  logicalOperator?: 'AND' | 'OR';
}

// RecipientConfig
export interface RecipientConfig {
  type:
    | 'user'
    | 'role'
    | 'team'
    | 'email'
    | 'task_assignee'
    | 'task_creator'
    | 'client'
    | 'property_owner';
  value?: string;
  field?: string;
}

// ActionConfig
export interface ActionConfig {
  // Para criar/atualizar entidades
  entityType?: string;
  fieldMapping?: Record<string, FieldMapping>;

  // Para notificações
  recipients?: RecipientConfig[];
  template?: string;
  subject?: string;
  message?: string;
  notificationType?: 'info' | 'success' | 'warning' | 'error';

  // Para atribuições
  userId?: string;
  role?: string;
  teamId?: string;

  // Para tags/prioridade/etc
  value?: any;
  tagIds?: string[];
  tagNames?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';

  // Para ações periódicas (on_stay)
  intervalHours?: number;
  maxExecutions?: number;
  executionCount?: number;
  lastExecutionAt?: string | null;

  // Para criar tarefa
  targetColumnId?: string;
  taskData?: Record<string, any>;

  // Para atualizar relacionamento
  relationshipType?: 'client' | 'property' | 'project';
  relationshipId?: string;
  action?: 'add' | 'remove' | 'replace';

  // Para documentos
  documentType?: string;
  autoSign?: boolean;
  sendForSignature?: boolean;

  // Para transações
  requireApproval?: boolean;

  // Para data de vencimento
  dueDateValue?: string; // ISO date ou "7 days", "1 month", etc.

  // Para agendamentos (SCHEDULE_EMAIL, SCHEDULE_TASK)
  scheduledFor?: string; // ISO date string

  // Para sequências de email (START_EMAIL_SEQUENCE)
  sequenceId?: string;

  // Para atualizar score (UPDATE_SCORE)
  points?: number; // Pontos a adicionar (opcional, usa regras se não informado)
}

// ColumnAction
export interface ColumnAction {
  id: string;
  columnId: string;
  trigger: ActionTrigger;
  type: ActionType;
  config: ActionConfig;
  conditions?: ActionCondition[];
  fromColumnId?: string; // Coluna de origem (opcional) - ação só executa se vier desta coluna
  fromColumn?: { id: string; title: string }; // ✅ NOVO: Informação da coluna de origem
  toColumnId?: string; // ✅ NOVO: ID da coluna de destino (mesmo que columnId, mas explícito)
  toColumn?: { id: string; title: string }; // ✅ NOVO: Informação da coluna de destino
  requireAdjacentPosition?: boolean; // Se true, só executa se coluna de origem está adjacente (posição ±1)
  order: number;
  isActive: boolean;
  intervalHours?: number;
  maxExecutions?: number;
  executionCount?: number;
  lastExecutionAt?: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string;
}

// DTOs para criar/atualizar
export interface CreateValidationDto {
  type: ValidationType;
  config: ValidationConfig;
  behavior: ValidationBehavior;
  message: string;
  fromColumnId?: string;
  requireAdjacentPosition?: boolean;
  order?: number;
}

export interface UpdateValidationDto {
  type?: ValidationType;
  config?: ValidationConfig;
  behavior?: ValidationBehavior;
  message?: string;
  fromColumnId?: string;
  requireAdjacentPosition?: boolean;
  order?: number;
  isActive?: boolean;
}

export interface CreateActionDto {
  trigger: ActionTrigger;
  type: ActionType;
  config: ActionConfig;
  conditions?: ActionCondition[];
  fromColumnId?: string;
  requireAdjacentPosition?: boolean;
  order?: number;
  intervalHours?: number;
  maxExecutions?: number;
}

export interface UpdateActionDto {
  trigger?: ActionTrigger;
  type?: ActionType;
  config?: ActionConfig;
  conditions?: ActionCondition[];
  fromColumnId?: string;
  requireAdjacentPosition?: boolean;
  order?: number;
  isActive?: boolean;
  intervalHours?: number;
  maxExecutions?: number;
}

// Resultados (GET validations + resposta 400 do move)
export interface ValidationResult {
  validationId: string;
  validationType: ValidationType;
  passed: boolean;
  message: string;
  details?: Record<string, any>;
  /** Doc: resposta 400 do move pode incluir para destacar campo no formulário */
  fieldName?: string;
  customFieldId?: string | null;
}

export interface ActionResult {
  actionId: string;
  actionType: ActionType;
  success: boolean;
  message: string;
  createdEntityId?: string;
  createdEntityType?: string;
  error?: string;
  details?: Record<string, any>;
  // ⚠️ NOVO: Campos para bypass quando ação já foi executada
  alreadyExecuted?: boolean; // Flag indicando que a ação já foi executada anteriormente (bypass)
  entityName?: string; // Nome legível da entidade criada (ex: "Propriedade", "Cliente")
}

// DTO para mover tarefa com validações
export interface MoveTaskWithValidationDto {
  taskId: string;
  fromColumnId: string; // ⚠️ OBRIGATÓRIO: ID da coluna de origem (de onde está vindo)
  targetColumnId: string; // ID da coluna de destino (para onde está indo)
  targetPosition: number; // Nova posição na coluna destino
  skipValidations?: boolean; // Opcional: pular validações (apenas admins)
  skipActions?: boolean; // Opcional: pular ações (apenas admins)
  actionData?: Record<string, Record<string, any>>; // actionId -> dados do formulário
}

// Validação que falhou (resposta 400 do POST /kanban/tasks/move). Doc: §10.
export interface FailedValidation {
  validationId: string;
  validationType: ValidationType;
  message: string;
  details: {
    fieldName?: string;
    hasValue?: boolean;
    checklistId?: string;
    completedItems?: number;
    totalItems?: number;
    documentType?: string;
    relationshipType?: string;
    [key: string]: any;
  };
  /** Para o front destacar o campo no formulário (doc §10) */
  fieldName?: string;
  customFieldId?: string | null;
}

// Resposta ao mover tarefa
export interface MoveTaskResponse {
  task?: any; // KanbanTask (opcional em caso de erro)
  validationResults?: ValidationResult[];
  actionResults?: ActionResult[];
  blocked: boolean;
  warnings?: string[];
  message?: string;
  // Novo formato de erro do backend
  failedValidations?: FailedValidation[];
  totalFailed?: number;
  statusCode?: number;
  errorCode?: string;
}

// Histórico
export interface ValidationExecution {
  id: string;
  validation: {
    id: string;
    type: ValidationType;
    message: string;
  };
  column: {
    id: string;
    title: string;
  };
  passed: boolean;
  message: string;
  details: Record<string, any>;
  executedAt: string;
  executedBy?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface ActionExecution {
  id: string;
  action: {
    id: string;
    type: ActionType;
    trigger: ActionTrigger;
  };
  column: {
    id: string;
    title: string;
  };
  success: boolean;
  message: string;
  createdEntityId?: string;
  createdEntityType?: string;
  error?: string;
  details: Record<string, any>;
  executedAt: string;
  executedBy?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface ValidationHistoryResponse {
  executions: ValidationExecution[];
  total: number;
  limit?: number;
  offset?: number;
}

export interface ActionHistoryResponse {
  executions: ActionExecution[];
  total: number;
  limit?: number;
  offset?: number;
}

// Estender KanbanColumn para incluir validações e ações
export interface KanbanColumnWithValidations {
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
  validations?: ColumnValidation[];
  actions?: ColumnAction[];
}
