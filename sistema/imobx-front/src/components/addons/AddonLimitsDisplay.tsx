import React from 'react';
import styled from 'styled-components';
import { useAddonLimits } from '../../hooks/useAddonLimits';
import { useTheme } from '../../contexts/ThemeContext';

interface AddonLimitsDisplayProps {
  subscriptionId: string;
  className?: string;
}

const LimitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const LimitCard = styled.div`
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'};
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(148, 163, 184, 0.2)'
        : 'rgba(226, 232, 240, 0.8)'};
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1) inset'
      : '0 2px 8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%);
    border-radius: 16px 16px 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: ${props =>
      props.theme.mode === 'dark'
        ? 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)'
        : 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)'};
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props =>
      props.theme.mode === 'dark'
        ? '0 8px 24px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.2) inset'
        : '0 8px 24px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1) inset'};
    border-color: ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(59, 130, 246, 0.4)'
        : 'rgba(59, 130, 246, 0.3)'};

    &::after {
      opacity: 1;
    }
  }
`;

const LimitLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => (props.theme.mode === 'dark' ? '#94a3b8' : '#64748b')};
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LimitValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
      : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  letter-spacing: -0.5px;
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
      ? 'rgba(239, 68, 68, 0.1)'
      : 'rgba(239, 68, 68, 0.05)'};
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(239, 68, 68, 0.3)'
        : 'rgba(239, 68, 68, 0.2)'};
  color: ${props => (props.theme.mode === 'dark' ? '#f87171' : '#ef4444')};
  font-size: 0.9375rem;
`;

/**
 * Componente para exibir limites totais (plano base + add-ons ativos)
 */
export function AddonLimitsDisplay({
  subscriptionId,
  className,
}: AddonLimitsDisplayProps) {
  const { limits, loading, error } = useAddonLimits(subscriptionId);
  const { theme } = useTheme();

  if (loading) {
    return (
      <LoadingContainer className={className}>
        Carregando limites...
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorContainer className={className}>Erro: {error}</ErrorContainer>;
  }

  if (!limits) {
    return null;
  }

  return (
    <LimitsGrid className={className}>
      <LimitCard>
        <LimitLabel>Usuários</LimitLabel>
        <LimitValue>{limits.users}</LimitValue>
      </LimitCard>

      <LimitCard>
        <LimitLabel>Propriedades</LimitLabel>
        <LimitValue>{limits.properties}</LimitValue>
      </LimitCard>

      <LimitCard>
        <LimitLabel>Armazenamento</LimitLabel>
        <LimitValue>{limits.storage} GB</LimitValue>
      </LimitCard>
    </LimitsGrid>
  );
}
