export const RentalAlertType = {
  PAYMENT_DUE: 'payment_due',
  PAYMENT_OVERDUE: 'payment_overdue',
  CONTRACT_EXPIRING: 'contract_expiring',
  CONTRACT_EXPIRED: 'contract_expired',
} as const;

export type RentalAlertType =
  (typeof RentalAlertType)[keyof typeof RentalAlertType];

export const NotificationChannel = {
  EMAIL: 'email',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
  IN_APP: 'in_app',
} as const;

export type NotificationChannel =
  (typeof NotificationChannel)[keyof typeof NotificationChannel];

export const RentalAlertTypeLabels: Record<RentalAlertType, string> = {
  [RentalAlertType.PAYMENT_DUE]: 'Vencimento de Pagamento',
  [RentalAlertType.PAYMENT_OVERDUE]: 'Pagamento Atrasado',
  [RentalAlertType.CONTRACT_EXPIRING]: 'Contrato Expirando',
  [RentalAlertType.CONTRACT_EXPIRED]: 'Contrato Expirado',
};

export const NotificationChannelLabels: Record<NotificationChannel, string> = {
  [NotificationChannel.EMAIL]: 'Email',
  [NotificationChannel.SMS]: 'SMS',
  [NotificationChannel.WHATSAPP]: 'WhatsApp',
  [NotificationChannel.IN_APP]: 'Notificação no App',
};

export interface RentalAlertSettings {
  id: string;
  alertType: RentalAlertType;
  isActive: boolean;
  daysBeforeAlert: number;
  channels: NotificationChannel[];
  customMessage?: string;
  sendToTenant: boolean;
  sendToAdmin: boolean;
  additionalRecipients?: string[];
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRentalAlertSettingsRequest {
  alertType: RentalAlertType;
  isActive?: boolean;
  daysBeforeAlert: number;
  channels: NotificationChannel[];
  customMessage?: string;
  sendToTenant?: boolean;
  sendToAdmin?: boolean;
  additionalRecipients?: string[];
}

export interface UpdateRentalAlertSettingsRequest {
  isActive?: boolean;
  daysBeforeAlert?: number;
  channels?: NotificationChannel[];
  customMessage?: string;
  sendToTenant?: boolean;
  sendToAdmin?: boolean;
  additionalRecipients?: string[];
}
