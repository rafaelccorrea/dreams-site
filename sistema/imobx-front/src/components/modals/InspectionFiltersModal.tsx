import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdFilterList,
  MdClear,
  MdSearch,
  MdCalendarToday,
  MdLocationOn,
  MdFlag,
  MdClose,
  MdTune,
} from 'react-icons/md';
import type { InspectionFilter } from '@/types/vistoria-types';
import {
  INSPECTION_STATUS_LABELS,
  INSPECTION_TYPE_LABELS,
} from '@/types/vistoria-types';
import { useDebounce } from '@/hooks/useDebounce';
import DataScopeFilter from '../common/DataScopeFilter';

// Styled Components
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props =>
    props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)'};
  backdrop-filter: blur(12px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  box-shadow: 0 32px 64px -12px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.5)'
        : 'rgba(0, 0, 0, 0.25)'};
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  transform: ${props => (props.$isOpen ? 'scale(1)' : 'scale(0.95)')};
  transition: transform 0.3s ease;
  position: relative;

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 20px;
  }
`;

const ModalHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}10 0%,
    ${props => props.theme.colors.primary}05 100%
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary} 0%,
      ${props => props.theme.colors.primaryDark} 100%
    );
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.25rem;
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

const ModalContent = styled.div`
  padding: 32px;
  max-height: calc(90vh - 200px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 32px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 15px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.2)'
          : 'rgba(0, 0, 0, 0.08)'};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 24px;
  }
`;

const FilterSectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme.colors.primary}20;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)'};

  &:hover {
    border-color: ${props => props.theme.colors.primary}50;
    box-shadow: 0 4px 12px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.08)'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)'};
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 20px;

  &:hover {
    border-color: ${props => props.theme.colors.primary}50;
    box-shadow: 0 4px 12px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.08)'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
    transform: translateY(-1px);
  }

  option {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    padding: 12px;
  }

  &::-ms-expand {
    display: none;
  }
`;

const DateRangeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const DateGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const RangeSeparator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    padding: 4px 0;
  }
`;

const ActiveFiltersBadge = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}20 0%,
    ${props => props.theme.colors.primary}10 100%
  );
  border: 2px solid ${props => props.theme.colors.primary}30;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 15px ${props => props.theme.colors.primary}20;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary} 0%,
      ${props => props.theme.colors.primaryDark} 100%
    );
  }
`;

const BadgeTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BadgeText = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: 500;
`;

const ModalActions = styled.div`
  padding: 24px 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  background: ${props => props.theme.colors.backgroundSecondary};

  @media (max-width: 768px) {
    padding: 20px 24px;
    flex-direction: column;
    gap: 12px;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  position: relative;
  overflow: hidden;
  min-width: 120px;
  justify-content: center;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
        color: white;
        box-shadow: 0 4px 15px ${props.theme.colors.primary}25;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px ${props.theme.colors.primary}35;
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.25);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.35);
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 2px solid ${props.theme.colors.border};
        
        &:hover {
          background: ${props.theme.colors.primary}10;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${props.theme.colors.primary}15;
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: auto;
  }

  /* Ripple effect */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition:
      width 0.6s,
      height 0.6s;
  }

  &:active::before {
    width: 300px;
    height: 300px;
  }
