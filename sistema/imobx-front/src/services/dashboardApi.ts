import { api } from './api';

// Tipos para o dashboard do usuário
export interface UserInfoDto {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

export interface UserStatsDto {
  myProperties: number;
  myClients: number;
  myInspections: number;
  myAppointments: number;
  myCommissions: number;
  myTasks: number;
  myKeys: number;
  myNotes: number;
  myMatches: number;
}

export interface UserPerformanceDto {
  thisMonth: number;
  lastMonth: number;
  growthPercentage: number;
  ranking: number;
  totalUsers: number;
  points: number;
}

export interface AchievementDto {
  id: string;
  achievementId: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface GamificationDto {
  currentPoints: number;
  level: number;
  achievements: AchievementDto[];
  pointsBreakdown: {
    sales: number;
    rentals: number;
    clients: number;
    appointments: number;
    tasks: number;
    other: number;
  };
}

export interface ActivityStatsDto {
  totalVisits: number;
  appointmentsThisMonth: number;
  completionRate: number;
}

export interface RecentActivityItemDto {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  status: string;
  createdAt: string;
}

export interface UpcomingAppointmentDto {
  id: string;
  title: string;
  date: string;
  time: string;
  client: string;
  type: string;
}

export interface GoalProgressDto {
  current: number;
  target: number;
  percentage: number;
}

export interface MonthlyGoalsDto {
  sales?: GoalProgressDto;
  commissions?: GoalProgressDto;
}

export interface ConversionMetricsDto {
  visitsToSales: number;
  clientsToClosed: number;
  matchesAccepted: number;
}

export interface UserDashboardDataDto {
  user: UserInfoDto;
  stats: UserStatsDto;
  performance: UserPerformanceDto;
  gamification: GamificationDto;
  activityStats: ActivityStatsDto;
  recentActivities: RecentActivityItemDto[];
  upcomingAppointments: UpcomingAppointmentDto[];
  monthlyGoals: MonthlyGoalsDto;
  conversionMetrics: ConversionMetricsDto;
}

export interface UserDashboardResponse {
  success: boolean;
  data: UserDashboardDataDto;
  lastUpdated: string;
}

// Tipos legados para compatibilidade (dashboard admin/master)
export interface DashboardStats {
  totalProperties: number;
  totalUsers: number;
  totalValue: string;
  monthlyRevenue: string;
  propertiesGrowth: number;
  usersGrowth: number;
  revenueGrowth: number;
  valueGrowth: number;
  propertiesForSale: number;
  propertiesForRent: number;
  propertiesSoldThisMonth: number;
  propertiesRentedThisMonth: number;
  propertiesByCity: { city: string; count: number }[];
  salesByMonth: { month: string; sales: number; rentals: number }[];
  averageSalePrice: string;
  averageRentPrice: string;
  occupancyRate: number;
  averageSaleTime: number;
  averageRentTime: number;
}

export interface RecentActivity {
  id: string;
  type: 'property' | 'user' | 'contract' | 'payment';
  title: string;
  description: string;
  time: string;
  createdAt: string;
  userId?: string;
  userName?: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  lastUpdated: string;
}

// Tipos para Funil de Conversão
export interface ConversionFunnelStage {
  name: string;
  count: number;
  conversionRate: number | null;
  conversionRateFromTotal: number;
}

export interface ConversionFunnelInsight {
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description: string;
  recommendations: string[];
}

export interface ConversionFunnelAnalysis {
  summary: string;
  strengths: string[];
  bottlenecks: string[];
  opportunities: string[];
  insights: ConversionFunnelInsight[];
  overallScore: number;
}

export interface ConversionFunnelResponse {
  stages: ConversionFunnelStage[];
  totalLeads: number;
  overallConversionRate: number;
  period: string;
  analysis: ConversionFunnelAnalysis;
}

// Tipos para Análise de Captadores
export interface CapturerRankingItem {
  capturerId: string;
  capturerName: string;
  capturerEmail: string;
  propertiesCount: number;
  clientsCount: number;
  totalCaptures: number;
}

export interface CapturesByPeriod {
  period: string; // Formato: 'YYYY-MM'
  propertiesCount: number;
  clientsCount: number;
  totalCaptures: number;
}

export interface CapturesByPropertyType {
  propertyType?: string; // Mantido para compatibilidade
  type?: string; // Campo retornado pela API
  count: number;
}

export interface CapturesByClientType {
  clientType: string;
  count: number;
}

export interface ConversionRate {
  propertiesSold: number;
  clientsClosed: number;
  propertiesSoldRate: number; // Taxa em % (0-100)
  clientsClosedRate: number; // Taxa em % (0-100)
}

export interface CapturesStatistics {
  totalProperties: number;
  totalClients: number;
  byCapturer: CapturerRankingItem[];
  byPeriod: CapturesByPeriod[];
  byPropertyType: CapturesByPropertyType[];
  byClientType: CapturesByClientType[];
  conversionRate: ConversionRate;
}

export interface CapturesStatisticsResponse {
  success: boolean;
  data: CapturesStatistics;
}

export interface CapturerProperty {
  id: string;
  title: string;
  code?: string;
  type: string;
  status: string;
  createdAt: string;
}

export interface CapturerClient {
  id: string;
  name: string;
  email?: string;
  type: string;
  status: string;
  createdAt: string;
}

export interface CapturesByCapturer {
  capturerId: string;
  capturerName: string;
  capturerEmail: string;
  totalProperties: number;
  totalClients: number;
  totalCaptures: number;
  properties: CapturerProperty[];
  clients: CapturerClient[];
}

export interface CapturesByCapturerResponse {
  success: boolean;
  data: CapturesByCapturer;
}

class DashboardApiService {
  private baseUrl = '/dashboard';

