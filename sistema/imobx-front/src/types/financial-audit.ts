export const AuditAction = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  RESTORE: 'restore',
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export interface FinancialTransactionAudit {
  id: string;
  transactionId: string;
  action: AuditAction;
  performedByUserId: string;
  performedByName: string;
  performedByEmail: string;
  oldValues?: any;
  newValues?: any;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  // Campos da transação para facilitar exibição
  transactionTitle: string;
  transactionAmount: number;
  transactionType: string;
}

export interface FinancialTransactionAuditFilters {
  transactionId?: string;
  action?: AuditAction;
  performedByUserId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface FinancialTransactionAuditResponse {
  data: FinancialTransactionAudit[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Funções utilitárias para exibição
export const getAuditActionLabel = (action: AuditAction): string => {
  const labels = {
    [AuditAction.CREATE]: 'Criado',
    [AuditAction.UPDATE]: 'Atualizado',
    [AuditAction.DELETE]: 'Excluído',
    [AuditAction.RESTORE]: 'Restaurado',
  };
  return labels[action] || action;
};

export const getAuditActionColor = (action: AuditAction): string => {
  const colors = {
    [AuditAction.CREATE]: 'var(--color-success)',
    [AuditAction.UPDATE]: 'var(--color-warning)',
    [AuditAction.DELETE]: 'var(--color-error)',
    [AuditAction.RESTORE]: 'var(--color-info)',
  };
  return colors[action] || 'var(--color-text-secondary)';
};

export const getAuditActionIcon = (action: AuditAction): string => {
  const icons = {
    [AuditAction.CREATE]: 'plus-circle',
    [AuditAction.UPDATE]: 'edit',
    [AuditAction.DELETE]: 'delete',
    [AuditAction.RESTORE]: 'undo',
  };
  return icons[action] || 'info-circle';
};

// Função para formatar diferenças entre valores antigos e novos
export const formatAuditChanges = (
  oldValues: any,
  newValues: any
): string[] => {
  const changes: string[] = [];

  if (!oldValues || !newValues) return changes;

  const allKeys = new Set([
    ...Object.keys(oldValues),
    ...Object.keys(newValues),
  ]);

  allKeys.forEach(key => {
    const oldValue = oldValues[key];
    const newValue = newValues[key];

    if (oldValue !== newValue) {
      const formattedKey = formatFieldLabel(key);
      const formattedOldValue = formatFieldValue(key, oldValue);
      const formattedNewValue = formatFieldValue(key, newValue);

      changes.push(
        `${formattedKey}: ${formattedOldValue} → ${formattedNewValue}`
      );
    }
  });

  return changes;
};

const formatFieldLabel = (key: string): string => {
  const labels: Record<string, string> = {
    title: 'Título',
    description: 'Descrição',
    type: 'Tipo',
    category: 'Categoria',
    amount: 'Valor',
    transactionDate: 'Data',
    paymentMethod: 'Método de Pagamento',
    status: 'Status',
    documentNumber: 'Número do Documento',
    notes: 'Observações',
    tags: 'Tags',
    propertyId: 'Propriedade',
    responsibleUserId: 'Responsável',
    isActive: 'Ativo',
  };
  return labels[key] || key;
};

const formatFieldValue = (key: string, value: any): string => {
  if (value === null || value === undefined) return 'Não informado';

  switch (key) {
    case 'amount':
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(Number(value));
    case 'transactionDate':
      return new Date(value).toLocaleDateString('pt-BR');
    case 'type':
      return getTypeLabel(value);
    case 'category':
      return getCategoryLabel(value);
    case 'status':
      return getStatusLabel(value);
    case 'paymentMethod':
      return getPaymentMethodLabel(value);
    case 'tags':
      return Array.isArray(value) ? value.join(', ') : value;
    default:
      return String(value);
  }
};

// Funções de formatação locais para evitar dependência circular
const getTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    income: 'Receita',
    expense: 'Despesa',
    transfer: 'Transferência',
  };
  return typeLabels[type] || type;
};

const getCategoryLabel = (category: string): string => {
  const categoryLabels: Record<string, string> = {
    property_sale: 'Venda de Imóvel',
    property_rent: 'Aluguel de Imóvel',
    commission: 'Comissão',
    consulting: 'Consultoria',
    other_income: 'Outras Receitas',
    marketing: 'Marketing',
    maintenance: 'Manutenção',
    utilities: 'Utilidades',
    insurance: 'Seguro',
    taxes: 'Impostos',
    office_supplies: 'Material de Escritório',
    professional_services: 'Serviços Profissionais',
    travel: 'Viagens',
    other_expense: 'Outras Despesas',
    bank_transfer: 'Transferência Bancária',
    investment: 'Investimento',
  };
  return categoryLabels[category] || category;
};

const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    pending: 'Pendente',
    completed: 'Concluída',
    cancelled: 'Cancelada',
    refunded: 'Reembolsada',
  };
  return statusLabels[status] || status;
};

const getPaymentMethodLabel = (method: string): string => {
  const methodLabels: Record<string, string> = {
    cash: 'Dinheiro',
    bank_transfer: 'Transferência Bancária',
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    pix: 'PIX',
    check: 'Cheque',
    other: 'Outro',
  };
  return methodLabels[method] || method;
};
