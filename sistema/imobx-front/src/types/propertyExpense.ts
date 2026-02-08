// Enums para tipos e status de despesas de propriedade
export const PropertyExpenseType = {
  IPTU: 'iptu',
  CONDOMINIUM: 'condominium',
  INSURANCE: 'insurance',
  MAINTENANCE: 'maintenance',
  REPAIR: 'repair',
  UTILITIES: 'utilities',
  TAX: 'tax',
  OTHER: 'other',
} as const;

export const PropertyExpenseStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
} as const;

export const RecurrenceFrequency = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
} as const;

export const NotificationAdvanceDays = {
  SEVEN: 7,
  FIFTEEN: 15,
  THIRTY: 30,
  SIXTY: 60,
  NINETY: 90,
} as const;

export type PropertyExpenseType =
  (typeof PropertyExpenseType)[keyof typeof PropertyExpenseType];
export type PropertyExpenseStatus =
  (typeof PropertyExpenseStatus)[keyof typeof PropertyExpenseStatus];
export type RecurrenceFrequency =
  (typeof RecurrenceFrequency)[keyof typeof RecurrenceFrequency];
export type NotificationAdvanceDays =
  (typeof NotificationAdvanceDays)[keyof typeof NotificationAdvanceDays];

// Interface para configuração de recorrência
export interface RecurrenceConfig {
  frequency: RecurrenceFrequency;
  dayOfMonth?: number; // Para mensal e anual
  monthOfYear?: number; // Para anual
  endDate?: string; // Data final (YYYY-MM-DD)
  occurrences?: number; // Número máximo de ocorrências
}

// Interface principal da despesa de propriedade
export interface PropertyExpense {
  id: string;
  title: string;
  description?: string;
  type: PropertyExpenseType;
  amount: number;
  dueDate: string;
  status: PropertyExpenseStatus;
  paidDate?: string;
  isRecurring: boolean;
  recurrenceConfig?: RecurrenceConfig;
  enableNotification: boolean;
  notificationAdvanceDays?: NotificationAdvanceDays;
  lastNotifiedAt?: string;
  createFinancialPending: boolean;
  financialPendingId?: string;
  propertyId: string;
  companyId: string;
  responsibleUserId: string;
  createdAt: string;
  updatedAt: string;
  // Relacionamentos
  property?: {
    id: string;
    title: string;
    address: string;
    code?: string;
  };
  responsibleUser?: {
    id: string;
    name: string;
    email: string;
  };
  financialPending?: {
    id: string;
    status: string;
  };
}

// Interface para criação de despesa
export interface CreatePropertyExpenseData {
  title: string;
  description?: string;
  type: PropertyExpenseType;
  amount: number;
  dueDate: string;
  isRecurring?: boolean;
  recurrenceConfig?: RecurrenceConfig;
  enableNotification?: boolean;
  notificationAdvanceDays?: NotificationAdvanceDays;
  createFinancialPending?: boolean;
  notes?: string;
  documentNumber?: string;
}

// Interface para atualização de despesa
export interface UpdatePropertyExpenseData
  extends Partial<CreatePropertyExpenseData> {
  id?: string;
  status?: PropertyExpenseStatus;
  paidDate?: string;
}

// Interface para filtros de despesas
export interface PropertyExpenseFilters {
  status?: PropertyExpenseStatus;
  type?: PropertyExpenseType;
  startDate?: string;
  endDate?: string;
  propertyId?: string;
  search?: string;
  onlyMyData?: boolean;
}

