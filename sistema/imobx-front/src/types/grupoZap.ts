/**
 * Tipos TypeScript para integração Portal Grupo ZAP (ZAP, Viva Real, OLX)
 */

/** Payload que o Grupo ZAP envia no webhook de leads (modelo real do portal) */
export interface GrupoZapWebhookLeadExtraData {
  feedback?: string;
  izi?: string;
  leadCerto?: boolean;
  leadType?: string; // ex: "CONTACT_FORM"
}

export interface GrupoZapWebhookLeadPayload {
  clientListingId?: string;
  email?: string;
  leadOrigin?: string;
  message?: string;
  name?: string;
  originLeadId?: string;
  originListingId?: string;
  ddd?: string;
  phone?: string;
  phoneNumber?: string;
  timestamp?: string;
  temperature?: string;
  transactionType?: string; // ex: "RENT", "SALE"
  extraData?: GrupoZapWebhookLeadExtraData;
}

export interface GrupoZapConfig {
  id?: string;
  companyId?: string;
  isActive: boolean;
  apiKey?: string;
  partnerId?: string;
  syncProperties?: boolean;
  syncLeads?: boolean;
  /** Funil (projeto Kanban) para onde enviar leads do Grupo ZAP */
  kanbanProjectId?: string;
  /** Responsável opcional pelos leads */
  responsibleUserId?: string;
  /** Token para URL do feed XML (gerado pelo backend) */
  feedToken?: string;
  /** Token para URL do webhook de leads (gerado pelo backend) */
  webhookToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGrupoZapConfigRequest {
  apiKey?: string;
  partnerId?: string;
  syncProperties?: boolean;
  syncLeads?: boolean;
  isActive?: boolean;
  kanbanProjectId?: string;
  responsibleUserId?: string;
}

export interface UpdateGrupoZapConfigRequest {
  apiKey?: string;
  partnerId?: string;
  syncProperties?: boolean;
  syncLeads?: boolean;
  isActive?: boolean;
  kanbanProjectId?: string;
  responsibleUserId?: string;
}
