import { useState, useCallback, useEffect } from 'react';
import { usersApi } from '../services/usersApi';
import { useCompany } from './useCompany';
import { useAutoReloadOnCompanyChange } from './useCompanyMonitor';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import type {
  User,
  CreateUserData,
  UpdateUserData,
  PaginationOptions,
  UsersResponse,
} from '../services/usersApi';

interface UseUsersReturn {
  // Estados
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;

  // Métodos de usuários
  getUsers: (options?: PaginationOptions) => Promise<void>;
  getUserById: (id: string) => Promise<User>;
  createUser: (userData: CreateUserData) => Promise<User>;
  updateUser: (id: string, userData: UpdateUserData) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  refreshUsers: () => Promise<void>;

  // Métodos utilitários
  clearError: () => void;
  setCurrentUser: (user: User | null) => void;
}

interface UseUsersOptions {
  disableAutoReload?: boolean;
}

export const useUsers = (options?: UseUsersOptions): UseUsersReturn => {
  const { disableAutoReload = false } = options || {};

  // Estados principais
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Hook da empresa para detectar mudanças
  const { selectedCompany } = useCompany();

  // Hook de permissões para verificar se pode acessar usuários
  const permissionsContext = usePermissionsContextOptional();
  const hasPermission = permissionsContext?.hasPermission || (() => false);

  // Buscar usuários
  const getUsers = useCallback(
    async (options: PaginationOptions = {}): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response: UsersResponse = await usersApi.getUsers(options);

        setUsers(response.data);
        setTotal(response.total);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao buscar usuários';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Função estável para recarregar usuários (sem dependências para evitar loop)
  const reloadUsers = useCallback(async () => {
    // CORREÇÃO: Verificar se tem permissão antes de carregar
    const canViewUsers =
      hasPermission('user:view') || hasPermission('user:list');

    if (!canViewUsers) {
      // console.log('⚠️ useUsers: Usuário sem permissão para visualizar usuários - auto-reload desabilitado');
      return; // Não fazer nada se não tem permissão
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await usersApi.getUsers({ page: 1, limit: 100 });
      setUsers(response.data || []);
      setTotal(response.total || 0);
      setCurrentPage(response.page || 1);
      setTotalPages(response.totalPages || 1);
    } catch (err: any) {
      // CORREÇÃO: Tratar erro 403 silenciosamente
      const is403 =
        err.response?.status === 403 ||
        err.message?.includes('403') ||
        err.message?.includes('Forbidden');

      if (is403) {
        // console.log('⚠️ useUsers: Erro 403 detectado - usuário não tem permissão para acessar lista de usuários');
        // Não definir erro no estado para não exibir ao usuário
        setUsers([]);
      } else {
        setError(err.response?.data?.message || 'Erro ao recarregar usuários');
      }
    } finally {
      setIsLoading(false);
    }
  }, [hasPermission]); // Adicionar hasPermission como dependência

  // Monitorar mudanças de empresa e recarregar usuários automaticamente
  // CORREÇÃO: Passar flag enabled baseado em disableAutoReload
  useAutoReloadOnCompanyChange(reloadUsers, !disableAutoReload);

  // Buscar usuário por ID
  const getUserById = useCallback(async (id: string): Promise<User> => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await usersApi.getUserById(id);
      setCurrentUser(user);
      return user;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar usuário';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar usuário
  const createUser = useCallback(
    async (userData: CreateUserData): Promise<User> => {
      setIsLoading(true);
      setError(null);

      try {
        const newUser = await usersApi.createUser(userData);

        // Adicionar à lista local
        setUsers(prev => [newUser, ...prev]);
        setTotal(prev => prev + 1);

        return newUser;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao criar usuário';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Atualizar usuário
  const updateUser = useCallback(
    async (id: string, userData: UpdateUserData): Promise<User> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedUser = await usersApi.updateUser(id, userData);

        // Atualizar na lista local
        setUsers(prev =>
          prev.map(user => (user.id === id ? updatedUser : user))
        );

        // Atualizar usuário atual se for o mesmo
        if (currentUser?.id === id) {
          setCurrentUser(updatedUser);
        }

        return updatedUser;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao atualizar usuário';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser?.id]
  );

  // Excluir usuário
  const deleteUser = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await usersApi.deleteUser(id);

        // Remover da lista local
        setUsers(prev => prev.filter(user => user.id !== id));
        setTotal(prev => prev - 1);

        // Limpar usuário atual se for o mesmo
        if (currentUser?.id === id) {
          setCurrentUser(null);
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao excluir usuário';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser?.id]
  );

  // Recarregar usuários
  const refreshUsers = useCallback(async (): Promise<void> => {
    await getUsers({ page: currentPage });
  }, [getUsers, currentPage]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estados
    users,
    currentUser,
    isLoading,
    error,
    total,
    currentPage,
    totalPages,

    // Métodos
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers,
    clearError,
    setCurrentUser,
  };
};
