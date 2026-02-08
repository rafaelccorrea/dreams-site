/**
 * Utilitário centralizado para mapeamento de categorias de permissões
 * Garante que todas as categorias tenham nomes legíveis, nunca retornando "Outros"
 */

/**
 * Mapeamento completo de categorias de permissões para nomes legíveis
 */
const CATEGORY_LABELS: Record<string, string> = {
  // Mapeamentos por código (singular)
  user: 'Gestão de Usuários',
  property: 'Gestão de Propriedades',
  inspection: 'Gestão de Vistorias',
  financial: 'Gestão Financeira',
  reports: 'Relatórios',
  settings: 'Configurações',
  company: 'Gestão de Empresas',
  gallery: 'Galeria',
  session: 'Gestão de Sessões',
  team: 'Gestão de Times',
  kanban: 'Funil de Vendas',
  client: 'Gestão de Clientes',
  key: 'Gestão de Chaves',
  gamification: 'Gamificação',
  rental: 'Gestão de Aluguéis',
  calendar: 'Calendário e Agendamentos',
  commission: 'Gestão de Comissões',
  note: 'Gestão de Notas',
  document: 'Gestão de Documentos',
  performance: 'Dashboard de Performance',
  reward: 'Gestão de Prêmios',
  asset: 'Gestão Patrimonial',
  mcmv: 'Minha Casa Minha Vida (MCMV)',
  audit: 'Auditoria',
  checklist: 'Gestão de Checklists',
  match: 'Sistema de Matches',
  subscription: 'Gestão de Assinaturas',
  notification: 'Notificações',
  public: 'Site Público',
  automation: 'Automação',
  workflow: 'Automação de Workflows',
  integration: 'Integrações',
  api: 'API e Integrações',
  system: 'Sistema',
  bi: 'Business Intelligence',
  'business-intelligence': 'Business Intelligence',
  marketing: 'Marketing',
  'custom-field': 'Campos Personalizados',
  appointment: 'Agendamentos',
  competition: 'Competições',
  prize: 'Prêmios',
  public_analytics: 'Analytics do Site Público',
  'public-analytics': 'Analytics do Site Público',
  analytics: 'Analytics e Relatórios',

  // Mapeamentos por código (plural) - variações comuns
  users: 'Gestão de Usuários',
  properties: 'Gestão de Propriedades',
  teams: 'Gestão de Times',
  clients: 'Gestão de Clientes',
  keys: 'Gestão de Chaves',
  documents: 'Gestão de Documentos',
  notes: 'Gestão de Notas',
  assets: 'Gestão Patrimonial',
  commissions: 'Gestão de Comissões',
  rewards: 'Gestão de Prêmios',

  // Mapeamentos por nome legível (mantém o mesmo)
  Calendário: 'Calendário e Agendamentos',
  'Calendário e Agendamentos': 'Calendário e Agendamentos',
  'Gestão de Aluguéis': 'Gestão de Aluguéis',
  'Gestão de Chaves': 'Gestão de Chaves',
  'Gestão de Clientes': 'Gestão de Clientes',
  'Gestão de Empresas': 'Gestão de Empresas',
  'Gestão de Galeria': 'Galeria',
  'Gestão de Gamificação': 'Gamificação',
  'Gestão de Kanban': 'Funil de Vendas',
  'Gestão de Propriedades': 'Gestão de Propriedades',
  'Gestão de Sessões': 'Gestão de Sessões',
  'Gestão de Times': 'Gestão de Times',
  'Gestão de Usuários': 'Gestão de Usuários',
  'Gestão de Vistorias': 'Gestão de Vistorias',
  'Gestão Financeira': 'Gestão Financeira',
  'Gestão de Comissões': 'Gestão de Comissões',
  'Gestão de Notas': 'Gestão de Notas',
  'Gestão de Documentos': 'Gestão de Documentos',
  'Dashboard de Performance': 'Dashboard de Performance',
  'Gestão de Prêmios': 'Gestão de Prêmios',
  'Gestão Patrimonial': 'Gestão Patrimonial',
  'Minha Casa Minha Vida': 'Minha Casa Minha Vida (MCMV)',
  MCMV: 'Minha Casa Minha Vida (MCMV)',
  Auditoria: 'Auditoria',
  'Analytics do Site Público': 'Analytics do Site Público',
  'Site Público': 'Site Público',

  // Mapeamentos legados para compatibilidade
  'Client Management': 'Gestão de Clientes',
  'Controle de Chaves': 'Gestão de Chaves',
  'Key Control': 'Gestão de Chaves',
  key_control: 'Gestão de Chaves',
  other: 'Permissões Gerais',
  null: 'Permissões Gerais',
  undefined: 'Permissões Gerais',
};

