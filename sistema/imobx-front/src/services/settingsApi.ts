import { api } from './api';

// Tipos
export type NotificationSettings = {
  general: boolean;
  email: boolean;
  push: boolean;
};

export type PushSubscriptionPayload = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userAgent?: string;
  deviceName?: string;
};

export type BackupInfo = {
  backupId: string;
  createdAt: string;
  label?: string;
};

export type DevicesInfo = {
  deviceId: string;
  name: string;
  ip?: string;
  lastActive: string;
  current?: boolean;
};

export class SettingsApi {
  private baseUrl = '/settings';

  // Notificações
  async getNotifications(): Promise<NotificationSettings> {
    const { data } = await api.get(`${this.baseUrl}/notifications`);
    return data.data;
  }
  async updateNotifications(
    payload: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    const { data } = await api.put(`${this.baseUrl}/notifications`, payload);
    return data.data;
  }

  // Push
  async subscribePush(
    payload: PushSubscriptionPayload
  ): Promise<{ subscriptionId: string }> {
    const { data } = await api.post(
      `${this.baseUrl}/notifications/push/subscribe`,
      payload
    );
    return data.data;
  }
  async unsubscribePush(subscriptionId: string): Promise<void> {
    await api.delete(
      `${this.baseUrl}/notifications/push/subscribe/${subscriptionId}`
    );
  }

  // Backup / Restore
  async createBackup(label?: string): Promise<BackupInfo> {
    const { data } = await api.post(
      `${this.baseUrl}/backup`,
      label ? { label } : undefined
    );
    return data.data;
  }
  async listBackups(): Promise<BackupInfo[]> {
    const { data } = await api.get(`${this.baseUrl}/backup`);
    return data.data;
  }
  async restoreBackup(backupId: string): Promise<void> {
    await api.post(`${this.baseUrl}/restore`, { backupId });
  }

  // Sync
  async triggerSync(): Promise<void> {
    await api.post(`${this.baseUrl}/sync`);
  }

  // Analytics
  async getAnalytics(): Promise<{ enabled: boolean }> {
    const { data } = await api.get(`${this.baseUrl}/analytics`);
    return data.data;
  }
  async updateAnalytics(enabled: boolean): Promise<{ enabled: boolean }> {
    const { data } = await api.put(`${this.baseUrl}/analytics`, { enabled });
    return data.data;
  }

  // 2FA (TOTP)
  async setup2FA(): Promise<{ secret: string; qrCodeDataUrl: string }> {
    const { data } = await api.post(`${this.baseUrl}/2fa/setup`);
    return data.data;
  }
  async verify2FA(code: string): Promise<{ enabled: boolean }> {
    const { data } = await api.post(`${this.baseUrl}/2fa/verify`, { code });
    return data.data;
  }
  async disable2FA(): Promise<void> {
    await api.delete(`${this.baseUrl}/2fa`);
  }

  // Admin - reset 2FA do usuário
  async adminResetUser2FA(
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    // Company ID é enviado automaticamente via interceptor (X-Company-ID)
    const { data } = await api.post(`/admin/users/${userId}/reset-2fa`);
    return data;
  }

  // Admin - Configurar 2FA obrigatório por empresa
  async setCompanyRequire2FA(requireTwoFactor: boolean): Promise<any> {
    // Company ID é enviado automaticamente via interceptor (X-Company-ID)
    const { data } = await api.patch(`/companies/require-2fa`, {
      requireTwoFactor,
    });
    return data;
  }

  // Admin - Configurar 2FA obrigatório para uma empresa específica (forçando header)
  async setCompanyRequire2FAFor(
    companyId: string,
    requireTwoFactor: boolean
  ): Promise<any> {
    const { data } = await api.patch(
      `/companies/require-2fa`,
      { requireTwoFactor },
      {
        headers: { 'X-Company-ID': companyId },
      }
    );
    return data;
  }

  // Dispositivos
  async listDevices(): Promise<DevicesInfo[]> {
    const { data } = await api.get(`${this.baseUrl}/devices`);
    return data.data;
  }
  async revokeDevice(deviceId: string): Promise<void> {
    await api.delete(`${this.baseUrl}/devices/${deviceId}`);
  }

  // Export / Import
  async exportSettings(): Promise<any> {
    const { data } = await api.get(`${this.baseUrl}/export`);
    return data;
  }
  async importSettings(payload: any): Promise<void> {
    await api.post(`${this.baseUrl}/import`, { payload });
  }
}

export const settingsApi = new SettingsApi();
export default settingsApi;
