import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  MdDateRange,
  MdClear,
  MdCompareArrows,
  MdBusiness,
} from 'react-icons/md';
import { FilterDrawer } from '../common/FilterDrawer';
import { useAuth } from '../../hooks/useAuth';
import { useCompany } from '../../hooks/useCompany';
import dayjs from 'dayjs';
// import { useUsers } from '../../hooks/useUsers';

export interface DashboardFiltersData {
  dateRange: 'today' | '7d' | '30d' | '90d' | '1y' | 'custom';
  compareWith?: 'previous_period' | 'previous_year' | 'none';
  teamMember?: string;
  companyIds?: string[]; // Multi-empresa (Admin/Master)
  startDate?: string; // Data customizada (quando dateRange = 'custom')
  endDate?: string; // Data customizada (quando dateRange = 'custom')
}

interface DashboardFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: DashboardFiltersData;
  onFilterChange: (filters: DashboardFiltersData) => void;
  onApply?: (filters: DashboardFiltersData) => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onApply,
}) => {
  const { getCurrentUser } = useAuth();
  const { companies } = useCompany();
  // const { users, getUsers } = useUsers();
  const user = getCurrentUser();

  // Verificar se é Admin/Master com múltiplas empresas
  const isAdminOrMaster = user?.role === 'admin' || user?.role === 'master';
  const hasMultipleCompanies = companies.length > 1;

  // Filtros locais para o drawer
  const [localFilters, setLocalFilters] =
    useState<DashboardFiltersData>(filters);

  // Inicializar filtros locais quando o drawer abrir
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen]);

  // Inicializar datas padrão para admin/master quando período for custom
  useEffect(() => {
    if (isOpen && isAdminOrMaster && localFilters.dateRange === 'custom') {
      // Se não tiver datas definidas, definir padrão: primeiro dia do mês atual até hoje
      if (!localFilters.startDate || !localFilters.endDate) {
        const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
        const today = dayjs().format('YYYY-MM-DD');

        setLocalFilters(prev => ({
          ...prev,
          startDate: prev.startDate || firstDayOfMonth,
          endDate: prev.endDate || today,
        }));
      }
    }
  }, [isOpen, isAdminOrMaster, localFilters.dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  // Buscar usuários ao abrir o drawer
  // useEffect(() => {
  //   if (isOpen) {
  //     getUsers({ limit: 100 });
  //   }
  // }, [isOpen, getUsers]);
  const dateRangeOptions = [
    { value: 'today', label: 'Hoje' },
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: '1y', label: 'Último ano' },
    { value: 'custom', label: 'Período Personalizado' },
  ];

  const comparisonOptions = [
    { value: 'none', label: 'Sem comparação' },
    { value: 'previous_period', label: 'Período anterior' },
    { value: 'previous_year', label: 'Mesmo período ano passado' },
  ];

  const handleClearFilters = () => {
    const cleared: DashboardFiltersData = {
      dateRange: '30d',
      compareWith: 'none',
      teamMember: undefined,
      companyIds: undefined,
      startDate: undefined,
      endDate: undefined,
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
    if (onApply) {
      onApply(cleared);
    }
    onClose();
  };

  const handleApplyFilters = () => {
    // Se tiver onApply, chamar ele. Caso contrário, usar onFilterChange
    if (onApply) {
      onApply(localFilters);
    } else {
      onFilterChange(localFilters);
    }
    onClose();
  };

  const hasActiveFilters =
    localFilters.dateRange !== '30d' ||
    localFilters.compareWith !== 'none' ||
    localFilters.teamMember ||
    localFilters.companyIds;

  const isCustomPeriod = localFilters.dateRange === 'custom';

  const footer = (
    <>
      {hasActiveFilters && (
        <ClearButton onClick={handleClearFilters}>
          <MdClear size={16} />
          Limpar Filtros
        </ClearButton>
      )}
      <ApplyButton onClick={handleApplyFilters}>Aplicar Filtros</ApplyButton>
    </>
  );

  return (
    <FilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title='Filtros do Dashboard'
      footer={footer}
    >
      <FiltersContainer>
        {/* Período */}
        <SectionTitle>
          <MdDateRange size={20} />
          Período de Análise
        </SectionTitle>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>Intervalo de Tempo</FilterLabel>
            <FilterSelect
              value={localFilters.dateRange}
              onChange={e =>
                setLocalFilters(prev => ({
                  ...prev,
                  dateRange: e.target
                    .value as DashboardFiltersData['dateRange'],
                }))
              }
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          {/* Campos de data customizada */}
          {isCustomPeriod && (
            <>
              <FilterGroup>
                <FilterLabel>Data Inicial</FilterLabel>
                <FilterInput
                  type='date'
                  value={localFilters.startDate || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Data Final</FilterLabel>
                <FilterInput
                  type='date'
                  value={localFilters.endDate || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </FilterGroup>
            </>
          )}

          <FilterGroup>
            <FilterLabel>
              <MdCompareArrows size={16} />
              Comparar Com
            </FilterLabel>
            <FilterSelect
              value={localFilters.compareWith || 'none'}
              onChange={e =>
                setLocalFilters(prev => ({
                  ...prev,
                  compareWith: e.target
                    .value as DashboardFiltersData['compareWith'],
                }))
              }
            >
              {comparisonOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
        </FilterGrid>

        {/* Multi-Empresa (apenas para Admin/Master) */}
        {isAdminOrMaster && hasMultipleCompanies && (
          <>
            <SectionTitle>
              <MdBusiness size={20} />
              Empresas
            </SectionTitle>

            <HelpText>
              Por padrão, mostra dados da empresa atual. Selecione empresas
              específicas para comparar dados agregados.
            </HelpText>

            <FilterGrid>
              <FilterGroup>
                <FilterLabel>
                  <MdBusiness size={16} />
                  Selecionar Empresas
                </FilterLabel>
                <CompaniesCheckboxContainer>
                  <CheckboxOption>
                    <CheckboxInput
                      type='checkbox'
                      id='all-companies'
                      checked={
                        !localFilters.companyIds ||
                        localFilters.companyIds.length === 0
                      }
                      onChange={e => {
                        if (e.target.checked) {
                          setLocalFilters(prev => ({
                            ...prev,
                            companyIds: undefined,
                          }));
                        }
                      }}
                    />
                    <CheckboxLabel htmlFor='all-companies'>
                      Empresa Atual (padrão)
                    </CheckboxLabel>
                  </CheckboxOption>

                  {companies.map(company => (
                    <CheckboxOption key={company.id}>
                      <CheckboxInput
                        type='checkbox'
                        id={`company-${company.id}`}
                        checked={
                          localFilters.companyIds?.includes(company.id) || false
                        }
                        onChange={e => {
                          const currentIds = localFilters.companyIds || [];
                          const newIds = e.target.checked
                            ? [...currentIds, company.id]
                            : currentIds.filter(id => id !== company.id);
                          setLocalFilters(prev => ({
                            ...prev,
                            companyIds: newIds.length > 0 ? newIds : undefined,
                          }));
                        }}
                      />
                      <CheckboxLabel htmlFor={`company-${company.id}`}>
                        {company.name}
                      </CheckboxLabel>
                    </CheckboxOption>
                  ))}
                </CompaniesCheckboxContainer>
              </FilterGroup>
            </FilterGrid>
          </>
        )}

        {/* Filtro por Corretor - COMENTADO POR ENQUANTO */}
        {/* <SectionTitle>
          <MdPerson size={20} />
          Filtro por Corretor
        </SectionTitle>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>
              <MdPerson size={16} />
              Membro da Equipe
            </FilterLabel>
            <FilterSelect
              value={filters.teamMember || ''}
              onChange={(e) =>
                onFilterChange({ ...filters, teamMember: e.target.value || undefined })
              }
            >
              <option value="">Toda a Equipe</option>
              <option value="me">Minhas Métricas</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.id === user?.id ? '(Você)' : ''}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
        </FilterGrid> */}
      </FiltersContainer>
    </FilterDrawer>
  );
};

export default DashboardFilters;

// Styled Components
const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const HelpText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 8px 0 16px 0;
  line-height: 1.5;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const CompaniesCheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  max-height: 200px;
  overflow-y: auto;
`;

const CheckboxOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary};
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  user-select: none;
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
