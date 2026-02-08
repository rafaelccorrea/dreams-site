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
  color: ${props => (props.theme.mode === 'light' ? '#6B7280' : '#FFFFFF')};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center;
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

export const CreateButton = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${props => props.theme.colors.primary}25;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.colors.primary}35;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 14px 20px;
  }
`;

// Summary Cards
export const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const SummaryCard = styled.div<{
  $type?: 'total' | 'active' | 'inactive' | 'admin';
}>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  padding: 28px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.08)'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      switch (props.$type) {
        case 'total':
          return 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)';
        case 'active':
          return 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
        case 'inactive':
          return 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)';
        case 'admin':
          return 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
        default:
          return 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)';
      }
    }};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.4)'
          : 'rgba(0, 0, 0, 0.12)'};
  }

  &:active {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

export const SummaryIcon = styled.div<{
  $type?: 'total' | 'active' | 'inactive' | 'admin';
}>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 16px;
  background: ${props => {
    switch (props.$type) {
      case 'total':
        return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'active':
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'inactive':
        return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
      case 'admin':
        return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      default:
        return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  }};
  color: white;
  box-shadow: 0 4px 15px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.15)'};

  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
    margin-bottom: 12px;
  }
`;

export const SummaryValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  line-height: 1.2;

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const SummaryLabel = styled.div`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

// Actions Bar
export const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 20px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.08)'};
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    margin-bottom: 24px;
  }
`;

export const LeftActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 0.95rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)'};

  &:hover {
    border-color: ${props => props.theme.colors.primary}50;
    box-shadow: 0 4px 12px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.08)'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.2rem;
  pointer-events: none;
`;

export const FilterToggle = styled.button<{ $hasActiveFilters?: boolean }>`
  background: ${props =>
    props.$hasActiveFilters
      ? props.theme.colors.primary
      : props.theme.colors.background};
  color: ${props =>
    props.$hasActiveFilters ? 'white' : props.theme.colors.text};
  border: 2px solid
    ${props =>
      props.$hasActiveFilters
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  position: relative;
  min-width: 120px;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}25;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

export const CounterBadge = styled.span`
  background: ${props => props.theme.colors.primaryDark};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  position: absolute;
  top: -8px;
  right: -8px;
`;

// Users Table/Cards
export const UsersCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.08)'};
  overflow: visible;

  @media (max-width: 768px) {
    border-radius: 16px;
  }
`;

export const UsersTable = styled.div`
  width: 100%;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 0.8fr 1fr 1fr 80px;
  gap: 12px;
  padding: 20px 24px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;

  @media (max-width: 1400px) {
    grid-template-columns: 2fr 0.9fr 0.7fr 0.9fr 0.9fr 70px;
    gap: 10px;
    padding: 16px 20px;
    font-size: 0.85rem;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 2fr 0.8fr 0.6fr 0.8fr 0.8fr 60px;
    gap: 8px;
    padding: 14px 16px;
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const TableRow = styled.div<{ $isEven?: boolean }>`
  display: grid;
  grid-template-columns: 2fr 1fr 0.8fr 1fr 1fr 80px;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props =>
    props.$isEven ? props.theme.colors.background : 'transparent'};
  transition: all 0.2s ease;
  align-items: center;
  position: relative;
  overflow: visible;

  &:hover {
    background: ${props => props.theme.colors.primary}05;
  }

  @media (max-width: 1400px) {
    grid-template-columns: 2fr 0.9fr 0.7fr 0.9fr 0.9fr 70px;
    gap: 10px;
    padding: 16px 20px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 2fr 0.8fr 0.6fr 0.8fr 0.8fr 60px;
    gap: 8px;
    padding: 14px 16px;
  }

  @media (max-width: 768px) {
    display: block;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 16px;
    background: ${props => props.theme.colors.background};
    border: 1px solid ${props => props.theme.colors.border};
    border-bottom: none;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const TableCell = styled.div<{ $align?: 'left' | 'center' | 'right' }>`
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  text-align: ${props => props.$align || 'left'};
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    margin-bottom: 12px;
    font-weight: ${props => (props.$align === 'left' ? '600' : '400')};

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const MobileLabel = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  min-width: 100px;
  display: inline-block;

  @media (min-width: 769px) {
    display: none;
  }
`;

// User Info Components
export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px ${props => props.theme.colors.primary}30;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
`;

export const UserEmail = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

// Role Badge
export const RoleBadge = styled.span<{ $role: string }>`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    switch (props.$role) {
      case 'admin':
        return props.theme.mode === 'dark' ? '#78350f' : '#fef3c7';
      case 'master':
        return props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2';
      default:
        return props.theme.mode === 'dark' ? '#064e3b' : '#dcfce7';
    }
  }};
  color: ${props => {
    switch (props.$role) {
      case 'admin':
        return props.theme.mode === 'dark' ? '#fcd34d' : '#92400e';
      case 'master':
        return props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b';
      default:
        return props.theme.mode === 'dark' ? '#6ee7b7' : '#166534';
    }
  }};
`;

// Status Badge
export const StatusBadge = styled.span<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    switch (props.$status) {
      case 'active':
        return props.theme.mode === 'dark' ? '#064e3b' : '#dcfce7';
      case 'inactive':
        return props.theme.mode === 'dark' ? '#374151' : '#f3f4f6';
      default:
        return props.theme.mode === 'dark' ? '#374151' : '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'active':
        return props.theme.mode === 'dark' ? '#6ee7b7' : '#166534';
      case 'inactive':
        return props.theme.mode === 'dark' ? '#d1d5db' : '#374151';
      default:
        return props.theme.mode === 'dark' ? '#d1d5db' : '#374151';
    }
  }};
`;

// Action Buttons
export const UserActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: flex-end;
    margin-top: 16px;
  }
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  min-width: 36px;
  height: 36px;
  justify-content: center;

  ${props => {
    if (props.$variant === 'danger') {
      return `
        background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
        color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
        
        &:hover {
          background: ${props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};
          transform: scale(1.05);
        }
      `;
    } else if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;
        
        &:hover {
          background: ${props.theme.colors.primaryDark};
          transform: scale(1.05);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};
        
        &:hover {
          background: ${props.theme.colors.primary}10;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: scale(1.05);
        }
      `;
    }
  }}

  &:active {
    transform: scale(0.95);
  }
`;

// Empty State
export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 24px;
  opacity: 0.6;

  @media (max-width: 768px) {
    font-size: 3rem;
    margin-bottom: 20px;
  }
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const EmptyStateDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 20px;
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
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.colors.primary}35;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 0.9rem;
  }
`;

// Loading
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

// Pagination
export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  gap: 16px;

  @media (max-width: 768px) {
    margin-top: 24px;
    gap: 12px;
  }
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  min-width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => {
    if (props.$active) {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
        color: white;
        box-shadow: 0 4px 15px ${props.theme.colors.primary}25;
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 2px solid ${props.theme.colors.border};
        
        &:hover {
          background: ${props.theme.colors.primary}10;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${props.theme.colors.primary}15;
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  @media (max-width: 768px) {
    min-width: 40px;
    height: 40px;
    padding: 8px 12px;
    font-size: 0.9rem;
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
