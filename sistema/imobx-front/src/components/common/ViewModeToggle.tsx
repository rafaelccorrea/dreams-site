import React from 'react';
import styled from 'styled-components';
import { MdViewList, MdViewModule } from 'react-icons/md';
import type { ViewMode } from '../../types/viewMode';

interface ViewModeToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
}

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 4px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  background: ${props =>
    props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props =>
    props.$active ? 'white' : props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 18px;
  position: relative;
  z-index: 1;

  &:hover {
    background: ${props =>
      props.$active
        ? props.theme.colors.primaryDark
        : props.theme.colors.background};
    color: ${props => (props.$active ? 'white' : props.theme.colors.text)};
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}40;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Label = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-right: 4px;
`;

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  currentMode,
  onModeChange,
  className,
}) => {
  return (
    <ToggleContainer className={className}>
      <Label>Visualização:</Label>
      <ToggleButton
        $active={currentMode === 'list'}
        onClick={() => onModeChange('list')}
        title='Visualização em lista'
      >
        <MdViewList />
      </ToggleButton>
      <ToggleButton
        $active={currentMode === 'cards'}
        onClick={() => onModeChange('cards')}
        title='Visualização em cards'
      >
        <MdViewModule />
      </ToggleButton>
    </ToggleContainer>
  );
};
