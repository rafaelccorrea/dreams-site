import styled from 'styled-components';

// Stats cards
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 16px;
  }
`;

export const StatCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
  }

  @media (max-width: 768px) {
    padding: 16px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    padding: 14px;
    gap: 6px;
  }
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StatValue = styled.div<{ $color?: string }>`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.$color || props.theme.colors.primary};
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${props => props.theme.colors.primary}15;
  border-radius: 12px;
  color: ${props => props.theme.colors.primary};
`;

export const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StatPercentage = styled.div<{ $color?: string }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.$color || props.theme.colors.textSecondary};
`;

// Usage bars
export const UsageSection = styled.div`
  display: grid;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    margin-bottom: 16px;
  }
`;

export const UsageCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;

  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 8px;
  }
`;

export const UsageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const UsageLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const UsageValues = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{
  $percentage: number;
  $status: 'success' | 'warning' | 'danger' | 'error';
}>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: ${props => {
    switch (props.$status) {
      case 'success':
        return props.theme.colors.success;
      case 'warning':
        return '#f59e0b';
      case 'danger':
        return '#fb923c';
      case 'error':
        return props.theme.colors.error;
      default:
        return props.theme.colors.primary;
    }
  }};
  transition: width 0.3s ease;
`;

// Table (para visão MASTER)
export const TableContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

export const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const Td = styled.td`
  padding: 16px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const UserEmail = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const StatusBadge = styled.span<{
  $status: 'active' | 'expired' | 'cancelled' | 'pending' | 'suspended';
}>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    switch (props.$status) {
      case 'active':
        return `${props.theme.colors.success}20`;
      case 'expired':
        return `${props.theme.colors.error}20`;
      case 'cancelled':
        return `${props.theme.colors.error}20`;
      case 'pending':
        return '#f59e0b20';
      case 'suspended':
        return '#f59e0b20';
      default:
        return props.theme.colors.backgroundSecondary;
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'active':
        return props.theme.colors.success;
      case 'expired':
        return props.theme.colors.error;
      case 'cancelled':
        return props.theme.colors.error;
      case 'pending':
        return '#f59e0b';
      case 'suspended':
        return '#f59e0b';
      default:
        return props.theme.colors.text;
    }
  }};
`;

// Pagination
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding: 16px;
`;

export const PaginationButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PaginationInfo = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

// Alerts
export const AlertsSection = styled.div`
  margin-bottom: 24px;
`;

export const Alert = styled.div<{ $type: 'warning' | 'error' | 'info' }>`
  padding: 12px 16px;
  border-radius: 12px;
  border-left: 4px solid
    ${props => {
      switch (props.$type) {
        case 'warning':
          return props.theme.mode === 'dark' ? '#fbbf24' : '#f59e0b';
        case 'error':
          return props.theme.mode === 'dark'
            ? '#f87171'
            : props.theme.colors.error;
        case 'info':
          return props.theme.mode === 'dark'
            ? '#60a5fa'
            : props.theme.colors.primary;
        default:
          return props.theme.colors.border;
      }
    }};
  background: ${props => {
    if (props.theme.mode === 'dark') {
      switch (props.$type) {
        case 'warning':
          return 'rgba(251, 191, 36, 0.15)';
        case 'error':
          return 'rgba(239, 68, 68, 0.15)';
        case 'info':
          return 'rgba(59, 130, 246, 0.15)';
        default:
          return 'rgba(148, 163, 184, 0.1)';
      }
    }
    switch (props.$type) {
      case 'warning':
        return '#f59e0b10';
      case 'error':
        return `${props.theme.colors.error}10`;
      case 'info':
        return `${props.theme.colors.primary}10`;
      default:
        return props.theme.colors.backgroundSecondary;
    }
  }};
  color: ${props =>
    props.theme.mode === 'dark'
      ? props.$type === 'info'
        ? '#cbd5e1'
        : props.theme.colors.text
      : props.theme.colors.text};
  font-size: 0.875rem;
  margin-bottom: 8px;
  border: ${props =>
    props.theme.mode === 'dark'
      ? `1px solid ${props.$type === 'info' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(148, 163, 184, 0.1)'}`
      : 'none'};

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.75rem;
    border-left-width: 3px;
  }
`;

// Modules Section
export const ModulesSection = styled.div`
  margin: 32px 0;
  padding: 24px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 1.125rem;
    margin-bottom: 14px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 12px;
  }
`;

export const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 10px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const ModuleChip = styled.div`
  padding: 8px 12px;
  background: ${props => props.theme.colors.primary}15;
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 6px;
  color: ${props => props.theme.colors.primary};
  font-size: 0.8125rem;
  font-weight: 500;
  text-align: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primary}25;
    border-color: ${props => props.theme.colors.primary}50;
  }
`;

export const UsageWarning = styled.div`
  margin-top: 8px;
  font-size: 0.75rem;
  color: #f59e0b;
  font-weight: 500;
`;

// Filter drawer components
export const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FilterLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FilterInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const FilterSelect = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.error};
    color: ${props => props.theme.colors.error};
    background: ${props => props.theme.colors.error}10;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
  }
`;

