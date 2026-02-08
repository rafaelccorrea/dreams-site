'use client';
import { api } from './api';
import type {
  KanbanColorRule,
  CreateColorRuleDto,
  UpdateColorRuleDto,
  ReorderColorRulesDto,
} from '../types/kanban';

class ColorRulesApiService {
  private baseUrl = '/kanban/color-rules';

  /**
   * Criar uma nova regra de cor
   */
  async createColorRule(data: CreateColorRuleDto): Promise<KanbanColorRule> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar regra de cor:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Listar regras de cor
   * @param teamId - ID da equipe (obrigatório)
   * @param projectId - ID do projeto (obrigatório)
   * @param isActive - Filtrar por regras ativas/inativas (opcional)
   *   - `true`: Apenas regras ativas
   *   - `false`: Apenas regras inativas
   *   - `undefined`: Todas as regras (ativas e inativas) - padrão
   */
  async getColorRules(
    teamId: string,
    projectId: string,
    isActive?: boolean
  ): Promise<KanbanColorRule[]> {
    try {
      const params: Record<string, string> = { teamId, projectId };
      // Adicionar filtro isActive apenas se fornecido
      if (isActive !== undefined) {
        params.isActive = isActive.toString();
      }
      const response = await api.get(this.baseUrl, { params });
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar regras de cor:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar uma regra específica por ID
   */
  async getColorRuleById(ruleId: string): Promise<KanbanColorRule> {
    try {
      const response = await api.get(`${this.baseUrl}/${ruleId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar regra de cor:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar uma regra de cor
   */
  async updateColorRule(
    ruleId: string,
    data: UpdateColorRuleDto
  ): Promise<KanbanColorRule> {
    try {
      const response = await api.put(`${this.baseUrl}/${ruleId}`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar regra de cor:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remover uma regra de cor
   */
  async deleteColorRule(ruleId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${ruleId}`);
    } catch (error: any) {
      console.error('❌ Erro ao remover regra de cor:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Reordenar regras de cor
   */
  async reorderColorRules(
    teamId: string,
    data: ReorderColorRulesDto
  ): Promise<KanbanColorRule[]> {
    try {
      const response = await api.put(`${this.baseUrl}/reorder/${teamId}`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao reordenar regras de cor:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    if (error.message) {
      return new Error(error.message);
    }

    return new Error('Erro interno do servidor');
  }
}

export const colorRulesApi = new ColorRulesApiService();
