// Tipos de metas disponíveis
export type GoalType =
  | 'sales_value' // Valor de vendas
  | 'sales_count' // Número de vendas
  | 'rental_value' // Valor de aluguéis
  | 'rental_count' // Número de aluguéis
  | 'revenue' // Receita (comissões)
  | 'leads' // Número de leads
  | 'conversions' // Conversões (vendas fechadas)
  | 'conversion_rate'; // Taxa de conversão (%)

// Períodos da meta
export type GoalPeriod =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

// Escopos da meta
export type GoalScope =
  | 'company' // Meta da empresa inteira
  | 'team' // Meta de uma equipe
  | 'user'; // Meta individual de um corretor

// Status da meta
export type GoalStatus =
  | 'draft' // Rascunho
  | 'active' // Ativa
  | 'completed' // Completada
  | 'failed' // Falhou
  | 'cancelled'; // Cancelada

// Labels para exibição
export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  sales_value: 'Valor de Vendas',
  sales_count: 'Número de Vendas',
  rental_value: 'Valor de Aluguéis',
  rental_count: 'Número de Aluguéis',
  revenue: 'Receita (Comissões)',
  leads: 'Número de Leads',
  conversions: 'Conversões',
  conversion_rate: 'Taxa de Conversão',
};

export const GOAL_PERIOD_LABELS: Record<GoalPeriod, string> = {
  daily: 'Diária',
  weekly: 'Semanal',
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  yearly: 'Anual',
};

export const GOAL_SCOPE_LABELS: Record<GoalScope, string> = {
  company: 'Empresa',
  team: 'Equipe',
  user: 'Corretor Individual',
};

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  draft: 'Rascunho',
  active: 'Ativa',
  completed: 'Completada',
  failed: 'Falhou',
  cancelled: 'Cancelada',
};

// Configurações de notificação
export interface NotificationSettings {
  enabled: boolean;
  notifyAt: number[]; // Percentuais para notificar (ex: [25, 50, 75, 90, 100])
  notifyOnRisk: boolean; // Notificar se meta em risco
  notifyOnAchieved: boolean; // Notificar quando atingir 100%
}

// Interface principal da Meta
export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: GoalType;
  period: GoalPeriod;
  scope: GoalScope;
  targetValue: number; // Valor alvo da meta
  currentValue: number; // Valor atual alcançado
  progress: number; // Percentual de progresso (0-100)
  remaining: number; // Valor restante para atingir
  startDate: string; // Data de início
  endDate: string; // Data de término
  status: GoalStatus;
  isActive: boolean;
  isCompanyWide: boolean; // Meta visível para toda a empresa (apenas para scope: company)

  // Dados de tempo
  daysTotal: number; // Total de dias da meta
  daysElapsed: number; // Dias decorridos
  daysRemaining: number; // Dias restantes

  // Análise
  isOnTrack: boolean; // Se está no caminho certo
  dailyTarget: number; // Meta diária necessária
  projectedValue: number; // Valor projetado no ritmo atual

  // Referências opcionais
  userId?: string; // ID do usuário (se scope = user)
  teamId?: string; // ID da equipe (se scope = team)

  // Customização visual
  color?: string; // Cor da meta
  icon?: string; // Emoji ou ícone

  // Notificações
  notificationSettings?: NotificationSettings;

  // Metadados
  createdAt: string;
  updatedAt: string;
  companyId: string;
}

// Interface para criar meta
export interface CreateGoalDTO {
  title: string;
  description?: string;
  type: GoalType;
  period: GoalPeriod;
  scope: GoalScope;
  targetValue: number;
  startDate?: string;
  endDate?: string;
  userId?: string;
  teamId?: string;
  color?: string;
  icon?: string;
  isCompanyWide?: boolean; // Meta visível para toda a empresa (apenas para scope: company)
  notificationSettings?: NotificationSettings;
}

// Interface para atualizar meta
export interface UpdateGoalDTO {
  title?: string;
  description?: string;
  targetValue?: number;
  status?: GoalStatus;
  isActive?: boolean;
  color?: string;
  icon?: string;
  isCompanyWide?: boolean; // Meta visível para toda a empresa (apenas para scope: company)
  notificationSettings?: NotificationSettings;
}

// Interface para análise detalhada
export interface GoalAnalytics {
  goalId: string;
  title: string;
  currentProgress: number;
  projectedCompletion?: string; // Data projetada de conclusão
  averageDailyProgress: number; // Média de progresso por dia

  // Melhor e pior dia
  bestDay?: {
    date: string;
    value: number;
  };
  worstDay?: {
    date: string;
    value: number;
  };

  // Histórico de progresso
  history: Array<{
    date: string;
    value: number;
    progress: number;
  }>;

  // Insights automáticos
  insights: string[];
}

// Interface para filtros de listagem
export interface GoalFilters {
  type?: GoalType;
  period?: GoalPeriod;
  scope?: GoalScope;
  status?: GoalStatus;
  userId?: string;
  teamId?: string;
  companyIds?: string[]; // Suporte multi-empresa (Admin/Master)
  onlyActive?: boolean;
  search?: string;
}

// Interface para resposta de listagem
export interface GoalsListResponse {
  goals: Goal[];
  total: number;
  active: number;
  completed: number;
  failed: number;
}

// Cores padrão para metas
export const GOAL_COLORS = [
  '#10B981', // Verde
  '#3B82F6', // Azul
  '#8B5CF6', // Roxo
  '#F59E0B', // Laranja
  '#EF4444', // Vermelho
  '#EC4899', // Rosa
  '#14B8A6', // Teal
  '#6366F1', // Indigo
];

// Ícones sugeridos para metas
export const GOAL_ICONS = [
  '🎯',
  '🏆',
  '💰',
  '📈',
  '🚀',
  '⭐',
  '🔥',
  '💎',
  '📊',
  '🎖️',
];
