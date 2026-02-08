import { api } from './api';

export interface Key {
  id: string;
  name: string;
  description?: string;
  type: 'main' | 'backup' | 'emergency' | 'garage' | 'mailbox' | 'other';
  status: 'available' | 'in_use' | 'lost' | 'damaged' | 'maintenance';
  location?: string;
  notes?: string;
  isActive: boolean;
  companyId: string;
  propertyId: string;
  property?: {
    id: string;
    title: string;
    address: string;
  };
  keyControls?: KeyControl[];
  createdAt: string;
  updatedAt: string;
}

export interface KeyControl {
  id: string;
  type: 'showing' | 'maintenance' | 'inspection' | 'cleaning' | 'other';
  status: 'checked_out' | 'returned' | 'overdue' | 'lost';
  checkoutDate: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  reason: string;
  notes?: string;
  returnNotes?: string;
  companyId: string;
  keyId: string;
  userId: string;
  returnedByUserId?: string;
  key?: Key;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  returnedByUser?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateKeyData {
  name: string;
  description?: string;
  type: 'main' | 'backup' | 'emergency' | 'garage' | 'mailbox' | 'other';
  status: 'available' | 'in_use' | 'lost' | 'damaged' | 'maintenance';
  location?: string;
  notes?: string;
  propertyId: string;
}

export interface UpdateKeyData {
  name?: string;
  description?: string;
  type?: 'main' | 'backup' | 'emergency' | 'garage' | 'mailbox' | 'other';
  status?: 'available' | 'in_use' | 'lost' | 'damaged' | 'maintenance';
  location?: string;
  notes?: string;
  isActive?: boolean;
}

export interface CreateKeyControlData {
  type: 'showing' | 'maintenance' | 'inspection' | 'cleaning' | 'other';
  expectedReturnDate?: string;
  reason: string;
  notes?: string;
  keyId: string;
}

export interface ReturnKeyData {
  returnNotes?: string;
}

export interface KeyStatistics {
  totalKeys: number;
  availableKeys: number;
  inUseKeys: number;
  overdueCount: number;
  overdueKeys: KeyControl[];
}

class KeyService {
  // Métodos para gerenciar chaves
  async createKey(data: CreateKeyData): Promise<Key> {
    const response = await api.post('/keys', data);
    return response.data;
  }

  async getAllKeys(propertyId?: string): Promise<Key[]> {
    const params = propertyId ? { propertyId } : {};
    const response = await api.get('/keys', { params });
    return response.data;
  }

  async getKeyById(id: string): Promise<Key> {
    const response = await api.get(`/keys/${id}`);
    return response.data;
  }

  async updateKey(id: string, data: UpdateKeyData): Promise<Key> {
    const response = await api.patch(`/keys/${id}`, data);
    return response.data;
  }

  async deleteKey(id: string): Promise<void> {
    await api.delete(`/keys/${id}`);
  }

  async getKeyStatistics(): Promise<KeyStatistics> {
    const response = await api.get('/keys/statistics');
    return response.data;
  }

  // Métodos para controle de chaves
  async checkoutKey(data: CreateKeyControlData): Promise<KeyControl> {
    const response = await api.post('/keys/checkout', data);
    return response.data;
  }

  async returnKey(
    keyControlId: string,
    data: ReturnKeyData
  ): Promise<KeyControl> {
    const response = await api.post(`/keys/return/${keyControlId}`, data);
    return response.data;
  }

  async getAllKeyControls(
    status?: 'checked_out' | 'returned' | 'overdue' | 'lost'
  ): Promise<KeyControl[]> {
    const params = status ? { status } : {};
    const response = await api.get('/keys/controls/all', { params });
    return response.data;
  }

  async getOverdueKeys(): Promise<KeyControl[]> {
    const response = await api.get('/keys/controls/overdue');
    return response.data;
  }

  async getUserKeyControls(
    status?: 'checked_out' | 'returned' | 'overdue' | 'lost'
  ): Promise<KeyControl[]> {
    const params = status ? { status } : {};
    const response = await api.get('/keys/controls/user', { params });
    return response.data;
  }

  async getKeyControlById(id: string): Promise<KeyControl> {
    const response = await api.get(`/keys/controls/${id}`);
    return response.data;
  }
}

export default new KeyService();
