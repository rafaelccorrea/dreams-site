import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdTrendingUp,
  MdTimer,
  MdAttachMoney,
  MdLightbulb,
  MdAutoAwesome,
  MdTrendingDown,
  MdTrendingFlat,
} from 'react-icons/md';
import type { PredictiveSalesResponse } from '../../services/aiAssistantApi';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  z-index: 999999;
  align-items: center;
  justify-content: center;
  padding: 60px 20px 20px 20px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 1024px) {
    padding: 50px 20px 20px 20px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    align-items: flex-start;
    padding-top: 40px;
  }
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  width: 100%;
  max-width: 1200px;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.4);
  border: 1px solid ${props => props.theme.colors.border};
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 1024px) {
    max-width: 95%;
    max-height: 90vh;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 20px;
    max-height: 95vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.backgroundSecondary} 0%,
    ${props => props.theme.colors.cardBackground} 100%
  );
  position: relative;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
  }

  @media (max-width: 768px) {
    padding: 18px 20px;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    color: #3b82f6;
  }
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;

  &:hover {
    background: ${props => props.theme.colors.background};
    transform: rotate(90deg);
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ModalBody = styled.div`
  padding: 32px 28px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  flex: 1;
  max-height: calc(85vh - 100px);

  @media (max-width: 1024px) {
    padding: 28px 24px 24px 24px;
    gap: 18px;
    max-height: calc(90vh - 100px);
  }

  @media (max-width: 768px) {
    padding: 24px 20px 20px 20px;
    gap: 16px;
    max-height: calc(95vh - 100px);
  }
`;

const PropertyTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding-bottom: 10px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StatCard = styled.div<{ $highlight?: boolean }>`
  background: ${props =>
    props.$highlight
      ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
      : props.theme.colors.backgroundSecondary};
  border: 1px solid
    ${props => (props.$highlight ? 'transparent' : props.theme.colors.border)};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props =>
      props.$highlight
        ? 'rgba(255, 255, 255, 0.3)'
        : `linear-gradient(90deg, ${props.theme.colors.primary} 0%, transparent 100%)`};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props =>
      props.$highlight
        ? '0 12px 24px rgba(59, 130, 246, 0.3)'
        : `0 8px 16px rgba(0, 0, 0, 0.1)`};
  }

  @media (max-width: 768px) {
    padding: 14px;
    gap: 8px;
  }
`;

const StatLabel = styled.span<{ $highlight?: boolean }>`
  font-size: 12px;
  color: ${props =>
    props.$highlight
      ? 'rgba(255, 255, 255, 0.8)'
      : props.theme.colors.textSecondary};
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div<{ $highlight?: boolean }>`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${props => (props.$highlight ? '#FFFFFF' : props.theme.colors.text)};
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: 1.2;

  svg {
    color: ${props =>
      props.$highlight
        ? 'rgba(255, 255, 255, 0.9)'
        : props.theme.colors.primary};
    flex-shrink: 0;
  }

  @media (max-width: 1024px) {
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    gap: 6px;
  }
`;

const StatValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatValueNumber = styled.span`
  font-size: inherit;
  font-weight: inherit;
`;

const ProbabilityBadge = styled.span<{ $probability: number }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.$probability >= 70) return 'rgba(34, 197, 94, 0.15)';
    if (props.$probability >= 40) return 'rgba(251, 191, 36, 0.15)';
    return 'rgba(239, 68, 68, 0.15)';
  }};
  color: ${props => {
    if (props.$probability >= 70) return '#22C55E';
    if (props.$probability >= 40) return '#FBBF24';
    return '#EF4444';
  }};
  border: 1px solid
    ${props => {
      if (props.$probability >= 70) return 'rgba(34, 197, 94, 0.3)';
      if (props.$probability >= 40) return 'rgba(251, 191, 36, 0.3)';
      return 'rgba(239, 68, 68, 0.3)';
    }};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 10px;
  text-transform: none;
  letter-spacing: 0;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const PriceCard = styled.div`
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 2px solid #3b82f6;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(59, 130, 246, 0.1) 0%,
      transparent 70%
    );
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const PriceValue = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #1e40af;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;

  svg {
    color: #3b82f6;
  }

  @media (max-width: 1024px) {
    font-size: 1.9rem;
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
    gap: 8px;
  }
