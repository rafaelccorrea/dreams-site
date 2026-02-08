import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  MdDateRange,
  MdClear,
  MdCompareArrows,
  MdBarChart,
} from 'react-icons/md';
import { FilterDrawer } from '../common/FilterDrawer';
import dayjs from 'dayjs';
import type { UserDashboardFilters as UserDashboardFiltersType } from '../../hooks/useUserDashboard';

interface UserDashboardFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: UserDashboardFiltersType;
  onFilterChange: (filters: UserDashboardFiltersType) => void;
  onApply?: (filters: UserDashboardFiltersType) => void;
}

const UserDashboardFilters: React.FC<UserDashboardFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onApply,
}) => {
  // Filtros locais para o drawer
  const [localFilters, setLocalFilters] =
    useState<UserDashboardFiltersType>(filters);

  // Inicializar filtros locais quando o drawer abrir
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen]);

  // Inicializar datas padrão quando período for custom
  useEffect(() => {
    if (isOpen && localFilters.dateRange === 'custom') {
      // Sempre definir padrão: primeiro dia do mês atual até hoje quando selecionar custom
      const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
      const today = dayjs().format('YYYY-MM-DD');

      // Se não tiver datas ou se mudou para custom, atualizar com datas padrão
      if (
        !localFilters.startDate ||
        !localFilters.endDate ||
        localFilters.startDate !== firstDayOfMonth ||
        localFilters.endDate !== today
      ) {
        setLocalFilters(prev => ({
          ...prev,
          startDate: firstDayOfMonth,
          endDate: today,
        }));
      }
    }
  }, [isOpen, localFilters.dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const metricOptions = [
    { value: 'all', label: 'Todas as métricas' },
    { value: 'properties', label: 'Propriedades' },
    { value: 'clients', label: 'Clientes' },
    { value: 'inspections', label: 'Vistorias' },
    { value: 'appointments', label: 'Agendamentos' },
    { value: 'commissions', label: 'Comissões' },
    { value: 'tasks', label: 'Tarefas' },
    { value: 'matches', label: 'Matches' },
  ];

  const handleClearFilters = () => {
    const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');

    const cleared: UserDashboardFiltersType = {
      dateRange: 'custom',
      startDate: firstDayOfMonth,
      endDate: today,
      compareWith: 'none',
      metric: 'all',
      activitiesLimit: 10,
      appointmentsLimit: 5,
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

  // Verificar se há filtros ativos (considerando que padrão é 'custom' com datas do mês atual)
  const defaultStartDate = dayjs().startOf('month').format('YYYY-MM-DD');
  const defaultEndDate = dayjs().format('YYYY-MM-DD');

  const hasActiveFilters =
    localFilters.dateRange !== 'custom' ||
    localFilters.startDate !== defaultStartDate ||
    localFilters.endDate !== defaultEndDate ||
    localFilters.compareWith !== 'none' ||
    localFilters.metric !== 'all' ||
    localFilters.activitiesLimit !== 10 ||
    localFilters.appointmentsLimit !== 5;

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
              value={localFilters.dateRange || 'custom'}
              onChange={e => {
                const newDateRange = e.target
                  .value as UserDashboardFiltersType['dateRange'];
                let updatedFilters: UserDashboardFiltersType = {
                  ...localFilters,
                  dateRange: newDateRange,
                };

                // Se mudou para custom, preencher com datas padrão (dia 1 do mês até hoje)
                if (newDateRange === 'custom') {
                  const firstDayOfMonth = dayjs()
                    .startOf('month')
                    .format('YYYY-MM-DD');
                  const today = dayjs().format('YYYY-MM-DD');
                  updatedFilters = {
                    ...updatedFilters,
                    startDate: firstDayOfMonth,
                    endDate: today,
                  };
                }

                setLocalFilters(updatedFilters);
              }}
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
                    .value as UserDashboardFiltersType['compareWith'],
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

        {/* Tipo de Métrica */}
        <SectionTitle>
          <MdBarChart size={20} />
          Tipo de Métrica
        </SectionTitle>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>
              <MdBarChart size={16} />
              Filtrar por Métrica
            </FilterLabel>
            <FilterSelect
              value={localFilters.metric || 'all'}
              onChange={e =>
                setLocalFilters(prev => ({
                  ...prev,
                  metric: e.target.value as UserDashboardFiltersType['metric'],
                }))
              }
            >
              {metricOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FilterSelect>
            <HelpText>
              Quando selecionado um tipo específico, apenas essa métrica retorna
              dados, as outras retornam zero.
            </HelpText>
          </FilterGroup>
        </FilterGrid>

        {/* Limites */}
        <SectionTitle>Limites de Resultados</SectionTitle>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>Atividades Recentes</FilterLabel>
            <FilterInput
              type='number'
              min='1'
              max='100'
              value={localFilters.activitiesLimit || 10}
              onChange={e => {
                const value = parseInt(e.target.value) || 10;
                setLocalFilters(prev => ({
                  ...prev,
                  activitiesLimit: Math.max(1, Math.min(100, value)),
                }));
              }}
            />
            <HelpText>
              Quantidade de atividades recentes a exibir (1-100, padrão: 10)
            </HelpText>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Próximos Agendamentos</FilterLabel>
            <FilterInput
              type='number'
              min='1'
              max='50'
              value={localFilters.appointmentsLimit || 5}
              onChange={e => {
                const value = parseInt(e.target.value) || 5;
                setLocalFilters(prev => ({
                  ...prev,
                  appointmentsLimit: Math.max(1, Math.min(50, value)),
                }));
              }}
            />
            <HelpText>
              Quantidade de agendamentos próximos a exibir (1-50, padrão: 5)
            </HelpText>
          </FilterGroup>
        </FilterGrid>
      </FiltersContainer>
    </FilterDrawer>
  );
};

export default UserDashboardFilters;

// Styled Components
const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const HelpText = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 8px 0 0 0;
  line-height: 1.4;
  opacity: 0.8;
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

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.textSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const ApplyButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.theme.colors.primaryHover || props.theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;
