import React, { useMemo, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdLightbulb,
  MdTrendingUp,
  MdSpeed,
  MdBalance,
  MdAccessTime,
  MdAutoAwesome,
  MdExpandMore,
  MdExpandLess,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import type {
  PortfolioOptimizationRequest,
  PortfolioOptimizationResponse,
} from '../services/aiAssistantApi';
import { usePortfolioOptimization } from '../hooks/usePortfolioOptimization';
import { InfoTooltip } from '../components/common/InfoTooltip';

type FocusOption = PortfolioOptimizationRequest['focus'];

// Constante para o tempo de cooldown (1 hora em milissegundos)
const COOLDOWN_TIME = 60 * 60 * 1000; // 1 hora
const STORAGE_KEY = 'portfolio_optimization_last_run';

// Função para traduzir status de propriedade
const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    available: 'Disponível',
    rented: 'Alugado',
    sold: 'Vendido',
    maintenance: 'Em Manutenção',
    draft: 'Rascunho',
    pending: 'Pendente',
    reserved: 'Reservado',
    inactive: 'Inativo',
  };
  return statusMap[status.toLowerCase()] || status;
};

// Descrições dos focos de otimização
const focusDescriptions: Record<FocusOption, string> = {
  sales_speed:
    'Prioriza imóveis com maior potencial de venda rápida. Ideal quando você precisa aumentar o volume de vendas e girar o estoque.',
  profitability:
    'Foca em imóveis com maior margem de lucro potencial. Recomendado para maximizar o retorno financeiro por transação.',
  market_coverage:
    'Analisa a diversificação do portfólio por região, tipo e faixa de preço. Útil para identificar gaps de mercado.',
  balanced:
    'Combina todos os fatores de forma equilibrada. Oferece uma visão geral das melhores oportunidades do portfólio.',
};

