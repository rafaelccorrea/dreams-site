import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdLocalFireDepartment,
  MdWhatshot,
  MdAcUnit,
  MdRefresh,
  MdTrendingUp,
  MdAccessTime,
  MdAttachMoney,
} from 'react-icons/md';
import { useLeadClassification } from '../../hooks/useLeadClassification';
import { Spinner } from '../common/Spinner';
import type { LeadClassificationResponse } from '../../services/aiAssistantApi';

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RefreshButton = styled.button<{ $loading?: boolean }>`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 8px 12px;
  cursor: ${props => (props.$loading ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;
  opacity: ${props => (props.$loading ? 0.6 : 1)};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const ClassificationBadge = styled.div<{
  $classification: 'hot' | 'warm' | 'cold';
}>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;

  ${props => {
    const theme = props.theme;
    const isDark = theme.mode === 'dark';

    switch (props.$classification) {
      case 'hot':
        return `
          background-color: ${isDark ? '#7f1d1d' : '#fee2e2'};
          color: ${isDark ? '#fca5a5' : '#991b1b'};
        `;
      case 'warm':
        return `
          background-color: ${isDark ? '#78350f' : '#fef3c7'};
          color: ${isDark ? '#fbbf24' : '#92400e'};
        `;
      case 'cold':
        return `
          background-color: ${isDark ? '#1e3a8a' : '#dbeafe'};
          color: ${isDark ? '#93c5fd' : '#1e40af'};
        `;
    }
  }}
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const StatValue = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const List = styled.ul`
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ListItem = styled.li`
  font-size: 13px;
  color: ${props => props.theme.colors.text};
  line-height: 1.5;
`;

const ReasonBox = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

interface LeadClassificationCardProps {
  clientId: string;
}

export const LeadClassificationCard: React.FC<LeadClassificationCardProps> = ({
  clientId,
}) => {
  const { classify, loading, canRetry } = useLeadClassification();
  const [classification, setClassification] =
    useState<LeadClassificationResponse | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded && !loading && clientId && canRetry()) {
      const loadClassification = async () => {
        if (hasLoaded || loading || !canRetry()) return;

        setHasLoaded(true);
        const result = await classify({ clientId });

        if (result && !Array.isArray(result)) {
          setClassification(result);
        }
      };

      loadClassification();
    }
  }, [clientId, hasLoaded, loading, canRetry, classify]);

  const handleRefresh = async () => {
    setHasLoaded(false);
    setClassification(null);

    if (!loading && clientId && canRetry()) {
      setHasLoaded(true);
      const result = await classify({ clientId });

      if (result && !Array.isArray(result)) {
        setClassification(result);
      }
    }
  };

  const getIcon = () => {
    if (!classification) return null;
    switch (classification.classification) {
      case 'hot':
        return <MdLocalFireDepartment size={20} />;
      case 'warm':
        return <MdWhatshot size={20} />;
      case 'cold':
        return <MdAcUnit size={20} />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    if (!classification) return '';
    switch (classification.classification) {
      case 'hot':
        return 'Quente';
      case 'warm':
        return 'Morno';
      case 'cold':
        return 'Frio';
      default:
        return classification.classification;
    }
  };

  if (loading && !classification) {
    return (
      <Card>
        <LoadingContainer>
          <Spinner size={20} />
          <span>Classificando lead...</span>
        </LoadingContainer>
      </Card>
    );
  }

  if (!classification) {
    return (
      <Card>
        <EmptyState>
          Nenhuma classificação disponível. Clique em "Atualizar" para
          classificar.
        </EmptyState>
        <RefreshButton
          onClick={handleRefresh}
          disabled={!canRetry() || loading}
        >
          <MdRefresh size={16} />
          Atualizar
        </RefreshButton>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {getIcon()}
          Classificação do Lead
        </CardTitle>
        <RefreshButton
          onClick={handleRefresh}
          disabled={!canRetry() || loading}
          $loading={loading}
        >
          {loading ? (
            <>
              <Spinner size={14} />
              Atualizando...
            </>
          ) : (
            <>
              <MdRefresh size={16} />
              Atualizar
            </>
          )}
        </RefreshButton>
      </CardHeader>

      <ClassificationBadge $classification={classification.classification}>
        {getIcon()}
        {getLabel()} - Score: {classification.qualityScore}%
      </ClassificationBadge>

      <StatsGrid>
        <StatItem>
          <StatLabel>Probabilidade de Conversão</StatLabel>
          <StatValue>
            <MdTrendingUp size={18} />
            {classification.conversionProbability}%
          </StatValue>
        </StatItem>
        {classification.estimatedConversionTime && (
          <StatItem>
            <StatLabel>Tempo Estimado</StatLabel>
            <StatValue>
              <MdAccessTime size={18} />
              {classification.estimatedConversionTime} dias
            </StatValue>
          </StatItem>
        )}
        {classification.estimatedDealValue && (
          <StatItem>
            <StatLabel>Valor Estimado</StatLabel>
            <StatValue>
              <MdAttachMoney size={18} />
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0,
              }).format(classification.estimatedDealValue)}
            </StatValue>
          </StatItem>
        )}
      </StatsGrid>

      <Section>
        <SectionTitle>Razão da Classificação</SectionTitle>
        <ReasonBox>{classification.classificationReason}</ReasonBox>
      </Section>

      {classification.influencingFactors &&
        classification.influencingFactors.length > 0 && (
          <Section>
            <SectionTitle>Fatores Influenciadores</SectionTitle>
            <List>
              {classification.influencingFactors.map((factor, index) => (
                <ListItem key={index}>{factor}</ListItem>
              ))}
            </List>
          </Section>
        )}

      {classification.nextSteps && classification.nextSteps.length > 0 && (
        <Section>
          <SectionTitle>Próximos Passos Recomendados</SectionTitle>
          <List>
            {classification.nextSteps.map((step, index) => (
              <ListItem key={index}>{step}</ListItem>
            ))}
          </List>
        </Section>
      )}
    </Card>
  );
};
