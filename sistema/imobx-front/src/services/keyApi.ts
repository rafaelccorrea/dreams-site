import { api } from './api';
import type { KeyFilters } from '../types/filters';

export interface Key {
  id: string;
  propertyId: string;
  keyCode: string;
  location: string;
  status: 'available' | 'in_use' | 'maintenance' | 'lost';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKeyData {
  propertyId: string;
  keyCode: string;
  location: string;
  notes?: string;
}

export interface UpdateKeyData {
  keyCode?: string;
  location?: string;
  status?: string;
  notes?: string;
}

class KeyApiService {
  private baseUrl = '/keys';

  async getKeys(filters?: KeyFilters): Promise<Key[]> {
    try {
      const response = await api.get(this.baseUrl, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching keys:', error);
      throw error;
    }
  }

  async getKeysByProperty(propertyId: string): Promise<Key[]> {
    try {
      const response = await api.get(`${this.baseUrl}/property/${propertyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching keys:', error);
      throw error;
    }
  }

  async createKey(data: CreateKeyData): Promise<Key> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating key:', error);
      throw error;
    }
  }

  async updateKey(keyId: string, data: UpdateKeyData): Promise<Key> {
    try {
      const response = await api.put(`${this.baseUrl}/${keyId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating key:', error);
      throw error;
    }
  }

  async deleteKey(keyId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${keyId}`);
    } catch (error) {
      console.error('Error deleting key:', error);
      throw error;
    }
  }
}

export const keyApi = new KeyApiService();
