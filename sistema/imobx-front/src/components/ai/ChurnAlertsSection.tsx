import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  MdWarning,
  MdTrendingDown,
  MdCheckCircle,
  MdRefresh,
  MdLock,
} from 'react-icons/md';
import { useChurnPrediction } from '../../hooks/useChurnPrediction';
import type { ChurnPredictionResponse } from '../../services/aiAssistantApi';
import { toast } from 'react-toastify';
import { InfoTooltip } from '../common/InfoTooltip';

// Constantes de cooldown
const CHURN_COOLDOWN_KEY = 'churn_last_refresh';
const COOLDOWN_MINUTES = 50;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;

const Section = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RefreshButton = styled.button<{ $locked?: boolean }>`
  background: none;
  border: none;
  cursor: ${props => (props.$locked ? 'not-allowed' : 'pointer')};
  color: ${props =>
    props.$locked
      ? props.theme.colors.textSecondary
      : props.theme.colors.textSecondary};
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
  opacity: ${props => (props.$locked ? 0.6 : 1)};

  &:hover:not(:disabled) {
    background: ${props =>
      props.$locked ? 'transparent' : props.theme.colors.backgroundSecondary};
    color: ${props =>
      props.$locked
        ? props.theme.colors.textSecondary
        : props.theme.colors.text};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CooldownBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.backgroundSecondary};
  padding: 2px 6px;
  border-radius: 4px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AlertSummary = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const AlertBadge = styled.div<{ $variant: 'high' | 'medium' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background: ${props => (props.$variant === 'high' ? '#FEF2F2' : '#FFFBEB')};
  color: ${props => (props.$variant === 'high' ? '#DC2626' : '#D97706')};
  border: 1px solid
    ${props => (props.$variant === 'high' ? '#FEE2E2' : '#FEF3C7')};
`;

const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AlertCard = styled.div<{ $riskLevel: 'high' | 'medium' | 'low' }>`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 2px solid
    ${props => {
      if (props.$riskLevel === 'high') return '#DC2626';
      if (props.$riskLevel === 'medium') return '#D97706';
      return props.theme.colors.border;
    }};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AlertCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

const ClientName = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const RiskBadge = styled.span<{ $riskLevel: 'high' | 'medium' | 'low' }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  background: ${props => {
    if (props.$riskLevel === 'high') return '#DC2626';
    if (props.$riskLevel === 'medium') return '#D97706';
    return '#6B7280';
  }};
  color: white;
`;

const AlertInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  line-height: 1.8;
`;

const ListItem = styled.li`
  margin-bottom: 6px;
