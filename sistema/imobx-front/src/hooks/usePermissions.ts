import { useState, useEffect, useCallback, useMemo } from 'react';
import { authStorage } from '../services/authStorage';
import { permissionsApi } from '../services/permissionsApi';
import type {
  Permission,
  UserPermissionsResponse,
} from '../services/permissionsApi';

function safeRole(user: unknown): string {
  if (user == null || typeof user !== 'object' || !('role' in user)) return '';
  const r = (user as { role?: unknown }).role;
  if (r == null) return '';
  if (typeof r === 'string') return r;
  if (typeof r === 'number' || typeof r === 'boolean') return String(r);
  return '';
}

export const usePermissions = () => {
  const user = authStorage.getUserData();
  const userRole = useMemo(() => safeRole(user), [user]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] =
    useState<UserPermissionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all permissions
  const loadPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await permissionsApi.getAll();
      setPermissions(data);
    } catch (err) {
      setError('Erro ao carregar permissões');
      console.error('Error loading permissions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load current user's permissions
  const loadMyPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await permissionsApi.getMyPermissions();
      setUserPermissions(data);
    } catch (err) {
      setError('Erro ao carregar permissões do usuário');
      console.error('Error loading user permissions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user permissions by ID (para visualizar permissões de outros usuários)
  const loadUserPermissions = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await permissionsApi.getUserPermissions(userId);
      setUserPermissions(data);
    } catch (err) {
      setError('Erro ao carregar permissões do usuário');
      console.error('Error loading user permissions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user has specific permission
  const hasPermission = useCallback(
    (permissionName: string): boolean => {
      if (userRole === 'master') return true;
      if (!userPermissions) return false;
      return userPermissions.permissionNames.includes(permissionName);
    },
    [userPermissions, userRole]
  );

  // Check if user has any of the specified permissions
  const hasAnyPermission = useCallback(
    (permissionNames: string[]): boolean => {
      if (userRole === 'master') return true;
      if (!userPermissions) return false;
      return permissionNames.some(name =>
        userPermissions.permissionNames.includes(name)
      );
    },
    [userPermissions, userRole]
  );

  // Check if user has all of the specified permissions
  const hasAllPermissions = useCallback(
    (permissionNames: string[]): boolean => {
      if (userRole === 'master') return true;
      if (!userPermissions) return false;
      return permissionNames.every(name =>
        userPermissions.permissionNames.includes(name)
      );
    },
    [userPermissions, userRole]
  );

  // Assign permissions to user
  const assignPermissions = useCallback(
    async (userId: string, permissionIds: string[]) => {
      try {
        setLoading(true);
        setError(null);
        await permissionsApi.assignPermissions(userId, { permissionIds });
        // Reload user permissions after assignment
        await loadUserPermissions(userId);
      } catch (err) {
        setError('Erro ao atribuir permissões');
        console.error('Error assigning permissions:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadUserPermissions]
  );

  // Set user permissions (replace all)
  const updateUserPermissions = useCallback(
    async (userId: string, permissionIds: string[]) => {
      try {
        setLoading(true);
        setError(null);
        await permissionsApi.setUserPermissions(userId, { permissionIds });
        // Reload user permissions after setting
        await loadUserPermissions(userId);
      } catch (err) {
        setError('Erro ao definir permissões');
        console.error('Error setting user permissions:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadUserPermissions]
  );

  // Remove permission from user
  const removePermission = useCallback(
    async (userId: string, permissionId: string) => {
      try {
        setLoading(true);
        setError(null);
        await permissionsApi.removePermission(userId, permissionId);
        // Reload user permissions after removal
        await loadUserPermissions(userId);
      } catch (err) {
        setError('Erro ao remover permissão');
        console.error('Error removing permission:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadUserPermissions]
  );

  // Load current user's permissions when user changes
  useEffect(() => {
    if (user?.id) {
      loadMyPermissions();
    }
  }, [user?.id, loadMyPermissions]);

  return {
    permissions,
    userPermissions,
    loading,
    error,
    loadPermissions,
    loadMyPermissions,
    loadUserPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    assignPermissions,
    updateUserPermissions,
    removePermission,
  };
};
