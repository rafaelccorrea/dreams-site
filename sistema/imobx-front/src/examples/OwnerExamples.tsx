/**
 * Exemplo de uso dos componentes e hooks de Owner
 * Este arquivo demonstra como usar as funcionalidades implementadas
 */

import React from 'react';
import {
  OwnerOnly,
  AdminOnly,
  OwnerBadge,
  OwnerIndicator,
  OwnerConditional,
  useOwner,
  useIsOwner,
  useOwnerInfo,
} from '../components';

// Exemplo 1: Componente que mostra conteúdo apenas para proprietários
export function OwnerExample() {
  return (
    <div>
      <h2>Exemplo de Uso dos Componentes Owner</h2>

      {/* Conteúdo apenas para proprietários */}
      <OwnerOnly
        fallback={<div>Apenas proprietários podem ver este conteúdo</div>}
      >
        <div
          style={{
            background: '#FFD700',
            padding: '16px',
            borderRadius: '8px',
            margin: '16px 0',
          }}
        >
          <h3>👑 Conteúdo Exclusivo para Proprietários</h3>
          <p>Este conteúdo só é visível para o proprietário real da empresa.</p>
          <button>Configurações Avançadas</button>
        </div>
      </OwnerOnly>

      {/* Conteúdo apenas para administradores */}
      <AdminOnly
        fallback={<div>Apenas administradores podem ver este conteúdo</div>}
      >
        <div
          style={{
            background: '#6B7280',
            padding: '16px',
            borderRadius: '8px',
            margin: '16px 0',
          }}
        >
          <h3>👤 Conteúdo para Administradores</h3>
          <p>
            Este conteúdo só é visível para administradores (não proprietários).
          </p>
          <button>Gerenciar Usuários</button>
        </div>
      </AdminOnly>

      {/* Conteúdo condicional */}
      <OwnerConditional
        ownerContent={
          <div
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              padding: '16px',
              borderRadius: '8px',
              margin: '16px 0',
            }}
          >
            <h3>🎯 Painel do Proprietário</h3>
            <p>Você tem acesso completo a todas as funcionalidades.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button>Relatórios Financeiros</button>
              <button>Configurações da Empresa</button>
              <button>Plano e Cobrança</button>
            </div>
          </div>
        }
        adminContent={
          <div
            style={{
              background: 'linear-gradient(135deg, #6B7280, #4B5563)',
              padding: '16px',
              borderRadius: '8px',
              margin: '16px 0',
            }}
          >
            <h3>⚙️ Painel do Administrador</h3>
            <p>Você pode gerenciar usuários e visualizar relatórios básicos.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button>Gerenciar Usuários</button>
              <button>Relatórios Básicos</button>
              <button>Configurações</button>
            </div>
          </div>
        }
      />

      {/* Badge do usuário */}
      <OwnerBadge showIcon={true} showLabel={true} />

      {/* Indicador simples */}
      <div style={{ margin: '16px 0' }}>
        <h3>Status do Usuário:</h3>
        <OwnerIndicator size='large' showText={true} />
      </div>
    </div>
  );
}

