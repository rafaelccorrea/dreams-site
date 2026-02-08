/**
 * Hook para gerenciar membros da empresa usando a API pública
 *
 * Este hook permite que qualquer usuário autenticado (USER, MANAGER, ADMIN, MASTER)
 * visualize os membros da empresa, sem necessidade de permissões administrativas.
 *
 * Ideal para: calendários, seleção de participantes, atribuição de tarefas, etc.
 */

import { useState, useCallback, useEffect } from 'react';
import {
  companyMembersApi,
  type CompanyMember,
  type CompanyMemberSimple,
  type CompanyMembersOptions,
} from '../services/companyMembersApi';
import { useCompany } from './useCompany';

interface UseCompanyMembersReturn {
  // Estados
  members: CompanyMember[];
  isLoading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;

  // Métodos
  getMembers: (options?: CompanyMembersOptions) => Promise<void>;
  getMembersSimple: () => Promise<CompanyMemberSimple[]>;
  searchMembers: (
    searchTerm: string,
    limit?: number
  ) => Promise<CompanyMember[]>;
  getMembersByRole: (
    role: 'user' | 'admin' | 'master' | 'manager',
    limit?: number
  ) => Promise<CompanyMember[]>;
  refreshMembers: () => Promise<void>;
  clearError: () => void;
}

interface UseCompanyMembersOptions {
  autoLoad?: boolean;
  autoLoadOptions?: CompanyMembersOptions;
}

export const useCompanyMembers = (
  options?: UseCompanyMembersOptions
): UseCompanyMembersReturn => {
  const { autoLoad = false, autoLoadOptions = {} } = options || {};

  // Estados principais
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Hook da empresa para detectar mudanças
  const { selectedCompany } = useCompany();

  // Buscar membros
  const getMembers = useCallback(
    async (fetchOptions: CompanyMembersOptions = {}): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await companyMembersApi.getMembers(fetchOptions);

        setMembers(response.data);
        setTotal(response.total);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao buscar membros da empresa';
        setError(errorMessage);
        console.error('Erro ao buscar membros:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Buscar membros em formato simplificado
  const getMembersSimple = useCallback(async (): Promise<
    CompanyMemberSimple[]
  > => {
    setIsLoading(true);
    setError(null);

    try {
      const simpleMembers = await companyMembersApi.getMembersSimple();
      // Converter CompanyMemberSimple[] para CompanyMember[] e atualizar estado
      const membersToSet: CompanyMember[] = simpleMembers.map(member => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: 'user' as const, // Valor padrão, já que CompanyMemberSimple não tem role
        avatar: member.avatar,
        createdAt: new Date().toISOString(), // Valor padrão
      }));
      setMembers(membersToSet);
      setTotal(membersToSet.length);
      setCurrentPage(1);
      setTotalPages(1);
      return simpleMembers;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Erro ao buscar membros da empresa';
      setError(errorMessage);
      console.error('Erro ao buscar membros (simple):', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar membros por termo de busca
  const searchMembers = useCallback(
    async (
      searchTerm: string,
      limit: number = 10
    ): Promise<CompanyMember[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await companyMembersApi.searchMembers(
          searchTerm,
          limit
        );
        return results;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao buscar membros';
        setError(errorMessage);
        console.error('Erro ao buscar membros:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Buscar membros por role
  const getMembersByRole = useCallback(
    async (
      role: 'user' | 'admin' | 'master' | 'manager',
      limit: number = 100
    ): Promise<CompanyMember[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await companyMembersApi.getMembersByRole(role, limit);
        return results;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao buscar membros por role';
        setError(errorMessage);
        console.error('Erro ao buscar membros por role:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Recarregar membros
  const refreshMembers = useCallback(async (): Promise<void> => {
    await getMembers({ page: currentPage });
  }, [getMembers, currentPage]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-carregar membros ao montar o componente ou quando a empresa mudar
  useEffect(() => {
    if (autoLoad && selectedCompany) {
      getMembers(autoLoadOptions);
    }
  }, [
    autoLoad,
    selectedCompany,
    autoLoadOptions.page,
    autoLoadOptions.limit,
    autoLoadOptions.search,
  ]);

  return {
    // Estados
    members,
    isLoading,
    error,
    total,
    currentPage,
    totalPages,

    // Métodos
    getMembers,
    getMembersSimple,
    searchMembers,
    getMembersByRole,
    refreshMembers,
    clearError,
  };
};
