/**
 * Mapeamento entre módulos disponíveis da empresa e funcionalidades do sistema
 */

export interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  requiredPermissions: string[];
  category: string;
}

export const moduleMapping: Record<string, ModuleInfo> = {
  // Gestão de Usuários
  user_management: {
    id: 'user_management',
    name: 'Usuários',
    description: 'Gerenciar usuários da empresa',
    icon: '👥',
    route: '/users',
    requiredPermissions: ['user:view'],
    category: 'Administração',
  },

  // Gestão de Empresas
  company_management: {
    id: 'company_management',
    name: 'Empresas',
    description: 'Gerenciar empresas',
    icon: '🏢',
    route: '/companies',
    requiredPermissions: ['company:view'],
    category: 'Administração',
  },

  // Gestão de Propriedades
  property_management: {
    id: 'property_management',
    name: 'Propriedades',
    description: 'Gerenciar propriedades',
    icon: '🏠',
    route: '/properties',
    requiredPermissions: ['property:view'],
    category: 'Gestão',
  },

  // Gestão Patrimonial
  asset_management: {
    id: 'asset_management',
    name: 'Patrimônio',
    description: 'Gerenciar patrimônio da empresa',
    icon: '📦',
    route: '/assets',
    requiredPermissions: ['asset:view'],
    category: 'Gestão',
  },

  // Gestão de Clientes
  client_management: {
    id: 'client_management',
    name: 'Clientes',
    description: 'Gerenciar clientes',
    icon: '👤',
    route: '/clients',
    requiredPermissions: ['client:view'],
    category: 'Gestão',
  },

  // Gestão de Checklists
  checklist_management: {
    id: 'checklist_management',
    name: 'Checklists',
    description: 'Gerenciar checklists de vendas e aluguéis',
    icon: '📋',
    route: '/checklists',
    requiredPermissions: ['property:view'], // Não há checklist:view, usar property:view
    category: 'Gestão',
  },

  // Kanban
  kanban_management: {
    id: 'kanban_management',
    name: 'Kanban',
    description: 'Quadros de tarefas',
    icon: '📋',
    route: '/kanban',
    requiredPermissions: ['kanban:view'],
    category: 'Produtividade',
  },

  // Gestão Financeira
  financial_management: {
    id: 'financial_management',
    name: 'Financeiro',
    description: 'Gestão financeira',
    icon: '💰',
    route: '/financial',
    requiredPermissions: ['financial:view'],
    category: 'Financeiro',
  },

  // Galeria de Imagens
  image_gallery: {
    id: 'image_gallery',
    name: 'Galeria',
    description: 'Galeria de imagens',
    icon: '🖼️',
    route: '/gallery',
    requiredPermissions: ['gallery:view'],
    category: 'Mídia',
  },

  // Gestão de Times
  team_management: {
    id: 'team_management',
    name: 'Times',
    description: 'Gerenciar times',
    icon: '👥',
    route: '/teams',
    requiredPermissions: ['team:view'],
    category: 'Administração',
  },

  // Relatórios Básicos
  basic_reports: {
    id: 'basic_reports',
    name: 'Relatórios',
    description: 'Relatórios básicos',
    icon: '📊',
    route: '/reports',
    requiredPermissions: ['report:view'],
    category: 'Relatórios',
  },

  // Relatórios Avançados
  advanced_reports: {
    id: 'advanced_reports',
    name: 'Relatórios Avançados',
    description: 'Relatórios avançados e BI',
    icon: '📈',
    route: '/advanced-reports',
    requiredPermissions: ['report:view', 'report:export'],
    category: 'Relatórios',
  },

  // Ferramentas de Marketing
  marketing_tools: {
    id: 'marketing_tools',
    name: 'Marketing',
    description: 'Ferramentas de marketing',
    icon: '📢',
    route: '/marketing',
    requiredPermissions: ['marketing:view'],
    category: 'Marketing',
  },

  // Integrações de API
  api_integrations: {
    id: 'api_integrations',
    name: 'Integrações',
    description: 'Integrações com APIs',
    icon: '🔗',
    route: '/integrations',
    requiredPermissions: ['integration:view'],
    category: 'Técnico',
  },

  // Campos Personalizados
  custom_fields: {
    id: 'custom_fields',
    name: 'Campos Personalizados',
    description: 'Campos customizados',
    icon: '⚙️',
    route: '/custom-fields',
    requiredPermissions: ['custom:view'],
    category: 'Configuração',
  },

  // Automação de Workflow
  workflow_automation: {
    id: 'workflow_automation',
    name: 'Automação',
    description: 'Automação de processos',
    icon: '🤖',
    route: '/automation',
    requiredPermissions: ['workflow:view'],
    category: 'Produtividade',
  },

  // Business Intelligence
  business_intelligence: {
    id: 'business_intelligence',
    name: 'Business Intelligence',
    description: 'Análise de dados avançada',
    icon: '🧠',
    route: '/business-intelligence',
    requiredPermissions: ['bi:view'],
    category: 'Relatórios',
  },

  // Integrações Terceiros
  third_party_integrations: {
    id: 'third_party_integrations',
    name: 'Integrações Terceiros',
    description: 'Integrações com terceiros',
    icon: '🔌',
    route: '/third-party-integrations',
    requiredPermissions: ['third_party:view'],
    category: 'Técnico',
  },

  // Distribuição de Leads (Plano Pro)
  lead_distribution: {
    id: 'lead_distribution',
    name: 'Distribuição de Leads',
    description:
      'Distribuição automática de leads, SLA de primeiro contato e alertas',
    icon: '📋',
    route: '/integrations/lead-distribution/config',
    requiredPermissions: [
      'lead_distribution:view',
      'lead_distribution:manage_config',
    ],
    category: 'Produtividade',
  },

  // White Label
  white_label: {
    id: 'white_label',
    name: 'White Label',
    description: 'Personalização de marca',
    icon: '🏷️',
    route: '/white-label',
    requiredPermissions: ['white_label:view'],
    category: 'Configuração',
  },

  // Suporte Prioritário
  priority_support: {
    id: 'priority_support',
    name: 'Suporte',
    description: 'Suporte prioritário',
    icon: '🎧',
    route: '/support',
    requiredPermissions: ['support:view'],
    category: 'Suporte',
  },

  // Chat
  chat: {
    id: 'chat',
    name: 'Chat',
    description: 'Sistema de chat em tempo real',
    icon: '💬',
    route: '/chat',
    requiredPermissions: [],
    category: 'Comunicação',
  },

  // Analytics do Site Público
  public_site_analytics: {
    id: 'public_site_analytics',
    name: 'Analytics do Site Público',
    description: 'Analytics avançado do site público',
    icon: '📊',
    route: '/analytics/public-site',
    requiredPermissions: ['public_analytics:view'],
    category: 'Analytics',
  },

  // MCMV (Minha Casa Minha Vida)
  mcmv_management: {
    id: 'mcmv_management',
    name: 'MCMV',
    description: 'Minha Casa Minha Vida - Gestão de Leads',
    icon: '🏠',
    route: '/mcmv/leads',
    requiredPermissions: ['mcmv:view'],
    category: 'Gestão',
  },

  // Automações
  automations: {
    id: 'automations',
    name: 'Automações',
    description: 'Sistema de automações e workflows',
    icon: '🤖',
    route: '/automations',
    requiredPermissions: [],
    category: 'Produtividade',
  },

  // Vistoria
  vistoria: {
    id: 'vistoria',
    name: 'Vistorias',
    description: 'Sistema de vistorias',
    icon: '🔍',
    route: '/inspections',
    requiredPermissions: ['inspection:view'],
    category: 'Gestão',
  },

  // Controle de Chaves
  key_control: {
    id: 'key_control',
    name: 'Chaves',
    description: 'Controle de chaves',
    icon: '🔑',
    route: '/keys',
    requiredPermissions: ['key:view'],
    category: 'Gestão',
  },

  // Gestão de Aluguéis
  rental_management: {
    id: 'rental_management',
    name: 'Aluguéis',
    description: 'Gestão de aluguéis',
    icon: '🏘️',
    route: '/rentals',
    requiredPermissions: ['rental:view'],
    category: 'Gestão',
  },

  // Calendário
  calendar_management: {
    id: 'calendar_management',
    name: 'Calendário',
    description: 'Gestão de calendário e agendamentos',
    icon: '📅',
    route: '/calendar',
    requiredPermissions: ['calendar:view'],
    category: 'Produtividade',
  },

  // Gestão de Comissões
  commission_management: {
    id: 'commission_management',
    name: 'Comissões',
    description: 'Gestão de comissões',
    icon: '💰',
    route: '/commissions',
    requiredPermissions: ['commission:view'],
    category: 'Financeiro',
  },

  // Gestão de Documentos
  document_management: {
    id: 'document_management',
    name: 'Documentos',
    description: 'Gestão de documentos',
    icon: '📄',
    route: '/documents',
    requiredPermissions: ['document:read'],
    category: 'Gestão',
  },

  // Sistema de Match
  match_system: {
    id: 'match_system',
    name: 'Matches',
    description: 'Sistema de correspondência entre clientes e propriedades',
    icon: '🎯',
    route: '/matches',
    requiredPermissions: ['client:view'], // Não há match:view, usar client:view
    category: 'Gestão',
  },

  // Notas
  notes: {
    id: 'notes',
    name: 'Notas',
    description: 'Sistema de notas e anotações',
    icon: '📝',
    route: '/notes',
    requiredPermissions: ['note:view'],
    category: 'Produtividade',
  },

  // Agendamentos
  appointments: {
    id: 'appointments',
    name: 'Agendamentos',
    description: 'Sistema de agendamentos',
    icon: '📆',
    route: '/appointments',
    requiredPermissions: ['appointment:view'],
    category: 'Produtividade',
  },

  // Dashboard
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Painel de controle e métricas',
    icon: '📊',
    route: '/dashboard',
    requiredPermissions: [],
    category: 'Relatórios',
  },

  // Assistente de IA
  ai_assistant: {
    id: 'ai_assistant',
    name: 'Assistente de IA',
    description: 'Inteligência Artificial para geração de conteúdo e análises',
    icon: '🤖',
    route: '/ai-assistant',
    requiredPermissions: [],
    category: 'Produtividade',
  },

  // Gerenciamento de Sistema
  system_management: {
    id: 'system_management',
    name: 'Sistema',
    description: 'Gerenciamento do sistema',
    icon: '⚙️',
    route: '/system',
    requiredPermissions: [],
    category: 'Administração',
  },
};

