/**
 * Componente para exibir o score do match visualmente
 */

import React from 'react';
import styled from 'styled-components';

interface MatchScoreIndicatorProps {
  score: number; // 0-100
  size?: 'small' | 'medium' | 'large';
}

const getScoreConfig = (score: number) => {
  if (score >= 80) {
    return {
      color: '#10B981',
      bgColor: '#D1FAE5',
      label: 'Excelente',
      emoji: '🎯',
    };
  }
  if (score >= 60) {
    return {
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      label: 'Bom',
      emoji: '👍',
    };
  }
  if (score >= 40) {
    return {
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      label: 'Regular',
      emoji: '⚡',
    };
  }
  return {
    color: '#EF4444',
    bgColor: '#FEE2E2',
    label: 'Baixo',
    emoji: '⚠️',
  };
};

export function MatchScoreIndicator({
  score,
  size = 'medium',
}: MatchScoreIndicatorProps) {
  const config = getScoreConfig(score);

  return (
    <Container $bgColor={config.bgColor} $color={config.color} $size={size}>
      <ScoreNumber $size={size}>{score}</ScoreNumber>
      <ScoreInfo $size={size}>
        <ScoreLabel>{config.label}</ScoreLabel>
        <ScoreMax>de 100</ScoreMax>
      </ScoreInfo>
      <Emoji>{config.emoji}</Emoji>
    </Container>
  );
}

const Container = styled.div<{
  $bgColor: string;
  $color: string;
  $size: string;
}>`
  display: inline-flex;
  align-items: center;
  gap: ${props => (props.$size === 'small' ? '0.5rem' : '0.75rem')};
  padding: ${props => {
    if (props.$size === 'small') return '0.375rem 0.75rem';
    if (props.$size === 'large') return '0.75rem 1.25rem';
    return '0.5rem 1rem';
  }};
  background-color: ${props => props.$bgColor};
  color: ${props => props.$color};
  border-radius: 9999px;
  font-weight: 600;
`;

const ScoreNumber = styled.span<{ $size: string }>`
  font-size: ${props => {
    if (props.$size === 'small') return '1.25rem';
    if (props.$size === 'large') return '2rem';
    return '1.5rem';
  }};
  font-weight: 700;
  line-height: 1;
`;

const ScoreInfo = styled.div<{ $size: string }>`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  font-size: ${props => (props.$size === 'small' ? '0.625rem' : '0.75rem')};
`;

const ScoreLabel = styled.div`
  font-weight: 600;
  line-height: 1;
`;

const ScoreMax = styled.div`
  opacity: 0.75;
  line-height: 1;
`;

const Emoji = styled.span`
  font-size: 1.25rem;
`;
