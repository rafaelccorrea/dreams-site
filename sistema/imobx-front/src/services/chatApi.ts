import { api } from './api';
import type {
  ChatRoom,
  ChatMessage,
  CreateRoomRequest,
  SendMessageRequest,
  AddParticipantsRequest,
  RemoveParticipantRequest,
  MessagesQueryParams,
  EditMessageRequest,
  DeleteMessageRequest,
  CompanyUser,
  ChatRoomHistory,
} from '../types/chat';

class ChatApiService {
  private baseUrl = '/chat';

  /**
   * Criar ou obter uma sala de chat
   */
  async createOrGetRoom(data: CreateRoomRequest): Promise<ChatRoom> {
    const response = await api.post(`${this.baseUrl}/rooms`, data);
    return response.data;
  }

  /**
   * Listar todas as salas de chat do usuário
   */
  async getRooms(): Promise<ChatRoom[]> {
    const response = await api.get(`${this.baseUrl}/rooms`);
    return response.data;
  }

  /**
   * Obter detalhes de uma sala específica
   */
  async getRoom(roomId: string): Promise<ChatRoom> {
    const response = await api.get(`${this.baseUrl}/rooms/${roomId}`);
    return response.data;
  }

  /**
   * Enviar uma mensagem
   * Se houver arquivo, usa FormData, caso contrário usa JSON
   */
  async sendMessage(data: SendMessageRequest): Promise<ChatMessage> {
    console.log('📤 [ChatApi] Enviando mensagem via API REST:', {
      roomId: data.roomId,
      contentLength: data.content.length,
      hasFiles: !!(data.files && data.files.length > 0),
      hasFile: !!data.file, // DEPRECATED
      hasImage: !!data.image, // DEPRECATED
      url: `${this.baseUrl}/messages`,
    });

    try {
      let response;

      // Priorizar files (novo formato) sobre file/image (compatibilidade)
      let filesToSend: File[] = [];
      if (data.files && data.files.length > 0) {
        filesToSend = data.files;
      } else if (data.file || data.image) {
        // Compatibilidade com código antigo
        filesToSend = [data.file || data.image!];
      }

      if (filesToSend.length > 0) {
        // Enviar com FormData se houver arquivo
        const formData = new FormData();
        formData.append('roomId', data.roomId);
        formData.append('content', data.content);

        // Backend espera o campo 'files' (array)
        filesToSend.forEach(file => {
          formData.append('files', file);
        });

        // Não definir Content-Type manualmente - o axios precisa definir o boundary automaticamente
        response = await api.post(`${this.baseUrl}/messages`, formData);
      } else {
        // Enviar como JSON se não houver arquivo
        response = await api.post(`${this.baseUrl}/messages`, {
          roomId: data.roomId,
          content: data.content,
        });
      }

      console.log('✅ [ChatApi] Mensagem enviada com sucesso:', {
        messageId: response.data.id,
        status: response.data.status,
        hasDocument: !!response.data.documentUrl,
        hasImage: !!response.data.imageUrl,
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ [ChatApi] Erro ao enviar mensagem:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  }

  /**
   * Listar mensagens de uma sala
   */
  async getMessages(
    roomId: string,
    params?: MessagesQueryParams
  ): Promise<ChatMessage[]> {
    const queryParams = new URLSearchParams();
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset) {
      queryParams.append('offset', params.offset.toString());
    }

    const url = `${this.baseUrl}/rooms/${roomId}/messages${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    const response = await api.get(url);
    return response.data;
  }

  /**
   * Marcar mensagens como lidas
   */
  async markAsRead(roomId: string): Promise<void> {
    await api.post(`${this.baseUrl}/rooms/${roomId}/read`);
  }

  /**
   * Adicionar participantes a um grupo
   */
  async addParticipants(
    roomId: string,
    data: AddParticipantsRequest
  ): Promise<ChatRoom> {
    const response = await api.post(
      `${this.baseUrl}/rooms/${roomId}/participants`,
      data
    );
    return response.data;
  }

  /**
   * Remover participante de um grupo
   */
  async removeParticipant(
    roomId: string,
    data: RemoveParticipantRequest
  ): Promise<void> {
    await api.post(`${this.baseUrl}/rooms/${roomId}/participants/remove`, data);
  }

  /**
   * Atualizar informações do grupo (nome e imageUrl)
   */
  async updateRoom(
    roomId: string,
    data: { name?: string; imageUrl?: string }
  ): Promise<ChatRoom> {
    const response = await api.put(`${this.baseUrl}/rooms/${roomId}`, data);
    return response.data;
  }

  /**
   * Fazer upload de imagem do grupo
   */
  async uploadGroupImage(roomId: string, imageFile: File): Promise<ChatRoom> {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post(
      `${this.baseUrl}/rooms/${roomId}/upload-image`,
      formData
    );
    return response.data;
  }

  /**
   * Promover usuários a administrador
   */
  async promoteToAdmin(
    roomId: string,
    data: { userIds: string[] }
  ): Promise<ChatRoom> {
    const response = await api.post(
      `${this.baseUrl}/rooms/${roomId}/promote-admin`,
      data
    );
    return response.data;
  }

  /**
   * Remover status de administrador
   */
  async removeAdmin(
    roomId: string,
    data: { userIds: string[] }
  ): Promise<ChatRoom> {
    const response = await api.post(
      `${this.baseUrl}/rooms/${roomId}/remove-admin`,
      data
    );
    return response.data;
  }

  /**
   * Arquivar uma conversa
   */
  async archiveRoom(roomId: string): Promise<void> {
    await api.post(`${this.baseUrl}/rooms/${roomId}/archive`);
  }

  /**
   * Desarquivar uma conversa
   */
  async unarchiveRoom(roomId: string): Promise<void> {
    await api.post(`${this.baseUrl}/rooms/${roomId}/unarchive`);
  }

  /**
   * Sair de um grupo
   */
  async leaveRoom(roomId: string): Promise<void> {
    await api.post(`${this.baseUrl}/rooms/${roomId}/leave`);
  }

  /**
   * Editar uma mensagem
   */
  async editMessage(data: EditMessageRequest): Promise<ChatMessage> {
    const response = await api.post(`${this.baseUrl}/messages/edit`, data);
    return response.data;
  }

  /**
   * Deletar uma mensagem (soft delete)
   */
  async deleteMessage(data: DeleteMessageRequest): Promise<void> {
    await api.post(`${this.baseUrl}/messages/delete`, data);
  }

  /**
   * Listar usuários da empresa com status online
   */
  async getCompanyUsers(): Promise<CompanyUser[]> {
    const response = await api.get(`${this.baseUrl}/company/users`);
    return response.data;
  }

  /**
   * Obter histórico de atividades do grupo
   */
  async getRoomHistory(roomId: string): Promise<ChatRoomHistory> {
    const response = await api.get(`${this.baseUrl}/rooms/${roomId}/history`);
    return response.data;
  }
}

export const chatApi = new ChatApiService();
