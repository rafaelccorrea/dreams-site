import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdFilterList,
  MdClear,
  MdSearch,
  MdPerson,
  MdLabel,
  MdCheck,
  MdClose,
  MdColorLens,
  MdAdminPanelSettings,
} from 'react-icons/md';
import type { TeamFilters } from '@/types/team';
import { useDebounce } from '@/hooks/useDebounce';

// Componentes estilizados do modal
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  transform: ${props => (props.$isOpen ? 'scale(1)' : 'scale(0.95)')};
  transition: transform 0.3s ease;
`;

const ModalHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 32px;
  max-height: calc(90vh - 140px);
  overflow-y: auto;
`;

const FilterSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FilterInput = styled.input`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: 12px;
  margin-top: 8px;
`;

const ColorOption = styled.button<{ $color: string; $isSelected: boolean }>`
  width: 40px;
  height: 40px;
  border: 3px solid
    ${props => (props.$isSelected ? props.theme.colors.primary : 'transparent')};
  border-radius: 50%;
  background: ${props => props.$color};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  ${props =>
    props.$isSelected &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  `}
`;

const ModalFooter = styled.div`
  padding: 24px 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const FooterLeft = styled.div`
  display: flex;
  gap: 12px;
`;

const FooterRight = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark || props.theme.colors.primary} 100%);
          color: white;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(28, 78, 255, 0.3);
          }
        `;
      case 'danger':
        return `
          background: transparent;
          color: #DC2626;
          border: 1px solid #DC2626;
          
          &:hover {
            background: #DC2626;
            color: white;
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background: ${props.theme.colors.cardBackground};
          color: ${props.theme.colors.text};
          border: 1px solid ${props.theme.colors.border};
          
          &:hover {
            border-color: ${props.theme.colors.primary};
            color: ${props.theme.colors.primary};
            transform: translateY(-1px);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const ActiveFiltersCount = styled.div`
  background: ${props => props.theme.colors.primary};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
`;

interface TeamFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TeamFilters;
  onFiltersChange: (filters: TeamFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  availableColors: string[];
}

export const TeamFiltersModal: React.FC<TeamFiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  availableColors,
}) => {
  const [tempFilters, setTempFilters] = useState<TeamFilters>(filters);

  // Estados locais para campos de texto com debounce
  const [teamNameInput, setTeamNameInput] = useState(filters.teamName || '');
  const [memberNameInput, setMemberNameInput] = useState(
    filters.memberName || ''
  );
  const [tagInput, setTagInput] = useState(filters.tag || '');

  // Aplicar debounce (500ms, mínimo 3 caracteres)
  const debouncedTeamName = useDebounce(teamNameInput, 500, 3);
  const debouncedMemberName = useDebounce(memberNameInput, 500, 3);
  const debouncedTag = useDebounce(tagInput, 500, 3);

  // Sincronizar valores debounced com os filtros temporários
  useEffect(() => {
    if (teamNameInput.length >= 3 || teamNameInput.length === 0) {
      handleFilterChange('teamName', debouncedTeamName);
    }
  }, [debouncedTeamName]);

  useEffect(() => {
    if (memberNameInput.length >= 3 || memberNameInput.length === 0) {
      handleFilterChange('memberName', debouncedMemberName);
    }
  }, [debouncedMemberName]);

  useEffect(() => {
    if (tagInput.length >= 3 || tagInput.length === 0) {
      handleFilterChange('tag', debouncedTag);
    }
  }, [debouncedTag]);

  // Sincronizar com mudanças externas nos filtros
  useEffect(() => {
    setTeamNameInput(filters.teamName || '');
  }, [filters.teamName]);

  useEffect(() => {
    setMemberNameInput(filters.memberName || '');
  }, [filters.memberName]);

  useEffect(() => {
    setTagInput(filters.tag || '');
  }, [filters.tag]);

  const handleFilterChange = (key: keyof TeamFilters, value: any) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value || '',
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    onApplyFilters();
    onClose();
  };

  const handleClearFilters = () => {
    setTeamNameInput('');
    setMemberNameInput('');
    setTagInput('');
    const clearedFilters: TeamFilters = {
      teamName: '',
      memberName: '',
      tag: '',
      status: '',
      color: '',
      dateRange: '',
    };
    setTempFilters(clearedFilters);
    onClearFilters();
    onClose();
  };

  const handleClose = () => {
    setTempFilters(filters); // Reset to original filters
    onClose();
  };

  const activeFiltersCount = Object.values(tempFilters).filter(
    value => value !== undefined && value !== ''
  ).length;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContainer $isOpen={isOpen} onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdFilterList />
            Filtros de Equipes
            {activeFiltersCount > 0 && (
              <ActiveFiltersCount>{activeFiltersCount}</ActiveFiltersCount>
            )}
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Filtros de Busca */}
          <FilterSection>
            <SectionHeader>
              <SectionTitle>
                <MdSearch />
                Filtros de Busca
              </SectionTitle>
              <SectionDescription>
                Filtre equipes por nome, membros e tags
              </SectionDescription>
            </SectionHeader>

            <FiltersGrid>
              <FilterGroup>
                <FilterLabel htmlFor='teamName'>
                  <MdPerson />
                  Nome da Equipe
                  {teamNameInput.length > 0 && teamNameInput.length < 3 && (
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
                  id='teamName'
                  type='text'
                  placeholder='Buscar por nome... (mín. 3 caracteres)'
                  value={teamNameInput}
                  onChange={e => setTeamNameInput(e.target.value)}
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel htmlFor='memberName'>
                  <MdPerson />
                  Membro da Equipe
                  {memberNameInput.length > 0 && memberNameInput.length < 3 && (
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
                  id='memberName'
                  type='text'
                  placeholder='Nome do membro... (mín. 3 caracteres)'
                  value={memberNameInput}
                  onChange={e => setMemberNameInput(e.target.value)}
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel htmlFor='tag'>
                  <MdLabel />
                  Tag ou Categoria
                  {tagInput.length > 0 && tagInput.length < 3 && (
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
                  id='tag'
                  type='text'
                  placeholder='Tag, categoria... (mín. 3 caracteres)'
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel htmlFor='status'>
                  <MdAdminPanelSettings />
                  Status
                </FilterLabel>
                <FilterSelect
                  id='status'
                  value={tempFilters.status || ''}
                  onChange={e => handleFilterChange('status', e.target.value)}
                >
                  <option value=''>Todos os status</option>
                  <option value='active'>Ativo</option>
                  <option value='inactive'>Inativo</option>
                  <option value='archived'>Arquivado</option>
                </FilterSelect>
              </FilterGroup>
            </FiltersGrid>
          </FilterSection>

          {/* Filtros por Cor */}
          <FilterSection>
            <SectionHeader>
              <SectionTitle>
                <MdColorLens />
                Filtros por Cor
              </SectionTitle>
              <SectionDescription>
                Selecione uma cor para filtrar as equipes
              </SectionDescription>
            </SectionHeader>

            <ColorGrid>
              <ColorOption
                $color='transparent'
                $isSelected={!tempFilters.color}
                onClick={() => handleFilterChange('color', '')}
                title='Todas as cores'
              />
              {availableColors.map(color => (
                <ColorOption
                  key={color}
                  $color={color}
                  $isSelected={tempFilters.color === color}
                  onClick={() => handleFilterChange('color', color)}
                  title={color}
                />
              ))}
            </ColorGrid>
          </FilterSection>
        </ModalBody>

        <ModalFooter>
          <FooterLeft>
            {activeFiltersCount > 0 && (
              <Button $variant='danger' onClick={handleClearFilters}>
                <MdClear />
                Limpar Filtros
              </Button>
            )}
          </FooterLeft>
          <FooterRight>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button $variant='primary' onClick={handleApplyFilters}>
              <MdCheck />
              Aplicar Filtros
            </Button>
          </FooterRight>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};
