import { useState, useCallback } from 'react';
import {
  hierarchyApi,
  type AssignManagerDTO,
  type RemoveManagerDTO,
  type AccessibleUsersResponse,
} from '../services/hierarchyApi';
import type { User } from '../services/usersApi';
import { toast } from 'react-toastify';

interface UseHierarchyReturn {
  managedUsers: User[];
  myManager: User | null;
  accessibleUserIds: string[];
  loading: boolean;
  error: string | null;
  loadManagedUsers: () => Promise<void>;
  loadMyManager: () => Promise<void>;
  loadAccessibleUserIds: () => Promise<void>;
  assignManager: (data: AssignManagerDTO) => Promise<void>;
  removeManager: (data: RemoveManagerDTO) => Promise<void>;
  getUserManagedUsers: (userId: string) => Promise<User[]>;
}

export const useHierarchy = (): UseHierarchyReturn => {
  const [managedUsers, setManagedUsers] = useState<User[]>([]);
  const [myManager, setMyManager] = useState<User | null>(null);
  const [accessibleUserIds, setAccessibleUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadManagedUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await hierarchyApi.getManagedUsers();
      setManagedUsers(users);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao carregar usuários gerenciados';
      setError(errorMessage);
      console.error('Erro ao carregar usuários gerenciados:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMyManager = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const manager = await hierarchyApi.getMyManager();
      setMyManager(manager);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao carregar gestor';
      setError(errorMessage);
      console.error('Erro ao carregar gestor:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAccessibleUserIds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: AccessibleUsersResponse =
        await hierarchyApi.getAccessibleUserIds();
      setAccessibleUserIds(response.accessibleUserIds);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao carregar IDs acessíveis';
      setError(errorMessage);
      console.error('Erro ao carregar IDs acessíveis:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const assignManager = useCallback(async (data: AssignManagerDTO) => {
    setLoading(true);
    setError(null);
    try {
      const response = await hierarchyApi.assignManager(data);
      toast.success(response.message);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao atribuir gestor';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeManager = useCallback(async (data: RemoveManagerDTO) => {
    setLoading(true);
    setError(null);
    try {
      const response = await hierarchyApi.removeManager(data);
      toast.success(response.message);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao remover gestor';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserManagedUsers = useCallback(
    async (userId: string): Promise<User[]> => {
      setLoading(true);
      setError(null);
      try {
        const users = await hierarchyApi.getUserManagedUsers(userId);
        return users;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          'Erro ao carregar usuários gerenciados';
        setError(errorMessage);
        console.error('Erro ao carregar usuários gerenciados:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    managedUsers,
    myManager,
    accessibleUserIds,
    loading,
    error,
    loadManagedUsers,
    loadMyManager,
    loadAccessibleUserIds,
    assignManager,
    removeManager,
    getUserManagedUsers,
  };
};
