import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdClear, MdBlock } from 'react-icons/md';
import { FilterDrawer } from '../common/FilterDrawer';
import type { BlacklistFilters } from '../../types/mcmv';

interface MCMVBlacklistFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: BlacklistFilters;
  onChange: (filters: BlacklistFilters) => void;
}

export const MCMVBlacklistFiltersDrawer: React.FC<
  MCMVBlacklistFiltersDrawerProps
> = ({ isOpen, onClose, filters, onChange }) => {
  const [localFilters, setLocalFilters] = useState<BlacklistFilters>({
    cpf: filters.cpf,
    email: filters.email,
    phone: filters.phone,
    isPermanent: filters.isPermanent,
    expired: filters.expired,
  });

  useEffect(() => {
    if (isOpen) {
      setLocalFilters({
        cpf: filters.cpf,
        email: filters.email,
        phone: filters.phone,
        isPermanent: filters.isPermanent,
        expired: filters.expired,
      });
    }
  }, [isOpen, filters]);

  const handleClearFilters = () => {
    const cleared: BlacklistFilters = {};
    setLocalFilters(cleared);
    onChange(cleared);
    onClose();
  };

  const handleApplyFilters = () => {
    onChange(localFilters);
    onClose();
  };

  const hasActiveFilters =
    localFilters.cpf ||
    localFilters.email ||
    localFilters.phone ||
    localFilters.isPermanent !== undefined ||
    localFilters.expired !== undefined;

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
      title='Filtros de Blacklist MCMV'
      footer={footer}
    >
      <FiltersContainer>
        <SectionTitle>
          <MdBlock size={20} />
          Filtros
        </SectionTitle>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>CPF</FilterLabel>
            <FilterInput
              type='text'
              placeholder='Buscar por CPF...'
              value={localFilters.cpf || ''}
              onChange={e =>
                setLocalFilters(prev => ({
                  ...prev,
                  cpf: e.target.value || undefined,
                }))
              }
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Email</FilterLabel>
            <FilterInput
              type='email'
              placeholder='Buscar por email...'
              value={localFilters.email || ''}
              onChange={e =>
                setLocalFilters(prev => ({
                  ...prev,
                  email: e.target.value || undefined,
                }))
              }
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Telefone</FilterLabel>
            <FilterInput
              type='text'
              placeholder='Buscar por telefone...'
              value={localFilters.phone || ''}
              onChange={e =>
                setLocalFilters(prev => ({
                  ...prev,
                  phone: e.target.value || undefined,
                }))
              }
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Tipo de Bloqueio</FilterLabel>
            <FilterSelect
              value={
                localFilters.isPermanent === undefined
                  ? ''
                  : localFilters.isPermanent
                    ? 'true'
                    : 'false'
              }
              onChange={e =>
                setLocalFilters(prev => ({
                  ...prev,
                  isPermanent:
                    e.target.value === ''
                      ? undefined
                      : e.target.value === 'true',
                }))
              }
            >
              <option value=''>Todos</option>
              <option value='true'>Permanente</option>
              <option value='false'>Temporário</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <FilterSelect
              value={
                localFilters.expired === undefined
                  ? ''
                  : localFilters.expired
                    ? 'true'
                    : 'false'
              }
              onChange={e =>
                setLocalFilters(prev => ({
                  ...prev,
                  expired:
                    e.target.value === ''
                      ? undefined
                      : e.target.value === 'true',
                }))
              }
            >
              <option value=''>Todos</option>
              <option value='false'>Ativos</option>
              <option value='true'>Expirados</option>
            </FilterSelect>
          </FilterGroup>
        </FilterGrid>
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
  gap: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
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
