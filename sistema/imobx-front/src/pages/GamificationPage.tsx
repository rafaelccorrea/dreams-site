import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCompany } from '@/hooks/useCompany';
import { gamificationService } from '@/services/gamification.service';
import {
  ScorePeriod,
  ScorePeriodLabels,
  type GamificationDashboard,
  type GamificationScore,
  type TeamScore,
  type GamificationConfig,
  type UserAchievement,
  AchievementTierColors,
} from '@/types/gamification.types';
import {
  GamificationFilters,
  type GamificationFiltersType,
} from '@/components/gamification/GamificationFilters';
import { GamificationShimmer } from '@/components/shimmer/GamificationShimmer';
import styled from 'styled-components';
import {
  MdEmojiEvents,
  MdTrendingUp,
  MdPeople,
  MdStar,
  MdAttachMoney,
  MdHome,
  MdCheckCircle,
  MdPhone,
  MdBusiness,
  MdVerified,
  MdSettings,
  MdBlock,
  MdFullscreen,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { PresentationMode } from '@/components/gamification/PresentationMode';
import {
  PresentationSettings,
  type PresentationConfig,
} from '@/components/gamification/PresentationSettings';

export const GamificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<GamificationConfig | null>(null);
  const [dashboard, setDashboard] = useState<GamificationDashboard | null>(
    null
  );
  const [teamRankings, setTeamRankings] = useState<TeamScore[]>([]);
  const [filteredRankings, setFilteredRankings] = useState<GamificationScore[]>(
    []
  );
  const [filteredTeamRankings, setFilteredTeamRankings] = useState<TeamScore[]>(
    []
  );
  const [activeTab, setActiveTab] = useState<'individual' | 'teams'>(
    'individual'
  );
  const [showPresentationSettings, setShowPresentationSettings] =
    useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [presentationConfig, setPresentationConfig] =
    useState<PresentationConfig | null>(null);
  const [filters, setFilters] = useState<GamificationFiltersType>({
    period: ScorePeriod.MONTHLY,
  });

  useEffect(() => {
    if (selectedCompany) {
      loadDashboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany, filters]);

  const loadDashboard = async () => {
    if (!selectedCompany) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const configData = await gamificationService.getConfig();
      setConfig(configData);

      if (!configData.isEnabled) {
        setLoading(false);
        return;
      }

      // Verificar se há filtros avançados (sem período padrão)
      const hasAdvancedFilters = Object.keys(filters).some(
        key => key !== 'period' && filters[key as keyof GamificationFiltersType]
      );

      const periodToUse = hasAdvancedFilters ? undefined : filters.period;

      const [dashboardData, teams] = await Promise.all([
        gamificationService.getDashboard(periodToUse),
        gamificationService.getTeamRankings(periodToUse),
      ]);
      setDashboard(dashboardData);
      setTeamRankings(teams);

      // Aplicar filtros locais
      applyFiltersToRankings(dashboardData.rankings.top5, teams);
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.warning('Gamificação não está ativada para esta empresa');
      } else {
        toast.error('Erro ao carregar dados de gamificação');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersToRankings = (
    rankings: GamificationScore[],
    teams: TeamScore[]
  ) => {
    // Filtrar rankings individuais
    let filtered = [...rankings];

    if (filters.minPoints) {
      filtered = filtered.filter(r => r.totalPoints >= filters.minPoints!);
    }
    if (filters.maxPoints) {
      filtered = filtered.filter(r => r.totalPoints <= filters.maxPoints!);
    }
    if (filters.minSales) {
      filtered = filtered.filter(r => r.propertiesSold >= filters.minSales!);
    }
    if (filters.maxSales) {
      filtered = filtered.filter(r => r.propertiesSold <= filters.maxSales!);
    }
    if (filters.minCommission) {
      filtered = filtered.filter(
        r => r.totalCommission >= filters.minCommission!
      );
    }
    if (filters.maxCommission) {
      filtered = filtered.filter(
        r => r.totalCommission <= filters.maxCommission!
      );
    }
    if (filters.userId) {
      filtered = filtered.filter(r => r.userId === filters.userId);
    }

    setFilteredRankings(filtered);

    // Filtrar rankings de equipes
    let filteredTeams = [...teams];

    if (filters.minPoints) {
      filteredTeams = filteredTeams.filter(
        t => t.totalPoints >= filters.minPoints!
      );
    }
    if (filters.maxPoints) {
      filteredTeams = filteredTeams.filter(
        t => t.totalPoints <= filters.maxPoints!
      );
    }
    if (filters.teamId) {
      filteredTeams = filteredTeams.filter(t => t.teamId === filters.teamId);
    }

    setFilteredTeamRankings(filteredTeams);
  };

  const handleFiltersChange = (newFilters: GamificationFiltersType) => {
    setFilters(newFilters);
  };

  const handleStartPresentation = (config: PresentationConfig) => {
    setPresentationConfig(config);
    setShowPresentationSettings(false);
    setPresentationMode(true);
  };

  const handleClosePresentation = () => {
    setPresentationMode(false);
    setPresentationConfig(null);
  };

  const getRankMedal = (position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
  };

  const getRankColor = (position: number) => {
    if (position === 1) return '#FFD700'; // Ouro
    if (position === 2) return '#C0C0C0'; // Prata
    if (position === 3) return '#CD7F32'; // Bronze
    return '#6b7280';
  };

  if (loading) {
    return (
      <Layout>
        <GamificationShimmer />
      </Layout>
    );
  }

  if (!selectedCompany) {
    return (
      <Layout>
        <Container>
          <DisabledCard>
            <DisabledIcon>
              <MdBusiness />
            </DisabledIcon>
            <DisabledTitle>Selecione uma Empresa</DisabledTitle>
            <DisabledText>
              Selecione uma empresa no header para visualizar a gamificação.
            </DisabledText>
          </DisabledCard>
        </Container>
      </Layout>
    );
  }

  if (config && !config.isEnabled) {
    return (
      <Layout>
        <Container>
          <DisabledCard>
            <DisabledIcon>
              <MdBlock />
            </DisabledIcon>
            <DisabledTitle>Gamificação Desativada</DisabledTitle>
            <DisabledText>
              O sistema de gamificação não está ativado para sua empresa. Entre
              em contato com o administrador para ativar.
            </DisabledText>
            <SettingsButton onClick={() => navigate('/gamification/settings')}>
              <MdSettings />
              Configurar Gamificação
            </SettingsButton>
          </DisabledCard>
        </Container>
      </Layout>
    );
  }

  if (!dashboard) {
    return (
      <Layout>
        <Container>
          <LoadingState>Carregando...</LoadingState>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        {/* Mensagem de Boas-vindas */}
        {config?.welcomeMessage && (
          <WelcomeMessage>{config.welcomeMessage}</WelcomeMessage>
        )}

        {/* Header */}
        <Header>
          <HeaderTop>
            <HeaderContent>
              <Title>Gamificação</Title>
              <Subtitle>Acompanhe seu desempenho e conquistas</Subtitle>
            </HeaderContent>
            <SettingsIconButton
              onClick={() => navigate('/gamification/settings')}
            >
              <MdSettings />
            </SettingsIconButton>
          </HeaderTop>

          <HeaderActions>
            <PeriodSelector>
              {Object.entries(ScorePeriodLabels).map(([value, label]) => (
                <PeriodButton
                  key={value}
                  $active={filters.period === value}
                  onClick={() =>
                    setFilters(prev => ({
                      ...prev,
                      period: value as ScorePeriod,
                      // Limpar filtros avançados quando selecionar período
                      startDate: undefined,
                      endDate: undefined,
                      minPoints: undefined,
                      maxPoints: undefined,
                      minSales: undefined,
                      maxSales: undefined,
                      minCommission: undefined,
                      maxCommission: undefined,
                      teamId: undefined,
                      userId: undefined,
                    }))
                  }
                >
                  {label}
                </PeriodButton>
              ))}
            </PeriodSelector>

            <GamificationFilters
              filters={filters}
              onChange={handleFiltersChange}
            />

            <PresentationButton
              onClick={() => setShowPresentationSettings(true)}
            >
              <MdFullscreen />
              Modo Apresentação
            </PresentationButton>
          </HeaderActions>
        </Header>

        {/* Presentation Settings Modal */}
        <PresentationSettings
          isOpen={showPresentationSettings}
          onClose={() => setShowPresentationSettings(false)}
          onStart={handleStartPresentation}
        />

        {/* Presentation Mode */}
        {dashboard && presentationConfig && (
          <PresentationMode
            isOpen={presentationMode}
            onClose={handleClosePresentation}
            dashboard={dashboard}
            filters={filters}
            config={presentationConfig}
          />
        )}

        {/* Cards de Métricas do Usuário */}
        <MetricsGrid>
          <MetricCard>
            <MetricIcon $color='#FFD700'>
              <MdStar />
            </MetricIcon>
            <MetricContent>
              <MetricLabel>Pontuação Total</MetricLabel>
              <MetricValue>
                {dashboard.myScore.totalPoints.toLocaleString()}
              </MetricValue>
              <MetricDetail>
                Posição: {getRankMedal(dashboard.rankings.myPosition)} de{' '}
                {dashboard.rankings.totalParticipants}
              </MetricDetail>
            </MetricContent>
          </MetricCard>

          <MetricCard>
            <MetricIcon $color='#10b981'>
              <MdAttachMoney />
            </MetricIcon>
            <MetricContent>
              <MetricLabel>Vendas</MetricLabel>
              <MetricValue>{dashboard.myScore.propertiesSold}</MetricValue>
              <MetricDetail>
                R${' '}
                {dashboard.myScore.totalSalesValue.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </MetricDetail>
            </MetricContent>
          </MetricCard>

          <MetricCard>
            <MetricIcon $color='#3b82f6'>
              <MdPeople />
            </MetricIcon>
            <MetricContent>
              <MetricLabel>Novos Clientes</MetricLabel>
              <MetricValue>{dashboard.myScore.newClientsCreated}</MetricValue>
              <MetricDetail>
                {dashboard.myScore.clientsContacted} contatos
              </MetricDetail>
            </MetricContent>
          </MetricCard>

          <MetricCard>
            <MetricIcon $color='#f59e0b'>
              <MdCheckCircle />
            </MetricIcon>
            <MetricContent>
              <MetricLabel>Atividades</MetricLabel>
              <MetricValue>{dashboard.myScore.tasksCompleted}</MetricValue>
              <MetricDetail>
                {dashboard.myScore.inspectionsCompleted} vistorias
              </MetricDetail>
            </MetricContent>
          </MetricCard>
        </MetricsGrid>

        {/* Pontos Detalhados */}
        <PointsBreakdown>
          <PointsCard>
            <PointsLabel>Pontos de Vendas</PointsLabel>
            <PointsBar>
              <PointsProgress
                $percentage={
                  (dashboard.myScore.salesPoints /
                    dashboard.myScore.totalPoints) *
                  100
                }
                $color='#10b981'
              />
            </PointsBar>
            <PointsValue>{dashboard.myScore.salesPoints} pts</PointsValue>
          </PointsCard>

          <PointsCard>
            <PointsLabel>Pontos de Relacionamento</PointsLabel>
            <PointsBar>
              <PointsProgress
                $percentage={
                  (dashboard.myScore.relationshipPoints /
                    dashboard.myScore.totalPoints) *
                  100
                }
                $color='#3b82f6'
              />
            </PointsBar>
            <PointsValue>
              {dashboard.myScore.relationshipPoints} pts
            </PointsValue>
          </PointsCard>

          <PointsCard>
            <PointsLabel>Pontos de Atividade</PointsLabel>
            <PointsBar>
              <PointsProgress
                $percentage={
                  (dashboard.myScore.activityPoints /
                    dashboard.myScore.totalPoints) *
                  100
                }
                $color='#f59e0b'
              />
            </PointsBar>
            <PointsValue>{dashboard.myScore.activityPoints} pts</PointsValue>
          </PointsCard>
        </PointsBreakdown>

        {/* Conquistas Recentes */}
        {dashboard.myAchievements.recent.length > 0 && (
          <Section>
            <SectionTitle>
              <MdVerified />
              Conquistas Recentes ({dashboard.myAchievements.total})
            </SectionTitle>
            <AchievementsGrid>
              {dashboard.myAchievements.recent.map(userAchievement => (
                <AchievementCard
                  key={userAchievement.id}
                  $tier={userAchievement.achievement.tier}
                >
                  <AchievementEmoji>
                    {userAchievement.achievement.iconEmoji}
                  </AchievementEmoji>
                  <AchievementName>
                    {userAchievement.achievement.namePt}
                  </AchievementName>
                  <AchievementDescription>
                    {userAchievement.achievement.descriptionPt}
                  </AchievementDescription>
                  <AchievementPoints>
                    +{userAchievement.pointsEarned} pontos
                  </AchievementPoints>
                  <AchievementDate>
                    {new Date(userAchievement.unlockedAt).toLocaleDateString(
                      'pt-BR'
                    )}
                  </AchievementDate>
                </AchievementCard>
              ))}
            </AchievementsGrid>
          </Section>
        )}

        {/* Rankings */}
        <Section>
          <SectionHeader>
            <SectionTitle>
              <MdTrendingUp />
              Rankings
            </SectionTitle>
            {config?.rankingMessage && (
              <RankingMessage>{config.rankingMessage}</RankingMessage>
            )}
            <TabButtons>
              <TabButton
                $active={activeTab === 'individual'}
                onClick={() => setActiveTab('individual')}
              >
                Individual
              </TabButton>
              <TabButton
                $active={activeTab === 'teams'}
                onClick={() => setActiveTab('teams')}
              >
                Equipes
              </TabButton>
            </TabButtons>
          </SectionHeader>

          {activeTab === 'individual' ? (
            <RankingTable>
              <thead>
                <tr>
                  <th style={{ width: '60px', textAlign: 'center' }}>Pos.</th>
                  <th>Usuário</th>
                  <th style={{ textAlign: 'center' }}>Vendas</th>
                  <th style={{ textAlign: 'center' }}>Clientes</th>
                  <th style={{ textAlign: 'center' }}>Atividades</th>
                  <th style={{ textAlign: 'right' }}>Pontos</th>
                </tr>
              </thead>
              <tbody>
                {(filteredRankings.length > 0
                  ? filteredRankings
                  : dashboard.rankings.top5
                ).map(score => (
                  <RankingRow
                    key={score.id}
                    $highlight={score.userId === dashboard.myScore.userId}
                  >
                    <RankCell>
                      <RankBadge $color={getRankColor(score.rankPosition!)}>
                        {getRankMedal(score.rankPosition!)}
                      </RankBadge>
                    </RankCell>
                    <UserCell>
                      <UserName>{score.user?.name || 'Usuário'}</UserName>
                      <UserEmail>{score.user?.email}</UserEmail>
                    </UserCell>
                    <DataCell>{score.propertiesSold}</DataCell>
                    <DataCell>{score.newClientsCreated}</DataCell>
                    <DataCell>{score.tasksCompleted}</DataCell>
                    <PointsCell>
                      <PointsBadge>
                        {score.totalPoints.toLocaleString()}
                      </PointsBadge>
                    </PointsCell>
                  </RankingRow>
                ))}
              </tbody>
            </RankingTable>
          ) : (
            <RankingTable>
              <thead>
                <tr>
                  <th style={{ width: '60px', textAlign: 'center' }}>Pos.</th>
                  <th>Equipe</th>
                  <th style={{ textAlign: 'center' }}>Membros</th>
                  <th style={{ textAlign: 'center' }}>Vendas</th>
                  <th style={{ textAlign: 'center' }}>Clientes</th>
                  <th style={{ textAlign: 'right' }}>Pontos</th>
                </tr>
              </thead>
              <tbody>
                {(filteredTeamRankings.length > 0
                  ? filteredTeamRankings
                  : teamRankings
                ).map(teamScore => (
                  <RankingRow key={teamScore.id}>
                    <RankCell>
                      <RankBadge $color={getRankColor(teamScore.rankPosition!)}>
                        {getRankMedal(teamScore.rankPosition!)}
                      </RankBadge>
                    </RankCell>
                    <UserCell>
                      <UserName>{teamScore.team?.name || 'Equipe'}</UserName>
                      <UserEmail>
                        Média: {teamScore.averagePointsPerMember.toFixed(0)}{' '}
                        pts/membro
                      </UserEmail>
                    </UserCell>
                    <DataCell>{teamScore.totalMembers}</DataCell>
                    <DataCell>{teamScore.propertiesSold}</DataCell>
                    <DataCell>{teamScore.newClientsCreated}</DataCell>
                    <PointsCell>
                      <PointsBadge>
                        {teamScore.totalPoints.toLocaleString()}
                      </PointsBadge>
                    </PointsCell>
                  </RankingRow>
                ))}
              </tbody>
            </RankingTable>
          )}
        </Section>
      </Container>
    </Layout>
  );
};

// Styled Components
const Container = styled.div`
  padding: 2rem;
  width: 100%;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;

  svg {
    color: #ffd700;
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
`;

const PeriodSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const PeriodButton = styled.button<{ $active: boolean }>`
  padding: 0.625rem 1rem;
  background: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.backgroundSecondary};
  color: ${props => (props.$active ? '#fff' : props.theme.colors.text)};
  border: 1px solid
    ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  height: 40px;

  &:hover {
    background: ${props =>
      props.$active
        ? props.theme.colors.primaryDark
        : props.theme.colors.hover};
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const MetricIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  border-radius: 0.75rem;
  font-size: 1.5rem;
`;

const MetricContent = styled.div`
  flex: 1;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1.2;
`;

const MetricDetail = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.25rem;
`;

const PointsBreakdown = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PointsCard = styled.div`
  padding: 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 0.75rem;
`;

const PointsLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const PointsBar = styled.div`
  height: 8px;
  background: ${props => props.theme.colors.background};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const PointsProgress = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: ${props => props.$color};
  transition: width 0.3s ease;
`;

const PointsValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  text-align: right;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1.5rem 0;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;

  ${SectionTitle} {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;

    ${SectionTitle} {
      margin-bottom: 0.5rem;
    }
  }
`;

const TabButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props =>
    props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => (props.$active ? '#fff' : props.theme.colors.text)};
  border: 1px solid
    ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props =>
      props.$active
        ? props.theme.colors.primaryDark
        : props.theme.colors.hover};
  }
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const AchievementCard = styled.div<{ $tier: string }>`
  padding: 1.5rem;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid
    ${props =>
      AchievementTierColors[props.$tier as keyof typeof AchievementTierColors]};
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 4px 12px
    ${props =>
      AchievementTierColors[
        props.$tier as keyof typeof AchievementTierColors
      ]}40;
`;

const AchievementEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`;

const AchievementName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const AchievementDescription = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const AchievementPoints = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const AchievementDate = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const RankingTable = styled.table`
  width: 100%;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};

  thead {
    background: ${props => props.theme.colors.backgroundSecondary};

    th {
      padding: 1rem;
      text-align: left;
      font-size: 0.875rem;
      font-weight: 600;
      color: ${props => props.theme.colors.textSecondary};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
`;

const RankingRow = styled.tr<{ $highlight?: boolean }>`
  background: ${props =>
    props.$highlight ? props.theme.colors.primary + '10' : 'transparent'};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props =>
      props.$highlight
        ? props.theme.colors.primary + '20'
        : props.theme.colors.hover};
  }

  td {
    padding: 1rem;
    font-size: 0.9375rem;
    color: ${props => props.theme.colors.text};
  }
