/**
 * Utilitário para navegação de notificações
 *
 * Este arquivo contém a lógica de redirecionamento baseado no tipo de notificação.
 * Segue a especificação do guia de notificações do backend.
 */

import type { Notification } from '../services/notificationApi';

/**
 * Determina a URL de navegação para uma notificação
 *
 * @param notification - A notificação para determinar a URL
 * @returns A URL de navegação ou null se não puder ser determinada
 */
export function getNotificationNavigationUrl(
  notification: Notification
): string | null {
  // Prioridade 1: Se tem actionUrl definido, usar ele
  if (notification.actionUrl) {
    return notification.actionUrl;
  }

  // Prioridade 2: Usar fallback baseado no entityType e entityId
  if (!notification.entityType || !notification.entityId) {
    return null;
  }

  switch (notification.entityType) {
    // Vistorias / Inspections
    case 'inspection':
      return `/inspections/${notification.entityId}`;

    case 'inspection_approval':
      return `/financial/inspection-approvals`;

    // Aluguéis / Rentals
    case 'rental':
      return `/rentals/${notification.entityId}`;

    // Chaves / Keys
    case 'key':
      return `/keys/${notification.entityId}`;

    // Pagamentos / Payments
    case 'payment':
      return `/financial/payments/${notification.entityId}`;

    // Documentos / Documents
    case 'document':
      // Para documentos, verificar metadata para determinar se é cliente ou propriedade
      if (notification.metadata?.clientId) {
        return `/clients/${notification.metadata.clientId}/documents`;
      } else if (notification.metadata?.propertyId) {
        return `/properties/${notification.metadata.propertyId}/documents`;
      }
      return null;

    // Tarefas / Tasks
    case 'task':
      return `/tasks/${notification.entityId}`;

    // Compromissos / Appointments
    case 'appointment':
      return `/appointments/${notification.entityId}`;

    case 'appointment_invite':
      return `/appointments/invites/${notification.entityId}`;

    // Notas / Notes
    case 'note':
      return `/notes/${notification.entityId}`;

    // Mensagens / Messages
    case 'message':
      return `/messages/${notification.entityId}`;

    // Assinaturas / Subscriptions
    case 'subscription':
      return `/subscriptions`;

    // Matches de Propriedades
    case 'property_match':
      // Redirecionar para a página de matches da propriedade
      if (notification.metadata?.propertyId) {
        return `/properties/${notification.metadata.propertyId}/matches`;
      }
      return `/matches`;

    // Propriedades
    case 'property':
      return `/properties/${notification.entityId}`;

    default:
      console.warn(
        '[NotificationNavigation] Tipo de entidade desconhecido:',
        notification.entityType
      );
      return null;
  }
}

/**
 * Mapa de tipos de notificação para descrição legível
 */
export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  // Aluguéis
  RENTAL_EXPIRING: 'Aluguel Expirando',
  RENTAL_EXPIRED: 'Aluguel Vencido',

  // Pagamentos
  PAYMENT_DUE: 'Pagamento a Vencer',
  PAYMENT_OVERDUE: 'Pagamento Atrasado',

  // Chaves
  KEY_PENDING_RETURN: 'Devolução de Chave Pendente',
  KEY_OVERDUE: 'Devolução de Chave Atrasada',

  // Vistorias
  INSPECTION_SCHEDULED: 'Vistoria Agendada',
  INSPECTION_OVERDUE: 'Vistoria Atrasada',
  INSPECTION_APPROVAL_REQUESTED: 'Aprovação de Vistoria Solicitada',
  INSPECTION_APPROVED: 'Vistoria Aprovada',
  INSPECTION_REJECTED: 'Vistoria Rejeitada',

  // Documentos
  CLIENT_DOCUMENT_EXPIRING: 'Documento de Cliente Expirando',
  PROPERTY_DOCUMENT_EXPIRING: 'Documento de Propriedade Expirando',

  // Tarefas
  TASK_ASSIGNED: 'Tarefa Atribuída',
  TASK_DUE: 'Tarefa a Vencer',
  TASK_OVERDUE: 'Tarefa Atrasada',

  // Notas
  NOTE_PENDING: 'Nota Pendente',

  // Compromissos
  APPOINTMENT_REMINDER: 'Lembrete de Compromisso',
  APPOINTMENT_INVITE: 'Convite para Compromisso',
  APPOINTMENT_INVITE_ACCEPTED: 'Convite Aceito',
  APPOINTMENT_INVITE_DECLINED: 'Convite Recusado',

  // Assinaturas
  SUBSCRIPTION_EXPIRING_SOON: 'Assinatura Expirando',
  SUBSCRIPTION_EXPIRED: 'Assinatura Expirada',

  // Sistema
  SYSTEM_ALERT: 'Alerta do Sistema',
  NEW_MESSAGE: 'Nova Mensagem',

  // Matches de Propriedades
  PROPERTY_MATCH_FOUND: 'Match de Propriedade Encontrado',
  PROPERTY_MATCH_HIGH_SCORE: 'Match de Propriedade com Alta Compatibilidade',
  property_match_found: 'Match de Propriedade Encontrado',
  property_match_high_score: 'Match de Propriedade com Alta Compatibilidade',
};

/**
 * Configuração de prioridades de notificação
 */
export const NOTIFICATION_PRIORITY_CONFIG = {
  urgent: {
    color: '#dc2626',
    icon: 'alert-circle',
    badgeColor: 'bg-red-500',
    label: 'Urgente',
  },
  high: {
    color: '#ea580c',
    icon: 'alert-triangle',
    badgeColor: 'bg-orange-500',
    label: 'Alta',
  },
  medium: {
    color: '#2563eb',
    icon: 'info',
    badgeColor: 'bg-blue-500',
    label: 'Média',
  },
  low: {
    color: '#64748b',
    icon: 'message-circle',
    badgeColor: 'bg-gray-500',
    label: 'Baixa',
  },
} as const;

/**
 * Tipos de entidade suportados
 */
export const ENTITY_TYPES = [
  'inspection',
  'inspection_approval',
  'rental',
  'key',
  'payment',
  'document',
  'task',
  'appointment',
  'appointment_invite',
  'note',
  'message',
  'subscription',
  'property_match',
  'property',
] as const;

export type EntityType = (typeof ENTITY_TYPES)[number];

/**
 * Interface para metadata de notificações de match
 */
export interface PropertyMatchNotificationMetadata {
  propertyId: string;
  propertyTitle: string;
  propertyCode?: string;
  totalMatches: number;
  highScoreMatches: number;
  propertyType?: string;
  propertyCity?: string;
  propertyState?: string;
  propertyPrice?: number;
  matchScores?: Array<{
    clientId: string;
    score: number;
  }>;
}
