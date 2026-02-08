import React, { useMemo } from 'react';
import styled from 'styled-components';
import { ensureChartRegistration } from './chartConfig';
import { SafeChartWrapper } from './ChartProvider';

ensureChartRegistration();

const ChartFunnelContainer = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
`;

const ChartFunnelStage = styled.div<{
  $width: number;
  $marginLeft: number;
  $color: string;
  $index: number;
  $isFirst: boolean;
  $isLast: boolean;
}>`
  position: relative;
  width: ${props => props.$width}%;
  margin-left: ${props => props.$marginLeft}%;
  margin-right: ${props => props.$marginLeft}%;
  min-height: 100px;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: visible;
  border-radius: ${props =>
    props.$isFirst
      ? '12px 12px 4px 4px'
      : props.$isLast
        ? '4px 4px 12px 12px'
        : '4px'};

  &:hover {
    transform: scale(1.02) translateY(-2px);
    box-shadow:
      0 8px 20px rgba(0, 0, 0, 0.2),
      0 4px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }
`;

const StageBackground = styled.div<{ $color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    ${props => props.$color} 0%,
    ${props => props.$color}dd 100%
  );
  z-index: 0;

  /* Linha decorativa lateral */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 5px;
    background: ${props => props.$color};
    opacity: 0.9;
    border-radius: 5px 0 0 5px;
  }
`;

const StageContent = styled.div<{ $paddingHorizontal: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  position: relative;
  z-index: 1;
  padding: 20px ${props => props.$paddingHorizontal}px;
  min-height: 90px;
  box-sizing: border-box;
  width: 100%;
  overflow: visible;

  /* Garantir que o conteúdo seja visível */
  & > * {
    overflow: visible;
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
  }
`;

const StageInfo = styled.div`
  flex: 1;
  min-width: 0; /* Permite que o flex item encolha */
  overflow: visible;
  padding-right: 12px;
`;

const StageName = styled.h3`
  margin: 0 0 6px 0;
  font-size: 15px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.3;
  hyphens: auto;
`;

const StageCount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 4px;
  line-height: 1.2;
`;

const StageRates = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 10px;
  opacity: 0.95;
  margin-top: 8px;
  max-width: 100%;
`;

const RateBadge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 3px 6px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
  font-weight: 500;
  white-space: nowrap;
  font-size: 10px;
`;

const StagePercentage = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: white;
  text-align: right;
  min-width: 70px;
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.textSecondary};

  h4 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }

  p {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
  }
`;

export interface FunnelStage {
  name: string;
  count: number;
  conversionRate: number | null;
  conversionRateFromTotal: number;
}

interface FunnelChartProps {
  stages: FunnelStage[];
  totalLeads: number;
  loading?: boolean;
  emptyMessage?: string;
}

const FunnelChart: React.FC<FunnelChartProps> = ({
  stages,
  totalLeads,
  loading = false,
  emptyMessage = 'Nenhum dado do funil disponível',
}) => {
  const processedStages = useMemo(() => {
    if (!stages || stages.length === 0) return [];

    // Manter ordem original para preservar a sequência do funil
    const totalStages = stages.length;

    // Calcular larguras para criar formato de funil sem clip-path
    // Cada etapa fica progressivamente mais estreita
    return stages.map((stage, index) => {
      // Calcular largura baseada na posição no funil
      // Primeira etapa: 100%, depois reduz progressivamente
      const width = index === 0 ? 100 : 100 - index * (100 / totalStages) * 0.4;

      // Garantir largura mínima
      const finalWidth = Math.max(Math.min(width, 100), 35);

      // Calcular margem esquerda para centralizar
      const marginLeft = (100 - finalWidth) / 2;

      return {
        ...stage,
        width: finalWidth,
        marginLeft: marginLeft,
        index,
      };
    });
  }, [stages]);

  const colors = [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#F59E0B', // Orange
    '#10B981', // Green
    '#06B6D4', // Cyan
    '#EF4444', // Red
  ];

  if (loading) {
    return (
      <ChartFunnelContainer>
        <EmptyState>
          <h4>Carregando...</h4>
          <p>Preparando dados do funil</p>
        </EmptyState>
      </ChartFunnelContainer>
    );
  }

  if (!stages || stages.length === 0) {
    return (
      <ChartFunnelContainer>
        <EmptyState>
          <h4>📊 {emptyMessage}</h4>
          <p>
            Os dados do funil aparecerão quando houver informações disponíveis
          </p>
        </EmptyState>
      </ChartFunnelContainer>
    );
  }

  return (
    <ChartFunnelContainer>
      <SafeChartWrapper
        fallback={
          <EmptyState>
            <h4>Carregando...</h4>
            <p>Preparando funil</p>
          </EmptyState>
        }
      >
        {processedStages.map((stage, index) => {
          const color = colors[index % colors.length];
          const isFirst = index === 0;
          const isLast = index === processedStages.length - 1;

          // Calcular padding horizontal baseado na largura
          let paddingHorizontal = 24;

          if (stage.width < 50) {
            paddingHorizontal = 20;
          } else if (stage.width < 70) {
            paddingHorizontal = 22;
          } else {
            paddingHorizontal = 24;
          }

          return (
            <ChartFunnelStage
              key={stage.name || index}
              $width={stage.width}
              $marginLeft={stage.marginLeft}
              $color={color}
              $index={index}
              $isFirst={isFirst}
              $isLast={isLast}
            >
              <StageBackground $color={color} />
              <StageContent $paddingHorizontal={paddingHorizontal}>
                <StageInfo>
                  <StageName>{stage.name || `Etapa ${index + 1}`}</StageName>
                  <StageCount>{stage.count.toLocaleString('pt-BR')}</StageCount>
                  <StageRates>
                    {stage.conversionRate !== null &&
                      !isNaN(stage.conversionRate) && (
                        <RateBadge>
                          {stage.conversionRate.toFixed(1)}% da etapa anterior
                        </RateBadge>
                      )}
                    <RateBadge>
                      {stage.conversionRateFromTotal.toFixed(1)}% do total
                    </RateBadge>
                  </StageRates>
                </StageInfo>
                <StagePercentage>
                  {totalLeads > 0
                    ? ((stage.count / totalLeads) * 100).toFixed(1)
                    : 0}
                  %
                </StagePercentage>
              </StageContent>
            </ChartFunnelStage>
          );
        })}
      </SafeChartWrapper>
    </ChartFunnelContainer>
  );
};

export default FunnelChart;
