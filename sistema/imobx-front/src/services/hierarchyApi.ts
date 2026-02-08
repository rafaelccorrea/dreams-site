import { api } from './api';
import type { User } from './usersApi';

export interface AssignManagerDTO {
  userIds: string[];
  managerId: string;
}

export interface RemoveManagerDTO {
  userIds: string[];
}

export interface AccessibleUsersResponse {
  userId: string;
  userRole: string;
  accessibleUserIds: string[];
  totalAccessible: number;
}

export interface AssignManagerResponse {
  success: boolean;
  message: string;
}

class HierarchyApiService {
  private baseUrl = '/hierarchy';

  /**
   * Ver meus usuários gerenciados (para gestores)
   */
  async getManagedUsers(): Promise<User[]> {
    const response = await api.get(`${this.baseUrl}/managed-users`);
    return response.data;
  }

  /**
   * Ver meu gestor
   */
  async getMyManager(): Promise<User | null> {
    try {
      const response = await api.get(`${this.baseUrl}/manager`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Ver IDs de usuários acessíveis
   */
  async getAccessibleUserIds(): Promise<AccessibleUsersResponse> {
    const response = await api.get(`${this.baseUrl}/accessible-users`);
    return response.data;
  }

  /**
   * Atribuir gestor a usuários (ADMIN/MASTER)
   */
  async assignManager(data: AssignManagerDTO): Promise<AssignManagerResponse> {
    const response = await api.post(`${this.baseUrl}/assign-manager`, data);
    return response.data;
  }

  /**
   * Remover gestor de usuários (ADMIN/MASTER)
   */
  async removeManager(data: RemoveManagerDTO): Promise<AssignManagerResponse> {
    const response = await api.post(`${this.baseUrl}/remove-manager`, data);
    return response.data;
  }

  /**
   * Ver usuários gerenciados por um gestor específico (ADMIN/MASTER)
   */
  async getUserManagedUsers(userId: string): Promise<User[]> {
    const response = await api.get(
      `${this.baseUrl}/user/${userId}/managed-users`
    );
    return response.data;
  }
}

export const hierarchyApi = new HierarchyApiService();
