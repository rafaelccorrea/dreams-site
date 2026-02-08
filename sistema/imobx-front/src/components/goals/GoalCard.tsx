import React from 'react';
import styled from 'styled-components';
import {
  MdAnalytics,
  MdContentCopy,
  MdEdit,
  MdDelete,
  MdRefresh,
  MdTrendingUp,
  MdTrendingDown,
  MdCalendarToday,
} from 'react-icons/md';
import type { Goal } from '../../types/goal';
import {
  GOAL_TYPE_LABELS,
  GOAL_PERIOD_LABELS,
  GOAL_SCOPE_LABELS,
} from '../../types/goal';

interface GoalCardProps {
  goal: Goal;
  onAnalytics: (goal: Goal) => void;
  onDuplicate: (goal: Goal) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  onRefresh: (goal: Goal) => void;
}

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Icon = styled.span`
  font-size: 24px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const ProgressSection = styled.div`
  margin-bottom: 20px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ProgressLabel = styled.span`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ProgressValue = styled.span<{ $isOnTrack: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${props => (props.$isOnTrack ? '#10B981' : '#F59E0B')};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgressFill = styled.div<{ $progress: number; $isOnTrack: boolean }>`
  width: ${props => Math.min(props.$progress, 100)}%;
  height: 100%;
  background: ${props =>
    props.$isOnTrack
      ? 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
      : 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)'};
  border-radius: 12px;
  transition: width 0.5s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const StatItem = styled.div<{ $highlight?: boolean }>`
  background: ${props =>
    props.$highlight
      ? 'linear-gradient(135deg, #3B82F615 0%, #8B5CF615 100%)'
      : props.theme.colors.background};
  padding: 12px;
  border-radius: 12px;
  border: 1px solid
    ${props => (props.$highlight ? '#3B82F640' : props.theme.colors.border)};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    font-size: 14px;
  }
`;

const StatValue = styled.div<{ $color?: string }>`
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.$color || props.theme.colors.text};
`;

const StatSubtext = styled.div`
  font-size: 10px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 2px;
`;

const InfoSection = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;

  &:not(:last-child) {
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const InfoLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    font-size: 14px;
  }
`;

const InfoValue = styled.span<{ $color?: string; $bold?: boolean }>`
  color: ${props => props.$color || props.theme.colors.text};
  font-weight: ${props => (props.$bold ? 700 : 500)};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 16px;
`;

const StatusBadge = styled.span<{ $isOnTrack: boolean }>`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => (props.$isOnTrack ? '#10B98115' : '#F59E0B15')};
  color: ${props => (props.$isOnTrack ? '#10B981' : '#F59E0B')};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const BadgeGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const InfoBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }

  svg {
    font-size: 16px;
  }
`;

const SmallActionButton = styled(ActionButton)`
  flex: none;
  width: 40px;
  padding: 10px;
`;

const DangerButton = styled(ActionButton)`
  color: #ef4444;
  border-color: #ef444420;

  &:hover {
    background: #ef444410;
    border-color: #ef4444;
  }
