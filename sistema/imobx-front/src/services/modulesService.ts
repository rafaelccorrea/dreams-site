import { api } from './api';

export interface CompanyModulesResponse {
  companyId: string;
  companyName: string;
  planType: string;
  modules: string[];
  totalModules: number;
}

export interface ModuleAccessResponse {
  hasAccess: boolean;
}

/**
 * Busca todos os módulos disponíveis para uma empresa
 */
export async function getCompanyModules(
  companyId: string
): Promise<CompanyModulesResponse> {
  const response = await api.get<CompanyModulesResponse>(
    `/companies/${companyId}/modules`
  );
  return response.data;
}

/**
 * Verifica se a empresa tem acesso a um módulo específico
 */
export async function checkModuleAccess(
  companyId: string,
  moduleType: string
): Promise<boolean> {
  try {
    const response = await api.get<ModuleAccessResponse>(
      `/companies/${companyId}/modules/${moduleType}/access`
    );
    return response.data.hasAccess;
  } catch (error) {
    console.error(`Erro ao verificar acesso ao módulo ${moduleType}:`, error);
    return false;
  }
}

/**
 * Tipos de módulos disponíveis (30 módulos completos)
 */
export const MODULE_TYPES = {
  // 1. Módulos Básicos (4)
  USER_MANAGEMENT: 'user_management',
  COMPANY_MANAGEMENT: 'company_management',
  BASIC_REPORTS: 'basic_reports',
  IMAGE_GALLERY: 'image_gallery',

  // 2. Módulos Intermediários (14)
  TEAM_MANAGEMENT: 'team_management',
  ADVANCED_REPORTS: 'advanced_reports',
  PROPERTY_MANAGEMENT: 'property_management',
  CLIENT_MANAGEMENT: 'client_management',
  KANBAN_MANAGEMENT: 'kanban_management',
  VISTORIA: 'vistoria',
  KEY_CONTROL: 'key_control',
  RENTAL_MANAGEMENT: 'rental_management',
  CALENDAR_MANAGEMENT: 'calendar_management',
  COMMISSION_MANAGEMENT: 'commission_management',
  DOCUMENT_MANAGEMENT: 'document_management',
  MATCH_SYSTEM: 'match_system',
  ASSET_MANAGEMENT: 'asset_management',
  CHECKLIST_MANAGEMENT: 'checklist_management',

  // 3. Módulos Avançados (5)
  FINANCIAL_MANAGEMENT: 'financial_management',
  MARKETING_TOOLS: 'marketing_tools',
  API_INTEGRATIONS: 'api_integrations',
  CUSTOM_FIELDS: 'custom_fields',
  WORKFLOW_AUTOMATION: 'workflow_automation',

  // 4. Módulos Premium (4)
  BUSINESS_INTELLIGENCE: 'business_intelligence',
  THIRD_PARTY_INTEGRATIONS: 'third_party_integrations',
  WHITE_LABEL: 'white_label',
  PRIORITY_SUPPORT: 'priority_support',

  // 5. Módulos Adicionais (6)
  GAMIFICATION: 'gamification',
  NOTES: 'notes',
  APPOINTMENTS: 'appointments',
  DASHBOARD: 'dashboard',
  CHAT: 'chat',
  AI_ASSISTANT: 'ai_assistant',

  // 6. MCMV (Minha Casa Minha Vida)
  MCMV_MANAGEMENT: 'mcmv_management', // Usa alias, o código real é 'mcmv'

  // 7. Analytics do Site Público
  PUBLIC_SITE_ANALYTICS: 'public_site_analytics',

  // 8. Automações
  AUTOMATIONS: 'automations',

  // 9. Distribuição de Leads (Plano Pro)
  LEAD_DISTRIBUTION: 'lead_distribution',

  // 10. Módulos de Sistema (1) - Apenas MASTER
  SYSTEM_MANAGEMENT: 'system_management',
} as const;

export type ModuleType = (typeof MODULE_TYPES)[keyof typeof MODULE_TYPES];

/**
 * Labels legíveis para os 30 módulos do sistema
 */
export const MODULE_LABELS: Record<string, string> = {
  // Módulos Básicos
  user_management: 'Gerenciamento de Usuários',
  company_management: 'Gerenciamento de Empresas',
  basic_reports: 'Relatórios Básicos',
  image_gallery: 'Galeria de Imagens',

  // Módulos Intermediários
  team_management: 'Gerenciamento de Equipes',
  advanced_reports: 'Relatórios Avançados',
  property_management: 'Gestão de Propriedades',
  client_management: 'Gestão de Clientes',
  kanban_management: 'Kanban',
  vistoria: 'Sistema de Vistorias',
  checklist_management: 'Gerenciamento de Checklists',
  key_control: 'Controle de Chaves',
  rental_management: 'Gestão de Aluguéis',
  calendar_management: 'Calendário',
  commission_management: 'Gestão de Comissões',
  document_management: 'Gestão de Documentos',
  match_system: 'Sistema de Match',
  asset_management: 'Gestão Patrimonial',

  // Módulos Avançados
  financial_management: 'Gestão Financeira',
  marketing_tools: 'Ferramentas de Marketing',
  api_integrations: 'Integrações via API',
  custom_fields: 'Campos Personalizados',
  workflow_automation: 'Automação de Workflows',

  // Módulos Premium
  business_intelligence: 'Business Intelligence',
  third_party_integrations: 'Integrações com Terceiros',
  white_label: 'White Label',
  priority_support: 'Suporte Prioritário',

  // Módulos Adicionais
  gamification: 'Gamificação',
  notes: 'Notas',
  appointments: 'Agendamentos',
  dashboard: 'Dashboard',
  chat: 'Chat',
  ai_assistant: 'Assistente de IA',

  // MCMV
  mcmv_management: 'Minha Casa Minha Vida (MCMV)',
  mcmv: 'Minha Casa Minha Vida (MCMV)', // Compatibilidade com API

  // Analytics do Site Público
  public_site_analytics: 'Analytics do Site Público',

  // Automações
  automations: 'Automações',

  // Distribuição de Leads (Plano Pro)
  lead_distribution: 'Distribuição de Leads',

  // Módulos de Sistema
  system_management: 'Gerenciamento do Sistema',
};