/**
 * Ícones para cada categoria
 */
const CATEGORY_ICONS: Record<string, string> = {
  // Mapeamentos por código
  user: '👥',
  property: '🏠',
  inspection: '📋',
  financial: '💰',
  reports: '📊',
  settings: '⚙️',
  company: '🏢',
  gallery: '🖼️',
  session: '🔐',
  team: '👥',
  kanban: '📋',
  client: '👤',
  key: '🔑',
  gamification: '🏆',
  rental: '🏠',
  calendar: '📅',
  commission: '💸',
  note: '📝',
  document: '📄',
  performance: '📊',
  reward: '🎁',
  asset: '🏛️',
  mcmv: '🏡',
  audit: '🔍',
  checklist: '✅',
  match: '🎯',
  subscription: '💳',
  notification: '🔔',
  public: '🌐',
  automation: '🤖',
  workflow: '⚡',
  integration: '🔌',
  api: '🔗',
  system: '⚙️',
  bi: '📈',
  'business-intelligence': '📈',
  marketing: '📢',
  'custom-field': '🏷️',
  appointment: '📅',
  competition: '🏅',
  prize: '🎁',
};

/**
 * Converte uma categoria para um nome legível
 * Tenta derivar um nome se a categoria não estiver mapeada
 * @param category - Categoria da permissão
 * @param permissionName - Nome da permissão (opcional, usado para derivar categoria)
 * @returns Nome legível da categoria, nunca retorna "Outros"
 */
export function getCategoryLabel(
  category: string | null | undefined,
  permissionName?: string
): string {
  // SEMPRE tentar derivar do nome da permissão primeiro se disponível
  if (permissionName) {
    // Tentar extrair categoria do nome da permissão (formato: "category:action")
    const match = permissionName.match(/^([^:]+):/);
    if (match) {
      const derivedCategory = match[1];
      // Tentar com a categoria derivada primeiro
      if (CATEGORY_LABELS[derivedCategory]) {
        return CATEGORY_LABELS[derivedCategory];
      }
      // Tentar variações comuns
      const variations = [
        derivedCategory,
        derivedCategory.toLowerCase(),
        derivedCategory.replace(/_/g, '-'),
        derivedCategory.replace(/-/g, '_'),
      ];
      for (const variation of variations) {
        if (CATEGORY_LABELS[variation]) {
          return CATEGORY_LABELS[variation];
        }
      }
      // Formatar a categoria derivada
      return formatCategoryName(derivedCategory);
    }
  }

  // Se a categoria está vazia, null ou "other", tentar derivar do nome da permissão
  if (
    !category ||
    category === 'other' ||
    category === 'null' ||
    category === 'undefined' ||
    category.trim() === ''
  ) {
    if (permissionName) {
      // Tentar extrair categoria do nome da permissão (formato: "category:action")
      const match = permissionName.match(/^([^:]+):/);
      if (match) {
        const derivedCategory = match[1];
        // Tentar novamente com a categoria derivada
        if (CATEGORY_LABELS[derivedCategory]) {
          return CATEGORY_LABELS[derivedCategory];
        }
        // Formatar a categoria derivada
        return formatCategoryName(derivedCategory);
      }
    }
    // Se não conseguir derivar, usar um nome genérico (NUNCA "Outros")
    return 'Permissões Gerais';
  }

  // Verificar se a categoria está no mapeamento
  if (CATEGORY_LABELS[category]) {
    return CATEGORY_LABELS[category];
  }

  // Tentar variações da categoria
  const variations = [
    category.toLowerCase(),
    category.replace(/_/g, '-'),
    category.replace(/-/g, '_'),
  ];
  for (const variation of variations) {
    if (CATEGORY_LABELS[variation]) {
      return CATEGORY_LABELS[variation];
    }
  }

  // Tentar derivar um nome legível da categoria
  return formatCategoryName(category);
}

