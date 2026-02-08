import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  MdDescription,
  MdRefresh,
  MdTrendingUp,
  MdTrendingDown,
  MdRemove,
  MdCheckCircle,
} from 'react-icons/md';
import { useSummarizeConversations } from '../../hooks/useSummarizeConversations';
import { toast } from 'react-toastify';

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.textSecondary};
  gap: 12px;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${props => props.theme.colors.border};
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
  text-align: center;
`;

const SummaryText = styled.p`
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  margin: 0 0 20px 0;
  font-size: 14px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  line-height: 1.8;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
`;

const InterestLevel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
`;

const InterestValue = styled.span<{ $level: 'high' | 'medium' | 'low' }>`
  color: ${props => {
    if (props.$level === 'high') return '#10B981';
    if (props.$level === 'medium') return '#F59E0B';
    return '#EF4444';
  }};
  font-weight: 600;
  text-transform: capitalize;
`;

const Stats = styled.div`
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

interface ConversationSummaryCardProps {
  clientId: string;
  summaryType?: 'executive' | 'detailed' | 'timeline';
}

export const ConversationSummaryCard: React.FC<
  ConversationSummaryCardProps
> = ({ clientId, summaryType = 'executive' }) => {
  const { summarize, loading, error, canRetry } = useSummarizeConversations();
  const [summary, setSummary] = useState<any>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const loadSummary = useCallback(async () => {
    // Proteção: não chamar se já está carregando, se não pode tentar, ou se já carregou com sucesso
    if (loading || !canRetry() || (hasLoaded && !hasError)) {
      return;
    }

    if (!clientId) return;

    const result = await summarize(clientId, summaryType);
    if (result) {
      setSummary(result);
      setHasLoaded(true);
      setHasError(false);
    } else {
      setHasError(true);
      // Não mostrar toast aqui para evitar spam
    }
  }, [
    clientId,
    summaryType,
    summarize,
    loading,
    canRetry,
    hasLoaded,
    hasError,
  ]);

  useEffect(() => {
    // Carregar apenas uma vez na montagem, se ainda não carregou
    if (!hasLoaded && !loading && canRetry()) {
      loadSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Carregar apenas uma vez na montagem

  const InterestIcon =
    summary?.interestLevel === 'high'
      ? MdTrendingUp
      : summary?.interestLevel === 'low'
        ? MdTrendingDown
        : MdRemove;

  // Função para traduzir termos comuns nos pontos principais
  const translateKeyPoint = (point: string): string => {
    const typeMap: Record<string, string> = {
      buyer: 'Comprador',
      seller: 'Vendedor',
      tenant: 'Locatário',
      landlord: 'Proprietário',
    };

    let translated = point;

    // Primeiro, traduzir padrões "type: buyer", "Tipo de interesse: buyer", etc.
    translated = translated.replace(
      /(?:type|tipo)\s*(?:de\s*interesse)?\s*:\s*([a-z]+)/gi,
      (match, type) => {
        const lowerType = type.toLowerCase();
        if (typeMap[lowerType]) {
          return `Tipo: ${typeMap[lowerType]}`;
        }
        return `Tipo: ${type}`;
      }
    );

    // Depois, traduzir palavras soltas (buyer, seller, etc.) que aparecem sozinhas
    // Mas só se ainda não foram traduzidas (não contém a tradução em português)
    Object.entries(typeMap).forEach(([en, pt]) => {
      // Verificar se a tradução já existe no texto
      if (!translated.includes(pt)) {
        // Substituir palavra inteira, mas evitar substituir se já está em "Tipo: ..."
        const parts = translated.split(/(Tipo:\s*[^,;.]+)/gi);
        translated = parts
          .map(part => {
            // Se a parte já contém "Tipo:", não traduzir
            if (part.match(/Tipo:\s*/i)) {
              return part;
            }
            // Caso contrário, traduzir
            return part.replace(new RegExp(`\\b${en}\\b`, 'gi'), pt);
          })
          .join('');
      }
    });

    return translated;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <MdDescription size={20} />
          Resumo de Conversas (IA)
        </CardTitle>
        <RefreshButton
          onClick={() => {
            setHasLoaded(false); // Permitir recarregar ao clicar manualmente
            loadSummary();
          }}
          disabled={loading || !canRetry()}
          title={
            !canRetry()
              ? 'Aguarde 1 minuto antes de tentar novamente'
              : 'Atualizar resumo'
          }
        >
          <MdRefresh
            size={18}
            style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
          />
        </RefreshButton>
      </CardHeader>

      {loading && !summary && (
        <LoadingContainer>
          <LoadingSpinner />
          <span>Gerando resumo...</span>
        </LoadingContainer>
      )}

      {error && !summary && <ErrorMessage>{error}</ErrorMessage>}

      {summary && (
        <>
          <SummaryText>{summary.summary}</SummaryText>

          {summary.keyPoints && summary.keyPoints.length > 0 && (
            <Section>
              <SectionTitle>Pontos Principais</SectionTitle>
              <List>
                {summary.keyPoints.map((point: string, index: number) => (
                  <ListItem key={index}>{translateKeyPoint(point)}</ListItem>
                ))}
              </List>
            </Section>
          )}

          {summary.nextSteps && summary.nextSteps.length > 0 && (
            <Section>
              <SectionTitle>Próximos Passos</SectionTitle>
              <List>
                {summary.nextSteps.map((step: string, index: number) => (
                  <ListItem key={index}>{step}</ListItem>
                ))}
              </List>
            </Section>
          )}

          {summary.interestLevel && (
            <InterestLevel>
              <InterestIcon size={18} />
              <span>Nível de interesse:</span>
              <InterestValue $level={summary.interestLevel}>
                {summary.interestLevel === 'high'
                  ? 'Alto'
                  : summary.interestLevel === 'medium'
                    ? 'Médio'
                    : 'Baixo'}
              </InterestValue>
            </InterestLevel>
          )}

          {summary.totalInteractions !== undefined && (
            <Stats>
              <StatItem>
                <MdCheckCircle size={14} />
                <span>{summary.totalInteractions} interações</span>
              </StatItem>
            </Stats>
          )}
        </>
      )}
    </Card>
  );
};
