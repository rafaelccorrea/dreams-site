import { api } from './api';

// Types
export interface GenerateFollowupRequest {
  clientId: string;
  context?: string;
  daysSinceLastContact?: number;
}

export interface GenerateFollowupResponse {
  message: string;
  suggestedChannel: 'whatsapp' | 'email' | 'sms';
  tone: 'friendly' | 'professional' | 'casual';
}

export interface SummarizeConversationsRequest {
  clientId: string;
  summaryType?: 'executive' | 'detailed' | 'timeline';
}

export interface SummarizeConversationsResponse {
  summary: string;
  keyPoints: string[];
  nextSteps: string[];
  interestLevel: 'high' | 'medium' | 'low';
  totalInteractions: number;
}

export interface PredictiveSalesRequest {
  propertyId?: string;
  analysisType?: 'single' | 'bulk';
}

export interface PredictiveSalesResponse {
  propertyId: string;
  propertyTitle: string;
  estimatedDaysToSale: number;
  probability30Days: number;
  probability60Days: number;
  probability90Days: number;
  suggestedPrice?: number;
  priceImpact?: string;
  influencingFactors: string[];
  recommendations: string[];
}

export interface ChurnPredictionRequest {
  clientId?: string;
  analysisType?: 'single' | 'bulk';
}

export interface ChurnPredictionResponse {
  clientId: string;
  clientName: string;
  churnRiskScore: number;
  riskLevel: 'high' | 'medium' | 'low';
  daysSinceLastContact: number;
  riskFactors: string[];
  recommendedActions: string[];
  recoveryProbability: number;
}

// Novas funcionalidades
export interface GenerateProposalRequest {
  propertyId: string;
  clientId: string;
  proposalType: 'sale' | 'rental' | 'investment';
  proposedValue?: number;
  specialConditions?: string;
  // Condições de pagamento
  paymentMethod?:
    | 'cash'
    | 'financing'
    | 'consortium'
    | 'lease_purchase'
    | 'mixed';
  paymentTerm?: number;
  downPayment?: number;
  downPaymentPercent?: number;
  interestRate?: number;
  monthlyPayment?: number;
  // Informações adicionais
  includeMarketComparison?: boolean;
  includeTaxInfo?: boolean;
  includeTimeline?: boolean;
  includeRequiredDocs?: boolean;
  warranties?: string[];
  highlights?: string[];
  validityDays?: number;
}

export interface MarketComparison {
  averageMarketPrice: number;
  minPrice: number;
  maxPrice: number;
  comparisonPercent: number;
  competitiveness: 'above' | 'competitive' | 'below';
}

export interface TaxInfo {
  iptuAnnual?: number;
  iptuMonthly?: number;
  itbi?: number;
  registrationFee?: number;
  notaryFee?: number;
  totalTaxes?: number;
}

export interface TimelineStep {
  step: string;
  description: string;
  estimatedDays: number;
}

export interface GenerateProposalResponse {
  proposalHtml: string;
  proposalText: string;
  executiveSummary: string;
  keyPoints: string[];
  suggestedValue?: number;
  recommendations: string[];
  propertyDetails?: {
    title: string;
    type: string;
    address: string;
    area: { total: number; built?: number };
    rooms: { bedrooms?: number; bathrooms?: number; parkingSpaces?: number };
    features: string[];
    condominiumFee?: number;
  };
  clientInfo?: {
    name: string;
    type?: string;
    contactInfo?: { email?: string; phone?: string };
  };
  financialTerms?: {
    totalValue: number;
    downPayment?: number;
    downPaymentPercent?: number;
    financingAmount?: number;
    paymentTerm?: number;
    monthlyPayment?: number;
    interestRate?: number;
    paymentMethod: string;
  };
  marketComparison?: MarketComparison;
  taxInfo?: TaxInfo;
  timeline?: TimelineStep[];
  requiredDocuments?: string[];
  warranties?: string[];
  highlights?: string[];
  validUntil?: string;
  specialConditions?: string;
  notes?: string;
}

// Envio de proposta por email
export interface SendProposalEmailRequest extends GenerateProposalRequest {
  email?: string;
}

export interface SendProposalEmailResponse {
  success: boolean;
  emailSentTo: string;
  message: string;
  proposal: GenerateProposalResponse;
}

export interface LeadClassificationRequest {
  clientId?: string;
}

