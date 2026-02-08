import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdLocalFireDepartment, MdWhatshot, MdAcUnit } from 'react-icons/md';
import { useLeadClassification } from '../../hooks/useLeadClassification';
import type { LeadClassificationResponse } from '../../services/aiAssistantApi';

const Badge = styled.span<{ $classification: 'hot' | 'warm' | 'cold' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: help;
  transition: all 0.2s ease;
  margin-left: 6px; /* avoid overlapping with previous badges (e.g., MatchesBadge) */

  ${props => {
    const theme = props.theme;
    const isDark = theme.mode === 'dark';

    switch (props.$classification) {
      case 'hot':
        return `
          background-color: ${isDark ? '#7f1d1d' : '#fee2e2'};
          color: ${isDark ? '#fca5a5' : '#991b1b'};
          border: 1px solid ${isDark ? '#991b1b' : '#fecaca'};
        `;
      case 'warm':
        return `
          background-color: ${isDark ? '#78350f' : '#fef3c7'};
          color: ${isDark ? '#fbbf24' : '#92400e'};
          border: 1px solid ${isDark ? '#92400e' : '#fde68a'};
        `;
      case 'cold':
        return `
          background-color: ${isDark ? '#1e3a8a' : '#dbeafe'};
          color: ${isDark ? '#93c5fd' : '#1e40af'};
          border: 1px solid ${isDark ? '#1e40af' : '#bfdbfe'};
        `;
      default:
        return `
          background-color: ${isDark ? '#374151' : '#f3f4f6'};
          color: ${isDark ? '#9ca3af' : '#6b7280'};
          border: 1px solid ${isDark ? '#4b5563' : '#e5e7eb'};
        `;
    }
  }}

  &:hover {
    transform: scale(1.05);
  }
`;

const Tooltip = styled.div<{ $show: boolean }>`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  max-width: 280px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 2000;
  pointer-events: none; /* prevent covering sibling badges */
  display: ${props => (props.$show ? 'block' : 'none')};
`;

const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TooltipRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const BadgeContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

interface LeadClassificationBadgeProps {
  clientId: string;
  autoLoad?: boolean;
}

export const LeadClassificationBadge: React.FC<
  LeadClassificationBadgeProps
> = ({ clientId, autoLoad = true }) => {
  const { classify, loading } = useLeadClassification();
  const [classification, setClassification] =
    useState<LeadClassificationResponse | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (autoLoad && !hasLoaded && !loading && clientId) {
      const loadClassification = async () => {
        if (hasLoaded || loading) return;

        setHasLoaded(true);
        const result = await classify({ clientId });

        if (result && !Array.isArray(result)) {
          setClassification(result);
        }
      };

      loadClassification();
    }
  }, [clientId, autoLoad, hasLoaded, loading, classify]);

  if (loading && !classification) {
    return null;
  }

  if (!classification) {
    return null;
  }

  const getIcon = () => {
    switch (classification.classification) {
      case 'hot':
        return <MdLocalFireDepartment size={14} />;
      case 'warm':
        return <MdWhatshot size={14} />;
      case 'cold':
        return <MdAcUnit size={14} />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (classification.classification) {
      case 'hot':
        return 'Quente';
      case 'warm':
        return 'Morno';
      case 'cold':
        return 'Frio';
      default:
        return classification.classification;
    }
  };

  return (
    <BadgeContainer
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Badge $classification={classification.classification}>
        {getIcon()}
        {getLabel()} ({classification.qualityScore}%)
      </Badge>
      <Tooltip $show={showTooltip}>
        <TooltipContent>
          <TooltipRow>
            <strong>Score:</strong> {classification.qualityScore}%
          </TooltipRow>
          <TooltipRow>
            <strong>Conversão:</strong> {classification.conversionProbability}%
          </TooltipRow>
          <TooltipRow>
            <strong>Razão:</strong> {classification.classificationReason}
          </TooltipRow>
          {classification.estimatedDealValue && (
            <TooltipRow>
              <strong>Valor Estimado:</strong>{' '}
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(classification.estimatedDealValue)}
            </TooltipRow>
          )}
        </TooltipContent>
      </Tooltip>
    </BadgeContainer>
  );
};