/**
 * Formata o nome de uma categoria para torná-lo legível
 * @param category - Categoria a ser formatada
 * @returns Nome formatado
 */
function formatCategoryName(category: string): string {
  // Normalizar categoria removendo espaços extras
  const normalized = category.trim();

  // Se já estiver formatada corretamente, retornar
  if (
    normalized.toLowerCase().startsWith('gestão de') ||
    normalized.toLowerCase().startsWith('dashboard') ||
    normalized.toLowerCase().startsWith('sistema') ||
    normalized.toLowerCase().startsWith('relatórios') ||
    normalized.toLowerCase().startsWith('configurações') ||
    normalized.toLowerCase().startsWith('auditoria') ||
    normalized.toLowerCase().startsWith('notificações') ||
    normalized.toLowerCase().startsWith('analytics') ||
    normalized.toLowerCase().startsWith('gamificação')
  ) {
    return normalized;
  }

  // Remover caracteres especiais e separar por hífen/underscore
  const cleaned = normalized
    .replace(/[_-]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase();

  // Capitalizar primeira letra de cada palavra
  const words = cleaned.split(' ').filter(word => word.length > 0);
  const formatted = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Casos especiais - verificar antes de formatar
  const lowerFormatted = formatted.toLowerCase();

  if (
    lowerFormatted.includes('analytics') ||
    lowerFormatted.includes('analítica')
  ) {
    if (
      lowerFormatted.includes('public') ||
      lowerFormatted.includes('público')
    ) {
      return 'Analytics do Site Público';
    }
    return 'Analytics e Relatórios';
  }

  if (lowerFormatted.includes('public') || lowerFormatted.includes('público')) {
    return 'Site Público';
  }

  if (
    lowerFormatted.includes('business intelligence') ||
    lowerFormatted.includes('bi')
  ) {
    return 'Business Intelligence';
  }

  // Mapeamentos específicos por palavra-chave
  if (
    lowerFormatted.includes('asset') ||
    lowerFormatted.includes('patrimônio') ||
    lowerFormatted.includes('patrimonial')
  ) {
    return 'Gestão Patrimonial';
  }

  if (
    lowerFormatted.includes('commission') ||
    lowerFormatted.includes('comissão')
  ) {
    return 'Gestão de Comissões';
  }

  if (lowerFormatted.includes('reward') || lowerFormatted.includes('prêmio')) {
    return 'Gestão de Prêmios';
  }

  // Se começar com "Gestão de", manter como está
  if (lowerFormatted.startsWith('gestão de')) {
    return formatted;
  }

  // Adicionar "Gestão de" se não começar com um substantivo comum
  const commonNouns = [
    'gestão',
    'dashboard',
    'sistema',
    'relatórios',
    'configurações',
    'auditoria',
    'analytics',
    'notificações',
    'marketing',
    'api',
    'integração',
    'gamificação',
    'competição',
    'competições',
  ];
  const firstWord = words[0]?.toLowerCase() || '';

  if (firstWord && !commonNouns.includes(firstWord)) {
    return `Gestão de ${formatted}`;
  }

  return formatted;
}

/**
 * Obtém o ícone para uma categoria
 * @param category - Categoria da permissão
 * @returns Ícone emoji para a categoria
 */
export function getCategoryIcon(category: string | null | undefined): string {
  if (!category) return '📋';

  // Tentar obter ícone do mapeamento
  if (CATEGORY_ICONS[category]) {
    return CATEGORY_ICONS[category];
  }

  // Fallback: tentar derivar da categoria (sem formatação)
  const normalized = category.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (CATEGORY_ICONS[normalized]) {
    return CATEGORY_ICONS[normalized];
  }

  // Fallback padrão
  return '📋';
}

/**
 * Obtém a cor para uma categoria (opcional, para uso futuro)
 * @param category - Categoria da permissão
 * @returns Cor hexadecimal para a categoria
 */
export function getCategoryColor(category: string | null | undefined): string {
  // Implementação futura se necessário
  return '#6b7280';
}
