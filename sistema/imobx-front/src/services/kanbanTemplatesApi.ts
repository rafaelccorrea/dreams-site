import { api } from './api';

export type TemplateType = 'email' | 'notification' | 'sms' | 'chat_message';
export const TemplateType = {
  EMAIL: 'email' as TemplateType,
  NOTIFICATION: 'notification' as TemplateType,
  SMS: 'sms' as TemplateType,
  CHAT_MESSAGE: 'chat_message' as TemplateType,
};

export type TemplateCategory =
  | 'lead_nurturing'
  | 'follow_up'
  | 'reminder'
  | 'welcome'
  | 'custom';
export const TemplateCategory = {
  LEAD_NURTURING: 'lead_nurturing' as TemplateCategory,
  FOLLOW_UP: 'follow_up' as TemplateCategory,
  REMINDER: 'reminder' as TemplateCategory,
  WELCOME: 'welcome' as TemplateCategory,
  CUSTOM: 'custom' as TemplateCategory,
};

export interface EmailTemplate {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  type: TemplateType;
  category?: TemplateCategory;
  subject: string;
  message: string;
  variables?: string[];
  metadata?: Record<string, any>;
  isPublic: boolean;
  isActive: boolean;
  usageCount: number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateDto {
  name: string;
  description?: string;
  type: TemplateType;
  category?: TemplateCategory;
  subject: string;
  message: string;
  variables?: string[];
  metadata?: Record<string, any>;
  isPublic?: boolean;
  isActive?: boolean;
}

export interface UpdateTemplateDto {
  name?: string;
  description?: string;
  subject?: string;
  message?: string;
  variables?: string[];
  metadata?: Record<string, any>;
  isPublic?: boolean;
  isActive?: boolean;
}

export interface PreviewTemplateDto {
  [key: string]: any;
}

export interface PreviewTemplateResponse {
  subject: string;
  message: string;
}

class KanbanTemplatesApiService {
  private baseUrl = '/kanban/templates';

  /**
   * Listar todos os templates
   */
  async listTemplates(params?: {
    type?: TemplateType;
    category?: TemplateCategory;
    isActive?: boolean;
  }): Promise<EmailTemplate[]> {
    try {
      const response = await api.get<EmailTemplate[]>(this.baseUrl, { params });
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar templates:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter template por ID
   */
  async getTemplate(templateId: string): Promise<EmailTemplate> {
    try {
      const response = await api.get<EmailTemplate>(
        `${this.baseUrl}/${templateId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar template:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Criar template
   */
  async createTemplate(data: CreateTemplateDto): Promise<EmailTemplate> {
    try {
      const response = await api.post<EmailTemplate>(this.baseUrl, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar template:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar template
   */
  async updateTemplate(
    templateId: string,
    data: UpdateTemplateDto
  ): Promise<EmailTemplate> {
    try {
      const response = await api.put<EmailTemplate>(
        `${this.baseUrl}/${templateId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar template:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remover template
   */
  async deleteTemplate(templateId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${templateId}`);
    } catch (error: any) {
      console.error('❌ Erro ao remover template:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Preview de template com variáveis substituídas
   */
  async previewTemplate(
    templateId: string,
    variables: PreviewTemplateDto
  ): Promise<PreviewTemplateResponse> {
    try {
      const response = await api.post<PreviewTemplateResponse>(
        `${this.baseUrl}/${templateId}/preview`,
        variables
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao fazer preview do template:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    return new Error(error.message || 'Erro desconhecido');
  }
}

export const kanbanTemplatesApi = new KanbanTemplatesApiService();
