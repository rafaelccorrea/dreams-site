// Interface do Cônjuge
export interface Spouse {
  id: string;
  clientId: string;

  // Dados pessoais
  name: string;
  cpf: string;
  rg?: string;
  birthDate?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;

  // Dados profissionais
  profession?: string;
  companyName?: string;
  jobPosition?: string;
  monthlyIncome?: number;
  jobStartDate?: string;
  isCurrentlyWorking?: boolean;
  isRetired?: boolean;

  // Observações
  notes?: string;

  createdAt: string;
  updatedAt: string;
}

// DTOs para API
export interface CreateSpouseDto {
  name: string;
  cpf: string;
  rg?: string;
  birthDate?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  profession?: string;
  companyName?: string;
  jobPosition?: string;
  monthlyIncome?: number;
  jobStartDate?: string;
  isCurrentlyWorking?: boolean;
  isRetired?: boolean;
  notes?: string;
}

export interface UpdateSpouseDto extends Partial<CreateSpouseDto> {}
