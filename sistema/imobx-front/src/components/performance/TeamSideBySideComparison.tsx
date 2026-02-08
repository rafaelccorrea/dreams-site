import React from 'react';
import styled from 'styled-components';
import { MdGroups } from 'react-icons/md';
import { MetricRow } from './MetricRow';
import type { TeamsComparisonResponse } from '@/types/performance';
import { getPercentageColorClass } from '@/utils/performanceUtils';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 12px;
`;

const TeamName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: ${props => props.theme.colors.text.primary};
`;

const MemberCount = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 0 12px 0;
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

const TopPerformer = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  margin-bottom: 12px;
`;

const TopPerformerLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TopPerformerInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TopPerformerName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const TopPerformerRate = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.secondary};
`;

const MembersSection = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  margin-bottom: 16px;
`;

const MembersLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 0 8px 0;
`;

const AvatarGroup = styled.div`
  display: flex;
  gap: 4px;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  border: 2px solid ${props => props.theme.colors.cardBackground};
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

interface TeamSideBySideComparisonProps {
  comparison: TeamsComparisonResponse;
}

export function TeamSideBySideComparison({
  comparison,
}: TeamSideBySideComparisonProps) {
  const { teams, bestTeam } = comparison;

  const getColorForRate = (rate: number): string => {
    if (rate >= 80) return '#10B98120';
    if (rate >= 60) return '#F59E0B20';
    return '#EF444420';
  };

  return (
    <Grid>
      {teams.map(team => {
        const isBestAcceptance = bestTeam.acceptanceRate.teamId === team.teamId;
        const isBestScore = bestTeam.avgScore.teamId === team.teamId;
        const isBestMatches = bestTeam.totalMatches.teamId === team.teamId;

        return (
          <Card key={team.teamId}>
            <Header>
              <IconWrapper>
                <MdGroups />
              </IconWrapper>
              <TeamName>{team.teamName}</TeamName>
              <MemberCount>
                {team.memberCount}{' '}
                {team.memberCount === 1 ? 'membro' : 'membros'}
              </MemberCount>
              <AcceptanceRate
                $color={getColorForRate(team.acceptanceRate || 0)}
              >
                {(team.acceptanceRate || 0).toFixed(1)}%
              </AcceptanceRate>
            </Header>

            <Metrics>
              <MetricRow
                label='Total de Matches'
                value={team.totalMatches}
                icon='🎯'
              />
              <MetricRow
                label='Matches Aceitos'
                value={team.acceptedMatches}
                icon='✅'
              />
              <MetricRow
                label='Score Médio'
                value={(team.avgMatchScore || 0).toFixed(1)}
                icon='⭐'
              />
              <MetricRow
                label='Pendentes'
                value={team.pendingMatches}
                icon='⏳'
              />
            </Metrics>

            {team.topPerformer && (
              <TopPerformer>
                <TopPerformerLabel>🌟 Melhor da Equipe</TopPerformerLabel>
                <TopPerformerInfo>
                  <TopPerformerName>
                    {team.topPerformer.userName}
                  </TopPerformerName>
                  <TopPerformerRate>
                    {(team.topPerformer?.acceptanceRate || 0).toFixed(1)}%
                  </TopPerformerRate>
                </TopPerformerInfo>
              </TopPerformer>
            )}

            {team.members.length > 0 && (
              <MembersSection>
                <MembersLabel>Membros ({team.members.length})</MembersLabel>
                <AvatarGroup>
                  {team.members.slice(0, 6).map(member => {
                    const initials = member.userName
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();
                    return <Avatar key={member.userId}>{initials}</Avatar>;
                  })}
                  {team.members.length > 6 && (
                    <Avatar>+{team.members.length - 6}</Avatar>
                  )}
                </AvatarGroup>
              </MembersSection>
            )}

            {(isBestAcceptance || isBestScore || isBestMatches) && (
              <Badges>
                {isBestAcceptance && (
                  <Badge $color='#F59E0B20'>🏆 Melhor Taxa de Aceitação</Badge>
                )}
                {isBestScore && (
                  <Badge $color='#8B5CF620'>⭐ Melhor Score Médio</Badge>
                )}
                {isBestMatches && (
                  <Badge $color='#10B98120'>🎯 Mais Matches</Badge>
                )}
              </Badges>
            )}
          </Card>
        );
      })}
    </Grid>
  );
}
