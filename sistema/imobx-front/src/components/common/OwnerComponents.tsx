import React from 'react';
import { useOwner } from '../../hooks/useOwner';

interface OwnerOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLoading?: boolean;
  loadingComponent?: React.ReactNode;
}

/**
 * Componente que renderiza conteúdo apenas para proprietários reais
 * @param children - Conteúdo a ser exibido para proprietários
 * @param fallback - Conteúdo alternativo para não-proprietários
 * @param showLoading - Se deve mostrar loading durante verificação
 * @param loadingComponent - Componente de loading customizado
 */
export function OwnerOnly({
  children,
  fallback = null,
  showLoading = true,
  loadingComponent = <span>Carregando...</span>,
}: OwnerOnlyProps) {
  const { isOwner, loading } = useOwner();

  if (loading && showLoading) {
    return <span>{loadingComponent}</span>;
  }

  return isOwner ? <span>{children}</span> : <span>{fallback}</span>;
}

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLoading?: boolean;
  loadingComponent?: React.ReactNode;
}

/**
 * Componente que renderiza conteúdo apenas para administradores (não proprietários)
 * @param children - Conteúdo a ser exibido para administradores
 * @param fallback - Conteúdo alternativo para proprietários
 * @param showLoading - Se deve mostrar loading durante verificação
 * @param loadingComponent - Componente de loading customizado
 */
export function AdminOnly({
  children,
  fallback = null,
  showLoading = true,
  loadingComponent = <span>Carregando...</span>,
}: AdminOnlyProps) {
  const { isOwner, loading } = useOwner();

  if (loading && showLoading) {
    return <span>{loadingComponent}</span>;
  }

  return !isOwner ? <span>{children}</span> : <span>{fallback}</span>;
}

interface OwnerBadgeProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

/**
 * Componente que exibe um badge indicando se o usuário é proprietário
 * @param user - Dados do usuário (opcional, usa dados do contexto se não fornecido)
 * @param showIcon - Se deve mostrar ícone
 * @param showLabel - Se deve mostrar label
 * @param className - Classe CSS adicional
 */
export function OwnerBadge({
  user,
  showIcon = true,
  showLabel = true,
  className = '',
}: OwnerBadgeProps) {
  const { isOwner, ownerInfo } = useOwner();
  const displayName = user?.name || 'Usuário';
  const displayRole = user?.role || ownerInfo?.role || 'USER';

  return (
    <div className={`owner-badge ${className}`}>
      {user?.avatar && (
        <img
          src={user.avatar}
          alt={displayName}
          className='owner-avatar'
          style={{ width: '32px', height: '32px', borderRadius: '50%' }}
        />
      )}
      <div className='owner-info'>
        <h3 className='owner-name'>{displayName}</h3>
        <p className='owner-role'>{displayRole}</p>
        {isOwner && (
          <span
            className='owner-indicator'
            style={{
              color: '#FFD700',
              fontWeight: 'bold',
              fontSize: '12px',
            }}
          >
            {showIcon && ''}
            {showLabel && 'Proprietário'}
          </span>
        )}
      </div>
    </div>
  );
}

interface OwnerIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

/**
 * Componente simples que indica se o usuário é proprietário
 * @param size - Tamanho do indicador
 * @param showText - Se deve mostrar texto
 * @param className - Classe CSS adicional
 */
export function OwnerIndicator({
  size = 'medium',
  showText = true,
  className = '',
}: OwnerIndicatorProps) {
  const { isOwner } = useOwner();

  if (!isOwner) return null;

  const sizeStyles = {
    small: { fontSize: '12px' },
    medium: { fontSize: '14px' },
    large: { fontSize: '16px' },
  };

  return (
    <span
      className={`owner-indicator ${className}`}
      style={{
        color: '#FFD700',
        fontWeight: 'bold',
        ...sizeStyles[size],
      }}
    >
      {showText && 'Proprietário'}
    </span>
  );
}

interface OwnerConditionalProps {
  ownerContent: React.ReactNode;
  adminContent: React.ReactNode;
  showLoading?: boolean;
  loadingComponent?: React.ReactNode;
}

/**
 * Componente que renderiza conteúdo diferente para proprietários e administradores
 * @param ownerContent - Conteúdo para proprietários
 * @param adminContent - Conteúdo para administradores
 * @param showLoading - Se deve mostrar loading durante verificação
 * @param loadingComponent - Componente de loading customizado
 */
export function OwnerConditional({
  ownerContent,
  adminContent,
  showLoading = true,
  loadingComponent = <span>Carregando...</span>,
}: OwnerConditionalProps) {
  const { isOwner, loading } = useOwner();

  if (loading && showLoading) {
    return <span>{loadingComponent}</span>;
  }

  return <span>{isOwner ? ownerContent : adminContent}</span>;
}
