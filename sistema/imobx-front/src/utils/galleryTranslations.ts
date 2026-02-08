export const statusTranslations: Record<string, string> = {
  available: 'Disponível',
  sold: 'Vendido',
  rented: 'Alugado',
  reserved: 'Reservado',
  inactive: 'Inativo',
  pending: 'Pendente',
  underNegotiation: 'Em Negociação',
};

export const typeTranslations: Record<string, string> = {
  house: 'Casa',
  apartment: 'Apartamento',
  commercial: 'Comercial',
  land: 'Terreno',
  rural: 'Rural',
  penthouse: 'Cobertura',
  farm: 'Fazenda',
  warehouse: 'Galpão',
  office: 'Escritório',
  store: 'Loja',
  condominium: 'Condomínio',
};

export const translateStatus = (status: string): string => {
  if (!status) return status;
  const normalizedStatus = status.toLowerCase().trim();
  return statusTranslations[normalizedStatus] || status;
};

export const translateType = (type: string): string => {
  if (!type) return type;
  // Normalizar para lowercase e remover espaços para garantir correspondência
  const normalizedType = String(type).toLowerCase().trim();
  const translation = typeTranslations[normalizedType];
  // Se encontrou tradução, retornar; senão, retornar o tipo original
  return translation || type;
};
