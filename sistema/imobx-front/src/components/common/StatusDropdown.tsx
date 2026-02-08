import React, { useState } from 'react';
import styled from 'styled-components';

interface StatusDropdownProps {
  currentStatus: string;
  competitionId: string;
  onStatusChange: (status: string) => void;
  disabled?: boolean;
}

interface StatusOption {
  value: string;
  label: string;
  color: string;
  icon: string;
}

const statusOptions: StatusOption[] = [
  { value: 'draft', label: 'Rascunho', color: '#6b7280', icon: '📝' },
  { value: 'scheduled', label: 'Agendada', color: '#3b82f6', icon: '📅' },
  { value: 'active', label: 'Ativa', color: '#10b981', icon: '✅' },
  { value: 'finished', label: 'Finalizada', color: '#8b5cf6', icon: '🏁' },
  { value: 'cancelled', label: 'Cancelada', color: '#ef4444', icon: '❌' },
];

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  competitionId,
  onStatusChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = statusOptions.find(opt => opt.value === currentStatus);

  const handleStatusSelect = (newStatus: string) => {
    if (newStatus !== currentStatus) {
      onStatusChange(newStatus);
      setIsOpen(false);
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <DropdownContainer onClick={handleClickOutside}>
      <DropdownButton
        $isOpen={isOpen}
        $color={currentOption?.color}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <StatusIcon>{currentOption?.icon}</StatusIcon>
        <StatusText>{currentOption?.label}</StatusText>
        <DropdownArrow $isOpen={isOpen}>▼</DropdownArrow>
      </DropdownButton>

      {isOpen && !disabled && (
        <DropdownMenu>
          {statusOptions.map(option => (
            <StatusOption
              key={option.value}
              $isCurrent={option.value === currentStatus}
              $color={option.color}
              onClick={() => handleStatusSelect(option.value)}
            >
              <OptionIcon>{option.icon}</OptionIcon>
              <OptionText>{option.label}</OptionText>
              {option.value === currentStatus && <CheckMark>✓</CheckMark>}
            </StatusOption>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button<{ $isOpen: boolean; $color?: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid ${props => props.$color || props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  font-weight: 500;
  min-width: 120px;
  justify-content: space-between;

  &:hover {
    border-color: ${props => props.$color || props.theme.colors.primary};
    background: ${props => props.theme.colors.backgroundSecondary};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  ${props =>
    props.$isOpen &&
    `
    border-color: ${props.$color || props.theme.colors.primary};
    border-radius: 8px 8px 0 0;
    background: ${props.theme.colors.backgroundSecondary};
  `}
`;

const StatusIcon = styled.span`
  font-size: 16px;
`;

const StatusText = styled.span`
  flex: 1;
  text-align: left;
`;

const DropdownArrow = styled.span<{ $isOpen: boolean }>`
  font-size: 10px;
  transition: transform 0.2s;
  ${props => props.$isOpen && 'transform: rotate(180deg);'}
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
`;

const StatusOption = styled.button<{ $isCurrent: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: ${props =>
    props.$isCurrent ? props.$color : props.theme.colors.cardBackground};
  color: ${props => (props.$isCurrent ? 'white' : props.theme.colors.text)};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  text-align: left;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props =>
      props.$isCurrent ? props.$color : props.theme.colors.backgroundSecondary};
    color: ${props => (props.$isCurrent ? 'white' : props.$color)};
  }
`;

const OptionIcon = styled.span`
  font-size: 16px;
`;

const OptionText = styled.span`
  flex: 1;
`;

const CheckMark = styled.span`
  font-size: 14px;
  font-weight: bold;
`;
