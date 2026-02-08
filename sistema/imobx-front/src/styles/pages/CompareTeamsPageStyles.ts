import styled from 'styled-components';

export const Container = styled.div`
  padding: 32px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  max-width: 1600px;
  margin: 0 auto;

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

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const HeaderRight = styled.div`
  margin-left: 2rem;
`;

export const Title = styled.h1`
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

export const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.25rem;
  }
`;

export const FiltersSection = styled.div`
  padding: 24px;
  margin-bottom: 32px;
  background: ${props =>
    props.theme.colors.surface || props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    margin-bottom: 20px;
  }
`;

export const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: end;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 24px;
  background: transparent;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
`;

export const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const EmptyText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 60px 24px;
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ResultsSection = styled.div`
  margin-top: 32px;
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 768px) {
    margin-top: 24px;
    gap: 24px;
  }

  @media (max-width: 480px) {
    margin-top: 20px;
    gap: 20px;
  }
`;

export const FilterRowTwoCols = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FilterRowThreeCols = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Input = styled.input`
  padding: 10px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const Select = styled.select`
  padding: 10px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const PriceInput = styled.input`
  padding: 10px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const StatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 32px;
  background: transparent;

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    background: transparent;
  }

  th {
    background: transparent;
    color: ${props => props.theme.colors.text};
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    color: ${props => props.theme.colors.text};
    font-size: 0.95rem;
  }

  tbody tr:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: 10px 12px;
      font-size: 0.875rem;
    }
  }

  @media (max-width: 480px) {
    th,
    td {
      padding: 8px 10px;
      font-size: 0.8125rem;
    }
  }
`;

export const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 24px;
  background: transparent;

  th,
  td {
    padding: 14px 16px;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    background: transparent;
  }

  th {
    background: ${props => props.theme.colors.primary};
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  th:first-child {
    position: sticky;
    left: 0;
    z-index: 11;
    background: ${props => props.theme.colors.primary};
  }

  td {
    color: ${props => props.theme.colors.text};
    font-size: 0.95rem;
  }

  td:first-child {
    font-weight: 600;
    color: ${props => props.theme.colors.textSecondary};
    background: transparent;
    position: sticky;
    left: 0;
    z-index: 9;
  }

  tbody tr:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    th,
    td {
      padding: 12px 14px;
      font-size: 0.875rem;
      white-space: nowrap;
    }

    th:first-child,
    td:first-child {
      position: static;
    }
  }

  @media (max-width: 480px) {
    th,
    td {
      padding: 10px 12px;
      font-size: 0.8125rem;
    }
  }
`;

export const TeamHeaderCell = styled.th`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px !important;

  @media (max-width: 768px) {
    padding: 12px 14px !important;
    gap: 8px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px !important;
    gap: 6px;
  }
`;

export const TeamIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
`;

export const TeamName = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: white;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

export const MetricValue = styled.td<{ $highlight?: boolean }>`
  font-weight: 700;
  color: ${props =>
    props.$highlight
      ? props.theme.colors.primary
      : props.theme.colors.text} !important;
`;

export const PeriodBadge = styled.div`
  background: transparent;
  border: none;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  border-radius: 0;
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
`;

export const Divider = styled.div`
  border-top: 1px solid ${props => props.theme.colors.border || '#e0e0e0'};
  margin-top: 12px;
  padding-top: 12px;
`;

export const SectionTitle = styled.div`
  margin-bottom: 8px;
  font-weight: 600;
  color: ${props => props.theme.colors.text || '#333'};
  font-size: 0.9rem;
`;

export const MemberCard = styled.div`
  margin-bottom: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.background || '#fff'};
  border: 1px solid ${props => props.theme.colors.border || '#e0e0e0'};
  border-radius: 8px;
  font-size: 0.85rem;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.primary || '#3B82F6'};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const MemberName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text || '#333'};
  margin-bottom: 8px;
`;

export const MemberStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
  margin-top: 8px;
`;

export const MemberStatItem = styled.div`
  color: ${props => props.theme.colors.textSecondary || '#666'};
  font-size: 0.8rem;
`;

export const MemberStatLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary || '#999'};
  font-weight: 500;
`;

export const MemberStatValue = styled.span`
  color: ${props => props.theme.colors.text || '#333'};
  font-weight: 600;
`;

export const MetricRowSmall = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.85rem;
`;

export const MetricLabelSmall = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary || '#666'};
  margin-left: 16px;
`;

export const MetricValueSmall = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text || '#333'};
`;

export const ComparisonContainer = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    margin-top: 24px;
    gap: 20px;
  }

  @media (max-width: 480px) {
    margin-top: 20px;
    gap: 16px;
  }
`;

export const ComparisonTitle = styled.h3`
  margin-bottom: 20px;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text || '#333'};
`;

export const ComparisonCard = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background: ${props =>
    props.theme.colors.surface || props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 12px;
  }
`;

export const ComparisonCardTitle = styled.h4`
  margin-bottom: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text || '#333'};
`;

export const ComparisonMetricGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 150px;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border || '#e0e0e0'};

  &:last-child {
    border-bottom: none;
  }
`;

export const ComparisonTeamNameContainer = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text || '#333'};
`;

export const ComparisonValueContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
`;

export const ComparisonValue = styled.span<{ $isWinner?: boolean }>`
  font-weight: 600;
  color: ${props =>
    props.$isWinner
      ? '#10b981'
      : props.theme.colors.textSecondary || '#6b7280'};
`;

export const BestTeamContainer = styled.div`
  margin-top: 32px;
  padding: 24px;
  background: ${props =>
    props.theme.colors.surface || props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    padding: 20px;
    margin-top: 24px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    margin-top: 20px;
  }
`;

export const BestTeamTitle = styled.h3`
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const BestTeamCard = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 14px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 10px;
  }
`;
