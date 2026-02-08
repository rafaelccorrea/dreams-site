import styled from 'styled-components';

export const TeamSelectorContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
`;

export const TeamSelectorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const TeamSelectorTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TeamSelectorActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const CreateTeamButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;

export const RequestAccessButton = styled.button`
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

export const TeamsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const TeamCard = styled.div<{ $isSelected: boolean }>`
  background: ${props =>
    props.$isSelected
      ? props.theme.colors.primary
      : props.theme.colors.backgroundSecondary};
  color: ${props => (props.$isSelected ? 'white' : props.theme.colors.text)};
  border: 1px solid
    ${props =>
      props.$isSelected
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 160px;
  position: relative;
  overflow: visible;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const TeamColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 1px solid ${props => props.theme.colors.border};
`;

export const TeamName = styled.span`
  font-weight: 500;
  font-size: 0.875rem;
`;

export const TeamMenu = styled.div`
  position: relative;
  margin-left: auto;
`;

export const MenuButton = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const MenuDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 160px;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
`;

export const MenuItem = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 12px 16px;
  text-align: left;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const EmptyMessage = styled.p`
  font-size: 0.875rem;
  margin: 0 0 16px 0;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;
