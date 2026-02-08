import styled from 'styled-components';
import { MdSearch } from 'react-icons/md';

export const PageContainer = styled.div`
  padding: 24px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
  width: 100%;
`;

export const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  width: 100%;
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props =>
      props.theme.colors.primaryDark || props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}40;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

export const ButtonsGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
  max-width: 500px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 1rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const SearchIcon = styled(MdSearch)`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

export const TableContainer = styled.div`
  position: relative;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: visible;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-width: 100%;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 1200px; /* Largura mínima para garantir scroll horizontal */
  border-collapse: collapse;

  @media (max-width: 1024px) {
    min-width: 1000px; /* Largura mínima menor em tablets */
  }

  @media (max-width: 768px) {
    min-width: 900px; /* Largura mínima menor em mobile */
  }
`;

export const TableHead = styled.thead`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s;
  background: ${props => props.theme.colors.cardBackground};

  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeader = styled.th<{ $width?: string; $maxWidth?: string }>`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  ${props => props.$width && `width: ${props.$width};`}
  ${props => props.$maxWidth && `max-width: ${props.$maxWidth};`}
  
  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 11px;
    letter-spacing: 0.3px;
  }
`;

export const TableCell = styled.td<{ $width?: string; $maxWidth?: string }>`
  padding: 16px;
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  vertical-align: middle;
  white-space: nowrap;
  ${props => props.$width && `width: ${props.$width};`}
  ${props => props.$maxWidth && `max-width: ${props.$maxWidth};`}
  
  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 13px;
  }
`;

export const ActionsCell = styled(TableCell)`
  position: relative;
  min-width: 60px;
  width: 60px;
  background: ${props => props.theme.colors.cardBackground};

  @media (max-width: 768px) {
    position: sticky;
    right: 0;
    z-index: 3;
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 600;

  ${props => {
    const statusColors: Record<string, string> = {
      scheduled: 'background: #3b82f620; color: #3b82f6;',
      in_progress: 'background: #f59e0b20; color: #f59e0b;',
      completed: 'background: #10b98120; color: #10b981;',
      cancelled: 'background: #ef444420; color: #ef4444;',
      pending_approval: 'background: #f59e0b20; color: #f59e0b;',
      approved: 'background: #10b98120; color: #10b981;',
      rejected: 'background: #ef444420; color: #ef4444;',
    };
    return (
      statusColors[props.$status] || 'background: #6b728020; color: #6b7280;'
    );
  }}
`;

export const TypeBadge = styled.span<{ $type: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;

  ${props => {
    const typeColors: Record<string, string> = {
      entry:
        'background: #3b82f615; color: #3b82f6; border: 1px solid #3b82f630;',
      exit: 'background: #ef444415; color: #ef4444; border: 1px solid #ef444430;',
      maintenance:
        'background: #f59e0b15; color: #f59e0b; border: 1px solid #f59e0b30;',
      sale: 'background: #10b98115; color: #10b981; border: 1px solid #10b98130;',
    };
    return (
      typeColors[props.$type] ||
      'background: #6b728015; color: #6b7280; border: 1px solid #6b728030;'
    );
  }}
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionsMenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const MenuButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid
    ${props =>
      props.$isOpen
        ? `${props.theme.colors.primary}40`
        : props.theme.colors.border};
  border-radius: 8px;
  background: ${props =>
    props.$isOpen
      ? `${props.theme.colors.primary}15`
      : props.theme.colors.background};
  color: ${props =>
    props.$isOpen ? props.theme.colors.primary : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  ${props =>
    props.$isOpen &&
    `
    box-shadow: 0 0 0 2px ${props.theme.colors.primary}20;
  `}

  &:hover {
    background: ${props =>
      props.$isOpen
        ? `${props.theme.colors.primary}25`
        : props.theme.colors.backgroundSecondary};
    border-color: ${props => `${props.theme.colors.primary}60`};
    color: ${props =>
      props.$isOpen ? props.theme.colors.primary : props.theme.colors.text};
    transform: ${props => (props.$isOpen ? 'scale(1.05)' : 'none')};
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const MenuDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: ${props =>
    props.theme.colors.surface || props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  min-width: 200px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  pointer-events: auto;

  /* Prevenir que cliques dentro do dropdown fechem o menu */
  & > * {
    pointer-events: auto;
  }
`;

export const MenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${props =>
    props.$danger ? props.theme.colors.error : props.theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  pointer-events: auto;

  &:hover:not(:disabled) {
    background: ${props =>
      props.$danger
        ? `${props.theme.colors.error}15`
        : `${props.theme.colors.primary}15`};
    color: ${props =>
      props.$danger ? props.theme.colors.error : props.theme.colors.primary};
    transform: translateX(2px);
  }

  &:active:not(:disabled) {
    transform: scale(0.98) translateX(2px);
    background: ${props =>
      props.$danger
        ? `${props.theme.colors.error}25`
        : `${props.theme.colors.primary}25`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  &:hover:not(:disabled) svg {
    transform: scale(1.1);
    color: ${props =>
      props.$danger ? props.theme.colors.error : props.theme.colors.primary};
  }
`;

export const MenuDivider = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: 4px 0;
`;

export const ActionButton = styled.button<{
  $variant?: 'view' | 'edit' | 'delete';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  ${props => {
    if (props.$variant === 'view') {
      return `
        background: ${props.theme.colors.primary}20;
        color: ${props.theme.colors.primary};
        &:hover { 
          background: ${props.theme.colors.primary}; 
          color: ${props.theme.colors.cardBackground}; 
        }
      `;
    } else if (props.$variant === 'edit') {
      return `
        background: ${props.theme.colors.warning}20;
        color: ${props.theme.colors.warning};
        &:hover { 
          background: ${props.theme.colors.warning}; 
          color: ${props.theme.colors.cardBackground}; 
        }
      `;
    } else if (props.$variant === 'delete') {
      return `
        background: ${props.theme.colors.error}20;
        color: ${props.theme.colors.error};
        &:hover { 
          background: ${props.theme.colors.error}; 
          color: ${props.theme.colors.cardBackground}; 
        }
      `;
    }
  }}

  &:active {
    transform: scale(0.95);
  }
`;

export const ScrollIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.background};
  border-top: 1px solid ${props => props.theme.colors.border};
  border-radius: 0 0 12px 12px;
  text-align: center;
  font-weight: 500;

  @media (min-width: 1201px) {
    display: none;
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 6px;
  }
`;

export const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

export const EmptyText = styled.div`
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

export const EmptyDescription = styled.div`
  font-size: 0.9375rem;
  margin-bottom: 24px;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const PaginationInfo = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const PaginationButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const PropertyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const TitleInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
`;

export const PropertyAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  flex-shrink: 0;
`;

export const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PropertyPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 20px;
`;

export const PropertyDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const PropertyTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;

  @media (max-width: 768px) {
    max-width: 180px;
  }
`;

export const PropertySubtitle = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  min-height: 40px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-left: auto;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  box-sizing: border-box;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}30;
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 20px;
  }
`;
