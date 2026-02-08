import React from 'react';
import styled from 'styled-components';

type ComparisonMode = 'normal' | 'exclude-shared' | 'manual-assign';

interface ComparisonModeSelectorProps {
  mode: ComparisonMode;
  onChange: (mode: ComparisonMode) => void;
  disabled?: boolean;
}

const ToggleGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const ToggleButton = styled.button<{ isActive: boolean; disabled?: boolean }>`
  padding: 8px 16px;
  border: 1px solid
    ${props =>
      props.isActive ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props =>
    props.isActive
      ? props.theme.colors.primary
      : props.theme.colors.cardBackground};
  color: ${props => (props.isActive ? 'white' : props.theme.colors.text)};
  border-radius: 6px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? 0.6 : 1)};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props =>
      props.isActive
        ? props.theme.colors.primaryHover
        : props.theme.colors.hover};
    border-color: ${props =>
      props.isActive
        ? props.theme.colors.primaryHover
        : props.theme.colors.borderHover};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const ComparisonModeSelector: React.FC<ComparisonModeSelectorProps> = ({
  mode,
  onChange,
  disabled = false,
}) => {
  const modes: { value: ComparisonMode; label: string; icon: string }[] = [
    { value: 'normal', label: 'Normal', icon: '📊' },
    { value: 'exclude-shared', label: 'Excluir Compartilhados', icon: '🚫' },
    { value: 'manual-assign', label: 'Atribuição Manual', icon: '🎯' },
  ];

  return (
    <ToggleGroup>
      {modes.map(({ value, label, icon }) => (
        <ToggleButton
          key={value}
          isActive={mode === value}
          disabled={disabled}
          onClick={() => !disabled && onChange(value)}
        >
          {icon} {label}
        </ToggleButton>
      ))}
    </ToggleGroup>
  );
};
