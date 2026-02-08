import React from 'react';
import styled from 'styled-components';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

const StyledBadge = styled.span<{ $variant: string }>`
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;

  ${props => {
    switch (props.$variant) {
      case 'secondary':
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.text};
        `;
      case 'destructive':
        return `
          background: #fef2f2;
          color: #dc2626;
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${props.theme.colors.text};
          border: 1px solid ${props.theme.colors.border};
        `;
      default:
        return `
          background: ${props.theme.colors.primary};
          color: white;
        `;
    }
  }}
`;

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className,
}) => {
  return (
    <StyledBadge $variant={variant} className={className}>
      {children}
    </StyledBadge>
  );
};
