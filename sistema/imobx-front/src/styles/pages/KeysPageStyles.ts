import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};

  @media (max-width: 1024px) {
    padding: 20px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const PageContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 1024px) {
    gap: 28px;
  }

  @media (max-width: 768px) {
    gap: 24px;
  }

  @media (max-width: 480px) {
    gap: 20px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
    padding-bottom: 16px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;
    padding-bottom: 12px;
    gap: 10px;
  }
`;

export const PageTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => (props.theme.mode === 'light' ? '#6B7280' : '#FFFFFF')};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: 400;

  @media (max-width: 1024px) {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

export const CreateButton = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px ${props => props.theme.colors.primary}25;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 14px 20px;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 0.9rem;
    border-radius: 10px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.colors.primary}35;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 20px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid ${props => props.theme.colors.border};
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 1024px) {
    padding: 16px;
    margin-bottom: 20px;
    border-radius: 14px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 14px;
    margin-bottom: 16px;
    border-radius: 12px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 10px;
    gap: 10px;
  }
`;

export const LeftActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

export const RightActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  width: 300px;
  padding: 12px 16px 12px 44px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 14px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    width: 250px;
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 16px; /* Prevent iOS zoom */
    min-height: 44px;
    padding: 12px 14px 12px 42px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px 10px 40px;
    font-size: 16px;
    border-radius: 10px;
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary}50;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 18px;
  pointer-events: none;

  @media (max-width: 768px) {
    left: 12px;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    left: 10px;
    font-size: 15px;
  }
`;

export const FilterToggle = styled.button`
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  white-space: nowrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 12px 14px;
    min-height: 44px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 13px;
    border-radius: 10px;
  }

  &:hover {
    background: ${props => props.theme.colors.primary}10;
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

export const CounterBadge = styled.div`
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
  margin-left: 8px;

  @media (max-width: 480px) {
    padding: 3px 6px;
    font-size: 11px;
    min-width: 18px;
    margin-left: 6px;
    border-radius: 10px;
  }
`;

export const ViewControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 6px;
  }

  @media (max-width: 480px) {
    gap: 4px;
    width: 100%;
    justify-content: space-between;
  }
`;

export const ViewLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  padding: 4px;
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 480px) {
    padding: 3px;
    border-radius: 6px;
  }
`;

export const ViewButton = styled.button<{ $active?: boolean }>`
  background: ${props =>
    props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props =>
    props.$active ? 'white' : props.theme.colors.textSecondary};
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    padding: 7px 10px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    font-size: 12px;
    border-radius: 5px;
  }

  &:hover {
    background: ${props =>
      props.$active
        ? props.theme.colors.primary
        : props.theme.colors.primary}20;
    color: ${props => (props.$active ? 'white' : props.theme.colors.primary)};
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const StatCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 28px;
  padding: 32px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  background: linear-gradient(
    145deg,
    ${props => props.theme.colors.cardBackground} 0%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 16px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(
      135deg,
      ${props => props.theme.colors.primary} 0%,
      ${props => props.theme.colors.primaryDark} 50%,
      #6366f1 100%
    );
    border-radius: 28px 28px 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(255, 255, 255, 0.03) 100%
    );
    pointer-events: none;
    border-radius: 28px;
  }

  &:hover {
    transform: translateY(-12px) scale(1.03);
    box-shadow:
      0 4px 6px rgba(0, 0, 0, 0.05),
      0 25px 50px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.theme.colors.primary}40;
  }

  &:active {
    transform: translateY(-6px) scale(1.01);
  }
`;

export const StatLabel = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    margin-bottom: 10px;
  }

  @media (max-width: 480px) {
    font-size: 0.8125rem;
    margin-bottom: 8px;
  }
`;

export const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  line-height: 1;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const StatHelp = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  opacity: 0.9;
  font-weight: 500;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

export const TabsContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;

  @media (max-width: 768px) {
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    border-radius: 12px;
  }
`;