// Exemplo 2: Hook personalizado
export function OwnerHookExample() {
  const { isOwner, loading, error, ownerInfo } = useOwner();
  const isOwnerSimple = useIsOwner();
  const ownerInfoComplete = useOwnerInfo();

  if (loading) {
    return <div>Carregando informações do proprietário...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div>
      <h2>Exemplo de Uso dos Hooks Owner</h2>

      <div
        style={{
          background: '#f5f5f5',
          padding: '16px',
          borderRadius: '8px',
          margin: '16px 0',
        }}
      >
        <h3>Informações do Hook useOwner:</h3>
        <p>
          <strong>É proprietário:</strong> {isOwner ? 'Sim' : 'Não'}
        </p>
        <p>
          <strong>Função:</strong> {ownerInfo?.role || 'N/A'}
        </p>
        <p>
          <strong>Status:</strong>{' '}
          {isOwner ? 'Proprietário Real' : 'Administrador'}
        </p>
      </div>

      <div
        style={{
          background: '#e5f3ff',
          padding: '16px',
          borderRadius: '8px',
          margin: '16px 0',
        }}
      >
        <h3>Hook useIsOwner (simplificado):</h3>
        <p>
          <strong>É proprietário:</strong> {isOwnerSimple ? 'Sim' : 'Não'}
        </p>
      </div>

      <div
        style={{
          background: '#f0f9ff',
          padding: '16px',
          borderRadius: '8px',
          margin: '16px 0',
        }}
      >
        <h3>Hook useOwnerInfo (completo):</h3>
        <p>
          <strong>É proprietário:</strong>{' '}
          {ownerInfoComplete.isOwner ? 'Sim' : 'Não'}
        </p>
        <p>
          <strong>Função:</strong> {ownerInfoComplete.role}
        </p>
        <p>
          <strong>Label:</strong> {ownerInfoComplete.label}
        </p>
        <p>
          <strong>Ícone:</strong> {ownerInfoComplete.icon}
        </p>
        <p>
          <strong>Cor:</strong>{' '}
          <span style={{ color: ownerInfoComplete.color }}>
            {ownerInfoComplete.color}
          </span>
        </p>
      </div>
    </div>
  );
}

// Exemplo 3: Menu condicional
export function ConditionalMenu() {
  const { isOwner } = useOwner();

  const ownerMenuItems = [
    { label: '🏢 Configurações da Empresa', path: '/company/settings' },
    { label: '💰 Relatórios Financeiros', path: '/reports/financial' },
    { label: '💳 Plano e Cobrança', path: '/billing' },
    { label: '📊 Analytics Avançados', path: '/analytics' },
    { label: '👥 Gerenciar Usuários', path: '/admin/users' },
  ];

  const adminMenuItems = [
    { label: '👥 Gerenciar Usuários', path: '/admin/users' },
    { label: '📈 Relatórios Básicos', path: '/reports/basic' },
    { label: '⚙️ Configurações', path: '/settings' },
  ];

  const menuItems = isOwner ? ownerMenuItems : adminMenuItems;

  return (
    <div>
      <h2>Menu Condicional</h2>
      <nav
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <h3>
          {isOwner ? '👑 Menu do Proprietário' : '👤 Menu do Administrador'}
        </h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menuItems.map((item, index) => (
            <li key={index} style={{ margin: '8px 0' }}>
              <a
                href={item.path}
                style={{
                  display: 'block',
                  padding: '8px 12px',
                  background: '#f9fafb',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  color: '#374151',
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

// Exemplo 4: Dashboard diferenciado
export function OwnerDashboard() {
  return (
    <div>
      <h1>
        Dashboard
        <OwnerIndicator size='small' showText={false} />
      </h1>

      <OwnerConditional
        ownerContent={
          <div>
            <h2>👑 Painel do Proprietário</h2>
            <p>Bem-vindo ao seu painel completo de gestão imobiliária!</p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
                margin: '24px 0',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  padding: '20px',
                  borderRadius: '12px',
                  color: '#000',
                }}
              >
                <h3>💰 Receita Total</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  R$ 125.000,00
                </p>
                <p>+12% vs mês anterior</p>
              </div>

              <div
                style={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  padding: '20px',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              >
                <h3>🏠 Propriedades</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>45</p>
                <p>+3 novas este mês</p>
              </div>

              <div
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                  padding: '20px',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              >
                <h3>👥 Equipe</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>8</p>
                <p>Corretores ativos</p>
              </div>
            </div>
          </div>
        }
        adminContent={
          <div>
            <h2>👤 Painel do Administrador</h2>
            <p>Bem-vindo ao painel administrativo!</p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
                margin: '24px 0',
              }}
            >
              <div
                style={{
                  background: '#6B7280',
                  padding: '20px',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              >
                <h3>📊 Relatórios Básicos</h3>
                <p>Visualize relatórios de vendas e performance</p>
                <button
                  style={{
                    background: '#4B5563',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Ver Relatórios
                </button>
              </div>

              <div
                style={{
                  background: '#10B981',
                  padding: '20px',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              >
                <h3>👥 Gerenciar Usuários</h3>
                <p>Adicione e gerencie usuários da equipe</p>
                <button
                  style={{
                    background: '#059669',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Gerenciar
                </button>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
