import React, { useState, useEffect } from 'react';
import { MdClear, MdDateRange } from 'react-icons/md';
import { FilterDrawer } from '../common/FilterDrawer';
import type { AdvancedAnalyticsFilters } from '../../hooks/useAdvancedAnalytics';
import {
  FiltersContainer,
  SectionTitle,
  HelpText,
  FilterGrid,
  FilterGroup,
  FilterLabel,
  FilterInput,
  FilterSelect,
  ClearButton,
  ApplyButton,
} from './AnalyticsFiltersDrawerStyles';

interface AdvancedAnalyticsFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdvancedAnalyticsFilters;
  onFiltersChange: (filters: AdvancedAnalyticsFilters) => void;
  loading?: boolean;
}

export const AdvancedAnalyticsFiltersDrawer: React.FC<
  AdvancedAnalyticsFiltersDrawerProps
> = ({ isOpen, onClose, filters, onFiltersChange, loading = false }) => {
  const [localFilters, setLocalFilters] =
    useState<AdvancedAnalyticsFilters>(filters);

  // Sincronizar filtros quando drawer abrir
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const handleFilterChange = (
    key: keyof AdvancedAnalyticsFilters,
    value: any
  ) => {
    setLocalFilters(prev => {
      const newFilters = { ...prev, [key]: value };

      // Se mudar o período, limpar datas customizadas
      if (key === 'period' && value !== undefined) {
        newFilters.startDate = undefined;
        newFilters.endDate = undefined;
      }

      // Se definir datas customizadas, limpar período
      if ((key === 'startDate' || key === 'endDate') && value !== undefined) {
        newFilters.period = undefined;
      }

      return newFilters;
    });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: AdvancedAnalyticsFilters = {
      period: 'month',
      startDate: undefined,
      endDate: undefined,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClose();
  };

  const hasActiveFilters =
    localFilters.period !== 'month' ||
    localFilters.startDate !== undefined ||
    localFilters.endDate !== undefined;

  const footer = (
    <>
      {hasActiveFilters && (
        <ClearButton onClick={handleClear} disabled={loading}>
          <MdClear size={16} />
          Limpar Filtros
        </ClearButton>
      )}
      <ApplyButton onClick={handleApply} disabled={loading}>
        Aplicar Filtros
      </ApplyButton>
    </>
  );

  // Formatar data para input type="date"
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Converter string de data para Date
  const parseDateFromInput = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  return (
    <FilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title='Filtros de Análise Avançada'
      footer={footer}
    >
      <FiltersContainer>
        <SectionTitle>
          <MdDateRange size={20} />
          Período
        </SectionTitle>
        <HelpText>
          Selecione um período pré-definido ou defina datas customizadas
        </HelpText>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>Período Pré-definido</FilterLabel>
            <FilterSelect
              value={localFilters.period || 'month'}
              onChange={e =>
                handleFilterChange(
                  'period',
                  e.target.value as 'week' | 'month' | 'quarter' | 'year'
                )
              }
              disabled={
                localFilters.startDate !== undefined ||
                localFilters.endDate !== undefined
              }
            >
              <option value='week'>Última Semana</option>
              <option value='month'>Último Mês</option>
              <option value='quarter'>Último Trimestre</option>
              <option value='year'>Último Ano</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Data Inicial (Customizada)</FilterLabel>
            <FilterInput
              type='date'
              value={formatDateForInput(localFilters.startDate)}
              onChange={e => {
                const date = parseDateFromInput(e.target.value);
                handleFilterChange('startDate', date);
              }}
              disabled={localFilters.period !== undefined}
            />
            <HelpText style={{ fontSize: '0.75rem', marginTop: '4px' }}>
              Deixe vazio para usar período pré-definido
            </HelpText>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Data Final (Customizada)</FilterLabel>
            <FilterInput
              type='date'
              value={formatDateForInput(localFilters.endDate)}
              onChange={e => {
                const date = parseDateFromInput(e.target.value);
                handleFilterChange('endDate', date);
              }}
              disabled={localFilters.period !== undefined}
              min={formatDateForInput(localFilters.startDate)}
            />
            <HelpText style={{ fontSize: '0.75rem', marginTop: '4px' }}>
              Deixe vazio para usar período pré-definido
            </HelpText>
          </FilterGroup>
        </FilterGrid>
      </FiltersContainer>
    </FilterDrawer>
  );
};
