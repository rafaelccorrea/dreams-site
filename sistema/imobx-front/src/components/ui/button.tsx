import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'outline'
    | 'destructive'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

const StyledButton = styled.button<{ $variant: string; $size: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M1 1 L1 15 L7 9 L10 17 L13 15 L10 7 L17 7 L1 1 Z' fill='%23A63126'/%3E%3C/svg%3E")
      1 1,
    pointer !important;
  border: none;
  font-family: inherit;

  ${props => {
    switch (props.$size) {
      case 'sm':
        return `
          height: 32px;
          padding: 0 12px;
          font-size: 12px;
        `;
      case 'lg':
        return `
          height: 44px;
          padding: 0 24px;
          font-size: 16px;
        `;
      case 'icon':
        return `
          height: 40px;
          width: 40px;
          padding: 0;
        `;
      default:
        return `
          height: 40px;
          padding: 0 16px;
        `;
    }
  }}

  ${props => {
    switch (props.$variant) {
      case 'outline':
        return `
          background: transparent;
          color: ${props.theme.colors.text};
          border: 1px solid ${props.theme.colors.border};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.hover};
          }
        `;
      case 'destructive':
        return `
          background: #ef4444;
          color: white;
          
          &:hover:not(:disabled) {
            background: #dc2626;
          }
        `;
      case 'secondary':
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.text};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.hover};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${props.theme.colors.text};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.hover};
          }
        `;
      case 'link':
        return `
          background: transparent;
          color: ${props.theme.colors.primary};
          text-decoration: underline;
          
          &:hover:not(:disabled) {
            color: ${props.theme.colors.primaryDark};
          }
        `;
      default:
        return `
          background: ${props.theme.colors.primary};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primaryDark};
          }
        `;
    }
  }}

  &:hover:not(:disabled) {
    cursor:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M1 1 L1 15 L7 9 L10 17 L13 15 L10 7 L17 7 L1 1 Z' fill='%23A63126'/%3E%3C/svg%3E")
        1 1,
      pointer !important;
  }

  &:disabled {
    opacity: 0.5;
    cursor:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M1 1 L1 15 L7 9 L10 17 L13 15 L10 7 L17 7 L1 1 Z' fill='%23A63126' opacity='0.5'/%3E%3Cline x1='2' y1='2' x2='18' y2='18' stroke='%23A63126' stroke-width='2'/%3E%3C/svg%3E")
        1 1,
      not-allowed !important;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  children,
  ...props
}) => {
  return (
    <StyledButton $variant={variant} $size={size} {...props}>
      {children}
    </StyledButton>
  );
};
