/**
 * Perfis de usuário com permissões pré-definidas
 * Facilita a criação de usuários com conjuntos de permissões comuns
 */

export interface UserProfile {
  id: string;
  name: string;
  description: string;
  icon: string;
  permissionNames: string[]; // Lista de nomes de permissões
}

export const userProfiles: UserProfile[] = [
  {
    id: 'empty',
    name: 'Personalizado',
    description: 'Selecione as permissões manualmente',
    icon: '⚙️',
    permissionNames: [],
  },
  {
    id: 'viewer',
    name: 'Visualizador',
    description: 'Apenas visualização de dados do sistema',
    icon: '👁️',
    permissionNames: [
      'property:view',
      'client:view',
      'financial:view',
      'gallery:view',
      'kanban:view',
      'calendar:view',
      'commission:view',
      'rental:view',
      'inspection:view',
      'key:view',
      'team:view',
      'audit:view',
      'session:view',
      'performance:view',
    ],
  },
  {
    id: 'corretor',
    name: 'Corretor',
    description:
      'Gestão completa de propriedades, clientes, vistorias e vendas',
    icon: '🏢',
    permissionNames: [
      // Propriedades - CRUD completo
      'property:view',
      'property:create',
      'property:update',
      'property:delete',

      // Clientes - CRUD completo
      'client:view',
      'client:create',
      'client:update',
      'client:delete',
      'client:assign_property',
      'client:transfer',
      'client:read',
      'client:export',

      // Vistorias - CRUD completo
      'inspection:view',
      'inspection:create',
      'inspection:update',
      'inspection:delete',

      // Galeria - Upload e organização
      'gallery:view',
      'gallery:create',
      'gallery:update',
      'gallery:delete',

      // Kanban - Gestão de tarefas
      'kanban:view',
      'kanban:create',
      'kanban:update',
      'kanban:delete',
      'kanban:manage_validations_actions',

      // Calendário - Agendamentos
      'calendar:view',
      'calendar:create',
      'calendar:update',
      'calendar:delete',
      'calendar:manage_visibility',

      // Comissões - Visualização e criação
      'commission:view',
      'commission:create',
      'commission:update',
      'commission:calculate',

      // Chaves - Gestão básica
      'key:view',
      'key:checkout',
      'key:return',

      // Aluguéis - Visualização
      'rental:view',

      // Auditoria - Visualização
      'audit:view',

      // Sessões - Visualização
      'session:view',

      // Performance - Visualização própria
      'performance:view',
    ],
  },
  {
    id: 'captador_clientes',
    name: 'Captador de clientes',
    description: 'Apenas captação e gestão de clientes. Não cadastra imóveis.',
    icon: '👤',
    permissionNames: [
      'client:view',
      'client:create',
      'client:update',
      'client:read',
      'client:export',
      'property:view',
      'session:view',
      'performance:view',
    ],
  },
  {
    id: 'captador_imoveis',
    name: 'Captador de imóveis',
    description: 'Apenas captação e gestão de imóveis. Não cadastra clientes.',
    icon: '🏠',
    permissionNames: [
      'property:view',
      'property:create',
      'property:update',
      'client:view',
      'client:read',
      'session:view',
      'performance:view',
    ],
  },
  {
    id: 'gestor_captadores',
    name: 'Gestor de captadores',
    description:
      'Gerencia usuários da equipe de captação (ver, editar, alterar permissões). Não cria usuários.',
    icon: '👥',
    permissionNames: [
      'user:view',
      'user:update',
      'user:manage_permissions',
      'performance:view',
      'performance:view_team',
      'client:view',
      'property:view',
      'team:view',
      'audit:view',
      'session:view',
    ],
  },
  {
    id: 'gerente',
    name: 'Gerente',
    description: 'Gestão de equipes, aprovações e supervisão operacional',
    icon: '👨‍💼',
    permissionNames: [
      // Todas as permissões do corretor
      'property:view',
      'property:create',
      'property:update',
      'property:delete',
      'client:view',
      'client:create',
      'client:update',
      'client:delete',
      'client:assign_property',
      'client:transfer',
      'client:read',
      'client:export',
      'inspection:view',
      'inspection:create',
      'inspection:update',
      'inspection:delete',
      'gallery:view',
      'gallery:create',
      'gallery:update',
      'gallery:delete',
      'kanban:view',
      'kanban:create',
      'kanban:update',
      'kanban:delete',
      'calendar:view',
      'calendar:create',
      'calendar:update',
      'calendar:delete',
      'calendar:manage_visibility',
      'commission:view',
      'commission:create',
      'commission:update',
      'commission:calculate',
      'key:view',
      'key:checkout',
      'key:return',
      'rental:view',
      'audit:view',
      'session:view',

      // Permissões adicionais de gerente
      'team:view',
      'team:create',
      'team:update',
      'team:delete',
      'team:manage_members',
      'user:view',
      'user:create',
      'user:update',
      'user:delete',
      'user:manage_permissions',
      'financial:view',
      'financial:create',
      'financial:update',
      'financial:delete',
      'commission:delete',
      'key:create',
      'key:update',
      'key:delete',
      'rental:create',
      'rental:update',
      'rental:delete',
      'rental:manage_payments',

      // Performance - Comparação completa (inclui view, view_team e view_company automaticamente)
      'performance:compare',
    ],
  },
  {
    id: 'financeiro',
    name: 'Financeiro',
    description: 'Gestão financeira, comissões e controle de pagamentos',
    icon: '💰',
    permissionNames: [
      // Financeiro - CRUD completo
      'financial:view',
      'financial:create',
      'financial:update',
      'financial:delete',

      // Comissões - CRUD completo
      'commission:view',
      'commission:create',
      'commission:update',
      'commission:delete',
      'commission:calculate',

      // Aluguéis - Gestão de pagamentos
      'rental:view',
      'rental:create',
      'rental:update',
      'rental:delete',
      'rental:manage_payments',

      // Clientes - Visualização para consulta
      'client:view',
      'client:read',
      'client:export',

      // Propriedades - Visualização para consulta
      'property:view',

      // Auditoria - Visualização
      'audit:view',

      // Sessões - Visualização
      'session:view',

      // Performance - Visualização
      'performance:view',
    ],
  },
  {
    id: 'manutencao',
    name: 'Manutenção',
    description: 'Gestão de chaves, aluguéis e manutenção de propriedades',
    icon: '🔧',
    permissionNames: [
      // Chaves - CRUD completo
      'key:view',
      'key:create',
      'key:update',
      'key:delete',
      'key:checkout',
      'key:return',

      // Aluguéis - CRUD completo
      'rental:view',
      'rental:create',
      'rental:update',
      'rental:delete',
      'rental:manage_payments',

      // Propriedades - Visualização e atualização
      'property:view',
      'property:update',

      // Vistorias - CRUD completo
      'inspection:view',
      'inspection:create',
      'inspection:update',
      'inspection:delete',

      // Calendário - Agendamentos de manutenção
      'calendar:view',
      'calendar:create',
      'calendar:update',
      'calendar:delete',
      'calendar:manage_visibility',

      // Clientes - Visualização
      'client:view',

      // Auditoria - Visualização
      'audit:view',

      // Sessões - Visualização
      'session:view',

      // Performance - Visualização
      'performance:view',
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Gestão de conteúdo, galeria e estratégias de marketing',
    icon: '📢',
    permissionNames: [
      // Propriedades - Visualização e atualização
      'property:view',
      'property:update',

      // Galeria - CRUD completo
      'gallery:view',
      'gallery:create',
      'gallery:update',
      'gallery:delete',

      // Clientes - Visualização
      'client:view',
      'client:read',
      'client:export',

      // Calendário - Agendamentos de marketing
      'calendar:view',
      'calendar:create',
      'calendar:update',
      'calendar:delete',
      'calendar:manage_visibility',

      // Kanban - Organização de campanhas
      'kanban:view',
      'kanban:create',
      'kanban:update',

      // Auditoria - Visualização
      'audit:view',

      // Sessões - Visualização
      'session:view',
    ],
  },
  {
    id: 'suporte',
    name: 'Suporte',
    description: 'Atendimento ao cliente e suporte técnico',
    icon: '🎧',
    permissionNames: [
      // Visualização geral
      'property:view',
      'client:view',
      'client:read',
      'kanban:view',
      'calendar:view',
      'commission:view',
      'rental:view',
      'inspection:view',
      'key:view',
      'team:view',
      'financial:view',
      'gallery:view',
      'audit:view',
      'session:view',

      // Criação limitada para atendimento
      'kanban:create',
      'calendar:create',
      'inspection:create',

      // Atualização limitada
      'kanban:update',
      'calendar:update',
      'inspection:update',

      // Performance - Visualização
      'performance:view',
    ],
  },
  {
    id: 'gamificacao',
    name: 'Gamificação',
    description: 'Gestão de competições, prêmios e gamificação',
    icon: '🏆',
    permissionNames: [
      // Gamificação - CRUD completo
      'gamification:view',
      'gamification:configure',

      // Competições - CRUD completo
      'competition:view',
      'competition:create',
      'competition:edit',
      'competition:delete',
      'competition:manage',

      // Prêmios - CRUD completo
      'prize:view',
      'prize:create',
      'prize:edit',
      'prize:delete',
      'prize:deliver',

      // Visualização de dados para análise
      'property:view',
      'client:view',
      'commission:view',
      'audit:view',
      'session:view',

      // Performance - Comparação completa (inclui view, view_team e view_company automaticamente)
      'performance:compare',
    ],
  },
  {
    id: 'mcmv',
    name: 'MCMV',
    description: 'Gestão de leads e processos do Minha Casa Minha Vida',
    icon: '🏡',
    permissionNames: [
      // MCMV - Visualização geral
      'mcmv:view',

      // Leads MCMV - CRUD completo
      'mcmv:lead:view',
      'mcmv:lead:capture',
      'mcmv:lead:update',
      'mcmv:lead:assign',
      'mcmv:lead:rate',
      'mcmv:lead:convert',

      // Blacklist - Visualização
      'mcmv:blacklist:view',

      // Templates - Visualização
      'mcmv:template:view',

      // Clientes - Para conversão de leads
      'client:view',
      'client:create',
      'client:update',

      // Calendário - Para agendamentos
      'calendar:view',
      'calendar:create',
      'calendar:update',

      // Sessões - Visualização
      'session:view',

      // Performance - Visualização
      'performance:view',
    ],
  },
  {
    id: 'mcmv-gerente',
    name: 'MCMV Gerente',
    description: 'Gestão completa do módulo MCMV com acesso administrativo',
    icon: '🏠',
    permissionNames: [
      // MCMV - Todas as permissões
      'mcmv:view',
      'mcmv:lead:view',
      'mcmv:lead:capture',
      'mcmv:lead:update',
      'mcmv:lead:assign',
      'mcmv:lead:rate',
      'mcmv:lead:convert',
      'mcmv:blacklist:view',
      'mcmv:blacklist:manage',
      'mcmv:template:view',
      'mcmv:template:manage',

      // Clientes - CRUD completo
      'client:view',
      'client:create',
      'client:update',
      'client:delete',
      'client:assign_property',
      'client:transfer',
      'client:read',
      'client:export',

      // Calendário - CRUD completo
      'calendar:view',
      'calendar:create',
      'calendar:update',
      'calendar:delete',
      'calendar:manage_visibility',

      // Times - Visualização
      'team:view',

      // Auditoria - Visualização
      'audit:view',

      // Sessões - Visualização
      'session:view',

      // Performance - Comparação
      'performance:view',
      'performance:compare',
      'performance:view_team',
    ],
  },
  {
    id: 'patrimonio',
    name: 'Patrimônio',
    description: 'Gestão de ativos e patrimônio da empresa',
    icon: '🏛️',
    permissionNames: [
      // Patrimônio - CRUD completo
      'asset:view',
      'asset:create',
      'asset:update',
      'asset:delete',
      'asset:assign',
      'asset:transfer',
      'asset:manage_status',

      // Propriedades - Visualização
      'property:view',

      // Usuários - Visualização (para atribuição)
      'user:view',

      // Auditoria - Visualização
      'audit:view',

      // Sessões - Visualização
      'session:view',
    ],
  },
  {
    id: 'documentos',
    name: 'Documentos',
    description: 'Gestão de documentos e arquivos',
    icon: '📄',
    permissionNames: [
      // Documentos - CRUD completo
      'document:read',
      'document:create',
      'document:update',
      'document:delete',
      'document:approve',
      'document:download',

      // Propriedades - Visualização
      'property:view',

      // Clientes - Visualização
      'client:view',

      // Auditoria - Visualização
      'audit:view',

      // Sessões - Visualização
      'session:view',
    ],
  },
  {
    id: 'notas',
    name: 'Notas',
    description: 'Gestão de anotações e notas',
    icon: '📝',
    permissionNames: [
      // Notas - CRUD completo
      'note:view',
      'note:create',
      'note:update',
      'note:delete',
      'note:share',

      // Propriedades - Visualização
      'property:view',

      // Clientes - Visualização
      'client:view',

      // Sessões - Visualização
      'session:view',
    ],
  },
  {
    id: 'premios',
    name: 'Prêmios',
    description: 'Gestão de prêmios e resgates',
    icon: '🎁',
    permissionNames: [
      // Prêmios - CRUD completo
      'reward:view',
      'reward:create',
      'reward:update',
      'reward:delete',
      'reward:redeem',
      'reward:approve',
      'reward:reject',
      'reward:deliver',

      // Gamificação - Visualização
      'gamification:view',

      // Sessões - Visualização
      'session:view',

      // Performance - Visualização
      'performance:view',
    ],
  },
];

/**
 * Busca um perfil pelo ID
 */
export const getUserProfileById = (
  profileId: string
): UserProfile | undefined => {
  return userProfiles.find(profile => profile.id === profileId);
};

/**
 * Converte nomes de permissões em IDs com base nas permissões disponíveis
 */
export const convertPermissionNamesToIds = (
  permissionNames: string[],
  availablePermissions: Array<{ id: string; name: string }>
): string[] => {
  return availablePermissions
    .filter(permission => permissionNames.includes(permission.name))
    .map(permission => permission.id);
};
