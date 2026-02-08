/**
 * Tipos relacionados à importação de propriedades via link externo
 */

import type { PropertyType, PropertyStatus } from './property';

/**
 * Dados coletados de um link externo
 */
export interface PropertyImportData {
  // Dados básicos
  title?: string;
  description?: string;
  type?: PropertyType;
  status?: PropertyStatus;

  // Localização
  address?: string;
  street?: string;
  number?: string;
  complement?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  neighborhood?: string;

  // Características físicas
  totalArea?: number;
  builtArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;

  // Valores
  salePrice?: number;
  rentPrice?: number;
  condominiumFee?: number;
  iptu?: number;

  // Características/Features
  features?: string[];

  // Imagens (URLs para download)
  imageUrls?: string[];

  // Dados do site fonte
  sourceUrl: string;
  sourceSite?: string; // 'olx', 'zap', 'quintoandar', 'viva-real', 'imovelweb', etc.
  rawData?: any; // Dados brutos para referência/debug

  // Metadados
  confidence?: number; // Confiança na coleta (0-100)
  warnings?: string[]; // Avisos sobre dados faltantes ou problemas
  missingFields?: string[]; // Campos que não foram coletados
}

/**
 * Resposta da API de importação
 */
export interface PropertyImportResponse {
  success: boolean;
  data?: PropertyImportData;
  error?: string;
  message?: string;
}

/**
 * Sites suportados para importação
 */
export enum SupportedImportSite {
  OLX = 'olx',
  ZAP_IMOVEIS = 'zap-imoveis',
  QUINTO_ANDAR = 'quinto-andar',
  VIVA_REAL = 'viva-real',
  IMOVELWEB = 'imovelweb',
  UNKNOWN = 'unknown',
}

/**
 * Detecta o site baseado na URL
 */
export function detectSiteFromUrl(url: string): SupportedImportSite {
  const lowerUrl = url.toLowerCase();

  if (
    lowerUrl.includes('olx.com.br') ||
    lowerUrl.includes('mercadolivre.com.br/imoveis')
  ) {
    return SupportedImportSite.OLX;
  }

  if (lowerUrl.includes('zapimoveis.com.br')) {
    return SupportedImportSite.ZAP_IMOVEIS;
  }

  if (lowerUrl.includes('quintoandar.com.br')) {
    return SupportedImportSite.QUINTO_ANDAR;
  }

  if (lowerUrl.includes('vivareal.com.br')) {
    return SupportedImportSite.VIVA_REAL;
  }

  if (lowerUrl.includes('imovelweb.com.br')) {
    return SupportedImportSite.IMOVELWEB;
  }

  return SupportedImportSite.UNKNOWN;
}
