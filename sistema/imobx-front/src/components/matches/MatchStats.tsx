/**
 * Componente de Estatísticas de Matches
 * Cards com métricas principais do sistema de matches
 */

import React from 'react';
import styled from 'styled-components';
import type { MatchSummary } from '../../types/match';

interface MatchStatsProps {
  summary: MatchSummary | null;
  loading?: boolean;
}

export const MatchStats: React.FC<MatchStatsProps> = ({
  summary,
  loading = false,
}) => {
  // Mostrar shimmer se estiver carregando
  if (loading) {
    return (
      <StatsGrid>
        {[...Array(4)].map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </StatsGrid>
    );
  }

  // Não mostrar nada se não tiver dados
  if (!summary) {
    return null;
  }
  return (
    <StatsGrid>
      <StatCard $color='#3498db'>
        <StatIcon>📊</StatIcon>
        <StatContent>
          <StatValue>{summary.total}</StatValue>
          <StatLabel>Total de Matches</StatLabel>
        </StatContent>
      </StatCard>

      <StatCard $color='#FFA500'>
        <StatIcon>⏳</StatIcon>
        <StatContent>
          <StatValue>{summary.pending}</StatValue>
          <StatLabel>Pendentes</StatLabel>
        </StatContent>
      </StatCard>

      <StatCard $color='#ef4444'>
        <StatIcon>⭐</StatIcon>
        <StatContent>
          <StatValue>{summary.highScore}</StatValue>
          <StatLabel>Alta Compatibilidade</StatLabel>
          <StatHint>(Score ≥ 80%)</StatHint>
        </StatContent>
      </StatCard>

      <StatCard $color='#10b981'>
        <StatIcon>✅</StatIcon>
        <StatContent>
          <StatValue>{summary.accepted}</StatValue>
          <StatLabel>Aceitos</StatLabel>
        </StatContent>
      </StatCard>
    </StatsGrid>
  );
};

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div<{ $color: string }>`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-left: 4px solid ${({ $color }) => $color};
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
  }
`;

const StatIcon = styled.div`
  font-size: 36px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const StatHint = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
  opacity: 0.8;
`;

const StatCardSkeleton = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  animation: pulse 2s infinite;

  &::before {
    content: '';
    width: 36px;
    height: 36px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: 8px;
    animation: shimmer 1.5s infinite;
  }

  &::after {
    content: '';
    flex: 1;
    height: 40px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: 8px;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;

    &::before {
      width: 32px;
      height: 32px;
    }

    &::after {
      height: 36px;
    }
  }
`;

export default MatchStats;