// Interface para resposta paginada
export interface PaginatedPropertyExpenseResponse {
  data: PropertyExpense[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface para resumo de despesas
export interface PropertyExpenseSummary {
  totalPending: number;
  totalOverdue: number;
  totalPaid: number;
  totalCancelled: number;
  totalPendingAmount: number;
  totalOverdueAmount: number;
  totalPaidAmount: number; // Valor total das despesas pagas
  totalAmount: number; // Valor total de todas as despesas
  upcomingExpenses?: PropertyExpense[]; // Próximas 7 dias (opcional)
}

// Opções para select de tipos
export const PropertyExpenseTypeOptions = [
  { value: PropertyExpenseType.IPTU, label: 'IPTU' },
  { value: PropertyExpenseType.CONDOMINIUM, label: 'Condomínio' },
  { value: PropertyExpenseType.INSURANCE, label: 'Seguro' },
  { value: PropertyExpenseType.MAINTENANCE, label: 'Manutenção' },
  { value: PropertyExpenseType.REPAIR, label: 'Reparo' },
  { value: PropertyExpenseType.UTILITIES, label: 'Utilidades' },
  { value: PropertyExpenseType.TAX, label: 'Imposto' },
  { value: PropertyExpenseType.OTHER, label: 'Outra' },
];

// Opções para select de status
export const PropertyExpenseStatusOptions = [
  { value: PropertyExpenseStatus.PENDING, label: 'Pendente' },
  { value: PropertyExpenseStatus.PAID, label: 'Paga' },
  { value: PropertyExpenseStatus.OVERDUE, label: 'Vencida' },
  { value: PropertyExpenseStatus.CANCELLED, label: 'Cancelada' },
];

// Opções para select de frequência de recorrência
export const RecurrenceFrequencyOptions = [
  { value: RecurrenceFrequency.MONTHLY, label: 'Mensal' },
  { value: RecurrenceFrequency.QUARTERLY, label: 'Trimestral' },
  { value: RecurrenceFrequency.YEARLY, label: 'Anual' },
];

// Opções para select de dias de antecedência
export const NotificationAdvanceDaysOptions = [
  { value: NotificationAdvanceDays.SEVEN, label: '7 dias' },
  { value: NotificationAdvanceDays.FIFTEEN, label: '15 dias' },
  { value: NotificationAdvanceDays.THIRTY, label: '30 dias' },
  { value: NotificationAdvanceDays.SIXTY, label: '60 dias' },
  { value: NotificationAdvanceDays.NINETY, label: '90 dias' },
];

// Funções auxiliares
export const getExpenseTypeLabel = (type: PropertyExpenseType): string => {
  const option = PropertyExpenseTypeOptions.find(opt => opt.value === type);
  return option?.label || type;
};

export const getExpenseStatusLabel = (
  status: PropertyExpenseStatus
): string => {
  const option = PropertyExpenseStatusOptions.find(opt => opt.value === status);
  return option?.label || status;
};

export const getExpenseStatusColor = (
  status: PropertyExpenseStatus
): string => {
  const colors = {
    [PropertyExpenseStatus.PENDING]: '#faad14', // Amarelo
    [PropertyExpenseStatus.PAID]: '#52c41a', // Verde
    [PropertyExpenseStatus.OVERDUE]: '#ff4d4f', // Vermelho
    [PropertyExpenseStatus.CANCELLED]: '#8c8c8c', // Cinza
  };
  return colors[status] || '#666';
};

export const getExpenseTypeColor = (type: PropertyExpenseType): string => {
  const colors = {
    [PropertyExpenseType.IPTU]: '#1890ff',
    [PropertyExpenseType.CONDOMINIUM]: '#722ed1',
    [PropertyExpenseType.INSURANCE]: '#13c2c2',
    [PropertyExpenseType.MAINTENANCE]: '#fa8c16',
    [PropertyExpenseType.REPAIR]: '#eb2f96',
    [PropertyExpenseType.UTILITIES]: '#52c41a',
    [PropertyExpenseType.TAX]: '#f5222d',
    [PropertyExpenseType.OTHER]: '#8c8c8c',
  };
  return colors[type] || '#666';
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const isExpenseOverdue = (
  dueDate: string,
  status: PropertyExpenseStatus
): boolean => {
  if (
    status === PropertyExpenseStatus.PAID ||
    status === PropertyExpenseStatus.CANCELLED
  ) {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

export const getDaysUntilDue = (dueDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isExpenseUpcoming = (
  dueDate: string,
  days: number = 7
): boolean => {
  const daysUntilDue = getDaysUntilDue(dueDate);
  return daysUntilDue >= 0 && daysUntilDue <= days;
};
