// Enums para tipos e status de transações financeiras
export const TransactionType = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
} as const;

export const TransactionCategory = {
  // Receitas
  PROPERTY_SALE: 'property_sale',
  PROPERTY_RENT: 'property_rent',
  COMMISSION: 'commission',
  CONSULTING: 'consulting',
  OTHER_INCOME: 'other_income',

  // Despesas
  MARKETING: 'marketing',
  MAINTENANCE: 'maintenance',
  UTILITIES: 'utilities',
  INSURANCE: 'insurance',
  TAXES: 'taxes',
  OFFICE_SUPPLIES: 'office_supplies',
  PROFESSIONAL_SERVICES: 'professional_services',
  TRAVEL: 'travel',
  OTHER_EXPENSE: 'other_expense',

  // Transferências
  BANK_TRANSFER: 'bank_transfer',
  INVESTMENT: 'investment',
} as const;

export const PaymentMethod = {
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PIX: 'pix',
  CHECK: 'check',
  OTHER: 'other',
} as const;

export const TransactionStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];
export type TransactionCategory =
  (typeof TransactionCategory)[keyof typeof TransactionCategory];
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export type TransactionStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];

// Interface principal da transação financeira
export interface FinancialTransaction {
  id: string;
  title: string;
  description?: string;
  type: TransactionType;
  category: TransactionCategory;
  categoryLabel?: string;
  amount: number;
  transactionDate: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  documentNumber?: string;
  notes?: string;
  tags: string[];
  isActive: boolean;
  companyId: string;
  responsibleUserId: string;
  propertyId?: string;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    title: string;
    address: string;
  };
  responsibleUser?: {
    id: string;
    name: string;
    email: string;
  };
}

// Interface para criação de transação
export interface CreateFinancialTransactionData {
  title: string;
  description?: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  transactionDate: string;
  paymentMethod?: PaymentMethod;
  status?: TransactionStatus;
  documentNumber?: string;
  notes?: string;
  tags?: string[];
  propertyId?: string;
}

// Interface para atualização de transação
export interface UpdateFinancialTransactionData
  extends Partial<CreateFinancialTransactionData> {
  id?: string;
  isActive?: boolean;
}

// Interface para filtros de transações
export interface FinancialTransactionFilters {
  type?: TransactionType;
  category?: TransactionCategory;
  status?: TransactionStatus;
  paymentMethod?: PaymentMethod;
  propertyId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  tags?: string[];
  onlyMyData?: boolean;
}

// Interface para opções de paginação
export interface PaginationOptions {
  page: number;
  limit: number;
}

// Interface para resposta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface para resposta de transações
export interface FinancialTransactionResponse {
  data: FinancialTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface para resumo financeiro
export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  transactionCount: number;
  averageTransaction: number;
}

// Interface para resumo por categoria
export interface CategorySummary {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

// Interface para resumo mensal
export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  netIncome: number;
  transactionCount: number;
}

// Opções para select de tipos
export const TransactionTypeOptions = [
  { value: TransactionType.INCOME, label: 'Receita' },
  { value: TransactionType.EXPENSE, label: 'Despesa' },
  { value: TransactionType.TRANSFER, label: 'Transferência' },
];

// Opções para select de categorias
export const TransactionCategoryOptions = [
  // Receitas
  {
    value: TransactionCategory.PROPERTY_SALE,
    label: 'Venda de Imóvel',
    type: 'income',
  },
  {
    value: TransactionCategory.PROPERTY_RENT,
    label: 'Aluguel de Imóvel',
    type: 'income',
  },
  { value: TransactionCategory.COMMISSION, label: 'Comissão', type: 'income' },
  {
    value: TransactionCategory.CONSULTING,
    label: 'Consultoria',
    type: 'income',
  },
  {
    value: TransactionCategory.OTHER_INCOME,
    label: 'Outras Receitas',
    type: 'income',
  },

  // Despesas
  { value: TransactionCategory.MARKETING, label: 'Marketing', type: 'expense' },
  {
    value: TransactionCategory.MAINTENANCE,
    label: 'Manutenção',
    type: 'expense',
  },
  {
    value: TransactionCategory.UTILITIES,
    label: 'Utilidades',
    type: 'expense',
  },
  { value: TransactionCategory.INSURANCE, label: 'Seguro', type: 'expense' },
  { value: TransactionCategory.TAXES, label: 'Impostos', type: 'expense' },
  {
    value: TransactionCategory.OFFICE_SUPPLIES,
    label: 'Material de Escritório',
    type: 'expense',
  },
  {
    value: TransactionCategory.PROFESSIONAL_SERVICES,
    label: 'Serviços Profissionais',
    type: 'expense',
  },
  { value: TransactionCategory.TRAVEL, label: 'Viagens', type: 'expense' },
  {
    value: TransactionCategory.OTHER_EXPENSE,
    label: 'Outras Despesas',
    type: 'expense',
  },

  // Transferências
  {
    value: TransactionCategory.BANK_TRANSFER,
    label: 'Transferência Bancária',
    type: 'transfer',
  },
  {
    value: TransactionCategory.INVESTMENT,
    label: 'Investimento',
    type: 'transfer',
  },
];

