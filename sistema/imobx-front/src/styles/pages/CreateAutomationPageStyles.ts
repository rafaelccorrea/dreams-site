import styled from 'styled-components';
import {
  PageContainer,
  PageContent,
  PageHeader,
} from './AutomationsPageStyles';

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

export const StyledPageContainer = styled(PageContainer)`
  padding: 0 !important;
  margin: 0 !important;
`;

export const StyledPageContent = styled(PageContent)`
  padding: 0 !important;
  margin: 0 !important;
`;

export const StyledPageHeader = styled(PageHeader)`
  margin: 0 !important;
  padding: 0 !important;
  padding-bottom: 12px !important;
  border-bottom: none !important;
`;

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
`;

export const TemplateCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.07);
  }
`;

export const TemplateHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const TemplateTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text};
`;

export const Badge = styled.span<{
  $variant?: 'process' | 'financial' | 'crm' | 'rental' | 'marketing';
}>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$variant) {
      case 'financial':
        return 'rgba(239, 68, 68, 0.12)';
      case 'crm':
        return `${props.theme.colors.primary}1F`;
      case 'rental':
        return 'rgba(34, 197, 94, 0.12)';
      case 'process':
        return 'rgba(168, 85, 247, 0.12)';
      case 'marketing':
        return 'rgba(251, 191, 36, 0.15)';
      default:
        return 'rgba(107, 114, 128, 0.12)';
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'financial':
        return '#ef4444';
      case 'crm':
        return props.theme.colors.primary;
      case 'rental':
        return '#22c55e';
      case 'process':
        return '#a855f7';
      case 'marketing':
        return '#d97706';
      default:
        return '#6b7280';
    }
  }};
`;

export const TemplateDescription = styled.p`
  margin: 2px 0 0 0;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const MetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
`;

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: auto;
`;

export const PrimaryButton = styled.button`
  padding: 10px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.theme.colors.primaryHover || props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }
`;

export const FullBleed = styled.div`
  position: relative;
  width: calc(100% + 48px);
  margin-left: -24px;
  margin-right: -24px;
  margin-top: -24px;
  margin-bottom: -24px;
  padding: 24px;

  @media (max-width: 1024px) {
    width: calc(100% + 40px);
    margin-left: -20px;
    margin-right: -20px;
    margin-top: -20px;
    margin-bottom: -20px;
    padding: 20px;
  }

  @media (max-width: 768px) {
    width: calc(100% + 32px);
    margin-left: -16px;
    margin-right: -16px;
    margin-top: -16px;
    margin-bottom: -16px;
    padding: 16px;
  }

  @media (max-width: 480px) {
    width: calc(100% + 24px);
    margin-left: -12px;
    margin-right: -12px;
    margin-top: -14px;
    margin-bottom: -14px;
    padding: 14px 12px;
  }
`;

export const Shimmer = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  width: 100%;
  height: 16px;
  border-radius: 6px;

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
`;

export const ShimmerCard = styled(TemplateCard)`
  flex-direction: column;
  gap: 10px;
`;

export const ShimmerRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Placeholder = styled.div`
  padding: 16px 12px;
  border: 1px dashed ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
  font-size: 0.95rem;
`;
