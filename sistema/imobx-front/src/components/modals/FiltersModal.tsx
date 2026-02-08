import React, { useState } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdClear,
  MdFilterList,
  MdSearch,
  MdCalendarToday,
  MdCategory,
} from 'react-icons/md';
import {
  TransactionTypeOptions,
  TransactionStatusOptions,
  PaymentMethodOptions,
} from '../../types/financial';
import { CustomDatePicker } from '../common/CustomDatePicker';
import DataScopeFilter from '../common/DataScopeFilter';

// Modal Overlay
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999999;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// Modal Container - Mais largo
const ModalContainer = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 24px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
  border: 1px solid ${props => props.theme.colors.border};

  @keyframes slideIn {
    from {
      transform: scale(0.95) translateY(20px);
      opacity: 0;
    }
    to {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.primaryDark};
    }
  }

  @media (max-width: 1024px) {
    max-width: 95%;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 95vh;
    border-radius: 20px;
  }
`;

const ModalHeader = styled.div`
  padding: 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.colors.cardBackground};
  position: sticky;
  top: 0;
  z-index: 10;
  border-radius: 24px 24px 0 0;

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 20px 20px 0 0;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    gap: 12px;
  }
`;

const FilterCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 14px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;

  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    color: white;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Modal Content - Sem cards aninhados
const ModalContent = styled.div`
  padding: 32px;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};

  &:not(:first-child) {
    margin-top: 32px;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    gap: 10px;
    margin-bottom: 16px;
    padding-bottom: 10px;
  }
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

// Ações do formulário - Sem fixar no bottom
const FilterActions = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 16px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 12px;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  min-width: 140px;
  justify-content: center;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.primaryDark};
          transform: translateY(-2px);
          box-shadow: 0 8px 16px ${props.theme.colors.primary}40;
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: ${props.theme.colors.error};
        color: white;
        
        &:hover:not(:disabled) {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px ${props.theme.colors.error}40;
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 2px solid ${props.theme.colors.border};
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.backgroundSecondary};
          border-color: ${props.theme.colors.primary};
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 16px 24px;
  }
`;

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
}

export const FiltersModal: React.FC<FiltersModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState({
    description: initialFilters.description || '',
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
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== '' && value !== false
      )
    );
    onApply(activeFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      description: '',
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

  if (!isOpen) return null;

  return (
    <ModalOverlay
      $isOpen={isOpen}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            <MdFilterList size={28} />
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <FilterCount>{activeFiltersCount}</FilterCount>
            )}
          </ModalTitle>
          <CloseButton onClick={onClose} type='button'>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          {/* Busca por Texto */}
          <SectionTitle>
            <MdSearch size={20} />
            Busca por Texto
          </SectionTitle>

          <FilterGrid>
            <FilterGroup style={{ gridColumn: '1 / -1' }}>
              <FilterLabel>Descrição</FilterLabel>
              <Input
                type='text'
                value={filters.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder='Buscar por descrição...'
              />
            </FilterGroup>
          </FilterGrid>

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
          <SectionTitle>Filtros por Valor</SectionTitle>

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
          <DataScopeFilter
            onlyMyData={filters.onlyMyData}
            onChange={value => handleChange('onlyMyData', value)}
            label='Mostrar apenas minhas transações'
            description='Quando marcado, mostra apenas transações que você criou, ignorando hierarquia de usuários.'
          />

          {/* Ações */}
          <FilterActions>
            <Button type='button' $variant='secondary' onClick={onClose}>
              Cancelar
            </Button>
            {activeFiltersCount > 0 && (
              <Button type='button' $variant='danger' onClick={handleClear}>
                <MdClear size={18} />
                Limpar Filtros
              </Button>
            )}
            <Button type='button' $variant='primary' onClick={handleApply}>
              <MdFilterList size={18} />
              Aplicar Filtros
            </Button>
          </FilterActions>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};
