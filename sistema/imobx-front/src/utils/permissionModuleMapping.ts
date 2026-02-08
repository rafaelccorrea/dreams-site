import { MODULE_TYPES } from '../services/modulesService';

/**
 * Mapeamento completo de permissões para módulos necessários
 * Baseado nos 30 módulos disponíveis no sistema
 */
export function getRequiredModuleForPermission(
  permissionName: string
): string | null {
  // Módulos Básicos - sempre disponíveis
  if (permissionName.startsWith('user:')) return MODULE_TYPES.USER_MANAGEMENT;
  if (permissionName.startsWith('company:'))
    return MODULE_TYPES.COMPANY_MANAGEMENT;

  // Módulos Intermediários
  if (permissionName.startsWith('property:'))
    return MODULE_TYPES.PROPERTY_MANAGEMENT;
  if (permissionName.startsWith('client:'))
    return MODULE_TYPES.CLIENT_MANAGEMENT;
  if (permissionName.startsWith('checklist:'))
    return MODULE_TYPES.CHECKLIST_MANAGEMENT;
  if (permissionName.startsWith('kanban:'))
    return MODULE_TYPES.KANBAN_MANAGEMENT;
  if (permissionName.startsWith('inspection:')) return MODULE_TYPES.VISTORIA;
  if (permissionName.startsWith('key:')) return MODULE_TYPES.KEY_CONTROL;
  if (permissionName.startsWith('rental:'))
    return MODULE_TYPES.RENTAL_MANAGEMENT;
  if (permissionName.startsWith('calendar:'))
    return MODULE_TYPES.CALENDAR_MANAGEMENT;
  if (permissionName.startsWith('commission:'))
    return MODULE_TYPES.COMMISSION_MANAGEMENT;
  if (permissionName.startsWith('document:'))
    return MODULE_TYPES.DOCUMENT_MANAGEMENT;
  if (permissionName.startsWith('match:')) return MODULE_TYPES.MATCH_SYSTEM;
  if (permissionName.startsWith('team:')) return MODULE_TYPES.TEAM_MANAGEMENT;

  // Módulos Avançados
  if (permissionName.startsWith('financial:'))
    return MODULE_TYPES.FINANCIAL_MANAGEMENT;
  if (permissionName.startsWith('marketing:'))
    return MODULE_TYPES.MARKETING_TOOLS;
  if (permissionName.startsWith('api:')) return MODULE_TYPES.API_INTEGRATIONS;
  if (permissionName.startsWith('custom-field:'))
    return MODULE_TYPES.CUSTOM_FIELDS;
  if (permissionName.startsWith('workflow:'))
    return MODULE_TYPES.WORKFLOW_AUTOMATION;

  // Módulos Premium
  if (
    permissionName.startsWith('bi:') ||
    permissionName.startsWith('business-intelligence:')
  ) {
    return MODULE_TYPES.BUSINESS_INTELLIGENCE;
  }
  if (permissionName.startsWith('integration:'))
    return MODULE_TYPES.THIRD_PARTY_INTEGRATIONS;
  if (permissionName.startsWith('meta_campaign:'))
    return MODULE_TYPES.THIRD_PARTY_INTEGRATIONS;
  if (permissionName.startsWith('grupo_zap:'))
    return MODULE_TYPES.THIRD_PARTY_INTEGRATIONS;
  if (permissionName.startsWith('lead_distribution:'))
    return MODULE_TYPES.LEAD_DISTRIBUTION;

  // Módulos Adicionais
  if (
    permissionName.startsWith('gamification:') ||
    permissionName.startsWith('competition:') ||
    permissionName.startsWith('reward:') ||
    permissionName.startsWith('prize:')
  ) {
    return MODULE_TYPES.GAMIFICATION;
  }
  if (permissionName.startsWith('note:')) return MODULE_TYPES.NOTES;
  if (permissionName.startsWith('appointment:'))
    return MODULE_TYPES.APPOINTMENTS;

  // Relatórios
  if (permissionName.startsWith('report:')) {
    // Relatórios básicos vs avançados
    if (
      permissionName.includes('advanced') ||
      permissionName.includes('export')
    ) {
      return MODULE_TYPES.ADVANCED_REPORTS;
    }
    return MODULE_TYPES.BASIC_REPORTS;
  }

  // Permissões de sistema
  if (permissionName.startsWith('system:'))
    return MODULE_TYPES.SYSTEM_MANAGEMENT;

  // Galeria de imagens
  if (permissionName.startsWith('gallery:')) return MODULE_TYPES.IMAGE_GALLERY;

  // MCMV (Minha Casa Minha Vida)
  // Retornar 'mcmv_management' que será mapeado para 'mcmv' no hasModule
  if (permissionName.startsWith('mcmv:')) return MODULE_TYPES.MCMV_MANAGEMENT;

  // Asset Management (Gestão Patrimonial)
  if (permissionName.startsWith('asset:')) return MODULE_TYPES.ASSET_MANAGEMENT;

  // Analytics do Site Público
  if (permissionName.startsWith('public_analytics:'))
    return MODULE_TYPES.PUBLIC_SITE_ANALYTICS;

  // WhatsApp - pode usar módulo CHAT ou não requerer módulo específico
  // (deixar como null por enquanto, mas pode ser mapeado para CHAT se necessário)
  if (permissionName.startsWith('whatsapp:')) return null; // ou MODULE_TYPES.CHAT se necessário

  // Session - não requer módulo específico (gerenciamento de sessões é básico)
  if (permissionName.startsWith('session:')) return null;

  // Performance/comparações - não requer módulo específico
  if (permissionName.startsWith('performance:')) return null;

  // Permissões básicas que não requerem módulos específicos
  // (subscriptions, profile, etc.)
  return null;
}

/**
 * Categorias de módulos com cores e ícones
 */
export const MODULE_CATEGORIES = {
  basic: {
    label: 'Básico',
    color: '#10b981',
    icon: '🟢',
    description: 'Inclusos em todos os planos',
  },
  intermediate: {
    label: 'Intermediário',
    color: '#f59e0b',
    icon: '🟡',
    description: 'Disponíveis no plano Professional',
  },
  advanced: {
    label: 'Avançado',
    color: '#ef4444',
    icon: '🟠',
    description: 'Disponíveis em planos Custom',
  },
  premium: {
    label: 'Premium',
    color: '#8b5cf6',
    icon: '🔴',
    description: 'Recursos premium exclusivos',
  },
  additional: {
    label: 'Adicional',
    color: '#6366f1',
    icon: '🟣',
    description: 'Funcionalidades complementares',
  },
  system: {
    label: 'Sistema',
    color: '#1f2937',
    icon: '⚫',
    description: 'Apenas para administradores MASTER',
  },
} as const;