// Opções para select de métodos de pagamento
export const PaymentMethodOptions = [
  { value: PaymentMethod.CASH, label: 'Dinheiro' },
  { value: PaymentMethod.BANK_TRANSFER, label: 'Transferência Bancária' },
  { value: PaymentMethod.CREDIT_CARD, label: 'Cartão de Crédito' },
  { value: PaymentMethod.DEBIT_CARD, label: 'Cartão de Débito' },
  { value: PaymentMethod.PIX, label: 'PIX' },
  { value: PaymentMethod.CHECK, label: 'Cheque' },
  { value: PaymentMethod.OTHER, label: 'Outro' },
];

// Opções para select de status
export const TransactionStatusOptions = [
  { value: TransactionStatus.PENDING, label: 'Pendente' },
  { value: TransactionStatus.COMPLETED, label: 'Concluída' },
  { value: TransactionStatus.CANCELLED, label: 'Cancelada' },
  { value: TransactionStatus.REFUNDED, label: 'Reembolsada' },
];

// Função para obter categorias por tipo
export const getCategoriesByType = (type: TransactionType) => {
  return TransactionCategoryOptions.filter(category => category.type === type);
};

// Função para obter label da categoria
export const getCategoryLabel = (category: TransactionCategory) => {
  const option = TransactionCategoryOptions.find(opt => opt.value === category);
  return option?.label || category;
};

// Função para obter label do tipo
export const getTypeLabel = (type: TransactionType) => {
  const option = TransactionTypeOptions.find(opt => opt.value === type);
  return option?.label || type;
};

// Função para obter label do método de pagamento
export const getPaymentMethodLabel = (method: PaymentMethod) => {
  const option = PaymentMethodOptions.find(opt => opt.value === method);
  return option?.label || method;
};

// Função para obter label do status
export const getStatusLabel = (status: TransactionStatus) => {
  const option = TransactionStatusOptions.find(opt => opt.value === status);
  return option?.label || status;
};

// Função para formatar valor monetário
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Função para obter cor do tipo de transação
export const getTransactionTypeColor = (type: TransactionType) => {
  const colors = {
    [TransactionType.INCOME]: '#52c41a', // Verde
    [TransactionType.EXPENSE]: '#ff4d4f', // Vermelho
    [TransactionType.TRANSFER]: '#1890ff', // Azul
  };
  return colors[type] || '#666';
};

// Função para obter cor do status
export const getStatusColor = (status: TransactionStatus) => {
  const colors = {
    [TransactionStatus.PENDING]: '#faad14', // Amarelo
    [TransactionStatus.COMPLETED]: '#52c41a', // Verde
    [TransactionStatus.CANCELLED]: '#ff4d4f', // Vermelho
    [TransactionStatus.REFUNDED]: '#722ed1', // Roxo
  };
  return colors[status] || '#666';
};

// Financial Approval Types
export const ApprovalRequestType = {
  SALE: 'sale',
  RENTAL: 'rental',
} as const;

export const ApprovalRequestStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type ApprovalRequestType =
  (typeof ApprovalRequestType)[keyof typeof ApprovalRequestType];
export type ApprovalRequestStatus =
  (typeof ApprovalRequestStatus)[keyof typeof ApprovalRequestStatus];

export interface FinancialApprovalRequest {
  id: string;
  type?: ApprovalRequestType;
  status: ApprovalRequestStatus;
  baseValue?: number;
  commissionPercentage?: number;
  commissionValue?: number;
  companyProfitPercentage?: number;
  companyProfitValue?: number;
  companyNetValue?: number;
  editedBaseValue?: number | null;
  editedCommissionValue?: number | null;
  notes?: string | null;
  financialNotes?: string | null;
  companyId: string;
  requestedByUserId?: string;
  requestedBy?: {
    id: string;
    name: string;
    email: string;
  };
  reviewedByUserId?: string | null;
  reviewedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  propertyId?: string;
  property?: {
    id: string;
    title: string;
    code?: string;
  };
  // Campos para compatibilidade com aprovações de vistoria
  approvalType?: string;
  requesterName?: string;
  inspectionTitle?: string;
  amount?: number | string;
  inspectionId?: string;
  propertyCode?: string;
  commissionId?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApprovalRequestData {
  type: ApprovalRequestType;
  propertyId: string;
  baseValue?: number;
  notes?: string;
}

export interface ApproveRequestData {
  editedBaseValue?: number;
  editedCommissionValue?: number;
  financialNotes?: string;
}

export interface RejectRequestData {
  financialNotes: string;
}

export const ApprovalRequestTypeOptions = [
  { value: ApprovalRequestType.SALE, label: 'Venda' },
  { value: ApprovalRequestType.RENTAL, label: 'Aluguel' },
];

export const ApprovalRequestStatusOptions = [
  { value: ApprovalRequestStatus.PENDING, label: 'Pendente' },
  { value: ApprovalRequestStatus.APPROVED, label: 'Aprovado' },
  { value: ApprovalRequestStatus.REJECTED, label: 'Recusado' },
];

export const getApprovalTypeLabel = (type: ApprovalRequestType) => {
  const option = ApprovalRequestTypeOptions.find(opt => opt.value === type);
  return option?.label || type;
};

export const getApprovalStatusLabel = (status: ApprovalRequestStatus) => {
  const option = ApprovalRequestStatusOptions.find(opt => opt.value === status);
  return option?.label || status;
};

export const getApprovalStatusColor = (status: ApprovalRequestStatus) => {
  const colors = {
    [ApprovalRequestStatus.PENDING]: '#faad14', // Amarelo
    [ApprovalRequestStatus.APPROVED]: '#52c41a', // Verde
    [ApprovalRequestStatus.REJECTED]: '#ff4d4f', // Vermelho
  };
  return colors[status] || '#666';
};
