import { api } from './api';
import type { Permission } from './permissionsApi';
import type { Tag } from './tagsApi';
import type { UserFilters } from '../types/filters';

export interface User {
  id: string;
  name: string;
  email: string;
  document: string;
  avatar?: string;
  phone?: string;
  role: 'user' | 'admin' | 'master' | 'manager';
  owner?: boolean;
  permissions?: Permission[];
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  lastLoginIp?: string;
  lastLoginDevice?: string;
  lastLoginBrowser?: string;
  lastLoginOperatingSystem?: string;
  companyId?: string;
  companyName?: string;
  // Novos campos para hierarquia
  managerId?: string;
  managedUserIds?: string[];
  // Visibilidade pública no site
  isAvailableForPublicSite?: boolean;
  // Acesso ao aplicativo móvel (apenas para corretores - role: 'user')
  hasAppAccess?: boolean;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  document: string;
  phone?: string;
  role?: 'user' | 'admin' | 'manager';
  permissionIds?: string[];
  tagIds?: string[];
  managerId?: string;
  hasAppAccess?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  document?: string;
  phone?: string;
  role?: 'user' | 'admin' | 'master' | 'manager';
  password?: string;
  permissionIds?: string[];
  tagIds?: string[];
  managerId?: string;
  isAvailableForPublicSite?: boolean;
  hasAppAccess?: boolean;
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PaginationOptions extends UserFilters {
  page?: number;
  limit?: number;
}

class UsersApiService {
  private baseUrl = '/admin/users';

  async getUsers(options: PaginationOptions = {}): Promise<UsersResponse> {
    const params = new URLSearchParams();

    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.name) params.append('search', options.name);
    if (options.role) params.append('role', options.role);
    if (options.email) params.append('email', options.email);
    if (options.isActive !== undefined)
      params.append('isActive', options.isActive.toString());
    if (options.onlyMyData) params.append('onlyMyData', 'true');

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    const response = await api.get(url);
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getUserBasicInfo(id: string): Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  }> {
    const response = await api.get(`${this.baseUrl}/${id}/basic`);
    return response.data;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await api.post(this.baseUrl, userData);
    return response.data;
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    const response = await api.put(`${this.baseUrl}/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async getUserLastLogin(id: string): Promise<{
    lastLogin: string;
    lastLoginIp: string;
    lastLoginDevice: string;
    lastLoginBrowser: string;
    lastLoginOperatingSystem: string;
  }> {
    const response = await api.get(`${this.baseUrl}/${id}/last-login`);
    return response.data;
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    usersByRole: Record<string, number>;
  }> {
    const response = await api.get(`${this.baseUrl}/stats`);
    return response.data;
  }

  /**
   * Ativa ou desativa o acesso de um usuário ao aplicativo móvel Dream Keys
   * Endpoint: PATCH /admin/users/:id/app-access
   * @param userId ID do usuário
   * @param hasAppAccess true para ativar, false para desativar
   * @returns Dados do usuário atualizado
   */
  async updateUserAppAccess(
    userId: string,
    hasAppAccess: boolean
  ): Promise<User> {
    const response = await api.patch(`${this.baseUrl}/${userId}/app-access`, {
      hasAppAccess,
    });
    return response.data;
  }
}

export const usersApi = new UsersApiService();
