import styled from 'styled-components';

export const ClientDetailsContainer = styled.div`
  width: 100%;
  min-height: 100%;
  background: ${props => props.theme.colors.background};
  transition: background-color 0.3s ease;
  position: relative;
  padding: 0;
`;

export const ClientDetailsHeader = styled.div`
  background: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 20px 0;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 16px 0;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    padding: 12px 0;
    margin-bottom: 16px;
  }
`;

export const ClientDetailsHeaderContent = styled.div`
  width: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
    padding: 0 12px;
  }

  @media (max-width: 480px) {
    padding: 0 8px;
    gap: 10px;
  }
`;

export const ClientDetailsActions = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const BackButton = styled.button`
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 10px 16px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 8px 14px;
    font-size: 13px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`;

export const ClientDetailsContent = styled.div`
  width: 100%;
  padding: 0 16px 24px 16px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (max-width: 768px) {
    padding: 0 12px 20px 12px;
    gap: 16px;
  }

  @media (max-width: 480px) {
    padding: 0 8px 16px 8px;
    gap: 12px;
  }
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const ClientCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 8px;
  }
`;

export const ClientHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    margin-bottom: 12px;
    padding-bottom: 10px;
  }
`;

export const ClientAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary},
    ${props => props.theme.colors.secondary}
  );
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
    font-size: 24px;
  }
`;

export const ClientInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ClientName = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const ClientBadges = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

export const ClientTypeBadge = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.$type) {
      case 'buyer':
        return '#10b98115';
      case 'seller':
        return '#3b82f615';
      case 'tenant':
        return '#f59e0b15';
      case 'landlord':
        return '#8b5cf615';
      default:
        return '#6b728015';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'buyer':
        return '#10b981';
      case 'seller':
        return '#3b82f6';
      case 'tenant':
        return '#f59e0b';
      case 'landlord':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  }};
  border: 1px solid
    ${props => {
      switch (props.$type) {
        case 'buyer':
          return '#10b98130';
        case 'seller':
          return '#3b82f630';
        case 'tenant':
          return '#f59e0b30';
        case 'landlord':
          return '#8b5cf630';
        default:
          return '#6b728030';
      }
    }};
`;

export const ClientStatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.$status) {
      case 'active':
        return '#10b98115';
      case 'inactive':
        return '#ef444415';
      case 'prospect':
        return '#f59e0b15';
      case 'closed':
        return '#6b728015';
      default:
        return '#6b728015';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#ef4444';
      case 'prospect':
        return '#f59e0b';
      case 'closed':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  }};
  border: 1px solid
    ${props => {
      switch (props.$status) {
        case 'active':
          return '#10b98130';
        case 'inactive':
          return '#ef444430';
        case 'prospect':
          return '#f59e0b30';
        case 'closed':
          return '#6b728030';
        default:
          return '#6b728030';
      }
    }};
`;

export const ClientContact = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 12px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;

  & > div {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
      text-decoration: underline;
      color: ${props => props.theme.colors.primaryDark};
    }
  }
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoValue = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

export const PreferencesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PreferenceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

export const PreferenceLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
`;

export const PreferenceValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const FeaturesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const FeatureTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary}30;
`;

export const SpouseCard = styled(ClientCard)`
  border-left: 4px solid ${props => props.theme.colors.accent};
`;

export const SpouseInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
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
  opacity: 0.5;
`;

export const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const EmptyDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  max-width: 400px;
`;

export const ActionButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
`;

export const LoadingText = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};
`;
