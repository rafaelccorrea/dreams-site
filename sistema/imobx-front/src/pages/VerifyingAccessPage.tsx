import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '../services/authStorage';
import { companyApi } from '../services/companyApi';
import { subscriptionService } from '../services/subscriptionService';
import { useSubscriptionContext } from '../contexts/SubscriptionContext';
import { LottieLoading } from '../components/common/LottieLoading';

/**
 * Página exibida durante a verificação de assinatura/acesso.
 * URL fica em /verifying-access em vez de /create-first-company.
 * Ao terminar, redireciona para dashboard, create-first-company ou planos/gestão.
 */
const VerifyingAccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { subscriptionStatus } = useSubscriptionContext();
  const runOnce = useRef(false);

  useEffect(() => {
    if (runOnce.current) return;
    runOnce.current = true;

    let isMounted = true;

    const resolveHasCompany = async (): Promise<boolean> => {
      const selectedId = localStorage.getItem('dream_keys_selected_company_id');
      if (selectedId) return true;
      try {
        const companies = await companyApi.getCompanies();
        if (companies && companies.length > 0) {
          localStorage.setItem(
            'dream_keys_selected_company_id',
            companies[0].id
          );
          return true;
        }
      } catch {
        // ignore
      }
      return false;
    };

    const grantAccess = (hasCompany: boolean) => {
      if (!isMounted) return;
      if (hasCompany) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/create-first-company', {
          replace: true,
          state: { fromVerifying: true },
        });
      }
    };

    const denyAccess = (redirectPath: string) => {
      if (!isMounted) return;
      navigate(redirectPath, { replace: true });
    };

    const run = async () => {
      try {
        const user = authStorage.getUserData();
        if (!user || user.owner !== true) {
          navigate('/create-first-company', {
            replace: true,
            state: { fromVerifying: true },
          });
          return;
        }

        let hasActive = subscriptionStatus?.hasActiveSubscription ?? false;

        if (!hasActive) {
          try {
            await subscriptionService.getMySubscriptionUsage();
            hasActive = true;
            const hasCompany = await resolveHasCompany();
            grantAccess(hasCompany);
            return;
          } catch (error: any) {
            const status =
              error?.response?.status || error?.status || error?.statusCode;
            const message = (
              error?.response?.data?.message ||
              error?.message ||
              error?.response?.data?.error ||
              ''
            ).toLowerCase();

            if (
              !status &&
              error?.message &&
              typeof error.message === 'string'
            ) {
              const em = error.message.toLowerCase();
              if (
                em.includes('assinatura') ||
                em.includes('subscription') ||
                em.includes('nenhuma assinatura') ||
                em.includes('no subscription')
              ) {
                denyAccess('/subscription-plans');
                return;
              }
            }

            if (
              status === 404 &&
              (message.includes('assinatura') ||
                message.includes('subscription') ||
                message.includes('nenhuma assinatura') ||
                message.includes('no subscription') ||
                message.includes('subscription not found'))
            ) {
              denyAccess('/subscription-plans');
              return;
            }

            if (
              status === 404 &&
              message.includes('empresa') &&
              !message.includes('assinatura')
            ) {
              const hasCompany = await resolveHasCompany();
              grantAccess(hasCompany);
              return;
            }

            if (status === 401) {
              denyAccess('/subscription-management');
              return;
            }

            if (status === 404) {
              denyAccess('/subscription-plans');
              return;
            }

            if (!status && error) {
              const errStr = JSON.stringify(error).toLowerCase();
              if (
                errStr.includes('assinatura') ||
                errStr.includes('subscription') ||
                errStr.includes('404')
              ) {
                denyAccess('/subscription-plans');
                return;
              }
            }
          }
        }

        const accessInfo = await subscriptionService.checkSubscriptionAccess();
        const hasCompanyResolved = await resolveHasCompany();
        const missingCompanyAssociation =
          !hasCompanyResolved &&
          typeof accessInfo.reason === 'string' &&
          accessInfo.reason.toLowerCase().includes('empresa');

        if (accessInfo.subscription || missingCompanyAssociation) {
          grantAccess(hasCompanyResolved);
          return;
        }

        if (accessInfo.hasAccess) {
          grantAccess(hasCompanyResolved);
          return;
        }

        if (isMounted) {
          const status = accessInfo.status as string;
          if (status === 'none') {
            navigate('/subscription-plans', { replace: true });
          } else {
            navigate('/subscription-management', { replace: true });
          }
        }
      } catch (error) {
        console.error('Erro ao verificar acesso:', error);
        if (isMounted) {
          navigate('/subscription-management', { replace: true });
        }
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [navigate, subscriptionStatus?.hasActiveSubscription]);

  return (
    <LottieLoading
      message='Verificando assinatura...'
      subtitle='Aguarde enquanto confirmamos seu acesso.'
    />
  );
};

export default VerifyingAccessPage;
