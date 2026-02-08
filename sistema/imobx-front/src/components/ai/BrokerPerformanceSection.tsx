import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  MdPeople,
  MdTrendingUp,
  MdTrendingDown,
  MdRemove,
  MdRefresh,
  MdVisibility,
  MdLock,
} from 'react-icons/md';
import { useBrokerPerformance } from '../../hooks/useBrokerPerformance';
import { BrokerPerformanceModal } from '../modals/BrokerPerformanceModal';
import { BrokerPerformanceListModal } from '../modals/BrokerPerformanceListModal';
import { Spinner } from '../common/Spinner';
import { InfoTooltip } from '../common/InfoTooltip';
import { toast } from 'react-toastify';
import type { BrokerPerformanceResponse } from '../../services/aiAssistantApi';

// Constantes de cooldown
const BROKER_PERF_COOLDOWN_KEY = 'broker_performance_last_refresh';
const COOLDOWN_MINUTES = 50;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;

// Funções utilitárias para cooldown
const getLastRefreshTime = (): number => {
  const stored = localStorage.getItem(BROKER_PERF_COOLDOWN_KEY);
  return stored ? parseInt(stored, 10) : 0;
};

const setLastRefreshTime = (): void => {
  localStorage.setItem(BROKER_PERF_COOLDOWN_KEY, Date.now().toString());
};

const getRemainingCooldown = (): number => {
  const lastRefresh = getLastRefreshTime();
  if (!lastRefresh) return 0;

  const elapsed = Date.now() - lastRefresh;
  const remaining = COOLDOWN_MS - elapsed;
  return remaining > 0 ? remaining : 0;
};

const formatRemainingTime = (ms: number): string => {
  const minutes = Math.ceil(ms / 60000);
  if (minutes <= 1) return 'menos de 1 minuto';
  return `${minutes} minutos`;
};