`;

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onAnalytics,
  onDuplicate,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const formatValue = (value: number, type: string): string => {
    if (type.includes('value') || type === 'revenue') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }

    if (type === 'conversion_rate') {
      return `${value.toFixed(1)}%`;
    }

    return value.toLocaleString('pt-BR');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const getProjectionStatus = () => {
    if (goal.projectedValue >= goal.targetValue) {
      return {
        color: '#10B981',
        icon: <MdTrendingUp />,
        text: 'Projeção positiva',
      };
    }
    return {
      color: '#EF4444',
      icon: <MdTrendingDown />,
      text: 'Projeção abaixo',
    };
  };

  const projection = getProjectionStatus();

  return (
    <Card>
      <CardHeader>
        <TitleSection>
          <Title>
            {goal.icon && <Icon>{goal.icon}</Icon>}
            {goal.title}
          </Title>
          <Subtitle>{GOAL_TYPE_LABELS[goal.type]}</Subtitle>
        </TitleSection>
      </CardHeader>

      {/* Badges de info */}
      <BadgeGroup style={{ marginBottom: '16px' }}>
        <InfoBadge>📅 {GOAL_PERIOD_LABELS[goal.period]}</InfoBadge>
        <InfoBadge>🎯 {GOAL_SCOPE_LABELS[goal.scope]}</InfoBadge>
        <InfoBadge>
          <MdCalendarToday
            style={{
              fontSize: '11px',
              verticalAlign: 'middle',
              marginRight: '2px',
            }}
          />
          {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
        </InfoBadge>
      </BadgeGroup>

      <ProgressSection>
        <ProgressHeader>
          <ProgressLabel>Progresso</ProgressLabel>
          <ProgressValue $isOnTrack={goal.isOnTrack}>
            {goal.progress.toFixed(1)}%
          </ProgressValue>
        </ProgressHeader>
        <ProgressBar>
          <ProgressFill $progress={goal.progress} $isOnTrack={goal.isOnTrack} />
        </ProgressBar>
      </ProgressSection>

      <StatsGrid>
        <StatItem>
          <StatLabel>🎯 Meta</StatLabel>
          <StatValue>{formatValue(goal.targetValue, goal.type)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>💰 Atual</StatLabel>
          <StatValue $color='#10B981'>
            {formatValue(goal.currentValue, goal.type)}
          </StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>📉 Restante</StatLabel>
          <StatValue $color='#F59E0B'>
            {formatValue(goal.remaining, goal.type)}
          </StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>📊 Meta Diária</StatLabel>
          <StatValue>{formatValue(goal.dailyTarget, goal.type)}</StatValue>
          <StatSubtext>necessário/dia</StatSubtext>
        </StatItem>
      </StatsGrid>

      {/* Informações de Projeção e Tempo */}
      <InfoSection>
        <InfoRow>
          <InfoLabel>
            {projection.icon}
            {projection.text}
          </InfoLabel>
          <InfoValue $color={projection.color} $bold>
            {formatValue(goal.projectedValue, goal.type)}
          </InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>⏱️ Tempo decorrido</InfoLabel>
          <InfoValue>
            {goal.daysElapsed} de {goal.daysTotal} dias (
            {((goal.daysElapsed / goal.daysTotal) * 100).toFixed(0)}%)
          </InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>⏳ Dias restantes</InfoLabel>
          <InfoValue
            $color={goal.daysRemaining <= 7 ? '#EF4444' : undefined}
            $bold={goal.daysRemaining <= 7}
          >
            {goal.daysRemaining} {goal.daysRemaining === 1 ? 'dia' : 'dias'}
          </InfoValue>
        </InfoRow>
      </InfoSection>

      <Footer>
        <StatusBadge $isOnTrack={goal.isOnTrack}>
          {goal.isOnTrack ? '✓ No caminho' : '⚠ Atenção'}
        </StatusBadge>
        <InfoBadge style={{ textTransform: 'uppercase' }}>
          {goal.status === 'active'
            ? '🟢 Ativa'
            : goal.status === 'completed'
              ? '🏆 Completada'
              : goal.status === 'failed'
                ? '❌ Falhou'
                : '📝 Rascunho'}
        </InfoBadge>
      </Footer>

      <ActionsRow>
        <ActionButton onClick={() => onAnalytics(goal)}>
          <MdAnalytics />
          Análise
        </ActionButton>
        <ActionButton onClick={() => onEdit(goal)}>
          <MdEdit />
          Editar
        </ActionButton>
        <SmallActionButton
          onClick={() => onDuplicate(goal)}
          title='Duplicar meta'
        >
          <MdContentCopy />
        </SmallActionButton>
        <SmallActionButton
          onClick={() => onRefresh(goal)}
          title='Atualizar progresso'
        >
          <MdRefresh />
        </SmallActionButton>
        <DangerButton
          as={SmallActionButton}
          onClick={() => onDelete(goal)}
          title='Excluir meta'
        >
          <MdDelete />
        </DangerButton>
      </ActionsRow>
    </Card>
  );
};