export const TabsHeader = styled.div`
  display: flex;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const TabButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 16px 24px;
  background: ${props =>
    props.$active ? props.theme.colors.cardBackground : 'transparent'};
  color: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  border: none;
  font-size: 1rem;
  font-weight: ${props => (props.$active ? '600' : '500')};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 0.9rem;
    gap: 6px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.85rem;
    gap: 4px;
  }

  ${props =>
    props.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
    }
  `}

  &:hover {
    background: ${props =>
      props.$active
        ? props.theme.colors.cardBackground
        : props.theme.colors.primary}10;
    color: ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.primary};
  }
`;

export const TabsContent = styled.div`
  padding: 32px;

  @media (max-width: 1024px) {
    padding: 24px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

export const KeysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 28px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (max-width: 480px) {
    gap: 16px;
  }

  @media (min-width: 1400px) {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 32px;
  }
`;

export const KeyCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  padding: 28px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  background: linear-gradient(
    145deg,
    ${props => props.theme.colors.cardBackground} 0%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 16px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(
      135deg,
      ${props => props.theme.colors.primary} 0%,
      ${props => props.theme.colors.primaryDark} 50%,
      #6366f1 100%
    );
    border-radius: 24px 24px 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(255, 255, 255, 0.02) 100%
    );
    pointer-events: none;
    border-radius: 24px;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow:
      0 4px 6px rgba(0, 0, 0, 0.05),
      0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.theme.colors.primary}40;
  }

  &:active {
    transform: translateY(-4px) scale(1.01);
  }
`;

export const KeyCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  gap: 12px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 12px;
    gap: 8px;
  }
`;

export const KeyCardTitle = styled.h3`
  font-size: 1.375rem;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    gap: 10px;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
    gap: 8px;
  }

  svg {
    font-size: 1.5rem;
    color: ${props => props.theme.colors.primary};
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));

    @media (max-width: 768px) {
      font-size: 1.375rem;
    }

    @media (max-width: 480px) {
      font-size: 1.25rem;
    }
  }
`;

export const KeyCardActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 10px;
    margin-top: 16px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }
`;

export const KeyCardAdminActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
  justify-content: flex-end;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 6px;
    margin-top: 12px;
    padding-top: 12px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 6px;
    margin-top: 10px;
    padding-top: 10px;
  }
`;

export const KeyCardPropertyHighlight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}10,
    ${props => props.theme.colors.primary}05
  );
  padding: 20px;
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.primary}20;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
    margin-bottom: 16px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 14px;
    gap: 10px;
    margin-bottom: 12px;
    border-radius: 10px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.primaryDark}
    );
  }
`;

export const PropertyIcon = styled.div`
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const PropertyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const PropertyTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
  }
`;

export const PropertyType = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  letter-spacing: 0.5px;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 9px 14px;
    font-size: 0.8125rem;
    gap: 6px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
    padding: 10px 12px;
    font-size: 0.8125rem;
    min-height: 40px;
    border-radius: 8px;
  }

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
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
        color: white;
        box-shadow: 0 4px 15px ${props.theme.colors.primary}25;
        
        &:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px ${props.theme.colors.primary}35;
        }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.error} 0%, #dc2626 100%);
        color: white;
        box-shadow: 0 4px 15px ${props.theme.colors.error}25;
        
        &:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px ${props.theme.colors.error}35;
        }
      `;
    } else {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.backgroundSecondary} 0%, ${props.theme.colors.cardBackground} 100%);
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        
        &:hover {
          background: linear-gradient(135deg, ${props.theme.colors.primary}10, ${props.theme.colors.primary}20);
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-1px) scale(1.02);
          box-shadow: 0 4px 12px ${props.theme.colors.primary}20;
        }
      `;
    }
  }}

  &:active {
    transform: translateY(0) scale(1);
  }
`;

export const KeyCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const KeyCardInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

export const KeyCardProperty = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.backgroundSecondary} 0%,
    ${props => props.theme.colors.cardBackground} 100%
  );
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary}20,
      ${props => props.theme.colors.primaryDark}20
    );
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: ${props => props.theme.colors.primary}30;
  }
`;

export const KeyCardBadges = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 4px;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    margin-top: 2px;
  }
