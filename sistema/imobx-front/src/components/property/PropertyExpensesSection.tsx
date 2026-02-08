import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdAdd,
  MdFilterList,
  MdCheckCircle,
  MdCancel,
  MdEdit,
  MdDelete,
  MdWarning,
  MdInfo,
} from 'react-icons/md';
import { usePropertyExpenses } from '../../hooks/usePropertyExpenses';
import { PermissionButton } from '../common/PermissionButton';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import { MarkExpenseAsPaidModal } from '../modals/MarkExpenseAsPaidModal';
import {
  getExpenseTypeLabel,
  getExpenseStatusLabel,
  getExpenseStatusColor,
  getExpenseTypeColor,
  formatCurrency,
  isExpenseOverdue,
  getDaysUntilDue,
  isExpenseUpcoming,
  PropertyExpenseStatus,
  PropertyExpenseType,
} from '../../types/propertyExpense';
import type {
  PropertyExpense,
  PropertyExpenseFilters,
} from '../../types/propertyExpense';
import { Spinner } from '../common/Spinner';

interface PropertyExpensesSectionProps {
  propertyId: string;
  propertyTitle?: string;
}

const Container = styled.div`
  padding: 0;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: stretch;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const SummaryCard = styled.div<{
  $type?: 'pending' | 'overdue' | 'paid' | 'upcoming';
}>`
  background: ${props => {
    if (props.$type === 'overdue') return '#FEE2E2';
    if (props.$type === 'upcoming') return '#FEF3C7';
    if (props.$type === 'paid') return '#D1FAE5';
    return 'var(--color-background-secondary)';
  }};
  border: 1px solid
    ${props => {
      if (props.$type === 'overdue') return '#FCA5A5';
      if (props.$type === 'upcoming') return '#FCD34D';
      if (props.$type === 'paid') return '#6EE7B7';
      return 'var(--color-border)';
    }};
  border-radius: 8px;
  padding: 16px;
  text-align: center;

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const SummaryValue = styled.div<{
  $type?: 'pending' | 'overdue' | 'paid' | 'upcoming';
}>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => {
    if (props.$type === 'overdue') return '#DC2626';
    if (props.$type === 'upcoming') return '#92400E';
    if (props.$type === 'paid') return '#059669';
    return 'var(--color-text)';
  }};
  margin-bottom: 4px;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const SummaryLabel = styled.div<{
  $type?: 'pending' | 'overdue' | 'paid' | 'upcoming';
}>`
  font-size: 0.875rem;
  color: ${props => {
    if (props.$type === 'overdue') return '#991B1B';
    if (props.$type === 'paid') return '#047857';
    return 'var(--color-text-secondary)';
  }};
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 480px) {
    gap: 6px;
    margin-bottom: 12px;
  }
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: ${props =>
    props.$active ? 'var(--color-primary)' : 'var(--color-surface)'};
  color: ${props => (props.$active ? 'white' : 'var(--color-text)')};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: fit-content;

  &:hover {
    background: ${props =>
      props.$active
        ? 'var(--color-primary-dark)'
        : 'var(--color-background-secondary)'};
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 0.75rem;
    flex: 1 1 calc(50% - 3px);
  }
`;

const ExpensesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ExpenseCard = styled.div<{
  $status: string;
  $isOverdue?: boolean;
  $isUpcoming?: boolean;
}>`
  background: var(--color-surface);
  border: 1px solid
    ${props => {
      if (props.$isOverdue) return '#DC2626';
      if (props.$isUpcoming) return '#F59E0B';
      return 'var(--color-border)';
    }};
  border-left: 4px solid
    ${props => {
      if (props.$isOverdue) return '#DC2626';
      if (props.$isUpcoming) return '#F59E0B';
      if (props.$status === PropertyExpenseStatus.PAID) return '#10B981';
      return getExpenseStatusColor(props.$status as any);
    }};
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    border-left-width: 3px;
  }
`;

const ExpenseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
  }
`;

const ExpenseTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text);
  flex: 1;

  @media (max-width: 480px) {
    font-size: 0.9375rem;
    width: 100%;
  }
`;

