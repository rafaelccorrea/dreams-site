import { useAuth } from './useAuth';

export const useRoleAccess = () => {
  const { getCurrentUser } = useAuth();

  const hasRoleAccess = (allowedRoles: string[]): boolean => {
    const user = getCurrentUser();
    if (!user || !user.role) {
      return false;
    }

    return allowedRoles.includes(user.role);
  };

  const isAdmin = (): boolean => {
    return hasRoleAccess(['admin', 'master']);
  };

  const isMaster = (): boolean => {
    return hasRoleAccess(['master']);
  };

  return {
    hasRoleAccess,
    isAdmin,
    isMaster,
  };
};
