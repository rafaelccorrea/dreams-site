export interface ChatParticipant {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isActive: boolean;
  isAdmin?: boolean; // true se for administrador do grupo
  lastReadAt?: Date;
  joinedAt: Date;
}

export interface ChatRoom {
  id: string;
  companyId: string;
  type: 'direct' | 'support' | 'group';
  name?: string;
  createdBy?: string; // ID do criador do grupo
  imageUrl?: string; // URL da imagem do grupo
  lastMessage?: string;
  lastMessageAt?: Date;
  participants: ChatParticipant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  imageUrl?: string; // URL da imagem anexada (se houver) - compatibilidade
  fileUrl?: string; // URL do arquivo anexado (se houver) - compatibilidade
  fileName?: string; // Nome do arquivo anexado - compatibilidade
  fileType?: string; // Tipo MIME do arquivo - compatibilidade
  documentUrl?: string; // URL do documento anexado (se houver)
  documentName?: string; // Nome original do documento
  documentMimeType?: string; // Tipo MIME do documento (ex: application/pdf)
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  tempId?: string; // ID temporário para mensagens otimistas
  isPending?: boolean; // true se for uma mensagem pendente (enviada enquanto estava offline)
  isSystemMessage?: boolean; // true se for uma mensagem do sistema (entrada/saída de participantes)
  systemEventType?:
    | 'participant_joined'
    | 'participant_left'
    | 'participant_removed'; // Tipo de evento do sistema
}

export interface CreateDirectRoomRequest {
  type: 'direct';
  userId: string;
}

export interface CreateGroupRoomRequest {
  type: 'group';
  name: string;
  userIds: string[];
  adminIds?: string[]; // IDs dos usuários que serão admins (opcional, criador é automaticamente admin)
  imageUrl?: string; // URL da imagem do grupo (opcional)
}

export interface CreateSupportRoomRequest {
  type: 'support';
}

export type CreateRoomRequest =
  | CreateDirectRoomRequest
  | CreateGroupRoomRequest
  | CreateSupportRoomRequest;

export interface SendMessageRequest {
  roomId: string;
  content: string;
  image?: File; // Imagem opcional (DEPRECATED: usar files)
  file?: File; // Arquivo opcional (DEPRECATED: usar files)
  files?: File[]; // Array de arquivos (máximo 1 arquivo por vez: imagem OU documento)
}

export interface AddParticipantsRequest {
  userIds: string[];
}

export interface RemoveParticipantRequest {
  userId: string;
}

export interface MessagesQueryParams {
  limit?: number;
  offset?: number;
}

export interface EditMessageRequest {
  messageId: string;
  content: string;
}

export interface DeleteMessageRequest {
  messageId: string;
}

// Extensão para mensagens editadas
export interface EditedChatMessage extends ChatMessage {
  originalMessageId: string;
}

// Usuário da empresa com status online para chat
export interface CompanyUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: string;
  isOnline: boolean; // Status online/offline
  lastActivity?: Date;
}

// Histórico de atividades do grupo
export interface ChatRoomHistory {
  roomId: string;
  name: string;
  createdBy?: string; // ID do criador
  createdByName?: string; // Nome do criador
  createdAt: Date;
  participants: Array<{
    userId: string;
    userName: string;
    isAdmin: boolean;
    joinedAt: Date; // Quando entrou no grupo
    leftAt?: Date; // Quando saiu do grupo (se saiu)
    isActive: boolean; // Se ainda está ativo no grupo
  }>;
}

// Eventos WebSocket do chat
export interface ParticipantLeftEvent {
  roomId: string;
  userId: string;
  userName: string;
  leftAt: string;
  timestamp: string;
  removedBy?: string; // ID do usuário que removeu (se foi removido)
  removedByName?: string; // Nome do usuário que removeu (se foi removido)
  isRemoved?: boolean; // true se foi removido, false se saiu voluntariamente
}

export interface ParticipantAddedEvent {
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  addedBy?: string; // ID do usuário que adicionou
  addedByName?: string; // Nome do usuário que adicionou
  timestamp: string;
}

export interface ParticipantRemovedEvent {
  roomId: string;
  userId: string;
  userName: string;
  removedBy: string; // ID do usuário que removeu
  removedByName: string; // Nome do usuário que removeu
  timestamp: string;
}

export interface RoomUpdatedEvent {
  roomId: string;
  name?: string;
  imageUrl?: string;
  updatedBy?: string;
  updatedByName?: string;
  timestamp: string;
}