`;

interface InspectionFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: InspectionFilter;
  onFiltersChange: (filters: InspectionFilter) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  properties: any[];
  inspectors: any[];
}

const InspectionFiltersModal: React.FC<InspectionFiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  properties,
  inspectors,
}) => {
  const [localFilters, setLocalFilters] = useState<InspectionFilter>(filters);

  // Estado local para busca com debounce
  const [titleInput, setTitleInput] = useState(filters.title || '');

  // Aplicar debounce (500ms, mínimo 3 caracteres)
  const debouncedTitle = useDebounce(titleInput, 500, 3);

  // Sincronizar valor debounced com os filtros locais
  useEffect(() => {
    if (titleInput.length >= 3 || titleInput.length === 0) {
      handleFilterChange('title', debouncedTitle);
    }
  }, [debouncedTitle]);

  // Sincronizar com mudanças externas nos filtros
  useEffect(() => {
    setTitleInput(filters.title || '');
  }, [filters.title]);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof InspectionFilter, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApplyFilters();
    onClose();
  };

  const handleClear = () => {
    setTitleInput('');
    const clearedFilters = { page: 1, limit: 12, onlyMyData: false };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    return Object.entries(localFilters).filter(([key, value]) => {
      if (key === 'page' || key === 'limit') return false;
      return value !== undefined && value !== null && value !== '';
    }).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ModalContainer $isOpen={isOpen}>
        <ModalHeader>
          <ModalTitle>
            <MdTune size={24} />
            Filtros de Vistoria
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          {activeFiltersCount > 0 && (
            <ActiveFiltersBadge>
              <BadgeTitle>
                <MdFilterList size={18} />
                Filtros Ativos
              </BadgeTitle>
              <BadgeText>
                {activeFiltersCount} filtro(s) aplicado(s) - Clique em "Limpar
                Filtros" para remover todos
              </BadgeText>
            </ActiveFiltersBadge>
          )}

          <FilterSection>
            <FilterSectionTitle>
              <MdSearch size={20} />
              Busca por Texto
            </FilterSectionTitle>
            <FilterGrid>
              <FilterGroup>
                <FilterLabel>
                  Título da Vistoria
                  {titleInput.length > 0 && titleInput.length < 3 && (
                    <span
                      style={{
                        color: '#f59e0b',
                        marginLeft: '8px',
                        fontSize: '0.75rem',
                      }}
                    >
                      (mín. 3 caracteres)
                    </span>
                  )}
                </FilterLabel>
                <FilterInput
                  type='text'
                  placeholder='Buscar por título... (mín. 3 caracteres)'
                  value={titleInput}
                  onChange={e => setTitleInput(e.target.value)}
                />
              </FilterGroup>
            </FilterGrid>
          </FilterSection>

          <FilterSection>
            <FilterSectionTitle>
              <MdFlag size={20} />
              Filtros por Status e Tipo
            </FilterSectionTitle>
            <FilterGrid>
              <FilterGroup>
                <FilterLabel>Status da Vistoria</FilterLabel>
                <FilterSelect
                  value={localFilters.status || ''}
                  onChange={e => handleFilterChange('status', e.target.value)}
                >
                  <option value=''>Todos os status</option>
                  {Object.entries(INSPECTION_STATUS_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Tipo de Vistoria</FilterLabel>
                <FilterSelect
                  value={localFilters.type || ''}
                  onChange={e => handleFilterChange('type', e.target.value)}
                >
                  <option value=''>Todos os tipos</option>
                  {Object.entries(INSPECTION_TYPE_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </FilterSelect>
              </FilterGroup>
            </FilterGrid>
          </FilterSection>

          <FilterSection>
            <FilterSectionTitle>
              <MdLocationOn size={20} />
              Filtros por Localização
            </FilterSectionTitle>
            <FilterGrid>
              <FilterGroup>
                <FilterLabel>Propriedade</FilterLabel>
                <FilterSelect
                  value={localFilters.propertyId || ''}
                  onChange={e =>
                    handleFilterChange('propertyId', e.target.value)
                  }
                >
                  <option value=''>Todas as propriedades</option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>
                      {property.title}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Inspetor Responsável</FilterLabel>
                <FilterSelect
                  value={localFilters.inspectorId || ''}
                  onChange={e =>
                    handleFilterChange('inspectorId', e.target.value)
                  }
                >
                  <option value=''>Todos os inspetores</option>
                  {inspectors.map(inspector => (
                    <option key={inspector.id} value={inspector.id}>
                      {inspector.name}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>
            </FilterGrid>
          </FilterSection>

          <FilterSection>
            <FilterSectionTitle>
              <MdCalendarToday size={20} />
              Filtros por Data
            </FilterSectionTitle>
            <DateRangeContainer>
              <DateGroup>
                <FilterLabel>Data Inicial</FilterLabel>
                <FilterInput
                  type='date'
                  value={localFilters.startDate || ''}
                  onChange={e =>
                    handleFilterChange('startDate', e.target.value)
                  }
                />
              </DateGroup>

              <RangeSeparator>até</RangeSeparator>

              <DateGroup>
                <FilterLabel>Data Final</FilterLabel>
                <FilterInput
                  type='date'
                  value={localFilters.endDate || ''}
                  onChange={e => handleFilterChange('endDate', e.target.value)}
                />
              </DateGroup>
            </DateRangeContainer>
          </FilterSection>

          {/* Seção: Escopo de Dados */}
          <FilterSection>
            <FilterSectionTitle>
              <MdFlag size={20} />
              Escopo de Dados
            </FilterSectionTitle>
            <DataScopeFilter
              onlyMyData={localFilters.onlyMyData || false}
              onChange={value => handleFilterChange('onlyMyData', value)}
              label='Mostrar apenas minhas vistorias'
              description='Quando marcado, mostra apenas vistorias que você criou, ignorando hierarquia de usuários.'
            />
          </FilterSection>
        </ModalContent>

        <ModalActions>
          <Button onClick={onClose} $variant='secondary'>
            Cancelar
          </Button>
          {activeFiltersCount > 0 && (
            <Button onClick={handleClear} $variant='danger'>
              <MdClear size={18} />
              Limpar Filtros
            </Button>
          )}
          <Button onClick={handleApply} $variant='primary'>
            <MdFilterList size={18} />
            Aplicar Filtros
          </Button>
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
};

export { InspectionFiltersModal };
