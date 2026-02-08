import React from 'react';
import styled from 'styled-components';
import { MdClear, MdFilterList } from 'react-icons/md';
import { FilterDrawer } from '../common/FilterDrawer';

type ComparisonMode = 'normal' | 'exclude-shared' | 'manual-assign';

interface CompareTeamsFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ComparisonMode;
  onModeChange: (mode: ComparisonMode) => void;
  hasSharedUsers?: boolean;
  hasData?: boolean;
}

const FilterSection = styled.div`
  margin-bottom: 24px;
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const ModeSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ModeOption = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid
    ${props =>
      props.isActive ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props =>
    props.isActive
      ? props.theme.colors.primary
      : props.theme.colors.cardBackground};
  color: ${props => (props.isActive ? 'white' : props.theme.colors.text)};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props =>
      props.isActive
        ? props.theme.colors.primaryHover
        : props.theme.colors.hover};
  }
`;

const ModeIcon = styled.span`
  font-size: 16px;
`;

const ModeDescription = styled.div`
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
`;

const InfoBox = styled.div`
  background: ${props => props.theme.colors.warningBackground || '#fff3cd'};
  border: 1px solid ${props => props.theme.colors.warningBorder || '#ffeaa7'};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${props => props.theme.colors.warningText || '#856404'};
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.secondaryHover};
  }
`;

const ApplyButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }
`;

export const CompareTeamsFilters: React.FC<CompareTeamsFiltersProps> = ({
  isOpen,
  onClose,
  mode,
  onModeChange,
  hasSharedUsers = false,
  hasData = false,
}) => {
  const handleClearFilters = () => {
    onModeChange('normal');
  };

  const hasActiveFilters = mode !== 'normal';

  const footer = (
    <>
      {hasActiveFilters && (
        <ClearButton onClick={handleClearFilters}>
          <MdClear size={16} />
          Limpar Filtros
        </ClearButton>
      )}
      <ApplyButton onClick={onClose}>Aplicar Filtros</ApplyButton>
    </>
  );

  return (
    <FilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title='Filtros de Comparação'
      footer={footer}
    >
      <FilterSection>
        <FilterLabel>
          <MdFilterList size={16} style={{ marginRight: '8px' }} />
          Modo de Comparação
        </FilterLabel>

        <ModeSelector>
          <ModeOption
            isActive={mode === 'normal'}
            onClick={() => onModeChange('normal')}
          >
            <ModeIcon>📊</ModeIcon>
            <div>
              <div>Comparação Normal</div>
              <ModeDescription>
                Inclui todos os usuários, mesmo os compartilhados entre times
              </ModeDescription>
            </div>
          </ModeOption>

          <ModeOption
            isActive={mode === 'exclude-shared'}
            onClick={() => onModeChange('exclude-shared')}
          >
            <ModeIcon>🚫</ModeIcon>
            <div>
              <div>Excluir Compartilhados</div>
              <ModeDescription>
                Remove usuários que estão em múltiplos times da comparação
              </ModeDescription>
            </div>
          </ModeOption>

          <ModeOption
            isActive={mode === 'manual-assign'}
            onClick={() => onModeChange('manual-assign')}
            disabled={!hasData || !hasSharedUsers}
          >
            <ModeIcon>🎯</ModeIcon>
            <div>
              <div>Atribuição Manual</div>
              <ModeDescription>
                Permite atribuir usuários compartilhados a times específicos
              </ModeDescription>
            </div>
          </ModeOption>
        </ModeSelector>

        {mode === 'manual-assign' && !hasSharedUsers && hasData && (
          <InfoBox>
            <InfoText>
              ℹ️ Nenhum usuário compartilhado encontrado. Este modo só está
              disponível quando há usuários em múltiplos times.
            </InfoText>
          </InfoBox>
        )}

        {mode === 'manual-assign' && !hasData && (
          <InfoBox>
            <InfoText>
              ℹ️ Faça uma comparação primeiro para detectar usuários
              compartilhados e habilitar este modo.
            </InfoText>
          </InfoBox>
        )}
      </FilterSection>
    </FilterDrawer>
  );
};
