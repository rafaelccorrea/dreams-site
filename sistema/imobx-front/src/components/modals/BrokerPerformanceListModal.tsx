import React from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdTrendingUp,
  MdTrendingDown,
  MdRemove,
} from 'react-icons/md';
import type { BrokerPerformanceResponse } from '../../services/aiAssistantApi';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999999;
  align-items: center;
  justify-content: center;
  padding: 80px 20px 20px 20px;
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  width: 100%;
  max-width: 1200px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
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
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const ModalBody = styled.div`
  padding: 16px 20px;
  overflow: auto;
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BrokerName = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
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
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
`;

const Value = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

interface BrokerPerformanceListModalProps {
  isOpen: boolean;
  onClose: () => void;
  brokers: BrokerPerformanceResponse[];
}

export const BrokerPerformanceListModal: React.FC<
  BrokerPerformanceListModalProps
> = ({ isOpen, onClose, brokers }) => {
  if (!isOpen) return null;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <MdTrendingUp size={16} color='#10B981' />;
      case 'declining':
        return <MdTrendingDown size={16} color='#EF4444' />;
      default:
        return <MdRemove size={16} color='#6B7280' />;
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Todos os Corretores</ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          <ListGrid>
            {brokers.map(broker => (
              <Card key={broker.brokerId}>
                <CardHeader>
                  <BrokerName>{broker.brokerName}</BrokerName>
                  <ScoreBadge $score={broker.overallScore}>
                    {broker.overallScore}%
                  </ScoreBadge>
                </CardHeader>
                <Row>
                  <span>Vendas</span>
                  <Value>{broker.salesCount}</Value>
                </Row>
                <Row>
                  <span>Taxa de Conversão</span>
                  <Value>{broker.conversionRate.toFixed(1)}%</Value>
                </Row>
                <Row>
                  <span>Valor Total</span>
                  <Value>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 0,
                    }).format(broker.totalSalesValue)}
                  </Value>
                </Row>
                <Row>
                  <span>Tendência</span>
                  <Value>{getTrendIcon(broker.trend)}</Value>
                </Row>
              </Card>
            ))}
          </ListGrid>
        </ModalBody>
      </Modal>
    </ModalOverlay>
  );
};
