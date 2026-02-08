import { useState, useEffect, useCallback } from 'react';
import { usePermissions } from './usePermissions';

export interface HomePageOption {
  id: string;
  title: string;
  path: string;
  icon: string;
  permission?: string;
  description: string;
}

export const HOME_PAGE_OPTIONS: HomePageOption[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'MdDashboard',
    permission: 'dashboard.view',
    description: 'Visão geral do sistema',
  },
  {
    id: 'properties',
    title: 'Propriedades',
    path: '/properties',
    icon: 'MdBusiness',
    permission: 'property:view',
    description: 'Lista de imóveis',
  },
  {
    id: 'rentals',
    title: 'Aluguéis',
    path: '/rentals',
    icon: 'MdAttachMoney',
    permission: 'rental:view',
    description: 'Gestão de aluguéis',
  },
  {
    id: 'financial',
    title: 'Financeiro',
    path: '/financial',
    icon: 'MdPayment',
    permission: 'financial:view',
    description: 'Controle financeiro',
  },
  {
    id: 'kanban',
    title: 'Kanban',
    path: '/kanban',
    icon: 'MdViewKanban',
    permission: 'kanban:view',
    description: 'Quadro de projetos',
  },
  {
    id: 'calendar',
    title: 'Calendário',
    path: '/calendar',
    icon: 'MdCalendarToday',
    permission: 'calendar.view',
    description: 'Agenda de compromissos',
  },
  {
    id: 'notes',
    title: 'Anotações',
    path: '/notes',
    icon: 'MdNote',
    permission: 'notes.view',
    description: 'Bloco de notas',
  },
  {
    id: 'clients',
    title: 'Clientes',
    path: '/clients',
    icon: 'MdContacts',
    permission: 'client:view',
    description: 'Cadastro de clientes',
  },
  {
    id: 'inspection',
    title: 'Vistorias',
    path: '/inspection',
    icon: 'MdAssignment',
    permission: 'inspection:view',
    description: 'Relatórios de vistoria',
  },
  {
    id: 'keys',
    title: 'Chaves',
    path: '/keys',
    icon: 'MdVpnKey',
    permission: 'key:view',
    description: 'Controle de chaves',
  },
  {
    id: 'users',
    title: 'Usuários',
    path: '/users',
    icon: 'MdAccountBox',
    permission: 'users.view',
    description: 'Gerenciamento de usuários',
  },
  {
    id: 'teams',
    title: 'Equipes',
    path: '/teams',
    icon: 'MdGroup',
    permission: 'teams.view',
    description: 'Gestão de equipes',
  },
  {
    id: 'gamification',
    title: 'Gamificação',
    path: '/gamification',
    icon: 'MdEmojiEvents',
    description: 'Sistema de recompensas',
  },
];

const STORAGE_KEY = 'user_home_page_preference';

export const useHomePage = () => {
  const { hasPermission } = usePermissions();
  const [homePage, setHomePageState] = useState<string>('/dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Carregar preferência salva
  useEffect(() => {
    const savedHomePage = localStorage.getItem(STORAGE_KEY);
    if (savedHomePage) {
      setHomePageState(savedHomePage);
    }
    setIsLoading(false);
  }, []);

  // Filtrar opções baseado em permissões
  const getAvailableOptions = useCallback((): HomePageOption[] => {
    return HOME_PAGE_OPTIONS.filter(option => {
      if (!option.permission) return true;
      return hasPermission(option.permission);
    });
  }, [hasPermission]);

  // Salvar preferência
  const setHomePage = useCallback(
    (path: string) => {
      // Verificar se o usuário tem permissão para a página
      const option = HOME_PAGE_OPTIONS.find(opt => opt.path === path);
      if (option?.permission && !hasPermission(option.permission)) {
        console.warn(
          'Usuário não tem permissão para definir esta página como inicial'
        );
        return false;
      }

      localStorage.setItem(STORAGE_KEY, path);
      setHomePageState(path);
      return true;
    },
    [hasPermission]
  );

  // Resetar para padrão
  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHomePageState('/dashboard');
  }, []);

  // Obter página inicial (com fallback se o usuário perdeu permissão)
  const getHomePage = useCallback((): string => {
    const option = HOME_PAGE_OPTIONS.find(opt => opt.path === homePage);

    // Se a página requer permissão e o usuário não tem, volta para dashboard
    if (option?.permission && !hasPermission(option.permission)) {
      return '/dashboard';
    }

    return homePage;
  }, [homePage, hasPermission]);

  return {
    homePage: getHomePage(),
    setHomePage,
    resetToDefault,
    getAvailableOptions,
    isLoading,
  };
};
