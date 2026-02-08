// Utilitários para trabalhar com propriedades

import type { PropertyImportData } from '../types/propertyImport';
import { BrazilianStates } from '../types/property';

export const formatPrice = (
  price: number | string | undefined | null
): string => {
  if (price === undefined || price === null || price === 0 || price === '0')
    return 'Não informado';
  const numericPrice = typeof price === 'string' ? Number(price) : price;
  if (isNaN(numericPrice) || numericPrice <= 0) return 'Não informado';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'available':
      return 'Disponível';
    case 'rented':
      return 'Alugado';
    case 'sold':
      return 'Vendido';
    case 'maintenance':
      return 'Manutenção';
    case 'draft':
      return 'Rascunho';
    default:
      return status;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'available':
      return '#10B981';
    case 'rented':
      return '#F59E0B';
    case 'sold':
      return '#EF4444';
    case 'maintenance':
      return '#6B7280';
    case 'draft':
      return '#8B5CF6';
    default:
      return '#6B7280';
  }
};

export const getTypeText = (type: string): string => {
  switch (type) {
    case 'house':
      return 'Casa';
    case 'apartment':
      return 'Apartamento';
    case 'commercial':
      return 'Comercial';
    case 'land':
      return 'Terreno';
    case 'rural':
      return 'Rural';
    default:
      return type;
  }
};

export const formatArea = (area: number | undefined): string => {
  if (area === undefined || area === 0) return 'Não informado';
  return `${area}m²`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Enriquece dados de importação de propriedade inferindo campos faltantes
 * a partir de dados disponíveis (título, URL, cidade, etc.)
 */

// Mapeamento de cidades conhecidas para seus estados
const cityToStateMap: Record<string, string> = {
  marília: 'SP',
  marilia: 'SP',
  'são paulo': 'SP',
  'sao paulo': 'SP',
  'rio de janeiro': 'RJ',
  'belo horizonte': 'MG',
  brasília: 'DF',
  brasilia: 'DF',
  salvador: 'BA',
  curitiba: 'PR',
  'porto alegre': 'RS',
  recife: 'PE',
  fortaleza: 'CE',
  manaus: 'AM',
  belém: 'PA',
  belem: 'PA',
  goiânia: 'GO',
  goiania: 'GO',
  vitória: 'ES',
  vitoria: 'ES',
  florianópolis: 'SC',
  florianopolis: 'SC',
  campinas: 'SP',
  'são josé dos campos': 'SP',
  'sao jose dos campos': 'SP',
  santos: 'SP',
  'ribeirão preto': 'SP',
  'ribeirao preto': 'SP',
  sorocaba: 'SP',
  uberlândia: 'MG',
  uberlandia: 'MG',
  joinville: 'SC',
  niterói: 'RJ',
  niteroi: 'RJ',
  aracaju: 'SE',
  maceió: 'AL',
  maceio: 'AL',
  natal: 'RN',
  'joão pessoa': 'PB',
  'joao pessoa': 'PB',
  teresina: 'PI',
  'campo grande': 'MS',
  cuiabá: 'MT',
  cuiaba: 'MT',
  'porto velho': 'RO',
  'rio branco': 'AC',
  macapá: 'AP',
  macapa: 'AP',
  'boa vista': 'RR',
  palmas: 'TO',
};

/**
 * Extrai estado de uma string (título, descrição, etc.)
 * Procura por padrões como "Cidade, ST" ou "Cidade - ST"
 */
function extractStateFromText(text: string): string | null {
  if (!text) return null;

  // Padrões comuns: "Cidade, ST" ou "Cidade - ST" ou "Cidade/ST"
  const patterns = [
    /,\s*([A-Z]{2})\b/i, // "Marília, SP"
    /\s+-\s+([A-Z]{2})\b/i, // "Marília - SP"
    /\s*\/\s*([A-Z]{2})\b/i, // "Marília/SP"
    /\s+([A-Z]{2})\s*$/i, // "Marília SP" no final
    /\s+([A-Z]{2})\s+/i, // "Marília SP por"
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const stateCode = match[1].toUpperCase();
      // Verificar se é um estado válido
      if (BrazilianStates.some(s => s.value === stateCode)) {
        return stateCode;
      }
    }
  }

  return null;
}