/**
 * Mapeamento de aliases para módulos
 * Permite que módulos sejam referenciados por nomes diferentes
 * Útil para compatibilidade entre diferentes versões da API e formatos de nomes
 */
const MODULE_ALIASES: Record<string, string[]> = {
  // MCMV - pode vir como 'mcmv' ou 'mcmv_management'
  mcmv_management: ['mcmv', 'mcmv_management'],
  mcmv: ['mcmv', 'mcmv_management'],

  // Vistoria - pode ter variações
  vistoria: ['vistoria', 'inspection', 'inspections'],
  inspection: ['vistoria', 'inspection', 'inspections'],
  inspections: ['vistoria', 'inspection', 'inspections'],

  // Controle de Chaves
  key_control: ['key_control', 'keys', 'key_management'],
  keys: ['key_control', 'keys', 'key_management'],
  key_management: ['key_control', 'keys', 'key_management'],

  // Aluguéis
  rental_management: ['rental_management', 'rentals', 'rental'],
  rentals: ['rental_management', 'rentals', 'rental'],
  rental: ['rental_management', 'rentals', 'rental'],

  // Calendário
  calendar_management: ['calendar_management', 'calendar', 'calendars'],
  calendar: ['calendar_management', 'calendar', 'calendars'],
  calendars: ['calendar_management', 'calendar', 'calendars'],

  // Comissões
  commission_management: ['commission_management', 'commissions', 'commission'],
  commissions: ['commission_management', 'commissions', 'commission'],
  commission: ['commission_management', 'commissions', 'commission'],

  // Documentos
  document_management: ['document_management', 'documents', 'document'],
  documents: ['document_management', 'documents', 'document'],
  document: ['document_management', 'documents', 'document'],

  // Match System
  match_system: ['match_system', 'matches', 'match'],
  matches: ['match_system', 'matches', 'match'],
  match: ['match_system', 'matches', 'match'],

  // Notas
  notes: ['notes', 'note'],
  note: ['notes', 'note'],

  // Agendamentos
  appointments: ['appointments', 'appointment'],
  appointment: ['appointments', 'appointment'],

  // Dashboard
  dashboard: ['dashboard', 'dashboards'],
  dashboards: ['dashboard', 'dashboards'],

  // Assistente de IA
  ai_assistant: [
    'ai_assistant',
    'ai',
    'ai_assistants',
    'artificial_intelligence',
  ],
  ai: ['ai_assistant', 'ai', 'ai_assistants', 'artificial_intelligence'],
  ai_assistants: [
    'ai_assistant',
    'ai',
    'ai_assistants',
    'artificial_intelligence',
  ],
  artificial_intelligence: [
    'ai_assistant',
    'ai',
    'ai_assistants',
    'artificial_intelligence',
  ],

  // Sistema
  system_management: ['system_management', 'system', 'systems'],
  system: ['system_management', 'system', 'systems'],
  systems: ['system_management', 'system', 'systems'],
};

