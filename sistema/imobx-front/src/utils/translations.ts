// Utilitários para tradução de tipos e enums

/**
 * Traduz o tipo de cliente para português
 */
export const translateClientType = (
  type: string | null | undefined
): string => {
  if (!type) return '';

  const translations: Record<string, string> = {
    buyer: 'Comprador',
    seller: 'Vendedor',
    renter: 'Locatário',
    lessor: 'Locador',
    investor: 'Investidor',
    general: 'Geral',
  };

  return translations[type.toLowerCase()] || type;
};

/**
 * Traduz o status do cliente para português
 */
export const translateClientStatus = (
  status: string | null | undefined
): string => {
  if (!status) return '';

  const translations: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    contacted: 'Contatado',
    interested: 'Interessado',
    closed: 'Fechado',
  };

  return translations[status.toLowerCase()] || status;
};

/**
 * Traduz o tipo de imóvel para português
 */
export const translatePropertyType = (
  type: string | null | undefined
): string => {
  if (!type) return '';

  const translations: Record<string, string> = {
    house: 'Casa',
    apartment: 'Apartamento',
    commercial: 'Comercial',
    land: 'Terreno',
    rural: 'Rural',
  };

  return translations[type.toLowerCase()] || type;
};

/**
 * Traduz o status do imóvel para português
 */
export const translatePropertyStatus = (
  status: string | null | undefined
): string => {
  if (!status) return '';

  const translations: Record<string, string> = {
    available: 'Disponível',
    rented: 'Alugado',
    sold: 'Vendido',
    maintenance: 'Manutenção',
    draft: 'Rascunho',
  };

  return translations[status.toLowerCase()] || status;
};
