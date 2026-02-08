import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { useSubscriptionReady } from '../hooks/useSubscriptionReady';
import { companyApi } from '../services/companyApi';

interface CompanyRequiredGuardProps {
  children: React.ReactNode;
}

/**
 * Guard que força usuários com assinatura mas sem empresa a ficarem na tela de criação
 * Protege TODAS as rotas exceto criação de empresa
 */
const CompanyRequiredGuard: React.FC<CompanyRequiredGuardProps> = ({
  children,
}) => {
  const { getCurrentUser } = useAuth();
  const subscriptionHookResult = useSubscription();
  const { isReady } = useSubscriptionReady();
  const location = useLocation();

  const [hasCompanies, setHasCompanies] = useState<boolean | null>(null);
  const [checkingCompanies, setCheckingCompanies] = useState(false);

  // Extrair subscriptionStatus de forma segura
  let subscriptionStatus: any = null;
  try {
    if (subscriptionHookResult && typeof subscriptionHookResult === 'object') {
      subscriptionStatus = subscriptionHookResult.subscriptionStatus || null;
    }
  } catch {
    subscriptionStatus = null;
  }

  const user = getCurrentUser();

  // Extrair role de forma segura - apenas se for string
  let userRole: string | null = null;
  try {
    if (user && typeof user === 'object' && user.role) {
      if (typeof user.role === 'string') {
        userRole = user.role;
      }
    }
  } catch {
    userRole = null;
  }

  const canCreateCompany = userRole === 'admin' || userRole === 'master';

  // Extrair valor primitivo de forma segura
  let hasActiveSubscription = false;
  try {
    if (subscriptionStatus && typeof subscriptionStatus === 'object') {
      const hasActive = subscriptionStatus.hasActiveSubscription;
      if (hasActive === true || hasActive === false) {
        hasActiveSubscription = hasActive === true;
      }
    }
  } catch {
    hasActiveSubscription = false;
  }

  // Verificação APENAS via API (mais confiável)
  useEffect(() => {
    const checkCompanies = async () => {
      // Só verifica se for admin/master E tiver assinatura ativa
      if (!canCreateCompany || !hasActiveSubscription) {
        return;
      }

      try {
        setCheckingCompanies(true);

        // Aguardar inicialização (permissões) antes de verificar empresas
        const { initializationService } = await import(
          '../services/initializationService'
        );
        await initializationService.waitForInitialization();

        const result = await companyApi.hasCompanies();
        setHasCompanies(result);
      } catch (error: any) {
        // Se for erro 401, não fazer nada - o interceptor vai tratar o logout
        // Não tentar novamente para evitar loops
        if (error?.response?.status === 401) {
          // Não definir hasCompanies, deixar o interceptor tratar o logout
          setCheckingCompanies(false);
          // Não tentar verificar novamente
          return;
        }
        // Em caso de outro erro, assumir que tem empresas para não bloquear acesso
        setHasCompanies(true);
      } finally {
        setCheckingCompanies(false);
      }
    };

    // Só verificar uma vez quando estiver pronto
    // Não re-executar se já verificou e teve erro 401
    if (isReady && hasCompanies === null && !checkingCompanies) {
      checkCompanies();
    }
  }, [isReady, canCreateCompany, hasActiveSubscription]);

  // Se ainda está carregando subscription ou verificando via API, permitir acesso
  if (!isReady || checkingCompanies || hasCompanies === null) {
    return <>{children}</>;
  }

  // Se não é admin/master, permitir acesso (usuário comum)
  if (!canCreateCompany) {
    return <>{children}</>;
  }

  // Se não tem assinatura ativa, permitir acesso (SubscriptionLayout vai lidar)
  if (!hasActiveSubscription) {
    return <>{children}</>;
  }

  // CORREÇÃO CRÍTICA: Se está em /verifying-access ou /create-first-company, SEMPRE permitir acesso
  if (
    location.pathname === '/verifying-access' ||
    location.pathname === '/create-first-company'
  ) {
    return <>{children}</>;
  }

  // Se TEM empresas e está em create-first-company (não deveria acontecer; verifying-access já redireciona)
  if (hasCompanies === true && location.pathname === '/create-first-company') {
    window.dispatchEvent(new Event('company-changed'));
    return <Navigate to='/dashboard' replace />;
  }

  if (hasActiveSubscription && hasCompanies === false) {
    const isCreateFirstCompany =
      location.pathname === '/create-first-company' ||
      location.pathname === '/verifying-access';
    const isSubscriptionManagementRoute = location.pathname.startsWith(
      '/subscription-management'
    );
    const isMySubscriptionRoute = location.pathname === '/my-subscription';
    const isSubscriptionPlansRoute =
      location.pathname === '/subscription-plans';
    const isCommissionConfigRoute = location.pathname === '/commission-config';

    // CORREÇÃO: Permitir acesso a páginas de assinatura e configuração de comissões mesmo sem empresa
    if (
      isCreateFirstCompany ||
      isSubscriptionManagementRoute ||
      isMySubscriptionRoute ||
      isSubscriptionPlansRoute ||
      isCommissionConfigRoute
    ) {
      return <>{children}</>;
    }

    // Para qualquer outra rota, redirecionar para gerenciamento de assinatura
    return <Navigate to='/subscription-management' replace />;
  }

  // Se tem empresa (confirmado via API), permitir acesso a tudo
  return <>{children}</>;
};

export default CompanyRequiredGuard;
