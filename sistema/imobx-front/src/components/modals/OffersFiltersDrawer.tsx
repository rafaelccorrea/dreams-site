import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdTune, MdClear } from 'react-icons/md';
import { FilterDrawer } from '../common/FilterDrawer';
import { ModalButton } from '../common/ModalButton';
import type { OfferFilters } from '../../services/propertyOffersApi';
import type { OfferStatus, OfferType } from '../../types/propertyOffer';

const FilterSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterSectionTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
`;

const FilterLabel = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  box-sizing: border-box;
  min-width: 0;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const ActiveFiltersBadge = styled.div`
  background: ${props => props.theme.colors.primary}20;
  border: 1px solid ${props => props.theme.colors.primary}40;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
`;

const BadgeTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BadgeText = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
`;

interface OffersFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: OfferFilters) => void;
  onClearFilters: () => void;
  currentFilters: OfferFilters;
}

export const OffersFiltersDrawer: React.FC<OffersFiltersDrawerProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilters,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<OfferFilters>(currentFilters);

  // Sincronizar com mudanças externas nos filtros
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({});
    onClearFilters();
    onClose();
  };

  const hasActiveFilters = Object.keys(currentFilters).some(
    key => currentFilters[key as keyof OfferFilters] !== undefined
  );

  const getActiveFiltersText = () => {
    const activeFilters = [];

    if (currentFilters.status) {
      const statusLabels: Record<OfferStatus, string> = {
        pending: 'Pendente',
        accepted: 'Aceita',
        rejected: 'Rejeitada',
        withdrawn: 'Retirada',
        expired: 'Expirada',
      };
      activeFilters.push(
        `Status: ${statusLabels[currentFilters.status] || currentFilters.status}`
      );
    }
    if (currentFilters.type) {
      activeFilters.push(
        `Tipo: ${currentFilters.type === 'sale' ? 'Venda' : 'Aluguel'}`
      );
    }
    if (currentFilters.propertyId) {
      activeFilters.push('Filtro por propriedade');
    }

    return activeFilters.length > 0
      ? activeFilters.join(', ')
      : 'Nenhum filtro ativo';
  };

  return (
    <FilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title='Filtros de Ofertas'
      footer={
        <>
          <ModalButton
            variant='danger'
            onClick={handleClear}
            icon={<MdClear size={16} />}
          >
            Limpar Filtros
          </ModalButton>
          <ModalButton variant='secondary' onClick={onClose}>
            Cancelar
          </ModalButton>
          <ModalButton variant='primary' onClick={handleApply}>
            Aplicar Filtros
          </ModalButton>
        </>
      }
    >
      {hasActiveFilters && (
        <ActiveFiltersBadge>
          <BadgeTitle>
            <MdTune size={16} />
            Filtros Ativos
          </BadgeTitle>
          <BadgeText>{getActiveFiltersText()}</BadgeText>
        </ActiveFiltersBadge>
      )}

      <FilterSection>
        <FilterSectionTitle>📊 Status e Tipo</FilterSectionTitle>

        <FilterGroup style={{ marginBottom: '24px' }}>
          <FilterLabel>Status da Oferta</FilterLabel>
          <FilterSelect
            value={filters.status || 'all'}
            onChange={e =>
              setFilters(prev => ({
                ...prev,
                status:
                  e.target.value === 'all'
                    ? undefined
                    : (e.target.value as OfferStatus),
              }))
            }
          >
            <option value='all'>Todos os status</option>
            <option value='pending'>Pendente</option>
            <option value='accepted'>Aceita</option>
            <option value='rejected'>Rejeitada</option>
            <option value='withdrawn'>Retirada</option>
            <option value='expired'>Expirada</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Tipo de Oferta</FilterLabel>
          <FilterSelect
            value={filters.type || 'all'}
            onChange={e =>
              setFilters(prev => ({
                ...prev,
                type:
                  e.target.value === 'all'
                    ? undefined
                    : (e.target.value as OfferType),
              }))
            }
          >
            <option value='all'>Todos os tipos</option>
            <option value='sale'>Venda</option>
            <option value='rental'>Aluguel</option>
          </FilterSelect>
        </FilterGroup>
      </FilterSection>
    </FilterDrawer>
  );
};
