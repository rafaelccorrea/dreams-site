import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useOwner } from './useOwner';
import { subscriptionService } from '../services/subscriptionService';

export interface InitializationState {
  isLoading: boolean;
  isCheckingSubscription: boolean;
  hasActiveSubscription: boolean | null;
  error: string | null;
}

export const useInitializationFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCurrentUser } = useAuth();
  const { isOwner } = useOwner();
  const [state, setState] = useState<InitializationState>({
    isLoading: true,
    isCheckingSubscription: false,
    hasActiveSubscription: null,
    error: null,
  });

  // Refs para evitar loops
  const isInitializingRef = useRef(false);
  const hasExecutedRef = useRef(false); // Flag para executar apenas uma vez
  const processedPathsRef = useRef<Set<string>>(new Set()); // Rastrear rotas já processadas
  const isNavigatingRef = useRef(false); // Flag para evitar execuções durante navegação
  const lastNavigationTimeRef = useRef<number>(0); // Timestamp da última navegação

  const checkSubscriptionStatus = async () => {
    try {
      setState(prev => ({
        ...prev,
        isCheckingSubscription: true,
        error: null,
      }));

      const selectedCompanyId = localStorage.getItem(
        'dream_keys_selected_company_id'
      );

      // Verificar se o usuário é owner antes de chamar APIs de assinatura
      const user = getCurrentUser();
      if (!user || user.owner !== true) {
        // Usuário não é owner, não deve acessar APIs de assinatura
        console.log(
          '⚠️ [useInitializationFlow] Usuário não é owner, pulando verificação de assinatura'
        );
        setState(prev => ({
          ...prev,
          hasActiveSubscription: null,
          isLoading: false,
        }));

        // Se não tem Company ID, SEMPRE ir para criar primeira empresa
        if (!selectedCompanyId) {
          if (
            location.pathname !== '/verifying-access' &&
            location.pathname !== '/create-first-company'
          ) {
            console.log(
              '✅ [useInitializationFlow] Usuário não owner sem Company ID, navegando para /verifying-access'
            );
            navigate('/verifying-access', { replace: true });
          }
        } else {
          // CORREÇÃO: Não redirecionar se já está em uma rota válida (kanban, tasks, etc)
          const currentPath = location.pathname;
          const isKanbanRoute = currentPath.startsWith('/kanban');
          const isTaskDetailsRoute = currentPath.startsWith('/kanban/tasks/');

          if (!isKanbanRoute && !isTaskDetailsRoute) {
            // Tem Company ID, verificar role do usuário para redirecionar
            const user = getCurrentUser();
            const targetPath = user?.role === 'user' ? '/kanban' : '/dashboard';
            if (currentPath !== targetPath) {
              navigate(targetPath, { replace: true });
            }
          } else {
            console.log(
              '✅ [useInitializationFlow] Já está em rota válida do kanban, não redirecionando:',
              currentPath
            );
          }
        }
        return;
      }

      // Primeiro, usar /subscriptions/my-usage para validar assinatura
      try {
        const usage = await subscriptionService.getMySubscriptionUsage();
        if (usage) {
          setState(prev => ({ ...prev, hasActiveSubscription: true }));

          // Só navegar se não estiver já na rota correta
          if (
            !selectedCompanyId &&
            location.pathname !== '/verifying-access' &&
            location.pathname !== '/create-first-company'
          ) {
            navigate('/verifying-access', { replace: true });
          } else if (selectedCompanyId) {
            // CORREÇÃO: Não redirecionar se já está em uma rota válida (kanban, tasks, etc)
            const currentPath = location.pathname;
            const isKanbanRoute = currentPath.startsWith('/kanban');
            const isTaskDetailsRoute = currentPath.startsWith('/kanban/tasks/');

            if (!isKanbanRoute && !isTaskDetailsRoute) {
              const user = getCurrentUser();
              const targetPath =
                user?.role === 'user' ? '/kanban' : '/dashboard';
              if (currentPath !== targetPath) {
                navigate(targetPath, { replace: true });
              }
            } else {
              console.log(
                '✅ [useInitializationFlow] Já está em rota válida do kanban, não redirecionando:',
                currentPath
              );
            }
          }
          return;
        }
      } catch (usageError: any) {
        const usageStatus = usageError?.response?.status;
        const usageMessage = (
          usageError?.response?.data?.message ?? ''
        ).toLowerCase();

        if (usageStatus === 404) {
          if (usageMessage.includes('empresa')) {
            setState(prev => ({ ...prev, hasActiveSubscription: true }));
            if (
              location.pathname !== '/verifying-access' &&
              location.pathname !== '/create-first-company'
            ) {
              navigate('/verifying-access', { replace: true });
            }
            return;
          }

          if (
            usageMessage.includes('assinatura') ||
            usageMessage.includes('subscription')
          ) {
            setState(prev => ({ ...prev, hasActiveSubscription: false }));
            if (location.pathname !== '/subscription-plans') {
              navigate('/subscription-plans', { replace: true });
            }
            return;
          }
        }

        if (usageStatus === 401) {
          setState(prev => ({ ...prev, hasActiveSubscription: null }));
          if (location.pathname !== '/subscription-management') {
            navigate('/subscription-management', { replace: true });
          }
          return;
        }
      }

      // Fallback: usar /subscriptions/check-access para estados especiais
      console.log(
        '📡 [useInitializationFlow] Chamando subscriptionService.checkSubscriptionAccess()...'
      );
      const accessInfo = await subscriptionService.checkSubscriptionAccess();

      console.log(
        '📋 [useInitializationFlow] RESPOSTA COMPLETA da API check-access:',
        JSON.stringify(
          {
            hasAccess: accessInfo.hasAccess,
            status: accessInfo.status,
            reason: accessInfo.reason,
            canAccessFeatures: accessInfo.canAccessFeatures,
            isExpired: accessInfo.isExpired,
            isSuspended: accessInfo.isSuspended,
            subscription: accessInfo.subscription ? 'existe' : 'null',
            daysUntilExpiry: accessInfo.daysUntilExpiry,
          },
          null,
          2
        )
      );

      console.log('🔍 [useInitializationFlow] Verificando selectedCompanyId:', {
        selectedCompanyId,
        exists: !!selectedCompanyId,
      });

      // CORREÇÃO CRÍTICA: SEMPRE verificar hasAccess PRIMEIRO antes de qualquer outra coisa
      if (!accessInfo.hasAccess) {
        // Não tem acesso - verificar o motivo
        const status = accessInfo.status as string;

        console.log('❌ [useInitializationFlow] SEM ACESSO - Detalhes:', {
          hasAccess: accessInfo.hasAccess,
          status,
          statusType: typeof status,
          reason: accessInfo.reason,
          reasonType: typeof accessInfo.reason,
          statusEqualsNone: status === 'none',
          statusEqualsNoneStrict: status === 'none' ? 'SIM' : 'NÃO',
        });

        setState(prev => ({ ...prev, hasActiveSubscription: false }));

        // Se status é "none" (sem assinatura), SEMPRE ir para planos, independente de ter empresa
        if (status === 'none') {
          console.log(
            '❌ [useInitializationFlow] Status "none" confirmado - Redirecionando para /subscription-plans'
          );
          if (location.pathname !== '/subscription-plans') {
            navigate('/subscription-plans', { replace: true });
          }
          return;
        }

        // Para outros status (expired, suspended, etc), ir para gestão de assinatura
        console.log(
          '⚠️ [useInitializationFlow] Assinatura com problema (status:',
          status,
          ') - Redirecionando para /subscription-management'
        );
        if (location.pathname !== '/subscription-management') {
          navigate('/subscription-management', { replace: true });
        }
        return;
      }

      // Se chegou aqui, tem acesso (hasAccess === true)
      console.log(
        '✅ [useInitializationFlow] TEM ACESSO (hasAccess === true) - Verificando empresas...'
      );

      // Agora sim verificar empresas
      setState(prev => ({ ...prev, hasActiveSubscription: true }));

      const missingCompanyAssociation =
        !selectedCompanyId &&
        typeof accessInfo.reason === 'string' &&
        accessInfo.reason.toLowerCase().includes('empresa');

      console.log(
        '🔍 [useInitializationFlow] Verificando associação de empresa:',
        {
          selectedCompanyId,
          hasSelectedCompanyId: !!selectedCompanyId,
          reason: accessInfo.reason,
          missingCompanyAssociation,
        }
      );

      // Se tem assinatura mas não tem empresa, redirecionar para criar primeira empresa
      if (!selectedCompanyId || missingCompanyAssociation) {
        console.log(
          '✅ [useInitializationFlow] Tem assinatura mas SEM empresa - Redirecionando para /verifying-access'
        );
        if (
          location.pathname !== '/verifying-access' &&
          location.pathname !== '/create-first-company'
        ) {
          navigate('/verifying-access', { replace: true });
        }
      } else {
        // CORREÇÃO: Não redirecionar se já está em uma rota válida (kanban, tasks, etc)
        const currentPath = location.pathname;
        const isKanbanRoute = currentPath.startsWith('/kanban');
        const isTaskDetailsRoute = currentPath.startsWith('/kanban/tasks/');

        if (!isKanbanRoute && !isTaskDetailsRoute) {
          console.log(
            '✅ [useInitializationFlow] Tem assinatura E empresa - Redirecionando para /dashboard'
          );
          if (currentPath !== '/dashboard') {
            navigate('/dashboard', { replace: true });
          }
        } else {
          console.log(
            '✅ [useInitializationFlow] Já está em rota válida do kanban, não redirecionando:',
            currentPath
          );
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar status da assinatura:', error);
      setState(prev => ({
        ...prev,
        error: 'Erro ao verificar status da assinatura',
        hasActiveSubscription: prev.hasActiveSubscription,
      }));
      // Em caso de erro, direcionar para gerenciamento para evitar confundir usuários com assinatura ativa
      navigate('/subscription-management');
    } finally {
      setState(prev => ({
        ...prev,
        isCheckingSubscription: false,
        isLoading: false,
      }));
    }
  };

  const initializeUserFlow = async () => {
    const currentPath = location.pathname;

    // Evitar múltiplas execuções simultâneas
    if (isInitializingRef.current) {
      console.log(
        '⏭️ [useInitializationFlow] Já está inicializando, ignorando...'
      );
      return;
    }

    // Se já processou esta rota, não executar novamente
    if (processedPathsRef.current.has(currentPath)) {
      console.log(
        '⏭️ [useInitializationFlow] Rota já processada:',
        currentPath
      );
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    isInitializingRef.current = true;
    processedPathsRef.current.add(currentPath);

    const user = getCurrentUser();

    if (!user) {
      setState(prev => ({ ...prev, isLoading: false }));
      isInitializingRef.current = false;
      return;
    }

    // CORREÇÃO: Não executar se já estamos em uma rota de assinatura (já foi redirecionado pelo useAuth)
    const subscriptionRoutes = [
      '/subscription-plans',
      '/subscription-management',
      '/my-subscription',
      '/verifying-access',
      '/create-first-company',
      '/system-unavailable',
      '/commission-config',
    ];

    // CORREÇÃO: Rotas públicas que não devem ser redirecionadas
    const publicRoutes = [
      '/',
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
    ];
    const isPublicRoute =
      publicRoutes.includes(location.pathname) ||
      location.pathname.startsWith('/public/') ||
      location.pathname.startsWith('/forgot-password') ||
      location.pathname.startsWith('/reset-password');

    const isOnSubscriptionRoute = subscriptionRoutes.some(
      route =>
        location.pathname === route || location.pathname.startsWith(route + '/')
    );

    if (isOnSubscriptionRoute) {
      console.log(
        '✅ [useInitializationFlow] Já está em rota de assinatura:',
        location.pathname,
        '- Não executando verificação'
      );
      setState(prev => ({ ...prev, isLoading: false }));
      isInitializingRef.current = false;
      return;
    }

    // CORREÇÃO: Não redirecionar se estiver em rota pública (como landing page)
    if (isPublicRoute) {
      console.log(
        '✅ [useInitializationFlow] Rota pública detectada, não redirecionando:',
        location.pathname
      );
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // CORREÇÃO: Não chamar API de companies aqui - isso já é feito no useAuth
    // Apenas verificar se já tem Company ID definido
    const selectedCompanyId = localStorage.getItem(
      'dream_keys_selected_company_id'
    );

    console.log('🔍 [useInitializationFlow] Verificando estado:', {
      selectedCompanyId,
      hasCompanyId: !!selectedCompanyId,
      currentPath: location.pathname,
      userRole: user.role,
      isOwner,
    });

    if (selectedCompanyId) {
      setState(prev => ({ ...prev, isLoading: false }));

      const redirectablePaths = ['/login', '/register'];
      if (redirectablePaths.includes(location.pathname)) {
        const user = getCurrentUser();
        const targetPath = user?.role === 'user' ? '/kanban' : '/dashboard';
        console.log(
          `✅ [useInitializationFlow] Company ID encontrado, redirecionando para ${targetPath}`
        );
        navigate(targetPath, { replace: true });
      }
      isInitializingRef.current = false;
      return;
    }

    // Se não tem Company ID, verificar se é usuário master/admin sem empresas
    // CORREÇÃO: Só verificar assinatura se NÃO estiver em rota de assinatura E for owner
    if (
      (user.role === 'admin' || user.role === 'master' || isOwner) &&
      !isOnSubscriptionRoute &&
      isOwner
    ) {
      console.log(
        '⚠️ [useInitializationFlow] Usuário master/admin/owner sem Company ID, verificando assinatura...'
      );
      await checkSubscriptionStatus();
    } else {
      // Usuário não é owner ou já está em rota de assinatura
      // Se não tem Company ID e não é owner, ir para criar primeira empresa
      if (!selectedCompanyId && !isOwner) {
        console.log(
          '⚠️ [useInitializationFlow] Usuário não owner sem Company ID, navegando para /verifying-access'
        );
        setState(prev => ({ ...prev, isLoading: false }));
        processedPathsRef.current.add('/verifying-access');
        processedPathsRef.current.add('/create-first-company');
        processedPathsRef.current.add(currentPath);
        if (
          location.pathname !== '/verifying-access' &&
          location.pathname !== '/create-first-company'
        ) {
          navigate('/verifying-access', { replace: true });
        }
      } else {
        // CORREÇÃO: Não redirecionar se estamos navegando devido a erro de validação do kanban
        const isKanbanValidationNavigation =
          sessionStorage.getItem('_kanban_validation_navigation') === 'true';
        if (isKanbanValidationNavigation) {
          console.log(
            '✅ [useInitializationFlow] Navegação de validação do kanban detectada, não redirecionando'
          );
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        // Tem Company ID ou é owner, verificar role para redirecionar
        const currentPath = location.pathname;
        const isKanbanRoute = currentPath.startsWith('/kanban');

        if (!isKanbanRoute && !isOnSubscriptionRoute) {
          const user = getCurrentUser();
          const targetPath = user?.role === 'user' ? '/kanban' : '/dashboard';
          console.log(
            `⚠️ [useInitializationFlow] Usuário comum sem Company ID ou já em rota de assinatura, indo para ${targetPath}`
          );
          setState(prev => ({ ...prev, isLoading: false }));
          if (currentPath !== targetPath) {
            navigate(targetPath, { replace: true });
          }
        } else {
          console.log(
            '✅ [useInitializationFlow] Já está em rota válida do kanban, não redirecionando:',
            currentPath
          );
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }
    }

    isInitializingRef.current = false;
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const selectedCompanyId = localStorage.getItem(
      'dream_keys_selected_company_id'
    );

    // CORREÇÃO: Se está navegando, aguardar um pouco antes de executar novamente
    const now = Date.now();
    if (isNavigatingRef.current && now - lastNavigationTimeRef.current < 2000) {
      console.log(
        '⏭️ [useInitializationFlow] Navegação em andamento, aguardando...'
      );
      return;
    }

    // CORREÇÃO: Não executar se estamos navegando devido a erro de validação do kanban
    const isKanbanValidationNavigation =
      sessionStorage.getItem('_kanban_validation_navigation') === 'true';
    const validationTarget = sessionStorage.getItem(
      '_kanban_validation_target'
    );
    const isOnValidationTarget =
      validationTarget &&
      currentPath.includes(validationTarget.replace('/sistema', ''));

    if (isKanbanValidationNavigation || isOnValidationTarget) {
      console.log(
        '✅ [useInitializationFlow] Navegação de validação do kanban detectada, não executando inicialização',
        {
          isKanbanValidationNavigation,
          isOnValidationTarget,
          currentPath,
          validationTarget,
        }
      );
      setState(prev => ({ ...prev, isLoading: false }));
      // Marcar rota como processada para evitar execuções futuras
      processedPathsRef.current.add(currentPath);
      return;
    }

    // CORREÇÃO: Debounce - evitar execuções muito frequentes (máximo 1 vez por segundo)
    const lastExecutionTime = (window as any).__lastInitFlowExecution || 0;
    if (now - lastExecutionTime < 1000) {
      console.log(
        '⏭️ [useInitializationFlow] Execução muito recente, aguardando debounce...'
      );
      return;
    }
    (window as any).__lastInitFlowExecution = now;

    // CORREÇÃO CRÍTICA: Se já está em /verifying-access ou /create-first-company, não executar NADA
    if (
      currentPath === '/verifying-access' ||
      currentPath === '/create-first-company'
    ) {
      console.log(
        '✅ [useInitializationFlow] Já está em',
        currentPath,
        ', não executando nada'
      );
      setState(prev => ({ ...prev, isLoading: false }));
      processedPathsRef.current.add(currentPath);
      isNavigatingRef.current = false;
      return;
    }

    // CORREÇÃO: Rotas públicas que não precisam de inicialização
    const publicRoutes = [
      '/',
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/verify-email',
      '/confirm-email',
    ];

    const excludedPaths = [
      '/commission-config',
      ...publicRoutes,
      '/system-unavailable',
      '/subscription-plans',
      '/subscription-management',
      '/my-subscription',
      '/verifying-access',
      '/create-first-company',
      '/kanban',
    ];

    // Verificar se é rota pública (incluindo rotas que começam com /public/)
    const isPublicRoute =
      publicRoutes.includes(currentPath) ||
      currentPath.startsWith('/public/') ||
      currentPath.startsWith('/forgot-password') ||
      currentPath.startsWith('/reset-password') ||
      currentPath.startsWith('/verify-email') ||
      currentPath.startsWith('/confirm-email');

    const isExcludedPath = excludedPaths.some(
      path => currentPath === path || currentPath.startsWith(path + '/')
    );

    const needsInitialization = !isExcludedPath && !isPublicRoute;

    console.log('🔍 [useInitializationFlow] useEffect executado:', {
      currentPath,
      needsInitialization,
      isPublicRoute,
      isExcludedPath,
      isOwner,
      hasCompanyId: !!selectedCompanyId,
      isInitializing: isInitializingRef.current,
      isNavigating: isNavigatingRef.current,
      alreadyProcessed: processedPathsRef.current.has(currentPath),
    });

    // CORREÇÃO: Não executar inicialização em rotas públicas
    if (isPublicRoute) {
      console.log(
        '✅ [useInitializationFlow] Rota pública, não executando inicialização'
      );
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // CORREÇÃO CRÍTICA: Se está em /dashboard sem Company ID e não é owner,
    // SEMPRE navegar para /verifying-access
    if (currentPath === '/dashboard' && !selectedCompanyId && !isOwner) {
      if (
        processedPathsRef.current.has('/verifying-access') &&
        now - lastNavigationTimeRef.current < 3000
      ) {
        console.log(
          '⏭️ [useInitializationFlow] Já navegou recentemente, aguardando...'
        );
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      console.log(
        '✅ [useInitializationFlow] Dashboard sem Company ID e não owner - navegando para /verifying-access'
      );
      setState(prev => ({ ...prev, isLoading: false }));
      processedPathsRef.current.add(currentPath);
      processedPathsRef.current.add('/verifying-access');
      isNavigatingRef.current = true;
      lastNavigationTimeRef.current = now;
      navigate('/verifying-access', { replace: true });
      // Resetar flag após um delay maior para evitar loops
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 3000);
      return;
    }

    // CORREÇÃO: Se já está em uma rota de destino, não executar novamente
    if (isExcludedPath) {
      console.log(
        '✅ [useInitializationFlow] Rota de destino, não executando inicialização:',
        currentPath
      );
      setState(prev => ({ ...prev, isLoading: false }));
      // Marcar como processada para evitar loops
      processedPathsRef.current.add(currentPath);
      return;
    }

    // CORREÇÃO: Se já processou esta rota, não executar novamente
    if (processedPathsRef.current.has(currentPath)) {
      console.log(
        '✅ [useInitializationFlow] Rota já processada, não executando novamente:',
        currentPath
      );
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Executar apenas se precisa de inicialização
    if (needsInitialization) {
      initializeUserFlow();
    } else {
      console.log(
        '✅ [useInitializationFlow] Rota excluída da inicialização:',
        currentPath
      );
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [location.pathname, isOwner]); // Removido navigate das dependências para evitar loops

  return {
    ...state,
    checkSubscriptionStatus,
  };
};
