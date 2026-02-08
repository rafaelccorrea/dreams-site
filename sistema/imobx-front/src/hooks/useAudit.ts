import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export interface AuditLog {
  id: string;
  action: string;
  description: string;
  module?: string;
  entityType?: string;
  entityId?: string;
  oldValues?: any;
  newValues?: any;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  requestUrl?: string;
  httpMethod?: string;
  httpStatus?: number;
  responseTime?: number;
  userId?: string;
  companyId?: string;
  userRole?: string;
  userEmail?: string;
  userName?: string;
  companyName?: string;
  success: boolean;
  errorMessage?: string;
  createdAt: string;
}

export interface AuditFilters {
  page?: number;
  limit?: number;
  userId?: string;
  companyId?: string;
  action?: string;
  module?: string;
  entityType?: string;
  entityId?: string;
  userRole?: string;
  success?: boolean;
  startDate?: string;
  endDate?: string;
  ipAddress?: string;
  search?: string;
}

export interface AuditStats {
  totalLogs: number;
  successLogs: number;
  errorLogs: number;
  criticalActions: number;
  actionsByModule: Record<string, number>;
  actionsByUser: Record<string, number>;
  actionsByCompany?: Record<string, number>;
  dailyStats: Array<{
    date: string;
    count: number;
    successCount: number;
    errorCount: number;
  }>;
}

export function useAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchLogs = useCallback(async (filters: AuditFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/audit/logs?${params.toString()}`);

      setLogs(response.data.logs || []);
      setTotal(response.data.total || 0);
    } catch (err: any) {
      console.error('Erro ao buscar logs de auditoria:', err);
      setError(
        err.response?.data?.message || 'Erro ao buscar logs de auditoria'
      );
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(
    async (filters: Partial<AuditFilters> = {}) => {
      try {
        setStatsLoading(true);

        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });

        const response = await api.get(`/audit/stats?${params.toString()}`);
        setStats(response.data);
      } catch (err: any) {
        console.error('Erro ao buscar estatísticas:', err);
        setStats(null);
      } finally {
        setStatsLoading(false);
      }
    },
    []
  );

  const fetchMyActivity = useCallback(async (limit: number = 50) => {
    try {
      setLoading(true);
      const response = await api.get(`/audit/my-activity?limit=${limit}`);
      setLogs(response.data || []);
      setTotal(response.data?.length || 0);
    } catch (err: any) {
      console.error('Erro ao buscar minha atividade:', err);
      setError(err.response?.data?.message || 'Erro ao buscar atividade');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecentActivity = useCallback(async (limit: number = 50) => {
    try {
      setLoading(true);
      const response = await api.get(`/audit/recent-activity?limit=${limit}`);
      setLogs(response.data || []);
      setTotal(response.data?.length || 0);
    } catch (err: any) {
      console.error('Erro ao buscar atividade recente:', err);
      setError(err.response?.data?.message || 'Erro ao buscar atividade');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCriticalActions = useCallback(async (limit: number = 100) => {
    try {
      setLoading(true);
      const response = await api.get(`/audit/critical-actions?limit=${limit}`);
      setLogs(response.data || []);
      setTotal(response.data?.length || 0);
    } catch (err: any) {
      console.error('Erro ao buscar ações críticas:', err);
      setError(err.response?.data?.message || 'Erro ao buscar ações críticas');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLogById = useCallback(async (id: string) => {
    try {
      const response = await api.get(`/audit/logs/${id}`);
      return response.data;
    } catch (err: any) {
      console.error('Erro ao buscar log:', err);
      throw err;
    }
  }, []);

  const exportLogs = useCallback(async (filters: AuditFilters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await api.post(`/audit/export?${params.toString()}`);
      return response.data;
    } catch (err: any) {
      console.error('Erro ao exportar logs:', err);
      throw err;
    }
  }, []);

  const fetchActions = useCallback(async () => {
    try {
      const response = await api.get('/audit/actions');
      return response.data;
    } catch (err: any) {
      console.error('Erro ao buscar ações:', err);
      throw err;
    }
  }, []);

  const fetchModules = useCallback(async () => {
    try {
      const response = await api.get('/audit/modules');
      return response.data;
    } catch (err: any) {
      console.error('Erro ao buscar módulos:', err);
      throw err;
    }
  }, []);

  return {
    logs,
    total,
    loading,
    error,
    stats,
    statsLoading,
    fetchLogs,
    fetchStats,
    fetchMyActivity,
    fetchRecentActivity,
    fetchCriticalActions,
    fetchLogById,
    exportLogs,
    fetchActions,
    fetchModules,
  };
}
