import styled from 'styled-components';
import { MdAdd, MdSettings, MdHistory, MdBarChart } from 'react-icons/md';

export const PageContainer = styled.div`
  padding: 0;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};

  @media (max-width: 1024px) {
    padding: 0;
  }

  @media (max-width: 768px) {
    padding: 0;
  }

  @media (max-width: 480px) {
    padding: 0;
  }
`;

export const PageContent = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
    padding-bottom: 10px;
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
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
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
    font-size: 0.95rem;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.theme.colors.primaryHover || props.theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const AutomationsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  width: 100%;
`;

export const AutomationCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }
`;

export const AutomationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
`;

export const AutomationIcon = styled.div`
  font-size: 2rem;
`;

export const AutomationTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const AutomationDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 2px 0 0 0;
  line-height: 1.4;
`;

export const AutomationBody = styled.div`
  display: flex;
  width: 100%;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const AutomationInfo = styled.div`
  flex: 1 1 240px;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AutomationRight = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    align-items: flex-start;
  }
`;

export const AutomationStatus = styled.div<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props =>
    props.$isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)'};
  color: ${props => (props.$isActive ? '#22c55e' : '#6b7280')};
`;

export const AutomationStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 2px;
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const AutomationActions = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  margin-top: 0;
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => {
    if (props.$variant === 'primary') {
      return props.theme.colors.primary;
    }
    if (props.$variant === 'danger') {
      return '#ef4444';
    }
    return props.theme.colors.cardBackground;
  }};
  color: ${props => {
    if (props.$variant === 'primary' || props.$variant === 'danger') {
      return 'white';
    }
    return props.theme.colors.text;
  }};

  &:hover {
    background: ${props => {
      if (props.$variant === 'primary') {
        return (
          props.theme.colors.primaryHover || props.theme.colors.primaryDark
        );
      }
      if (props.$variant === 'danger') {
        return '#dc2626';
      }
      return props.theme.colors.backgroundSecondary;
    }};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

export const MenuList = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  padding: 8px;
  min-width: 200px;
  z-index: 10;
`;

export const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  text-align: left;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}15;
    color: ${props => props.theme.colors.primary};
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
`;

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const EmptyStateDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  max-width: 500px;
`;

export const CategoryBadge = styled.span<{ $category: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.$category) {
      case 'financial':
        return 'rgba(239, 68, 68, 0.1)';
      case 'crm':
        return `${props.theme.colors.primary}1A`;
      case 'rental':
        return 'rgba(34, 197, 94, 0.1)';
      case 'process':
        return 'rgba(168, 85, 247, 0.1)';
      case 'marketing':
        return 'rgba(251, 191, 36, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.$category) {
      case 'financial':
        return '#ef4444';
      case 'crm':
        return props.theme.colors.primary;
      case 'rental':
        return '#22c55e';
      case 'process':
        return '#a855f7';
      case 'marketing':
        return '#fbbf24';
      default:
        return '#6b7280';
    }
  }};
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 64px;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
`;

export const ErrorTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.error || '#ef4444'};
  margin: 0 0 8px 0;
`;

export const ErrorMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
`;

export const ErrorButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.theme.colors.primaryHover || props.theme.colors.primaryDark};
  }
`;
