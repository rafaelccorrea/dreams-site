import React from 'react';
import styled from 'styled-components';
import { MetricRow } from './MetricRow';
import type { UsersComparisonResponse } from '@/types/performance';
import {
  formatResponseTime,
  getPercentageColorClass,
} from '@/utils/performanceUtils';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 12px;
`;

const UserName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: ${props => props.theme.colors.text.primary};
`;

const AcceptanceRate = styled.div<{ $color: string }>`
  display: inline-block;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 8px;
  background: ${props => props.$color};
  color: ${props => props.theme.colors.text.primary};
`;

const Metrics = styled.div`
  margin-bottom: 16px;
`;

const Badges = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Badge = styled.div<{ $color: string }>`
  padding: 8px 12px;
  background: ${props => props.$color};
  color: ${props => props.theme.colors.text.primary};
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
`;

interface SideBySideComparisonProps {
  comparison: UsersComparisonResponse;
}

export function SideBySideComparison({
  comparison,
}: SideBySideComparisonProps) {
  const { users, bestIn } = comparison;

  const getColorForRate = (rate: number): string => {
    if (rate >= 80) return '#10B98120';
    if (rate >= 60) return '#F59E0B20';
    return '#EF444420';
  };

  return (
    <Grid>
      {users.map(user => {
        const isBestAcceptance = bestIn.acceptanceRate.userId === user.userId;
        const isBestScore = bestIn.avgScore.userId === user.userId;
        const isBestTasks = bestIn.tasksCompleted.userId === user.userId;
        const isBestResponse = bestIn.responseTime.userId === user.userId;

        const initials = user.userName
          .split(' ')
          .map(n => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        return (
          <Card key={user.userId}>
            <Header>
              <Avatar>{initials}</Avatar>
              <UserName>{user.userName}</UserName>
              <AcceptanceRate
                $color={getColorForRate(user.acceptanceRate || 0)}
              >
                {(user.acceptanceRate || 0).toFixed(1)}%
              </AcceptanceRate>
            </Header>

            <Metrics>
              <MetricRow
                label='Matches Aceitos'
                value={user.acceptedMatches}
                icon='✅'
              />
              <MetricRow
                label='Score Médio'
                value={(user.avgAcceptedScore || 0).toFixed(1)}
                icon='⭐'
              />
              <MetricRow
                label='Tasks Concluídas'
                value={user.tasksCompletedFromMatches}
                icon='📋'
              />
              <MetricRow
                label='Tempo Resposta'
                value={formatResponseTime(user.avgResponseTime)}
                icon='⏱️'
              />
            </Metrics>

            {(isBestAcceptance ||
              isBestScore ||
              isBestTasks ||
              isBestResponse) && (
              <Badges>
                {isBestAcceptance && (
                  <Badge $color='#F59E0B20'>🏆 Melhor Taxa de Aceitação</Badge>
                )}
                {isBestScore && (
                  <Badge $color='#8B5CF620'>⭐ Melhor Score Médio</Badge>
                )}
                {isBestTasks && (
                  <Badge $color='#10B98120'>📋 Mais Tasks Concluídas</Badge>
                )}
                {isBestResponse && (
                  <Badge $color='#3B82F620'>⚡ Resposta Mais Rápida</Badge>
                )}
              </Badges>
            )}
          </Card>
        );
      })}
    </Grid>
  );
}
