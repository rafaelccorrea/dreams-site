import { api } from './api';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPermissionsResponse {
  userId: string;
  userName: string;
  userEmail: string;
  permissions: Permission[];
  permissionNames: string[];
}

export interface AssignPermissionsDto {
  permissionIds: string[];
}

export const permissionsApi = {
  // Get all permissions
  getAll: async (): Promise<Permission[]> => {
    const response = await api.get('/permissions');
    return response.data;
  },

  // Get permissions by category
  getByCategory: async (): Promise<Record<string, Permission[]>> => {
    const response = await api.get('/permissions/by-category');
    return response.data;
  },

  // Get permissions for a specific category
  getByCategoryName: async (category: string): Promise<Permission[]> => {
    const response = await api.get(`/permissions/category/${category}`);
    return response.data;
  },

  // Get permission by ID
  getById: async (id: string): Promise<Permission> => {
    const response = await api.get(`/permissions/${id}`);
    return response.data;
  },

  // Get current user's permissions (não requer permissão, apenas autenticação)
  getMyPermissions: async (): Promise<UserPermissionsResponse> => {
    const response = await api.get('/permissions/my-permissions');
    return response.data;
  },

  // Get user permissions by ID (requer permissão user:view)
  getUserPermissionsById: async (
    userId: string
  ): Promise<UserPermissionsResponse> => {
    const response = await api.get(`/permissions/user/${userId}`);
    return response.data;
  },

  // Assign permissions to user
  assignPermissions: async (
    userId: string,
    data: AssignPermissionsDto
  ): Promise<void> => {
    await api.post(`/permissions/user/${userId}/assign`, data);
  },

  // Set user permissions (replace all)
  setUserPermissions: async (
    userId: string,
    data: AssignPermissionsDto
  ): Promise<void> => {
    await api.put(`/permissions/user/${userId}/set`, data);
  },

  /** Definir apenas permissões de Kanban do usuário (super admin Kanban) */
  setUserKanbanPermissions: async (
    userId: string,
    data: AssignPermissionsDto
  ): Promise<void> => {
    await api.put(`/permissions/user/${userId}/kanban`, data);
  },

  // Remove specific permission from user
  removePermission: async (
    userId: string,
    permissionId: string
  ): Promise<void> => {
    await api.delete(`/permissions/user/${userId}/permission/${permissionId}`);
  },

  // Remove multiple permissions from user
  removePermissions: async (
    userId: string,
    data: AssignPermissionsDto
  ): Promise<void> => {
    await api.delete(`/permissions/user/${userId}/permissions`, { data });
  },

  // Check if user has specific permission
  checkUserPermission: async (
    userId: string,
    permissionName: string
  ): Promise<{ hasPermission: boolean }> => {
    const response = await api.get(
      `/permissions/user/${userId}/check/${permissionName}`
    );
    return response.data;
  },
};
