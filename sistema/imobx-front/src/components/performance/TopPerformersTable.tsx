import React from 'react';
import styled from 'styled-components';
import type { UserPerformance } from '@/types/performance';
import { getRankMedal } from '@/utils/performanceUtils';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: ${props => props.theme.colors.background};
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.secondary};
  border-bottom: 2px solid ${props => props.theme.colors.border};

  &:last-child {
    text-align: right;
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background: ${props => props.theme.colors.background}50;
  }
`;

const Td = styled.td`
  padding: 12px 16px;
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
    font-size: 1.25rem;
  }
`;

const UserCell = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
`;

const UserStats = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
`;

interface TopPerformersTableProps {
  performers: UserPerformance[];
  maxRows?: number;
}

export function TopPerformersTable({
  performers,
  maxRows = 5,
}: TopPerformersTableProps) {
  const topPerformers = performers.slice(0, maxRows);

  return (
    <Table>
      <Thead>
        <Tr>
          <Th style={{ width: '80px' }}>Posição</Th>
          <Th>Corretor</Th>
          <Th style={{ textAlign: 'right' }}>Aceitos</Th>
          <Th style={{ textAlign: 'right' }}>Taxa</Th>
        </Tr>
      </Thead>
      <Tbody>
        {topPerformers.map((performer, index) => {
          const rank = index + 1;
          const medal = getRankMedal(rank);

          return (
            <Tr key={performer.userId}>
              <Td>
                <RankCell>
                  {medal && <span className='medal'>{medal}</span>}
                  <span>#{rank}</span>
                </RankCell>
              </Td>
              <Td>
                <UserCell>
                  <UserName>{performer.userName}</UserName>
                  <UserStats>{performer.totalMatches} matches total</UserStats>
                </UserCell>
              </Td>
              <Td style={{ fontWeight: 600, textAlign: 'right' }}>
                {performer.acceptedMatches}
              </Td>
              <Td style={{ fontWeight: 600, textAlign: 'right' }}>
                {performer.acceptanceRate.toFixed(1)}%
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
