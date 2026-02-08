import styled from 'styled-components';
import { MdSearch, MdFilterList } from 'react-icons/md';
import type { OfferStatus } from '../../types/propertyOffer';

export const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

export const PageContent = styled.div`
  width: 100%;
  margin: 0;
  padding: 24px 32px;

  @media (max-width: 1024px) {
    padding: 24px;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const HeaderLeft = styled.div`
  flex: 1;
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const PageSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    transform: translateX(-4px);
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const SearchIcon = styled(MdSearch)`
  position: absolute;
  left: 14px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 20px;
  pointer-events: none;
`;

export const FiltersButton = styled.button<{ $hasActiveFilters?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid
    ${props =>
      props.$hasActiveFilters
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 8px;
  background: ${props =>
    props.$hasActiveFilters
      ? props.theme.colors.primary
      : props.theme.colors.backgroundSecondary};
  color: ${props =>
    props.$hasActiveFilters ? 'white' : props.theme.colors.text};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props =>
      props.$hasActiveFilters
        ? props.theme.colors.primary
        : props.theme.colors.border};
  }
`;

export const OffersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const OfferCard = styled.div<{ $status: OfferStatus }>`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => {
      switch (props.$status) {
        case 'pending':
          return '#F59E0B';
        case 'accepted':
          return '#10B981';
        case 'rejected':
          return '#EF4444';
        default:
          return '#6B7280';
      }
    }};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  flex: 1;
  line-height: 1.4;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const CardLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const CardValue = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  text-align: right;
`;

export const CardHighlight = styled(CardValue)`
  font-size: 1.25rem;
  color: #10b981;
  font-weight: 700;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const CardDate = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ViewButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => `${props.theme.colors.primary}4D`};
  }
`;

export const StatusBadge = styled.span<{ $status: OfferStatus }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;

  ${props => {
    switch (props.$status) {
      case 'pending':
        return `
          background: #FEF3C7;
          color: #92400E;
        `;
      case 'accepted':
        return `
          background: #D1FAE5;
          color: #065F46;
        `;
      case 'rejected':
        return `
          background: #FEE2E2;
          color: #991B1B;
        `;
      case 'withdrawn':
        return `
          background: #E5E7EB;
          color: #374151;
        `;
      default:
        return `
          background: #E5E7EB;
          color: #374151;
        `;
    }
  }}
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${props => props.theme.colors.text};
`;

export const EmptyStateDescription = styled.p`
  font-size: 0.875rem;
  margin: 0;
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;
