'use client';
import { api } from './api';
import type {
  GrupoZapConfig,
  CreateGrupoZapConfigRequest,
  UpdateGrupoZapConfigRequest,
} from '../types/grupoZap';

class GrupoZapApiService {
  private baseUrl = '/integrations/grupo-zap';

  async getConfig(): Promise<GrupoZapConfig | null> {
    try {
      const response = await api.get<GrupoZapConfig>(`${this.baseUrl}/config`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      console.error('❌ [GrupoZapApi] Erro ao obter configuração:', error);
      throw this.handleError(error);
    }
  }

  async createOrUpdateConfig(
    data: CreateGrupoZapConfigRequest
  ): Promise<GrupoZapConfig> {
    try {
      const response = await api.put<GrupoZapConfig>(
        `${this.baseUrl}/config`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ [GrupoZapApi] Erro ao salvar configuração:', error);
      throw this.handleError(error);
    }
  }

  async updateConfig(
    data: UpdateGrupoZapConfigRequest
  ): Promise<GrupoZapConfig> {
    try {
      const response = await api.patch<GrupoZapConfig>(
        `${this.baseUrl}/config`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ [GrupoZapApi] Erro ao atualizar configuração:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.message) return new Error(error.message);
    return new Error('Erro ao processar solicitação da integração Grupo ZAP');
  }
}

export const grupoZapApi = new GrupoZapApiService();
