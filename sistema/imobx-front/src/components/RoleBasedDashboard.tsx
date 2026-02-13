import React, { useState, useEffect } from 'react';
// IMPORTANT: Ensure Chart.js scales are registered before any chart components render
import { ensureChartRegistration } from './charts/chartConfig';
import { useAuth } from '../hooks/useAuth';
import DashboardPage from '../pages/DashboardPage';
import UserDashboardPage from '../pages/UserDashboardPage';
import { LottieLoading } from './common/LottieLoading';

const RoleBasedDashboard: React.FC = () => {
  // Garantir que Chart.js está registrado quando o componente montar
  useEffect(() => {
    ensureChartRegistration();
  }, []);

  // console.log('🚀 RoleBasedDashboard: Componente sendo renderizado...');
  const { getCurrentUser } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasCheckedUser, setHasCheckedUser] = useState(false);
  const currentUser = getCurrentUser();

  // Garantir que sempre renderize algo durante a inicialização
  useEffect(() => {
    // Marcar que já verificou o usuário após o primeiro render
    // Usar um pequeno delay para garantir que o loading seja mostrado
    const timer = setTimeout(() => {
      setHasCheckedUser(true);
      setIsInitializing(false);
    }, 300); // 300ms para garantir que o loading seja visível

    return () => clearTimeout(timer);
  }, []);

  // SEMPRE renderizar algo - nunca retornar null ou undefined
  // Apenas Lottie (sem shimmer/card branco atrás)
  if (!hasCheckedUser || isInitializing) {
    return <LottieLoading asOverlay={true} />;
  }

  // Se não tem usuário carregado ainda, mostrar apenas Lottie
  if (!currentUser) {
    return <LottieLoading asOverlay={true} />;
  }

  // console.log('🔐 RoleBasedDashboard: Usuário atual:', {
  //   hasUser: !!currentUser,
  //   userId: currentUser?.id,
  //   userRole: currentUser?.role
  // });
  // Dashboard administrativo para admin e master
  if (currentUser?.role === 'admin' || currentUser?.role === 'master') {
    // console.log('👑 RoleBasedDashboard: Renderizando DashboardPage para admin/master');
    return <DashboardPage />;
  }

  // Dashboard de colaborador para usuários do tipo "User" e outros tipos
  // console.log('👤 RoleBasedDashboard: Renderizando UserDashboardPage para usuário comum');
  return <UserDashboardPage />;
};

export default RoleBasedDashboard;
