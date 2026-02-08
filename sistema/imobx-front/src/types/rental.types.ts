export const RentalStatus = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
} as const;

export type RentalStatus = (typeof RentalStatus)[keyof typeof RentalStatus];

export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
  PARTIAL: 'partial',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentMethod = {
  CASH: 'cash',
  PIX: 'pix',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  CHECK: 'check',
  BANK_SLIP: 'bank_slip',
  OTHER: 'other',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

// Mapeamento de status de aluguel para pt-br
export const RentalStatusLabels: Record<RentalStatus, string> = {
  [RentalStatus.ACTIVE]: 'Ativo',
  [RentalStatus.EXPIRED]: 'Expirado',
  [RentalStatus.CANCELLED]: 'Cancelado',
  [RentalStatus.PENDING]: 'Pendente',
};

// Mapeamento de status de pagamento para pt-br
export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pendente',
  [PaymentStatus.PAID]: 'Pago',
  [PaymentStatus.OVERDUE]: 'Atrasado',
  [PaymentStatus.CANCELLED]: 'Cancelado',
  [PaymentStatus.PARTIAL]: 'Parcial',
};

// Mapeamento de métodos de pagamento para pt-br
export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Dinheiro',
  [PaymentMethod.PIX]: 'PIX',
  [PaymentMethod.BANK_TRANSFER]: 'Transferência Bancária',
  [PaymentMethod.CREDIT_CARD]: 'Cartão de Crédito',
  [PaymentMethod.DEBIT_CARD]: 'Cartão de Débito',
  [PaymentMethod.CHECK]: 'Cheque',
  [PaymentMethod.BANK_SLIP]: 'Boleto Bancário',
  [PaymentMethod.OTHER]: 'Outro',
};

// Cores para status de aluguel
export const RentalStatusColors: Record<RentalStatus, string> = {
  [RentalStatus.ACTIVE]: '#10b981',
  [RentalStatus.PENDING]: '#f59e0b',
  [RentalStatus.EXPIRED]: '#ef4444',
  [RentalStatus.CANCELLED]: '#6b7280',
};

// Cores para status de pagamento
export const PaymentStatusColors: Record<PaymentStatus, string> = {
  [PaymentStatus.PAID]: '#10b981',
  [PaymentStatus.PENDING]: '#f59e0b',
  [PaymentStatus.OVERDUE]: '#ef4444',
  [PaymentStatus.CANCELLED]: '#6b7280',
  [PaymentStatus.PARTIAL]: '#8b5cf6',
};

// Opções para selects de status de aluguel
export const RentalStatusOptions = Object.entries(RentalStatusLabels).map(
  ([value, label]) => ({
    value,
    label,
  })
);

// Opções para selects de status de pagamento
export const PaymentStatusOptions = Object.entries(PaymentStatusLabels).map(
  ([value, label]) => ({
    value,
    label,
  })
);

// Opções para selects de métodos de pagamento
export const PaymentMethodOptions = Object.entries(PaymentMethodLabels).map(
  ([value, label]) => ({
    value,
    label,
  })
);

export interface RentalPayment {
  id: string;
  dueDate: string;
  paymentDate?: string;
  value: number;
  paidValue?: number;
  discountValue?: number;
  interestValue?: number;
  fineValue?: number;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  referenceMonth: string;
  observations?: string;
  receiptUrl?: string;
}

export interface Rental {
  id: string;
  tenantName: string;
  tenantDocument: string;
  tenantPhone?: string;
  tenantEmail?: string;
  startDate: string;
  endDate: string;
  monthlyValue: number;
  dueDay: number;
  status: RentalStatus;
  observations?: string;
  depositValue?: number;
  autoGeneratePayments: boolean;
  propertyId: string;
  property?: {
    id: string;
    title: string;
    address?: string;
    type?: string;
    street?: string;
    number?: string;
    complement?: string;
    city?: string;
    state?: string;
    neighborhood?: string;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpaces?: number;
    totalArea?: number;
    code?: string;
    mainImage?: {
      id: string;
      fileUrl: string;
      fileName: string;
      altText?: string;
    };
  };
  payments?: RentalPayment[];
  companyId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRentalRequest {
  tenantName: string;
  tenantDocument: string;
  tenantPhone?: string;
  tenantEmail?: string;
  startDate: string;
  endDate: string;
  monthlyValue: number;
  dueDay: number;
  propertyId: string;
  observations?: string;
  depositValue?: number;
  autoGeneratePayments?: boolean;
  sendBilletByEmail?: boolean;
}

export interface UpdateRentalRequest extends Partial<CreateRentalRequest> {
  status?: RentalStatus;
}

export interface RentalFilter {
  propertyId?: string;
  status?: RentalStatus;
  tenantName?: string;
  tenantDocument?: string;
  search?: string;
  startDateFrom?: string;
  startDateTo?: string;
  page?: number;
  limit?: number;
}

export interface RentalListResponse {
  rentals: Rental[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePaymentRequest {
  dueDate: string;
  value: number;
  referenceMonth: string;
  observations?: string;
}

export interface UpdatePaymentRequest {
  paymentDate?: string;
  paidValue?: number;
  discountValue?: number;
  interestValue?: number;
  fineValue?: number;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  observations?: string;
  receiptUrl?: string;
}
