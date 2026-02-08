import { api } from './api';

export interface ColumnMetrics {
  columnId: string;
  columnName: string;
  totalTasks: number;
  averageTimeInColumn: number; // milissegundos
  conversionRate: number; // 0-1
  blockedTasks: number;
  completedTasks: number;
  failedValidations: number;
}

export interface BoardMetrics {
  boardId: string;
  totalTasks: number;
  averageCompletionTime: number; // milissegundos
  overallConversionRate: number; // 0-1
  bottlenecks: Array<{
    columnId: string;
    columnName: string;
    averageTime: number;
    taskCount: number;
  }>;
  validationFailures: number;
  actionSuccessRate: number; // 0-1
}

export interface ConversionChartData {
  columnName: string;
  entered: number;
  exited: number;
  conversionRate: number;
}

export interface TimeChartData {
  columnName: string;
  averageTime: number; // horas
  taskCount: number;
}

export interface PeriodComparison {
  period1: {
    startDate: string;
    endDate: string;
    metrics: BoardMetrics;
  };
  period2: {
    startDate: string;
    endDate: string;
    metrics: BoardMetrics;
  };
  differences: {
    totalTasks: {
      value1: number;
      value2: number;
      change: number;
      percentChange: number;
    };
    conversionRate: {
      value1: number;
      value2: number;
      change: number;
      percentChange: number;
    };
    // ... outros campos
  };
}

class KanbanAnalyticsApiService {
  private baseUrl = '/kanban/analytics';

  /**
   * Obter métricas de uma coluna
   */
  async getColumnMetrics(
    columnId: string,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<ColumnMetrics> {
    try {
      const response = await api.get<ColumnMetrics>(
        `${this.baseUrl}/columns/${columnId}/metrics`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar métricas da coluna:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter métricas de um board
   */
  async getBoardMetrics(
    boardId: string,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<BoardMetrics> {
    try {
      const response = await api.get<BoardMetrics>(
        `${this.baseUrl}/boards/${boardId}/metrics`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar métricas do board:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter dados para gráfico de conversão
   */
  async getConversionChart(
    boardId: string,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<ConversionChartData[]> {
    try {
      const response = await api.get<ConversionChartData[]>(
        `${this.baseUrl}/boards/${boardId}/charts/conversion`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar dados de conversão:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter dados para gráfico de tempo médio
   */
  async getTimeChart(
    boardId: string,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<TimeChartData[]> {
    try {
      const response = await api.get<TimeChartData[]>(
        `${this.baseUrl}/boards/${boardId}/charts/time`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar dados de tempo:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Exportar métricas
   */
  async exportMetrics(
    boardId: string,
    params?: {
      startDate?: string;
      endDate?: string;
      format?: 'json' | 'csv';
    }
  ): Promise<any> {
    try {
      const format = params?.format || 'json';
      const response = await api.get(
        `${this.baseUrl}/boards/${boardId}/export`,
        {
          params: {
            ...params,
            format,
          },
          responseType: format === 'csv' ? 'blob' : 'json',
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao exportar métricas:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Comparar métricas entre dois períodos
   */
  async comparePeriods(
    boardId: string,
    params: {
      period1Start: string;
      period1End: string;
      period2Start: string;
      period2End: string;
    }
  ): Promise<PeriodComparison> {
    try {
      const response = await api.get<PeriodComparison>(
        `${this.baseUrl}/boards/${boardId}/compare`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao comparar períodos:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    return new Error(error.message || 'Erro desconhecido');
  }
}

export const kanbanAnalyticsApi = new KanbanAnalyticsApiService();
