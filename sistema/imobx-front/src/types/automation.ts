// Enums para tipos e categorias de automações
export enum AutomationType {
  // Checklist
  CHECKLIST_AUTOMATIC = 'checklist_automatic',
  CHECKLIST_REMINDER = 'checklist_reminder',

  // Locação
  PAYMENT_REMINDER = 'payment_reminder',
  PAYMENT_OVERDUE = 'payment_overdue',
  CONTRACT_EXPIRING = 'contract_expiring',
  CONTRACT_EXPIRED = 'contract_expired',

  // Funil de Vendas
  LEAD_FOLLOWUP = 'lead_followup',
  MCMV_LEAD_FOLLOWUP = 'mcmv_lead_followup',
  CLIENT_FOLLOWUP = 'client_followup',
  MATCH_NOTIFICATION = 'match_notification',

  // Processo
  APPOINTMENT_REMINDER = 'appointment_reminder',
  INSPECTION_REMINDER = 'inspection_reminder',
  EXPENSE_REMINDER = 'expense_reminder',
  EXPENSE_OVERDUE = 'expense_overdue',

  // Sistema
  SUBSCRIPTION_EXPIRING = 'subscription_expiring',
  SUBSCRIPTION_EXPIRED = 'subscription_expired',
}

export type Category = 'process' | 'financial' | 'rental' | 'crm' | 'marketing';

export enum ExecutionStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  PARTIAL = 'partial',
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export enum LogType {
  EXECUTION_START = 'execution_start',
  EXECUTION_END = 'execution_end',
  NOTIFICATION_SENT = 'notification_sent',
  NOTIFICATION_FAILED = 'notification_failed',
  DATA_FETCHED = 'data_fetched',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

// Interface de configuração
export interface AutomationConfig {
  enabled?: boolean;

  recipients?: {
    corretor?: boolean;
    cliente?: boolean;
    proprietario?: boolean;
    admin?: boolean;
    manager?: boolean;
    lead?: boolean;
    customUsers?: string[];
  };

  timing?: {
    days?: number[];
    hours?: number[];
    immediate?: boolean;
  };

  channels?: {
    email?: boolean;
    whatsapp?: boolean;
    sms?: boolean;
    inApp?: boolean;
  };

  customMessage?: string;

  conditions?: {
    minScore?: number;
    status?: string[];
  };

  daysSinceLastContact?: number | number[];
  createOnOfferAccepted?: boolean;
  createOnMatchAccepted?: boolean;
}

// Interface de template
export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  type: AutomationType;
  category: Category;
  icon: string;
  defaultConfig: AutomationConfig;
}

// Interface de automação
export interface Automation {
  id: string;
  companyId: string;
  name: string;
  description: string;
  type: AutomationType;
  category: Category;
  icon: string;
  isActive: boolean;
  config: AutomationConfig;
  executionCount: number;
  successfulExecutions: number;
  failedExecutions: number;
  lastExecutionAt?: string;
  status: 'active' | 'inactive' | 'error';
  createdAt: string;
  updatedAt: string;
}

// Interface de execução
export interface AutomationExecution {
  id: string;
  automationId: string;
  companyId: string;
  status: ExecutionStatus;
  notificationsSent: number;
  itemsProcessed: number;
  errorsCount: number;
  executionTimeMs: number;
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  logs?: AutomationLog[];
}

// Interface de log
export interface AutomationLog {
  id: string;
  automationId: string;
  executionId?: string;
  companyId: string;
  level: LogLevel;
  type: LogType;
  message: string;
  details?: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// Interface de estatísticas
export interface AutomationStatistics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  lastExecution?: string;
  averageExecutionTime: number;
  successRate: number;
}

// Interface para resposta paginada
export interface PaginatedAutomationResponse {
  automations: Automation[];
  total: number;
}

export interface PaginatedExecutionResponse {
  executions: AutomationExecution[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedLogResponse {
  logs: AutomationLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Interface para criar automação
export interface CreateAutomationData {
  companyId: string;
  name?: string;
  config?: AutomationConfig;
}

// Interface para atualizar configuração
export interface UpdateAutomationConfigData {
  config: AutomationConfig;
}
