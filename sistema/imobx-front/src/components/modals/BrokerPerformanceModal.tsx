import React from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdTrendingUp,
  MdTrendingDown,
  MdRemove,
} from 'react-icons/md';
import type { BrokerPerformanceResponse } from '../../services/aiAssistantApi';
import { InfoTooltip } from '../common/InfoTooltip';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999999;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  width: 100%;
  max-width: 1100px;
  max-height: 85vh;
  margin-top: 64px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatLabel = styled.span`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const StatValue = styled.span`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const List = styled.ul`
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ListItem = styled.li`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
`;

interface BrokerPerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  broker: BrokerPerformanceResponse;
}

export const BrokerPerformanceModal: React.FC<BrokerPerformanceModalProps> = ({
  isOpen,
  onClose,
  broker,
}) => {
  if (!isOpen) return null;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <MdTrendingUp size={20} color='#10B981' />;
      case 'declining':
        return <MdTrendingDown size={20} color='#EF4444' />;
      default:
        return <MdRemove size={20} color='#6B7280' />;
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Performance: {broker.brokerName}</ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <StatsGrid>
            <StatCard>
              <StatLabel>
                Score Geral
                <InfoTooltip content='Índice ponderado da performance geral do corretor.' />
              </StatLabel>
              <StatValue>{broker.overallScore}%</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>
                Vendas
                <InfoTooltip content='Quantidade total de vendas no período selecionado.' />
              </StatLabel>
              <StatValue>{broker.salesCount}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>
                Taxa de Conversão
                <InfoTooltip content='Percentual de leads convertidos em vendas.' />
              </StatLabel>
              <StatValue>{broker.conversionRate.toFixed(1)}%</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>
                Valor Total
                <InfoTooltip content='Soma dos valores de todas as vendas no período.' />
              </StatLabel>
              <StatValue>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                }).format(broker.totalSalesValue)}
              </StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>
                Tempo Médio de Venda
                <InfoTooltip content='Tempo médio entre início do processo e fechamento da venda.' />
              </StatLabel>
              <StatValue>{broker.averageSaleTime} dias</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>
                Tendência
                <InfoTooltip content='Direção da performance em relação ao período anterior.' />
              </StatLabel>
              <StatValue>{getTrendIcon(broker.trend)}</StatValue>
            </StatCard>
          </StatsGrid>

          {broker.strengths && broker.strengths.length > 0 && (
            <Section>
              <SectionTitle>Pontos Fortes</SectionTitle>
              <List>
                {broker.strengths.map((strength, index) => (
                  <ListItem key={index}>{strength}</ListItem>
                ))}
              </List>
            </Section>
          )}

          {broker.improvements && broker.improvements.length > 0 && (
            <Section>
              <SectionTitle>Áreas de Melhoria</SectionTitle>
              <List>
                {broker.improvements.map((improvement, index) => (
                  <ListItem key={index}>{improvement}</ListItem>
                ))}
              </List>
            </Section>
          )}

          {broker.recommendations && broker.recommendations.length > 0 && (
            <Section>
              <SectionTitle>Recomendações</SectionTitle>
              <List>
                {broker.recommendations.map((rec, index) => (
                  <ListItem key={index}>{rec}</ListItem>
                ))}
              </List>
            </Section>
          )}
        </ModalBody>
      </Modal>
    </ModalOverlay>
  );
};
