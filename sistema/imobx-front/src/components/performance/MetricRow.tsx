import React from 'react';
import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};

  .icon {
    font-size: 1.125rem;
  }
`;

const Value = styled.div<{ $color?: string }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.$color || props.theme.colors.text.primary};
`;

interface MetricRowProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

export function MetricRow({
  label,
  value,
  icon,
  color,
  className,
}: MetricRowProps) {
  return (
    <Row className={className}>
      <Label>
        {icon && <span className='icon'>{icon}</span>}
        <span>{label}</span>
      </Label>
      <Value $color={color}>{value}</Value>
    </Row>
  );
}
