import { io, Socket } from 'socket.io-client';
import { authStorage } from './authStorage';
import { API_BASE_URL } from '../config/apiConfig';

type KanbanSocketEvent = 'task_updated';

const BASE_URL = API_BASE_URL;

class KanbanSocketService {
  private socket: Socket | null = null;
  private isConnecting = false;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  private ensureConnection() {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    const token = authStorage.getToken();

    if (!token || !authStorage.isAuthenticated()) {
      return;
    }

    this.isConnecting = true;

    this.socket = io(`${BASE_URL}/kanban`, {
      auth: {
        token,
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      // CORREÇÃO: Usar apenas websocket para evitar polling infinito
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      this.isConnecting = false;
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    });

    this.socket.on('disconnect', () => {
      this.scheduleReconnect();
    });

    this.socket.on('connect_error', () => {
      this.scheduleReconnect();
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      return;
    }

    this.isConnecting = false;

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.ensureConnection();
    }, 5000);
  }

  on<T = any>(event: KanbanSocketEvent, callback: (payload: T) => void) {
    this.ensureConnection();
    this.socket?.on(event, callback);
  }

  off<T = any>(event: KanbanSocketEvent, callback?: (payload: T) => void) {
    this.socket?.off(event, callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.isConnecting = false;
  }
}

export const kanbanSocketService = new KanbanSocketService();