/**
 * Infere estado a partir da cidade
 */
function inferStateFromCity(city: string | undefined): string | null {
  if (!city) return null;

  const cityLower = city.toLowerCase().trim();
  return cityToStateMap[cityLower] || null;
}

/**
 * Enriquece dados de importação inferindo campos faltantes
 */
export function enrichPropertyImportData(
  data: PropertyImportData
): PropertyImportData {
  const enriched = { ...data };
  const inferredFields: string[] = [];

  // 1. Tentar inferir estado
  if (!enriched.state) {
    // Primeiro, tentar extrair do título
    if (enriched.title) {
      const stateFromTitle = extractStateFromText(enriched.title);
      if (stateFromTitle) {
        enriched.state = stateFromTitle;
        inferredFields.push('state');
      }
    }

    // Se não encontrou no título, tentar inferir pela cidade
    if (!enriched.state && enriched.city) {
      const stateFromCity = inferStateFromCity(enriched.city);
      if (stateFromCity) {
        enriched.state = stateFromCity;
        inferredFields.push('state');
      }
    }

    // Tentar extrair da descrição também
    if (!enriched.state && enriched.description) {
      const stateFromDesc = extractStateFromText(enriched.description);
      if (stateFromDesc) {
        enriched.state = stateFromDesc;
        inferredFields.push('state');
      }
    }
  }

  // 2. Tentar extrair bairro da URL se disponível
  if (!enriched.neighborhood && enriched.sourceUrl) {
    // Padrões comuns na URL:
    // - "bairro-cidade" (ex: "parque-das-esmeraldas-marilia")
    // - "bairro" antes de números ou palavras-chave
    const commonWords = [
      'imovel',
      'casa',
      'apartamento',
      'terreno',
      'comercial',
      'rural',
      'condominio',
      'quartos',
      'vagas',
      'code',
    ];
    const cityNames = [
      'marilia',
      'sao-paulo',
      'rio-de-janeiro',
      'belo-horizonte',
      'curitiba',
      'porto-alegre',
    ];

    // Tentar encontrar padrão "bairro-cidade"
    for (const city of cityNames) {
      const pattern = new RegExp(`([a-z-]+)-${city}`, 'i');
      const match = enriched.sourceUrl.match(pattern);
      if (match && match[1]) {
        const potentialNeighborhood = match[1]
          .split('-')
          .filter(word => !commonWords.includes(word.toLowerCase()))
          .map(
            word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(' ');

        if (potentialNeighborhood.trim().length > 2) {
          enriched.neighborhood = potentialNeighborhood.trim();
          inferredFields.push('neighborhood');
          break;
        }
      }
    }

    // Se não encontrou, tentar extrair palavras antes de números ou palavras-chave
    if (!enriched.neighborhood) {
      const pattern = /([a-z-]+?)-(?:\d+|quartos|vagas|code|m2)/i;
      const match = enriched.sourceUrl.match(pattern);
      if (match && match[1]) {
        const parts = match[1]
          .split('-')
          .filter(
            part => part.length > 2 && !commonWords.includes(part.toLowerCase())
          );
        if (parts.length > 0) {
          const potentialNeighborhood = parts
            .map(
              word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ');
          if (potentialNeighborhood.trim().length > 2) {
            enriched.neighborhood = potentialNeighborhood.trim();
            inferredFields.push('neighborhood');
          }
        }
      }
    }
  }

  // 3. Atualizar lista de campos faltantes
  if (enriched.missingFields && inferredFields.length > 0) {
    enriched.missingFields = enriched.missingFields.filter(
      field => !inferredFields.includes(field)
    );
  }

  // 4. Adicionar avisos sobre campos inferidos
  if (inferredFields.length > 0 && !enriched.warnings) {
    enriched.warnings = [];
  }
  if (inferredFields.length > 0) {
    const inferredFieldsNames = inferredFields.map(field => {
      const fieldNames: Record<string, string> = {
        state: 'Estado',
        neighborhood: 'Bairro',
        address: 'Endereço',
      };
      return fieldNames[field] || field;
    });
    enriched.warnings?.push(
      `Os seguintes campos foram inferidos automaticamente: ${inferredFieldsNames.join(', ')}. Revise antes de salvar.`
    );
  }

  return enriched;
}
