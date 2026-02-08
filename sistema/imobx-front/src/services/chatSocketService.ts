import { io, Socket } from 'socket.io-client';
import { authStorage } from './authStorage';
import { API_BASE_URL } from '../config/apiConfig';
import type { ChatMessage } from '../types/chat';

class ChatSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3; // REDUZIDO: máximo 3 tentativas para evitar loops
  private baseReconnectDelay = 5000; // AUMENTADO: 5 segundos base
  private maxReconnectDelay = 60000; // AUMENTADO: máximo 1 minuto
  private isConnecting = false;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private isIntentionalDisconnect = false;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private currentCompanyId: string | null = null;
  private lastConnectionAttempt = 0; // NOVO: timestamp da última tentativa
  private minConnectionInterval = 5000; // NOVO: mínimo 5 segundos entre tentativas
  private cooldownUntil = 0; // NOVO: timestamp até quando aguardar antes de permitir novas conexões
  private cooldownDuration = 30000; // NOVO: 30 segundos de cooldown após atingir máximo de tentativas

  /**
   * Conecta ao WebSocket de chat
   */
  connect(companyId?: string): void {
    // Verificar se já está conectado ou conectando
    if (this.socket?.connected) {
      console.log('🔌 [ChatSocket] Já conectado, ignorando nova tentativa');
      return;
    }

    if (this.isConnecting) {
      console.log(
        '🔌 [ChatSocket] Já está conectando, ignorando nova tentativa'
      );
      return;
    }

    // CORREÇÃO: Verificar intervalo mínimo entre tentativas de conexão
    const now = Date.now();
    if (now - this.lastConnectionAttempt < this.minConnectionInterval) {
      console.log(
        '🔌 [ChatSocket] Tentativa de conexão muito rápida, aguardando...'
      );
      return;
    }
    this.lastConnectionAttempt = now;

    // CORREÇÃO: Verificar cooldown (período de espera após muitas falhas)
    if (now < this.cooldownUntil) {
      const remainingCooldown = Math.ceil((this.cooldownUntil - now) / 1000);
      console.log(
        `🔌 [ChatSocket] Em cooldown, aguardando ${remainingCooldown}s antes de nova tentativa`
      );
      return;
    }

    // CORREÇÃO: Verificar se já atingiu máximo de tentativas
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log(
        '🔌 [ChatSocket] Máximo de tentativas atingido, entrando em cooldown'
      );
      this.cooldownUntil = now + this.cooldownDuration;
      this.reconnectAttempts = 0; // Resetar para permitir tentativas após cooldown
      return;
    }

    const token = authStorage.getToken();
    if (!token || !authStorage.isAuthenticated()) {
      console.log('🔌 [ChatSocket] Sem token válido, não conectando');
      return;
    }

    // Obter companyId do parâmetro ou do localStorage (como nas APIs REST)
    const finalCompanyId =
      companyId || localStorage.getItem('dream_keys_selected_company_id');

    if (!finalCompanyId) {
      console.error(
        '❌ [ChatSocket] Company ID não encontrado. Não é possível conectar ao chat.'
      );
      return;
    }

    // Se já existe um socket (mesmo que desconectado), limpar antes de criar novo
    if (this.socket) {
      console.log('🔌 [ChatSocket] Limpando socket anterior antes de conectar');
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnecting = true;
    this.isIntentionalDisconnect = false;
    this.currentCompanyId = finalCompanyId;

    // Incluir companyId na query string também, caso o servidor espere lá
    const chatUrl = `${API_BASE_URL}/chat?companyId=${encodeURIComponent(finalCompanyId)}`;

    console.log('🔌 [ChatSocket] Conectando ao WebSocket:', chatUrl);
    console.log('🔌 [ChatSocket] Company ID:', finalCompanyId);
    console.log('🔌 [ChatSocket] Token presente:', !!token);
    console.log('🔌 [ChatSocket] Auth object:', {
      token: !!token,
      companyId: finalCompanyId,
    });
    console.log('🔌 [ChatSocket] Extra headers:', {
      Authorization: `Bearer ${token}`,
      'X-Company-ID': finalCompanyId,
    });

    this.socket = io(chatUrl, {
      auth: {
        token: token,
        companyId: finalCompanyId, // Adicionar companyId no auth
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Company-ID': finalCompanyId, // Sempre enviar no header
      },
      // CORREÇÃO: Usar apenas websocket para evitar polling infinito
      transports: ['websocket'],
      timeout: 10000,
      forceNew: true,
      reconnection: false,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ [ChatSocket] Conectado ao servidor de chat');
      console.log('✅ [ChatSocket] Socket ID:', this.socket?.id);
      console.log(
        '✅ [ChatSocket] Company ID armazenado:',
        this.currentCompanyId
      );
      this.reconnectAttempts = 0;
      this.isConnecting = false;

      // Tentar enviar companyId em um evento específico logo após conectar
      // Alguns servidores Socket.IO esperam isso em um evento separado
      if (this.currentCompanyId && this.socket) {
        console.log(
          '📤 [ChatSocket] Enviando companyId via evento set_company_id'
        );
        this.socket.emit('set_company_id', {
          companyId: this.currentCompanyId,
        });
      }

      this.clearReconnectTimeout();
    });

    this.socket.on('disconnect', reason => {
      console.log('⚠️ [ChatSocket] Desconectado:', reason);
      this.isConnecting = false;

      // CORREÇÃO: Notificar listeners sobre a desconexão para sincronizar estado React
      this.notifyListeners('disconnect', { reason });

      // CORREÇÃO: Só tentar reconectar se foi uma desconexão inesperada do servidor
      // e se ainda não atingiu o máximo de tentativas
      // Desconexões intencionais ou do cliente não devem reconectar
      const shouldReconnect =
        !this.isIntentionalDisconnect &&
        reason !== 'io client disconnect' &&
        reason !== 'io server disconnect' && // Servidor pediu desconexão
        this.reconnectAttempts < this.maxReconnectAttempts;

      if (shouldReconnect) {
        this.handleReconnect();
      } else {
        console.log('🔌 [ChatSocket] Não reconectando:', reason);
      }
    });

    this.socket.on(
      'connect_error',
      (error: Error & { type?: string; description?: string }) => {
        console.error('❌ [ChatSocket] Erro de conexão:', error.message);
        this.isConnecting = false;
        this.reconnectAttempts++; // Incrementar tentativas em caso de erro

        // Limpar socket em caso de erro
        if (this.socket) {
          this.socket.removeAllListeners();
          this.socket.disconnect();
          this.socket = null;
        }

        // CORREÇÃO: Notificar listeners sobre a desconexão/erro
        this.notifyListeners('disconnect', {
          reason: 'connect_error',
          error: error.message,
        });

        // CORREÇÃO: NÃO reconectar automaticamente em caso de erro
        // O chat será reconectado quando o usuário interagir ou navegar para a página de chat
        // Isso evita loops infinitos de reconexão
        console.log(
          `🔌 [ChatSocket] Conexão falhou (tentativa ${this.reconnectAttempts}/${this.maxReconnectAttempts}). O chat será reconectado quando necessário.`
        );
      }
    );

    // Eventos do servidor
    this.socket.on('chat_connected', data => {
      console.log('✅ [ChatSocket] chat_connected recebido do servidor:', data);
      this.notifyListeners('chat_connected', data);
    });

    this.socket.on(
      'new_message',
      (data: {
        message: ChatMessage;
        timestamp: string;
        isPending?: boolean;
      }) => {
        console.log('📨 [ChatSocket] Nova mensagem recebida:', {
          messageId: data.message.id,
          roomId: data.message.roomId,
          senderId: data.message.senderId,
          content: data.message.content?.substring(0, 50) || '(sem conteúdo)',
          timestamp: data.timestamp,
          isPending: data.isPending || false,
        });
        if (data.isPending) {
          console.log(
            '📬 [ChatSocket] Mensagem pendente entregue (enviada enquanto estava offline)'
          );
        }
        this.notifyListeners('new_message', data);
      }
    );

    this.socket.on(
      'message_deleted',
      (data: {
        roomId: string;
        messageId: string;
        timestamp: string;
        deletedBy?: {
          userId: string;
          userName: string;
        };
      }) => {
        console.log('🗑️ [ChatSocket] Mensagem deletada:', {
          roomId: data.roomId,
          messageId: data.messageId,
          timestamp: data.timestamp,
          deletedBy: data.deletedBy,
        });
        this.notifyListeners('message_deleted', data);
      }
    );

    this.socket.on('messages_read', data => {
      this.notifyListeners('messages_read', data);
    });

    this.socket.on('message_status_update', data => {
      this.notifyListeners('message_status_update', data);
    });

    this.socket.on('room_joined', data => {
      this.notifyListeners('room_joined', data);
    });

    this.socket.on('room_left', data => {
      this.notifyListeners('room_left', data);
    });

    this.socket.on('message_sent', data => {
      console.log('✅ [ChatSocket] Mensagem enviada confirmada:', data);
      this.notifyListeners('message_sent', data);
    });

    this.socket.on('read_confirmed', data => {
      this.notifyListeners('read_confirmed', data);
    });

    this.socket.on('message_edited', data => {
      console.log('✏️ [ChatSocket] Mensagem editada:', data);
      this.notifyListeners('message_edited', data);
    });

    // Removido - duplicado, já está acima

    this.socket.on(
      'participant_left',
      (data: {
        roomId: string;
        userId: string;
        userName: string;
        leftAt: string;
        timestamp: string;
        removedBy?: string;
        removedByName?: string;
        isRemoved?: boolean;
      }) => {
        console.log('👋 [ChatSocket] Participante saiu do grupo:', {
          roomId: data.roomId,
          userId: data.userId,
          userName: data.userName,
          leftAt: data.leftAt,
          timestamp: data.timestamp,
          isRemoved: data.isRemoved,
          removedBy: data.removedBy,
        });
        this.notifyListeners('participant_left', data);
      }
    );

    this.socket.on(
      'participant_added',
      (data: {
        roomId: string;
        userId: string;
        userName: string;
        userAvatar?: string;
        addedBy?: string;
        addedByName?: string;
        timestamp: string;
      }) => {
        console.log('➕ [ChatSocket] Participante adicionado ao grupo:', {
          roomId: data.roomId,
          userId: data.userId,
          userName: data.userName,
          addedBy: data.addedBy,
        });
        this.notifyListeners('participant_added', data);
      }
    );

    this.socket.on(
      'participant_removed',
      (data: {
        roomId: string;
        userId: string;
        userName: string;
        removedBy: string;
        removedByName: string;
        timestamp: string;
      }) => {
        console.log('🗑️ [ChatSocket] Participante removido do grupo:', {
          roomId: data.roomId,
          userId: data.userId,
          userName: data.userName,
          removedBy: data.removedBy,
        });
        this.notifyListeners('participant_removed', data);
      }
    );

    this.socket.on(
      'room_updated',
      (data: {
        roomId: string;
        name?: string;
        imageUrl?: string;
        updatedBy?: string;
        updatedByName?: string;
        timestamp: string;
      }) => {
        console.log('✏️ [ChatSocket] Sala atualizada:', {
          roomId: data.roomId,
          name: data.name,
          imageUrl: data.imageUrl,
          updatedBy: data.updatedBy,
        });
        this.notifyListeners('room_updated', data);
      }
    );

    this.socket.on('error', data => {
      console.error('❌ [ChatSocket] Erro no chat:', data);
      console.error('❌ [ChatSocket] Company ID atual:', this.currentCompanyId);
      console.error(
        '❌ [ChatSocket] Company ID no localStorage:',
        localStorage.getItem('dream_keys_selected_company_id')
      );
      this.notifyListeners('error', data);
    });
  }

  private handleReconnect(): void {
    // CORREÇÃO: Verificações mais rigorosas para evitar loops
    if (this.reconnectTimeout || this.isIntentionalDisconnect) {
      return;
    }

    // CORREÇÃO: Parar se atingiu máximo de tentativas
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log(
        '🔌 [ChatSocket] Máximo de tentativas de reconexão atingido, parando'
      );
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `🔌 [ChatSocket] Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
    );

    const exponentialDelay =
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    const delay = Math.min(exponentialDelay, this.maxReconnectDelay);

    console.log(
      `🔌 [ChatSocket] Aguardando ${delay / 1000}s antes de reconectar...`
    );

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;

      if (!authStorage.isAuthenticated()) {
        console.log('🔌 [ChatSocket] Não autenticado, cancelando reconexão');
        return;
      }

      if (this.socket) {
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket = null;
      }

      this.connect(this.currentCompanyId || undefined);
    }, delay);
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private notifyListeners(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      console.log(
        `📢 [ChatSocket] Notificando ${eventListeners.size} listener(s) do evento ${event}`
      );
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(
            `❌ [ChatSocket] Erro ao executar listener do evento ${event}:`,
            error
          );
        }
      });
    } else {
      console.warn(
        `⚠️ [ChatSocket] Nenhum listener registrado para o evento ${event}`
      );
    }
  }

  /**
   * Entrar em uma sala
   */
  joinRoom(roomId: string): void {
    if (this.socket?.connected) {
      if (!this.currentCompanyId) {
        console.error(
          '❌ [ChatSocket] Company ID não disponível para join_room'
        );
        return;
      }
      console.log('🚪 [ChatSocket] Entrando na sala:', {
        roomId,
        companyId: this.currentCompanyId,
      });
      this.socket.emit('join_room', {
        roomId,
        companyId: this.currentCompanyId,
      });
    }
  }

  /**
   * Sair de uma sala
   */
  leaveRoom(roomId: string): void {
    if (this.socket?.connected) {
      if (!this.currentCompanyId) {
        console.error(
          '❌ [ChatSocket] Company ID não disponível para leave_room'
        );
        return;
      }
      this.socket.emit('leave_room', {
        roomId,
        companyId: this.currentCompanyId,
      });
    }
  }

  /**
   * Enviar mensagem via WebSocket
   * Retorna true se enviou com sucesso, false caso contrário
   */
  sendMessage(roomId: string, content: string): boolean {
    if (!this.socket) {
      console.error('❌ [ChatSocket] Socket não inicializado');
      return false;
    }

    if (!this.socket.connected) {
      console.error('❌ [ChatSocket] Socket não conectado');
      return false;
    }

    if (!this.currentCompanyId) {
      console.error('❌ [ChatSocket] Company ID não disponível');
      return false;
    }

    console.log('📤 [ChatSocket] Enviando mensagem via WebSocket:', {
      roomId,
      contentLength: content.length,
      connected: this.socket.connected,
      companyId: this.currentCompanyId,
    });

    try {
      // Incluir companyId no payload para garantir que o servidor receba
      this.socket.emit('send_message', {
        roomId,
        content,
        companyId: this.currentCompanyId,
      });
      console.log('✅ [ChatSocket] Evento send_message emitido com sucesso');
      return true;
    } catch (error) {
      console.error('❌ [ChatSocket] Erro ao emitir send_message:', error);
      return false;
    }
  }

  /**
   * Marcar mensagens como lidas
   */
  markAsRead(roomId: string): void {
    if (this.socket?.connected) {
      if (!this.currentCompanyId) {
        console.error(
          '❌ [ChatSocket] Company ID não disponível para mark_as_read'
        );
        return;
      }
      this.socket.emit('mark_as_read', {
        roomId,
        companyId: this.currentCompanyId,
      });
    }
  }

  /**
   * Escutar eventos
   */
  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    console.log(
      `👂 [ChatSocket] Listener registrado para evento ${event}. Total: ${this.listeners.get(event)!.size}`
    );
  }

  /**
   * Remover listener
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      if (callback) {
        eventListeners.delete(callback);
      } else {
        eventListeners.clear();
      }
    }
  }

  /**
   * Emitir evento (para uso interno)
   */
  private emit(event: string, data: any): void {
    this.notifyListeners(event, data);
  }

  /**
   * Desconectar
   */
  disconnect(): void {
    this.isIntentionalDisconnect = true;

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.clearReconnectTimeout();
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.listeners.clear();
  }

  /**
   * Resetar estado de conexão (útil após refresh da página ou para forçar reconexão)
   */
  resetConnectionState(): void {
    this.isConnecting = false;
    this.isIntentionalDisconnect = false;
    this.reconnectAttempts = 0;
    this.cooldownUntil = 0; // Resetar cooldown para permitir nova tentativa imediata
    this.lastConnectionAttempt = 0; // Resetar timestamp da última tentativa
    this.clearReconnectTimeout();
    // Não limpar listeners nem socket aqui - apenas resetar flags
  }

  /**
   * Verificar se está conectado
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Atualizar company ID
   */
  updateCompanyId(companyId: string): void {
    // Obter companyId do localStorage se não fornecido
    const finalCompanyId =
      companyId || localStorage.getItem('dream_keys_selected_company_id');

    if (!finalCompanyId) {
      console.warn(
        '⚠️ [ChatSocket] Company ID não encontrado para atualização'
      );
      return;
    }

    if (this.currentCompanyId !== finalCompanyId) {
      this.currentCompanyId = finalCompanyId;
      // Reconectar com novo company ID se já estiver conectado
      if (this.socket?.connected) {
        console.log('🔄 [ChatSocket] Company ID mudou, reconectando...');
        this.disconnect();
        this.connect(finalCompanyId);
      }
    }
  }
}

export const chatSocketService = new ChatSocketService();
