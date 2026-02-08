import React from 'react';
import styled from 'styled-components';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import { getPermissionDescription } from '../../utils/permissionDescriptions';
import { Tooltip } from '../ui/Tooltip';

interface PermissionMenuItemProps {
  permission: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  className?: string;
  hideIfNoPermission?: boolean;
}

const MenuItem = styled.div<{ $disabled: boolean; $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  color: ${props => {
    if (props.$disabled) return props.theme.colors.textSecondary;
    if (props.$danger) return props.theme.colors.error;
    return props.theme.colors.text;
  }};
  opacity: ${props => (props.$disabled ? 0.6 : 1)};
  font-size: 14px;
  user-select: none;

  &:hover {
    background: ${props => {
      if (props.$disabled) return 'transparent';
      return props.theme.colors.backgroundSecondary;
    }};
  }

  svg {
    color: ${props => {
      if (props.$disabled) return props.theme.colors.textSecondary;
      if (props.$danger) return props.theme.colors.error;
      return props.theme.colors.text;
    }};
  }
`;

export const PermissionMenuItem: React.FC<PermissionMenuItemProps> = ({
  permission,
  onClick,
  children,
  danger = false,
  disabled = false,
  className,
  hideIfNoPermission = false,
}) => {
  const permissionsContext = usePermissionsContextOptional();
  const hasPermission = permissionsContext?.hasPermission(permission) ?? false;

  const isDisabled = disabled || !hasPermission;

  // Se não tem permissão e deve ocultar, retornar null
  if (!hasPermission && hideIfNoPermission) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  // Se tem permissão, renderizar item normal
  if (hasPermission) {
    return (
      <MenuItem
        onClick={handleClick}
        $disabled={disabled}
        $danger={danger}
        className={className}
      >
        {children}
      </MenuItem>
    );
  }

  // Se não tem permissão, renderizar item desabilitado com tooltip
  const permissionDescription = getPermissionDescription(permission);
  const tooltipMessage = `Você não tem permissão para ${permissionDescription.toLowerCase()}. Entre em contato com um administrador para solicitar acesso.`;

  return (
    <Tooltip content={tooltipMessage} placement='left'>
      <MenuItem
        onClick={handleClick}
        $disabled={true}
        $danger={danger}
        className={className}
      >
        {children}
      </MenuItem>
    </Tooltip>
  );
};
