'use client';
import { api } from './api';
import type {
  MetaCampaignConfig,
  CreateMetaCampaignConfigRequest,
  UpdateMetaCampaignConfigRequest,
  MetaCampaignItem,
  MetaCampaignRedirectConfig,
  UpsertMetaCampaignRedirectRequest,
  MetaCrmLeadsStats,
  MetaLeadsListResponse,
  MetaLeadgenFormItem,
  MetaRoasItem,
  MetaAdSetItem,
  MetaAdItem,
  MetaLeadWebhookLogResponse,
} from '../types/metaCampaign';

class MetaCampaignApiService {
  private baseUrl = '/integrations/meta-campaign';

  async getConfig(): Promise<MetaCampaignConfig | null> {
    try {
      const response = await api.get<MetaCampaignConfig>(
        `${this.baseUrl}/config`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      console.error('❌ [MetaCampaignApi] Erro ao obter configuração:', error);
      throw this.handleError(error);
    }
  }

  async createOrUpdateConfig(
    data: CreateMetaCampaignConfigRequest
  ): Promise<MetaCampaignConfig> {
    try {
      const response = await api.put<MetaCampaignConfig>(
        `${this.baseUrl}/config`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ [MetaCampaignApi] Erro ao salvar configuração:', error);
      throw this.handleError(error);
    }
  }

  async updateConfig(
    data: UpdateMetaCampaignConfigRequest
  ): Promise<MetaCampaignConfig> {
    try {
      const response = await api.patch<MetaCampaignConfig>(
        `${this.baseUrl}/config`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error(
        '❌ [MetaCampaignApi] Erro ao atualizar configuração:',
        error
      );
      throw this.handleError(error);
    }
  }

  async getCampaigns(params?: {
    insights?: boolean;
    date_preset?: string;
  }): Promise<MetaCampaignItem[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.insights) searchParams.set('insights', '1');
      if (params?.date_preset)
        searchParams.set('date_preset', params.date_preset);
      const qs = searchParams.toString();
      const url = qs
        ? `${this.baseUrl}/campaigns?${qs}`
        : `${this.baseUrl}/campaigns`;
      const response = await api.get<{ data: MetaCampaignItem[] }>(url);
      return response.data?.data ?? [];
    } catch (error: any) {
      console.error('❌ [MetaCampaignApi] Erro ao listar campanhas:', error);
      throw this.handleError(error);
    }
  }

  async getPreviousTotals(
    datePreset?: string
  ): Promise<{
    impressions: number;
    clicks: number;
    spend: number;
    leads: number;
  }> {
    try {
      const params = datePreset
        ? `?date_preset=${encodeURIComponent(datePreset)}`
        : '';
      const response = await api.get<{
        impressions: number;
        clicks: number;
        spend: number;
        leads: number;
      }>(`${this.baseUrl}/campaigns/previous-totals${params}`);
      return response.data ?? { impressions: 0, clicks: 0, spend: 0, leads: 0 };
    } catch {
      return { impressions: 0, clicks: 0, spend: 0, leads: 0 };
    }
  }

  async getDailyInsights(
    datePreset?: string
  ): Promise<{
    daily: Array<{
      date: string;
      impressions: number;
      clicks: number;
      spend: number;
      leads: number;
    }>;
  }> {
    try {
      const params = datePreset
        ? `?date_preset=${encodeURIComponent(datePreset)}`
        : '';
      const response = await api.get<{
        daily: Array<{
          date: string;
          impressions: number;
          clicks: number;
          spend: number;
          leads: number;
        }>;
      }>(`${this.baseUrl}/campaigns/daily${params}`);
      return response.data ?? { daily: [] };
    } catch {
      return { daily: [] };
    }
  }

  async getRedirectConfig(): Promise<MetaCampaignRedirectConfig[]> {
    try {
      const response = await api.get<MetaCampaignRedirectConfig[]>(
        `${this.baseUrl}/redirect-config`
      );
      return response.data ?? [];
    } catch (error: any) {
      console.error(
        '❌ [MetaCampaignApi] Erro ao obter redirecionamentos:',
        error
      );
      throw this.handleError(error);
    }
  }

  async regenerateWebhookToken(): Promise<{ webhookToken: string }> {
    try {
      const response = await api.post<{ webhookToken: string }>(
        `${this.baseUrl}/regenerate-webhook-token`
      );
      return response.data;
    } catch (error: any) {
      console.error(
        '❌ [MetaCampaignApi] Erro ao regenerar token do webhook:',
        error
      );
      throw this.handleError(error);
    }
  }

  async getIntegrationStatus(): Promise<{
    tokenValid: boolean;
    syncLeads: boolean;
    hasRedirects: boolean;
    campaignsCount?: number;
  }> {
    try {
      const response = await api.get<{
        tokenValid: boolean;
        syncLeads: boolean;
        hasRedirects: boolean;
        campaignsCount?: number;
      }>(`${this.baseUrl}/integration-status`);
      return (
        response.data ?? {
          tokenValid: false,
          syncLeads: false,
          hasRedirects: false,
        }
      );
    } catch {
      return { tokenValid: false, syncLeads: false, hasRedirects: false };
    }
  }

  async getCrmLeadsStats(datePreset?: string): Promise<MetaCrmLeadsStats> {
    try {
      const params = datePreset
        ? `?date_preset=${encodeURIComponent(datePreset)}`
        : '';
      const response = await api.get<MetaCrmLeadsStats>(
        `${this.baseUrl}/crm-leads-stats${params}`
      );
      return response.data ?? { total: 0, byCampaign: [], byMonth: [] };
    } catch (error: any) {
      console.error(
        '❌ [MetaCampaignApi] Erro ao obter estatísticas de leads no CRM:',
        error
      );
      return { total: 0, byCampaign: [], byMonth: [] };
    }
  }

  async getLeads(params?: {
    page?: number;
    limit?: number;
    meta_campaign_id?: string;
  }): Promise<MetaLeadsListResponse> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.page != null) searchParams.set('page', String(params.page));
      if (params?.limit != null)
        searchParams.set('limit', String(params.limit));
      if (params?.meta_campaign_id)
        searchParams.set('meta_campaign_id', params.meta_campaign_id);
      const qs = searchParams.toString();
      const url = qs ? `${this.baseUrl}/leads?${qs}` : `${this.baseUrl}/leads`;
      const response = await api.get<MetaLeadsListResponse>(url);
      return (
        response.data ?? {
          data: [],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        }
      );
    } catch (error: any) {
      console.error('❌ [MetaCampaignApi] Erro ao listar leads:', error);
      throw this.handleError(error);
    }
  }

  async getWebhookLeadsLog(params?: {
    page?: number;
    limit?: number;
    meta_campaign_id?: string;
    status?: string;
  }): Promise<MetaLeadWebhookLogResponse> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.page != null) searchParams.set('page', String(params.page));
      if (params?.limit != null)
        searchParams.set('limit', String(params.limit));
      if (params?.meta_campaign_id)
        searchParams.set('meta_campaign_id', params.meta_campaign_id);
      if (params?.status) searchParams.set('status', params.status);
      const qs = searchParams.toString();
      const url = qs
        ? `${this.baseUrl}/webhook-leads-log?${qs}`
        : `${this.baseUrl}/webhook-leads-log`;
      const response = await api.get<MetaLeadWebhookLogResponse>(url);
      return (
        response.data ?? { data: [], total: 0, page: 1, limit: 20 }
      );
    } catch (error: any) {
      console.error(
        '❌ [MetaCampaignApi] Erro ao listar log de webhook de leads:',
        error
      );
      throw this.handleError(error);
    }
  }

  async getLeadgenForms(
    datePreset?: string
  ): Promise<{ data: MetaLeadgenFormItem[] }> {
    try {
      const params = datePreset
        ? `?date_preset=${encodeURIComponent(datePreset)}`
        : '';
      const response = await api.get<{ data: MetaLeadgenFormItem[] }>(
        `${this.baseUrl}/leadgen-forms${params}`
      );
      return response.data ?? { data: [] };
    } catch {
      return { data: [] };
    }
  }

  async getRoas(datePreset?: string): Promise<{ data: MetaRoasItem[] }> {
    try {
      const params = datePreset
        ? `?date_preset=${encodeURIComponent(datePreset)}`
        : '';
      const response = await api.get<{ data: MetaRoasItem[] }>(
        `${this.baseUrl}/campaigns/roas${params}`
      );
      return response.data ?? { data: [] };
    } catch {
      return { data: [] };
    }
  }

  async getCampaignAdSets(
    campaignId: string
  ): Promise<{ data: MetaAdSetItem[] }> {
    try {
      const response = await api.get<{ data: MetaAdSetItem[] }>(
        `${this.baseUrl}/campaigns/${encodeURIComponent(campaignId)}/adsets`
      );
      return response.data ?? { data: [] };
    } catch {
      return { data: [] };
    }
  }

  async getAdSetAds(adSetId: string): Promise<{ data: MetaAdItem[] }> {
    try {
      const response = await api.get<{ data: MetaAdItem[] }>(
        `${this.baseUrl}/ad-sets/${encodeURIComponent(adSetId)}/ads`
      );
      return response.data ?? { data: [] };
    } catch {
      return { data: [] };
    }
  }

  async putRedirectConfig(
    data: UpsertMetaCampaignRedirectRequest
  ): Promise<MetaCampaignRedirectConfig> {
    try {
      const response = await api.put<MetaCampaignRedirectConfig>(
        `${this.baseUrl}/redirect-config`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error(
        '❌ [MetaCampaignApi] Erro ao salvar redirecionamento:',
        error
      );
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.message) return new Error(error.message);
    return new Error(
      'Erro ao processar solicitação da integração Meta Campanhas'
    );
  }
}

export const metaCampaignApi = new MetaCampaignApiService();
