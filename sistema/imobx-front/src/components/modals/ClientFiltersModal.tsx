import React, { useState, useEffect } from 'react';
import { MdSearch, MdClear, MdFilterList } from 'react-icons/md';
import type { ClientFilters } from '../../types/filters';
import { ModalPadrão } from '../common/ModalPadrão';
import DataScopeFilter from '../common/DataScopeFilter';
import { ModalButton } from '../common/ModalButton';
import {
  FilterSection,
  FilterSectionTitle,
  FilterGrid,
  FilterRow,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  FilterInput,
  ActiveFiltersBadge,
} from '../../styles/components/PropertyFiltersModalStyles';

interface ClientFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: ClientFilters) => void;
  onClearFilters: () => void;
  currentFilters: ClientFilters;
}

const ClientFiltersModal: React.FC<ClientFiltersModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilters,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<ClientFilters>(currentFilters || {});

  // Estados locais para campos de texto
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [cityInput, setCityInput] = useState(filters.city || '');

  // Sincronizar com mudanças externas
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    setCityInput(filters.city || '');
  }, [filters.city]);

  const handleFilterChange = (
    key: keyof ClientFilters,
    value: string | boolean | undefined
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: ClientFilters = {};
    setFilters(clearedFilters);
    setSearchInput('');
    setCityInput('');
    onClearFilters();
  };

  // Contar filtros ativos
  const activeFiltersCount = Object.values(filters).filter(
    value => value !== undefined && value !== '' && value !== false
  ).length;

  const footer = (
    <div
      style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}
    >
      <ModalButton variant='secondary' onClick={handleClear}>
        <MdClear size={16} />
        Limpar ({activeFiltersCount})
      </ModalButton>
      <ModalButton variant='primary' onClick={handleApply}>
        <MdFilterList size={16} />
        Aplicar Filtros
      </ModalButton>
    </div>
  );

  return (
    <ModalPadrão
      isOpen={isOpen}
      onClose={onClose}
      title='Filtros de Clientes'
      footer={footer}
    >
      <div style={{ padding: '1.5rem' }}>
        {/* Seção: Busca */}
        <FilterSection>
          <FilterSectionTitle>
            <MdSearch size={20} />
            Busca
          </FilterSectionTitle>

          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Buscar por nome, email ou telefone</FilterLabel>
              <FilterInput
                type='text'
                placeholder='Digite para buscar...'
                value={searchInput}
                onChange={e => {
                  setSearchInput(e.target.value);
                  handleFilterChange('search', e.target.value);
                }}
              />
            </FilterGroup>
          </FilterGrid>
        </FilterSection>

        {/* Seção: Filtros Básicos */}
        <FilterSection>
          <FilterSectionTitle>
            <MdFilterList size={20} />
            Filtros Básicos
          </FilterSectionTitle>

          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Tipo de Cliente</FilterLabel>
              <FilterSelect
                value={filters.type || ''}
                onChange={e =>
                  handleFilterChange('type', e.target.value || undefined)
                }
              >
                <option value=''>Todos os tipos</option>
                <option value='buyer'>Comprador</option>
                <option value='seller'>Vendedor</option>
                <option value='renter'>Locatário</option>
                <option value='lessor'>Locador</option>
                <option value='investor'>Investidor</option>
                <option value='general'>Geral</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <FilterSelect
                value={filters.status || ''}
                onChange={e =>
                  handleFilterChange('status', e.target.value || undefined)
                }
              >
                <option value=''>Todos os status</option>
                <option value='active'>Ativo</option>
                <option value='inactive'>Inativo</option>
                <option value='contacted'>Contactado</option>
                <option value='interested'>Interessado</option>
                <option value='closed'>Fechado</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Origem do Lead</FilterLabel>
              <FilterSelect
                value={filters.source || ''}
                onChange={e =>
                  handleFilterChange('source', e.target.value || undefined)
                }
              >
                <option value=''>Todas as origens</option>
                <option value='whatsapp'>WhatsApp</option>
                <option value='social_media'>Redes Sociais</option>
                <option value='phone'>Telefone</option>
                <option value='olx'>OLX</option>
                <option value='zap_imoveis'>Zap Imóveis</option>
                <option value='viva_real'>VivaReal</option>
                <option value='other'>Outros</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Cidade</FilterLabel>
              <FilterInput
                type='text'
                placeholder='Digite a cidade...'
                value={cityInput}
                onChange={e => {
                  setCityInput(e.target.value);
                  handleFilterChange('city', e.target.value);
                }}
              />
            </FilterGroup>
          </FilterGrid>
        </FilterSection>

        {/* Seção: Escopo de Dados */}
        <DataScopeFilter
          onlyMyData={filters.onlyMyData}
          onChange={value => handleFilterChange('onlyMyData', value)}
          label='Mostrar apenas meus clientes'
          description='Quando marcado, mostra apenas clientes que você cadastrou, ignorando hierarquia de usuários.'
        />

        {/* Badge de filtros ativos */}
        {activeFiltersCount > 0 && (
          <ActiveFiltersBadge>
            {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo
            {activeFiltersCount > 1 ? 's' : ''}
          </ActiveFiltersBadge>
        )}
      </div>
    </ModalPadrão>
  );
};

export default ClientFiltersModal;
