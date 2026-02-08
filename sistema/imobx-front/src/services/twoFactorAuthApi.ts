import { api } from './api';

export interface CheckTwoFactorResponse {
  requires2FA: boolean;
  hasTwoFactorConfigured: boolean;
  emailExists: boolean;
}

class TwoFactorAuthApi {
  async verifyLoginTwoFactor(tempToken: string, code: string): Promise<any> {
    const response = await api.post('/auth/verify-2fa', { tempToken, code });
    return response.data || response;
  }

  async checkTwoFactorStatus(email: string): Promise<CheckTwoFactorResponse> {
    const response = await api.post('/auth/check-2fa', { email });
    return response.data || response;
  }

  // Fluxo público de configuração (pré-login)
  async startPublicSetup(
    email: string,
    password: string
  ): Promise<{ secret: string; qrCodeDataUrl: string }> {
    const response = await api.post('/auth/2fa/setup', { email, password });
    const payload = response.data || response;
    // Backend responde { success, data: { secret, qrCodeDataUrl } }
    return payload?.data ?? payload;
  }

  async verifyPublicSetup(
    email: string,
    password: string,
    code: string
  ): Promise<{ enabled: boolean }> {
    const response = await api.post('/auth/2fa/verify-setup', {
      email,
      password,
      code,
    });
    const payload = response.data || response;
    // Backend responde { success, data: { enabled } }
    return payload?.data ?? payload;
  }
}

export const twoFactorAuthApi = new TwoFactorAuthApi();
export default twoFactorAuthApi;
