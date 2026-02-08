/**
 * Tipos TypeScript para integração WhatsApp
 */

export type WhatsAppMessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'location'
  | 'contact'
  | 'sticker'
  | 'voice';
export type WhatsAppMessageDirection = 'inbound' | 'outbound';
export type WhatsAppMessageStatus =
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'pending';

export interface WhatsAppMessage {
  id: string; // UUID
  phoneNumber: string; // Número normalizado (5511999999999)
  contactName?: string; // Nome do contato (preenchido automaticamente tanto para mensagens recebidas quanto enviadas)
  contactAvatarUrl?: string; // URL do avatar/foto de perfil do contato (se disponível)
  messageType: WhatsAppMessageType;
  direction: WhatsAppMessageDirection;
  message?: string; // Conteúdo da mensagem (texto ou legenda de mídia)
  mediaUrl?: string; // URL assinada (presigned URL) da mídia no S3 - válida por 1 hora (gerada automaticamente pelo backend)
  mediaS3Key?: string; // Chave S3 do arquivo (usado internamente para gerar URLs assinadas)
  mediaMimeType?: string; // Tipo MIME da mídia (ex: image/jpeg, audio/ogg, video/mp4)
  mediaFileName?: string; // Nome do arquivo (para documentos)
  status: WhatsAppMessageStatus;
  whatsappMessageId?: string; // ID da mensagem no WhatsApp
  replyToMessageId?: string; // ID da mensagem de resposta
  clientId?: string; // ID do cliente vinculado
  kanbanTaskId?: string; // ID da tarefa Kanban criada
  teamId?: string; // ID da equipe quando houver tarefa vinculada (necessário para redirecionar ao Kanban)
  companyId: string;
  userId?: string; // Usuário que enviou/recebeu
  assignedToId?: string; // ID do SDR responsável pela mensagem (distribuição)
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  }; // Dados do SDR atribuído
  detectedSource?: string; // Fonte detectada (Facebook/Instagram, Zap Imóveis, etc.)
  webhookData?: Record<string, any>; // Dados adicionais do webhook
  createdAt: Date;
  updatedAt?: Date;
  readAt?: Date; // Data em que a mensagem foi lida (atualizado automaticamente via webhook)
}

export interface WhatsAppWebhookPayload {
  event: 'message' | 'message_status' | 'conversation';
  contact: {
    name?: string;
    phoneNumber: string;
  };
  message?: {
    id: string;
    type: string;
    text?: string;
    mediaUrl?: string;
    mimeType?: string;
    fileName?: string;
    replyToMessageId?: string;
    timestamp?: string;
  };
  status?: string; // Se evento for message_status
  metadata?: Record<string, any>;
}

export interface SendMessageRequest {
  to: string; // Número de telefone (5511999999999)
  message: string; // Mensagem de texto
  /**
   * ID do cliente (opcional)
   *
   * NOTA v1.8: Se não fornecido, o sistema:
   * - Busca automaticamente um cliente pelo número de telefone
   * - Cria um novo cliente se não encontrar
   * - Salva automaticamente a mensagem no histórico
   * - Recupera via Message Echoes se o salvamento falhar
   */
  clientId?: string;
  image?: File; // Arquivo de imagem para upload (opcional)
  imageUrl?: string; // URL da imagem (opcional, se não usar upload)
}

export interface SendTemplateRequest {
  to: string; // Número de telefone (5511999999999)
  templateName: string; // Nome do template aprovado
  parameters?: string[]; // Parâmetros do template (opcional)
  clientId?: string; // ID do cliente (opcional)
}

export interface SendPropertyOptionsRequest {
  phoneNumber: string;
  neighborhood?: string;
  minValue?: number;
  maxValue?: number;
  operation?: 'sale' | 'rent';
  limit?: number;
}

export interface SendPropertyOptionsResponse {
  sent: number;
  message?: string;
}

export interface CreateTaskFromMessageRequest {
  // ⚠️ IMPORTANTE: O sistema SEMPRE usa o projeto padrão configurado e a primeira coluna do projeto
  // Não é necessário (e não é recomendado) fornecer projectId ou columnId
  // O backend ignora esses campos se fornecidos e sempre usa:
  // - Projeto: defaultProjectId da configuração do WhatsApp
  // - Coluna: Primeira coluna ativa do projeto (menor posição, geralmente posição 0)
  assignedToId?: string; // UUID do usuário (opcional - se não fornecido, usa o usuário do request se estiver no projeto)
  customTitle?: string; // Título customizado (opcional)
}

export interface AnalyzeMessageRequest {
  message: string; // Mensagem de texto para analisar
  phoneNumber: string; // Número de telefone
  contactName?: string; // Nome do contato (opcional)
}

export interface ExtractedData {
  name?: string;
  phone?: string;
  email?: string;
  interest?: 'compra' | 'venda' | 'aluguel';
  propertyType?: string;
  location?: string;
  budget?: number;
  urgency?: 'low' | 'medium' | 'high';
  confidence?: number; // 0-1
}

