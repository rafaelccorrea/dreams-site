import styled from 'styled-components';

export const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const BackgroundKanban = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.background};
  overflow: hidden;
`;

export const SelectionCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(16px);
  position: relative;
  z-index: 1001;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.primary}80,
      ${props => props.theme.colors.primary}
    );
    border-radius: 20px 20px 0 0;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CardSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 8px 0 0 0;
  font-style: italic;
`;

export const CloseButton = styled.button`
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
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

export const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

export const TeamCard = styled.div<{ $isSelected: boolean }>`
  background: ${props =>
    props.$isSelected
      ? `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.primary}80)`
      : props.theme.colors.backgroundSecondary};
  color: ${props => (props.$isSelected ? 'white' : props.theme.colors.text)};
  border: 2px solid
    ${props =>
      props.$isSelected
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 16px;
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
  overflow: visible;
  min-width: 0;
  min-height: 80px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.theme.colors.primary};

    &::before {
      left: 100%;
    }
  }

  ${props =>
    props.$isSelected &&
    `
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props.theme.colors.primary}30;
  `}
`;

export const TeamColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid ${props => props.theme.colors.cardBackground};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`;

export const TeamName = styled.span`
  font-weight: 600;
  font-size: 1rem;
  flex: 1;
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
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0.7;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    opacity: 1;
  }
`;

export const MenuDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  z-index: 1002;
  min-width: 160px;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  backdrop-filter: blur(16px);
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
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const EmptyMessage = styled.p`
  font-size: 1rem;
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

export const CreateTeamButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px ${props => props.theme.colors.primary}30;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.colors.primary}40;
  }
`;

export const RequestAccessButton = styled.button`
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;
