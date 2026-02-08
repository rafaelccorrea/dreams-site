import React from 'react';
import styled from 'styled-components';
import { MdTrendingUp, MdTrendingDown, MdRemove } from 'react-icons/md';

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const IconContainer = styled.div`
  font-size: 1.5rem;
`;

const Content = styled.div``;

const Value = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 4px;
`;

const Description = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
  margin: 4px 0 0 0;
`;

const TrendContainer = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => (props.$positive ? '#10B981' : '#EF4444')};

  svg {
    font-size: 1rem;
  }
`;

const TrendLabel = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-weight: 400;
`;

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  className,
}: StatCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <MdTrendingUp />;
    if (trend.value < 0) return <MdTrendingDown />;
    return <MdRemove />;
  };

  return (
    <Card className={className}>
      <Header>
        <Title>{title}</Title>
        {icon && <IconContainer>{icon}</IconContainer>}
      </Header>
      <Content>
        <Value>{value}</Value>
        {description && <Description>{description}</Description>}
        {trend && (
          <TrendContainer $positive={trend.value > 0}>
            {getTrendIcon()}
            <span>{Math.abs(trend.value)}%</span>
            <TrendLabel>{trend.label}</TrendLabel>
          </TrendContainer>
        )}
      </Content>
    </Card>
  );
}
