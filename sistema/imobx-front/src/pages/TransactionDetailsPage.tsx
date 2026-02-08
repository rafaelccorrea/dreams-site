import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import {
  MdArrowBack,
  MdAttachMoney,
  MdDescription,
  MdCategory,
  MdPayment,
  MdCalendarToday,
  MdPerson,
  MdFlag,
  MdHome,
  MdEmail,
  MdReceipt,
  MdLabel,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { useFinancial } from '../hooks/useFinancial';
import type { FinancialTransaction } from '../types/financial';
import { getCategoryLabel } from '../types/financial';
import { PageContentShimmer } from '../components/shimmer';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  BackButton,
} from '../styles/pages/ClientFormPageStyles';
import styled from 'styled-components';

const DetailsContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
`;

const Section = styled.div`
  padding: 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: 400;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailGridSingle = styled.div`
  display: grid;
  gap: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary}40;
    box-shadow: 0 2px 8px ${props => props.theme.colors.primary}10;
  }
`;

const DetailItemHighlight = styled(DetailItem)`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}08,
    ${props => props.theme.colors.primary}03
  );
  border: 2px solid ${props => props.theme.colors.primary}30;

  &:hover {
    border-color: ${props => props.theme.colors.primary}60;
    box-shadow: 0 4px 16px ${props => props.theme.colors.primary}20;
  }
`;

const DetailIcon = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$color || props.theme.colors.primary}20;
  color: ${props => props.$color || props.theme.colors.primary};
  flex-shrink: 0;
  font-size: 24px;
`;

const DetailContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.div<{ $highlight?: boolean; $color?: string }>`
  font-size: ${props => (props.$highlight ? '1.125rem' : '1rem')};
  font-weight: ${props => (props.$highlight ? '700' : '500')};
  color: ${props => props.$color || props.theme.colors.text};
  word-break: break-word;
  line-height: 1.5;
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

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const PropertyCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary}60;
  border-radius: 8px;
  border: 1px dashed ${props => props.theme.colors.border};
`;

const PropertyTitle = styled.div`
  font-weight: 700;
  font-size: 1.0625rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;

  &:before {
    content: '🏠';
    font-size: 1.25rem;
  }
`;

const PropertyAddress = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  padding-left: 28px;
  font-weight: 500;
`;

const AmountCard = styled(DetailItemHighlight)`
  border-width: 2px;
`;

