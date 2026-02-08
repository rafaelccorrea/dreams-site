import { io, Socket } from 'socket.io-client';
import { authStorage } from './authStorage';
import { API_BASE_URL } from '../config/apiConfig';
import { showForceLogoutNotification } from '../utils/notifications';
import { getNavigationUrl } from '../utils/pathUtils';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3; // REDUZIDO para evitar loops
  private baseReconnectDelay = 5000; // AUMENTADO: 5 segundos
  private maxReconnectDelay = 60000; // AUMENTADO: 1 minuto
  private isConnecting = false;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private isIntentionalDisconnect = false; // Flag para desconexão intencional
  private listenersSetup = false; // Flag para evitar múltiplos listeners
  private lastConnectionAttempt = 0; // Timestamp da última tentativa
  private minConnectionInterval = 5000; // Mínimo 5 segundos entre tentativas

  connect(): void {
    // Evitar múltiplas conexões simultâneas
    if (this.socket?.connected || this.isConnecting) {
      // console.log('🔌 WebSocket já conectado ou conectando, ignorando...');
      return;
    }

    // CORREÇÃO: Verificar intervalo mínimo entre tentativas
    const now = Date.now();
    if (now - this.lastConnectionAttempt < this.minConnectionInterval) {
      return;
    }
    this.lastConnectionAttempt = now;

    // CORREÇÃO: Verificar máximo de tentativas
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    const token = authStorage.getToken();
    if (!token || !authStorage.isAuthenticated()) {
      // console.log('🔌 Sem token válido, não conectando WebSocket');
      return;
    }

    this.isConnecting = true;
    this.isIntentionalDisconnect = false;
    // console.log('🔌 Conectando WebSocket...');
    this.socket = io(`${API_BASE_URL}/session`, {
      auth: {
        token: token,
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      // CORREÇÃO: Usar apenas websocket para evitar polling infinito
      // Se websocket falhar, não fazer fallback para polling
      transports: ['websocket'],
      timeout: 10000,
      forceNew: true,
      reconnection: false, // Desabilitar reconexão automática do socket.io para usar nossa própria lógica
    });

    this.setupEventListeners();

    // Configurar listeners globais apenas uma vez
    if (!this.listenersSetup) {
      this.setupVisibilityListener();
      this.setupOnlineListener();
      this.listenersSetup = true;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      // console.log('✅ WebSocket conectado com sucesso');
      this.reconnectAttempts = 0;
      this.isConnecting = false;

      // Limpar timeout de reconexão se houver
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    });

    this.socket.on('disconnect', reason => {
      // console.log('❌ WebSocket desconectado:', reason);
      this.isConnecting = false;

      // Só tentar reconectar se não foi desconexão intencional
      if (!this.isIntentionalDisconnect && reason !== 'io client disconnect') {
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', error => {
      console.error('❌ Erro de conexão WebSocket:', error);
      this.isConnecting = false;

      // Só tentar reconectar se não foi desconexão intencional
      if (!this.isIntentionalDisconnect) {
        this.handleReconnect();
      }
    });

    this.socket.on('force_logout', data => {
      console.warn('🚪 Logout forçado recebido:', data);
      this.handleForceLogout(data);
    });

    this.socket.on('user_connected', data => {
      // console.log('👤 Nova sessão conectada:', data);
    });

    this.socket.on('user_disconnected', data => {
      // console.log('👤 Sessão desconectada:', data);
    });

    this.socket.on('pong', data => {
      // console.log('🏓 Pong recebido:', data);
    });
  }

  private handleReconnect(): void {
    // Evitar múltiplas tentativas de reconexão simultâneas
    if (this.reconnectTimeout || this.isIntentionalDisconnect) {
      return;
    }

    this.reconnectAttempts++;

    // Calcular delay com exponential backoff
    const exponentialDelay =
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    const delay = Math.min(exponentialDelay, this.maxReconnectDelay);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;

      // Verificar se ainda tem token válido antes de reconectar
      if (!authStorage.isAuthenticated()) {
        // console.log('🔌 Token inválido, cancelando reconexão');
        return;
      }

      // Desconectar socket antigo se existir
      if (this.socket) {
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket = null;
      }

      this.connect();
    }, delay);
  }

  // Listener para quando o usuário volta à aba
  private setupVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      if (
        !document.hidden &&
        !this.socket?.connected &&
        authStorage.isAuthenticated()
      ) {
        // console.log('👁️ Usuário voltou à aba, verificando conexão...');
        // Resetar tentativas e tentar reconectar
        this.reconnectAttempts = 0;

        // Pequeno delay para evitar reconexões muito rápidas
        setTimeout(() => {
          if (!this.socket?.connected) {
            // console.log('🔄 Reconectando após retorno à aba...');
            this.connect();
          }
        }, 1000);
      }
    });
  }

  // Listener para quando a conexão de internet voltar
  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      // console.log('🌐 Conexão de internet restaurada');
      if (!this.socket?.connected && authStorage.isAuthenticated()) {
        // Resetar tentativas e reconectar
        this.reconnectAttempts = 0;

        setTimeout(() => {
          // console.log('🔄 Reconectando após restauração da internet...');
          this.connect();
        }, 2000);
      }
    });

    window.addEventListener('offline', () => {
      // console.log('🌐 Conexão de internet perdida');
    });
  }

  private handleForceLogout(data: any): void {
    // Verificar se o logout foi causado por refresh de token
    const isTokenRefresh =
      data.reason === 'token_refresh' ||
      data.message?.includes('token') ||
      data.message?.includes('refresh');

    if (isTokenRefresh) {
      // console.log('🔄 Logout causado por refresh de token, reconectando...');
      // Tentar reconectar em vez de fazer logout
      setTimeout(() => {
        this.connect();
      }, 2000);
      return;
    }

    // Limpar dados de autenticação apenas se for logout real
    authStorage.clearAllAuthData();

    // Mostrar notificação elegante para o usuário
    const message =
      data.message ||
      'Você foi desconectado porque fez login em outro dispositivo/navegador';

    // Usar notificação toast personalizada
    showForceLogoutNotification(`${message}\n\nDeseja fazer login novamente?`);

    // Redirecionar após um delay para dar tempo do usuário ver a notificação
    setTimeout(() => {
      window.location.href = getNavigationUrl('/login');
    }, 3000);
  }

  disconnect(): void {
    this.isIntentionalDisconnect = true;

    if (this.socket) {
      // console.log('🔌 Desconectando WebSocket...');
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    // Limpar timeout de reconexão se existir
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  sendPing(): void {
    if (this.socket?.connected) {
      this.socket.emit('ping');
    }
  }

  confirmLogout(): void {
    if (this.socket?.connected) {
      this.socket.emit('logout_confirmed');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  // Método público para escutar eventos
  on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Método público para remover listeners
  off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Método público para emitir eventos
  emit(event: string, ...args: any[]): void {
    if (this.socket) {
      this.socket.emit(event, ...args);
    }
  }

  // Método para resetar tentativas de reconexão (usado após login)
  resetReconnectAttempts(): void {
    this.reconnectAttempts = 0;
    // console.log('🔄 Tentativas de reconexão resetadas');
  }
}

// Instância singleton
export const webSocketService = new WebSocketService();

// Conectar automaticamente apenas se houver token válido
const token = authStorage.getToken();
if (token && authStorage.isAuthenticated()) {
  // console.log('🔌 Token encontrado, conectando WebSocket...');
  webSocketService.connect();
} else {
  // console.log('🔌 Sem token válido, WebSocket não será conectado');
}

// Desconectar quando o token for removido
const originalClearAuthData = authStorage.clearAllAuthData;
authStorage.clearAllAuthData = function () {
  originalClearAuthData.call(this);
  webSocketService.disconnect();
};

// Reconectar quando o token for renovado
const originalSaveAuthData = authStorage.saveAuthData;
authStorage.saveAuthData = function (
  authData: any,
  rememberMe: boolean = false
) {
  originalSaveAuthData.call(this, authData, rememberMe);

  // Resetar tentativas de reconexão quando um novo token é salvo
  webSocketService.resetReconnectAttempts();

  // Se o WebSocket não está conectado, reconectar com o novo token
  if (!webSocketService.isConnected()) {
    // console.log('🔄 Token renovado, reconectando WebSocket...');
    setTimeout(() => {
      webSocketService.connect();
    }, 1000); // Pequeno delay para garantir que o token foi salvo
  }
};
