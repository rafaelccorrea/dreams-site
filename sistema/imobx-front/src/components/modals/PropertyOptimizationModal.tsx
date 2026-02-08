import React, { useMemo, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdLightbulb,
  MdTrendingUp,
  MdSpeed,
  MdBalance,
  MdAccessTime,
  MdInfo,
} from 'react-icons/md';
import type {
  PortfolioOptimizationRequest,
  PortfolioOptimizationResponse,
} from '../../services/aiAssistantApi';
import { usePortfolioOptimization } from '../../hooks/usePortfolioOptimization';
import { InfoTooltip } from '../common/InfoTooltip';

type FocusOption = PortfolioOptimizationRequest['focus'];

interface PropertyOptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId?: string;
  defaultFocus?: FocusOption;
}

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

export const PropertyOptimizationModal: React.FC<
  PropertyOptimizationModalProps
> = ({ isOpen, onClose, propertyId, defaultFocus = 'balanced' }) => {
  const { optimize, loading, error } = usePortfolioOptimization();
  const [focus, setFocus] = useState<FocusOption>(defaultFocus);
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

    // Atualizar a cada segundo se estiver em cooldown
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

    const payload: PortfolioOptimizationRequest = { focus, propertyId };
    const resp = await optimize(payload);

    if (resp) {
      setResult(resp);
      // Salvar timestamp da última execução
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      setCooldownRemaining(COOLDOWN_TIME);
    }
  }, [focus, propertyId, optimize, cooldownRemaining]);

  const hasResult = useMemo(() => {
    if (!result) return false;
    if (Array.isArray(result)) return result.length > 0;
    return Boolean(result.propertyId);
  }, [result]);

  const isOnCooldown = cooldownRemaining > 0;

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <TitleRow>
            <Title>Otimização de Portfólio</Title>
            <InfoTooltip content='A IA analisa seu portfólio de imóveis e sugere otimizações baseadas em dados de mercado, histórico de vendas e tendências. Use para identificar oportunidades de melhoria e ajustes estratégicos.'>
              <HelpIcon>
                <MdInfo size={18} />
              </HelpIcon>
            </InfoTooltip>
          </TitleRow>
          <Actions>
            {isOnCooldown && (
              <CooldownBadge>
                <MdAccessTime size={14} />
                {formatTimeRemaining(cooldownRemaining)}
              </CooldownBadge>
            )}
            <CloseButton onClick={onClose}>
              <MdClose size={18} />
            </CloseButton>
          </Actions>
        </Header>

        <Body>
          <Controls>
            <ControlGroup>
              <ControlLabelRow>
                <ControlLabel>Foco da Otimização</ControlLabel>
                <InfoTooltip content='Escolha o objetivo principal da análise. Cada foco prioriza diferentes aspectos do seu portfólio para gerar recomendações personalizadas.'>
                  <HelpIconSmall>
                    <MdInfo size={14} />
                  </HelpIconSmall>
                </InfoTooltip>
              </ControlLabelRow>
              <FocusGrid>
                <InfoTooltip
                  content={focusDescriptions.sales_speed}
                  direction='down'
                >
                  <FocusButton
                    $active={focus === 'sales_speed'}
                    onClick={() => setFocus('sales_speed')}
                  >
                    <MdSpeed />
                    Velocidade de Vendas
                  </FocusButton>
                </InfoTooltip>
                <InfoTooltip
                  content={focusDescriptions.profitability}
                  direction='down'
                >
                  <FocusButton
                    $active={focus === 'profitability'}
                    onClick={() => setFocus('profitability')}
                  >
                    <MdTrendingUp />
                    Rentabilidade
                  </FocusButton>
                </InfoTooltip>
                <InfoTooltip
                  content={focusDescriptions.market_coverage}
                  direction='down'
                >
                  <FocusButton
                    $active={focus === 'market_coverage'}
                    onClick={() => setFocus('market_coverage')}
                  >
                    <MdBalance />
                    Cobertura de Mercado
                  </FocusButton>
                </InfoTooltip>
                <InfoTooltip
                  content={focusDescriptions.balanced}
                  direction='down'
                >
                  <FocusButton
                    $active={focus === 'balanced'}
                    onClick={() => setFocus('balanced')}
                  >
                    <MdLightbulb />
                    Balanceado
                  </FocusButton>
                </InfoTooltip>
              </FocusGrid>
            </ControlGroup>

            <RunRow>
              <RunInfo>
                {propertyId
                  ? 'Otimização individual para o imóvel selecionado.'
                  : 'Otimização do portfólio completo.'}
                {isOnCooldown && (
                  <CooldownText>
                    Aguarde {formatTimeRemaining(cooldownRemaining)} para
                    executar novamente.
                  </CooldownText>
                )}
              </RunInfo>
              <InfoTooltip
                content={
                  isOnCooldown
                    ? `A otimização consome recursos de IA. Aguarde o cooldown de 1 hora para executar novamente.`
                    : 'Clique para iniciar a análise. O processo pode levar alguns segundos.'
                }
              >
                <RunButton
                  onClick={handleOptimize}
                  disabled={loading || isOnCooldown}
                  $onCooldown={isOnCooldown}
                >
                  {loading
                    ? 'Otimizando...'
                    : isOnCooldown
                      ? 'Aguarde...'
                      : 'Executar Otimização'}
                </RunButton>
              </InfoTooltip>
            </RunRow>
            {error && <ErrorText>{error}</ErrorText>}
          </Controls>

          {hasResult ? (
            <ResultsSection>
              <ResultsHeader>
                <ResultsTitle>Resultados da Análise</ResultsTitle>
                <InfoTooltip
                  direction='down'
                  content='Cada card representa um imóvel analisado. O score indica a prioridade de ação (verde = alta, amarelo = média, vermelho = baixa). As recomendações são baseadas em dados de mercado atualizados.'
                >
                  <HelpIconSmall>
                    <MdInfo size={14} />
                  </HelpIconSmall>
                </InfoTooltip>
              </ResultsHeader>
              {Array.isArray(result) ? (
                <ResultsGrid>
                  {result.map(item => (
                    <ResultCard key={item.propertyId}>
                      <ResultHeader>
                        <ResultTitle>{item.propertyTitle}</ResultTitle>
                        <InfoTooltip
                          direction='down'
                          content={`Score de prioridade: ${item.priorityScore}/100. ${item.priorityScore >= 80 ? 'Alta prioridade - ação recomendada imediatamente.' : item.priorityScore >= 60 ? 'Média prioridade - considere agir em breve.' : 'Baixa prioridade - monitore e reavalie.'}`}
                        >
                          <ScoreBadge $score={item.priorityScore}>
                            {item.priorityScore}
                          </ScoreBadge>
                        </InfoTooltip>
                      </ResultHeader>
                      <ResultMeta>
                        <MetaItem>
                          <InfoTooltip
                            direction='down'
                            content='Situação atual do imóvel no sistema.'
                          >
                            <span>
                              Status atual:{' '}
                              <strong>
                                {translateStatus(item.currentStatus)}
                              </strong>
                            </span>
                          </InfoTooltip>
                        </MetaItem>
                        <MetaItem>
                          <InfoTooltip
                            direction='down'
                            content='Estimativa de dias até a venda baseada em dados históricos e tendências de mercado.'
                          >
                            <span>
                              Tempo estimado:{' '}
                              <strong>{item.estimatedSaleTime} dias</strong>
                            </span>
                          </InfoTooltip>
                        </MetaItem>
                        {typeof item.currentPrice === 'number' && (
                          <MetaItem>
                            <InfoTooltip
                              direction='down'
                              content='Valor atual anunciado do imóvel.'
                            >
                              <span>
                                Preço atual:{' '}
                                <strong>
                                  R$ {item.currentPrice.toLocaleString('pt-BR')}
                                </strong>
                              </span>
                            </InfoTooltip>
                          </MetaItem>
                        )}
                        {typeof item.suggestedPrice === 'number' && (
                          <MetaItem>
                            <InfoTooltip
                              direction='down'
                              content='Valor sugerido pela IA baseado em análise comparativa de mercado, localização e características do imóvel.'
                            >
                              <span>
                                Preço sugerido:{' '}
                                <strong>
                                  R${' '}
                                  {item.suggestedPrice.toLocaleString('pt-BR')}
                                </strong>
                              </span>
                            </InfoTooltip>
                          </MetaItem>
                        )}
                      </ResultMeta>
                      <SectionTitleRow>
                        <SectionTitle>Recomendações</SectionTitle>
                        <InfoTooltip
                          direction='down'
                          content='Ações sugeridas pela IA para otimizar a performance deste imóvel. Priorize as primeiras da lista.'
                        >
                          <HelpIconSmall>
                            <MdInfo size={12} />
                          </HelpIconSmall>
                        </InfoTooltip>
                      </SectionTitleRow>
                      <RecommendationList>
                        {item.recommendedActions.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </RecommendationList>
                      <InfoTooltip
                        direction='down'
                        content='Explicação detalhada do motivo pelo qual este imóvel foi priorizado desta forma.'
                      >
                        <ReasonText>{item.prioritizationReason}</ReasonText>
                      </InfoTooltip>
                    </ResultCard>
                  ))}
                </ResultsGrid>
              ) : (
                <ResultCard key={result.propertyId}>
                  <ResultHeader>
                    <ResultTitle>{result.propertyTitle}</ResultTitle>
                    <InfoTooltip
                      direction='down'
                      content={`Score de prioridade: ${result.priorityScore}/100. ${result.priorityScore >= 80 ? 'Alta prioridade - ação recomendada imediatamente.' : result.priorityScore >= 60 ? 'Média prioridade - considere agir em breve.' : 'Baixa prioridade - monitore e reavalie.'}`}
                    >
                      <ScoreBadge $score={result.priorityScore}>
                        {result.priorityScore}
                      </ScoreBadge>
                    </InfoTooltip>
                  </ResultHeader>
                  <ResultMeta>
                    <MetaItem>
                      <InfoTooltip
                        direction='down'
                        content='Situação atual do imóvel no sistema.'
                      >
                        <span>
                          Status atual:{' '}
                          <strong>
                            {translateStatus(result.currentStatus)}
                          </strong>
                        </span>
                      </InfoTooltip>
                    </MetaItem>
                    <MetaItem>
                      <InfoTooltip
                        direction='down'
                        content='Estimativa de dias até a venda baseada em dados históricos e tendências de mercado.'
                      >
                        <span>
                          Tempo estimado:{' '}
                          <strong>{result.estimatedSaleTime} dias</strong>
                        </span>
                      </InfoTooltip>
                    </MetaItem>
                    {typeof result.currentPrice === 'number' && (
                      <MetaItem>
                        <InfoTooltip
                          direction='down'
                          content='Valor atual anunciado do imóvel.'
                        >
                          <span>
                            Preço atual:{' '}
                            <strong>
                              R$ {result.currentPrice.toLocaleString('pt-BR')}
                            </strong>
                          </span>
                        </InfoTooltip>
                      </MetaItem>
                    )}
                    {typeof result.suggestedPrice === 'number' && (
                      <MetaItem>
                        <InfoTooltip
                          direction='down'
                          content='Valor sugerido pela IA baseado em análise comparativa de mercado, localização e características do imóvel.'
                        >
                          <span>
                            Preço sugerido:{' '}
                            <strong>
                              R$ {result.suggestedPrice.toLocaleString('pt-BR')}
                            </strong>
                          </span>
                        </InfoTooltip>
                      </MetaItem>
                    )}
                  </ResultMeta>
                  <SectionTitleRow>
                    <SectionTitle>Recomendações</SectionTitle>
                    <InfoTooltip
                      direction='down'
                      content='Ações sugeridas pela IA para otimizar a performance deste imóvel. Priorize as primeiras da lista.'
                    >
                      <HelpIconSmall>
                        <MdInfo size={12} />
                      </HelpIconSmall>
                    </InfoTooltip>
                  </SectionTitleRow>
                  <RecommendationList>
                    {result.recommendedActions.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </RecommendationList>
                  <InfoTooltip
                    direction='down'
                    content='Explicação detalhada do motivo pelo qual este imóvel foi priorizado desta forma.'
                  >
                    <ReasonText>{result.prioritizationReason}</ReasonText>
                  </InfoTooltip>
                </ResultCard>
              )}
            </ResultsSection>
          ) : (
            <EmptyResults>
              <EmptyIcon>
                <MdLightbulb size={32} />
              </EmptyIcon>
              <EmptyTitle>Pronto para Otimizar</EmptyTitle>
              <EmptyText>
                Selecione o foco desejado e clique em "Executar Otimização" para
                receber recomendações personalizadas da IA para seu portfólio de
                imóveis.
              </EmptyText>
            </EmptyResults>
          )}
        </Body>
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  overflow-y: auto;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  width: 100%;
  max-width: 1100px;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const HelpIcon = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: help;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HelpIconSmall = styled(HelpIcon)`
  font-size: 12px;
`;

const Actions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;

const CooldownBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.warning}20;
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.8rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 20px 20px;
  overflow: auto;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ControlLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ControlLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FocusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
`;

const FocusButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 2px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary + '15' : theme.colors.cardBackground};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  justify-content: center;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary + '10'};
  }
`;

const RunRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const RunInfo = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CooldownText = styled.span`
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.8rem;
`;

const RunButton = styled.button<{ $onCooldown?: boolean }>`
  background: ${({ theme, $onCooldown }) =>
    $onCooldown ? theme.colors.textSecondary : theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: ${({ $onCooldown }) => ($onCooldown ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  font-weight: 600;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.primary}40;
  }
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
`;

const ResultsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ResultsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ResultsTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
`;

const ResultCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const ResultTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

const ScoreBadge = styled.span<{ $score: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  background: ${({ $score }) =>
    $score >= 80 ? '#10B981' : $score >= 60 ? '#F59E0B' : '#EF4444'};
  cursor: help;
`;

const ResultMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 6px 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const MetaItem = styled.div`
  cursor: help;
`;

const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`;

const SectionTitle = styled.h5`
  margin: 0;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
`;

const RecommendationList = styled.ul`
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  li {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.875rem;
  }
`;

const ReasonText = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85rem;
  cursor: help;
  padding: 8px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 6px;
  font-style: italic;
`;

const EmptyResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  gap: 12px;
`;

const EmptyIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.6;
`;

const EmptyTitle = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const EmptyText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  max-width: 400px;
`;