const AmountValue = styled.div<{ $type: string }>`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => (props.$type === 'income' ? '#10b981' : '#ef4444')};
  letter-spacing: -0.5px;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const AmountLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TransactionDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { transactions, getTransactions } = useFinancial();
  const [transaction, setTransaction] = useState<FinancialTransaction | null>(
    null
  );

  useEffect(() => {
    const loadTransaction = async () => {
      if (!id) {
        message.error('ID da transação não encontrado');
        navigate('/financial');
        return;
      }

      const existingTransaction = transactions.find(t => t.id === id);

      if (existingTransaction) {
        setTransaction(existingTransaction);
      } else {
        await getTransactions();
      }
    };

    loadTransaction();
  }, [id, transactions, navigate, getTransactions]);

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

  if (!transaction) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <PageContentShimmer />
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Detalhes da Transação</PageTitle>
              <PageSubtitle>
                Visualize as informações completas da transação
              </PageSubtitle>
            </PageTitleContainer>
            <BackButton onClick={() => navigate('/financial')} type='button'>
              <MdArrowBack size={18} />
              Voltar
            </BackButton>
          </PageHeader>

          <DetailsContainer>
            {/* Valor em Destaque */}
            <Section>
              <AmountCard>
                <DetailIcon
                  $color={transaction.type === 'income' ? '#10b981' : '#ef4444'}
                >
                  <MdAttachMoney />
                </DetailIcon>
                <DetailContent>
                  <AmountLabel>
                    {transaction.type === 'income'
                      ? '💰 Receita'
                      : '💸 Despesa'}
                  </AmountLabel>
                  <AmountValue $type={transaction.type}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </AmountValue>
                  <DetailValue>
                    {(transaction as any).title || transaction.description}
                  </DetailValue>
                </DetailContent>
              </AmountCard>
            </Section>

            {/* Informações Básicas */}
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <MdDescription />
                  Informações Gerais
                </SectionTitle>
                <SectionDescription>
                  Dados principais da transação
                </SectionDescription>
              </SectionHeader>
              <DetailGrid>
                <DetailItem>
                  <DetailIcon>
                    <MdFlag />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Tipo de Transação</DetailLabel>
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
                    <DetailValue $highlight>
                      {getCategoryLabel(transaction.category) ||
                        'Não categorizada'}
                    </DetailValue>
                  </DetailContent>
                </DetailItem>

                {(transaction as any).documentNumber && (
                  <DetailItem>
                    <DetailIcon>
                      <MdReceipt />
                    </DetailIcon>
                    <DetailContent>
                      <DetailLabel>Número do Documento</DetailLabel>
                      <DetailValue $highlight>
                        {(transaction as any).documentNumber}
                      </DetailValue>
                    </DetailContent>
                  </DetailItem>
                )}
              </DetailGrid>

              {transaction.description &&
                transaction.description !== (transaction as any).title && (
                  <DetailGridSingle style={{ marginTop: '16px' }}>
                    <DetailItem>
                      <DetailIcon>
                        <MdDescription />
                      </DetailIcon>
                      <DetailContent>
                        <DetailLabel>Descrição Completa</DetailLabel>
                        <DetailValue>{transaction.description}</DetailValue>
                      </DetailContent>
                    </DetailItem>
                  </DetailGridSingle>
                )}
            </Section>

            {/* Propriedade Relacionada */}
            {(transaction as any).property && (
              <Section>
                <SectionHeader>
                  <SectionTitle>
                    <MdHome />
                    Propriedade Vinculada
                  </SectionTitle>
                  <SectionDescription>
                    Imóvel relacionado a esta transação
                  </SectionDescription>
                </SectionHeader>
                <DetailGridSingle>
                  <PropertyCard>
                    <PropertyTitle>
                      {(transaction as any).property.title}
                    </PropertyTitle>
                    {(transaction as any).property.address && (
                      <PropertyAddress>
                        📍 {(transaction as any).property.address}
                      </PropertyAddress>
                    )}
                  </PropertyCard>
                </DetailGridSingle>
              </Section>
            )}

            {/* Status e Pagamento */}
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <MdPayment />
                  Pagamento
                </SectionTitle>
                <SectionDescription>
                  Status e forma de pagamento
                </SectionDescription>
              </SectionHeader>
              <DetailGrid>
                <DetailItem>
                  <DetailIcon>
                    <MdFlag />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Status da Transação</DetailLabel>
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
                    <DetailValue $highlight>
                      {getPaymentMethodLabel(transaction.paymentMethod)}
                    </DetailValue>
                  </DetailContent>
                </DetailItem>
              </DetailGrid>
            </Section>

            {/* Datas */}
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <MdCalendarToday />
                  Cronologia
                </SectionTitle>
                <SectionDescription>
                  Histórico de datas da transação
                </SectionDescription>
              </SectionHeader>
              <DetailGrid>
                <DetailItem>
                  <DetailIcon $color='#3b82f6'>
                    <MdCalendarToday />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Data da Transação</DetailLabel>
                    <DetailValue $highlight>
                      {formatDate(transaction.transactionDate)}
                    </DetailValue>
                  </DetailContent>
                </DetailItem>

                {transaction.createdAt && (
                  <DetailItem>
                    <DetailIcon $color='#8b5cf6'>
                      <MdCalendarToday />
                    </DetailIcon>
                    <DetailContent>
                      <DetailLabel>Criado em</DetailLabel>
                      <DetailValue>
                        {formatDate(transaction.createdAt)}
                      </DetailValue>
                    </DetailContent>
                  </DetailItem>
                )}

                {transaction.updatedAt &&
                  transaction.updatedAt !== transaction.createdAt && (
                    <DetailItem>
                      <DetailIcon $color='#f59e0b'>
                        <MdCalendarToday />
                      </DetailIcon>
                      <DetailContent>
                        <DetailLabel>Última Modificação</DetailLabel>
                        <DetailValue>
                          {formatDate(transaction.updatedAt)}
                        </DetailValue>
                      </DetailContent>
                    </DetailItem>
                  )}
              </DetailGrid>
            </Section>

            {/* Responsável */}
            {((transaction as any).responsibleUser ||
              transaction.responsibleUserId) && (
              <Section>
                <SectionHeader>
                  <SectionTitle>
                    <MdPerson />
                    Responsável pela Transação
                  </SectionTitle>
                  <SectionDescription>
                    Usuário que registrou esta movimentação
                  </SectionDescription>
                </SectionHeader>
                {(transaction as any).responsibleUser ? (
                  <DetailGridSingle>
                    <DetailItem>
                      <DetailIcon $color='#6366f1'>
                        <MdPerson />
                      </DetailIcon>
                      <DetailContent>
                        <DetailLabel>Nome Completo</DetailLabel>
                        <DetailValue $highlight>
                          {(transaction as any).responsibleUser.name}
                        </DetailValue>
                        <DetailValue
                          style={{ marginTop: '8px', fontSize: '0.875rem' }}
                        >
                          <MdEmail
                            style={{
                              display: 'inline',
                              marginRight: '6px',
                              verticalAlign: 'middle',
                            }}
                          />
                          {(transaction as any).responsibleUser.email}
                        </DetailValue>
                      </DetailContent>
                    </DetailItem>
                  </DetailGridSingle>
                ) : (
                  <DetailGrid>
                    <DetailItem>
                      <DetailIcon>
                        <MdPerson />
                      </DetailIcon>
                      <DetailContent>
                        <DetailLabel>ID do Responsável</DetailLabel>
                        <DetailValue>
                          {transaction.responsibleUserId}
                        </DetailValue>
                      </DetailContent>
                    </DetailItem>
                  </DetailGrid>
                )}
              </Section>
            )}

            {/* Tags */}
            {(transaction as any).tags &&
              (transaction as any).tags.length > 0 && (
                <Section>
                  <SectionHeader>
                    <SectionTitle>
                      <MdLabel />
                      Tags
                    </SectionTitle>
                    <SectionDescription>
                      Etiquetas associadas à transação
                    </SectionDescription>
                  </SectionHeader>
                  <TagsList>
                    {(transaction as any).tags.map(
                      (tag: string, index: number) => (
                        <Tag key={index}>
                          <MdLabel size={14} />
                          {tag}
                        </Tag>
                      )
                    )}
                  </TagsList>
                </Section>
              )}

            {/* Observações */}
            {(transaction as any).notes && (
              <Section>
                <SectionHeader>
                  <SectionTitle>
                    <MdDescription />
                    Observações Adicionais
                  </SectionTitle>
                  <SectionDescription>
                    Notas e comentários sobre a transação
                  </SectionDescription>
                </SectionHeader>
                <DetailGridSingle>
                  <DetailItem>
                    <DetailIcon $color='#10b981'>
                      <MdDescription />
                    </DetailIcon>
                    <DetailContent>
                      <DetailLabel>Notas</DetailLabel>
                      <DetailValue>{(transaction as any).notes}</DetailValue>
                    </DetailContent>
                  </DetailItem>
                </DetailGridSingle>
              </Section>
            )}
          </DetailsContainer>
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default TransactionDetailsPage;