const ExpenseBadges = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 6px;
    width: 100%;
  }
`;

const Badge = styled.span<{ $color: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const ExpenseDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
    margin-bottom: 10px;
  }
`;

const ExpenseDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ExpenseDetailLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 0.6875rem;
  }
`;

const ExpenseDetailValue = styled.span`
  font-size: 0.875rem;
  color: var(--color-text);
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

const ExpenseActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 6px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    margin-top: 10px;
  }
`;

const ActionButton = styled.button<{
  $variant?: 'primary' | 'success' | 'danger' | 'secondary';
}>`
  padding: 6px 12px;
  border: 1px solid;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
    padding: 10px 12px;
    font-size: 0.875rem;
  }

  ${props => {
    if (props.$variant === 'success') {
      return `
        background: #10B981;
        color: white;
        border-color: #10B981;
        &:hover {
          background: #059669;
          border-color: #059669;
        }
      `;
    }
    if (props.$variant === 'danger') {
      return `
        background: #EF4444;
        color: white;
        border-color: #EF4444;
        &:hover {
          background: #DC2626;
          border-color: #DC2626;
        }
      `;
    }
    if (props.$variant === 'primary') {
      return `
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
        &:hover {
          background: var(--color-primary-dark);
          border-color: var(--color-primary-dark);
        }
      `;
    }
    return `
      background: var(--color-surface);
      color: var(--color-text);
      border-color: var(--color-border);
      &:hover {
        background: var(--color-background-secondary);
      }
    `;
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-secondary);
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const EmptyTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
`;

const EmptyDescription = styled.div`
  font-size: 0.875rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const PropertyExpensesSection: React.FC<
  PropertyExpensesSectionProps
> = ({ propertyId, propertyTitle }) => {
  const {
    expenses,
    summary,
    loading,
    error,
    fetchExpenses,
    fetchSummary,
    createExpense,
    updateExpense,
    markAsPaid,
    deleteExpense,
    refreshExpenses,
  } = usePropertyExpenses(propertyId);

  const navigate = useNavigate();
  const [filters, setFilters] = useState<PropertyExpenseFilters>({});
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(
    null
  );

  // Estados para modais de confirmação
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [markAsPaidModalOpen, setMarkAsPaidModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<PropertyExpense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingAsPaid, setIsMarkingAsPaid] = useState(false);

  useEffect(() => {
    if (propertyId) {
      fetchExpenses(propertyId, filters);
      fetchSummary(propertyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const handleCreateExpense = () => {
    navigate(`/properties/${propertyId}/expenses/create`);
  };

  const handleEditExpense = (expenseId: string) => {
    navigate(`/properties/${propertyId}/expenses/${expenseId}/edit`);
  };

  const handleMarkAsPaidClick = (expense: PropertyExpense) => {
    setSelectedExpense(expense);
    setMarkAsPaidModalOpen(true);
  };

  const handleMarkAsPaid = async () => {
    if (!selectedExpense) return;

    setIsMarkingAsPaid(true);
    try {
      await markAsPaid(propertyId, selectedExpense.id);
      toast.success('Despesa marcada como paga!');
      await fetchSummary(propertyId);
      setMarkAsPaidModalOpen(false);
      setSelectedExpense(null);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao marcar despesa como paga');
    } finally {
      setIsMarkingAsPaid(false);
    }
  };

  const handleDeleteClick = (expense: PropertyExpense) => {
    setSelectedExpense(expense);
    setDeleteModalOpen(true);
  };

  const handleDeleteExpense = async () => {
    if (!selectedExpense) return;

    setIsDeleting(true);
    try {
      await deleteExpense(propertyId, selectedExpense.id);
      toast.success('Despesa excluída com sucesso!');
      await fetchSummary(propertyId);
      setDeleteModalOpen(false);
      setSelectedExpense(null);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir despesa');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusFilter = (status: string | null) => {
    setActiveStatusFilter(status);
    if (status) {
      setFilters(prev => ({
        ...prev,
        status: status as PropertyExpenseStatus,
      }));
    } else {
      setFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters.status;
        return newFilters;
      });
    }
  };

  const filteredExpenses = (expenses || []).filter(expense => {
    if (activeStatusFilter && expense.status !== activeStatusFilter) {
      return false;
    }
    return true;
  });

  if (loading && expenses.length === 0) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner size={40} />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>💰 Despesas da Propriedade</Title>
        <ActionsContainer>
          <PermissionButton
            permission='property:update'
            onClick={handleCreateExpense}
            variant='primary'
            size='small'
          >
            <MdAdd size={18} />
            Adicionar Despesa
          </PermissionButton>
        </ActionsContainer>
      </Header>

      {/* Resumo */}
      {summary && (
        <SummaryGrid>
          <SummaryCard $type='pending'>
            <SummaryValue>{summary.totalPending || 0}</SummaryValue>
            <SummaryLabel>Pendentes</SummaryLabel>
          </SummaryCard>
          <SummaryCard $type='overdue'>
            <SummaryValue $type='overdue'>
              {summary.totalOverdue || 0}
            </SummaryValue>
            <SummaryLabel $type='overdue'>Vencidas</SummaryLabel>
          </SummaryCard>
          <SummaryCard $type='paid'>
            <SummaryValue $type='paid'>{summary.totalPaid || 0}</SummaryValue>
            <SummaryLabel $type='paid'>Pagas</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue>
              {formatCurrency(summary.totalPendingAmount || 0)}
            </SummaryValue>
            <SummaryLabel>Total Pendente</SummaryLabel>
          </SummaryCard>
          <SummaryCard $type='overdue'>
            <SummaryValue $type='overdue'>
              {formatCurrency(summary.totalOverdueAmount || 0)}
            </SummaryValue>
            <SummaryLabel $type='overdue'>Total Vencido</SummaryLabel>
          </SummaryCard>
        </SummaryGrid>
      )}

      {/* Filtros */}
      <FiltersContainer>
        <FilterButton
          $active={activeStatusFilter === null}
          onClick={() => handleStatusFilter(null)}
        >
          Todas
        </FilterButton>
        <FilterButton
          $active={activeStatusFilter === PropertyExpenseStatus.PENDING}
          onClick={() => handleStatusFilter(PropertyExpenseStatus.PENDING)}
        >
          Pendentes
        </FilterButton>
        <FilterButton
          $active={activeStatusFilter === PropertyExpenseStatus.OVERDUE}
          onClick={() => handleStatusFilter(PropertyExpenseStatus.OVERDUE)}
        >
          Vencidas
        </FilterButton>
        <FilterButton
          $active={activeStatusFilter === PropertyExpenseStatus.PAID}
          onClick={() => handleStatusFilter(PropertyExpenseStatus.PAID)}
        >
          Pagas
        </FilterButton>
      </FiltersContainer>

      {/* Lista de Despesas */}
      {filteredExpenses.length === 0 ? (
        <EmptyState>
          <EmptyIcon>💰</EmptyIcon>
          <EmptyTitle>Nenhuma despesa encontrada</EmptyTitle>
          <EmptyDescription>
            {activeStatusFilter
              ? `Não há despesas com status "${getExpenseStatusLabel(activeStatusFilter as PropertyExpenseStatus)}"`
              : 'Comece adicionando uma nova despesa para esta propriedade'}
          </EmptyDescription>
        </EmptyState>
      ) : (
        <ExpensesList>
          {filteredExpenses.map(expense => {
            const isOverdue = isExpenseOverdue(expense.dueDate, expense.status);
            const isUpcoming = isExpenseUpcoming(expense.dueDate, 7);
            const daysUntilDue = getDaysUntilDue(expense.dueDate);

            return (
              <ExpenseCard
                key={expense.id}
                $status={expense.status}
                $isOverdue={isOverdue}
                $isUpcoming={isUpcoming}
              >
                <ExpenseHeader>
                  <ExpenseTitle>{expense.title}</ExpenseTitle>
                  <ExpenseBadges>
                    <Badge $color={getExpenseTypeColor(expense.type)}>
                      {getExpenseTypeLabel(expense.type)}
                    </Badge>
                    <Badge $color={getExpenseStatusColor(expense.status)}>
                      {getExpenseStatusLabel(expense.status)}
                    </Badge>
                    {isOverdue && (
                      <Badge $color='#DC2626'>
                        <MdWarning size={12} /> Vencida
                      </Badge>
                    )}
                    {isUpcoming &&
                      !isOverdue &&
                      expense.status === PropertyExpenseStatus.PENDING && (
                        <Badge $color='#F59E0B'>
                          <MdInfo size={12} /> {daysUntilDue} dias
                        </Badge>
                      )}
                    {expense.isRecurring && (
                      <Badge $color='#6366F1'>🔄 Recorrente</Badge>
                    )}
                  </ExpenseBadges>
                </ExpenseHeader>

                <ExpenseDetails>
                  <ExpenseDetail>
                    <ExpenseDetailLabel>Valor</ExpenseDetailLabel>
                    <ExpenseDetailValue>
                      {formatCurrency(expense.amount)}
                    </ExpenseDetailValue>
                  </ExpenseDetail>
                  <ExpenseDetail>
                    <ExpenseDetailLabel>Vencimento</ExpenseDetailLabel>
                    <ExpenseDetailValue>
                      {new Date(expense.dueDate).toLocaleDateString('pt-BR')}
                    </ExpenseDetailValue>
                  </ExpenseDetail>
                  {expense.paidDate && (
                    <ExpenseDetail>
                      <ExpenseDetailLabel>Data de Pagamento</ExpenseDetailLabel>
                      <ExpenseDetailValue>
                        {new Date(expense.paidDate).toLocaleDateString('pt-BR')}
                      </ExpenseDetailValue>
                    </ExpenseDetail>
                  )}
                  {expense.documentNumber && (
                    <ExpenseDetail>
                      <ExpenseDetailLabel>
                        Número do Documento
                      </ExpenseDetailLabel>
                      <ExpenseDetailValue>
                        {expense.documentNumber}
                      </ExpenseDetailValue>
                    </ExpenseDetail>
                  )}
                </ExpenseDetails>

                {expense.description && (
                  <div
                    style={{
                      marginBottom: '12px',
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {expense.description}
                  </div>
                )}
                {expense.notes && (
                  <div
                    style={{
                      marginBottom: '12px',
                      padding: '12px',
                      background: 'var(--color-background-secondary)',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <strong>Observações:</strong> {expense.notes}
                  </div>
                )}

                <ExpenseActions>
                  {expense.status === PropertyExpenseStatus.PENDING && (
                    <PermissionButton
                      permission='property:update'
                      onClick={() => handleMarkAsPaidClick(expense)}
                      variant='success'
                      size='small'
                    >
                      <MdCheckCircle size={16} />
                      Marcar como Paga
                    </PermissionButton>
                  )}
                  <PermissionButton
                    permission='property:update'
                    onClick={() => handleEditExpense(expense.id)}
                    variant='secondary'
                    size='small'
                  >
                    <MdEdit size={16} />
                    Editar
                  </PermissionButton>
                  <PermissionButton
                    permission='property:delete'
                    onClick={() => handleDeleteClick(expense)}
                    variant='danger'
                    size='small'
                  >
                    <MdDelete size={16} />
                    Excluir
                  </PermissionButton>
                </ExpenseActions>
              </ExpenseCard>
            );
          })}
        </ExpensesList>
      )}

      {/* Modal de confirmação para marcar como paga */}
      <MarkExpenseAsPaidModal
        isOpen={markAsPaidModalOpen}
        onClose={() => {
          setMarkAsPaidModalOpen(false);
          setSelectedExpense(null);
        }}
        onConfirm={handleMarkAsPaid}
        expenseTitle={selectedExpense?.title || ''}
        isLoading={isMarkingAsPaid}
      />

      {/* Modal de confirmação para excluir */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedExpense(null);
        }}
        onConfirm={handleDeleteExpense}
        title='Excluir Despesa'
        message='Tem certeza que deseja excluir esta despesa?'
        itemName={selectedExpense?.title}
        isLoading={isDeleting}
        variant='delete'
        confirmLabel='Excluir Despesa'
        loadingLabel='Excluindo...'
      />
    </Container>
  );
};
