import { api } from './api';

// Tipos para Analytics do Site Público

export interface TopFilter {
  filter: string;
  count: number;
  percentage: number;
}

export interface TopFiltersResponse {
  success: boolean;
  data: {
    filters: TopFilter[];
    totalSearches: number;
    period: string;
    city: string;
    state: string;
  };
}

export interface PriceDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface PriceProfileResponse {
  success: boolean;
  data: {
    priceProfile: {
      avgSalePrice: number;
      avgRentPrice: number;
      topPriceRange: string;
      priceDistribution: PriceDistribution[];
    };
    city: string;
    state: string;
    period: string;
  };
}

export interface Opportunity {
  location: string;
  searches: number;
  availableProperties: number;
  opportunityScore: number;
  level: 'high' | 'medium' | 'low';
}

export interface OpportunitiesResponse {
  success: boolean;
  data: {
    opportunities: Opportunity[];
    city: string;
    state: string;
    period: string;
  };
}

export interface NeighborhoodDemand {
  neighborhood: string;
  searches: number;
  views: number;
  demandScore: number;
  growth: number;
}

export interface NeighborhoodDemandResponse {
  success: boolean;
  data: {
    neighborhoods: NeighborhoodDemand[];
    city: string;
    state: string;
    period: string;
  };
}

export interface PopularProperty {
  id: string;
  title: string;
  address: string;
  price: number;
  views: number;
  searches: number;
  conversionRate: number;
}

export interface PopularPropertiesResponse {
  success: boolean;
  data: {
    properties: PopularProperty[];
    city: string;
    state: string;
    period: string;
  };
}

export interface CitySummary {
  totalSearches: number;
  totalViews: number;
  avgSalePrice: number;
  avgRentPrice: number;
  topPriceRange: string;
  topType: string;
  topNeighborhood: string;
  opportunityScore: number;
  growth: number;
}

export interface CitySummaryResponse {
  success: boolean;
  data: {
    summary: CitySummary;
    city: string;
    state: string;
    period: string;
  };
}

export interface CityComparison {
  city: string;
  state: string;
  totalSearches: number;
  growth: number;
  avgSalePrice: number;
  topPriceRange: string;
  topType: string;
  opportunityScore: number;
}

export interface ComparisonData {
  highestDemand: string;
  highestGrowth: string;
  highestOpportunity: string;
  priceDifference: number;
  demandDifference: number;
}

export interface CitiesCompareResponse {
  success: boolean;
  data: {
    cities: CityComparison[];
    comparison: ComparisonData;
    period: string;
  };
}

export interface AnalyticsFilters {
  city: string;
  state: string;
  period?: 'daily' | 'weekly' | 'monthly';
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface CompareFilters {
  cities: string; // Formato: "Cidade1,UF|Cidade2,UF|..."
  period?: 'daily' | 'weekly' | 'monthly';
  limit?: number;
}

class AnalyticsApiService {
  private baseUrl = '/analytics/public-site';

  /**
   * Buscar top filtros mais usados
   */
  async getTopFilters(filters: AnalyticsFilters): Promise<TopFiltersResponse> {
    try {
      const params = new URLSearchParams();
      params.append('city', filters.city);
      params.append('state', filters.state);
      if (filters.period) params.append('period', filters.period);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(
        `${this.baseUrl}/filters/top?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar top filtros:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar perfil de preço
   */
  async getPriceProfile(
    filters: AnalyticsFilters
  ): Promise<PriceProfileResponse> {
    try {
      const params = new URLSearchParams();
      params.append('city', filters.city);
      params.append('state', filters.state);
      if (filters.period) params.append('period', filters.period);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(
        `${this.baseUrl}/price-profile?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar perfil de preço:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar oportunidades de mercado
   */
  async getOpportunities(
    filters: AnalyticsFilters
  ): Promise<OpportunitiesResponse> {
    try {
      const params = new URLSearchParams();
      params.append('city', filters.city);
      params.append('state', filters.state);
      if (filters.period) params.append('period', filters.period);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(
        `${this.baseUrl}/opportunities?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar oportunidades:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar demanda por bairro
   */
  async getNeighborhoodDemand(
    filters: AnalyticsFilters
  ): Promise<NeighborhoodDemandResponse> {
    try {
      const params = new URLSearchParams();
      params.append('city', filters.city);
      params.append('state', filters.state);
      if (filters.period) params.append('period', filters.period);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(
        `${this.baseUrl}/neighborhoods/demand?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar demanda por bairro:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar propriedades mais populares
   */
  async getPopularProperties(
    filters: AnalyticsFilters
  ): Promise<PopularPropertiesResponse> {
    try {
      const params = new URLSearchParams();
      params.append('city', filters.city);
      params.append('state', filters.state);
      if (filters.period) params.append('period', filters.period);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(
        `${this.baseUrl}/properties/popular?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar propriedades populares:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Buscar resumo completo da cidade
   */
  async getCitySummary(
    filters: AnalyticsFilters
  ): Promise<CitySummaryResponse> {
    try {
      const params = new URLSearchParams();
      params.append('city', filters.city);
      params.append('state', filters.state);
      if (filters.period) params.append('period', filters.period);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(
        `${this.baseUrl}/city/summary?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar resumo da cidade:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Comparar filtros entre cidades
   */
  async compareFilters(filters: CompareFilters): Promise<TopFiltersResponse> {
    try {
      const params = new URLSearchParams();
      params.append('cities', filters.cities);
      if (filters.period) params.append('period', filters.period);

      const response = await api.get(
        `${this.baseUrl}/filters/compare?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao comparar filtros:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Comparar perfis de preço entre cidades
   */
  async comparePriceProfiles(
    filters: CompareFilters
  ): Promise<PriceProfileResponse> {
    try {
      const params = new URLSearchParams();
      params.append('cities', filters.cities);
      if (filters.period) params.append('period', filters.period);

      const response = await api.get(
        `${this.baseUrl}/price-profile/compare?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao comparar perfis de preço:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Comparar oportunidades entre cidades
   */
  async compareOpportunities(
    filters: CompareFilters
  ): Promise<OpportunitiesResponse> {
    try {
      const params = new URLSearchParams();
      params.append('cities', filters.cities);
      if (filters.period) params.append('period', filters.period);

      const response = await api.get(
        `${this.baseUrl}/opportunities/compare?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao comparar oportunidades:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Comparar bairros entre cidades
   */
  async compareNeighborhoods(
    filters: CompareFilters
  ): Promise<NeighborhoodDemandResponse> {
    try {
      const params = new URLSearchParams();
      params.append('cities', filters.cities);
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(
        `${this.baseUrl}/neighborhoods/compare?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao comparar bairros:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Comparação completa entre cidades
   */
  async compareCities(filters: CompareFilters): Promise<CitiesCompareResponse> {
    try {
      const params = new URLSearchParams();
      params.append('cities', filters.cities);
      if (filters.period) params.append('period', filters.period);

      const response = await api.get(
        `${this.baseUrl}/cities/compare?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao comparar cidades:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message =
        error.response.data?.message || 'Erro ao buscar dados de analytics';
      return new Error(message);
    } else if (error.request) {
      return new Error('Erro de conexão com o servidor');
    } else {
      return new Error('Erro inesperado');
    }
  }
}

export const analyticsApi = new AnalyticsApiService();
