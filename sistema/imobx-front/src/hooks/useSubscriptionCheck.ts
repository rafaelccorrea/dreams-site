import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { subscriptionService } from '../services/subscriptionService';
import type { SubscriptionAccessInfo } from '../types/subscription';

export const useSubscriptionCheck = () => {
  const { getCurrentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkSubscriptionAfterLogin = async () => {
      // Só verificar se estiver autenticado e ainda não verificou
      if (!isAuthenticated() || hasChecked) return;

      const user = getCurrentUser();
      if (!user) return;

      setIsChecking(true);

      try {
        // Se for usuário master, não precisa verificar
        if (user.role === 'master') {
          setHasChecked(true);
          setIsChecking(false);
          return;
        }

        // ✅ NOVA API - Verificar acesso detalhado
        const accessInfo = await subscriptionService.checkSubscriptionAccess();

        if (!accessInfo.hasAccess) {
          handleSubscriptionIssue(accessInfo, user.role);
        }
      } catch (error) {
        console.error('Erro ao verificar assinatura:', error);
        // Em caso de erro, redirecionar baseado no role
        const user = getCurrentUser();
        if (user?.role === 'admin') {
          navigate('/subscription-management');
        } else {
          navigate('/dashboard'); // Fallback para dashboard
        }
      } finally {
        setHasChecked(true);
        setIsChecking(false);
      }
    };

    // Aguardar um pouco para garantir que o token esteja disponível
    const timer = setTimeout(checkSubscriptionAfterLogin, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasChecked]);

  const handleSubscriptionIssue = (
    accessInfo: SubscriptionAccessInfo,
    userRole: string
  ) => {
    // ✅ REGRA: APENAS status 'active' tem acesso normal
    // Todos os outros status devem ir para /subscription-management (admin) ou /system-unavailable (usuários)

    if (userRole === 'admin') {
      navigate('/subscription-management', {
        state: {
          reason: accessInfo.status || 'inactive',
          accessInfo,
        },
      });
    } else {
      navigate('/system-unavailable', {
        state: {
          reason: accessInfo.status || 'inactive',
          message: 'Sistema indisponível. Contate o administrador.',
        },
      });
    }
  };

  return {
    isChecking,
    hasChecked,
  };
};
