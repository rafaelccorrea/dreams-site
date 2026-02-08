/**
 * Exemplo de Integração de Matches
 * Como integrar o sistema de matches nas telas existentes
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { useMatches } from '../hooks/useMatches';
import { MatchCard } from '../components/common/MatchCard';
import { MatchesBadge } from '../components/common/MatchesBadge';
import { MatchesWidget } from '../components/common/MatchesWidget';
import { Spinner } from '../components/common/Spinner';

/**
 * EXEMPLO 1: Aba de Matches em Detalhes do Cliente
 * Use este exemplo na página de detalhes do cliente
 */
export const ClientMatchesTab: React.FC<{ clientId: string }> = ({
  clientId,
}) => {
  const { matches, loading, acceptMatch, ignoreMatch, fetchMatches } =
    useMatches({
      clientId,
      status: 'pending',
      autoFetch: true,
    });

  const handleAccept = async (matchId: string) => {
    await acceptMatch(matchId, { action: 'create_task' });
    fetchMatches(); // Recarregar lista
  };

  const handleIgnore = async (
    matchId: string,
    reason?: string,
    notes?: string
  ) => {
    await ignoreMatch(matchId, { reason: reason as any, notes });
    fetchMatches(); // Recarregar lista
  };

  return (
    <Container>
      <Header>
        <Title>🎯 Sugestões de Imóveis</Title>
        {matches.length > 0 && (
          <Badge>
            {matches.length} {matches.length === 1 ? 'match' : 'matches'}
          </Badge>
        )}
      </Header>

      {loading ? (
        <Spinner />
      ) : matches.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🔍</EmptyIcon>
          <EmptyText>Nenhuma sugestão disponível no momento</EmptyText>
          <EmptyHint>
            Quando houver imóveis compatíveis com as preferências deste cliente,
            eles aparecerão aqui automaticamente.
          </EmptyHint>
        </EmptyState>
      ) : (
        <MatchesList>
          {matches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              onAccept={() => handleAccept(match.id)}
              onIgnore={(reason, notes) =>
                handleIgnore(match.id, reason, notes)
              }
              showProperty={true}
            />
          ))}
        </MatchesList>
      )}
    </Container>
  );
};

/**
 * EXEMPLO 2: Badge na Listagem de Clientes
 * Adicione isto ao lado do nome do cliente na tabela
 */
export const ClientRowExample: React.FC<{ client: any }> = ({ client }) => {
  return (
    <tr>
      <td>
        {client.name}
        <MatchesBadge
          clientId={client.id}
          onClick={() => {
            // Navegar para detalhes do cliente
            window.location.href = `/clients/${client.id}?tab=matches`;
          }}
        />
      </td>
      <td>{client.email}</td>
      <td>{client.phone}</td>
      {/* ... outros campos ... */}
    </tr>
  );
};

/**
 * EXEMPLO 3: Widget de Matches no Dashboard
 * Adicione isto na sua página de dashboard
 */
export const DashboardMatchesExample: React.FC = () => {
  return (
    <DashboardGrid>
      {/* Outros widgets do dashboard */}
      <MatchesWidget />
      {/* Outros widgets do dashboard */}
    </DashboardGrid>
  );
};

/**
 * EXEMPLO 4: Seção de Clientes Compatíveis em Detalhes do Imóvel
 */
export const PropertyClientsMatches: React.FC<{ propertyId: string }> = ({
  propertyId,
}) => {
  const { matches, loading } = useMatches({
    propertyId,
    status: 'pending',
    autoFetch: true,
  });

  if (loading) return <Spinner />;
  if (matches.length === 0) return null;

  return (
    <Section>
      <SectionTitle>👥 Clientes Compatíveis ({matches.length})</SectionTitle>
      <ClientsList>
        {matches.map(match => (
          <ClientMatchItem key={match.id}>
            <MatchScore $score={match.matchScore}>
              {match.matchScore}%
            </MatchScore>
            <ClientInfo>
              <ClientName>{match.client?.name}</ClientName>
              <ClientDetails>
                {match.client?.email} · {match.client?.phone}
              </ClientDetails>
            </ClientInfo>
            <ViewButton
              onClick={() =>
                (window.location.href = `/clients/${match.clientId}`)
              }
            >
              Ver Cliente →
            </ViewButton>
          </ClientMatchItem>
        ))}
      </ClientsList>
    </Section>
  );
};

/**
 * EXEMPLO 5: Filtro por Status de Match
 */
export const MatchesWithFilter: React.FC<{ clientId: string }> = ({
  clientId,
}) => {
  const [statusFilter, setStatusFilter] = useState<
    'pending' | 'accepted' | 'all'
  >('pending');

  const { matches, loading } = useMatches({
    clientId,
    status: statusFilter === 'all' ? undefined : statusFilter,
    autoFetch: true,
  });

  return (
    <Container>
      <FilterBar>
        <FilterButton
          $active={statusFilter === 'pending'}
          onClick={() => setStatusFilter('pending')}
        >
          ⏳ Pendentes
        </FilterButton>
        <FilterButton
          $active={statusFilter === 'accepted'}
          onClick={() => setStatusFilter('accepted')}
        >
          ✅ Aceitos
        </FilterButton>
        <FilterButton
          $active={statusFilter === 'all'}
          onClick={() => setStatusFilter('all')}
        >
          📋 Todos
        </FilterButton>
      </FilterBar>

      {loading ? (
        <Spinner />
      ) : (
        <MatchesList>
          {matches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              onAccept={() => {}}
              onIgnore={() => {}}
            />
          ))}
        </MatchesList>
      )}
    </Container>
  );
};

// Styled Components

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

const Badge = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: bold;
`;

const MatchesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const EmptyHint = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  max-width: 500px;
  margin: 0;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  padding: 24px;
`;

const Section = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
`;

const ClientsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ClientMatchItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const MatchScore = styled.div<{ $score: number }>`
  background: ${({ $score }) => {
    if ($score >= 90) return '#27AE60';
    if ($score >= 80) return '#2ECC71';
    if ($score >= 70) return '#F39C12';
    return '#E67E22';
  }};
  color: white;
  font-weight: bold;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 8px;
  min-width: 60px;
  text-align: center;
`;

const ClientInfo = styled.div`
  flex: 1;
`;

const ClientName = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
`;

const ClientDetails = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
`;

const ViewButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateX(2px);
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.backgroundSecondary || '#f8f9fa'};
  border-radius: 8px;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.text)};

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : 'rgba(0, 0, 0, 0.05)'};
  }
`;