const Section = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 8px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const Button = styled.button<{ $locked?: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: ${props => (props.$locked ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  opacity: ${props => (props.$locked ? 0.6 : 1)};

  &:hover:not(:disabled) {
    background: ${props =>
      props.$locked
        ? props.theme.colors.backgroundSecondary
        : props.theme.colors.background};
    border-color: ${props =>
      props.$locked ? props.theme.colors.border : props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
    white-space: nowrap;
  }
`;

const CooldownBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.background};
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 4px;
`;

const PerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const PerformanceCard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 12px;
    gap: 10px;

    &:hover {
      transform: none;
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 8px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const BrokerName = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  flex: 1;
  min-width: 0;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ScoreBadge = styled.div<{ $score: number }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.$score >= 80) return '#10B981';
    if (props.$score >= 60) return '#F59E0B';
    return '#EF4444';
  }};
  color: white;
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 3px 8px;
  }
`;

const TrendIcon = styled.div<{ $trend: 'improving' | 'stable' | 'declining' }>`
  color: ${props => {
    if (props.$trend === 'improving') return '#10B981';
    if (props.$trend === 'declining') return '#EF4444';
    return '#6B7280';
  }};
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const StatValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
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

interface BrokerPerformanceSectionProps {
  maxBrokers?: number;
  period?: 'week' | 'month' | 'quarter' | 'year';
}

export const BrokerPerformanceSection: React.FC<
  BrokerPerformanceSectionProps
> = ({ maxBrokers = 5, period = 'month' }) => {
  const { analyze, loading, canRetry } = useBrokerPerformance();
  const [performances, setPerformances] = useState<BrokerPerformanceResponse[]>(
    []
  );
  const [allPerformances, setAllPerformances] = useState<
    BrokerPerformanceResponse[]
  >([]);
  const [selectedBroker, setSelectedBroker] =
    useState<BrokerPerformanceResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(
    getRemainingCooldown()
  );
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Atualizar o contador de cooldown a cada 30 segundos
  useEffect(() => {
    const updateCooldown = () => {
      setCooldownRemaining(getRemainingCooldown());
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 30000);

    return () => clearInterval(interval);
  }, []);

  const isOnCooldown = cooldownRemaining > 0 && !isFirstLoad;

  useEffect(() => {
    if (!hasLoaded && !loading && canRetry()) {
      const loadPerformances = async () => {
        if (hasLoaded || loading || !canRetry()) return;

        setHasLoaded(true);
        const result = await analyze({ period });

        if (result) {
          const data = Array.isArray(result) ? result : [result];
          setAllPerformances(data);
          setPerformances(data.slice(0, maxBrokers));
          setIsFirstLoad(false);
        }
      };

      loadPerformances();
    }
  }, [period, hasLoaded, loading, canRetry, analyze, maxBrokers]);

  const handleRefresh = useCallback(async () => {
    // Verificar cooldown
    if (cooldownRemaining > 0) {
      toast.warning(
        `⏳ Aguarde ${formatRemainingTime(cooldownRemaining)} para atualizar novamente.`
      );
      return;
    }

    setHasLoaded(false);
    setPerformances([]);
    setAllPerformances([]);

    if (!loading && canRetry()) {
      setHasLoaded(true);
      const result = await analyze({ period });

      if (result) {
        const data = Array.isArray(result) ? result : [result];
        setAllPerformances(data);
        setPerformances(data.slice(0, maxBrokers));

        // Salvar timestamp do refresh
        setLastRefreshTime();
        setCooldownRemaining(COOLDOWN_MS);
        toast.success('✅ Performance de corretores atualizada!');
      }
    }
  }, [analyze, canRetry, cooldownRemaining, loading, maxBrokers, period]);

  const handleViewAll = () => {
    if (allPerformances.length > 0) {
      setShowListModal(true);
    }
  };

  const handleCardClick = (broker: BrokerPerformanceResponse) => {
    setSelectedBroker(broker);
    setShowModal(true);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <MdTrendingUp size={16} />;
      case 'declining':
        return <MdTrendingDown size={16} />;
      default:
        return <MdRemove size={16} />;
    }
  };

  if (loading && performances.length === 0) {
    return (
      <Section>
        <SectionHeader>
          <SectionTitle>
            <MdPeople size={20} />
            Performance de Corretores
            <InfoTooltip content='Análise de IA que avalia o desempenho dos corretores com base em vendas, taxa de conversão, valor total negociado e tendência de performance.' />
          </SectionTitle>
        </SectionHeader>
        <LoadingContainer>
          <Spinner size={20} />
          <span>Carregando performance...</span>
        </LoadingContainer>
      </Section>
    );
  }

  return (
    <>
      <Section>
        <SectionHeader>
          <SectionTitle>
            <MdPeople size={20} />
            Performance de Corretores
            <InfoTooltip content='Análise de IA que avalia o desempenho dos corretores com base em vendas, taxa de conversão, valor total negociado e tendência de performance.' />
          </SectionTitle>
          <HeaderActions>
            {isOnCooldown && (
              <CooldownBadge
                title={`Próxima atualização em ${formatRemainingTime(cooldownRemaining)}`}
              >
                ⏳ {formatRemainingTime(cooldownRemaining)}
              </CooldownBadge>
            )}
            <Button
              onClick={handleRefresh}
              disabled={loading}
              $locked={isOnCooldown}
              title={
                isOnCooldown
                  ? `Aguarde ${formatRemainingTime(cooldownRemaining)} para atualizar`
                  : 'Atualizar análise'
              }
            >
              {isOnCooldown ? <MdLock size={16} /> : <MdRefresh size={16} />}
              {isOnCooldown ? 'Bloqueado' : 'Atualizar'}
            </Button>
            {performances.length > 0 && (
              <Button onClick={handleViewAll}>
                <MdVisibility size={16} />
                Ver Todos
              </Button>
            )}
          </HeaderActions>
        </SectionHeader>

        {performances.length === 0 ? (
          <EmptyState>
            Nenhuma análise de performance disponível. Clique em "Atualizar"
            para analisar.
          </EmptyState>
        ) : (
          <PerformanceGrid>
            {performances.map(broker => (
              <PerformanceCard
                key={broker.brokerId}
                onClick={() => handleCardClick(broker)}
              >
                <CardHeader>
                  <BrokerName>{broker.brokerName}</BrokerName>
                  <ScoreBadge $score={broker.overallScore}>
                    {broker.overallScore}%
                  </ScoreBadge>
                </CardHeader>
                <StatsRow>
                  <span>Vendas:</span>
                  <StatValue>{broker.salesCount}</StatValue>
                </StatsRow>
                <StatsRow>
                  <span>Taxa de Conversão:</span>
                  <StatValue>{broker.conversionRate.toFixed(1)}%</StatValue>
                </StatsRow>
                <StatsRow>
                  <span>Valor Total:</span>
                  <StatValue>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 0,
                    }).format(broker.totalSalesValue)}
                  </StatValue>
                </StatsRow>
                <StatsRow>
                  <span>Tendência:</span>
                  <TrendIcon $trend={broker.trend}>
                    {getTrendIcon(broker.trend)}
                  </TrendIcon>
                </StatsRow>
              </PerformanceCard>
            ))}
          </PerformanceGrid>
        )}
      </Section>

      {showModal && selectedBroker && (
        <BrokerPerformanceModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedBroker(null);
          }}
          broker={selectedBroker}
        />
      )}

      {showListModal && (
        <BrokerPerformanceListModal
          isOpen={showListModal}
          onClose={() => setShowListModal(false)}
          brokers={allPerformances}
        />
      )}
    </>
  );
};
