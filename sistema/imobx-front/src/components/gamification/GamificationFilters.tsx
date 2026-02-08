import React, { useState } from 'react';
import styled from 'styled-components';
import {
  MdFilterList,
  MdClose,
  MdCalendarToday,
  MdAttachMoney,
} from 'react-icons/md';
import { ScorePeriod, ScorePeriodLabels } from '@/types/gamification.types';

export interface GamificationFiltersType {
  period?: ScorePeriod;
  startDate?: string;
  endDate?: string;
  minPoints?: number;
  maxPoints?: number;
  minSales?: number;
  maxSales?: number;
  minCommission?: number;
  maxCommission?: number;
  teamId?: string;
  userId?: string;
}

interface GamificationFiltersProps {
  filters: GamificationFiltersType;
  onChange: (filters: GamificationFiltersType) => void;
  teams?: Array<{ id: string; name: string }>;
  users?: Array<{ id: string; name: string }>;
}

export const GamificationFilters: React.FC<GamificationFiltersProps> = ({
  filters,
  onChange,
  teams = [],
  users = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    // Se há filtros avançados aplicados, remover o período padrão
    const hasAdvancedFilters = Object.keys(localFilters).some(
      key =>
        key !== 'period' && localFilters[key as keyof GamificationFiltersType]
    );

    const filtersToApply = hasAdvancedFilters
      ? { ...localFilters, period: undefined } // Remove período padrão quando há filtros avançados
      : localFilters;

    onChange(filtersToApply);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters: GamificationFiltersType = {
      period: ScorePeriod.MONTHLY,
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
    setIsOpen(false);
  };

  const updateFilter = (key: keyof GamificationFiltersType, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const activeFiltersCount = Object.keys(filters).filter(
    key => key !== 'period' && filters[key as keyof GamificationFiltersType]
  ).length;

  return (
    <Container>
      <FilterButton
        onClick={() => setIsOpen(!isOpen)}
        $hasFilters={activeFiltersCount > 0}
      >
        <MdFilterList />
        Filtros Avançados
        {activeFiltersCount > 0 && (
          <FilterBadge>{activeFiltersCount}</FilterBadge>
        )}
      </FilterButton>

      {isOpen && (
        <>
          <Overlay onClick={() => setIsOpen(false)} />
          <FilterPanel>
            <PanelHeader>
              <PanelTitle>
                <MdFilterList />
                Filtros de Gamificação
              </PanelTitle>
              <CloseButton onClick={() => setIsOpen(false)}>
                <MdClose />
              </CloseButton>
            </PanelHeader>

            <PanelContent>
              {/* Período Predefinido */}
              <FilterSection>
                <SectionTitle>Período</SectionTitle>
                <Select
                  value={localFilters.period}
                  onChange={e =>
                    updateFilter('period', e.target.value as ScorePeriod)
                  }
                >
                  {Object.entries(ScorePeriodLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FilterSection>

              {/* Data Customizada */}
              <FilterSection>
                <SectionTitle>
                  <MdCalendarToday />
                  Período Personalizado
                </SectionTitle>
                <DateGrid>
                  <DateGroup>
                    <Label>Data Inicial</Label>
                    <DateInput
                      type='date'
                      value={localFilters.startDate || ''}
                      onChange={e => updateFilter('startDate', e.target.value)}
                      placeholder='DD/MM/AAAA'
                    />
                  </DateGroup>
                  <DateGroup>
                    <Label>Data Final</Label>
                    <DateInput
                      type='date'
                      value={localFilters.endDate || ''}
                      onChange={e => updateFilter('endDate', e.target.value)}
                      placeholder='DD/MM/AAAA'
                    />
                  </DateGroup>
                </DateGrid>
                {(localFilters.startDate || localFilters.endDate) && (
                  <HintText>
                    Período personalizado sobrescreve o período predefinido
                  </HintText>
                )}
              </FilterSection>

              {/* Filtros de Pontuação */}
              <FilterSection>
                <SectionTitle>
                  <MdAttachMoney />
                  Faixa de Pontuação
                </SectionTitle>
                <RangeGrid>
                  <RangeGroup>
                    <Label>Pontos Mínimos</Label>
                    <Input
                      type='number'
                      min='0'
                      step='100'
                      value={localFilters.minPoints || ''}
                      onChange={e =>
                        updateFilter(
                          'minPoints',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      placeholder='0'
                    />
                  </RangeGroup>
                  <RangeGroup>
                    <Label>Pontos Máximos</Label>
                    <Input
                      type='number'
                      min='0'
                      step='100'
                      value={localFilters.maxPoints || ''}
                      onChange={e =>
                        updateFilter(
                          'maxPoints',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      placeholder='Ilimitado'
                    />
                  </RangeGroup>
                </RangeGrid>
              </FilterSection>

              {/* Filtros de Vendas */}
              <FilterSection>
                <SectionTitle>Vendas</SectionTitle>
                <RangeGrid>
                  <RangeGroup>
                    <Label>Mínimo de Vendas</Label>
                    <Input
                      type='number'
                      min='0'
                      value={localFilters.minSales || ''}
                      onChange={e =>
                        updateFilter(
                          'minSales',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      placeholder='0'
                    />
                  </RangeGroup>
                  <RangeGroup>
                    <Label>Máximo de Vendas</Label>
                    <Input
                      type='number'
                      min='0'
                      value={localFilters.maxSales || ''}
                      onChange={e =>
                        updateFilter(
                          'maxSales',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      placeholder='Ilimitado'
                    />
                  </RangeGroup>
                </RangeGrid>
              </FilterSection>

              {/* Filtros de Comissão */}
              <FilterSection>
                <SectionTitle>Comissão</SectionTitle>
                <RangeGrid>
                  <RangeGroup>
                    <Label>Comissão Mínima (R$)</Label>
                    <Input
                      type='number'
                      min='0'
                      step='100'
                      value={localFilters.minCommission || ''}
                      onChange={e =>
                        updateFilter(
                          'minCommission',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      placeholder='0,00'
                    />
                  </RangeGroup>
                  <RangeGroup>
                    <Label>Comissão Máxima (R$)</Label>
                    <Input
                      type='number'
                      min='0'
                      step='100'
                      value={localFilters.maxCommission || ''}
                      onChange={e =>
                        updateFilter(
                          'maxCommission',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      placeholder='Ilimitado'
                    />
                  </RangeGroup>
                </RangeGrid>
              </FilterSection>

              {/* Filtro por Equipe */}
              {teams.length > 0 && (
                <FilterSection>
                  <SectionTitle>Equipe</SectionTitle>
                  <Select
                    value={localFilters.teamId || ''}
                    onChange={e =>
                      updateFilter('teamId', e.target.value || undefined)
                    }
                  >
                    <option value=''>Todas as equipes</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </Select>
                </FilterSection>
              )}

              {/* Filtro por Usuário */}
              {users.length > 0 && (
                <FilterSection>
                  <SectionTitle>Usuário Específico</SectionTitle>
                  <Select
                    value={localFilters.userId || ''}
                    onChange={e =>
                      updateFilter('userId', e.target.value || undefined)
                    }
                  >
                    <option value=''>Todos os usuários</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Select>
                </FilterSection>
              )}
            </PanelContent>

            <PanelFooter>
              <ResetButton onClick={handleReset}>Limpar Filtros</ResetButton>
              <ApplyButton onClick={handleApply}>Aplicar Filtros</ApplyButton>
            </PanelFooter>
          </FilterPanel>
        </>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  position: relative;
`;

const FilterButton = styled.button<{ $hasFilters: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: ${props =>
    props.$hasFilters
      ? props.theme.colors.primary
      : props.theme.colors.backgroundSecondary};
  color: ${props => (props.$hasFilters ? '#fff' : props.theme.colors.text)};
  border: 1px solid
    ${props =>
      props.$hasFilters
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  height: 40px;

  svg {
    font-size: 1.125rem;
  }

  &:hover {
    background: ${props =>
      props.$hasFilters
        ? props.theme.colors.primaryDark
        : props.theme.colors.hover};
    transform: translateY(-1px);
  }
`;

const FilterBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const FilterPanel = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translate(-50%, -45%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const PanelTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;

  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.5rem;
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    font-size: 1.5rem;
  }

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
`;

const PanelContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.75rem;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  option {
    background: ${props => props.theme.colors.cardBackground};
    color: ${props => props.theme.colors.text};
  }
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const DateGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
`;

const DateInput = styled.input`
  padding: 0.75rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: ${props => (props.theme.mode === 'dark' ? 'invert(1)' : 'none')};
  }
`;

const RangeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const RangeGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  /* Remove arrows from number input */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const HintText = styled.p`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
`;

const PanelFooter = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ResetButton = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

const ApplyButton = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;
