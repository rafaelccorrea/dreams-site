/**
 * Tipos para integração do assistente Zezin (IA + WhatsApp).
 * Zezin é exclusivo para administradores no plano Pro com módulo Assistente de IA.
 */

export interface ZezinAvailability {
  available: boolean;
  assistantName: string;
  configConfigured: boolean;
}

export interface ZezinConfig {
  id: string;
  companyId: string;
  phoneNumberId: string;
  phoneNumber?: string;
  apiToken?: string; // mascarado quando retornado (ex: ************5678)
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateZezinConfigRequest {
  phoneNumberId: string;
  apiToken: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export interface UpdateZezinConfigRequest {
  phoneNumberId?: string;
  apiToken?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export interface ZezinAskRequest {
  message: string;
}

export interface ZezinAskResponse {
  answer: string;
}

export interface ZezinSuggestedQuestion {
  id: string;
  label: string;
  message: string;
}

export interface ZezinSuggestedQuestionsResponse {
  questions: ZezinSuggestedQuestion[];
}

export interface ZezinSendSuggestionButtonsRequest {
  to: string;
}

export interface ZezinSendSuggestionButtonsResponse {
  messageId: string;
  status: string;
}

/** Item do histórico de conversas com o Zezin (pergunta + resposta). */
export interface ZezinHistoryItem {
  id: string;
  message: string;
  answer: string;
  createdAt: string;
}

export interface ZezinHistoryResponse {
  items: ZezinHistoryItem[];
}
