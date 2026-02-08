import React from 'react';
import styled from 'styled-components';
import type { ComparisonMetric } from '@/types/performance';
import { getRankMedal } from '@/utils/performanceUtils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const MetricCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 16px 20px;
  background: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const CardTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: ${props => props.theme.colors.background};
`;

const Th = styled.th`
  padding: 12px 20px;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.secondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    text-align: right;
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.background}50;
  }
`;

const Td = styled.td`
  padding: 14px 20px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.primary};

  &:last-child {
    text-align: right;
  }
`;

const RankCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;

  .medal {
    font-size: 1.125rem;
  }
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const Value = styled.span`
  font-weight: 600;
`;

interface ComparisonRankingTableProps {
  comparison: ComparisonMetric[];
}

export function ComparisonRankingTable({
  comparison,
}: ComparisonRankingTableProps) {
  return (
    <Container>
      {comparison.map(metric => (
        <MetricCard key={metric.metric}>
          <CardHeader>
            <CardTitle>{metric.metric}</CardTitle>
          </CardHeader>
          <Table>
            <Thead>
              <Tr>
                <Th style={{ width: '100px' }}>Posição</Th>
                <Th>Corretor</Th>
                <Th>Valor</Th>
              </Tr>
            </Thead>
            <Tbody>
              {metric.users.map(user => {
                const medal = getRankMedal(user.rank);
                const initials = user.userName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <Tr key={user.userId}>
                    <Td>
                      <RankCell>
                        {medal && <span className='medal'>{medal}</span>}
                        <span>#{user.rank}</span>
                      </RankCell>
                    </Td>
                    <Td>
                      <UserCell>
                        <Avatar>{initials}</Avatar>
                        <UserName>{user.userName}</UserName>
                      </UserCell>
                    </Td>
                    <Td>
                      <Value>
                        {user.value}
                        {metric.metric.includes('%') && '%'}
                        {metric.metric.includes('(h)') && 'h'}
                      </Value>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </MetricCard>
      ))}
    </Container>
  );
}
