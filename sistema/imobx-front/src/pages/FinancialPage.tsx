import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  HistoryOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  MdSearch,
  MdFilterList,
  MdTrendingUp,
  MdTrendingDown,
  MdAccountBalance,
  MdCheckCircle,
  MdHome,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { FinancialShimmer } from '../components/shimmer';
import { useFinancial } from '../hooks/useFinancial';
import { useFinancialApprovals } from '../hooks/useFinancialApprovals';
import { PermissionButton } from '../components/common/PermissionButton';
import { Tooltip } from '../components/ui/Tooltip';
import type {
  FinancialTransaction,
  FinancialTransactionFilters,
  FinancialApprovalRequest,
} from '../types/financial';
import {
  getCategoryLabel,
  getPaymentMethodLabel,
  getStatusLabel,
  formatCurrency,
  getTypeLabel,
} from '../types/financial';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  ActionsBar,
  LeftActions,
  RightActions,
  SearchContainer,
  SearchInput,
  SearchIcon,
  FilterToggle,
  CounterBadge,
  SummaryContainer,
  SummaryCard,
  SummaryIcon,
  SummaryValue,
  SummaryLabel,
  TransactionsCard,
  TransactionsTable,
  TableHeader,
  TableRow,
  TableCell,
  StatusBadge,
  TypeBadge,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  PaginationWrapper,
  PaginationButton,
  TransactionActions,
  ActionButton,
  TabsContainer,
  TabButton,
  TabContent,
} from '../styles/pages/FinancialPageStyles';
import {
  ApprovalsCard,
  ApprovalsList,
  ApprovalItem,
  ApprovalHeader,
  ApprovalHeaderLeft,
  ApprovalTypeBadge,
  ApprovalTitle,
  ApprovalSubtitle,
  ApprovalDate,
  ApprovalContent,
  ApprovalValues,
  ValueItem,
  ValueLabel,
  ValueAmount,
  ApprovalActions,
  ApprovalActionButton,
} from '../styles/pages/FinancialApprovalsPageStyles';
import { FinancialFiltersDrawer } from '../components/financial/FinancialFiltersDrawer';
import { PropertyExpensesList } from '../components/financial/PropertyExpensesList';
import { TransactionAuditModal } from '../components/modals/TransactionAuditModal';
import { ApproveApprovalModal } from '../components/modals/ApproveApprovalModal';
import { RejectApprovalModal } from '../components/modals/RejectApprovalModal';

const FinancialPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'transactions' | 'approvals' | 'expenses'
  >('transactions');
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<FinancialTransaction | null>(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] =
    useState<FinancialApprovalRequest | null>(null);
  const [filters, setFilters] = useState<FinancialTransactionFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    transactions,
    isLoading,
    totalPages,
    summary,
    deleteTransaction,
    getTransactions,
    getFinancialSummary,
  } = useFinancial();

  const {
    approvals,
    isLoading: isLoadingApprovals,
    getPendingApprovals,
    refreshApprovals,
  } = useFinancialApprovals();

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
    if (activeTab === 'approvals') {
      getPendingApprovals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, filters, activeTab]);

  const loadData = async () => {
    try {
      console.log('🔄 Carregando dados financeiros com filtros:', filters);
      await Promise.all([
        getTransactions(filters, { page: currentPage, limit: pageSize }),
        getFinancialSummary(),
      ]);
    } catch (error) {
      console.error('❌ Erro ao carregar dados financeiros:', error);
      message.error('Erro ao carregar dados financeiros');
    }
  };

  const handleApprove = (approval: FinancialApprovalRequest) => {
    setSelectedApproval(approval);
    setApproveModalOpen(true);
  };

  const handleReject = (approval: FinancialApprovalRequest) => {
    setSelectedApproval(approval);
    setRejectModalOpen(true);
  };

  const handleViewDetails = (approval: FinancialApprovalRequest) => {
    // Navegar para a página de detalhes em vez de abrir modal
    navigate(`/financial/approval/${approval.id}`);
  };

  const handleApproved = async () => {
    message.success('Solicitação aprovada com sucesso!');
    setApproveModalOpen(false);
    setSelectedApproval(null);
    await refreshApprovals();
  };

  const handleRejected = async () => {
    message.success('Solicitação recusada');
    setRejectModalOpen(false);
    setSelectedApproval(null);
    await refreshApprovals();
  };

  const handleModalClose = () => {
    setApproveModalOpen(false);
    setRejectModalOpen(false);
    setSelectedApproval(null);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      message.success('Transação excluída com sucesso!');
      loadData();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      message.error('Erro ao excluir transação');
    }
  };

  const handleEditClick = (id: string) => {
    navigate(`/financial/edit/${id}`);
  };

  const handleFiltersChange = (newFilters: FinancialTransactionFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleApplyFilters = (newFilters: FinancialTransactionFilters) => {
    handleFiltersChange(newFilters);
    setFiltersModalOpen(false);
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof FinancialTransactionFilters];
    if (typeof value === 'boolean') {
      return value === true;
    }
    return value !== undefined && value !== null && value !== '';
  });

  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof FinancialTransactionFilters];
    if (typeof value === 'boolean') {
      return value === true;
    }
    return value !== undefined && value !== null && value !== '';
  }).length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.description?.toLowerCase().includes(searchLower) ||
      transaction.category?.toLowerCase().includes(searchLower) ||
      transaction.categoryLabel?.toLowerCase().includes(searchLower) ||
      getCategoryLabel(transaction.category)
        ?.toLowerCase()
        .includes(searchLower) ||
      getTypeLabel(transaction.type)?.toLowerCase().includes(searchLower) ||
      getPaymentMethodLabel(transaction.paymentMethod)
        ?.toLowerCase()
        .includes(searchLower)
    );
  });

  if (isLoading && !transactions.length) {
    return (
      <Layout>
        <PageContainer>
          <FinancialShimmer />
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          {/* Header */}
          <PageHeader>
            <PageTitleContainer>
              <div>
                <PageTitle>Financeiro</PageTitle>
                <PageSubtitle>
                  Gerencie suas receitas, despesas e fluxo de caixa
                </PageSubtitle>
              </div>

              <PermissionButton
                permission='financial:create'
                onClick={() => navigate('/financial/new')}
                variant='primary'
                size='medium'
              >
                <PlusOutlined />
                Nova Transação
              </PermissionButton>
            </PageTitleContainer>
          </PageHeader>

          {/* Tabs */}
          <TabsContainer>
            <TabButton
              $active={activeTab === 'transactions'}
              onClick={() => setActiveTab('transactions')}
            >
              <DollarOutlined />
              Transações
            </TabButton>
            <TabButton
              $active={activeTab === 'approvals'}
              onClick={() => setActiveTab('approvals')}
            >
              <MdCheckCircle />
              Aprovações
              {approvals.length > 0 && (
                <CounterBadge>{approvals.length}</CounterBadge>
              )}
            </TabButton>
            <TabButton
              $active={activeTab === 'expenses'}
              onClick={() => setActiveTab('expenses')}
            >
              <MdHome />
              Despesas de Propriedade
            </TabButton>
          </TabsContainer>

          {/* Tab: Transactions */}
          <TabContent $active={activeTab === 'transactions'}>
            {/* Actions Bar */}
            <ActionsBar>
              <LeftActions>
                <SearchContainer>
                  <SearchInput
                    placeholder='Buscar transações...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <SearchIcon>
                    <MdSearch />
                  </SearchIcon>
                </SearchContainer>

                <FilterToggle
                  onClick={() => setFiltersModalOpen(true)}
                  $hasActiveFilters={hasActiveFilters}
                >
                  <MdFilterList />
                  Filtros
                  {hasActiveFilters && (
                    <CounterBadge>{activeFiltersCount}</CounterBadge>
                  )}
                </FilterToggle>
              </LeftActions>

              <RightActions>
                {/* View controls or other actions can go here */}
              </RightActions>
            </ActionsBar>

            {/* Summary Cards */}
            <SummaryContainer>
              <SummaryCard $type='income'>
                <SummaryIcon $type='income'>
                  <MdTrendingUp />
                </SummaryIcon>
                <SummaryValue>
                  {formatCurrency(summary?.totalIncome || 0)}
                </SummaryValue>
                <SummaryLabel>Receitas</SummaryLabel>
              </SummaryCard>

              <SummaryCard $type='expense'>
                <SummaryIcon $type='expense'>
                  <MdTrendingDown />
                </SummaryIcon>
                <SummaryValue>
                  {formatCurrency(summary?.totalExpense || 0)}
                </SummaryValue>
                <SummaryLabel>Despesas</SummaryLabel>
              </SummaryCard>

              <SummaryCard $type='balance'>
                <SummaryIcon $type='balance'>
                  <MdAccountBalance />
                </SummaryIcon>
                <SummaryValue>
                  {formatCurrency(
                    (summary?.totalIncome || 0) - (summary?.totalExpense || 0)
                  )}
                </SummaryValue>
                <SummaryLabel>Saldo</SummaryLabel>
              </SummaryCard>

              <SummaryCard $type='pending'>
                <SummaryIcon $type='pending'>
                  <DollarOutlined />
                </SummaryIcon>
                <SummaryValue>
                  {formatCurrency(summary?.netIncome || 0)}
                </SummaryValue>
                <SummaryLabel>Saldo Líquido</SummaryLabel>
              </SummaryCard>
            </SummaryContainer>

            {/* Transactions */}
            <TransactionsCard>
              {filteredTransactions.length === 0 ? (
                <EmptyState>
                  <EmptyStateIcon>
                    <DollarOutlined />
                  </EmptyStateIcon>
                  <EmptyStateTitle>
                    Nenhuma transação encontrada
                  </EmptyStateTitle>
                  <EmptyStateDescription>
                    {searchTerm || hasActiveFilters
                      ? 'Tente ajustar os filtros ou termo de busca'
                      : 'Comece criando sua primeira transação financeira'}
                  </EmptyStateDescription>
                  {!searchTerm && !hasActiveFilters && (
                    <PermissionButton
                      permission='financial:create'
                      onClick={() => navigate('/financial/new')}
                      variant='primary'
                      size='medium'
                    >
                      <PlusOutlined />
                      Nova Transação
                    </PermissionButton>
                  )}
                </EmptyState>
              ) : (
                <TransactionsTable>
                  <TableHeader>
                    <TableCell>Descrição</TableCell>
                    <TableCell $align='center'>Tipo</TableCell>
                    <TableCell $align='center'>Categoria</TableCell>
                    <TableCell $align='right'>Valor</TableCell>
                    <TableCell $align='center'>Status</TableCell>
                    <TableCell $align='center'>Ações</TableCell>
                  </TableHeader>

                  {filteredTransactions.map((transaction, index) => (
                    <TableRow key={transaction.id} $isEven={index % 2 === 0}>
                      <TableCell $truncate>
                        <div style={{ minWidth: 0, width: '100%' }}>
                          <div
                            style={{
                              fontWeight: '600',
                              marginBottom: '4px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {transaction.description}
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            {dayjs(transaction.transactionDate).format(
                              'DD/MM/YYYY'
                            )}
                          </div>
                          {transaction.paymentMethod && (
                            <div
                              style={{
                                fontSize: '0.8rem',
                                color: 'var(--color-text-secondary)',
                              }}
                            >
                              {getPaymentMethodLabel(transaction.paymentMethod)}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell $align='center'>
                        <TypeBadge $type={transaction.type}>
                          {transaction.type === 'income'
                            ? 'Receita'
                            : 'Despesa'}
                        </TypeBadge>
                      </TableCell>

                      <TableCell $align='center'>
                        <span style={{ fontSize: '0.9rem' }}>
                          {transaction.categoryLabel ||
                            getCategoryLabel(transaction.category)}
                        </span>
                      </TableCell>

                      <TableCell $align='right'>
                        <span
                          style={{
                            fontWeight: '600',
                            color:
                              transaction.type === 'income'
                                ? '#10b981'
                                : '#ef4444',
                          }}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>

                      <TableCell $align='center'>
                        <StatusBadge $status={transaction.status}>
                          {getStatusLabel(transaction.status)}
                        </StatusBadge>
                      </TableCell>

                      <TableCell $align='center'>
                        <TransactionActions>
                          <ActionButton
                            $variant='info'
                            onClick={() =>
                              navigate(`/financial/details/${transaction.id}`)
                            }
                            title='Ver Detalhes'
                          >
                            <EyeOutlined />
                          </ActionButton>

                          <PermissionButton
                            permission='financial:update'
                            onClick={() => handleEditClick(transaction.id)}
                            variant='secondary'
                            size='small'
                          >
                            <EditOutlined />
                          </PermissionButton>

                          <ActionButton
                            $variant='secondary'
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setAuditModalOpen(true);
                            }}
                            title='Histórico'
                          >
                            <HistoryOutlined />
                          </ActionButton>

                          <PermissionButton
                            permission='financial:delete'
                            onClick={() => {
                              Modal.confirm({
                                title: 'Confirmar exclusão',
                                content:
                                  'Tem certeza que deseja excluir esta transação?',
                                okText: 'Excluir',
                                cancelText: 'Cancelar',
                                onOk: () =>
                                  handleDeleteTransaction(transaction.id),
                              });
                            }}
                            variant='danger'
                            size='small'
                          >
                            <DeleteOutlined />
                          </PermissionButton>
                        </TransactionActions>
                      </TableCell>
                    </TableRow>
                  ))}
                </TransactionsTable>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <PaginationWrapper>
                  <PaginationButton
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </PaginationButton>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <PaginationButton
                        key={page}
                        $active={currentPage === page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationButton>
                    );
                  })}

                  <PaginationButton
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </PaginationButton>
                </PaginationWrapper>
              )}
            </TransactionsCard>
          </TabContent>

          {/* Tab: Approvals */}
          <TabContent $active={activeTab === 'approvals'}>
            <ApprovalsCard>
              {isLoadingApprovals ? (
                <EmptyState>
                  <EmptyStateIcon>⏳</EmptyStateIcon>
                  <EmptyStateTitle>Carregando solicitações...</EmptyStateTitle>
                </EmptyState>
              ) : approvals.length === 0 ? (
                <EmptyState>
                  <EmptyStateIcon>✅</EmptyStateIcon>
                  <EmptyStateTitle>
                    Nenhuma solicitação pendente
                  </EmptyStateTitle>
                  <EmptyStateDescription>
                    Quando houver solicitações de aprovação financeira, elas
                    aparecerão aqui.
                  </EmptyStateDescription>
                </EmptyState>
              ) : (
                <ApprovalsList>
                  {approvals.map(approval => (
                    <ApprovalItem key={approval.id}>
                      <ApprovalHeader>
                        <ApprovalHeaderLeft>
                          <ApprovalTypeBadge
                            $type={approval.type || 'inspection'}
                          >
                            {approval.approvalType === 'inspection'
                              ? '🔍 VISTORIA'
                              : approval.type === 'sale'
                                ? '💰 VENDA'
                                : approval.type === 'rental'
                                  ? '🏠 ALUGUEL'
                                  : '📋 APROVAÇÃO'}
                          </ApprovalTypeBadge>
                          <ApprovalTitle>
                            {approval.approvalType === 'inspection'
                              ? approval.inspectionTitle ||
                                'Vistoria sem título'
                              : approval.property?.title ||
                                'Propriedade não informada'}
                            {approval.property?.code &&
                              ` (${approval.property.code})`}
                            {approval.approvalType === 'inspection' &&
                              approval.propertyCode &&
                              ` (${approval.propertyCode})`}
                          </ApprovalTitle>
                          <ApprovalSubtitle>
                            <span>
                              👤{' '}
                              {approval.approvalType === 'inspection'
                                ? approval.requesterName || 'Não informado'
                                : approval.requestedBy?.name || 'Não informado'}
                            </span>
                            <span>•</span>
                            <ApprovalDate>
                              📅{' '}
                              {dayjs(approval.createdAt).format(
                                'DD/MM/YYYY HH:mm'
                              )}
                            </ApprovalDate>
                          </ApprovalSubtitle>
                        </ApprovalHeaderLeft>
                      </ApprovalHeader>

                      <ApprovalContent>
                        {approval.approvalType === 'inspection' ? (
                          <ApprovalValues>
                            <ValueItem>
                              <ValueLabel>Valor da Vistoria</ValueLabel>
                              <ValueAmount>
                                {formatCurrency(
                                  typeof approval.amount === 'string'
                                    ? parseFloat(approval.amount)
                                    : (approval as any).amount || 0
                                )}
                              </ValueAmount>
                            </ValueItem>
                          </ApprovalValues>
                        ) : (
                          <ApprovalValues>
                            <ValueItem>
                              <ValueLabel>Valor Base</ValueLabel>
                              <ValueAmount>
                                {formatCurrency(approval.baseValue || 0)}
                              </ValueAmount>
                            </ValueItem>

                            <ValueItem>
                              <ValueLabel>Comissão</ValueLabel>
                              <ValueAmount style={{ color: '#10b981' }}>
                                {formatCurrency(approval.commissionValue || 0)}
                                <span
                                  style={{
                                    fontSize: '0.875rem',
                                    marginLeft: '4px',
                                  }}
                                >
                                  ({approval.commissionPercentage || 0}%)
                                </span>
                              </ValueAmount>
                            </ValueItem>

                            <ValueItem>
                              <ValueLabel>Lucro Empresa</ValueLabel>
                              <ValueAmount style={{ color: '#6366f1' }}>
                                {formatCurrency(
                                  approval.companyProfitValue || 0
                                )}
                                <span
                                  style={{
                                    fontSize: '0.875rem',
                                    marginLeft: '4px',
                                  }}
                                >
                                  ({approval.companyProfitPercentage || 0}%)
                                </span>
                              </ValueAmount>
                            </ValueItem>

                            <ValueItem>
                              <ValueLabel>Valor Líquido</ValueLabel>
                              <ValueAmount style={{ color: '#3b82f6' }}>
                                {formatCurrency(approval.companyNetValue || 0)}
                              </ValueAmount>
                            </ValueItem>
                          </ApprovalValues>
                        )}

                        {approval.notes && (
                          <div
                            style={{
                              marginTop: '16px',
                              padding: '12px',
                              background: 'var(--color-info-background)',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            <strong>
                              {approval.approvalType === 'inspection'
                                ? 'Observações:'
                                : 'Observações do Corretor:'}
                            </strong>{' '}
                            {approval.notes}
                          </div>
                        )}
                      </ApprovalContent>

                      <ApprovalActions>
                        <Tooltip content='Ver detalhes completos'>
                          <ApprovalActionButton
                            $variant='details'
                            onClick={() => handleViewDetails(approval)}
                          >
                            <EyeOutlined />
                            Ver Detalhes
                          </ApprovalActionButton>
                        </Tooltip>

                        <PermissionButton
                          permission='financial:approve'
                          onClick={() => handleApprove(approval)}
                          variant='primary'
                          size='small'
                        >
                          <CheckOutlined />
                          Aprovar
                        </PermissionButton>

                        <PermissionButton
                          permission='financial:approve'
                          onClick={() => handleReject(approval)}
                          variant='secondary'
                          size='small'
                        >
                          <CloseOutlined />
                          Recusar
                        </PermissionButton>
                      </ApprovalActions>
                    </ApprovalItem>
                  ))}
                </ApprovalsList>
              )}
            </ApprovalsCard>
          </TabContent>

          {/* Tab: Property Expenses */}
          <TabContent $active={activeTab === 'expenses'}>
            <PropertyExpensesList />
          </TabContent>
        </PageContent>

        {/* Modals */}
        <FinancialFiltersDrawer
          isOpen={filtersModalOpen}
          onClose={() => setFiltersModalOpen(false)}
          onApply={handleApplyFilters}
          initialFilters={filters}
        />

        <TransactionAuditModal
          isOpen={auditModalOpen}
          onClose={() => {
            setAuditModalOpen(false);
            setSelectedTransaction(null);
          }}
          transactionId={selectedTransaction?.id || null}
        />

        {/* Approval Modals */}
        {selectedApproval && approveModalOpen && (
          <ApproveApprovalModal
            isOpen={approveModalOpen}
            onClose={handleModalClose}
            onApproved={handleApproved}
            approval={selectedApproval}
          />
        )}

        {selectedApproval && rejectModalOpen && (
          <RejectApprovalModal
            isOpen={rejectModalOpen}
            onClose={handleModalClose}
            onRejected={handleRejected}
            approval={selectedApproval}
          />
        )}
      </PageContainer>
    </Layout>
  );
};

export default FinancialPage;