/**
 * Verifica se um módulo está disponível para a empresa
 * Faz comparação case-insensitive para garantir consistência
 * Suporta aliases para compatibilidade com diferentes formatos de nomes
 */
export const isModuleAvailable = (
  moduleId: string,
  availableModules: string[]
): boolean => {
  if (!moduleId || !Array.isArray(availableModules)) {
    return false;
  }

  const normalizedModuleId = moduleId.toLowerCase().trim();

  // Debug para match_system
  if (normalizedModuleId === 'match_system' && import.meta.env.DEV) {
    console.log('🔍 isModuleAvailable - Verificando match_system:', {
      moduleId,
      normalizedModuleId,
      availableModules,
      availableModulesTypes: availableModules.map(m => typeof m),
      directMatch: availableModules.some(
        module => String(module).toLowerCase().trim() === normalizedModuleId
      ),
    });
  }

  // Verificar se o módulo está diretamente na lista
  const directMatch = availableModules.some(
    module => String(module).toLowerCase().trim() === normalizedModuleId
  );

  if (directMatch) {
    if (normalizedModuleId === 'match_system' && import.meta.env.DEV) {
      console.log(
        '✅ isModuleAvailable - Match direto encontrado para match_system'
      );
    }
    return true;
  }

  // Verificar aliases
  const aliases = MODULE_ALIASES[normalizedModuleId] || [];
  if (aliases.length > 0) {
    const aliasMatch = aliases.some(alias =>
      availableModules.some(
        module =>
          String(module).toLowerCase().trim() === alias.toLowerCase().trim()
      )
    );
    if (aliasMatch) {
      if (normalizedModuleId === 'match_system' && import.meta.env.DEV) {
        console.log(
          '✅ isModuleAvailable - Match via alias encontrado para match_system'
        );
      }
      return true;
    }
  }

  // Verificar se algum módulo disponível tem um alias que corresponde ao moduleId
  for (const [key, aliasList] of Object.entries(MODULE_ALIASES)) {
    if (aliasList.includes(normalizedModuleId)) {
      const mainModule = key.toLowerCase().trim();
      const reverseMatch = availableModules.some(
        module => String(module).toLowerCase().trim() === mainModule
      );
      if (reverseMatch) {
        if (normalizedModuleId === 'match_system' && import.meta.env.DEV) {
          console.log(
            '✅ isModuleAvailable - Match reverso encontrado para match_system'
          );
        }
        return true;
      }
    }
  }

  if (normalizedModuleId === 'match_system' && import.meta.env.DEV) {
    console.log(
      '❌ isModuleAvailable - Nenhum match encontrado para match_system'
    );
  }

  return false;
};