`;

const PriceImpactBox = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 16px;
  padding: 20px;
  color: #92400e;
  font-size: 14px;
  line-height: 1.7;
  position: relative;
  overflow: hidden;

  &::before {
    content: '💡';
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 32px;
    opacity: 0.2;
  }

  strong {
    display: block;
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #78350f;
  }
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ListItem = styled.li`
  padding: 14px 18px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: all 0.2s ease;
  position: relative;
  padding-left: 44px;

  &::before {
    content: '→';
    position: absolute;
    left: 18px;
    color: ${props => props.theme.colors.primary};
    font-weight: 700;
    font-size: 16px;
  }

  &:hover {
    background: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.primary};
    transform: translateX(4px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 15px;
`;

const ErrorMessage = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 2px solid #fca5a5;
  border-radius: 16px;
  color: #dc2626;
  font-size: 14px;
  text-align: center;
  line-height: 1.7;
  font-weight: 500;
`;

const Divider = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: 8px 0;
`;

interface PredictiveAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: PredictiveSalesResponse | null;
  loading?: boolean;
  error?: string | null;
}

export const PredictiveAnalysisModal: React.FC<
  PredictiveAnalysisModalProps
> = ({ isOpen, onClose, analysis, loading = false, error = null }) => {
  // Fechar modal com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getProbabilityIcon = (probability: number) => {
    if (probability >= 70) return <MdTrendingUp size={20} />;
    if (probability >= 40) return <MdTrendingFlat size={20} />;
    return <MdTrendingDown size={20} />;
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdAutoAwesome size={24} />
            Análise Preditiva de Vendas
          </ModalTitle>
          <CloseButton onClick={onClose} title='Fechar'>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
              <div>Gerando análise preditiva...</div>
            </LoadingContainer>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : analysis ? (
            <>
              <PropertyTitle>{analysis.propertyTitle}</PropertyTitle>

              <StatsGrid>
                <StatCard $highlight>
                  <StatLabel $highlight>Venda Estimada</StatLabel>
                  <StatValue $highlight>
                    <MdTimer size={24} />
                    {analysis.estimatedDaysToSale} dias
                  </StatValue>
                </StatCard>

                <StatCard>
                  <StatLabel>Probabilidade 30 dias</StatLabel>
                  <StatValue>
                    <StatValueRow>
                      <StatValueNumber>
                        {analysis.probability30Days}%
                      </StatValueNumber>
                    </StatValueRow>
                    <ProbabilityBadge $probability={analysis.probability30Days}>
                      {getProbabilityIcon(analysis.probability30Days)}
                      {analysis.probability30Days >= 70
                        ? 'Alta'
                        : analysis.probability30Days >= 40
                          ? 'Média'
                          : 'Baixa'}
                    </ProbabilityBadge>
                  </StatValue>
                </StatCard>

                <StatCard>
                  <StatLabel>Probabilidade 60 dias</StatLabel>
                  <StatValue>
                    <StatValueRow>
                      <StatValueNumber>
                        {analysis.probability60Days}%
                      </StatValueNumber>
                    </StatValueRow>
                    <ProbabilityBadge $probability={analysis.probability60Days}>
                      {getProbabilityIcon(analysis.probability60Days)}
                      {analysis.probability60Days >= 70
                        ? 'Alta'
                        : analysis.probability60Days >= 40
                          ? 'Média'
                          : 'Baixa'}
                    </ProbabilityBadge>
                  </StatValue>
                </StatCard>

                <StatCard>
                  <StatLabel>Probabilidade 90 dias</StatLabel>
                  <StatValue>
                    <StatValueRow>
                      <StatValueNumber>
                        {analysis.probability90Days}%
                      </StatValueNumber>
                    </StatValueRow>
                    <ProbabilityBadge $probability={analysis.probability90Days}>
                      {getProbabilityIcon(analysis.probability90Days)}
                      {analysis.probability90Days >= 70
                        ? 'Alta'
                        : analysis.probability90Days >= 40
                          ? 'Média'
                          : 'Baixa'}
                    </ProbabilityBadge>
                  </StatValue>
                </StatCard>
              </StatsGrid>

              {analysis.suggestedPrice && (
                <Section>
                  <SectionTitle>
                    <MdAttachMoney size={20} />
                    Preço Sugerido pela IA
                  </SectionTitle>
                  <PriceCard>
                    <PriceValue>
                      <MdAttachMoney size={32} />
                      {formatCurrency(analysis.suggestedPrice)}
                    </PriceValue>
                  </PriceCard>
                </Section>
              )}

              {analysis.priceImpact && (
                <PriceImpactBox>
                  <strong>💡 Impacto do Preço</strong>
                  <div>{analysis.priceImpact}</div>
                </PriceImpactBox>
              )}

              {analysis.influencingFactors &&
                analysis.influencingFactors.length > 0 && (
                  <Section>
                    <SectionTitle>
                      <MdTrendingUp size={20} />
                      Fatores que Influenciam
                    </SectionTitle>
                    <List>
                      {analysis.influencingFactors.map((factor, index) => (
                        <ListItem key={index}>{factor}</ListItem>
                      ))}
                    </List>
                  </Section>
                )}

              {analysis.recommendations &&
                analysis.recommendations.length > 0 && (
                  <Section>
                    <SectionTitle>
                      <MdLightbulb size={20} />
                      Recomendações de Ação
                    </SectionTitle>
                    <List>
                      {analysis.recommendations.map((rec, index) => (
                        <ListItem key={index}>{rec}</ListItem>
                      ))}
                    </List>
                  </Section>
                )}
            </>
          ) : (
            <EmptyState>Nenhuma análise disponível no momento</EmptyState>
          )}
        </ModalBody>
      </Modal>
    </ModalOverlay>
  );
};
