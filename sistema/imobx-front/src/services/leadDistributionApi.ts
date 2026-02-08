'use client';
import { api } from './api';

export interface LeadDistributionConfigDto {
  id: string;
  companyId: string;
  kanbanProjectId: string | null;
  distributionRule: string;
  slaFirstContactMinutes: number;
  alertWarningMinutes: number;
  reassignAfterMinutes: number;
  notifyManagerOnSlaBreach: boolean;
  sendAutoReplyToLead: boolean;
  maxNewLeadsPerUserPerDay: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDistributionConfigDto {
  kanbanProjectId?: string | null;
  distributionRule?: string;
  slaFirstContactMinutes?: number;
  alertWarningMinutes?: number;
  reassignAfterMinutes?: number;
  notifyManagerOnSlaBreach?: boolean;
  sendAutoReplyToLead?: boolean;
  maxNewLeadsPerUserPerDay?: number;
  isActive?: boolean;
}

export type UpdateLeadDistributionConfigDto = CreateLeadDistributionConfigDto;

export interface LeadOverviewItemDto {
  id: string;
  title: string;
  projectId: string | null;
  projectName: string | null;
  assignedToId: string | null;
  assignedToName: string | null;
  source: string | null;
  campaign: string | null;
  createdAt: string;
  updatedAt: string | null;
  resultDate: string | null;
  status: string;
  result: string | null;
  columnName: string | null;
}

export interface LeadOverviewChartByDayDto {
  date: string;
  count: number;
}

export interface LeadOverviewChartBySourceDto {
  source: string;
  count: number;
}

export interface LeadOverviewChartByProjectDto {
  projectId: string;
  projectName: string;
  count: number;
}

export interface LeadOverviewChartsDto {
  byDay: LeadOverviewChartByDayDto[];
  bySource: LeadOverviewChartBySourceDto[];
  byProject: LeadOverviewChartByProjectDto[];
}

export interface LeadOverviewFilters {
  projectId?: string;
  assignedToId?: string;
  source?: string;
  onlyWithSource?: boolean;
  page?: number;
  limit?: number;
}

export interface LeadOverviewResponseDto {
  data: LeadOverviewItemDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadOverviewSummaryDto {
  total: number;
  inAttendance: number;
  withoutAttendance: number;
}

const BASE = '/lead-distribution';

export const leadDistributionApi = {
  async getAnalysisSummary(
    filters: Omit<LeadOverviewFilters, 'page' | 'limit'> = {}
  ): Promise<LeadOverviewSummaryDto> {
    const params = new URLSearchParams();
    if (filters.projectId) params.set('projectId', filters.projectId);
    if (filters.assignedToId) params.set('assignedToId', filters.assignedToId);
    if (filters.source) params.set('source', filters.source);
    if (filters.onlyWithSource) params.set('onlyWithSource', '1');
    const qs = params.toString();
    const url = qs
      ? `${BASE}/analysis/summary?${qs}`
      : `${BASE}/analysis/summary`;
    const { data } = await api.get<LeadOverviewSummaryDto>(url);
    return data;
  },

  async getAnalysis(
    filters: LeadOverviewFilters = {}
  ): Promise<LeadOverviewResponseDto> {
    const params = new URLSearchParams();
    if (filters.projectId) params.set('projectId', filters.projectId);
    if (filters.assignedToId) params.set('assignedToId', filters.assignedToId);
    if (filters.source) params.set('source', filters.source);
    if (filters.onlyWithSource) params.set('onlyWithSource', '1');
    if (filters.page != null) params.set('page', String(filters.page));
    if (filters.limit != null) params.set('limit', String(filters.limit));
    const qs = params.toString();
    const url = qs ? `${BASE}/analysis?${qs}` : `${BASE}/analysis`;
    const { data } = await api.get<LeadOverviewResponseDto>(url);
    return data;
  },

  async getAnalysisCharts(
    filters: Omit<LeadOverviewFilters, 'page' | 'limit'> = {}
  ): Promise<LeadOverviewChartsDto> {
    const params = new URLSearchParams();
    if (filters.projectId) params.set('projectId', filters.projectId);
    if (filters.assignedToId) params.set('assignedToId', filters.assignedToId);
    if (filters.source) params.set('source', filters.source);
    if (filters.onlyWithSource) params.set('onlyWithSource', '1');
    const qs = params.toString();
    const url = qs
      ? `${BASE}/analysis/charts?${qs}`
      : `${BASE}/analysis/charts`;
    const { data } = await api.get<LeadOverviewChartsDto>(url);
    return data;
  },

  async list(): Promise<LeadDistributionConfigDto[]> {
    const { data } = await api.get<LeadDistributionConfigDto[]>(
      `${BASE}/config`
    );
    return Array.isArray(data) ? data : [];
  },

  async getGlobal(): Promise<LeadDistributionConfigDto | null> {
    try {
      const { data } = await api.get<LeadDistributionConfigDto>(
        `${BASE}/config/global`
      );
      return data;
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      throw err;
    }
  },

  async getByProject(
    kanbanProjectId: string
  ): Promise<LeadDistributionConfigDto | null> {
    try {
      const { data } = await api.get<LeadDistributionConfigDto>(
        `${BASE}/config/project/${kanbanProjectId}`
      );
      return data;
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      throw err;
    }
  },

  async create(
    body: CreateLeadDistributionConfigDto
  ): Promise<LeadDistributionConfigDto> {
    const { data } = await api.post<LeadDistributionConfigDto>(
      `${BASE}/config`,
      body
    );
    return data;
  },

  async update(
    id: string,
    body: UpdateLeadDistributionConfigDto
  ): Promise<LeadDistributionConfigDto> {
    const { data } = await api.put<LeadDistributionConfigDto>(
      `${BASE}/config/${id}`,
      body
    );
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${BASE}/config/${id}`);
  },
};
