import styled from 'styled-components';

// Layout Components
export const PageContainer = styled.div`
  padding: 8px 16px;
  width: 100%;
  min-height: calc(100vh - 100px);
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 8px 12px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
    margin-bottom: 20px;
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
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const PageSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-size: 1rem;

  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

// Filters Section
export const FiltersSection = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

export const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
`;

export const FilterInput = styled.input`
  padding: 10px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
  margin-top: 8px;

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.8125rem;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const FilterSelect = styled.select`
  padding: 10px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: border-color 0.2s;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.8125rem;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FilterBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${props => props.theme.colors.error || '#EF4444'};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
`;

// Stats Grid
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 20px;
  }
`;

export const StatCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

export const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
`;

export const StatIcon = styled.div<{ color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || props.theme.colors.primary}20;
  color: ${props => props.color || props.theme.colors.primary};
  font-size: 24px;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  word-break: break-word;
  overflow-wrap: break-word;
  min-width: 0;
  max-width: 100%;
  line-height: 1.2;

  @media (max-width: 1024px) {
    font-size: 1.75rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

// Charts Grid
export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 20px;
  }
`;

export const ChartCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

export const ChartTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  word-break: break-word;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 16px;
  }
`;

export const ChartContent = styled.div`
  height: 300px;
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 250px;
  }

  @media (max-width: 480px) {
    height: 200px;
  }
`;

// Tables
export const TableCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 24px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 16px;
  }

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }
`;

export const TableTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  background: ${props => props.theme.colors.background};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

export const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

// Opportunity Cards
export const OpportunitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 20px;
  }
`;

export const OpportunityCard = styled.div<{ level: 'high' | 'medium' | 'low' }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid
    ${props => {
      if (props.level === 'high') return '#10B981';
      if (props.level === 'medium') return '#F59E0B';
      return '#6B7280';
    }};
  border-left-width: 4px;
  transition: transform 0.2s;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
  }

  &:hover {
    transform: translateY(-2px);
  }
`;

export const OpportunityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const OpportunityTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const OpportunityScore = styled.div<{
  level: 'high' | 'medium' | 'low';
}>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => {
    if (props.level === 'high') return '#10B98120';
    if (props.level === 'medium') return '#F59E0B20';
    return '#6B728020';
  }};
  color: ${props => {
    if (props.level === 'high') return '#10B981';
    if (props.level === 'medium') return '#F59E0B';
    return '#6B7280';
  }};
`;

export const OpportunityStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
    margin-top: 12px;
  }
`;

export const OpportunityStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const OpportunityStatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const OpportunityStatValue = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

// Comparison Section
export const ComparisonSection = styled.div`
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const ComparisonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  width: 100%;
  box-sizing: border-box;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
  }
`;

export const ComparisonTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  word-break: break-word;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

export const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 20px;
  }
`;

export const ComparisonCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

export const ComparisonCardTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

// Empty State
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

export const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const EmptyStateDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

// Loading State
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  min-height: 400px;
`;

export const LoadingText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 16px;
  font-size: 0.875rem;
`;

// Error State
export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  min-height: 400px;
  text-align: center;
`;

export const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: #ef4444;
`;

export const ErrorTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const ErrorMessage = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 16px 0;
`;

export const RetryButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

// Badge
export const Badge = styled.span<{
  variant?: 'success' | 'warning' | 'info' | 'danger';
}>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.variant) {
      case 'success':
        return '#10B98120';
      case 'warning':
        return '#F59E0B20';
      case 'danger':
        return '#EF444420';
      default:
        return '#3B82F620';
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'danger':
        return '#EF4444';
      default:
        return '#3B82F6';
    }
  }};
`;

// Price Info Container
export const PriceInfoContainer = styled.div`
  margin-bottom: 20px;
  margin-top: 0;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    padding: 10px 12px;
    margin-bottom: 16px;
  }
`;

export const PriceInfoGrid = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  font-size: 0.875rem;
  width: 100%;

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    font-size: 0.8125rem;
  }
`;

// Comparison Input Container
export const ComparisonInputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const ComparisonInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;

  ${FilterSelect} {
    width: 100%;
  }
`;

export const ComparisonButtonWrapper = styled.div`
  display: flex;
  align-items: flex-end;

  @media (max-width: 768px) {
    width: 100%;

    ${FilterButton} {
      width: 100%;
    }
  }
`;

// Comparison Stats Container
export const ComparisonStatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    gap: 10px;
  }
`;
