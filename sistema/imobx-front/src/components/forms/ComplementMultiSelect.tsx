import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdArrowDropDown,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdEdit,
} from 'react-icons/md';

// Interface para complemento com tipo e valor opcional
export interface ComplementItem {
  type: string;
  value?: string;
}

interface ComplementMultiSelectProps {
  value: ComplementItem[];
  onChange: (value: ComplementItem[]) => void;
  propertyType?: string;
  placeholder?: string;
  disabled?: boolean;
}

// Opções de complemento por tipo de propriedade
const COMPLEMENT_OPTIONS: Record<string, string[]> = {
  house: ['Quadra', 'Lote', 'Setor', 'Chácara', 'Sítio', 'Fazenda'],
  apartment: ['Apto', 'Bloco', 'Andar', 'Torre', 'Conjunto', 'Edifício'],
  commercial: ['Sala', 'Loja', 'Andar', 'Pavimento', 'Galpão', 'Box'],
  land: ['Quadra', 'Lote', 'Setor', 'Área', 'Gleba'],
  rural: ['Quadra', 'Lote', 'Setor', 'Chácara', 'Sítio', 'Fazenda', 'Área'],
  // Para condomínios
  condominium: ['Bloco', 'Quadra', 'Lote', 'Setor', 'Torre', 'Conjunto'],
};

// Opções padrão quando não há tipo definido
const DEFAULT_OPTIONS = [
  'Apto',
  'Bloco',
  'Quadra',
  'Lote',
  'Sala',
  'Andar',
  'Torre',
  'Setor',
];

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.button<{ $isOpen: boolean; $hasError?: boolean }>`
  width: 100%;
  min-height: 44px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid
    ${props =>
      props.$hasError
        ? props.theme.colors.error
        : props.$isOpen
          ? props.theme.colors.primary
          : props.theme.colors.border};
  border-radius: 12px;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  transition: all 0.2s ease;
  text-align: left;

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const SelectedTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
  min-height: 24px;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  position: relative;
`;

const TagContent = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TagValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const EditTagButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  padding: 2px;
  margin-left: 4px;
  transition: color 0.2s;
  opacity: 0.7;

  &:hover {
    opacity: 1;
    color: ${props => props.theme.colors.primaryDark};
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const RemoveTagButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.error};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Placeholder = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  animation: ${props => (props.$isOpen ? 'slideDown 0.2s ease' : 'none')};

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const OptionsList = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const OptionItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props =>
    props.$isSelected ? `${props.theme.colors.primary}10` : 'transparent'};

  &:hover {
    background: ${props =>
      props.$isSelected
        ? `${props.theme.colors.primary}15`
        : `${props.theme.colors.backgroundSecondary}`};
  }
`;

const OptionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const OptionLabel = styled.span`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text};
  user-select: none;
  flex: 1;
`;

const ValueInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.9rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;
  margin-left: 30px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    font-style: italic;
  }
`;

const ArrowIcon = styled(MdArrowDropDown)<{ $isOpen: boolean }>`
  width: 24px;
  height: 24px;
  color: ${props => props.theme.colors.textSecondary};
  transition: transform 0.2s ease;
  transform: ${props => (props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  flex-shrink: 0;
`;

const EditModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const EditModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const EditModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const EditModalInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const EditModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const EditModalButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primaryDark};
    }
  `
      : `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    
    &:hover {
      background: ${props.theme.colors.border};
    }
  `}
`;

