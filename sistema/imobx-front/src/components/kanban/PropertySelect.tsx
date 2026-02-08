import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { MdSearch, MdHome, MdClear } from 'react-icons/md';
import { kanbanApi } from '../../services/kanbanApi';
import type { KanbanTaskProperty } from '../../types/kanban';
import {
  translatePropertyType,
  translatePropertyStatus,
} from '../../utils/translations';

interface PropertySelectProps {
  projectId: string;
  value?: string | null;
  property?: KanbanTaskProperty | null;
  onChange?: (propertyId: string | null) => void;
  disabled?: boolean;
  placeholder?: string;
}

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.button<{
  $hasValue: boolean;
  $isOpen: boolean;
  $hasError?: boolean;
}>`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 16px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s ease;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  opacity: ${props => (props.disabled ? 0.6 : 1)};

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 4px
      ${props =>
        props.$hasError
          ? props.theme.colors.error + '15'
          : props.theme.colors.primary + '15'};
  }

  ${props =>
    props.$isOpen &&
    `
    border-color: ${props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props.theme.colors.primary + '15'};
  `}
`;

const SelectButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

const SelectButtonText = styled.span<{ $hasValue: boolean }>`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${props =>
    props.$hasValue
      ? props.theme.colors.text
      : props.theme.colors.textSecondary};
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  max-height: 300px;
  overflow: hidden;
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  flex-direction: column;
`;

const SearchInput = styled.input`
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-family: inherit;
  width: 100%;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const OptionsList = styled.div`
  overflow-y: auto;
  max-height: 240px;
`;

const Option = styled.div<{ $isSelected: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${props =>
    props.$isSelected ? props.theme.colors.primary + '15' : 'transparent'};

  &:hover {
    background: ${props => props.theme.colors.primary + '10'};
  }
`;

const OptionInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const OptionTitle = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const OptionDetails = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const EmptyState = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

const LoadingState = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

