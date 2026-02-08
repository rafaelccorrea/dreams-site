import React from 'react';
import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const StyledInput = styled.input`
  display: flex;
  height: 40px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  padding: 0 12px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
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
`;

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return <StyledInput className={className} {...props} />;
};