`;

const RecoveryInfo = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
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

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

interface ChurnAlertsSectionProps {
  maxAlerts?: number;
}

// Funções utilitárias para cooldown
const getLastRefreshTime = (): number => {
  const stored = localStorage.getItem(CHURN_COOLDOWN_KEY);
  return stored ? parseInt(stored, 10) : 0;
};

const setLastRefreshTime = (): void => {
  localStorage.setItem(CHURN_COOLDOWN_KEY, Date.now().toString());
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

export const ChurnAlertsSection: React.FC<ChurnAlertsSectionProps> = ({
  maxAlerts = 5,
}) => {
  const { predict, loading, error, canRetry } = useChurnPrediction();
  const [alerts, setAlerts] = useState<ChurnPredictionResponse[]>([]);
  const [hasError, setHasError] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(
    getRemainingCooldown()
  );
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Atualizar o contador de cooldown a cada minuto
  useEffect(() => {
    const updateCooldown = () => {
      setCooldownRemaining(getRemainingCooldown());
    };

    // Atualizar imediatamente
    updateCooldown();

    // Atualizar a cada 30 segundos
    const interval = setInterval(updateCooldown, 30000);

    return () => clearInterval(interval);
  }, []);

  const isOnCooldown = cooldownRemaining > 0 && !isFirstLoad;

  const loadAlerts = useCallback(
    async (isManualRefresh = false) => {
      // Se for refresh manual, verificar cooldown
      if (isManualRefresh && cooldownRemaining > 0) {
        toast.warning(
          `⏳ Aguarde ${formatRemainingTime(cooldownRemaining)} para atualizar novamente.`
        );
        return;
      }

      // Verificar se pode tentar antes de chamar
      if (!canRetry()) {
        setHasError(true);
        return;
      }

      const result = await predict();
      if (result) {
        const alertsArray = Array.isArray(result) ? result : [result];
        // Filtrar apenas clientes com risco >= 40 e ordenar por score
        const filteredAlerts = alertsArray
          .filter(alert => alert.churnRiskScore >= 40)
          .sort((a, b) => b.churnRiskScore - a.churnRiskScore)
          .slice(0, maxAlerts);
        setAlerts(filteredAlerts);
        setHasError(false);

        // Salvar timestamp apenas se for refresh manual
        if (isManualRefresh) {
          setLastRefreshTime();
          setCooldownRemaining(COOLDOWN_MS);
          toast.success('✅ Alertas de churn atualizados!');
        }

        setIsFirstLoad(false);
      } else {
        setHasError(true);
        // Não mostrar toast aqui, apenas marcar erro para não chamar repetidamente
      }
    },
    [predict, maxAlerts, canRetry, cooldownRemaining]
  );

  const handleRefreshClick = useCallback(() => {
    loadAlerts(true);
  }, [loadAlerts]);

  useEffect(() => {
    // Só carregar se não houver erro ou se puder tentar novamente
    if (!hasError || canRetry()) {
      loadAlerts(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Carregar apenas uma vez na montagem, o retry é gerenciado internamente

  const highRiskCount = alerts.filter(a => a.riskLevel === 'high').length;
  const mediumRiskCount = alerts.filter(a => a.riskLevel === 'medium').length;

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>
          <MdWarning size={20} />
          Alertas de Churn
          <InfoTooltip content='Identificação automática de clientes com risco de abandonar a negociação. O sistema analisa padrões de comportamento e sugere ações de recuperação.' />
        </SectionTitle>
        <HeaderActions>
          {isOnCooldown && (
            <CooldownBadge
              title={`Próxima atualização em ${formatRemainingTime(cooldownRemaining)}`}
            >
              ⏳ {formatRemainingTime(cooldownRemaining)}
            </CooldownBadge>
          )}
          <RefreshButton
            onClick={handleRefreshClick}
            disabled={loading}
            $locked={isOnCooldown}
            title={
              isOnCooldown
                ? `Aguarde ${formatRemainingTime(cooldownRemaining)} para atualizar`
                : 'Atualizar alertas'
            }
          >
            {isOnCooldown ? (
              <MdLock size={16} />
            ) : (
              <MdRefresh
                size={18}
                style={{
                  animation: loading ? 'spin 1s linear infinite' : 'none',
                }}
              />
            )}
          </RefreshButton>
        </HeaderActions>
      </SectionHeader>

      {loading && alerts.length === 0 && (
        <LoadingContainer>
          <LoadingSpinner />
          <span>Carregando alertas...</span>
        </LoadingContainer>
      )}

      {error && alerts.length === 0 && <EmptyState>{error}</EmptyState>}

      {!loading && alerts.length === 0 && !error && (
        <EmptyState>
          <MdCheckCircle
            size={48}
            style={{ marginBottom: '12px', opacity: 0.5 }}
          />
          <div>Nenhum cliente com risco de churn identificado</div>
        </EmptyState>
      )}

      {alerts.length > 0 && (
        <>
          <AlertSummary>
            {highRiskCount > 0 && (
              <AlertBadge $variant='high'>
                <MdWarning size={18} />
                {highRiskCount} cliente{highRiskCount !== 1 ? 's' : ''} com alto
                risco
              </AlertBadge>
            )}
            {mediumRiskCount > 0 && (
              <AlertBadge $variant='medium'>
                <MdTrendingDown size={18} />
                {mediumRiskCount} cliente{mediumRiskCount !== 1 ? 's' : ''} com
                risco médio
              </AlertBadge>
            )}
          </AlertSummary>

          <AlertsList>
            {alerts.map(alert => (
              <AlertCard key={alert.clientId} $riskLevel={alert.riskLevel}>
                <AlertCardHeader>
                  <ClientName>{alert.clientName}</ClientName>
                  <RiskBadge $riskLevel={alert.riskLevel}>
                    {alert.riskLevel === 'high'
                      ? 'Alto'
                      : alert.riskLevel === 'medium'
                        ? 'Médio'
                        : 'Baixo'}
                  </RiskBadge>
                </AlertCardHeader>

                <AlertInfo>
                  <InfoRow>
                    <strong>Score de risco:</strong> {alert.churnRiskScore}%
                  </InfoRow>
                  <InfoRow>
                    <strong>Sem contato há:</strong>{' '}
                    {alert.daysSinceLastContact} dias
                  </InfoRow>
                </AlertInfo>

                {alert.riskFactors && alert.riskFactors.length > 0 && (
                  <div>
                    <strong
                      style={{
                        fontSize: '13px',
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      Fatores de Risco:
                    </strong>
                    <List>
                      {alert.riskFactors.map((factor, index) => (
                        <ListItem key={index}>{factor}</ListItem>
                      ))}
                    </List>
                  </div>
                )}

                {alert.recommendedActions &&
                  alert.recommendedActions.length > 0 && (
                    <div>
                      <strong
                        style={{
                          fontSize: '13px',
                          display: 'block',
                          marginBottom: '8px',
                        }}
                      >
                        Ações Recomendadas:
                      </strong>
                      <List>
                        {alert.recommendedActions.map((action, index) => (
                          <ListItem key={index}>{action}</ListItem>
                        ))}
                      </List>
                    </div>
                  )}

                <RecoveryInfo>
                  <strong>Probabilidade de recuperação:</strong>{' '}
                  {alert.recoveryProbability}%
                </RecoveryInfo>
              </AlertCard>
            ))}
          </AlertsList>
        </>
      )}
    </Section>
  );
};
