import styled from 'styled-components';

// Layout Components
export const PageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 24px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }

  @media (max-width: 360px) {
    padding: 10px;
  }
`;

export const PageContent = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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
  font-size: 2.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }

  @media (max-width: 360px) {
    font-size: 1.35rem;
  }
`;

export const PageSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    text-align: center;
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

// Summary Cards — layout moderno e responsivo
export const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }

  @media (max-width: 360px) {
    gap: 10px;
  }
`;

export const SummaryCard = styled.div<{
  $type?: 'total' | 'active' | 'inactive' | 'admin';
}>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 4px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.04)'
      : '0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)'};
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => {
      switch (props.$type) {
        case 'total':
          return 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)';
        case 'active':
          return 'linear-gradient(90deg, #10b981 0%, #34d399 100%)';
        case 'inactive':
          return 'linear-gradient(90deg, #64748b 0%, #94a3b8 100%)';
        case 'admin':
          return 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)';
        default:
          return 'linear-gradient(90deg, #64748b 0%, #94a3b8 100%)';
      }
    }};
    opacity: ${props => (props.theme.mode === 'dark' ? 0.9 : 1)};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props =>
      props.theme.mode === 'dark'
        ? '0 12px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)'
        : '0 12px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)'};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    padding: 20px;
    border-radius: 16px;
  }

  @media (max-width: 360px) {
    padding: 16px;
  }
`;

export const SummaryIcon = styled.div<{
  $type?: 'total' | 'active' | 'inactive' | 'admin';
}>`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  margin-bottom: 16px;
  background: ${props => {
    switch (props.$type) {
      case 'total':
        return 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)';
      case 'active':
        return 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
      case 'inactive':
        return 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)';
      case 'admin':
        return 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)';
      default:
        return 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)';
    }
  }};
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
    margin-bottom: 12px;
  }

  @media (max-width: 360px) {
    width: 44px;
    height: 44px;
    font-size: 1.1rem;
  }
`;

export const SummaryValue = styled.div`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
  line-height: 1.2;
  letter-spacing: -0.02em;

  @media (max-width: 600px) {
    font-size: 1.5rem;
    margin-bottom: 2px;
  }

  @media (max-width: 360px) {
    font-size: 1.35rem;
  }
`;

export const SummaryLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  line-height: 1.3;

  @media (max-width: 600px) {
    font-size: 0.85rem;
  }
`;

// Actions Bar — moderna e responsiva
export const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 4px 20px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.03)'
      : '0 2px 12px rgba(0,0,0,0.04)'};
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 14px 16px;
    margin-bottom: 20px;
    border-radius: 14px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    gap: 10px;
  }
`;

export const LeftActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    width: 100%;
    flex: none;
  }
`;

export const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: stretch;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  min-width: 260px;
  max-width: 400px;
  flex: 1;

  @media (max-width: 768px) {
    min-width: 0;
    max-width: none;
    width: 100%;
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
    min-width: 0;
    width: 100%;
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

// Users Table/Cards — card moderna e tabela responsiva
export const UsersCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 18px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 4px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.04)'
      : '0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)'};
  overflow: hidden;

  @media (max-width: 768px) {
    border-radius: 14px;
  }

  @media (max-width: 480px) {
    border-radius: 12px;
  }
`;

export const UsersTable = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (min-width: 769px) {
    min-width: 0;
  }

  @media (max-width: 768px) {
    padding: 12px 0 0 0;
  }

  @media (max-width: 480px) {
    padding: 8px 0 0 0;
  }
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(140px, 2fr) minmax(90px, 1fr) minmax(80px, 0.8fr) minmax(80px, 1fr) minmax(90px, 1fr) 80px;
  gap: 12px;
  padding: 18px 24px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;

  @media (max-width: 1400px) {
    grid-template-columns: minmax(120px, 2fr) minmax(80px, 0.9fr) minmax(70px, 0.7fr) minmax(70px, 0.9fr) minmax(80px, 0.9fr) 70px;
    gap: 10px;
    padding: 16px 20px;
    font-size: 0.85rem;
  }

  @media (max-width: 1024px) {
    grid-template-columns: minmax(100px, 2fr) minmax(70px, 0.8fr) minmax(60px, 0.6fr) minmax(60px, 0.8fr) minmax(70px, 0.8fr) 60px;
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
  grid-template-columns: minmax(140px, 2fr) minmax(90px, 1fr) minmax(80px, 0.8fr) minmax(80px, 1fr) minmax(90px, 1fr) 80px;
  gap: 12px;
  padding: 18px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props =>
    props.$isEven ? props.theme.colors.background : 'transparent'};
  transition: background 0.2s ease;
  align-items: center;
  position: relative;
  min-width: 0;

  &:hover {
    background: ${props => props.theme.colors.primary}08;
  }

  @media (max-width: 1400px) {
    grid-template-columns: minmax(120px, 2fr) minmax(80px, 0.9fr) minmax(70px, 0.7fr) minmax(70px, 0.9fr) minmax(80px, 0.9fr) 70px;
    gap: 10px;
    padding: 16px 20px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: minmax(100px, 2fr) minmax(70px, 0.8fr) minmax(60px, 0.6fr) minmax(60px, 0.8fr) minmax(70px, 0.8fr) 60px;
    gap: 8px;
    padding: 14px 16px;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
    margin: 0 12px 12px 12px;
    background: ${props => props.theme.colors.background};
    border: 1px solid ${props => props.theme.colors.border};

    &:last-child {
      margin-bottom: 12px;
    }
  }

  @media (max-width: 480px) {
    padding: 14px;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 8px;
    gap: 10px;

    &:last-child {
      margin-bottom: 8px;
    }
  }
`;

export const TableCell = styled.div<{ $align?: 'left' | 'center' | 'right' }>`
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  text-align: ${props => props.$align || 'left'};
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    margin-bottom: 12px;
    font-weight: ${props => (props.$align === 'left' ? '600' : '400')};
    overflow: visible;

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

// User Info Components — truncam para manter colunas alinhadas
export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  overflow: hidden;
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  min-width: 40px;
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
  font-size: 0.85rem;
  box-shadow: 0 2px 8px ${props => props.theme.colors.primary}30;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
`;

export const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const UserEmail = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Role Badge — não expande a coluna
export const RoleBadge = styled.span<{ $role: string }>`
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: inline-block;
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

// Status Badge — não expande a coluna
export const StatusBadge = styled.span<{ $status: string }>`
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: inline-block;
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

// Action Buttons — largura fixa para alinhar coluna
export const UserActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  min-width: 0;

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

// Empty State — responsivo
export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 768px) {
    padding: 32px 16px;
  }

  @media (max-width: 480px) {
    padding: 24px 12px;
  }
`;

export const EmptyStateIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 20px;
  opacity: 0.7;

  @media (max-width: 768px) {
    font-size: 2.75rem;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 2.25rem;
    margin-bottom: 12px;
  }
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.35rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 10px 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const EmptyStateDescription = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 20px 0;
  line-height: 1.5;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 14px;
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

// Pagination — responsiva
export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 24px;
  gap: 10px;
  padding: 0 8px;

  @media (max-width: 768px) {
    margin-top: 20px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    margin-top: 16px;
    gap: 6px;
  }
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => {
    if (props.$active) {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
        color: white;
        box-shadow: 0 2px 12px ${props.theme.colors.primary}30;
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.primary}12;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    min-width: 36px;
    height: 36px;
    padding: 8px 10px;
    font-size: 0.85rem;
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
