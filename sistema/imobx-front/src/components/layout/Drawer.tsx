import React, {
  memo,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { useSubscriptionStatus } from '../../hooks/useSubscriptionStatus';
import { useCompany } from '../../hooks/useCompany';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { useNavigate } from 'react-router-dom';
import { useModuleAccess } from '../../hooks/useModuleAccess';
import { useModules } from '../../hooks/useModules';
import { MODULE_TYPES } from '../../services/modulesService';
import { Tooltip } from '../ui/Tooltip';
import { useNotificationCounts } from '../../hooks/useNotificationCounts';
import { useChatUnreadCount } from '../../hooks/useChatUnreadCount';
import { useWhatsAppUnreadCount } from '../../hooks/useWhatsAppUnreadCount';
import { useChat } from '../../hooks/useChat';
import { useIsOwner } from '../../hooks/useOwner';
import {
  DrawerContainer,
  DrawerHeader,
  DrawerLogo,
  ToggleButton,
  NavigationList,
  NavigationItem,
  NavigationLink,
  NavigationIcon,
  NavigationText,
  NavigationGroupHeader,
  DrawerFooter,
  NotificationBadge,
} from '../../styles/components/DrawerStyles';
import {
  MdSettings,
  MdChevronLeft,
  MdChevronRight,
  MdViewKanban,
  MdFilterList,
  MdGroup,
  MdBusiness,
  MdExpandMore,
  MdExpandLess,
  MdPayment,
  MdNote,
  MdAssignment,
  MdCalendarToday,
  MdHome,
  // MdWork, // Temporariamente não usado (Locações oculto)
  MdPeople,
  MdVpnKey,
  MdAttachMoney,
  MdEmojiEvents,
  MdAccountBox,
  MdContacts,
  MdCardGiftcard,
  MdFolder,
  MdSupervisorAccount,
  MdEmojiFlags,
  MdBarChart,
  MdInsertChart,
  MdCheckCircle,
  MdFlag,
  MdCalculate,
  MdHistory,
  MdFindInPage,
  MdPhotoLibrary,
  MdInventory,
  MdHouse,
  MdBlock,
  MdDescription,
  MdPlaylistAddCheck,
  MdChat,
  MdAutoAwesome,
  MdExtension,
  MdCampaign,
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

interface NavigationItem {
  id: string;
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  path?: string;
  isActive?: boolean;
  permission?: string;
  roleRequired?: string[]; // Roles necessários para acessar este item
  requiredModule?: string; // Módulo necessário para acessar este item
  children?: NavigationItem[];
  isExpanded?: boolean;
  customPermission?: (
    hasPermission: (permission: string) => boolean
  ) => boolean; // Permissão customizada
  notificationRoute?: string; // Rota para contar notificações (pode ser diferente do path)
  adminOnly?: boolean; // Apenas para administradores
  adminOwnerOnly?: boolean; // Apenas para administradores que são owners
  /** Agrupamento visual no drawer (não afeta permissões) */
  menuGroup?: string;
}

interface DrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPath?: string;
}

const getNavigationItems = (userRole: string): NavigationItem[] => {
  const items: NavigationItem[] = [
    // ========== VISÃO GERAL ==========
    {
      id: 'dashboard',
      icon: MdBarChart,
      title: 'Dashboard',
      menuGroup: 'Visão Geral',
      children: [
        {
          id: 'dashboard-main',
          icon: MdBarChart,
          title: 'Dashboard',
          path: '/dashboard',
          // SEM permission - todos podem acessar dashboard
        },
        {
          id: 'advanced-analytics',
          icon: MdInsertChart,
          title: 'Análise Avançada',
          path: '/dashboard/advanced-analytics',
          permission: 'performance:view_company',
        },
      ],
    },

    // ========== OPERACIONAL ==========
    {
      id: 'calendario',
      icon: MdCalendarToday,
      title: 'Calendário',
      path: '/calendar',
      permission: 'calendar:view',
      requiredModule: MODULE_TYPES.CALENDAR_MANAGEMENT,
      menuGroup: 'Operacional',
    },
    {
      id: 'teams',
      icon: MdPeople,
      title: 'Equipes',
      path: '/teams',
      permission: 'team:view',
      menuGroup: 'Operacional',
    },
    {
      id: 'checklists',
      icon: MdPlaylistAddCheck,
      title: 'Checklists',
      path: '/checklists',
      permission: 'property:view',
      requiredModule: MODULE_TYPES.CHECKLIST_MANAGEMENT,
      menuGroup: 'Operacional',
    },
    {
      id: 'assets',
      icon: MdInventory,
      title: 'Patrimônio',
      path: '/assets',
      permission: 'asset:view',
      requiredModule: MODULE_TYPES.ASSET_MANAGEMENT,
      menuGroup: 'Operacional',
    },
    {
      id: 'notas',
      icon: MdNote,
      title: 'Anotações',
      path: '/notes',
      permission: 'note:view',
      requiredModule: MODULE_TYPES.NOTES,
      menuGroup: 'Operacional',
    },

    // ========== IMÓVEIS ==========
    {
      id: 'imoveis',
      icon: MdBusiness,
      title: 'Imóveis',
      notificationRoute: '/properties',
      menuGroup: 'Imóveis',
      children: [
        {
          id: 'properties',
          icon: MdHome,
          title: 'Propriedades',
          path: '/properties',
          permission: 'property:view',
          requiredModule: MODULE_TYPES.PROPERTY_MANAGEMENT,
          notificationRoute: '/properties',
        },
        {
          id: 'gallery',
          icon: MdPhotoLibrary as any,
          title: 'Galeria',
          path: '/gallery',
          permission: 'property:view',
          requiredModule: MODULE_TYPES.IMAGE_GALLERY,
        },
        {
          id: 'vistoria',
          icon: MdAssignment,
          title: 'Vistorias',
          path: '/inspection',
          permission: 'inspection:view',
          requiredModule: MODULE_TYPES.VISTORIA,
          notificationRoute: '/inspections',
        },
        {
          id: 'keys',
          icon: MdVpnKey,
          title: 'Chaves',
          path: '/keys',
          permission: 'key:view',
          requiredModule: MODULE_TYPES.KEY_CONTROL,
          notificationRoute: '/keys',
        },
      ],
    },

    // ========== PESSOAS ==========
    {
      id: 'pessoas',
      icon: MdGroup,
      title: 'Pessoas',
      notificationRoute: '/clients',
      menuGroup: 'Pessoas',
      children: [
        {
          id: 'clients',
          icon: MdContacts,
          title: 'Clientes',
          path: '/clients',
          permission: 'client:view',
          requiredModule: MODULE_TYPES.CLIENT_MANAGEMENT,
          notificationRoute: '/clients',
        },
        {
          id: 'users',
          icon: MdAccountBox,
          title: 'Usuários',
          path: '/users',
          permission: 'user:view',
        },
        {
          id: 'hierarchy',
          icon: MdSupervisorAccount,
          title: 'Hierarquia',
          path: '/hierarchy',
          roleRequired: ['admin', 'master'],
        },
      ],
    },

    // ========== RELACIONAMENTOS ==========
    {
      id: 'matches',
      icon: MdCheckCircle,
      title: 'Matches',
      path: '/matches',
      permission: 'client:view',
      requiredModule: 'match_system',
      notificationRoute: '/matches',
      menuGroup: 'Relacionamentos',
    },

    // ========== DOCUMENTOS ==========
    {
      id: 'documents',
      icon: MdFolder,
      title: 'Documentos',
      path: '/documents',
      permission: 'document:read',
      requiredModule: 'document_management',
      menuGroup: 'Documentos',
    },

    // ========== PROGRAMAS ==========
    {
      id: 'mcmv',
      icon: MdHouse,
      title: 'MCMV',
      permission: 'mcmv:view',
      requiredModule: MODULE_TYPES.MCMV_MANAGEMENT,
      menuGroup: 'Programas',
      children: [
        {
          id: 'mcmv-leads',
          icon: MdContacts,
          title: 'Leads',
          path: '/mcmv/leads',
          permission: 'mcmv:lead:view',
          requiredModule: MODULE_TYPES.MCMV_MANAGEMENT,
        },
        {
          id: 'mcmv-blacklist',
          icon: MdBlock,
          title: 'Blacklist',
          path: '/mcmv/blacklist',
          permission: 'mcmv:blacklist:view',
          requiredModule: MODULE_TYPES.MCMV_MANAGEMENT,
        },
        {
          id: 'mcmv-templates',
          icon: MdDescription,
          title: 'Templates',
          path: '/mcmv/templates',
          permission: 'mcmv:template:view',
          requiredModule: MODULE_TYPES.MCMV_MANAGEMENT,
        },
      ],
    },

    // ========== COMUNICAÇÃO ==========
    {
      id: 'chat',
      icon: MdChat,
      title: 'Chat',
      path: '/chat',
      requiredModule: MODULE_TYPES.CHAT,
      menuGroup: 'Comunicação',
    },
    {
      id: 'whatsapp',
      icon: FaWhatsapp,
      title: 'WhatsApp',
      path: '/whatsapp',
      notificationRoute: '/whatsapp',
      permission: 'whatsapp:view',
      requiredModule: MODULE_TYPES.API_INTEGRATIONS,
      menuGroup: 'Comunicação',
    },

    // ========== INTEGRAÇÃO ==========
    {
      id: 'automations',
      icon: MdAutoAwesome,
      title: 'Automações',
      path: '/automations',
      requiredModule: MODULE_TYPES.AUTOMATIONS,
      roleRequired: ['admin', 'master'],
      menuGroup: 'Integração',
    },
    {
      id: 'integrations',
      icon: MdExtension,
      title: 'Integrações',
      permission: 'whatsapp:view',
      requiredModule: MODULE_TYPES.API_INTEGRATIONS,
      menuGroup: 'Integração',
      children: [
        {
          id: 'integrations-config',
          icon: MdSettings,
          title: 'Configurações',
          path: '/integrations',
          menuGroup: 'Integração',
        },
        {
          id: 'meta-campaigns',
          icon: MdCampaign,
          title: 'Campanhas META',
          path: '/integrations/meta-campaign/campaigns',
          permission: 'meta_campaign:view',
          menuGroup: 'Integração',
        },
        {
          id: 'meta-leads',
          icon: MdPeople,
          title: 'Leads da Meta',
          path: '/integrations/meta-campaign/leads',
          permission: 'meta_campaign:view',
          menuGroup: 'Integração',
        },
        {
          id: 'grupo-zap',
          icon: MdHouse,
          title: 'Portal Grupo ZAP',
          path: '/integrations/grupo-zap/config',
          permission: 'grupo_zap:view',
          menuGroup: 'Integração',
        },
        {
          id: 'lead-distribution',
          icon: MdPeople,
          title: 'Distribuição de Leads',
          path: '/integrations/lead-distribution/config',
          permission: 'lead_distribution:view',
          requiredModule: MODULE_TYPES.LEAD_DISTRIBUTION,
          menuGroup: 'Integração',
        },
        {
          id: 'lead-distribution-analysis',
          icon: MdBarChart,
          title: 'Análise de leads',
          path: '/integrations/lead-distribution/analysis',
          permission: 'lead_distribution:view',
          requiredModule: MODULE_TYPES.LEAD_DISTRIBUTION,
          menuGroup: 'Integração',
        },
      ],
    },

    // ========== ANÁLISES ==========
    {
      id: 'performance',
      icon: MdInsertChart,
      title: 'Performance',
      menuGroup: 'Análises',
      children: [
        {
          id: 'compare-users',
          icon: MdPeople,
          title: 'Comparar Corretores',
          path: '/comparar-corretores',
          permission: 'performance:compare',
        },
        {
          id: 'compare-teams',
          icon: MdGroup,
          title: 'Comparar Equipes',
          path: '/comparar-equipes',
          permission: 'performance:compare',
        },
      ],
    },
    {
      id: 'public-site-analytics',
      icon: MdBarChart,
      title: 'Analytics do Site Público',
      path: '/analytics/public-site',
      permission: 'public_analytics:view',
      requiredModule: MODULE_TYPES.PUBLIC_SITE_ANALYTICS,
      menuGroup: 'Análises',
    },

    // ========== FINANCEIRO ==========
    {
      id: 'financeiro',
      icon: MdAttachMoney,
      title: 'Financeiro',
      menuGroup: 'Financeiro',
      children: [
        {
          id: 'financial',
          icon: MdAttachMoney,
          title: 'Financeiro',
          path: '/financial',
          permission: 'financial:view',
          requiredModule: MODULE_TYPES.FINANCIAL_MANAGEMENT,
          notificationRoute: '/financial',
        },
        {
          id: 'commissions',
          icon: MdCalculate,
          title: 'Calculadora de Comissões',
          path: '/commissions',
          permission: 'financial:view',
          requiredModule: MODULE_TYPES.COMMISSION_MANAGEMENT,
        },
        {
          id: 'commission-config',
          icon: MdSettings,
          title: 'Configurar Comissões',
          path: '/commission-config',
          adminOwnerOnly: true,
        },
      ],
    },

    // ========== GAMIFICAÇÃO ==========
    {
      id: 'gamificacao',
      icon: MdEmojiEvents,
      title: 'Gamificação',
      requiredModule: MODULE_TYPES.GAMIFICATION,
      menuGroup: 'Gamificação',
      children: [
        {
          id: 'gamificacao-dashboard',
          icon: MdInsertChart,
          title: 'Dashboard',
          path: '/gamification',
          // Não há gamification:view, usar reward:view
          permission: 'reward:view',
        },
        {
          id: 'gamificacao-competitions',
          icon: MdEmojiFlags,
          title: 'Competições',
          path: '/competitions',
          // Não há competition:view, usar reward:view como base
          permission: 'reward:view',
        },
        {
          id: 'gamificacao-premios',
          icon: MdCardGiftcard,
          title: 'Prêmios',
          children: [
            {
              id: 'rewards-catalog',
              icon: MdCardGiftcard,
              title: 'Catálogo de Resgates',
              path: '/rewards',
              permission: 'reward:redeem',
            },
            {
              id: 'rewards-my-redemptions',
              icon: MdHistory,
              title: 'Meus Resgates',
              path: '/rewards/my-redemptions',
              permission: 'reward:redeem',
            },
            {
              id: 'rewards-approve',
              icon: MdCheckCircle,
              title: 'Aprovar Resgates',
              path: '/rewards/approve',
              permission: 'reward:approve',
            },
            {
              id: 'rewards-manage',
              icon: MdSettings,
              title: 'Configurar Resgates',
              path: '/rewards/manage',
              permission: 'reward:view',
            },
            {
              id: 'competition-prizes',
              icon: MdEmojiEvents,
              title: 'Prêmios de Competições',
              path: '/prizes',
              // Não há prize:view, usar reward:view
              permission: 'reward:view',
            },
          ],
        },
      ],
    },

    // ========== VENDAS ==========
    {
      id: 'crm',
      icon: MdFilterList,
      title: 'Funil de Vendas',
      path: '/kanban',
      permission: 'kanban:view',
      requiredModule: MODULE_TYPES.KANBAN_MANAGEMENT,
      menuGroup: 'Vendas',
    },
    {
      id: 'goals',
      icon: MdFlag,
      title: 'Metas',
      path: '/goals',
      adminOnly: true,
      menuGroup: 'Vendas',
    },

    // ========== ADMINISTRATIVO ==========
    {
      id: 'audit',
      icon: MdFindInPage,
      title: 'Auditoria',
      path: '/audit',
      roleRequired: ['master'],
      menuGroup: 'Administrativo',
    },
  ];

  // Adicionar gerenciamento de assinaturas sempre visível para admin e master (após Auditoria)
  if (userRole === 'admin' || userRole === 'master') {
    items.push({
      id: 'subscription-management-menu',
      icon: MdPayment,
      title: 'Assinaturas',
      path: '/subscription-management',
      menuGroup: 'Administrativo',
    } as NavigationItem);
  }

  // Configurações sempre por último
  items.push({
    id: 'settings',
    icon: MdSettings,
    title: 'Configurações',
    path: '/settings',
    menuGroup: 'Sistema',
  } as NavigationItem);

  // console.log('🎯 getNavigationItems: Array de itens criado:', items);
  // console.log('📊 getNavigationItems: Quantidade de itens:', items.length);

  return items;
};

export const Drawer: React.FC<DrawerProps> = memo(
  ({ isOpen, onToggle, currentPath = '/' }) => {
    const navigate = useNavigate();
    const { getCurrentUser } = useAuth();
    const { selectedCompany, companies } = useCompany();
    const {
      loading: subscriptionLoading,
      isActive,
      hasAccess,
    } = useSubscriptionStatus({ autoRefresh: false });
    const { subscriptionStatus } = useSubscription();

    // CORREÇÃO: Usar também o accessInfo do useSubscriptionStatus para verificar assinatura quando não há empresa
    const hasActiveSubscription =
      subscriptionStatus?.hasActiveSubscription || isActive || hasAccess;

    // Usar hook opcional para evitar erros se o contexto não estiver disponível
    const permissionsContext = usePermissionsContextOptional();
    const userPermissions = permissionsContext?.userPermissions || null;

    // Memoizar hasPermission para evitar recriação a cada render
    const hasPermission = useMemo(
      () => permissionsContext?.hasPermission || (() => false),
      [permissionsContext?.hasPermission]
    );

    const { hasRoleAccess } = useRoleAccess();
    const moduleAccess = useModuleAccess();
    const { loading: modulesLoading } = useModules();
    const { getCountForRoute } = useNotificationCounts();
    const chatUnreadCount = useChatUnreadCount();
    const whatsappUnreadCount = useWhatsAppUnreadCount();
    const { rooms, messages } = useChat();
    const isOwner = useIsOwner();

    // Debug: log do contador de chat
    useEffect(() => {
      if (chatUnreadCount > 0) {
        console.log('🔔 [Drawer] Badge de chat não lidas:', chatUnreadCount, {
          roomsCount: rooms.length,
          messagesByRoom: Object.keys(messages).map(roomId => ({
            roomId,
            messageCount: messages[roomId].length,
          })),
        });
      }
    }, [chatUnreadCount, rooms.length, messages]);

    // console.log('🎯 Drawer: Hooks carregados:', {
    //   hasPermission: typeof hasPermission,
    //   hasRoleAccess: typeof hasRoleAccess,
    //   moduleAccess,
    //   userPermissions
    // });

    const user = getCurrentUser();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const previousPathRef = useRef<string>(currentPath);

    // Fechar drawer automaticamente quando a rota mudar
    useEffect(() => {
      // Sempre atualizar a referência do path anterior
      if (currentPath !== previousPathRef.current) {
        // Se o drawer está aberto e a rota mudou, fechar imediatamente
        if (isOpen) {
          onToggle();
        }
        previousPathRef.current = currentPath;
      }
    }, [currentPath, isOpen, onToggle]);

    // Verificar se o drawer deve estar desabilitado
    const canCreateCompany = user?.role === 'admin' || user?.role === 'master';
    const hasCompanies = Boolean(selectedCompany) || companies.length > 0;
    const shouldRestrictNavigation = canCreateCompany && !hasCompanies;

    // Obter itens de navegação baseados no role do usuário, status da assinatura e módulos disponíveis
    const navigationItems = useMemo(() => {
      console.log('🔍 [Drawer] Calculando navigationItems:', {
        shouldRestrictNavigation,
        isOwner,
        userRole: user?.role,
        subscriptionStatus,
        hasActiveSubscription: subscriptionStatus?.hasActiveSubscription,
        hasCompanies,
      });

      if (shouldRestrictNavigation) {
        const items = [
          {
            id: 'create-first-company',
            icon: MdBusiness,
            title: 'Criar Primeira Empresa',
            path: '/create-first-company',
          },
        ];

        // CORREÇÃO: Se o usuário é owner e tem assinatura, adicionar item "Assinaturas" mesmo sem empresa
        // Usar múltiplas fontes para verificar assinatura (pode não estar carregada quando não há empresa)
        // Verificar owner tanto via hook quanto via user.owner diretamente
        const userIsOwner = isOwner || user?.owner === true;
        const canShowSubscription =
          userIsOwner &&
          hasActiveSubscription &&
          (user?.role === 'admin' || user?.role === 'master');

        console.log('🔍 [Drawer] Verificando se deve mostrar Assinaturas:', {
          isOwner,
          userOwner: user?.owner,
          userIsOwner,
          hasActiveSubscription,
          subscriptionStatusHasActive:
            subscriptionStatus?.hasActiveSubscription,
          isActive,
          hasAccess,
          userRole: user?.role,
          canShowSubscription,
          subscriptionStatus,
        });

        if (canShowSubscription) {
          console.log('✅ [Drawer] Adicionando item Assinaturas ao menu');
          items.push({
            id: 'subscription-management-menu',
            icon: MdPayment,
            title: 'Assinaturas',
            path: '/subscription-management',
          });
        } else {
          console.log('❌ [Drawer] NÃO adicionando item Assinaturas:', {
            isOwner,
            userOwner: user?.owner,
            userIsOwner,
            hasActiveSubscription,
            subscriptionStatusHasActive:
              subscriptionStatus?.hasActiveSubscription,
            isActive,
            hasAccess,
            userRole: user?.role,
          });
        }

        console.log('📋 [Drawer] Itens finais do menu:', items);
        return items;
      }

      return getNavigationItems(user?.role || 'user');
    }, [
      shouldRestrictNavigation,
      user?.role,
      user?.owner,
      isOwner,
      hasActiveSubscription,
      subscriptionStatus,
      isActive,
      hasAccess,
      hasCompanies,
    ]);

    const handleNavigation = useCallback(
      (path: string) => {
        // Fechar drawer antes de navegar (melhor UX)
        if (isOpen) {
          onToggle();
        }

        // Navegar diretamente usando React Router
        navigate(path, { replace: false });
      },
      [navigate, isOpen, onToggle]
    );

    const handleToggleExpanded = useCallback((itemId: string) => {
      setExpandedItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    }, []);

    const isItemActive = useCallback(
      (item: NavigationItem): boolean => {
        if (item.path === currentPath) return true;
        if (item.children) {
          const hasActiveChild = item.children.some(
            child => child.path === currentPath
          );
          if (hasActiveChild && !isOpen) {
            return true;
          }
          return hasActiveChild;
        }
        return false;
      },
      [currentPath, isOpen]
    );

    const hasItemPermission = useCallback(
      (
        item: NavigationItem,
        checkChildren: boolean = false,
        filteredChildren?: NavigationItem[]
      ): boolean => {
        // PRIORIDADE 1: Verificar se o módulo está disponível para a empresa
        // Esta é a verificação mais importante - se a empresa não tem o módulo, não mostrar
        if (item.requiredModule) {
          // Se não há empresa selecionada, não mostrar itens que requerem módulos
          if (!selectedCompany) {
            return false;
          }

          // Normalizar o nome do módulo para lowercase para comparação
          const normalizedModule = item.requiredModule.toLowerCase();

          // Se ainda está carregando os módulos, não mostrar itens que requerem módulos específicos
          // para evitar mostrar itens que a empresa não tem acesso
          if (modulesLoading || moduleAccess.isLoading) {
            return false;
          }

          // Verificar se o módulo está disponível para a empresa usando useModuleAccess
          let moduleAvailable =
            moduleAccess.isModuleAvailableForCompany(normalizedModule);
          // Integrações: mostrar se a empresa tiver api_integrations OU third_party_integrations OU lead_distribution
          if (item.id === 'integrations' && !moduleAvailable) {
            moduleAvailable =
              moduleAccess.isModuleAvailableForCompany(
                'third_party_integrations'
              ) ||
              moduleAccess.isModuleAvailableForCompany('lead_distribution');
          }

          // Se o módulo não está disponível, definitivamente não mostrar
          if (!moduleAvailable) {
            return false;
          }
        }

        // Verificar se requer admin que é owner
        if (item.adminOwnerOnly) {
          const isAdmin = hasRoleAccess(['admin', 'master']);
          if (!isAdmin || !isOwner) {
            return false;
          }
        }

        // Verificar adminOnly (apenas admin, não precisa ser owner)
        if (item.adminOnly) {
          if (!hasRoleAccess(['admin', 'master'])) {
            return false;
          }
        }

        // Verificar role primeiro
        if (item.roleRequired && item.roleRequired.length > 0) {
          if (!hasRoleAccess(item.roleRequired)) {
            return false;
          }
        }

        // Verificar permissão customizada se existir
        if (item.customPermission) {
          // Se ainda está carregando permissões, permitir acesso temporariamente
          // para que o item apareça no drawer (será filtrado depois se necessário)
          if (!permissionsContext || permissionsContext.isLoading) {
            // Durante carregamento, permitir acesso temporariamente
            // A verificação real será feita quando as permissões carregarem
            return true;
          }
          return (
            item.customPermission(hasPermission) ||
            hasRoleAccess(['admin', 'master'])
          );
        }

        // Se não há permissão especificada
        if (!item.permission) {
          // Se o item tem filhos, verificar se pelo menos um filho tem acesso
          if (checkChildren && item.children && item.children.length > 0) {
            if (filteredChildren && filteredChildren.length > 0) {
              // Se há filhos filtrados visíveis, o item pai pode ser mostrado
              return true;
            }
            // Se não há filhos visíveis, verificar se algum filho tem acesso
            // Isso será verificado recursivamente em filterNavigationItems
            return false;
          }
          // Se não tem filhos ou não está verificando filhos, permitir acesso
          // (para itens como Dashboard e Configurações que não precisam de permissão)
          return true;
        }

        // Se ainda está carregando permissões e não há módulo requerido, aguardar
        if (!permissionsContext || permissionsContext.isLoading) {
          // Se há módulo requerido, já foi verificado acima e retornou false se não disponível
          // Se não há módulo requerido, pode mostrar durante carregamento
          // Mas se há módulo requerido e ainda está carregando, não mostrar até confirmar
          if (item.requiredModule) {
            // Se há módulo requerido, só mostrar se já passou na verificação acima
            // (que só retorna true se o módulo está disponível)
            return false; // Durante carregamento, não mostrar itens com módulo requerido
          }
          return true; // Sem módulo requerido, pode mostrar durante carregamento
        }

        // Verificar permissão do usuário
        // Para Matches, usar client:view (não há match:view no sistema)
        if (item.id === 'matches') {
          // Matches requer client:view já que relaciona clientes e propriedades
          return (
            hasPermission('client:view') || hasRoleAccess(['admin', 'master'])
          );
        }

        // Para WhatsApp e Integrações, verificar permissão específica mesmo para admin/master
        if (item.id === 'whatsapp' || item.id === 'integrations') {
          // Para WhatsApp, verificar se tem whatsapp:view ou whatsapp:view_messages
          if (item.id === 'whatsapp') {
            return (
              hasPermission('whatsapp:view') ||
              hasPermission('whatsapp:view_messages')
            );
          }
          // Para Integrações: WhatsApp, Campanha META, Portal Grupo ZAP ou Distribuição de Leads
          if (item.id === 'integrations') {
            return (
              hasPermission('whatsapp:view') ||
              hasPermission('whatsapp:view_messages') ||
              hasPermission('whatsapp:manage_config') ||
              hasPermission('integration:view') ||
              hasPermission('meta_campaign:view') ||
              hasPermission('meta_campaign:manage_config') ||
              hasPermission('grupo_zap:view') ||
              hasPermission('grupo_zap:manage_config') ||
              hasPermission('lead_distribution:view') ||
              hasPermission('lead_distribution:manage_config')
            );
          }
        }

        // Para itens com children, verificar se pelo menos um child tem acesso
        // Se checkChildren é true e há filteredChildren, significa que já passou na verificação de children
        if (checkChildren && item.children && item.children.length > 0) {
          if (filteredChildren && filteredChildren.length > 0) {
            // Se há children visíveis, verificar se o item pai tem permissão ou é admin/master
            // Mas se não tem permission definida, permitir acesso (já que os children têm acesso)
            if (!item.permission) {
              return true;
            }
            // Se tem permission, verificar se tem a permissão ou é admin/master
            return (
              hasPermission(item.permission) ||
              hasRoleAccess(['admin', 'master'])
            );
          }
        }

        // Para outros itens, admin e master sempre têm acesso
        return (
          hasPermission(item.permission) || hasRoleAccess(['admin', 'master'])
        );
      },
      [
        modulesLoading,
        hasRoleAccess,
        permissionsContext,
        hasPermission,
        moduleAccess,
        isOwner,
        selectedCompany,
        user,
      ]
    );

    const handleItemClick = useCallback(
      (item: NavigationItem) => {
        // Se o item está visível no drawer filtrado, significa que já passou na verificação de permissão
        // Permitir navegação diretamente, especialmente para itens com customPermission que podem
        // ter verificação mais complexa durante o carregamento

        // Se tem children, expandir/colapsar ou abrir drawer
        if (item.children && item.children.length > 0) {
          if (!isOpen) {
            // Se drawer está fechado, apenas abrir
            onToggle();
          } else {
            // Se drawer está aberto, expandir/colapsar
            handleToggleExpanded(item.id);
          }
          return;
        }

        // Se tem path, navegar para a página
        if (item.path) {
          // Para chat, sempre navegar para a página (não abrir window)
          // O window só abre quando chega uma notificação de nova conversa
          handleNavigation(item.path);
          // handleNavigation já fecha o drawer, não precisa fechar novamente
          return;
        }

        // Se chegou aqui e não tem path nem children, verificar permissão antes de bloquear
        if (!hasItemPermission(item)) {
          console.warn(
            `⚠️ Acesso negado: usuário não tem permissão para acessar ${item.title}`
          );
        }
      },
      [
        hasItemPermission,
        isOpen,
        onToggle,
        handleToggleExpanded,
        handleNavigation,
      ]
    );

    const filterNavigationItems = useCallback(
      (items: NavigationItem[]): NavigationItem[] => {
        return items
          .map(item => {
            // Primeiro filtrar os filhos recursivamente
            const children =
              item.children && item.children.length > 0
                ? filterNavigationItems(item.children)
                : undefined;

            const hasVisibleChildren = children && children.length > 0;

            // Se o item tem filhos, verificar se pelo menos um filho tem acesso
            // Se não há filhos visíveis, o item pai não deve ser mostrado
            if (item.children && item.children.length > 0) {
              if (!hasVisibleChildren) {
                return null;
              }
              // Se há filhos visíveis, verificar se o item pai também tem acesso
              // (para verificar módulos, roles, etc.)
              const itemHasAccess = hasItemPermission(item, true, children);
              if (!itemHasAccess && !hasVisibleChildren) {
                return null;
              }

              // Se há exatamente 1 filho visível, retornar o filho diretamente (sem submenu)
              if (children && children.length === 1) {
                return children[0];
              }

              // Se há mais de 1 filho, manter o item pai com os filhos
              if (children) {
                return { ...item, children };
              }
            } else {
              // Se não tem filhos, verificar permissão normalmente
              const itemHasAccess = hasItemPermission(item);
              if (!itemHasAccess) {
                return null;
              }
            }

            return item;
          })
          .filter((item): item is NavigationItem => Boolean(item));
      },
      [hasItemPermission]
    );

    const filteredNavigationItems = useMemo(() => {
      if (!Array.isArray(navigationItems)) {
        return [];
      }

      if (subscriptionLoading) {
        return navigationItems;
      }

      const filtered = filterNavigationItems(navigationItems);
      const isAdminOrMaster = user?.role === 'admin' || user?.role === 'master';
      const crmIndex = filtered.findIndex(item => item.id === 'crm');
      if (crmIndex === -1) return filtered;

      const arr = [...filtered];
      const [crmItem] = arr.splice(crmIndex, 1);
      if (isAdminOrMaster) {
        arr.splice(1, 0, crmItem);
      } else {
        arr.unshift(crmItem);
      }
      return arr;
    }, [
      navigationItems,
      filterNavigationItems,
      subscriptionLoading,
      user?.role,
    ]);

    /** Agrupa itens filtrados por menuGroup (ordem preservada); não altera permissões. Não exibe grupo "Outros". */
    const groupedNavigationItems = useMemo(() => {
      const groups: { group: string; items: NavigationItem[] }[] = [];
      let currentGroup = '';
      for (const item of filteredNavigationItems) {
        const group = (item as NavigationItem).menuGroup || 'Outros';
        if (group === 'Outros') continue;
        if (group !== currentGroup) {
          currentGroup = group;
          groups.push({ group, items: [item] });
        } else {
          groups[groups.length - 1].items.push(item);
        }
      }
      return groups;
    }, [filteredNavigationItems]);

    const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
      const isExpanded = expandedItems.includes(item.id);
      const isActive = isItemActive(item);
      const hasChildren = item.children && item.children.length > 0;

      // Verificação de segurança: garantir que children seja um array
      const childrenArray = Array.isArray(item.children) ? item.children : [];
      // Durante o carregamento, mostrar todos os children; depois filtrar
      const isLoading = !userPermissions || moduleAccess.isLoading;
      const filteredChildren = isLoading
        ? childrenArray
        : childrenArray.filter(child => hasItemPermission(child));

      // Calcular contador de notificações
      const notificationRoute = item.notificationRoute || item.path;
      let notificationCount = 0;

      // Contadores especiais para chat e whatsapp
      if (item.id === 'chat') {
        notificationCount = chatUnreadCount;
      } else if (item.id === 'whatsapp') {
        notificationCount = whatsappUnreadCount;
      } else if (notificationRoute) {
        notificationCount = getCountForRoute(notificationRoute);

        // Se tem children, somar contadores dos filhos também
        if (hasChildren && filteredChildren.length > 0) {
          filteredChildren.forEach(child => {
            const childRoute = child.notificationRoute || child.path;
            if (childRoute) {
              notificationCount += getCountForRoute(childRoute);
            }
          });
        }
      }

      const navigationLinkContent = (
        <>
          <NavigationIcon $isActive={isActive} style={{ position: 'relative' }}>
            <item.icon size={20} />
            {notificationCount > 0 && !isOpen && (
              <NotificationBadge $isOpen={false} $isActive={isActive}>
                {notificationCount > 99 ? '99+' : notificationCount}
              </NotificationBadge>
            )}
          </NavigationIcon>
          <NavigationText $isOpen={isOpen}>{item.title}</NavigationText>
          {notificationCount > 0 && isOpen && (
            <NotificationBadge $isOpen={true} $isActive={isActive}>
              {notificationCount > 99 ? '99+' : notificationCount}
            </NotificationBadge>
          )}
          {hasChildren && isOpen && (
            <NavigationIcon
              $isActive={isActive}
              style={{ marginLeft: 'auto', width: '16px', height: '16px' }}
            >
              {isExpanded ? (
                <MdExpandLess size={16} />
              ) : (
                <MdExpandMore size={16} />
              )}
            </NavigationIcon>
          )}
        </>
      );

      return (
        <React.Fragment key={item.id}>
          <NavigationItem $isActive={isActive} $level={level}>
            {!isOpen ? (
              <Tooltip content={item.title} placement='right' delay={50}>
                <NavigationLink
                  $isOpen={isOpen}
                  $isActive={isActive}
                  $hasChildren={hasChildren}
                  onClick={e => {
                    e.stopPropagation();
                    handleItemClick(item);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {navigationLinkContent}
                </NavigationLink>
              </Tooltip>
            ) : (
              <NavigationLink
                $isOpen={isOpen}
                $isActive={isActive}
                $hasChildren={hasChildren}
                onClick={() => handleItemClick(item)}
              >
                {navigationLinkContent}
              </NavigationLink>
            )}
          </NavigationItem>

          {hasChildren &&
            isExpanded &&
            isOpen &&
            filteredChildren &&
            filteredChildren.length > 0 && (
              <>
                {filteredChildren.map(child =>
                  renderNavigationItem(child, level + 1)
                )}
              </>
            )}
        </React.Fragment>
      );
    };

    return (
      <DrawerContainer $isOpen={isOpen} data-fixed-drawer>
        <DrawerHeader $isOpen={isOpen}>
          <DrawerLogo $isOpen={isOpen} />
          <ToggleButton $isOpen={isOpen} onClick={onToggle}>
            {isOpen ? (
              <MdChevronLeft size={20} />
            ) : (
              <MdChevronRight size={20} />
            )}
          </ToggleButton>
        </DrawerHeader>

        <NavigationList>
          {groupedNavigationItems.map(({ group, items }) => (
            <React.Fragment key={group}>
              <NavigationGroupHeader $isOpen={isOpen}>
                {group}
              </NavigationGroupHeader>
              {items.map(item => renderNavigationItem(item))}
            </React.Fragment>
          ))}
        </NavigationList>

        <DrawerFooter $isOpen={isOpen}>
          {isOpen ? (
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--theme-text-secondary)',
                textAlign: 'center',
                lineHeight: '1.4',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                Versão 0.0.1 - Beta
              </div>
              <div style={{ fontSize: '0.7rem' }}>
                Desenvolvido por
                <br />
                <strong>Next Innovation Technologies LTDA</strong>
              </div>
            </div>
          ) : (
            <div
              style={{
                fontSize: '0.65rem',
                color: 'var(--theme-text-secondary)',
                textAlign: 'center',
                fontWeight: 600,
              }}
            >
              v0.0.1
            </div>
          )}
        </DrawerFooter>
      </DrawerContainer>
    );
  }
);
