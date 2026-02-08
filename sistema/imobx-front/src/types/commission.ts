// Tipos para configurações de comissão
export interface CommissionConfig {
  id: string;
  companyId: string;
  saleCommissionPercentage: number;
  rentalCommissionPercentage: number;
  companyProfitPercentage: number;
  companyRentalProfitPercentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommissionConfigDTO {
  saleCommissionPercentage: number;
  rentalCommissionPercentage: number;
  companyProfitPercentage: number;
  companyRentalProfitPercentage: number;
  isActive?: boolean;
}

export interface UpdateCommissionConfigDTO {
  saleCommissionPercentage?: number;
  rentalCommissionPercentage?: number;
  companyProfitPercentage?: number;
  companyRentalProfitPercentage?: number;
  isActive?: boolean;
}

// Tipos para comissões
export type CommissionType = 'SALE' | 'RENTAL';
export type CommissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
export type PaymentMethod = 'BANK_TRANSFER' | 'PIX' | 'CHECK' | 'CASH';

export interface Commission {
  id: string;
  title: string;
  type: CommissionType;
  status: CommissionStatus;
  baseValue: number;
  percentage: number;
  commissionValue: number;
  taxValue: number;
  netValue: number;
  companyId: string;
  userId: string;
  propertyId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  property: {
    id: string;
    title: string;
    salePrice?: number;
    rentPrice?: number;
    address: string;
  };
  expectedPaymentDate: string;
  notes?: string;
  rejectionReason?: string;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  paidBy?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommissionDTO {
  title: string;
  type: CommissionType;
  baseValue: number;
  percentage: number;
  userId: string;
  propertyId: string;
  expectedPaymentDate: string;
  notes?: string;
}

export interface UpdateCommissionDTO {
  percentage?: number;
  taxValue?: number;
  notes?: string;
}

export interface RejectCommissionDTO {
  rejectionReason: string;
}

export interface PayCommissionDTO {
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  notes?: string;
}

export interface CommissionFilters {
  status?: CommissionStatus;
  type?: CommissionType;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CommissionsListResponse {
  data: Commission[];
  total: number;
  page: number;
  limit: number;
}

export interface CommissionReport {
  summary: {
    totalCommissions: number;
    totalValue: number;
    totalPaid: number;
    totalPending: number;
    averageCommission: number;
  };
  byBroker: Array<{
    userId: string;
    name: string;
    count: number;
    totalValue: number;
    paidValue: number;
    pendingValue: number;
  }>;
  byType: {
    SALE: { count: number; value: number };
    RENTAL: { count: number; value: number };
  };
  byStatus: {
    PAID: { count: number; value: number };
    APPROVED: { count: number; value: number };
    PENDING: { count: number; value: number };
    REJECTED: { count: number; value: number };
  };
  period: {
    startDate: string;
    endDate: string;
  };
}

// Labels e constantes
export const COMMISSION_TYPE_LABELS: Record<CommissionType, string> = {
  SALE: 'Venda',
  RENTAL: 'Aluguel',
};

export const COMMISSION_STATUS_LABELS: Record<CommissionStatus, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovada',
  REJECTED: 'Rejeitada',
  PAID: 'Paga',
};

export const COMMISSION_STATUS_COLORS: Record<CommissionStatus, string> = {
  PENDING: '#F59E0B',
  APPROVED: '#10B981',
  REJECTED: '#EF4444',
  PAID: '#3B82F6',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  BANK_TRANSFER: 'Transferência Bancária',
  PIX: 'PIX',
  CHECK: 'Cheque',
  CASH: 'Dinheiro',
};
