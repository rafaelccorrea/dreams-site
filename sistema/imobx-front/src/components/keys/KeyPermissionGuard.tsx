import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import styled from 'styled-components';
import { MdLock } from 'react-icons/md';

const AccessDeniedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 24px;
`;

const LockIcon = styled(MdLock)`
  font-size: 48px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 16px;
`;

const Title = styled.h6`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 8px;
  font-size: 1.25rem;
  font-weight: 600;
`;

const Message = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const AlertContainer = styled.div`
  background: ${props => props.theme.colors.warningBackground || '#fff3cd'};
  border: 1px solid ${props => props.theme.colors.warningBorder || '#ffeaa7'};
  color: ${props => props.theme.colors.warningText || '#856404'};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

interface KeyPermissionGuardProps {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
  showMessage?: boolean;
}

export const KeyPermissionGuard: React.FC<KeyPermissionGuardProps> = ({
  children,
  permission,
  fallback,
  showMessage = true,
}) => {
  const { hasPermission, loading: permissionsLoading } = usePermissions();

  // Aguardar carregamento das permissões antes de verificar
  if (permissionsLoading) {
    return null; // ou um shimmer se preferir
  }

  if (!hasPermission(permission)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showMessage) {
      return (
        <AccessDeniedContainer>
          <LockIcon />
          <Title>Acesso Restrito</Title>
          <Message>
            Você não tem permissão para acessar esta funcionalidade.
            <br />
            Entre em contato com um administrador para solicitar acesso.
          </Message>
        </AccessDeniedContainer>
      );
    }

    return null;
  }

  return <>{children}</>;
};

interface KeyPermissionAlertProps {
  permission: string;
  message?: string;
}

export const KeyPermissionAlert: React.FC<KeyPermissionAlertProps> = ({
  permission,
  message = 'Você não tem permissão para realizar esta ação.',
}) => {
  const { hasPermission, loading: permissionsLoading } = usePermissions();

  // Aguardar carregamento das permissões antes de verificar
  if (permissionsLoading) {
    return null;
  }

  if (hasPermission(permission)) {
    return null;
  }

  return <AlertContainer>{message}</AlertContainer>;
};
