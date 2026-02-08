import React from 'react';
import styled from 'styled-components';
import { MdGroups } from 'react-icons/md';
import type { TeamPerformance } from '@/types/performance';

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const TeamInfo = styled.div``;

const TeamName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 4px 0;
`;

const MemberCount = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const Stats = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 8px;
`;

interface TeamPerformanceCardProps {
  team: TeamPerformance;
  onViewDetails?: (teamId: string) => void;
  className?: string;
}

export function TeamPerformanceCard({
  team,
  className,
}: TeamPerformanceCardProps) {
  return (
    <Card className={className}>
      <Header>
        <IconWrapper>
          <MdGroups />
        </IconWrapper>
        <TeamInfo>
          <TeamName>{team.teamName}</TeamName>
          <MemberCount>
            {team.memberCount} {team.memberCount === 1 ? 'membro' : 'membros'}
          </MemberCount>
        </TeamInfo>
      </Header>
      <Stats>Taxa de aceitação: {team.acceptanceRate.toFixed(1)}%</Stats>
      <Stats>Matches totais: {team.totalMatches}</Stats>
    </Card>
  );
}