export interface AnalyzeMessageResponse {
  intent: 'lead' | 'question' | 'complaint' | 'other';
  extractedData: ExtractedData;
  suggestedResponse?: string; // Resposta sugerida pela IA
  shouldCreateTask: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface WhatsAppMessagesQueryParams {
  limit?: number;
  offset?: number;
  phoneNumber?: string;
  clientId?: string;
  kanbanTaskId?: string;
  direction?: WhatsAppMessageDirection;
  status?: WhatsAppMessageStatus;
  messageType?: WhatsAppMessageType;
  unreadOnly?: boolean;
  hasTask?: boolean;
  search?: string;
  startDate?: string;
  endDate?: string;
  groupByPhone?: boolean; // Agrupar mensagens por telefone (conversas)
  assignedToId?: string; // Filtrar por SDR específico (apenas Admin/Master/Manager)
  timeStatus?: TimeStatus; // Filtrar por status de tempo: on_time, delayed, critical (apenas Admin/Master/Manager)
}

export interface WhatsAppMessagesResponse {
  messages: WhatsAppMessageWithRelations[]; // Mensagens com relacionamentos expandidos
  total: number;
  limit?: number;
  offset?: number;
}

export interface SendMessageResponse {
  messageId: string; // wamid.xxx
  status: WhatsAppMessageStatus;
}

export interface SendTemplateResponse {
  messageId: string; // wamid.xxx
  status: WhatsAppMessageStatus;
}

export interface CreateTaskFromMessageResponse {
  taskId: string; // UUID da tarefa criada
  message: string;
  teamId?: string; // ID da equipe (opcional - pode ser obtido do projeto)
}

export interface WhatsAppConfig {
  id: string;
  companyId: string;
  apiUrl?: string;
  apiToken?: string; // Token mascarado (últimos 4 caracteres visíveis)
  phoneNumberId?: string;
  phoneNumber?: string;
  businessName?: string;
  webhookVerifyToken?: string;
  defaultProjectId?: string; // Projeto padrão para criação de tarefas (opcional)
  isActive: boolean;
  autoCreateClient?: boolean; // Se deve criar cliente automaticamente ao receber mensagem
  autoCreateTask?: boolean; // Se deve criar tarefa Kanban automaticamente ao receber mensagem
  enableAIPreAttend?: boolean; // Se a IA deve fazer pré-atendimento (coletar dados e fornecer follow-up)
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWhatsAppConfigRequest {
  apiUrl?: string;
  apiToken?: string; // Opcional se já existe configuração (para manter o atual)
  phoneNumberId: string;
  phoneNumber?: string;
  businessName?: string;
  webhookVerifyToken?: string;
  defaultProjectId?: string; // Projeto padrão para criação de tarefas (opcional)
  isActive?: boolean;
  autoCreateClient?: boolean; // Se deve criar cliente automaticamente ao receber mensagem
  autoCreateTask?: boolean; // Se deve criar tarefa Kanban automaticamente ao receber mensagem
  enableAIPreAttend?: boolean; // Se a IA deve fazer pré-atendimento (coletar dados e fornecer follow-up)
}

export interface UpdateWhatsAppConfigRequest {
  apiUrl?: string;
  apiToken?: string;
  phoneNumberId?: string;
  phoneNumber?: string;
  businessName?: string;
  webhookVerifyToken?: string;
  defaultProjectId?: string; // Projeto padrão para criação de tarefas (opcional)
  isActive?: boolean;
  autoCreateClient?: boolean; // Se deve criar cliente automaticamente ao receber mensagem
  autoCreateTask?: boolean; // Se deve criar tarefa Kanban automaticamente ao receber mensagem
  enableAIPreAttend?: boolean; // Se a IA deve fazer pré-atendimento (coletar dados e fornecer follow-up)
}

export interface UnreadCountResponse {
  count: number;
  companyId: string;
}

// Tipos para relacionamentos na resposta de mensagens
export interface WhatsAppMessageClient {
  id: string;
  name: string;
  phone?: string;
}

export interface WhatsAppMessageKanbanTask {
  id: string;
  title: string;
}

// Mensagem com relacionamentos expandidos
export interface WhatsAppMessageWithRelations extends WhatsAppMessage {
  client?: WhatsAppMessageClient;
  kanbanTask?: WhatsAppMessageKanbanTask;
}

// Tipos para distribuição de mensagens para SDRs
export type DistributionType =
  | 'round_robin'
  | 'load_balanced'
  | 'manual'
  | 'first_available';

export interface DistributionConfig {
  id: string;
  companyId: string;
  distributionType: DistributionType;
  sdrUserIds?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateDistributionConfigRequest {
  distributionType: DistributionType;
  sdrUserIds?: string[];
  isActive?: boolean;
}

export interface AssignMessageRequest {
  sdrUserId: string;
}

// Tipos para notificações baseadas em tempo
export type TimeStatus = 'on_time' | 'delayed' | 'critical';

export interface NotificationConfig {
  id: string;
  companyId: string;
  onTimeMinutes: number;
  delayedMinutes: number;
  criticalMinutes: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateNotificationConfigRequest {
  onTimeMinutes?: number;
  delayedMinutes?: number;
  criticalMinutes?: number;
  isActive?: boolean;
}

export interface MessageTimeStatus {
  status: TimeStatus;
  minutesSinceReceived: number;
  onTimeMinutes: number;
  delayedMinutes: number;
  criticalMinutes: number;
}

export interface MessagesNeedingNotificationStatistics {
  totalToday: number;
  totalThisWeek: number;
  totalThisMonth: number;
  byStatus: {
    onTime: number;
    delayed: number;
    critical: number;
  };
  byHour: Array<{
    hour: number;
    count: number;
  }>;
  averageResponseTime: number;
  unreadCount: number;
  readCount: number;
  withTask: number;
  withoutTask: number;
  assignedCount: number;
  unassignedCount: number;
}

export interface MessagesNeedingNotificationResponse {
  messages: WhatsAppMessage[];
  statistics: MessagesNeedingNotificationStatistics;
  filters?: {
    status?: string[];
    startDate?: string;
    endDate?: string;
  };
}
