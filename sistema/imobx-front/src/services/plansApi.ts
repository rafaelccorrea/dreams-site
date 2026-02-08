/**
 * Serviço para APIs de Planos e Módulos
 *
 * Endpoints disponíveis:
 * - GET /plans/modules-by-plan - Lista módulos por plano (Básico e Pro)
 * - GET /plans - Lista todos os planos
 * - GET /plans/active - Lista apenas planos ativos
 * - GET /plans/type/:type - Obtém plano por tipo
 * - GET /plans/modules - Lista todos os módulos disponíveis
 * - GET /plans/:id/modules/:moduleType/access - Verifica acesso a módulo
 */

import { api } from './api';
import type {
  PlanModulesResponse,
  PlanType,
  AllModulesResponse,
  ModuleAccessResponse,
} from '../types/planModules';

/**
 * Função auxiliar para unwrap de respostas da API
 */
async function unwrap<T>(promise: Promise<{ data: T }>): Promise<T> {
  const response = await promise;
  return response.data;
}

export const plansApi = {
  /**
   * Lista módulos incluídos em cada plano padrão (Básico e Pro)
   * GET /plans/modules-by-plan
   */
  async getModulesByPlan(): Promise<PlanModulesResponse> {
    return unwrap(api.get<PlanModulesResponse>('/plans/modules-by-plan'));
  },

  /**
   * Lista todos os planos
   * GET /plans
   */
  async getAllPlans(): Promise<PlanType[]> {
    return unwrap(api.get<PlanType[]>('/plans'));
  },

  /**
   * Lista apenas planos ativos
   * GET /plans/active
   */
  async getActivePlans(): Promise<PlanType[]> {
    return unwrap(api.get<PlanType[]>('/plans/active'));
  },

  /**
   * Obtém um plano específico pelo tipo
   * GET /plans/type/:type
   * @param type - Tipo do plano: 'basic', 'pro', ou 'custom'
   */
  async getPlanByType(type: 'basic' | 'pro' | 'custom'): Promise<PlanType> {
    return unwrap(api.get<PlanType>(`/plans/type/${type}`));
  },

  /**
   * Lista todos os módulos disponíveis no sistema com suas descrições
   * GET /plans/modules
   */
  async getAllModules(): Promise<AllModulesResponse> {
    return unwrap(api.get<AllModulesResponse>('/plans/modules'));
  },

  /**
   * Verifica se um plano específico tem acesso a um módulo
   * GET /plans/:id/modules/:moduleType/access
   * @param planId - ID do plano
   * @param moduleType - Código do módulo (ex: 'property_management')
   */
  async checkModuleAccess(
    planId: string,
    moduleType: string
  ): Promise<ModuleAccessResponse> {
    return unwrap(
      api.get<ModuleAccessResponse>(
        `/plans/${planId}/modules/${moduleType}/access`
      )
    );
  },
};
