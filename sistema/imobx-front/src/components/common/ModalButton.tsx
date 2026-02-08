import React from 'react';
import styled from 'styled-components';

interface ModalButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  type?: 'button' | 'submit';
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  min-width: 120px;
  justify-content: center;
  position: relative;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;
        box-shadow: 0 2px 8px ${props.theme.colors.primary}30;

        &:hover:not(:disabled) {
          background: ${props.theme.colors.primaryDark};
          box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
          transform: translateY(-1px);
        }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
        color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
        border: 1px solid ${props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};

        &:hover:not(:disabled) {
          background: ${props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};
          transform: translateY(-1px);
        }
      `;
    } else {
      return `
        background: ${props.theme.mode === 'light' ? '#F3F4F6' : props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};

        &:hover:not(:disabled) {
          background: ${props.theme.mode === 'light' ? '#E5E7EB' : props.theme.colors.primary + '08'};
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-1px);
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9rem;
    min-width: 100px;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ModalButton: React.FC<ModalButtonProps> = ({
  variant = 'primary',
  onClick,
  disabled = false,
  children,
  type = 'button',
  loading = false,
  icon,
}) => {
  return (
    <Button
      $variant={variant}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? <LoadingSpinner /> : icon && <span>{icon}</span>}
      <span>{children}</span>
    </Button>
  );
};

export default ModalButton;
