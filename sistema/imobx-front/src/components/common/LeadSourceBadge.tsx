import React from 'react';
import styled from 'styled-components';
import {
  ClientSource,
  CLIENT_SOURCE_LABELS,
  CLIENT_SOURCE_COLORS,
} from '../../types/client';

interface LeadSourceBadgeProps {
  source?: string;
  showLabel?: boolean;
}

const Badge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  white-space: nowrap;
`;

const EmptyBadge = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 13px;
`;

export const LeadSourceBadge: React.FC<LeadSourceBadgeProps> = ({
  source,
  showLabel = true,
}) => {
  if (!source) {
    return <EmptyBadge>-</EmptyBadge>;
  }

  const color = CLIENT_SOURCE_COLORS[source] || '#9CA3AF';
  const label = CLIENT_SOURCE_LABELS[source] || source;

  return <Badge $color={color}>{showLabel && label}</Badge>;
};
