import type { UserPermissionsResponse } from './permissionsApi';

/**
 * Mapeamento de permissões para páginas disponíveis
 * Ordem de prioridade: páginas mais importantes primeiro
 */
const PERMISSION_TO_PAGE_MAPPING = {
  // Dashboard (maior prioridade - acesso geral)
  'dashboard:view': '/dashboard',

  // Kanban (alta prioridade - funcionalidade principal)
  'kanban:view': '/kanban',
  'kanban:create': '/kanban',
  'kanban:update': '/kanban',
  'kanban:delete': '/kanban',

  // Propriedades (alta prioridade)
  'property:view': '/properties',
  'property:create': '/properties',
  'property:update': '/properties',
  'property:delete': '/properties',

  // Vistorias (alta prioridade)
  'inspection:view': '/inspection',
  'inspection:create': '/inspection',
  'inspection:update': '/inspection',
  'inspection:delete': '/inspection',

  // Financeiro
  'financial:view': '/financial',
  'financial:create': '/financial',
  'financial:update': '/financial',
  'financial:delete': '/financial',

  // Clientes
  'client:view': '/clients',
  'client:create': '/clients',
  'client:update': '/clients',
  'client:delete': '/clients',

  // Calendário
  'calendar:view': '/calendar',
  'calendar:create': '/calendar',
  'calendar:update': '/calendar',
  'calendar:delete': '/calendar',

  // Notas
  'note:view': '/notes',
  'note:create': '/notes',
  'note:update': '/notes',
  'note:delete': '/notes',
  'note:share': '/notes',

  // Comissões
  'commission:view': '/commissions',
  'commission:create': '/commissions',
  'commission:update': '/commissions',
  'commission:delete': '/commissions',

  // Usuários
  'user:view': '/users',
  'user:create': '/users',
  'user:update': '/users',
  'user:delete': '/users',

  // Equipes
  'team:view': '/teams',
  'team:create': '/teams',
  'team:update': '/teams',
  'team:delete': '/teams',

  // Chaves
  'key:view': '/keys',
  'key:create': '/keys',
  'key:update': '/keys',
  'key:delete': '/keys',

  // Locação
  'rental:view': '/rentals',
  'rental:create': '/rentals',
  'rental:update': '/rentals',
  'rental:delete': '/rentals',

  // Gamificação
  'gamification:view': '/gamification',
  'gamification:configure': '/gamification',

  // Competições
  'competition:view': '/competitions',
  'competition:create': '/competitions',
  'competition:edit': '/competitions',
  'competition:delete': '/competitions',

  // Prêmios
  'prize:view': '/prizes',
  'prize:create': '/prizes',
  'prize:edit': '/prizes',
  'prize:delete': '/prizes',

  // REMOVIDO: session:view - não existe página /sessions
  // REMOVIDO: appointment:view - usar calendar:view
} as const;

/**
 * Páginas de fallback quando nenhuma permissão específica é encontrada
 */
const FALLBACK_PAGES = [
  '/dashboard', // Dashboard geral
  '/properties', // Propriedades (funcionalidade básica)
  '/clients', // Clientes (funcionalidade básica)
  '/calendar', // Calendário (funcionalidade básica)
] as const;

/**
 * Analisa as permissões do usuário e determina a melhor página para redirecionamento
 * Usuários do tipo "User" vão para o Funil de Vendas (Kanban), outros vão para o dashboard
 */
export const analyzeUserPermissions = (
  userPermissions: UserPermissionsResponse | null,
  userRole?: string
): string => {
  // Se for usuário do tipo "User", redirecionar para Funil de Vendas (Kanban)
  if (userRole === 'user') {
    return '/kanban';
  }

  // Para outros tipos de usuário, usar lógica baseada em permissões
  if (!userPermissions || !userPermissions.permissionNames) {
    return '/dashboard';
  }

  const permissionNames = userPermissions.permissionNames;

  // Buscar a primeira permissão válida no mapeamento
  for (const permission of permissionNames) {
    if (permission in PERMISSION_TO_PAGE_MAPPING) {
      return PERMISSION_TO_PAGE_MAPPING[
        permission as keyof typeof PERMISSION_TO_PAGE_MAPPING
      ];
    }
  }

  // Fallback para dashboard
  return '/dashboard';
};

/**
 * Verifica se o usuário tem permissões suficientes para acessar o sistema
 */
export const hasValidPermissions = (
  userPermissions: UserPermissionsResponse | null
): boolean => {
  if (!userPermissions || !userPermissions.permissions) {
    return false;
  }

  const permissionNames = userPermissions.permissionNames || [];

  // Verificar se tem pelo menos uma permissão válida
  const hasValidPermission = permissionNames.some(permission =>
    Object.keys(PERMISSION_TO_PAGE_MAPPING).includes(permission)
  );

  return hasValidPermission;
};

/**
 * Obtém informações detalhadas sobre as permissões do usuário para logging
 */
export const getPermissionAnalysis = (
  userPermissions: UserPermissionsResponse | null
) => {
  if (!userPermissions) {
    return {
      hasPermissions: false,
      totalPermissions: 0,
      categories: [],
      suggestedPage: '/dashboard',
    };
  }

  const permissionNames = userPermissions.permissionNames || [];
  const permissions = userPermissions.permissions || [];

  // Agrupar por categoria
  const categories = [...new Set(permissions.map(p => p.category))];

  // Encontrar página sugerida (sem role, será determinado pela função)
  const suggestedPage = analyzeUserPermissions(userPermissions);

  return {
    hasPermissions: hasValidPermissions(userPermissions),
    totalPermissions: permissionNames.length,
    categories,
    suggestedPage,
    permissions: permissionNames,
  };
};
