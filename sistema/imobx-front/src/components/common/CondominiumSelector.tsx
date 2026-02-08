import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { MdSearch, MdClose, MdHome, MdLocationOn } from 'react-icons/md';
import { condominiumApi } from '../../services/condominiumApi';
import type { Condominium } from '../../types/condominium';
import { showError } from '../../utils/notifications';

interface CondominiumSelectorProps {
  value?: string; // ID do condomínio selecionado
  onChange: (condominiumId: string | null) => void;
  disabled?: boolean;
  placeholder?: string;
}

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.button<{ $isOpen: boolean; $hasValue: boolean }>`
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.938rem;
  color: ${props =>
    props.$hasValue
      ? props.theme.colors.text
      : props.theme.colors.textSecondary};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  transition: all 0.2s ease;
  opacity: ${props => (props.disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const SelectValue = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  overflow: hidden;
`;

const Placeholder = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
`;

const SelectedCondominium = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
`;

const CondominiumName = styled.span`
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CondominiumLocation = styled.span`
  font-size: 0.813rem;
  color: ${props => props.theme.colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 400px;
  overflow: hidden;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
`;

const SearchContainer = styled.div`
  padding: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const OptionsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const OptionItem = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  padding: 12px 16px;
  background: ${props =>
    props.$isSelected ? props.theme.colors.primary + '15' : 'transparent'};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: ${props =>
      props.$isSelected
        ? props.theme.colors.primary + '25'
        : props.theme.colors.background};
  }
`;

const OptionInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const OptionName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const OptionLocation = styled.div`
  font-size: 0.813rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EmptyState = styled.div`
  padding: 24px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const LoadingState = styled.div`
  padding: 24px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

export const CondominiumSelector: React.FC<CondominiumSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Selecione um condomínio...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Carregar condomínios
  useEffect(() => {
    const loadCondominiums = async () => {
      try {
        setLoading(true);
        const data = await condominiumApi.listCondominiums();
        // Filtrar apenas condomínios ativos
        setCondominiums(data.filter(c => c.isActive));
      } catch (error: any) {
        console.error('Erro ao carregar condomínios:', error);
        showError('Erro ao carregar condomínios');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadCondominiums();
    }
  }, [isOpen]);

  // Filtrar condomínios por busca
  const filteredCondominiums = useMemo(() => {
    if (!searchTerm) return condominiums;

    const term = searchTerm.toLowerCase();
    return condominiums.filter(
      c =>
        c.name.toLowerCase().includes(term) ||
        c.address.toLowerCase().includes(term) ||
        c.city.toLowerCase().includes(term) ||
        c.neighborhood.toLowerCase().includes(term)
    );
  }, [condominiums, searchTerm]);

  // Condomínio selecionado
  const selectedCondominium = useMemo(() => {
    if (!value) return null;
    return condominiums.find(c => c.id === value) || null;
  }, [condominiums, value]);

  const handleSelect = (condominiumId: string) => {
    onChange(condominiumId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <SelectContainer>
      <SelectButton
        type='button'
        onClick={handleToggle}
        $isOpen={isOpen}
        $hasValue={!!selectedCondominium}
        disabled={disabled}
      >
        <SelectValue>
          {selectedCondominium ? (
            <SelectedCondominium>
              <MdHome size={18} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <CondominiumName>{selectedCondominium.name}</CondominiumName>
                <CondominiumLocation>
                  <MdLocationOn size={14} />
                  {selectedCondominium.city}, {selectedCondominium.state}
                </CondominiumLocation>
              </div>
            </SelectedCondominium>
          ) : (
            <Placeholder>{placeholder}</Placeholder>
          )}
        </SelectValue>
        {selectedCondominium && !disabled && (
          <ClearButton onClick={handleClear} type='button'>
            <MdClose size={18} />
          </ClearButton>
        )}
      </SelectButton>

      <Dropdown $isOpen={isOpen}>
        <SearchContainer>
          <SearchInput
            type='text'
            placeholder='Buscar condomínio...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onClick={e => e.stopPropagation()}
          />
        </SearchContainer>

        <OptionsList>
          {loading ? (
            <LoadingState>Carregando condomínios...</LoadingState>
          ) : filteredCondominiums.length === 0 ? (
            <EmptyState>
              {searchTerm
                ? 'Nenhum condomínio encontrado'
                : 'Nenhum condomínio disponível'}
            </EmptyState>
          ) : (
            filteredCondominiums.map(condominium => (
              <OptionItem
                key={condominium.id}
                type='button'
                onClick={() => handleSelect(condominium.id)}
                $isSelected={condominium.id === value}
              >
                <MdHome size={20} />
                <OptionInfo>
                  <OptionName>{condominium.name}</OptionName>
                  <OptionLocation>
                    <MdLocationOn size={14} />
                    {condominium.address}, {condominium.city} -{' '}
                    {condominium.state}
                  </OptionLocation>
                </OptionInfo>
              </OptionItem>
            ))
          )}
        </OptionsList>
      </Dropdown>
    </SelectContainer>
  );
};
