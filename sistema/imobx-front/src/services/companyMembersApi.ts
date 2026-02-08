/**
 * API Pública de Membros da Empresa
 *
 * Esta API permite que qualquer usuário autenticado veja os membros da sua empresa,
 * sem necessidade de permissões administrativas especiais.
 *
 * Diferença das rotas:
 * - /admin/users: Apenas ADMIN e MASTER com permissão USER_VIEW
 * - /users/company-members: Qualquer usuário autenticado (USER, MANAGER, ADMIN, MASTER)
 */

import { api } from './api';

export interface CompanyMember {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'master' | 'manager';
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface CompanyMemberSimple {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CompanyMembersResponse {
  data: CompanyMember[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CompanyMembersOptions {
  page?: number;
  limit?: number;
  search?: string;
}

class CompanyMembersApiService {
  private baseUrl = '/users/company-members';

  /**
   * Lista membros da empresa com paginação
   *
   * @param options - Opções de paginação e busca
   * @returns Lista paginada de membros
   *
   * @example
   * ```typescript
   * const response = await companyMembersApi.getMembers({
   *   page: 1,
   *   limit: 50,
   *   search: 'joão'
   * });
   * ```
   */
  async getMembers(
    options: CompanyMembersOptions = {}
  ): Promise<CompanyMembersResponse> {
    const params = new URLSearchParams();

    const resolvedPage =
      options.page !== undefined && options.page !== null
        ? Number(options.page)
        : 1;
    if (Number.isFinite(resolvedPage)) {
      params.append('page', Math.max(1, resolvedPage).toString());
    }

    if (options.limit !== undefined && options.limit !== null) {
      const resolvedLimit = Number(options.limit);
      if (Number.isFinite(resolvedLimit) && resolvedLimit > 0) {
        params.append('limit', resolvedLimit.toString());
      }
    }

    if (options.search) params.append('search', options.search);

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    const response = await api.get(url);
    return response.data;
  }

  /**
   * Lista todos os membros em formato simplificado (sem paginação)
   * Ideal para selects/dropdowns e autocomplete
   *
   * @returns Lista simplificada de todos os membros
   *
   * @example
   * ```typescript
   * const members = await companyMembersApi.getMembersSimple();
   * ```
   */
  async getMembersSimple(): Promise<CompanyMemberSimple[]> {
    const response = await api.get(`${this.baseUrl}/simple`);
    return response.data;
  }

  /**
   * Busca membros por termo de busca
   *
   * @param searchTerm - Termo para buscar no nome ou email
   * @param limit - Limite de resultados (padrão: 10)
   * @returns Lista de membros que correspondem à busca
   *
   * @example
   * ```typescript
   * const members = await companyMembersApi.searchMembers('joão', 10);
   * ```
   */
  async searchMembers(
    searchTerm: string,
    limit: number = 10
  ): Promise<CompanyMember[]> {
    const response = await this.getMembers({ search: searchTerm, limit });
    return response.data;
  }

  /**
   * Busca membros por role específica
   *
   * @param role - Role dos usuários a buscar
   * @param limit - Limite de resultados (padrão: 100)
   * @returns Lista de membros com a role especificada
   *
   * @example
   * ```typescript
   * const managers = await companyMembersApi.getMembersByRole('manager');
   * ```
   */
  async getMembersByRole(
    role: 'user' | 'admin' | 'master' | 'manager',
    limit: number = 100
  ): Promise<CompanyMember[]> {
    // A API não suporta filtro por role diretamente na rota pública
    // então buscamos todos e filtramos no cliente
    const allMembers = await this.getMembersSimple();

    // Se precisamos de dados completos, usamos a rota paginada
    const response = await this.getMembers({ limit });

    return response.data.filter(member => member.role === role);
  }
}

export const companyMembersApi = new CompanyMembersApiService();
