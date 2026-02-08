import styled from 'styled-components';

// Layout Components
export const PageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 24px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const PageContent = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

export const PageHeader = styled.div`
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
    gap: 16px;
  }
`;

export const PageTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 2rem;
    justify-content: center;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const PageSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
    text-align: center;
  }
`;

// Tabs
export const TabsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

export const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 24px;
  background: none;
  border: none;
  color: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  font-weight: ${props => (props.$active ? '600' : '400')};
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 2px solid
    ${props => (props.$active ? props.theme.colors.primary : 'transparent')};
  margin-bottom: -2px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 8px 16px;
  }
`;

// Cards
export const ContentCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 1px 3px rgba(0, 0, 0, 0.3)'
      : '0 1px 3px rgba(0, 0, 0, 0.1)'};

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const HierarchyGrid = styled.div`
  display: grid;
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

export const ManagerCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}15;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ManagerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const ManagerAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

export const ManagerInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ManagerName = styled.h3`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const ManagerEmail = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

export const ManagedUsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 8px;
  }
`;

export const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 6px 10px;
    gap: 6px;
  }
`;

export const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary}40;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    font-size: 0.625rem;
  }
`;

// Empty State
export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 768px) {
    padding: 32px 16px;
  }
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const EmptyStateDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

// Assign Manager Section
export const AssignSection = styled.div`
  margin-top: 32px;

  @media (max-width: 768px) {
    margin-top: 24px;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 10px;
  }
`;

export const CheckboxGroup = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 12px;

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

export const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  @media (max-width: 768px) {
    padding: 10px;
    gap: 10px;
  }
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary};
`;

export const CheckboxUserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CheckboxUserName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export const CheckboxUserEmail = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 10px 14px 10px 36px;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
`;

// Buttons
export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  background: ${props =>
    props.$variant === 'secondary'
      ? props.theme.colors.backgroundSecondary
      : props.theme.colors.primary};
  color: ${props =>
    props.$variant === 'secondary' ? props.theme.colors.text : 'white'};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 10px 20px;
    gap: 6px;
  }
`;

export const SelectionInfo = styled.p`
  margin-top: 16px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

// Access Denied
export const AccessDenied = styled.div`
  text-align: center;
  padding: 48px 24px;

  @media (max-width: 768px) {
    padding: 32px 16px;
  }
`;

export const AccessDeniedIcon = styled.div`
  font-size: 4rem;
  color: ${props => props.theme.colors.error || '#dc2626'};
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

export const AccessDeniedText = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const AccessDeniedSubtext = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-size: 0.875rem;
`;

export const InfoText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export const InfoTipBox = styled.div<{ $role?: string }>`
  margin-bottom: 16px;
  padding: 12px;
  background: ${props => {
    if (props.$role === 'admin') {
      return props.theme.mode === 'dark'
        ? props.theme.colors.infoBackground
        : `${props.theme.colors.purple}10`;
    }
    return props.theme.mode === 'dark'
      ? props.theme.colors.errorBackground
      : `${props.theme.colors.error}10`;
  }};
  border: 1px solid
    ${props => {
      if (props.$role === 'admin') {
        return props.theme.mode === 'dark'
          ? props.theme.colors.infoBorder
          : `${props.theme.colors.purple}40`;
      }
      return props.theme.mode === 'dark'
        ? props.theme.colors.errorBorder
        : `${props.theme.colors.error}40`;
    }};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};

  strong {
    color: ${props => props.theme.colors.text};
  }
`;

export const WarningBox = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.warningBackground};
  border: 1px solid ${props => props.theme.colors.warningBorder};
  border-radius: 8px;
  color: ${props => props.theme.colors.warningText};

  small {
    color: ${props => props.theme.colors.warningText};
    opacity: 0.9;
  }
`;

// Tree View Components
export const TreeContainer = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const TreeNode = styled.div<{ $level: number }>`
  position: relative;
  margin-bottom: ${props => (props.$level === 0 ? '24px' : '12px')};

  @media (max-width: 768px) {
    margin-bottom: ${props => (props.$level === 0 ? '16px' : '8px')};
  }
`;

