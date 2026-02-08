/**
 * Utilitário para gerenciar permissões do aplicativo Dream Keys
 */

/**
 * Lista de permissões necessárias para acesso ao aplicativo Dream Keys
 * Todas essas permissões devem estar selecionadas quando hasAccessToDreamKeysApp = true
 */
export const DREAM_KEYS_APP_PERMISSIONS = [
  // Dashboard
  'dashboard:view',

  // Imóveis (todas as permissões principais)
  'property:view',
  'property:create',
  'property:update',
  'property:delete',

  // Clientes (todas as permissões principais)
  'client:view',
  'client:create',
  'client:update',
  'client:delete',

  // Calendário (todas as permissões principais)
  'calendar:view',
  'calendar:create',
  'calendar:update',
  'calendar:delete',

  // Matches - não há permissão específica de matches, é controlado por permissões de propriedades/clientes
  // Nota: O sistema de matches não tem permissão própria, então não incluímos aqui

  // Comissões (todas as permissões principais)
  'commission:view',
  'commission:create',
  'commission:update',
  'commission:delete',

  // Chat - não há permissão específica de chat no sistema atual
  // Nota: Chat não tem permissão própria, então não incluímos aqui

  // Kanban (todas as permissões principais)
  'kanban:view',
  'kanban:create',
  'kanban:update',
  'kanban:delete',

  // Chaves (todas as permissões)
  'key:view',
  'key:create',
  'key:update',
  'key:delete',
  'key:checkout',
  'key:return',

  // Documentos (todas as permissões)
  'document:read',
  'document:create',
  'document:update',
  'document:delete',
  'document:approve',
  'document:download',

  // Times (apenas visualização)
  'team:view',
] as const;

/**
 * Converte nomes de permissões para IDs de permissões
 * @param permissions Lista de permissões do sistema
 * @returns Array de IDs das permissões do Dream Keys App
 */
export function getDreamKeysAppPermissionIds(
  permissions: Array<{ id: string; name: string }>
): string[] {
  const permissionIds: string[] = [];

  // Mapear cada permissão necessária para seu ID
  DREAM_KEYS_APP_PERMISSIONS.forEach(permissionName => {
    const permission = permissions.find(p => p.name === permissionName);
    if (permission) {
      permissionIds.push(permission.id);
    }
  });

  return permissionIds;
}

/**
 * Verifica se todas as permissões do Dream Keys App estão selecionadas
 * @param selectedPermissionIds IDs das permissões selecionadas
 * @param allPermissions Lista de todas as permissões disponíveis
 * @returns true se todas as permissões necessárias estão selecionadas
 */
export function hasAllDreamKeysAppPermissions(
  selectedPermissionIds: string[],
  allPermissions: Array<{ id: string; name: string }>
): boolean {
  const requiredIds = getDreamKeysAppPermissionIds(allPermissions);

  // Verificar se todos os IDs necessários estão na lista de selecionados
  return requiredIds.every(id => selectedPermissionIds.includes(id));
}

/**
 * Verifica se alguma permissão relacionada ao Dream Keys App foi alterada
 * @param previousPermissionIds IDs das permissões antes da mudança
 * @param currentPermissionIds IDs das permissões após a mudança
 * @param allPermissions Lista de todas as permissões disponíveis
 * @returns true se alguma permissão do Dream Keys App foi alterada
 */
export function hasDreamKeysAppPermissionChanged(
  previousPermissionIds: string[],
  currentPermissionIds: string[],
  allPermissions: Array<{ id: string; name: string }>
): boolean {
  const requiredIds = getDreamKeysAppPermissionIds(allPermissions);

  // Verificar se alguma permissão necessária foi adicionada ou removida
  return requiredIds.some(id => {
    const wasSelected = previousPermissionIds.includes(id);
    const isSelected = currentPermissionIds.includes(id);
    return wasSelected !== isSelected;
  });
}

/**
 * Obtém as permissões do Dream Keys App que estão faltando
 * @param selectedPermissionIds IDs das permissões selecionadas
 * @param allPermissions Lista de todas as permissões disponíveis
 * @returns Array com os nomes das permissões que estão faltando
 */
export function getMissingDreamKeysAppPermissions(
  selectedPermissionIds: string[],
  allPermissions: Array<{ id: string; name: string }>
): string[] {
  const requiredIds = getDreamKeysAppPermissionIds(allPermissions);
  const missingIds = requiredIds.filter(
    id => !selectedPermissionIds.includes(id)
  );

  return missingIds
    .map(id => {
      const permission = allPermissions.find(p => p.id === id);
      return permission?.name || id;
    })
    .filter(Boolean) as string[];
}
