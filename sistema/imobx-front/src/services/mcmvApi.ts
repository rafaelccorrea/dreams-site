/**
 * API Service para MCMV - Módulo de gerenciamento de leads MCMV
 *
 * Todas as requisições requerem autenticação JWT e plano PRO ativo.
 * Base URL: /mcmv
 */

import { api } from './api';
import type {
  MCMVLead,
  LeadsListResponse,
  LeadFilters,
  UpdateLeadStatusRequest,
  AssignLeadRequest,
  RateLeadRequest,
  ConvertLeadResponse,
  BlacklistEntry,
  CreateBlacklistEntryRequest,
  UpdateBlacklistEntryRequest,
  BlacklistFilters,
  MCMVTemplate,
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from '../types/mcmv';

class MCMVApiService {
  private baseUrl = '/mcmv';

  // ==================== LEADS ====================

  /**
   * Listar leads disponíveis para a empresa do usuário
   *
   * Ao listar leads, eles são automaticamente marcados como visualizados pela empresa.
   *
   * @param filters Filtros opcionais (status, city, state, eligible, minScore, page, limit)
   * @returns Lista paginada de leads
   */
  async listLeads(filters?: LeadFilters): Promise<LeadsListResponse> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.state) params.append('state', filters.state);
    if (filters?.eligible !== undefined)
      params.append('eligible', filters.eligible.toString());
    if (filters?.minScore !== undefined)
      params.append('minScore', filters.minScore.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `${this.baseUrl}/leads?${queryString}`
      : `${this.baseUrl}/leads`;

    const response = await api.get<LeadsListResponse>(url);
    return response.data;
  }

  /**
   * Capturar um lead para a empresa do usuário
   *
   * Ao capturar um lead, ele é automaticamente atribuído ao usuário que fez a captura
   * e o status muda para 'contacted'.
   *
   * @param leadId ID do lead a ser capturado
   * @returns Lead capturado
   * @throws 404 Not Found - Lead não encontrado
   * @throws 403 Forbidden - Empresa não tem acesso ou não tem plano PRO
   * @throws 400 Bad Request - Lead já foi capturado por outra empresa
   */
  async captureLead(leadId: string): Promise<MCMVLead> {
    const response = await api.post<MCMVLead>(
      `${this.baseUrl}/leads/${leadId}/capture`
    );
    return response.data;
  }

  /**
   * Atualizar status de um lead capturado
   *
   * @param leadId ID do lead
   * @param status Novo status (new, contacted, qualified, converted, lost)
   * @returns Lead atualizado
   */
  async updateLeadStatus(
    leadId: string,
    status: UpdateLeadStatusRequest['status']
  ): Promise<MCMVLead> {
    const response = await api.put<MCMVLead>(
      `${this.baseUrl}/leads/${leadId}/status`,
      {
        status,
      }
    );
    return response.data;
  }

  /**
   * Atribuir lead a um corretor específico da empresa
   *
   * @param leadId ID do lead
   * @param userId ID do corretor (ou null para remover atribuição)
   * @returns Lead atualizado
   */
  async assignLead(leadId: string, userId: string | null): Promise<MCMVLead> {
    const response = await api.put<MCMVLead>(
      `${this.baseUrl}/leads/${leadId}/assign`,
      {
        userId,
      }
    );
    return response.data;
  }

  /**
   * Avaliar um lead com nota de 1 a 5 estrelas e comentário opcional
   *
   * @param leadId ID do lead
   * @param rating Avaliação de 1 a 5 (obrigatório)
   * @param comment Comentário da avaliação (opcional, máximo 1000 caracteres)
   * @returns Lead atualizado com avaliação
   */
  async rateLead(
    leadId: string,
    rating: number,
    comment?: string
  ): Promise<MCMVLead> {
    const data: RateLeadRequest = { rating };
    if (comment) {
      data.comment = comment;
    }

    const response = await api.post<MCMVLead>(
      `${this.baseUrl}/leads/${leadId}/rate`,
      data
    );
    return response.data;
  }

  /**
   * Converter um lead capturado em um cliente do sistema
   *
   * Ao converter um lead, um novo cliente é criado automaticamente com todos os dados do lead
   * e o status do lead muda para 'converted'.
   *
   * @param leadId ID do lead
   * @returns Cliente criado e lead atualizado
   * @throws 400 Bad Request - Lead já foi convertido em cliente
   */
  async convertLeadToClient(leadId: string): Promise<ConvertLeadResponse> {
    const response = await api.post<ConvertLeadResponse>(
      `${this.baseUrl}/leads/${leadId}/convert`
    );
    return response.data;
  }

  // ==================== BLACKLIST ====================

  /**
   * Listar entradas da blacklist
   *
   * @param filters Filtros opcionais (cpf, email, phone, isPermanent, expired)
   * @returns Lista de entradas da blacklist
   */
  async listBlacklist(filters?: BlacklistFilters): Promise<BlacklistEntry[]> {
    const params = new URLSearchParams();

    if (filters?.cpf) params.append('cpf', filters.cpf);
    if (filters?.email) params.append('email', filters.email);
    if (filters?.phone) params.append('phone', filters.phone);
    if (filters?.isPermanent !== undefined)
      params.append('isPermanent', filters.isPermanent.toString());
    if (filters?.expired !== undefined)
      params.append('expired', filters.expired.toString());

    const queryString = params.toString();
    const url = queryString
      ? `${this.baseUrl}/blacklist?${queryString}`
      : `${this.baseUrl}/blacklist`;

    const response = await api.get<BlacklistEntry[]>(url);
    return response.data;
  }

  /**
   * Adicionar entrada à blacklist
   *
   * É necessário fornecer pelo menos um CPF, email ou telefone.
   *
   * @param data Dados da entrada da blacklist
   * @returns Entrada criada
   * @throws 400 Bad Request - É necessário fornecer pelo menos um CPF, email ou telefone
   * @throws 400 Bad Request - Este registro já está na blacklist
   */
  async addToBlacklist(
    data: CreateBlacklistEntryRequest
  ): Promise<BlacklistEntry> {
    const response = await api.post<BlacklistEntry>(
      `${this.baseUrl}/blacklist`,
      data
    );
    return response.data;
  }

  /**
   * Buscar entrada da blacklist por ID
   *
   * @param id ID da entrada
   * @returns Entrada da blacklist
   */
  async getBlacklistEntry(id: string): Promise<BlacklistEntry> {
    const response = await api.get<BlacklistEntry>(
      `${this.baseUrl}/blacklist/${id}`
    );
    return response.data;
  }

  /**
   * Atualizar entrada da blacklist
   *
   * @param id ID da entrada
   * @param data Dados para atualizar
   * @returns Entrada atualizada
   */
  async updateBlacklistEntry(
    id: string,
    data: UpdateBlacklistEntryRequest
  ): Promise<BlacklistEntry> {
    const response = await api.put<BlacklistEntry>(
      `${this.baseUrl}/blacklist/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Remover entrada da blacklist
   *
   * @param id ID da entrada
   */
  async removeFromBlacklist(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/blacklist/${id}`);
  }

  // ==================== TEMPLATES ====================

  /**
   * Listar templates
   *
   * Retorna templates da empresa + templates padrão do sistema (sem companyId).
   *
   * @returns Lista de templates
   */
  async listTemplates(): Promise<MCMVTemplate[]> {
    const response = await api.get<MCMVTemplate[]>(`${this.baseUrl}/templates`);
    return response.data;
  }

  /**
   * Criar template
   *
   * As variáveis são extraídas automaticamente do conteúdo, mas você pode especificar
   * manualmente no campo variables.
   *
   * Use {{variavel}} no conteúdo do template.
   *
   * @param data Dados do template
   * @returns Template criado
   */
  async createTemplate(data: CreateTemplateRequest): Promise<MCMVTemplate> {
    const response = await api.post<MCMVTemplate>(
      `${this.baseUrl}/templates`,
      data
    );
    return response.data;
  }

  /**
   * Buscar template por ID
   *
   * @param id ID do template
   * @returns Template
   */
  async getTemplate(id: string): Promise<MCMVTemplate> {
    const response = await api.get<MCMVTemplate>(
      `${this.baseUrl}/templates/${id}`
    );
    return response.data;
  }

  /**
   * Atualizar template
   *
   * Se o conteúdo for atualizado, as variáveis são extraídas automaticamente.
   *
   * @param id ID do template
   * @param data Dados para atualizar
   * @returns Template atualizado
   */
  async updateTemplate(
    id: string,
    data: UpdateTemplateRequest
  ): Promise<MCMVTemplate> {
    const response = await api.put<MCMVTemplate>(
      `${this.baseUrl}/templates/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Deletar template
   *
   * Apenas templates da empresa podem ser deletados.
   * Templates padrão do sistema (sem companyId) não podem ser removidos.
   *
   * @param id ID do template
   * @throws 400 Bad Request - Não é possível deletar templates padrão do sistema
   */
  async deleteTemplate(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/templates/${id}`);
  }

  /**
   * Substituir variáveis no template
   *
   * Função auxiliar para substituir variáveis no formato {{variavel}} no conteúdo do template.
   *
   * @param template Template com conteúdo
   * @param variables Objeto com valores das variáveis
   * @returns Conteúdo do template com variáveis substituídas
   */
  replaceTemplateVariables(
    template: MCMVTemplate,
    variables: Record<string, string | number>
  ): string {
    let content = template.content;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      content = content.replace(regex, String(value));
    }

    return content;
  }
}

export const mcmvApi = new MCMVApiService();