export const ComplementMultiSelect: React.FC<ComplementMultiSelectProps> = ({
  value = [],
  onChange,
  propertyType,
  placeholder = 'Selecione os complementos',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    index: number;
    value: string;
  } | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Obter opções baseadas no tipo de propriedade
  const getOptions = (): string[] => {
    if (!propertyType) {
      return DEFAULT_OPTIONS;
    }
    return COMPLEMENT_OPTIONS[propertyType] || DEFAULT_OPTIONS;
  };

  const options = getOptions();

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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOption = (optionType: string) => {
    if (disabled) return;

    const existingIndex = value.findIndex(item => item.type === optionType);

    if (existingIndex >= 0) {
      // Remover se já existe
      const newValue = value.filter((_, index) => index !== existingIndex);
      onChange(newValue);
    } else {
      // Adicionar novo
      const newValue = [...value, { type: optionType }];
      onChange(newValue);
    }
  };

  const updateItemValue = (index: number, newValue: string) => {
    if (disabled) return;

    const updated = [...value];
    updated[index] = {
      ...updated[index],
      value: newValue.trim() || undefined,
    };
    onChange(updated);
  };

  const removeTag = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const startEditing = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    setEditingItem({ index, value: value[index].value || '' });
    setEditingValue(value[index].value || '');
  };

  const saveEdit = () => {
    if (editingItem) {
      updateItemValue(editingItem.index, editingValue);
      setEditingItem(null);
      setEditingValue('');
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditingValue('');
  };

  const formatDisplay = (item: ComplementItem): string => {
    return item.value ? `${item.type}: ${item.value}` : item.type;
  };

  return (
    <>
      <Container ref={containerRef}>
        <SelectButton
          type='button'
          $isOpen={isOpen}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <SelectedTags>
            {value.length > 0 ? (
              value.map((item, index) => (
                <Tag key={`${item.type}-${index}`}>
                  <TagContent>
                    {formatDisplay(item)}
                    <EditTagButton
                      type='button'
                      onClick={e => startEditing(index, e)}
                      title={`Editar valor de ${item.type}`}
                    >
                      <MdEdit />
                    </EditTagButton>
                    <RemoveTagButton
                      type='button'
                      onClick={e => removeTag(index, e)}
                      title={`Remover ${item.type}`}
                    >
                      <MdClose />
                    </RemoveTagButton>
                  </TagContent>
                </Tag>
              ))
            ) : (
              <Placeholder>{placeholder}</Placeholder>
            )}
          </SelectedTags>
          <ArrowIcon $isOpen={isOpen} />
        </SelectButton>

        <Dropdown $isOpen={isOpen}>
          <OptionsList>
            {options.map(optionType => {
              const existingItem = value.find(item => item.type === optionType);
              const isSelected = !!existingItem;

              return (
                <OptionItem key={optionType} $isSelected={isSelected}>
                  <OptionHeader onClick={() => toggleOption(optionType)}>
                    <Checkbox>
                      {isSelected ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                    </Checkbox>
                    <OptionLabel>{optionType}</OptionLabel>
                  </OptionHeader>
                  {isSelected && (
                    <ValueInput
                      type='text'
                      placeholder={`Ex: ${optionType === 'Quadra' ? '2' : optionType === 'Lote' ? '10' : optionType === 'Torre' ? 'Nome da Torre' : 'valor'}`}
                      value={existingItem.value || ''}
                      onChange={e => {
                        const index = value.findIndex(
                          item => item.type === optionType
                        );
                        if (index >= 0) {
                          updateItemValue(index, e.target.value);
                        }
                      }}
                      onClick={e => e.stopPropagation()}
                      onFocus={e => e.stopPropagation()}
                    />
                  )}
                </OptionItem>
              );
            })}
          </OptionsList>
        </Dropdown>
      </Container>

      {editingItem && (
        <EditModal onClick={cancelEdit}>
          <EditModalContent onClick={e => e.stopPropagation()}>
            <EditModalTitle>
              Editar {value[editingItem.index]?.type}
            </EditModalTitle>
            <EditModalInput
              type='text'
              value={editingValue}
              onChange={e => setEditingValue(e.target.value)}
              placeholder={`Digite o valor para ${value[editingItem.index]?.type}`}
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  saveEdit();
                } else if (e.key === 'Escape') {
                  cancelEdit();
                }
              }}
            />
            <EditModalActions>
              <EditModalButton $variant='secondary' onClick={cancelEdit}>
                Cancelar
              </EditModalButton>
              <EditModalButton $variant='primary' onClick={saveEdit}>
                Salvar
              </EditModalButton>
            </EditModalActions>
          </EditModalContent>
        </EditModal>
      )}
    </>
  );
};
