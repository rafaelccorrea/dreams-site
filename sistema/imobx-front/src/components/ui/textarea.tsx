import React from 'react';
import styled from 'styled-components';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const StyledTextarea = styled.textarea`
  display: flex;
  width: 100%;
  min-height: 80px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  padding: 12px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  font-family: inherit;
  resize: vertical;
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

export const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  return <StyledTextarea className={className} {...props} />;
};