export interface LeadClassificationResponse {
  clientId: string;
  clientName: string;
  classification: 'hot' | 'warm' | 'cold';
  qualityScore: number;
  conversionProbability: number;
  influencingFactors: string[];
  nextSteps: string[];
  estimatedConversionTime?: number;
  estimatedDealValue?: number;
  classificationReason: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface BrokerPerformanceRequest {
  brokerId?: string;
  period: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface BrokerPerformanceResponse {
  brokerId: string;
  brokerName: string;
  overallScore: number;
  salesCount: number;
  totalSalesValue: number;
  conversionRate: number;
  averageSaleTime: number;
  leadsGenerated: number;
  visitsCompleted: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  teamComparison: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface DemandForecastRequest {
  region?: string;
  propertyType: 'apartment' | 'house' | 'commercial' | 'land' | 'all';
  forecastMonths?: number;
}

export interface DemandForecastResponse {
  region: string;
  propertyType: string;
  forecastedDemand: 'high' | 'medium' | 'low';
  demandScore: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  influencingFactors: string[];
  priceForecast: 'increase' | 'stable' | 'decrease';
  priceChangePercent?: number;
  estimatedSaleTime: number;
  recommendations: string[];
  forecastPeriod: string;
}

export interface PortfolioOptimizationRequest {
  focus: 'sales_speed' | 'profitability' | 'market_coverage' | 'balanced';
  propertyId?: string;
}

export interface PortfolioOptimizationResponse {
  propertyId: string;
  propertyTitle: string;
  priorityScore: number;
  currentStatus: string;
  recommendedActions: string[];
  currentPrice: number;
  suggestedPrice?: number;
  expectedImpact?: string;
  estimatedSaleTime: number;
  prioritizationReason: string;
  riskLevel: 'low' | 'medium' | 'high';
}

class AIAssistantApiService {
  private readonly baseUrl = '/ai-assistant';

  /**
   * Gerar mensagem de follow-up para cliente
   */
  async generateFollowup(
    data: GenerateFollowupRequest
  ): Promise<GenerateFollowupResponse> {
    try {
      const response = await api.post(
        `${this.baseUrl}/followup/generate`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao gerar follow-up:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Resumir conversas do cliente
   */
  async summarizeConversations(
    data: SummarizeConversationsRequest
  ): Promise<SummarizeConversationsResponse> {
    try {
      const response = await api.post(
        `${this.baseUrl}/conversations/summarize`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao resumir conversas:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Análise preditiva de vendas
   */
  async predictiveSales(
    data: PredictiveSalesRequest
  ): Promise<PredictiveSalesResponse | PredictiveSalesResponse[]> {
    try {
      const response = await api.post(`${this.baseUrl}/predictive/sales`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro na análise preditiva:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Previsão de churn
   */
  async churnPrediction(
    data: ChurnPredictionRequest
  ): Promise<ChurnPredictionResponse | ChurnPredictionResponse[]> {
    try {
      const response = await api.post(`${this.baseUrl}/predictive/churn`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro na previsão de churn:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Gerar proposta comercial
   */
  async generateProposal(
    data: GenerateProposalRequest
  ): Promise<GenerateProposalResponse> {
    try {
      const response = await api.post(
        `${this.baseUrl}/proposal/generate`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao gerar proposta:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Classificar leads
   */
  async classifyLead(
    data: LeadClassificationRequest
  ): Promise<LeadClassificationResponse | LeadClassificationResponse[]> {
    try {
      const response = await api.post(`${this.baseUrl}/leads/classify`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao classificar lead:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Análise de performance de corretores
   */
  async analyzeBrokerPerformance(
    data: BrokerPerformanceRequest
  ): Promise<BrokerPerformanceResponse | BrokerPerformanceResponse[]> {
    try {
      const response = await api.post(
        `${this.baseUrl}/analytics/broker-performance`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro na análise de performance:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Previsão de demanda
   */
  async forecastDemand(
    data: DemandForecastRequest
  ): Promise<DemandForecastResponse> {
    try {
      const response = await api.post(
        `${this.baseUrl}/analytics/demand-forecast`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro na previsão de demanda:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Otimização de portfólio
   */
  async optimizePortfolio(
    data: PortfolioOptimizationRequest
  ): Promise<PortfolioOptimizationResponse | PortfolioOptimizationResponse[]> {
    try {
      const response = await api.post(
        `${this.baseUrl}/analytics/portfolio-optimization`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro na otimização de portfólio:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Enviar proposta por email (gera e envia)
   */
  async sendProposalEmail(
    data: SendProposalEmailRequest
  ): Promise<SendProposalEmailResponse> {
    try {
      const response = await api.post(
        `${this.baseUrl}/proposal/send-email`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao enviar proposta por email:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Tratar erros da API
   */
  private handleError(error: any): Error {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || 'Erro ao processar requisição';

      switch (status) {
        case 401:
          return new Error('Não autorizado. Faça login novamente.');
        case 403:
          return new Error(
            'Esta funcionalidade requer Plano PRO ou módulo não está ativo.'
          );
        case 404:
          return new Error('Recurso não encontrado.');
        case 500:
          return new Error(
            'Erro interno do servidor. Tente novamente mais tarde.'
          );
        default:
          return new Error(`Erro ${status}: ${message}`);
      }
    } else if (error.request) {
      return new Error(
        'Erro de conexão. Verifique sua internet e tente novamente.'
      );
    } else {
      return new Error('Erro inesperado. Tente novamente.');
    }
  }
}

export const aiAssistantApi = new AIAssistantApiService();
export default aiAssistantApi;