// Função para formatar tempo restante
const formatTimeRemaining = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes}min ${seconds}s`;
  }
  return `${seconds}s`;
};

// Componente de item expandível
const ResultItem: React.FC<{ item: PortfolioOptimizationResponse }> = ({
  item,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <ResultRow>
      <ResultMainInfo onClick={() => setExpanded(!expanded)}>
        <ResultName>{item.propertyTitle}</ResultName>
        <ResultStats>
          <StatBadge>{translateStatus(item.currentStatus)}</StatBadge>
          <StatValue>
            <InfoTooltip
              direction='down'
              content='Estimativa de dias até a venda'
            >
              <span>{item.estimatedSaleTime} dias</span>
            </InfoTooltip>
          </StatValue>
          {typeof item.currentPrice === 'number' && (
            <StatValue>
              R$ {item.currentPrice.toLocaleString('pt-BR')}
            </StatValue>
          )}
          {typeof item.suggestedPrice === 'number' && (
            <StatValue $highlight>
              <InfoTooltip direction='down' content='Preço sugerido pela IA'>
                <span>→ R$ {item.suggestedPrice.toLocaleString('pt-BR')}</span>
              </InfoTooltip>
            </StatValue>
          )}
        </ResultStats>
        <ScoreBadge $score={item.priorityScore}>
          {item.priorityScore}
        </ScoreBadge>
        <ExpandButton>
          {expanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
        </ExpandButton>
      </ResultMainInfo>

      {expanded && (
        <ResultDetails>
          <DetailsSection>
            <DetailLabel>Recomendações:</DetailLabel>
            <RecommendationList>
              {item.recommendedActions.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </RecommendationList>
          </DetailsSection>
          <ReasonText>{item.prioritizationReason}</ReasonText>
        </ResultDetails>
      )}
    </ResultRow>
  );
};

const PortfolioOptimizationPage: React.FC = () => {
  const navigate = useNavigate();
  const { optimize, loading, error } = usePortfolioOptimization();
  const [focus, setFocus] = useState<FocusOption>('balanced');
  const [result, setResult] = useState<
    PortfolioOptimizationResponse | PortfolioOptimizationResponse[] | null
  >(null);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  // Verificar cooldown ao montar e atualizar contador
  useEffect(() => {
    const checkCooldown = () => {
      const lastRun = localStorage.getItem(STORAGE_KEY);
      if (lastRun) {
        const lastRunTime = parseInt(lastRun, 10);
        const elapsed = Date.now() - lastRunTime;
        const remaining = COOLDOWN_TIME - elapsed;

        if (remaining > 0) {
          setCooldownRemaining(remaining);
        } else {
          setCooldownRemaining(0);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    };

    checkCooldown();

    const interval = setInterval(() => {
      if (cooldownRemaining > 0) {
        setCooldownRemaining(prev => {
          const newValue = prev - 1000;
          if (newValue <= 0) {
            localStorage.removeItem(STORAGE_KEY);
            return 0;
          }
          return newValue;
        });
      } else {
        checkCooldown();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownRemaining]);

  const handleOptimize = useCallback(async () => {
    if (cooldownRemaining > 0) return;

    const payload: PortfolioOptimizationRequest = { focus };
    const resp = await optimize(payload);

    if (resp) {
      setResult(resp);
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      setCooldownRemaining(COOLDOWN_TIME);
    }
  }, [focus, optimize, cooldownRemaining]);

  const hasResult = useMemo(() => {
    if (!result) return false;
    if (Array.isArray(result)) return result.length > 0;
    return Boolean(result.propertyId);
  }, [result]);

  const isOnCooldown = cooldownRemaining > 0;

  return (
    <PageContainer>
      <Header>
        <HeaderMain>
          <TitleArea>
            <Title>Otimização de Portfólio</Title>
            {isOnCooldown && (
              <CooldownBadge>
                <MdAccessTime size={14} />
                {formatTimeRemaining(cooldownRemaining)}
              </CooldownBadge>
            )}
          </TitleArea>
          <BackButton onClick={() => navigate('/properties')}>
            <MdArrowBack size={18} />
            Voltar
          </BackButton>
        </HeaderMain>
      </Header>

      <Content>
        <ConfigRow>
          <FocusOptions>
            <InfoTooltip
              direction='down'
              content={focusDescriptions.sales_speed}
            >
              <FocusChip
                $active={focus === 'sales_speed'}
                onClick={() => setFocus('sales_speed')}
              >
                <MdSpeed size={16} /> Velocidade
              </FocusChip>
            </InfoTooltip>
            <InfoTooltip
              direction='down'
              content={focusDescriptions.profitability}
            >
              <FocusChip
                $active={focus === 'profitability'}
                onClick={() => setFocus('profitability')}
              >
                <MdTrendingUp size={16} /> Rentabilidade
              </FocusChip>
            </InfoTooltip>
            <InfoTooltip
              direction='down'
              content={focusDescriptions.market_coverage}
            >
              <FocusChip
                $active={focus === 'market_coverage'}
                onClick={() => setFocus('market_coverage')}
              >
                <MdBalance size={16} /> Cobertura
              </FocusChip>
            </InfoTooltip>
            <InfoTooltip direction='down' content={focusDescriptions.balanced}>
              <FocusChip
                $active={focus === 'balanced'}
                onClick={() => setFocus('balanced')}
              >
                <MdLightbulb size={16} /> Balanceado
              </FocusChip>
            </InfoTooltip>
          </FocusOptions>

          <RunButton
            onClick={handleOptimize}
            disabled={loading || isOnCooldown}
            $onCooldown={isOnCooldown}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Analisando...
              </>
            ) : isOnCooldown ? (
              'Aguarde...'
            ) : (
              <>
                <MdAutoAwesome size={18} />
                Otimizar
              </>
            )}
          </RunButton>
        </ConfigRow>

        {error && <ErrorText>{error}</ErrorText>}

        {hasResult ? (
          <ResultsContainer>
            <ResultsHeader>
              <span>Imóvel</span>
              <span>Informações</span>
              <span>Score</span>
              <span></span>
            </ResultsHeader>
            <ResultsList>
              {Array.isArray(result) ? (
                result.map(item => (
                  <ResultItem key={item.propertyId} item={item} />
                ))
              ) : (
                <ResultItem item={result} />
              )}
            </ResultsList>
          </ResultsContainer>
        ) : (
          <EmptyState>
            <MdAutoAwesome size={40} />
            <EmptyText>
              Selecione o foco e clique em <strong>Otimizar</strong> para
              receber recomendações da IA
            </EmptyText>
          </EmptyState>
        )}
      </Content>
    </PageContainer>
  );
};

export default PortfolioOptimizationPage;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeaderMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85rem;
  cursor: pointer;
  padding: 8px 12px;
  transition: all 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CooldownBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.warning}15;
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.8rem;
  font-weight: 600;
`;

const Content = styled.div`
  padding: 16px;
`;

const ConfigRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const FocusOptions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FocusChip = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary + '15' : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.text};
  font-size: 0.85rem;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const RunButton = styled.button<{ $onCooldown?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme, $onCooldown }) =>
    $onCooldown ? theme.colors.textSecondary : theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: ${({ $onCooldown }) => ($onCooldown ? 'not-allowed' : 'pointer')};
  transition: all 0.15s;

  &:disabled {
    opacity: 0.7;
  }

  &:not(:disabled):hover {
    opacity: 0.9;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.85rem;
  padding: 10px 12px;
  background: #ef444410;
  border-radius: 6px;
  margin-bottom: 16px;
`;

const ResultsContainer = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const ResultsHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 60px 40px;
  gap: 12px;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ResultRow = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ResultMainInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 60px 40px;
  gap: 12px;
  padding: 12px 16px;
  align-items: center;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr auto auto;
  }
`;

const ResultName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
`;

const ResultStats = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StatBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatValue = styled.span<{ $highlight?: boolean }>`
  font-size: 0.85rem;
  color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ $highlight }) => ($highlight ? '600' : '400')};
`;

const ScoreBadge = styled.span<{ $score: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: white;
  background: ${({ $score }) =>
    $score >= 80 ? '#10B981' : $score >= 60 ? '#F59E0B' : '#EF4444'};
`;

const ExpandButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ResultDetails = styled.div`
  padding: 12px 16px 16px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const DetailsSection = styled.div`
  margin-bottom: 12px;
`;

const DetailLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const RecommendationList = styled.ul`
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  li {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.85rem;
    line-height: 1.4;
  }
`;

const ReasonText = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8rem;
  font-style: italic;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 6px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  max-width: 400px;
`;
