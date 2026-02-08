import { api } from './api';

export interface ModulePricing {
  id: string;
  moduleType: string;
  moduleName: string;
  basePrice: number;
  isActive: boolean;
  description: string;
  category: string;
  displayOrder: number;
}

export interface CustomPlanCalculation {
  basePrice: number;
  companyMultiplier: number;
  modulePrices: Array<{
    moduleType: string;
    moduleName: string;
    price: number;
  }>;
  totalPrice: number;
  discount?: number;
  finalPrice: number;
}

export interface CalculateCustomPlanRequest {
  companyCount: number;
  selectedModules: string[];
}

export interface ModuleValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ModuleRecommendations {
  recommendations: string[];
}

class ModulePricingApi {
  private baseUrl = '/module-pricing';

  /**
   * Obter todos os módulos ativos com preços
   */
  async getActiveModules(): Promise<ModulePricing[]> {
    try {
      const response = await api.get(`${this.baseUrl}/modules`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar módulos ativos:', error);
      throw error;
    }
  }

  /**
   * Obter módulos por categoria
   */
  async getModulesByCategory(category: string): Promise<ModulePricing[]> {
    try {
      const response = await api.get(
        `${this.baseUrl}/modules/by-category/${category}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar módulos por categoria:', error);
      throw error;
    }
  }

  /**
   * Calcular preço de plano customizado
   */
  async calculateCustomPlan(
    request: CalculateCustomPlanRequest
  ): Promise<CustomPlanCalculation> {
    try {
      const response = await api.post(
        `${this.baseUrl}/calculate-custom-plan`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao calcular plano customizado:', error);
      throw error;
    }
  }

  /**
   * Validar compatibilidade de módulos
   */
  async validateModules(selectedModules: string[]): Promise<ModuleValidation> {
    try {
      const response = await api.post(`${this.baseUrl}/validate-modules`, {
        selectedModules,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao validar módulos:', error);
      throw error;
    }
  }

  /**
   * Obter módulos recomendados
   */
  async getRecommendations(
    selectedModules: string[]
  ): Promise<ModuleRecommendations> {
    try {
      const response = await api.post(`${this.baseUrl}/recommendations`, {
        selectedModules,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter recomendações:', error);
      throw error;
    }
  }

  /**
   * Criar plano customizado
   */
  async createCustomPlan(planData: {
    name: string;
    companyCount: number;
    selectedModules: string[];
    customPrice?: number;
  }): Promise<{ planId: string; message: string }> {
    try {
      const response = await api.post(
        '/subscriptions/create-custom-plan',
        planData
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao criar plano customizado:', error);
      throw error;
    }
  }
}

export const modulePricingApi = new ModulePricingApi();
