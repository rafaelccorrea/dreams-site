import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 32px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  width: 100%;

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
    gap: 24px;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    margin-bottom: 20px;
    padding-bottom: 16px;
    gap: 14px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 16px;
    padding-bottom: 12px;
    gap: 12px;
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

  @media (max-width: 1024px) {
    font-size: 2.2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
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
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8125rem;
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

  @media (max-width: 1024px) {
    padding: 14px 20px;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 12px 16px;
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 0.8125rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.colors.primary}35;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
    padding: 18px;
    margin-bottom: 20px;
    gap: 14px;
    border-radius: 14px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    margin-bottom: 16px;
    gap: 12px;
    border-radius: 12px;
  }
`;

export const LeftActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 1;
  min-width: 0;

  @media (max-width: 1024px) {
    gap: 14px;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
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

  @media (max-width: 1024px) {
    gap: 10px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const ViewToggle = styled.div`
  display: inline-flex;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  overflow: hidden;
`;

export const ViewToggleButton = styled.button<{ $active?: boolean }>`
  padding: 10px 14px;
  border: none;
  background: ${p => (p.$active ? p.theme.colors.primary : 'transparent')};
  color: ${p => (p.$active ? '#fff' : p.theme.colors.text)};
  font-weight: 600;
  cursor: pointer;
`;

export const AssetsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RowCell = styled.div`
  color: ${p => p.theme.colors.text};
  font-size: 0.95rem;

  @media (max-width: 1024px) {
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

export const RowActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const AssetRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  background: ${p => p.theme.colors.cardBackground};

  @media (max-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr auto;
    gap: 14px;
    padding: 14px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr auto;
    gap: 12px;
    padding: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 10px;

    ${RowCell}:not(:first-child) {
      display: none;
    }

    ${RowCell}:first-child {
      font-weight: 600;
      margin-bottom: 8px;
    }

    ${RowActions} {
      width: 100%;
      justify-content: flex-start;
      margin-top: 8px;
    }
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  min-width: 200px;

  @media (max-width: 1024px) {
    max-width: 350px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
    min-width: 0;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    padding: 11px 14px 11px 46px;
    font-size: 0.95rem;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    padding: 10px 12px 10px 44px;
    font-size: 0.9rem;
    border-radius: 8px;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
`;

export const FilterToggle = styled.button<{ $active?: boolean }>`
  padding: 12px 20px;
  border: 2px solid
    ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  background: ${props =>
    props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => (props.$active ? 'white' : props.theme.colors.text)};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 1024px) {
    padding: 11px 18px;
    font-size: 0.9rem;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.85rem;
    border-radius: 8px;
    flex: 1;
    justify-content: center;
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props =>
      props.$active
        ? props.theme.colors.primary
        : props.theme.colors.primary}10;
  }
`;

export const CounterBadge = styled.span`
  background: ${props => props.theme.colors.error};
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 8px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    gap: 16px;
    margin-bottom: 24px;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
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
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  @media (max-width: 1024px) {
    padding: 20px;
    border-radius: 14px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 1024px) {
    font-size: 0.8rem;
    margin-bottom: 6px;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    margin-bottom: 4px;
  }
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;

  @media (max-width: 1024px) {
    font-size: 1.75rem;
    margin-bottom: 3px;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 2px;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

export const StatHelp = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 1024px) {
    font-size: 0.7rem;
  }

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

export const AssetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const AssetCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 1024px) {
    padding: 20px;
    gap: 14px;
    border-radius: 14px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
    border-radius: 12px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const AssetCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

export const AssetCardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  flex: 1;

  @media (max-width: 1024px) {
    font-size: 1.15rem;
  }

  @media (max-width: 768px) {
    font-size: 1.05rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

export const AssetCardActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: ${props => {
    if (props.$variant === 'danger') return props.theme.colors.error + '15';
    if (props.$variant === 'secondary') return props.theme.colors.border;
    return props.theme.colors.primary + '15';
  }};
  color: ${props => {
    if (props.$variant === 'danger') return props.theme.colors.error;
    if (props.$variant === 'secondary') return props.theme.colors.text;
    return props.theme.colors.primary;
  }};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => {
      if (props.$variant === 'danger') return props.theme.colors.error + '25';
      if (props.$variant === 'secondary')
        return props.theme.colors.border + '80';
      return props.theme.colors.primary + '25';
    }};
    transform: scale(1.1);
  }
`;

export const AssetCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const AssetCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AssetCardBadges = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const AssetCardBadge = styled.span<{
  $variant?: 'success' | 'warning' | 'error' | 'info';
}>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    if (props.$variant === 'success') return '#10B981' + '15';
    if (props.$variant === 'warning') return '#F59E0B' + '15';
    if (props.$variant === 'error') return '#EF4444' + '15';
    return props.theme.colors.primary + '15';
  }};
  color: ${props => {
    if (props.$variant === 'success') return '#10B981';
    if (props.$variant === 'warning') return '#F59E0B';
    if (props.$variant === 'error') return '#EF4444';
    return props.theme.colors.primary;
  }};
`;

export const AssetCardDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

export const AssetCardDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 1024px) {
    gap: 10px;
    padding-top: 14px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding-top: 12px;
  }

  @media (max-width: 480px) {
    gap: 6px;
    padding-top: 10px;
  }
`;

export const AssetCardDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AssetCardDetailLabel = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const AssetCardDetailValue = styled.span`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  text-align: center;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 1024px) {
    padding: 56px 28px;
    border-radius: 14px;
  }

  @media (max-width: 768px) {
    padding: 48px 20px;
    border-radius: 12px;
  }
`;

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 24px;
  opacity: 0.5;

  @media (max-width: 1024px) {
    font-size: 3.5rem;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    font-size: 3rem;
    margin-bottom: 16px;
  }
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;

  @media (max-width: 1024px) {
    font-size: 1.3rem;
    margin: 0 0 10px 0;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin: 0 0 8px 0;
  }
`;

export const EmptyStateMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 32px 0;
  max-width: 400px;

  @media (max-width: 1024px) {
    font-size: 0.95rem;
    margin: 0 0 28px 0;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin: 0 0 24px 0;
    max-width: 100%;
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
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${props => props.theme.colors.primary}25;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.colors.primary}35;
  }
`;

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
  flex-wrap: wrap;
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 12px 16px;
  border: 2px solid
    ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  background: ${props =>
    props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => (props.$active ? 'white' : props.theme.colors.text)};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 44px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props =>
      props.$active
        ? props.theme.colors.primary
        : props.theme.colors.primary}10;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
