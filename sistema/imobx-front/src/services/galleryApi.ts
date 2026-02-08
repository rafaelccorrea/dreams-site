import { api } from './api';
import type { GalleryFilters } from '../types/filters';
import { validateMultipleFilesStorage } from '../utils/storageValidation';

export type PropertyStatus =
  | 'available'
  | 'sold'
  | 'rented'
  | 'reserved'
  | 'inactive'
  | string;

export interface GalleryImage {
  id: string;
  propertyId: string;
  url: string;
  alt: string;
  isMain: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryImageData {
  propertyId: string;
  url: string;
  alt: string;
  isMain?: boolean;
  order?: number;
}

export interface UpdateGalleryImageData {
  url?: string;
  alt?: string;
  isMain?: boolean;
  order?: number;
}

class GalleryApiService {
  private baseUrl = '/gallery';

  // NOVOS TIPOS/ENDPOINTS PARA TELA DE GALERIA
  async getGalleryProperties(params: GalleryFilters = {}) {
    const response = await api.get(`${this.baseUrl}/properties`, { params });
    return response.data as any;
  }

  async getGalleryImages(params: GalleryFilters = {}) {
    const response = await api.get(`${this.baseUrl}/images`, { params });
    return response.data as any;
  }

  async getGalleryStats() {
    const response = await api.get(`${this.baseUrl}/stats`);
    return response.data as any;
  }

  async getImagesByProperty(propertyId: string): Promise<GalleryImage[]> {
    try {
      const response = await api.get(`${this.baseUrl}/property/${propertyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      throw error;
    }
  }

  async createImage(data: CreateGalleryImageData): Promise<GalleryImage> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating gallery image:', error);
      throw error;
    }
  }

  async updateImage(
    imageId: string,
    data: UpdateGalleryImageData
  ): Promise<GalleryImage> {
    try {
      const response = await api.put(`${this.baseUrl}/${imageId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating gallery image:', error);
      throw error;
    }
  }

  async deleteImage(imageId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${imageId}`);
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      throw error;
    }
  }

  async setMainImage(imageId: string): Promise<GalleryImage> {
    try {
      const response = await api.put(`${this.baseUrl}/${imageId}/set-main`);
      return response.data;
    } catch (error) {
      console.error('Error setting main image:', error);
      throw error;
    }
  }

  async reorderImages(imageIds: string[]): Promise<GalleryImage[]> {
    try {
      const response = await api.put(`${this.baseUrl}/reorder`, { imageIds });
      return response.data;
    } catch (error) {
      console.error('Error reordering images:', error);
      throw error;
    }
  }

  async uploadImages(
    propertyId: string,
    files: File[],
    category: string = 'general',
    altText?: string,
    description?: string,
    tags?: string[],
    isPublic: boolean = true
  ): Promise<GalleryImage[]> {
    try {
      // Validar armazenamento antes de fazer upload
      const storageValidation = await validateMultipleFilesStorage(
        files,
        false
      );
      if (!storageValidation.canUpload) {
        throw new Error(
          storageValidation.reason ||
            `Limite de armazenamento excedido. Uso atual: ${storageValidation.totalStorageUsedGB.toFixed(2)} GB de ${storageValidation.totalStorageLimitGB} GB`
        );
      }

      const formData = new FormData();

      // Adicionar arquivos
      files.forEach(file => {
        formData.append('images', file);
      });

      // Adicionar dados
      formData.append('propertyId', propertyId);
      formData.append('category', category);
      if (altText) formData.append('altText', altText);
      if (description) formData.append('description', description);
      if (tags) formData.append('tags', JSON.stringify(tags));
      formData.append('isPublic', isPublic.toString());

      const response = await api.post(`${this.baseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  }
}

export const galleryApi = new GalleryApiService();
