import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const StyledCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return <StyledCard className={className}>{children}</StyledCard>;
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const StyledCardHeader = styled.div`
  padding: 24px 24px 0 24px;
`;

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
}) => {
  return <StyledCardHeader className={className}>{children}</StyledCardHeader>;
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const StyledCardContent = styled.div`
  padding: 24px;
`;

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
}) => {
  return (
    <StyledCardContent className={className}>{children}</StyledCardContent>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const StyledCardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
}) => {
  return <StyledCardTitle className={className}>{children}</StyledCardTitle>;
};
