import React, { useState, useEffect } from 'react';
import { MdClear, MdLocationOn, MdDateRange } from 'react-icons/md';
import { FilterDrawer } from '../common/FilterDrawer';
import type { AnalyticsFilters } from '../../services/analyticsApi';
import { useStatesCities } from '../../hooks/useStatesCities';
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

interface AnalyticsFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AnalyticsFilters;
  onFiltersChange: (filters: AnalyticsFilters) => void;
  loading?: boolean;
}

export const AnalyticsFiltersDrawer: React.FC<AnalyticsFiltersDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  loading = false,
}) => {
  const [localFilters, setLocalFilters] = useState<AnalyticsFilters>(filters);
  const {
    states,
    cities,
    selectedState,
    selectedCity,
    loadingStates,
    loadingCities,
    setSelectedState,
    setSelectedCity,
  } = useStatesCities();

  // Sincronizar filtros quando drawer abrir
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  // Sincronizar estado selecionado quando filtros mudarem
  useEffect(() => {
    if (isOpen && filters.state && states.length > 0) {
      const state = states.find(s => s.sigla === filters.state.toUpperCase());
      if (state && (!selectedState || selectedState.sigla !== state.sigla)) {
        setSelectedState(state);
      }
    } else if (isOpen && !filters.state) {
      setSelectedState(null);
    }
  }, [isOpen, filters.state, states, selectedState, setSelectedState]);

  // Sincronizar cidade selecionada quando filtros ou cidades mudarem
  useEffect(() => {
    if (isOpen && filters.city && filters.state && cities.length > 0) {
      const city = cities.find(c => c.nome === filters.city);
      if (city && (!selectedCity || selectedCity.nome !== city.nome)) {
        setSelectedCity(city);
      }
    } else if (isOpen && (!filters.city || !filters.state)) {
      setSelectedCity(null);
    }
  }, [
    isOpen,
    filters.city,
    filters.state,
    cities,
    selectedCity,
    setSelectedCity,
  ]);

  const handleFilterChange = (key: keyof AnalyticsFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleStateChange = (stateSigla: string) => {
    const state = states.find(s => s.sigla === stateSigla);
    setSelectedState(state || null);
    setLocalFilters(prev => ({
      ...prev,
      state: stateSigla,
      city: '', // Limpar cidade quando mudar estado
    }));
  };

  const handleCityChange = (cityName: string) => {
    const city = cities.find(c => c.nome === cityName);
    setSelectedCity(city || null);
    setLocalFilters(prev => ({
      ...prev,
      city: cityName,
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: AnalyticsFilters = {
      city: '',
      state: '',
      period: 'monthly',
      startDate: undefined,
      endDate: undefined,
    };
    setLocalFilters(clearedFilters);
    setSelectedState(null);
    setSelectedCity(null);
    onFiltersChange(clearedFilters);
    onClose();
  };

  const hasActiveFilters =
    localFilters.city !== '' ||
    localFilters.state !== '' ||
    localFilters.period !== 'monthly' ||
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
      <ApplyButton
        onClick={handleApply}
        disabled={loading || !localFilters.city || !localFilters.state}
      >
        Aplicar Filtros
      </ApplyButton>
    </>
  );

  return (
    <FilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title='Filtros de Analytics'
      footer={footer}
    >
      <FiltersContainer>
        <SectionTitle>
          <MdLocationOn size={20} />
          Localização
        </SectionTitle>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>Estado (UF) *</FilterLabel>
            <FilterSelect
              value={localFilters.state || ''}
              onChange={e => handleStateChange(e.target.value)}
              disabled={loading || loadingStates}
            >
              <option value=''>Selecione o estado</option>
              {states.map(state => (
                <option key={state.id} value={state.sigla}>
                  {state.nome} ({state.sigla})
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Cidade *</FilterLabel>
            <FilterSelect
              value={localFilters.city || ''}
              onChange={e => handleCityChange(e.target.value)}
              disabled={loading || loadingCities || !localFilters.state}
            >
              <option value=''>
                {!localFilters.state
                  ? 'Selecione primeiro o estado'
                  : loadingCities
                    ? 'Carregando cidades...'
                    : 'Selecione a cidade'}
              </option>
              {cities.map(city => (
                <option key={city.id} value={city.nome}>
                  {city.nome}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
        </FilterGrid>

        <SectionTitle>
          <MdDateRange size={20} />
          Período
        </SectionTitle>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>Período</FilterLabel>
            <FilterSelect
              value={localFilters.period || 'monthly'}
              onChange={e => handleFilterChange('period', e.target.value)}
              disabled={loading}
            >
              <option value='daily'>Diário</option>
              <option value='weekly'>Semanal</option>
              <option value='monthly'>Mensal</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Data Inicial (opcional)</FilterLabel>
            <FilterInput
              type='date'
              value={localFilters.startDate || ''}
              onChange={e =>
                handleFilterChange('startDate', e.target.value || undefined)
              }
              disabled={loading}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Data Final (opcional)</FilterLabel>
            <FilterInput
              type='date'
              value={localFilters.endDate || ''}
              onChange={e =>
                handleFilterChange('endDate', e.target.value || undefined)
              }
              disabled={loading}
            />
          </FilterGroup>
        </FilterGrid>

        <HelpText>
          * Campos obrigatórios: Cidade e Estado são necessários para buscar os
          analytics.
        </HelpText>
      </FiltersContainer>
    </FilterDrawer>
  );
};
