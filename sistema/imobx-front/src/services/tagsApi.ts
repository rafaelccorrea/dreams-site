import { api } from './api';

export interface Tag {
  id: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  companyId?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateTagData {
  name?: string;
  description?: string;
  color?: string;
}

export interface AssignTagData {
  tagId: string;
}

export const tagsApi = {
  // Get all tags
  getAll: async (): Promise<Tag[]> => {
    const response = await api.get('/tags');
    return response.data;
  },

  // Get tag by ID
  getById: async (id: string): Promise<Tag> => {
    const response = await api.get(`/tags/${id}`);
    return response.data;
  },

  // Create new tag
  create: async (data: CreateTagData): Promise<Tag> => {
    const response = await api.post('/tags', data);
    return response.data;
  },

  // Update tag
  update: async (id: string, data: UpdateTagData): Promise<Tag> => {
    const response = await api.put(`/tags/${id}`, data);
    return response.data;
  },

  // Delete tag
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },

  // Assign tag to user
  assignToUser: async (userId: string, data: AssignTagData): Promise<void> => {
    await api.post(`/tags/user/${userId}/assign`, data);
  },

  // Remove tag from user
  removeFromUser: async (userId: string, tagId: string): Promise<void> => {
    await api.delete(`/tags/user/${userId}/remove/${tagId}`);
  },

  // Set user tags (replace all)
  setUserTags: async (userId: string, tagIds: string[]): Promise<void> => {
    await api.put(`/tags/user/${userId}/set`, { tagIds });
  },

  // Get user tags
  getUserTags: async (userId: string): Promise<Tag[]> => {
    const response = await api.get(`/tags/user/${userId}`);
    return response.data;
  },
};
