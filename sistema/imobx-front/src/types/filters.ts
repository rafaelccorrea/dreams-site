// Tipos para filtros de documentos
export interface DocumentFilters {
  type?: string;
  status?: string;
  clientId?: string;
  propertyId?: string;
  tags?: string[];
  search?: string;
  onlyMyDocuments?: boolean;
}

// Tipos para filtros de agendamentos
export interface AppointmentFilters {
  startDate?: string;
  endDate?: string;
  type?: string;
  status?: string;
  visibility?: string;
  userId?: string;
  propertyId?: string;
  clientId?: string;
  search?: string;
  isRecurring?: boolean;
  isActive?: boolean;
  onlyMyData?: boolean;
}

// Tipos para filtros de usuários
export interface UserFilters {
  role?: string;
  name?: string;
  email?: string;
  isActive?: boolean;
  onlyMyData?: boolean;
}

// Tipos para filtros de clientes
export interface ClientFilters {
  // Texto e campos básicos
  name?: string; // Backend aceita name (ILIKE)
  email?: string; // ILIKE
  phone?: string; // ILIKE nos telefones
  search?: string; // busca geral: nome, email, cpf, telefones
  document?: string; // CPF com/sem máscara

  // Localização
  city?: string; // ILIKE
  neighborhood?: string; // ILIKE
  state?: string;

  // Classificações
  type?: string; // enum backend
  status?: string; // enum backend

  // Escopo e estado
  responsibleUserId?: string;
  isActive?: boolean;
  onlyMyData?: boolean;

  // Período de criação
  createdFrom?: string; // ISO string
  createdTo?: string; // ISO string (backend inclui 23:59:59)

  // Paginação
  page?: number; // padrão 1
  limit?: number; // padrão 50, máx 100

  // Ordenação
  sortBy?: 'name' | 'createdAt' | 'status' | 'type' | 'city';
  sortOrder?: 'ASC' | 'DESC';
}

// Tipos para filtros de transações financeiras
export interface FinancialTransactionFilters {
  type?: string;
  category?: string;
  status?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  onlyMyData?: boolean;
}

// Tipos para filtros de aluguéis
export interface RentalFilters {
  status?: string;
  propertyId?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  minValue?: number;
  maxValue?: number;
  search?: string;
  onlyMyData?: boolean;
}

// Tipos para filtros de comissões
export interface CommissionFilters {
  status?: string;
  userId?: string;
  propertyId?: string;
  month?: number;
  year?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
  onlyMyData?: boolean;
}

// Tipos para filtros de galeria
export interface GalleryFilters {
  status?: string;
  type?: string;
  city?: string;
  limit?: number;
  page?: number;
  onlyMyData?: boolean;
}

// Tipos para filtros de inspeções/vistorias
export interface InspectionFilters {
  status?: string;
  type?: string;
  propertyId?: string;
  inspectorId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  onlyMyData?: boolean;
}

// Tipos para filtros de chaves
export interface KeyFilters {
  status?: string;
  propertyId?: string;
  search?: string;
  onlyMyData?: boolean;
}

// Tipos para filtros de notas
export interface NoteFilters {
  search?: string;
  type?: string;
  priority?: string;
  status?: string;
  tag?: string;
  isPinned?: boolean;
  hasReminder?: boolean;
  clientName?: string;
  reminderDateFrom?: string;
  reminderDateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  onlyMyData?: boolean;
}

// Tipos para filtros de times/equipes
export interface TeamFilters {
  teamName?: string;
  memberName?: string;
  tag?: string;
  status?: string;
  color?: string;
  dateRange?: string;
  search?: string;
  page?: string;
  limit?: string;
  onlyMyData?: boolean;
}
