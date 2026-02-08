import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import {
  MdHome,
  MdFilterList,
  MdCheckCircle,
  MdTrendingDown,
  MdWarning,
  MdCheckCircle as MdCheckCircleIcon,
  MdAttachMoney,
} from 'react-icons/md';
import { propertyExpensesApi } from '../../services/propertyExpensesApi';
import { PermissionButton } from '../common/PermissionButton';
import { toast } from 'react-toastify';
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
  type PropertyExpense,
  type PropertyExpenseFilters,
} from '../../types/propertyExpense';
import { Spinner } from '../common/Spinner';
import { useNavigate } from 'react-router-dom';
import { useModuleAccess } from '../../hooks/useModuleAccess';
import { MODULE_TYPES } from '../../services/modulesService';
import { GlobalModuleUpgradeModal } from '../GlobalModuleUpgradeModal';

const Container = styled.div`
  width: 100%;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: center;
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

  &:hover {
    background: ${props =>
      props.$active
        ? 'var(--color-primary-dark)'
        : 'var(--color-background-secondary)'};
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
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ExpenseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
`;

const ExpenseTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text);
  flex: 1;
`;

const ExpenseProperty = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 4px;
`;

const ExpenseBadges = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
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
`;

const ExpenseDetailValue = styled.span`
  font-size: 0.875rem;
  color: var(--color-text);
  font-weight: 600;
`;

const ExpenseActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant?: 'success' | 'secondary' }>`
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