export const FilterBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    padding: 8px 14px;
    height: 38px;
    font-size: 0.875rem;
    gap: 6px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    height: 36px;
    font-size: 0.8125rem;
    gap: 4px;

    span {
      display: none;
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
`;

// Tabs for details page
export const Tabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 6px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    gap: 4px;
    margin-bottom: 16px;
  }
`;

export const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  cursor: pointer;
  font-weight: 600;
  border-bottom: 2px solid
    ${props => (props.$active ? props.theme.colors.primary : 'transparent')};
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.8125rem;
  }
`;

export const TabContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 20px;
    gap: 16px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    gap: 14px;
    border-radius: 8px;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Input = styled.input`
  padding: 12px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const Select = styled.select`
  padding: 12px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const Textarea = styled.textarea`
  padding: 12px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const InfoValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

export const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ModuleCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
  }

  input {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }

  span {
    font-size: 0.875rem;
    color: ${props => props.theme.colors.text};
    font-weight: 500;
  }
`;

export const LimitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const ActionCard = styled.div`
  padding: 20px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;

  @media (max-width: 768px) {
    padding: 18px;
    gap: 14px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    gap: 12px;
    border-radius: 8px;
  }
`;

export const ActionTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
  }
`;

export const ActionButton = styled.button<{
  $variant: 'primary' | 'success' | 'danger' | 'secondary' | 'warning';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    padding: 10px 18px;
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 0.8125rem;
    width: 100%;
  }

  background: ${props => {
    switch (props.$variant) {
      case 'success':
        return props.theme.colors.success;
      case 'danger':
        return props.theme.colors.error;
      case 'warning':
        return '#f59e0b';
      case 'secondary':
        return props.theme.colors.backgroundSecondary;
      default:
        return props.theme.colors.primary;
    }
  }};
  color: ${props =>
    props.$variant === 'secondary' ? props.theme.colors.text : 'white'};
  border: ${props =>
    props.$variant === 'secondary'
      ? `1px solid ${props.theme.colors.border}`
      : 'none'};

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Plan info components
export const PlanInfoCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
`;

export const PlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const PlanTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

export const PlanStatus = styled.span<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    switch (props.$status) {
      case 'active':
        return `${props.theme.colors.success}20`;
      case 'expired':
        return `${props.theme.colors.error}20`;
      case 'cancelled':
        return `${props.theme.colors.error}20`;
      case 'pending':
        return '#f59e0b20';
      case 'suspended':
        return '#f59e0b20';
      default:
        return props.theme.colors.backgroundSecondary;
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'active':
        return props.theme.colors.success;
      case 'expired':
        return props.theme.colors.error;
      case 'cancelled':
        return props.theme.colors.error;
      case 'pending':
        return '#f59e0b';
      case 'suspended':
        return '#f59e0b';
      default:
        return props.theme.colors.text;
    }
  }};
`;

export const PlanDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 16px;
  }
`;

export const PlanDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PlanDetailLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const PlanDetailValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const TrialBanner = styled.div`
  margin-bottom: 20px;
  padding: 16px 18px;
  border-radius: 12px;
  background: ${props => `${props.theme.colors.primary}12`};
  border: 1px solid ${props => `${props.theme.colors.primary}25`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 14px 16px;
    gap: 10px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px 14px;
    gap: 8px;
    margin-bottom: 14px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TrialBannerText = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8125rem;
    line-height: 1.4;
  }
`;

export const TrialBannerEmphasis = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

export const ModulesTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const ModuleTag = styled.span`
  padding: 6px 12px;
  background: ${props => props.theme.colors.primary}15;
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 6px;
  color: ${props => props.theme.colors.primary};
  font-size: 0.8125rem;
  font-weight: 500;
  text-align: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primary}25;
    border-color: ${props => props.theme.colors.primary}50;
  }
`;

export const PlansGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 14px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

export const SectionContainer = styled.div`
  margin-top: 32px;

  @media (max-width: 768px) {
    margin-top: 24px;
  }

  @media (max-width: 480px) {
    margin-top: 20px;
  }
`;

export const PlanBadge = styled.div<{ $type: 'popular' | 'custom' }>`
  position: absolute;
  top: -12px;
  right: 16px;
  background: ${props =>
    props.$type === 'popular'
      ? 'linear-gradient(135deg, #10b981, #059669)'
      : 'linear-gradient(135deg, #8b5cf6, #6366f1)'};
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  @media (max-width: 768px) {
    top: -10px;
    right: 12px;
    padding: 3px 10px;
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    top: -8px;
    right: 8px;
    padding: 2px 8px;
    font-size: 0.65rem;
    gap: 3px;
  }
`;

export const PlanPrice = styled.div`
  margin-bottom: 16px;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 1.375rem;
    margin-bottom: 14px;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 12px;
  }
`;

export const PlanDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
  margin-bottom: 16px;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
    margin-bottom: 14px;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin-bottom: 12px;
  }
`;

export const PlanFeature = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
    gap: 6px;
    margin-bottom: 5px;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    gap: 6px;
    margin-bottom: 4px;
  }
`;

export const PlanCurrentBadge = styled.span`
  margin-left: 8px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;

  @media (max-width: 480px) {
    display: block;
    margin-left: 0;
    margin-top: 4px;
    font-size: 0.7rem;
  }
`;
