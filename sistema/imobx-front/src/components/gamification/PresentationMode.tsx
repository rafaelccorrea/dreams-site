import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  MdClose,
  MdFullscreen,
  MdStar,
  MdTrendingUp,
  MdEmojiEvents,
  MdGroups,
  MdPerson,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';
import type {
  GamificationDashboard,
  GamificationFiltersType,
} from '@/types/gamification.types';
import type { PresentationConfig } from './PresentationSettings';

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
  dashboard: GamificationDashboard;
  filters: GamificationFiltersType;
  config: PresentationConfig;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  isOpen,
  onClose,
  dashboard,
  filters,
  config,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = useMemo(() => {
    const availableSlides = [];
    if (config.showOverview) {
      availableSlides.push({ id: 'overview', title: 'Visão Geral' });
    }
    if (
      config.showTopPerformers &&
      dashboard.rankings?.individual &&
      dashboard.rankings.individual.length > 0
    ) {
      availableSlides.push({ id: 'top-performers', title: 'Top Performers' });
    }
    if (
      config.showTeams &&
      dashboard.rankings?.teams &&
      dashboard.rankings.teams.length > 0
    ) {
      availableSlides.push({ id: 'teams', title: 'Ranking de Equipes' });
    }
    return availableSlides;
  }, [config, dashboard]);

  // Reset slide quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (config.autoPlay && isOpen && slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, config.slideDuration * 1000);

      return () => clearInterval(interval);
    }
  }, [config.autoPlay, config.slideDuration, isOpen, slides.length]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const getRankMedal = (position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `${position}º`;
  };

  if (!isOpen) return null;

  return (
    <PresentationContainer>
      {/* Header Compacto */}
      <PresentationHeader>
        <HeaderLeft>
          <Logo>
            <MdEmojiEvents />
            <span>Gamificação</span>
          </Logo>
          <PeriodBadge>
            {filters.period === 'monthly'
              ? 'MENSAL'
              : filters.period === 'weekly'
                ? 'SEMANAL'
                : 'DIÁRIO'}
          </PeriodBadge>
        </HeaderLeft>
        <HeaderRight>
          <SlideIndicator>
            {currentSlide + 1} / {slides.length}
          </SlideIndicator>
          {config.autoPlay && (
            <AutoPlayBadge>
              ▶ Automático ({config.slideDuration}s)
            </AutoPlayBadge>
          )}
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </HeaderRight>
      </PresentationHeader>

      {/* Content */}
      <PresentationContent>
        {/* Slide 1: Overview */}
        {slides[currentSlide]?.id === 'overview' && (
          <SlideContainer>
            <SlideTitle>
              <MdStar />
              Visão Geral do Desempenho
            </SlideTitle>

            <MetricsGrid>
              <BigMetricCard $color='#FFD700'>
                <MetricIcon>🏆</MetricIcon>
                <MetricValue>
                  {dashboard.rankings?.totalParticipants || 0}
                </MetricValue>
                <MetricLabel>Participantes Ativos</MetricLabel>
              </BigMetricCard>

              <BigMetricCard $color='#3b82f6'>
                <MetricIcon>⭐</MetricIcon>
                <MetricValue>
                  {(dashboard.myScore?.totalPoints || 0).toLocaleString()}
                </MetricValue>
                <MetricLabel>Pontos Totais</MetricLabel>
              </BigMetricCard>

              <BigMetricCard $color='#10b981'>
                <MetricIcon>🎯</MetricIcon>
                <MetricValue>{dashboard.myScore?.sales || 0}</MetricValue>
                <MetricLabel>Vendas Realizadas</MetricLabel>
              </BigMetricCard>

              <BigMetricCard $color='#f59e0b'>
                <MetricIcon>👥</MetricIcon>
                <MetricValue>{dashboard.myScore?.clients || 0}</MetricValue>
                <MetricLabel>Novos Clientes</MetricLabel>
              </BigMetricCard>
            </MetricsGrid>

            <PointsBreakdown>
              <BreakdownTitle>Distribuição de Pontos</BreakdownTitle>

              {(() => {
                const totalPoints = dashboard.myScore?.totalPoints || 0;
                const salesPoints = dashboard.myScore?.sales || 0;
                const relationshipPoints = dashboard.myScore?.relationship || 0;
                const activitiesPoints = dashboard.myScore?.activities || 0;

                const salesPercentage =
                  totalPoints > 0 ? (salesPoints / totalPoints) * 100 : 0;
                const relationshipPercentage =
                  totalPoints > 0
                    ? (relationshipPoints / totalPoints) * 100
                    : 0;
                const activitiesPercentage =
                  totalPoints > 0 ? (activitiesPoints / totalPoints) * 100 : 0;

                return (
                  <>
                    <BreakdownBar
                      $percentage={salesPercentage}
                      $color='#10b981'
                    >
                      <BreakdownLabel>Vendas</BreakdownLabel>
                      <BreakdownValue>{salesPoints} pts</BreakdownValue>
                    </BreakdownBar>

                    <BreakdownBar
                      $percentage={relationshipPercentage}
                      $color='#3b82f6'
                    >
                      <BreakdownLabel>Relacionamento</BreakdownLabel>
                      <BreakdownValue>{relationshipPoints} pts</BreakdownValue>
                    </BreakdownBar>

                    <BreakdownBar
                      $percentage={activitiesPercentage}
                      $color='#f59e0b'
                    >
                      <BreakdownLabel>Atividades</BreakdownLabel>
                      <BreakdownValue>{activitiesPoints} pts</BreakdownValue>
                    </BreakdownBar>
                  </>
                );
              })()}
            </PointsBreakdown>
          </SlideContainer>
        )}

        {/* Slide 2: Top Performers */}
        {slides[currentSlide]?.id === 'top-performers' && (
          <SlideContainer>
            <SlideTitle>
              <MdTrendingUp />
              Top Performers Individuais
            </SlideTitle>

            <PodiumContainer>
              {dashboard.rankings?.individual
                ?.slice(0, 3)
                .map((user, index) => (
                  <PodiumCard key={user.userId} $position={index + 1}>
                    <PodiumPosition>{getRankMedal(index + 1)}</PodiumPosition>
                    <PodiumAvatar>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <MdPerson />
                      )}
                    </PodiumAvatar>
                    <PodiumName>{user.name}</PodiumName>
                    <PodiumPoints>
                      {user.totalPoints.toLocaleString()} pts
                    </PodiumPoints>
                    <PodiumDetails>
                      <span>{user.sales} vendas</span>
                      <span>{user.clients} clientes</span>
                    </PodiumDetails>
                  </PodiumCard>
                ))}
            </PodiumContainer>
          </SlideContainer>
        )}

        {/* Slide 3: Teams */}
        {slides[currentSlide]?.id === 'teams' && (
          <SlideContainer>
            <SlideTitle>
              <MdGroups />
              Ranking de Equipes
            </SlideTitle>

            <TeamsGrid>
              {dashboard.rankings?.teams?.slice(0, 6).map((team, index) => (
                <TeamCard key={team.teamId} $position={index + 1}>
                  <TeamPosition>{getRankMedal(index + 1)}</TeamPosition>
                  <TeamName>{team.name}</TeamName>
                  <TeamPoints>
                    {team.totalPoints.toLocaleString()} pts
                  </TeamPoints>
                  <TeamMembers>{team.members} membros</TeamMembers>
                  <TeamPerformance>
                    <span>{team.sales} vendas</span>
                    <span>{team.clients} clientes</span>
                  </TeamPerformance>
                </TeamCard>
              ))}
            </TeamsGrid>
          </SlideContainer>
        )}
      </PresentationContent>

      {/* Footer Compacto */}
      <PresentationFooter>
        <NavigationButton onClick={prevSlide} disabled={currentSlide === 0}>
          <MdChevronLeft />
        </NavigationButton>

        <SlideDots>
          {slides.map((_, index) => (
            <SlideDot
              key={index}
              $active={index === currentSlide}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </SlideDots>

        <NavigationButton
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          <MdChevronRight />
        </NavigationButton>

        <HelpText>
          Navegue com ← → ou clique nos botões | ESC para sair
        </HelpText>
      </PresentationFooter>
    </PresentationContainer>
  );
};

// Animações
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Container Principal em tela inteira
const PresentationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  flex-direction: column;
  z-index: 9999;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
`;

// Header mais compacto
const PresentationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 60px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fbbf24;
  font-weight: 700;
  font-size: 1rem;

  svg {
    font-size: 1.25rem;
  }
`;

const PeriodBadge = styled.div`
  padding: 0.25rem 0.5rem;
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const SlideIndicator = styled.div`
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const AutoPlayBadge = styled.div`
  padding: 0.25rem 0.5rem;
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    font-size: 1rem;
  }

  &:hover {
    background: rgba(239, 68, 68, 0.3);
    transform: scale(1.05);
  }
`;

// Content com padding reduzido
const PresentationContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
`;

const SlideContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  animation: ${slideIn} 0.5s ease-out;
`;

// Título com tamanho reduzido
const SlideTitle = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 2rem 0;
  text-align: center;
  justify-content: center;

  svg {
    font-size: 2.25rem;
    color: #fbbf24;
  }
`;

// Grid com tamanhos reduzidos
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const BigMetricCard = styled.div<{ $color: string }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid ${props => props.$color}40;
  border-radius: 1.25rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const MetricIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.75rem;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: #a1a1aa;
  font-weight: 500;
`;

// Breakdown com tamanhos reduzidos
const PointsBreakdown = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const BreakdownTitle = styled.h3`
  font-size: 1rem;
  color: #ffffff;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
`;

const BreakdownBar = styled.div<{ $percentage: number; $color: string }>`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  gap: 0.75rem;

  &::before {
    content: '';
    width: ${props => props.$percentage}%;
    height: 8px;
    background: ${props => props.$color};
    border-radius: 4px;
    transition: width 0.8s ease;
  }
`;

const BreakdownLabel = styled.div`
  font-size: 0.75rem;
  color: #ffffff;
  font-weight: 500;
  min-width: 80px;
`;

const BreakdownValue = styled.div`
  font-size: 0.75rem;
  color: #a1a1aa;
  font-weight: 600;
  margin-left: auto;
`;

// Podium com tamanhos reduzidos
const PodiumContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const PodiumCard = styled.div<{ $position: number }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  border: 2px solid
    ${props =>
      props.$position === 1
        ? '#FFD700'
        : props.$position === 2
          ? '#C0C0C0'
          : '#CD7F32'}40;
  transition: all 0.3s ease;
  min-width: 140px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const PodiumPosition = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const PodiumAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  font-size: 1.5rem;
  color: #a1a1aa;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const PodiumName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.25rem;
`;

const PodiumPoints = styled.div`
  font-size: 1rem;
  font-weight: 800;
  color: #fbbf24;
  margin-bottom: 0.5rem;
`;

const PodiumDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #a1a1aa;
`;

// Teams com tamanhos reduzidos
const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TeamCard = styled.div<{ $position: number }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1rem;
  border: 2px solid
    ${props =>
      props.$position === 1
        ? '#FFD700'
        : props.$position === 2
          ? '#C0C0C0'
          : props.$position === 3
            ? '#CD7F32'
            : 'rgba(255, 255, 255, 0.1)'}40;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const TeamPosition = styled.div`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const TeamName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const TeamPoints = styled.div`
  font-size: 1rem;
  font-weight: 800;
  color: #fbbf24;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const TeamMembers = styled.div`
  font-size: 0.75rem;
  color: #a1a1aa;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const TeamPerformance = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #a1a1aa;
`;

// Footer mais compacto
const PresentationFooter = styled.div`
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  min-height: 60px;
`;

const NavigationButton = styled.button`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
  }
`;

const SlideDots = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const SlideDot = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props =>
    props.$active ? '#fbbf24' : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: ${props =>
      props.$active ? '#fbbf24' : 'rgba(255, 255, 255, 0.5)'};
  }
`;

const HelpText = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  text-align: center;
  margin-left: 1rem;
`;
