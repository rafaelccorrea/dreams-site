'use client';
import { api } from './api';
import type {
  KanbanCustomField,
  CreateCustomFieldDto,
  UpdateCustomFieldDto,
  ReorderCustomFieldsDto,
} from '../types/kanban';
import { CustomFieldType } from '../types/kanban';

class KanbanCustomFieldsApiService {
  private baseUrl = '/kanban';

  /**
   * Normaliza o tipo de campo recebido do backend.
   * Converte 'multiselect' (sem underscore) para 'multi_select' (com underscore).
   * Garante compatibilidade caso o backend ainda retorne valores antigos.
   */
  private normalizeFieldType(type: string): string {
    if (type === 'multiselect') {
      return CustomFieldType.MULTISELECT; // 'multi_select'
    }
    return type;
  }

  /**
   * Normaliza um campo personalizado recebido do backend.
   */
  private normalizeCustomField(field: KanbanCustomField): KanbanCustomField {
    return {
      ...field,
      type: this.normalizeFieldType(field.type) as any,
    };
  }

  async createCustomField(
    data: CreateCustomFieldDto
  ): Promise<KanbanCustomField> {
    try {
      // Garantir que estamos enviando 'multi_select' (com underscore)
      const normalizedData = {
        ...data,
        type:
          data.type === 'multiselect' ? CustomFieldType.MULTISELECT : data.type,
      };
      const response = await api.post(
        `${this.baseUrl}/custom-fields`,
        normalizedData
      );
      return this.normalizeCustomField(response.data);
    } catch (error: any) {
      console.error('❌ Erro ao criar campo personalizado:', error);
      throw this.handleError(error);
    }
  }

  async getTeamCustomFields(
    teamId: string,
    projectId?: string
  ): Promise<KanbanCustomField[]> {
    try {
      const params = projectId ? { projectId } : {};
      const response = await api.get(
        `${this.baseUrl}/custom-fields/teams/${teamId}`,
        { params }
      );
      // Normalizar todos os campos recebidos
      return Array.isArray(response.data)
        ? response.data.map(field => this.normalizeCustomField(field))
        : [];
    } catch (error: any) {
      console.error(
        '❌ Erro ao buscar campos personalizados da equipe:',
        error
      );
      throw this.handleError(error);
    }
  }

  async getProjectCustomFields(
    projectId: string
  ): Promise<KanbanCustomField[]> {
    try {
      const response = await api.get(
        `${this.baseUrl}/custom-fields/projects/${projectId}`
      );
      // Normalizar todos os campos recebidos
      return Array.isArray(response.data)
        ? response.data.map(field => this.normalizeCustomField(field))
        : [];
    } catch (error: any) {
      console.error(
        '❌ Erro ao buscar campos personalizados do projeto:',
        error
      );
      throw this.handleError(error);
    }
  }

  async updateCustomField(
    fieldId: string,
    data: UpdateCustomFieldDto
  ): Promise<KanbanCustomField> {
    try {
      // Garantir que estamos enviando 'multi_select' (com underscore) se o tipo for atualizado
      const normalizedData = data.type
        ? {
            ...data,
            type:
              data.type === 'multiselect'
                ? CustomFieldType.MULTISELECT
                : data.type,
          }
        : data;
      const response = await api.put(
        `${this.baseUrl}/custom-fields/${fieldId}`,
        normalizedData
      );
      return this.normalizeCustomField(response.data);
    } catch (error: any) {
      console.error('❌ Erro ao atualizar campo personalizado:', error);
      throw this.handleError(error);
    }
  }

  async reorderCustomFields(
    teamId: string,
    data: ReorderCustomFieldsDto
  ): Promise<void> {
    try {
      await api.put(
        `${this.baseUrl}/custom-fields/teams/${teamId}/reorder`,
        data
      );
    } catch (error: any) {
      console.error('❌ Erro ao reordenar campos personalizados:', error);
      throw this.handleError(error);
    }
  }

  async deleteCustomField(fieldId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/custom-fields/${fieldId}`);
    } catch (error: any) {
      console.error('❌ Erro ao deletar campo personalizado:', error);
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

export const kanbanCustomFieldsApi = new KanbanCustomFieldsApiService();