`;

const RankCell = styled.td`
  text-align: center;
`;

const RankBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  border-radius: 50%;
  font-weight: 700;
  font-size: 1rem;
`;

const UserCell = styled.td``;

const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const DataCell = styled.td`
  font-weight: 600;
  text-align: center;
`;

const PointsCell = styled.td`
  text-align: right;
`;

const PointsBadge = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border-radius: 9999px;
  font-weight: 700;
  font-size: 1rem;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.25rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const WelcomeMessage = styled.div`
  padding: 1.5rem;
  background: ${props => props.theme.colors.primary}15;
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 1rem;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const RankingMessage = styled.div`
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  font-style: italic;
`;

const DisabledCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  padding: 3rem;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 1.5rem;
  text-align: center;
`;

const DisabledIcon = styled.div`
  font-size: 5rem;
  color: ${props => props.theme.colors.error};
  margin-bottom: 1.5rem;
  opacity: 0.7;
`;

const DisabledTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const DisabledText = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  max-width: 500px;
  line-height: 1.6;
`;

const SettingsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    font-size: 1.25rem;
  }

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.theme.colors.primary}40;
  }
`;

const SettingsIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;

  svg {
    font-size: 1.5rem;
    transition: transform 0.3s ease;
  }

  &:hover {
    background: ${props => props.theme.colors.hover};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}20;

    svg {
      transform: rotate(90deg);
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const PresentationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary},
    ${props => props.theme.colors.primaryDark}
  );
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  height: 40px;
  box-shadow: 0 4px 12px ${props => props.theme.colors.primary}40;

  svg {
    font-size: 1.25rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.theme.colors.primary}50;
  }

  &:active {
    transform: translateY(0);
  }
`;

export default GamificationPage;
