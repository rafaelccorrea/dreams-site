import React from 'react';
import styled from 'styled-components';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  className?: string;
}

const StyledSelect = styled.select`
  display: flex;
  height: 40px;
  width: 100%;
  border-radius: 8px;
  border: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  padding: 0 40px 0 12px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 18px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  option {
    padding: 10px;
  }

  &::-ms-expand {
    display: none;
  }
`;

export const Select: React.FC<SelectProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <StyledSelect className={className} {...props}>
      {children}
    </StyledSelect>
  );
};

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const StyledSelectTrigger = styled.div`
  display: flex;
  height: 40px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  padding: 0 12px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  align-items: center;
  justify-content: space-between;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <StyledSelectTrigger className={className} onClick={onClick}>
      {children}
    </StyledSelectTrigger>
  );
};

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

const StyledSelectContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 50;
  max-height: 200px;
  overflow-y: auto;
`;

export const SelectContent: React.FC<SelectContentProps> = ({
  children,
  className,
}) => {
  return (
    <StyledSelectContent className={className}>{children}</StyledSelectContent>
  );
};

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  onClick?: () => void;
}

const StyledSelectItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

export const SelectItem: React.FC<SelectItemProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <StyledSelectItem className={className} onClick={onClick}>
      {children}
    </StyledSelectItem>
  );
};

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

const StyledSelectValue = styled.span`
  color: ${props => props.theme.colors.text};
`;

export const SelectValue: React.FC<SelectValueProps> = ({
  placeholder,
  className,
}) => {
  return (
    <StyledSelectValue className={className}>{placeholder}</StyledSelectValue>
  );
};