export const PropertySelect: React.FC<PropertySelectProps> = ({
  projectId,
  value,
  property,
  onChange,
  disabled = false,
  placeholder = 'Selecione um imóvel',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [properties, setProperties] = useState<KanbanTaskProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Sincronizar imóveis quando o valor mudar (para mostrar dados atualizados)
  // Só buscar se não temos o imóvel completo passado como prop
  useEffect(() => {
    if (value && projectId && !property) {
      const propertyExists = properties.find(p => p.id === value);
      if (!propertyExists) {
        // Se o imóvel não está na lista mas temos um valor, recarregar
        const fetchProperties = async () => {
          try {
            const data = await kanbanApi.getProjectProperties(projectId);
            setProperties(data);
          } catch (error) {
            console.error('Erro ao buscar imóveis:', error);
          }
        };
        fetchProperties();
      }
    }
  }, [value, projectId, property]);

  // Buscar imóveis
  useEffect(() => {
    if (!projectId || !isOpen) return;

    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await kanbanApi.getProjectProperties(
          projectId,
          searchTerm || undefined
        );
        setProperties(data);
      } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchProperties, 300); // Debounce de 300ms
    return () => clearTimeout(timeoutId);
  }, [projectId, searchTerm, isOpen]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Usar o imóvel passado como prop se disponível, senão buscar na lista
  // Usar useMemo para garantir que seja recalculado quando property ou value mudarem
  const selectedProperty = useMemo(() => {
    // Prioridade 1: Se temos o imóvel como prop e ele corresponde ao value, usar ele
    if (property && value && property.id === value) {
      return property;
    }
    // Prioridade 2: Se temos property como prop mas não corresponde ao value, ainda usar se o value não está definido (atualização em progresso)
    if (property && !value) {
      return property;
    }
    // Prioridade 3: Se temos value, buscar na lista
    if (value) {
      const foundInList = properties.find(p => p.id === value);
      if (foundInList) {
        return foundInList;
      }
      // Se temos value mas não encontramos na lista e não temos property como prop,
      // retornar um objeto temporário com apenas o ID para mostrar que há um valor selecionado
      // Isso evita que o componente fique "piscando" enquanto os dados são carregados
      if (!property) {
        return { id: value, title: 'Carregando...' } as KanbanTaskProperty;
      }
    }
    return null;
  }, [property, value, properties]);

  const handleSelect = (propertyId: string) => {
    onChange?.(propertyId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <SelectContainer ref={containerRef}>
      <SelectButton
        type='button'
        $hasValue={!!value}
        $isOpen={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <SelectButtonContent>
          {selectedProperty ? (
            <>
              <MdHome size={20} />
              <SelectButtonText $hasValue={true}>
                {selectedProperty.title}
                {selectedProperty.code && ` (${selectedProperty.code})`}
                {selectedProperty.city && ` - ${selectedProperty.city}`}
                {selectedProperty.salePrice &&
                  ` - R$ ${selectedProperty.salePrice.toLocaleString('pt-BR')}`}
                {selectedProperty.rentPrice &&
                  !selectedProperty.salePrice &&
                  ` - Aluguel: R$ ${selectedProperty.rentPrice.toLocaleString('pt-BR')}`}
              </SelectButtonText>
            </>
          ) : (
            <SelectButtonText $hasValue={false}>{placeholder}</SelectButtonText>
          )}
        </SelectButtonContent>
        {value && !disabled && (
          <ClearButton onClick={handleClear} type='button'>
            <MdClear size={18} />
          </ClearButton>
        )}
      </SelectButton>

      <Dropdown $isOpen={isOpen}>
        <SearchInput
          type='text'
          placeholder='Buscar imóvel...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onClick={e => e.stopPropagation()}
        />
        <OptionsList>
          {loading ? (
            <LoadingState>Carregando imóveis...</LoadingState>
          ) : properties.length === 0 ? (
            <EmptyState>
              {searchTerm
                ? 'Nenhum imóvel encontrado'
                : 'Nenhum imóvel disponível'}
            </EmptyState>
          ) : (
            properties.map(property => (
              <Option
                key={property.id}
                $isSelected={property.id === value}
                onClick={() => handleSelect(property.id)}
              >
                <MdHome size={20} />
                <OptionInfo>
                  <OptionTitle>{property.title}</OptionTitle>
                  <OptionDetails>
                    {property.code && <span>Código: {property.code}</span>}
                    {property.address && <span>{property.address}</span>}
                    {property.city && property.state && (
                      <span>
                        {property.city}/{property.state}
                      </span>
                    )}
                    {property.neighborhood && (
                      <span>Bairro: {property.neighborhood}</span>
                    )}
                    {property.type && (
                      <span>Tipo: {translatePropertyType(property.type)}</span>
                    )}
                    {property.status && (
                      <span>
                        Status: {translatePropertyStatus(property.status)}
                      </span>
                    )}
                    {property.salePrice && (
                      <span>
                        Venda: R${' '}
                        {property.salePrice.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    )}
                    {property.rentPrice && (
                      <span>
                        Aluguel: R${' '}
                        {property.rentPrice.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    )}
                    {property.bedrooms && (
                      <span>{property.bedrooms} quartos</span>
                    )}
                    {property.bathrooms && (
                      <span>{property.bathrooms} banheiros</span>
                    )}
                    {property.parkingSpaces && (
                      <span>{property.parkingSpaces} vagas</span>
                    )}
                    {property.totalArea && (
                      <span>Área total: {property.totalArea}m²</span>
                    )}
                    {property.builtArea && (
                      <span>Área construída: {property.builtArea}m²</span>
                    )}
                    {property.responsibleUserName && (
                      <span>Responsável: {property.responsibleUserName}</span>
                    )}
                  </OptionDetails>
                </OptionInfo>
              </Option>
            ))
          )}
        </OptionsList>
      </Dropdown>
    </SelectContainer>
  );
};
