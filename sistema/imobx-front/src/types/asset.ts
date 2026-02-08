// Enums para categorias e status de patrimônio
export const AssetCategory = {
  ELECTRONICS: 'electronics',
  FURNITURE: 'furniture',
  VEHICLE: 'vehicle',
  OFFICE_SUPPLIES: 'office_supplies',
  BUILDING_EQUIPMENT: 'building_equipment',
  OTHER: 'other',
} as const;

export const AssetStatus = {
  AVAILABLE: 'available',
  IN_USE: 'in_use',
  MAINTENANCE: 'maintenance',
  DISPOSED: 'disposed',
  LOST: 'lost',
} as const;

export const MovementType = {
  ENTRY: 'entry',
  EXIT: 'exit',
  TRANSFER: 'transfer',
  STATUS_CHANGE: 'status_change',
  MAINTENANCE: 'maintenance',
} as const;

export type AssetCategory = (typeof AssetCategory)[keyof typeof AssetCategory];
export type AssetStatus = (typeof AssetStatus)[keyof typeof AssetStatus];
export type MovementType = (typeof MovementType)[keyof typeof MovementType];

// Interface principal do patrimônio
export interface Asset {
  id: string;
  name: string;
  description?: string;
  category: AssetCategory;
  status: AssetStatus;
  value: number;
  serialNumber?: string;
  brand?: string;
  model?: string;
  acquisitionDate?: string;
  location?: string;
  notes?: string;
  company: {
    id: string;
    name: string;
  };
  assignedToUser?: {
    id: string;
    name: string;
    email: string;
  };
  property?: {
    id: string;
    title: string;
    code: string;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  movements?: AssetMovement[];
}

// Interface para movimentação de patrimônio
export interface AssetMovement {
  id: string;
  type: MovementType;
  movementDate: string;
  reason: string;
  fromUser?: {
    id: string;
    name: string;
  };
  toUser?: {
    id: string;
    name: string;
  };
  fromProperty?: {
    id: string;
    title: string;
  };
  toProperty?: {
    id: string;
    title: string;
  };
  previousStatus?: string;
  newStatus?: string;
  notes?: string;
  recordedBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}

// Interface para estatísticas de patrimônio
export interface AssetStats {
  total: number;
  totalValue: number;
  byStatus: Record<AssetStatus, number>;
  byCategory: Record<string, number>;
}

// Interface para resposta de lista de patrimônios
export interface AssetListResponse {
  assets: Asset[];
  total: number;
}

// DTOs de Request
export interface CreateAssetDto {
  name: string;
  description?: string;
  category: AssetCategory;
  status?: AssetStatus;
  value: number;
  serialNumber?: string;
  brand?: string;
  model?: string;
  acquisitionDate?: string;
  location?: string;
  notes?: string;
  assignedToUserId?: string;
  propertyId?: string;
}

export interface UpdateAssetDto {
  name?: string;
  description?: string;
  category?: AssetCategory;
  status?: AssetStatus;
  value?: number;
  serialNumber?: string;
  brand?: string;
  model?: string;
  acquisitionDate?: string;
  location?: string;
  notes?: string;
  assignedToUserId?: string;
  propertyId?: string;
}

export interface TransferAssetDto {
  toUserId?: string;
  toPropertyId?: string;
  reason: string;
  notes?: string;
}

export interface CreateAssetMovementDto {
  assetId: string;
  type: MovementType;
  movementDate: string;
  reason: string;
  fromUserId?: string;
  toUserId?: string;
  fromPropertyId?: string;
  toPropertyId?: string;
  previousStatus?: string;
  newStatus?: string;
  notes?: string;
}

export interface AssetQueryParams {
  status?: AssetStatus;
  category?: AssetCategory;
  assignedToUserId?: string;
  propertyId?: string;
  search?: string;
  page?: number;
  limit?: number;
  onlyMyData?: boolean;
}

// Opções para selects
export const AssetCategoryOptions = [
  { value: AssetCategory.ELECTRONICS, label: 'Eletrônicos' },
  { value: AssetCategory.FURNITURE, label: 'Mobiliário' },
  { value: AssetCategory.VEHICLE, label: 'Veículos' },
  { value: AssetCategory.OFFICE_SUPPLIES, label: 'Materiais de Escritório' },
  { value: AssetCategory.BUILDING_EQUIPMENT, label: 'Equipamentos Prediais' },
  { value: AssetCategory.OTHER, label: 'Outros' },
];

export const AssetStatusOptions = [
  { value: AssetStatus.AVAILABLE, label: 'Disponível' },
  { value: AssetStatus.IN_USE, label: 'Em Uso' },
  { value: AssetStatus.MAINTENANCE, label: 'Em Manutenção' },
  { value: AssetStatus.DISPOSED, label: 'Baixado' },
  { value: AssetStatus.LOST, label: 'Perdido' },
];

export const MovementTypeOptions = [
  { value: MovementType.ENTRY, label: 'Entrada/Aquisição' },
  { value: MovementType.EXIT, label: 'Saída/Baixa' },
  { value: MovementType.TRANSFER, label: 'Transferência' },
  { value: MovementType.STATUS_CHANGE, label: 'Mudança de Status' },
  { value: MovementType.MAINTENANCE, label: 'Manutenção' },
];

// Função auxiliar para formatar valor monetário
export const formatAssetValue = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Função auxiliar para obter label de categoria
export const getCategoryLabel = (category: AssetCategory): string => {
  const option = AssetCategoryOptions.find(opt => opt.value === category);
  return option?.label || category;
};

// Função auxiliar para obter label de status
export const getStatusLabel = (status: AssetStatus): string => {
  const option = AssetStatusOptions.find(opt => opt.value === status);
  return option?.label || status;
};

// Função auxiliar para obter label de tipo de movimentação
export const getMovementTypeLabel = (type: MovementType): string => {
  const option = MovementTypeOptions.find(opt => opt.value === type);
  return option?.label || type;
};
