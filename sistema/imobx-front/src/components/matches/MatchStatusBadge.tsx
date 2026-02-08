/**
 * Badge de status do match
 */

import React from 'react';
import styled from 'styled-components';
import type { MatchStatus } from '../../types/match';
import { MATCH_STATUS_LABELS } from '../../types/match';

interface MatchStatusBadgeProps {
  status: MatchStatus;
}

export function MatchStatusBadge({ status }: MatchStatusBadgeProps) {
  const config = MATCH_STATUS_LABELS[status];

  return (
    <Badge $color={config.color}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </Badge>
  );
}

const Badge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;

  ${props => {
    switch (props.$color) {
      case 'green':
        return `
          background-color: #D1FAE5;
          color: #065F46;
        `;
      case 'blue':
        return `
          background-color: #DBEAFE;
          color: #1E40AF;
        `;
      case 'yellow':
        return `
          background-color: #FEF3C7;
          color: #92400E;
        `;
      case 'purple':
        return `
          background-color: #E9D5FF;
          color: #6B21A8;
        `;
      case 'red':
        return `
          background-color: #FEE2E2;
          color: #991B1B;
        `;
      case 'gray':
      default:
        return `
          background-color: #F3F4F6;
          color: #374151;
        `;
    }
  }}
`;
