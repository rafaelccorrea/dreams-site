import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import { useAddons } from '../../hooks/useAddons';
import { AddonCard } from './AddonCard';

interface AddonsListProps {
  subscriptionId: string;
  activeOnly?: boolean;
  onAddonCancel?: () => void;
  className?: string;
}

const Container = styled.div`
  margin-top: 16px;
`;

const Title = styled.h3`
  margin: 0 0 20px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => (props.theme.mode === 'dark' ? '#e2e8f0' : '#1e293b')};
`;

const LoadingContainer = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${props => (props.theme.mode === 'dark' ? '#cbd5e1' : '#64748b')};
  font-size: 0.9375rem;
`;

const ErrorContainer = styled.div`
  padding: 20px;
  border-radius: 12px;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(239, 68, 68, 0.15)'
      : 'rgba(239, 68, 68, 0.05)'};
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(239, 68, 68, 0.3)'
        : 'rgba(239, 68, 68, 0.2)'};
  color: ${props => (props.theme.mode === 'dark' ? '#f87171' : '#ef4444')};
  font-size: 0.9375rem;
`;

const EmptyContainer = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${props => (props.theme.mode === 'dark' ? '#94a3b8' : '#64748b')};
  font-size: 0.9375rem;
`;

/**
 * Componente para listar add-ons de uma assinatura
 */
export function AddonsList({
  subscriptionId,
  activeOnly = false,
  onAddonCancel,
  className,
}: AddonsListProps) {
  const { theme } = useTheme();
  const { addons, loading, error, refetch } = useAddons(
    subscriptionId,
    activeOnly
  );

  const handleCancel = () => {
    refetch();
    onAddonCancel?.();
  };

  if (loading) {
    return (
      <LoadingContainer className={className}>
        Carregando extras...
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorContainer className={className}>Erro: {error}</ErrorContainer>;
  }

  if (addons.length === 0) {
    return (
      <EmptyContainer className={className}>
        <p>Nenhum extra encontrado.</p>
      </EmptyContainer>
    );
  }

  return (
    <Container className={className}>
      <Title>
        {activeOnly ? 'Extras Ativos' : 'Todos os Extras'} ({addons.length})
      </Title>
      {addons.map(addon => (
        <AddonCard
          key={addon.id}
          addon={addon}
          subscriptionId={subscriptionId}
          onCancel={handleCancel}
        />
      ))}
    </Container>
  );
}
