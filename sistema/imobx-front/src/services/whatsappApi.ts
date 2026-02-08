'use client';
import { api } from './api';
import type {
  WhatsAppMessage,
  WhatsAppMessageWithRelations,
  WhatsAppMessagesResponse,
  WhatsAppMessagesQueryParams,
  SendMessageRequest,
  SendMessageResponse,
  SendTemplateRequest,
  SendTemplateResponse,
  SendPropertyOptionsRequest,
  SendPropertyOptionsResponse,
  CreateTaskFromMessageRequest,
  CreateTaskFromMessageResponse,
  AnalyzeMessageRequest,
  AnalyzeMessageResponse,
  WhatsAppConfig,
  CreateWhatsAppConfigRequest,
  UpdateWhatsAppConfigRequest,
  UnreadCountResponse,
  DistributionConfig,
  UpdateDistributionConfigRequest,
  AssignMessageRequest,
  NotificationConfig,
  UpdateNotificationConfigRequest,
  MessageTimeStatus,
  MessagesNeedingNotificationResponse,
} from '../types/whatsapp';

class WhatsAppApiService {
  private baseUrl = '/whatsapp';

  /**
   * Listar mensagens WhatsApp
   */
  async getMessages(
    params?: WhatsAppMessagesQueryParams
  ): Promise<WhatsAppMessagesResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset)
        queryParams.append('offset', params.offset.toString());
      if (params?.phoneNumber)
        queryParams.append('phoneNumber', params.phoneNumber);
      if (params?.clientId) queryParams.append('clientId', params.clientId);
      if (params?.kanbanTaskId)
        queryParams.append('kanbanTaskId', params.kanbanTaskId);
      if (params?.direction) queryParams.append('direction', params.direction);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.messageType)
        queryParams.append('messageType', params.messageType);
      if (params?.unreadOnly) queryParams.append('unreadOnly', 'true');
      if (params?.hasTask !== undefined)
        queryParams.append('hasTask', params.hasTask.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.groupByPhone) queryParams.append('groupByPhone', 'true');
      if (params?.assignedToId)
        queryParams.append('assignedToId', params.assignedToId);
      if (params?.timeStatus)
        queryParams.append('timeStatus', params.timeStatus);

      const url = `${this.baseUrl}/messages${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('❌ [WhatsAppApi] Erro ao listar mensagens:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter mensagem específica
   */
  async getMessage(messageId: string): Promise<WhatsAppMessage> {
    try {
      const response = await api.get(`${this.baseUrl}/messages/${messageId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ [WhatsAppApi] Erro ao obter mensagem:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Enviar mensagem de texto ou imagem
   *
   * NOTA v1.8 - Funcionalidades Automáticas:
   * - Todas as mensagens enviadas são automaticamente salvas no banco de dados
   * - Se clientId não for fornecido, o sistema busca ou cria automaticamente um cliente pelo número
   * - Se o salvamento falhar, o sistema recupera automaticamente via Message Echoes do WhatsApp
   * - O status da mensagem é atualizado automaticamente via webhook (sent → delivered → read)
   *
   * @param data Dados da mensagem (clientId é opcional - sistema cria automaticamente se necessário)
   */
  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      console.log('📤 [WhatsAppApi] Enviando mensagem:', {
        to: data.to,
        messageLength: data.message.length,
        hasClientId: !!data.clientId,
        hasImage: !!(data.image || data.imageUrl),
      });

      const response = await api.post(`${this.baseUrl}/send`, data);
      console.log(
        '✅ [WhatsAppApi] Mensagem enviada com sucesso:',
        response.data
      );
      console.log(
        '💾 [WhatsAppApi] Mensagem será salva automaticamente no histórico'
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ [WhatsAppApi] Erro ao enviar mensagem:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Enviar template WhatsApp
   */
  async sendTemplate(data: SendTemplateRequest): Promise<SendTemplateResponse> {
    try {
      console.log('📤 [WhatsAppApi] Enviando template:', {
        to: data.to,
        templateName: data.templateName,
        hasParameters: !!(data.parameters && data.parameters.length > 0),
      });

      const response = await api.post(`${this.baseUrl}/send-template`, data);
      console.log(
        '✅ [WhatsAppApi] Template enviado com sucesso:',
        response.data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ [WhatsAppApi] Erro ao enviar template:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Enviar opções de imóveis por WhatsApp (bairro/valor/operação)
   */
  async sendPropertyOptions(
    data: SendPropertyOptionsRequest
  ): Promise<SendPropertyOptionsResponse> {
    try {
      const response = await api.post<SendPropertyOptionsResponse>(
        `${this.baseUrl}/send-property-options`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error(
        '❌ [WhatsAppApi] Erro ao enviar opções de imóveis:',
        error
      );
      throw this.handleError(error);
    }
  }

  /**
   * Criar tarefa a partir de mensagem WhatsApp
   *
   * ⚠️ IMPORTANTE (v1.8+):
   * - O sistema SEMPRE usa o projeto padrão configurado (defaultProjectId)
   * - O sistema SEMPRE usa a primeira coluna ativa do projeto (menor posição)
   * - Não é necessário (e não é recomendado) fornecer projectId ou columnId no body
   * - O backend ignora esses campos se fornecidos
   * - É OBRIGATÓRIO ter um projeto padrão configurado antes de criar tarefas
   * - Se não houver projeto padrão, retornará erro 400
   *
   * @param messageId ID da mensagem WhatsApp
   * @param data Dados opcionais (assignedToId, customTitle) - projectId e columnId são ignorados
   * @returns Resposta com taskId, projectId, teamId, isUserInProject e warning (se aplicável)
   */
  async createTaskFromMessage(
    messageId: string,
    data: CreateTaskFromMessageRequest
  ): Promise<CreateTaskFromMessageResponse> {
    try {
      console.log('📋 [WhatsAppApi] Criando tarefa a partir de mensagem:', {
        messageId,
        // projectId e columnId não são mais usados - backend sempre usa projeto padrão e primeira coluna
        assignedToId: data.assignedToId,
        customTitle: data.customTitle,
      });

      const response = await api.post(
        `${this.baseUrl}/messages/${messageId}/create-task`,
        data
      );
      console.log('✅ [WhatsAppApi] Tarefa criada com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [WhatsAppApi] Erro ao criar tarefa:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Analisar mensagem com IA
   */
  async analyzeMessage(
    data: AnalyzeMessageRequest
  ): Promise<AnalyzeMessageResponse> {
    try {
      console.log('🤖 [WhatsAppApi] Analisando mensagem com IA:', {
        messageLength: data.message.length,
        phoneNumber: data.phoneNumber,
      });

      const response = await api.post(`${this.baseUrl}/analyze-message`, data);
      console.log('✅ [WhatsAppApi] Mensagem analisada:', {
        intent: response.data.intent,
        shouldCreateTask: response.data.shouldCreateTask,
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ [WhatsAppApi] Erro ao analisar mensagem:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Marcar mensagem como lida
   */
  async markAsRead(messageId: string): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/messages/${messageId}/read`);
    } catch (error: any) {
      console.error(
        '❌ [WhatsAppApi] Erro ao marcar mensagem como lida:',
        error
      );
      throw this.handleError(error);
    }
  }

  /**
   * Obter contagem de mensagens não lidas
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get<UnreadCountResponse>(
        `${this.baseUrl}/messages/unread-count`
      );
      return response.data.count || 0;
    } catch (error: any) {
      console.error(
        '❌ [WhatsAppApi] Erro ao obter contagem de não lidas:',
        error
      );
      return 0;
    }
  }

  /**
   * Obter configuração do WhatsApp
   */
  async getConfig(): Promise<WhatsAppConfig> {
    try {
      const response = await api.get<WhatsAppConfig>(`${this.baseUrl}/config`);
      return response.data;
    } catch (error: any) {
      console.error('❌ [WhatsAppApi] Erro ao obter configuração:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Validar credenciais do WhatsApp antes de salvar
   */
  async validateCredentials(data: {
    apiToken: string;
    phoneNumberId: string;
  }): Promise<any> {
    try {
      console.log('🔍 [WhatsAppApi] Validando credenciais');
      const response = await api.post(`${this.baseUrl}/config/validate`, data);
      console.log('✅ [WhatsAppApi] Validação concluída:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [WhatsAppApi] Erro ao validar credenciais:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Criar ou atualizar configuração do WhatsApp
   */
  async createOrUpdateConfig(
    data: CreateWhatsAppConfigRequest
  ): Promise<WhatsAppConfig> {
    try {
      console.log('⚙️ [WhatsAppApi] Criando/atualizando configuração');
      const response = await api.post<WhatsAppConfig>(
        `${this.baseUrl}/config`,
        data
      );
      console.log('✅ [WhatsAppApi] Configuração salva com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('❌ [WhatsAppApi] Erro ao salvar configuração:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar configuração do WhatsApp
   */
  async updateConfig(
    data: UpdateWhatsAppConfigRequest
  ): Promise<WhatsAppConfig> {
    try {
      console.log('⚙️ [WhatsAppApi] Atualizando configuração');
      const response = await api.put<WhatsAppConfig>(
        `${this.baseUrl}/config`,
        data
      );
      console.log('✅ [WhatsAppApi] Configuração atualizada com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('❌ [WhatsAppApi] Erro ao atualizar configuração:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remover configuração do WhatsApp
   */
  async deleteConfig(): Promise<void> {
    try {
      console.log('🗑️ [WhatsAppApi] Removendo configuração');
      await api.delete(`${this.baseUrl}/config`);
      console.log('✅ [WhatsAppApi] Configuração removida com sucesso');
    } catch (error: any) {
      console.error('❌ [WhatsAppApi] Erro ao remover configuração:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter configuração de distribuição de mensagens
   */
  async getDistributionConfig(): Promise<DistributionConfig> {
    try {
      const response = await api.get<DistributionConfig>(
        `${this.baseUrl}/distribution/config`
      );
      return response.data;
    } catch (error: any) {
      console.error(
        '❌ [WhatsAppApi] Erro ao obter configuração de distribuição:',
        error
      );
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar configuração de distribuição de mensagens
   */
  async updateDistributionConfig(
    data: UpdateDistributionConfigRequest
  ): Promise<DistributionConfig> {
    try {
      const response = await api.put<DistributionConfig>(
        `${this.baseUrl}/distribution/config`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error(
        '❌ [WhatsAppApi] Erro ao atualizar configuração de distribuição:',
        error
      );
      throw this.handleError(error);
    }
  }

  /**
   * Atribuir mensagem manualmente a um SDR
   */
  async assignMessage(
    messageId: string,
    data: AssignMessageRequest
  ): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/messages/${messageId}/assign`, data);
    } catch (error: any) {
      console.error('❌ [WhatsAppApi] Erro ao atribuir mensagem:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter configuração de notificações por tempo
   */
  async getNotificationConfig(): Promise<NotificationConfig> {
    try {
      const response = await api.get<NotificationConfig>(
        `${this.baseUrl}/notifications/config`
      );
      return response.data;
    } catch (error: any) {
      console.error(
        '❌ [WhatsAppApi] Erro ao obter configuração de notificações:',
        error
      );
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar configuração de notificações por tempo
   */
  async updateNotificationConfig(
    data: UpdateNotificationConfigRequest
  ): Promise<NotificationConfig> {
    try {
      const response = await api.put<NotificationConfig>(
        `${this.baseUrl}/notifications/config`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error(
        '❌ [WhatsAppApi] Erro ao atualizar configuração de notificações:',
        error
      );
      throw this.handleError(error);
    }
  }

  /**
   * Obter status de tempo de uma mensagem
   */
  async getMessageTimeStatus(messageId: string): Promise<MessageTimeStatus> {
    try {
      const response = await api.get<MessageTimeStatus>(
        `${this.baseUrl}/messages/${messageId}/time-status`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ [WhatsAppApi] Erro ao obter status de tempo:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Listar mensagens que precisam de notificação (com estatísticas)
   * @param status - Status único ou array de status para buscar múltiplos status em uma única chamada
   * @param startDate - Data inicial para filtro (formato: YYYY-MM-DD)
   * @param endDate - Data final para filtro (formato: YYYY-MM-DD)
   * @returns Resposta com mensagens e estatísticas
   */
  async getMessagesNeedingNotification(
    status?:
      | 'on_time'
      | 'delayed'
      | 'critical'
      | Array<'on_time' | 'delayed' | 'critical'>,
    startDate?: string,
    endDate?: string
  ): Promise<MessagesNeedingNotificationResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (status) {
        if (Array.isArray(status)) {
          // Múltiplos status: ?status=delayed&status=critical&status=on_time
          status.forEach(s => queryParams.append('status', s));
        } else {
          // Status único: ?status=delayed
          queryParams.append('status', status);
        }
      }

      if (startDate) {
        queryParams.append('startDate', startDate);
      }

      if (endDate) {
        queryParams.append('endDate', endDate);
      }

      const params = queryParams.toString();
      const url = `${this.baseUrl}/messages/needing-notification${params ? `?${params}` : ''}`;
      const response = await api.get<MessagesNeedingNotificationResponse>(url);
      return response.data;
    } catch (error: any) {
      console.error(
        '❌ [WhatsAppApi] Erro ao listar mensagens que precisam de notificação:',
        error
      );
      throw this.handleError(error);
    }
  }

  /**
   * Verificar se usuário está no projeto
   */
  async checkUserInProject(projectId: string): Promise<{
    isUserInProject: boolean;
    projectId: string;
    projectName: string;
    teamId: string;
  }> {
    try {
      const response = await api.get(
        `${this.baseUrl}/projects/check-user/${projectId}`
      );
      return response.data;
    } catch (error: any) {
      console.error(
        '❌ [WhatsAppApi] Erro ao verificar usuário no projeto:',
        error
      );
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

    return new Error('Erro ao processar solicitação WhatsApp');
  }
}

export const whatsappApi = new WhatsAppApiService();
