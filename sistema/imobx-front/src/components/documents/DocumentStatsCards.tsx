import React from 'react';
import styled from 'styled-components';
import { MdDescription, MdPages, MdViewList } from 'react-icons/md';
import type { DocumentListResponse } from '../../types/document';

interface DocumentStatsCardsProps {
  stats: DocumentListResponse;
  loading?: boolean;
}

export const DocumentStatsCards: React.FC<DocumentStatsCardsProps> = ({
  stats,
  loading = false,
}) => {
  if (loading) {
    return (
      <StatsContainer>
        <StatCard>
          <StatIcon>
            <MdDescription size={24} />
          </StatIcon>
          <StatContent>
            <StatLabel>TOTAL DE DOCUMENTOS</StatLabel>
            <StatValue>
              <LoadingSkeleton />
            </StatValue>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon>
            <MdPages size={24} />
          </StatIcon>
          <StatContent>
            <StatLabel>PÁGINA ATUAL</StatLabel>
            <StatValue>
              <LoadingSkeleton />
            </StatValue>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon>
            <MdViewList size={24} />
          </StatIcon>
          <StatContent>
            <StatLabel>TOTAL DE PÁGINAS</StatLabel>
            <StatValue>
              <LoadingSkeleton />
            </StatValue>
          </StatContent>
        </StatCard>
      </StatsContainer>
    );
  }

  const totalDocuments = stats.total || 0;
  const currentPage = stats.page || 1;
  const limit = stats.limit || 20;
  const totalPages = limit > 0 ? Math.ceil(totalDocuments / limit) : 1;

  return (
    <StatsContainer>
      <StatCard>
        <StatIcon>
          <MdDescription size={24} />
        </StatIcon>
        <StatContent>
          <StatLabel>TOTAL DE DOCUMENTOS</StatLabel>
          <StatValue>{totalDocuments.toLocaleString('pt-BR')}</StatValue>
        </StatContent>
      </StatCard>

      <StatCard>
        <StatIcon>
          <MdPages size={24} />
        </StatIcon>
        <StatContent>
          <StatLabel>PÁGINA ATUAL</StatLabel>
          <StatValue>{currentPage}</StatValue>
        </StatContent>
      </StatCard>

      <StatCard>
        <StatIcon>
          <MdViewList size={24} />
        </StatIcon>
        <StatContent>
          <StatLabel>TOTAL DE PÁGINAS</StatLabel>
          <StatValue>{totalPages}</StatValue>
        </StatContent>
      </StatCard>
    </StatsContainer>
  );
};

// Styled Components
const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.colors.primary}30;
  }
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}20,
    ${props => props.theme.colors.primary}10
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const StatLabel = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const LoadingSkeleton = styled.div`
  width: 60px;
  height: 28px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.border} 25%,
    ${props => props.theme.colors.border}40 50%,
    ${props => props.theme.colors.border} 75%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  animation: loading 1.5s infinite;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