/**
 * Obtém informações de um módulo
 * Suporta aliases para compatibilidade
 */
export const getModuleInfo = (moduleId: string): ModuleInfo | null => {
  const normalizedId = moduleId.toLowerCase().trim();

  // Verificar mapeamento direto
  if (moduleMapping[normalizedId]) {
    return moduleMapping[normalizedId];
  }

  // Verificar aliases - buscar o módulo principal do alias
  for (const [key, aliasList] of Object.entries(MODULE_ALIASES)) {
    if (aliasList.includes(normalizedId)) {
      const mainModule = key.toLowerCase().trim();
      if (moduleMapping[mainModule]) {
        return moduleMapping[mainModule];
      }
    }
  }

  return null;
};

/**
 * Filtra módulos disponíveis para a empresa
 */
export const getAvailableModules = (
  availableModules: string[]
): ModuleInfo[] => {
  return availableModules
    .map(moduleId => getModuleInfo(moduleId))
    .filter((module): module is ModuleInfo => module !== null);
};

/**
 * Agrupa módulos por categoria
 */
export const groupModulesByCategory = (
  modules: ModuleInfo[]
): Record<string, ModuleInfo[]> => {
  return modules.reduce(
    (groups, module) => {
      const category = module.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(module);
      return groups;
    },
    {} as Record<string, ModuleInfo[]>
  );
};

/**
 * Verifica se o usuário tem permissões para acessar um módulo
 */
export const hasModulePermission = (
  moduleId: string,
  userPermissions: string[]
): boolean => {
  const module = getModuleInfo(moduleId);
  if (!module) return false;

  return module.requiredPermissions.some(permission =>
    userPermissions.includes(permission)
  );
};

/**
 * Verifica se o usuário pode acessar uma rota específica
 */
export const canAccessRoute = (
  route: string,
  availableModules: string[],
  userPermissions: string[]
): boolean => {
  // Encontrar o módulo que corresponde à rota
  const module = Object.values(moduleMapping).find(m => m.route === route);
  if (!module) return true; // Se não há módulo específico, permitir acesso

  // Verificar se o módulo está disponível para a empresa
  if (!isModuleAvailable(module.id, availableModules)) {
    return false;
  }

  // Verificar se o usuário tem permissões para o módulo
  return hasModulePermission(module.id, userPermissions);
};
