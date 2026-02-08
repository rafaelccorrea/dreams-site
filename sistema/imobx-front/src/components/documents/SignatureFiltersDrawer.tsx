import React, { useState, useEffect } from 'react';
import { MdClear, MdSearch } from 'react-icons/md';
import { FilterDrawer } from '../common/FilterDrawer';
import {
  DocumentSignatureStatus,
  DocumentSignatureStatusLabels,
} from '../../types/documentSignature';
import {
  FiltersContainer,
  FilterGroup,
  FilterLabel,
  SelectInput,
  TextInput,
  ClearButton,
  ApplyButton,
  ActiveFilters,
  ActiveFiltersLabel,
  ActiveFiltersList,
  ActiveFilter,
  RemoveFilter,
} from '../../styles/pages/AllSignaturesPageStyles';

export interface SignatureFilters {
  search: string;
  status: DocumentSignatureStatus | 'all';
}

interface SignatureFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SignatureFilters;
  onFiltersChange: (filters: SignatureFilters) => void;
  loading?: boolean;
}

export const SignatureFiltersDrawer: React.FC<SignatureFiltersDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  loading = false,
}) => {
  const [localFilters, setLocalFilters] = useState<SignatureFilters>(filters);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const handleSearchChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      search: value,
    }));
  };

  const handleStatusChange = (status: DocumentSignatureStatus | 'all') => {
    setLocalFilters(prev => ({
      ...prev,
      status,
    }));
  };

  const clearFilters = () => {
    const cleared: SignatureFilters = {
      search: '',
      status: 'all',
    };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
    onClose();
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const hasActiveFilters =
    localFilters.search.trim() || localFilters.status !== 'all';

  const statusOptions: {
    value: DocumentSignatureStatus | 'all';
    label: string;
  }[] = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'pending', label: DocumentSignatureStatusLabels.pending },
    { value: 'viewed', label: DocumentSignatureStatusLabels.viewed },
    { value: 'signed', label: DocumentSignatureStatusLabels.signed },
    { value: 'rejected', label: DocumentSignatureStatusLabels.rejected },
    { value: 'expired', label: DocumentSignatureStatusLabels.expired },
    { value: 'cancelled', label: DocumentSignatureStatusLabels.cancelled },
  ];

  const footer = (
    <>
      {hasActiveFilters && (
        <ClearButton onClick={clearFilters} disabled={loading}>
          <MdClear size={16} />
          Limpar Filtros
        </ClearButton>
      )}
      <ApplyButton onClick={handleApplyFilters} disabled={loading}>
        <MdSearch size={16} />
        Aplicar Filtros
      </ApplyButton>
    </>
  );

  return (
    <FilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title='Filtros de Assinaturas'
      footer={footer}
    >
      <FiltersContainer>
        <FilterGroup>
          <FilterLabel>Buscar por Nome ou Email</FilterLabel>
          <TextInput
            type='text'
            placeholder='Digite o nome ou email do signatário...'
            value={localFilters.search}
            onChange={e => handleSearchChange(e.target.value)}
            disabled={loading}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Status</FilterLabel>
          <SelectInput
            value={localFilters.status}
            onChange={e =>
              handleStatusChange(
                e.target.value as DocumentSignatureStatus | 'all'
              )
            }
            disabled={loading}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectInput>
        </FilterGroup>

        {hasActiveFilters && (
          <ActiveFilters>
            <ActiveFiltersLabel>Filtros Ativos:</ActiveFiltersLabel>
            <ActiveFiltersList>
              {localFilters.search.trim() && (
                <ActiveFilter>
                  <span>Busca: "{localFilters.search}"</span>
                  <RemoveFilter onClick={() => handleSearchChange('')}>
                    ×
                  </RemoveFilter>
                </ActiveFilter>
              )}
              {localFilters.status !== 'all' && (
                <ActiveFilter>
                  <span>
                    Status: {DocumentSignatureStatusLabels[localFilters.status]}
                  </span>
                  <RemoveFilter onClick={() => handleStatusChange('all')}>
                    ×
                  </RemoveFilter>
                </ActiveFilter>
              )}
            </ActiveFiltersList>
          </ActiveFilters>
        )}
      </FiltersContainer>
    </FilterDrawer>
  );
};
