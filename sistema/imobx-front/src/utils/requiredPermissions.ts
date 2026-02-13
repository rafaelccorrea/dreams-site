/**
 * Permissões obrigatórias para o bom funcionamento do sistema.
 *
 * Várias APIs e telas dependem dessas permissões (listar usuários, equipes,
 * seletores de responsável, membros de time, etc.). Se um usuário não tiver
 * essas permissões, pode receber 403 ou ver telas quebradas.
 *
 * Estas permissões são sempre incluídas na criação/edição de usuário e
 * não podem ser removidas (ficam travadas como "obrigatório").
 */

/** Nomes das permissões consideradas obrigatórias para o sistema */
export const SYSTEM_REQUIRED_PERMISSION_NAMES = [
  /** Listagem de usuários, seletores de responsável, membros de equipe, permissões por usuário */
  'user:view',
  /** Listagem de equipes, seleção de time, kanban por equipe */
  'team:view',
] as const;

export type SystemRequiredPermissionName =
  (typeof SYSTEM_REQUIRED_PERMISSION_NAMES)[number];

/**
 * Verifica se um nome de permissão é obrigatório para o sistema.
 */
export function isSystemRequiredPermission(permissionName: string): boolean {
  return (
    SYSTEM_REQUIRED_PERMISSION_NAMES as readonly string[]
  ).includes(permissionName);
}

/**
 * Retorna os IDs das permissões obrigatórias do sistema com base na lista
 * de permissões disponíveis.
 */
export function getSystemRequiredPermissionIds(
  availablePermissions: Array<{ id: string; name: string }>
): string[] {
  return availablePermissions
    .filter(p => isSystemRequiredPermission(p.name))
    .map(p => p.id);
}