  async getDashboardData(): Promise<DashboardResponse> {
    try {
      // console.log('📊 Buscando dados do dashboard...');
      const response = await api.get(this.baseUrl);
      // console.log('✅ Dados do dashboard obtidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar dados do dashboard:', error);
      throw this.handleError(error);
    }
  }

  async getUserDashboardData(filters?: {
    dateRange?: 'today' | '7d' | '30d' | '90d' | '1y' | 'custom';
    compareWith?: 'previous_period' | 'previous_year' | 'none';
    metric?:
      | 'all'
      | 'properties'
      | 'clients'
      | 'inspections'
      | 'appointments'
      | 'commissions'
      | 'tasks'
      | 'matches';
    startDate?: string;
    endDate?: string;
    activitiesLimit?: number;
    appointmentsLimit?: number;
  }): Promise<UserDashboardResponse> {
    try {
      // console.log('📊 Buscando dados do dashboard do usuário...');
      const params = new URLSearchParams();

      if (filters) {
        if (filters.dateRange) params.append('dateRange', filters.dateRange);
        if (filters.compareWith)
          params.append('compareWith', filters.compareWith);
        if (filters.metric) params.append('metric', filters.metric);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.activitiesLimit)
          params.append('activitiesLimit', filters.activitiesLimit.toString());
        if (filters.appointmentsLimit)
          params.append(
            'appointmentsLimit',
            filters.appointmentsLimit.toString()
          );
      }

      const queryString = params.toString();
      const url = queryString
        ? `${this.baseUrl}/user?${queryString}`
        : `${this.baseUrl}/user`;

      const response = await api.get(url);
      // console.log('✅ Dados do dashboard do usuário obtidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar dados do dashboard do usuário:', error);
      throw this.handleError(error);
    }
  }

