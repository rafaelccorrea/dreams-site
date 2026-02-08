import { api } from './api';
import type { NoteFilters } from '../types/filters';

export interface Note {
  id: string;
  title: string;
  content?: string;
  type: 'basic' | 'advanced';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'archived' | 'deleted';
  images?: string[];
  tags?: string[];
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  reminderDate?: string;
  hasReminder: boolean;
  isPinned: boolean;
  color: string;
  metadata?: Record<string, any>;
  user: {
    id: string;
    name: string;
    email: string;
  };
  sharedWith?: {
    id: string;
    name: string;
    email: string;
  }[];
  companyId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateNoteData {
  title: string;
  content?: string;
  type?: 'basic' | 'advanced';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  images?: string[];
  tags?: string[];
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  reminderDate?: string;
  hasReminder?: boolean;
  isPinned?: boolean;
  color?: string;
  metadata?: Record<string, any>;
  companyId: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  type?: 'basic' | 'advanced';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'active' | 'archived' | 'deleted';
  images?: string[];
  tags?: string[];
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  reminderDate?: string;
  hasReminder?: boolean;
  isPinned?: boolean;
  color?: string;
  metadata?: Record<string, any>;
}

export interface NoteQueryParams extends NoteFilters {}

export interface NotesResponse {
  data: Note[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface NoteStats {
  total: number;
  basic: number;
  advanced: number;
  pinned: number;
  withReminders: number;
}

class NotesApiService {
  private baseUrl = '/notes';

  async getNotes(params: NoteQueryParams = {}): Promise<NotesResponse> {
    const response = await api.get(this.baseUrl, { params });
    return response.data;
  }

  async getNote(id: string): Promise<Note> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createNote(data: CreateNoteData): Promise<Note> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  async updateNote(id: string, data: UpdateNoteData): Promise<Note> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteNote(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async archiveNote(id: string): Promise<Note> {
    const response = await api.patch(`${this.baseUrl}/${id}/archive`);
    return response.data;
  }

  async restoreNote(id: string): Promise<Note> {
    const response = await api.patch(`${this.baseUrl}/${id}/restore`);
    return response.data;
  }

  async togglePin(id: string): Promise<Note> {
    const response = await api.patch(`${this.baseUrl}/${id}/toggle-pin`);
    return response.data;
  }

  async getReminders(): Promise<Note[]> {
    const response = await api.get(`${this.baseUrl}/reminders`);
    return response.data;
  }

  async getStats(): Promise<NoteStats> {
    const response = await api.get(`${this.baseUrl}/stats`);
    return response.data;
  }

  async shareNote(id: string, userIds: string[]): Promise<Note> {
    const response = await api.post(`${this.baseUrl}/${id}/share`, { userIds });
    return response.data;
  }

  async unshareNote(id: string, userId: string): Promise<Note> {
    const response = await api.delete(`${this.baseUrl}/${id}/share/${userId}`);
    return response.data;
  }
}

export const notesApi = new NotesApiService();
