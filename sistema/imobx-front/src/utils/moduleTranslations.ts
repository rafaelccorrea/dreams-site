export const MODULE_TRANSLATIONS: Record<string, string> = {
  // Gestão de Pessoas
  USER_MANAGEMENT: 'Gestão de Usuários',
  TEAM_MANAGEMENT: 'Gestão de Equipes',
  CLIENT_MANAGEMENT: 'Gestão de Clientes',

  // Gestão de Imóveis
  PROPERTY_MANAGEMENT: 'Gestão de Propriedades',
  KEY_CONTROL: 'Controle de Chaves',
  RENTAL_MANAGEMENT: 'Gestão de Locações',
  VISTORIA: 'Vistoria',

  // Gestão Comercial
  KANBAN_MANAGEMENT: 'Gestão Kanban',
  FINANCIAL_MANAGEMENT: 'Gestão Financeira',
  COMMISSION_MANAGEMENT: 'Gestão de Comissões',
  MARKETING_TOOLS: 'Ferramentas de Marketing',

  // Gestão e Relatórios
  COMPANY_MANAGEMENT: 'Gestão de Empresas',
  BASIC_REPORTS: 'Relatórios Básicos',
  ADVANCED_REPORTS: 'Relatórios Avançados',
  BUSINESS_INTELLIGENCE: 'Business Intelligence',

  // Documentos e Mídias
  IMAGE_GALLERY: 'Galeria de Imagens',
  DOCUMENT_MANAGEMENT: 'Gestão de Documentos',

  // Integrações
  API_INTEGRATIONS: 'Integrações API',
  THIRD_PARTY_INTEGRATIONS: 'Integrações Terceiros',

  // Outros
  CUSTOM_FIELDS: 'Campos Personalizados',
  WORKFLOW_AUTOMATION: 'Automação de Workflow',
  WHITE_LABEL: 'White Label',
  PRIORITY_SUPPORT: 'Suporte Prioritário',
  CALENDAR_MANAGEMENT: 'Gestão de Calendário',

  // Traduções baseadas nos nomes que aparecem na tela
  'User Management': 'Gestão de Usuários',
  'Company Management': 'Gestão de Empresas',
  'Basic Reports': 'Relatórios Básicos',
  'Image Gallery': 'Galeria de Imagens',
  'Team Management': 'Gestão de Equipes',
  'Advanced Reports': 'Relatórios Avançados',
  'Property Management': 'Gestão de Propriedades',
  'Client Management': 'Gestão de Clientes',
  'Kanban Management': 'Gestão Kanban',
  'Financial Management': 'Gestão Financeira',
  'Marketing Tools': 'Ferramentas de Marketing',
  'Api Integrations': 'Integrações API',
  'Custom Fields': 'Campos Personalizados',
  'Workflow Automation': 'Automação de Workflow',
  'Business Intelligence': 'Business Intelligence',
  'Third Party Integrations': 'Integrações Terceiros',
  'White Label': 'White Label',
  'Priority Support': 'Suporte Prioritário',
  'Calendar Management': 'Gestão de Calendário',
  Vistoria: 'Vistoria',
  'Key Control': 'Controle de Chaves',
  'Rental Management': 'Gestão de Locações',
  'Commission Management': 'Gestão de Comissões',
};

export const translateModule = (moduleCode: string): string => {
  return (
    MODULE_TRANSLATIONS[moduleCode] ||
    moduleCode.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  );
};
