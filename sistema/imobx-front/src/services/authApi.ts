import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  owner: boolean;
  avatar?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  // Novos campos para hierarquia
  managerId?: string;
  managedUserIds?: string[];
  // Visibilidade pública no site
  isAvailableForPublicSite?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  companyId: string;
}

export interface Session {
  id: string;
  userId: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  isCurrent: boolean;
  lastActivity: string;
  createdAt: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class AuthApiService {
  private baseUrl = '/auth';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post(`${this.baseUrl}/login`, credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await api.post(`${this.baseUrl}/register`, userData);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post(`${this.baseUrl}/logout`);
  }

  async refreshToken(request: RefreshTokenRequest): Promise<LoginResponse> {
    const response = await api.post(`${this.baseUrl}/refresh`, request);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await api.get(`${this.baseUrl}/profile`);
    return response.data;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put(`${this.baseUrl}/profile`, userData);
    return response.data;
  }

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    await api.put(`${this.baseUrl}/change-password`, request);
  }

  async getSessions(): Promise<Session[]> {
    const response = await api.get(`${this.baseUrl}/sessions`);
    return response.data;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await api.delete(`${this.baseUrl}/sessions/${sessionId}`);
  }

  async revokeAllOtherSessions(): Promise<void> {
    await api.delete(`${this.baseUrl}/sessions/others`);
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post(`${this.baseUrl}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async updatePublicVisibility(
    isAvailableForPublicSite: boolean
  ): Promise<{
    success: boolean;
    message: string;
    isAvailableForPublicSite: boolean;
  }> {
    const response = await api.patch(
      `${this.baseUrl}/profile/public-visibility`,
      {
        isAvailableForPublicSite,
      }
    );
    return response.data;
  }
}

export const authApiService = new AuthApiService();
