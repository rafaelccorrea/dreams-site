import React from 'react';
import styled from 'styled-components';
import { MdStar, MdTrendingUp, MdPerson } from 'react-icons/md';
import { InfoTooltip } from '../common/InfoTooltip';
import { formatCurrency } from '../../utils/formatNumbers';

interface Performer {
  userId: string;
  name: string;
  avatar?: string;
  sales: number;
  revenue: number;
  growth: number;
  rank: number;
  conversions?: number;
  leads?: number;
}

interface TopPerformersWidgetProps {
  performers?: Performer[];
}

const mockPerformers: Performer[] = [
  {
    userId: '1',
    name: 'João Silva',
    sales: 12,
    revenue: 2400000,
    growth: 25,
    rank: 1,
  },
  {
    userId: '2',
    name: 'Maria Santos',
    sales: 10,
    revenue: 1950000,
    growth: 18,
    rank: 2,
  },
  {
    userId: '3',
    name: 'Pedro Costa',
    sales: 8,
    revenue: 1600000,
    growth: 15,
    rank: 3,
  },
];

const TopPerformersWidget: React.FC<TopPerformersWidgetProps> = ({
  performers = mockPerformers,
}) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return '#8B5CF6';
    }
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '⭐';
    }
  };

  return (
    <Widget>
      <WidgetHeader>
        <HeaderLeft>
          <HeaderIcon>
            <MdStar />
          </HeaderIcon>
          <WidgetTitle>Top Performers do Mês</WidgetTitle>
        </HeaderLeft>
        <InfoTooltip content='Ranking dos corretores com melhor performance no mês, baseado em vendas, receita gerada e crescimento percentual.' />
      </WidgetHeader>

      {performers.length > 0 ? (
        <PerformersList>
          {performers.map(performer => (
            <PerformerCard key={performer.userId}>
              <PerformerRank $color={getRankColor(performer.rank)}>
                <RankEmoji>{getRankEmoji(performer.rank)}</RankEmoji>
                <RankNumber>#{performer.rank}</RankNumber>
              </PerformerRank>

              <PerformerInfo>
                <PerformerAvatar>
                  {performer.avatar ? (
                    <img src={performer.avatar} alt={performer.name} />
                  ) : (
                    <MdPerson size={24} />
                  )}
                </PerformerAvatar>
                <PerformerDetails>
                  <PerformerName>{performer.name}</PerformerName>
                  <PerformerStats>
                    <StatItem>
                      <StatValue>{performer.sales}</StatValue>
                      <StatLabel>vendas</StatLabel>
                    </StatItem>
                    <StatDivider>•</StatDivider>
                    <StatItem>
                      <StatValue>{formatCurrency(performer.revenue)}</StatValue>
                      <StatLabel>receita</StatLabel>
                    </StatItem>
                  </PerformerStats>
                </PerformerDetails>
              </PerformerInfo>

              <PerformerGrowth $positive={performer.growth > 0}>
                <MdTrendingUp size={16} />
                {performer.growth}%
              </PerformerGrowth>
            </PerformerCard>
          ))}
        </PerformersList>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <MdStar size={48} />
          </EmptyIcon>
          <EmptyTitle>Nenhum performer encontrado</EmptyTitle>
          <EmptyDescription>
            Não há dados de performance para o período selecionado.
            <br />
            Os rankings aparecerão quando houver vendas registradas.
          </EmptyDescription>
        </EmptyState>
      )}
    </Widget>
  );
};

export default TopPerformersWidget;

// Styled Components
const Widget = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  height: 100%;

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 10px;
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const HeaderIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ffd700, #ffa500);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }
`;

const WidgetTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const PerformersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const PerformerCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;
  min-width: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    padding: 12px;
    gap: 10px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    gap: 8px;
    border-radius: 8px;
  }
`;

const PerformerRank = styled.div<{ $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    min-width: 32px;
  }
`;

const RankEmoji = styled.div`
  font-size: 24px;
  margin-bottom: 4px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 2px;
  }
`;

const RankNumber = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const PerformerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const PerformerAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
  }
`;

const PerformerDetails = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const PerformerName = styled.div`
  font-size: 0.938rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    margin-bottom: 3px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 2px;
  }
`;

const PerformerStats = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

const StatValue = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
`;

const StatDivider = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;

  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
`;

const PerformerGrowth = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${props => (props.$positive ? '#10B98120' : '#EF444420')};
  color: ${props => (props.$positive ? '#10B981' : '#EF4444')};
  flex-shrink: 0;
  white-space: nowrap;
  margin-left: auto;

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 0.75rem;
    gap: 3px;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  @media (max-width: 480px) {
    padding: 3px 6px;
    font-size: 0.7rem;
    gap: 2px;

    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  min-height: 200px;
`;

const EmptyIcon = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  line-height: 1.5;
  max-width: 280px;
`;
