/**
 * Exemplo de Integração da Página de Matches
 * Como adicionar a tela de matches no projeto
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MatchesPage } from '../pages/MatchesPage';
import { UpgradePrompt } from '../components/common/UpgradePrompt';

/**
 * EXEMPLO 1: Rota Simples (sem verificação de módulo)
 */
export const SimpleMatchesRoute = () => (
  <Route path='/matches' element={<MatchesPage />} />
);

/**
 * EXEMPLO 2: Rota com Verificação de Módulo
 */
import { useModuleAccess } from '../hooks/useModuleAccess';

const ProtectedMatchesRoute = () => {
  const { hasAccess } = useModuleAccess('match_system');

  if (hasAccess === null) {
    return <div>Carregando...</div>;
  }

  if (!hasAccess) {
    return (
      <UpgradePrompt
        module='Sistema de Matches'
        features={[
          'Sistema inteligente de match cliente-imóvel',
          'Score de compatibilidade automático (0-100%)',
          'Notificações em tempo real de novos matches',
          'Geração automática de sugestões',
          'Análise de características desejadas',
          'Filtros avançados por score e status',
          'Dashboard com estatísticas completas',
        ]}
      />
    );
  }

  return <MatchesPage />;
};

/**
 * EXEMPLO 3: Menu Item com Badge de Contagem
 */
import { Link } from 'react-router-dom';
import { useMatchesSummary } from '../hooks/useMatches';

export const MatchesMenuItem = () => {
  const { summary } = useMatchesSummary();

  return (
    <li className='menu-item'>
      <Link to='/matches' className='menu-link'>
        <span className='menu-icon'>🎯</span>
        <span className='menu-text'>Matches</span>
        {summary && summary.pending > 0 && (
          <span className='menu-badge'>{summary.pending}</span>
        )}
      </Link>
    </li>
  );
};

/**
 * EXEMPLO 4: Integração no App.tsx
 */
export const AppRoutesExample = () => (
  <Routes>
    {/* Outras rotas */}
    <Route path='/dashboard' element={<div>Dashboard</div>} />
    <Route path='/clients' element={<div>Clients</div>} />
    <Route path='/properties' element={<div>Properties</div>} />

    {/* Rota de Matches */}
    <Route path='/matches' element={<ProtectedMatchesRoute />} />
  </Routes>
);

/**
 * EXEMPLO 5: Widget de Matches no Dashboard
 */
import { MatchesWidget } from '../components/common/MatchesWidget';

export const DashboardWithMatchesWidget = () => (
  <div className='dashboard'>
    <div className='widgets-grid'>
      {/* Outros widgets */}
      <MatchesWidget />
    </div>
  </div>
);

/**
 * EXEMPLO 6: CSS para Menu Badge
 */
const menuBadgeCSS = `
.menu-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: linear-gradient(135deg, #ef4444, #f97316);
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  margin-left: auto;
  animation: pulse-badge 2s infinite;
}

@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
}
`;

/**
 * EXEMPLO 7: Notificação de Novo Match
 */
import { useEffect } from 'react';

export const MatchNotificationExample = () => {
  const { summary, refetch } = useMatchesSummary();

  useEffect(() => {
    // Verificar novos matches a cada 2 minutos
    const interval = setInterval(() => {
      refetch();
    }, 120000);

    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    // Quando houver novos matches pendentes
    if (summary && summary.pending > 0) {
      // Pode mostrar notificação toast, badge, etc
      // console.log(`Você tem ${summary.pending} matches pendentes!`);
    }
  }, [summary]);

  return null;
};
