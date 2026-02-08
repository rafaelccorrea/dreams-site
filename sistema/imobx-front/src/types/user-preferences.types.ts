/**
 * Tipos para o sistema de User Preferences
 * Permite que cada usuário tenha suas próprias configurações salvas no banco
 */

export interface ThemeSettings {
  theme: 'light' | 'dark';
  language: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface LayoutSettings {
  sidebar: 'expanded' | 'collapsed';
  grid: 'normal' | 'compact';
}

export interface GeneralSettings {
  [key: string]: any;
}

export interface UserPreferences {
  id: string;
  userId: string;
  defaultHomeScreen?: HomeScreenType;
  themeSettings?: ThemeSettings;
  notificationSettings?: NotificationSettings;
  layoutSettings?: LayoutSettings;
  generalSettings?: GeneralSettings;
  createdAt: string;
  updatedAt: string;
}

export type HomeScreenType =
  | 'dashboard'
  | 'calendar'
  | 'properties'
  | 'clients'
  | 'kanban'
  | 'inspection'
  | 'appointments'
  | 'commissions'
  | 'financial'
  | 'rental'
  | 'keys'
  | 'notes'
  | 'reports';

export interface UpdateUserPreferencesRequest {
  defaultHomeScreen?: HomeScreenType;
  themeSettings?: Partial<ThemeSettings>;
  notificationSettings?: Partial<NotificationSettings>;
  layoutSettings?: Partial<LayoutSettings>;
  generalSettings?: GeneralSettings;
}

export interface SetHomeScreenRequest {
  homeScreen: HomeScreenType;
}

export interface HomeScreenResponse {
  defaultHomeScreen: HomeScreenType;
}

export interface UserPreferencesResponse {
  message?: string;
}

// Mapeamento de telas para rotas
export const HOME_SCREEN_ROUTES: Record<HomeScreenType, string> = {
  dashboard: '/dashboard',
  calendar: '/calendar',
  properties: '/properties',
  clients: '/clients',
  kanban: '/kanban',
  inspection: '/inspection',
  appointments: '/appointments',
  commissions: '/commissions',
  financial: '/financial',
  rental: '/rentals',
  keys: '/keys',
  notes: '/notes',
  reports: '/reports',
};

// Labels para as telas (para exibição no UI)
export const HOME_SCREEN_LABELS: Record<HomeScreenType, string> = {
  dashboard: 'Dashboard',
  calendar: 'Calendário',
  properties: 'Propriedades',
  clients: 'Clientes',
  kanban: 'Funil de Vendas',
  inspection: 'Vistorias',
  appointments: 'Agendamentos',
  commissions: 'Comissões',
  financial: 'Financeiro',
  rental: 'Locações',
  keys: 'Controle de Chaves',
  notes: 'Notas',
  reports: 'Relatórios',
};
