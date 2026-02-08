import type { User } from '../services/usersApi';

/**
 * Verifica se o usuário atual pode visualizar dados de outro usuário
 *
 * @param currentUser - Usuário logado
 * @param targetUserId - ID do usuário alvo
 * @returns true se pode visualizar, false caso contrário
 */
export function canViewUserData(
  currentUser: User | null,
  targetUserId: string
): boolean {
  if (!currentUser) return false;

  // MASTER e ADMIN podem ver tudo
  if (currentUser.role === 'master' || currentUser.role === 'admin') {
    return true;
  }

  // Ver próprios dados
  if (currentUser.id === targetUserId) {
    return true;
  }

  // Gestor pode ver dados dos gerenciados
  if (
    currentUser.role === 'manager' &&
    currentUser.managedUserIds?.includes(targetUserId)
  ) {
    return true;
  }

  return false;
}

/**
 * Verifica se o usuário pode editar dados de outro usuário
 *
 * @param currentUser - Usuário logado
 * @param targetUserId - ID do usuário alvo
 * @returns true se pode editar, false caso contrário
 */
export function canEditUserData(
  currentUser: User | null,
  targetUserId: string
): boolean {
  if (!currentUser) return false;

  // MASTER e ADMIN podem editar tudo
  if (currentUser.role === 'master' || currentUser.role === 'admin') {
    return true;
  }

  // Gestor pode editar dados dos gerenciados
  if (
    currentUser.role === 'manager' &&
    currentUser.managedUserIds?.includes(targetUserId)
  ) {
    return true;
  }

  // Usuário pode editar apenas seus próprios dados
  if (currentUser.id === targetUserId) {
    return true;
  }

  return false;
}

/**
 * Verifica se o usuário pode atribuir/remover gestores
 *
 * @param currentUser - Usuário logado
 * @returns true se pode gerenciar hierarquia, false caso contrário
 */
export function canManageHierarchy(currentUser: User | null): boolean {
  if (!currentUser) return false;
  return currentUser.role === 'admin' || currentUser.role === 'master';
}

/**
 * Verifica se o usuário é um gestor
 *
 * @param currentUser - Usuário logado
 * @returns true se é gestor, false caso contrário
 */
export function isManager(currentUser: User | null): boolean {
  if (!currentUser) return false;
  return currentUser.role === 'manager';
}

/**
 * Verifica se o usuário pode criar novos usuários
 *
 * @param currentUser - Usuário logado
 * @returns true se pode criar usuários, false caso contrário
 */
export function canCreateUsers(currentUser: User | null): boolean {
  if (!currentUser) return false;
  return currentUser.role === 'admin' || currentUser.role === 'master';
}

/**
 * Obtém a lista de IDs de usuários acessíveis pelo usuário atual
 *
 * @param currentUser - Usuário logado
 * @returns Array de IDs acessíveis
 */
export function getAccessibleUserIds(currentUser: User | null): string[] {
  if (!currentUser) return [];

  // MASTER e ADMIN têm acesso a todos (retorna vazio para indicar "todos")
  if (currentUser.role === 'master' || currentUser.role === 'admin') {
    return [];
  }

  // MANAGER tem acesso a si mesmo e aos gerenciados
  if (currentUser.role === 'manager') {
    return [currentUser.id, ...(currentUser.managedUserIds || [])];
  }

  // USER tem acesso apenas a si mesmo
  return [currentUser.id];
}

/**
 * Filtra uma lista de dados com base nas permissões do usuário
 *
 * @param data - Array de dados a serem filtrados
 * @param currentUser - Usuário logado
 * @param ownerField - Nome do campo que indica o dono do registro
 * @returns Array filtrado
 */
export function filterByHierarchy<T extends Record<string, any>>(
  data: T[],
  currentUser: User | null,
  ownerField: string = 'userId'
): T[] {
  if (!currentUser) return [];

  // MASTER e ADMIN veem tudo
  if (currentUser.role === 'master' || currentUser.role === 'admin') {
    return data;
  }

  const accessibleIds = getAccessibleUserIds(currentUser);

  // Se accessibleIds estiver vazio, retorna tudo (caso de admin/master)
  if (accessibleIds.length === 0) {
    return data;
  }

  // Filtra por IDs acessíveis
  return data.filter(item => accessibleIds.includes(item[ownerField]));
}

/**
 * Verifica se um usuário pode se tornar gestor
 *
 * @param user - Usuário a ser verificado
 * @returns true se pode ser gestor, false caso contrário
 */
export function canBeManager(user: User | null): boolean {
  if (!user) return false;
  // Apenas users podem se tornar managers
  // Admins e masters não precisam ser managers
  return user.role === 'user' || user.role === 'manager';
}

/**
 * Verifica se um usuário pode ter um gestor
 *
 * @param user - Usuário a ser verificado
 * @returns true se pode ter gestor, false caso contrário
 */
export function canHaveManager(user: User | null): boolean {
  if (!user) return false;
  // Apenas users podem ter gestor
  return user.role === 'user';
}
