import { useMemo } from 'react';
import { useCompanyContext } from '../contexts';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import {
  isModuleAvailable,
  hasModulePermission,
  canAccessRoute,
  getAvailableModules,
  groupModulesByCategory,
} from '../utils/moduleMapping';

/**
 * Hook para verificar acesso a módulos e permissões
 */
export const useModuleAccess = () => {
  const { selectedCompany } = useCompanyContext();
  const permissionsContext = usePermissionsContextOptional();
  const userPermissions = permissionsContext?.userPermissions || null;

  // Módulos disponíveis para a empresa
  const availableModules = useMemo(() => {
    if (!selectedCompany) return [];
    return getAvailableModules(selectedCompany.availableModules);
  }, [selectedCompany]);

  // Módulos agrupados por categoria
  const modulesByCategory = useMemo(() => {
    return groupModulesByCategory(availableModules);
  }, [availableModules]);

  // Verificar se um módulo específico está disponível
  const isModuleAvailableForCompany = (moduleId: string): boolean => {
    if (!selectedCompany) return false;
    return isModuleAvailable(moduleId, selectedCompany.availableModules);
  };

  // Verificar se o usuário tem permissão para um módulo
  const hasPermissionForModule = (moduleId: string): boolean => {
    if (!userPermissions) return false;
    return hasModulePermission(moduleId, userPermissions.permissionNames);
  };

  // Verificar se pode acessar uma rota específica
  const canAccessRoutePath = (route: string): boolean => {
    if (!selectedCompany || !userPermissions) return false;
    return canAccessRoute(
      route,
      selectedCompany.availableModules,
      userPermissions.permissionNames
    );
  };

  // Verificar se o usuário tem uma permissão específica
  const hasPermission = (permission: string): boolean => {
    if (!userPermissions) return false;
    return userPermissions.permissionNames.includes(permission);
  };

  // Verificar se o usuário tem qualquer uma das permissões fornecidas
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!userPermissions) return false;
    return permissions.some(permission =>
      userPermissions.permissionNames.includes(permission)
    );
  };

  // Verificar se o usuário tem todas as permissões fornecidas
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!userPermissions) return false;
    return permissions.every(permission =>
      userPermissions.permissionNames.includes(permission)
    );
  };

  return {
    // Estado
    availableModules,
    modulesByCategory,
    isLoading: !selectedCompany || !userPermissions,

    // Verificações de módulo
    isModuleAvailableForCompany,
    hasPermissionForModule,
    canAccessRoutePath,

    // Verificações de permissão
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // Dados brutos
    companyModules: selectedCompany?.availableModules || [],
    userPermissionNames: userPermissions?.permissionNames || [],
  };
};
