import React from 'react';
import styled from 'styled-components';

interface MatchWorkspaceToastProps {
  onViewWorkspace: () => void;
  onDismiss?: () => void;
}

export const MatchWorkspaceToast: React.FC<MatchWorkspaceToastProps> = ({
  onViewWorkspace,
  onDismiss,
}) => {
  return (
    <ToastWrapper>
      <ToastHeader>
        <ToastIcon>🎉</ToastIcon>
        <div>
          <ToastTitle>Match aceito com sucesso!</ToastTitle>
          <ToastMessage>
            Task e nota criadas automaticamente no seu workspace pessoal.
          </ToastMessage>
        </div>
      </ToastHeader>

      <ToastActions>
        <ToastButton $variant='primary' onClick={onViewWorkspace}>
          Ver workspace
        </ToastButton>
        <ToastButton $variant='secondary' onClick={onDismiss}>
          Agora não
        </ToastButton>
      </ToastActions>
    </ToastWrapper>
  );
};

const ToastWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 4px;
  color: ${props => props.theme.colors.text};
`;

const ToastHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToastIcon = styled.div`
  font-size: 32px;
  line-height: 1;
`;

const ToastTitle = styled.h3`
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
`;

const ToastMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ToastActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ToastButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  flex: 1;
  min-width: 120px;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
      background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
      color: white;

      &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
    `
      : `
      background: ${theme.colors.backgroundSecondary};
      color: ${theme.colors.text};
      border: 1px solid ${theme.colors.border};

      &:hover {
        background: ${theme.colors.hover};
        transform: translateY(-1px);
      }
    `}
`;
