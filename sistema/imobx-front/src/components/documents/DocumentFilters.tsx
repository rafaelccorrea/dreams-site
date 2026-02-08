import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdSearch, MdClear, MdPerson, MdPeople } from 'react-icons/md';
import {
  DocumentType,
  DocumentStatus,
  DocumentTypeLabels,
  DocumentStatusLabels,
} from '../../types/document';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { FilterDrawer } from '../common/FilterDrawer';

export interface DocumentFilters {
  search: string;
  type: DocumentType | '';
  status: DocumentStatus | '';
  tags: string[];
  page: number;
  limit: number;
  onlyMyDocuments?: boolean;
}

interface DocumentFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: DocumentFilters;
  onFiltersChange: (filters: DocumentFilters) => void;
  loading?: boolean;
}

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  loading = false,
}) => {
  const { isAdmin } = useRoleAccess();
  // Filtros locais para o drawer
  const [localFilters, setLocalFilters] = useState<DocumentFilters>(filters);
  const [tagsInput, setTagsInput] = useState('');

  // Inicializar filtros locais quando o drawer abrir
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
      setTagsInput(filters.tags.join(', '));
    }
  }, [isOpen, filters]);

  const handleTypeChange = (type: DocumentType | '') => {
    setLocalFilters(prev => ({
      ...prev,
      type,
      page: 1,
    }));
  };

  const handleStatusChange = (status: DocumentStatus | '') => {
    setLocalFilters(prev => ({
      ...prev,
      status,
      page: 1,
    }));
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    setLocalFilters(prev => ({
      ...prev,
      tags,
      page: 1,
    }));
  };

  const handleLimitChange = (limit: number) => {
    setLocalFilters(prev => ({
      ...prev,
      limit,
      page: 1,
    }));
  };

  const handleOnlyMyDocumentsChange = (value: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      onlyMyDocuments: value,
      page: 1,
    }));
  };

  const handleSearchChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const clearFilters = () => {
    const cleared: DocumentFilters = {
      search: '',
      type: '',
      status: '',
      tags: [],
      page: 1,
      limit: 20,
      onlyMyDocuments: false,
    };
    setLocalFilters(cleared);
    setTagsInput('');
    onFiltersChange(cleared);
    onClose();
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const hasActiveFilters =
    localFilters.search ||
    localFilters.type ||
    localFilters.status ||
    localFilters.tags.length > 0 ||
    localFilters.onlyMyDocuments;

  const footer = (
    <>
      <ClearButton onClick={clearFilters} disabled={loading}>
        <MdClear size={16} />
        Limpar Filtros
      </ClearButton>
      <ApplyButton onClick={handleApplyFilters} disabled={loading}>
        Aplicar Filtros
      </ApplyButton>
    </>
  );

  return (
    <FilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title='Filtros'
      footer={footer}
    >
      <FiltersContainer>
        {/* Search Input - Linha inteira no topo */}
        <SearchFilterGroup>
          <FilterLabel>
            Buscar por Cliente/Propriedade
            {localFilters.search.length > 0 &&
              localFilters.search.length < 3 && (
                <SearchHint> (mínimo 3 caracteres)</SearchHint>
              )}
          </FilterLabel>
          <SearchInputContainer>
            <SearchIcon>
              <MdSearch size={18} />
            </SearchIcon>
            <SearchInput
              type='text'
              placeholder='Buscar por nome do cliente ou propriedade...'
              value={localFilters.search}
              onChange={e => handleSearchChange(e.target.value)}
              disabled={loading}
            />
          </SearchInputContainer>
        </SearchFilterGroup>

        {/* Admin/Master Only: Filter My Documents - Linha inteira */}
        {isAdmin() && (
          <ScopeFilterGroup>
            <FilterLabel>Escopo dos Documentos</FilterLabel>
            <ToggleContainer>
              <ToggleButton
                $active={!localFilters.onlyMyDocuments}
                onClick={() => handleOnlyMyDocumentsChange(false)}
                disabled={loading}
              >
                <MdPeople size={18} />
                Todos da Empresa
              </ToggleButton>
              <ToggleButton
                $active={!!localFilters.onlyMyDocuments}
                onClick={() => handleOnlyMyDocumentsChange(true)}
                disabled={loading}
              >
                <MdPerson size={18} />
                Apenas Meus
              </ToggleButton>
            </ToggleContainer>
          </ScopeFilterGroup>
        )}

        {/* Filtros em Grid */}
        <FiltersGrid>
          {/* Type Filter */}
          <FilterGroup>
            <FilterLabel>Tipo de Documento</FilterLabel>
            <SelectInput
              value={localFilters.type}
              onChange={e =>
                handleTypeChange(e.target.value as DocumentType | '')
              }
              disabled={loading}
            >
              <option value=''>Todos os Tipos</option>
              {Object.entries(DocumentTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </SelectInput>
          </FilterGroup>

          {/* Status Filter */}
          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <SelectInput
              value={localFilters.status}
              onChange={e =>
                handleStatusChange(e.target.value as DocumentStatus | '')
              }
              disabled={loading}
            >
              <option value=''>Todos os Status</option>
              {Object.entries(DocumentStatusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </SelectInput>
          </FilterGroup>

          {/* Tags Filter */}
          <FilterGroup>
            <FilterLabel>Tags</FilterLabel>
            <TextInput
              type='text'
              placeholder='Ex: contrato, urgente, cliente...'
              value={tagsInput}
              onChange={e => handleTagsChange(e.target.value)}
              disabled={loading}
            />
            <FilterHelpText>Separe múltiplas tags com vírgulas</FilterHelpText>
          </FilterGroup>

          {/* Limit Filter */}
          <FilterGroup>
            <FilterLabel>Documentos por Página</FilterLabel>
            <SelectInput
              value={localFilters.limit}
              onChange={e => handleLimitChange(Number(e.target.value))}
              disabled={loading}
            >
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
              <option value={100}>100 por página</option>
            </SelectInput>
          </FilterGroup>
        </FiltersGrid>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <ActiveFilters>
            <ActiveFiltersLabel>Filtros Ativos:</ActiveFiltersLabel>
            <ActiveFiltersList>
              {localFilters.search && (
                <ActiveFilter>
                  <span>Cliente/Propriedade: "{localFilters.search}"</span>
                  <RemoveFilter onClick={() => handleSearchChange('')}>
                    ×
                  </RemoveFilter>
                </ActiveFilter>
              )}
              {localFilters.type && (
                <ActiveFilter>
                  <span>Tipo: {DocumentTypeLabels[localFilters.type]}</span>
                  <RemoveFilter onClick={() => handleTypeChange('')}>
                    ×
                  </RemoveFilter>
                </ActiveFilter>
              )}
              {localFilters.status && (
                <ActiveFilter>
                  <span>
                    Status: {DocumentStatusLabels[localFilters.status]}
                  </span>
                  <RemoveFilter onClick={() => handleStatusChange('')}>
                    ×
                  </RemoveFilter>
                </ActiveFilter>
              )}
              {localFilters.tags.map((tag, index) => (
                <ActiveFilter key={index}>
                  <span>Tag: {tag}</span>
                  <RemoveFilter
                    onClick={() => {
                      const newTags = localFilters.tags.filter(
                        (_, i) => i !== index
                      );
                      handleTagsChange(newTags.join(', '));
                    }}
                  >
                    ×
                  </RemoveFilter>
                </ActiveFilter>
              ))}
            </ActiveFiltersList>
          </ActiveFilters>
        )}
      </FiltersContainer>
    </FilterDrawer>
  );
};

// Styled Components
const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
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

const SearchFilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
`;

const ScopeFilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FilterLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SearchHint = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.theme.colors.warning};
  text-transform: none;
  letter-spacing: normal;
`;

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  color: ${props => props.theme.colors.textSecondary};
  z-index: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 14px 14px 44px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 15px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SelectInput = styled.select`
  width: 100%;
  padding: 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TextInput = styled.input`
  width: 100%;
  padding: 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FilterHelpText = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
`;

const ActiveFilters = styled.div`
  margin-top: 8px;
  padding-top: 24px;
  border-top: 2px solid ${props => props.theme.colors.border};
`;

const ActiveFiltersLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ActiveFiltersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ActiveFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
`;

const RemoveFilter = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  padding: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    transform: scale(1.1);
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const ToggleButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  border: 2px solid
    ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  background: ${props =>
    props.$active
      ? `${props.theme.colors.primary}15`
      : props.theme.colors.background};
  color: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary};
    background: ${props =>
      props.$active
        ? `${props.theme.colors.primary}20`
        : `${props.theme.colors.primary}10`};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