  async getConversionFunnel(
    startDate: Date,
    endDate: Date
  ): Promise<ConversionFunnelResponse> {
    try {
      const params = new URLSearchParams();
      params.append('startDate', startDate.toISOString().split('T')[0]);
      params.append('endDate', endDate.toISOString().split('T')[0]);

      const url = `${this.baseUrl}/conversion-funnel?${params.toString()}`;

      // Logs detalhados para debug
      console.log(
        '═══════════════════════════════════════════════════════════'
      );
      console.log('📡 [dashboardApi] CHAMANDO API DE FUNIL DE CONVERSÃO');
      console.log(
        '═══════════════════════════════════════════════════════════'
      );
      console.log('URL:', url);
      console.log('Start Date:', startDate.toISOString());
      console.log('End Date:', endDate.toISOString());
      console.log('Timestamp:', new Date().toISOString());
      console.log(
        '═══════════════════════════════════════════════════════════'
      );

      const response = await api.get(url);

      console.log(
        '═══════════════════════════════════════════════════════════'
      );
      console.log('✅ [dashboardApi] RESPOSTA DA API DE FUNIL RECEBIDA');
      console.log(
        '═══════════════════════════════════════════════════════════'
      );
      console.log('Status:', response.status);
      console.log('Has Data:', !!response.data);
      console.log(
        'Data Keys:',
        response.data ? Object.keys(response.data) : []
      );
      console.log('Is Success:', response.data?.success);
      console.log('Has Data Field:', !!response.data?.data);
      console.log('Full Response:', JSON.stringify(response.data, null, 2));
      console.log(
        '═══════════════════════════════════════════════════════════'
      );

      // Se a resposta tiver estrutura { success: true, data: {...} }, retornar data.data
      // Caso contrário, retornar response.data diretamente
      if (
        response.data &&
        typeof response.data === 'object' &&
        'success' in response.data &&
        'data' in response.data
      ) {
        return response.data.data;
      }

      const result =
        response.data &&
        typeof response.data === 'object' &&
        'success' in response.data &&
        'data' in response.data
          ? response.data.data
          : response.data;

      console.log(
        '═══════════════════════════════════════════════════════════'
      );
      console.log('📦 [dashboardApi] DADOS DO FUNIL PROCESSADOS');
      console.log(
        '═══════════════════════════════════════════════════════════'
      );
      console.log('Result Type:', typeof result);
      console.log('Has Stages:', !!result?.stages);
      console.log('Stages Count:', result?.stages?.length || 0);
      console.log('Total Leads:', result?.totalLeads || 0);
      console.log('Has Analysis:', !!result?.analysis);
      console.log('Full Result:', JSON.stringify(result, null, 2));
      console.log(
        '═══════════════════════════════════════════════════════════'
      );

      return result;
    } catch (error: any) {
      console.error(
        '═══════════════════════════════════════════════════════════'
      );
      console.error('❌ [dashboardApi] ERRO AO BUSCAR FUNIL DE CONVERSÃO');
      console.error(
        '═══════════════════════════════════════════════════════════'
      );
      console.error('Error:', error);
      console.error('Message:', error?.message);
      console.error('Status:', error?.response?.status);
      console.error('URL:', error?.config?.url);
      console.error('Response Data:', error?.response?.data);
      console.error('Full Error:', JSON.stringify(error, null, 2));
      console.error(
        '═══════════════════════════════════════════════════════════'
      );
      throw this.handleError(error);
    }
  }

  /**
   * Buscar estatísticas gerais de capturas
   */
  async getCapturesStatistics(
    startDate?: Date,
    endDate?: Date
  ): Promise<CapturesStatistics> {
    try {
      const params = new URLSearchParams();

      if (startDate) {
        params.append('startDate', startDate.toISOString());
      }
      if (endDate) {
        params.append('endDate', endDate.toISOString());
      }

      const queryString = params.toString();
      const url = `/analytics/captures/statistics${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);

      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar estatísticas de capturas:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar detalhes de capturas por captador
   */
  async getCapturesByCapturer(
    capturerId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<CapturesByCapturer> {
    try {
      const params = new URLSearchParams();

      if (startDate) {
        params.append('startDate', startDate.toISOString());
      }
      if (endDate) {
        params.append('endDate', endDate.toISOString());
      }

      const queryString = params.toString();
      const url = `/analytics/captures/capturer/${capturerId}${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);

      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Captador não encontrado');
      }
      console.error('❌ Erro ao buscar capturas do captador:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message =
        error.response.data?.message || 'Erro ao buscar dados do dashboard';
      return new Error(message);
    } else if (error.request) {
      return new Error('Erro de conexão com o servidor');
    } else {
      return new Error('Erro inesperado');
    }
  }
}

export const dashboardApi = new DashboardApiService();
