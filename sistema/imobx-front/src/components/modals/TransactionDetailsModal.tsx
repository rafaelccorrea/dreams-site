import React from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import {
  MdClose,
  MdAttachMoney,
  MdDescription,
  MdCategory,
  MdPayment,
  MdCalendarToday,
  MdPerson,
  MdFlag,
} from 'react-icons/md';
import type { FinancialTransaction } from '../../types/financial';
import { getCategoryLabel } from '../../types/financial';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.border};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalContent = styled.div`
  padding: 28px;
`;

const DetailSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const DetailIcon = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.$color || props.theme.colors.primary}20;
  color: ${props => props.$color || props.theme.colors.primary};
  flex-shrink: 0;
`;

const DetailContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const DetailLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
`;

const DetailValue = styled.div<{ $highlight?: boolean; $color?: string }>`
  font-size: 1rem;
  font-weight: ${props => (props.$highlight ? '600' : '500')};
  color: ${props => props.$color || props.theme.colors.text};
  word-break: break-word;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    switch (props.$status) {
      case 'completed':
        return `
          background: ${props.theme.mode === 'dark' ? '#065f46' : '#d1fae5'};
          color: ${props.theme.mode === 'dark' ? '#6ee7b7' : '#065f46'};
        `;
      case 'pending':
        return `
          background: ${props.theme.mode === 'dark' ? '#92400e' : '#fef3c7'};
          color: ${props.theme.mode === 'dark' ? '#fbbf24' : '#92400e'};
        `;
      case 'cancelled':
        return `
          background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
          color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
        `;
      default:
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.textSecondary};
        `;
    }
  }}
`;

const TypeBadge = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    if (props.$type === 'income') {
      return `
        background: ${props.theme.mode === 'dark' ? '#065f46' : '#d1fae5'};
        color: ${props.theme.mode === 'dark' ? '#6ee7b7' : '#065f46'};
      `;
    } else {
      return `
        background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
        color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
      `;
    }
  }}
`;

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: FinancialTransaction | null;
}

export const TransactionDetailsModal: React.FC<
  TransactionDetailsModalProps
> = ({ isOpen, onClose, transaction }) => {
  if (!transaction) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeLabel = (type: string) => {
    return type === 'income' ? 'Receita' : 'Despesa';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getPaymentMethodLabel = (method?: string) => {
    switch (method) {
      case 'pix':
        return 'PIX';
      case 'credit_card':
        return 'Cartão de Crédito';
      case 'debit_card':
        return 'Cartão de Débito';
      case 'bank_transfer':
        return 'Transferência Bancária';
      case 'cash':
        return 'Dinheiro';
      case 'check':
        return 'Cheque';
      default:
        return method || 'Não informado';
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdAttachMoney />
            Detalhes da Transação
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          {/* Informações Básicas */}
          <DetailSection>
            <SectionTitle>
              <MdDescription />
              Informações Básicas
            </SectionTitle>
            <DetailGrid>
              <DetailItem>
                <DetailIcon>
                  <MdDescription />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Descrição</DetailLabel>
                  <DetailValue $highlight>
                    {transaction.description}
                  </DetailValue>
                </DetailContent>
              </DetailItem>

              <DetailItem>
                <DetailIcon
                  $color={transaction.type === 'income' ? '#10b981' : '#ef4444'}
                >
                  <MdAttachMoney />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Valor</DetailLabel>
                  <DetailValue
                    $highlight
                    $color={
                      transaction.type === 'income' ? '#10b981' : '#ef4444'
                    }
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </DetailValue>
                </DetailContent>
              </DetailItem>

              <DetailItem>
                <DetailIcon>
                  <MdFlag />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Tipo</DetailLabel>
                  <TypeBadge $type={transaction.type}>
                    {getTypeLabel(transaction.type)}
                  </TypeBadge>
                </DetailContent>
              </DetailItem>

              <DetailItem>
                <DetailIcon>
                  <MdCategory />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Categoria</DetailLabel>
                  <DetailValue>
                    {transaction.categoryLabel ||
                      getCategoryLabel(transaction.category) ||
                      'Não categorizada'}
                  </DetailValue>
                </DetailContent>
              </DetailItem>
            </DetailGrid>
          </DetailSection>

          {/* Status e Pagamento */}
          <DetailSection>
            <SectionTitle>
              <MdPayment />
              Status e Pagamento
            </SectionTitle>
            <DetailGrid>
              <DetailItem>
                <DetailIcon>
                  <MdFlag />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Status</DetailLabel>
                  <StatusBadge $status={transaction.status}>
                    {getStatusLabel(transaction.status)}
                  </StatusBadge>
                </DetailContent>
              </DetailItem>

              <DetailItem>
                <DetailIcon>
                  <MdPayment />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Método de Pagamento</DetailLabel>
                  <DetailValue>
                    {getPaymentMethodLabel(transaction.paymentMethod)}
                  </DetailValue>
                </DetailContent>
              </DetailItem>
            </DetailGrid>
          </DetailSection>

          {/* Datas */}
          <DetailSection>
            <SectionTitle>
              <MdCalendarToday />
              Datas
            </SectionTitle>
            <DetailGrid>
              <DetailItem>
                <DetailIcon>
                  <MdCalendarToday />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Data da Transação</DetailLabel>
                  <DetailValue>
                    {formatDate(transaction.transactionDate)}
                  </DetailValue>
                </DetailContent>
              </DetailItem>

              {transaction.createdAt && (
                <DetailItem>
                  <DetailIcon>
                    <MdCalendarToday />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Data de Criação</DetailLabel>
                    <DetailValue>
                      {formatDate(transaction.createdAt)}
                    </DetailValue>
                  </DetailContent>
                </DetailItem>
              )}

              {transaction.updatedAt &&
                transaction.updatedAt !== transaction.createdAt && (
                  <DetailItem>
                    <DetailIcon>
                      <MdCalendarToday />
                    </DetailIcon>
                    <DetailContent>
                      <DetailLabel>Última Atualização</DetailLabel>
                      <DetailValue>
                        {formatDate(transaction.updatedAt)}
                      </DetailValue>
                    </DetailContent>
                  </DetailItem>
                )}
            </DetailGrid>
          </DetailSection>

          {/* Responsável */}
          {transaction.responsibleUserId && (
            <DetailSection>
              <SectionTitle>
                <MdPerson />
                Responsável
              </SectionTitle>
              <DetailGrid>
                <DetailItem>
                  <DetailIcon>
                    <MdPerson />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>ID do Responsável</DetailLabel>
                    <DetailValue>{transaction.responsibleUserId}</DetailValue>
                  </DetailContent>
                </DetailItem>
              </DetailGrid>
            </DetailSection>
          )}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default TransactionDetailsModal;
