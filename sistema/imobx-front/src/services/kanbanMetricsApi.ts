import { api } from './api';
import type {
  TaskMetrics,
  SubtaskMetrics,
  TasksMetrics,
  ColumnValueAnalysis,
  FunnelInsights,
  TaskMetricsParams,
  SubtaskMetricsParams,
  TasksMetricsParams,
  ColumnValueAnalysisParams,
} from '../types/kanban';

class KanbanMetricsApiService {
  private baseUrl = '/kanban/analytics';

  /**
   * Busca métricas de uma tarefa específica
   */
  async getTaskMetrics(
    taskId: string,
    params?: TaskMetricsParams
  ): Promise<TaskMetrics> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.startDate) {
        queryParams.append('startDate', params.startDate);
      }
      if (params?.endDate) {
        queryParams.append('endDate', params.endDate);
      }

      const url = `${this.baseUrl}/tasks/${taskId}/metrics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Busca métricas de subtarefas com filtros opcionais
   */
  async getSubtaskMetrics(
    params?: SubtaskMetricsParams
  ): Promise<SubtaskMetrics> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.teamId) {
        queryParams.append('teamId', params.teamId);
      }
      if (params?.taskId) {
        queryParams.append('taskId', params.taskId);
      }
      if (params?.userId) {
        queryParams.append('userId', params.userId);
      }
      if (params?.startDate) {
        queryParams.append('startDate', params.startDate);
      }
      if (params?.endDate) {
        queryParams.append('endDate', params.endDate);
      }

      const url = `${this.baseUrl}/subtasks/metrics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Exporta métricas de tarefas para Excel
   */
  async exportTaskMetricsToExcel(
    taskIds: string[],
    params?: TaskMetricsParams
  ): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.startDate) {
        queryParams.append('startDate', params.startDate);
      }
      if (params?.endDate) {
        queryParams.append('endDate', params.endDate);
      }

      const url = `${this.baseUrl}/tasks/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.post(
        url,
        { taskIds },
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Exporta métricas de subtarefas para Excel
   */
  async exportSubtaskMetricsToExcel(
    params?: SubtaskMetricsParams
  ): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.teamId) {
        queryParams.append('teamId', params.teamId);
      }
      if (params?.taskId) {
        queryParams.append('taskId', params.taskId);
      }
      if (params?.userId) {
        queryParams.append('userId', params.userId);
      }
      if (params?.startDate) {
        queryParams.append('startDate', params.startDate);
      }
      if (params?.endDate) {
        queryParams.append('endDate', params.endDate);
      }

      const url = `${this.baseUrl}/subtasks/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Insights IA do funil: resumo, tarefas prioritárias, parados por coluna, sugestões por tarefa
   */
  async getFunnelInsights(
    teamId: string,
    projectId?: string
  ): Promise<FunnelInsights> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('teamId', teamId);
      if (projectId) {
        queryParams.append('projectId', projectId);
      }
      const response = await api.get(
        `${this.baseUrl}/funnel-insights?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Busca métricas completas de negociações (vendas)
   */
  async getTasksMetrics(params?: TasksMetricsParams): Promise<TasksMetrics> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.teamId) {
        queryParams.append('teamId', params.teamId);
      }
      if (params?.projectId) {
        queryParams.append('projectId', params.projectId);
      }
      if (params?.userId) {
        queryParams.append('userId', params.userId);
      }
      if (params?.startDate) {
        queryParams.append('startDate', params.startDate);
      }
      if (params?.endDate) {
        queryParams.append('endDate', params.endDate);
      }

      const url = `${this.baseUrl}/tasks/metrics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Exporta métricas de negociações para Excel
   */
  async exportTasksMetricsToExcel(params?: TasksMetricsParams): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.teamId) {
        queryParams.append('teamId', params.teamId);
      }
      if (params?.projectId) {
        queryParams.append('projectId', params.projectId);
      }
      if (params?.userId) {
        queryParams.append('userId', params.userId);
      }
      if (params?.startDate) {
        queryParams.append('startDate', params.startDate);
      }
      if (params?.endDate) {
        queryParams.append('endDate', params.endDate);
      }

      const url = `${this.baseUrl}/tasks/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Busca análise de valores por coluna
   */
  async getColumnValueAnalysis(
    params: ColumnValueAnalysisParams
  ): Promise<ColumnValueAnalysis[]> {
    try {
      const queryParams = new URLSearchParams();

      queryParams.append('teamId', params.teamId);

      if (params.columnId) {
        queryParams.append('columnId', params.columnId);
      }
      if (params.minDaysStuck !== undefined) {
        queryParams.append('minDaysStuck', params.minDaysStuck.toString());
      }
      if (params.startDate) {
        queryParams.append('startDate', params.startDate);
      }
      if (params.endDate) {
        queryParams.append('endDate', params.endDate);
      }

      const url = `${this.baseUrl}/columns/value-analysis?${queryParams.toString()}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Exporta análise de valores por coluna para Excel
   */
  async exportColumnValueAnalysisToExcel(
    params: ColumnValueAnalysisParams
  ): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();

      queryParams.append('teamId', params.teamId);

      if (params.columnId) {
        queryParams.append('columnId', params.columnId);
      }
      if (params.minDaysStuck !== undefined) {
        queryParams.append('minDaysStuck', params.minDaysStuck.toString());
      }
      if (params.startDate) {
        queryParams.append('startDate', params.startDate);
      }
      if (params.endDate) {
        queryParams.append('endDate', params.endDate);
      }

      const url = `${this.baseUrl}/columns/value-analysis/export?${queryParams.toString()}`;
      const response = await api.get(url, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        'Erro desconhecido';

      switch (status) {
        case 404:
          return new Error('Recurso não encontrado');
        case 403:
          return new Error('Acesso negado');
        case 401:
          return new Error('Não autorizado');
        default:
          return new Error(message || `Erro ao buscar métricas: ${status}`);
      }
    }

    if (error.request) {
      return new Error('Erro de conexão. Verifique sua internet.');
    }

    return new Error(error.message || 'Erro desconhecido ao buscar métricas');
  }
}

export const kanbanMetricsApi = new KanbanMetricsApiService();
