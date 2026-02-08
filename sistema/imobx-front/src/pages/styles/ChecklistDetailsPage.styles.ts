import styled from 'styled-components';
import type { ItemStatus } from '../../types/checklist.types';

export const PageContainer = styled.div`
  padding: 32px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.938rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    transform: translateY(-1px);
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button<{ $variant?: 'primary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props =>
    props.$variant === 'danger'
      ? 'rgba(239, 68, 68, 0.1)'
      : props.$variant === 'primary'
        ? props.theme.colors.primary
        : props.theme.colors.surface};
  border: 1px solid
    ${props =>
      props.$variant === 'danger'
        ? '#ef4444'
        : props.$variant === 'primary'
          ? props.theme.colors.primary
          : props.theme.colors.border};
  border-radius: 8px;
  color: ${props =>
    props.$variant === 'danger'
      ? '#ef4444'
      : props.$variant === 'primary'
        ? 'white'
        : props.theme.colors.text};
  font-size: 0.938rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const InfoValue = styled.span`
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

export const Badge = styled.span<{
  $type?: 'sale' | 'rental';
  $status?: string;
}>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    if (props.$type) {
      return props.$type === 'sale'
        ? 'rgba(239, 68, 68, 0.1)'
        : 'rgba(59, 130, 246, 0.1)';
    }
    if (props.$status) {
      switch (props.$status) {
        case 'completed':
          return 'rgba(16, 185, 129, 0.1)';
        case 'in_progress':
          return 'rgba(59, 130, 246, 0.1)';
        case 'skipped':
          return 'rgba(245, 158, 11, 0.1)';
        default:
          return 'rgba(107, 114, 128, 0.1)';
      }
    }
    return 'rgba(107, 114, 128, 0.1)';
  }};
  color: ${props => {
    if (props.$type) {
      return props.$type === 'sale' ? '#ef4444' : '#3b82f6';
    }
    if (props.$status) {
      switch (props.$status) {
        case 'completed':
          return '#10b981';
        case 'in_progress':
          return '#3b82f6';
        case 'skipped':
          return '#f59e0b';
        default:
          return '#6b7280';
      }
    }
    return '#6b7280';
  }};
`;

export const ProgressSection = styled.div`
  margin-bottom: 24px;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${props => props.theme.colors.border};
  border-radius: 6px;
  overflow: hidden;
  margin: 12px 0;
`;

export const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  transition: width 0.3s ease;
`;

export const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.938rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ItemCard = styled.div<{ $status: ItemStatus }>`
  background: ${props => props.theme.colors.background};
  border: 2px solid
    ${props => {
      switch (props.$status) {
        case 'completed':
          return 'rgba(16, 185, 129, 0.3)';
        case 'in_progress':
          return 'rgba(59, 130, 246, 0.3)';
        case 'skipped':
          return 'rgba(245, 158, 11, 0.3)';
        default:
          return props.theme.colors.border;
      }
    }};
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
`;

export const ItemTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  flex: 1;
`;

export const ItemStatusSelect = styled.select`
  padding: 6px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;
  min-width: 140px;
`;

export const ItemDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
`;

export const ItemMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 12px;
`;

export const DocumentsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 12px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DocumentItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: ${props => props.theme.colors.background};
  border-radius: 6px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

export const NotesSection = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const NotesText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  margin: 0;
  white-space: pre-wrap;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

export const ErrorContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;
