import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
  companyId: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

class UserApiService {
  private baseUrl = '/users';

  async getUser(userId: string): Promise<User> {
    try {
      const response = await api.get(`${this.baseUrl}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async createUser(data: CreateUserData): Promise<User> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    try {
      const response = await api.put(`${this.baseUrl}/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUsersByCompany(): Promise<User[]> {
    try {
      const response = await api.get(`${this.baseUrl}/company`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company users:', error);
      throw error;
    }
  }
}

export const userApi = new UserApiService();
