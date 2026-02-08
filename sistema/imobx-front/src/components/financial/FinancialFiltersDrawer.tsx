import React, { useState } from 'react';
import styled from 'styled-components';
import {
  MdClear,
  MdFilterList,
  MdSearch,
  MdCalendarToday,
  MdCategory,
  MdAttachMoney,
} from 'react-icons/md';
import {
  TransactionTypeOptions,
  TransactionStatusOptions,
  PaymentMethodOptions,
} from '../../types/financial';
import type { FinancialTransactionFilters } from '../../types/financial';
import { FilterDrawer } from '../common/FilterDrawer';
import DataScopeFilter from '../common/DataScopeFilter';

interface FinancialFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FinancialTransactionFilters) => void;
  initialFilters?: FinancialTransactionFilters;
}

export const FinancialFiltersDrawer: React.FC<FinancialFiltersDrawerProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    type: initialFilters.type || '',
    status: initialFilters.status || '',
    category: initialFilters.category || '',
    paymentMethod: initialFilters.paymentMethod || '',
    startDate: initialFilters.startDate || '',
    endDate: initialFilters.endDate || '',
    minAmount: initialFilters.minAmount || '',
    maxAmount: initialFilters.maxAmount || '',
    onlyMyData: initialFilters.onlyMyData || false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    const activeFilters: FinancialTransactionFilters = {};

    // Processar todos os filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'onlyMyData') {
        // Para onlyMyData, incluir apenas se for true
        if (value === true) {
          activeFilters.onlyMyData = true;
        }
      } else if (
        value !== '' &&
        value !== false &&
        value !== undefined &&
        value !== null
      ) {
        // Para outros filtros, incluir se tiver valor
        (activeFilters as any)[key] = value;
      }
    });

    console.log('📝 Aplicando filtros:', activeFilters);
    onApply(activeFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      search: '',
      type: '',
      status: '',
      category: '',
      paymentMethod: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      onlyMyData: false,
    });
  };

  const activeFiltersCount = Object.values(filters).filter(
    value => value !== '' && value !== false
  ).length;

  const footer = (
    <>
      {activeFiltersCount > 0 && (
        <ClearButton onClick={handleClear}>
          <MdClear size={18} />
          Limpar Filtros
        </ClearButton>
      )}
      <ApplyButton onClick={handleApply}>
        <MdFilterList size={18} />
        Aplicar Filtros
      </ApplyButton>
    </>
  );

  return (
    <FilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title='Filtros Avançados'
      footer={footer}
    >
      <FiltersContainer>
        {/* Busca por Texto */}
        <SectionTitle>
          <MdSearch size={20} />
          Busca por Texto
        </SectionTitle>

        <FilterGroup>
          <FilterLabel>Descrição</FilterLabel>
          <Input
            type='text'
            value={filters.search}
            onChange={e => handleChange('search', e.target.value)}
            placeholder='Buscar por descrição...'
          />
        </FilterGroup>

        {/* Filtros por Categoria */}
        <SectionTitle>
          <MdCategory size={20} />
          Filtros por Categoria
        </SectionTitle>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>Tipo de Transação</FilterLabel>
            <Select
              value={filters.type}
              onChange={e => handleChange('type', e.target.value)}
            >
              <option value=''>Todos</option>
              {TransactionTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <Select
              value={filters.status}
              onChange={e => handleChange('status', e.target.value)}
            >
              <option value=''>Todos</option>
              {TransactionStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Categoria</FilterLabel>
            <Select
              value={filters.category}
              onChange={e => handleChange('category', e.target.value)}
            >
              <option value=''>Todas</option>
              <option value='rent'>Aluguel</option>
              <option value='sale'>Venda</option>
              <option value='commission'>Comissão</option>
              <option value='maintenance'>Manutenção</option>
              <option value='utilities'>Utilidades</option>
              <option value='taxes'>Impostos</option>
              <option value='fees'>Taxas</option>
              <option value='other'>Outros</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Método de Pagamento</FilterLabel>
            <Select
              value={filters.paymentMethod}
              onChange={e => handleChange('paymentMethod', e.target.value)}
            >
              <option value=''>Todos</option>
              {PaymentMethodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FilterGroup>
        </FilterGrid>

        {/* Filtros por Data */}
        <SectionTitle>
          <MdCalendarToday size={20} />
          Filtros por Data
        </SectionTitle>

        <DateRangeContainer>
          <DateGroup>
            <FilterLabel>Data Inicial</FilterLabel>
            <Input
              type='date'
              value={filters.startDate}
              onChange={e => handleChange('startDate', e.target.value)}
            />
          </DateGroup>

          <DateGroup>
            <FilterLabel>Data Final</FilterLabel>
            <Input
              type='date'
              value={filters.endDate}
              onChange={e => handleChange('endDate', e.target.value)}
            />
          </DateGroup>
        </DateRangeContainer>

        {/* Filtros por Valor */}
        <SectionTitle>
          <MdAttachMoney size={20} />
          Filtros por Valor
        </SectionTitle>

        <AmountRangeContainer>
          <FilterGroup>
            <FilterLabel>Valor Mínimo</FilterLabel>
            <Input
              type='number'
              value={filters.minAmount}
              onChange={e => handleChange('minAmount', e.target.value)}
              placeholder='R$ 0,00'
              min='0'
              step='0.01'
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Valor Máximo</FilterLabel>
            <Input
              type='number'
              value={filters.maxAmount}
              onChange={e => handleChange('maxAmount', e.target.value)}
              placeholder='R$ 0,00'
              min='0'
              step='0.01'
            />
          </FilterGroup>
        </AmountRangeContainer>

        {/* Seção: Escopo de Dados */}
        <SectionTitle>🔒 Escopo de Dados</SectionTitle>

        <DataScopeFilter
          onlyMyData={filters.onlyMyData}
          onChange={value => handleChange('onlyMyData', value)}
          label='Mostrar apenas minhas transações'
          description='Quando marcado, mostra apenas transações que você criou, ignorando hierarquia de usuários.'
        />
      </FiltersContainer>
    </FilterDrawer>
  );
};

// Styled Components
const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 0.9375rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 0.9375rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  option {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const DateRangeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const DateGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AmountRangeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.error};
    color: ${props => props.theme.colors.error};
    background: ${props => props.theme.colors.error}10;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;