const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div<{
  $type: 'total' | 'pending' | 'overdue' | 'paid';
}>`
  background: ${props => {
    switch (props.$type) {
      case 'total':
        return props.theme.colors.cardBackground || '#fff';
      case 'pending':
        return 'rgba(250, 173, 20, 0.1)';
      case 'overdue':
        return 'rgba(255, 77, 79, 0.1)';
      case 'paid':
        return 'rgba(82, 196, 26, 0.1)';
      default:
        return props.theme.colors.cardBackground || '#fff';
    }
  }};
  border: 1px solid
    ${props => {
      switch (props.$type) {
        case 'total':
          return props.theme.colors.border || '#e0e0e0';
        case 'pending':
          return 'rgba(250, 173, 20, 0.3)';
        case 'overdue':
          return 'rgba(255, 77, 79, 0.3)';
        case 'paid':
          return 'rgba(82, 196, 26, 0.3)';
        default:
          return props.theme.colors.border || '#e0e0e0';
      }
    }};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const SummaryIcon = styled.div<{
  $type: 'total' | 'pending' | 'overdue' | 'paid';
}>`
  font-size: 32px;
  color: ${props => {
    switch (props.$type) {
      case 'total':
        return props.theme.colors.primary || '#1890ff';
      case 'pending':
        return '#faad14';
      case 'overdue':
        return '#ff4d4f';
      case 'paid':
        return '#52c41a';
      default:
        return props.theme.colors.primary || '#1890ff';
    }
  }};
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text || '#333'};
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const SummaryLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary || '#666'};
  text-align: center;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`;

interface PropertyExpensesListProps {
  filters?: PropertyExpenseFilters;
}

export const PropertyExpensesList: React.FC<PropertyExpensesListProps> = ({
  filters = {},
}) => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<PropertyExpense[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(
    null
  );
  const isMountedRef = useRef(true);
  const moduleAccess = useModuleAccess();
  const hasPropertyManagement = moduleAccess.isModuleAvailableForCompany(
    MODULE_TYPES.PROPERTY_MANAGEMENT.toLowerCase()
  );

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadExpenses = async () => {
      setLoading(true);
      try {
        const response = await propertyExpensesApi.getAllExpenses({
          ...filters,
          status: (activeStatusFilter as PropertyExpenseStatus) || undefined,
        });

        if (!cancelled && isMountedRef.current) {
          setExpenses(Array.isArray(response?.data) ? response.data : []);
        }
      } catch (error: any) {
        // Erro silencioso - não exibir toast
        if (!cancelled && isMountedRef.current) {
          console.error('Erro ao carregar despesas:', error);
        }
      } finally {
        if (!cancelled && isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadExpenses();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStatusFilter]);

  const handleMarkAsPaid = async (expense: PropertyExpense) => {
    try {
      await propertyExpensesApi.markAsPaid(expense.propertyId, expense.id);
      toast.success('Despesa marcada como paga!');
      // Recarregar despesas
      const response = await propertyExpensesApi.getAllExpenses({
        ...filters,
        status: (activeStatusFilter as PropertyExpenseStatus) || undefined,
      });
      setExpenses(Array.isArray(response?.data) ? response.data : []);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao marcar despesa como paga');
    }
  };

  const handleStatusFilter = (status: string | null) => {
    setActiveStatusFilter(status);
  };

  const handleExpenseClick = (expense: PropertyExpense) => {
    navigate(`/properties/${expense.propertyId}`);
  };

  const filteredExpenses = Array.isArray(expenses) ? expenses : [];

  // Calcular summary das despesas - DEVE estar antes de qualquer return
  const summary = useMemo(() => {
    const allExpenses = Array.isArray(expenses) ? expenses : [];

    const pending = allExpenses.filter(
      e =>
        e.status === PropertyExpenseStatus.PENDING &&
        !isExpenseOverdue(e.dueDate, e.status)
    );
    const overdue = allExpenses.filter(e =>
      isExpenseOverdue(e.dueDate, e.status)
    );
    const paid = allExpenses.filter(
      e => e.status === PropertyExpenseStatus.PAID
    );

    return {
      total: allExpenses.length,
      pending: pending.length,
      overdue: overdue.length,
      paid: paid.length,
      totalPendingAmount: pending.reduce((sum, e) => sum + e.amount, 0),
      totalOverdueAmount: overdue.reduce((sum, e) => sum + e.amount, 0),
      totalPaidAmount: paid.reduce((sum, e) => sum + e.amount, 0),
      totalAmount: allExpenses.reduce((sum, e) => sum + e.amount, 0),
    };
  }, [expenses]);

  if (!hasPropertyManagement && !moduleAccess.isLoading) {
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>🔒</EmptyIcon>
          <EmptyTitle>Módulo não disponível</EmptyTitle>
          <EmptyDescription>
            O módulo de Gestão de Propriedades é necessário para acessar as
            despesas de propriedades.
          </EmptyDescription>
        </EmptyState>
        <GlobalModuleUpgradeModal
          isOpen={false}
          onClose={() => {}}
          moduleName='Gestão de Propriedades'
          moduleType={MODULE_TYPES.PROPERTY_MANAGEMENT}
        />
      </Container>
    );
  }

  if (loading) {
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
      <SummaryContainer>
        <SummaryCard $type='total'>
          <SummaryIcon $type='total'>
            <MdAttachMoney />
          </SummaryIcon>
          <SummaryValue>{formatCurrency(summary.totalAmount)}</SummaryValue>
          <SummaryLabel>Total</SummaryLabel>
        </SummaryCard>

        <SummaryCard $type='pending'>
          <SummaryIcon $type='pending'>
            <MdTrendingDown />
          </SummaryIcon>
          <SummaryValue>
            {formatCurrency(summary.totalPendingAmount)}
          </SummaryValue>
          <SummaryLabel>Pendentes ({summary.pending})</SummaryLabel>
        </SummaryCard>

        <SummaryCard $type='overdue'>
          <SummaryIcon $type='overdue'>
            <MdWarning />
          </SummaryIcon>
          <SummaryValue>
            {formatCurrency(summary.totalOverdueAmount)}
          </SummaryValue>
          <SummaryLabel>Vencidas ({summary.overdue})</SummaryLabel>
        </SummaryCard>

        <SummaryCard $type='paid'>
          <SummaryIcon $type='paid'>
            <MdCheckCircleIcon />
          </SummaryIcon>
          <SummaryValue>{formatCurrency(summary.totalPaidAmount)}</SummaryValue>
          <SummaryLabel>Pagas ({summary.paid})</SummaryLabel>
        </SummaryCard>
      </SummaryContainer>

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

      {filteredExpenses.length === 0 ? (
        <EmptyState>
          <EmptyIcon>💰</EmptyIcon>
          <EmptyTitle>Nenhuma despesa encontrada</EmptyTitle>
          <EmptyDescription>
            {activeStatusFilter
              ? `Não há despesas com status "${getExpenseStatusLabel(activeStatusFilter as PropertyExpenseStatus)}"`
              : 'Não há despesas cadastradas'}
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
                onClick={() => handleExpenseClick(expense)}
              >
                <ExpenseHeader>
                  <div style={{ flex: 1 }}>
                    <ExpenseTitle>{expense.title}</ExpenseTitle>
                    {expense.property && (
                      <ExpenseProperty>
                        <MdHome size={14} />
                        {expense.property.title}
                        {expense.property.code && ` (${expense.property.code})`}
                      </ExpenseProperty>
                    )}
                  </div>
                  <ExpenseBadges>
                    <Badge $color={getExpenseTypeColor(expense.type)}>
                      {getExpenseTypeLabel(expense.type)}
                    </Badge>
                    <Badge $color={getExpenseStatusColor(expense.status)}>
                      {getExpenseStatusLabel(expense.status)}
                    </Badge>
                    {isOverdue && <Badge $color='#DC2626'>⚠️ Vencida</Badge>}
                    {isUpcoming &&
                      !isOverdue &&
                      expense.status === PropertyExpenseStatus.PENDING && (
                        <Badge $color='#F59E0B'>{daysUntilDue} dias</Badge>
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
                {expense.notes && (
                  <div
                    style={{
                      marginTop: '12px',
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

                <ExpenseActions onClick={e => e.stopPropagation()}>
                  {expense.status === PropertyExpenseStatus.PENDING && (
                    <PermissionButton
                      permission='property:update'
                      onClick={() => handleMarkAsPaid(expense)}
                      variant='success'
                      size='small'
                    >
                      <MdCheckCircle size={16} />
                      Marcar como Paga
                    </PermissionButton>
                  )}
                  <ActionButton
                    $variant='secondary'
                    onClick={() => handleExpenseClick(expense)}
                  >
                    Ver Propriedade
                  </ActionButton>
                </ExpenseActions>
              </ExpenseCard>
            );
          })}
        </ExpensesList>
      )}
    </Container>
  );
};
