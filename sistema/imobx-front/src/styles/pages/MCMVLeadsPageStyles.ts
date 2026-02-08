import styled from 'styled-components';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageSubtitle,
  PageTitle,
} from './ClientFormPageStyles';

export {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageSubtitle,
  PageTitle,
};

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 8px 14px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 12px;
    flex: 1;
    justify-content: center;
  }
`;

export const Tabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    margin-bottom: 16px;
    gap: 4px;
  }

  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

export const Tab = styled.button<{ $active?: boolean }>`
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid
    ${props => (props.$active ? props.theme.colors.primary : 'transparent')};
  color: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  font-weight: ${props => (props.$active ? '600' : '400')};
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`;

export const Badge = styled.span`
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
`;

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const LeadsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  padding: 16px 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
    padding: 12px 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 8px 0;
  }
`;

export const LeadCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 8px;
  }
`;

export const LeadHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
  gap: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 10px;
  }
`;

export const LeadName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 15px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    width: 100%;
  }
`;

export const ScoreBadge = styled.span<{ $score: number }>`
  background: ${props => {
    if (props.$score >= 80) return '#10b981';
    if (props.$score >= 60) return '#f59e0b';
    return '#ef4444';
  }};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

export const LeadInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;

  @media (max-width: 480px) {
    gap: 5px;
    margin-bottom: 10px;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 480px) {
    font-size: 12px;
    gap: 5px;
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.$status) {
      case 'new':
        return '#3b82f6';
      case 'contacted':
        return '#8b5cf6';
      case 'qualified':
        return '#10b981';
      case 'converted':
        return '#059669';
      case 'lost':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }};
  color: white;
`;

export const LeadActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 6px;
    margin-top: 10px;
    padding-top: 10px;
  }
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary';
}>`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    &:hover {
      opacity: 0.9;
    }
  `
      : `
    background: ${props.theme.colors.cardBackground};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    &:hover {
      background: ${props.theme.colors.background};
    }
  `}

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 10px;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

export const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const EmptyText = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 10px;
    margin-top: 16px;
    padding-top: 16px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
  }
`;

export const PaginationButton = styled.button<{ $disabled?: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props =>
    props.$disabled
      ? props.theme.colors.background
      : props.theme.colors.cardBackground};
  color: ${props =>
    props.$disabled
      ? props.theme.colors.textSecondary
      : props.theme.colors.text};
  border-radius: 8px;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  font-weight: 500;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;
