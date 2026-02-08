import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 24px;
  width: 100%;
  overflow-x: visible; /* Permitir scroll horizontal quando necessário */

  @media (max-width: 1024px) {
    padding: 20px;
    overflow-x: visible;
  }

  @media (max-width: 768px) {
    padding: 16px 12px;
    overflow-x: visible;
  }

  @media (max-width: 480px) {
    padding: 12px 8px;
    overflow-x: visible;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    margin-bottom: 20px;
    padding-bottom: 16px;
    gap: 16px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 16px;
    padding-bottom: 12px;
    gap: 12px;
  }
`;

export const HeaderContent = styled.div`
  flex: 1;
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 1024px) {
    font-size: 2.2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
    gap: 10px;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    gap: 8px;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 1024px) {
    gap: 10px;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
    gap: 8px;
  }
`;

export const ViewModeToggle = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 4px;
  gap: 4px;
`;

export const ViewModeButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? '#ffffff' : theme.colors.textSecondary};
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primary : `${theme.colors.primary}15`};
    color: ${({ theme, $active }) =>
      $active ? '#ffffff' : theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
  }
`;

export const FilterButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}10`};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }

  svg {
    flex-shrink: 0;
  }
`;

export const FilterBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 14px;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 1024px) {
    padding: 18px;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    gap: 6px;
    border-radius: 8px;
  }
`;

export const StatLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 1024px) {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 1024px) {
    font-size: 24px;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const FiltersContainer = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    padding: 18px;
    margin-bottom: 20px;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 8px;
  }
`;

export const FiltersRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 12px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  transition: all 0.2s ease;

  @media (max-width: 1024px) {
    padding: 11px 14px 11px 42px;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    padding: 10px 12px 10px 40px;
    font-size: 12px;
    border-radius: 6px;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
`;

export const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;

  @media (max-width: 1024px) {
    padding: 11px 14px;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 12px;
    border-radius: 6px;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ClearFiltersButton = styled.button`
  padding: 12px 20px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

export const DocumentsTable = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 2fr 1fr 100px 120px 150px 150px 180px;
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 1200px) {
    display: none;
  }

  @media (max-width: 1024px) {
    padding: 14px 18px;
    font-size: 13px;
  }
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 40px 2fr 1fr 100px 120px 150px 150px 180px;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  align-items: center;
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}08`};
  }

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 20px;
  }

  @media (max-width: 1024px) {
    padding: 18px;
    gap: 10px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    gap: 8px;
  }
`;

export const TableCell = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 1200px) {
    white-space: normal;
  }

  @media (max-width: 1024px) {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const DocumentName = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const FileIcon = styled.span`
  font-size: 24px;
  flex-shrink: 0;
`;

export const DocumentInfo = styled.div`
  min-width: 0;
`;

export const DocumentTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DocumentDescription = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 4px;
`;

export const TypeBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background-color: ${({ theme }) => `${theme.colors.primary}20`};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

export const StatusBadge = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 4px 12px;
  background-color: ${({ $color }) => {
    const colors: Record<string, string> = {
      green: '#10b981',
      gray: '#6b7280',
      red: '#ef4444',
      orange: '#f59e0b',
      blue: '#3b82f6',
    };
    return `${colors[$color] || colors.gray}20`;
  }};
  color: ${({ $color }) => {
    const colors: Record<string, string> = {
      green: '#10b981',
      gray: '#6b7280',
      red: '#ef4444',
      orange: '#f59e0b',
      blue: '#3b82f6',
    };
    return colors[$color] || colors.gray;
  }};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  @media (max-width: 1200px) {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'success' | 'danger';
}>`
  padding: 8px 12px;
  background: ${({ theme, $variant }) => {
    if ($variant === 'success') return '#10b981';
    if ($variant === 'danger') return theme.colors.error;
    return theme.colors.backgroundSecondary;
  }};
  color: ${({ theme, $variant }) => ($variant ? 'white' : theme.colors.text)};
  border: ${({ theme, $variant }) =>
    $variant ? 'none' : `1px solid ${theme.colors.border}`};
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

export const BulkActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: ${({ theme }) => `${theme.colors.primary}10`};
  border-radius: 12px;
  margin-bottom: 16px;
`;

export const BulkText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

export const BulkButton = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
`;

export const PaginationButton = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PageInfo = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

export const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;

  @media (max-width: 1024px) {
    padding: 50px 18px;
  }

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;

  @media (max-width: 1024px) {
    font-size: 56px;
    margin-bottom: 14px;
  }

  @media (max-width: 768px) {
    font-size: 48px;
    margin-bottom: 12px;
  }
`;

export const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px 0;

  @media (max-width: 1024px) {
    font-size: 18px;
    margin: 0 0 6px 0;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    margin: 0 0 4px 0;
  }
`;

export const EmptyDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const LoadingContainer = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ErrorAlert = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: ${({ theme }) => `${theme.colors.error}15`};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: 12px;
  margin-bottom: 24px;
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: 14px;
  font-weight: 500;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

export const MobileCard = styled.div`
  display: none;

  @media (max-width: 1200px) {
    display: block;
  }
`;

export const MobileCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
`;

export const MobileCardDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
`;

export const MobileDetail = styled.div``;

export const MobileDetailLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 4px;
`;

export const MobileDetailValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;
