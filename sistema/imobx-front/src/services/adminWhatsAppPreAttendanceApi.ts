import { api } from './api';

export interface CompanyWhatsAppPreAttendanceRow {
  companyId: string;
  companyName: string;
  ownerEmail: string | null;
  hasWhatsAppConfig: boolean;
  chatbotEnabled: boolean;
  enableAIPreAttend: boolean;
  hasWhatsAppAIModule: boolean;
  usingIA: boolean;
  usingChatbot: boolean;
}

export const adminWhatsAppPreAttendanceApi = {
  list(): Promise<CompanyWhatsAppPreAttendanceRow[]> {
    return api
      .get<CompanyWhatsAppPreAttendanceRow[]>('/admin/whatsapp-pre-attendance')
      .then(r => r.data);
  },

  setChatbotEnabled(
    companyId: string,
    enabled: boolean,
  ): Promise<CompanyWhatsAppPreAttendanceRow> {
    return api
      .patch<CompanyWhatsAppPreAttendanceRow>(
        `/admin/whatsapp-pre-attendance/${companyId}/chatbot`,
        { enabled },
      )
      .then(r => r.data);
  },

  setIAEnabled(
    companyId: string,
    enabled: boolean,
  ): Promise<CompanyWhatsAppPreAttendanceRow> {
    return api
      .patch<CompanyWhatsAppPreAttendanceRow>(
        `/admin/whatsapp-pre-attendance/${companyId}/ia`,
        { enabled },
      )
      .then(r => r.data);
  },
};
