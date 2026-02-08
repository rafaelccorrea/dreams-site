import React from 'react';
import styled from 'styled-components';
import type { UserPerformance } from '@/types/performance';

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
`;

const UserName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const Stats = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
`;

interface UserPerformanceCardProps {
  user: UserPerformance;
  showBadges?: boolean;
  showIgnoreReasons?: boolean;
  className?: string;
}

export function UserPerformanceCard({
  user,
  className,
}: UserPerformanceCardProps) {
  return (
    <Card className={className}>
      <UserName>{user.userName}</UserName>
      <Stats>Taxa de aceitação: {user.acceptanceRate.toFixed(1)}%</Stats>
      <Stats>Matches aceitos: {user.acceptedMatches}</Stats>
    </Card>
  );
}
