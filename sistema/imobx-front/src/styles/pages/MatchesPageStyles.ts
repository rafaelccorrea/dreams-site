import styled from 'styled-components';
import { PageTitle } from './ClientFormPageStyles';

// Styled Components que extendem PageTitle
export const TitleWithIcon = styled(PageTitle)`
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    color: ${props => props.theme.colors.primary};
    flex-shrink: 0;
  }
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const Tabs = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 0 24px;
  margin: 0 -24px;
  display: flex;
  gap: 2rem;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
`;

export const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 1rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  cursor: pointer;
  border-bottom: 2px solid
    ${props => (props.$active ? props.theme.colors.primary : 'transparent')};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

export const Badge = styled.span`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  min-width: 1.25rem;
  text-align: center;
`;

export const Content = styled.div`
  padding: 24px 0;
`;

export const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

export const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

export const EmptyText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  max-width: 500px;
`;

export const InfoFooter = styled.div`
  background: ${props => props.theme.colors.infoBackground};
  border-top: 1px solid ${props => props.theme.colors.infoBorder};
  padding: 1.5rem 24px;
  margin: 0 -24px -24px -24px;
`;

export const InfoText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.infoText};
  margin: 0;
  text-align: center;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props =>
      props.theme.colors.hoverBackground || props.theme.colors.cardBackground};
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const PropertyInfo = styled.div`
  margin-bottom: 24px;
`;

export const PropertyInfoCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const PropertyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;

  span {
    color: ${props => props.theme.colors.textSecondary};
    font-weight: 400;
    font-size: 14px;
  }
`;

export const PropertyDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

export const PropertyDetail = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;