`;

export const KeyCardBadge = styled.span<{ $status?: string }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.75rem;
    gap: 4px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 0.6875rem;
    letter-spacing: 0.5px;
    border-radius: 12px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.15;
    background: currentColor;
    border-radius: inherit;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::after {
    left: 100%;
  }

  ${props => {
    switch (props.$status) {
      case 'available':
        return `
          background: linear-gradient(135deg, ${props.theme.colors.success}20, ${props.theme.colors.success}30);
          color: ${props.theme.colors.success};
          border: 1px solid ${props.theme.colors.success}50;
          box-shadow: 0 4px 12px ${props.theme.colors.success}25;
        `;
      case 'in_use':
        return `
          background: linear-gradient(135deg, ${props.theme.colors.warning}20, ${props.theme.colors.warning}30);
          color: ${props.theme.colors.warning};
          border: 1px solid ${props.theme.colors.warning}50;
          box-shadow: 0 4px 12px ${props.theme.colors.warning}25;
        `;
      case 'overdue':
        return `
          background: linear-gradient(135deg, ${props.theme.colors.error}20, ${props.theme.colors.error}30);
          color: ${props.theme.colors.error};
          border: 1px solid ${props.theme.colors.error}50;
          box-shadow: 0 4px 12px ${props.theme.colors.error}25;
        `;
      case 'lost':
        return `
          background: linear-gradient(135deg, ${props.theme.colors.error}15, ${props.theme.colors.error}25);
          color: ${props.theme.colors.error};
          border: 1px solid ${props.theme.colors.error}40;
          box-shadow: 0 2px 8px ${props.theme.colors.error}20;
        `;
      case 'damaged':
        return `
          background: linear-gradient(135deg, ${props.theme.colors.error}15, ${props.theme.colors.error}25);
          color: ${props.theme.colors.error};
          border: 1px solid ${props.theme.colors.error}40;
          box-shadow: 0 2px 8px ${props.theme.colors.error}20;
        `;
      case 'maintenance':
        return `
          background: linear-gradient(135deg, ${props.theme.colors.info}15, ${props.theme.colors.info}25);
          color: ${props.theme.colors.info};
          border: 1px solid ${props.theme.colors.info}40;
          box-shadow: 0 2px 8px ${props.theme.colors.info}20;
        `;
      case 'info':
        return `
          background: linear-gradient(135deg, ${props.theme.colors.primary}15, ${props.theme.colors.primary}25);
          color: ${props.theme.colors.primary};
          border: 1px solid ${props.theme.colors.primary}40;
          box-shadow: 0 2px 8px ${props.theme.colors.primary}20;
        `;
      default:
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.textSecondary};
          border: 1px solid ${props.theme.colors.border};
        `;
    }
  }}
`;

export const KeyCardDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

export const KeyCardLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;

  @media (max-width: 480px) {
    font-size: 0.8125rem;
    gap: 6px;
  }
`;

export const KeyCardAction = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 0.8125rem;
    gap: 6px;
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.8125rem;
    min-height: 40px;
    border-radius: 6px;
  }

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}30;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

export const AlertContainer = styled.div`
  background: ${props => props.theme.colors.warning}20;
  border: 1px solid ${props => props.theme.colors.warning}30;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  @media (max-width: 768px) {
    padding: 14px;
    margin-bottom: 20px;
    gap: 10px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 16px;
    gap: 8px;
    border-radius: 8px;
    flex-direction: column;
  }
`;

export const AlertTitle = styled.h4`
  color: ${props => props.theme.colors.warning};
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

export const AlertMessage = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 48px 16px;
  }

  @media (max-width: 480px) {
    padding: 40px 12px;
  }
`;

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;

  @media (max-width: 768px) {
    font-size: 3.5rem;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    font-size: 3rem;
    margin-bottom: 10px;
  }
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

export const EmptyStateMessage = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  font-size: 1rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    margin-bottom: 16px;
  }
`;

export const EmptyStateAction = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9375rem;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 16px;
    font-size: 0.875rem;
    border-radius: 8px;
    justify-content: center;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.theme.colors.primary}30;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px 20px;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px 20px;
  text-align: center;
`;

export const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.error};
  margin: 0 0 12px 0;
`;

export const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

export const RetryButton = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.theme.colors.primary}30;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const PrimaryButton = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px ${props => props.theme.colors.primary}25;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.colors.primary}35;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

export const SecondaryButton = styled.button`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.theme.colors.primary}10;
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}15;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

// Responsive adjustments
export const ResponsiveContainer = styled.div`
  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;
