import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdTune, MdClear } from 'react-icons/md';
import { ModalPadrão } from '../common/ModalPadrão';
import { ModalButton } from '../common/ModalButton';
import { useDebounce } from '../../hooks/useDebounce';
import DataScopeFilter from '../common/DataScopeFilter';

const ModalContent = styled.div`
  padding: 0;
`;

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

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
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

const FilterInput = styled.input`
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

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
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

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const DateRangeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: end;
  grid-column: 1 / -1;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const DateGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
`;

const RangeSeparator = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
  padding: 0 8px;
  align-self: center;

  @media (max-width: 768px) {
    display: none;
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

interface NotesFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  onClearFilters: () => void;
  currentFilters: any;
}

export const NotesFiltersModal: React.FC<NotesFiltersModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilters,
  currentFilters,
}) => {
  const [filters, setFilters] = useState(currentFilters);

  // Estado local para busca com debounce
  const [searchInput, setSearchInput] = useState(currentFilters.search || '');

  // Aplicar debounce (500ms, mínimo 3 caracteres)
  const debouncedSearch = useDebounce(searchInput, 500, 3);

  // Sincronizar valor debounced com os filtros
  useEffect(() => {
    if (searchInput.length >= 3 || searchInput.length === 0) {
      setFilters(prev => ({ ...prev, search: debouncedSearch }));
    }
  }, [debouncedSearch]);

  // Sincronizar com mudanças externas nos filtros
  useEffect(() => {
    setSearchInput(currentFilters.search || '');
  }, [currentFilters.search]);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    setSearchInput('');
    setFilters({ onlyMyData: false });
    onClearFilters();
    onClose();
  };

  const hasActiveFilters = Object.keys(currentFilters).length > 0;

  const getActiveFiltersText = () => {
    const activeFilters = [];

    if (currentFilters.type) activeFilters.push(`Tipo: ${currentFilters.type}`);
    if (currentFilters.priority)
      activeFilters.push(`Prioridade: ${currentFilters.priority}`);
    if (currentFilters.search)
      activeFilters.push(`Busca: "${currentFilters.search}"`);
    if (currentFilters.startDate || currentFilters.endDate) {
      activeFilters.push('Filtro por data');
    }

    return activeFilters.join(', ');
  };

  return (
    <ModalPadrão
      isOpen={isOpen}
      onClose={onClose}
      title='Filtros de Anotações'
      icon={<MdTune />}
      maxWidth='1000px'
      actions={
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
      <ModalContent>
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
          <FilterSectionTitle>🔍 Busca e Categorização</FilterSectionTitle>

          {/* Campo de busca ocupando largura total */}
          <FilterGroup style={{ marginBottom: '24px' }}>
            <FilterLabel>
              Buscar por texto
              {searchInput.length > 0 && searchInput.length < 3 && (
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
              placeholder='Digite para buscar nas anotações... (mín. 3 caracteres)'
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </FilterGroup>

          {/* Grid de 2 colunas para tipo e prioridade */}
          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Tipo de Anotação</FilterLabel>
              <FilterSelect
                value={filters.type || ''}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    type: e.target.value || undefined,
                  }))
                }
              >
                <option value=''>Todos os tipos</option>
                <option value='personal'>Pessoal</option>
                <option value='work'>Trabalho</option>
                <option value='meeting'>Reunião</option>
                <option value='reminder'>Lembrete</option>
                <option value='advanced'>Avançada</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Prioridade</FilterLabel>
              <FilterSelect
                value={filters.priority || ''}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    priority: e.target.value || undefined,
                  }))
                }
              >
                <option value=''>Todas as prioridades</option>
                <option value='low'>Baixa</option>
                <option value='medium'>Média</option>
                <option value='high'>Alta</option>
                <option value='urgent'>Urgente</option>
              </FilterSelect>
            </FilterGroup>
          </FilterGrid>
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>📅 Filtro por Data</FilterSectionTitle>
          <FilterGrid>
            <DateRangeContainer>
              <DateGroup>
                <FilterLabel>Data Inicial</FilterLabel>
                <FilterInput
                  type='date'
                  value={filters.startDate || ''}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      startDate: e.target.value || undefined,
                    }))
                  }
                />
              </DateGroup>
              <RangeSeparator>até</RangeSeparator>
              <DateGroup>
                <FilterLabel>Data Final</FilterLabel>
                <FilterInput
                  type='date'
                  value={filters.endDate || ''}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      endDate: e.target.value || undefined,
                    }))
                  }
                />
              </DateGroup>
            </DateRangeContainer>
          </FilterGrid>
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>🔒 Escopo de Dados</FilterSectionTitle>
          <DataScopeFilter
            onlyMyData={filters.onlyMyData || false}
            onChange={value =>
              setFilters(prev => ({ ...prev, onlyMyData: value }))
            }
            label='Mostrar apenas minhas anotações'
            description='Quando marcado, mostra apenas anotações que você criou, ignorando hierarquia de usuários.'
          />
        </FilterSection>
      </ModalContent>
    </ModalPadrão>
  );
};

export default NotesFiltersModal;
