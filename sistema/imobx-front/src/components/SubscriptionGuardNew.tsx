import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { subscriptionService } from '../services/subscriptionService';
import type { SubscriptionAccessInfo } from '../types/subscriptionTypes';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

// CORREÇÃO: Flag global para evitar múltiplas chamadas simultâneas
let isCheckingAccess = false;
let lastCheckPromise: Promise<SubscriptionAccessInfo> | null = null;

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  children,
}) => {
  const { getCurrentUser } = useAuth();
  const location = useLocation();
  const [accessInfo, setAccessInfo] = useState<SubscriptionAccessInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const user = getCurrentUser();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Master sempre passa
    if (user.role === 'master') {
      setAccessInfo({
        hasAccess: true,
        status: 'active',
        reason: null,
        canAccessFeatures: true,
        daysUntilExpiry: null,
        isExpired: false,
        isSuspended: false,
        isExpiringSoon: false,
        subscription: null,
      });
      setLoading(false);
      return;
    }

    // CORREÇÃO: Se já está verificando ou já verificou recentemente, reutilizar resultado
    if (lastCheckPromise) {
      console.log('🔄 SubscriptionGuard: Reutilizando chamada existente');
      try {
        const info = await lastCheckPromise;
        setAccessInfo(info);
      } catch (error) {
        console.error('❌ Erro ao reutilizar chamada:', error);
        // Permitir acesso em caso de erro
        setAccessInfo({
          hasAccess: true,
          status: 'active',
          reason: null,
          canAccessFeatures: true,
          daysUntilExpiry: null,
          isExpired: false,
          isSuspended: false,
          isExpiringSoon: false,
          subscription: null,
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Nova verificação
    if (isCheckingAccess) {
      console.log('⏳ SubscriptionGuard: Já está verificando, aguardando...');
      return;
    }

    isCheckingAccess = true;

    try {
      console.log('🔍 SubscriptionGuard: Iniciando verificação de acesso...');
      lastCheckPromise = subscriptionService.checkSubscriptionAccess();
      const info = await lastCheckPromise;
      console.log('✅ SubscriptionGuard: API retornou:', info);
      setAccessInfo(info);
    } catch (error) {
      console.error('❌ Erro ao verificar assinatura:', error);
      // CORREÇÃO: Em caso de erro na API, NÃO redirecionar automaticamente
      // Permite que o usuário continue usando o sistema
      setAccessInfo({
        hasAccess: true,
        status: 'active',
        reason: null,
        canAccessFeatures: true,
        daysUntilExpiry: null,
        isExpired: false,
        isSuspended: false,
        isExpiringSoon: false,
        subscription: null,
      });
    } finally {
      setLoading(false);
      // Limpar flag após 2 segundos para permitir novas verificações
      setTimeout(() => {
        isCheckingAccess = false;
        lastCheckPromise = null;
      }, 2000);
    }
  };

  if (loading) {
    return null; // Bloquear renderização até carregar
  }

  // CORREÇÃO: Se accessInfo é null (erro na API), permitir acesso temporário
  // Apenas redirecionar se a API confirmar que NÃO tem acesso
  if (!accessInfo) {
    console.warn(
      '⚠️ SubscriptionGuard: accessInfo null após carregamento, permitindo acesso temporário'
    );
    return <>{children}</>;
  }

  // CORREÇÃO: Não processar se estamos navegando devido a erro de validação do kanban
  const isKanbanValidationNavigation =
    sessionStorage.getItem('_kanban_validation_navigation') === 'true';
  if (isKanbanValidationNavigation) {
    console.log(
      '✅ [SubscriptionGuardNew] Navegação de validação do kanban detectada, permitindo acesso'
    );
    return <>{children}</>;
  }

  // ✅ REGRA: APENAS status 'active' tem acesso normal ao sistema
  console.log('🔍 [SubscriptionGuardNew] Verificando acesso:', {
    hasAccess: accessInfo.hasAccess,
    status: accessInfo.status,
    currentPath: location.pathname,
    userRole: user?.role,
  });

  if (!accessInfo.hasAccess || accessInfo.status !== 'active') {
    const currentPath = location.pathname;

    // ✅ CORREÇÃO: Permitir acesso às páginas de planos e gerenciamento de assinatura
    const allowedPaths = [
      '/subscription-management',
      '/subscription-plans',
      '/my-subscription',
      '/verifying-access',
      '/create-first-company',
      '/commission-config',
    ];

    const isAllowedPath = allowedPaths.some(
      path => currentPath === path || currentPath.startsWith(path + '/')
    );

    console.log('🔍 [SubscriptionGuardNew] Verificando se rota é permitida:', {
      currentPath,
      isAllowedPath,
      allowedPaths,
    });

    // ✅ Se não está em uma página permitida, redirecionar
    if (!isAllowedPath) {
      console.warn(
        '🚫 [SubscriptionGuardNew] Status não-ativo - bloqueando acesso a:',
        currentPath,
        'Status:',
        accessInfo?.status
      );

      if (user?.role === 'admin' || user?.role === 'master') {
        // Redirecionar com base no status retornado pela API
        const targetRoute =
          accessInfo?.status === 'none'
            ? '/subscription-plans'
            : '/subscription-management';

        console.log(
          '🚀 [SubscriptionGuardNew] Redirecionando admin/master para:',
          targetRoute,
          'Status:',
          accessInfo?.status
        );

        return (
          <Navigate
            to={targetRoute}
            state={{ reason: accessInfo?.status || 'inactive', accessInfo }}
            replace
          />
        );
      } else {
        console.log(
          '🚀 [SubscriptionGuardNew] Redirecionando usuário comum para /system-unavailable'
        );
        return <Navigate to='/system-unavailable' replace />;
      }
    }

    // ✅ Se já está em uma página permitida, permitir acesso
    console.log('✅ [SubscriptionGuardNew] Rota permitida, permitindo acesso');
    return <>{children}</>;
  }

  console.log(
    '✅ [SubscriptionGuardNew] Status ativo, permitindo acesso normal'
  );

  // Mostrar alerta se está expirando em breve
  if (accessInfo.isExpiringSoon) {
    return (
      <>
        {/* TODO: Adicionar componente ExpiringNotification */}
        {children}
      </>
    );
  }

  return <>{children}</>;
};
