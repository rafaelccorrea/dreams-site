import { api } from './api';

export interface PlanModule {
  code: string;
  name: string;
  icon: string;
  price: number;
}

export interface PlanLimits {
  companies: number;
  users: number;
  properties: number;
  storage: number;
}

export interface BasicPlan {
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  modules: PlanModule[];
  modulesCount: number;
  limits: PlanLimits;
  features: string[];
}

export interface ProfessionalPlan extends BasicPlan {
  popular?: boolean;
}

export interface CustomPlan {
  name: string;
  description: string;
  basePrice: number;
  basePriceIncludes: string[];
  includedLimits: PlanLimits & { apiCalls: number };
  features: string[];
}

export interface PricingPageData {
  plans: {
    basic: BasicPlan;
    professional: ProfessionalPlan;
    custom: CustomPlan;
  };
  modules: {
    all: PlanModule[];
    byCategory: {
      basic: PlanModule[];
      intermediate: PlanModule[];
      advanced: PlanModule[];
      premium: PlanModule[];
      additional: PlanModule[];
    };
    availableForCustom: PlanModule[];
  };
  addons: {
    all: any[];
    byType: Record<string, any[]>;
  };
}

export interface CalculateCustomRequest {
  modules: string[];
  extraCompanies?: number;
  extraUsers?: number;
  extraProperties?: number;
  extraStorage?: number;
  extraApiCalls?: number;
}

export interface CustomQuote {
  basePrice: number;
  modulesTotal: number;
  modulesList: Array<{
    code: string;
    name: string;
    price: number;
    icon: string;
  }>;
  addonsTotal: number;
  addonsBreakdown: {
    companies: { quantity: number; price: number };
    users: { quantity: number; price: number };
    properties: { quantity: number; price: number };
    storage: { quantity: number; price: number };
    apiCalls: { quantity: number; price: number };
  };
  totalMonthly: number;
  totalAnnual: number;
  annualSavings: number;
  includedLimits: {
    companies: number;
    users: number;
    properties: number;
    storage: number;
    apiCalls: number;
  };
  totalLimits: {
    companies: number;
    users: number;
    properties: number;
    storage: number;
    apiCalls: number;
  };
}

/**
 * Busca todos os dados necessários para a página de pricing
 */
export async function getPricingPageData(): Promise<PricingPageData> {
  try {
    const response = await api.get<PricingPageData>('/plans/pricing-page');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar dados de pricing:', error);

    // Se a API não estiver disponível, retornar dados mockados
    if (error?.response?.status === 404 || error?.code === 'ERR_NETWORK') {
      console.warn('API de pricing não disponível, usando dados mockados');
      throw new Error(
        'API de pricing não disponível. Por favor, tente novamente mais tarde.'
      );
    }

    throw error;
  }
}

/**
 * Calcula o orçamento de um plano customizado
 */
export async function calculateCustomPlan(
  request: CalculateCustomRequest
): Promise<CustomQuote> {
  try {
    const response = await api.post<CustomQuote>(
      '/plans/calculate-custom',
      request
    );
    return response.data;
  } catch (error: any) {
    console.error('Erro ao calcular plano custom:', error);

    if (error?.response?.status === 400) {
      throw new Error('Dados inválidos para cálculo do plano');
    }

    if (error?.response?.status === 404) {
      throw new Error('Endpoint de cálculo não disponível');
    }

    throw new Error('Erro ao calcular orçamento. Tente novamente.');
  }
}

/**
 * Busca add-ons agrupados por tipo
 */
export async function getAddonsByType(): Promise<Record<string, any[]>> {
  try {
    const response = await api.get<Record<string, any[]>>(
      '/plan-addons/by-type'
    );
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar add-ons:', error);
    return {};
  }
}

/**
 * Busca tabela de preços completa
 */
export async function getPricingTable(): Promise<any> {
  try {
    const response = await api.get('/plan-addons/pricing');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar tabela de preços:', error);
    return null;
  }
}
