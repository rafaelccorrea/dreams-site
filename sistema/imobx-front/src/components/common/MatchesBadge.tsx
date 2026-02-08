/**
 * Badge de Matches
 * Mostra quantidade de matches pendentes de um cliente
 */

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useMatches } from '../../hooks/useMatches';

interface MatchesBadgeProps {
  clientId?: string;
  propertyId?: string;
  onClick?: () => void;
}

export const MatchesBadge: React.FC<MatchesBadgeProps> = ({
  clientId,
  propertyId,
  onClick,
}) => {
  const navigate = useNavigate();
  const { matches, loading } = useMatches({
    clientId,
    propertyId,
    status: 'pending',
    autoFetch: true,
  });

  if (loading || !matches || matches.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita propagação do evento

    if (onClick) {
      onClick();
    } else {
      // Redireciona para página de matches com filtro aplicado
      const params = new URLSearchParams();
      if (clientId) params.append('clientId', clientId);
      if (propertyId) params.append('propertyId', propertyId);
      navigate(`/matches?${params.toString()}`);
    }
  };

  return (
    <Badge
      onClick={handleClick}
      title={`${matches.length} sugestões de imóveis - Clique para ver detalhes`}
    >
      🎯 {matches.length}
    </Badge>
  );
};

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #ef4444, #f97316);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  margin-left: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px) scale(1.05);
    box-shadow: 0 3px 8px rgba(239, 68, 68, 0.5);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
    }
    50% {
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.6);
    }
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 3px 8px;
  }
`;

export default MatchesBadge;
