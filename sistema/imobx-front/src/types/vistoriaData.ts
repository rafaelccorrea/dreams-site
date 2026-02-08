export interface Vistoria {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: string;
  status: string;
  dataAgendada: string;
  dataInicio?: string;
  dataConclusao?: string;
  observacoes?: string;
  checklist?: Record<string, any>;
  fotos?: string[];
  valor?: number;
  responsavelNome?: string;
  responsavelDocumento?: string;
  responsavelTelefone?: string;
  companyId: string;
  propertyId: string;
  userId: string;
  vistoriadorId?: string;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    titulo: string;
    endereco: string;
  };
  user?: {
    id: string;
    nome: string;
    email: string;
  };
  vistoriador?: {
    id: string;
    nome: string;
    email: string;
  };
}

export const VISTORIA_STATUS_LABELS = {
  agendada: 'Agendada',
  em_andamento: 'Em Andamento',
  concluida: 'Concluida',
  cancelada: 'Cancelada',
};

export const VISTORIA_TIPO_LABELS = {
  entrada: 'Entrada',
  saida: 'Saida',
  manutencao: 'Manutencao',
  venda: 'Venda',
};

export const VISTORIA_STATUS_COLORS = {
  agendada: 'blue',
  em_andamento: 'orange',
  concluida: 'green',
  cancelada: 'red',
};

export const VISTORIA_TIPO_COLORS = {
  entrada: 'blue',
  saida: 'red',
  manutencao: 'orange',
  venda: 'green',
};
