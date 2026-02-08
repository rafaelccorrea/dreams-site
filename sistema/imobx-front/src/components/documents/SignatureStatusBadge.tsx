import React from 'react';
import styled from 'styled-components';
import {
  DocumentSignatureStatus,
  DocumentSignatureStatusLabels,
  SignatureStatusColors,
  SignatureStatusIcons,
} from '../../types/documentSignature';

interface SignatureStatusBadgeProps {
  status: DocumentSignatureStatus;
  showIcon?: boolean;
  className?: string;
}

export const SignatureStatusBadge: React.FC<SignatureStatusBadgeProps> = ({
  status,
  showIcon = true,
  className,
}) => {
  const colors = SignatureStatusColors[status];
  const label = DocumentSignatureStatusLabels[status];
  const icon = SignatureStatusIcons[status];

  return (
    <Badge
      $background={colors.background}
      $color={colors.color}
      className={className}
    >
      {showIcon && <Icon>{icon}</Icon>}
      {label}
    </Badge>
  );
};

const Badge = styled.span<{ $background: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${({ $background }) => $background};
  color: ${({ $color }) => $color};
  white-space: nowrap;
`;

const Icon = styled.span`
  font-size: 12px;
  line-height: 1;
`;