export const TreeNodeChildren = styled.div`
  margin-left: 40px;
  margin-top: 12px;
  padding-left: 20px;
  border-left: 3px solid ${props => props.theme.colors.border};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -3px;
    top: 0;
    width: 3px;
    height: 20px;
    background: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    margin-left: 20px;
    padding-left: 12px;
    border-left-width: 2px;

    &::before {
      left: -2px;
      width: 2px;
    }
  }
`;

export const TreeNodeContent = styled.div<{ $role: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: ${props => {
    const isDark = props.theme.mode === 'dark';
    const roleColors: Record<string, string> = {
      master: isDark
        ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)'
        : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      admin: isDark
        ? 'linear-gradient(135deg, #581c87 0%, #6b21a8 100%)'
        : 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
      manager: isDark
        ? 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)'
        : 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      user: isDark
        ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
        : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    };
    return roleColors[props.$role] || props.theme.colors.background;
  }};
  border: 2px solid
    ${props => {
      const roleColors: Record<string, string> = {
        master: props.theme.mode === 'dark' ? '#ef4444' : '#dc2626',
        admin: props.theme.mode === 'dark' ? '#a78bfa' : '#7c3aed',
        manager: props.theme.mode === 'dark' ? '#34d399' : '#10b981',
        user: props.theme.mode === 'dark' ? '#60a5fa' : '#3b82f6',
      };
      return roleColors[props.$role] || props.theme.colors.border;
    }};
  border-radius: 12px;
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 2px 8px rgba(0, 0, 0, 0.3)'
      : '0 2px 8px rgba(0, 0, 0, 0.08)'};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background: ${props => {
      const roleColors: Record<string, string> = {
        master: props.theme.mode === 'dark' ? '#ef4444' : '#dc2626',
        admin: props.theme.mode === 'dark' ? '#a78bfa' : '#7c3aed',
        manager: props.theme.mode === 'dark' ? '#34d399' : '#10b981',
        user: props.theme.mode === 'dark' ? '#60a5fa' : '#3b82f6',
      };
      return roleColors[props.$role] || props.theme.colors.border;
    }};
    border-radius: 12px 0 0 12px;
  }

  &:hover {
    box-shadow: ${props =>
      props.theme.mode === 'dark'
        ? '0 6px 20px rgba(0, 0, 0, 0.5)'
        : '0 6px 20px rgba(0, 0, 0, 0.15)'};
    transform: translateY(-2px);
    border-color: ${props => {
      const roleColors: Record<string, string> = {
        master: props.theme.mode === 'dark' ? '#f87171' : '#b91c1c',
        admin: props.theme.mode === 'dark' ? '#c4b5fd' : '#6d28d9',
        manager: props.theme.mode === 'dark' ? '#6ee7b7' : '#059669',
        user: props.theme.mode === 'dark' ? '#93c5fd' : '#2563eb',
      };
      return roleColors[props.$role] || props.theme.colors.primary;
    }};
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    gap: 8px;
  }
`;

export const ExpandButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  color: ${props => props.theme.colors.text};

  &:hover {
    transform: scale(1.2);
  }
`;

export const RoleBadge = styled.span<{ $role: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  ${props => {
    const isDark = props.theme.mode === 'dark';
    const roleStyles: Record<string, string> = {
      master: isDark
        ? 'background: #7f1d1d60; color: #fca5a5; border: 1px solid #ef444460;'
        : 'background: #dc262620; color: #dc2626; border: 1px solid #dc262640;',
      admin: isDark
        ? 'background: #581c8760; color: #c4b5fd; border: 1px solid #a78bfa60;'
        : 'background: #7c3aed20; color: #7c3aed; border: 1px solid #7c3aed40;',
      manager: isDark
        ? 'background: #064e3b60; color: #6ee7b7; border: 1px solid #34d39960;'
        : 'background: #10b98120; color: #10b981; border: 1px solid #10b98140;',
      user: isDark
        ? 'background: #1e3a8a60; color: #93c5fd; border: 1px solid #60a5fa60;'
        : 'background: #3b82f620; color: #3b82f6; border: 1px solid #3b82f640;',
    };
    return roleStyles[props.$role] || roleStyles.user;
  }}

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 3px 8px;
  }
`;

export const TreeNodeInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TreeNodeName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

export const TreeNodeEmail = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

export const CountBadge = styled.span`
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;
